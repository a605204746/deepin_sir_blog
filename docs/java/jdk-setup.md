---
id: jdk-setup
slug: /java/jdk-setup
title: JDK 安装与环境配置
authors: kuizuo
keywords: ['java', 'jdk', '环境配置', '环境变量']
displayed_sidebar: javaSidebar
---

## 什么是 JDK

JDK（Java Development Kit）是 Java 开发工具包，包含了 JRE（Java 运行时环境）和开发工具（编译器 `javac`、调试器等）。安装 JDK 是 Java 开发的第一步。

常见版本：
- **JDK 8**：目前企业中使用最广泛的 LTS 版本
- **JDK 11**：第二个 LTS 版本，支持到 2026 年
- **JDK 17**：目前主流推荐的 LTS 版本
- **JDK 21**：最新 LTS 版本，支持虚拟线程等新特性

## 下载 JDK

推荐以下几个发行版：

| 发行版 | 地址 | 说明 |
|--------|------|------|
| Oracle JDK | https://www.oracle.com/java/technologies/downloads/ | 官方版本，商用需授权 |
| OpenJDK | https://jdk.java.net/ | 开源免费 |
| Eclipse Temurin | https://adoptium.net/ | 社区维护，推荐使用 |
| Azul Zulu | https://www.azul.com/downloads/ | 免费且支持多平台 |

## Windows 安装配置

### 1. 下载安装包

前往 [Eclipse Temurin](https://adoptium.net/) 选择对应版本下载 `.msi` 安装包，双击安装，记住安装路径（如 `C:\Program Files\Eclipse Adoptium\jdk-17.0.x`）。

### 2. 配置环境变量

右键「此电脑」→「属性」→「高级系统设置」→「环境变量」。

**新建系统变量 `JAVA_HOME`：**

```
变量名：JAVA_HOME
变量值：C:\Program Files\Eclipse Adoptium\jdk-17.0.x（改为你的实际安装路径）
```

**编辑系统变量 `Path`，新增：**

```
%JAVA_HOME%\bin
```

### 3. 验证安装

打开命令提示符（`Win + R` → 输入 `cmd`），执行：

```bash
java -version
javac -version
```

输出类似以下内容即表示配置成功：

```
openjdk version "17.0.10" 2024-01-16
OpenJDK Runtime Environment Temurin-17.0.10+7 (build 17.0.10+7)
OpenJDK 64-Bit Server VM Temurin-17.0.10+7 (build 17.0.10+7, mixed mode, sharing)
javac 17.0.10
```

## macOS 安装配置

### 方式一：使用 Homebrew（推荐）

```bash
# 安装 Homebrew（若未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 JDK 17
brew install --cask temurin@17

# 验证
java -version
```

### 方式二：手动安装

下载 `.pkg` 安装包，双击安装后配置环境变量。

编辑 `~/.zshrc`（zsh）或 `~/.bash_profile`（bash）：

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH
```

使配置生效：

```bash
source ~/.zshrc
```

## Linux 安装配置

### Ubuntu / Debian

```bash
# 更新包列表
sudo apt update

# 安装 JDK 17
sudo apt install openjdk-17-jdk -y

# 验证
java -version
```

### CentOS / RHEL

```bash
# 安装 JDK 17
sudo yum install java-17-openjdk-devel -y

# 验证
java -version
```

### 手动配置 JAVA_HOME（Linux 通用）

```bash
# 查找 JDK 安装路径
which java
# 或
readlink -f $(which java)

# 编辑 /etc/profile 或 ~/.bashrc
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# 使配置生效
source /etc/profile
```

## 多版本 JDK 管理

实际开发中可能需要同时维护多个 JDK 版本，推荐使用以下工具：

### SDKMAN（macOS / Linux）

```bash
# 安装 SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 安装指定版本
sdk install java 17.0.10-tem
sdk install java 11.0.22-tem

# 切换版本
sdk use java 17.0.10-tem

# 设置默认版本
sdk default java 17.0.10-tem

# 查看已安装版本
sdk list java
```

### jenv（macOS / Linux）

```bash
# 安装 jenv
brew install jenv

# 添加 JDK
jenv add /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home

# 设置全局版本
jenv global 17.0

# 设置项目级版本（在项目目录下执行）
jenv local 11.0
```

## 常见问题

**Q：`java` 命令找不到？**

检查 `JAVA_HOME` 是否正确，`Path` 中是否包含 `%JAVA_HOME%\bin`，配置完需重启终端。

**Q：`java -version` 和 `javac -version` 版本不一致？**

系统中可能安装了多个 JDK，检查 `Path` 中 JDK 路径的顺序，排在前面的优先生效。

**Q：选哪个版本？**

- 新项目推荐 **JDK 17** 或 **JDK 21**（LTS 版本）
- 维护老项目根据项目要求选择，通常是 JDK 8 或 JDK 11
