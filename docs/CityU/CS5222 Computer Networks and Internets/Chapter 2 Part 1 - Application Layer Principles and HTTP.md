# Chapter 2 Part 1: Application Layer Principles and HTTP

## 一页速记

| 主题 | 核心结论 |
| --- | --- |
| 网络应用 | 应用程序运行在端系统，不需要在网络核心设备上部署应用逻辑 |
| 架构 | Client-server 有常在线服务器；P2P 由任意端系统直接通信并具有 self-scalability |
| 进程通信 | 不同主机上的 process 通过 message 交换数据；发起通信的是 client process |
| Socket | 应用进程访问 Transport 层服务的软件接口，是应用与网络之间的“门” |
| 进程寻址 | 目标进程由 IP address 与 port number 共同确定 |
| 应用层协议 | 定义 message types、syntax、semantics，以及发送和响应规则 |
| TCP/UDP | TCP 提供可靠、面向连接的传输；UDP 不保证可靠性，也无需连接建立 |
| HTTP | Web 的应用层协议，采用 client-server 模型，通常使用 TCP；HTTP 本身 stateless |

## 1. Network Application 的位置

网络应用运行在网络边缘的 end systems 上。例如浏览器与 Web server 分别运行在不同主机，通过网络交换消息。Router 等网络核心设备不运行用户应用，因此开发者只需更新端系统，应用便可快速部署。

## 2. Application Architectures

### Client-Server

**Server：**

- always on；
- 通常拥有永久 IP 地址；
- 可使用 data center 扩展容量。

**Client：**

- 主动联系 server；
- 可能间歇上线并使用动态 IP；
- 通常不直接与其他 client 通信。

### Peer-to-Peer

- 没有必须常在线的中心服务器；
- peers 直接通信；
- 每个 peer 既请求服务，也向其他 peer 提供服务；
- 新 peer 带来需求的同时也带来上传、存储或计算能力，因此具有 **self-scalability**；
- peer 经常上下线且 IP 会变化，管理、安全与一致性更复杂。

> 易错点：P2P 架构仍然存在 client process 与 server process。角色取决于某次通信中谁发起、谁等待，而不是取决于整套应用采用哪种架构。

## 3. Process 与 Socket

Process 是主机中正在运行的程序：

- 同一主机中的进程使用操作系统提供的 inter-process communication；
- 不同主机中的进程通过网络交换 messages；
- client process 发起通信；
- server process 等待被联系。

Socket 是应用进程发送和接收网络消息的软件接口。应用开发者控制 socket 上方的应用逻辑；操作系统控制其下方的 Transport、Network、Link 与 Physical 层实现。

## 4. Addressing Processes

只知道主机 IP 不能定位具体进程，因为同一主机可以同时运行多个网络应用。目标进程需要：

$$
\text{Process address}=\text{IP address}+\text{port number}
$$

- IP address 标识目标 host；
- port number 标识目标 host 中的接收进程。

课程示例：HTTP server 常用 port 80，SMTP mail server 常用 port 25。

## 5. Application-Layer Protocol

应用层协议需要定义：

1. **Message types**：例如 request 与 response；
2. **Syntax**：消息有哪些字段、如何分隔；
3. **Semantics**：每个字段表达什么含义；
4. **Rules**：进程何时发送、如何发送、何时响应。

### Open 与 Proprietary Protocols

- **Open protocol**：由 RFC 等公开标准定义，允许不同实现互操作，例如 HTTP、SMTP；
- **Proprietary protocol**：由单一组织控制，规范不一定公开。

## 6. 应用对 Transport Service 的需求

| 需求 | 含义 | 典型应用 |
| --- | --- | --- |
| Data integrity | 是否允许数据丢失 | 文件传输、邮件、Web transaction 要求无丢失；音视频可容忍少量丢失 |
| Timing | 是否对延迟敏感 | Internet telephony、互动游戏要求低延迟 |
| Throughput | 是否需要最低传输速率 | 多媒体通常需要最低吞吐量；elastic apps 会使用可获得的速率 |
| Security | 是否需要加密、完整性与身份认证 | 密码、交易与私密数据传输 |

