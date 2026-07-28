# DDD 简明教程：从概念到 `ai-mcp-gateway` 工程落地

DDD（Domain-Driven Design，领域驱动设计）不是一种固定的目录模板，也不是把 `Controller`、`Service`、`Mapper` 换一组名字。它的核心是：**围绕业务概念建模，并通过清晰的边界保护业务规则，使技术细节可以被替换。**

本文结合 `ai-mcp-gateway` 中的 DDD 脚手架，介绍一套适用于 Spring Boot 项目的简明落地方法。

## 1. 什么时候值得使用 DDD

DDD 更适合以下场景：

- 业务规则多，而且会持续变化；
- 同一个概念在不同业务中含义不同；
- 需要接入数据库、缓存、第三方 API、消息队列等多种技术设施；
- 项目需要长期维护，希望核心业务不被框架和中间件绑死。

如果项目只是简单的单表增删改查，传统 MVC 往往更直接。DDD 的价值不在于文件更多，而在于复杂业务发生变化时，修改范围仍然可控。

## 2. 先理解几个核心概念

### 2.1 领域与限界上下文

**领域（Domain）**是软件要解决的业务问题。例如 MCP 网关可能包含服务注册、路由、鉴权、调用统计等领域。

**限界上下文（Bounded Context）**是一个模型能够保持含义一致的边界。同一个“服务”在注册上下文中可能表示可管理的 MCP 服务节点，在调用上下文中则可能表示一次可路由的目标。不要强迫整个系统共享一个万能模型。

在脚手架中，`domain/xxx` 和 `domain/yyy` 表达的就是按业务上下文组织代码的意图。实际开发时应替换成有业务含义的名称，例如：

```text
domain/
├── registry/       # MCP 服务注册上下文
├── routing/        # 路由上下文
└── authorization/  # 鉴权上下文
```

### 2.2 实体、值对象与聚合

**实体（Entity）**由身份标识区分。即使属性发生变化，只要标识相同，它仍是同一个对象。例如一个 `McpServer` 可以通过 `serverId` 标识。

**值对象（Value Object）**由属性值描述，没有独立身份，通常应设计为不可变对象。例如服务地址：

```java
public record ServerEndpoint(String value) {
    public ServerEndpoint {
        if (value == null || (!value.startsWith("http://")
                && !value.startsWith("https://"))) {
            throw new IllegalArgumentException("服务地址必须使用 HTTP 或 HTTPS");
        }
    }
}
```

校验规则放进值对象后，系统中便不会出现一个“已经创建但地址非法”的 `ServerEndpoint`。

**聚合（Aggregate）**是一组需要共同维护业务一致性的对象，**聚合根**是外部访问这组对象的唯一入口。一次事务通常只修改一个聚合。

```java
public class McpServerAggregate {
    private final String serverId;
    private String name;
    private ServerEndpoint endpoint;
    private ServerStatus status;

    public McpServerAggregate(
            String serverId,
            String name,
            ServerEndpoint endpoint) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("服务名称不能为空");
        }
        this.serverId = serverId;
        this.name = name;
        this.endpoint = endpoint;
        this.status = ServerStatus.DISABLED;
    }

    public void enable() {
        if (endpoint == null) {
            throw new IllegalStateException("缺少服务地址，不能启用");
        }
        this.status = ServerStatus.ENABLED;
    }
}
```

好的领域对象不仅保存数据，还会保护自身状态并表达业务行为。相较于 `setStatus(1)`，`enable()` 更接近业务语言，也更不容易制造非法状态。

### 2.3 领域服务

当一项业务规则无法自然归属于某个实体或值对象时，可以使用**领域服务（Domain Service）**。例如路由策略需要比较多个服务节点，它不属于任何一个单独节点。

领域服务应表达业务能力，而不是成为所有逻辑的收纳箱。如果某个方法只是编排查询、保存和通知，它更接近应用服务或用例编排。

### 2.4 仓储与端口

**仓储（Repository）**为聚合提供类似集合的访问方式，接口由领域层定义：

```java
public interface IMcpServerRepository {
    boolean existsByName(String name);
    void save(McpServerAggregate server);
    Optional<McpServerAggregate> findById(String serverId);
}
```

