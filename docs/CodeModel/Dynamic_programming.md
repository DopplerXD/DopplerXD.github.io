# 动态规划

## 1 01 背包

```cpp
int main() {
    int f[1005] = {0};
    int n, m;
    cin >> n >> m;
    vector<int> w(n);
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> w[i] >> v[i];
    for (int i = 0; i < n; i++) {
        for (int j = m; j >= w[i]; j--) {
            f[j] = max(f[j], f[j - w[i]] + v[i]);
        }
    }
    cout << f[m];
}
```

## 2 完全背包

```cpp
int f[1005];
int main() {
    int n, m;
    cin >> n >> m;
    vector<int> w(n), v(n);
    for (int i = 0; i < n; i++) cin >> w[i] >> v[i];
    for (int i = 0; i < n; i++) {
        for (int j = w[i]; j <= m; j++) {
            f[j] = max(f[j], f[j - w[i]] + v[i]);
        }
    }
    cout << f[m];
}
```

## 3 多重背包-二进制优化

```cpp
int f[2005];
int main() {
    int n, m;
    cin >> n >> m;
    vector<int> w, v, s;
    int a, b, c;
    for (int i = 0; i < n; i++) {
        cin >> a >> b >> c;
        int k = 1;
        while (k <= c) {
            w.push_back(k * a);
            v.push_back(k * b);
            c -= k;
            k *= 2;
        }
        if (c) {
            w.push_back(c * a);
            v.push_back(c * b);
        }
    }
    n = w.size();
    for (int i = 0; i < n; i++) {
        for (int j = m; j >= w[i]; j--) {
            f[j] = max(f[j], f[j - w[i]] + v[i]);
        }
    }
    cout << f[m];
}
```

## 4 单调队列优化背包

```cpp
using ll = long long;
ll dp[20005];
ll q[20005], idx[20005];
int n, m;
std::cin >> n >> m;
for(int i = 1; i <= n; i++) {
    int v, w, s;
    std::cin >> v >> w >> s;
    s = std::min(s, m / v);
    for(int j = 0; j < v; j++) {
        int head = 1, tail = 1;
        for(int k = 0; k <= (m - j) / v; k++) {
            int t = dp[j + k * v] - k * w;
            while(head < tail && q[tail - 1] <= t) tail--;
            q[tail] = t;
            idx[tail++] = k;
            while(head < tail && k - idx[head] > s) head++;
            dp[j + k * v] = std::max(dp[j + k * v], q[head] + k * w);
        }
    }
}
std::cout << dp[m];
```

## 5 分组背包

```cpp
int dp[N];
int n, m;
std::cin >> n >> m;
while(n--) { // n组物品
    int s;
    std::cin >> s;
    std::vector<int> v(s), w(s);
    for(int i = 0; i < s; i++) std::cin >> v[i] >> w[i];
    for(int j = m; j >= 0; j--) { // 先枚举重量再枚举选择哪一个
        for(int k = 0; k < s; k++) {
            if(j >= v[k])
                dp[j] = std::max(dp[j], dp[j - v[k]] + w[k]);
        }
    }
}
std::cout << dp[m];
```

## 6 有依赖背包

```cpp
// todo
```

## 7 状压 DP

我们用一个整数表示一个状态，它的二进制形式记录了某个物品是否被选择了

如状态`10`在二进制中为`1010`, 表示选择了第 1 个和第 3 个物品（下标从 0 开始，二进制位从右至左）. 若要在`10`的基础上选择物品 3, 则状态变为`1110`, 即`14`.

状态的转移可以通过位运算来实现，即 `dp[x | (1 << j)] -> dp[y]`.

### 例题：P1433 吃奶酪

