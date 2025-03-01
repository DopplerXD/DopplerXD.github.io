## 一、添加合适版本的依赖
以 maven 为例：
```xml
<dependency>
	<groupId>com.github.xiaoymin</groupId>
	<artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
	<!-- 选择与 SpringDoc 兼容的版本 -->
	<version>4.4.0</version>
</dependency>
<dependency>
	<groupId>org.springdoc</groupId>
	<artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
	<!-- 选择稳定且兼容的版本 -->
	<version>2.2.0</version>
</dependency>
```

## 二、设置配置文件
```yml
# springdoc-openapi项目配置
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
    enabled: true
  api-docs:
    path: /v3/api-docs
    enabled: true
  group-configs:
    - group: 'default'
      paths-to-match: '/**'
      #生成文档所需的扫包路径，一般为启动类目录
      packages-to-scan: site.dopplerxd.backend
# knife4j的增强配置，不需要增强可以不配
#knife4j配置
knife4j:
  #是否启用增强设置
  enable: true
  #开启生产环境屏蔽
  production: false
  #是否启用登录认证
  basic:
    enable: true
    username: admin
    password: 123456
  setting:
    language: zh_cn
    enable-version: true
    enable-swagger-models: true
    swagger-model-name: 用户模块
```

## 三、添加配置类
设置 SwaggerConfig.java：
```java
package site.dopplerxd.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI swaggerOpenApi() {
        return new OpenAPI()
                .info(new Info().title("doppler's demo")
                        .description("基于 Knife4j OpenApi3 的测试接口文档")
                        .version("v1.0.0")
                        .contact(new Contact().name("DopplerXD")
                                .email("1509209607@qq.com")));
    }
}
```

## 四、编写测试接口
```java
package site.dopplerxd.backend.test;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author doppleryxc
 */
@RestController
@Tag(name = "用户接口")
@RequestMapping("/user")
public class TestController {

    @Operation(summary = "用户信息")
    @GetMapping("/info")
    public String test(){
        return "User Info";
    }

    @Operation(summary = "你好")
    @GetMapping("/hello")
    public Object test2(){
        return "hello";
    }
}
```

最后启动 SpringBoot 项目的启动类，导航栏输入 http://localhost:port/doc.html 打开接口文档
![[assets/Pasted image 20250218215206.png]]