**端口（Port）**描述领域层需要的外部能力，例如检查远程 MCP 服务是否可用：

```java
public interface IMcpServerHealthPort {
    boolean isReachable(ServerEndpoint endpoint);
}
```

接口名称应该描述业务需要的能力，而不是暴露 `RedisTemplate`、`OkHttpClient` 等技术细节。

## 3. `ai-mcp-gateway` 脚手架的六个模块

脚手架使用 Maven 聚合工程，包含六个模块：

| 模块 | 主要职责 | 典型内容 |
| --- | --- | --- |
| `ai-mcp-gateway-api` | 对外契约 | 接口定义、Request/Response DTO |
| `ai-mcp-gateway-domain` | 核心业务 | 聚合、实体、值对象、领域服务、仓储和端口接口 |
| `ai-mcp-gateway-infrastructure` | 技术实现 | Repository/Port 实现、DAO、PO、MyBatis、Redis、外部网关 |
| `ai-mcp-gateway-trigger` | 触发业务用例 | HTTP、定时任务、消息监听器 |
| `ai-mcp-gateway-app` | 启动与装配 | `Application`、Spring 配置、资源文件、最终打包 |
| `ai-mcp-gateway-types` | 通用类型 | 异常、响应码、常量等跨模块基础类型 |

仓库中的实际 Maven 依赖关系可以简化为：

```text
api                 types
                      ↑
                    domain
                   ↗      ↖
             trigger      infrastructure
                 ↑            ↑
                 └──── app ────┘
```

更准确地说：

- `domain` 依赖 `types`；
- `infrastructure` 依赖 `domain`，以实现领域层定义的接口；
- `trigger` 依赖 `api`、`domain` 和 `types`；
- `app` 依赖 `trigger` 和 `infrastructure`，并负责把它们装配到同一个 Spring 容器；
- `api` 不依赖具体业务实现。

`app` 中的 `Application` 位于 `site.doppler` 根包，能够扫描其他模块中的 `site.doppler.*` Bean，这是多模块项目能够完成运行时装配的关键。

## 4. 为什么基础设施模块反而依赖领域模块

很多人第一次看到下面的依赖时会感到疑惑：

```text
infrastructure ──编译依赖──> domain
```

这是依赖倒置的正常结果。以仓储为例：

```text
domain                        infrastructure
IMcpServerRepository  <|--  McpServerRepository
```

领域层拥有接口，基础设施层实现接口。因此：

- **源代码依赖方向**：`infrastructure → domain`；
- **运行时调用方向**：领域服务通过接口调用由 Spring 注入的基础设施实现；
- **业务控制权**：仍在领域层，因为接口由领域层按照业务需要定义。

领域层不能反向引入 `infrastructure`。否则会形成 Maven 循环依赖，也会让业务模型直接绑定 MyBatis、Redis 或第三方 SDK。

例如，领域逻辑需要缓存登录状态时，不应直接注入 `RedissonCacheManager`，而应在领域层定义 `ILoginStateRepository` 或 `ILoginStatePort`，再由基础设施层使用 Redisson 实现。

## 5. 一个最小业务闭环：注册 MCP 服务

下面用“注册 MCP 服务”串起各层。代码重在展示职责，省略了 Getter、注解和异常细节。

### 5.1 API：定义输入输出契约

放在 `ai-mcp-gateway-api`：

```java
public record RegisterMcpServerRequestDTO(
        String name,
        String endpoint) {
}

public record RegisterMcpServerResponseDTO(
        String serverId) {
}
```

DTO 只负责跨边界传输数据，不承载领域规则，也不要直接复用数据库 PO。

### 5.2 Domain：建模并定义所需能力

目录可以这样组织：

```text
ai-mcp-gateway-domain/
└── .../domain/registry/
    ├── model/
    │   ├── aggregate/McpServerAggregate.java
    │   └── valobj/ServerEndpoint.java
    ├── adapter/
    │   ├── repository/IMcpServerRepository.java
    │   └── port/IMcpServerHealthPort.java
    └── service/McpServerRegistryService.java
```

