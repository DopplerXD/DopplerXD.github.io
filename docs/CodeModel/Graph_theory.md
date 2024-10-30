# 图论

## 1 Floyd 

适用**最短路存在**的任何图，$f_{i,j}$ 为所求最短路长度

```cpp
void floyd() {
    int f[N][N];
    for (int k = 1; k <= n; k++)
        for (int x = 1; x <= n; x++)
            for (int y = 1; y <= n; y++)
                f[x][y] = min(f[x][y], f[x][k] + f[k][y]);
```

## 2 Bellman_Ford 

可以求出有负权的图的最短路，或对最短路不存在的情况进行判断

```cpp
struct edge {
    int v, w;
};
vector<edge> e[N];
int dis[N], cnt[N], vis[N];
queue<int> q;
bool spfa(int n, int s) {
    memset(dis, 63, sizeof(dis));
    dis[s] = 0, vis[s] = 1;
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop(), vis[u] = 0;
        for (auto ed : e[u]) {
            int v = ed.v, w = ed.w;
            if (dis[v] > dis[u] + w) {
                dis[v] = dis[u] + w;
                cnt[v] = cnt[u] + 1;  // 记录最短路经过的边数
                if (cnt[v] >= n) return false;
                // 在不经过负环的情况下，最短路至多经过 n - 1 条边
                // 因此如果经过了多于 n 条边，一定说明经过了负环
                if (!vis[v]) q.push(v), vis[v] = 1;
            }
        }
    }
    return true;
}
```

更新部分的另一种写法

```cpp
if(dis[v] > dis[u] + w) {
	dis[v] = dis[u] + w;
	if(!vis[v]) {
		vis[v] = 1;
		q.push(v);
		cnt[v]++;
		if(cnt[v] >= n) return false;
	}
}
```

#### 差分约束

形如 `a - b >= c` 的约束条件，在图中添加有向边 `ed[a].push_back({b, -c});`
对于 `a - b <= c`，`添加 ed[b].push_back({a, c}); `
对于 `a == b`，添加 a b 之间权值为 0 的边即可。

从 $0$ 向其他所有点增加一条权值为 $0$ 的边，注意此时建立了一个虚拟源点，所以判断要改成 `cnt[v] > n`

建图完成后，以 $0$ 为起点跑一边 SPFA，若存在负环，则无解。否则，$x_i = dis_i$ 为该差分约束系统的一组解。

## 3 Dijkstra 

求解非负权图单源最短路

```cpp
int n;
struct edge {
    int v, w;
};
struct node {
    int dis, u;
    bool operator>(const node& a) const { return dis > a.dis; }
};
vector<edge> e[N];
int dis[N], vis[N];
priority_queue<node, vector<node>, greater<node> > q;
void dijkstra(int s) {
    memset(dis, 63, sizeof(dis));
    dis[s] = 0;
    q.push({0, s});
    while (!q.empty()) {
        int u = q.top().u;
        q.pop();
        if (vis[u])
            continue;
        vis[u] = 1;
        for (auto ed : e[u]) {
            int v = ed.v, w = ed.w;
            if (dis[v] > dis[u] + w) {
                dis[v] = dis[u] + w;
                q.push({dis[v], v});
            }
        }
    }
}
```

## 4 Kruskal

```cpp
const int N = 2e3 + 5;
struct edge {
    int u, v, w;
    bool operator> (const edge& a) const { return w > a.w; }
};
priority_queue<edge, vector<edge>, greater<edge> > q; // 边集按权值排序
vector<edge> mp;
int fa[N];
int n, m, ans = 0;
int find(int x) { // 并查集判环
    int root = fa[x];
    while (root != fa[root]) root = fa[root];
    while (x != root) {
        int t = fa[x];
        fa[x] = root;
        x = t;
    }
    return root;
}
void Kruskal() {
    for (int i = 1; i <= n; i++) fa[i] = i;
    while (mp.size() < n - 1 && !q.empty()) { // 克鲁斯卡尔
        edge ed = q.top();
        q.pop();
        int u = find(ed.u), v = find(ed.v);
        if (u != v) {
            mp.push_back(ed);
            ans += ed.w;
            fa[u] = fa[v];
        }
    }
}
int main() {
    cin >> n >> m;
    while (m--) {
        int u, v, w;
        cin >> u >> v >> w;
        q.push((edge) { u, v, w });
    }
    Kruskal();
    if (mp.size() < n - 1 && q.empty()) {
        cout << "无法构成最小生成树";
        return 0;
    }
    cout << "总权值：" << ans << endl;
    cout << "构成最小生成树的边是：" << endl;
    for (auto e : mp)
        printf("%d %d %d\n", e.u, e.v, e.w);
    return 0;
}
```

