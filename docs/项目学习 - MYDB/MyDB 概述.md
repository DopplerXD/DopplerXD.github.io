# MYDB 架构设计文档

## 一、项目概述

> 仓库地址 https://github.com/senshinya/MYDB （参考了 go 实现的建议数据库 https://github.com/qw4990/NYADB2）
> 教程地址 https://shinya.click/projects/mydb/mydb0/
> 学习心得 https://wx.zsxq.com/group/15522885221412/topic/8855284811814882
> 简历写法 https://articles.zsxq.com/id_gsuoxn7qnvip.html

MYDB 是一个 Java 实现的简易数据库，参照 MySQL、PostgreSQL 和 SQLite 的部分原理设计。项目共约 65 个 Java 源文件，实现了以下核心功能：

- 数据可靠性与恢复
- 两段锁协议（2PL）实现可串行化调度
- MVCC（多版本并发控制）
- 两种事务隔离级别（读提交、可重复读）
- 死锁检测与处理
- 表和字段管理
- 简单的 SQL 解析
- 基于 Socket 的客户端/服务器架构

---

## 二、整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (客户端)                          │
│    Launcher -> Shell -> Client -> RoundTripper -> Packager      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Socket 通信
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Server (服务端)                           │
│   Server -> HandleSocket -> Executor -> Parser                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TBM (Table Manager) 表管理层                   │
│         TableManager -> Table -> Field -> BPlusTree             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VM (Version Manager) 版本管理层               │
│     VersionManager -> Entry -> LockTable -> Visibility          │
│                      (MVCC + 2PL + 死锁检测)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DM (Data Manager) 数据管理层                   │
│    DataManager -> PageCache -> Page -> DataItem -> Logger       │
│                  (页面缓存 + 数据项 + 日志恢复)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 TM (Transaction Manager) 事务管理层               │
│              TransactionManager (事务状态管理)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、核心模块详解

### 3.1 事务管理器 (TM - Transaction Manager)

**位置**: `backend/tm/`

**职责**: 管理事务的状态（活跃、已提交、已回滚）

**核心文件**:
| 文件 | 说明 |
|------|------|
| `TransactionManager.java` | 接口定义 |
| `TransactionManagerImpl.java` | 实现类 |

**关键设计**:
- 使用 `.xid` 文件存储事务状态
- 每个事务占用 1 字节，存储三种状态：`ACTIVE(0)`, `COMMITTED(1)`, `ABORTED(2)`
- 文件头 8 字节存储事务计数器
- 超级事务 `SUPER_XID=0` 永远处于提交状态

```
.xid 文件结构:
┌────────────┬────────┬────────┬────────┬─────┐
│ XID Counter│ XID=1  │ XID=2  │ XID=3  │ ... │
│  (8 bytes) │(1 byte)│(1 byte)│(1 byte)│     │
└────────────┴────────┴────────┴────────┴─────┘
```

---

### 3.2 数据管理器 (DM - Data Manager)

**位置**: `backend/dm/`

**职责**: 管理数据在磁盘上的持久化、页面缓存、日志记录与恢复

**子模块结构**:
```
dm/
├── DataManager.java        # 接口
├── DataManagerImpl.java    # 实现
├── Recover.java            # 恢复逻辑
├── dataItem/               # 数据项
│   ├── DataItem.java
│   └── DataItemImpl.java
├── logger/                 # 日志
│   ├── Logger.java
│   └── LoggerImpl.java
├── page/                   # 页面
│   ├── Page.java
│   ├── PageOne.java        # 特殊页面(校验)
│   └── PageX.java          # 普通数据页面
├── pageCache/              # 页面缓存
│   ├── PageCache.java
│   └── PageCacheImpl.java
└── pageIndex/              # 页面索引(空闲空间)
    ├── PageIndex.java
    └── PageInfo.java
```

**关键设计**:

1. **页面结构**:
   - 页面大小: 8KB (`PAGE_SIZE = 1 << 13`)
   - PageOne: 第一页，存储校验信息用于数据库完整性检查
   - PageX: 数据页面，维护空闲空间和槽位

2. **DataItem 结构**:
```
┌──────────┬──────────┬──────────┬─────────────┐
│ Xmin(8B) │ Xmax(8B) │  Size(2B)│    Data     │
│ 创建事务  │ 删除事务  │  数据大小 │  实际数据    │
└──────────┴──────────┴──────────┴─────────────┘
```

