## 类加载器的分类
+ <font style="background-color:rgba(255, 255, 255, 0);">类加载器是 JVM 中负责加载类的组件。它将类的字节码从文件系统或网络等位置加载到 JVM 中，并将其解析成 JVM 能够理解的运行时数据结构。</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">主要有以下几种类型的类加载器：</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">启动类加载器（Bootstrap ClassLoader）</font>**<font style="background-color:rgba(255, 255, 255, 0);">：是最顶层的类加载器，由 C++ 实现，负责加载 Java 核心类库，如</font>`<font style="background-color:rgba(255, 255, 255, 0);">java.lang</font>`<font style="background-color:rgba(255, 255, 255, 0);">包下的类。</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">扩展类加载器（Extension ClassLoader）</font>**<font style="background-color:rgba(255, 255, 255, 0);">：负责加载 Java 的扩展类库，如</font>`<font style="background-color:rgba(255, 255, 255, 0);">jre/lib/ext</font>`<font style="background-color:rgba(255, 255, 255, 0);">目录下的类。</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">应用程序类加载器（AppClassLoader）</font>**<font style="background-color:rgba(255, 255, 255, 0);">：也称为系统类加载器，负责加载应用程序的类路径下的类，是大多数 Java 应用中自定义类的默认类加载器。</font>

### <font style="color:rgb(0, 0, 0);">启动类加载器（Bootstrap Class Loader）</font>
+ 它是 JVM 中最顶层的类加载器，由 C++ 语言实现，负责加载 Java 核心类库，如 `java.lang`、`java.util`、`java.io` 等。这些类库位于 JDK 的 `jre/lib` 目录下，是 Java 运行时必不可少的基础类。
+ 启动类加载器比较特殊，它没有父类加载器，因为它是最顶层的类加载器。

### <font style="color:rgb(0, 0, 0);">扩展类加载器（Extension Class Loader）</font>
+ 扩展类加载器由 Java 语言实现，父类加载器是启动类加载器。它负责加载 JDK 扩展目录 `jre/lib/ext` 中的类库，以及 `java.ext.dirs` 系统属性指定的目录中的类。
+ 可以通过扩展类加载器来加载一些通用的、可扩展的类库，以便在多个应用程序中共享使用。

### <font style="color:rgb(0, 0, 0);">应用程序类加载器（Application Class Loader）</font>
+ 也称为系统类加载器，同样由 Java 语言实现，父类加载器是扩展类加载器。它是 ClassLoader 类中的 `getSystemClassLoader()` 方法返回的类加载器，负责加载应用程序的类路径（classpath）下的所有类。
+ 应用程序中的自定义类和第三方类库通常都是由应用程序类加载器来加载的。

### <font style="color:rgb(0, 0, 0);">自定义类加载器（Custom Class Loader）</font>
+ 开发人员可以根据自己的需求自定义类加载器，通过继承 `java.lang.ClassLoader` 类来实现。自定义类加载器可以实现一些特殊的类加载逻辑，比如从网络、数据库等非传统的存储位置加载类，或者对类进行加密、解密等特殊处理。
+ 自定义类加载器的父类加载器通常是应用程序类加载器，当然也可以在创建自定义类加载器时指定其他类加载器作为父类加载器。



不同的类加载器负责不同范围的类加载任务，它们之间形成了一种层次结构，这种结构被称为类加载器的双亲委派模型，保证了类加载的安全性和有序性。

## <font style="background-color:rgba(255, 255, 255, 0);">什么是双亲委派模型</font>
+ **<font style="background-color:rgba(255, 255, 255, 0);">定义</font>**<font style="background-color:rgba(255, 255, 255, 0);">：双亲委派模型是一种类加载器的工作模式。当一个类加载器收到类加载请求时，它首先不会自己去尝试加载这个类，而是把请求委托给父类加载器去完成，依次向上，直到顶层的启动类加载器。只有当父类加载器无法完成加载任务时，子类加载器才会尝试自己去加载。</font>
+ **<font style="background-color:rgba(255, 255, 255, 0);">作用</font>**<font style="background-color:rgba(255, 255, 255, 0);">：保证了 Java 核心类库的安全性和唯一性，避免了不同类加载器对同一核心类的重复加载，也防止了用户自定义的类覆盖核心类库中的类。</font>

