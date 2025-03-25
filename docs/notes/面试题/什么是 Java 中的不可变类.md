## 基本概念和特点

不可变类是指在**创建后其状态（对象的字段）无法被修改**的类。一旦对象被创建，它的所有属性都不能被更改。这种类的实例在整个生命周期内保持不变。

**特点：**

+ 声明类为 `final`，不能被子类继承
+ 类的所有字段都被 `private final` 修饰，确保在初始化后不能修改
+ 通过构造函数初始化所有字段
+ 不对外暴露修改对象的方法（如  `setter`）
+ 如果类包含可变对象的引用，确保这些引用在对象外部无法被修改。例如 `getter` 方法中返回对象的副本（new 一个新的对象）来保护可变对象。

## 优缺点

**优点：**

+ 线程安全：由于不可变对象的状态不能被修改，它们天生是线程安全的，在并发环境中无需同步。
+ 缓存友好：不可变对象可以安全地被缓存和共享，如 String 的字符串常量池。
+ 防止状态不一致：不可变类可以有效避免因意外修改对象状态而导致的不一致问题。

**缺点：**

+ 性能问题：不可变对象需要在每次状态变化时创建新的对象，这可能会导致性能开销，尤其是对于大规模对象或频繁修改的场景（例如 String 频繁拼接）。

## 以 String 为例

**String** 就是典型的不可变类，创建一个 String 对象之后，这个对象就无法被修改。

因为无法被修改，所以像执行 `s += "a";` 这样的方法，其实返回的是一个新建的 String 对象，旧的 s 指向的对象不会发生变化，只是 s 的引用指向了新的对象而已。

所以不要在字符串拼接频繁的场景使用 + 来拼接，因为这样会频繁的创建对象。

不可变类的好处就是安全，因为知晓这个对象不可能会被修改，因此可以放心大胆的用，在多线程环境下也是线程安全的。

### 源码实现

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
    
    ...
}
```

首先，String 类用 final 修饰，不能被继承。

其次，String 本质是一个 char 数组，然后用 final 修饰，但 final 限制不了数组内部的数据，所以使用 private 修饰 value，并且没有暴露出 set 方法，这样外部其实就接触不到 value 所以无法修改。

但是 Java 提供了 `replace` 方法来处理修改的需求：

```java
public String replace(char oldChar, char newChar) {
    if (oldChar != newChar) {
        int len = value.length;
        int i = -1;
        char[] val = value; /* avoid getfield opcode */

        while (++i < len) {
            if (val[i] == oldChar) {
                break;
            }
        }
        if (i < len) {
            char buf[] = new char[len];
            for (int j = 0; j < i; j++) {
                buf[j] = val[j];
            }
            while (i < len) {
                char c = val[i];
                buf[i] = (c == oldChar) ? newChar : c;
                i++;
            }
            return new String(buf, true);
        }
    }
    return this;
}
```

注意到，该方法通过返回一个新的对象作为返回结果，并没有影响修改之前存在的对象内容。