# Chapter 2 Part 2: HTTP, Email and DNS

## 一页速记

| 主题 | 核心结论 |
| --- | --- |
| HTTP 连接 | 非持久的超文本传输协议（Hypertext Transfer Protocol，HTTP）每条传输控制协议（Transmission Control Protocol，TCP）连接最多传一个对象；持久 HTTP 可在同一连接上传输多个对象 |
| 响应时间 | 非持久 HTTP 获取单个对象约需 $2RTT+$ 文件传输时间 |
| 并发连接 | 浏览器可并行建立多个连接以减少队头阻塞，但会增加服务器开销并影响公平性 |
| HTTP 报文 | 请求报文由请求行、首部行、空行和可选实体主体组成 |
| Cookie | 通过响应首部、浏览器 Cookie 文件、后端数据库和后续请求首部维持用户状态 |
| Web 缓存 | 缓存命中时直接返回对象；未命中时缓存代表客户端访问源服务器 |
| 电子邮件 | 简单邮件传输协议（Simple Mail Transfer Protocol，SMTP）负责服务器间发送；邮局协议第 3 版（Post Office Protocol version 3，POP3）、互联网消息访问协议（Internet Message Access Protocol，IMAP）或 HTTP 负责用户读取邮件 |
| DNS | 域名系统（Domain Name System，DNS）是分布式、层次化数据库，把主机名映射为 IP 地址并提供别名、邮件路由和负载分配 |
| DNS 查询 | 主机到本地 DNS 通常使用递归查询；本地 DNS 向层次结构查询时通常使用迭代查询 |

## 1. HTTP 连接方式

HTTP 运行在 TCP 之上。浏览器获取一个包含多个对象的网页时，可以为每个对象建立独立连接，也可以复用已有连接。

### 1.1 非持久 HTTP

非持久 HTTP（non-persistent HTTP）中，每条 TCP 连接最多传输一个对象，响应完成后服务器关闭连接。

假设用户访问 `www.someSchool.edu/someDepartment/home.index`：

1. HTTP 客户端连接服务器的 80 端口；
2. 服务器接受 TCP 连接；
3. 客户端发送包含对象路径的 HTTP 请求；
4. 服务器返回包含对象的 HTTP 响应，然后关闭连接；
5. 浏览器接收并解析基础 HTML 文件；
6. 浏览器为 HTML 引用的每个对象重复上述过程。

若页面包含一个基础 HTML 文件和 10 张图片，浏览器需要获取 11 个对象。顺序执行的非持久 HTTP 通常需要为每个对象建立连接。

### 1.2 非持久 HTTP 的响应时间

往返时间（Round-Trip Time，RTT）是一个小分组从客户端到服务器再返回客户端所需的时间。

获取单个对象时：

- 建立 TCP 连接需要 1 RTT；
- 发送 HTTP 请求并收到响应的前几个字节需要 1 RTT；
- 接收完整对象还需要文件传输时间。

因此，忽略其他开销时：

$$
d_{response}=2RTT+d_{transmission}
$$

> 该公式针对一个对象。多个对象顺序下载时，需要分别考虑每个对象的连接建立、请求响应和传输过程。

### 1.3 持久 HTTP

持久 HTTP（persistent HTTP）在服务器发送响应后保留 TCP 连接，同一客户端与服务器之间的后续请求继续使用该连接。

- 第一个对象仍需建立连接，总时间与非持久 HTTP 类似；
- 后续对象省去 TCP 连接建立所需的 RTT；
- 客户端解析到引用对象后，可立即在现有连接上发送请求；
- 减少频繁创建 TCP 连接带来的操作系统开销。

| 对比项 | 非持久 HTTP | 持久 HTTP |
| --- | --- | --- |
| 单条 TCP 连接承载对象数 | 最多一个 | 多个 |
| 后续对象是否重新建连 | 是 | 否 |
| 每个对象的典型 RTT 开销 | 约 2 RTT | 首个对象约 2 RTT，后续对象通常约 1 RTT |
| 系统开销 | 较高 | 较低 |

### 1.4 并发 HTTP 连接

并发 HTTP（concurrent HTTP）不是 HTTP 规范强制规定的机制，但浏览器普遍采用。浏览器取得基础 HTML 后，会对同一域名并行建立若干连接，同时获取图片等引用对象。

