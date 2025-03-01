---
title: 2021_final
createTime: 2025/02/26 18:38:00
permalink: /article/z9t8hlnd/
---
# 2021 团体程序设计天梯赛 – 总决赛题解

## L1-1 人与神

### 代码

```python
print("To iterate is human, to recurse divine.") # 比较快

#include <iostream>
int main() {
    std::cout << "To iterate is human, to recurse divine.";
    return 0;
}
```

## L1-2 两小时学完 C 语言

### 标签

简单数学

### 思路

根据幼儿园二年级芝士，剩余字数 = 总字数 - 每分钟能看字数 * 看的时长

### 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
    int n, k, m;
    cin >> n >> k >> m;
    cout << n - k * m;
    return 0;
}
```

## L1-3 强迫症

### 标签

字符串，模拟

### 思路

判断输入字符串的长度，为 6 则直接输出（注意补一个'-'）; 为 4 则判断属于 19xx 还是 20xx 年。

### 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
    string s;
    cin >> s;
    if (s.length() == 6) {
        for (int i = 0; i < 6; i++) {
            cout << s[i];
            if (i == 3) cout << '-';
        }
    }
    else {
        int y = (s[0] - '0') * 10 + (s[1] - '0');
        if (y < 22) {
            cout << "20" << s[0] << s[1] << "-" << s[2] << s[3];
        }
        else {
            cout << "19" << s[0] << s[1] << "-" << s[2] << s[3];
        }
    }
    return 0;
}
```

## L1-4 降价提醒机器人

### 标签

模拟

### 思路

每次输入的 p 和 m 对比即可，小于 m 就输出，记得保留一位小数

### 代码

```cpp
#include<bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<double> p(n);
    for (int i = 0; i < n; i++) {
        cin >> p[i];
        if (p[i] < m) {
            cout << "On Sale! " << fixed << setprecision(1) << p[i] << '\n';
        }
    }
    return 0;
}
```

## L1-5 大笨钟的心情

### 标签

模拟

### 思路

存储 24 小时的心情指数，每次询问与 50 进行比较即可

### 代码

```cpp
#include<bits/stdc++.h>
using namespace std;
int main() {
    int a[25];
    for (int i = 0; i < 24; i++) cin >> a[i];
    int n;
    cin >> n;
    while (n >= 0 && n <= 23) {
        cout << a[n] << " ";
        if (a[n] > 50) cout << "Yes\n";
        else cout << "No\n";
        cin >> n;
    }
    return 0;
}
```

## L1-6 吉老师的回归

### 标签

字符串，模拟

### 思路

将每道题的描述和 qiandao 与 easy 进行比对，若存在其中一个就跳过，否则存入这道题。最后如果 m 大于存储题目的数量就说明做完了，否则根据下标输出。

### 代码

```cpp
#include<bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    string q = "qiandao", e = "easy";
    cin >> n >> m;
    vector<string> ans;
    n++; // 没有清除输入缓存，getline 会读取一个换行符，这里用 n++来抵消
    while (n--) {
        string s;
        getline(cin, s); // 输入的题目描述含空格，可用 getline 来读取
        bool f = 0;
        for (int i = 0; i < s.length(); i++) {
            bool be = 1, bq = 1;
            for (int j = 0; j < 4; j++) {
                if (s[i + j] != e[j]) {
                    be = 0;
                    break;
                }
            }
            for (int j = 0; j < 7; j++) {
                if (s[i + j] != q[j]) {
                    bq = 0;
                    break;
                }
            }
            if (be || bq) {
                f = 1;
                break;
            }
        }
        if (!f) ans.push_back(s);
    }
    if (m + 1 >= ans.size()) cout << "Wo AK le";
    else cout << ans[m + 1];
    return 0;
}
```

## L1-7 天梯赛的善良

### 标签

模拟

### 思路

1. 使用两个变量记录最值，再分别记录最值出现的次数，有新的最值出现时更新最值和 cnt
2. 或者使用 map 来存储数量

### 代码

```cpp
// 1.
#include<bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int mx = -1, mn = 1e7;
    int cnt_mx = 0, cnt_mn = 0;
    while (n--) {
        int a;
        cin >> a;
        if (a > mx) mx = a, cnt_mx = 1;
        else if (a == mx) cnt_mx++;
        if (a < mn) mn = a, cnt_mn = 1;
        else if (a == mn) cnt_mn++;
    }
    cout << mn << " " << cnt_mn << endl;
    cout << mx << " " << cnt_mx;
}

// 2.
int main() {
    int n;
    cin >> n;
    map<int, int> m;
    int mx = 0, mn = 1e7;
    while (n--) {
        int a;
        cin >> a;
        mn = min(mn, a);
        mx = max(mx, a);
        m[a]++;
    }
    cout << mn << " " << m[mn] << endl;
    cout << mx << " " << m[mx];
}
```

