```java
/**
 * 记录业务日志
 */
public static void logBusiness(String operation, String userId, String message, Object... args) {
    try {
        MDC.put(OPERATION, operation);
        MDC.put(USER_ID, userId);
        BUSINESS_LOGGER.info("[{}] [用户:{}] {}", operation, userId, formatMessage(message, args));
    } finally {
        MDC.clear();
    }
}
```

总结：这段代码是一个业务日志记录工具方法，利用SLF4J的MDC（Mapped Diagnostic Context，映射诊断上下文）实现日志的上下文信息管理，确保日志中包含操作类型、用户ID等关键业务标识，同时通过try-finally结构保证MDC上下文的清理，避免线程污染。

解释：

1. **核心功能**：封装了业务日志记录逻辑，接收操作类型（operation）、用户ID（userId）、消息模板（message）和可变参数（args），最终通过BUSINESS_LOGGER输出格式化日志。
2. **MDC的作用**：
    - MDC是SLF4J提供的线程级别的上下文存储工具，用于在日志输出时附加额外的上下文信息（如用户ID、操作类型）。
    - 这里通过 `MDC.put(OPERATION, operation)` 和 `MDC.put(USER_ID, userId)` 将操作类型和用户ID存入当前线程的MDC上下文。
    - 日志输出时，可在日志格式（如logback.xml中的 `%X{USER_ID}`）中直接引用这些变量，无需在每条日志消息中显式拼接，简化代码且统一格式。
3. **try-finally的必要性**：
    - 无论日志记录是否成功，`finally` 块中的 `MDC.clear()` 都会执行，确保清除当前线程的MDC上下文。
    - 避免线程池环境下，线程复用导致的上下文信息残留（如A用户的日志上下文被B用户的请求复用）。
4. **日志格式化**：`formatMessage(message, args)` 用于将消息模板和参数格式化（类似 `String.format()`），生成最终的日志内容。
5. **优势**：
    - 解耦：上下文信息通过MDC传递，与日志消息内容分离，便于日志格式统一配置。
    - 可追踪：每条业务日志都携带操作类型和用户ID，便于问题排查和业务追踪。
    - 线程安全：MDC基于ThreadLocal实现，确保多线程环境下上下文信息隔离。