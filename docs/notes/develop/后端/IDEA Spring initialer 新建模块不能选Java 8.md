如下图所示，我可以设置项目 JDK 为 1.8，但是不能选择 Java 8

![](assets/Pasted%20image%2020250325110319.png)

原因是 SpringBoot 在较高版本不支持 JDK 8 了，而服务器 URL 默认是 https://start.spring.io ，改成 https://start.aliyun.com/ 就可以选择 Java 8 了。

![](assets/Pasted%20image%2020250325110638.png)