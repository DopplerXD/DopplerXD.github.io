# 数论

## 1 乘法取模

```cpp
ll mul(ll a, ll b, ll m) {
    a = a % m, b = b % m;
    ll res = 0;
    while (b > 0) {
        if (b & 1) res = (res + a) % m;
        a = (a + a) % m;
        b >>= 1;
    }
    return res;
}
```

## 2 快速幂取模

```cpp
ll fastPow(ll a, ll n, ll mod) { // (a^n)%m
    ll ans = 1;
    a %= mod;
    while (n) {
        if (n & 1)ans = (ans * a) % mod;
        a = (a * a) % mod;
        n >>= 1;
    }
    return ans;
}
```

## 3 矩阵乘法&快速幂

```cpp
int mod;
struct matrix { int m[N][N]; };
matrix operator * (const matrix& a, const matrix& b) {
    matrix c;
    memset(c.m, 0, sizeof(c.m));
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            for (int k = 0; k < N; k++)
                c.m[i][j] = (c.m[i][j] + a.m[i][k] * b.m[k][j]) % mod;
    return c;
}
matrix pow_matrix(matrix a, int n) {
    matrix ans;
    memset(ans.m, 0, sizeof(ans.m));
    for (int i = 0; i < N; i++)
        ans.m[i][i] = 1;
    while (n) {
        if (n & 1) ans = ans * a;
        a = a * a;
        n >>= 1;
    }
    return ans;
}
```

## 4 GCD & LCM

`裴蜀定理` 如果 a 和 b 均为整数，则有整数 x 和 y 使 ax+by=gcd(a,b)；ab 互素当且仅当存在 x 和 y 使得 ax+by=1

```cpp
int gcd(int a, int b) {
    if (b == 0)
        return a;
    return gcd(b, a % b);
}
int lcm(int a, int b) {
    return a / gcd(a, b) * b;
}
```

## 5 扩展欧几里得

$ax+by=c$ 有解的充要条件是 $d=gcd(a,b)$ 能整除 $c$
扩展欧几里得算法求解二元丢番图方程，进而求解 $ax+by=c$ 的特解

1. 判断方程是否有整数解，即 $d$ 能整除 $c$
2. exgcd 求 $ax+by=d$ 的特解 $xx$ 和 $yy$
3. $a \cdot xx+b \cdot yy=d$ 两边同乘 $\frac{c}{d}$，对照 $ax+by=c$，得特解 $xx'=xx* \frac{c}{d},yy'=yy* \frac{c}{d}$
4. 方程 $ax+by=c$ 的通解为 $x = xx‘+(b/d)n, y = yy'-(a/d)n$

```cpp
ll extend_gcd(ll a, ll b, ll& x, ll& y) { // 返回 d=gcd(a,b), x 和 y 是 ax+by=d 的一组特解
    if (b == 0) { x = 1; y = 0; return a; }
    ll d = extend_gcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}
```

## 6 求解同余方程（求逆）

```cpp
ll mod_inverse(ll a, ll m) { // ax===1(mod m)
    ll x, y;
    extend_gcd(a, m, x, y);
    return (x % m + m) % m;
}
```

## 7 费马小定理

设 $n$ 为素数，$a$ 是正整数且与 n 互素，则有 $a^{n-1}\equiv 1(mod\enspace n)$

```cpp
ll mod_inverse(ll a, ll mod) {
    return fastPow(a, mod - 2, mod);
}
```

## 8 Miller-Rabin 素性测试

```cpp
ll fastPow();
bool witness(ll a, ll n) {
    ll u = n - 1;
    int t = 0;
    while (u & 1 == 0) u >>= 1, t++;
    ll x1, x2;
    x1 = fastPow(a, u, n);
    for (int i = 1; i <= t; i++) {
        x2 = fastPow(x1, 2, n);
        if (x2 == 1 && x1 != 1 && x1 != n - 1) return true;
        x1 = x2;
    }
    if (x1 != 1) return true;
    return false;
}
int miller_rabin(ll n, int s) {
    if (n < 2) return 0;
    if (n == 2) return 1;
    if (n % 2 == 0) return 0;
    for (int i = 0; i < s && i < n; i++) {
        ll a = rand() % (n - 1) + 1;
        if (witness(a, n)) return 0;
    }
    return 1;
}
void solve() { // main
    int m;
    while (scanf("%d", &m) != EOF) {
        int cnt = 0;
        for (int i = 0; i < m; i++) {
            ll n;
            scanf("%lld", &n);
            int s = 50;
            cnt += miller_rabin(n, s);
        }
        printf("%d\n", cnt);
    }
}
```

