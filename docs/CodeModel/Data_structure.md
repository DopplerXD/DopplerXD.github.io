# 数据结构

## 1 并查集

### 朴素版

```cpp
int fa[N];
int find(int x)
{
    int root = fa[x];
    while (root != fa[root]) root = fa[root];
    while (x != root) {
        int t = fa[x];
        fa[x] = root;
        x = t;
    }
    return root;
}
void solve()
{
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) fa[i] = i;
    for (int i = 0; i < m; i++) {
        int x, y, z;
        cin >> z >> x >> y;
        if (z == 1) {
            int u = find(x);
            int v = find(y);
            fa[u] = fa[v];
        }
        else {
            if (find(x) == find(y)) {
                cout << "Y\n";
            }
            else {
                cout << "N\n";
            }
        }
    }
}
```

### 全功能封装

```cpp
struct DSU {
    vector<int> fa, p, e, f;

    DSU(int n) {
        fa.resize(n + 1);
        iota(fa.begin(), fa.end(), 0);
        p.resize(n + 1, 1);
        e.resize(n + 1);
        f.resize(n + 1);
    }
    int get(int x) {
        while (x != fa[x]) {
            x = fa[x] = fa[fa[x]];
        }
        return x;
    }
    bool merge(int x, int y) { // 设x是y的祖先
        if (x == y) f[get(x)] = 1;
        x = get(x), y = get(y);
        e[x]++;
        if (x == y) return false;
        if (x < y) swap(x, y); // 将编号小的合并到大的上
        fa[y] = x;
        f[x] |= f[y], p[x] += p[y], e[x] += e[y];
        return true;
    }
    bool same(int x, int y) {
        return get(x) == get(y);
    }
    bool F(int x) { // 判断连通块内是否存在自环
        return f[get(x)];
    }
    int size(int x) { // 输出连通块中点的数量
        return p[get(x)];
    }
    int E(int x) { // 输出连通块中边的数量
        return e[get(x)];
    }
};
```

## 2 树状数组

### 单点修改、区间求和

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 5e5 + 5;
int tr[N], n;
int lowbit(int x) { return x & -x; }
void add(int x, int y) {
    for(; x <= n; x += lowbit(x))
        tr[x] += y;
}
int query(int x) {
    int ans = 0;
    for(; x; x -= lowbit(x))
        ans += tr[x];
    return ans;
}

int main()
{
    int q;
    cin >> n >> q;
    for(int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        add(i, x);
    }
    while(q--) {
        int op;
        cin >> op;
        if(op == 1) {
			int x, k;
            cin >> x >> k;
            add(x, k);
        }
        else {
            int x, y;
            cin >> x >> y;
            cout << query(y) - query(x - 1) << '\n';
        }
    }
    return 0;
}
```

### 区间修改，单点查询

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 5e5 + 5;
int a[N];
int b[N], c[N];
int n, m;
int lowbit(int x) {
    return x & (-x);
}
void add(int x, int y) {
    int i, j;
    for (i = x; i <= n; i += lowbit(i))
        c[i] += y;
}
int sum(int x) {
    int i, res = 0;
    for (i = x; i > 0; i -= lowbit(i))
        res += c[i];
    return res;
}
int main() {
    ios::sync_with_stdio(0), cin.tie(0);
    int i, j;
    cin >> n >> m;
    for (i = 1; i <= n; i++) {
        cin >> a[i];
        b[i] = a[i] - a[i - 1];
        add(i, b[i]);
    }
    for (i = 1; i <= m; i++) {
        string s;
        cin >> s;
        if (s[0] == 'C') {
            int l, r, d;
            cin >> l >> r >> d;
            add(l, d); add(r + 1, -d);
        }
        else {
            int t;
            cin >> t;
            cout << sum(t) << endl;
        }
    }
    return 0;
}
```