## L1-8 乘法口诀数列

### 标签

模拟

### 思路

定义下标 pre 和 now 表示当前进行运算的两个数，根据题意模拟即可，注意两位数的插入

### 代码

```cpp
#include<bits/stdc++.h>
using namespace std;
int main() {
    int a, b, n;
    cin >> a >> b >> n;
    vector<int> ans;
    ans.push_back(a);
    ans.push_back(b);
    int pre = 0, now = 1;
    while (ans.size() < n) {
        int p = ans[pre] * ans[now];
        if (p > 9) ans.push_back(p / 10);
        ans.push_back(p % 10);
        pre++, now++;
    }
    for (int i = 0; i < n; i++) { // 注意只需要输出 n 个
        if (i) cout << " ";
        cout << ans[i];
    }
}
```

## L2-1 包装机

### 标签

字符串，模拟，栈

### 思路

定义一个数组记录每条轨道当前的首个物品（下标）, 利用栈模拟，使用 vector 记录框里抓出的物品，模拟

注意栈满的状态

### 代码

```cpp
#include <bits/stdc++.h>
#define rep(i, j, k) for(int i = (j); i <= (k); i++)
#define per(i, k, j) for(int i = (k); i >= (j); i--)
#define ll long long
using namespace std;
int n, m, smx;
vector<char> ans;
stack<char> st;
int p[105];
string s[105];
void out() {
    if (st.empty()) return;
    ans.push_back(st.top());
    st.pop();
}
void solve()
{
    cin >> n >> m >> smx;
    rep(i, 1, n) {
        cin >> s[i];
        s[i] = "%" + s[i]; // 方便从 1 开始计数
        p[i] = 1; // 从 1 开始抓物品
    }
    int op;
    cin >> op;
    while (op != -1) {
        if (op == 0) {
            out();
        }
        else {
            if (p[op] < m + 1) {
                if (st.size() == smx) out(); // 筐满，先扔出
                st.push(s[op][p[op]]);
                p[op]++;
            }
        }
        cin >> op;
    }
    for (auto c : ans) cout << c;
}
int main()
{
    int T_T = 1;
    // cin >> T_T;
    while (T_T--)
        solve();
    return 0;
}
```

## L2-2 病毒溯源

### 标签

链表，搜索，模拟

### 思路

可以用链表（我用了 vector 来模拟）记录每个病毒产生的变异毒株。由于源头唯一，可用 vis=1 来记录某个病毒是否由变异得来，最后 vis 为 0 的那个病毒即为源头。 对每个病毒产生的变异毒株序号进行排序，这样就能保证所有长度相同的序列，最先得到的一定是最小的序列，长度更大时再更新答案。 或者也可以用 vector 比较大小来判断是否更新答案

### 代码

```cpp
#include <bits/stdc++.h>
#define rep(i, j, k) for(int i = (j); i <= (k); i++)
#define per(i, k, j) for(int i = (k); i >= (j); i--)
#define ll long long
using namespace std;
vector<int> List[10005]; // 记录该病毒的变异毒株
int n;
bool vis[10005]; // 记录是否由变异得来
vector<int> now;
int ans[10005];
int len = 0;
void dfs(int x) {
    now.push_back(x); // 更新状态
    if (List[x].empty()) { // 不能再往下变异传递
        if (now.size() > len) { // 更新答案
            len = now.size();
            for (int i = 0; i < len; i++)
                ans[i] = now[i];
        }
        now.pop_back(); // 回溯
        return;
    }
    for (auto i : List[x]) {
        dfs(i);
    }
    now.pop_back(); // 回溯
}
void solve()
{
    cin >> n;
    rep(i, 0, n - 1) {
        int k;
        cin >> k;
        rep(j, 0, k - 1) {
            int a;
            cin >> a;
            vis[a] = 1;
            List[i].push_back(a);
        }
        sort(List[i].begin(), List[i].end());
    }
    rep(i, 0, n - 1) {
        if (!vis[i]) { // 找到源头
            dfs(i);
            break;
        }
    }
    cout << len << '\n';
    for (int i = 0; i < len; i++) {
        if (i != 0) cout << " ";
        cout << ans[i];
    }
}
int main()
{
    int T_T = 1;
    // cin >> T_T;
    while (T_T--)
        solve();
    return 0;
}
```

## L2-3 清点代码库

### 标签

数据结构，STL, 模拟

### 思路

使用 map 来记录每种测试输入的数量，然后以 pair 的形式丢尽 vector 里，再对 vector 进行排序