## 9 欧拉筛

```cpp
int prime[N];
bool vis[N];
int euler_sieve(int n) {
    int cnt = 0;
    memset(prime, 0, sizeof(prime));
    memset(vis, 0, sizeof(vis));
    for (int i = 2; i <= n; i++) {
        if (!vis[i]) prime[cnt++] = i;
        for (int j = 0; j < cnt; j++) {
            if (i * prime[j] > n) break;
            vis[i * prime[j]] = 1;
            if (i % prime[j] == 0) break;
        }
    }
    return cnt;
}
```

## 10 欧拉函数

威尔逊定理：若 $p$ 为素数，则 $p$ 可以整除 $(p-1)! + 1$

```cpp
int euler(int n) { // 求欧拉函数值
    int ans = n;
    for (int p = 2; p * p <= n; ++p) {
        if (n % p == 0) {
            ans = ans / p * (p - 1);
            while (n % p == p)
                n /= p;
        }
    }
    if (n != 1) ans = ans / n * (n - 1);
    return ans;
}
```

## 11 二项式定理&卢卡斯定理

二项式定理：$C(n,r) \mod m=(n! \mod m)((r!)^{-1} \mod m)((n-r!)^{-1} \mod m) \mod m$
卢卡斯定理：要求 $m$ 为素数

```cpp
ll fac[N];
ll fastPow(ll a, ll n, ll m) {
    ll ans = 1;
    a %= m;
    while (n) {
        if (n & 1) ans = (ans * a) % m;
        a = (a * a) % m;
        n >>= 1;
    }
    return ans;
}
ll inverse(ll a, int m) { return fastPow(fac[a], m - 2, m); }
ll C(ll n, ll r, int m) {
    if (r > n) return 0;
    return ((fac[n] * inverse(r, m)) % m * inverse(n - r, m) % m);
}
ll lucas(ll n, ll r, int m) {
    if (r == 0) return 1;
    return C(n % m, r % m, m) * lucas(n / m, r / m, m) % m;
}
```

## 12 Bash Game

```cpp
void Bash_game() {
    int n, m; // 共 n 个，每次最多拿 m 个
    cin >> n >> m;
    if (n % (m + 1) == 0) cout << "second\n";
    else cout << "first\n";
}
```

## 13 素数筛 O(n)

```cpp
int cnt = 0, prime[N], v[N];
for(int i = 2; i <= n; i++) {
    if(v[i] == 0) {
        v[i] = i;
        prime[++cnt] = i;
    }
    for(int j = 1; j <= cnt; j++) {
        if(prime[j] > v[i] || i * prime[j] > n) break; // 保证每一个合数都是被他的最小质因子筛掉
        v[i * prime[j]] = prime[j]; // v[i] 表示 i 的最小质因子
    }
}
```

## 14 分解质因数

```cpp
void divide(int n) {
    for (int i = 2; i <= n / i; i++) {
        if (n % i == 0) {
            int t = 0;
            while (n % i == 0) {
                n /= i;
                t++;
            }
            //输出分解出的因数和个数 
            printf("%d %d\n", i, t);
        }
    }
    //如果 n 大于 1，则 n 为质数 
    if (n > 1)	printf("%d 1\n", n);
}
```

预处理质数后用 prime 数组分解

```cpp
void div(int n) {
    int i, j;
    for (i = 1; i <= n / prime[i]; i++) {
        int t = prime[i];
        if (n % t == 0) {
            int num = 0;
            while (n % t == 0) {
                n /= t;
                num++;
            }
            res[fcnt++] = {t,num};
        }
    }
    if (n > 1)
        res[fcnt++] = {n,1};
}
```

## 15 约数

### 算数基本定理

$$
N={P_1}^{a_1}{P_2}^{a_2}{P_3}^{a_3}\dots{P_n}^{a_n}
$$

其中 P 为质数，a 为正整数

### 试除法求约

```cpp
void divisors(int n) {
    vector<int> v;
    for (int i = 1; i <= n / i; i++) {
        if (n % i == 0) {
            v.push_back(i);
            if (i * i != n)
                v.push_back(n / i);
        }
    }
    //按照从小到大的顺序输出它的所有约数 
    sort(v.begin(), v.end());
    for (int i = 0; i < v.size(); i++)
        printf("%d ", v[i]);
}
```

### 求约数的个数

$$
N=(a_1+1)*(a_2+1)*(a_3+1)*\dots*(a_n+1)
$$

### 求所有约数的和

