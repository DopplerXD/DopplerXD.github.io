在做项目时，遇到一个报错：**`SQLSyntaxErrorException: Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column`**

## 错误日志与相关代码

```
### Error querying database. Cause: java.sql.SQLSyntaxErrorException: Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'group_buy_market.group_buy_order_list.user_id' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by ### The error may exist in file [E:\DevelopLearning\doppler-group-buy-market\doppler-group-buy-market-app\target\classes\mybatis\mapper\group_buy_order_list_mapper.xml] ### The error may involve site.dopplerxd.infrastructure.dao.IGroupBuyOrderListDao.queryInProgressUserGroupBuyOrderDetailListByActivityId-Inline ### The error occurred while setting parameters ### SQL: select user_id, team_id, out_trade_no from group_buy_order_list where activity_id = ? and status in (0, 1) group by team_id ### Cause: java.sql.SQLSyntaxErrorException: Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'group_buy_market.group_buy_order_list.user_id' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by ; bad SQL grammar []; nested exception is java.sql.SQLSyntaxErrorException: Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'group_buy_market.group_buy_order_list.user_id' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
```

相关 xml 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?> <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd"> 
<mapper namespace="site.dopplerxd.infrastructure.dao.IGroupBuyOrderListDao"> 
    <resultMap id="dataMap" type="site.dopplerxd.infrastructure.dao.po.GroupBuyOrderList"> 
        <id column="id" property="id"/> 
        <result column="user_id" property="userId"/> 
        <result column="team_id" property="teamId"/> 
        <result column="order_id" property="orderId"/> 
        <result column="activity_id" property="activityId"/> 
        <result column="start_time" property="startTime"/> 
        <result column="end_time" property="endTime"/> 
        <result column="goods_id" property="goodsId"/> 
        <result column="source" property="source"/> 
        <result column="channel" property="channel"/> 
        <result column="original_price" property="originalPrice"/> 
        <result column="deduction_price" property="deductionPrice"/> 
        <result column="status" property="status"/> 
        <result column="out_trade_no" property="outTradeNo"/> 
        <result column="out_trade_time" property="outTradeTime"/> 
        <result column="biz_id" property="bizId"/> 
        <result column="create_time" property="createTime"/> 
        <result column="update_time" property="updateTime"/> 
    </resultMap> 
    
    <select id="queryInProgressUserGroupBuyOrderDetailListByActivityId" parameterType="java.lang.Long" resultMap="dataMap"> select user_id, team_id, out_trade_no from group_buy_order_list where activity_id = #{activityId} and status in (0, 1) group by team_id 
    </select>
