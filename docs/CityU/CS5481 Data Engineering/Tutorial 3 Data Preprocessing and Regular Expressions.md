# Tutorial 3：数据预处理与正则表达式

本教程使用 Pandas 对电影元数据执行基础清洗、合并与变换，并用 Python 正则表达式抽取和处理文本。

## 准备环境

需要 Python、Jupyter Notebook、Pandas，以及课程文件 `movie_metadata.csv`。将 CSV 与 notebook 放在同一目录后安装依赖：

```bash
pip install pandas jupyter
```

课程数据文件预期有 5043 行、28 列；若载入路径或文件不正确，先检查当前工作目录和文件名。

```python
from pathlib import Path
import pandas as pd

csv_path = Path("movie_metadata.csv")
assert csv_path.is_file(), "请将 movie_metadata.csv 放在 notebook 同一目录"

data = pd.read_csv(csv_path, encoding="utf-8")
print(data.shape)
```

## 1. Pandas 基本操作

Pandas 的 `DataFrame` 是带行列标签的二维表结构。

```python
data.head()
data.tail()
data["duration"].describe()

# 选择单列、多列和满足条件的记录
colors = data["color"]
subset = data[["color", "director_name"]]
long_movies = data[data["duration"] > 150]
```

## 2. 数据清洗

### 缺失值

`isna()` 标记缺失值；搭配 `sum()` 可以查看每列缺失数量。填补值应符合字段语义，下面仅演示分类字段标记和数值字段用中位数填补。

```python
data.isna().sum().sort_values(ascending=False).head(10)

cleaned = data.copy()
cleaned["country"] = cleaned["country"].fillna("Unknown")
cleaned["duration"] = cleaned["duration"].fillna(cleaned["duration"].median())
```

`dropna()` 默认会删除含缺失值的行；`how="all"` 只删除整行全空的记录，`thresh=25` 保留至少有 25 个非空字段的行。`axis=1` 表示对列操作。删除前应先评估数据损失：

```python
without_empty_rows = data.dropna(how="all")
enough_fields = data.dropna(thresh=25)
without_empty_columns = data.dropna(axis=1, how="all")
```

### 合理性与重复记录

用业务范围筛查可疑值。下面检查上映年份和评分是否超出示例数据的预期范围；异常记录需核对来源后再决定修正或删除。

```python
unusual_years = data[data["title_year"] > 2015]
unusual_scores = data[data["imdb_score"] > 10]

duplicate_flags = data.duplicated()
duplicate_rows = data[data.duplicated(keep=False)]
```

`duplicated()` 默认保留每组重复中的第一条作为非重复记录。用 `keep="last"` 保留最后一条，`keep=False` 则标记组内所有重复行；`subset=[...]` 可只根据指定字段判断。

```python
deduplicated = data.drop_duplicates(subset=["movie_title", "title_year"], keep="first")
```

### 字段类型、列名与保存

读取时可以指定字段类型，随后重命名字段。保存清洗结果时建议写入新文件，并用 `index=False` 避免把 DataFrame 行索引额外存成一列。

```python
typed = pd.read_csv(
    csv_path,
    encoding="utf-8",
    dtype={"title_year": "string"},
)
renamed = typed.rename(columns={
    "title_year": "release_year",
    "movie_facebook_likes": "facebook_likes",
})
renamed.to_csv("cleanfile.csv", encoding="utf-8", index=False)
```

若数值列含空值，不要直接指定 Python 的原生 `int` 类型；可先处理缺失值，或使用 Pandas 可空整数类型 `Int64`。

## 3. 数据集成

`merge()` 按键连接两个表。内连接（inner join）只保留两侧均存在的键；外连接（outer join）保留两侧全部键，没有匹配记录的位置会出现缺失值。合并前应检查键是否唯一，避免意外的一对多或多对多扩行。

```python
left = pd.DataFrame({"key": ["b", "b", "a", "c"], "data1": range(4)})
right = pd.DataFrame({"key": ["a", "b", "d"], "data2": range(3)})

inner = pd.merge(left, right, on="key", how="inner")
outer = pd.merge(left, right, on="key", how="outer")
```