### 区间修改，区间查询

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 5e5 + 5;
int n, m;
ll b[N], a[N], c1[N], c2[N];
int lowbit(int x) {
    return x & (-x);
}
void add(ll x, ll y) {
    for (int i = x; i <= n; i += lowbit(i)) {
        c1[i] += y;
        c2[i] += y * x;
    }
}
ll ask(ll x) {
    ll i, res = 0;
    for (i = x; i > 0; i -= lowbit(i))
        res += (x + 1) * c1[i] - c2[i];
    return res;
}
int main() {
    ios::sync_with_stdio(0);
    int i, j;
    cin >> n >> m;
    for (i = 1; i <= n; i++) {
        cin >> a[i];
        b[i] = a[i] - a[i - 1];
        add(i, b[i]);
    }
    for (i = 1; i <= m; i++) {
        string s; ll l, r, d;
        cin >> s;
        if (s[0] == 'C') {//区间修改
            cin >> l >> r >> d;
            add(l, d);
            add(r + 1, -d);
        }
        else {//区间查询
            cin >> l >> r;
            cout << ask(r) - ask(l - 1) << endl;
        }
    }
    return 0;
}
```

## 3 分块

### 区间加法、单点查值

```cpp
int n, par; // par 为区块长度
int belong[N]; // 记录所属区块
int l[MAXPAR], r[MAXPAR];
int part[MAXPAR];
void build() {
    par = sqrt(n);
    int cnt = n / par;
    int ptop = 1;
    for(int i = 1; i <= cnt; i++) {
        l[i] = ptop;
        for(int j = 1; j <= par; j++)
            belong[ptop++] = i;
        r[i] = ptop - 1;
    }
    while(ptop <= n) // 最右侧多余的部分
        belong[ptop++] = cnt;
    r[cnt] = n;
}
void add(int L, int R, int c) {
    if(belong[L] == belong[R]) {
        for(int i = L; i <= R; i++)
            a[i] += c;
    }
    else {
        for(int i = L; i <= r[belong[L]]; i++)
            a[i] += c;
        for(int i = l[belong[R]]; i <= R; i++)
            a[i] += c;
        for(int i = belong[L] + 1; i <= belong[R] - 1; i++)
            part[i] += c;
    }
}
```

## 4 主席树（区间第 k 小模版）

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N = 2e5 + 5;
const int M = 2e5 + 5;
int n, m;
int a[N], idx;
vector<int> nums;//去重数组 
struct Node {
    int l, r;//左右子节点编号 
    int cnt;
}tr[N * 4 + N * 18];//开 N*4+N*lgN 个空间 
int root[N];//一共需要保存 N 个历史记录
int find(int x) {
    int l = 0, r = nums.size() - 1;
    while (l != r) {
        int mid = (l + r) / 2;
        if (nums[mid] >= x)  r = mid;
        else    l = mid + 1;
    }
    return l;
}
int build(int l, int r) {//建树，cnt 都为 0
    int q = ++idx;
    if (l == r)  return q;
    int mid = (l + r) / 2;
    tr[q].l = build(l, mid);
    tr[q].r = build(mid + 1, r);
    return q;
}
int insert(int p, int l, int r, int x) {
    int q = ++idx;
    tr[q] = tr[p];
    if (l == r) {
        tr[q].cnt++;
        return q;
    }
    int mid = (l + r) / 2;
    //应该更新哪一个值域区间
    if (x <= mid)
        tr[q].l = insert(tr[p].l, l, mid, x);
    else
        tr[q].r = insert(tr[p].r, mid + 1, r, x);
    tr[q].cnt = tr[tr[q].l].cnt + tr[tr[q].r].cnt;
    return q;
}
int query(int q, int p, int l, int r, int k) {
    if (l == r)  return r;
    //有多少个数落在值域为 [l,mid] 中 
    int cnt = tr[tr[q].l].cnt - tr[tr[p].l].cnt;
    int mid = (l + r) / 2;
    if (k <= cnt)
        return query(tr[q].l, tr[p].l, l, mid, k);
    else
        return query(tr[q].r, tr[p].r, mid + 1, r, k - cnt);
}
int main() {
    int i, j;
    cin >> n >> m;
    for (i = 1; i <= n; i++) {
        cin >> a[i];
        nums.push_back(a[i]);
    }
    sort(nums.begin(), nums.end());
    nums.erase(unique(nums.begin(), nums.end()), nums.end());
    root[0] = build(0, nums.size() - 1);//下标从 0 开始
    for (i = 1; i <= n; i++) {
        root[i] = insert(root[i - 1], 0, nums.size() - 1, find(a[i]));
        //建立可持久话线段树
    }
    for (i = 1; i <= m; i++) {
        int l, r, k;
        cin >> l >> r >> k;
        cout << nums[query(root[r], root[l - 1], 0, nums.size() - 1, k)] << endl;
    }
    return 0;
}
```

