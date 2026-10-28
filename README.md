# WebSocket 聊天室项目开发与使用文档

本文档详细介绍了如何运行、开发和使用本 WebSocket 聊天室项目。项目包含基于 Spring Boot 的后端和基于 React + Vite 的前端。

## 1. 项目结构

```
websocket/
├── backend/                # 后端项目 (Spring Boot)
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/example/websocket/
│   │       │       ├── config/         # WebSocket 配置
│   │       │       ├── handler/        # 消息处理器
│   │       │       └── WebsocketApplication.java # 启动类
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml            # Maven 依赖配置
│   └── settings.xml       # Maven 仓库配置 (解决内网/代理问题)
├── frontend/               # 前端项目 (React + Vite)
│   ├── src/
│   │   ├── App.jsx        # 主页面与聊天逻辑
│   │   └── main.jsx       # 入口文件
│   ├── package.json       # npm 依赖配置
│   └── vite.config.js     # Vite 配置
└── README.md              # 项目说明
```

## 2. 环境准备

在开始之前，请确保您的开发环境满足以下要求：

*   **Java**: JDK 11 或更高版本 (本项目配置为 JDK 11)
*   **Maven**: 3.6+ (通常集成在 IDE 中，也可使用命令行)
*   **Node.js**: v16+ (推荐 v18 或 v20)
*   **Yarn**: 包管理工具 (可通过 `npm install -g yarn` 安装)

## 3. 快速启动

### 3.1 启动后端服务

1.  打开终端，进入 `backend` 目录：
    ```bash
    cd backend
    ```
2.  运行 Spring Boot 应用：
    *   **注意**: 我们提供了一个 `settings.xml` 文件配置了阿里云/Maven中央仓库镜像，以避免连接私有仓库失败的问题。
    ```bash
    # 方式 1: 直接运行 (如果报错请尝试方式 2)
    mvn -s settings.xml clean spring-boot:run

    # 方式 2: 打包后运行 (推荐，更稳定)
    mvn -s settings.xml clean package
    java -jar target/websocket-demo-0.0.1-SNAPSHOT.jar
    ```
3.  等待控制台输出 `Started WebsocketApplication in ...`，表示后端已在端口 `8080` 启动。

### 3.2 启动前端应用

1.  打开一个新的终端窗口，进入 `frontend` 目录：
    ```bash
    cd frontend
    ```
2.  安装依赖 (如果尚未安装)：
    *   **注意**: 如果遇到网络问题，请确保已取消设置代理 (`unset http_proxy` / `unset https_proxy`)。
    ```bash
    yarn install
    ```
3.  启动开发服务器：
    ```bash
    yarn dev
    ```
4.  控制台将显示访问地址，通常为 `http://localhost:5173`。

## 4. 使用说明

1.  **打开页面**: 在浏览器中访问前端地址 (如 `http://localhost:5173`)。
2.  **登录**:
    *   在 "Enter your username" 输入框中输入您的昵称 (例如 "Alice")。
    *   点击 "Join Chat" 按钮。
3.  **多用户模拟**:
    *   打开一个新的浏览器标签页或隐身窗口。
    *   访问相同的地址。
    *   输入不同的昵称 (例如 "Bob") 并登录。
4.  **聊天**:
    *   在任一窗口的输入框中输入消息并发送。
    *   所有在线用户 (包括发送者) 都会立即收到该消息。
    *   系统会广播 "User joined/left the chat" 的通知。

## 5. 开发指南

### 5.1 后端开发 (Java/Spring Boot)

*   **核心逻辑**: 位于 `com.example.websocket.handler.ChatWebSocketHandler`。
    *   `afterConnectionEstablished`: 处理新连接，保存 Session。
    *   `handleTextMessage`: 处理接收到的消息，并广播给所有 Session。
    *   `afterConnectionClosed`: 处理连接关闭，移除 Session。
*   **配置**: 位于 `com.example.websocket.config.WebSocketConfig`。
    *   注册了 `/ws` 端点，并允许跨域 (`setAllowedOrigins("*")`)。

### 5.2 前端开发 (React)

*   **核心逻辑**: 位于 `src/App.jsx`。
    *   使用 `WebSocket` 原生 API 连接后端 (`ws://localhost:8080/ws?username=...`)。
    *   `onmessage` 回调用于接收并显示消息。
    *   `send` 方法用于发送消息。
*   **样式**: 位于 `src/index.css`，使用了简单的深色主题。

## 6. 常见问题排查

*   **后端启动报错 `NoClassDefFoundError`**:
    *   请确保 `pom.xml` 中包含了 `spring-websocket` 和 `spring-messaging` 依赖 (已默认添加)。
    *   尝试运行 `mvn -s settings.xml clean install` 重新编译。
*   **前端无法连接 WebSocket**:
    *   检查后端是否已成功启动在 8080 端口。
    *   检查浏览器控制台 (F12 -> Console) 是否有报错信息。
    *   确保没有防火墙拦截 8080 端口。
*   **依赖下载失败**:
    *   后端: 检查 `settings.xml` 是否生效，网络是否通畅。
    *   前端: 尝试删除 `node_modules` 和 `yarn.lock` 后重新 `yarn install`。
