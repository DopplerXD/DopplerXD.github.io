# 基础/杂项

## 1 快读快写

```cpp
// 关闭同步流（加速）
ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);

// 更快但复杂的快读快写
int read() {
    int x = 0, w = 1;
    char ch = 0;
    while (ch < '0' || ch > '9')
    {
        if (ch == '-')
            w = -1;
        ch = getchar();
    }
    while (ch >= '0' && ch <= '9')
    {
        x = x * 10 + (ch - '0');
        ch = getchar();
    }
    return x * w;
}
void write(int x) {
    if (x < 0)
    {
        x = -x;
        putchar('-');
    }
    if (x > 9)
        write(x / 10);
    putchar(x % 10 + '0');
}
```

## 2 二分

```cpp
int arr[N];
int binarySearch(int left, int right, int x) {
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == x) {
            return mid;
        }
        else if (arr[mid] < x) {
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    return -1;
}
```

## 3 三分

```cpp
#include <bits/stdc++.h>
using namespace std;
const double eps = 1e-8;
int n;
double a[15];
double l, r;
double f(double x) {
    double p = 1, res = 0;
    for (int i = n; i >= 0; i--) {
        res += a[i] * p;
        p *= x;
    }
    return res;
}
int main()
{
    cin >> n >> l >> r;
    for (int i = 0; i <= n; i++) cin >> a[i];
    double mid;
    while (r - l > eps) {
        mid = (l + r) / 2;
        if (f(mid - eps) < f(mid + eps)) l = mid;
        else r = mid;
    }
    cout << l << endl;
}
```

## 4 字符串与其他类型转换

```cpp
// 整数转换为字符串
int num;
string s = to_string(num);

// 将一串 x 进制的字符串转换为 int 型数字
string s;
int a = stoi(s, 0, x);
long long b = stoll(s, 0, x);
stoull stold stod 同理
```

## 5 bitset

```cpp
构造方法
bitset<4> bitset1;　　//无参构造，长度为４，默认每一位为０
bitset<8> bitset2(12);　//长度为８，二进制保存，前面用０补充

string s = "100101";
bitset<10> bitset3(s);　　//长度为 10，前面用０补充
    
char s2[] = "10101";
bitset<13> bitset4(s2);　　//长度为 13，前面用０补充

cout << bitset1 << endl;　　//0000
cout << bitset2 << endl;　　//00001100
cout << bitset3 << endl;　　//0000100101
cout << bitset4 << endl;　　//0000000010101

数据访问
cout << foo[0] << endl;//1, 下标从 0 开始，表示二进制的最低位

数据操作
foo[i] = 0;//给第 i 位赋值
foo.flip();//反转全部
foo.flip(i);//反转下标为 i 的位
foo.set();//全部置 1
foo.set(i);//第 i 位置 1
foo.set(i,0);//第 i 位置 0
foo.reset();//全部置 0
foo.reset(i);//第 i 位置 0

数据转换
bitset<8> foo ("10011011");
string s = foo.to_string();　　//将 bitset 转换成 string 类型
unsigned long a = foo.to_ulong();　　//将 bitset 转换成 unsigned long 类型
unsigned long long b = foo.to_ullong();　　//将 bitset 转换成 unsigned long long 类型

常用函数
bitset<8> foo ("10011011");
cout << foo.count() << endl;　　//5　　（count 函数用来求 bitset 中 1 的位数，foo 中共有５个１
cout << foo.size() << endl;　　 //8　　（size 函数用来求 bitset 的大小，一共有８位
cout << foo.test(0) << endl;　　//true　　（test 函数用来查下标处的元素是０还是１，并返回 false 或 true，此处 foo[0] 为１，返回 true
cout << foo.test(2) << endl;　　//false　　（同理，foo[2] 为０，返回 false
cout << foo.any() << endl;　　//true　　（any 函数检查 bitset 中是否有１
cout << foo.none() << endl;　　//false　　（none 函数检查 bitset 中是否没有１
cout << foo.all() << endl;　　//false　　（all 函数检查 bitset 中是全部为１

位操作符
bitset<4> foo (string("1001"));
bitset<4> bar (string("0011"));
cout << (foo^=bar) << endl;       // 1010 (foo 对 bar 按位异或后赋值给 foo)
cout << (foo&=bar) << endl;       // 0010 （按位与后赋值给 foo)
cout << (foo|=bar) << endl;       // 0011 （按位或后赋值给 foo)
cout << (foo<<=2) << endl;        // 1100 （左移２位，低位补０，有自身赋值）
cout << (foo>>=1) << endl;        // 0110 （右移１位，高位补０，有自身赋值）
cout << (~bar) << endl;           // 1100 （按位取反）
cout << (bar<<1) << endl;         // 0110 （左移，不赋值）
cout << (bar>>1) << endl;         // 0001 （右移，不赋值）
cout << (foo==bar) << endl;       // false (0110==0011 为 false)
cout << (foo!=bar) << endl;       // true  (0110!=0011 为 true)
cout << (foo&bar) << endl;        // 0010 （按位与，不赋值）
cout << (foo|bar) << endl;        // 0111 （按位或，不赋值）
cout << (foo^bar) << endl;        // 0101 （按位异或，不赋值）
```