## 5 prim

```cpp
const int N = 5e3 + 5;
struct edge {
    int v, w;
    bool operator> (const edge& e) const { return w > e.w; }
};
int n, m;
ll ans = 0;
bool vis[N];
vector<edge> ed[N];
void prim(int s) {
    int cnt = 1;
    vis[s] = 1;
    priority_queue<edge, vector<edge>, greater<edge> > q;
    for (auto e : ed[s])
        q.push(e);
    while (!q.empty() && cnt < n) {
        edge e = q.top();
        q.pop();
        if (vis[e.v]) continue;
        for (auto e : ed[e.v])
            q.push(e);
        ans += e.w;
        vis[e.v] = 1;
    }
}
int main() {
    cin >> n >> m;
    while (m--) {
        int u, v, w;
        cin >> u >> v >> w;
        ed[u].push_back((edge) { v, w });
        ed[v].push_back((edge) { u, w });
    }
    prim(1);
    for (int i = 1; i <= n; i++)
        if (!vis[i]) {
            cout << "impossible";
            return 0;
        }
    cout << ans << endl;
    return 0;
}
```

## 6 拓扑排序（常用 BFS 判环）

复杂度 $O(n + m)$

```cpp
vector<int> ed[N]; // 存图
int in[N]; // 保存入度
bool vis[N];
int main() {
	int n, m;
    cin >> n >> m;
    while(m--) {
		int u, v;
        cin >> u >> v;
        ed[u].push_back(v);
        in[v]++;
    }
    queue<int> q;
    vector<int> L;
    for (int i = 1; i <= n; i++)
        if (!in[i])
            q.push(i);
    while (!q.empty()) {
        int u = q.front();
        L.push_back(u);
        q.pop();
        for (int v : ed[u]) {
            if (in[v] == 0) continue;
            in[v]--;
            if (!in[v])
                q.push(v);
        }
    }
    if(L.size() != n) cout << "有环、n"; // 输出 L 的内容即为拓扑排序的结果
}
```

```cpp
void topo() {
	queue<int> q;
	for(int i = 1; i <= n; i++) {
		if(!in[i])
			q.push(i);
	}
	while(!q.empty()) {
		int u = q.front();
		q.pop();
		for(int v : ed[u]) {
			in[v]--;
			if(!in[v]) q.push(v);
		}
	}
}
```

## 7 同余最短路

处理「给定 $n$ 个整数，求这 $n$ 个整数能拼凑出多少的其他整数（$n$ 个整数可以重复取）」，以及「给定 $n$ 个整数，求这 $n$ 个整数不能拼凑出的最小（最大）的整数」，或者「至少要拼几次才能拼出模 $K$ 余 $p$ 的数」的问题。

状态转移：$f(i + y) = f(i) + y$

```cpp
// 例题：luogu 跳楼机：给定 h，从 1 开始，可以加 x、y、z，问有多少组 abc，使得 1 < ax+by+cz <= h
#include <bits/stdc++.h>
#define rep(i, j, k) for(int i = (j); i <= (k); i++)
#define per(i, k, j) for(int i = (k); i >= (j); i--)
#define ll long long
using namespace std;
const int N = 1e5 + 5;
const ll llINF = 0x3f3f3f3f3f3f3f3f;
struct edge {
    ll v, w;
};
vector<edge> ed[N];
ll h, dis[N];
ll x, y, z;
bool vis[N];
void spfa() {
    dis[1] = 1;
    vis[1] = 1;
    queue<ll> q;
    q.push(1);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        vis[u] = 0;
        for (auto e : ed[u]) {
            int v = e.v, w = e.w;
            if (dis[v] > dis[u] + w) {
                dis[v] = dis[u] + w;
                if (!vis[v]) {
                    q.push(v);
                    vis[v] = 1;
                }
            }
        }
    }
}
void solve() {
    memset(dis, llINF, sizeof(dis));
    cin >> h >> x >> y >> z;
    if (x == 1 || y == 1 || z == 1) {
        cout << h << '\n';
        return;
    }
    rep(i, 0, x - 1) {
        ed[i].push_back({(i + y) % x, y}); // 加边
        ed[i].push_back({(i + z) % x, z});
    }
    spfa(); // 跑一边单源最短路
    ll ans = 0;
    rep(i, 0, x - 1) {
        if (h >= dis[i]) {
            ans += (h - dis[i]) / x + 1;
        }
    }
    cout << ans << '\n';
}
int main() {
    int T_T = 1;
    // cin >> T_T;
    while (T_T--)
        solve();
    return 0;
}
```

