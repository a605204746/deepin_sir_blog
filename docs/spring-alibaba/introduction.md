---
id: spring-alibaba
slug: /spring-alibaba
title: Spring Alibaba 入门
authors: kuizuo
keywords: ['spring alibaba', 'spring cloud alibaba', 'nacos', 'sentinel', 'seata']
displayed_sidebar: springalibabaSidebar
---

## 什么是 Spring Cloud Alibaba

Spring Cloud Alibaba 是阿里巴巴开源的**微服务一站式解决方案**，是 SpringCloud 生态的重要扩展，提供了一系列生产级的微服务组件，广泛应用于国内企业项目。

## 核心组件总览

| 组件 | 功能 | 对标 |
|------|------|------|
| **Nacos** | 服务注册、发现、配置管理 | Eureka + Config + Bus |
| **Sentinel** | 流量控制、熔断降级、系统保护 | Hystrix |
| **Seata** | 分布式事务 | — |
| **RocketMQ** | 消息队列 | Kafka / RabbitMQ |
| **OSS** | 对象存储 | — |
| **SchedulerX** | 分布式任务调度 | XXL-Job |

## 版本依赖

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2023.0.1.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## Nacos 详解

### 服务注册与发现

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

```yaml
spring:
  application:
    name: order-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        namespace: dev                # 命名空间（环境隔离）
        group: ORDER_GROUP            # 分组
```

### 配置管理

Nacos 配置中心支持**动态推送**，修改配置无需重启服务：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

```yaml
spring:
  config:
    import: nacos:order-service.yaml?group=ORDER_GROUP&namespace=dev
  cloud:
    nacos:
      config:
        server-addr: localhost:8848
        file-extension: yaml
        refresh-enabled: true         # 开启动态刷新
```

**在 Nacos 控制台** (`http://localhost:8848/nacos`) 新建配置：
- Data ID：`order-service.yaml`
- Group：`ORDER_GROUP`
- 配置内容：

```yaml
order:
  timeout: 30
  max-retry: 3
```

**代码中使用：**

```java
@RestController
@RefreshScope
public class OrderController {

    @Value("${order.timeout:60}")
    private int timeout;

    @Value("${order.max-retry:1}")
    private int maxRetry;

    @GetMapping("/config")
    public Map<String, Object> config() {
        return Map.of("timeout", timeout, "maxRetry", maxRetry);
    }
}
```

## Sentinel 详解

Sentinel 以流量为切入点，提供限流、熔断、降级等多维度保护。

### 快速集成

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080   # Sentinel 控制台地址
        port: 8719
      eager: true
```

### 注解方式限流降级

```java
@Service
public class ProductService {

    @SentinelResource(
        value = "getProduct",          // 资源名
        blockHandler = "blockHandler", // 限流/熔断时调用
        fallback = "fallback"          // 业务异常时调用
    )
    public Product getProduct(Long id) {
        // 业务逻辑
        return productDao.findById(id);
    }

    // 限流降级处理（参数必须与原方法一致，加 BlockException）
    public Product blockHandler(Long id, BlockException ex) {
        return new Product(id, "服务繁忙，请稍后重试", 0);
    }

    // 业务异常降级
    public Product fallback(Long id, Throwable t) {
        return new Product(id, "服务异常", 0);
    }
}
```

### 启动 Sentinel 控制台

```bash
# 下载 sentinel-dashboard.jar 后启动
java -Dserver.port=8080 \
     -Dcsp.sentinel.dashboard.server=localhost:8080 \
     -jar sentinel-dashboard-1.8.8.jar
```

访问：`http://localhost:8080`，账号密码均为 `sentinel`

## Seata 分布式事务

Seata 解决跨服务调用时的数据一致性问题，支持 AT、TCC、SAGA、XA 四种模式。

### AT 模式（最常用）

AT 模式无需修改业务代码，通过代理数据源自动管理事务：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
```

```yaml
seata:
  tx-service-group: my_tx_group
  service:
    vgroup-mapping:
      my_tx_group: default
  registry:
    type: nacos
    nacos:
      server-addr: localhost:8848
```

```java
@Service
public class OrderService {

    @GlobalTransactional  // 开启全局事务（代替 @Transactional）
    public void createOrder(OrderDTO dto) {
        // 1. 扣减库存（调用库存服务）
        inventoryClient.decrease(dto.getProductId(), dto.getQuantity());

        // 2. 创建订单（本地操作）
        orderDao.insert(new Order(dto));

        // 3. 扣减余额（调用账户服务）
        accountClient.deduct(dto.getUserId(), dto.getAmount());

        // 任何一步失败，全局回滚
    }
}
```

## RocketMQ 集成

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-stream-rocketmq</artifactId>
</dependency>
```

```yaml
spring:
  cloud:
    stream:
      rocketmq:
        binder:
          name-server: localhost:9876
      bindings:
        output:
          destination: order-topic
          content-type: application/json
        input:
          destination: order-topic
          group: order-consumer-group
```

**发送消息：**

```java
@RestController
@RequiredArgsConstructor
public class OrderController {
    private final StreamBridge streamBridge;

    @PostMapping("/orders")
    public String createOrder(@RequestBody OrderDTO dto) {
        streamBridge.send("output", dto);
        return "消息已发送";
    }
}
```

**消费消息：**

```java
@Component
public class OrderConsumer {

    @StreamListener("input")
    public void handleOrder(OrderDTO dto) {
        System.out.println("收到订单消息：" + dto);
        // 处理订单业务
    }
}
```

## 启动 Nacos（Docker）

```bash
docker run -d \
  --name nacos \
  -p 8848:8848 \
  -p 9848:9848 \
  -e MODE=standalone \
  -e SPRING_DATASOURCE_PLATFORM=mysql \
  nacos/nacos-server:v2.3.0
```

## 组件选型建议

| 场景 | 推荐组件 |
|------|---------|
| 服务注册发现 | Nacos Discovery |
| 配置中心 | Nacos Config |
| 限流熔断 | Sentinel |
| 分布式事务 | Seata AT 模式 |
| 消息队列 | RocketMQ |
| 任务调度 | SchedulerX 或 XXL-Job |
