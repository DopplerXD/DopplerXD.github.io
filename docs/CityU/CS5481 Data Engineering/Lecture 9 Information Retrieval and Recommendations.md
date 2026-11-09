# Lecture 9：信息检索与推荐

## 信息检索

信息检索（information retrieval，IR）根据用户的查询（query）从文档集合中寻找相关内容；信息过滤（information filtering）则根据个人的信息需求筛选内容，推荐系统是常见应用。检索流程包括理解信息需求、建立索引、计算相关性、排序和评估。

倒排索引（inverted index）为每个词保存包含它的文档列表，便于快速定位候选文档。布尔模型（Boolean model）通过 AND、OR、NOT 组合关键词；向量空间模型（vector space model）将文档和查询表示为词向量，再根据相似度排序。

余弦相似度（cosine similarity）衡量向量夹角：

$$\operatorname{cos}(q,d)=\frac{q\cdot d}{\|q\|\|d\|}$$

它关注词权重的方向，减弱文档长度差异的影响。词频（term frequency，TF）衡量词在文档中的出现频率；逆文档频率（inverse document frequency，IDF）衡量词在语料中的稀有程度，常写为 $\log(N/df_t)$。词频–逆文档频率（TF-IDF）将两者相乘，使文档内频繁出现、但在整个语料中较少见的词获得较高权重。

BM25 是常用的概率式排序方法，结合词频饱和与文档长度归一化。PageRank 根据网页的入链及来源页面的重要性计算与查询无关的页面重要性；它反映链接结构，不等同于查询相关性。

## 推荐系统

推荐系统（recommender system）为用户选择可能感兴趣的物品。协同过滤（collaborative filtering）利用用户与物品的历史交互：基于用户的方法寻找兴趣相近的用户，基于物品的方法寻找与用户喜欢的物品相似的物品。相似度可使用余弦相似度、皮尔逊相关系数或杰卡德相似度。

矩阵分解（matrix factorization）将用户–物品评分矩阵近似分解为用户和物品的低维向量，使用内积预测评分：$\hat r_{ui}=p_u^\top q_i$。神经协同过滤（neural collaborative filtering）进一步用神经网络学习非线性交互。大语言模型（large language model，LLM）可作为特征提取器、生成语义特征，也可直接根据用户信息生成推荐。

评分预测常用均方根误差（root mean square error，RMSE）和平均绝对误差（mean absolute error，MAE），越小越好。前 N 项推荐可使用命中率（hit rate）、精确率（precision）和召回率（recall）：精确率关注推荐结果中相关物品的比例，召回率关注相关物品中被推荐的比例；$F_1=2PR/(P+R)$ 综合两者。

主要挑战包括冷启动（cold start）、交互数据稀疏、个性化以及过滤气泡（filter bubble）。离线指标不能单独说明长期用户体验，评价时应结合任务和数据划分。