#### 优点

- 减少等待前一个响应完成造成的队头阻塞（head-of-line blocking）；
- 可重叠多个请求的服务器处理时间；
- 多条 TCP 连接分别拥有拥塞窗口，可能提高聚合吞吐量。

#### 代价

- 占用更多客户端与服务器资源；
- 多条连接可能从共享瓶颈获得更多带宽，对其他数据流不公平。

## 2. HTTP 请求报文

HTTP 定义请求报文（request message）与响应报文（response message）。课程中的请求示例使用可读的美国信息交换标准代码（American Standard Code for Information Interchange，ASCII）文本。

```http
GET /index.html HTTP/1.1
Host: www-net.cs.umass.edu
User-Agent: Firefox/3.6.10
Accept: text/html,application/xhtml+xml
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive

```

### 2.1 请求报文结构

1. **请求行（request line）**：方法、统一资源定位符（Uniform Resource Locator，URL）和 HTTP 版本；
2. **首部行（header lines）**：主机、客户端类型、可接受内容和连接选项等；
3. **空行**：回车符（carriage return，CR）与换行符（line feed，LF）组成的空行标志首部结束；
4. **实体主体（entity body）**：可选内容，例如 POST 请求提交的数据。

常见方法包括：

- `GET`：获取资源；
- `POST`：向服务器提交数据；
- `HEAD`：只请求响应首部，不返回对象主体。

## 3. Cookie 与用户状态

HTTP 服务器本身是无状态的，但网站经常需要识别用户、保存购物车或维护登录会话。Cookie 机制由 RFC 6265 定义，可让 HTTP 报文携带状态标识。

### 3.1 Cookie 的四个组成部分

1. HTTP 响应中的 Cookie 首部行；
2. 浏览器管理并保存在用户主机上的 Cookie 文件；
3. 网站后端数据库中的用户标识记录；
4. 后续 HTTP 请求中的 Cookie 首部行。

### 3.2 基本过程

1. 用户首次访问网站；
2. 网站生成唯一标识，并在后端数据库建立对应记录；
3. 服务器在 HTTP 响应中发送该标识；
4. 浏览器保存 Cookie；
5. 浏览器后续访问时在请求中携带 Cookie；
6. 服务器依据标识查找后端状态。

Cookie 可用于身份授权、购物车、个性化推荐和 Web 邮件会话。它也会带来隐私问题，因为网站能够把多次访问关联到同一用户。

> HTTP 协议仍然可以保持无状态。状态由客户端携带的 Cookie 与服务器后端数据共同维护。

## 4. Web 缓存与代理服务器

Web 缓存（Web cache）也称为代理服务器（proxy server）。用户可配置浏览器通过缓存访问 Web，互联网服务提供商（Internet Service Provider，ISP）、大学或企业通常会部署共享缓存。

### 4.1 请求处理

- **缓存命中（cache hit）**：对象已在缓存中，缓存直接返回对象，不联系源服务器；
- **缓存未命中（cache miss）**：缓存代表客户端向源服务器请求对象，保存副本后再返回客户端。

缓存同时扮演两个角色：

- 面向原始浏览器时是服务器；
- 面向源服务器（origin server）时是客户端。

### 4.2 主要收益

- 降低客户端请求的响应时间；
- 减少机构接入链路上的流量；
- 降低源服务器负载；
- 让服务器能力有限的内容提供者借助分布式缓存扩大交付能力。

## 5. 电子邮件系统

电子邮件系统包含三个主要部分：

- 用户代理（User Agent，UA）：撰写、编辑和阅读邮件；
- 邮件服务器（mail server）：保存用户邮箱和待发送消息队列；
- 简单邮件传输协议（Simple Mail Transfer Protocol，SMTP）：在邮件服务器之间传送邮件。

### 5.1 邮件服务器

每台邮件服务器通常维护：

- **邮箱（mailbox）**：存放用户收到的邮件；
- **消息队列（message queue）**：存放等待发送的邮件。

发送方邮件服务器作为 SMTP 客户端，接收方邮件服务器作为 SMTP 服务器。

## 6. SMTP

