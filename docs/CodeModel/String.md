# 字符串

## 1 manacher

```cpp
// 复杂度 O(n)
int n, P[N << 1]; // P[i] 表示以 S[i] 为中心的回文半径
char a[N], S[N << 1];
void change() {
    n = strlen(a);
    int k = 0; S[k++] = '$'; S[k++] = '#';
    for (int i = 0; i < n; i++) { S[k++] = a[i]; S[k++] = '#'; }
    S[k++] = '&';
    n = k;
}
void manacher() {
    int R = 0, c;
    for (int i = 1; i < n; i++) {
        if (i < R) P[i] = min(P[(c << 1) - i], P[c] + c - i);
        else P[i] = 1;
        while (S[i + P[i]] == S[i - P[i]]) P[i]++;
        if (P[i] + i > R) {
            R = P[i] + i;
            c = i;
        }
    }
}
void solve() {
    cin >> a; change();
    manacher();
    int ans = 1;
    for (int i = 0; i < n; i++) ans = max(ans, P[i]);
    cout << ans - 1 << endl;
    return;
}
```

## 2 KMP

```cpp
const int N = 1e5 + 5;
int nex[N];
char s1[N]; //文本串 
char s2[N]; //模式串 
int n, m;//文本串和模式串的长度 
//下标从 1 开始
void getnext() {
    nex[1] = 0;
    int i, j = 0;
    for (i = 2; i <= m; i++) {
        while (j > 0 && s2[j + 1] != s2[i])j = nex[j];
        //如果回跳到第一个字符就不 用再回跳了
        if (s2[j + 1] == s2[i])j++;
        nex[i] = j;
    }
}
int kmp() {
    int i, j = 0;
    getnext();
    for (i = 1; i <= n; i++) {
        while (s1[i] != s2[j + 1] && j > 0)j = nex[j];
        //如果失配 ，那么就不断向回跳，直到可以继续匹配
        if (s1[i] == s2[j + 1])j++;
        //如果匹配成功，那么对应的模式串位置++ 
        if (j == m) {
            //输出所有出现位置的起始下标
            printf("%d ", i - m + 1);
            //注意下标，是从 0 还是 1
            j = nex[j];//继续匹配 
        }
    }
}
```

## 3 后缀自动机或后缀数组求不同的子串个数

给定一个字符串 s, 求 s 有多少个不同的子串。