注意排序函数 cmp 的编写，题目要求首先按模块个数非递增顺序，如果有并列，则按输出序列的递增序输出

### 代码

```cpp
#include <bits/stdc++.h>
#define rep(i, j, k) for(int i = (j); i <= (k); i++)
#define per(i, k, j) for(int i = (k); i >= (j); i--)
#define ll long long
using namespace std;
int n, m;
map<vector<int>, int> mp;
vector<pair<vector<int>, int> > ans;
bool cmp(pair<vector<int>, int> a, pair<vector<int>, int> b) {
    if (a.second != b.second) return a.second > b.second;
    return a.first < b.first;
}
void solve()
{
    cin >> n >> m;
    rep(i, 1, n) {
        vector<int> v(m);
        rep(j, 0, m - 1) {
            cin >> v[j];
        }
        mp[v]++;
    }
    for (auto& [i, j] : mp) {
        ans.push_back({i, j});
    }
    sort(ans.begin(), ans.end(), cmp);
    cout << ans.size() << '\n';
    for (auto p : ans) {
        cout << p.second << " ";
        rep(k, 0, m - 1) {
            if (k != 0) cout << " ";
            cout << p.first[k];
        }
        cout << '\n';
    }
}
int main()
{
    int T_T = 1;
    // cin >> T_T;
    while (T_T--)
        solve();
    return 0;
}
```

## L2-4 哲哲打游戏

### 标签

模拟

### 思路

对于每个操作进行模拟即可，记录存档点只需保存当前状态，不用保存是如何到达的这个状态

### 代码

```cpp
#include <bits/stdc++.h>
#define rep(i, j, k) for(int i = (j); i <= (k); i++)
#define per(i, k, j) for(int i = (k); i >= (j); i--)
#define ll long long
using namespace std;
const int N = 1e5 + 5;
int n, m;
int k[N];
vector<int> ed[N];
int rec[105];
void solve()
{
    cin >> n >> m;
    rep(i, 1, n) {
        cin >> k[i];
        ed[i].push_back(-1); // 为了做出选择的下标从 1 开始
        rep(j, 1, k[i]) {
            int a;
            cin >> a;
            ed[i].push_back(a);
        }
    }
    int now = 1;
    rep(i, 1, m) {
        int op, j;
        cin >> op >> j;
        if (op == 0) { // make choice
            now = ed[now][j];
        }
        else if (op == 1) { // save
            rec[j] = now;
            cout << now << '\n';
        }
        else if (op == 2) { // read
            now = rec[j];
        }

    }
    cout << now;
}
int main()
{
    int T_T = 1;
    // cin >> T_T;
    while (T_T--)
        solve();
    return 0;
}
```

## L3-1 森森旅游

### 标签

图论，线段树，数据结构

### 思路

首先对支付现金的线路建图

因为如果要兑换旅游金，就需要把手中现金全部兑换。所以考虑支付旅游金的线路反向建图， 然后分别从起点和终点跑一边 dijkstra, 再遍历 n 个点得到初始答案，用 map+set 或直接 multiset 来存储，方便找到最小值（好吧我不会线段树）. 在每个点的答案（需要的现金）是 dis1[i] + ceil(dis2[i] / a) （向上取整）

每次更新的时候只需要判断被更新掉的答案是否为唯一极小值，如果是，则更新答案。

ps: 感觉线段树应该更快，我这方法有一个 test 到了 937ms 马上超时了，但是不会线段树

### 代码

