## 什么是 MyBatis 和 MyBatisPlus，区别是什么？
MyBatis 是一款优秀的**持久层开发框架**，它支持定制化SQL、存储过程以及高级映射。以下是关于 MyBatis 和 MyBatisPlus 的介绍及二者区别：

**MyBatis**

+ 核心特点：通过 XML 或注解方式将 SQL 语句与 Java 代码分离，提高了代码的可维护性。它允许开发人员灵活地编写 SQL 语句，能够精确控制数据库操作，适用于复杂的 SQL 场景。
+ 工作原理：读取配置文件，加载映射关系，创建 SQL Session 工厂。通过工厂获取 SQL Session，根据映射关系执行 SQL 语句，完成对数据库的增删改查操作。

**MyBatisPlus**

+ 核心特点：在 MyBatis 基础上进行了增强，提供了大量的代码生成器和通用的 CRUD 操作，极大地简化了开发流程，提高了开发效率。它还支持 Lambda 表达式，使代码更加简洁易读。
+ 工作原理：基于 MyBatis 的插件机制，在运行时动态生成 SQL 语句，实现了通用的 CRUD 操作。同时，通过解析 Lambda 表达式，将其转换为对应的 SQL 查询条件。

**两者区别**

+ 代码生成：MyBatis 需要手动编写 SQL 语句和映射文件，而 MyBatisPlus 通过代码生成器可以自动生成实体类、Mapper 接口、Service 接口及实现类等，减少了大量的重复代码。
+ CRUD 操作：MyBatis 的CRUD 操作需要在 Mapper 接口中定义方法，并在映射文件中编写对应的 SQL 语句。MyBatisPlus 则提供了通用的 Mapper 和 Service 接口，封装了常用的 CRUD 方法，直接调用即可实现基本的数据库操作。
+ 性能优化：MyBatis 在性能优化方面需要开发人员手动进行 SQL 调优。MyBatisPlus 除了支持手动优化 SQL 外，还提供了一些内置的性能优化功能，如分页插件、乐观锁插件等，方便开发人员进行性能优化。

## Mybatis X 常见函数和基本的实现逻辑
Mybatis - X 是 MyBatis 的一个插件，常见函数及逻辑如下：

+ **CRUD 函数**：通过注解或 XML 映射文件实现基本的增删改查操作。例如，使用 `@Select` 注解定义查询语句，使用 `@Insert` 注解定义插入语句等。
+ **分页函数**：通过拦截器实现分页功能。在查询时，拦截器会自动修改 SQL 语句，添加分页条件，如 `LIMIT` 关键字。
+ **动态 SQL 函数**：通过 `<if>`、`<choose>`、`<when>`、`<otherwise>`、`<where>`、`<set>` 等标签实现动态 SQL 拼接。根据不同的条件动态生成不同的 SQL 语句。

## 分页是怎么做的，调用那些函数
在 MyBatis 中实现分页有以下几种方式：

+ **使用 RowBounds 类**：在查询方法中传入 `RowBounds` 对象，指定偏移量和每页记录数。例如：

```java
List<User> users = sqlSession.selectList("UserMapper.selectUsers", null, new RowBounds(0, 10));
```

+ **使用分页插件**：如 PageHelper 插件。在配置好插件后，在查询方法前调用 `PageHelper.startPage(pageNum, pageSize)` 方法，然后执行查询操作，插件会自动处理分页逻辑。例如：

```java
PageHelper.startPage(1, 10);
List<User> users = userMapper.selectUsers();
```

## 查询条件调用哪些函数
+ **注解方式**：使用 `@Select` 注解，在 SQL 语句中使用 `WHERE` 子句添加查询条件。例如：

```java
@Select("SELECT * FROM users WHERE age > #{age}")
List<User> selectUsersByAge(int age);
```

+ **XML 映射文件方式**：使用 `<select>` 标签，在 SQL 语句中添加查询条件。例如：

```xml
<select id="selectUsersByAge" resultType="User">
    SELECT * FROM users
    WHERE age > #{age}
</select>
```

还可以使用动态 SQL 标签根据不同的条件动态生成查询条件。

## 写一个菜单表应该怎么做
在 MySQL 中创建菜单表可以参考以下 SQL 语句：

```sql
CREATE TABLE menu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL COMMENT '菜单名称',
    parent_id INT COMMENT '父菜单 ID，顶级菜单为 0',
    url VARCHAR(255) COMMENT '菜单链接',
    sort INT COMMENT '菜单排序',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);
```

在 MyBatis 中，可以创建对应的实体类 `Menu`，并编写 Mapper 接口和 XML 映射文件来实现对菜单表的增删改查操作。

## 在 Mybatis 中如何防止 SQL 注入
+ **使用预编译语句**：使用 `#{} `占位符，MyBatis 会将其解析为预编译语句，将参数以安全的方式传递给数据库，避免 SQL 注入。例如：

```xml
<select id="selectUserById" resultType="User">
    SELECT * FROM users WHERE id = #{id}
</select>
```

+ **对用户输入进行过滤和验证**：在接收用户输入时，对输入进行过滤和验证，去除特殊字符和恶意代码。
+ **使用 MyBatis 的安全函数**：MyBatis 提供了一些安全函数，如 `#{}` 会自动处理特殊字符，避免 SQL 注入。

## Mybatis 中 #{} 和 ${} 的区别
+ **解析方式不同**：`#{} `是预编译的占位符，MyBatis 会将其解析为 `?` 占位符，然后将参数以安全的方式传递给数据库。`${}` 是直接替换，会将参数直接替换到 SQL 语句中。
+ **安全性不同**：`#{} `可以有效防止 SQL 注入，因为它是预编译的。`${}` 存在 SQL 注入风险，因为它是直接替换参数。
+ **使用场景不同**：`#{} `适用于传递参数，如查询条件、插入值等。`${}` 适用于动态表名、动态列名等情况，因为这些情况不能使用预编译占位符。