房间里放着 n 块奶酪。一只小老鼠要把它们都吃掉，问至少要跑多少距离？老鼠一开始在 (0,0) 点处。

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 2e5 + 5;
int n;
double x[20], y[20], dis[20][20];
double dp[(1 << 16) + 5][20]; // dp[i][x] 表示经过点的状态为 i，最后一个点是 j
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> x[i] >> y[i];
    }
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            dis[i][j] = dis[j][i] = sqrt(pow(x[i] - x[j], 2) + pow(y[i] - y[j], 2));
        }
    }
    for (int i = 0; i < (1 << n); i++) { // 初始化
        for (int j = 0; j < n; j++) {
            dp[i][j] = 1e7;
        }
    }
    for (int i = 0; i < n; i++) { // 初始化原点到点 i 的距离
        dp[1 << i][i] = sqrt(x[i] * x[i] + y[i] * y[i]);
    }
    for (int i = 0; i < (1 << n); i++) { // 状压 dp
        for (int j = 0; j < n; j++) {
            if ((i & (1 << j)) == 0) continue; // 状态 i 没有经过 j
            for (int k = 0; k < n; k++) {
                if (j == k) continue;
                if ((i & (1 << k)) == 0) continue; // 状态 i 没有经过 k
                // 从 j 到 k 和从 k 到 j 取最小
                dp[i][k] = min(dp[i][k], dp[i - (1 << k)][j] + dis[j][k]);
            }
        }
    }
    double ans = 1e9;
    for (int i = 0; i < n; i++)
        ans = min(ans, dp[(1 << n) - 1][i]);
    cout << fixed << setprecision(2) << ans;
}
```

## 8 数位 DP

### [P2602  ZJOI2010 数字计数](https://www.luogu.com.cn/problem/P2602)

给定两个正整数 a 和 b，求在 [a,b] 的所有整数中，每个数码各出现了多少次

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
ll a, b, dp[15], ten[15];
// dp[i] 表示在 i 位数中每个数出现多少次，如 1、2、3 位数中每个数分别出现 1、20、300 次
// ten[i] 表示 10 的 i 次方
ll cnta[15], cntb[15];
void dfs(ll* cnt, ll x) {
    vector<int> v;
    v.push_back(0);
    ll t = x;
    while (t) {
        v.push_back(t % 10);
        t /= 10;
    }
    int n = v.size() - 1;
    for (int i = n; i >= 1; i--) { // 从高位到低位依次处理
        // 以 324 为例
        // v[3] = 3，先计算 0xx、1xx、2xx，即 dp[2]*v[3]=20*3
        for (int j = 0; j <= 9; j++) cnt[j] += dp[i - 1] * v[i];
        // 再计算从 1 到 v[i]-1 在第 i 位出现的次数，如 100-199 中 1 出现了 100 次
        for (int j = 0; j < v[i]; j++) cnt[j] += ten[i - 1];
        // 再计算 300-324，不完整的 i 位数（完整的为 00-99）中 3 出现的次数
        ll num = 0;
        // 得到 24
        for (int j = i - 1; j >= 1; j--) num = num * 10 + v[j];
        // 还有 300 贡献的一个 3
        cnt[v[i]] += num + 1;
        cnt[0] -= ten[i - 1]; // 去掉前导 0
    }
}
int main() {
    cin >> a >> b;
    ten[0] = 1;
    for (int i = 1; i <= 13; i++) { // init
        dp[i] = ten[i - 1] * i;
        ten[i] = ten[i - 1] * 10;
    }
    dfs(cnta, a - 1);
    dfs(cntb, b);
    for (int i = 0; i <= 9; i++) {
        cout << cntb[i] - cnta[i] << " ";
    }
}
```

### [P2657 SCOI2009 windy 数](https://www.luogu.com.cn/problem/P2657)

不含前导零且相邻两个数字之差至少为 $2$ 的正整数被称为 windy 数。windy 想知道，在 $a$ 和 $b$ 之间，包括 $a$ 和 $b$ ，总共有多少个 windy 数？

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
int a, b;
int ub[12], len; // upper_bound 表示第 i 为能取的最大数，从 1 开始是最高位
int dp[15][15];
// flag 表示上一位是否达到上限，若 flag=1 则当前为也只能取到 upper bound
int dfs(int pos, int pre, bool flag) { // pre = 11 表示前一位是前导 0
    if (pos <= 0) return 1;
    int max_num;
    if (!flag && dp[pos][pre] != -1) {
        return dp[pos][pre];
    }
    if (flag) max_num = ub[pos];
    else max_num = 9;
    int res = 0;
    for (int i = 0; i <= max_num; i++) {
        if (abs(i - pre) >= 2) {
            if (pre == 11 && i == 0) // 当前仍然属于前导 0
                res += dfs(pos - 1, pre, flag && (i == ub[pos]));
            else
                res += dfs(pos - 1, i, flag && (i == ub[pos]));
        }
    }
    if (!flag) dp[pos][pre] = res;
    return res;
}
int solve(int x) {
    memset(dp, -1, sizeof(dp));
    len = 0;
    int t = x;
    while (t) {
        ub[++len] = t % 10;
        t /= 10;
    }
    return dfs(len, 11, true);
}
int main() {
    cin >> a >> b;
    int x = solve(a - 1);
    int y = solve(b);
    cout << y - x << endl;
}
```

## 9 求最大子段和

```cpp
int dp[N], a[N], ans = 0;
memset(dp, 0, sizeof(dp));
for(int i = 1; i <= n; i++) {
	if(dp[i - 1] > 0)
		dp[i] = dp[i - 1] + a[i];
	else
		dp[i] = a[i];
	ans = max(ans, dp[i]);
}
```