$$
N = ({p_1}^0+{p_1}^1+{p_1}^2…+{p_1}^{a_1} ) * ({p_2}^0+{p_2}^1+…+{p_2}^{a2} ) * … * ({p_n}^0+{p_n}^1+\dots+{p_n}^{a_n})
$$

## 16 中国剩余定理 CRT

> 「物不知数」问题：有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二。问物几何？

> 三人同行七十希，五树梅花廿一支，七子团圆正半月，除百零五便得知。

### 定义

用于求解形如

$$
\begin{cases}
    x\equiv a_1(mod\enspace n_1)\\
    x\equiv a_2(mod\enspace n_2)\\
    \quad \vdots\\
    x\equiv a_k(mod\enspace n_k)
\end{cases}
$$

的方程组时（其中 $a_1,a_2,\dots,a_k$ 两两互质）, 使用中国剩余定理进行计算。

### 过程

1. 计算所有模数的积 $n$
2. 对于第 $i$ 个方程：
   a. 计算 $m_i=\frac{n}{n_i}$
   b. 计算 $m_i$ 在模 $n_i$ 意义下的逆元 $m_i^{-1}$
   c. 计算 $c_i=m_im_i^{-1}$ , `不要`对 $n_i$ 取模。
3. 方程组在模 $n$ 意义下的唯一解为：$x=\sum_{i=1}^{k}a_ic_i(mod\enspace n)$

### 实现

```cpp
ll CRT(int k, ll* a, ll* r) {
	ll n = 1, ans = 0;
	for (int i = 1; i <= k; i++) n = n * r[i];
	for (int i = 1; i <= k; i++) {
		ll m = n / r[i], b, y;
		exgcd(m, r[i], b, y);  // b * m mod r[i] = 1
		ans = (ans + a[i] * m * b % n) % n;
	}
	return (ans % n + n) % n;
}
```

[P1495 【模板】中国剩余定理（CRT）/ 曹冲养猪](https://www.luogu.com.cn/problem/P1495)

给定 $n$ 个方程组，每个方程组形如 $x\equiv b_i(mod\enspace a_i)$ , 求可行解。

```cpp
#include <bits/stdc++.h>
using ll = __int128_t; // 该题会出现乘法过程中爆 longlong 的情况
using namespace std;
const int N = 10 + 5;
int k;
ll a[N], b[N], n = 1;
void exgcd(ll a, ll b, ll& x, ll& y) { // 扩欧求逆
	if (b == 0) {
		x = 1, y = 0;
		return;
	}
	exgcd(b, a % b, y, x);
	y -= a / b * x;
}
int main() {
	ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
	cin >> k;
	ll ans = 0;
	for (int i = 1; i <= k; i++) {
		int x, y;
		cin >> x >> y;
		// cin >> a[i] >> b[i];
		a[i] = x, b[i] = y;
		n *= a[i];
	}
	for (int i = 1; i <= k; i++) {
		ll m = n / a[i];
		ll _m, y;
		exgcd(m, a[i], _m, y);
		ll c = m * _m;
		ans += (c * b[i]) % n;
		ans %= n;
	}
	long long res = (ans + n) % n;
	cout << res << '\n';
}
```

## 17 约瑟夫问题

$n$ 个人编号 $0,1,2…,n-1$ ，每次数到 $k$ 出局，求最后剩下的人的编号。

O(N) 

```cpp
int jos(int n, int k) {
    int res = 0;
    for (int i = 1; i <= n; i++)
        res = (res + k) % i;
    return res;
}
```

$ O(K\log N) $ ，适用于 K 较小的情况。

```cpp
int jos(int n, int k) {
	if (n == 1 || k == 1) return n - 1;
	if (k > n) return (jos(n - 1, k) + k) % n; // 线性算法
	int res = jos(n - n / k, k) - n % k;
	if (res < 0) res += n; // mod n
	else res += res / (k - 1); // 还原位置
	return res; // res+1，如果编号从 1 开始
}
```

## 18 线性判定排列逆序数的奇偶性

https://www.cnblogs.com/patricky/p/linear-permutation-parity.html

```cpp
bool parity = n & 1;
for (int i : p) if (~i) {
    for (int j = i; ~j; ) {
        std::tie(j, p[j]) = std::tuple{p[j], -1};
    }
    parity ^= 1;
}
```

## 19 防爆模乘

以 $O(1)$ 计算 $a \cdot b \% p$ ，由于不取模，常数比 int128 更小。其中 $1 \leq a,b,p \leq 10^{18}$。

```cpp
int mul(int a, int b, int m) {
    int r = a * b - m * (int)(1.L / m * a * b);
    return r - m * (r >= m) + m * (r < 0);
}
```
