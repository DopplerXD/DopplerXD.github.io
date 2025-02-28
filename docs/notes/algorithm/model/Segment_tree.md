## 封装区间加、区间最值查询

```cpp
template<class T> struct Segt {
    struct node {
        int l, r;
        T w, rmq, lazy;
    };
    std::vector<T> w;
    std::vector<node> t;

    Segt() {}
    Segt(int n) { init(n); }
    Segt(std::vector<int> in) {
        int n = in.size() - 1;
        w.resize(n + 1);
        for (int i = 1; i <= n; i++) {
            w[i] = in[i];
        }
        init(in.size() - 1);
    }
    
    #define GL (k << 1)
    #define GR (k << 1 | 1)
    
    void init(int n) {
        w.resize(n + 1);
        t.resize(n * 4 + 1);
        auto build = [&](auto self, int l, int r, int k = 1) {
            if (l == r) {
                t[k] = {l, r, w[l], w[l], -1};
                return;
            }
            t[k] = {l, r};
            int mid = (l + r) / 2;
            self(self, l, mid, GL);
            self(self, mid + 1, r, GR);
            pushup(k);
        };
        build(build, 1, n);
    }
    void pushdown(node &p, T lazy) {
        p.w += (p.r - p.l + 1) * lazy;
        p.rmq += lazy;
        p.lazy += lazy;
    }
    void pushdown(int k) {
        if (t[k].lazy == -1) return;
        pushdown(t[GL], t[k].lazy);
        pushdown(t[GR], t[k].lazy);
        t[k].lazy = -1;
    }
    void pushup(int k) {
        auto pushup = [&](node &p, node &l, node &r) {
            p.w = l.w + r.w;
            p.rmq = std::min(l.rmq, r.rmq); // RMQ -> min/max
        };
        pushup(t[k], t[GL], t[GR]);
    }
    void modify(int l, int r, T val, int k = 1) {
        if (l <= t[k].l && t[k].r <= r) {
            pushdown(t[k], val);
            return;
        }
        pushdown(k);
        int mid = (t[k].l + t[k].r) / 2;
        if (l <= mid) modify(l, r, val, GL);
        if (mid < r) modify(l, r, val, GR);
        pushup(k);
    }
    T rmq(int l, int r, int k = 1) {
        if (l <= t[k].l && t[k].r <= r) {
            return t[k].rmq;
        }
        pushdown(k);
        int mid = (t[k].l + t[k].r) / 2;
        T ans = std::numeric_limits<T>::max(); // RMQ -> 为 max 时需要修改为 ::lowest()
        if (l <= mid) ans = std::min(ans, rmq(l, r, GL)); // RMQ -> min/max
        if (mid < r) ans = std::min(ans, rmq(l, r, GR)); // RMQ -> min/max
        return ans;
    }
    T ask(int l, int r, int k = 1) { // 区间询问
        if (l <= t[k].l && t[k].r <= r) {
            return t[k].w;
        }
        pushdown(k);
        int mid = (t[k].l + t[k].r) / 2;
        T ans = 0;
        if (l <= mid) ans += ask(l, r, GL);
        if (mid < r) ans += ask(l, r, GR);
        return ans;
    }
    void debug(int k = 1) {
        std::cout << "[" << t[k].l << ", " << t[k].r << "]: ";
        std::cout << "w = " << t[k].w << ", ";
        std::cout << "Min = " << t[k].rmq << ", ";
        std::cout << "lazy = " << t[k].lazy << ", ";
        std::cout << std::endl;
        if (t[k].l == t[k].r) return;
        debug(GL), debug(GR);
    }
};
```



## 封装区间加、区间乘