## 5 替罪羊树

[P3369 【模板】普通平衡树](https://www.luogu.com.cn/problem/P3369)

写一种能够满足以下操作的数据结构：

1. 插入一个数 $x$。
2. 删除一个数 $x$（若有多个相同的数，应只删除一个）。
3. 定义排名为比当前数小的数的个数 $+1$。查询 $x$ 的排名。
4. 查询数据结构中排名为 $x$ 的数。
5. 求 $x$ 的前驱（前驱定义为小于 $x$，且最大的数）。
6. 求 $x$ 的后继（后继定义为大于 $x$，且最小的数）。

对于操作 3,5,6，不保证当前数据结构中存在数 $x$。

对于操作 $3,4,5,6$ 每行输出一个数，表示对应答案。

对于 $100\%$ 的数据，$1\le n \le 10^5$，$|x| \le 10^7$

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 5;
const double alpha = 0.75; // 不平衡率
struct Node {
    int ls, rs;
    int val;
    int tot; // 当前子树占用的空间数量，包括实际存储的节点和被标记删除的节点
    int size; // 子树上实际存储数字的数量
    bool del; // del=1 表示这个节点存有数字，=0 表示被删除
}t[N];
int order[N], cnt; // order[] 记录拍平后的结果，即那些存有数字的节点
int tree_stack[N], top = 0; // 用栈来回收和分配可用的节点
int root = 0; // 重建过程中根节点会变化
void inorder(int u) { // 中序遍历，“拍平”摧毁这棵子树
    if (!u) return;
    inorder(t[u].ls);
    if (t[u].del) order[++cnt] = u;
    else tree_stack[++top] = u;
    inorder(t[u].rs);
}
void initnode(int u) {
    t[u].ls = t[u].rs = 0;
    t[u].size = t[u].tot = t[u].del = 1;
}
void update(int u) {
    t[u].size = t[t[u].ls].size + t[t[u].rs].size + 1;
    t[u].tot = t[t[u].ls].tot + t[t[u].rs].tot + 1;
}
void build(int l, int r, int& u) {
    int mid = (l + r) >> 1;
    u = order[mid];
    if (l == r) { initnode(u); return; }
    if (l < mid) build(l, mid - 1, t[u].ls);
    if (l == mid) t[u].ls = 0;
    build(mid + 1, r, t[u].rs);
    update(u);
}
void rebuild(int& u) {
    cnt = 0;
    inorder(u);
    if (cnt) build(1, cnt, u);
    else u = 0;
}
bool notbalance(int u) {
    if ((double)t[u].size * alpha <= (double)max(t[t[u].ls].size, t[t[u].rs].size))
        return true;
    return false;
}
void Insert(int& u, int x) {
    if (!u) {
        u = tree_stack[top--];
        t[u].val = x;
        initnode(u);
        return;
    }
    t[u].size++;
    t[u].tot++;
    if (t[u].val >= x) Insert(t[u].ls, x);
    else Insert(t[u].rs, x);
    if (notbalance(u)) rebuild(u);
}
int Rank(int u, int x) {
    if (u == 0) return 0;
    if (x > t[u].val) return t[t[u].ls].size + t[u].del + Rank(t[u].rs, x);
    return Rank(t[u].ls, x);
}
int kth(int k) {
    int u = root;
    while (u) {
        if (t[u].del && t[t[u].ls].size + 1 == k) return t[u].val;
        else if (t[t[u].ls].size >= k) u = t[u].ls;
        else {
            k -= t[t[u].ls].size + t[u].del;
            u = t[u].rs;
        }
    }
    return t[u].val;
}
void del_k(int& u, int k) {
    t[u].size--;
    if (t[u].del && t[t[u].ls].size + 1 == k) {
        t[u].del = 0;
        return;
    }
    if (t[t[u].ls].size + t[u].del >= k) del_k(t[u].ls, k);
    else del_k(t[u].rs, k - t[t[u].ls].size - t[u].del);
}
void del(int x) {
    del_k(root, Rank(root, x) + 1);
    if (t[root].tot * alpha >= t[root].size)
        rebuild(root);
}
/*
// 测试：打印二叉树
void print_tree(int u) {
    if(u) {
        cout << "v = " << t[u].val << ", l = " << t[u].ls << ", r = " << t[u].rs << '\n';
        print_tree(t[u].ls);
        print_tree(t[u].rs);
    }
}
*/
int main()
{
    for (int i = N - 1; i >= 1; i--) tree_stack[++top] = i;
    int q; cin >> q;
    while (q--) {
        int op, x; cin >> op >> x;
        switch (op) {
        case 1: Insert(root, x); break;
        case 2: del(x); break;
        case 3: cout << Rank(root, x) + 1 << '\n'; break;
        case 4: cout << kth(x) << '\n'; break;
        case 5: cout << kth(Rank(root, x)) << '\n'; break;
        case 6: cout << kth(Rank(root, x + 1) + 1) << '\n'; break;
        }
        // cout << ">>" << '\n'; print_tree(root); << cout << '<<\n'; // 打印二叉树测试
    }
}
```

STL 代码：

```cpp
#include <bits/stdc++.h>
using namespace std;
vector<int> v;
int main() {
    int q; cin >> q;
    while (q--) {
        int op, x; cin >> op >> x;
        if(op == 1) v.insert(lower_bound(v.begin(), v.end(), x), x);
        if(op == 2) v.erase(lower_bound(v.begin(), v.end(), x));
        if(op == 3) cout << lower_bound(v.begin(), v.end(), x) - v.begin() + 1 << '\n';
        if(op == 4) cout << v[x - 1] << '\n';
        if(op == 5) cout << v[lower_bound(v.begin(), v.end(), x) - v.begin() - 1] << '\n';
        if(op == 6) cout << v[upper_bound(v.begin(), v.end(), x) - v.begin()] << '\n';
    }
}
```

##  6 莫队

###  普通莫队

[P3901 数列找不同](https://www.luogu.com.cn/problem/P3901)

现有数列 $A_1,A_2,\ldots,A_N$，$Q$ 个询问 $(L_i,R_i)$，询问 $A_{L_i} ,A_{L_i+1},\ldots,A_{R_i}$ 是否互不相同。

第一行，两个整数$N,Q$。  
第二行，$N$ 个整数$A_1, A_2, \ldots , A_N$。  
接下来 $Q$ 行，每行两个整数 $L_i,R_i$。

对每个询问输出一行，`Yes` 或 `No`。

数据范围 $1 \le N,Q \le 10^5$，$1 \le A_i \le N$，$1 \le L_i \le R_i \le N$。

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 1e5 + 5;

int n, m;
int a[N], cnt[N], ans[N], tot;
struct Q {
    int l, r, id;
};
int pos[N];

void add(int x) {
    if (!cnt[a[x]]) tot++;
    cnt[a[x]]++;
}
void del(int x) {
    cnt[a[x]]--;
    if (!cnt[a[x]]) tot--;
}

void solve() {
    cin >> n >> m;
    int len = sqrt(n);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        pos[i] = (i - 1) / len + 1;
    }
    vector<Q> v(m);
    for (int i = 0; i < m; i++) {
        cin >> v[i].l >> v[i].r;
        v[i].id = i;
    }
    sort(v.begin(), v.end(), [&](Q a, Q b) {
        if (pos[a.l] == pos[b.l]) {
            if (pos[a.l] & 1) return a.r > b.r;
            return a.r < b.r;
        }
        return pos[a.l] < pos[b.l];
        });
    int l = 1, r = 0;
    for (int i = 0; i < m; i++) {
        while (l > v[i].l) add(--l);
        while (r < v[i].r) add(++r);
        while (l < v[i].l) del(l++);
        while (r > v[i].r) del(r--);
        ans[v[i].id] = (tot == v[i].r - v[i].l + 1);
    }
    for (int i = 0; i < m; i++) {
        if (ans[i]) cout << "Yes\n";
        else cout << "No\n";
    }
}
int main()
{
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    int _T = 1;
    // cin >> _T;
    while (_T--)
        solve();
    return 0;
}
```

### 带修改莫队

增加一个时间维度，分块长度 $len=n^{2/3}$

[P1903 [国家集训队] 数颜色 / 维护队列](https://www.luogu.com.cn/problem/P1903)

题目大意：给你一个序列，M 个操作，有两种操作：

1. 修改序列上某一位的数字
2. 询问区间 $[l,r]$ 中数字的种类数（多个相同的数字只算一个）

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 1e6 + 5;

int n, m;
struct Q { // 记录查询操作，t为这次查询之前经过的修改次数
    int id, t, l, r;
} q[N];
struct RE { // 记录修改操作
    int p, c;
} r[N];
int cnt[N];
int a[N], pos[N], ans[N], tot;
int qcnt, rcnt;

inline void add(int x) {
    if (cnt[x] == 0) tot++;
    cnt[x]++;
}
inline void del(int x) {
    if (cnt[x] == 1) tot--;
    cnt[x]--;
}

inline void solve() {
    cin >> n >> m;
    int len = pow(n, 2.0 / 3);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        pos[i] = (i - 1) / len + 1;
    }
    for (int i = 0; i < m; i++) {
        char ch;
        int x, y;
        cin >> ch >> x >> y;
        if (ch == 'Q') {
            q[++qcnt] = { qcnt, rcnt, x, y };
        }
        else {
            r[++rcnt] = { x, y };
        }
    }
    sort(q + 1, q + 1 + qcnt, [&](Q a, Q b) {
        if (pos[a.l] != pos[b.l]) return pos[a.l] < pos[b.l];
        if (pos[a.r] != pos[b.r]) return pos[a.r] < pos[b.r]; 
        return a.t < b.t;
        });
    int L = 1, R = 0, last = 0; // last记录最后一次修改的时间点
    for (int i = 1; i <= qcnt; i++) {
        while (R < q[i].r) add(a[++R]);
        while (R > q[i].r) del(a[R--]);
        while (L > q[i].l) add(a[--L]);
        while (L < q[i].l) del(a[L++]);
        // 时间维度的变化
        while (last < q[i].t) { // 进行修改
            last++;
            if (L <= r[last].p && r[last].p <= R) {
                add(r[last].c); 
                del(a[r[last].p]);
            }
            swap(a[r[last].p], r[last].c); // 更新，回退时会用到
        }
        while (last > q[i].t) { // 回退修改
            if (L <= r[last].p && r[last].p <= R) {
                add(r[last].c);
                del(a[r[last].p]);
            }
            swap(a[r[last].p], r[last].c);
            last--; // 先修改再last--
        }
        ans[q[i].id] = tot;
    }

    for (int i = 1; i <= qcnt; i++) {
        cout << ans[i] << '\n';
    }
}
int main()
{
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    int _T = 1;
    // cin >> _T;
    while (_T--)
        solve();
    return 0;
}
```

### 树上莫队

+ 给定 $n$ 个结点的树，每个结点有一种颜色。

- $m$ 次询问，每次询问给出 $u,v$，回答  之$u,v$间的路径上的结点的不同颜色数。
- $1 \leq n \leq 4*10^4,1 \leq m \leq 10^5$，颜色是不超过 $2×10^9$ 的非负整数。

```cpp
#include <bits/stdc++.h>

const int N = 1e5 + 5;

int n, m;
int a[N], col[N], ans[N];
int tot, pos1[N], pos2[N], pos[N]; // pos1为某点第一次出现的位置（进入dfs序），pos2为第二次的位置（离开dfs序）
int cnt[N];
std::vector<int> ed[N];
bool vis[N];
int idx[N];

struct Q {
    int l, r, id, lca;
};

int fa[N][20], deep[N];
inline void DFS(int x, int f) {
    deep[x] = deep[f] + 1;
    fa[x][0] = f;
    for (int i = 1; (1 << i) <= deep[x]; i++)
        fa[x][i] = fa[fa[x][i - 1]][i - 1];
    for (int i : ed[x])
        if (i != f)
            DFS(i, x);
}
inline int lca(int x, int y) {
    if (deep[x] < deep[y]) std::swap(x, y);
    for (int i = 16; i >= 0; i--)
        if (deep[x] - (1 << i) >= deep[y])
            x = fa[x][i];
    if (x == y) return x;
    for (int i = 16; i >= 0; i--)
        if (fa[x][i] != fa[y][i])
            x = fa[x][i], y = fa[y][i];
    return fa[x][0];
}

inline void update(int u, bool op) {
    if (op)
        u = idx[u];
    if (!vis[u]) {
        cnt[a[u]]++;
        if (cnt[a[u]] == 1) tot++;
    }
    else {
        if (cnt[a[u]] == 1) tot--;
        cnt[a[u]]--;
    }
    vis[u] ^= 1;
}

signed main()
{
    std::ios::sync_with_stdio(false), std::cin.tie(0), std::cout.tie(0);

    std::cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        std::cin >> a[i];
        col[i] = a[i]; // 用来排序
    }
    std::sort(col + 1, col + 1 + n);
    auto getid = [](int c) -> int {
        return std::lower_bound(col + 1, col + 1 + n, c) - (col + 1); // 对颜色进行离散化
        };
    for (int i = 1; i <= n; i++) {
        a[i] = getid(a[i]);
    }

    for (int i = 1; i < n; i++) {
        int u, v;
        std::cin >> u >> v;
        ed[u].push_back(v);
        ed[v].push_back(u);
    }

    std::vector<int> d;
    std::vector<bool> vis(n + 1, 0);
    auto dfs = [&](auto&& self, int u, int f) -> void {
        d.push_back(u);
        for (int v : ed[u]) {
            if (v == f || vis[v]) continue;
            vis[v] = 1;
            self(self, v, u);
        }
        d.push_back(u);
        };
    dfs(dfs, 1, 0); // 获取dfs序

    int len = sqrt(n << 1);
    for (int i = 0; i < (n << 1); i++) {
        if (!pos1[d[i]]) {
            pos1[d[i]] = i + 1;
        }
        else {
            pos2[d[i]] = i + 1;
        }
        pos[i + 1] = i / len + 1;
        idx[i + 1] = d[i];
    }
    DFS(1, 0); // lca初始化

    std::vector<Q> q(m);
    for (int i = 0; i < m; i++) {
        int u, v;
        std::cin >> u >> v;
        if (pos1[u] > pos1[v]) std::swap(u, v);
        int F = lca(u, v);
        if (F == u || F == v) {
            q[i].l = pos1[u];
            q[i].r = pos1[v];
            q[i].lca = 0;
        }
        else {
            q[i].l = pos2[u];
            q[i].r = pos1[v];
            q[i].lca = F; // dfs序中没有lca，要加上它带来的更新
        }
        q[i].id = i;
    }

    std::sort(q.begin(), q.end(), [&](Q a, Q b) {
        if (pos[a.l] == pos[b.l]) return a.r < b.r;
        return pos[a.l] < pos[b.l];
        });
    int l = 1, r = 0;
    for (int i = 0; i < m; i++) {
        while (l < q[i].l) update(l++, 1);
        while (l > q[i].l) update(--l, 1);
        while (r > q[i].r) update(r--, 1);
        while (r < q[i].r) update(++r, 1);
        if (q[i].lca) {
            update(q[i].lca, 0);
        }
        ans[q[i].id] = tot;
        if (q[i].lca) {
            update(q[i].lca, 0);
        }
    }
    for (int i = 0; i < m; i++) std::cout << ans[i] << std::endl;
}
```

## 7 ST 表

### ST 表

```cpp
int n, a[N];
int mx[N][20];
int mylog[N];