## 6 归并排序求逆序对数

```cpp
int tmp[N];
void mergeSort(int l, int r, std::vector<int>& a, int& ans) {
    if (l >= r) return;
    int mid = (l + r) >> 1, i = l, j = mid + 1, cnt = 0;
    mergeSort(l, mid, a, ans);
    mergeSort(mid + 1, r, a, ans);
    while (i <= mid || j <= r)
        if (j > r || (i <= mid && a[i] <= a[j]))
            tmp[cnt++] = a[i++];
        else
            tmp[cnt++] = a[j++], ans += mid - i + 1;
    for (int k = 0; k < r - l + 1; k++)
        a[l + k] = tmp[k];
}
```

## 7 结构体重载比较运算符

```cpp
struct node {
	int dis, u;
	bool operator>(const node& a) const { return dis > a.dis; }
};
```

## 8 对顶堆

定义两个堆，大根堆维护较小值，小根堆维护较大值。将大于大根堆顶的值放到小根堆，将小于等于大根堆顶值的数放入大根堆，然后维护两个堆的 size 的差值不大于 1，元素较多的堆的堆顶值即为当前中位数。

```cpp
#include <bits/stdc++.h>
using namespace std;
priority_queue<int, vector<int>, greater<int> > g;
priority_queue<int, vector<int>, less<int> > l;
int main()
{
	ios::sync_with_stdio(false), cin.tie(0);
	int n, x;
	cin >> n >> x;
	int mid = x;
	cout << mid << '\n';
	for(int i = 2; i <= n; i++) {
		int x;
		cin >> x;
		if(x > mid) g.push(x);
		else l.push(x);
		if(i % 2) {
			while(g.size() > l.size()) {
				l.push(mid);
				mid = g.top();
				g.pop();
			}
			while(l.size() > g.size()) {
				g.push(mid);
				mid = l.top();
				l.pop();
			}
			cout << mid << '\n';
		}
	}
	return 0;
}
```

## 9 vector 去重

```cpp
vector<int> a;
int n;
cin >> n;
for(int i = 1; i <= n; i++) {
	int x;
	cin >> x;
	a.push_back(x);
}
sort(a.begin(), a.end());
a.erase(unique(a.begin(), a.end()), a.end());
```

## 10 iota 生成连续数序列

```cpp
// C++ 11 引入
vector<int> v(n);
iota(v.begin(), v.end(), 1);
// 生成 1-n
```

## 11 sort 中使用 lambda 编写排序规则

```cpp
vector<int> q;
iota(q.begin(), q.end(), 1);
vector<int> v;
// 按照 v 从小到大的顺序对 p 进行排序
sort(q.begin(), q.end(),
        [&](int i, int j) {
            return v[i] < v[j] || (v[i] == v[j] && i < j);
        });
```

## 12 滑动窗口

