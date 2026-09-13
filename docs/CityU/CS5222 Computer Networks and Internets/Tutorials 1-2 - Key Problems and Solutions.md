# Tutorials 1–2: Key Problems and Solutions

## 必会公式

| 场景 | 公式 |
| --- | --- |
| 单个分组经过 $N$ 条 store-and-forward 链路 | $\displaystyle d_{e2e}=\sum_{i=1}^{N}\frac{L}{R_i}+\sum_{i=1}^{N}\frac{d_i}{s_i}+(N-1)d_{proc}+d_{queue}$ |
| $P$ 个等长分组、$N$ 条等速率链路，无其他时延 | $\displaystyle d_{e2e}=\frac{(P+N-1)L}{R}$ |
| Packetization delay | $\displaystyle d_{packetization}=\frac{L}{r_{source}}$ |
| Transmission delay | $\displaystyle d_{trans}=\frac{L}{R}$ |
| Propagation delay | $\displaystyle d_{prop}=\frac{d}{s}$ |
| 排队时延，当前分组已发送 $x$ bit，队列另有 $n$ 个分组 | $\displaystyle d_{queue}=\frac{(L-x)+nL}{R}$ |
| 二项分布 | $\displaystyle P(X=n)=\binom{N}{n}p^n(1-p)^{N-n}$ |

> 单位检查：byte 先乘 8 变成 bit；kbps 按 $10^3$ bit/s，Mbps 按 $10^6$ bit/s；km 先乘 $10^3$ 变成 m。

## Tutorial 1

### Q1 Store-and-Forward

一个长度为 $L$ 的分组依次经过速率为 $R_1$、$R_2$ 的两条链路。忽略 propagation、queueing 与 processing delay。

??? question "Solution"
    路由器必须收完整个分组后才能向第二条链路发送，因此

    $$
    d_{e2e}=\frac{L}{R_1}+\frac{L}{R_2}
    $$

    **答案：C**

    若 $P=3$ 个分组通过 $N=2$ 条速率均为 $R$ 的链路，分组可以流水传输：

    $$
    d_{e2e}=\frac{(P+N-1)L}{R}=\frac{4L}{R}
    $$

    **答案：D**

    理解流水线：第一个分组需要 $2L/R$ 到达；之后每隔 $L/R$ 到达一个分组，所以总时间为 $2L/R+(P-1)L/R$。

### Q2 Circuit-Switched Network 容量

四个交换机组成一个环，每条链路有 4 个 circuits。

??? question "Solution"
    #### a. 全网最大同时连接数

    若每条连接只占用一条相邻交换机之间的链路，4 条链路各承载 4 条连接：

    $$
    4\times 4=16
    $$

    **答案：C**

    #### b. 所有连接均在 A 与 C 之间

    A 到 C 有两条不重叠路径：$A-B-C$ 与 $A-D-C$。每条路径受单链路 4 circuits 限制，因此

    $$
    4+4=8
    $$

    **答案：B**

    #### c. 同时建立 4 条 A-C 与 4 条 B-D 连接

    可以。把每组连接各拆成两条走顺时针、两条走逆时针，使任意链路恰好承载 4 条连接，不超过容量。

    **答案：B**

### Q3 FDM Circuit Switching

总速率为 1.536 Mbps，共 12 个等带宽 frequency bands。发送 160,000 bit 文件前需要 0.6 s 建立 circuit，求总耗时。

??? question "Solution"
    每条 circuit 的速率为

    $$
    R=\frac{1.536\text{ Mbps}}{12}=128\text{ kbps}
    $$

    发送 160,000 bit 文件需要

    $$
    d_{trans}=\frac{160{,}000}{128{,}000}=1.25\text{ s}
    $$

    加上 0.6 s circuit establishment time：

    $$
    d_{total}=0.6+1.25=1.85\text{ s}
    $$

    **答案：A**

### Q4 Statistical Multiplexing

链路速率 3 Mbps，每个活跃用户需要 150 kbps。

??? question "Solution"
    #### a. Circuit switching

    $$
    N=\frac{3\text{ Mbps}}{150\text{ kbps}}=20
    $$

    **答案：B**

    #### b. Packet switching 中单个用户正在发送的概率

    题目直接给出每个用户 10% 的时间在发送，因此 $p=0.1$。

    **答案：A**

    #### c. 120 个用户中恰好 $n$ 个同时发送

    把每个用户看作独立 Bernoulli trial，则 $X\sim B(120,0.1)$：

    $$
    P(X=n)=\binom{120}{n}(0.1)^n(0.9)^{120-n}
    $$

    这是 packet switching 能通过 statistical multiplexing 支持更多突发用户的数学基础，但活跃用户过多时仍会排队与丢包。

## Tutorial 2

### Q1 VoIP End-to-End Delay

语音源速率为 128 kbps，每个 packet 为 64 byte；链路速率 4 Mbps，propagation delay 为 8 ms。