领域服务负责业务规则：

```java
@Service
public class McpServerRegistryService {
    private final IMcpServerRepository repository;
    private final IMcpServerHealthPort healthPort;

    public McpServerRegistryService(
            IMcpServerRepository repository,
            IMcpServerHealthPort healthPort) {
        this.repository = repository;
        this.healthPort = healthPort;
    }

    public String register(String name, String endpointValue) {
        if (repository.existsByName(name)) {
            throw new IllegalStateException("服务名称已存在");
        }

        ServerEndpoint endpoint = new ServerEndpoint(endpointValue);
        if (!healthPort.isReachable(endpoint)) {
            throw new IllegalStateException("MCP 服务不可访问");
        }

        String serverId = UUID.randomUUID().toString();
        McpServerAggregate server =
                new McpServerAggregate(serverId, name, endpoint);
        repository.save(server);
        return serverId;
    }
}
```

这里的领域层只知道“保存服务”和“检测可用性”，不知道数据存进 MySQL 还是 MongoDB，也不知道健康检查使用 JDK HTTP Client 还是 Retrofit。

### 5.3 Infrastructure：实现仓储和外部调用

放在 `ai-mcp-gateway-infrastructure`：

```java
@Repository
public class McpServerRepository implements IMcpServerRepository {
    private final IMcpServerDao dao;

    @Override
    public void save(McpServerAggregate server) {
        McpServerPO po = McpServerAssembler.toPO(server);
        dao.insert(po);
    }

    @Override
    public boolean existsByName(String name) {
        return dao.countByName(name) > 0;
    }
}
```

外部调用同样在基础设施层实现：

```java
@Component
public class McpServerHealthPort implements IMcpServerHealthPort {
    private final McpServerGateway gateway;

    @Override
    public boolean isReachable(ServerEndpoint endpoint) {
        return gateway.ping(endpoint.value());
    }
}
```

基础设施层内部还可继续细分：

- `dao`：MyBatis Mapper 接口；
- `dao/po`：与表结构映射的持久化对象；
- `gateway`：HTTP/RPC 客户端；
- `gateway/dto`：第三方接口的传输对象；
- `adapter/repository`：领域仓储实现；
- `adapter/port`：领域端口实现；
- `redis`：Redis 客户端与配置。

### 5.4 Trigger：接收请求并触发用例

放在 `ai-mcp-gateway-trigger`：

```java
@RestController
@RequestMapping("/api/v1/mcp/servers")
public class McpServerController {
    private final McpServerRegistryService registryService;

    @PostMapping
    public Response<RegisterMcpServerResponseDTO> register(
            @Valid @RequestBody RegisterMcpServerRequestDTO request) {
        String serverId = registryService.register(
                request.name(),
                request.endpoint());
        return Response.success(
                new RegisterMcpServerResponseDTO(serverId));
    }
}
```

`trigger` 负责协议适配、参数校验和 DTO 转换，不应包含“服务名不能重复”等业务规则。除了 HTTP，同一领域能力还可以被 `job` 或 `listener` 触发。

完整调用链为：

```text
HTTP Request
  → Trigger / Controller
  → Domain Service
  → Domain Repository/Port 接口
  → Infrastructure 实现
  → MySQL / Redis / Remote MCP Server
```

## 6. DTO、领域对象与 PO 不要混用

一次请求通常会经过三种模型：

```text
Request DTO → Domain Model → PO
Response DTO ← Domain Model ← PO
```

| 对象 | 所属边界 | 关注点 |
| --- | --- | --- |
| DTO | API/Trigger | 接口传输与参数格式 |
| Entity、Value Object、Aggregate | Domain | 业务规则与业务行为 |
| PO | Infrastructure | 数据表字段与持久化框架 |

三者看起来可能字段相似，但变化原因不同：

- API 升级会改变 DTO；
- 业务规则变化会改变领域对象；
- 表结构调整会改变 PO。

小项目可以手写转换；转换较多时可以使用独立 Assembler 或 MapStruct。不要为了省一次转换，让数据库字段或接口格式侵入领域模型。

## 7. 事务、异常与领域事件

