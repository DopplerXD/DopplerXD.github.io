我遇到了 `@Data` 注解不生效的问题，发现需要在设置中将 Annotation Processors 中 Default 和具体 profile 的选项都设置为 Obtain processors from project classpath。

但是每次 mvn clean 之后，profile  的设置就失效。

再次查询一番，发现 `pom.xml` 中注释相应语句能够解决。

涉及到两项，一个是要删除 lombok 依赖的 optional 选项；还有一个是要注释掉插件中的 maven-compiler-plugin

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
<!--            <optional>true</optional>-->
    <version>1.18.36</version>
    <scope>provided</scope>
</dependency>
        
<build>
        <plugins>
<!--            <plugin>-->
<!--                <groupId>org.apache.maven.plugins</groupId>-->
<!--                <artifactId>maven-compiler-plugin</artifactId>-->
<!--                <configuration>-->
<!--                    <annotationProcessorPaths>-->
<!--                        <path>-->
<!--                            <groupId>org.projectlombok</groupId>-->
<!--                            <artifactId>lombok</artifactId>-->
<!--                        </path>-->
<!--                    </annotationProcessorPaths>-->
<!--                </configuration>-->
<!--            </plugin>-->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
```