SMTP 使用 TCP 的 25 端口，在发送方与接收方邮件服务器之间可靠地传输邮件。

SMTP 传输包含三个阶段：

1. **握手（handshaking）**：客户端与服务器互相问候；
2. **消息传输（message transfer）**：指定发送者、接收者并传输正文；
3. **关闭（closure）**：结束会话。

SMTP 使用 ASCII 文本命令，服务器以状态码和说明短语响应。课程材料中的协议要求邮件内容使用 7 位 ASCII 表示。

### 6.1 典型 SMTP 会话

```text
S: 220 hamburger.edu
C: HELO crepes.fr
S: 250 Hello crepes.fr
C: MAIL FROM: <alice@crepes.fr>
S: 250 Sender ok
C: RCPT TO: <bob@hamburger.edu>
S: 250 Recipient ok
C: DATA
S: 354 Enter mail, end with "." on a line by itself
C: Do you like ketchup?
C: .
S: 250 Message accepted for delivery
C: QUIT
S: 221 hamburger.edu closing connection
```

| 命令 | 作用 |
| --- | --- |
| `HELO` | 客户端标识自己的主机名 |
| `MAIL FROM` | 指定发送者 |
| `RCPT TO` | 指定接收者 |
| `DATA` | 开始传输邮件内容 |
| 单独一行 `.` | 标志邮件内容结束 |
| `QUIT` | 结束 SMTP 会话 |

### 6.2 Alice 向 Bob 发送邮件

1. Alice 使用用户代理编写发给 Bob 的邮件；
2. Alice 的用户代理把邮件交给她的邮件服务器，服务器将其放入消息队列；
3. Alice 的邮件服务器与 Bob 的邮件服务器建立 TCP 连接；
4. SMTP 客户端通过连接发送邮件；
5. Bob 的邮件服务器把邮件放入 Bob 的邮箱；
6. Bob 使用用户代理读取邮件。

### 6.3 SMTP 与 HTTP

| 对比项 | SMTP | HTTP |
| --- | --- | --- |
| 主要模式 | 推送协议（push protocol） | 拉取协议（pull protocol） |
| 典型方向 | 发送服务器主动把邮件推给接收服务器 | 客户端从服务器获取对象 |
| 共同点 | ASCII 命令与响应、状态码、可使用持久 TCP 连接 | ASCII 命令与响应、状态码、可使用持久 TCP 连接 |

## 7. 邮件格式与邮件访问协议

SMTP 负责邮件服务器之间的传送，邮件格式标准规定首部与正文的组织方式。典型邮件包含：

```text
To: bob@example.com
From: alice@example.com
Subject: Meeting

Message body
```

首部与正文之间使用空行分隔。

用户读取存放在接收方服务器上的邮件时，需要邮件访问协议（mail access protocol）。

### 7.1 POP3

POP3 是一种功能较简单的邮件访问协议。用户代理作为客户端，通过 TCP 的 110 端口连接邮件服务器。

POP3 包含三个阶段：

1. **认证阶段（authorization phase）**：使用 `user` 和 `pass` 登录；
2. **事务阶段（transaction phase）**：列出、获取或标记删除邮件；
3. **更新阶段（update phase）**：客户端退出时执行删除等更新。

常见命令：

| 命令 | 作用 |
| --- | --- |
| `list` | 列出邮件编号与大小 |
| `retr n` | 获取第 $n$ 封邮件 |
| `dele n` | 标记删除第 $n$ 封邮件 |
| `quit` | 结束会话并进入更新阶段 |

POP3 支持两种常见使用方式：

- **下载并删除（download and delete）**：客户端下载后从服务器删除；
- **下载并保留（download and keep）**：服务器继续保存副本。

POP3 在不同会话之间不维护用户状态。

### 7.2 IMAP

IMAP 把邮件集中保存在服务器上，允许用户在服务器端创建文件夹、移动邮件，并跨会话保存文件夹名称及邮件与文件夹的映射等状态。

| 对比项 | POP3 | IMAP |
| --- | --- | --- |
| 主要思路 | 下载邮件 | 在服务器上管理邮件 |
| 服务器端文件夹 | 功能有限 | 支持 |
| 跨会话状态 | 无状态 | 保存用户状态 |
| 多设备同步 | 较弱 | 更适合 |

