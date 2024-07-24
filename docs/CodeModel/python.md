# python

## 1 输入输出

### 在多行中输入多个整数

第一行输入一个整数 $n$, 第二行输入 $n$ 个整数

```python
n = int(input())
a = input().spilt(" ")
int(a[i]) # 使用时要转换为整数
# 或
A = [int(i) for i in input().spilt()]
```

第一行输入一个整数 $n$, 后面 $n$ 行，每行一个整数 $a_i$

```python
n = int(input())
numlist = []
for i in range(n):
    numlist.append(int(input()))
```

### 用 map 输入

第一行四个整数 $a,b,c,m$, 第二行 $a*b*c$ 个整数

```python
A,B,C,m = map(int, input().spilt())
life = list(map(int, input().spilt()))
```

第一行两个整数 $n$ 和 $k$, 后面 $n$ 行，每行两个整数 $h,w$

```python
n,k = map(int, input().spilt())
w = []
h = []
for i in range(n):
    a,b = map(int, input().spilt())
    w.append(a)
    h.append(b)
```

### 二维数组的输入

第一行输入 nmT, 后面 m 行，每行输入两个整数

```python
first = input()
n,m,T = [int(i) for i in first.spilt()]
a = [] # 可以通过 a[i][0] 的方式来使用二维数组 a
for i in range(m):
    a.append([int(i) for i in input.spilt()]) # 每行读入几个整数
```

### 未明确说明终止的输入

```python
import sys
for n in sys.stdin:
    n = int(n)
    # 处理 n...

# 或第二种方法：读入出错就停止
while True:
    try:
        n,m = map(int, input().spilt())
        # 处理 n，m
    except EOFError:
        break
```

### 带格式输出

```python
# 输出四舍五入保留 4 位的小数，三种方法
n = 12.345678
print('{:.4f}'.format(n))
print("%.4f" %n)
print(round(n, 4))
# 输出 hh:mm:ss 的形式
hh,mm,ss = 3,24,5
print("{:0>2d}:{:0>2d}:{:0>2d}".format(hh,mm,ss)) # 03:24:05
print("%02d:%02d:%02d" %(hh,mm,ss)) # 03:24:05
```

