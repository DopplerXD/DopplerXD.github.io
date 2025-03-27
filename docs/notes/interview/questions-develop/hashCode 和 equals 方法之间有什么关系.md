## 两者关系

在 Java 中，`hashCode()` 和 `equals()` 方法的关系主要体现在集合类（如 `HashMap`、`HashSet`）中。

它们决定了对象的**逻辑相等性**和**哈希存储方式**。

**如果两个对象根据 `equals()` 相等，它们的 `hashCode()` 值必须相同**。即`a.equals(b) == true`，那么 `a.hashCode() == b.hashCode()` 必须为 `true`。

**但是反过来不要求成立**：即两个对象的 `hashCode()` 相同，不一定 `equals()` 相等。

**注意**：如果违背上述关系会导致在基于哈希的集合中出现错误行为。例如，只重写 equals 方法而不重写 hashCode 方法，`HashSet` 可能无法正确存储和查找元素。

### 为什么要重写 hashCode() 和 equals()

因为在使用 `HashMap`、`HashSet` 等集合时，这些集合内部依赖 `hashCode()` 和 `equals()` 方法来确定元素的存储位置。如果没有正确地重写这两个方法，集合可能无法正确判断对象的相等性，导致重复存储、查找失败等问题。

在这些数据结构的内部，如在执行 `putVal` 方法时，关的判断条件会先判断 hash 值是否相等，如果 hash 值相等，才会接着判断 equals；如果 hash 值都不同，那就认为这两个对象不相等。

### 重写 equals() 方法的基本规则：

- 自反性：对于任何非空对象引用 `x`，`x.equals(x)` 必须为 `true`。
- 对称性：对于任何非空对象引用 `x` 和 `y`，`x.equals(y)` 应当等于 `y.equals(x)`。
- 传递性：如果 `x.equals(y) == true` 且 `y.equals(z) == true`，那么 `x.equals(z)` 必须为 `true`。
- 一致性：只要对象未发生改变，多次调用 `x.equals(y)` 结果应该一致。
- 对于 `null`：对于任何非空对象引用 `x`，`x.equals(null)` 必须返回 `false`。

### 重写 hashCode()方法的基本规则：

- 在相同的应用程序执行过程中，对于同一个对象多次调用 `hashCode()` 必须返回相同的值。
- 如果两个对象根据 `equals()` 方法相等，则它们的 `hashCode()` 值必须相等。
- 但是，如果两个对象 `equals()` 不相等，则它们的 `hashCode()` 值不必不同，但不同的 `hashCode()` 值可以提高哈希表的性能。