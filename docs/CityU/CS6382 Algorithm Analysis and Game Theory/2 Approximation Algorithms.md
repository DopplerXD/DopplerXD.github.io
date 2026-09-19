## Knapsack 背包问题

### 决策问题与优化问题

给定物品集合

$$X=\{a_1,\ldots,a_n\}$$

每个物品 $a_i$ 有成本 $c_i\ge 0$ 和价值 $v_i\ge 0$，背包容量为 $B$。

**决策问题**：给定目标价值 $V$，是否存在子集 $S\subseteq X$，满足

$$\sum_{a_i\in S}c_i\le B,\qquad \sum_{a_i\in S}v_i\ge V?$$

**优化问题**：寻找满足成本约束的子集 $S$，最大化总价值。

[【模板】0-1 背包问题](https://www.luogu.com.cn/problem/U329907)

### Knapsack 的动态规划

令 $S_{i,p}$ 表示从 $\{a_1,\ldots,a_i\}$ 中选出、总价值恰好为 $p$ 且成本最小的子集。若不存在这样的子集，则记为无穷大。

定义

$$c(S_{i,p})=
\begin{cases}
\infty,&S_{i,p}\text{ 不存在},\\
\displaystyle\sum_{a_j\in S_{i,p}}c_j,&\text{otherwise}.
\end{cases}$$

初始状态为

$$S_{1,p}=\begin{cases}
\{a_1\},&p=v_1,\\
\varnothing,&\text{otherwise}.
\end{cases}$$

处理物品 $a_{i+1}$ 时：

$$S_{i+1,p}=\begin{cases}
\displaystyle\arg\min\{c(S_{i,p}),c(\{a_{i+1}\}\cup S_{i,p-v_{i+1}})\},
&v_{i+1}\le p\text{ 且 }S_{i,p-v_{i+1}}\text{ 存在},\\
S_{i,p},&\text{otherwise}.
\end{cases}$$

设 $V^*=\max_i v_i$。计算所有 $i$ 和 $p\in\{0,1,\ldots,nV^*\}$ 后，最优解为

$$\arg\max_{p:c(S_{n,p})\le B}v(S_{n,p}).$$

该算法的时间复杂度为 $O(n^2V^*)$。它看起来是多项式时间，但这里的 $V^*$ 是数值大小，而不是输入编码长度。若 $V^*$ 用二进制表示，只需要 $\log V^*$ 位，因此 $O(n^2V^*)$ 关于输入长度可能是指数级的。这类算法称为**伪多项式时间算法**。

## 近似算法的定义

虽然 Knapsack 的动态规划不是严格的多项式时间算法，但可以通过舍入价值把它转化为多项式时间的近似算法。

对于最大化问题，若算法对任意输入都返回可行解 $S$，并满足

$$\frac{f(S)}{f(O)}\ge \alpha,$$

其中 $O$ 是最优解，则称该算法为 **$\alpha$-近似算法**。这里 $f$ 表示解的质量，通常 $0<\alpha\le 1$。

对于最小化问题，若算法返回的可行解 $S$ 满足

$$\frac{f(S)}{f(O)}\le \alpha,$$

则称其为 **$\alpha$-近似算法**，通常 $\alpha\ge 1$。

### Knapsack 的 PTAS

取任意 $0<\varepsilon<1$，令

$$k=\frac{\varepsilon V^*}{n},\qquad v_i'=\left\lfloor\frac{v_i}{k}\right\rfloor.$$

使用缩小后的价值 $v_i'$ 运行前面的动态规划。缩小后的最大价值为 $O(n/\varepsilon)$，因此运行时间为

$$O\left(n^2\cdot\frac{V^*}{k}\right)
=O\left(\frac{n^3}{\varepsilon}\right).$$

这对固定的 $\varepsilon$ 是多项式时间，因此构成 Knapsack 的 Polynomial-Time Approximation Scheme（PTAS）。

设 $S$ 为算法在 $v'(\cdot)$ 下得到的解，$O$ 为原问题的最优解。由于

$$v_i'=\left\lfloor\frac{v_i}{k}\right\rfloor\ge \frac{v_i}{k}-1,$$

且 $|O|\le n$，有

$$
\begin{aligned}
v(S)&\ge k\cdot v'(S)\\
&\ge k\cdot v'(O)\\
&\ge v(O)-k|O|\\
&\ge OPT-kn\\
&=OPT-\varepsilon V^*\\
&\ge (1-\varepsilon)OPT.
\end{aligned}
$$

因此

$$v(S)\ge (1-\varepsilon)OPT.$$

## 复杂度与可近似性

### Strongly NP-complete

伪多项式算法并不意味着 $P=NP$。例如 SUBSET-SUM、KNAPSACK 和 PARTITION 的 NP 完全性证明会使用指数大小的整数。

如果一个问题即使限制输入中的整数都不超过输入长度的某个多项式函数，仍然是 NP 完全的，则称该问题为 **强 NP 完全问题（strongly NP-complete）**。VERTEX-COVER、SET-COVER 和 INDEPENDENT-SET 等问题可以通过只构造多项式大小的整数完成 NP 完全性证明。

### NP-hard

证明一个决策问题 $Y$ 为 NP 完全问题通常分两步：

1. 证明 $Y\in NP$；
2. 从已知的 NP 完全问题 $X$ 出发，证明 $X\le_pY$。

若只能证明所有 NP 中的问题都可以在多项式时间归约到问题 $A$，却无法证明 $A\in NP$，则称 $A$ 为 **NP-hard**，而不能称为 NP-complete。优化问题通常不是决策问题，因此也常被称为 NP-hard。

## Vertex Cover 顶点覆盖

给定图 $G=(V,E)$。

**决策问题**：给定整数 $k$，是否存在至多包含 $k$ 个顶点的集合 $C\subseteq V$，使每条边至少有一个端点属于 $C$？

**优化问题**：寻找大小最小的顶点覆盖。

### 基于匹配的 2-近似算法

算法反复执行以下步骤：

1. 任意选择一条尚未覆盖的边 $(u,v)$；
2. 将 $u$ 和 $v$ 都加入覆盖集合 $C$；
3. 删除所有与 $u$ 或 $v$ 相邻的边；
4. 直到没有未覆盖的边。

伪代码为：

```text
C ← ∅
while E ≠ ∅ do
    choose any edge {u, v} ∈ E
    C ← C ∪ {u, v}
    delete all edges incident to u or v
return C
```

算法选出的边集合 $M$ 是一个 matching，因为任意两条被选边都不共享端点。

- 算法返回的集合 $C$ 是顶点覆盖，因为每次删除的边都至少有一个端点加入 $C$；
- 最优顶点覆盖必须覆盖 $M$ 中的每条边，而 $M$ 中的边两两不相交，因此

$$OPT\ge |M|;$$

- 算法加入两个端点，所以

$$ALG=2|M|\le 2OPT.$$

因此该算法是一个 2-近似算法。

### 加权 Vertex Cover 与整数规划

每个顶点 $i$ 有权重 $w_i$。令 $x_i\in\{0,1\}$ 表示是否选择顶点 $i$，得到整数线性规划：

$$
\begin{aligned}
\min\quad &\sum_{i\in V}w_ix_i\\
\text{s.t.}\quad &x_i+x_j\ge 1, &&(i,j)\in E,\\
&x_i\in\{0,1\}, &&i\in V.
\end{aligned}
$$

每条边 $(i,j)$ 至少有一个端点被选择，因此约束为 $x_i+x_j\ge 1$。

将整数约束放松为 $x_i\ge 0$，得到线性规划（LP）：

$$
\begin{aligned}
\min\quad &\sum_{i\in V}w_ix_i\\
\text{s.t.}\quad &x_i+x_j\ge 1, &&(i,j)\in E,\\
&x_i\ge 0, &&i\in V.
\end{aligned}
$$

LP 的可行域更大，因此

$$OPT_{LP}\le OPT_{ILP}.$$

但 LP 的最优解可能包含分数值，不能直接对应一个顶点覆盖。例如三角形图中可以令每个顶点的值都为 $1/2$。

### LP rounding

设 $x^*$ 是 LP 最优解，取

$$S=\left\{i\in V\mid x_i^*\ge \frac12\right\}.$$

由于对任意边 $(i,j)$ 都有 $x_i^*+x_j^*\ge 1$，至少有一个端点的值不小于 $1/2$，所以 $S$ 是顶点覆盖。

令 $W(S)=\sum_{i\in S}w_i$，则

$$
\sum_{i\in V}w_ix_i^*
\ge \sum_{i\in S}w_ix_i^*
\ge \frac12\sum_{i\in S}w_i
=\frac12W(S).
$$

因此

$$W(S)\le 2OPT_{LP}\le 2OPT_{ILP}.$$

LP rounding 是一个多项式时间的 2-近似算法。

### Vertex Cover 的近似下界

- Dinur–Safra（2004）：若 $P\ne NP$，则即使所有权重都为 $1$，也不存在 $ρ$-近似算法，其中 $\rho<1.3606$。
- Khot–Regev（2008）：若 Unique Games Conjecture 成立，则对任意 $\varepsilon>0$，不存在 $(2-\varepsilon)$-近似算法。

## Set Cover 集合覆盖

给定全集 $U$、子集族 $\mathcal S\subseteq 2^U$ 和整数 $k$。

**决策问题**：是否可以从 $\mathcal S$ 中选出至多 $k$ 个集合，使它们的并集等于 $U$？

**优化问题**：寻找覆盖全集所需的最少集合。

### Greedy 算法

每轮选择能够覆盖最多未覆盖元素的集合，删除已经覆盖的元素，然后重复，直到全集被覆盖。

设最优解使用 $k$ 个集合，全集大小为 $n$。由于这 $k$ 个集合覆盖当前剩余元素，至少存在一个集合可以覆盖当前剩余元素的 $1/k$。Greedy 选择覆盖最多元素的集合，因此第一轮后至多剩下

$$n\left(1-\frac1k\right)$$

个元素。经过 $t$ 轮后，剩余元素数至多为

$$n\left(1-\frac1k\right)^t\le n e^{-t/k}.$$

当 $t=k\ln n$ 时，剩余元素数小于等于 $1$，因此算法最多选择

$$k\ln n$$

个集合。于是 Greedy 是一个 $O(\ln n)$-近似算法，更精确地可写为 $H_n$-近似，其中 $H_n$ 是第 $n$ 个调和数。

该近似比在一般假设下基本无法进一步改善：除非 NP 中的所有问题都可以在 $n^{o(\log\log n)}$ 时间内求解，否则对任意常数 $\varepsilon>0$，不存在比 $(1-\varepsilon)\ln n$ 更好的近似保证。

## Independent Set 独立集

给定图 $G=(V,E)$，寻找一个最大顶点集合 $S$，使任意两个被选顶点之间都没有边。

直觉上可以反复选择当前度数最小的顶点，但在完全图中，所有顶点都相邻，简单的贪心选择可能很快陷入很差的结果。

若图的最大度数不超过 $\Delta$，可以使用如下 Greedy 算法：

```text
W ← V
S ← ∅
while W ≠ ∅ do
    choose v ∈ W with minimum degree in G[W]
    W ← W − N[v]
    S ← S ∪ {v}
return S
```

每次选择一个顶点，至多删除 $\Delta+1$ 个顶点。若最终选出 $|S|$ 个顶点，则

$$n\le (\Delta+1)|S|.$$

又因为 $OPT\le n$，所以

$$|S|\ge \frac{n}{\Delta+1}\ge \frac{OPT}{\Delta+1}.$$

因此该算法是 $(\Delta+1)$-近似算法。

## Knapsack 的贪心近似

### Fractional Knapsack

Knapsack 的整数规划形式为

$$
\begin{aligned}
\max\quad &v^Tx\\
\text{s.t.}\quad &\sum_{i=1}^nc_ix_i\le B,\\
&x_i\in\{0,1\}.
\end{aligned}
$$

在 Fractional Knapsack 中允许 $0\le x_i\le 1$。令物品密度为

$$\frac{v_i}{c_i}.$$

按密度从高到低排序，依次装入物品。当下一个物品会超出容量时，只装入其中一部分，使容量恰好用完：

$$x_i=\frac{B-\sum_{j<i}c_j}{c_i}.$$

这可以在线性规划松弛中得到最优解，但直接把分数物品丢弃可能没有常数近似比。例如：

- 物品 1 的成本为 $1$、价值为 $2$；
- 物品 2 的成本为 $M$、价值为 $M$，其中 $M>2$；
- 背包容量为 $B=M$。

若按密度装入，先装入物品 1 后只剩 $M-1$ 容量，物品 2 只能装入分数部分。丢弃该分数物品后，算法得到的价值为 $2$，而最优整数解只选物品 2，价值为 $M$，近似比随 $M$ 增长而变差。

### 2-近似算法

构造两个候选解：

- $ALG_1$：按密度贪心装入完整物品，放不下下一个物品时停止，并丢弃分数物品；
- $ALG_2$：只选择单个价值最大的、且能够放入背包的物品。

最终返回

$$ALG=\max\{ALG_1,ALG_2\}.$$

设分数背包最优解中，前面完整装入的物品价值之和为 $v_1+\cdots+v_{i-1}$，分数物品的价值为 $v_i$。有

$$OPT\le OPT_{LP}\le v_1+\cdots+v_{i-1}+v_i.$$

其中前一部分不超过 $ALG_1$，而 $v_i\le ALG_2$，因此

$$OPT\le ALG_1+ALG_2\le 2\max\{ALG_1,ALG_2\}=2ALG.$$

所以该算法是多项式时间的 2-近似算法。

## Travelling Salesman Problem 旅行商问题

给定 $n$ 个城市，以及任意两个城市 $i,j$ 之间的非负距离 $l(i,j)$，寻找访问每个城市恰好一次并回到起点的最短回路。

特别地，若距离满足三角不等式

$$l(u,w)\le l(u,v)+l(v,w),$$

则称为 Metric TSP。

从任意 TSP tour 中删除一条边，就得到一棵 spanning tree，因此

$$OPT\ge MST,$$

其中 $MST$ 是最小生成树的总长度。

### Metric TSP 的 2-近似

算法：

1. 计算图的最小生成树 $T$；
2. 对 $T$ 做深度优先搜索，按照第一次访问顺序为顶点编号；
3. 按该编号顺序访问所有城市，并返回起点。

DFS 对 MST 的每条边至多经过两次，因此 DFS walk 的长度为

$$2\cdot MST.$$

将 DFS 中重复访问的顶点直接跳过，并利用三角不等式，得到的 tour 不会更长。因此

$$ALG\le 2\cdot MST\le 2OPT.$$

所以该算法是 Metric TSP 的 2-近似算法。

### 一般加权 TSP 的不可近似性

当距离不满足三角不等式时，TSP 不存在常数近似算法，除非 $P=NP$。证明从 Hamiltonian Cycle 归约。

给定一个有 $n$ 个顶点的无向图 $G$，在完全图 $K_n$ 上定义距离：

$$l(e)=
\begin{cases}
1,&e\text{ 是 }G\text{ 中的边},\\
n+1,&\text{otherwise}.
\end{cases}$$

- 如果 $G$ 有 Hamiltonian cycle，则 $K_n$ 中存在长度恰好为 $n$ 的 TSP tour；
- 如果 $G$ 没有 Hamiltonian cycle，则每个 TSP tour 至少使用一条长度为 $n+1$ 的边，因此总长度至少为 $2n$。

这说明 TSP 是 NP-hard。进一步，假设存在一个多项式时间的 $(2-\varepsilon)$-近似算法：

- 若输出长度小于 $2n$，则可以判断 $G$ 存在 Hamiltonian cycle；
- 若输出长度大于等于 $2n$，则可以判断 $G$ 不存在 Hamiltonian cycle。

这样就能在多项式时间内解决 Hamiltonian Cycle。因此，除非 $P=NP$，不存在一般加权 TSP 的多项式时间 $(2-\varepsilon)$-近似算法。通过增大非原图边的长度，可将该结论推广为：对于任何可在多项式时间计算的函数 $f(n)$，一般加权 TSP 不存在多项式时间 $f(n)$-近似算法。

## 总结

近似算法的设计通常结合以下方法：

- **Greedy**：例如 Set Cover；
- **Dynamic Programming**：例如 Knapsack；
- **Linear Programming + Rounding**：例如 Weighted Vertex Cover；
- **利用问题结构和与 P 类问题的关系**：例如 Vertex Cover、Metric TSP；
- **组合多个算法**：例如 Knapsack 中同时比较贪心解和最大单物品解；
- **Divide-and-Conquer、Local Search 和 Reductions**。

分析近似算法时，应关注：

1. 算法使用了什么结构；
2. 问题属于 P、NP-complete 还是 NP-hard；
3. 近似比的证明是否成立；
4. 该近似比是否紧；
5. 是否可以用反例否定更强的猜想；
6. 是否可以改进近似比，或证明近似比的下界。
