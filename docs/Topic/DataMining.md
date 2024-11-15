## 一、绪论

### 什么是数据挖掘

数据挖掘 -- 从数据中发现知识（KDD，Knowledge Discovery from Data）

+ 从海量的数据中提取有趣的模式或知识

![image-20241113214047816](DataMining.assets/image-20241113214047816.png)

### 可以挖掘什么类型的数据

+ 结构化数据
    + 由二维表结构来逻辑表达或实现的数据
    + 能存进关系型数据库：csv、excel等
+ 半结构化数据
    + 维度高于二维，但可根据相关标记对其进行分割理解的数据
    + JSON 串、HTML 文档、NoSQL 数据等
+ 非结构化数据
    + 没有固定结构和规则，在机器中存为二进制
    + 图像、视频、语音、文本等

![image-20241113214644910](DataMining.assets/image-20241113214644910.png)

#### 5V 特征

+ 数量 Volume
+ 速度 Velocity
+ 真实 Veracity
+ 多样 Variety
+ 价值 Value

### 可以挖掘什么类型的模式

+ 描述性数据挖掘：表征感兴趣的数据集的属性
+ 预测性数据挖掘：对数据集执行归纳以进行预测

![image-20241113215115687](DataMining.assets/image-20241113215115687.png)

#### 聚类分析

原则：最大化类内相似性、最小化类间相似性

#### 深度学习

Machine Learning 和 Deep Learning 的区别

+ 深度学习能够从原始数据中自动提取出关键特征，而这一过程无需人工干预或手动设计特征，
+ 传统机器学习使用一到两个计算层的简单神经网络结构，而深度学习使用三个到几百个。

#### 知识评价（模式评估）

有趣的模式

+ 潜在有用的
+ 易于理解的
+ 新颖的/典型的
+ 高准确率的

### 面临的主要问题

+ 效率和可伸缩性
    + 算法的效率和可扩展性
    + 并行、分布式、流式和增量式挖掘方法
+ 数据类型的多样性
    + 处理复杂类型的数据
    + 挖掘动态、网络和全局数据存储库
+ 数据安全和数据隐私保护

## 二、数据及其预处理

### 数据属性类型

绝对温度属于比率属性，摄氏温度属于区间属性。

![image-20241113220306423](DataMining.assets/image-20241113220306423.png)

![image-20241113220321333](DataMining.assets/image-20241113220321333.png)

### 数据统计的基本描述

#### 中位数

对于分组数据，中位数通过插值法来估计

![image-20241113220540867](DataMining.assets/image-20241113220540867.png)

近似中位数为 $21+\frac{3194/2-950}{1500}*(50-21)=32.94$ 

#### 对称数据与倾斜数据

![image-20241113220806891](DataMining.assets/image-20241113220806891.png)

#### 测量数据的分散度

盒图（箱线图）

+ 五数概括
    + 四分位数 Q1
    + 中位数 Q2
    + 四分位数 Q3
    + 最小值 Min
    + 最大值 Max
+ 异常值：高于/低于 1.5*IQR（Q3-Q1） 的值

#### 卡方检验

![image-20241113221209554](DataMining.assets/image-20241113221209554.png)

![image-20241113221224625](DataMining.assets/image-20241113221224625.png)

![image-20241113221235047](DataMining.assets/image-20241113221235047.png)

![image-20241113221246932](DataMining.assets/image-20241113221246932.png)

![image-20241113221256065](DataMining.assets/image-20241113221256065.png)

### 度量数据的相似性与相异性

![image-20241113221504936](DataMining.assets/image-20241113221504936.png)

![image-20241113221510724](DataMining.assets/image-20241113221510724.png)

![image-20241113221531398](DataMining.assets/image-20241113221531398.png)

#### 闵可夫斯基距离

![image-20241113221636116](DataMining.assets/image-20241113221636116.png)

#### 余弦相似性

余弦度量 $sim(x,y)= \frac{x \cdot y}{|x||y|}$ 

