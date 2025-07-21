## 1 预处理组合数

```cpp
for (int i = 0; i <= 5000; i++) {
    for (int j = 0; j <= i; j++) {
        if (!j) C[i][j] = 1;
        else C[i][j] = C[i - 1][j] + C[i - 1][j - 1];
        C[i][j] %= mod;
    }
}
```

## 2 jiangly 取模运算+组合数板子

```cpp
using i64 = long long;
template<class T>
constexpr T power(T a, i64 b) {
    T res {1};
    for (; b; b /= 2, a *= a) {
        if (b % 2) {
            res *= a;
        }
    }
    return res;
}

constexpr i64 mul(i64 a, i64 b, i64 p) {
    i64 res = a * b - i64(1.L * a * b / p) * p;
    res %= p;
    if (res < 0) {
        res += p;
    }
    return res;
}

template<i64 P>
struct MInt {
    i64 x;
    constexpr MInt() : x {0} {}
    constexpr MInt(i64 x) : x {norm(x % getMod())} {}
    
    static i64 Mod;
    constexpr static i64 getMod() {
        if (P > 0) {
            return P;
        } else {
            return Mod;
        }
    }
    constexpr static void setMod(i64 Mod_) {
        Mod = Mod_;
    }
    constexpr i64 norm(i64 x) const {
        if (x < 0) {
            x += getMod();
        }
        if (x >= getMod()) {
            x -= getMod();
        }
        return x;
    }
    constexpr i64 val() const {
        return x;
    }
    constexpr MInt operator-() const {
        MInt res;
        res.x = norm(getMod() - x);
        return res;
    }
    constexpr MInt inv() const {
        return power(*this, getMod() - 2);
    }
    constexpr MInt &operator*=(MInt rhs) & {
        if (getMod() < (1ULL << 31)) {
            x = x * rhs.x % int(getMod());
        } else {
            x = mul(x, rhs.x, getMod());
        }
        return *this;
    }
    constexpr MInt &operator+=(MInt rhs) & {
        x = norm(x + rhs.x);
        return *this;
    }
    constexpr MInt &operator-=(MInt rhs) & {
        x = norm(x - rhs.x);
        return *this;
    }
    constexpr MInt &operator/=(MInt rhs) & {
        return *this *= rhs.inv();
    }
    friend constexpr MInt operator*(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res *= rhs;
        return res;
    }
    friend constexpr MInt operator+(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res += rhs;
        return res;
    }
    friend constexpr MInt operator-(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res -= rhs;
        return res;
    }
    friend constexpr MInt operator/(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res /= rhs;
        return res;
    }
    friend constexpr std::istream &operator>>(std::istream &is, MInt &a) {
        i64 v;
        is >> v;
        a = MInt(v);
        return is;
    }
    friend constexpr std::ostream &operator<<(std::ostream &os, const MInt &a) {
        return os << a.val();
    }
    friend constexpr bool operator==(MInt lhs, MInt rhs) {
        return lhs.val() == rhs.val();
    }
    friend constexpr bool operator!=(MInt lhs, MInt rhs) {
        return lhs.val() != rhs.val();
    }
    friend constexpr bool operator<(MInt lhs, MInt rhs) {
        return lhs.val() < rhs.val();
    }
};

template<>
i64 MInt<0>::Mod = 998244353;

constexpr int P = 998244353;
using Z = MInt<P>;

struct Comb {
    int n;
    std::vector<Z> _fac;
    std::vector<Z> _invfac;
    std::vector<Z> _inv;
    
    Comb() : n{0}, _fac{1}, _invfac{1}, _inv{0} {}
    Comb(int n) : Comb() {
        init(n);
    }
    
    void init(int m) {
        m = std::min<i64>(m, Z::getMod() - 1);
        if (m <= n) return;
        _fac.resize(m + 1);
        _invfac.resize(m + 1);
        _inv.resize(m + 1);
        
        for (int i = n + 1; i <= m; i++) {
            _fac[i] = _fac[i - 1] * i;
        }
        _invfac[m] = _fac[m].inv();
        for (int i = m; i > n; i--) {
            _invfac[i - 1] = _invfac[i] * i;
            _inv[i] = _invfac[i] * _fac[i - 1];
        }
        n = m;
    }
    
    Z fac(int m) {
        if (m > n) init(2 * m);
        return _fac[m];
    }
    Z invfac(int m) {
        if (m > n) init(2 * m);
        return _invfac[m];
    }
    Z inv(int m) {
        if (m > n) init(2 * m);
        return _inv[m];
    }
    Z binom(int n, int m) {
        if (n < m || m < 0) return 0;
        return fac(n) * invfac(m) * invfac(n - m);
    }
} comb;
```

## 3 斯特林数

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

## 4 卡特兰数

$$
f(n)=C_{2n}^{n} - C_{2n}^{n-1} 
$$

$$
f(n)=\sum_{i=0}^{n-1}f(i)*f(n-i-1) 
$$

$$
h(n)=\frac{C_{2n}^{n}}{n+1}
$$

## 5 错排公式

假设有 $n$ 个元素，$n$ 个位置，每个元素都有自己唯一的正确位置，问所有元素都处在错误位置有多少可能？

$$
D(n)=(n-1)*(D(n-1) + D(n-2)), D(1)=0, D(2)=1
$$
