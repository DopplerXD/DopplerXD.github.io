DTO、VO、PO 是分层架构（尤其是结合 DDD、Spring Boot 项目）中常见的几种对象类型，它们分别服务于不同的层，职责清晰、边界明确。

------

## ✅ 一张表快速区分：DTO / VO / PO / DO

| 名称    | 全称                   | 作用                               | 典型使用层                | 是否与数据库映射 |
| ------- | ---------------------- | ---------------------------------- | ------------------------- | ---------------- |
| **DTO** | Data Transfer Object   | **服务/接口层之间的数据传输对象**  | Controller ↔ App ↔ Domain | ❌（一般不直接）  |
| **VO**  | View Object            | **用于前端展示的数据对象**         | API Controller            | ❌                |
| **PO**  | Persistent Object      | **数据库持久化对象（对应表结构）** | Infrastructure (DAO)      | ✅                |
| **DO**  | Domain Object / Entity | **领域实体/值对象**                | Domain Layer              | ❌（自己控制）    |

------

## 🔍 各对象类型详细解析

------

### 1. ✅ DTO（Data Transfer Object）

- **用于服务层/远程调用层之间的数据交换**
- 可以用于请求参数或接口返回
- 通常是**扁平结构**、不包含业务逻辑

📦 示例：

```java
public class UserDTO {
    private Long id;
    private String username;
    private String email;
}
```

🧭 使用场景：

- 接口参数传递（如 `@RequestBody UserDTO`）
- 微服务之间的 RPC 通信（Feign 等）
- 应用服务与领域服务的数据桥梁

------

### 2. ✅ VO（View Object）

- **用于构建前端页面/响应展示的数据模型**
- 可能会组合多个数据源、加工展示
- 通常是只读的、展现层专用的

📦 示例：

```java
public class UserVO {
    private String username;
    private String avatarUrl;
    private String roleName;
}
```

🧭 使用场景：

- `Controller` 接口响应数据封装（`Result<UserVO>`）
- 用于页面展示字段，不一定是数据库字段

------

### 3. ✅ PO（Persistent Object）

- **直接对应数据库表结构**
- 通常是 MyBatis、JPA 等 ORM 框架映射对象
- 包含数据库字段（可能还有一些注解如 `@Table`、`@Column`）

📦 示例：

```java
@Table(name = "user")
public class UserPO {
    private Long id;
    private String username;
    private String password;
    private LocalDateTime createTime;
}
```

🧭 使用场景：

- DAO 层 / Mapper 层使用
- ORM 框架与数据库交互

------

### 4. ✅ DO（Domain Object / Domain Entity）

- **领域模型的核心**
- 聚焦业务行为，**包含业务逻辑**
- 不依赖数据库，不关心持久化细节

📦 示例：

```java
public class User {
    private UserId id;
    private UserName name;
    private Email email;

    public void changeEmail(Email newEmail) {
        // domain logic
        this.email = newEmail;
    }
}
```

🧭 使用场景：

- DDD 领域模型
- 领域服务中的操作对象
- 不用于暴露给 Controller

------

## 🎯 对比图解（从前端到数据库）：

```text
 前端请求/响应
     ↑↓
  Controller
     ↑↓      ←   使用 VO / DTO
  Application Service
     ↑↓      ←   使用 DTO
  Domain Service
     ↑↓      ←   使用 DO（实体/值对象）
 Repository（接口）
     ↑↓
  Infrastructure（DAO / Mapper）
     ↑↓      ←   使用 PO（ORM映射）
   数据库
```

------

## 🧠 开发建议

| 建议                             | 说明                             |
| -------------------------------- | -------------------------------- |
| ❌ 不要混用                       | DTO ≠ VO ≠ PO ≠ DO，各自职责清晰 |
| ✅ 用 MapStruct 等工具做转换      | 避免手动冗长的拷贝               |
| ✅ Controller 接受 DTO / 返回 VO  | 不直接暴露 Domain Entity 或 PO   |
| ✅ 领域层只使用 DO，不依赖 DTO/PO |                                  |

------

## ✅ 总结一句话

> **DTO** 用来传数据，**VO** 用来展示数据，**PO** 用来存数据，**DO** 用来管业务。