## 8 传递闭包

floyd 判断连通性    模版：https://www.luogu.com.cn/problem/B3611

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
bool dis[105][105];
int n;
void floyd() {
    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            if (dis[i][k])
                for (int j = 1; j <= n; j++)
                    if (dis[k][j])
                        dis[i][j] = 1;
}
int main() {
    cin >> n;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            cin >> dis[i][j];
    floyd();
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++)
            cout << dis[i][j] << " ";
        cout << endl;
    }
}
```

## 9 最小环问题

给出一个图，问其中的由 $n$ 个节点构成的边权和最小的环 $(n ≥ 3)$ 是多大。 https://www.luogu.com.cn/problem/P6175

记原图中 $u,v$ 之间边的边权为 $val[u][v]$。
我们注意到 Floyd 算法有一个性质：在最外层循环到点 $k$ 时（尚未开始第 $k$ 次循环），最短路数组 $dis$ 中，$dis[u][v]$ 表示的是从 $u$ 到 $v$ 且仅经过编号在 $[1 , k)$ 区间中的点的最短路。
由最小环的定义可知其至少有三个顶点，设其中编号最大的顶点为 $w$，环上与 $w$ 相邻两侧的两个点为 $u,v$，则在最外层循环枚举到 $k = w$ 时，该环的长度即为 $dis[u][v] + val[v][w] + val[w][u]$.
故在循环时对于每个 $k$ 枚举满足 $i < k, j < k$ 的 $(i,j)$，更新答案即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int INF = 0x2a2a2a2a; // 0x3f 会过大导致溢出 WA
int dis[105][105], val[105][105];
int n, m;
int floyd() {
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) dis[i][j] = val[i][j];  //初始化最短路矩阵
    }
    int ans = INF;
    for (int k = 1; k <= n; ++k) {
        for (int i = 1; i < k; ++i) {
            for (int j = 1; j < i; ++j)
                ans = min(ans, dis[i][j] + val[i][k] + val[k][j]);  //更新答案
        }
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= n; ++j)
                dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);  //floyd 更新最短路矩阵
        }
    }
    return ans;
}
int main() {
    memset(val, INF, sizeof(val));
    cin >> n >> m;
    while (m--) {
        int u, v, w;
        cin >> u >> v >> w;
        val[u][v] = val[v][u] = w;
    }
    int ans = floyd();
    if (ans == INF) cout << "No solution.";
    else cout << ans;
}
```

## 10 Johnson 求全源最短路

P5905 【模板】全源最短路（Johnson） https://www.luogu.com.cn/problem/P5905
给定一个有向图，可能存在自环和重边，也不一定是连通图，求所有点对之间的最短路径

思路：

+ 新建虚拟节点，向所有节点连接一条权值为 $0$ 的边，跑一边 spfa，得到 $0$ 号结点到其他 $n$ 个点的最短路，记为 $h_i$。
+ 假设存在一条从 $u$ 到 $v$ 的权值为 $w$ 的边，则将该边的权值从新设置为 $w + h_u - h_v$，目的是确保所有边的权值都非负，进而使用 dijkstra。
+ 以每个点为起点跑 dijkstra 求最短路即可。最后得到的任意两点间最短路要减去 $h_u-h_v$