## <font style="background-color:rgba(255, 255, 255, 0);">如何自己实现一个 String，并让 JVM 加载这个 String</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">首先，不能直接实现一个完全等同于 Java 标准库中的</font>`<font style="background-color:rgba(255, 255, 255, 0);">String</font>`<font style="background-color:rgba(255, 255, 255, 0);">类，因为</font>`<font style="background-color:rgba(255, 255, 255, 0);">String</font>`<font style="background-color:rgba(255, 255, 255, 0);">类在 Java 中是</font>`<font style="background-color:rgba(255, 255, 255, 0);">final</font>`<font style="background-color:rgba(255, 255, 255, 0);">类型，不能被继承和重写。</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">若要自定义一个类似</font>`<font style="background-color:rgba(255, 255, 255, 0);">String</font>`<font style="background-color:rgba(255, 255, 255, 0);">功能的类，比如命名为</font>`<font style="background-color:rgba(255, 255, 255, 0);">MyString</font>`<font style="background-color:rgba(255, 255, 255, 0);">，可以通过实现</font>`<font style="background-color:rgba(255, 255, 255, 0);">Serializable</font>`<font style="background-color:rgba(255, 255, 255, 0);">接口、</font>`<font style="background-color:rgba(255, 255, 255, 0);">Comparable</font>`<font style="background-color:rgba(255, 255, 255, 0);">接口等，来实现字符串的基本功能，如存储字符序列、实现比较、序列化等操作。</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">让 JVM 加载自定义的</font>`<font style="background-color:rgba(255, 255, 255, 0);">MyString</font>`<font style="background-color:rgba(255, 255, 255, 0);">类，需要通过类加载器。可以自定义一个类加载器，继承自</font>`<font style="background-color:rgba(255, 255, 255, 0);">ClassLoader</font>`<font style="background-color:rgba(255, 255, 255, 0);">类，重写</font>`<font style="background-color:rgba(255, 255, 255, 0);">findClass</font>`<font style="background-color:rgba(255, 255, 255, 0);">方法，在该方法中通过读取字节码文件等方式将</font>`<font style="background-color:rgba(255, 255, 255, 0);">MyString</font>`<font style="background-color:rgba(255, 255, 255, 0);">类的字节码加载到 JVM 中。</font>

## <font style="background-color:rgba(255, 255, 255, 0);">如何破坏双亲委派机制</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">自定义类加载器，重写</font>`<font style="background-color:rgba(255, 255, 255, 0);">loadClass</font>`<font style="background-color:rgba(255, 255, 255, 0);">方法，在方法中不调用父类加载器的</font>`<font style="background-color:rgba(255, 255, 255, 0);">loadClass</font>`<font style="background-color:rgba(255, 255, 255, 0);">方法，而是直接自己加载类。例如，在一些框架中，如 Tomcat，为了实现不同 Web 应用之间的类隔离，会自定义类加载器，打破双亲委派机制，使得每个 Web 应用可以有自己独立的类加载体系，避免类冲突。</font>

