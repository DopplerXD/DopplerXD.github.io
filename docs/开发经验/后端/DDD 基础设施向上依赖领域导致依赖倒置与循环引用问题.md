## 问题描述

MVC 架构中 `service/impl/WeixinServiceImpl` 类中有方法：  

```java
@Override  
public void saveLoginState(String ticket, String openid) throws IOException {  
    redissonCacheManager.getOpenidTicketMap().put(ticket, openid);
    
    // 1. 获取 access_token
    RBucket<String> accessTokenBucket = redissonCacheManager.getAccessTokenBucket();
    String accessToken = accessTokenBucket.get();
    if (accessToken == null) {
        Call<WeixinTokenResponse> call = weixinApiService.getToken("client_credential", appid, appSecret);
        WeixinTokenResponse weixinTokenResponse = call.execute().body();
        ThrowUtils.throwIf(weixinTokenResponse == null, Constants.ResponseCode.UN_ERROR);
        accessToken = weixinTokenResponse.getAccess_token();
        // TODO: 方法废弃，修改推荐方法
        accessTokenBucket.set(accessToken, 7200, TimeUnit.SECONDS);
    }

    // 2. 发送模板消息
    Map<String, Map<String, String>> data = new HashMap<>();
    WeixinTemplateMessageVO.put(data, WeixinTemplateMessageVO.TemplateKey.USER, openid);

    WeixinTemplateMessageVO templateMessageDTO = new WeixinTemplateMessageVO(openid, templateId);
    templateMessageDTO.setUrl("https://www.dopplerxd.top");
    templateMessageDTO.setData(data);

    Call<Void> call = weixinApiService.sendMessage(accessToken, templateMessageDTO);
    call.execute();
}
```

我要把这个方法迁移到 DDD 中，实现类位于 `package site.dopplerxd.domain.auth.service` 

```java
@Resource  
private ILoginPort loginPort;

@Override  
public void saveLoginState(String ticket, String openid) throws IOException {  
	redissonCacheManager.getOpenidTicketMap().put(ticket, openid);

    // 发送微信公众号模板消息
    loginPort.sendLoginTemplate(openid);
}
```

`interface ILoginPort` 位于 `package site.dopplerxd.domain.auth.adapter.port`，而 `class LoginPort` 位于 `package site.dopplerxd.infrastructure.adapter.port`，在 `LoginPort` 中实现方法：

```java
@Override  
public void sendLoginTemplate(String openid) throws IOException {  
    // 1. 获取 access_token  
    RBucket accessTokenBucket = redissonCacheManager.getAccessTokenBucket();  
    String accessToken = accessTokenBucket.get();  
    if (accessToken == null) {  
        Call call = weixinApiService.getToken("client_credential", appid, appSecret);  
        WeixinTokenResponseDTO weixinTokenResponse = call.execute().body();  
        ThrowUtils.throwIf(weixinTokenResponse == null, Constants.ResponseCode.UN_ERROR);  
        accessToken = weixinTokenResponse.getAccess_token();  
        // TODO: 方法废弃，修改推荐方法  
        accessTokenBucket.set(accessToken, 7200, TimeUnit.SECONDS);  
    }
    
    // 2. 发送模板消息
    Map<String, Map<String, String>> data = new HashMap<>();
    WeixinTemplateMessageDTO.put(data, WeixinTemplateMessageDTO.TemplateKey.USER, openid);

    WeixinTemplateMessageDTO templateMessageDTO = new WeixinTemplateMessageDTO(openid, templateId);
    templateMessageDTO.setUrl("https://www.dopplerxd.top");
    templateMessageDTO.setData(data);

    Call<Void> call = weixinApiService.sendMessage(accessToken, templateMessageDTO);
    call.execute();
}
```

如果这样写的话，我的 `RedissonCacheManager` 在 `infrastructure/redis` 下，但是因为依赖倒置，我的 `infrastructure` 引入了 `domain` 模块，因此 `domain` 不能通过引入 `infrastructure` 模块来使用 `RedissonCacheManager` ，否则会引起循环依赖问题。如何解决？

