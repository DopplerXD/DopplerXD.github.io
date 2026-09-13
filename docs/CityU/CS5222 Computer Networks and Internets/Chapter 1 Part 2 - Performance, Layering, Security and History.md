# Chapter 1 Part 2: Performance, Layering, Security and History

## 一页速记

| 主题 | 必须记住的结论 |
| --- | --- |
| Traceroute | 逐步增加探测包可经过的跳数，测出源主机到沿途路由器的往返时间（RTT）；`*` 表示探测包或回复丢失、超时，或路由器不回复 |
| 丢包 | 输出队列容量有限；分组到达满队列时会被丢弃，之后可能由上一跳、源端重传，也可能不重传 |
| 吞吐量 | 端到端吞吐量由路径上的瓶颈速率决定；串联链路常用 `min` 计算 |
| 分层 | 每一层向上提供服务，依赖下一层；分层降低复杂度，但会带来额外头部和潜在功能重复 |
| 封装 | 应用消息逐层添加首部，形成 segment、datagram、frame；接收端反向解封装 |
| 安全 | 典型威胁包括 malware、DoS/DDoS、packet sniffing 与 IP spoofing |

## 1. Traceroute 与真实网络路径

Traceroute 向目的地主机发送多组探测包，使第 $i$ 组探测包在第 $i$ 跳路由器处终止。路由器返回控制报文后，发送方以“发出探测包到收到回复”的时间作为该次 RTT。

典型输出中：

- 每一行对应一跳路由器；
- 第一列是 hop number；
- 接下来的三列通常是三次独立探测的 RTT；
- 最后是路由器的主机名与 IP 地址；
- `*` 表示规定时间内没有收到回复，原因可能是丢包、防火墙过滤、ICMP 限速或路由器不响应。

### RTT 不一定逐跳增加

第 $N+1$ 跳的 RTT 可能比第 $N$ 跳小，因为每一行来自不同探测包。瞬时排队时延、回程路径、路由器处理优先级都可能不同。因此 traceroute 展示的是采样结果，不是固定的单向链路时延累加表。

## 2. Packet Loss

每条输出链路前都有有限容量的 queue 或 buffer。当分组到达速率暂时大于链路发送速率时，队列增长；队列满后，新到分组会被 drop。

丢包后的处理取决于协议：

- 可靠传输协议通常由端系统检测并重传；
- 某些链路层会在局部重传；
- 实时音视频可能容忍少量丢失而不重传，以免增加时延。

## 3. Throughput

吞吐量是发送方与接收方之间实际传输数据的速率，单位通常为 bit/s。

- **Instantaneous throughput**：某一时刻的速率；
- **Average throughput**：较长时间内传输的数据量除以总时间。

若服务器接入链路速率为 $R_s$，客户端接入链路速率为 $R_c$，端到端平均吞吐量近似为

$$
\text{Throughput}=\min(R_s,R_c)
$$

若 10 条连接公平共享速率为 $R$ 的骨干瓶颈链路，则每条连接近似为

$$
\text{Throughput per connection}=\min\left(R_s,R_c,\frac{R}{10}\right)
$$

传输大小为 $F$ bit 的文件，理想传输时间近似为

$$
T=\frac{F}{\text{Throughput}}
$$

> 易错点：链路带宽是容量上限，吞吐量是实际端到端速率。路径中最快的链路不能提高瓶颈链路决定的吞吐量。

## 4. Protocol Layering

网络由主机、路由器、不同介质、应用、协议和软硬件共同组成。分层把复杂系统拆成模块：每层完成本层动作，向上一层提供服务，并使用下一层提供的服务。

### Internet 五层协议栈

| 层 | 主要职责 | 例子 | 数据单元 |
| --- | --- | --- | --- |
| Application | 支持网络应用 | HTTP、SMTP、FTP、DNS | message |
| Transport | 进程到进程的数据传输 | TCP、UDP | segment |
| Network | 数据报从源主机路由到目的主机 | IP、routing protocols | datagram |
| Link | 相邻网络节点之间的数据传输 | Ethernet、Wi-Fi、PPP | frame |
| Physical | 在介质上传输比特 | 铜缆、光纤、无线电 | bit |

### OSI 七层与 Internet 五层

OSI 在 Application 与 Transport 之间额外定义：