### SAM 后缀自动机求解

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 1e5 + 5;
string s;
int n;
int sz, last;
// sz 为节点状态的编号，last 指向最后被添加的节点
ll dp[N];
struct node {
    int son[26];
    int father;
    int len; // 这个等价类的最大子串长度
}t[N << 1]; // 后缀自动机的状态数不超过 2n 个
void newNode(int length) { // 新建节点，sz=0 是根
    t[++sz].len = length; // 这个节点所表示的子串的长度
    t[sz].father = -1; // 它的父节点还未知
    memset(t[sz].son, 0, sizeof(t[sz].son));
}
void init() {
    sz = -1; last = 0; // 根是 0，根指向-1，表示结束
    newNode(0);
}
void Insert(int c) {
    newNode(t[last].len + 1);
    int p = last, cur = sz; // p 为上一个节点的位置，cur 为新节点的位置
    while (p != -1 && !t[p].son[c]) {
        t[p].son[c] = cur, p = t[p].father;
    }
    if (p == -1)
        t[cur].father = 0;
    else {
        int q = t[p].son[c];
        if (t[q].len == t[p].len + 1)
            t[cur].father = q;
        else {
            newNode(t[p].len + 1);
            int nq = sz; // 复制节点
            memcpy(t[nq].son, t[q].son, sizeof(t[q].son));
            t[nq].father = t[q].father;
            t[cur].father = t[q].father = nq;
            while (p >= 0 && t[p].son[c] == q)
                t[p].son[c] = nq, p = t[p].father;
        }
    }
    last = cur;
}
void solve()
{
    cin >> n >> s;
    init();
    for (int i = 0; i < n; i++) {
        Insert(s[i] - 'a');
        dp[i] = dp[i - 1] + t[last].len - t[t[last].father].len;
    }
    cout << dp[n - 1] << '\n';
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    int _T = 1;
    // cin >> _T;
    while (_T--)
        solve();
    return 0;
}
```

### SA 后缀数组 + LCP （最长公共前缀） 求解

**利用 height 数组求解**

子串就是后缀的前缀，所以可以枚举每个后缀，计算前缀总数，再减掉重复。

「前缀总数」其实就是子串个数，为 $\frac{n(n+1)}{2}$。

如果按后缀排序的顺序枚举后缀，每次新增的子串就是除了与上一个后缀的 LCP 剩下的前缀。
这些前缀一定是新增的，否则会破坏 $lcp(sa[i],sa[j])=min(height[i+1..j])$ 的性质。只有这些前缀是新增的，因为 LCP 部分在枚举上一个前缀时计算过了。

最终答案：$ ans = \frac{n(n+1)}{2} - \sum_{i=2}^{n}height[i] $

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 1e5 + 5;
string s;
int n;
ll height[N];
int x[N], y[N], rk[N], c[N], sa[N];
void get_sa() {
    int m = 127;
    // 按照第一关键字排序
    for(int i = 1; i <= m; i++) c[i] = 0;
    for(int i = 1; i <= n; i++)  c[x[i] = s[i]]++;
    for(int i = 2; i <= m; i++) c[i] += c[i - 1];
    for(int i = n; i >= 1; i--) sa[c[x[i]]--] = i;
     
    for(int k = 1; k <= n; k *= 2) {
        // 1. 先按第二关键字排序
        // [n - k + 1, n] 这些后缀没有第二关键字，肯定排在前面
        int cnt = 0;
        for(int i = n; i > n - k; i--) y[++cnt] = i;
        for(int i = 1; i <= n; i++) {    // 排名   
            if(sa[i] > k) {      // 第 i 个后缀的第二关键字为第 i + k 个后缀的第一关键字
                y[++cnt] = sa[i] - k;
            }
        }
         
        // 2. 再按第一关键字排序
        for(int i = 1; i <= m; i++) c[i] = 0;
        for(int i = 1; i <= n; i++) c[x[i]]++;
        for(int i = 2; i <= m; i++) c[i] += c[i - 1];
        for(int i = n; i >= 1; i--) sa[c[x[y[i]]]--] = y[i], y[i] = 0;
         
        // 3. 离散化 [i, i + 2k]
        // swap(x, y);
        y[sa[1]] = 1, cnt = 1;
        for(int i = 2; i <= n; i++) {
            y[sa[i]] = (x[sa[i]] == x[sa[i - 1]] && 
                x[sa[i] + k] == x[sa[i - 1] + k]) ? cnt : ++cnt;
        }
        for(int i = 1; i <= n; i++) x[i] = y[i];
        if(cnt == n) break;
        m = cnt;
    }
}
void get_height() {
    for(int i = 1; i <= n; i++) rk[sa[i]] = i;
    for(int i = 1, k = 0; i <= n; i++) {
        if(rk[i] == 1) continue;
        if(k) k--;
        int j = sa[rk[i] - 1];
        while(i + k <= n && j + k <= n && s[i + k] == s[j + k]) k++;
        height[rk[i]] = k;
    }   
}
void solve() {
    cin >> n;
    cin >> s;
    s = "(" + s;
    get_sa();
    get_height();
    ll ans = (1LL + n) * n / 2;
    for (int i = 2; i <= n; i++) ans -= height[i];
    cout << ans << '\n';
}
int main()
{
    int T = 1;
    // cin >> T;
    while (T--) {
        solve();
    }
}
```

### SAM 封装

