Springboot3 项目中，实体 User 属性 userAccount，数据库字段也为 userAccount，后端报错
```
### Error updating database.  Cause: java.sql.SQLSyntaxErrorException: Unknown column 'user_account' in 'field list'
### The error may exist in site/dopplerxd/backend/mapper/UserMapper.java (best guess)
### The error may involve site.dopplerxd.backend.mapper.UserMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO user  ( id, user_account, user_password )  VALUES (  ?, ?, ?  )
### Cause: java.sql.SQLSyntaxErrorException: Unknown column 'user_account' in 'field list'
```
原因是 Mybatis-Plus 自动将驼峰式命名转换为下划线了，解决方法有二：
1. 在配置文件中设置关闭即可
```yml
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: false
```
2. 通过 @TableField 注释来设置属性对应的字段名
```java
@Data
public class UserInfo {
    @TableId(value = "id")
    private Integer id;
    @TableField(value = "userAccount")
    private String userAccount;
}
```