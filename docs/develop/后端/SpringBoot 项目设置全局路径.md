在后端开发中，经常设置请求路径为 `/api` 开头，在 SpringBoot 项目中，可以通过修改 `application. yml` 或 `application.properties` 文件来实现。

以 `application. yml` 为例：

```yml
# 2.0 以上
server:
  servlet:
    context-path: /api
    
# 2.0 以下
server:
  context-path: /api
```