3. **日志系统**:
   - 使用 `.log` 文件记录操作日志
   - 支持 insert 和 update 日志
   - 启动时通过日志恢复数据一致性

4. **页面缓存**:
   - 继承 `AbstractCache` 实现引用计数缓存
   - 内存可配置，默认 64MB

---

### 3.3 版本管理器 (VM - Version Manager)

**位置**: `backend/vm/`

**职责**: 实现 MVCC、可见性判断、锁管理和死锁检测

**核心文件**:
| 文件 | 说明 |
|------|------|
| `VersionManager.java` | 接口 |
| `VersionManagerImpl.java` | 实现 |
| `Entry.java` | 版本条目，包装 DataItem |
| `Transaction.java` | 事务对象，保存快照 |
| `LockTable.java` | 锁表，死锁检测 |
| `Visibility.java` | 可见性判断逻辑 |

**关键设计**:

1. **MVCC 实现**:
   - Entry 包含 Xmin(创建事务) 和 Xmax(删除事务)
   - 通过可见性判断决定版本是否对当前事务可见

2. **隔离级别**:
   - **读提交(Read Committed)**: `level=0`，每次读取最新提交的数据
   - **可重复读(Repeatable Read)**: `level=1`，基于快照读取

3. **可见性规则** (Visibility.java):
   - 读提交: 数据由已提交事务创建，且未被其他已提交事务删除
   - 可重复读: 基于事务快照判断，防止幻读

4. **锁与死锁检测**:
   - LockTable 维护依赖等待图
   - 使用 DFS 检测环路死锁
   - 检测到死锁抛出 `DeadlockException`

---

### 3.4 索引管理器 (IM - Index Manager)

**位置**: `backend/im/`

**职责**: 实现 B+ 树索引

**核心文件**:
| 文件 | 说明 |
|------|------|
| `BPlusTree.java` | B+ 树实现 |
| `Node.java` | 节点实现 |

**关键设计**:
- B+ 树节点存储在 DataItem 中
- 支持范围查询和单点查询
- 节点分裂时自动更新根节点

---

### 3.5 表管理器 (TBM - Table Manager)

**位置**: `backend/tbm/`

**职责**: 管理表结构、字段定义，协调 SQL 执行

**核心文件**:
| 文件 | 说明 |
|------|------|
| `TableManager.java` | 接口 |
| `TableManagerImpl.java` | 实现 |
| `Table.java` | 表对象 |
| `Field.java` | 字段定义 |
| `Booter.java` | 引导信息存储 |

**支持的数据类型**:
- `int32`: 32位整数
- `int64`: 64位整数
- `string`: 字符串

---

### 3.6 解析器 (Parser)

**位置**: `backend/parser/`

**职责**: SQL 词法和语法解析

**支持的 SQL 语句**:
| 语句 | 示例 |
|------|------|
| BEGIN | `begin` / `begin isolation level read committed` / `begin isolation level repeatable read` |
| COMMIT | `commit` |
| ABORT | `abort` |
| CREATE | `create table t1 id int32 name string (index id)` |
| DROP | `drop table t1` |
| SELECT | `select * from t1 where id = 1` |
| INSERT | `insert into t1 values 1 "test"` |
| UPDATE | `update t1 set name = "new" where id = 1` |
| DELETE | `delete from t1 where id = 1` |
| SHOW | `show` |

---

### 3.7 传输层 (Transport)

**位置**: `transport/`

**职责**: 客户端与服务端之间的网络通信

**核心组件**:
| 文件 | 说明 |
|------|------|
| `Transporter.java` | 底层 Socket 传输 |
| `Encoder.java` | 消息编码/解码 |
| `Package.java` | 数据包封装 |
| `Packager.java` | 打包/解包 |

---

### 3.8 公共组件

**位置**: `backend/common/`

| 文件 | 说明 |
|------|------|
| `AbstractCache.java` | 引用计数缓存抽象类 |
| `SubArray.java` | 子数组封装 |

---

## 四、数据流向

### 4.1 查询流程