```cpp
template <class T> struct Segt_ {
    struct node {
        int l, r;
        T w, add, mul = 1; // 注意初始赋值
    };
    std::vector<T> w;
   	std::vector<node> t;

    Segt_(int n) {
        w.resize(n + 1);
        t.resize((n << 2) + 1);
        build(1, n);
    }
    Segt_(vector<int> in) {
        int n = in.size() - 1;
        w.resize(n + 1);
        for (int i = 1; i <= n; i++) {
            w[i] = in[i];
        }
        t.resize((n << 2) + 1);
        build(1, n);
    }
    void pushdown(node &p, T add, T mul) {
        p.w = p.w * mul + (p.r - p.l + 1) * add;
        p.add = p.add * mul + add;
        p.mul *= mul;
    }
    void pushup(node &p, node &l, node &r) {
        p.w = l.w + r.w;
    }
#define GL (k << 1)
#define GR (k << 1 | 1)
    void pushdown(int k) { // 不需要动
        pushdown(t[GL], t[k].add, t[k].mul);
        pushdown(t[GR], t[k].add, t[k].mul);
        t[k].add = 0, t[k].mul = 1;
    }
    void pushup(int k) { // 不需要动
        pushup(t[k], t[GL], t[GR]);
    }
    void build(int l, int r, int k = 1) {
        if (l == r) {
            t[k] = {l, r, w[l]};
            return;
        }
        t[k] = {l, r};
        int mid = (l + r) / 2;
        build(l, mid, GL);
        build(mid + 1, r, GR);
        pushup(k);
    }
    void modify(int l, int r, T val, int k = 1) { // 区间修改
        if (l <= t[k].l && t[k].r <= r) {
            t[k].w += (t[k].r - t[k].l + 1) * val;
            t[k].add += val;
            return;
        }
        pushdown(k);
        int mid = (t[k].l + t[k].r) / 2;
        if (l <= mid) modify(l, r, val, GL);
        if (mid < r) modify(l, r, val, GR);
        pushup(k);
    }
    void modify2(int l, int r, T val, int k = 1) { // 区间修改
        if (l <= t[k].l && t[k].r <= r) {
            t[k].w *= val;
            t[k].add *= val;
            t[k].mul *= val;
            return;
        }
        pushdown(k);
        int mid = (t[k].l + t[k].r) / 2;
        if (l <= mid) modify2(l, r, val, GL);
        if (mid < r) modify2(l, r, val, GR);
        pushup(k);
    }
    T ask(int l, int r, int k = 1) { // 区间询问，不合并
        if (l <= t[k].l && t[k].r <= r) {
            return t[k].w;
        }
        pushdown(k);
        int mid = (t[k].l + t[k].r) / 2;
        T ans = 0;
        if (l <= mid) ans += ask(l, r, GL);
        if (mid < r) ans += ask(l, r, GR);
        return ans;
    }
    void debug(int k = 1) {
        std::cout << "[" << t[k].l << ", " << t[k].r << "]: ";
        std::cout << "w = " << t[k].w << ", ";
        std::cout << "add = " << t[k].add << ", ";
        std::cout << "mul = " << t[k].mul << ", ";
        std::cout << std::endl;
        if (t[k].l == t[k].r) return;
        debug(GL), debug(GR);
    }
};
```



## 区间赋值

```cpp
void pushdown(node &p, T lazy) { 
    p.w = (p.r - p.l + 1) * lazy;
    p.lazy = lazy;
}
void modify(int l, int r, T val, int k = 1) {
    if (l <= t[k].l && t[k].r <= r) {
        t[k].w = val * (t[k].r - t[k].l + 1);
        t[k].lazy = val;
        return;
    }
    // 剩余部分不变
}
```



## 单点赋值

```cpp
void modify(int p, T val, int k = 1) { // make a[p]=k
    if (l == r) {
        t[k].w = k;
        return;
    }
    // 剩余部分不变
}
```



## 快速线段树 单点修改+区间最值

```cpp
struct Segt {
    std::vector<int> w;
    int n;
    Segt(int n) : w(2 * n, (int)-2E9), n(n) {}

    void modify(int pos, int val) {
        for (w[pos += n] = val; pos > 1; pos /= 2) {
            w[pos / 2] = max(w[pos], w[pos ^ 1]);
        }
    }
    int ask(int l, int r) { // 返回左闭右开[l,r)的最值
        int res = -2E9;
        for (l += n, r += n; l < r; l /= 2, r /= 2) {
            if (l % 2) res = max(res, w[l++]);
            if (r % 2) res = max(res, w[--r]);
        }
        return res;
    }
};
```



## 区间开根号

由于 long long 级别的 $10^{18}$ 只需要 $1$4 次开根号就能到 $1.002$，所以总的暴力修改次数不会太大，递归到单点维护，如果区间长度等于区间和，说明区间内都是 $1$，不需要继续递归。

