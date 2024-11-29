# 树

## 1 树的直径

### 两次 DFS （不能有负权边）

```cpp
int n, c, d[N]; // c 为最深点
vector<int> ed[N];
void dfs(int u, int fa) {
    for (int v : ed[u]) {
        if (v == fa) continue;
        d[v] = d[u] + 1;
        if (d[v] > d[c]) c = v;
        dfs(v, u);
    }
}
void solve() {
    cin >> n;
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        ed[u].push_back(v);
        ed[v].push_back(u);
    }
    dfs(1, 0);
    d[c] = 0;
    dfs(c, 0); // 从直径的一端一路向上
    cout << d[c] << endl;
}
```

### 树形 DP（允许负权）

对于树的直径，实际上是可以通过枚举从某个节点出发不同的两条路径相加的最大值求出。因此，在 DP 求解的过程中，我们只需要在更新 $dp[u]$ 之前，计算 $d = max(d, dp[u] + dp[v] + w(u, v))$ 即可算出直径 $d$。

```cpp
int n, d = 0;
int dp[N];
vector<int> E[N];
void dfs(int u, int fa) {
	for (int v : E[u]) {
		if (v == fa) continue;
		dfs(v, u);
		d = max(d, dp[u] + dp[v] + 1);
		dp[u] = max(dp[u], dp[v] + 1);
	}
}
```

`性质` 若树上所有边权为正，则树的所有直径的中点相同

## 2  最近公共祖先  LCA（Lowest Common Ancestor）

### 倍增法 $O(n)$ 预处理，$O(logn)$ 查询

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 5e5 + 5;
int n, m, s;
int fa[N][20], d[N]; // fa[x][i] 表示 x 的第 (2^i) 个父亲 d[i] 为深度
vector<int> ed[N];
void dfs(int u, int f) {
    d[u] = d[f] + 1;
    fa[u][0] = f;
    for (int i = 1; (1 << i) <= d[u]; i++)
        fa[u][i] = fa[fa[u][i - 1]][i - 1];
    for (int v : ed[u]) {
        if (v != f)
            dfs(v, u);
    }
}
int LCA(int x, int y) {
    if (d[x] < d[y]) swap(x, y);
    for (int i = 19; i >= 0; i--) { // 把 x 和 y 提到相同高度
        if (d[x] - (1 << i) >= d[y])
            x = fa[x][i];
    }
    if (x == y) return x;
    for (int i = 19; i >= 0; i--) {
        if (fa[x][i] != fa[y][i]) {
            x = fa[x][i];
            y = fa[y][i];
        }
    }
    return fa[x][0];
}
int main() {
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    cin >> n >> m >> s;
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        ed[u].push_back(v);
        ed[v].push_back(u);
    }
    dfs(s, 0);
    while (m--) {
        int a, b;
        cin >> a >> b;
        cout << LCA(a, b) << '\n';
    }
}
```

### tarjan 离线处理 $O(n + m)$

```cpp
#include <bits/stdc++.h>
#define ll long long
#define PII pair<int, int>
using namespace std;
const int N = 5e5 + 5;
int n, m, s;
int fa[N], ans[N];
vector<int> ed[N];
vector<PII> query[N];
bool vis[N];
int find_set(int x) {
    int root = fa[x];
    while (root != fa[root]) root = fa[root];
    while (x != root) {
        int t = fa[x];
        fa[x] = root;
        x = t;
    }
    return root;
}
void tarjan(int u) {
    vis[u] = true;
    for (int v : ed[u]) {
        if (!vis[v]) {
            tarjan(v);
            fa[v] = u;
        }
    }
    for (auto it : query[u]) {
        int v = it.first;
        if (vis[v])
            ans[it.second] = find_set(v);
    }
}
int main() {
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    cin >> n >> m >> s;
    for (int i = 1; i < n; i++) {
        fa[i] = i; // 并查集初始化
        int u, v;
        cin >> u >> v;
        ed[u].push_back(v);
        ed[v].push_back(u);
    }
    fa[n] = n;
    for (int i = 1; i <= m; i++) {
        int a, b;
        cin >> a >> b;
        query[a].push_back({b, i});
        query[b].push_back({a, i});
    }
    tarjan(s);
    for (int i = 1; i <= m; i++)
        cout << ans[i] << '\n';
}
```

### 树链剖分 $O(n)$ 预处理 $O(\log n)$ 查询

```cpp
struct HLD {
    int n, idx;
    vector<vector<int>> ver;
    vector<int> siz, dep;
    vector<int> top, son, parent;