</mapper>
```

## GPT 回答

你遇到的错误是：

> **`SQLSyntaxErrorException: Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'group_buy_order_list.user_id'`**

这来自 MySQL 的 SQL 模式设置为 `ONLY_FULL_GROUP_BY`，在该模式下，你的 SQL 语句不合法。

---

## 🧩 一、问题根因

在 MySQL 中执行带 `GROUP BY` 的查询时：

- **标准 SQL 要求**：`SELECT` 中的字段必须是：
    
    - 出现在 `GROUP BY` 中，或者
        
    - 被聚合函数包裹（如：`MAX()`, `SUM()`, `COUNT()` 等）
        

> 否则数据库无法确定：一组记录中该字段该取哪一条的值。

MySQL 5.7 以前默认允许你“随便选一条”，但这是**不确定行为**。从 5.7 开始，开启了 `ONLY_FULL_GROUP_BY` 模式后，就不再允许这种“模糊字段”的写法。

你的 SQL 语句如下：

```sql
SELECT user_id, team_id, out_trade_no
FROM group_buy_order_list
WHERE activity_id = #{activityId} AND status IN (0, 1)
GROUP BY team_id
```

### ❌ 错误点：

这个问题是 MySQL 在启用了 `ONLY_FULL_GROUP_BY` 模式时强制执行 SQL 语义的一种保护机制。在 `ONLY_FULL_GROUP_BY` 模式下，**所有 SELECT 字段必须出现在 GROUP BY 中**，或必须通过聚合函数包裹（如 `MAX()`, `MIN()` 等），否则报错。

你只 `GROUP BY team_id`，但 `user_id` 和 `out_trade_no` 没有做聚合或包含在 GROUP BY 中，MySQL 无法判断应该选哪个 `user_id` 和 `out_trade_no`。

### 举例说明

假设有一张订单表 `orders`：

|order_id|user_id|team_id|
|---|---|---|
|1|A|101|
|2|B|101|
|3|C|102|

你执行以下 SQL：

```sql
SELECT user_id, team_id FROM orders GROUP BY team_id;
```

你希望的是：

- 每个 `team_id` 只保留一条记录

但问题是，**对于 team_id = 101，有两条记录（user_id A 和 B），MySQL 不知道选哪一条 user_id**

- 这时如果没有 `ONLY_FULL_GROUP_BY`，它会“随便挑一条”（可能是 A，也可能是 B，甚至每次都不一样）
- 但开启了 `ONLY_FULL_GROUP_BY` 模式，它会报错：`user_id` 不在 `GROUP BY` 中，也没聚合，**我无法决定选哪个**

---

## ✅ 二、解决方式

### ✅ 方案 1：使用聚合函数（推荐）

根据业务语义，假设你希望获取某个 `team_id` 下的一条记录，可以使用 `MAX()` 或 `MIN()`：

```sql
SELECT 
    MAX(user_id) AS user_id,
    team_id,
    MAX(out_trade_no) AS out_trade_no
FROM group_buy_order_list
WHERE activity_id = #{activityId} AND status IN (0, 1)
GROUP BY team_id
```

表示每个 `team_id` 只选 user_id 最大的那一条（按字母顺序 C > B > A）。

> ✅ **适合场景**：你只需要每个 `team_id` 下任意一条记录即可。

---

### ✅ 方案 2：关闭 ONLY_FULL_GROUP_BY（不推荐线上使用）

可以通过设置 MySQL 的 `sql_mode` 临时取消严格模式：

```sql
SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
```

> ⚠️ **风险**：放松约束可能掩盖业务逻辑不明确的问题，不建议在线上环境使用！

---

### ✅ 方案 3：改写为子查询

如果你想获取每个 team_id 对应的最新订单，可以使用子查询实现：

```sql
SELECT a.*
FROM group_buy_order_list a
JOIN (
    SELECT team_id, MAX(create_time) AS latest_time
    FROM group_buy_order_list
    WHERE activity_id = #{activityId} AND status IN (0, 1)
    GROUP BY team_id
) b ON a.team_id = b.team_id AND a.create_time = b.latest_time
```

> ✅ **适合场景**：你需要获取每个 team_id 最新的一条订单记录。

---

## 🛠 三、建议改写 XML 语句

在你的 `mapper.xml` 中将该语句改为：

```xml
<select id="queryInProgressUserGroupBuyOrderDetailListByActivityId" parameterType="java.lang.Long"
        resultMap="dataMap">
    SELECT MAX(user_id) AS user_id, team_id, MAX(out_trade_no) AS out_trade_no
    FROM group_buy_order_list
    WHERE activity_id = #{activityId} AND status IN (0, 1)
    GROUP BY team_id
</select>
```

或者使用子查询替代，视你的业务需求而定。

---

## 📌 四、你的案例回顾

你想执行的是：

```sql
SELECT user_id, team_id, out_trade_no
FROM group_buy_order_list
WHERE activity_id = #{activityId} AND status IN (0, 1)
GROUP BY team_id
```

问题在于：

- 你只 `GROUP BY team_id`
- 但 `user_id` 和 `out_trade_no` 属于该分组的**多个记录中的字段**
- 没有聚合 → 报错

---

## 🧠 总结

> 当你 `GROUP BY` 某个字段时，所有 SELECT 中的其他字段必须是该字段的**确定性函数值**，否则 MySQL 无法判断该取哪一条！