### 数据预处理

步骤：数据清理-数据集成-数据变换-数据降维

数据质量衡量标准：准确性、完整性、一致性、时效性、可信性、可解释性

### 数据清理

不完整的、噪声的、不一致的、故意的

+ 处理缺失数据
    + 忽略元组
    + 人工填写
    + 自动填充（Unknown、平均值或中位数、基于推理得到的值）
+ 平滑噪声数据
    + 分箱（按箱均值/中值/边界平滑）
    + 回归
    + 聚类
    + 半监督
+ 识别或删除异常值并解决数据不一致的问题

![image-20241113222548052](DataMining.assets/image-20241113222548052.png)

### 数据变换

规范化、离散化、数据压缩、采样、由标称数据产生概念分层

![image-20241113222841121](DataMining.assets/image-20241113222841121.png)

#### 规范化

![image-20241113222923135](DataMining.assets/image-20241113222923135.png)

**Z-score 使用均值绝对偏差**
$$
v'= \frac{v- \mu_A}{\frac{\sum_1^n{|v_i- \mu|}}{n}}
$$

**小数定标规范化**

通过移动小数点的位置进行规范化。小数点移动多少位取决于属性 A 的取值中的最大绝对值。

如最大绝对值为999，则小数点移动3位。

#### 离散化

![image-20241113222948394](DataMining.assets/image-20241113222948394.png)

![image-20241113223032067](DataMining.assets/image-20241113223032067.png)

![image-20241113223039965](DataMining.assets/image-20241113223039965.png)

#### 压缩

+ 无损压缩
+ 有损压缩

#### 采样

对于不平衡数据，抽样方法能够通过一些机制改善不均衡数据集，以获得一个均衡的数据分布

混淆矩阵

### 数据降维

+ 特征选择
    + 信息增益=信息熵-条件熵
+ 特征提取
+ 主成分分析

## 三、数据仓库与联机分析处理

### 数据仓库

![image-20241113225107683](DataMining.assets/image-20241113225107683.png)

特征

+ 面向主题的
+ 集成的
+ 时变的
+ 非易失的

![image-20241113225236845](DataMining.assets/image-20241113225236845.png)

![image-20241113225323880](DataMining.assets/image-20241113225323880.png)

![image-20241113225305930](DataMining.assets/image-20241113225305930.png)

![image-20241113225336763](DataMining.assets/image-20241113225336763.png)

![image-20241115180346292](DataMining.assets/image-20241115180346292.png)

![image-20241113225348067](DataMining.assets/image-20241113225348067.png)

数据仓库分层：清晰数据结构、数据血统追踪、减少重复开发

OLTP：联机事务处理

OLAP：联机分析处理

### 数据仓库建模：模式和度量

数据立方体：一种用于数据仓库和 OLAP 及 OLAP 操作（如上卷、下钻、切片和切块）的多维数据模型。

![image-20241113225608901](DataMining.assets/image-20241113225608901.png)

![image-20241113225627908](DataMining.assets/image-20241113225627908.png)

![image-20241113225645486](DataMining.assets/image-20241113225645486.png)

概念分层的作用：多层次分析、数据汇总和钻取、灵活的视角、提高性能、更好的数据理解

### OLAP 操作

![image-20241113225809461](DataMining.assets/image-20241113225809461.png)

![image-20241113225825020](DataMining.assets/image-20241113225825020.png)

#### 例题

旅行代理的航班数据仓库包含6个维: traveler、departure(city)、departure_time、arrival、arrival_time和flight,两个度量: count()和 avg_fare(),其中avg_fare()在最低层存放具体费用，而在其他层存放平均费用。
(a)假设该立方体是完全物化的。从基本方体[traveler、departure、departure_time、arrival、arrival_time]开始，为了列出2009年每个从洛杉矶乘坐美国航空公司(AA) 的商务旅客的月平均费用，应该执行哪些OLAP操作(例如，上卷flight到airline)?
(b)假设想计算数据立方体，其中条件是记录的个数最少为10,并且平均费用超过500美元。勾画一种有效的 立方体计算方法(基于航班数据分布的常识)。

