---
tags:
  - 面试
  - Spring
  - 框架
---
## Spring

### 什么是 Spring 框架？

Spring 是一款开源的轻量级 Java 开发框架，旨在提高开发人员的开发效率以及系统的可维护性。

我们一般说 Spring 框架指的都是 Spring Framework，它是很多模块的集合，使用这些模块可以很方便地协助我们进行开发，比如说 Spring 支持 IoC（Inversion of Control:控制反转） 和 AOP(Aspect-Oriented Programming:面向切面编程)、可以很方便地对数据库进行访问、可以很方便地集成第三方组件（电子邮件，任务，调度，缓存等等）、对单元测试支持比较好、支持 RESTful Java 应用程序的开发。

Spring 最核心的思想就是不重新造轮子，开箱即用，提高开发效率。最核心的功能是 IoC 和 AOP。

### 列举一些重要的 Spring 模块？

#### Core Container

Spring 框架的核心模块，也可以说是基础模块，主要提供 IoC 依赖注入功能的支持。Spring 其他所有的功能基本都需要依赖于该模块，我们从上面那张 Spring 各个模块的依赖关系图就可以看出来。

+ spring-core：Spring 框架基本的核心工具类。
+ spring-beans：提供对 bean 的创建、配置和管理等功能的支持。
+ spring-context：提供对国际化、事件传播、资源加载等功能的支持。
+ spring-expression：提供对表达式语言（Spring Expression Language） SpEL 的支持，只依赖于 core 模块，不依赖于其他模块，可以单独使用。

#### AOP

+ spring-aspects：该模块为与 AspectJ 的集成提供支持。
+ spring-aop：提供了面向切面的编程实现。
+ spring-instrument：提供了为 JVM 添加代理（agent）的功能。 具体来讲，它为 Tomcat 提供了一个织入代理，能够为 Tomcat 传递类文 件，就像这些文件是被类加载器加载的一样。没有理解也没关系，这个模块的使用场景非常有限。

#### Data Access/Integration

+ spring-jdbc：提供了对数据库访问的抽象 JDBC。不同的数据库都有自己独立的 API 用于操作数据库，而 Java 程序只需要和 JDBC API 交互，这样就屏蔽了数据库的影响。
+ spring-tx：提供对事务的支持。
+ spring-orm：提供对 Hibernate、JPA、iBatis 等 ORM 框架的支持。
+ spring-oxm：提供一个抽象层支撑 OXM(Object-to-XML-Mapping)，例如：JAXB、Castor、XMLBeans、JiBX 和 XStream 等。
+ spring-jms : 消息服务。自 Spring Framework 4.1 以后，它还提供了对 spring-messaging 模块的继承。

#### Spring Web

+ spring-web：对 Web 功能的实现提供一些最基础的支持。
+ spring-webmvc：提供对 Spring MVC 的实现。
+ spring-websocket：提供了对 WebSocket 的支持，WebSocket 可以让客户端和服务端进行双向通信。
+ spring-webflux：提供对 WebFlux 的支持。WebFlux 是 Spring Framework 5.0 中引入的新的响应式框架。与 Spring MVC 不同，它不需要 Servlet API，是完全异步。

#### Messaging

spring-messaging 是从 Spring4.0 开始新加入的一个模块，主要职责是为 Spring 框架集成一些基础的报文传送应用。

#### Spring Test

Spring 团队提倡测试驱动开发（TDD）。有了控制反转 (IoC)的帮助，单元测试和集成测试变得更简单。

Spring 的测试模块对 JUnit（单元测试框架）、TestNG（类似 JUnit）、Mockito（主要用来 Mock 对象）、PowerMock（解决 Mockito 的问题比如无法模拟 final, static， private 方法）等等常用的测试框架支持的都比较好。

### 谈谈自己对于 Spring IoC 和 AOP 的理解

#### IoC

**IoC（Inversion of Control:控制反转）** 是一种设计思想，而不是一个具体的技术实现。IoC 的思想就是将原本在程序中手动创建对象的控制权，交由 Spring 框架来管理。不过， IoC 并非 Spring 特有，在其他语言中也有应用。

为什么叫控制反转？

+ 控制：指的是对象创建（实例化、管理）的权力
+ 反转：控制权交给外部环境（Spring 框架、IoC 容器）

![](assets/Pasted%20image%2020250305213204.png)

将对象之间的相互依赖关系交给 IoC 容器来管理，并由 IoC 容器完成对象的注入。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。 IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。

在实际项目中一个 Service 类可能依赖了很多其他的类，假如我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IoC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。

在 Spring 中， IoC 容器是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个 Map（key，value），Map 中存放的是各种对象。

Spring 时代我们一般通过 XML 文件来配置 Bean，后来开发人员觉得 XML 文件来配置不太好，于是 SpringBoot 注解配置就慢慢开始流行起来。

#### AOP

AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 JDK Proxy，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 Cglib 生成一个被代理对象的子类来作为代理，如下图所示：

![](assets/Pasted%20image%2020250305213307.png)

### Spring Bean 的生命周期说一下

