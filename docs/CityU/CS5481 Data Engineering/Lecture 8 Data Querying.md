# Lecture 8：数据查询

本讲从关系代数（relational algebra）与 SQL 查询开始，介绍关系表、键、选择与投影、集合运算、连接和外连接，再延伸到键值、文档、图和宽列数据库的查询方式。

## 学习目标

- 理解关系、属性、元组、域和键等关系模型概念。
- 使用关系代数描述选择、投影、集合运算、笛卡尔积和连接。
- 阅读 SQL 的筛选、分组、排序、连接和嵌套查询。
- 比较不同 NoSQL 数据模型支持的查询能力。

## 1. 查询与关系模型

数据库查询（query）可以是读取数据的查询，也可以是修改数据的操作。本讲重点是检索数据。一个查询通常需要明确要读取哪些数据、返回哪些字段、数据位于哪张表或哪种数据结构，以及如何筛选结果。

关系数据库管理系统（relational database management system，RDBMS）将数据表示为关系（relation），并常用结构化查询语言（Structured Query Language，SQL）查询和维护数据。关系模式（relation schema）描述关系的属性，例如 `instructor(ID, name, dept_name, salary)`；关系实例（relation instance）是某一时刻的元组集合。表中的一行称为元组（tuple），一列称为属性（attribute）。每个属性都有定义域（domain），即允许取值的集合；关系模型通常要求属性值是原子的（atomic），即在模型中不可再分。

关系在数学上是元组的集合，因此元组没有固定顺序，重复元组也不构成新的集合元素。SQL 查询结果通常按多重集（bag）语义保留重复行；若需要去重，应显式使用 `DISTINCT`。只有 `ORDER BY` 明确指定排序时，SQL 结果才保证按该顺序呈现。

### 1.1 键与关系拆分

- **超键（superkey）**：能够唯一标识关系中元组的一个或多个属性。超键可能包含多余属性。
- **候选键（candidate key）**：不含多余属性的最小超键。
- **主键（primary key）**：从候选键中选定，用于唯一标识元组。
- **外键（foreign key）**：引用另一关系主键的属性集合，用于连接相关关系。

将大学信息拆分到 `instructor`、`student`、`advisor` 等多个关系，可以减少重复记录，也避免为“不存在的导师”等情况填入大量空值。查询时再通过键把需要的信息连接起来。

## 2. 关系代数

关系代数（relational algebra）以关系为输入并产生关系，因此可将操作组合成查询表达式。基本运算包括选择、投影、并、差、笛卡尔积和重命名；交、连接、赋值和外连接可作为常见扩展。

### 2.1 选择与投影

- **选择（select，`σ`）**按谓词筛选元组，保留所有属性。比较符包括 `=`, `≠`, `>`, `≥`, `<`, `≤`；多个条件可用 `∧`、`∨`、`¬` 组合。例如，从 `instructor` 中选出物理系教师：

  ```text
  σ dept_name = "Physics" (instructor)
  ```

- **投影（project，`Π`）**选择需要的属性，删除其他列。关系代数采用集合语义，因此投影后重复元组会合并：

  ```text
  Π ID, name, salary (instructor)
  ```

### 2.2 集合运算与重命名

并（`∪`）返回任一输入关系中的元组；差（`−`）返回只出现在左侧关系中的元组；交（`∩`）返回两边共有的元组。并、差和交要求两个关系的**元数相同**，且对应属性的定义域兼容。交也可由差表示：`r ∩ s = r − (r − s)`。

笛卡尔积（Cartesian product，`×`）将两个关系的每一对元组组合起来。若属性名冲突，需要先重命名以区分来源。重命名运算（`ρ`）可为关系或属性指定新名称；赋值运算（`←`）则可把中间结果命名为临时关系，便于分步书写较长的表达式。

### 2.3 连接与外连接

θ 连接（theta join，`⋈θ`）等价于先做笛卡尔积，再按连接谓词选择：

```text
r ⋈θ s = σθ (r × s)
```

自然连接（natural join，`⋈`）按两个关系中同名且值相等的属性匹配，并在结果中合并这些共有属性。使用自然连接前应确认同名属性确实表达相同含义；否则应显式指定连接条件。

内连接只返回匹配成功的元组。外连接（outer join）还保留未匹配的一侧或两侧元组，并用 `NULL` 填充缺失一侧的属性：

- **左外连接（left outer join）**保留左侧的全部元组；
- **右外连接（right outer join）**保留右侧的全部元组；
- **全外连接（full outer join）**保留两侧的全部元组。

外连接用于避免因没有匹配记录而丢失信息。注意 `NULL` 表示未知或缺失，不等同于普通值；SQL 中应使用 `IS NULL` 判断空值。

## 3. SQL 查询

SQL 查询通常由以下部分构成：

```sql
SELECT <要返回的列或表达式>
FROM <表及连接>
WHERE <行级筛选条件>
GROUP BY <分组列>
HAVING <分组后的筛选条件>
ORDER BY <排序列及方向>;
```

概念上的处理顺序与书写顺序不同：先确定 `FROM` 中的数据来源及连接，再应用 `WHERE` 筛选行；随后按需分组并计算聚合，再应用 `HAVING` 筛选分组；之后进行排序，最后形成 `SELECT` 指定的输出列。数据库引擎可根据统计信息选择不同的物理执行计划，但结果语义必须符合查询要求。

### 3.1 筛选、排序与分组

`WHERE` 对分组前的行进行筛选；`ORDER BY` 对结果排序，可使用多个排序字段，也可明确指定 `ASC`（升序）或 `DESC`（降序）。例如：