时间复杂度 $O(nmlogn)$

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 3e3 + 5;
struct edge {
    int v;
    ll w;
};
struct node {
    ll dis;
    int u;
    bool operator>(const node& a) const { return dis > a.dis; }
};
vector<edge> ed[N];
int n, m;
ll h[N], dis[N][N];
int cnt[N];
bool vis[N];
void spfa(int s) {
    memset(h, 63, sizeof(h));
    queue<int> q;
    q.push(s);
    h[s] = 0;
    while (!q.empty()) {
        int u = q.front();
        vis[u] = 0;
        q.pop();
        for (auto e : ed[u]) {
            int v = e.v;
            ll w = e.w;
            if (h[v] > h[u] + w) {
                h[v] = h[u] + w;
                cnt[v] = cnt[u] + 1;
                if (cnt[v] > n) {
                    cout << -1;
                    exit(0);
                }
                if (!vis[v]) {
                    vis[v] = 1;
                    q.push(v);
                }
            }
        }
    }
}
void dijkstra(int s) {
    priority_queue<node, vector<node>, greater<node> > q;
    q.push({0, s});
    dis[s][s] = 0;
    while (!q.empty()) {
        int u = q.top().u;
        q.pop();
        if (vis[u]) continue;
        vis[u] = 1;
        for (auto e : ed[u]) {
            int v = e.v;
            ll w = e.w;
            if (dis[s][v] > dis[s][u] + w) {
                dis[s][v] = dis[s][u] + w;
                q.push({dis[s][v], v});
            }
        }
    }
}
int main() {
    cin >> n >> m;
    while (m--) {
        int u, v, w;
        cin >> u >> v >> w;
        ed[u].push_back({v, w});
    }
    for (int i = 1; i <= n; i++) {
        ed[0].push_back({i, 0});
    }
    spfa(0);
    for (int i = 1; i <= n; i++) {
        for (auto& j : ed[i]) {
            j.w += h[i] - h[j.v];
        }
    }
    memset(dis, 0x3f, sizeof(dis));
    for (int i = 1; i <= n; i++) {
        memset(vis, 0, sizeof(vis));
        dijkstra(i);
    }
    for (int i = 1; i <= n; i++) {
        ll ans = 0;
        for (int j = 1; j <= n; j++) {
            if (dis[i][j] == 0x3f3f3f3f3f3f3f3f) {
                dis[i][j] = 1e9;
            }
            else {
                dis[i][j] -= h[i] - h[j];
            }
            ans += dis[i][j] * j;
        }
        cout << ans << endl;
    }
}
```

## 11 欧拉路

欧拉路定义：从图中某个点出发，遍历整个图，图中每条边经过且只经过一次

首先用 dfs 或并查集判断图的连通性，然后判断图是否存在欧拉路

无向连通图的判断条件：如果图中的点全都是偶点，则存在欧拉回路。如果只有两个奇点，则存在欧拉路，其中一个奇点是起点，另一个是终点

有向连通图的判断条件：如果所有点的读书都是 0 ，则存在欧拉回路。如果有两个点的度数分别是 1 和 -1 ，则存在欧拉路，度数为 1 的是起点，为 -1 的是终点。

## 12 二分图匹配

1. 匈牙利算法 O(nm)

```cpp
//对于第 x 个，能够匹配返回 true，不能匹配返回 false 
bool find(int x) {
	for(int i = h[x];i!=-1;i = e[i].ne){
		int v = e[i].v;
		//如果曾经查找过第 v 个点，但是没有成功 
		if(vis[v] == 0){
			vis[v] = 1;
			//第 v 个没有匹配或者第 v 个的匹配对象可以匹配成功 
			if(match[v] == 0 || find(match[v])){
				match[v] = x;	return true;
			}
		}
	}
	return false;
} 
int main() {
	for(i = 1;i<=n1;i++){
		memset(vis,0,sizeof vis);
		//如果匹配成功，则匹配总数+1 
		if(find(i))ans++;
	}
	printf("%d",ans);
	return 0;
}
```

2. KM 算法，求二分图的最大带权匹配 O(n^3)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<ll, ll> PII;
const int N = 605;
const int inf = 0x3f3f3f3f;
PII a[N];
ll n, b[N], c[N];
ll w[N][N], lx[N], ly[N];
ll linker[N], slack[N];
bool visy[N];
ll pre[N];
void bfs(ll k) {
	int i, j;
	ll x, y = 0, yy = 0, delta;
	memset(pre, 0, sizeof(pre));
	for (i = 1; i <= n; i++) slack[i] = inf;
	linker[y] = k;
	while (1) {
		x = linker[y]; delta = inf; visy[y] = true;
		for (i = 1; i <= n; i++) {
			if (!visy[i]) {
				if (slack[i] > lx[x] + ly[i] - w[x][i]) {
					slack[i] = lx[x] + ly[i] - w[x][i];
					pre[i] = y;
				}
				if (slack[i] < delta) delta = slack[i], yy = i;
			}
		}
		for (i = 0; i <= n; i++) {
			if (visy[i]) lx[linker[i]] -= delta, ly[i] += delta;
			else slack[i] -= delta;
		}
		y = yy;
		if (linker[y] == -1) break;
	}
	while (y) linker[y] = linker[pre[y]], y = pre[y];
}
ll KM() {
	int i, j;
	memset(lx, 0, sizeof(lx));
	memset(ly, 0, sizeof(ly));
	memset(linker, -1, sizeof(linker));
	for (i = 1; i <= n; i++) {
		memset(visy, false, sizeof(visy));
		bfs(i);
	}
	ll res = 0;
	for (i = 1; i <= n; i++) {
		if (linker[i] != -1) {
			res += w[linker[i]][i];
		}
	}
	return res;
}
int main() {
	int i, j;
	while (cin >> n) {
		for (i = 1; i <= n; i++) {
			for (j = 1; j <= n; j++) {
				scanf("%d", &w[i][j]);
			}
		}
		cout << KM() << endl;
	}
	return 0;
}
```