??? question "Solution"
    1. Packetization：$64\times8=512$ bit

    $$
    d_{packetization}=\frac{512}{128\times10^3}=4\text{ ms}
    $$

    2. Transmission：

    $$
    d_{trans}=\frac{512}{4\times10^6}=0.128\text{ ms}
    $$

    3. Propagation：8 ms

    $$
    d_{total}=4+0.128+8=12.128\text{ ms}
    $$

    **答案：D**

    > 关键：题目从“bit 被创建”开始计时，因此必须等待整个 64-byte packet 收集完成，不能漏掉 packetization delay。

### Q2 三条 Store-and-Forward 链路

一个 1500-byte packet 经过三条链路和两个 packet switches。求通用端到端时延公式，并代入题目参数计算结果。

??? question "Solution"
    #### a. 通用公式

    三条链路、两个 packet switches，无 queueing delay：

    $$
    d_{e2e}=\sum_{i=1}^{3}\frac{L}{R_i}+\sum_{i=1}^{3}\frac{d_i}{s_i}+2d_{proc}
    $$

    **答案：B**

    #### b. 数值计算

    $L=1500$ byte $=12{,}000$ bit，三条链路均为 2 Mbps：

    $$
    d_{trans,total}=3\times\frac{12{,}000}{2\times10^6}=18\text{ ms}
    $$

    总距离为 $5000+4000+1000=10{,}000$ km $=10^7$ m：

    $$
    d_{prop,total}=\frac{10^7}{2.5\times10^8}=40\text{ ms}
    $$

    两个 switches 各处理 3 ms：

    $$
    d_{proc,total}=2\times3=6\text{ ms}
    $$

    $$
    d_{e2e}=18+40+6=64\text{ ms}
    $$

    **答案：B**

### Q3 Cut-Through Switching

沿用 Q2 的等速率链路与距离，令 processing delay 为 0，并让 switches 收到 bit 后立即转发。求端到端时延。

??? question "Solution"
    三条链路速率相同，switch 收到一个 bit 后立即转发，无 processing delay。各链路可对同一 bit 流形成流水线，因此只计算一次完整分组 transmission delay：

    $$
    d_{e2e}=\frac{L}{R}+\sum_{i=1}^{3}\frac{d_i}{s_i}=6+40=46\text{ ms}
    $$

    **答案：D**

    > 对比：store-and-forward 需要 $3L/R$；等速率 cut-through 只需要 $L/R$。Propagation delay 在两种模式下都存在。

### Q4 Queueing Delay

每个 packet 为 1500 byte $=12{,}000$ bit。当前正在发送的 packet 已完成一半，还剩 6000 bit；队列中另有 4 个完整 packets。

??? question "Solution"
    新到分组需要等待的总 bit 数为

    $$
    6000+4\times12{,}000=54{,}000\text{ bit}
    $$

    $$
    d_{queue}=\frac{54{,}000}{2\times10^6}=27\text{ ms}
    $$

    **答案：A**

    一般地，若当前分组已发送 $x$ bit，队列已有 $n$ 个长度为 $L$ 的分组：

    $$
    d_{queue}=\frac{(L-x)+nL}{R}
    $$

    注意新到分组自身的 transmission delay 不属于它的 queueing delay。

### Q5 Traceroute

解释 traceroute 输出的各列、`*` 的含义，以及后一跳 RTT 可能更小的原因。

??? question "Solution"
    #### a. 每列含义

    - 第一列：hop number；
    - 中间三列：三次独立 probes 到该 hop 的 RTT；
    - 最后：路由器 hostname 与 IP address。

    #### b. 为什么出现 `*`

    探测包或回复可能丢失，路由器或防火墙可能过滤相关控制报文，路由器也可能限制回复速率。`*` 只代表本次 probe 超时。

    #### c. 为什么 Router N 的 RTT 可能大于 Router N+1

    两行 RTT 来自不同 packets。瞬时 queueing delay、router processing、return path 和 ICMP reply scheduling 都会变化。因此后一跳的单次测量可能反而更快。

## 解题决策表

| 看到的题目线索 | 需要加入的项 |
| --- | --- |
| “生成固定大小 packet 后立即发送” | packetization delay |
| “store-and-forward” | 每条链路都计算一次 $L/R_i$ |
| “cut-through，速率相同” | 整条路径通常只计算一次 $L/R$ |
| 给出距离与传播速度 | $d/s$ |
| 给出 packet switch processing delay | 每个中间 switch 计算一次 |
| 当前 packet 发送到一半 | 只等待当前 packet 剩余 bits |
| circuit establishment time | 建立时延加到总时间 |
| $N$ 个独立用户、活跃概率 $p$ | 二项分布 $B(N,p)$ |

## 最易失分的五件事

1. 把 byte 忘记乘 8。
2. 把 transmission delay $L/R$ 与 propagation delay $d/s$ 混淆。
3. Store-and-forward 只算一次 $L/R$，实际应按链路逐条计算。
4. Queueing delay 中误加新到分组自身的发送时间。
5. 把 traceroute 的 RTT 当成单向时延，或认为 RTT 必须逐跳单调增加。