```cpp
const int N = 1e5 + 5;
int n, k; // k for length of windows
int mx[N], a[N]; // mx 下标从 k 到 n
deque<int> q;
void solve() {
	cin >> n >> k;
	for(int i = 1; i <= n; i++) cin >> a[i];
	for(int i = 1; i <= n; i++) {
		while (!q.empty() && a[q.back()] < a[i]) q.pop_back();
        q.push_back(i);
        if (i >= k) {
            while (q.size() && q.front() <= i - k) q.pop_front();
            mx[i] = a[q.front()];
        }
	}
}
```

## 13 双向广搜

双向搜索，搜索到重复状态就停止，交替提取从 start 和 end 演变来的状态，进行搜索

能够将搜索次数从 $a^b$ 优化到 $2a^{(b/2)}$

例题：[P1032 [NOIP2002 提高组] 字串变换](https://www.luogu.com.cn/problem/P1032)

已知有两个字串 A,B 及一组字串变换的规则（至多 6 个规则），规则的含义为：在 *A* 中的子串 $A_1$ 可以变换为 $B_1$，$A_2$ 可以变换为 $B_2$⋯

若在 10 步（包含 10 步）以内能将 *A* 变换为 *B*，则输出最少的变换步数；否则输出 `NO ANSWER!`

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
string s, t, a[10], b[10];
int cnt, ans = 11;
map<string, int> ma, mb;
int main()
{
    cin >> s >> t;
    while (cin >> a[cnt] >> b[cnt]) cnt++;
    queue<string> qa, qb;
    qa.push(s);
    qb.push(t);
    ma[s] = mb[t] = 0;
    while (qa.size() && qb.size()) {
        if (qa.size() < qb.size()) {
            string tmp = qa.front();
            qa.pop();
            int len = tmp.length();
            bool f = 0;
            for (int i = 0; i < len; i++) {
                for (int j = 0; j < cnt; j++) {
                    int l = a[j].length();
                    if (tmp.substr(i, l) != a[j]) continue;
                    string str = tmp.substr(0, i) + b[j] + tmp.substr(i + l);
                    if (mb.find(str) != mb.end()) {
                        ans = min(ans, ma[tmp] + 1 + mb[str]);
                        f = 1;
                        break;
                    }
                    if (ma.find(str) != ma.end()) continue;
                    ma[str] = ma[tmp] + 1;
                    qa.push(str);
                }
                if (f) break;
            }
        }
        else {
            string tmp = qb.front();
            qb.pop();
            int len = tmp.length();
            bool f = 0;
            for (int i = 0; i < len; i++) {
                for (int j = 0; j < cnt; j++) {
                    int l = b[j].length();
                    if (tmp.substr(i, l) != b[j]) continue;
                    string str = tmp.substr(0, i) + a[j] + tmp.substr(i + l);
                    if (ma.find(str) != ma.end()) {
                        ans = min(ans, mb[tmp] + 1 + ma[str]);
                        f = 1;
                        break;
                    }
                    if (mb.find(str) != mb.end()) continue;
                    mb[str] = mb[tmp] + 1;
                    qb.push(str);
                }
                if (f) break;
            }
        }
        if (ans <= 10) break;
    }
    if (ans == 11) cout << "NO ANSWER!";
    else cout << ans;
}
```

## 14 单调栈

```cpp
//单调栈：输出左边第一个比它小的数，如果没有输出-1
int s[N];
int top;
int main() {
    int n, i, j, a;
    cin >> n;
    for (i = 1; i <= n; i++) {
        cin >> a;
        while (top > 0 && s[top] >= a)
            top--;
        if (top == 0)    cout << "-1 ";
        else    cout << s[top] << " ";
        s[++top] = a;
    }
    return 0;
}
```

## 15 全排列函数 permutation

```cpp
int n;
cin >> n;
vector<int> a(n);
// iota(a.begin(), a.end(), 1);
for (auto &it : a) cin >> it;
sort(a.begin(), a.end());

do {
    for (auto it : a) cout << it << " ";
    cout << endl;
} while (next_permutation(a.begin(), a.end()));
```

## 16 判断非递减 is_sorted

```cpp
//a 数组 [start,end) 区间是否是非递减的，返回 bool 型
cout << is_sorted(a + start, a + end);
```

## 17 cout 输出流控制

```cpp
stew(x) 补全 x 位输出，默认用空格补全
setfill(char) 设定补全类型
cout << setw(12) << setfill('*') << 12 << endl;
```

## 18 日期换算（基姆拉尔森公式）

```c++
已知年月日，求星期数。
int week(int y,int m,int d){
    if(m<=2)m+=12,y--;
    return (d+2*m+3*(m+1)/5+y+y/4-y/100+y/400)%7+1;
}
```

## 19 __int128_t

若计算过程出现了超过 long long 的情况，可以使用 `__int128_t`, 但要注意输入输出要自己写，或输入 longlong 然后赋值给__int128_t

`注意`: 只能在非 windows 环境使用

```cpp
using i128 = __int128_t;
i128 read() {
    i128 ans = 0, f = 1; char c = getchar();
    while (!isdigit(c)) { if (c == '-')f = -1; c = getchar(); }
    while (isdigit(c)) { ans = ans * 10 + c - '0'; c = getchar(); }
    return ans * f;
}
void write(i128 x) {
    if (x < 0) x = -x, putchar('-');
    if (x > 9) write(x / 10);
    putchar(x % 10 + '0');
}
```

## 20 利用 auto + lambda + 引用捕获在内部编写递归函数

```cpp
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
dfs(dfs, 1, 0);
```

## 21 火车头卡常

```cpp
#pragma GCC optimize("O2")
#pragma GCC optimize("O3")
#pragma GCC optimize("O5")
#pragma GCC optimize("Ofast")
#pragma GCC optimize("inline")
#pragma GCC optimize("-fgcse")
#pragma GCC optimize("-fgcse-lm")
#pragma GCC optimize("-fipa-sra")
#pragma GCC optimize("-ftree-pre")
#pragma GCC optimize("-ftree-vrp")
#pragma GCC optimize("-fpeephole2")
#pragma GCC optimize("-ffast-math")
#pragma GCC optimize("-fsched-spec")
#pragma GCC optimize("unroll-loops")

#include <iostream>
#include <algorithm>
#include <cmath>
#include <cstdio>
using namespace std;

namespace fastIO {
#define BUF_SIZE 100000
#define OUT_SIZE 100000
#define ll long long
    //fread->read
    //快速读入
    bool IOerror = 0;
    inline char nc() {
        static char buf[BUF_SIZE], * p1 = buf + BUF_SIZE, * pend = buf + BUF_SIZE;
        if (p1 == pend) {
            p1 = buf; pend = buf + fread(buf, 1, BUF_SIZE, stdin);
            if (pend == p1) { IOerror = 1; return -1; }
            //{printf("IO error!\n");system("pause");for (;;);exit(0);}
        }
        return *p1++;
    }
    inline bool blank(char ch) { return ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t'; }
    inline void read(int& x) {
        bool sign = 0; char ch = nc(); x = 0;
        for (; blank(ch); ch = nc());
        if (IOerror)return;
        if (ch == '-')sign = 1, ch = nc();
        for (; ch >= '0' && ch <= '9'; ch = nc())x = x * 10 + ch - '0';
        if (sign)x = -x;
    }
    inline void read(ll& x) {
        bool sign = 0; char ch = nc(); x = 0;
        for (; blank(ch); ch = nc());
        if (IOerror)return;
        if (ch == '-')sign = 1, ch = nc();
        for (; ch >= '0' && ch <= '9'; ch = nc())x = x * 10 + ch - '0';
        if (sign)x = -x;
    }
    inline void read(double& x) {
        bool sign = 0; char ch = nc(); x = 0;
        for (; blank(ch); ch = nc());
        if (IOerror)return;
        if (ch == '-')sign = 1, ch = nc();
        for (; ch >= '0' && ch <= '9'; ch = nc())x = x * 10 + ch - '0';
        if (ch == '.') {
            double tmp = 1; ch = nc();
            for (; ch >= '0' && ch <= '9'; ch = nc())tmp /= 10.0, x += tmp * (ch - '0');
        }
        if (sign)x = -x;
    }
    inline void read(char* s) {
        char ch = nc();
        for (; blank(ch); ch = nc());
        if (IOerror)return;
        for (; !blank(ch) && !IOerror; ch = nc())*s++ = ch;
        *s = 0;
    }
    inline void read(char& c) {
        for (c = nc(); blank(c); c = nc());
        if (IOerror) { c = -1; return; }
    }
    //fwrite->write
    //快速写入
    struct Ostream_fwrite {
        char* buf, * p1, * pend;
        Ostream_fwrite() { buf = new char[BUF_SIZE]; p1 = buf; pend = buf + BUF_SIZE; }
        void out(char ch) {
            if (p1 == pend) {
                fwrite(buf, 1, BUF_SIZE, stdout); p1 = buf;
            }
            *p1++ = ch;
        }
        void print(int x) {
            static char s[15], * s1; s1 = s;
            if (!x)*s1++ = '0'; if (x < 0)out('-'), x = -x;
            while (x)*s1++ = x % 10 + '0', x /= 10;
            while (s1-- != s)out(*s1);
        }
        void println(int x) {
            static char s[15], * s1; s1 = s;
            if (!x)*s1++ = '0'; if (x < 0)out('-'), x = -x;
            while (x)*s1++ = x % 10 + '0', x /= 10;
            while (s1-- != s)out(*s1); out('\n');
        }
        void print(ll x) {
            static char s[25], * s1; s1 = s;
            if (!x)*s1++ = '0'; if (x < 0)out('-'), x = -x;
            while (x)*s1++ = x % 10 + '0', x /= 10;
            while (s1-- != s)out(*s1);
        }
        void println(ll x) {
            static char s[25], * s1; s1 = s;
            if (!x)*s1++ = '0'; if (x < 0)out('-'), x = -x;
            while (x)*s1++ = x % 10 + '0', x /= 10;
            while (s1-- != s)out(*s1); out('\n');
        }
        void print(double x, int y) {
            static ll mul[] = {1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000,
                1000000000, 10000000000LL, 100000000000LL, 1000000000000LL, 10000000000000LL,
                100000000000000LL, 1000000000000000LL, 10000000000000000LL, 100000000000000000LL};
            if (x < -1e-12)out('-'), x = -x; x *= mul[y];
            ll x1 = (ll)floor(x); if (x - floor(x) >= 0.5)++x1;
            ll x2 = x1 / mul[y], x3 = x1 - x2 * mul[y]; print(x2);
            if (y > 0) { out('.'); for (size_t i = 1; i < y && x3 * mul[i] < mul[y]; out('0'), ++i); print(x3); }
        }
        void println(double x, int y) { print(x, y); out('\n'); }
        void print(char* s) { while (*s)out(*s++); }
        void println(char* s) { while (*s)out(*s++); out('\n'); }
        void flush() { if (p1 != buf) { fwrite(buf, 1, p1 - buf, stdout); p1 = buf; } }
        ~Ostream_fwrite() { flush(); }
    }Ostream;
    inline void print(int x) { Ostream.print(x); }
    inline void println(int x) { Ostream.println(x); }
    inline void print(char x) { Ostream.out(x); }
    inline void println(char x) { Ostream.out(x); Ostream.out('\n'); }
    inline void print(ll x) { Ostream.print(x); }
    inline void println(ll x) { Ostream.println(x); }
    inline void print(double x, int y) { Ostream.print(x, y); }	//y为小数点后几位
    inline void println(double x, int y) { Ostream.println(x, y); }
    inline void print(char* s) { Ostream.print(s); }
    inline void println(char* s) { Ostream.println(s); }
    inline void println() { Ostream.out('\n'); }
    inline void flush() { Ostream.flush(); }			//清空
#undef ll
#undef OUT_SIZE
#undef BUF_SIZE
};
using namespace fastIO;
// read(n); // 来读取n
// println(a[i]); // 输出a[i]并换行
// 再加上inline优化
```