## 13 欧拉回路

```cpp
//找出欧拉回路，并将欧拉回路的每条边存入栈中
//type==1, 为无向图，type==2 为有向图
void dfs(int u) {
	int& i = h[u], j;
	for (; i != -1;) {
		int v = e[i].v;
		if (vis[i]) {
			i = e[i].ne;
			continue;
		}
		vis[i] = 1;//标记为走过
		int t = i;
		if (type == 1) {
			//偶数边为正，奇数边为负
			vis[i ^ 1] = 1;
			t = (t + 2) / 2;
			if (i % 2 == 1)    t = -t;
		}
		else {
			t = t + 1;
		}
		i = e[i].ne;
		dfs(v);
		stac.push(t);
	}
}
```

## 14 链式前向星

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 1e6 + 5;
const int M = 2e6 + 5;
struct edge {
    int from, to, nxt;
    int w;
}ed[M];
int head[N], cnt;
int n, m;
void init() {
    for (int i = 0; i < N; i++) head[i] = -1;
    for (int i = 0; i < M; i++) ed[i].nxt = -1;
    cnt = 0;
}
void addedge(int u, int v, int w) {
    ed[cnt].from = u;
    ed[cnt].to = v;
    ed[cnt].w = w;
    ed[cnt].nxt = head[u];
    head[u] = cnt++;
}
int main() {
    init();
    cin >> n >> m;
    while (m--) {
        int u, v, w;
        cin >> u >> v >> w;
        addedge(u, v, w);
    }
    // 遍历节点 2 的所有邻居 ~i == (i !=-1)
    for (int i = head[2]; ~i; i = ed[i].nxt)
        cout << ed[i].to << " ";
}
```

## 15 有向无环图 DAG

拓扑排序来判断一个图是否为 DAG.

### 应用：DP 求最短（长）路

时间复杂度 $O(n+m)$

```cpp
struct edge {
	int v, w;
};
int n, m;
vector<edge> e[MAXN];
vector<int> L;                               // 存储拓扑排序结果
int max_dis[MAXN], min_dis[MAXN], in[MAXN];  // in 存储每个节点的入度
void toposort() {  // 拓扑排序
	queue<int> S;
	memset(in, 0, sizeof(in));
	for (int i = 1; i <= n; i++) {
		for (int j = 0; j < e[i].size(); j++) {
			in[e[i][j].v]++;
		}
	}
	for (int i = 1; i <= n; i++)
		if (in[i] == 0) S.push(i);
	while (!S.empty()) {
		int u = S.front();
		S.pop();
		L.push_back(u);
		for (int i = 0; i < e[u].size(); i++) {
			if (--in[e[u][i].v] == 0) {
				S.push(e[u][i].v);
			}
		}
	}
}
void dp(int s) {  // 以 s 为起点求单源最长（短）路
	toposort();     // 先进行拓扑排序
	memset(min_dis, 0x3f, sizeof(min_dis));
	memset(max_dis, 0, sizeof(max_dis));
	min_dis[s] = 0;
	for (int i = 0; i < L.size(); i++) {
		int u = L[i];
		for (int j = 0; j < e[u].size(); j++) {
			min_dis[e[u][j].v] = min(min_dis[e[u][j].v], min_dis[u] + e[u][j].w);
			max_dis[e[u][j].v] = max(max_dis[e[u][j].v], max_dis[u] + e[u][j].w);
		}
	}
}
```

例题：P1113 杂务：给定 $n$ 个任务的完成所需时间，和每个任务必需的前置任务，求完成所有任务所需的最小用时

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 1e4 + 5;
vector<int> ed[N]; // 存图
int in[N], a[N], dp[N]; // 保存入度
bool vis[N];
int main() {
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        int u, v;
        cin >> u >> a[i] >> v;
        dp[i] = a[i];
        while (v) {
            ed[v].push_back(u);
            in[u]++;
            cin >> v;
        }
    }
    queue<int> q;
    vector<int> L;
    for (int i = 1; i <= n; i++)
        if (!in[i]) q.push(i);
    while (!q.empty()) {
        int u = q.front();
        L.push_back(u);
        q.pop();
        for (int v : ed[u]) {
            if (in[v] == 0) continue;
            in[v]--;
            if (!in[v]) q.push(v);
        }
    }
    for (int u : L)
        for (int v : ed[u])
            dp[v] = max(dp[v], dp[u] + a[v]);
    int ans = 0;
    for (int i = 1; i <= n; i++)
        ans = max(ans, dp[i]);
    cout << ans << '\n';
}
```