![image-20241115190355877](DataMining.assets/image-20241115190355877.png)

![image-20241115190404087](DataMining.assets/image-20241115190404087.png)

![image-20241115190425922](DataMining.assets/image-20241115190425922.png)

位图索引

![image-20241113225920500](DataMining.assets/image-20241113225920500.png)

![image-20241113225935880](DataMining.assets/image-20241113225935880.png)

![image-20241113225947758](DataMining.assets/image-20241113225947758.png)

连接索引

![image-20241113230007685](DataMining.assets/image-20241113230007685.png)

水平存储

![image-20241113230105032](DataMining.assets/image-20241113230105032.png)

垂直存储

![image-20241113230117944](DataMining.assets/image-20241113230117944.png)

![image-20241113230123232](DataMining.assets/image-20241113230123232.png)

### 数据立方体计算

![image-20241113230201802](DataMining.assets/image-20241113230201802.png)

![image-20241113230212780](DataMining.assets/image-20241113230212780.png)

冰山立方体： having count(*) >= min support

![image-20241113230435295](DataMining.assets/image-20241113230435295.png)

![image-20241113230442337](DataMining.assets/image-20241113230442337.png)

## 四、频繁模式挖掘

### 基本概念

支持度

置信度 $confidence(A=>B)=P(B|A)= \frac{support(A \cup B)}{support A}$ 

**闭频繁项集**

1. 闭频繁项集的所有超集的支持度都小于其自身的支持度。

2. 如果一个项集 X 是频繁的，那么必然存在一个包含 X 的闭频繁项集 Y，并且 $support(X)=support(Y)$ 。

### Apriori 和 FP growth

#### 算法简介

##### **Apriori 算法**
- **提出者**：Rakesh Agrawal 等人于1994年。
- **核心思想**：利用**逐层搜索**（Level-wise Search）的方法，通过**频繁项集的“剪枝”特性**来减少候选项集的数量。
- **工作流程**：
  1. 通过单次扫描数据集生成频繁1-项集。
  2. 基于频繁 \( k \)-项集生成候选 \( (k+1) \)-项集。
  3. 扫描数据库来计算候选项集的支持度，筛选出频繁 \( (k+1) \)-项集。
  4. 重复上述步骤，直到找不到新的频繁项集。
- **剪枝策略**：若某个 \( k \)-项集不是频繁的，那么包含该 \( k \)-项集的所有 \( (k+1) \)-项集都不是频繁的（**Apriori原理**）。

##### **FP-Growth（Frequent Pattern Growth）算法**

![image-20241113224147134](DataMining.assets/image-20241113224147134.png)

- **提出者**：Han, Pei, 和 Yin 于2000年。
- **核心思想**：通过构建**FP-树（Frequent Pattern Tree）**来高效地压缩数据，并避免生成候选项集。
- **工作流程**：
  1. 扫描数据库，计算各项的支持度，删除不满足最小支持度的项。
  2. 对剩余的项按支持度降序排列，构建FP-树。
  3. 从FP-树中挖掘频繁项集（使用递归和“条件模式基”构建）。
- **优点**：通过FP-树的结构压缩数据，只需两次扫描数据库，从而显著减少时间和空间复杂度。

---

#### Apriori与FP-Growth的区别对比

