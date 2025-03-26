用 `.class`、`getClass()`、`Class.forName()` 或类加载器，根据场景选择。

### 1. 类名.class

直接通过类的字面量获取，适用于编译时已知类名的情况。

```java
Class<String> clazz = String.class;
```

### 2. 对象.getClass()

通过实例对象获取其运行时类。

```java
String str = "Hello";
Class<?> clazz = str.getClass();
```

### 3. Class.forName("全限定类名")

通过类的全限定名（包名+类名）动态加载类，常用于反射。

```java
Class<?> clazz = Class.forName("java.lang.String");
```

### 4. 类加载器.loadClass("类名")

通过 `ClassLoader` 显式加载类（不初始化静态块）。

```java
Class<?> clazz = ClassLoader.getSystemClassLoader().loadClass("java.lang.String");
```

### 5. 包装类的 TYPE 字段

基本数据类型通过 `TYPE` 获取（如 `int.class` 的等价方式）。

```java
Class<Integer> intClass = Integer.TYPE; // 等同于 int.class
```

### 区别总结

|方法|适用场景|是否初始化静态块|
|---|---|---|
|`类名.class`|编译时已知类名|否（延迟初始化）|
|`对象.getClass()`|运行时获取实例类型|已初始化|
|`Class.forName()`|动态加载类（如JDBC驱动）|是（默认初始化）|
|`ClassLoader.loadClass()`|显式控制类加载过程|否（不初始化）|
|`包装类.TYPE`|基本数据类型的类对象|不适用|

