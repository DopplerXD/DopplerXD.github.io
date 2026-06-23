ACM 模式一般只需要从标准输入读取数据，计算后输出到标准输出。提交时不要读写本地文件，不要打印提示语。

## 常见输入格式

假设题目输入如下：

```text
5
1 2 3 4 5
```

表示先输入整数 `n`，再输入 `n` 个整数。

=== "C++"

    ```cpp
    #include <bits/stdc++.h>
    using namespace std;

    int main() {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);

        int n;
        cin >> n;

        vector<int> a(n);
        for (int i = 0; i < n; i++) {
            cin >> a[i];
        }

        for (int i = 0; i < n; i++) {
            if (i) cout << ' ';
            cout << a[i];
        }
        cout << '\n';

        return 0;
    }
    ```

=== "Java"

    ```java
    import java.io.*;
    import java.util.*;

    public class Main {
        static class FastScanner {
            private final InputStream in = System.in;
            private final byte[] buffer = new byte[1 << 16];
            private int ptr = 0, len = 0;

            private int read() throws IOException {
                if (ptr >= len) {
                    len = in.read(buffer);
                    ptr = 0;
                    if (len <= 0) return -1;
                }
                return buffer[ptr++];
            }

            int nextInt() throws IOException {
                int c;
                do {
                    c = read();
                } while (c <= ' ' && c != -1);

                int sign = 1;
                if (c == '-') {
                    sign = -1;
                    c = read();
                }

                int val = 0;
                while (c > ' ') {
                    val = val * 10 + c - '0';
                    c = read();
                }
                return val * sign;
            }

            String next() throws IOException {
                int c;
                do {
                    c = read();
                } while (c <= ' ' && c != -1);

                StringBuilder sb = new StringBuilder();
                while (c > ' ') {
                    sb.append((char) c);
                    c = read();
                }
                return sb.toString();
            }
        }

        public static void main(String[] args) throws Exception {
            FastScanner fs = new FastScanner();
            StringBuilder out = new StringBuilder();

            int n = fs.nextInt();
            int[] a = new int[n];
            for (int i = 0; i < n; i++) {
                a[i] = fs.nextInt();
            }

            for (int i = 0; i < n; i++) {
                if (i > 0) out.append(' ');
                out.append(a[i]);
            }
            out.append('\n');

            System.out.print(out);
        }
    }
    ```

=== "Python"

    ```python
    import sys

    data = list(map(int, sys.stdin.buffer.read().split()))
    idx = 0

    n = data[idx]
    idx += 1

    a = data[idx:idx + n]
    idx += n

    print(*a)
    ```

## 多组测试

输入第一行给出测试组数 `T`：

```text
2
3
1 2 3
4
1 2 3 4
```

=== "C++"

    ```cpp
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;

        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];

        cout << accumulate(a.begin(), a.end(), 0LL) << '\n';
    }
    ```

=== "Java"

    ```java
    int T = fs.nextInt();
    while (T-- > 0) {
        int n = fs.nextInt();

        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += fs.nextInt();
        }

        out.append(sum).append('\n');
    }
    ```

=== "Python"

    ```python
    import sys

    data = list(map(int, sys.stdin.buffer.read().split()))
    idx = 0

    t = data[idx]
    idx += 1

    ans = []
    for _ in range(t):
        n = data[idx]
        idx += 1

        a = data[idx:idx + n]
        idx += n

        ans.append(str(sum(a)))

    sys.stdout.write("\n".join(ans))
    ```

## 读到 EOF

题目没有给数据组数时，经常需要一直读到输入结束。

=== "C++"

    ```cpp
    int a, b;
    while (cin >> a >> b) {
        cout << a + b << '\n';
    }
    ```

=== "Java"

    `FastScanner` 可以补一个 `hasNext()`，也可以用 `BufferedReader` 按行读取：

    ```java
    import java.io.*;
    import java.util.*;

    public class Main {
        public static void main(String[] args) throws Exception {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            StringBuilder out = new StringBuilder();
            String line;

            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;

                StringTokenizer st = new StringTokenizer(line);
                int a = Integer.parseInt(st.nextToken());
                int b = Integer.parseInt(st.nextToken());
                out.append(a + b).append('\n');
            }

            System.out.print(out);
        }
    }
    ```

=== "Python"

    ```python
    import sys

    ans = []
    for line in sys.stdin.buffer:
        if not line.strip():
            continue
        a, b = map(int, line.split())
        ans.append(str(a + b))

    sys.stdout.write("\n".join(ans))
    ```

## 读取整行字符串

如果字符串包含空格，不能用按空白分割的 `cin >> s`、`next()` 或 `split()` 直接读完整内容。

=== "C++"

    ```cpp
    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<string> lines(n);
    for (int i = 0; i < n; i++) {
        getline(cin, lines[i]);
    }
    ```

=== "Java"

    ```java
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

    int n = Integer.parseInt(br.readLine().trim());
    String[] lines = new String[n];
    for (int i = 0; i < n; i++) {
        lines[i] = br.readLine();
    }
    ```

=== "Python"

    ```python
    import sys

    n = int(sys.stdin.readline())
    lines = [sys.stdin.readline().rstrip("\n") for _ in range(n)]
    ```

## 二维数组 / 矩阵

输入 `n m` 后读取 `n` 行、每行 `m` 个整数。

=== "C++"

    ```cpp
    int n, m;
    cin >> n >> m;

    vector<vector<int>> grid(n, vector<int>(m));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> grid[i][j];
        }
    }
    ```

=== "Java"

    ```java
    int n = fs.nextInt();
    int m = fs.nextInt();

    int[][] grid = new int[n][m];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            grid[i][j] = fs.nextInt();
        }
    }
    ```

=== "Python"

    ```python
    import sys

    data = list(map(int, sys.stdin.buffer.read().split()))
    idx = 0

    n, m = data[idx], data[idx + 1]
    idx += 2

    grid = []
    for _ in range(n):
        grid.append(data[idx:idx + m])
        idx += m
    ```

## 输出注意点

- 一般使用 `\n` 换行，不要在大量输出里频繁刷新。
- 多个答案建议先拼到缓冲区，再一次性输出。
- 不要输出题目没有要求的提示文字，例如 `请输入 n:`。
- C++ 打开 `ios::sync_with_stdio(false); cin.tie(nullptr);` 后，不要混用 `scanf/printf`。
- Java 算法题优先用 `BufferedReader + StringTokenizer` 或自写快读，数据量很小时才用 `Scanner`。
- Python 数据量大时优先用 `sys.stdin.buffer.read()`，大量输出用 `sys.stdout.write()`。
