## 错误日志与分析

刚刚做项目，遇到报错如下：

```typescript
25-05-24.00:27:16.861 [http-nio-8092-exec-10] WARN DefaultHandlerExceptionResolver - Resolved [org.springframework.http.converter.HttpMessageNotReadableException: JSON parse error: Cannot deserialize value of type `java.util.Date` from String "2025-12-23 13:15:02": not a valid representation (error: Failed to parse Date value '2025-12-23 13:15:02': Cannot parse date "2025-12-23 13:15:02": while it seems to fit format 'yyyy-MM-dd'T'HH:mm:ss.SSSX', parsing fails (leniency? null)); nested exception is com.fasterxml.jackson.databind.exc.InvalidFormatException: Cannot deserialize value of type `java.util.Date` from String "2025-12-23 13:15:02": not a valid representation (error: Failed to parse Date value '2025-12-23 13:15:02': Cannot parse date "2025-12-23 13:15:02": while it seems to fit format 'yyyy-MM-dd'T'HH:mm:ss.SSSX', parsing fails (leniency? null))<EOL> at [Source: (org.springframework.util.StreamUtils$NonClosingInputStream); line: 6, column: 21] (through reference chain: site.dopplerxd.api.dto.SettlementMarketPayOrderRequestDTO["outTradeTime"])]
```

看起来是 Jackson 在反序列化 `Date` 类型时，无法将字符串 `"2025-12-23 13:15:02"` 转换成 `java.util.Date`。

**根本原因**：默认的 Jackson `ObjectMapper` 不支持 `yyyy-MM-dd HH:mm:ss` 格式的日期字符串解析为 `java.util.Date`。

Jackson 尝试将 `"2025-12-23 13:15:02"` 解析为 `java.util.Date`，但失败了：

- 它默认使用 ISO 8601 格式：`yyyy-MM-dd'T'HH:mm:ss.SSSX`
- 而你的输入格式是：`yyyy-MM-dd HH:mm:ss`（缺少 `T`）

## 解决方式

### 修改入参

因为我是在使用 `Apifox` 进行测试的时候出现的这个错误，发现 `Apifox` 默认使用 `ISO 9075` 标准对日期时间字符串进行格式化，如 `2025-05-24 01:11:24`。

但是如上文所述，Jackson 默认使用 `ISO 8601` 格式，形如 `2025-05-23T17:12:03.848Z`。

于是我将 `Apifox` 中的 Mock 设置中的时间格式修改为 `ISO 8601` 格式，解决了问题。

### GPT 方法一：使用 `@JsonFormat` 注解指定格式

在 DTO 类的 `Date` 字段上添加如下注解：

```java
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
private Date outTradeTime;
```

> ⚠️ 注意时区（如果用的是东八区）

例如 `SettlementMarketPayOrderRequestDTO` 应该这样写：

```java
@Data public class SettlementMarketPayOrderRequestDTO {
      @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
     private Date outTradeTime;      
     // 其他字段... 
 }
```

### GPT 方法二：自定义 `ObjectMapper` 的全局时间格式（适用于整个项目）

在配置类中加一段：

```java
@Configuration
public class JacksonConfig {
    @Bean     
    public Jackson2ObjectMapperBuilderCustomizer customDateFormat() {
        return builder -> builder.simpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }
}
```

> 所有 `Date` 字段将默认按这个格式解析。

### GPT 方法三：将 `Date` 字段替换为 `String`，手动转换

如果你不想让 Jackson 管这事，可以先接收为字符串，再手动转成 Date：

```java
private String outTradeTimeStr;  
public Date getOutTradeTime() {
    try {         
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(outTradeTimeStr);     
    } catch (ParseException e) { 
        return null;     
    } 
}
```