init() {
    mylog[0] = -1;
    for(int i = 1; i < N; i++) mylog[i] = mylog[i >> 1] + 1;
    
    for(int k = 1; (1 << k) <= n; k++)
        for(int i = 1; i + (1 << k) - 1 <= n; i++)
            mx[i][k] = max(mx[i][k - 1], mx[i + (1 << (k - 1))][k - 1]);
}
```

### 二维 ST 表

#### 固定子矩阵边长求最值

```cpp
// https://vjudge.net/problem/OpenJ_Bailian-2019
int n, b, m;
int mn[N][N][10], mx[N][N][10];
int mylog[N];
int a[N][N];

void solve() {
    memset(mn, 63, sizeof(mn));
    cin >> n >> b >> m;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            cin >> a[i][j];
            mn[i][j][0] = mx[i][j][0] = a[i][j];
        }
    }
    for (int k = 1; (1 << k) <= n; k++) //枚举区间长度
        for (int i = 1; i + (1 << k) - 1 <= n; i++)
            for (int j = 1; j + (1 << k) - 1 <= n; j++) {
                mn[i][j][k] = min(mn[i][j][k - 1], min(mn[i + (1 << (k - 1))][j][k - 1], min(mn[i][j + (1 << (k - 1))][k - 1], mn[i + (1 << (k - 1))][j + (1 << (k - 1))][k - 1])));
                mx[i][j][k] = max(mx[i][j][k - 1], max(mx[i + (1 << (k - 1))][j][k - 1], max(mx[i][j + (1 << (k - 1))][k - 1], mx[i + (1 << (k - 1))][j + (1 << (k - 1))][k - 1])));
            }
    int k = log2(b);
    while (m--) {
        int x, y;
        cin >> x >> y;
        int MN = 1e9, MX = 0;
        MN = min(MN, mn[x][y][k]);
        MN = min(MN, mn[x][y + b - (1 << k)][k]);
        MN = min(MN, mn[x + b - (1 << k)][y][k]);
        MN = min(MN, mn[x + b - (1 << k)][y + b - (1 << k)][k]);
        MX = max(MX, mx[x][y][k]);
        MX = max(MX, mx[x][y + b - (1 << k)][k]);
        MX = max(MX, mx[x + b - (1 << k)][y][k]);
        MX = max(MX, mx[x + b - (1 << k)][y + b - (1 << k)][k]);
        cout << MX - MN << '\n'; // 本题求最值之差
    }
}
```

#### 求任意子矩阵最值

```cpp
// https://vjudge.net/problem/HDU-2888
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 300 + 5;