### 7.3 Web 邮件

Web 邮件以浏览器作为用户代理：

- 浏览器通过 HTTP 把邮件交给用户所属的邮件服务器；
- 邮件服务器之间仍使用 SMTP；
- 浏览器通过 HTTP 从远程邮箱读取邮件，不直接使用 POP3 或 IMAP。

## 8. DNS 的作用

DNS 解决人类可读主机名与 IP 地址之间的映射问题。

- IP 地址用于数据报寻址；
- 主机名（hostname）便于人类记忆，例如 `www.yahoo.com`；
- DNS 是由多级名称服务器构成的分布式数据库；
- 主机和名称服务器使用应用层协议进行名称解析（name resolution）。

DNS 提供的主要服务包括：

1. **主机名到 IP 地址转换**；
2. **主机别名（host aliasing）**：易记别名映射到规范主机名（canonical hostname）；
3. **邮件服务器别名（mail server aliasing）**；
4. **负载分配（load distribution）**：一个名称对应多个复制服务器的 IP 地址。

DNS 承担互联网核心功能，但实现位于网络边缘的应用层。

## 9. DNS 的分布式层次结构

DNS 不使用单一中心数据库，因为集中式设计会产生单点故障、巨大流量、远距离访问延迟和维护困难，无法扩展到整个互联网。

DNS 层次结构包含：

### 9.1 根名称服务器

根名称服务器（root name server）位于层次结构顶端。本地 DNS 无法直接解析名称时，可向根服务器查询相应顶级域名称服务器的位置。

### 9.2 顶级域名称服务器

顶级域（Top-Level Domain，TLD）名称服务器负责 `.com`、`.org`、`.edu` 等通用顶级域，以及 `.uk`、`.jp` 等国家和地区顶级域。它们把查询引导到目标域的权威 DNS 服务器。

### 9.3 权威 DNS 服务器

权威 DNS 服务器（authoritative DNS server）保存组织名称区域内的正式主机名到 IP 地址映射。例如，CityU 的权威服务器可以管理 `*.cityu.edu.hk`。

组织管理的一组 DNS 记录称为 DNS 区域（DNS zone）。一个区域还可以继续划分为更小的区域，并由不同的权威服务器管理。

### 9.4 本地 DNS 服务器

本地 DNS 服务器（local DNS server）也称默认名称服务器（default name server），通常由住宅 ISP、企业或大学提供。它不严格属于 DNS 层次结构，但承担重要代理作用：

- 接收本地主机发出的 DNS 查询；
- 缓存最近的名称到地址映射；
- 缓存未命中时代表主机向 DNS 层次结构继续查询。

## 10. DNS 名称解析

假设 `cis.poly.edu` 上的主机需要解析 `gaia.cs.umass.edu`。

一种典型过程是：

1. 请求主机向本地 DNS 服务器查询；
2. 本地 DNS 向根名称服务器查询；
3. 根服务器返回对应 TLD 服务器；
4. 本地 DNS 向 TLD 服务器查询；
5. TLD 服务器返回 `cs.umass.edu` 的权威 DNS 服务器；
6. 本地 DNS 向权威服务器查询；
7. 权威服务器返回目标 IP 地址；
8. 本地 DNS 把结果返回请求主机。

### 10.1 递归查询与迭代查询

- **递归查询（recursive query）**：被查询服务器负责完成后续解析，并向请求方返回最终结果；
- **迭代查询（iterative query）**：被查询服务器返回下一台应联系的名称服务器，查询方继续询问。

典型组合：

- 请求主机到本地 DNS 使用递归查询；
- 本地 DNS 到根、TLD 和权威服务器使用迭代查询。

若所有层级都使用递归查询，上层服务器需要代表请求方继续查询，会增加根服务器和 TLD 服务器的负载。

## 11. DNS 缓存

DNS 服务器获得映射后，可以把结果保存到缓存。即使它不是该域的权威服务器，也可直接回答后续相同查询。

缓存的作用：

- 缩短名称解析时延；
- 减少 DNS 报文数量；
- 降低根、TLD 和权威服务器的负载。

