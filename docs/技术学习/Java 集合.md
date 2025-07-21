## Java 中有什么集合
### 集合概览
![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748683412784-71c16146-9e6d-4ce8-a8d9-76418dc2d1c6.png)

集合框架主要分为`Collection`、`Map`两大接口：

+ Collection 接口：最基本的集合框架表示方式，提供了添加、删除、清空等基本操作，主要有三个子接口：
    - List：元素有序，可重复。实现类包括 ArrayList、LinkedList 等。
    - Set：元素不重复。HashSet、LinkedHashSet、TreeSet 等。
    - Queue：元素队列。PriorityQueue、ArrayDeque 等。
+ Map 接口：表示键值对的值，一个键映射到一个值。键不能重复，每个键只对应一个值。实现类：HashMap、LinkedHashMap、TreeMap 等。

### 说一下你用过哪些集合类，他们的优缺点？
我常用的集合有 ArrayList、LinkedList、HashMap、LinkedHashMap

1. ArrayList：可看作一个动态数组，可以在需要时动态扩容数组容量，扩容时复制元素到新的数组。优：访问速度快，可通过索引直接查找元素。缺：插入或删除元素复杂度较高。
2. LinkedList：双向链表，适合写多读少。优：增删元素只需改变节点的前后指针，复杂度低。缺：随机访问性能差，O(n)。
3. HashMap：基于哈希表的键值对集合。优：可根据哈希值快速查找到值。缺：有可能发生哈希冲突，不保证插入顺序。
4. LinkedHashMap：基于 HashMap，使用双向链表维护插入顺序。

### 哪些是线程安全的？
Vector、Hashtable、ConcurrentHashMap、CopyOnWriteArrayList、ConcurrentLinkedQueue、ArrayBlockingQueue、LinkedBlockingQueue。