1. 创建 Bean 的实例：Bean 容器首先会找到配置文件中的 Bean 定义，然后使用 Java 反射 API 来创建 Bean 的实例。
2. Bean 属性赋值/填充：为 Bean 设置相关属性和依赖，例如 `@Autowired` 等注解注入的对象、`@Value` 注入的值、`setter` 方法或构造函数注入依赖和值、`@Resource` 注入的各种资源。
3. Bean 初始化：
    + 如果 Bean 实现了 `BeanNameAware` 接口，调用 `setBeanName()` 方法，传入 Bean 的名字。
    + 如果 Bean 实现了 `BeanClassLoaderAware` 接口，调用 `setBeanClassLoader()` 方法，传入 `ClassLoader` 对象的实例。
    + 如果 Bean 实现了 `BeanFactoryAware` 接口，调用 `setBeanFactory()` 方法，传入 `BeanFactory` 对象的实例。
    + 与上面的类似，如果实现了其他 `*.Aware` 接口，就调用相应的方法。
    + 如果有和加载这个 Bean 的 Spring 容器相关的 `BeanPostProcessor` 对象，执行 `postProcessBeforeInitialization()` 方法
    + 如果 Bean 实现了 `InitializingBean` 接口，执行 `afterPropertiesSet()` 方法。
    + 如果 Bean 在配置文件中的定义包含 init-method 属性，执行指定的方法。
    + 如果有和加载这个 Bean 的 Spring 容器相关的 `BeanPostProcessor` 对象，执行 `postProcessAfterInitialization()` 方法。
4. 销毁 Bean：销毁并不是说要立马把 Bean 给销毁掉，而是把 Bean 的销毁方法先记录下来，将来需要销毁 Bean 或者销毁容器的时候，就调用这些方法去释放 Bean 所持有的资源。
    + 如果 Bean 实现了 `DisposableBean` 接口，执行 `destroy()` 方法。
    + 如果 Bean 在配置文件中的定义包含 destroy-method 属性，执行指定的 Bean 销毁方法。或者，也可以直接通过@PreDestroy 注解标记 Bean 销毁之前执行的方法。

`AbstractAutowireCapableBeanFactory` 的 `doCreateBean()` 方法中能看到依次执行了这 4 个阶段：

```java
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
    throws BeanCreationException {

    // 1. 创建 Bean 的实例
    BeanWrapper instanceWrapper = null;
    if (instanceWrapper == null) {
        instanceWrapper = createBeanInstance(beanName, mbd, args);
    }

    Object exposedObject = bean;
    try {
        // 2. Bean 属性赋值/填充
        populateBean(beanName, mbd, instanceWrapper);
        // 3. Bean 初始化
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }

    // 4. 销毁 Bean-注册回调接口
    try {
        registerDisposableBeanIfNecessary(beanName, bean, mbd);
    }

    return exposedObject;
}
```

`Aware` 接口能让 Bean 能拿到 Spring 容器资源。

Spring 中提供的 `Aware` 接口主要有：

1. `BeanNameAware`：注入当前 bean 对应 beanName；
2. `BeanClassLoaderAware`：注入加载当前 bean 的 ClassLoader；
3. `BeanFactoryAware`：注入当前 `BeanFactory` 容器的引用。

`BeanPostProcessor` 接口是 Spring 为修改 Bean 提供的强大扩展点。

```java
public interface BeanPostProcessor {

	// 初始化前置处理
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	// 初始化后置处理
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

}
```

+ `postProcessBeforeInitialization`：Bean 实例化、属性注入完成后， `InitializingBean#afterPropertiesSet` 方法以及自定义的 `init-method` 方法之前执行；
+ `postProcessAfterInitialization`：类似于上面，不过是在 `InitializingBean#afterPropertiesSet` 方法以及自定义的 `init-method` 方法之后执行。

`InitializingBean` 和 `init-method` 是 Spring 为 Bean 初始化提供的扩展点。

```java
public interface InitializingBean {
 // 初始化逻辑
	void afterPropertiesSet() throws Exception;
}
```

指定 `init-method` 方法，指定初始化方法：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="demo" class="com.chaycao.Demo" init-method="init()"/>

</beans>
```

**如何记忆呢？**

1. 整体上可以简单分为四步：实例化 —> 属性赋值 —> 初始化 —> 销毁。
2. 初始化这一步涉及到的步骤比较多，包含 Aware 接口的依赖注入、BeanPostProcessor 在初始化前后的处理以及 InitializingBean 和 init-method 的初始化操作。
3. 销毁这一步会注册相关销毁回调接口，最后通过DisposableBean 和 destory-method 进行销毁。

图源：[如何记忆 Spring Bean 的生命周期](https://chaycao.github.io/2020/02/15/%E5%A6%82%E4%BD%95%E8%AE%B0%E5%BF%86Spring-Bean%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.html)

![](assets/Pasted%20image%2020250305215638.png)

### Spring 中的 bean 的作用域有哪些？

Spring 中 Bean 的作用域通常有下面几种：

+ singleton : IoC 容器中只有唯一的 bean 实例。Spring 中的 bean 默认都是单例的，是对单例设计模式的应用。
+ prototype : 每次获取都会创建一个新的 bean 实例。也就是说，连续 getBean() 两次，得到的是不同的 Bean 实例。
+ request （仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
+ session （仅 Web 应用可用） : 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
+ application/global-session （仅 Web 应用可用）：每个 Web 应用在启动时创建一个 Bean（应用 Bean），该 bean 仅在当前应用启动时间内有效。
+ websocket （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

**如何配置 bean 的作用域呢？**

xml 方式：

```xml
<bean id="..." class="..." scope="singleton"></bean>
```

注解方式：

```java
@Bean
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public Person personPrototype() {
    return new Person();
}
```

### 拦截器和过滤器了解么？



### Spring 动态代理默认用哪⼀种



### hibernate 和 mybatis 区别



### Spring Boot 和 Spring 的区别



### 说出使用 Spring Boot 的主要优点



### 什么是 Spring Boot Starter？



### 介绍⼀下 @SpringBootApplication 注解



### Spring Boot 的自动配置是如何实现的？



### Spring Boot 支持哪些嵌入式 web 容器