| 特性             | **Apriori算法**                            | **FP-Growth算法**                     |
| ---------------- | ------------------------------------------ | ------------------------------------- |
| **基础原理**     | 逐层搜索（生成候选项集并进行剪枝）         | 构建FP-树（基于频繁模式树的压缩）     |
| **候选项集**     | 显式生成候选项集                           | 无需生成候选项集                      |
| **数据扫描次数** | 多次扫描（每增加一项集长度，增加一次扫描） | 仅需两次扫描                          |
| **内存使用**     | 通常占用较多内存，因为需要存储大量候选项集 | 内存利用率更高，数据压缩效果更好      |
| **效率**         | 随着数据集规模和项集长度增加，效率显著下降 | 通常比Apriori更快，特别是数据集较大时 |
| **适用场景**     | 适合较小的数据集或项集较短的情况           | 适合大规模数据集，尤其是稀疏数据集    |
| **算法复杂度**   | 指数级别，最坏情况为 \( O(2^n) \)          | 通常为线性级别，视数据压缩情况而定    |
| **剪枝策略**     | 基于Apriori原理进行剪枝                    | 通过FP-树结构进行隐式剪枝             |
| **实现难度**     | 相对简单                                   | 相对复杂，需要构建和遍历FP-树         |
| **典型应用**     | 关联规则、市场篮子分析                     | 大型关联分析、文本挖掘                |

---

#### 优缺点分析

##### **Apriori算法**
- **优点**：
    - 简单直观，易于理解和实现。
    - 适合初学者和对小规模数据集进行关联分析。
- **缺点**：
    - 随着项集长度增加，候选项集的数量呈指数增长（**组合爆炸问题**）。
    - 需要多次扫描数据集，效率较低，特别是对于大数据集。

##### **FP-Growth算法**
- **优点**：
    - 通过FP-树压缩数据，只需两次扫描数据库，大幅减少I/O开销。
    - 无需显式生成候选项集，效率更高，尤其是对大型数据集。
- **缺点**：
    - 算法实现相对复杂，需要构建和维护FP-树。
    - 对内存要求较高，特别是当FP-树变得非常大时。

---

#### 应用示例

##### **Apriori算法示例（Python代码）**
```python
from mlxtend.frequent_patterns import apriori, association_rules
import pandas as pd

# 示例交易数据
data = {'Milk': [1, 0, 1, 1, 0],
        'Bread': [1, 1, 0, 1, 0],
        'Butter': [0, 1, 1, 0, 1]}
df = pd.DataFrame(data)

# 计算频繁项集
frequent_itemsets = apriori(df, min_support=0.6, use_colnames=True)
print(frequent_itemsets)

# 生成关联规则
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.7)
print(rules)
```

##### **FP-Growth算法示例（Python代码）**
```python
from mlxtend.frequent_patterns import fpgrowth, association_rules
import pandas as pd

# 示例交易数据
data = {'Milk': [1, 0, 1, 1, 0],
        'Bread': [1, 1, 0, 1, 0],
        'Butter': [0, 1, 1, 0, 1]}
df = pd.DataFrame(data)

# 计算频繁项集
frequent_itemsets = fpgrowth(df, min_support=0.6, use_colnames=True)
print(frequent_itemsets)

# 生成关联规则
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.7)
print(rules)
```

---

#### 总结与选择建议
- **Apriori算法**适合**小型数据集**，且易于理解和实现。但其性能瓶颈在于大量的候选项集生成和多次数据扫描。
- **FP-Growth算法**适合**大规模数据集**，特别是**稀疏数据集**。通过FP-树结构的压缩和减少候选项集的生成，显著提升了效率，但实现较为复杂。
- 在实际应用中，建议根据**数据规模**和**性能需求**选择适合的算法：
  - **小数据集**或**快速原型验证**：使用Apriori。
  - **大数据集**或**生产环境**：推荐使用FP-Growth。

![image-20241113224009406](DataMining.assets/image-20241113224009406.png)

![image-20241113224036205](DataMining.assets/image-20241113224036205.png)

![image-20241113224042980](DataMining.assets/image-20241113224042980.png)

![image-20241113224051052](DataMining.assets/image-20241113224051052.png)

![image-20241113224111245](DataMining.assets/image-20241113224111245.png)

![image-20241113224101057](DataMining.assets/image-20241113224101057.png)



### ECLAT （等价类转换 Equivalence Class Transformation）

使用集合交集的深度优先搜索算法

使用垂直格式存储

![image-20241113223842291](DataMining.assets/image-20241113223842291.png)

