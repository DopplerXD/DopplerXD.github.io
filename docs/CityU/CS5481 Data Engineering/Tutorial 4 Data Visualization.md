# Tutorial 4：数据可视化

本教程使用 Matplotlib 和 Seaborn 绘制常见统计图表，并按数据关系选择合适的表达方式。

## 准备环境

需要 Python、NumPy、Pandas、Matplotlib 和 Seaborn：

```bash
pip install matplotlib seaborn pandas numpy
```

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

plt.style.use("seaborn-v0_8-whitegrid")
plt.rcParams.update({
    "figure.figsize": (12, 7),
    "axes.titlesize": 16,
    "axes.labelsize": 13,
    "legend.fontsize": 11,
    "xtick.labelsize": 11,
    "ytick.labelsize": 11,
})
```

!!! note "数据集"
    下方示例使用课程 notebook 中的公开数据集：`midwest_filter.csv`、`mtcars.csv` 与 `economics.csv`。首次运行需要网络连接。

## 1. 相关性（correlation）

### 1.1 分组散点图

散点图适合观察两个连续变量之间的关系。颜色可编码类别，但类别数过多会削弱可读性。

```python
midwest = pd.read_csv(
    "https://raw.githubusercontent.com/selva86/datasets/master/midwest_filter.csv"
)

fig, ax = plt.subplots(figsize=(12, 7))
for category, group in midwest.groupby("category"):
    ax.scatter(group["area"], group["poptotal"], s=24, alpha=0.75, label=category)

ax.set(xlim=(0, 0.1), ylim=(0, 90000), xlabel="Area", ylabel="Population")
ax.set_title("Midwest Area vs Population")
ax.legend(title="Category")
plt.show()
```

### 1.2 相关系数热力图

相关图（correlogram）把多个数值变量的相关系数放入矩阵。接近 1 表示强正相关，接近 -1 表示强负相关，接近 0 表示线性相关较弱。

```python
mtcars = pd.read_csv("https://github.com/selva86/datasets/raw/master/mtcars.csv")
numeric = mtcars.select_dtypes(include="number")

plt.figure(figsize=(10, 8))
sns.heatmap(numeric.corr(), cmap="RdYlGn", center=0, annot=True, fmt=".2f")
plt.title("Correlogram of mtcars")
plt.show()
```

!!! warning "相关不等于因果"
    热力图只能描述变量共同变化的程度，不能证明一个变量导致另一个变量变化。

## 2. 偏差（deviation）

### 2.1 发散条形图

将指标标准化为 z-score 后，以 0 为基准画出正负偏差，便于识别高于或低于平均值的对象。

```python
df = mtcars.copy()
df["mpg_z"] = (df["mpg"] - df["mpg"].mean()) / df["mpg"].std()
df = df.sort_values("mpg_z").reset_index(drop=True)
colors = np.where(df["mpg_z"] < 0, "#d95f02", "#1b9e77")

fig, ax = plt.subplots(figsize=(10, 9))
ax.hlines(y=df.index, xmin=0, xmax=df["mpg_z"], colors=colors, alpha=0.55, linewidth=5)
ax.plot(df["mpg_z"], df.index, "o", color="#333333")
ax.axvline(0, color="#666666", linewidth=1)
ax.set(yticks=df.index, yticklabels=df["cars"], xlabel="Mileage z-score")
ax.set_title("Deviation of Car Mileage from the Mean")
plt.show()
```

### 2.2 面积图

面积图可强调正负变化的持续时间。与折线图相比，它更适合表达累计效应或波动范围。

```python
economics = pd.read_csv(
    "https://github.com/selva86/datasets/raw/master/economics.csv",
    parse_dates=["date"],
).head(100)
returns = economics["psavert"].pct_change().fillna(0).mul(100)

fig, ax = plt.subplots(figsize=(12, 6))
ax.fill_between(economics["date"], returns, 0, where=returns >= 0, color="#1b9e77", alpha=0.7)
ax.fill_between(economics["date"], returns, 0, where=returns < 0, color="#d95f02", alpha=0.7)
ax.axhline(0, color="#666666", linewidth=1)
ax.set(title="Change in Personal Saving Rate", xlabel="Date", ylabel="Change (%)")
plt.show()
```

## 3. 排名（ranking）

### 3.1 棒棒糖图

棒棒糖图（lollipop chart）用细线和圆点表达数值，适合类别较多、希望突出排序的情形。

```python
ranked = mtcars.sort_values("mpg").reset_index(drop=True)

