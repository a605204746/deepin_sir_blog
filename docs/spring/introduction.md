---
id: spring
slug: /spring
title: Spring 框架入门
authors: kuizuo
keywords: ['spring', 'spring框架', 'ioc', 'aop']
displayed_sidebar: springSidebar
---

## 什么是 Spring

Spring 是 Java 生态中最流行的开源框架，由 Rod Johnson 于 2003 年创建。它的核心目标是**简化企业级 Java 开发**，通过 IoC（控制反转）和 AOP（面向切面编程）两大核心特性，解耦组件之间的依赖关系，让代码更易测试和维护。

## 核心模块

| 模块 | 说明 |
|------|------|
| Spring Core | IoC 容器，管理 Bean 的生命周期 |
| Spring AOP | 面向切面编程，日志、事务等横切关注点 |
| Spring MVC | Web 层框架，处理 HTTP 请求 |
| Spring JDBC | 简化 JDBC 操作，提供事务管理 |
| Spring Test | 单元测试与集成测试支持 |

## 核心概念

### IoC（控制反转）

传统开发中对象由自己创建依赖，IoC 将这个控制权交给容器：

```java
// 传统方式：手动创建依赖
public class UserService {
    private UserDao userDao = new UserDao(); // 自己创建
}

// IoC 方式：由容器注入
@Service
public class UserService {
    @Autowired
    private UserDao userDao; // 容器注入
}
```

### DI（依赖注入）

DI 是 IoC 的实现方式，Spring 支持三种注入方式：

**1. 构造器注入（推荐）**

```java
@Service
public class UserService {
    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
}
```

**2. Setter 注入**

```java
@Service
public class UserService {
    private UserDao userDao;

    @Autowired
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
}
```

**3. 字段注入（不推荐用于生产）**

```java
@Service
public class UserService {
    @Autowired
    private UserDao userDao;
}
```

### AOP（面向切面编程）

AOP 将横切关注点（日志、事务、权限）从业务逻辑中分离出来：

```java
@Aspect
@Component
public class LogAspect {

    // 切入点：service 包下所有方法
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethod() {}

    // 方法执行前后打印日志
    @Around("serviceMethod()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("方法开始: " + pjp.getSignature().getName());
        Object result = pjp.proceed();
        System.out.println("方法结束: " + pjp.getSignature().getName());
        return result;
    }
}
```

## 快速开始

### 1. 添加依赖（Maven）

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>6.1.0</version>
    </dependency>
</dependencies>
```

### 2. 创建 Bean

```java
@Component
public class HelloService {
    public String greet(String name) {
        return "Hello, " + name + "!";
    }
}
```

### 3. 配置并启动容器

```java
@Configuration
@ComponentScan("com.example")
public class AppConfig {
}

public class Main {
    public static void main(String[] args) {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
        HelloService service = ctx.getBean(HelloService.class);
        System.out.println(service.greet("深度先生"));
    }
}
```

## 常用注解

| 注解 | 说明 |
|------|------|
| `@Component` | 通用组件，交由 Spring 管理 |
| `@Service` | 标识业务层 |
| `@Repository` | 标识数据访问层 |
| `@Controller` | 标识控制层 |
| `@Autowired` | 自动注入依赖 |
| `@Configuration` | 标识配置类 |
| `@Bean` | 在配置类中声明 Bean |
| `@Value` | 注入配置值 |
| `@Transactional` | 声明事务 |

## Bean 的作用域

```java
@Component
@Scope("singleton")  // 默认：单例
public class SingletonBean {}

@Component
@Scope("prototype")  // 每次获取创建新实例
public class PrototypeBean {}
```

| 作用域 | 说明 |
|--------|------|
| `singleton` | 单例（默认），容器中只有一个实例 |
| `prototype` | 原型，每次获取创建新实例 |
| `request` | Web 环境，每个 HTTP 请求一个实例 |
| `session` | Web 环境，每个 Session 一个实例 |

## 事务管理

```java
@Service
public class OrderService {

    @Transactional
    public void createOrder(Order order) {
        orderDao.insert(order);
        inventoryDao.decrease(order.getProductId(), order.getQuantity());
        // 任何异常都会回滚
    }

    @Transactional(readOnly = true)
    public Order getOrder(Long id) {
        return orderDao.findById(id);
    }
}
```
