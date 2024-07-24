# 组合数学

## 1 斯特林数

第二类斯特林数：$S(n,k)$, 把 $n$ 个不同的球放到 $k$ 个相同的盒子里，不能有空盒子，有多少种分法

+ 求 $S(n, m)$

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const ll N = 2e5 + 5;
const ll inf = 1ll << 62;
const ll mod = 1e9 + 7;
ll fac[100010], inv[100010];
void add(ll& a, ll b) {
    a += b;
    if (a >= mod) a -= mod;
}
ll gcd(ll a, ll b) {
    return b ? gcd(b, a % b) : a;
}
ll qmi(ll a, ll b) {
    ll res = 1;
    for (; b; b >>= 1) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
    }
    return res;
}
ll f(string s, string t) {
    ll p = 0;
    for (ll i = 0; i < s.size(); i++)
        if (p < t.size() && s[i] == t[p]) {
            p++;
        }
    return (p == t.size());
}
void sub(ll& a, ll b) {
    a -= b;
    if (a < 0) a += mod;
}
ll C(ll a, ll b) {
    return fac[a] * inv[b] % mod * inv[a - b] % mod;
}
void solve() {
    ll n, m; cin >> n >> m;
    if (m > n)
        cout << 0 << endl;
    else {
        ll ans = 0;
        for (int i = 0; i <= m; i++) {
            if ((m - i) % 2 == 0) {
                add(ans, qmi(i, n) * inv[i] % mod * inv[m - i] % mod);
            }
            else {
                sub(ans, qmi(i, n) * inv[i] % mod * inv[m - i] % mod);
            }

        }
        cout << ans << endl;
    }
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);
    fac[0] = inv[0] = 1;
    for (int i = 1; i <= 100000; i++)
        fac[i] = fac[i - 1] * i % mod;
    inv[100000] = qmi(fac[100000], mod - 2);
    for (int i = 100000; i >= 1; i--)
        inv[i - 1] = inv[i] * i % mod;
    solve();
}
```

## 2 卡特兰数

$$
f(n)=C_{2n}^{n} - C_{2n}^{n-1} 
$$

$$
f(n)=\sum_{i=0}^{n-1}f(i)*f(n-i-1) 
$$

$$
h(n)=\frac{C_{2n}^{n}}{n+1}
$$

## 3 错排公式

假设有 $n$ 个元素，$n$ 个位置，每个元素都有自己唯一的正确位置，问所有元素都处在错误位置有多少可能？

$$
D(n)=(n-1)*(D(n-1) + D(n-2)), D(1)=0, D(2)=1
$$

## 