fig, ax = plt.subplots(figsize=(10, 9))
ax.hlines(y=ranked.index, xmin=0, xmax=ranked["mpg"], color="#a6cee3", linewidth=2)
ax.plot(ranked["mpg"], ranked.index, "o", color="#1f78b4")
ax.set(yticks=ranked.index, yticklabels=ranked["cars"], xlabel="Miles per Gallon")
ax.set_title("Car Mileage Ranking")
plt.show()
```

### 3.2 点图

当零基线不是解释重点时，点图以位置编码数值，比填充柱体更轻量。若需要表达绝对数量，仍应优先使用从 0 开始的条形图。

```python
fig, ax = plt.subplots(figsize=(10, 9))
ax.scatter(ranked["mpg"], ranked["cars"], color="#1f78b4", s=55)
ax.set(xlabel="Miles per Gallon", ylabel="Car Model", title="Dot Plot of Car Mileage")
ax.grid(axis="y", visible=False)
plt.show()
```

## 4. 分布（distribution）

### 4.1 直方图与密度图

直方图通过分箱显示频数；核密度估计（kernel density estimate，KDE）以平滑曲线近似分布。二者结合可以同时看到原始分箱和总体形状。

```python
plt.figure(figsize=(10, 6))
sns.histplot(mtcars["mpg"], bins=10, stat="density", color="#80b1d3", alpha=0.55)
sns.kdeplot(mtcars["mpg"], color="#08519c", linewidth=2)
plt.title("Distribution of Car Mileage")
plt.xlabel("Miles per Gallon")
plt.show()
```

### 4.2 箱线图

箱线图以中位数和四分位距（interquartile range，IQR）概括分布，并标出潜在异常值，适合比较多个组别。

```python
plt.figure(figsize=(9, 6))
sns.boxplot(data=mtcars, x="cyl", y="mpg", hue="cyl", palette="Set2", legend=False)
plt.title("Mileage Distribution by Cylinder Count")
plt.xlabel("Cylinders")
plt.ylabel("Miles per Gallon")
plt.show()
```

## 5. 构成（composition）

### 5.1 饼图

饼图只适合少量互斥类别且总和具有“整体”语义的数据。标签太多时应改用条形图。

```python
counts = mtcars["cyl"].value_counts().sort_index()

plt.figure(figsize=(7, 7))
plt.pie(counts, labels=counts.index, autopct="%.1f%%", startangle=90)
plt.title("Share of Cars by Cylinder Count")
plt.show()
```

### 5.2 条形图

条形图更适合精确比较类别数量，并可轻松扩展为多组比较。

```python
plt.figure(figsize=(8, 5))
sns.countplot(data=mtcars, x="cyl", hue="cyl", palette="Set2", legend=False)
plt.title("Number of Cars by Cylinder Count")
plt.xlabel("Cylinders")
plt.ylabel("Count")
plt.show()
```

# 6. Practice

## 6.1 Jittering with stripplot

用 strip plot 比较不同气缸数的 `mpg`。为什么需要 jitter？

??? question "Solution"
    多个观测值具有相同或接近的 x 坐标时会重叠。jitter 在水平方向加入很小的随机偏移，使点的密度和重复值可见，同时不改变 y 轴上的实际数值。

    ```python
    plt.figure(figsize=(9, 6))
    sns.stripplot(
        data=mtcars,
        x="cyl",
        y="mpg",
        hue="cyl",
        palette="Set2",
        jitter=0.18,
        size=7,
        alpha=0.8,
        legend=False,
    )
    plt.title("Car Mileage by Cylinder Count")
    plt.xlabel("Cylinders")
    plt.ylabel("Miles per Gallon")
    plt.show()
    ```

## 6.2 Dot + Box Plot

在箱线图上叠加数据点，同时展示摘要统计量和每条观测记录。

??? question "Solution"
    箱线图显示中位数、四分位距和潜在异常值；半透明散点保留样本量、聚集形态和多峰等细节。两者结合比单独的箱线图信息更完整。

    ```python
    plt.figure(figsize=(9, 6))
    sns.boxplot(
        data=mtcars,
        x="cyl",
        y="mpg",
        hue="cyl",
        palette="Set2",
        legend=False,
        width=0.55,
        fliersize=0,
    )
    sns.stripplot(
        data=mtcars,
        x="cyl",
        y="mpg",
        color="#333333",
        jitter=0.14,
        size=5,
        alpha=0.7,
    )
    plt.title("Mileage: Box Plot with Individual Observations")
    plt.xlabel("Cylinders")
    plt.ylabel("Miles per Gallon")
    plt.show()
    ```