```cpp
struct SuffixAutomaton {
    int tot = 1, last = 1;
    int link[N << 1], ch[N << 1][26], len[N << 1], endpos[N << 1];

    void clear() {
        for (int i = 0; i <= tot; i++) {
            link[i] = len[i] = endpos[i] = 0;
            fill(ch[i], ch[i] + 26, 0);
        }
        tot = 1, last = 1;
    }

    void extend(int c) {
        int p = ++tot, x = last, r, q;
        endpos[p] = 1;
        for (len[last = p] = len[x] + 1; x && !ch[x][c]; x = link[x]) ch[x][c] = p;
        if (!x) link[p] = 1;
        else if (len[x] + 1 == len[q = ch[x][c]]) link[p] = q;
        else {
            link[r = ++tot] = link[q];
            memcpy(ch[r], ch[q], sizeof(ch[r]));
            len[r] = len[x] + 1;
            link[p] = link[q] = r;
            for (; x && ch[x][c] == q; x = link[x]) ch[x][c] = r;
        }
    }

    vector<int> p[N << 1]; // 建立parent树
    void dfs(int u) {
        int v;
        for (int i = 0; i < p[u].size(); i++) {
            v = p[u][i];
            dfs(v);
            endpos[u] += endpos[v]; // 树上差分
        }
    }
    // get_endpos()后，endpos[]表示在串中出现的总次数，即原数组的子树求和
    void get_endpos() {
        for (int i = 1; i <= tot; i++) p[i].clear();
        for (int i = 2; i <= tot; i++) {
            p[link[i]].push_back(i);
        }
        dfs(1);
        for (int i = 1; i <= tot; i++) p[i].clear();
    }

    void debug() {
        for (int i = 1; i <= tot; i++) {
            cout << "node: " << i << ", father: " << link[i] << ", endpos: " << endpos[i] << ", len: " << len[i] << '\n';
        }
    }
}sam;
```



## 4 Z 函数（扩展 KMP）

定义：对于一个长度为 $n$ 的字符串 $s$，定义函数 $z_i$ 表示 $s$ 和 $s_{i,n-1}$ (即以 s[i] 开头的后缀）的最长公共前缀（LCP) 的长度，则 $z$ 被称为 $s$ 的 Z 函数。特别地，$z_0 = 0$。

```cpp
// O(n^2) 实现
vector<int> z_function(string s) {
  int n = (int)s.length();
  vector<int> z(n);
  for (int i = 1, l = 0, r = 0; i < n; ++i) {
    if (i <= r && z[i - l] < r - i + 1) {
      z[i] = z[i - l];
    } else {
      z[i] = max(0, r - i + 1);
      while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i];
    }
    if (i + z[i] - 1 > r) l = i, r = i + z[i] - 1;
  }
  return z;
}
```

### 匹配所有子串

为了避免混淆，我们将 t 称作 文本，将 p 称作 模式。所给出的问题是：寻找在文本 t 中模式 p 的所有出现（occurrence）。

为了解决该问题，我们构造一个新的字符串 s = p + % + t，也即我们将 p 和 t 连接在一起，其中 % 不会出现在任何串中。

首先计算 s 的 Z 函数。接下来，对于在区间 [0,|t| - 1] 中的任意 i，我们考虑以 t[i] 为开头的后缀在 s 中的 Z 函数值 $k=z_{i+|p|+1}$ 。如果 k = |p|，那么我们知道有一个 p 的出现位于 t 的第 i 个位置，否则没有 p 的出现位于 t 的第 i 个位置。

其时间复杂度（同时也是其空间复杂度）为 $O(|t| + |p|)$。

### 字符串整周期

给定一个长度为 n 的字符串 s，找到其最短的整周期，即寻找一个最短的字符串 t，使得 s 可以被若干个 t 拼接而成的字符串表示。

考虑计算 s 的 Z 函数，则其整周期的长度为最小的 n 的因数 i，满足 $i+z_i*i=n $ 。

## 5 Trie 字典树

### 基础封装