### 模式评估度量比较

![image-20241113224616596](DataMining.assets/image-20241113224616596.png)

![image-20241113224623503](DataMining.assets/image-20241113224623503.png)

![image-20241113224634801](DataMining.assets/image-20241113224634801.png)

**(a) 全置信度 (All Confidence)**

$\text{All Confidence} = \frac{n_{11}}{\max(n_{1+}, n_{+1})}$ 

- **解释**：衡量 AAA 和 BBB 同时发生的频率在各自总出现频率中的占比。

**(b) 最大置信度 (Max Confidence)**

$\text{Max Confidence} = \max\left(\frac{n_{11}}{n_{1+}}, \frac{n_{11}}{n_{+1}}\right)$ 

- **解释**：比较 A→BA \rightarrow BA→B 和 B→AB \rightarrow AB→A 的置信度，取较大者。

**(c) Kulczynski**

$\text{Kulczynski} = \frac{1}{2} \left(\frac{n_{11}}{n_{1+}} + \frac{n_{11}}{n_{+1}}\right)$ 

- **解释**：Kulczynski 衡量的是 AAA 和 BBB 之间的平均置信度。

**(d) 余弦相似度 (Cosine Similarity)**

$\text{Cosine Similarity} = \frac{n_{11}}{\sqrt{n_{1+} \times n_{+1}}}$ 

- **解释**：类似于向量的余弦相似度，衡量 AAA 和 BBB 的同时发生频率在各自总频率中的占比。

**(e) 提升度 (Lift)**

$\text{Lift} = \frac{n_{11} \times n}{n_{1+} \times n_{+1}}$ 

- **解释**：衡量 AAA 和 BBB 是否独立。Lift > 1 表示正相关，Lift < 1 表示负相关。

**(f) 相关系数 (Correlation Coefficient, ϕ)**

$\text{Correlation} = \frac{n_{11} n_{00} - n_{10} n_{01}}{\sqrt{n_{1+} n_{0+} n_{+1} n_{+0}}}$ 

- **解释**：类似于皮尔逊相关系数，用于衡量 AAA 和 BBB 之间的线性相关性。

零事务（既不包含A也不包含B的事务）过多，会导致以上两种方法失误。

## 五、分类

分类 - 有监督（训练数据的标签已知）

聚类 - 无监督

### 决策树

![image-20241112000523452](./DataMining.assets/image-20241112000523452.png)

![image-20241112000652444](./DataMining.assets/image-20241112000652444.png)

![image-20241112000828385](./DataMining.assets/image-20241112000828385.png)

### 贝叶斯分类

**为什么朴素贝叶斯分类称为“朴素”的？简述朴素贝叶斯分类的主要思想。**

朴素贝叶斯被称为“朴素”是因为它假设条件独立分布，这个假设用于减少计算代价，因此称为“朴素”，其主要原理是通过后概率的贝叶斯定理使用 $P(X|C_i)P(C_i)$ 得到最大值来对数据进行分类。

![image-20241112001135090](./DataMining.assets/image-20241112001135090.png)

![image-20241112001834060](./DataMining.assets/image-20241112001834060.png)

![image-20241112001814844](./DataMining.assets/image-20241112001814844.png)

### K近邻

K-Nearest Neighbors

![image-20241112115951428](DataMining.assets/image-20241112115951428.png)

![image-20241112120122791](DataMining.assets/image-20241112120122791.png)

### 线性分类器

![image-20241112120228279](DataMining.assets/image-20241112120228279.png)

![image-20241112120239260](DataMining.assets/image-20241112120239260.png)

![image-20241112120508312](DataMining.assets/image-20241112120508312.png)

#### 线性回归

![image-20241112120538842](DataMining.assets/image-20241112120538842.png)

![image-20241112120557564](DataMining.assets/image-20241112120557564.png)

损失函数：均方误差，目的是最小化预测值和真实值之间的平方误差。

#### 逻辑回归

