## 四、频繁模式挖掘

在关联规则挖掘中，**Apriori** 和 **FP-Growth** 是两种常用的算法。它们用于从交易数据中挖掘**频繁项集**和**关联规则**，但它们的实现方式和效率存在显著差异。下面是对这两种算法的详细对比。

### 1. 算法简介

#### **Apriori算法**
- **提出者**：Rakesh Agrawal 等人于1994年。
- **核心思想**：利用**逐层搜索**（Level-wise Search）的方法，通过**频繁项集的“剪枝”特性**来减少候选项集的数量。
- **工作流程**：
  1. 通过单次扫描数据集生成频繁1-项集。
  2. 基于频繁 \( k \)-项集生成候选 \( (k+1) \)-项集。
  3. 扫描数据库来计算候选项集的支持度，筛选出频繁 \( (k+1) \)-项集。
  4. 重复上述步骤，直到找不到新的频繁项集。
- **剪枝策略**：若某个 \( k \)-项集不是频繁的，那么包含该 \( k \)-项集的所有 \( (k+1) \)-项集都不是频繁的（**Apriori原理**）。

#### **FP-Growth（Frequent Pattern Growth）算法**
- **提出者**：Han, Pei, 和 Yin 于2000年。
- **核心思想**：通过构建**FP-树（Frequent Pattern Tree）**来高效地压缩数据，并避免生成候选项集。
- **工作流程**：
  1. 扫描数据库，计算各项的支持度，删除不满足最小支持度的项。
  2. 对剩余的项按支持度降序排列，构建FP-树。
  3. 从FP-树中挖掘频繁项集（使用递归和“条件模式基”构建）。
- **优点**：通过FP-树的结构压缩数据，只需两次扫描数据库，从而显著减少时间和空间复杂度。

---

### 2. **Apriori与FP-Growth的区别对比**

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

### 3. **优缺点分析**

#### **Apriori算法**
- **优点**：
  - 简单直观，易于理解和实现。
  - 适合初学者和对小规模数据集进行关联分析。
- **缺点**：
  - 随着项集长度增加，候选项集的数量呈指数增长（**组合爆炸问题**）。
  - 需要多次扫描数据集，效率较低，特别是对于大数据集。

#### **FP-Growth算法**
- **优点**：
  - 通过FP-树压缩数据，只需两次扫描数据库，大幅减少I/O开销。
  - 无需显式生成候选项集，效率更高，尤其是对大型数据集。
- **缺点**：
  - 算法实现相对复杂，需要构建和维护FP-树。
  - 对内存要求较高，特别是当FP-树变得非常大时。

---

### 4. **应用示例**

#### **Apriori算法示例（Python代码）**
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

#### **FP-Growth算法示例（Python代码）**
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

### 5. **总结与选择建议**
- **Apriori算法**适合**小型数据集**，且易于理解和实现。但其性能瓶颈在于大量的候选项集生成和多次数据扫描。
- **FP-Growth算法**适合**大规模数据集**，特别是**稀疏数据集**。通过FP-树结构的压缩和减少候选项集的生成，显著提升了效率，但实现较为复杂。
- 在实际应用中，建议根据**数据规模**和**性能需求**选择适合的算法：
  - **小数据集**或**快速原型验证**：使用Apriori。
  - **大数据集**或**生产环境**：推荐使用FP-Growth。

## 五、分类

### 决策树

![image-20241112000523452](./DataMining.assets/image-20241112000523452.png)

![image-20241112000652444](./DataMining.assets/image-20241112000652444.png)

![image-20241112000828385](./DataMining.assets/image-20241112000828385.png)

### 贝叶斯分类

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

<img src="DataMining.assets/image-20241112121322584.png" alt="image-20241112121322584" style="zoom:50%;" />

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

<img src="DataMining.assets/image-20241112181935180.png" alt="image-20241112181935180" style="zoom:50%;" />

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

### k-means

复杂度 $O(nkt)$

### k-medoids

复杂度 $O(tk{(n-k)}^2)$

### AGNES

自底向上（合并）

### DIANA

自顶向下（分裂）