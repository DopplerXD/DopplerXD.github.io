## Enumeration 枚举 / Brute Force 暴力

### Example 1: Coin Flipping

9 行 N 列（1e4）的硬币，初始朝上的面随机，每次操作可翻转整行或整列，如何最大化面朝上的硬币的数量。



### Example2: Discrete Function

二维平面 N 个点，对于一对 points，其区间内的点均在这两个点的构成的线段之下，则为 good points。求所构成直线斜率最大的 good points。

$O(n^3)$: 枚举所有点对，并逐个 check 与更新答案。

$O(n^2)$: 枚举左端点，对于每个左端点，枚举其余点，斜率最大的一定是 good pair，更新答案。

$O(n)$: 只检查相邻点。如对于 $X_{A}<X_{B}<X_{C},Y_{A}<Y_{C}$，存在一以下情况：

- $Y_{A}<Y_{B}<Y_{C}$，则 AB 或 BC 优于 AC；
- $Y_{A}>Y_{B}<Y_{C}$，则 BC 优于 AC。

![](assets/Review%20of%20Classic%20Algorithms/file-20260905163840555.png)

因此只需要 check 响铃点对，并更新答案。

## Greedy 贪心

### Example3: Gone Fishing



### Example4: Enlightened Landscape

CEOI 2000 https://tioj.ck.tp.edu.tw/problems/1404

在一片山的上空，高度为 T 处有 N 个处于不同位置的灯泡，如图。如果山的边界上某一点于某灯 i 的连线不经过山的其它点，我们称灯 i 可以照亮该点。开尽量少的灯，使得整个山景都被照亮。山被表示成有 m 个转折点的折线。

- 照亮山景相当于照亮每一个转折点

核心转化是：对每个山景折点 $P_i$，求出所有能够直接照到它的灯泡范围，记成一个灯泡区间 $[Li, Ri]$。于是问题变成：

> 选择尽量少的灯泡，使每个区间 $[Li, Ri]$ 中至少选中一个灯泡。

然后按区间右端点从小到大处理：

- 找到当前第一个还没被覆盖的区间 $[Li, Ri]$；
- 在这个区间内选择**最靠右的灯泡**；
- 该灯泡能覆盖的后续区间全部跳过；
- 重复直到所有区间都被覆盖。