```cpp
#include <bits/stdc++.h>
#define rep(i, j, k) for(int i = (j); i <= (k); i++)
#define per(i, k, j) for(int i = (k); i >= (j); i--)
#define lson (x << 1)
#define rson (x << 1 | 1)
#define ll long long
using namespace std;
const int N = 1e5 + 5;
const ll llinf = 0x3f3f3f3f3f3f3f3f;
struct edge {
    int v;
    ll w;
};
struct node {
    ll dis;
    int u;
    bool operator>(const node& a) const { return dis > a.dis; }
};
vector<edge> ed1[N], ed2[N];
ll dis1[N], dis2[N], ans[N], a[N];
bool vis1[N], vis2[N];
int n, m, q;
void dijkstra() {
    memset(dis1, llinf, sizeof(dis1));
    memset(dis2, llinf, sizeof(dis2));
    priority_queue<node, vector<node>, greater<node> > q;
    q.push({0, 1});
    dis1[1] = 0;
    while (!q.empty()) {
        int u = q.top().u;
        q.pop();
        if (vis1[u]) continue;
        vis1[u] = 1;
        for (auto e : ed1[u]) {
            int v = e.v;
            ll w = e.w;
            if (dis1[v] > dis1[u] + w) {
                dis1[v] = dis1[u] + w;
                q.push({dis1[v], v});
            }
        }
    }
    // 也可以使用传参的方式只写一遍，这里直接复制了
    priority_queue<node, vector<node>, greater<node> > qq;
    qq.push({0, n});
    dis2[n] = 0;
    while (!qq.empty()) {
        int u = qq.top().u;
        qq.pop();
        if (vis2[u]) continue;
        vis2[u] = 1;
        for (auto e : ed2[u]) {
            int v = e.v;
            ll w = e.w;
            if (dis2[v] > dis2[u] + w) {
                dis2[v] = dis2[u] + w;
                qq.push({dis2[v], v});
            }
        }
    }
}
map<ll, int> mp;
set<ll> st;
ll mn = llinf;
void solve()
{
    cin >> n >> m >> q;
    while (m--) {
        int u, v;
        ll c, d;
        cin >> u >> v >> c >> d;
        ed1[u].push_back({v, c});
        ed2[v].push_back({u, d}); // 旅游金反向建图
    }
    dijkstra();
    rep(i, 1, n) {
        cin >> a[i];
        if (dis1[i] == llinf || dis2[i] == llinf) { ans[i] = llinf; continue; } // 走不通的不用管
        else ans[i] = dis1[i] + dis2[i] / a[i] + (dis2[i] % a[i] ? 1 : 0); // 向上取整，不能整除就加 1
        mn = min(mn, ans[i]);
        mp[ans[i]]++;
        if (mp[ans[i]] == 1) st.insert(ans[i]);
    }
    while (q--) {
        int x;
        ll b;
        cin >> x >> b;
        if (dis1[x] != llinf && dis2[x] != llinf) {
            ll t = dis1[x] + dis2[x] / b + (dis2[x] % b ? 1 : 0);
            mp[t]++;
            if (mp[t] == 1) st.insert(t);
            mp[ans[x]]--;
            if (mp[ans[x]] == 0) {
                st.erase(st.find(ans[x])); // 已经没有这个情况了，删除这个数
            }
            mn = *st.begin(); // 更新最小值
            ans[x] = t; // 更新这个点的答案
        }
        cout << mn << '\n';
    }
}
int main()
{
    solve();
    return 0;
}
```

## L3-2 还原文件

### 标签

模拟，搜索

### 思路

题目说了唯一解，说明不存在相同情况的两个纸条。所以直接暴力循环匹配，直到所有纸条都匹配到相应位置

### 代码

```cpp
#include <bits/stdc++.h>
#define rep(i, j, k) for(int i = (j); i <= (k); i++)
#define per(i, k, j) for(int i = (k); i >= (j); i--)
#define ll long long
using namespace std;
const int N = 1e5 + 5;
int n, m;
int cnt[105], a[N];
vector<int> h[105];
int vis[N];
void dfs(int x) {
    if (x == m + 1) {
        int p = 1, num = 0;
        vector<int> res;
        while (p <= n) {
            if (vis[p] == 0) {
                p++;
                continue;
            }
            if (num == 0) {
                res.push_back(vis[p]);
                p++;
                num++;
            }
            else {
                if (vis[p] == res[num - 1])
                    p++;
                else {
                    res.push_back(vis[p]);
                    p++, num++;
                }
            }
        }
        rep(i, 0, num - 1) {
            if (i) cout << " ";
            cout << res[i];
        }
        exit(0);
    }
    rep(i, 1, n) {
        if (a[i + cnt[x] - 1] != h[x][cnt[x] - 1]) continue;
        bool flag = 1;
        rep(j, 0, cnt[x] - 2) {
            if (vis[i + j] || a[i + j] != h[x][j]) {
                flag = 0;
                break;
            }
        }
        if (flag == 0) continue; // 不完全匹配，跳过
        rep(j, 0, cnt[x] - 2) vis[i + j] = x; // 最左端不标记，防止特殊情况无法标记（如 k == 2）
        dfs(x + 1);
        rep(j, 0, cnt[x] - 2) vis[i + j] = 0; // 回溯
    }
}
void solve()
{
    cin >> n;
    rep(i, 1, n) {
        cin >> a[i];
    }
    cin >> m;
    rep(i, 1, m) {
        cin >> cnt[i];
        rep(j, 1, cnt[i]) { 
            int x;
            cin >> x;
            h[i].push_back(x);
        }
    }
    dfs(1);
}
int main()
{
    int T_T = 1;
    // cin >> T_T;
    while (T_T--)
        solve();
    return 0;
}
```

## L3-3 可怜的简单题

### 标签

数论

### 思路

不会，先鸽了 QAQ