## 区别

它们都是 Java 中处理字符串的类，区别主要体现在**可变性**、**线程安全性**和**性能**上：

### 1）String

- **不可变**：`String` 是不可变类，字符串一旦创建，其内容无法更改。每次对 `String` 进行修改操作（如拼接、截取等），都会创建新的 `String` 对象。
- **适合场景**：`String` 适用于字符串内容不会频繁变化的场景，例如少量的字符串拼接操作或字符串常量。

### 2）StringBuffer

- **可变**：`StringBuffer` 是可变的，可以进行字符串的追加、删除、插入等操作。
- **线程安全**：`StringBuffer` 是线程安全的，内部使用了 `synchronized` 关键字来保证多线程环境下的安全性。
- **适合场景**：`StringBuffer` 适用于在多线程环境中需要频繁修改字符串的场景。

### 3）StringBuilder

- **可变**：`StringBuilder` 也是可变的，提供了与 `StringBuffer` 类似的操作接口。
- **非线程安全**：`StringBuilder` 不保证线程安全，性能比 `StringBuffer` 更高。
- **适合场景**：`StringBuilder` 适用于单线程环境中需要大量修改字符串的场景，如高频拼接操作。

## Java 8 中的优化

在 Java 8 及以后，编译器会对字符串的常量拼接做优化，将字符串拼接转换为 `StringBuilder` 操作。这种优化提高了代码性能，但是在动态拼接或多线程场景下，手动使用 `StringBuilder` 和 `StringBuffer` 仍然更合适。

## 从演进角度看待三者

`String` 是 Java 中基础且重要的类，并且 `String` 也是 `Immutable` 类的典型实现，被声明为 `final class`，除了 `hash` 这个属性其它属性都声明为 `final`。

因为它的不可变性，所以例如拼接字符串时候会产生很多无用的中间对象，如果频繁的进行这样的操作对性能有所影响。

**StringBuffer 就是为了解决大量拼接字符串时产生很多中间对象问题而提供的一个类**，提供 `append` 和 `insert` 方法，可以将字符串添加到已有序列的末尾或指定位置。

它的本质是一个线程安全的可修改的字符序列，把所有修改数据的方法都加上了 `synchronized`。但是保证了线程安全是需要性能的代价的。

在很多情况下我们的字符串拼接操作不需要线程安全，这时候 **StringBuilder** 登场了，`StringBuilder`是`JDK1.5`发布的，它和 `StringBuffer` 本质上没什么区别，就是**去掉了保证线程安全的那部分，减少了开销**。

`StringBuffer` 和 `StringBuilder` 二者都继承了 `AbstractStringBuilder` ，底层都是利用可修改的 `char` 数组(JDK 9 以后是 `byte` 数组)。

所以如果我们有大量的字符串拼接，如果能预知大小的话最好在 `new StringBuffer` 或者 `StringBuilder` 的时候设置好 `capacity`，避免多次扩容的开销（扩容要抛弃原有数组，还要进行数组拷贝创建新的数组）。