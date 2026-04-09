---
id: springcloud
slug: /springcloud
title: SpringCloud 入门
authors: kuizuo
keywords: ['springcloud', 'spring cloud', '微服务', '服务注册', '网关']
displayed_sidebar: springcloudSidebar
---

## 什么是 SpringCloud

SpringCloud 是基于 SpringBoot 构建的**微服务开发工具集**，提供了一整套分布式系统解决方案，包括服务注册与发现、配置中心、负载均衡、熔断器、API 网关等组件。

## 微服务架构 vs 单体架构

| 维度 | 单体架构 | 微服务架构 |
|------|----------|------------|
| 部署 | 整体部署 | 独立部署 |
| 扩展 | 整体扩展 | 按需扩展 |
| 故障 | 影响整体 | 故障隔离 |
| 技术栈 | 统一 | 可异构 |
| 复杂度 | 低 | 高 |

## SpringCloud 核心组件

```
┌─────────────────────────────────────────────┐
│              客户端 / 浏览器                  │
└────────────────────┬────────────────────────┘
                     │
              ┌──────▼──────┐
              │  API 网关    │  Spring Cloud Gateway
              │  (Gateway)  │
              └──────┬──────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
  ┌────▼────┐   ┌────▼────┐  ┌────▼────┐
  │ 用户服务 │   │ 订单服务 │  │ 商品服务 │
  └────┬────┘   └────┬────┘  └────┬────┘
       │             │             │
       └─────────────┴─────────────┘
                     │
              ┌──────▼──────┐
              │  注册中心    │  Nacos / Eureka
              │  配置中心    │  Nacos / Config
              └─────────────┘
```

## 核心组件介绍

### 1. 服务注册与发现（Nacos）

服务启动时将自身信息注册到 Nacos，其他服务通过服务名调用，无需硬编码 IP。

**添加依赖：**

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

**配置：**

```yaml
spring:
  application:
    name: user-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
```

**启动类开启：**

```java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

### 2. 负载均衡（LoadBalancer）

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

```java
@Configuration
public class RestTemplateConfig {
    @Bean
    @LoadBalanced  // 开启负载均衡
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

@Service
public class OrderService {
    @Autowired
    private RestTemplate restTemplate;

    public User getUser(Long userId) {
        // 使用服务名调用，自动负载均衡
        return restTemplate.getForObject(
            "http://user-service/api/users/" + userId,
            User.class
        );
    }
}
```

### 3. OpenFeign（声明式 HTTP 客户端）

OpenFeign 让服务间调用像调本地方法一样简单：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

```java
// 启动类开启 Feign
@EnableFeignClients

// 声明 Feign 客户端
@FeignClient(name = "user-service")
public interface UserClient {
    @GetMapping("/api/users/{id}")
    User getById(@PathVariable Long id);

    @PostMapping("/api/users")
    User create(@RequestBody User user);
}

// 像调本地方法一样使用
@Service
@RequiredArgsConstructor
public class OrderService {
    private final UserClient userClient;

    public void createOrder(Long userId) {
        User user = userClient.getById(userId); // 自动发起 HTTP 请求
    }
}
```

### 4. API 网关（Spring Cloud Gateway）

网关作为统一入口，负责路由转发、鉴权、限流等：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service      # lb:// 开启负载均衡
          predicates:
            - Path=/api/users/**      # 匹配路径
          filters:
            - StripPrefix=0           # 不去除前缀

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
```

**自定义全局过滤器（鉴权）：**

```java
@Component
public class AuthFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // 越小越先执行
    }
}
```

### 5. 熔断降级（Sentinel）

防止服务雪崩，当下游服务不可用时快速返回降级结果：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

```yaml
feign:
  sentinel:
    enabled: true
```

```java
// Feign 客户端指定降级类
@FeignClient(name = "user-service", fallback = UserClientFallback.class)
public interface UserClient {
    @GetMapping("/api/users/{id}")
    User getById(@PathVariable Long id);
}

// 降级实现
@Component
public class UserClientFallback implements UserClient {
    @Override
    public User getById(Long id) {
        // 服务不可用时返回默认值
        return new User(id, "未知用户", "");
    }
}
```

### 6. 配置中心（Nacos Config）

集中管理所有服务的配置，支持动态刷新：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

```yaml
spring:
  config:
    import: nacos:user-service.yaml  # 从 Nacos 拉取配置
  cloud:
    nacos:
      config:
        server-addr: localhost:8848
        file-extension: yaml
```

```java
@RestController
@RefreshScope  // 支持配置动态刷新
public class ConfigController {
    @Value("${app.name:默认值}")
    private String appName;

    @GetMapping("/config")
    public String getConfig() {
        return appName;
    }
}
```

## 版本对应关系

| SpringCloud | SpringBoot | SpringCloud Alibaba |
|-------------|------------|---------------------|
| 2023.0.x    | 3.2.x      | 2023.0.1.x          |
| 2022.0.x    | 3.0.x      | 2022.0.0.x          |
| 2021.0.x    | 2.6.x      | 2021.0.x            |

## 本地启动 Nacos

```bash
# 下载 Nacos（单机模式）
docker run -d \
  --name nacos \
  -p 8848:8848 \
  -e MODE=standalone \
  nacos/nacos-server:v2.3.0

# 访问控制台
# http://localhost:8848/nacos
# 默认账号：nacos / nacos
```
