# Chapter 5: Network Layer Control Plane

## 一页速记

控制平面（control plane）负责计算路由和转发表。链路状态（Link State，LS）算法利用全局拓扑运行 Dijkstra；距离向量（Distance Vector，DV）算法通过邻居交换估计并使用 Bellman–Ford 更新。自治系统（Autonomous System，AS）内部常使用开放最短路径优先协议（Open Shortest Path First，OSPF），系统之间使用边界网关协议（Border Gateway Protocol，BGP）。

## 1. 控制平面与图模型

传统逐路由器控制由各路由器运行算法并交换消息。软件定义网络（Software-Defined Networking，SDN）采用逻辑集中控制，由控制器计算并下发规则。

路由网络可建模为图：节点代表路由器，边代表链路，边权表示代价。路由目标取决于代价定义，并不必然是物理距离最短。

## 2. Dijkstra 算法

节点掌握网络拓扑和链路代价，计算自身到其他节点的最短路径树。

1. 把源节点加入已确定集合，初始化直连邻居代价，其余为无穷。
2. 选择尚未确定且估计距离最小的节点 w。
3. 将 w 加入集合，并松弛其邻居。
4. 重复直到所有可达节点确定。

$$
D(v)\leftarrow\min\{D(v),D(w)+c(w,v)\}
$$

用前驱恢复路径，并从路径第一跳生成转发表。朴素实现复杂度为 $O(n^2)$。当代价随承载流量变化时，路由可能振荡。

## 3. Bellman–Ford 与距离向量

$$
D_x(y)=\min_{v\in neighbors(x)}\{c(x,v)+D_v(y)\}
$$

节点 x 只需知道到邻居的链路代价，以及邻居公布的距离向量。达到最小值的邻居就是下一跳。

课程例子：到 z 的三个候选代价为 $2+5$、$1+3$、$5+3$，最优为 4。

距离向量是分布式、异步、迭代的。节点收到邻居更新或检测到本地链路代价变化后重新计算，结果变化时再通知邻居。

链路代价下降往往传播较快；代价上升可能触发路由环路与计数到无穷（count-to-infinity）。节点会错误地把邻居经由自己得到的路径当成替代路径。

| 对比项 | 链路状态 | 距离向量 |
| --- | --- | --- |
| 已知信息 | 全局拓扑 | 邻居代价与邻居的距离估计 |
| 信息传播 | 洪泛链路状态 | 邻居之间交换向量 |
| 核心算法 | Dijkstra | Bellman–Ford |
| 主要风险 | 代价振荡、错误链路通告 | 环路、计数到无穷、错误估计传播 |

## 4. 层次路由与 OSPF

层次路由（hierarchical routing）解决规模与管理自治问题。自治系统内部由同一管理实体控制，可选择自己的内部协议；跨自治系统路由还必须考虑业务与访问策略。

内部网关协议（Interior Gateway Protocol，IGP）包括路由信息协议（Routing Information Protocol，RIP）和 OSPF。

OSPF 洪泛链路状态，建立拓扑图并运行 Dijkstra。OSPF 报文直接承载在互联网协议（Internet Protocol，IP）上，不依赖 TCP 或 UDP。

### 分层 OSPF

OSPF 可划分为多个区域和一个骨干区域。

- 内部路由器掌握本区域详细拓扑。
- 区域边界路由器（Area Border Router，ABR）汇总区域内可达信息并连接其他区域。
- 骨干路由器负责骨干区域内路由。
- 自治系统边界路由器（Autonomous System Boundary Router，ASBR）连接其他路由域或自治系统。

## 5. BGP

BGP 传播目的网络前缀的可达性，并根据策略选择路径。它是路径向量（path vector）协议，通过较长期的传输控制协议（Transmission Control Protocol，TCP）连接交换消息。

- 外部 BGP（external BGP，eBGP）在相邻自治系统之间交换路由。
- 内部 BGP（internal BGP，iBGP）在同一自治系统内部传播外部可达信息。

### 路由属性

前缀与属性共同构成路由。

| 属性 | 含义 |
| --- | --- |
| AS-PATH | 通告经过的自治系统序列，可用于识别环路与比较路径 |
| NEXT-HOP | 到达该路径所需的下一跳接口地址 |
| Local preference | 本地策略赋予的偏好 |

接收方可依据导入策略接受或拒绝路由，导出策略决定是否继续向其他邻居通告。向外传播时通常把自己的自治系统加入路径。

### 路由选择

课程中的比较顺序：先比较本地偏好，再选择较短 AS-PATH，随后比较到 NEXT-HOP 的内部代价，最后使用其他规则。

热土豆路由（hot potato routing）在其他优先条件相同时，把流量交给内部代价最低的出口，尽快移出本自治系统。因此总跨域路径不一定最短。

### 消息类型

| 消息 | 用途 |
| --- | --- |
| OPEN | 建立 BGP 会话并交换参数 |
| UPDATE | 通告或撤回路由 |
| KEEPALIVE | 维持会话并确认 OPEN |
| NOTIFICATION | 报告错误并关闭会话 |

## 6. ICMP 与 Traceroute

互联网控制报文协议（Internet Control Message Protocol，ICMP）由主机与路由器报告网络错误及诊断信息，报文封装在 IP 数据报中。

| 类型与代码 | 含义 |
| --- | --- |
| Type 8，Code 0 | 回显请求，用于 ping |
| Type 0，Code 0 | 回显响应 |
| Type 3，Code 3 | 目的端口不可达 |
| Type 11，Code 0 | 传输途中 TTL 到期 |

Traceroute 逐组增加生存时间（Time To Live，TTL）。第 i 跳路由器将 TTL 减至 0 后丢弃探测包并返回 ICMP 超时报文。源端据此记录路由器地址和往返时间（Round-Trip Time，RTT）。

课程中的 UDP 实现把探测包发送到不太可能开放的目的端口。抵达目的主机后，端口不可达响应表明路径追踪结束。每跳通常发送三次探测；星号表示本次未及时收到响应，RTT 可能因排队与回程路径变化而不单调增加。

## 易错点与自测

- Dijkstra 使用全局拓扑，距离向量只向邻居学习估计。
- iBGP 传播外部可达性，不能代替内部路由协议计算到出口的路径。
- BGP 的策略优先级可能高于路径长度。
- OSPF 直接使用 IP，BGP 使用 TCP。
- 控制平面计算表，数据平面根据表执行转发。

??? question "Solution：自测答案"

    到两个出口的内部代价分别为 20 和 50，其他 BGP 属性相同时，热土豆路由选择代价 20 的出口。Traceroute 中途 TTL 到期对应 ICMP Type 11；UDP 探测抵达关闭端口时，对应 Type 3、Code 3。