int n, m;
int mx[N][N][9][9];
int mylog[N];
int a[N][N];

void solve() {
    // cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            cin >> a[i][j];
            mx[i][j][0][0] = a[i][j];
        }
    }
    for (int j = 1; j <= m; j++) {
        for (int k = 1; (1 << k) <= n; k++) {
            for (int i = 1; i + (1 << k) - 1 <= n; i++) {
                mx[i][j][k][0] = max(mx[i][j][k - 1][0], mx[i + (1 << (k - 1))][j][k - 1][0]);
            }
        }
    }
    for (int i = 1; i <= n; i++) {
        for (int k = 1; (1 << k) <= m; k++) {
            for (int j = 1; j + (1 << k) - 1 <= m; j++) {
                mx[i][j][0][k] = max(mx[i][j][0][k - 1], mx[i][j + (1 << (k - 1))][0][k - 1]);
            }
        }
    }
    for (int k1 = 1; (1 << k1) <= n; k1++) //枚举区间长度
        for (int k2 = 1; (1 << k2) <= m; k2++)
            for (int i = 1; i + (1 << k1) - 1 <= n; i++) //row
                for (int j = 1; j + (1 << k2) - 1 <= m; j++) //col
                    mx[i][j][k1][k2] = max(mx[i][j][k1 - 1][k2 - 1], max(mx[i + (1 << (k1 - 1))][j][k1 - 1][k2 - 1], max(mx[i][j + (1 << (k2 - 1))][k1 - 1][k2 - 1], mx[i + (1 << (k1 - 1))][j + (1 << (k2 - 1))][k1 - 1][k2 - 1])));
    int q;
    cin >> q;
    while (q--) {
        int p, q, x, y;
        cin >> p >> q >> x >> y;
        if (p == x && q == y) {
            cout << a[x][y] << " yes\n";
            continue;
        }
        int MX = 0;
        int dx = x - p + 1, dy = y - q + 1;
        int kx = mylog[dx], ky = mylog[dy];
        MX = max(MX, mx[p][q][kx][ky]);
        MX = max(MX, mx[p][y - (1 << ky) + 1][kx][ky]);
        MX = max(MX, mx[x - (1 << kx) + 1][q][kx][ky]);
        MX = max(MX, mx[x - (1 << kx) + 1][y - (1 << ky) + 1][kx][ky]);
        cout << MX << " ";
        if (MX == a[p][q] || MX == a[x][y] || MX == a[p][y] || MX == a[x][q])
            cout << "yes\n";
        else
            cout << "no\n";
    }
}
int main()
{
    mylog[0] = -1;
    for (int i = 1; i <= 300; i++) mylog[i] = mylog[i >> 1] + 1;
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    int _T = 1;
    // cin >> _T;
    while (cin >> n >> m)
        solve();
    return 0;
}
```

## 8 扫描线

```cpp
int lazy[N << 3];  // 标记了这条线段出现的次数
double s[N << 3];