## TODO Collections 工具类
[https://javabetter.cn/common-tool/collections.html](https://javabetter.cn/common-tool/collections.html)

## TODO Arrays 工具类
[https://javabetter.cn/common-tool/arrays.html](https://javabetter.cn/common-tool/arrays.html)

## TODO 优先队列的实现


## HashMap源码中，transient Set<Map.Entry<K,V>> entrySet; 的作用是什么
在 `HashMap` 源码里，`transient Set<Map.Entry<K,V>> entrySet;` 是一个用于存储 `HashMap` 中所有键值对条目的集合。下面为你详细介绍其作用和相关要点：

### 1. 表示键值对视图
+ `entrySet` 代表了 `HashMap` 中所有键值对的一个集合视图。`Map.Entry<K,V>` 是 `Map` 接口里定义的一个嵌套接口，它代表了 `Map` 中的一个键值对。通过 `entrySet`，可以方便地遍历 `HashMap` 里的每一个键值对。
+ 示例代码如下：

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class HashMapEntrySetExample {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("apple", 1);
        map.put("banana", 2);

        Set<Map.Entry<String, Integer>> entrySet = map.entrySet();
        for (Map.Entry<String, Integer> entry : entrySet) {
            System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
        }
    }
}
```

在这个例子中，借助 `map.entrySet()` 方法获取到 `HashMap` 的 `entrySet`，然后利用 `for - each` 循环遍历其中的每一个 `Map.Entry` 对象，进而获取键和对应的值。

### 2. 提高操作效率
+ 当需要对 `HashMap` 中的所有键值对进行操作时，直接使用 `entrySet` 能避免多次遍历 `HashMap`。例如，若要统计 `HashMap` 中所有值的总和，通过 `entrySet` 可以一次性遍历所有键值对来完成计算。

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class HashMapEntrySetSumExample {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("apple", 1);
        map.put("banana", 2);
        map.put("cherry", 3);

        Set<Map.Entry<String, Integer>> entrySet = map.entrySet();
        int sum = 0;
        for (Map.Entry<String, Integer> entry : entrySet) {
            sum += entry.getValue();
        }
        System.out.println("Sum of values: " + sum);
    }
}
```

### 3. `transient` 关键字的作用
+ `transient` 关键字表明该字段在对象序列化时会被忽略。`entrySet` 是根据 `HashMap` 中的键值对动态生成的，它本身并不存储实际的数据，数据是存储在 `HashMap` 的内部数组中的。所以在序列化 `HashMap` 对象时，无需对 `entrySet` 进行序列化，这样可以避免不必要的序列化开销和可能出现的问题。当反序列化 `HashMap` 对象时，`entrySet` 会根据 `HashMap` 中的数据重新生成。

综上所述，`transient Set<Map.Entry<K,V>> entrySet;` 主要用于提供 `HashMap` 中键值对的集合视图，方便对键值对进行遍历和操作，同时通过 `transient` 关键字避免了不必要的序列化开销。

## List、Set、Map 的原理和区别
+ List：基于链表，有序，可重复，继承自 Collection 接口，可按照索引访问元素
+ Set：无序，不包含重复元素，继承 Collection 接口
+ Map：接口表示一对键值对的集合，每个键唯一且与一个值关联

## Java 中对集合排序几种方式
1. 使用 Collections.sort() 方法可以对实现了 List 的集合进行排序，要求集合实现 Camparable 接口或传入 Comparator 接口的实现类。
2. 对于 Map 集合，可以先转为 List，再使用工具类进行排序
3. 使用 Java8 提供的 Stream API 中的 sorted() 方法。
    1. 对整数列表 `numbers` 进行了自然排序，`sorted()` 方法会调用元素的 `compareTo` 方法（对于 `Integer` 类，它是按照数值大小排序）。
    2. 对整数列表进行了降序排序，通过 `Comparator.reverseOrder()` 实现。
    3. 对字符串列表 `names` 按字符串长度进行排序，使用 `Comparator.comparingInt` 方法结合 `String::length` 方法引用。

```java
public static void main(String[] args) {
    // 创建一个整数列表
    List<Integer> numbers = new ArrayList<>();
    numbers.add(3);
    numbers.add(1);
    numbers.add(4);
    numbers.add(1);
    numbers.add(5);
    numbers.add(9);

    // 自然排序
    List<Integer> sortedNumbers = numbers.stream()
           .sorted()
           .toList();
    System.out.println("自然排序结果: " + sortedNumbers);

    // 自定义排序（降序）
    List<Integer> reverseSortedNumbers = numbers.stream()
           .sorted(Comparator.reverseOrder())
           .toList();
    System.out.println("降序排序结果: " + reverseSortedNumbers);

    // 创建一个字符串列表
    List<String> names = new ArrayList<>();
    names.add("Alice");
    names.add("Bob");
    names.add("Charlie");
    names.add("David");

    // 字符串按长度排序
    List<String> sortedNamesByLength = names.stream()
           .sorted(Comparator.comparingInt(String::length))
           .toList();
    System.out.println("按字符串长度排序结果: " + sortedNamesByLength);
}
```

## Map 的 key 和 value可以同时为 null 吗
+ HashMap 与 LinkedHashMap 可以，但只能键有一个 null。
+ TreeMap key 不可以为 null，否则会导致空指针异常；value 可以为 null。
+ ConcurrentHashMap 键和值都不能为 null，以避免在多线程环境下出现问题。
+ Hashtable 不允许键或值为 null。

## 对 ConcurrentHashMap 的了解
`ConcurrentHashMap` 是 Java 中用于在多线程环境下高效操作的哈希表实现，位于 `java.util.concurrent` 包中。

### 原理

+ JDK 7 及以前
    - 在 JDK 7 及以前，`ConcurrentHashMap` 采用分段锁（Segment）机制实现并发控制。其核心结构如下：
    - **Segment 数组**：`ConcurrentHashMap` 内部维护了一个 `Segment` 数组，每个 `Segment` 类似于一个小的 `HashMap`，它继承自 `ReentrantLock`，可以独立加锁。默认情况下，数组长度为 16，也就是最多支持 16 个线程并发操作。
    - **HashEntry 数组**：每个 `Segment` 内部包含一个 `HashEntry` 数组，用于存储键值对。`HashEntry` 是一个链表节点，当发生哈希冲突时，采用链表法解决。
    - 当进行写操作（如 `put` 方法）时，首先根据键的哈希值计算出对应的 `Segment`，然后对该 `Segment` 加锁，接着在该 `Segment` 内部的 `HashEntry` 数组中进行插入或更新操作。读操作（如 `get` 方法）通常不需要加锁，因为 `HashEntry` 的 `value` 是用 `volatile` 修饰的，保证了不同线程之间的可见性。
+ JDK 8 及以后
    - JDK 8 对 `ConcurrentHashMap` 进行了重大改进，摒弃了分段锁机制，采用了 CAS（Compare - And - Swap）和 `synchronized` 来实现并发控制。其核心结构如下：
    - **Node 数组**：`ConcurrentHashMap` 内部维护了一个 `Node` 数组，每个 `Node` 存储一个键值对。当发生哈希冲突时，首先采用链表法解决，当链表长度达到一定阈值（默认为 8）时，链表会转换为红黑树，以提高查找效率。
    - **CAS 和 synchronized**：在进行写操作时，首先通过 CAS 尝试更新节点，如果 CAS 失败，则使用 `synchronized` 对当前节点加锁，然后进行插入或更新操作。读操作时，通过 `volatile` 关键字保证数据的可见性，通常不需要加锁。

### 特点

+ 线程安全
    - `ConcurrentHashMap` 是线程安全的，它允许多个线程同时进行读写操作，而不需要额外的同步机制。在多线程环境下，使用 `ConcurrentHashMap` 可以避免数据不一致的问题。
+ 高效的并发性能
    - **分段锁机制（JDK 7 及以前）**：通过将哈希表分成多个 `Segment`，不同的 `Segment` 可以独立加锁，从而支持多个线程同时进行写操作，提高了并发性能。
    - **CAS 和 synchronized（JDK 8 及以后）**：采用更细粒度的锁机制，减少了锁的竞争，同时利用 CAS 操作避免了锁的开销，进一步提高了并发性能。
+ 支持高并发读写
    - 读操作通常不需要加锁，通过 `volatile` 关键字保证数据的可见性，使得多个线程可以同时进行读操作。写操作采用了锁分段或 CAS 和 `synchronized` 机制，在保证线程安全的前提下，也能支持较高的并发写入。
+ 自动扩容
    - 当 `ConcurrentHashMap` 中的元素数量达到一定阈值时，会自动进行扩容操作，以保证哈希表的性能。在扩容过程中，采用了并发扩容的方式，多个线程可以同时参与扩容，提高了扩容的效率。
+ 数据结构灵活
    - 在 JDK 8 及以后，当链表长度达到一定阈值时，链表会转换为红黑树，当元素数量减少时，红黑树又会转换为链表，这种数据结构的动态转换可以在不同的场景下提供更好的性能。

## 说说 CopyOnWriteArrayList
`CopyOnWriteArrayList` 是 Java 并发包（`java.util.concurrent`）中的一个线程安全的列表实现，是线程安全版本的 ArrayList：

核心原理**写时复制**（Copy-On-Write）。当有写操作时，会**先复制一份原数组**，在新数组上进行**加锁修改**，修改完成后再将原数组的**引用指向新数组**。读操作则直接在原数组上进行，无需加锁。

+ **线程安全**：通过写时复制机制，保证在多线程环境下的线程安全，读操作和写操作可以并发进行。
+ **读操作无锁**：读操作不需要加锁，性能较高，适合读多写少的场景。
+ **写操作开销大**：**每次写**操作都需要**复制**数组，会消耗较多的内存和时间，因此不适合写操作频繁的场景。并且**写时需要用 `ReentrantLock` 加锁**。
+ **数据一致性问题**：由于读操作和写操作是分离的，读操作**可能读到旧**数据，不保证强一致性，只能**保证最终一致性**。

适用于**读远远多于写**的场景，如配置信息存储、事件监听器列表等，在这些场景中，数据的更新频率较低，而读取操作非常频繁。

```java
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock(); // 加锁
    try {
        Object[] elements = getArray();
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1); // 复制数组
        newElements[len] = e;
        setArray(newElements); // 更新引用
        return true;
    } finally {
        lock.unlock(); // 释放锁
    }
}
```

## transient 的作用是什么，为什么很多java集合中都有用到？
`transient` 主要用于修饰类的成员变量。当一个变量被 `transient` 修饰时，在对象进行**序列化操作期间**，这个变量的值不会被保存到序列化的流中，也就是该变量会被忽略，**不会被持久化**。被这样修饰的变量，反序列化后值为 null。

许多 Java 集合类（如 `ArrayList`、`HashMap` 等）使用 `transient` 关键字主要出于以下几个原因：

+ **提高序列化效率**：集合类内部通常会有一些**辅助性的成员变量**，这些变量用于维护集合的内部状态，对于序列化对象来说并**非必要**。例如，`ArrayList` 中的 `modCount` 变量，它用于记录列表结构被修改的次数，主要用于快速失败机制（fail - fast），但在序列化时并不需要保存这个变量的值。将这些变量用 `transient` 修饰，可以避免不必要的数据被序列化，从而提高序列化的效率。
+ **自定义序列化逻辑**：集合类可能需要自定义序列化和反序列化的逻辑，以确保数据的正确存储和恢复。例如，`HashMap` 中的 `table` 数组存储了哈希表的实际数据，它会根据需要进行扩容等操作。在序列化时，直接序列化 `table` 可能会包含大量未使用的空间，造成浪费。因此，`HashMap` 会自定义序列化方法，只序列化实际存储的键值对，而将 `table` 数组用 `transient` 修饰。
+ **安全性**：某些集合类中的变量可能包含敏感信息，不希望被序列化。使用 `transient` 关键字可以防止这些敏感信息在序列化过程中被泄露。不过在 Java 集合类中，这种情况相对较少，主要还是出于效率和自定义序列化逻辑的考虑。

## volatile 的作用
`volatile` 是一个类型修饰符，用于修饰变量。它主要有两大作用：保证变量的可见性和禁止指令重排序。

+ **保证变量的可见性**
    - 在多线程环境下，每个线程都有自己的工作内存，变量的值会先从主内存拷贝到工作内存中，线程对变量的读写操作都在工作内存中进行。当一个线程修改了变量的值，这个修改后的值不会立即同步到主内存中，其他线程的工作内存中的变量值也不会及时更新，从而导致数据不一致问题。
    - 而被 `volatile` 修饰的变量，当一个线程修改了该变量的值，会立即将修改后的值刷新到主内存中，并且会使其他线程工作内存中该变量的副本失效。这样，其他线程在读取该变量时，会强制从主内存中读取最新的值，从而保证了变量在多个线程之间的可见性。
+ **禁止指令重排序**
    - 在 Java 中，为了提高程序的执行效率，编译器和处理器会对指令进行重排序。指令重排序可能会导致程序的执行顺序与代码的编写顺序不一致，在单线程环境下，这种重排序不会影响程序的最终结果，但在多线程环境下，可能会导致数据不一致问题。
    - `volatile` 关键字可以禁止指令重排序，保证代码的执行顺序与编写顺序一致。当一个变量被 `volatile` 修饰后，编译器和处理器会在该变量的读写操作前后插入内存屏障，阻止屏障前后的指令进行重排序。

## ArrayList 的扩容过程
### 扩容过程
1. 以无参构造 ArrayList 时，初始化赋值一个空数组，放入元素时才分配 10 的空间。（JDK 6 时无参构造直接分配 10 空间）
2. 插入第 10 个元素，不扩容。
3. 插入第 capacity + 1 个元素，触发扩容，新容量为 `newCapacity = oldCapacity + (oldCapacity >> 1)`，即 1.5 倍，向下取整。
4. 使用 `Arrays.copyOf(elementData, newCapacity)` 方法复制原数组元素到新数组中。

### 源码分析
```java
private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}

private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```

1. 渐进式扩容，通过指数级增长，减少扩容频率，避免频繁复制数组带来的性能开销。
2. 处理最小容量需求，如使用 `addAll()` 方法批量添加元素时，通过 `newCapacity = minCapacity;` 保证最小需求。
3. 处理最大容量限制。
    1. `MAX_ARRAY_SIZE`：数组最大理论容量，通常为 `Integer.MAX_VALUE - 8`，避免 JVM 实现的限制，如某些 JVM 会在数组头存储额外信息。
    2. `hugeCapacity` 方法：若 `minCapacity > MAX_ARRAY_SIZE`，则返回 `Integer.MAX_VALUE`（极端情况，可能触发 OOM）；否则返回 `MAX_ARRAY_SIZE`。
4. 数组复制与内存操作，通过 `System.arraycopy()` 进行高效的原生数组复制。这里也会产生 ArrayList 扩容的主要开销。

## ArrayList 是怎么序列化的？
ArrayList 中，writeObject 方法被重写了，用于自定义序列化逻辑：只序列化有效数据，因为 elementData 数组的容量一般大于实际的元素数量，声明时也加了 `transient` 关键字。

## 快速失败 fail-fast 与安全失败 fail-safe
### 快速失败
这是 Java 集合的一种错误检测机制。

在使用迭代器遍历集合对象时，会检查 `modCount` 的值。如果在迭代过程中，`ArrayList` 的结构被修改（如增删元素等操作），`modCount` 的值会发生变化。迭代器使用 `hashNext()/next()` 遍历下一个元素前，会检测 `modCount` 是否为 `expectedmodCount`，如果不一致，就会抛出 `ConcurrentModificationException` 异常。

但是会出现 `modCount++` 然后 `modCount--`，导致迭代器检测的时候认为 `modCount` 没有变化，未能抛出异常。因此，不能依赖该异常是否抛出而进行并发修改操作，只建议用来检测并发修改的 bug。

### 安全失败
采用安全失败机制的集合容器，遍历时都是通过复制原集合内容进行遍历，避免并发修改问题，也看不到修改后的内容。如 CopyOnWriteArrayList 类。

## ArrayList 中的 modCount
之前在看源码时，注意到一个叫 `modCount` 的变量：

```java
public boolean add(E e) {
    modCount++;
    add(e, elementData, size);
    return true;
}
```

在 `ArrayList` 中，`modCount` 用于记录 `ArrayList` 结构被修改的次数，其作用主要体现在以下两个方面：

+ **实现快速失败机制**：`ArrayList` 的迭代器在遍历元素时，会检查 `modCount` 的值。如果在迭代过程中，`ArrayList` 的结构被修改（例如通过添加、删除元素等操作），`modCount` 的值会发生变化，迭代器就会检测到这种不一致，抛出 `ConcurrentModificationException` 异常，从而快速失败，避免出现不确定的结果和数据错误。这保证了在多线程环境下，当一个线程正在遍历 `ArrayList` 时，其他线程对 `ArrayList` 进行结构修改能够被及时发现。
+ **帮助追踪修改操作**：对于开发者来说，虽然通常不会直接使用 `modCount`，但它在底层帮助追踪 `ArrayList` 的修改历史。在一些需要了解集合修改情况的复杂业务场景中，这个字段可以提供一些参考信息，比如可以通过比较不同时间点的 `modCount` 值来判断集合是否发生了变化以及变化的频率等。

## ArrayList 和 LinkedList 对比

| 维度 | ArrayList | LinkedList |
| --- | --- | --- |
| 底层数据结构 | 数组，存储空间连续 | 双向链表，在物理上不连续 |
| 增删复杂度 | 尾部 O(1)，其他 O(n)，遇到扩容更高 | O(1) |
| 读写复杂度 | 利用索引 O(1)随机读 | O(n) |
| 接口实现 | List、RandomAccess（随机访问） | List、Deque（可作为队列） |
| 内存占用 | 基于数组，没有额外占用，扩容*1.5 | 需要额外空间存储节点信息 |
| 适用场景 | 读多写少、随机访问频繁、末尾添加元素 | 写多读少、不需快速随机访问、队列或栈 |


不过，因为 ArrayList 的数组变量是用 transient 关键字修饰的，如果集合本身需要做序列化操作的话，ArrayList 这部分多余的空间不会被序列化。

## ArrayList 和 Vector 对比
底层都是用 Object[] 实现，但 Vector 线程安全（通过对 add、get、remove 等方法加 synchronized 同步锁）。

## 实现 ArrayList 线程安全的方法
1. 使用 `Collections.synchronizedList()` 方法，返回一个线程安全的 List。

```java
SynchronizedList list = Collections.synchronizedList(new ArrayList());
```

2. 使用 `CopyOnWriteArrayList`。

## ArrayList 扩容过程中复制操作用的什么方法，为什么
### `Arrays.copyOf()` 和 `System.arraycopy()` 的区别
1. 所属类与方法签名

+ **`Arrays.copyOf()`**：它是 `java.util.Arrays` 类中的静态方法。其方法签名形式多样，例如 `public static <T> T[] copyOf(T[] original, int newLength)`，该方法会创建一个新数组，其长度为 `newLength`，并将原数组 `original` 的元素复制到新数组中。
+ **`System.arraycopy()`**：这是 `java.lang.System` 类中的一个静态本地方法。方法签名为 `public static native void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)`，此方法需要传入源数组、源数组起始位置、目标数组、目标数组起始位置以及要复制的元素数量。

1. 功能实现细节

+ **`Arrays.copyOf()`**：内部会先创建一个新数组，数组长度为指定的 `newLength`，然后调用 `System.arraycopy()` 方法将原数组元素复制到新数组中。若 `newLength` 大于原数组长度，新数组剩余部分会用默认值填充（对于引用类型是 `null`，对于基本数据类型是对应基本类型的默认值）；若 `newLength` 小于原数组长度，则只复制前 `newLength` 个元素。
+ **`System.arraycopy()`**：直接在源数组和目标数组之间进行元素复制，不会创建新数组，需要手动创建目标数组。它只负责元素复制，对数组边界的检查和处理需要开发者自己把控，若参数设置不当，可能会抛出 `ArrayIndexOutOfBoundsException` 或 `ArrayStoreException` 异常。

1. 易用性

+ **`Arrays.copyOf()`**：使用起来更简洁，只需提供原数组和新长度，方法会自动处理新数组的创建和元素复制，适合简单的数组复制场景。
+ **`System.arraycopy()`**：使用时参数较多，需要明确指定源数组和目标数组的起始位置以及复制的元素数量，相对复杂，但灵活性更高，适合需要精确控制复制范围和位置的场景。

### `ArrayList` 扩容时选择 `Arrays.copyOf()` 的原因
+ **代码简洁性**：`ArrayList` 扩容的核心需求是创建一个更大的新数组，并将原数组元素复制过去。`Arrays.copyOf()` 方法正好满足这一需求，只需传入原数组和新容量，就能自动完成新数组的创建和元素复制，代码简洁易读，减少了 `ArrayList` 类中的代码量。
+ **封装性**：`Arrays.copyOf()` 方法将新数组创建和元素复制的具体实现细节封装起来，`ArrayList` 无需关心内部调用 `System.arraycopy()` 的具体逻辑，降低了代码的耦合度，提高了代码的可维护性。当 `Arrays.copyOf()` 内部实现发生变化时，只要方法签名不变，`ArrayList` 代码无需修改。

## HashMap 原理
+ **数据结构**：JDK 8 之前，采用数组+链表。通过链表解决哈希冲突。JDK 8 及以后，优化了链表过长导致查找效率过低的问题，当链表长度超过 8 且数组长度大于 64 时，链表转红黑树，红黑树节点数小于等于 6 时，又会转换回链表。
+ **哈希函数**：`HashMap` 通过键的 `hashCode()` 方法获取哈希码，再经过`hash()`方法的扰动和对数组长度取模，将哈希码映射到数组的索引位置。这样能够**让哈希码更均匀地分布在数组中，减少哈希冲突**。
+ **插入操作**：当插入一个键值对时，首先计算键的哈希值，找到对应的数组索引。如果该索引位置为空，直接插入新节点；如果该位置已经有节点，则遍历链表或红黑树，若键已存在则更新其值，若不存在则插入新节点。
+ **扩容机制**：`HashMap` 有一个负载因子（默认值为 0.75），当哈希表中的元素数量超过数组长度乘以负载因子时，会触发扩容操作。扩容时会创建一个新的数组，其长度为原数组的 **2 倍**，然后将原数组中的所有键值对**重新哈希**到新数组中。

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

## HashMap 的 put 过程
![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748754140195-469345b0-86bd-4808-b4aa-7380766dbd1d.png)

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    // 如果 table 为空，先进⾏初始化
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    
    // 计算索引位置，并找到对应的桶
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null); // 如果桶为空，直接插⼊
    else {
        Node<K,V> e; K k;
        // 检查第⼀个节点是否匹配
        if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
            e = p; // 覆盖
        // 如果是树节点，放⼊树中
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        // 如果是链表，遍历插⼊到尾部
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    // 如果链表⻓度达到阈值，转换为红⿊树
                    if (binCount >= TREEIFY_THRESHOLD - 1)
                    treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash && ((k = e.key) == key || (key != null && key.equals(k))))
                    break; // 覆盖
                p = e;
            }
        }
        if (e != null) { // 如果找到匹配的 key，则覆盖旧值
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount; // 修改计数器
    if (++size > threshold)
        resize(); // 检查是否需要扩容
    afterNodeInsertion(evict);
    return null;
}
```

1. 通过 `hash()` 方法计算 key 的哈希值，减少哈希冲突。
2. 进行第一次的数组扩容。
3. 通过取模，确定索引位置，使用 `& (n - 1)` 代替 `% n` 提高运算效率。
4. 如果当前位置为空则直接插入。
5. 否则检查第一个节点的键是否匹配，匹配则覆盖。
6. 不匹配，如果是树，调用 `putTreeVal()` 方法插到树中。
7. 如果是链表，遍历覆盖匹配项或插入到末尾。
8. 链表长度达到阈值，转树。
9. 检查是否需要扩容。

## HashMap 的 putVal 方法中参数作用
```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict)
```

### **1. **`int hash`
+ **作用**：键的哈希值，通过 `hash(key)` 方法计算得到。  

将 `key.hashCode()` 的高16位与低16位异或，减少哈希冲突。  

+ **为什么不直接用 **`key.hashCode()`？  
降低哈希冲突概率，尤其当哈希表容量较小时（如16），能有效分散元素。

### **2. **`K key`
+ **作用**：要插入的键。  
+ **注意点**：  
    - 键可以为 `null`，此时哈希值为 `0`，会被固定插入到数组索引 `0` 的位置。  
    - 键的 `equals()` 方法用于判断是否已存在相同键。

### **3. **`V value`
+ **作用**：要插入的值。  
+ **注意点**：  
    - 值可以为 `null`，`HashMap` 允许存储 `null` 值。  
    - 若键已存在，新值会覆盖旧值（除非 `onlyIfAbsent` 为 `true`）。

### **4. **`boolean onlyIfAbsent`
+ **作用**：控制是否覆盖已存在的值。  
+ **逻辑**：  
    - 若为 `true`：当键已存在时，不更新值（保留旧值）。  
    - 若为 `false`：当键已存在时，用新值覆盖旧值（默认行为）。
+ **典型应用**：  
`putIfAbsent()` 方法调用时传入 `true`，避免重复更新值。

### **5. **`boolean evict`
+ **作用**：控制插入后是否执行 `afterNodeInsertion()` 回调。  
+ **逻辑**：  
    - 若为 `false`：表示处于创建模式（如 `HashMap` 的构造函数中），不执行回调。  
    - 若为 `true`：表示正常插入，可能触发 `LinkedHashMap` 的移除 eldest 元素逻辑。
+ **设计意图**：  
支持 `LinkedHashMap` 的访问顺序（如 LRU 缓存），在插入新元素后可能移除最老元素。

### **参数组合示例**
| **方法调用** | **参数值** | **行为** |
| --- | --- | --- |
| `put(key, value)` | `onlyIfAbsent=false` | 覆盖已存在的键值对。 |
| `putIfAbsent(key, value)` | `onlyIfAbsent=true` | 仅当键不存在时插入。 |
| 构造函数初始化 | `evict=false` | 不触发 `afterNodeInsertion()`。 |
| 正常插入操作 | `evict=true` | 可能触发 `LinkedHashMap` 的移除逻辑。 |


### **总结**
这些参数通过组合控制 `putVal` 的行为，使其能够服务于多种公开方法（如 `put`、`putIfAbsent`），同时支持 `LinkedHashMap` 的扩展逻辑。理解这些参数有助于深入掌握 `HashMap` 的工作机制和性能特性。

## HashMap 的查找过程
![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748755359598-84b69745-816d-487a-94b2-6324fdb84d7c.png)

1. 计算哈希值。
2. 计算数组下标，定位桶。
3. 检查第一个节点是否匹配。
4. 遍历链表或树查找。
5. 返回结果。

## 为什么 hash 函数能减少哈希冲突？
```java
static final int hash(Object key) {
    int h;
    // 如果 key 为 null，返回 0；否则，使⽤ hashCode 并进⾏扰动
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

哈希表的索引是通过 `h & (n - 1)` 计算的，n 为数组容量。n-1 和 h 做 `&` 运算，相当于截取了最低的几位。如果数组的容量很小，只取 h 的低位很容易导致哈希冲突。

通过异或将 h 的高位引入低位，增加哈希值的随机性，减少哈希冲突。

## 初始化 HashMap 时传一个 17 的容量会怎么处理
HashMap 会将容量调整到大于等于 17 的最小的 2 的幂，即 32。

![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748756313714-d0336a83-0b12-46f2-9dd9-4dbc292262fd.png)

```java
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

1. `n = cap - 1` 处理已经是 2 的幂的情况。
2. `n |= n >>> 1` 使最高位及其后一位为 1，
3. 同理，覆盖前 4 位。
4. 同理，覆盖前 8 位。
5. 同理，覆盖前 16 位。
6. 同理，覆盖前 32 位。
7. 将所有位为 1 的值加 1，得到结果。
8. 处理边界，若 `cap <= 0`，返回 1；`cap >= MAXIMUM_CAPACITY`，返回 `2^30` 防止溢出。

## TODO HashMap 扩容机制
扩容时，HashMap 会创建⼀个新的数组，其容量是原来的两倍。然后遍历旧哈希表中的元素，将其重新分配到新的哈希表中。

如果当前桶中只有⼀个元素，那么直接通过键的哈希值与数组大小取模锁定新的索引位置：`e.hash & (newCap - 1)`。 

如果当前桶是红黑树，那么会调用 `split()` 方法分裂树节点，以保证树的平衡。

如果当前桶是链表，会通过旧键的哈希值与旧的数组大小取模 `(e.hash & oldCap) == 0` 来作为判断条件，如果条件为真，元素保留在原索引的位置；否则元素移动到原索引 + 旧数组大小的位置。  

## TODO 手写 HashMap


## Hashtable 原理
+ **数据结构**：`Hashtable` 同样采用数组 + 链表的结构，通过链表解决哈希冲突。但它没有像 `HashMap` 那样在 JDK 8 引入红黑树优化。
+ **哈希函数**：`Hashtable` 也是通过键的 `hashCode()` 方法获取哈希码，然后通过取模运算将哈希码映射到数组的索引位置。
+ **插入操作**：插入键值对时，先计算键的哈希值，找到对应的数组索引。如果该索引位置为空，直接插入新节点；如果该位置已经有节点，则遍历链表，若键已存在则更新其值，若不存在则插入新节点。
+ **扩容机制**：`Hashtable` 的初始容量为 11，负载因子默认也是 0.75。当元素数量超过数组长度乘以负载因子时，会**扩容**到原数组长度的 **2 倍加 1**，然后将原数组中的所有键值对**重新哈希**到新数组中。

## HashMap 与 Hashtable 区别
+ **继承关系不同**
    - `HashMap`：是 Java 集合框架的一部分，从 JDK 1.2 开始引入。它继承自 `AbstractMap` 类，实现了 `Map` 接口。
    - `Hashtable`：是 Java 早期的类，从 JDK 1.0 就存在。它继承自 `Dictionary` 类，也实现了 `Map` 接口。不过 `Dictionary` 类已经被标记为过时，不推荐使用。
+ **线程安全性**
    - `HashMap`：是**非线程安全**的，在多线程环境下，如果多个线程同时对 `HashMap` 进行读写操作，可能会导致数据不一致、死循环等问题。
    - `Hashtable`：是**线程安全**的，它的大部分方法都使用了 `synchronized` 关键字进行**同步**，保证了在同一时刻只有一个线程可以对 `Hashtable` 进行写操作，从而避免了多线程并发访问时的数据不一致问题。但这种同步机制也带来了一定的性能开销，在单线程环境下，`Hashtable` 的性能不如 `HashMap`。
+ **键值对是否允许为 null**
    - `HashMap`：**允许键或值**为 `null`，但只能有一个 `null` 键。
    - `Hashtable`：**不允许**键或值为 `null`。如果尝试将 `null` 作为键或值放入 `Hashtable` 中，会抛出 `NullPointerException`。
+ **初始容量和扩容机制**
    - `HashMap`：默认初始容量为 16，扩容时新数组长度为原数组的 2 倍。可以通过构造函数指定初始容量和负载因子，更灵活地控制哈希表的性能。
    - `Hashtable`：默认初始容量为 11，扩容时新数组长度为原数组长度的 2 倍加 1。负载因子默认也是 0.75。
+ **对外提供的接口不同**
    - `HashMap` 比 `Hashtable` 多提供了 elements 和 contains 方法。
        1. elements 返回 Hashtable 中 value 的枚举
        2. contains(V) 返回 Hashtable 中 value 是否包含 V
+ **迭代器的一致性**
    - `HashMap`：迭代器是**弱一致性**的，在迭代过程中，如果其他线程对 `HashMap` 进行了结构上的修改（如添加或删除元素），迭代器**不会立即抛出** `ConcurrentModificationException`，但可能会出现迭代结果不准确或遍历到部分新元素的情况。
    - `Hashtable`：迭代器是**强一致性**的，在迭代过程中，如果其他线程对 `Hashtable` 进行了结构上的修改，迭代器会**立即抛出** `ConcurrentModificationException`。

## 什么是红黑树，为什么 HashMap 用红黑树？
### 红黑树结构
红黑树是一种自平衡的二叉查找树：

1. 每个节点都有颜色，红 or 黑；
2. 根节点为黑；
3. 叶子节点为黑；
4. 红色节点的子节点为黑；
5. 从任一节点到其每个叶子的所有简单路径都包含相同数目的黑色节点。

### 红黑树如何保持平衡
通过**旋转**和**染色**操作。

1. 通过左旋和右旋避免某一侧过深。
2. 重新染色来维护红黑规则，保证树的高度不会失衡。

### 为什么 HashMap 用红黑树不用别的？
+ **为什么不用二叉树？**
    - 插入的数据有序时，二叉树会退化为链表，查询效率 O(n)。
+ **为什么不用平衡二叉树？**
    - 平衡二叉树要求每个节点的左右子树高度最多差 1，能提供更平均的查找效率，但是增删元素时需要更频繁的旋转来维护树结构。
+ **为什么用红黑树？**
    - 增、改、查的复杂度都是 `O(logn)`，平衡了开销与效率。

## Dictionary 类和 AbstractMap 类的区别
### 1. 类层次结构和历史
+ **`Dictionary` 类**：它是一个抽象类，在 Java 1.0 中就已经存在，是早期 Java 集合框架的一部分。`Dictionary` 类是 `Hashtable` 类的父类。然而，随着 Java 集合框架的发展，`Dictionary` 类逐渐被弃用，因为它的设计存在一些局限性，并且新的集合框架提供了更强大和灵活的接口与类。
+ **`AbstractMap` 类**：它是 Java 集合框架（从 Java 1.2 开始引入）中的一部分，实现了 `Map` 接口的大部分通用功能。`AbstractMap` 为具体的 `Map` 实现类（如 `HashMap`、`TreeMap` 等）提供了一个便利的基础，使得这些类只需实现少量的抽象方法，就可以拥有完整的 `Map` 功能。

### 2. 功能特性
+ **`Dictionary` 类**：它定义了一组基本的方法来操作键值对，如 `put`、`get`、`remove`、`isEmpty`、`size` 等。但 `Dictionary` 类缺乏一些现代集合框架中 `Map` 接口所具有的重要特性，例如它没有迭代器相关的方法，遍历键值对相对不便。此外，`Dictionary` 类没有明确区分 `null` 键和 `null` 值的处理方式，不像现代 `Map` 实现那样灵活。
+ **`AbstractMap` 类**：实现了 `Map` 接口，支持完整的键值对操作。它提供了迭代器相关的实现，方便遍历 `Map` 中的键、值或键值对。`AbstractMap` 类允许 `null` 键和 `null` 值（具体取决于具体的实现类，如 `HashMap` 允许 `null` 键和 `null` 值，而 `TreeMap` 不允许 `null` 键），并且在处理键值对的各种操作上更加灵活和全面。例如，`AbstractMap` 提供了 `entrySet`、`keySet` 和 `values` 方法，这些方法返回的集合对象支持迭代操作，极大地方便了对 `Map` 数据的遍历和处理。

### 3. 使用场景
+ **`Dictionary` 类**：由于其历史原因和功能局限性，在新的 Java 代码中很少直接使用 `Dictionary` 类。但在一些需要兼容旧代码的场景中，可能会遇到 `Dictionary` 类的子类（如 `Hashtable`）。
+ **`AbstractMap` 类**：它是实现自定义 `Map` 类的常用基础类。当你想要创建一个新的 `Map` 实现时，可以继承 `AbstractMap` 类，然后根据需求实现抽象方法，从而快速实现一个功能完整的 `Map`。在实际开发中，Java 开发者更倾向于使用基于 `AbstractMap` 的具体实现类（如 `HashMap`、`TreeMap` 等）来处理键值对数据，因为这些类已经经过了充分的测试和优化，并且提供了丰富的功能。

## 为什么 HashMap 树退化成链表的阈值是小于等于 6 而不是 7
为了避免频繁的树化和链表化操作。将退化阈值设为 6，中间有一个差值，可以减少这种频繁转换的情况，提高性能。

## HashMap 为什么是线程不安全的，如何解决
+ **线程不安全原因**
    - **多线程同时扩容导致死循环**：在 JDK 7 及以前，`HashMap` 扩容采用头插法，多线程同时扩容时，可能会使链表形成环形结构，导致后续查询出现死循环。
    - **数据覆盖问题**：多个线程同时执行 `put` 操作，若两个键的哈希值相同，可能会出现其中一个线程的数据被另一个线程覆盖的情况。
    - **数据丢失**：多线程进行 `put` 操作时，若同时触发扩容，可能会导致部分数据丢失。
+ **解决方法**
    - **使用 `Hashtable`**：它是线程安全的，但由于所有方法都加了 `synchronized` 锁，性能较低。
    - **使用* `**Collections.synchronizedMap()`**：将 `HashMap` 包装成线程安全的 `Map`，但本质也是对所有操作加了同步锁，性能不高。
    - **使用 `ConcurrentHashMap`**：在 JDK 7 中采用分段锁机制，JDK 8 中采用 CAS + `synchronized` 机制，性能较好。

## LinkedHashMap 怎么实现有序的？
LinkedHashMap 维护了一个双向链表，通过 before 和 after 标识前置节点和后置节点，从而实现插入顺序或访问顺序。

![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748758208681-860b9cc9-509e-4e31-87b1-e95ad429e573.png)



## 对 TreeMap 的了解
+ **底层结构**：`TreeMap`** 基于红黑树**（一种自平衡的二叉搜索树）实现，每个键值对作为一个节点存储在红黑树中。
+ **排序特性**：`TreeMap` 会根据键的自然顺序或者指定的比较器进行排序。如果键实现了 `Comparable` 接口，就按自然顺序排序；也可以在创建 `TreeMap` 时传入一个 `Comparator` 来指定排序规则。
+ **性能特点**：插入、删除和查找操作的时间复杂度为 $O(log n)$，因为红黑树能保证树的高度始终保持在 $O(log n)$ 级别，通过旋转和染色保持平衡。查找的时候从根节点开始，利用二叉查找树的特点，向左或右子树递归查找，直到找到目标元素。
+ **使用场景**：适用于需要对键进行排序的场景，如按时间顺序存储数据、按字母顺序存储字符串等。

## 哪些 Map 是有序的
+ **`LinkedHashMap`**：继承自 `HashMap`，通过维护一个双向链表来保证元素的插入顺序或者访问顺序。当 `accessOrder` 为 `false`（默认）时，按插入顺序；为 `true` 时，按访问顺序。
+ **`TreeMap`**：基于红黑树实现，会根据键的自然顺序或指定的比较器进行排序。

## 哪些集合底层用的是链表
+ **`**LinkedList`**：是一个双向链表实现的 `List` 集合，支持高效的插入和删除操作，尤其是在列表的头部和尾部。
+ **`LinkedHashMap`**：继承自 `HashMap`，在 `HashMap` 的基础上维护了一个双向链表，用于记录元素的插入顺序或访问顺序。
+ **`LinkedHashSet`**：继承自 `HashSet`，内部使用 `LinkedHashMap` 来存储元素，因此也基于链表结构，能保证元素的插入顺序。

## RandomAccess 接口
在Java集合框架中，`RandomAccess`接口的设计初衷是为了**标识特定数据结构是否支持高效的随机访问**，从而允许算法根据这一特性选择最优的遍历策略。虽然数据结构本身的特性决定了能否随机访问，但通过接口显式声明这一能力可以带来以下优势：

### **1. 数据结构的访问特性差异**
不同的数据结构对元素的访问效率存在显著差异：

+ **随机访问（Random Access）**：  
通过索引直接访问元素，时间复杂度为O(1)。例如：  

```java
List<Integer> list = new ArrayList<>();
int value = list.get(5); // 直接定位到第5个元素
```

+ **顺序访问（Sequential Access）**：  
需要从头开始遍历至目标位置，时间复杂度为O(n)。例如：  

```java
List<Integer> list = new LinkedList<>();
int value = list.get(5); // 需要从头节点遍历5次
```

### **2. 接口的作用：为算法提供优化提示**
`RandomAccess` 是一个**标记接口**（Marker Interface），本身不包含任何方法，但它允许算法在运行时判断集合类型，从而选择最优的遍历策略。例如，`Collections` 工具类中的 `binarySearch` 方法：

```java
public static <T> int binarySearch(List<? extends Comparable<? super T>> list, T key) {
    if (list instanceof RandomAccess || list.size() < BINARYSEARCH_THRESHOLD)
        return Collections.indexedBinarySearch(list, key);
    else
        return Collections.iteratorBinarySearch(list, key);
}
```

+ **当列表实现了**`RandomAccess`（如`ArrayList`）：  
使用索引遍历（`indexedBinarySearch`），直接通过索引定位元素，效率高。  
+ **当列表未实现**`RandomAccess`（如`LinkedList`）：  
使用迭代器遍历（`iteratorBinarySearch`），避免因频繁随机访问导致的性能开销。

### **3. 为什么不直接依赖数据结构类型？**
+ **灵活性与扩展性**：  
通过接口而非具体类判断，允许未来新增的集合类（如自定义列表）通过实现 `RandomAccess` 来声明其随机访问能力，而无需修改算法代码。  
例如，即使是自定义的列表类，只要支持高效随机访问，实现该接口后即可享受优化算法的福利。
+ **统一遍历逻辑**：  
算法可以针对接口而非具体类编写，增强通用性。例如：  

```java
public static void traverse(List<?> list) {
    if (list instanceof RandomAccess) {
        // 使用for循环遍历（随机访问效率高）
        for (int i = 0; i < list.size(); i++) {
            // ...
        }
    } else {
        // 使用迭代器遍历（顺序访问更适合链表）
        for (Iterator<?> it = list.iterator(); it.hasNext(); ) {
            // ...
        }
    }
}
```

### **4. 典型应用场景**
+ **集合框架中的算法优化**：  
如 `Collections.sort()`、`binarySearch()` 等方法会根据 `RandomAccess` 选择最优实现。
+ **自定义集合类的设计**：  
当开发新的列表实现时，若支持高效随机访问，应实现该接口以提示算法使用更优的遍历策略。

### **5. 常见实现类对比**
| **集合类** | **是否实现RandomAccess** | **访问特性** |
| --- | --- | --- |
| `ArrayList` | ✅ | 数组实现，随机访问 |
| `Vector` | ✅ | 同步数组，随机访问 |
| `CopyOnWriteArrayList` | ✅ | 写时复制数组，随机访问 |
| `LinkedList` | ❌ | 双向链表，顺序访问 |
| `SubList` | 继承底层列表的特性 | 可能支持随机访问 |


### **总结**
设计 `RandomAccess` 接口的核心目的是：  
**通过接口标记，让算法能够在运行时动态选择最优的遍历策略，从而充分发挥不同数据结构的性能优势**。  

虽然数据结构本身的特性决定了能否随机访问，但接口的存在使得这种能力可以被标准化识别和利用，体现了Java集合框架设计的灵活性与前瞻性。

## HashSet 的底层实现
底层基于 HashMap 实现，值由一个固定的 Object 对象填充。

```java
public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
{
    static final long serialVersionUID = -5024744406713321676L;
    private transient HashMap<E,Object> map;
    // Dummy value to associate with an Object in the backing Map
    private static final Object PRESENT = new Object();
    // ……
}
```

## HashSet 怎么判断元素重复，重复了是否 put
```java
public boolean add(E e) {
    return map.put(e, PRESENT) == null;
}
```

HashSet 的 add 方法是通过调用 HashMap 的 put 实现的，所以还是 HashMap 的实现逻辑。