```
Client 发送 SQL
    │
    ▼
Server 接收 -> Executor 执行
    │
    ▼
Parser 解析 SQL -> 生成 Statement 对象
    │
    ▼
TableManager 处理
    │
    ▼
Table.read() -> 遍历记录
    │
    ▼
VersionManager.read() -> MVCC 可见性判断
    │
    ▼
DataManager.read() -> 从 PageCache 获取 DataItem
    │
    ▼
返回结果给 Client
```

### 4.2 写入流程

```
Client 发送 INSERT SQL
    │
    ▼
Parser 解析 -> Executor 开启事务(如未开启)
    │
    ▼
TableManager.insert() -> Table.insert()
    │
    ▼
VersionManager.insert() -> 创建 Entry
    │
    ▼
DataManager.insert() -> 
    │
    ├── Logger 记录日志
    ├── PageIndex 选择合适页面
    └── PageCache 写入页面
    │
    ▼
索引更新 (BPlusTree)
```

---

## 五、启动流程

### 5.1 创建数据库

```java
// Launcher.createDB()
TransactionManager tm = TransactionManager.create(path);
DataManager dm = DataManager.create(path, DEFALUT_MEM, tm);
VersionManager vm = new VersionManagerImpl(tm, dm);
TableManager.create(path, vm, dm);
```

### 5.2 打开数据库

```java
// Launcher.openDB()
TransactionManager tm = TransactionManager.open(path);
DataManager dm = DataManager.open(path, mem, tm);
VersionManager vm = new VersionManagerImpl(tm, dm);
TableManager tbm = TableManager.open(path, vm, dm);
new Server(port, tbm).start();
```

---

## 六、学习路径建议

### 推荐学习顺序

```
第一阶段：基础组件
├── 1. common/AbstractCache.java    # 理解引用计数缓存
├── 2. tm/TransactionManager        # 事务状态管理
└── 3. utils/Parser.java            # 字节解析工具

第二阶段：数据持久化
├── 4. dm/page/Page.java            # 页面结构
├── 5. dm/pageCache/PageCache.java  # 页面缓存
├── 6. dm/logger/Logger.java        # 日志系统
└── 7. dm/dataItem/DataItem.java    # 数据项

第三阶段：并发控制
├── 8. vm/Entry.java                # 版本条目
├── 9. vm/Visibility.java           # MVCC 可见性
├── 10. vm/LockTable.java           # 锁与死锁检测
└── 11. vm/VersionManager.java      # 版本管理

第四阶段：索引与表
├── 12. im/BPlusTree.java           # B+ 树索引
└── 13. tbm/Table.java              # 表管理

第五阶段：SQL 层
├── 14. parser/Parser.java          # SQL 解析
├── 15. server/Executor.java        # 执行器
└── 16. server/Server.java          # 网络服务

第六阶段：客户端
├── 17. client/Shell.java           # 交互式命令行
└── 18. transport/                  # 传输层
```

### 每个阶段的学习重点

| 阶段 | 重点知识点 |
|------|-----------|
| 基础组件 | 缓存淘汰策略、文件操作、字节序处理 |
| 数据持久化 | 页面组织、WAL 日志、崩溃恢复 |
| 并发控制 | MVCC 原理、事务隔离级别、死锁检测算法 |
| 索引与表 | B+ 树结构与操作、表结构设计 |
| SQL 层 | 词法/语法分析、执行计划 |
| 客户端 | 网络协议设计、交互式 CLI |

---

## 七、核心类图

```
                    ┌─────────────────┐
                    │ AbstractCache<T>│
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PageCache     │ │   DataManager   │ │ VersionManager  │
│   (缓存 Page)   │ │  (缓存 DataItem)│ │  (缓存 Entry)   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 八、文件存储结构

创建数据库后，在指定路径生成以下文件：

```
/tmp/mydb/
├── mydb.db      # 数据文件 (PageCache)
├── mydb.xid     # 事务状态文件 (TransactionManager)
└── mydb.log     # 日志文件 (Logger)
```

---

## 九、关键配置

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| 端口 | 9999 | Server 监听端口 |
| 内存 | 64MB | 页面缓存大小 |
| 页面大小 | 8KB | 每个页面大小 |

---

## 十、参考资料

- MySQL InnoDB 存储引擎设计
- PostgreSQL MVCC 实现
- SQLite 文件格式

建议结合代码阅读，从测试类入手 (`src/test/java/`) 理解各模块的使用方式。