若左右两表连接列名称不同，使用 `left_on` 和 `right_on` 指定；连接类型由 `how` 设置为 `inner`、`left`、`right` 或 `outer`。

## 4. 数据变换

### 文本与单位

字符串方法通过 `.str` 访问器逐项处理文本；例如大小写统一、首尾空格清理。单位变换则按换算关系创建新值。

```python
director_upper = data["director_name"].str.upper()
director_lower = data["director_name"].str.lower()
movie_titles = data["movie_title"].str.strip()
duration_hours = data["duration"] / 60
```

### 规范化与标准化

最小-最大规范化（min-max normalization）把数据映射到 $[0,1]$；标准化（standardization）把数据转换为均值为 0、标准差为 1 的 Z 分数。

```python
duration = data["duration"]
normalized = (duration - duration.min()) / (duration.max() - duration.min())
standardized = (duration - duration.mean()) / duration.std()
```

如果一列最大值等于最小值，最小-最大公式会除以 0；使用前应检查该列是否有变化。标准化后的负值只表示低于均值，并不代表数据无效。

### 分箱

分位数离散化（quantile discretization）把数值分成样本量大致相等的区间。`qcut()` 返回区间类别，重复边界可能导致分箱数量少于请求值。

```python
duration_bins = pd.qcut(data["duration"], q=5, duplicates="drop")
print(duration_bins.value_counts().sort_index())
```

## 5. 正则表达式

正则表达式（regular expression，regex）用字符模式搜索、校验、提取或替换文本。Python 的 `re` 模块提供常用函数：

| 函数 | 作用 |
| --- | --- |
| `re.findall()` | 返回所有匹配结果 |
| `re.search()` | 返回第一个匹配对象；没有匹配则返回 `None` |
| `re.split()` | 按匹配位置切分文本 |
| `re.sub()` | 用指定内容替换匹配部分 |

常用元字符：`\d` 表示数字，`\w` 表示字母/数字/下划线，`\s` 表示空白；`+` 表示至少一次，`*` 表示零次或多次，`?` 表示可选，`{m,n}` 表示重复次数范围，`[]` 表示字符集合，`^` 和 `$` 可锚定字符串首尾。Python 原始字符串（raw string）如 `r"\d+"` 能让反斜杠按正则语法解释。

```python
import re

text = "The rain in Spain; contact test@outlook.com or 123456@qq.com"

words = re.findall(r"\b\w+\b", text)
first_space = re.search(r"\s", text)
parts = re.split(r"\s+", text, maxsplit=2)
single_spaced = re.sub(r"\s+", " ", text)

email_pattern = re.compile(r"[A-Za-z0-9_-]+@[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+")
emails = email_pattern.findall(text)
```

匹配对象的 `.group()` 返回匹配文本，`.span()` 返回匹配位置。调用前应确认搜索成功：

```python
match = re.search(r"\bS\w+", "The rain in Spain")
if match:
    print(match.group(), match.span())
```

## 6. Practice

### 6.1 对二维数据做规范化与标准化

求给定二维数据按列进行的最小-最大规范化和 Z 分数标准化。

??? question "Solution"
    ```python
    values = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
    ]
    frame = pd.DataFrame(values)

    normalized = (frame - frame.min()) / (frame.max() - frame.min())
    standardized = (frame - frame.mean()) / frame.std()
    ```

### 6.2 抽取多种分隔符的日期

从文本中提取 `YYYY/MM/DD`、`YYYY.MM.DD` 或 `YYYY-MM-DD` 格式的日期，并要求同一个日期使用相同分隔符。

??? question "Solution"
    ```python
    text = (
        "Today is 2022/09/13, today in the last year is 2021.09.13, "
        "today in the next year is 2023-09-13"
    )
    date_pattern = re.compile(r"\b\d{4}(?P<sep>[./-])\d{2}(?P=sep)\d{2}\b")
    dates = [match.group() for match in date_pattern.finditer(text)]
    print(dates)
    ```

    `(?P<sep>[./-])` 捕获首次出现的分隔符，`(?P=sep)` 要求后续分隔符与之相同。此模式只检查文本格式；若还需验证真实日期（例如排除 2022/19/45），应进一步使用日期解析函数。
