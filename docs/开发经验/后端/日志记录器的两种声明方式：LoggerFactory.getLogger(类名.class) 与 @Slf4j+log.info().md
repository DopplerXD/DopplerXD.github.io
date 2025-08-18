`private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);`（手动初始化日志器）与 `@Slf4j` 注解 + `log.info()`/`log.error()`（Lombok 自动生成日志器）的核心区别在于**日志器的创建方式、代码简洁性和依赖要求**，具体如下：

## **1. 实现方式：手动编码 vs 注解自动生成**

### **手动初始化（当前代码使用方式）**

- **显式声明**：通过 `LoggerFactory.getLogger(类名.class)` 手动创建 `Logger` 实例，需在类中编写完整的日志器初始化代码。
- **原理**：直接调用 SLF4J（日志门面）的 API 创建日志器，与底层日志框架（如 Logback、Log4j）解耦。

```java
// 手动声明
private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
```

### **`@Slf4j` 注解方式**

- **隐式生成**：通过 Lombok 注解 `@Slf4j` 在编译期自动生成日志器代码，无需手动声明 `logger` 变量。
- **原理**：Lombok 在编译时为类自动插入类似 `private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);` 的代码，简化开发。

```java
@Slf4j // Lombok 注解，自动生成日志器
public class JwtUtils {
    // 直接使用自动生成的 log 变量
    public void test() {
        log.info("日志内容"); // 无需手动声明 logger
    }
}
```

## **2. 核心区别对比**

|  **维度**      |  **手动初始化（当前代码）**                                 |  **`@Slf4j` 注解方式**                                       |
| ---------- | ------------------------- | --------------------------------------------- |
|  **代码简洁性**   | 需要手动编写日志器声明代码（1行 boilerplate）                    | 无需手动声明，通过注解自动生成，减少代码冗余                                   |
|  **依赖要求**    | 仅需 SLF4J API + 日志实现（如 Logback）                   | 额外依赖 Lombok 框架（编译期注解处理器）                                 |
|  **日志器变量名**  | 可自定义（如 `logger`、`log` 等）                         | 固定为 `log`（Lombok 默认生成的变量名）                               |
|  **灵活性**     | 可手动指定日志器名称（如 `LoggerFactory.getLogger("自定义名称")`） | 仅支持类名作为日志器名称（与 `LoggerFactory.getLogger(类名.class)` 效果一致） |
| **编译期检查**    | 无额外编译期处理，直接通过 SLF4J API 运行时加载                    | Lombok 在编译期生成代码，若注解配置错误会编译失败                             |

## **3. 功能一致性**

两种方式最终创建的日志器**功能完全一致**：

- 均遵循 SLF4J 规范，支持 `info()`、`warn()`、`error()` 等日志方法。
- 日志输出格式、级别控制、与底层日志框架（如 Logback）的集成方式完全相同。

## **4. 适用场景**

- **手动初始化**：适合不使用 Lombok 的项目，或需要自定义日志器名称、精细化控制日志器创建逻辑的场景。
- **`@Slf4j` 注解**：适合追求代码简洁、使用 Lombok 减少样板代码的项目，尤其在大量类需要日志器时能显著减少重复代码。

## **总结**

当前代码中 `private static final Logger logger = ...` 是**手动显式初始化日志器**，而 `@Slf4j` 是**通过 Lombok 注解自动生成日志器**。两者核心功能一致，但 `@Slf4j` 更简洁（减少 boilerplate），需依赖 Lombok；手动方式更灵活，无额外依赖。