```cpp
const int N = 1e6 + 5;
struct trie {
    int nxt[N][26], cnt;
    bool exist[N];
    void insert(string s, int n) {
        int p = 0;
        for (int i = 0; i < n; i++) {
            int c = s[i] - 'a';
            if (!nxt[p][c])
                nxt[p][c] = ++cnt;
            p = nxt[p][c];
        }
        exist[p] = true;
    }
    bool find(string s, int l) {
        int p = 0;
        for (int i = 0; i < l; i++) {
            int c = s[i] - 'a';
            if (!nxt[p][c])
                return false;
            p = nxt[p][c];
        }
        return exist[p];
    }
}t;
```

### 01 Trie

```cpp
struct Trie {
    int n, idx;
    vector<vector<int>> ch;
    Trie(int n) {
        this->n = n;
        idx = 0;
        ch.resize(30 * (n + 1), vector<int>(2));
    }
    void insert(int x) {
        int u = 0;
        for (int i = 30; ~i; i--) {
            int &v = ch[u][x >> i & 1];
            if (!v) v = ++idx;
            u = v;
        }
    }
    int query(int x) {
        int u = 0, res = 0;
        for (int i = 30; ~i; i--) {
            int v = x >> i & 1;
            if (ch[u][!v]) {
                res += (1 << i);
                u = ch[u][!v];
            } else {
                u = ch[u][v];
            }
        }
        return res;
    }
};
```



## 6 AC 自动机

有 $N$ 个由小写字母组成的模式串以及一个文本串 $T$。每个模式串可能会在文本串中出现多次。你需要找出哪些模式串在文本串 $T$ 中出现的次数最多。

时间复杂度 $O(km+nm)$

```cpp
// 对于每组数据，第一行输出模式串最多出现的次数，接下去若干行每行输出一个出现次数最多的模式串，按输入顺序排列
#include <bits/stdc++.h>
#define ll long long 
using namespace std;
const ll N = 1e6 + 10;
int trie[N][26], cnt[N], fail[N], id = 0, maxnum, num[N];
string ss[N];
string s;
void insert(string s) {
    int p = 0;
    int len = s.size();
    for (int i = 0; i < len; ++i) {
        int temp = s[i] - 'a';
        if (trie[p][temp] == 0) {
            trie[p][temp] = ++id;
        }
        p = trie[p][temp];
    }
    cnt[p]++;
    ss[p] = s;
}
void creatfail() {
    queue<int> q;
    int p = 0;
    for (int i = 0; i <= 25; ++i) {
        if (trie[p][i]) q.push(trie[p][i]);
    }
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int i = 0; i <= 25; ++i) {
            if (trie[u][i]) {
                fail[trie[u][i]] = trie[fail[u]][i];
                q.push(trie[u][i]);
            }
            else trie[u][i] = trie[fail[u]][i];
        }
    }
}
void query(string s) {
    int p = 0;
    int len = s.size();
    for (int i = 0; i < len; ++i) {
        int temp = s[i] - 'a';
        p = trie[p][temp];
        for (int j = p; j != 0; j = fail[j]) {
            if (cnt[j]) {
                num[j]++;
                if (num[j] > maxnum) {
                    maxnum = num[j];
                }
            }
        }
    }
}
void solve() {
    while (1) {
        int n;
        cin >> n;
        if (n == 0) break;
        for (int i = 0; i <= id; ++i) {
            cnt[i] = fail[i] = num[i] = 0;
            for (int j = 0; j <= 25; ++j) {
                trie[i][j] = 0;
            }
        }
        id = maxnum = 0;
        for (int i = 0; i < n; ++i) {
            cin >> s;
            insert(s);
        }
        creatfail();
        cin >> s;
        query(s);
        cout << maxnum << '\n';
        for (int i = 1; i <= id; ++i) {
            if (num[i] == maxnum) cout << ss[i] << '\n';
        }
    }
}
int main() {
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    int _t = 1;
    //cin >> _t;
    while (_t--) {
        solve();
    }
    return 0;
}
```