```cpp
void modify(int l, int r, int k = 1) {
    if (l <= t[k].l && t[k].r <= r) {
        if (t[k].rmq < val) return; // 剪枝
    }
    if (t[k].l == t[k].r) {
        t[k].w = t[k].rmq = std::sqrt(t[k].w);
        return;
    }
    int mid = (t[k].l + t[k].r) / 2;
    if (l <= mid) modify(l, r, val, GL);
    if (mid < r) modify(l, r, val, GR);
    pushup(k);
}
```



## 区间最大连续子段和

```cpp
template<class T> struct Segt {
    struct node {
        int l, r;
        T S, LS, RS, MS; // LS从区间左端点开始的连续子段，RS在区间右端点结束，MS区间最大连续子段和
    };
    
    // ...... 
    
    void pushup(int k) {
        auto pushup = [&](node &p, node &l, node &r) {
            p.S = l.S + r.S;
            p.LS = std::max(l.LS, l.S + r.LS);
            p.RS = std::max(r.RS, l.RS + r.S);
            p.MS = std::max(l.RS + r.LS, max(l.MS, r.MS));
            };
        pushup(t[k], t[GL], t[GR]);
    }
    void modify(int p, T val, int k = 1) {
        if (t[k].l == t[k].r) {
            t[k].S = t[k].LS = t[k].RS = t[k].MS = val;
            return;
        }
        int mid = (t[k].l + t[k].r) / 2;
        if (p <= mid) modify(p, val, GL);
        else modify(p, val, GR);
        pushup(k);
    }
    node ask(int l, int r, int k = 1) {
        if (l <= t[k].l && t[k].r <= r) {
            return t[k];
        }
        int mid = (t[k].l + t[k].r) / 2;
        if (r <= mid) {
            return ask(l, r, GL);
        }
        else {
            if (l > mid) {
                return ask(l, r, GR);
            }
            else {
                node no, a = ask(l, r, GL), b = ask(l, r, GR);
                no.LS = std::max(a.LS, a.S + b.LS);
                no.RS = std::max(b.RS, b.S + a.RS);
                no.MS = std::max(max(a.MS, b.MS), a.RS + b.LS);
                return no;
            }
        }
    }
};
// T.ask(l, r).MS 为答案
```



## 线段树封装 by 队友dzx

```cpp
struct segmentTree {
#define ls (u << 1)
#define rs (u << 1 | 1)
#define mid ((l + r) >> 1)

    int s[N << 2]{}, tag[N << 2]{}, siz[N << 2]{}, mx[N << 2]{};

    inline void build(int u, int l, int r) {
        if (l == r) {
            s[u] = a[l];
            siz[u] = 1;
            tag[u] = 0;
            mx[u] = a[l];
            return;
        }
        if (l <= mid) build(ls, l, mid);
        if (mid < r) build(rs, mid + 1, r);
        pushup(u);
    }
    inline void pushdown(int u) {
        if (tag[u] != 0) {
            tag[ls] += tag[u];
            tag[rs] += tag[u];
            s[ls] += siz[ls] * tag[u];
            s[rs] += siz[rs] * tag[u];
            mx[ls] += tag[u];
            mx[rs] += tag[u];
        }
        tag[u] = 0;
    }
    inline void pushup(int u) {
        s[u] = s[ls] + s[rs];
        siz[u] = siz[ls] + siz[rs];
        mx[u] = max(mx[ls], mx[rs]);
    }
    inline void modify(int u, int l, int r, int ql, int qr, int k) {
        if (ql <= l && r <= qr) {
            s[u] += siz[u] * k;
            mx[u] += k;
            tag[u] += k;
            return;
        }
        pushdown(u);
        if (ql <= mid) modify(ls, l, mid, ql, qr, k);
        if (qr > mid) modify(rs, mid + 1, r, ql, qr, k);
        pushup(u);
    }
    inline int query(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) {
            return s[u];
        }
        pushdown(u);
        int res = 0;
        if (ql <= mid) res = query(ls, l, mid, ql, qr);
        if (qr > mid) res += query(rs, mid + 1, r, ql, qr);
        return res;
    }
} T;
```