## 16 割边缩点

```cpp
struct EDCC {
    int n, now, cnt;
    vector<vector<int>> ver;
    vector<int> dfn, low, col, S;
    set<array<int, 2>> bridge;

    EDCC(int n) : n(n), ver(n + 1), low(n + 1) {
        dfn.resize(n + 1, -1);
        col.resize(n + 1, -1);
        now = cnt = 0;
    }
    void add(int x, int y) { // 和 scc 相比多了一条连边
        ver[x].push_back(y);
        ver[y].push_back(x);
    }
    void tarjan(int x, int fa) { // 和 scc 相比多了一个 fa
        dfn[x] = low[x] = now++;
        S.push_back(x);
        for (auto y : ver[x]) {
            if (y == fa) continue;
            if (dfn[y] == -1) {
                bridge.insert({x, y}); // 储存割边
                tarjan(y, x);
                low[x] = min(low[x], low[y]);
            }
            else if (col[y] == -1 && dfn[y] < dfn[x]) {
                bridge.insert({x, y});
                low[x] = min(low[x], dfn[y]);
            }
        }
        if (dfn[x] == low[x]) {
            int pre;
            cnt++;
            do {
                pre = S.back();
                col[pre] = cnt;
                S.pop_back();
            } while (pre != x);
        }
    }
    auto work() { // [cnt 新图的顶点数量, bridge 全部割边]
        for (int i = 1; i <= n; i++) { // 避免图不连通
            if (dfn[i] == -1) {
                tarjan(i, 0);
            }
        }

        vector<int> siz(cnt + 1); // siz 每个边双中点的数量
        vector<vector<int>> adj(cnt + 1); // adj 新图
        for (int i = 1; i <= n; i++) {
            siz[col[i]]++;
            for (auto j : ver[i]) {
                int x = col[i], y = col[j];
                if (x != y) {
                    adj[x].push_back(y);
                }
            }
        }
        return tuple{cnt, adj, col, siz};
    }
};
```

## 17 tarjan 强连通分量&缩点