## ChatGPT 回答

你遇到的这个问题是 DDD 中非常经典的**“基础设施向上依赖领域，但领域不应该依赖基础设施”**所导致的依赖倒置与循环引用问题。

你当前的设计思路是对的：

- 在 **domain 层定义接口（如 `ILoginPort`）**；
  
- 在 **infrastructure 层实现接口（如 `LoginPort`）**；
  
- 让 **domain 层的服务依赖接口而不是具体实现**。
  

不过你还遇到了一个关键问题：

> ❗ **`RedissonCacheManager` 位于 `infrastructure.redis` 下，`LoginPort` 位于 `infrastructure.adapter.port` 下，同属一个模块，但使用了它要被 domain 调用，因此 domain 不能直接拿这个 Redis 的依赖。**

---

### ✅ 解决方案：通过接口 + 依赖注入解耦 `RedissonCacheManager`

#### 🎯 **目标**：domain 层永远不直接依赖 `infrastructure`，而是通过接口交互。

---

#### ✅ 步骤 1：在 domain 层定义 Redis 访问接口

例如：

```java
// site.dopplerxd.domain.auth.adapter.cache.RedisTokenCachePort
public interface RedisTokenCachePort {
    String getAccessToken();
    void setAccessToken(String token, long ttlSeconds);
    void putOpenidTicket(String ticket, String openid);
}
```

---

#### ✅ 步骤 2：在 infrastructure.redis 中实现这个接口

```java
// site.dopplerxd.infrastructure.redis.RedisTokenCacheAdapter

@Component
public class RedisTokenCacheAdapter implements RedisTokenCachePort {

    @Resource
    private RedissonCacheManager redissonCacheManager;

    @Override
    public String getAccessToken() {
        return redissonCacheManager.getAccessTokenBucket().get();
    }

    @Override
    public void setAccessToken(String token, long ttlSeconds) {
        redissonCacheManager.getAccessTokenBucket().set(token, ttlSeconds, TimeUnit.SECONDS);
    }

    @Override
    public void putOpenidTicket(String ticket, String openid) {
        redissonCacheManager.getOpenidTicketMap().put(ticket, openid);
    }
}
```

> 📌 现在 `RedissonCacheManager` 只存在于 `infrastructure` 层，domain 层永远看不到它，且没有循环依赖。

---

#### ✅ 步骤 3：在 domain 层注入 RedisTokenCachePort

```java
// site.dopplerxd.domain.auth.service.AuthDomainService

@Service
public class AuthDomainService implements IAuthDomainService {

    @Resource
    private RedisTokenCachePort redisTokenCachePort;

    @Resource
    private ILoginPort loginPort;

    @Override
    public void saveLoginState(String ticket, String openid) throws IOException {
        redisTokenCachePort.putOpenidTicket(ticket, openid);
        loginPort.sendLoginTemplate(openid);
    }
}
```

---

#### ✅ 结果结构图

```text
domain/
├── auth/
│   ├── service/
│   │   └── AuthDomainService.java
│   └── adapter/
│       ├── port/
│       │   ├── ILoginPort.java
│       │   └── RedisTokenCachePort.java

infrastructure/
├── adapter/
│   └── port/
│       └── LoginPort.java   // 实现 ILoginPort
├── redis/
│   ├── RedissonCacheManager.java
│   └── RedisTokenCacheAdapter.java  // 实现 RedisTokenCachePort
```

---

### ✅ 总结

|做法|是否推荐|原因|
|---|---|---|
|domain 直接用 `RedissonCacheManager`|❌ 不推荐|打破 DDD 依赖倒置，形成循环依赖|
|domain 定义 Redis 接口，infrastructure 实现|✅ 推荐|清晰职责分离，保持依赖倒置，灵活扩展|
|RedisCacheManager 的方法暴露给 domain|❌ 不推荐|domain 看到太多基础设施细节|