每个区间至少选一盏灯，而在不影响当前区间的前提下，灯越靠右，越可能顺便覆盖后面的区间，因此不会比选择更靠左的灯更差。这就是经典的 **minimum interval stabbing / 区间选点贪心**。CEOI 原题要求的也是“打开最少灯泡照亮整个 landscape”。([NJSZT iTF](https://itf.njszt.hu/wp-content/uploads/2023/09/ceoi_2001.pdf?utm_source=chatgpt.com "Chronicle of CEOI ♦ a Collections of Tasks"))

如果区间已经求出，贪心部分通常是 $O (M\log M)$；若利用题目本身的有序性质，可以进一步线性扫描。

![](assets/Review%20of%20Classic%20Algorithms/file-20260905164911521.png)




## Dynamic Programming 动态规划

- Top-Down Approach (Memoizing)
    - 记忆化递归
- Bottom-Up Approach
    - 递推

### Example1: LCS (Longest Common Substring)

![](assets/Review%20of%20Classic%20Algorithms/file-20260905170645561.png)

### Example2: Dance Dance Revolution

Mr. White 很喜欢跳舞机，希望在正确跟随旋律的同时消耗尽量少的能量。

规则：每出现一个新符号，必须移动一只脚到该符号对应的位置，另一只脚保持原位。

能量消耗：

- 移动到相邻位置：$3$
- 移动到相对位置：$4$
- 从中心位置移动到任意位置：$2$
- 脚点击当前所在位置：$1$

状态不能只写成 $d[i]$，因为下一步的决策还取决于两只脚当前分别在哪个位置。定义

$$d[i][j][k]$$

表示完成前 $i$ 个动作后，左脚在位置 $j$、右脚在位置 $k$ 时的最小能量。

状态设计的标准是：未来的决策只依赖当前状态，而不依赖到达该状态的具体过程。每来一个新符号，只需尝试移动左脚或右脚，并按移动规则更新状态和能量。


## Divide and Conquer 分治

分治的基本思想：将一个大问题拆分成规模更小的子问题，分别求解后，再以适当方式合并子问题的答案。运行时间通常依赖递推式分析。

### Example 3: Tree Model: Tree 上的最大独立集

给定一棵树，求一个规模最大的 comfortable group。若集合中任意两个节点之间都没有边，则称该集合为 comfortable group，也就是树上的独立集。

以某个节点为根。对节点 $u$，根据是否选择 $u$ 定义两个状态：

- $dp[u][0]$：不选择 $u$ 时，以 $u$ 为根的子树能够得到的最大独立集大小；
- $dp[u][1]$：选择 $u$ 时，以 $u$ 为根的子树能够得到的最大独立集大小。

若 $v$ 是 $u$ 的子节点，则有

$$dp[u][0]=\sum_{v\in child(u)}\max(dp[v][0],dp[v][1])$$

$$dp[u][1]=1+\sum_{v\in child(u)}dp[v][0]$$

其中，选择 $u$ 后不能再选择任何子节点。对整棵树进行一次 DFS 即可得到答案
$\max(dp[root][0],dp[root][1])$，时间复杂度为 $O(n)$。

[Luogu T226181 树的最大独立集](https://www.luogu.com.cn/problem/T226181)

[Luogu P1352 没有上司的舞会](https://www.luogu.com.cn/problem/P1352)

### Example 4: 最小化树中的最长路径

问题：在树上选择一个位置，使选择位置到所有节点的最大距离尽可能小。该最大距离就是以该位置为起点的最长路径长度。

这个问题可以从不同角度解决：

- **Greedy version**：利用树的直径。直径的两个端点分别为 $a,b$，使最长路径最小的位置位于 $a$ 到 $b$ 的中点附近；答案为 $\lceil dist(a,b)/2\rceil$。
- **DP version**：在根树上维护向下路径和经过当前节点的路径信息，合并子树答案。
- **Shorter-time DP**：通过两次树上 DFS/BFS 求出直径端点及各点到端点的距离，再在线性时间内确定最优位置。

## Selection 选择问题

### Example 5: 第 $k$ 大元素

给定 $N$ 个数，且 $N>k$，求第 $k$ 大的元素。

#### 方法一：完整排序

将所有元素读入数组，按降序排序，返回第 $k$ 个位置的元素。时间复杂度为 $O(n\log n)$。

#### 方法二：维护前 $k$ 个元素

先读入前 $k$ 个元素并按降序排列。之后逐个读入剩余元素：

- 若该元素不大于当前第 $k$ 大元素，则忽略；
- 否则将其插入正确位置，并淘汰原数组中的一个元素。

最后数组中的第 $k$ 个元素就是答案。这种方法类似较慢的外部排序过程，若直接使用数组插入，单次更新可能需要 $O(k)$ 时间。

#### 方法三：Quickselect

使用 Quicksort 中的 partition 操作。设 pivot 的最终排名为 $p$：

- 若 $p=k$，直接返回 $A[k]$；
- 若 $p>k$，只在 pivot 左侧递归寻找第 $k$ 大元素；
- 若 $p<k$，只在 pivot 右侧递归寻找调整后的第 $k-p-1$ 大元素。

每轮只递归处理一侧，因此平均时间复杂度为 $O(n)$，但最坏情况下仍可能达到 $O(n^2)$。

#### 方法四：Median of Medians

为了获得更好的 pivot，将元素分成每组 $5$ 个：

1. 求出每组的中位数；
2. 递归求这些中位数的中位数，作为 pivot；
3. 根据 pivot 进行 partition。

该 pivot 能保证划分后至少约 $30\%$ 的元素位于两侧，从而满足递推式

$$T(n)\le T(n/5)+T(7n/10)+O(n)$$

由代入法可得 $T(n)=O(n)$。因此，Median of Medians 能在线性最坏时间内解决选择问题。

## Maximum Subarray 最大子数组

### 股票买卖的转化

给定连续日期的股票价格，希望选择买入日和卖出日，使收益最大，即低价买入、高价卖出。直接枚举所有买卖日期对即可得到暴力解，但运行时间为 $O(n^2)$。

令

$$A[i]=price[i+1]-price[i]$$

则一段时间内的收益等于对应差分数组的连续子数组之和。因此问题转化为：在 $A$ 中寻找一个非空连续子数组，使其元素和最大，这个子数组称为 maximum subarray。
 不会 
### 分治解法

考虑子数组 $A[low,\ldots,high]$，令

$$mid=\lfloor (low+high)/2\rfloor$$

最大子数组只有三种情况：

- 完全位于左半部分 $A[low,\ldots,mid]$；
- 完全位于右半部分 $A[mid+1,\ldots,high]$；
- 横跨中点。

前两种情况递归求解。对于横跨中点的情况，只需：

- 从 $mid$ 向左扫描，求以 $mid$ 结尾的最大子数组；
- 从 $mid+1$ 向右扫描，求以 $mid+1$ 开始的最大子数组；
- 将两者相加。

取三种情况中的最大值即可。递推式为

$$T(n)=2T(n/2)+O(n)$$

因此时间复杂度为 $O(n\log n)$。

### Kadane 算法

Kadane 算法使用动态规划在线性时间内解决最大子数组问题。扫描到位置 $j$ 时，维护：

- 以 $j$ 结尾的最大子数组和；
- 从已扫描部分得到的全局最大子数组和。

设 $bestEndingHere$ 表示以当前位置结尾的最大和，则更新为

$$bestEndingHere=\max(A[j],\ bestEndingHere+A[j])$$

再用它更新全局答案：

$$best=\max(best,\ bestEndingHere)$$

每个元素只处理一次，因此时间复杂度为 $O(n)$，额外空间复杂度为 $O(1)$。

> 其实就是，如果 $a_{i-1}<0$，则不更新 $a_{i}$。
> 
> 否则，$a_{i}=a_{i}+a_{i-1}$。

[Luogu P1115 最大子段和](https://www.luogu.com.cn/problem/P1115)

```cpp
int n;
std::cin >> n;
std::vector<int> a(n);
for (int i = 0; i < n; i++) std::cin >> a[i];

int ans = a[0];

for (int i = 1; i < n; i++) {
    if (a[i - 1] > 0) {
        a[i] += a[i - 1];
    }
    ans = std::max(ans, a[i]);
}

std::cout << ans << '\n';
```

## 小结

枚举、贪心、动态规划和分治是后续课程中会反复出现的基本方法。同一个问题往往可以从不同角度得到不同复杂度的算法，因此需要主动比较状态设计、正确性和运行时间。