> [P3387 【模板】缩点](https://www.luogu.com.cn/problem/P3387)
> 给定一个 $n$ 个点 $m$ 条边有向图，每个点有一个权值，求一条路径，使路径经过的点权值之和最大。你只需要求出这个权值和。
> 允许多次经过一条边或者一个点，但是，重复经过的点，权值只计算一次。

```cpp
#include <bits/stdc++.h>
const int N = 1e4 + 5;

struct edge {
    int v, w;
};
int n, m;
std::vector<int> ed[N];
std::vector<int> _ed[N];
std::stack<int> st;
int a[N];
bool vis[N];
int low[N], dfn[N];
int scc, tot;
int color[N];
int w[N];

int main() {
    std::ios::sync_with_stdio(false), std::cin.tie(0), std::cout.tie(0);

    std::cin >> n >> m;
    for (int i = 1; i <= n; i++) std::cin >> a[i];
    for (int i = 0; i < m; i++) {
        int u, v;
        std::cin >> u >> v;
        ed[u].push_back(v);
    }

    auto tarjan = [&](auto self, int u) -> void {
        low[u] = dfn[u] = ++tot;
        st.push(u);
        vis[u] = true;
        for (int v : ed[u]) {
            if (!dfn[v]) {
                self(self, v);
                low[u] = std::min(low[u], low[v]);
            }
            else if (vis[v]) {
                low[u] = std::min(low[u], dfn[v]);
            }
        }
        if (low[u] == dfn[u]) {
            color[u] = ++scc;
            int v;
            do {
                v = st.top();
                st.pop();
                vis[v] = false;
                color[v] = scc;
                w[scc] += a[v];
            } while (u != v);
        }
        };

    for (int i = 1; i <= n; i++) {
        if (!dfn[i]) {
            tarjan(tarjan, i);
        }
    }
    for (int i = 1; i <= n; i++) {
        for (int j : ed[i]) {
            if (color[i] != color[j]) {
                _ed[color[i]].push_back(color[j]);
            }
        }
    }

    int ans = 0;
    std::vector<int> dis(scc + 1, 0);
    std::vector<bool> _vis(scc + 1, 0);
    auto lpfa = [&](int s) {
        std::queue<int> q;
        _vis[s] = true;
        dis[s] = w[s];
        q.push(s);
        while (q.size()) {
            int u = q.front();
            q.pop();
            _vis[u] = false;
            for (int v : _ed[u]) {
                if (dis[v] < dis[u] + w[v]) {
                    dis[v] = dis[u] + w[v];
                    if (!_vis[v]) {
                        _vis[v] = 1;
                        q.push(v);
                    }
                }
            }
        }
        for (int i = 1; i <= scc; i++)
            ans = std::max(ans, dis[i]);
        };

    for (int i = 1; i <= scc; i++)
        lpfa(i);

    std::cout << ans << std::endl;

}
```

## 18 分层图

模板题 Luogu P4568 飞行路线

给定一个带权无向图，求 $s$ 到 $t$ 的最短路，其中可以令路径上最多 $k \leq 10$ 条道路花费为 $0$。

```cpp
#include <bits/stdc++.h>

int main() {
    std::ios::sync_with_stdio(false), std::cin.tie(0), std::cout.tie(0);
    
    int n, m, k, s, t;
    std::cin >> n >> m >> k >> s >> t;
    std::vector<std::vector<std::pair<int, int>>> ed(n * (k + 1));
    for (int i = 0; i < m; i++) {
        int a, b, c;
        std::cin >> a >> b >> c;
        for (int j = 0; j <= k; j++) {
            int u = a + n * j, v = b + n * j;
            ed[u].push_back({v, c});
            ed[v].push_back({u, c});
            if (j < k) {
                ed[u].push_back({v + n, 0});
                ed[v].push_back({u + n, 0});
            }
        }
    }

    std::vector<bool> vis(n * (k + 1), false);
    std::vector<int> dis(n * (k + 1), 1e9);

    auto dijkstra = [&](int s) -> void {
        std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<std::pair<int, int>>> q;
        q.push({0, s});
        dis[s] = 0;
        while (q.size()) {
            int u = q.top().second;
            q.pop();
            if (vis[u]) continue;
            vis[u] = 1;
            for (auto e : ed[u]) {
                int v = e.first, w = e.second;
                if (dis[v] > dis[u] + w) {
                    dis[v] = dis[u] + w;
                    q.push({dis[v], v});
                }
            }
        }
        };
    dijkstra(s);

    int ans = 1e9;
    for (int i = 0; i <= k; i++) {
        ans = std::min(ans, dis[t + n * i]);
    }

    std::cout << ans << '\n';
}
```