## 7 AC 自动机优化加强

给定一个文本串 $S$ 和 $n$ 个模式串 $T_{1\dots n}$ , 分别求出每个模式串 $T_i$ 在 $S$ 中出现的次数

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const ll N = 2e6 + 10;
int trie[N][26], cnt[N], fail[N], id = 0, num[N], MAP[N];
string s;
vector<vector<int> > v(N);
void insert(int cur, string s) {
    int p = 0;
    int len = s.size();
    for (int i = 0; i < len; ++i) {
        int temp = s[i] - 'a';
        if (trie[p][temp] == 0) {
            trie[p][temp] = ++id;
        }
        p = trie[p][temp];
    }
    MAP[cur] = p;
}
void creatfail() {
    queue<int> q;
    int p = 0;
    for (int i = 0; i <= 25; ++i) {
        if (trie[p][i]) q.push(trie[p][i]);
    }
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int i = 0; i <= 25; ++i) {
            if (trie[u][i]) {
                fail[trie[u][i]] = trie[fail[u]][i];
                q.push(trie[u][i]);
            }
            else trie[u][i] = trie[fail[u]][i];
        }
    }
}
void query(string s) {
    int p = 0;
    int len = s.size();
    for (int i = 0; i < len; ++i) {
        int temp = s[i] - 'a';
        p = trie[p][temp];
        num[p]++;
    }
}
void build() {
    for (int i = 1; i <= id; ++i) {
        v[fail[i]].push_back(i);
    }
}
void dfs(int u) {
    for (auto i : v[u]) {
        dfs(i);
        num[u] += num[i];
    }
}
void solve() {
    int n;
    cin >> n;
    for (int i = 0; i < n; ++i) {
        cin >> s;
        insert(i, s);
    }
    creatfail();
    cin >> s;
    query(s);
    build();
    dfs(0);
    for (int i = 0; i < n; ++i) {
        cout << num[MAP[i]] << '\n';
    }
}
int main() {
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    int _t = 1;
    //cin >> _t;
    while (_t--) {
        solve();
    }
    return 0;
}
```

## 8 字符串哈希

### 普通版哈希

```cpp
#define ull unsigned long long
using namespace std;
const int N = 1e4 + 5;
const ull P = 131;
ull a[N];
char s[N];
ull Hash(char* s) { // BKDRHash
    ull H = 0;
    int n = strlen(s);
    for (int i = 0; i < n; i++)
        H = H * P + s[i] - 'a' + 1; // 自然溢出
    return H;
}

ull get_hash(ull L, ull R) { return H[R] - H[L - 1] * P[R - L + 1]; }
```

### 双模数哈希

```cpp
// 随机质数列表：1111111121、1211111123、1311111119
const int N = 1 << 21;
static const int mod1 = 1E9 + 7, base1 = 127;
static const int mod2 = 1E9 + 9, base2 = 131;
using U = Zmod<mod1>;
using V = Zmod<mod2>;
vector<U> val1;
vector<V> val2;
void init(int n = N) {
    val1.resize(n + 1), val2.resize(n + 2);
    val1[0] = 1, val2[0] = 1;
    for (int i = 1; i <= n; i++) {
        val1[i] = val1[i - 1] * base1;
        val2[i] = val2[i - 1] * base2;
    }
}
struct String {
    vector<U> hash1;
    vector<V> hash2;
    string s;
    
