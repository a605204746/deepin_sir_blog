---
id: springboot
slug: /springboot
title: SpringBoot 入门
authors: kuizuo
keywords: ['springboot', 'spring boot', '自动配置', '起步依赖']
displayed_sidebar: springbootSidebar
---

## 什么是 SpringBoot

SpringBoot 是 Spring 官方推出的**快速开发框架**，通过**自动配置**和**起步依赖**（Starter）极大简化了 Spring 应用的搭建过程。核心理念是「约定大于配置」，开箱即用，内嵌 Tomcat，无需部署 WAR 包。

## 与 Spring 的区别

| 特性 | Spring | SpringBoot |
|------|--------|------------|
| 配置方式 | 大量 XML/Java 配置 | 自动配置，极少手动配置 |
| 依赖管理 | 手动管理版本兼容 | Starter 统一管理 |
| 部署方式 | 需打包 WAR 部署 | 内嵌 Tomcat，直接运行 JAR |
| 开发效率 | 较低 | 高 |

## 快速创建项目

### 方式一：Spring Initializr（推荐）

访问 [https://start.spring.io](https://start.spring.io)，选择：
- Project：Maven
- Language：Java
- Spring Boot：3.x
- Dependencies：Spring Web、Spring Data JPA、MySQL Driver

### 方式二：IDEA 直接创建

`File → New → Project → Spring Initializr`，配置同上。

## 项目结构

```bash
springboot-demo
├── src/main/java/com/example/demo
│   ├── DemoApplication.java        # 启动类
│   ├── controller                  # 控制层
│   ├── service                     # 业务层
│   ├── repository                  # 数据层
│   └── entity                      # 实体类
├── src/main/resources
│   ├── application.yml             # 配置文件
│   └── static                      # 静态资源
├── src/test                        # 测试
└── pom.xml
```

## 启动类

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

`@SpringBootApplication` 是三个注解的组合：
- `@SpringBootConfiguration`：标识配置类
- `@EnableAutoConfiguration`：开启自动配置
- `@ComponentScan`：扫描组件

## 配置文件

SpringBoot 推荐使用 `application.yml`：

```yaml
server:
  port: 8080

spring:
  application:
    name: demo
  datasource:
    url: jdbc:mysql://localhost:3306/demo?useSSL=false&characterEncoding=utf8
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

logging:
  level:
    com.example: debug
```

### 多环境配置

```yaml
# application.yml
spring:
  profiles:
    active: dev  # 激活开发环境
```

```yaml
# application-dev.yml（开发）
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo_dev
```

```yaml
# application-prod.yml（生产）
server:
  port: 80
spring:
  datasource:
    url: jdbc:mysql://prod-server:3306/demo
```

## 写一个 RESTful 接口

### 实体类

```java
@Entity
@Table(name = "user")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
}
```

### Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

### Service

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
```

### Controller

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public List<User> list() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User get(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.save(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

## 常用 Starter

| Starter | 说明 |
|---------|------|
| `spring-boot-starter-web` | Web 开发，含 Spring MVC + Tomcat |
| `spring-boot-starter-data-jpa` | JPA + Hibernate |
| `spring-boot-starter-data-redis` | Redis 集成 |
| `spring-boot-starter-security` | Spring Security 安全框架 |
| `spring-boot-starter-validation` | 参数校验 |
| `spring-boot-starter-test` | 测试支持 |
| `spring-boot-starter-actuator` | 应用监控端点 |

## 参数校验

```java
@Data
public class UserRequest {
    @NotBlank(message = "姓名不能为空")
    private String name;

    @Email(message = "邮箱格式不正确")
    private String email;

    @Min(value = 1, message = "年龄最小为1")
    @Max(value = 150, message = "年龄最大为150")
    private Integer age;
}

@PostMapping
public User create(@Valid @RequestBody UserRequest request) {
    // 校验不通过会抛出 MethodArgumentNotValidException
}
```

## 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public Map<String, Object> handleRuntimeException(RuntimeException e) {
        return Map.of("code", 500, "message", e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleValidException(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining(", "));
        return Map.of("code", 400, "message", msg);
    }
}
```

## 打包运行

```bash
# 打包
mvn clean package -DskipTests

# 运行
java -jar target/demo-0.0.1-SNAPSHOT.jar

# 指定环境
java -jar target/demo.jar --spring.profiles.active=prod
```
