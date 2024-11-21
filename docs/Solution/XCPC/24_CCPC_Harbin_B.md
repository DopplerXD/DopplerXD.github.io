# CCPC 2024 哈尔滨 B. Concave Hull 题解

题目链接

[QOJ](https://qoj.ac/contest/1817/problem/9520)

[CF GYM](https://codeforces.com/gym/105459)

## 题目大意

给定二维平面上的点集，要求选择若干个点以及点之间的连接顺序，使得这些点连成一个面积严格大于 0 的简单凹多边形，最大化这个凹多边形的面积。 $1 \leq n \leq 10^5$。

## 思路（官方题解）

首先可以发现，我们一定会选择到凸包上的所有点，如果没选完，那么选上，将凸包上的点按照极角序插入这些点内，一定不会使得凹包变成凸包，并且会使面积增大。

考虑现在已经有一个凸包了，我们要选择一些剩下的点插到凸包的点之间。首先是一些退化的情况，如果所有点都在凸包上那一定不合法。否则任意顺序插入任意一个点都能使得凸包变成凹包，因为要最大化面积，而每插入一个点肯定都会减少面积，所以我们至多只会插入一个点设为 $x$。

我们也不会改变原来的连接顺序，只会将原来的一条边 $(a,b)$ 变成 $(a,x),(x,b)$ ，减少的面积就是 $|ab| \cdot dis(x,ab)$，$dis$ 即点 $x$ 到直线 $ab$ 的距离，直接枚举所有边和 $x$ 显然会超时。

但可以发现，最优的 $x$ 一定是删去凸包之后，剩下的点，组成的凸包上的点（如果不退化），因为我们要尽量最小化 $dis(x,ab)$ 。

而对所有边找到凸包上距离这个边最近的点，可以直接双指针维护，对于每条外层凸包的边，维护距离最近的点，计算插入这个点后减小的面积，取最小值，依次移动边之后最近点的变化即可。注意可能需要处理内层凸包退化为一个或两个点的情况。

复杂度 $O(n \log n)$。

## 代码实现

``` cpp linenums="1"
#include <bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 1e5 + 5;

const double pi = acos(-1.0);
const double eps = 1e-8;

// 判断 x 的大小，<0 返回 -1，>0 返回 1，==0 返回 0
int sgn(ll x) {
    if (abs(x) == 0) return 0;
    else return x < 0 ? -1 : 1;
}

struct Point {
    ll x, y;
    Point() {}
    Point(ll x, ll y) : x(x), y(y) {}

    Point operator + (const Point& B) const { return Point(x + B.x, y + B.y); }
    Point operator - (const Point& B) const { return Point(x - B.x, y - B.y); }

    bool operator == (const Point& B) const {
        return sgn(x - B.x) == 0 && sgn(y - B.y) == 0;
    }
    bool operator < (const Point& B) const {
        return sgn(x - B.x) < 0 || sgn(x - B.x) == 0 && sgn(y - B.y) < 0;
    }
};
typedef Point Vector;

class Geometry {
public:
    static double Distance(const Point& A, const Point& B) {
        return sqrt((A.x - B.x) * (A.x - B.x) + (A.y - B.y) * (A.y - B.y));
    }

    static ll Cross(const Vector& A, const Vector& B) {
        return A.x * B.y - A.y * B.x;
    }

    static ll Area2(const Point& A, const Point& B, const Point& C) {
        return Cross(B - A, C - A);
    }
};

class PolygonOps {
public:
    static ll Area(int n, Point* ch) {
        ll area = 0;
        for (int i = 0; i < n; i++)
            area += Geometry::Cross(ch[i], ch[(i + 1) % n]);
        return area;
    }
};

int Convex_hull(Point* p, int n, Point* ch) {
    sort(p, p + n);
    int v = 0;
    for (int i = 0; i < n; i++) {
        while (v > 1 && sgn(Geometry::Cross(ch[v - 1] - ch[v - 2], p[i] - ch[v - 1])) <= 0) {
            v--;
        }
        ch[v++] = p[i];
    }
    int j = v;
    for (int i = n - 1; i >= 0; i--) {
        while (v > j && sgn(Geometry::Cross(ch[v - 1] - ch[v - 2], p[i] - ch[v - 1])) <= 0) {
            v--;
        }
        ch[v++] = p[i];
    }
    if (n > 1) v--;
    return v;
}

int n, n_left;
Point p[N], Left[N];
Point ch[N], chL[N]; // ch存外凸包，chL存内凸包

void solve() {
    cin >> n;
    n_left = 0;
    for (int i = 0; i < n; i++) {
        cin >> p[i].x >> p[i].y;
    }
    int v = Convex_hull(p, n, ch);
    set<Point> st;
    for (int i = 0; i < v; i++) {
        st.emplace(ch[i]);
    }
    for (int i = 0; i < n; i++) {
        if (!st.count(p[i])) {
            Left[n_left++] = p[i]; // 用不在外凸包上的点跑内凸包
        }
    }
    int vL = Convex_hull(Left, n_left, chL);
    if (vL == 0) {
        cout << -1 << '\n';
        return;
    }
    ll area = PolygonOps::Area(v, ch);
    ll ans = 0;
    ch[v] = ch[0];
    chL[vL] = chL[0];
    for (int i = 0, j = 0; i < v; i++) {
        // i 枚举外凸包边，j 枚举内凸包点
        // 找面积最小三角形，即找到 u 边距离最小的 j 点
        int nxt = (i + 1) % v;
        auto u = Vector(ch[nxt] - ch[i]);

        while (Geometry::Cross(u, chL[j] - ch[i]) > Geometry::Cross(u, chL[(j + 1) % vL] - ch[i])) {
            j = (j + 1) % vL;
        }
        while (Geometry::Cross(u, chL[j] - ch[i]) > Geometry::Cross(u, chL[(j + vL - 1) % vL] - ch[i])) {
            j = (j + vL - 1) % vL;
        }

        ll res = area - Geometry::Cross(u, chL[j] - ch[i]);
        ans = max(res, ans);
    }
    cout << ans << '\n';
}
int main() {
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    int _T = 1;
    cin >> _T;
    while (_T--)
        solve();
    return 0;
}
```

!!! tip "精度问题"

​	该题需使用 longlong 计算，使用 double 会产生误差导致 WA。