struct node1 {
  double l, r;
  double sum;
} cl[N << 3];  // 线段树

struct node2 {
  double x, y1, y2;
  int flag;
} p[N << 3];  // 坐标

// 定义sort比较
bool cmp(node2 a, node2 b) { return a.x < b.x; }

// 上传
void pushup(int rt) {
  if (lazy[rt] > 0)
    cl[rt].sum = cl[rt].r - cl[rt].l;
  else
    cl[rt].sum = cl[rt * 2].sum + cl[rt * 2 + 1].sum;
}

// 建树
void build(int rt, int l, int r) {
  if (r - l > 1) {
    cl[rt].l = s[l];
    cl[rt].r = s[r];
    build(rt * 2, l, (l + r) / 2);
    build(rt * 2 + 1, (l + r) / 2, r);
    pushup(rt);
  } else {
    cl[rt].l = s[l];
    cl[rt].r = s[r];
    cl[rt].sum = 0;
  }
  return;
}

// 更新
void update(int rt, double y1, double y2, int flag) {
  if (cl[rt].l == y1 && cl[rt].r == y2) {
    lazy[rt] += flag;
    pushup(rt);
    return;
  } else {
    if (cl[rt * 2].r > y1) update(rt * 2, y1, min(cl[rt * 2].r, y2), flag);
    if (cl[rt * 2 + 1].l < y2)
      update(rt * 2 + 1, max(cl[rt * 2 + 1].l, y1), y2, flag);
    pushup(rt);
  }
}

void solve() {
    int temp = 1, n;
    double x1, y1, x2, y2, ans;
    cin >> n;
    ans = 0;
    for (int i = 0; i < n; i++) {
        scanf("%lf %lf %lf %lf", &x1, &y1, &x2, &y2);
        p[i].x = x1;
        p[i].y1 = y1;
        p[i].y2 = y2;
        p[i].flag = 1;
        p[i + n].x = x2;
        p[i + n].y1 = y1;
        p[i + n].y2 = y2;
        p[i + n].flag = -1;
        s[i + 1] = y1;
        s[i + n + 1] = y2;
    }
    sort(s + 1, s + (2 * n + 1));  // 离散化
    sort(p, p + 2 * n, cmp);  // 把矩形的边的横坐标从小到大排序
    build(1, 1, 2 * n);       // 建树
    memset(lazy, 0, sizeof(lazy));
    update(1, p[0].y1, p[0].y2, p[0].flag);
    for (int i = 1; i < 2 * n; i++) {
        ans += (p[i].x - p[i - 1].x) * cl[1].sum;
        update(1, p[i].y1, p[i].y2, p[i].flag);
    }
    cout << ans << '\n';
}
```

