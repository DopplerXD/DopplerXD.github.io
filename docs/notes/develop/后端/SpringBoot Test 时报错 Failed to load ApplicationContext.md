我在测试时遇到了 `Failed to load ApplicationContext` 报错，原因是

解决方法：

完善测试类的注解，添加 `classes = {Application.class}, webEnvironment = SpringBootTest.WebEnvironment.NONE`，比如我的测试类名是 `ApiTest`，那么 `Application.class` 就写 `ApiTest.class`。

```java
@SpringBootTest(classes = {ApiTest.class}, webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ApiTest {
    ...
}
```