    String(string s_) : s(s_), hash1{0}, hash2{0} {
        for (auto it : s) {
            hash1.push_back(hash1.back() * base1 + it);
            hash2.push_back(hash2.back() * base2 + it);
        }
    }
    pair<U, V> get() { // 输出整串的哈希值
        return {hash1.back(), hash2.back()};
    }
    pair<U, V> substring(int l, int r) { // 输出子串的哈希值
        if (l > r) swap(l, r);
        U ans1 = hash1[r] - hash1[l - 1] * val1[r - l + 1];
        V ans2 = hash2[r] - hash2[l - 1] * val2[r - l + 1];
        return {ans1, ans2};
    }
    pair<U, V> modify(int idx, char x) { // 修改 idx 位为 x
        int n = s.size() - 1;
        U ans1 = hash1.back() + val1[n - idx] * (x - s[idx]);
        V ans2 = hash2.back() + val2[n - idx] * (x - s[idx]);
        return {ans1, ans2};
    }
};
```

### 哈希判断回文串

```cpp
#define ull unsigned long long

int n;
char s[N], t[N];
ull ans, PP = 131, f[N], g[N], P[N];

void init() {
    P[0] = 1;
    for (int i = 1; i <= n; i++) t[i] = s[n - i + 1];
    for (int i = 1; i <= n; i++) P[i] = P[i - 1] * PP;
    for (int i = 1; i <= n; i++) f[i] = f[i - 1] * PP + s[i];
    for (int i = n; i >= 1; i--) g[i] = g[i + 1] * PP + t[i];
}

bool isPalindrome_even(int l, int r) { // 长度为偶数
    int mid = (l + r) >> 1;
    int x = l + mid - 1; // 以s[x]为中心
    ull a = f[x] - f[x - mid] * P[mid];
    ull b = g[x + 1] - g[x + 1 + mid] * P[mid];
    return a == b;
}
bool isPalindrome_odd(int l, int r) { // 长度为奇数
    int mid = ((l + r) >> 1);
    int x = l + mid; // 以s[x]为中心
    ull a = f[x] - f[x - mid] * P[mid];
    ull b = g[x + 1] - g[x + 1 + mid] * P[mid];
    return a == b;
}
```

## 9 回文自动机 PAM（回文树）

```cpp
struct PalindromeAutomaton {
    constexpr static int N = 5e5 + 10;
    int tr[N][26], fail[N], len[N];
    int cntNodes, last;
    int cnt[N];
    string s;
    PalindromeAutomaton(string s) {
        memset(tr, 0, sizeof tr);
        memset(fail, 0, sizeof fail);
        len[0] = 0, fail[0] = 1;
        len[1] = -1, fail[1] = 0;
        cntNodes = 1;
        last = 0;
        this->s = s;
    }
    void insert(char c, int i) {
        int u = get_fail(last, i);
        if (!tr[u][c - 'a']) {
            int v = ++cntNodes;
            fail[v] = tr[get_fail(fail[u], i)][c - 'a'];
            tr[u][c - 'a'] = v;
            len[v] = len[u] + 2;
            cnt[v] = cnt[fail[v]] + 1;
        }
        last = tr[u][c - 'a'];
    }
    int get_fail(int u, int i) {
        while (i - len[u] - 1 <= -1 || s[i - len[u] - 1] != s[i]) {
            u = fail[u];
        }
        return u;
    }
};
```

## 10 前后缀去重

`sample please ease` 去重后得到 `samplease`。

```cpp
string compress(vector<string> in) { // 前后缀压缩
    vector<U> hash1{1};
    vector<V> hash2{1};
    string ans = "#";
    for (auto s : in) {
        s = "#" + s;
        int st = 0;
        U chk1 = 0;
        V chk2 = 0;
        for (int j = 1; j < s.size() && j < ans.size(); j++) {
            chk1 = chk1 * base1 + s[j];
            chk2 = chk2 * base2 + s[j];
            if ((hash1.back() == hash1[ans.size() - 1 - j] * val1[j] + chk1) &&
                (hash2.back() == hash2[ans.size() - 1 - j] * val2[j] + chk2)) {
                st = j;
            }
        }
        for (int j = st + 1; j < s.size(); j++) {
            ans += s[j];
            hash1.push_back(hash1.back() * base1 + s[j]);
            hash2.push_back(hash2.back() * base2 + s[j]);
        }
    }
    return ans.substr(1);
}
```