    HLD(int n) {
        this->n = n;
        ver.resize(n + 1);
        siz.resize(n + 1);
        dep.resize(n + 1);

        top.resize(n + 1);
        son.resize(n + 1);
        parent.resize(n + 1);
    }
    void add(int x, int y) { // 建立双向边
        ver[x].push_back(y);
        ver[y].push_back(x);
    }
    void dfs1(int x) {
        siz[x] = 1;
        dep[x] = dep[parent[x]] + 1;
        for (auto y : ver[x]) {
            if (y == parent[x]) continue;
            parent[y] = x;
            dfs1(y);
            siz[x] += siz[y];
            if (siz[y] > siz[son[x]]) {
                son[x] = y;
            }
        }
    }
    void dfs2(int x, int up) {
        top[x] = up;
        if (son[x]) dfs2(son[x], up);
        for (auto y : ver[x]) {
            if (y == parent[x] || y == son[x]) continue;
            dfs2(y, y);
        }
    }
    int lca(int x, int y) {
        while (top[x] != top[y]) {
            if (dep[top[x]] > dep[top[y]]) {
                x = parent[top[x]];
            }
            else {
                y = parent[top[y]];
            }
        }
        return dep[x] < dep[y] ? x : y;
    }
    int clac(int x, int y) { // 查询两点间距离
        return dep[x] + dep[y] - 2 * dep[lca(x, y)];
    }
    void work(int root = 1) { // 在此初始化
        dfs1(root);
        dfs2(root, root);
    }
};
```

## 3 树的重心

### 定义

如果在树中选择某个节点并删除，这棵树将分为若干棵子树，统计子树节点数并记录最大值。取遍树上所有节点，使此最大值取到最小的节点被称为整个树的重心。

### 性质

+ 树的重心如果不唯一，则至多有两个，且这两个重心相邻。
+ 以树的重心为根时，所有子树的大小都不超过整棵树大小的一半。
+ 树中所有点到某个点的距离和中，到重心的距离和是最小的；如果有两个重心，那么到它们的距离和一样。
+ 把两棵树通过一条边相连得到一棵新的树，那么新的树的重心在连接原来两棵树的重心的路径上。
+ 在一棵树上添加或删除一个叶子，那么它的重心最多只移动一条边的距离。

### 求解

在 DFS 中计算每个子树的大小，记录「向下」的子树的最大大小，利用总点数 - 当前子树（这里的子树指有根树的子树）的大小，
得到「向上」的子树的大小，然后就可以依据定义找到重心了。

```cpp
const int N = 1e4 + 5;
int n;
int Size[N];  // 这个节点的「大小」（所有子树上节点数 + 该节点）
int weight[N];  // 这个节点的「重量」，即所有子树「大小」的最大值
int centroid[2];  // 用于记录树的重心（存的是节点编号）
vector<int> ed[N];
void GetCentroid(int cur, int fa) {  // cur 表示当前节点 (current)
    Size[cur] = 1;
    weight[cur] = 0;
    for (int v : ed[cur]) {
        if (v != fa) {  // v 表示这条有向边所通向的节点。
            GetCentroid(v, cur);
            Size[cur] += Size[v];
            weight[cur] = max(weight[cur], Size[v]);
        }
    }
    weight[cur] = max(weight[cur], n - Size[cur]);
    if (weight[cur] <= n / 2) {  // 依照树的重心的定义统计
        centroid[centroid[0] != 0] = cur;
    }
}
```