- **Presentation layer**：数据表示、加密、压缩与机器相关格式转换；
- **Session layer**：同步、检查点和会话恢复。

Internet 协议栈没有独立的 Presentation 与 Session 层。应用需要这些服务时，通常在应用层实现。

### 为什么分层

- 明确各组件之间的关系；
- 模块化便于维护与升级；
- 某层内部实现变化时，只要接口与服务不变，其他层通常无需修改。

## 5. Encapsulation

发送端从上到下封装：

$$
\text{message}
\rightarrow \text{segment}
\rightarrow \text{datagram}
\rightarrow \text{frame}
\rightarrow \text{bits}
$$

每一层把上层数据视为 payload，并添加本层 header。接收端从下到上移除相应 header。交换机主要处理 Link 层信息，路由器主要处理 Network 层信息，端系统运行完整协议栈。

## 6. Network Security

Internet 最初建立在用户相互信任的环境中，安全并非早期核心设计目标，因此今天需要在各层补充防御机制。

### Malware

- **Virus**：用户接收并执行受感染对象后传播，通常需要宿主文件或人为动作；
- **Worm**：利用漏洞主动传播，接收后可自行执行与复制；
- **Spyware**：记录键盘输入、访问网站等信息并上传；
- **Botnet**：大量被控制的主机组成的网络，可用于垃圾邮件或 DDoS。

### DoS 与 DDoS

DoS 通过伪造流量耗尽服务器、带宽或其他资源，使合法用户无法获得服务。DDoS 使用大量被攻陷主机同时攻击同一目标，更难通过单一来源封禁。

### Packet Sniffing

共享 Ethernet 或无线网络属于广播介质。处于 promiscuous mode 的网卡可以记录经过的分组。若应用以明文传输密码等敏感数据，攻击者可能直接读取。

### IP Spoofing

攻击者把虚假的源 IP 地址写入分组。仅凭分组头部的源地址不能证明真实发送者身份。

## 7. Internet History 时间线

| 时期 | 关键事件 |
| --- | --- |
| 1961–1972 | 排队论证明 packet switching 的有效性；ARPANET 构想、首个节点与公开演示；NCP 与早期电子邮件出现 |
| 1972–1980 | ALOHAnet、Ethernet、Cerf 与 Kahn 的 internetworking 架构；形成 best effort、stateless routers 与 decentralized control 等原则 |
| 1980–1990 | TCP/IP 部署；SMTP、DNS、FTP 定义；TCP congestion control 出现；网络规模快速扩大 |
| 1990s–2000s | Web、HTML、HTTP、Mosaic 与 Netscape 推动商业化；IM、P2P 等应用发展；网络安全受到重视 |
| 2005–present | 宽带、智能手机、高速无线、社交网络、内容提供商私有网络与云服务普及 |

## 高频易错点

1. `*` 不等于“该路由器坏了”，只表示本次探测没有按时收到回复。
2. Throughput 取瓶颈的最小值，不是链路速率之和。
3. Router 不处理完整的应用层协议栈；它的核心任务是网络层转发。
4. Segment 属于 Transport 层，datagram 属于 Network 层，frame 属于 Link 层。
5. Virus 通常需要用户执行感染对象；worm 可以自行传播。
6. IP spoofing 伪造来源，packet sniffing 窃听经过的数据，两者攻击方式不同。

## 30 秒自测

1. 为什么 traceroute 同一跳通常显示三个 RTT？
2. 为什么后一个 hop 的 RTT 可能更小？
3. $R_s=20$ Mbps、$R_c=8$ Mbps、共享瓶颈给每条连接 5 Mbps 时，吞吐量是多少？
4. Transport、Network、Link 层的数据单元分别叫什么？
5. OSI 中哪两层没有在 Internet 五层模型中独立出现？
6. Virus、worm、sniffing、spoofing 分别在做什么？

<details>
<summary>答案</summary>

1. Traceroute 通常对每个跳数发送三次独立探测，以观察 RTT 的波动。
2. 不同探测包的排队、处理和回程路径可能不同。
3. $\min(20,8,5)=5$ Mbps。
4. segment、datagram、frame。
5. Presentation 与 Session。
6. Virus 依赖感染对象执行；worm 自行复制传播；sniffing 窃听分组；spoofing 伪造源地址。

</details>