## <font style="background-color:rgba(255, 255, 255, 0);">JVM 内存结构</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">线程共享</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">Java 堆</font>**<font style="background-color:rgba(255, 255, 255, 0);">：是 JVM 所管理的内存中最大的一块，被所有线程共享。堆是存放对象实例以及数组的地方，几乎所有的对象实例和数组都在堆上分配内存。</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">方法区</font>**<font style="background-color:rgba(255, 255, 255, 0);">：被所有线程共享，用于存储已被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据。</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">线程独占</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">程序计数器</font>**<font style="background-color:rgba(255, 255, 255, 0);">：是一块较小的内存空间，它可以看作是当前线程所执行的字节码的行号指示器。每个线程都有一个独立的程序计数器，各个线程之间的计数器互不影响，独立存储。</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">Java 虚拟机栈</font>**<font style="background-color:rgba(255, 255, 255, 0);">：线程私有的，它的生命周期与线程相同。虚拟机栈描述的是 Java 方法执行的内存模型，每个方法在执行的同时都会创建一个栈帧，用于存储局部变量表、操作数栈、动态链接、方法出口等信息。</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">本地方法栈</font>**<font style="background-color:rgba(255, 255, 255, 0);">：与 Java 虚拟机栈类似，只不过它是为 Native 方法服务的。</font>
+ <font style="background-color:rgba(255, 255, 255, 0);">本地内存</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">直接内存</font>**<font style="background-color:rgba(255, 255, 255, 0);">（Direct Memory）：由 NIO（New Input/Output）直接分配，不受 JVM 堆的管理，通常用于高性能数据传输，如缓冲区（Buffer）。这个内存结构保证了 JVM 在执行 Java 代码时能够高效管理对象、执行方法调用，并支持多线程并发。</font>

## <font style="background-color:rgba(255, 255, 255, 0);">堆内存中新生代和老年代的区别</font>
+ **<font style="background-color:rgba(255, 255, 255, 0);">新生代</font>**<font style="background-color:rgba(255, 255, 255, 0);">：</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">新生的对象首先会分配在新生代。</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">新生代分为 Eden 区和两个 Survivor 区（一般称为 From 区和 To 区）。</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">新生代的特点是对象朝生夕灭，大部分对象的生命周期很短，经过几次垃圾回收后，仍然存活的对象会被晋升到老年代。</font>
+ **<font style="background-color:rgba(255, 255, 255, 0);">老年代</font>**<font style="background-color:rgba(255, 255, 255, 0);">：</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">存储经过多次垃圾回收后仍然存活的对象。</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">老年代的空间一般比新生代大，垃圾回收的频率相对新生代要低。</font>

## <font style="background-color:rgba(255, 255, 255, 0);">JVM 垃圾回收</font>
+ **<font style="background-color:rgba(255, 255, 255, 0);">垃圾回收的概念</font>**<font style="background-color:rgba(255, 255, 255, 0);">：JVM 会自动管理内存，通过垃圾回收机制来回收不再被使用的对象所占用的内存空间，以避免内存泄漏和内存溢出，提高内存的利用率。</font>
+ **<font style="background-color:rgba(255, 255, 255, 0);">垃圾回收算法</font>**<font style="background-color:rgba(255, 255, 255, 0);">：</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">标记 - 清除算法</font>**<font style="background-color:rgba(255, 255, 255, 0);">：首先标记出所有需要回收的对象，在标记完成后，统一回收所有被标记的对象。缺点是会产生内存碎片。</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">复制算法</font>**<font style="background-color:rgba(255, 255, 255, 0);">：将内存分为大小相等的两块，每次只使用其中一块，当这一块内存用完后，将存活的对象复制到另一块空的内存中，然后将原来的内存空间一次性清理掉。适用于新生代，因为新生代中对象存活率低。</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">标记 - 压缩算法</font>**<font style="background-color:rgba(255, 255, 255, 0);">：先标记出所有需要回收的对象，然后将存活的对象向一端移动，最后清理掉边界以外的内存。解决了标记 - 清除算法的内存碎片问题。</font>
    - **<font style="background-color:rgba(255, 255, 255, 0);">分代收集算法</font>**<font style="background-color:rgba(255, 255, 255, 0);">：根据对象的生命周期不同，将堆内存分为新生代和老年代，针对不同代采用不同的垃圾回收算法。新生代使用复制算法，老年代使用标记 - 压缩或标记 - 清除算法。</font>
+ **<font style="background-color:rgba(255, 255, 255, 0);">垃圾回收的触发条件</font>**<font style="background-color:rgba(255, 255, 255, 0);">：当新生代或老年代的内存空间不足时，会触发垃圾回收。此外，也可以通过调用</font>`<font style="background-color:rgba(255, 255, 255, 0);">System.gc()</font>`<font style="background-color:rgba(255, 255, 255, 0);">方法来建议 JVM 进行垃圾回收，但这只是一个建议，JVM 不一定会立即执行。</font>