每条缓存记录包含生存时间（Time To Live，TTL）。TTL 到期后，服务器删除或重新查询记录。因此主机更换 IP 后，在所有旧缓存到期之前，互联网中的部分客户端仍可能得到旧地址。DNS 提供尽力而为的名称到地址转换，缓存内容可能暂时过期。

## 12. DNS 资源记录

DNS 分布式数据库存储资源记录（Resource Record，RR），通用格式为：

$$
(name, value, type, ttl)
$$

| 类型 | `name` | `value` | 用途 |
| --- | --- | --- | --- |
| `A` | 主机名 | IPv4 地址 | 把主机名映射到 IPv4 地址 |
| `NS` | 域名 | 权威名称服务器的主机名 | 指明负责该域的名称服务器 |
| `CNAME` | 别名 | 规范主机名 | 把易记别名映射到真实名称 |
| `MX` | 域名 | 邮件服务器主机名 | 指明负责接收该域邮件的服务器 |

示例：

```text
(relay1.bar.foo.com, 192.0.2.10, A, ttl)
(foo.com, dns.foo.com, NS, ttl)
(foo.com, relay1.bar.foo.com, CNAME, ttl)
(foo.com, mail.bar.foo.com, MX, ttl)
```

## 高频易错点

1. 非持久 HTTP 的 $2RTT$ 只表示 TCP 建连与请求响应的 RTT，还要加对象传输时间。
2. 持久 HTTP 复用 TCP 连接，并发 HTTP 同时使用多条连接，两者不是同一概念。
3. HTTP 无状态不妨碍网站通过 Cookie 和后端数据库维护用户状态。
4. Web 缓存面对浏览器时是服务器，面对源服务器时是客户端。
5. SMTP 负责发送与服务器间转发；POP3、IMAP 或 HTTP 负责用户读取邮件。
6. Web 邮件的浏览器与邮件服务器之间使用 HTTP，邮件服务器之间仍使用 SMTP。
7. DNS 是应用层协议，却提供互联网运行所需的核心名称解析功能。
8. 递归查询要求被查询服务器完成解析；迭代查询只返回下一步应联系的服务器。
9. 本地 DNS 不严格属于根、TLD、权威服务器构成的层次结构。
10. `A` 记录保存地址，`NS` 指向名称服务器，`CNAME` 指向规范名称，`MX` 指向邮件服务器。

## 30 秒自测

1. 非持久 HTTP 获取单个对象为什么通常需要 2 RTT？
2. 持久 HTTP 与并发 HTTP 分别减少了什么等待？
3. HTTP 请求报文由哪些部分组成？
4. Cookie 机制包含哪四个组成部分？
5. Web 缓存为什么同时是客户端和服务器？
6. SMTP、POP3、IMAP 和 HTTP 在电子邮件系统中分别承担什么任务？
7. DNS 为什么不能采用单一中心服务器？
8. 递归查询与迭代查询有什么区别？
9. DNS 缓存为什么既能提速，也可能返回旧地址？
10. `A`、`NS`、`CNAME`、`MX` 记录分别保存什么？

<details>
<summary>答案</summary>

1. 建立 TCP 连接需要 1 RTT，发送请求并收到响应前几个字节需要另 1 RTT，之后还要计算对象传输时间。
2. 持久 HTTP 省去后续对象重复建连的等待；并发 HTTP 通过多条连接重叠多个对象的请求与传输。
3. 请求行、首部行、结束首部的空行，以及可选实体主体。
4. 响应 Cookie 首部、浏览器 Cookie 文件、网站后端数据库、后续请求 Cookie 首部。
5. 它向浏览器返回对象时是服务器，缓存未命中后向源服务器请求对象时是客户端。
6. SMTP 发送和转发邮件；POP3 下载邮件；IMAP 在服务器上读取并管理邮件；Web 邮件使用 HTTP 连接浏览器和邮件服务器。
7. 单一中心会产生单点故障、流量瓶颈、远距离访问延迟和维护压力，无法扩展。
8. 递归查询要求被查询服务器返回最终结果；迭代查询返回下一台应联系的服务器。
9. 缓存减少查询路径与报文，但 TTL 到期前可能保留已经变化的映射。
10. `A` 保存 IPv4 地址；`NS` 保存权威名称服务器；`CNAME` 保存规范主机名；`MX` 保存邮件服务器主机名。

</details>