![image-20241112120808956](DataMining.assets/image-20241112120808956.png)

![image-20241112120847260](DataMining.assets/image-20241112120847260.png)

![image-20241112120852439](DataMining.assets/image-20241112120852439.png)

优化：最大似然估计

逻辑回归主要用于解决分类问题，特别是二分类问题。

目标变量是离散的。

模型形式基于线性方程，但输出经过逻辑函数（sigmoid函数）的处理，输出的结果是一个概率值。

损失函数使用对数似然函数，通过最大化似然函数来估计模型参数。

### 模型评估与选择

![image-20241112121238793](DataMining.assets/image-20241112121238793.png)

#### 评估指标

![image-20241112121322584](DataMining.assets/image-20241112121322584.png)

准确率 $Accuracy= \frac{TP+TN}{SUM(all)}$

类别不平衡时，准确率常常不适用。

精确率（查准率） $Precision= \frac{TP}{TP+FP}$ 预测为正例的样本的正确率

召回率（查全率） $Recall= \frac{TP}{TP+FN}$ 实际为正例的样本，被正确预测的占比

**精确率与召回率有相反的关系** **？？？**

![image-20241112121819434](DataMining.assets/image-20241112121819434.png)

F-score

![image-20241112122719585](DataMining.assets/image-20241112122719585.png)

![image-20241112122801683](DataMining.assets/image-20241112122801683.png)

#### 模型评估：保留法

![image-20241112123549987](DataMining.assets/image-20241112123549987.png)

#### 模型评估：交叉验证

![image-20241112123618838](DataMining.assets/image-20241112123618838.png)

#### 模型选择：ROC 曲线

![image-20241112123650306](DataMining.assets/image-20241112123650306.png)

![image-20241112123704981](DataMining.assets/image-20241112123704981.png)

![image-20241112123718385](DataMining.assets/image-20241112123718385.png)

![image-20241112123723273](DataMining.assets/image-20241112123723273.png)

### 提高分类准确性的技术

#### 集成方法

集成学习，构建并结合多个学习器来提升性能。

集成个体应”好而不同“

假设基分类器的错误率相互独立，随着集成分类器数目的增加，集成的错误率将指数级下降，最终趋于0。但实际中往往达不到相互独立。

**集成学习大致可分为三类：Boosting（装袋）、Bagging（提升）、Stacking（堆叠泛化）**

![image-20241112124227290](DataMining.assets/image-20241112124227290.png)

#### 装袋 Bagging

Bootstrap aggregating

用来生产多个分类器并且集成这些分类器形成一个整体的模型

不稳定性是单一预测算法的明显的不足，该算法可以通过所有的分类器投票的方式，提升算法的稳定性

![image-20241112124429415](DataMining.assets/image-20241112124429415.png)

![image-20241112124434807](DataMining.assets/image-20241112124434807.png)

![image-20241112175426415](DataMining.assets/image-20241112175426415.png)

![image-20241112175442787](DataMining.assets/image-20241112175442787.png)

![image-20241112180158806](DataMining.assets/image-20241112180158806.png)

![image-20241112180322566](DataMining.assets/image-20241112180322566.png)

##### 随机森林

是最典型的 Bagging 算法

**主要特点：**

+ 对样本进行有放回的抽样
+ 对特征也进行随机抽样
+ 基本分类器为决策树

![image-20241112181005981](DataMining.assets/image-20241112181005981.png)

![image-20241112181241726](DataMining.assets/image-20241112181241726.png)

![image-20241112181721810](DataMining.assets/image-20241112181721810.png)

![image-20241112181813509](DataMining.assets/image-20241112181813509.png)

![image-20241112181822124](DataMining.assets/image-20241112181822124.png)

![image-20241112181903000](DataMining.assets/image-20241112181903000.png)

![image-20241112181935180](DataMining.assets/image-20241112181935180.png)

![image-20241112181950856](DataMining.assets/image-20241112181950856.png)

![image-20241112181956122](DataMining.assets/image-20241112181956122.png)

