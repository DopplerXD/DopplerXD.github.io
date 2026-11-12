# Chapter 3: Transport Layer

## 一页速记

传输层（transport layer）提供进程到进程的逻辑通信，网络层（network layer）提供主机到主机通信。用户数据报协议（User Datagram Protocol，UDP）提供无连接的尽力而为服务；传输控制协议（Transmission Control Protocol，TCP）提供可靠、有序的字节流，以及流量控制和拥塞控制。

## 1. 多路复用与分解

多路复用（multiplexing）在发送端把多个套接字的数据交给网络层；多路分解（demultiplexing）在接收端根据首部把数据送入正确套接字。

- UDP 套接字通常由目的 IP 地址和目的端口二元组标识，不同来源可以进入同一接收套接字。
- TCP 连接由源 IP、源端口、目的 IP、目的端口四元组标识。服务器同一监听端口可以对应多个连接。

## 2. UDP 与校验和

UDP 不建立连接，不保证可靠性、顺序、时延或带宽。首部为 8 字节，包括源端口、目的端口、长度和校验和（checksum）。长度包含首部。

校验和把数据按 16 位字相加，最高位进位回卷到低位，再对结果取反。接收端验证结果以检测比特错误。校验和不能修复错误，也不能检测所有错误。应用若需要可靠性，可自行加入确认和重传。

## 3. 可靠数据传输的演进

可靠数据传输（reliable data transfer，rdt）需要根据底层信道的故障增加机制。

| 协议 | 信道问题 | 关键机制 |
| --- | --- | --- |
| rdt1.0 | 完全可靠 | 直接发送和交付 |
| rdt2.0 | 数据比特错误 | 校验和、确认（acknowledgement，ACK）、否定确认（negative acknowledgement，NAK）、重传 |
| rdt2.1 | 确认也可能损坏 | 序号区分新分组和重复分组 |
| rdt2.2 | 同上 | 只用 ACK，重复确认代替 NAK |
| rdt3.0 | 数据或确认可能丢失 | 定时器、超时重传 |

停等协议（stop-and-wait）一次只允许一个未确认分组。重复分组可以再次确认，但不能重复交付应用。

若分组长度为 $L$、链路速率为 $R$、往返时间（Round-Trip Time，RTT）为 RTT，忽略确认发送时间：

$$
U_{sender}=\frac{L/R}{RTT+L/R}
$$

高速长距离链路上，停等利用率很低。流水线（pipelining）允许多个未确认分组同时在途，窗口为 $N$ 时利用率近似为上述结果的 $N$ 倍，上限为 1。

## 4. 回退 N 步与选择重传

| 项目 | 回退 N 步（Go-Back-N，GBN） | 选择重传（Selective Repeat，SR） |
| --- | --- | --- |
| 确认方式 | 累积确认 | 逐个确认 |
| 乱序分组 | 通常丢弃 | 缓存 |
| 定时器 | 最早未确认分组一个定时器 | 每个未确认分组独立定时 |
| 超时动作 | 重传该分组及其后的所有已发送未确认分组 | 只重传超时分组 |

GBN 的 ACK(n) 表示截至 n 的分组全部正确接收。SR 收到后续分组的 ACK 不代表窗口可立即跨过前面的缺口。

## 5. TCP 序号与可靠传输

TCP 是全双工（full duplex）、面向连接的字节流。最大报文段长度（Maximum Segment Size，MSS）限制单段承载的数据量。

- 序号（sequence number）是报文段第一个数据字节的编号。
- 确认号（acknowledgement number）是接收方下一个期望的字节编号。
- 若收到字节 0–535，确认号为 536。
- 一个 Seq=100、长度为 20 字节的段覆盖字节 100–119，完整接收后期望 120。

TCP 采用流水线、累积确认和重传定时器。超时触发重传；连续收到三个重复 ACK 时执行快速重传（fast retransmit），无需等待超时。

### RTT 估计

$$
EstimatedRTT=(1-\alpha)EstimatedRTT+\alpha SampleRTT
$$

$$
DevRTT=(1-\beta)DevRTT+\beta|SampleRTT-EstimatedRTT|
$$

$$
TimeoutInterval=EstimatedRTT+4DevRTT
$$

课程常用 $\alpha=0.125$、$\beta=0.25$。超时太短导致不必要重传，太长则故障恢复缓慢。

## 6. 流量控制与连接管理

流量控制（flow control）保护接收方缓冲区。接收窗口（receive window，rwnd）表示可用空间，发送方未确认数据量不能超过接收窗口。

三次握手（three-way handshake）：

1. 客户端发送 SYN，初始序号 x。
2. 服务器发送 SYN+ACK，序号 y，确认 x+1。
3. 客户端确认 y+1，连接建立。

双方分别使用 FIN 关闭各自发送方向，接收 FIN 后回复 ACK。关闭一侧不代表另一侧立即停止发送。TIME_WAIT 允许处理迟到报文和重传的 FIN。

## 7. 拥塞控制

拥塞控制（congestion control）保护网络，流量控制保护接收方。拥塞引起队列增长、丢包和无效重传。发送窗口受拥塞窗口（congestion window，cwnd）与 rwnd 的较小值限制。

$$
Rate\approx\frac{\min(cwnd,rwnd)}{RTT}
$$

慢启动（slow start）每个 RTT 大致把 cwnd 翻倍。达到慢启动阈值（slow-start threshold，ssthresh）后进入拥塞避免（congestion avoidance），每 RTT 大致增加 1 MSS。

| 事件 | Tahoe | Reno |
| --- | --- | --- |
| 超时 | 阈值减半，cwnd 回到 1 MSS | 阈值减半，cwnd 回到 1 MSS |
| 三个重复 ACK | 回到慢启动 | 快速重传与快速恢复，恢复后窗口约减半 |

Reno 快速恢复期间临时使用 ssthresh+3 MSS，并随额外重复 ACK 调整；收到确认新数据的 ACK 后退出恢复。加性增大、乘性减小（Additive Increase Multiplicative Decrease，AIMD）形成锯齿状窗口变化。

显式拥塞通知（Explicit Congestion Notification，ECN）允许网络显式通知拥塞。忽略慢启动，窗口在 W/2 与 W 之间变化时，平均吞吐量约为 $3W/(4RTT)$。共享瓶颈的公平性以连接为单位，多开连接可能取得更多份额。

## 易错点与自测

- TCP 序号按字节计数，GBN 示例常按分组计数。
- TCP ACK 表示下一个期望字节，不是最后收到的字节。
- 校验和负责检测，定时器与重传负责恢复丢失。
- 三个重复 ACK 与超时在 Reno 中触发不同窗口调整。

??? question "Solution：自测答案"

    Seq=500、数据 100 字节，按序收到后 ACK=600。rwnd=8000、cwnd=4000 字节时，允许在途数据最多为 4000 字节。接收方处理不过来属于流量控制问题，网络链路拥堵属于拥塞控制问题。