### 7.1 事务边界

事务通常放在用例编排的入口，并尽量只覆盖一个聚合的修改。不要在聚合内部开启事务，也不要让一个数据库事务包住耗时的远程调用。

当前脚手架没有单独的 `application` 模块。简单场景可以由 `domain/service` 完成业务编排；当用例编排逐渐复杂时，建议新增 `application` 模块或 `application/service` 包：

```text
Trigger → Application Service → Domain → Infrastructure
```

应用服务负责事务、权限、幂等和流程编排，领域层继续负责业务规则。

### 7.2 异常

领域层抛出表达业务语义的异常，例如 `ServerNameAlreadyExistsException`。在 `trigger` 层统一转换为 HTTP 状态码和 `Response`，不要在领域层返回 HTTP 响应对象。

### 7.3 领域事件

如果“注册服务成功”后还要刷新路由、发送通知和记录审计，可以发布 `McpServerRegisteredEvent`，由监听器处理后续动作。事件适合解耦“已经发生的事实”，但需要明确一致性要求；要求强一致的规则仍应在聚合事务内完成。

## 8. 常见误区

### 误区一：目录分层就是 DDD

把贫血对象放进 `domain/model`，再把所有逻辑堆进一个大 Service，只是换了目录。领域模型应表达业务行为并保护不变量。

### 误区二：一个数据表对应一个聚合

聚合边界由业务一致性决定，不由表关系决定。一个聚合可能映射多张表，多张表也可能分别属于不同聚合。

### 误区三：领域层直接使用 DAO、Redis 或 HTTP SDK

这会让技术细节侵入核心业务。领域层定义 Repository/Port，基础设施层负责实现。

### 误区四：Repository 返回 PO

PO 属于基础设施层。Repository 接口应接收和返回聚合或领域对象，转换在基础设施实现中完成。

### 误区五：所有逻辑都必须塞进聚合

聚合适合维护自身一致性；跨聚合规则可放领域服务，事务和流程编排可放应用服务。

### 误区六：为了“纯粹”制造大量空接口

抽象应服务于稳定边界和替换需求。没有业务含义、只有一次机械转发的接口，会增加理解成本。先识别变化点，再建立恰当抽象。

## 9. 推荐的开发顺序

开发一个新功能时，可以按以下顺序推进：

1. 用业务语言描述用例、规则和异常情况；
2. 判断它属于哪个限界上下文；
3. 找出实体、值对象、聚合根及其不变量；
4. 在领域层定义业务行为；
5. 为持久化和外部能力定义 Repository/Port；
6. 在基础设施层实现接口，并完成 PO/DTO 转换；
7. 在 Trigger 层接入 HTTP、任务或消息；
8. 在 App 层完成配置和运行时装配；
9. 优先测试领域规则，再做仓储集成测试和接口测试。

领域测试通常不需要启动 Spring：

```java
@Test
void should_reject_invalid_endpoint() {
    assertThrows(
            IllegalArgumentException.class,
            () -> new ServerEndpoint("ftp://example.com"));
}
```

这正是隔离技术细节带来的直接收益：核心规则更容易测试，也更容易演进。

## 10. 一句话记住这套架构

> API 定契约，Trigger 接请求，Domain 管业务，Infrastructure 做实现，App 负责装配，Types 放通用类型。

判断代码应该放在哪里时，可以问自己：

- 这是业务规则吗？放 `domain`；
- 这是 HTTP、定时任务或消息入口吗？放 `trigger`；
- 这是数据库、缓存或第三方调用吗？放 `infrastructure`；
- 这是对外公开的数据契约吗？放 `api`；
- 这是启动配置和模块装配吗？放 `app`。

DDD 的目标不是得到最复杂的工程结构，而是让最重要的业务代码位于最稳定、最容易理解和测试的位置。

## 参考

- `ai-mcp-gateway/README.md`
- `ai-mcp-gateway/pom.xml` 及各子模块 `pom.xml`
- 各模块 `package-info.java` 中的职责说明
- Eric Evans，《领域驱动设计：软件核心复杂性应对之道》
- Vaughn Vernon，《实现领域驱动设计》