![image-20241112182002482](DataMining.assets/image-20241112182002482.png)

![image-20241112182012881](DataMining.assets/image-20241112182012881.png)

![image-20241112182025607](DataMining.assets/image-20241112182025607.png)

![image-20241112182031192](DataMining.assets/image-20241112182031192.png)

![image-20241112182038485](DataMining.assets/image-20241112182038485.png)

#### 提升 Boosting

![image-20241112182110432](DataMining.assets/image-20241112182110432.png)

![image-20241112182124513](DataMining.assets/image-20241112182124513.png)

![image-20241112182136930](DataMining.assets/image-20241112182136930.png)

#### 提升与装袋对比

![image-20241112182315677](DataMining.assets/image-20241112182315677.png)





#### Stacking



#### 类不平衡数据集的分类

现实中面临不平衡的数据集，很少有正示例但是很多负示例。

+ **不平衡数据的典型方法（平衡训练集）**
    + 过采样：对少数类的群体进行过采样
    + 欠采样：从多数类中随机剔除元组
    + 合成：合成新的少数类

+ **不平衡数据的典型处理方法（算法层面）**
    + 阈值移动：移动决策阈值 t，使罕见的类元组更容易分类，从而减少代价高昂的假阴性错误机会
    + 类权重调整：由于假阴性的高于假阳性，因此我们可以给予假阴性更大的权重
        + 集成技术：集成多个分类器



## 五-拓展、支持向量机

#### 基本概念

**支持向量机（Support Vector Machine）**

![image-20241112183115152](DataMining.assets/image-20241112183115152.png)

![image-20241112183818837](DataMining.assets/image-20241112183818837.png)

**决策边界问题 -> 最大间隔问题**

![image-20241112184312065](DataMining.assets/image-20241112184312065.png)

![image-20241112184337314](DataMining.assets/image-20241112184337314.png)

线性 SVM 和一般线性分类器的区别主要是：SVM 确保了间隔最大化

![image-20241112184703961](DataMining.assets/image-20241112184703961.png)

![image-20241112184723228](DataMining.assets/image-20241112184723228.png)

![image-20241112184749894](DataMining.assets/image-20241112184749894.png)

![image-20241112184758514](DataMining.assets/image-20241112184758514.png)

![image-20241112185520855](DataMining.assets/image-20241112185520855.png)

![image-20241112185536484](DataMining.assets/image-20241112185536484.png)

#### 核技巧

求解非线性 SVM：升维转换

增加一个维度后，可以用一个超平面有效区分两种数据

![image-20241112185653594](DataMining.assets/image-20241112185653594.png)

![image-20241112185705695](DataMining.assets/image-20241112185705695.png)

![image-20241112185744029](DataMining.assets/image-20241112185744029.png)

![image-20241112185750559](DataMining.assets/image-20241112185750559.png)

![image-20241112185756576](DataMining.assets/image-20241112185756576.png)



## 六、聚类

### 对比

**概述k-均值和k-中心点相比较的优缺点：**

k-均值算法计算代价更小；k-中心点计算代价大，但是对于数据中的离群点和噪声鲁棒性更强，即更少受到离群点和噪声的影响。

**概述这两种方法与层次聚类方法（如AGNES）相比有何优缺点：**

k-均值和k-中心点都是划分方法的一种，这种方法的好处在于每次迭代重定位的时候可以撤销之前的聚群操作，但是层次聚类方法一旦一个步骤（分裂或合并）完成将不能被撤回，因此层次聚类方法可能会影响聚类的结果的质量。划分方法在球形聚类上表现良好，且其聚类的结果在小型到中中型的数据库上质量较好。划分方法的缺点在于需要指定簇的数量。

层次聚类方法自动决定簇的数量。然而他们每一步做出合并或分裂步骤的时候需要进行大量计算来评估该步骤产生的簇的质量。然而，层次聚类方法能够和其他聚类方法集成一个扩展的聚类方法，提高层次聚类质量，如BIRCH、ROCK和Chameleon。

