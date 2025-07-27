## 🧭 导语：为什么我们需要写整洁代码？

在项目初期，“能跑就行”；而在项目迭代后，“能维护、能扩展”才是生命线。整洁代码是高质量软件的核心，是专业程序员的修养。

---

## 📌 一、好的代码的五个维度

1. **可读性（Readability）**
2. **可理解性（Understandability）**
3. **可维护性（Maintainability）**
4. **可扩展性（Extensibility）**
5. **可测试性（Testability）**

> ✨ 好的代码让你“像读一本小说一样阅读”，而不是“破解谜题”。

---

## 🧾 二、命名应当意义明确

**❌ 坏示例：**

```
int d; // 表示距离？天数？折扣？完全无法推断
```

**✅ 好示例：**

```java
int elapsedTimeInDays;
double discountRate;
String customerEmail;
```

📎 **命名建议**：

- **名副其实**：使用有意义的名称代替魔法数，尽量避免“temp”、“data”、“info”等无意义词。
- **避免误导**：避免使用小写字母 l 和大写字母 O 作为变量名。
- **做有意义的区分**：例：添加变量添加数字（a 1、a 2）、或者废话（nameString）是没有意义的。
- **使用读得出来的名称**
- **使用可搜索的名称**：单字母名称仅用于段方法中的本地变量；变量名称应与其作用域大小相对应。
- **避免使用编码**
- **避免思维映射**
- **类名**：类名和对象名应该是名词或者名词短语
- **方法名**：方法名应该是动词或者动词短语
- **避免缩写**：如 `hp` vs `healthPoints`。
- **别抖机灵**
- **每个概念对应一个词**
- **别用双关语**
- **使用源自所涉问题领域的名称**：如 `Order`, `Invoice`, `Repository` 等。
- **添加有意义的语境、不要添加没用的语境**

---

## 🧩 三、函数应小而专一（Small and Focused）

### ❌ 坏示例：一个函数干了五件事

```java
public void handleOrder() {
    validateOrder();
    calculateTax();
    saveToDatabase();
    sendEmail();
    log("Order processed");
}
```

### ✅ 好示例：单一职责 + 函数名即注释

```java
public void processOrder() {
    if (!isValid(order)) return;
    applyTax(order);
    persist(order);
    notifyCustomer(order);
}
```

📎 **建议**：

- **尽量短小**
- **只做一件事情**：函数应该只做并做好一件事情。
- **函数名具有描述性**：函数名应能够表示出具体功能，用长的函数名换来易读性是非常值得的。
- **函数参数越少越好**：0 个参数最为理想；若想要传入布尔值，不如将其分为两个函数。
- **分隔指令与询问**：函数应该修改某对象的状态，或是返回该对象有关的信息，如果两样都干，常会导致混乱。
- **使用异常替代返回错误码**：封装错误码与错误信息等，便于上游等进行处理。
- **无副作用**

---

## 📐 四、注释不能替代干净的代码

### ❌ 注释掩盖了糟糕的命名

```java
// Get the list of active users
List<User> a = getUsers(1);
```

### ✅ 用命名表达意图，注释只解释“为什么”

```java
List<User> activeUsers = getActiveUsers();
```

📎 **优质注释应该：**

- 必要的法律信息
- 关于代码的警示
- 公共 API 中的 Javadoc
- 说明特殊业务规则或外部接口限制
- 注明“为什么”使用某种实现，而不是“做了什么”

---

## 🚫 五、重复是万恶之源（DRY 原则）

### ❌ 重复逻辑散落各处

```java
if (price > 1000) {
    discount = 0.2;
}
// ...另一个地方
if (order.getTotalPrice() > 1000) {
    rebate = 0.2;
}
```

### ✅ 抽取公共逻辑

```java
public double getHighValueDiscount(double amount) {
    return amount > 1000 ? 0.2 : 0.0;
}
```

📎 **益处**：

- 修改时只改一处
- 更容易测试和复用

---

## ⚠️ 六、使用异常处理错误，而非返回码

### ❌ 错误处理分散，逻辑容易遗漏

```java
if (connect() == -1) {
    return -1;
}
```

### ✅ 使用异常表达错误，逻辑集中清晰

```java
try {
    connect();
} catch (ConnectionException e) {
    logger.error("连接失败", e);
}
```

📎 **建议**：

- 使用异常而非错误码
- 先写 `try-catch-finally` 语句
- 使用不可控异常
- 给出异常发生时的环境说明
- 自定义异常类，如 `InvalidOrderException`
- 不要捕获后静默忽略：`catch (Exception e) {}`
- 不返回或捕获 null 值

---

## 🧱 七、类应高内聚低耦合

**高内聚**：类的成员变量和方法应围绕同一职责展开  
**低耦合**：避免类之间互相依赖太紧密

### ✅ 示例

```java
public class InvoicePrinter {
    private Invoice invoice;

    public void print() {
        // 打印发票内容
    }
}
```

### ❌ 坏示例：类无所不包

```java
public class Utility {
    public void parseJSON() {}
    public void sendEmail() {}
    public void backupDatabase() {}
}
```

- **使用 DTO（数据传输对象，Data Transfer Object）**：最为精练的数据结构，是一个只有公共变量、没有函数的类。这种数据结构有时被称为 DTO，尤其用在与数据库通信、或解析套接字传递的消息之类场景中。
- **类应该短小**：系统应该由许多短小的类而不是少量巨大的类组成。

---

## 🧪 八、测试代码也要整洁

**❌ 模糊、无结构的测试**

```java
@Test
public void test1() {
    Order o = new Order(300);
    assertTrue(o.getDiscount() == 0.2);
}
```

**✅ 结构良好的测试**

```java
@Test
public void shouldApply20PercentDiscountForHighValueOrder() {
    Order order = new Order(300);
    double discount = order.calculateDiscount();
    assertEquals(0.2, discount);
}
```

📎 测试三部曲：**Given-When-Then**

- Given：准备输入
- When：调用方法
- Then：验证输出

---

## 📎 九、整洁风格是团队协作的基石

统一规范推荐：

- Java：遵循 Google Java Style 或阿里巴巴开发规范
- JS/TS：使用 ESLint + Prettier
- Python：PEP8 + Black

📎 建议工具：

- IDE 统一格式化（如 VSCode、IntelliJ）
- 自动化检查（CI + Lint）
- 代码审查制度（Code Review）

---

## 🔁 十、整洁是一种持续的过程

> ✨ “编程不是把事情做完，而是把事情做对。”

### 整洁实践建议：

- 每次提交前自查函数和命名是否清晰
- 定期重构已有代码
- 鼓励团队讨论代码风格，达成共识

---

## ✅ 总结：Clean Code 的七句话箴言

1. 命名即注释，意图自明
2. 函数要小，专注一件事
3. 注释只补充“为什么”，不解释“做了什么”
4. 重复代码就是技术债
5. 错误应由异常处理，而非返回值
6. 测试代码也要整洁可读
7. 整洁不是标准，是态度

---

## 📚 推荐阅读

- 《代码整洁之道》 - Robert C. Martin
- 《重构：改善既有代码的设计》 - Martin Fowler
- 《代码大全》 - Steve McConnell