## 7. TCP 与 UDP

### TCP 提供

- sending process 与 receiving process 之间的 reliable transport；
- flow control，避免发送方压垮接收方；
- congestion control，网络拥塞时限制发送速率；
- connection-oriented service，通信前需要建立连接。

### TCP 不直接保证

- 最大时延；
- 最低吞吐量；
- 原始 TCP 本身的数据加密。

### UDP

UDP 提供 connectionless、unreliable data transfer。它不保证可靠性、流量控制、拥塞控制、时延或最低吞吐量。

UDP 仍然有价值，因为它无需连接建立、协议开销小，应用可以自行控制重传和实时性。对延迟敏感且允许少量丢包的场景可能选择 UDP。

### 常见映射

| 应用 | 应用层协议 | Transport |
| --- | --- | --- |
| E-mail | SMTP | TCP |
| Remote terminal | Telnet | TCP |
| Web | HTTP | TCP |
| File transfer | FTP | TCP |
| Streaming multimedia | HTTP、RTP 等 | TCP 或 UDP |
| Internet telephony | SIP、RTP 或 proprietary protocol | TCP 或 UDP |

## 8. Securing TCP

TCP 与 UDP 原生不加密。若应用直接把明文密码写入 socket，数据会以明文穿过网络。

课程材料用 SSL 指代为 TCP 提供的安全能力：

- encryption；
- data integrity；
- endpoint authentication。

应用通过 SSL library 与 TCP 通信。现代实际系统通常使用 TLS，它是 SSL 的后继协议。

## 9. Web 与 HTTP

Web page 通常由一个 base HTML file 和多个 referenced objects 组成。Object 可以是 HTML、图片、音频等资源，每个对象都可以由 URL 寻址。

HTTP 是 Web 的应用层协议：

- browser 是 HTTP client，负责请求、接收并展示 Web objects；
- Web server 根据请求返回对象；
- client 通常先向 server 的 port 80 建立 TCP connection；
- TCP 建立后，双方交换 HTTP messages；
- 完成后可关闭 TCP connection。

### HTTP Is Stateless

HTTP server 不需要记住 client 之前的请求。Stateless 让协议和故障恢复更简单；若应用需要登录状态、购物车等功能，应用层可借助 cookie、token、session storage 或数据库保存状态。

> 易错点：HTTP stateless 不表示网站不能保存用户状态，而是 HTTP 协议对每次请求的基本处理不依赖过去请求。

## 高频易错点

1. Network application 运行在 end system，不运行在 network core。
2. Client process 是发起通信的一方；P2P 中也有 client/server process 角色。
3. IP 定位主机，port 定位主机上的进程。
4. Socket 是应用访问 Transport service 的 API，不是一种应用层协议。
5. TCP 可靠不等于提供时延或最低吞吐量保证。
6. UDP 不可靠不等于没有用途，它给应用更多控制并减少连接与协议开销。
7. HTTP 使用 TCP，但 HTTP 与 TCP 分属不同层。
8. HTTP stateless 与应用保存用户状态并不矛盾。

## 30 秒自测

1. Client-server 与 P2P 的主要区别是什么？
2. 为什么只使用 IP address 不能唯一确定目标进程？
3. 应用层协议需要定义哪四类内容？
4. 文件传输为什么更适合可靠传输？实时语音为什么可能容忍丢包？
5. TCP 提供哪些核心服务，又不保证哪些性能？
6. HTTP stateless 的准确含义是什么？

<details>
<summary>答案</summary>

1. Client-server 依赖常在线 server；P2P 由 peers 直接通信并共同提供容量。
2. 同一主机可以运行多个进程，还需要 port number 标识具体接收进程。
3. message types、syntax、semantics、发送与响应 rules。
4. 文件内容必须完整；实时语音更重视低时延，迟到的重传数据可能已失去播放价值。
5. TCP 提供可靠传输、flow control、congestion control 和连接服务；不保证时延、最低吞吐量或原生加密。
6. Server 无需依赖过去请求来解释当前 HTTP request；应用仍可在协议之上保存用户状态。

</details>