**按照这三个标准对 k-均值、k-中心点、CLARA、DBSCAN 进行描述（1）可以确定的簇的形状；（2）必须指定的输入参数；（3）局限性**

1. k-均值
   球形；需指定簇的数量；对噪声敏感，只在小数据集上表现良好。
2. k-中心点
   球形；需指定簇的数量；适用于小数据集（没有可扩展性）。
3. CLARA
   球形；需指定簇的数量；对初始样本选取敏感。
4. DBSCAN
   任意形状；最大可能距离即密度可达和簇中点的最少数量；在最差情况下为 $O(n^2)$的复杂度。

### 聚类算法

#### k-means（k-均值）

复杂度 $O(nkt)$ 

![image-20241115162745437](DataMining.assets/image-20241115162745437.png)

评价准则：

1. 误差平方和准则 

$$
E=\sum^k_{i=1}\sum_{p\in C_i}|p-m_i|^2,m_i=\frac{1}{n_i}\sum_{x\in C_i}x
$$

主要考量了簇内的内聚程度。

2. 轮廓系数

$$
s(i)=\frac{b(i)-a(i)}{\max(b(i),a(i))}
$$

$b(i)$ 为样本i到其他簇间距离平均值的最小值； $a(i)$ 为样本i到簇内其他样本的平均距离。

轮廓系数主要考量了簇内的内聚程度和簇间的分离程度。

![image-20241115162505365](DataMining.assets/image-20241115162505365.png)

#### k-medoids（k-中心点，PAM）

复杂度 $O(tk{(n-k)}^2)$ 

![image-20241115161733353](DataMining.assets/image-20241115161733353.png)

![image-20241115163106599](DataMining.assets/image-20241115163106599.png)

![image-20241115163140079](DataMining.assets/image-20241115163140079.png)

![image-20241115163145638](DataMining.assets/image-20241115163145638.png)

#### CLARA

不考虑整个数据集, 而是选择数据的一小部分作为样本。

**步骤：**

它从数据集中抽取多个样本集, 对每个样本集使用PAM, 并以最好的聚类作为输出
　　CLARA 算法的步骤:
　　(1) for 　i = 1 to v (选样的次数) ,重复执行下列步骤( (2) ～ (4) ) :
　　(2) 随机地从整个数据库中抽取一个N(例如：(40 + 2 k))个对象的样本,调用PAM方法从样本中找出样本的k个最优的中心点。
　　(3)将这k个中心点应用到整个数据库上， 对于每一个非代表对象Oj ,判断它与从样本中选出的哪个代表对象距离最近.
　　(4) 计算上一步中得到的聚类的总代价. 若该值小于当前的最小值,用该值替换当前的最小值,保留在这次选样中得到的k个代表对象作为到目前为止得到的最好的代表对象的集合.
　　(5) 返回到步骤(1) ,开始下一个循环.
　　算法结束后，输出最好的聚类结果

**优缺点：**

优点: 可以处理的数据集比 PAM大

缺点:

1. 有效性依赖于样本集的大小
2. 基于样本的好的聚类并不一定是整个数据集的好的聚类, 样本可能发生倾斜。例如, Oi是整个数据集上最佳的k个中心点之一, 但它不包含在样本中, CLARA将找不到最佳聚类。

#### AGNES（自底向上）

复杂度 $O(n^3)$ 

![image-20241115161601745](DataMining.assets/image-20241115161601745.png)

![image-20241115161507761](DataMining.assets/image-20241115161507761.png)

#### DIANA（自顶向下）

自顶向下（分裂）

#### DBSCAN

基于高密度连接区域的密度聚类方法。

![image-20241115161229828](DataMining.assets/image-20241115161229828.png)

![image-20241115161241198](DataMining.assets/image-20241115161241198.png)

![image-20241115161303472](DataMining.assets/image-20241115161303472.png)

![image-20241115161312923](DataMining.assets/image-20241115161312923.png)