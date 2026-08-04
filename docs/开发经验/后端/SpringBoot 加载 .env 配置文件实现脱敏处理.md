项目开发中，当需要调用第三方服务时，常需要 `API_KEY` 进行鉴权，或使用数据库 ip 进行数据库连接，但直接将 ` API_KEY ` 硬编码拼接在代码中，会导致隐私泄露、不便维护等问题。于是我们可以通过 `.env ` 文件实现隐私信息配置。

1. 创建 `.env` 文件

在项目的根目录（与 `src` 同级）创建一个名为 `.env` 的文件，内容写成键值对形式： 

```
DEEPSEEK_API_KEY=sk_12345678**********************
```

2. 配置 `application.yml` 或 `application.properties` 读取 `.env` 文件

如使用 `application.yml`，在最顶部引入该文件，利用 `optional:` 前缀防止文件不存在时程序报错崩溃。对于多模块项目，也可修改 `.env` 文件的路径：

```yaml
spring:  
  config:  
    import:  
      - optional:file:.env[.properties]  
      - optional:file:../.env[.properties]

spring:
  ai:
    deepseek-api-key: ${DEEPSEEK_API_KEY}
```

3. 代码中读取变量

可使用 `@Value` 注解获取对应的变量，注意不要引成 `lombok` 包的了。

```java
import org.springframework.beans.factory.annotation.Value;

@Value("${spring.ai.deepseek.model}")  
private String deepseekModel;  
  
@Test  
public void test_api_key() {  
    log.info("配置的 DeepSeek 模型: {}", deepseekModel);  
}
```

4. 配置 `.gitignore` 忽略 `.env`

 最后，使用 `.env` 文件存储隐秘信息，就不能将其上传到 Github 等仓库中，需使用 `.gitignore` 来忽略 `.env`：

```text
.vscode/
.idea/

...

.env
```