```sql
SELECT movie_title, gross, budget, gross - budget AS profit
FROM movies
ORDER BY profit DESC, movie_title ASC;
```

`GROUP BY` 按一个或多个字段形成组，聚合函数常用于把每组压缩为一行；`HAVING` 筛选聚合后的组。与行筛选不同，不能用 `WHERE` 直接筛选聚合结果：

```sql
SELECT country, COUNT(*) AS customer_count
FROM customers
WHERE age >= 18
GROUP BY country
HAVING COUNT(*) >= 2
ORDER BY customer_count DESC;
```

### 3.2 连接、自连接与嵌套查询

连接把多个表中相关的行组合起来，连接条件通常比较外键和被引用的键：

```sql
SELECT m.movie_title, p.person_fname, p.person_lname
FROM movies AS m
JOIN people AS p ON m.director_id = p.person_id;
```

若要在同一张表中比较不同记录，可将表用不同别名引用，构成自连接（self join）。例如查找同州的不同人员：

```sql
SELECT DISTINCT p1.person_id, p1.person_state
FROM people AS p1
JOIN people AS p2
  ON p1.person_state = p2.person_state
 AND p1.person_id <> p2.person_id;
```

这里的 `DISTINCT` 用于消除连接产生的重复结果。嵌套查询（subquery）是位于另一个查询中的查询，常用于 `IN`、`EXISTS` 或比较表达式中：

```sql
SELECT movie_title
FROM movies
WHERE director_id IN (
    SELECT person_id
    FROM people
    WHERE person_state = 'TX'
);
```

同一问题可能有多种等价的关系代数或 SQL 写法。查询优化（query optimization）会选择合适的执行策略；查询一般先经过扫描、解析和验证，以识别关键词、检查语法，并确认表名和属性名有效。改写查询时应验证结果等价，而不能只比较 SQL 文本长短。

## 4. NoSQL 查询

NoSQL（“Not Only SQL”，即“不仅仅是 SQL”）涵盖多种非关系数据模型。查询能力取决于数据组织方式：有些模型只能按键定位，有些支持文档字段条件，有些擅长沿图关系遍历，还有些限制跨表连接。

### 4.1 键值存储

键值存储（key-value store）通过键访问值，值可以是字符串、计数器、JSON、二进制对象或媒体文件。通常可直接查询键，但不能任意按值内部的字段查询；若要按邮箱、姓名等属性搜索，需要读取并检查值，或额外维护排序键、二级键或索引。

### 4.2 文档数据库

文档数据库把结构化文本保存为层次化文档，常见格式包括 JSON、XML 和 BSON（Binary JSON）。JSON（JavaScript Object Notation）对象是名称—值对的无序集合，数组是有序值集合；XML（Extensible Markup Language）用标签表达层次结构，标签由应用定义。

以 MongoDB 为例，查询指定集合、筛选条件和投影字段，还可添加排序或数量限制：

```javascript
db.inventory.find({ type: "snacks" })

db.inventory.find({
  type: { $in: ["food", "snacks"] }
})

db.inventory.find({
  type: "food",
  price: { $lt: 9.95 }
})
```

不传筛选条件时，可返回集合中的全部文档。具体查询语法由数据库产品及其查询语言决定。

### 4.3 图数据库

图数据库以节点表示实体、以有向或无向边表示实体间关系。节点和边都可以带属性；查询重点是发现关系模式、路径或相似子图。

Cypher 是 Neo4j 常用的图查询语言。`MATCH` 描述图模式，`WHERE` 添加条件，`RETURN` 指定输出；`CREATE`、`DELETE` 和 `SET` 可修改图数据。例如查询成年但未满 30 岁的人名：

```cypher
MATCH (p:Person)
WHERE p.age >= 18 AND p.age < 30
RETURN p.name
```

子图查询寻找匹配指定结构的图模式；相似度查询允许结果与查询图近似而非完全同构。复杂图分析还需定义“相似”的度量方式。

### 4.4 宽列数据库

宽列数据库以行键组织列值，列可以只存在于部分行，并可随时增加。Cassandra 查询语言（Cassandra Query Language，CQL）语法与 SQL 相似，但通常要求查询限定分区或聚簇键，且不支持通用的跨表连接。使用时应根据分区键、聚簇列和访问模式设计表结构，而不是假设它具有完整关系数据库的查询能力。

```sql
SELECT column_name, column_value
FROM mytable
WHERE row_id = 3
ORDER BY column_value;
```

## 5. 查询方式对照

| 数据模型 | 常见查询方式 | 适合的访问模式 | 主要限制 |
| --- | --- | --- | --- |
| 关系数据库 | SQL、关系代数 | 过滤、聚合、连接与事务性查询 | 需要合理模式和连接条件 |
| 键值存储 | 按键读取，配合二级索引 | 已知键的快速访问 | 通常不能直接检索值内部任意字段 |
| 文档数据库 | 按集合和文档字段筛选 | 层次化、结构灵活的文档 | 字段一致性和跨文档关系需额外设计 |
| 图数据库 | 按节点、关系和路径模式匹配 | 关系遍历与图模式查询 | 查询成本受路径范围与图规模影响 |
| 宽列数据库 | 按分区键和列范围查询 | 大规模稀疏列与已知访问模式 | 常限制查询范围，不提供通用 Join |

选择查询语言和数据模型时，应从实际访问模式出发：需要返回什么、如何筛选、是否连接多个实体、是否要求顺序或聚合，以及数据增长后查询成本如何变化。
