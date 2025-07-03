## Integer 和 int 区别
+ **类型**：`int` 是基本数据类型，`Integer` 是 `int` 对应的包装类，属于引用类型。
+ **默认值**：`int` 默认值是 0，`Integer` 默认值是 `null`。
+ **内存存储**：`int` 直接存储数值，`Integer` 对象存储在堆中，需要通过引用访问。
+ **使用场景**：`int` 用于普通数值计算，`Integer` 用于泛型、集合等场景。

## 封装继承多态
+ **封装**：将数据和操作数据的方法绑定在一起，隐藏对象的内部实现细节，只对外提供必要的接口。例如，类中的私有属性通过公共的 getter 和 setter 方法访问。
+ **继承**：一个类可以继承另一个类的属性和方法，被继承的类称为父类（超类），继承的类称为子类。子类可以扩展父类的功能，也可以重写父类的方法。
+ **多态**：同一操作作用于不同的对象，可以有不同的表现形式。多态通过继承、接口实现和方法重写来实现，主要分为编译时多态（方法重载）和运行时多态（方法重写）。

## jdk 和 jre 的区别，运行一个 jar 包只安装 jre 是否可以
+ **区别**：JDK（Java Development Kit）是 Java **开发工具包**，包含了 JRE 和一系列开发工具，如编译器 `javac` 等。JRE（Java Runtime Environment）是 Java **运行时环境**，提供了运行 Java 程序所需的所有组件，包括 Java 虚拟机（JVM）、Java 核心类库等。
+ **运行 jar 包**：只安装 JRE 通常可以运行一个已经编译好的 `jar` 包，因为 `jar` 包是已经编译好的 Java 程序，只需要 JRE 提供的运行环境即可。

## == 和 equals 的区别
== 比较地址（引用类型）或值（基本数据类型），equals 比较值。

可以重写 equals 方法。

+ `**==**`**为**`**true**`**时，**`**equals**`**一定为**`**true**`：当使用 `==` 比较两个对象时，如果结果为 `true`，表示这两个对象引用指向的是同一个内存地址，即它们是同一个对象。在这种情况下，调用 `equals` 方法比较这两个对象，由于它们是同一个对象，`equals` 方法通常（默认实现或未被重写时）也会返回 `true`。因为默认的 `equals` 方法就是基于对象的内存地址进行比较的，与 `==` 的比较结果一致。
+ `**equals**`**为**`**true**`**时，**`**==**`**不一定为**`**true**`：当 `equals` 方法被重写后，它的比较逻辑可能不再基于对象的内存地址，而是基于对象的某些属性值。例如，在 `String` 类中，`equals` 方法被重写为比较字符串的内容是否相等。所以，即使两个 `String` 对象的引用不同（即 `==` 比较为 `false`），但如果它们的内容相同，`equals` 方法也会返回 `true`。

## final 的作用
+ final 修饰的方法不能被重写
+ final 修饰的类不能被继承
+ final 修饰的变量不能被改变

## String 类的常用方法
+ **长度获取**：`length()`，返回字符串的长度。
+ **拼接**：`concat()` 或 `+` 运算符，用于拼接字符串。
+ **查找**：`indexOf()` 查找字符或子字符串第一次出现的位置，`lastIndexOf()` 查找最后一次出现的位置。
+ **截取**：`substring()` 截取子字符串。
+ **替换**：`replace()` 替换字符串中的字符或子字符串。
    - replace()：替换所有匹配的内容，不支持正则表达式。
    - replaceAll()：替换所有，支持正则表达式。
    - replaceFirst()：只替换第一个匹配的内容。
+ **比较**：`equals()` 比较字符串内容是否相等，`compareTo()` 按字典顺序比较字符串。
+ **大小写转换**：`toUpperCase()` 转换为大写，`toLowerCase()` 转换为小写。
+ **去除首尾空格**：`trim()` 去除字符串首尾的空格。

## 抽象类和普通类的区别
+ **抽象方法**：抽象类可以包含抽象方法（只有方法声明，没有方法体），普通类不能包含抽象方法。
+ **实例化**：抽象类不能被实例化，只能被继承；普通类可以直接实例化。
+ **设计目的**：抽象类用于定义一组相关类的公共行为和属性，作为子类的基类；普通类用于实现具体的功能。

## 一个类继承抽象类，必须重写所有方法吗
不一定。如果子类是**抽象类**，那么**可以不**重写父类的抽象方法；如果子类是**普通类**，则**必须**重写抽象父类的**所有**抽象方法，否则会编译报错。

## 抽象类和接口的区别
### 设计理念差异
+ **抽象类**：体现**模板式设计**，用于定义**一组相关类的公共模板**（如“动物”抽象类）。  
    - 强调“**is-a**”关系（子类是抽象类的一种具体实现）。  
    - 允许包含**部分实现的方法**（非抽象方法），子类可直接复用。
+ **接口**：体现**契约式设计**，用于定义**能力或协议的规范**（如“飞行”接口）。 
    - 强调“**can-do**”关系（实现类具备接口定义的能力）。  
    - 所有方法**必须为抽象方法**（Java 8+ 允许默认方法和静态方法，但本质仍是规范）。

### 语法规则对比
| **维度** | **抽象类** | **接口** |
| --- | --- | --- |
| **关键字** | `abstract class` | `interface` |
| **继承/实现** | 子类用`extends`继承，**单继承** | 类用`implements`实现，**可实现多个接口** |
| **成员变量** | 可包含普通成员变量（实例变量/静态变量） | 成员变量默认是`public static final`常量 |
| **方法类型** | 可包含抽象方法（`abstract`修饰）和非抽象方法 | 方法默认是`public abstract`（Java 8+允许`default`/`static`方法） |
| **构造方法** | 可包含构造方法（供子类调用初始化） | **无构造方法**（非类，无法实例化） |
| **访问修饰符** | 抽象方法可用`protected`等修饰 | 方法默认`public`，不可使用`protected`等 |


### 适用场景选择
+ **优先使用抽象类的场景**：  
    1. 存在**公共实现逻辑**需要复用（如非抽象方法）。  
    2. 类之间有**强“is-a”继承关系**（如“哺乳动物”是“动物”的子类）。  
    3. 需要为子类提供**默认行为**（可通过抽象类的非抽象方法实现）。
+ **优先使用接口的场景**：  
    1. 定义**跨领域的能力契约**（如“支付接口”可被电商、金融等不同模块实现）。  
    2. 需要实现**多态的横向扩展**（如“鸟类”和“飞机”均可实现“飞行接口”）。  
    3. 要求实现类**必须遵循特定规范**（如接口方法强制子类实现）。

### 核心设计原则体现
+ **抽象类**：符合**模板方法模式**，通过继承复用代码，适用于纵向类层次结构设计。  
+ **接口**：符合**策略模式**和**依赖倒置原则**，通过组合（实现接口）解耦，适用于横向能力扩展。

### 使用建议
+ **组合使用场景**：抽象类可实现接口（如`AbstractList`实现`List`接口），兼顾代码复用与契约规范。  
+ **避免滥用继承**：优先用接口定义能力，通过组合（如`类持有接口实例`）实现功能，减少继承层级带来的耦合。  
+ **本质区别**：抽象类是“**模板的具象化**”，接口是“**契约的标准化**”，根据设计目标选择合适的抽象机制。

## 重载和重写的区别
+ **定义位置**：重载发生在同一个类中，重写发生在子类和父类之间。
+ **方法签名**：重载要求方法名相同，但参数列表不同（参数个数、类型或顺序不同），与返回值类型无关；重写要求方法名、参数列表和返回值类型都相同（子类方法返回值可以是父类方法返回值的子类）。
+ **访问修饰符**：重载对访问修饰符没有要求；重写时子类方法的访问修饰符不能比父类方法更严格。
+ **异常处理**：重载与异常无关；重写时子类方法抛出的异常不能比父类方法抛出的异常更宽泛。

## 关于静态变量、静态代码块、构造函数的执行顺序
```java
class A {
    public static int a = 1;

    static {
        a = 2;
    }

    public A(int a) {
        A.a = a;
    }

    public A() {
    }
}
public class Example {
    public static void main(String[] args) {
        A a = new A(3);
        System.out.println(A.a); // 输出 3
    }
}
```

这种说法基本正确，下面为你详细解释类 `A` 中各部分的执行顺序：

1. **静态变量的分配空间与默认初始化**

在 Java 里，当一个类被加载时，首先会为类的静态变量分配内存空间，并赋予默认的初始值。对于 `class A` 而言，`public static int a = 1;` 这行代码，会先为静态变量 `a` 分配内存空间，然后将其默认初始化为 `0`（`int` 类型的默认值）。

2. **静态代码块与静态变量显式初始化**

静态代码块和静态变量的显式初始化是按照它们在类中出现的顺序依次执行的。在 `class A` 中，`public static int a = 1;` 会将 `a` 的值显式初始化为 `1`，接着执行静态代码块 `static { a = 2; }`，把 `a` 的值更新为 `2`。所以，在类加载完成后，静态变量 `a` 的值为 `2`。

3. **构造函数的执行**

只有在创建类的实例时，构造函数才会被调用。在 `class A` 中，有两个构造函数：一个是带参数的构造函数 `public A(int a) { A.a = a; }`，另一个是无参构造函数 `public A() { }`。当使用 `new` 关键字创建 `A` 类的对象时，对应的构造函数会被执行。例如，若执行 `A obj = new A(3);`，则会调用带参数的构造函数，将静态变量 `a` 的值更新为 `3`。

综上所述，对于类 `A` 来说，执行顺序确实是静态变量分配空间与默认初始化 -> 静态变量显式初始化和静态代码块（按出现顺序执行） -> 构造函数（创建实例时执行）。你提到的 “`static int -> static{} -> 构造函数`” 大致符合执行顺序，但要注意静态变量还有默认初始化这一步骤。

## getDeclaredMethods 方法有什么作用
+ `getDeclaredMethods`是`java.lang.Class`类的方法。
+ 该方法用于获取该类或接口声明的所有方法，包括公共、保护、默认（包）访问和私有方法，但不包括从超类或接口继承的方法。它返回一个`Method`数组，数组中的每个元素代表一个声明的方法。通过这个方法，开发者可以在运行时动态地获取类中定义的方法信息，进而可以通过反射机制来调用这些方法，实现一些灵活的编程需求，例如在框架开发中，可能需要根据配置信息动态调用某个类的特定方法，就可以使用`getDeclaredMethods`来获取方法并进行调用。

## jdk8 和 jdk17 的新特性
[https://javaguide.cn/java/new-features/java8-common-new-features.html](https://javaguide.cn/java/new-features/java8-common-new-features.html)

[https://javaguide.cn/java/new-features/java17.html](https://javaguide.cn/java/new-features/java17.html)

## float 和 double 的区别
在Java中，`float`和`double`都是用于表示浮点数的数据类型，但它们存在一些重要区别：

1. **精度**
    - `float`是单精度浮点数，使用32位（4字节）来存储数据。它可以精确到大约6 - 7位有效数字 。例如，`float f = 123456.789f;`，实际存储的值可能会与该精确值有细微偏差。
    - `double`是双精度浮点数，使用64位（8字节）来存储数据。它可以精确到大约15 - 17位有效数字。例如，`double d = 123456.789;`，相比`float`，`double`能够更精确地表示这个数值。
2. **取值范围**
    - `float` 的取值范围约为 $±3.40282347E + 38$，这意味着它能表示非常大或非常小的数值，但精度有限。
    - `double` 的取值范围约为 $±1.79769313486231570E + 308$，取值范围比 `float` 大得多。

## 金融计算不使用`float`和`double`的原因
实际上，在金融相关计算中**不推荐使用 `float` 和 `double`**，而通常使用 **`BigDecimal`**。原因如下：

1. **精度问题**：金融计算对精度要求极高，`float`和`double`都是以二进制形式存储小数，许多十进制小数无法精确地用二进制表示。例如，`0.1`在十进制中是一个简单的小数，但在二进制中是一个无限循环小数。这就导致在使用`float`或`double`进行金融计算时，可能会出现舍入误差，随着计算的累积，这些误差可能会导致严重的错误。例如，多次计算利息、汇率转换等操作时，误差可能会使最终结果与预期相差较大。
2. **商业合规性**：金融领域有严格的法规和合规要求，需要保证计算结果的精确性和一致性。使用`float`和`double`可能导致的精度问题无法满足这些要求，而`BigDecimal`提供了精确的小数运算，通过指定舍入模式，可以满足不同金融场景下对精度的严格要求，确保计算结果的准确性和可重复性。

因此，在金融相关计算中，`BigDecimal`才是正确的选择，而不是`float`或`double`。例如：

```java
import java.math.BigDecimal;

public class FinancialCalculation {
    public static void main(String[] args) {
        BigDecimal amount1 = new BigDecimal("10.50");
        BigDecimal amount2 = new BigDecimal("5.25");
        BigDecimal result = amount1.add(amount2);
        System.out.println("Sum: " + result);
    }
}
```

在上述代码中，使用`BigDecimal`进行精确的小数加法运算，避免了`float`和`double`可能带来的精度问题。

## 怎么理解 Java 中的双冒号 ::
在 Java 中，双冒号 `::` 是方法引用运算符，用于引用方法而不是调用方法。它可以简化代码，使代码更加简洁易读。

### 静态方法引用
```java
public class Main {
    public static void print(String str) {
        System.out.println(str);
    }

    public static void main(String[] args) {
        Consumer<String> consumer = Main::print;
        consumer.accept("Hello World");
    }
}
```

### 实例方法引用
```java
public class Main {
    public void print(String str) {
        System.out.println(str);
    }

    public static void main(String[] args) {
        Main m = new Main();
        Consumer<String> consumer = m::print;
        consumer.accept("Hello World");
    }
}
```

`Consumer` 是 Java 8 引入的一个函数式接口，定义了一个 accept 方法，接受一个参数且不返回值。通过方法引用，可以简介地将已有的方法适配到函数式接口的要求上。

### 构造方法引用
```java
public class Example {
    private String str;

    public Example() {
        this.str = "Default Value";
    }

    public Example(String str) {
        this.str = str;
    }

    public static void main(String[] args) {
        Supplier<Example> supplier = Example::new;
        Example example = supplier.get();
        System.out.println(example.str); // 输出Default Value
    }
}
```

## Java 创建对象有几种方式？
1. new 创建新对象
2. 通过反射机制
    1. Student.class.newInstance()
    2. Student.class.getConstructor.newInstance()
3. 采用 clone 机制
    1. 实现 Cloneable 接口并复写 Object 的 clone 方法
    2. new Student().clone()
4. 通过反序列化机制
    1. 序列化：指把 Java 对象转换成字节序列的过程
    2. 反序列化：指把字节序列恢复为 Java 对象的过程
    3. 调用 ObjectInputStream 类的 readObject() 方法
5. 方法句柄，可以间接地采用构造函数来创建对象，类似于反射
    1. 使用了 MethodHandles.lookup().findContructor() 方法来获取构造函数的方法句柄，然后通过 invoke() 方法调用构造函数来创建对象

## 关于 IntegerCache
`IntegerCache`缓存的 -128 到 127 这 256 个 `Integer` 对象都在堆内存中。

在类加载阶段，这些缓存对象就会被创建并存储在堆内存中。

## Java 常见的运行时异常
运行时异常（Runtime Exception）是在程序运行过程中可能会抛出的异常，它们通常是由程序错误或逻辑错误导致的，而不是由于外部环境或输入数据引起的。以下是一些常见的运行时异常：

1. NullPointerException（空指针异常）：
    1. 当试图访问一个空对象的属性或调用空对象的方法时抛出。
2. IndexOutOfBoundsException（下标越界异常）：
    1. 当使用了非法的索引访问数组、字符串或集合等容器时抛出。
3. ArithmeticException（算术异常）：
    1. 当进行数学运算出现异常情况时抛出，比如除数为零。
4. IllegalArgumentException（非法参数异常）：
    1. 当方法接收到一个不合法的参数时抛出，比如负数作为数组长度、空字符串作为方法的参数等。
5. ClassCastException（类转换异常）：
    1. 当试图将一个对象转换为不兼容的类类型时抛出。
6. NumberFormatException（数字格式异常）：
    1. 当字符串转换为数字时发生格式错误时抛出，比如 Integer.parseInt("abc")。
7. ConcurrentModificationException（并发修改异常）：
    1. 当多个线程同时修改集合对象时，可能会导致集合的结构发生变化，从而抛出此异常。
8. StackOverflowError（栈溢出异常）：
    1. 当方法的调用栈过深，超出 JVM 栈的深度限制时抛出。
9. OutOfMemoryError（内存溢出异常）：
    1. 当程序尝试申请的内存超出了 JVM 的堆内存限制时抛出。
10. NoClassDefFoundError（类未找到异常）：
    1. 当 JVM 尝试加载某个类但找不到其定义时抛出。

这些异常通常表示了程序的错误或者逻辑错误，需要通过合适的异常处理机制来处理，以保证程序的健壮性和稳定性。

## 处理异常时，如何取舍 throw 和 try-catch-finally？
在处理异常时，`throw` 和 `try - catch - finally` 的选择取决于多种因素，以下是一些指导原则：

#### 使用 `throw` 的场景
### 向上层传递异常：
    - 当当前方法无法处理某个异常，并且认为调用该方法的上层方法更适合处理此异常时，可以使用 `throw` 将异常抛出。例如，在一个数据读取方法中，如果遇到文件格式错误，而该方法本身没有能力修复或处理这个错误，就可以抛出异常，让调用者来决定如何处理。

```java
public class FileReader {
    public static String readFile(String filePath) throws FileNotFoundException {
        java.io.File file = new java.io.File(filePath);
        if (!file.exists()) {
            throw new FileNotFoundException("File not found: " + filePath);
        }
        // 其他文件读取逻辑
        return "";
    }
}
```

### 自定义异常的抛出：
    - 当业务逻辑中出现不符合预期的情况，并且现有异常类不能准确描述该问题时，可以自定义异常并使用 `throw` 抛出。例如，在一个用户注册系统中，如果用户名已存在，可能会抛出一个自定义的 `UsernameExistsException`。

```java
public class UserRegistration {
    public static void registerUser(String username) throws UsernameExistsException {
        // 假设这里有检查用户名是否存在的逻辑
        boolean exists = checkUsernameExists(username);
        if (exists) {
            throw new UsernameExistsException("Username already exists: " + username);
        }
        // 其他注册逻辑
    }

    private static boolean checkUsernameExists(String username) {
        // 模拟检查用户名是否存在的逻辑
        return false;
    }
}

class UsernameExistsException extends Exception {
    public UsernameExistsException(String message) {
        super(message);
    }
}
```

### 使用 `try - catch - finally` 的场景
1. **异常处理与恢复**：
    - 当方法能够处理特定类型的异常，并在处理后可以继续正常执行时，使用 `try - catch` 块。例如，在一个网络请求方法中，可能会遇到网络连接超时异常，此时可以捕获该异常，尝试重新连接，然后继续执行。

```java
import java.io.IOException;
import java.net.Socket;

public class NetworkClient {
    public static void sendRequest(String serverAddress, int port) {
        Socket socket = null;
        try {
            socket = new Socket(serverAddress, port);
            // 发送请求的逻辑
        } catch (IOException e) {
            System.out.println("Network error, retrying...");
            // 尝试重新连接的逻辑
            try {
                Thread.sleep(2000);
                socket = new Socket(serverAddress, port);
                // 重新发送请求的逻辑
            } catch (InterruptedException | IOException ex) {
                ex.printStackTrace();
            }
        } finally {
            if (socket!= null) {
                try {
                    socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

2. **资源清理**：
    - `finally` 块用于确保无论是否发生异常，都能执行特定的代码，通常用于资源清理，如关闭文件、数据库连接等。在上述网络请求的例子中，`finally` 块用于关闭 `Socket` 连接，确保即使在请求过程中出现异常，连接也能被正确关闭。

### 综合考虑
1. **层次化处理**：
    - 在应用程序的不同层次，可能会有不同的异常处理策略。较低层次的方法通常抛出异常，将处理的责任交给更高层次。例如，数据访问层的方法可能抛出数据库相关的异常，业务逻辑层捕获这些异常并转换为业务相关的异常，再继续向上抛出或处理。
2. **避免过度捕获**：
    - 不要捕获并忽略异常，这样会隐藏问题，使得调试变得困难。捕获异常时，应该根据实际情况进行合理的处理，或者至少记录异常信息。
3. **性能考量**：
    - 异常处理机制本身会带来一定的性能开销，尤其是频繁地抛出和捕获异常。因此，在性能敏感的代码段，应尽量避免不必要的异常处理。例如，在一个循环中，如果每次迭代都可能抛出异常，可能需要重新设计代码逻辑，通过条件判断来避免异常的发生。

## 说说反射的用途和实现原理
反射：运行时类型检查：通过反射可以获取类的信息，包括类名、父类、实现的接口等，从而在运行时对对象的类型进行检查。

![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748162894572-545aa147-3dd2-4906-9b37-e1484c116c56.png)

### 反射的应用场景
+ Spring 框架中使用反射来动态加载和管理 Bean
+ Java 的动态代理机制使用反射来创建代理类，代理类可以在运行时动态处理方法调用，在实现 AOP 和拦截器时非常有用。

```java
InvocationHandler handler = new MyInvocationHandler();
MyInterface proxyInstance = (MyInterface) Proxy.newProxyInstance(
        MyInterface.class.getClassLoader(),
        new Class<?>[] { MyInterface.class },
        handler
);
```

+ JUnit 和 TestNG 等测试框架中使用反射机制来发现和执行测试方法。反射允许框架扫描类，查找带有特定注解的方法并在运行时调用。

### 反射的原理
JVM 进行类加载的时候，会加载字节码文件，将类型相关的所有信息加载进方法区，然后反射去获取这些信息，再进行各种操作。

## java9 把 String 内的 value 数组从 char 改成 byte 有什么好处？
在 Java 9 中，将 `String` 类内部的 `value` 数组从 `char[]` 改为 `byte[]` 主要是出于节省内存和提高性能的考虑，以下是详细介绍：

### 节省内存
+ **字符编码特性**：在 Java 9 之前，`String` 类使用 `char[]` 数组来存储字符，每个 `char` 类型占 16 位（2 个字节），采用 UTF - 16 编码。然而，对于大量只包含 ASCII 字符（范围是 0 - 127）的字符串来说，每个字符实际上只需 8 位（1 个字节）就能存储，使用 `char[]` 会浪费一半的存储空间。
+ **新的存储策略**：Java 9 引入了新的存储策略，根据字符串的实际内容选择合适的编码方式。如果字符串只包含 ASCII 字符，就使用单字节的 Latin - 1 编码（ISO - 8859 - 1），每个字符占用 1 个字节；如果字符串包含非 ASCII 字符，才使用双字节的 UTF - 16 编码。通过这种方式，对于只包含 ASCII 字符的字符串，内存使用量减少了一半。

### 提高性能
+ **减少内存占用带来的性能提升**：由于内存占用减少，垃圾回收器需要处理的数据量也相应减少，从而减少了垃圾回收的频率和时间，提高了程序的整体性能。
+ **更高效的操作**：在处理只包含 ASCII 字符的字符串时，单字节的操作通常比双字节的操作更快。因为单字节操作可以减少内存访问次数和 CPU 处理的数据量，从而提高了字符串操作的效率。

## 为什么字符串常量池能减少内存消耗？
字符串常量池能够减少内存消耗，主要得益于其对字符串对象的复用机制、减少重复存储以及特殊的内存管理方式，下面为你详细阐述：

### 避免重复创建相同内容的字符串对象
在 Java 程序里，经常会用到相同内容的字符串。要是每次使用字符串时都创建新的对象，就会造成大量内存被占用。而字符串常量池采用了一种复用机制，当你使用双引号创建字符串时，JVM 会先去字符串常量池中查找是否已经存在相同内容的字符串对象。

+ **若存在**：直接返回常量池中该字符串对象的引用，不会再重新创建新的对象。例如：

```java
String str1 = "hello";
String str2 = "hello";
```

这里 `str1` 和 `str2` 引用的是字符串常量池中同一个 `"hello"` 对象，只占用一份内存空间。

+ **若不存在**：才会在常量池中创建新的字符串对象。比如：

```java
String str3 = "world";
```

此时会在常量池中创建 `"world"` 这个新的字符串对象。

### 减少内存占用
在 Java 9 之前，`String` 类内部使用 `char[]` 数组来存储字符，每个 `char` 类型占 16 位（2 个字节），采用 UTF - 16 编码。对于大量重复的字符串，如果不使用常量池，每个字符串对象都会单独存储其字符数组，会造成内存的极大浪费。而字符串常量池通过复用机制，只存储一份相同内容的字符数组，从而减少了内存占用。

### 特殊的内存管理
字符串常量池是 JVM 专门为字符串对象设计的一块内存区域，它对字符串对象进行统一管理。这种集中管理的方式使得 JVM 可以更高效地进行内存分配和回收，避免了分散存储带来的内存碎片问题，进一步提高了内存的使用效率。

### 示例对比
以下代码展示了使用字符串常量池和不使用常量池的内存占用差异：

```java
public class StringPoolMemoryExample {
    public static void main(String[] args) {
        // 使用字符串常量池
        String str1 = "apple";
        String str2 = "apple";

        // 不使用字符串常量池
        String str3 = new String("banana");
        String str4 = new String("banana");

        // str1 和 str2 引用同一个对象，只占用一份内存
        System.out.println(str1 == str2); // 输出: true

        // str3 和 str4 是不同的对象，占用两份内存
        System.out.println(str3 == str4); // 输出: false
    }
}
```

在上述代码中，`str1` 和 `str2` 引用的是字符串常量池中的同一个 `"apple"` 对象，只占用一份内存；而 `str3` 和 `str4` 是通过 `new` 关键字创建的不同对象，各自占用一份内存，造成了内存的额外消耗。

综上所述，字符串常量池通过复用相同内容的字符串对象、减少重复存储以及特殊的内存管理方式，有效地减少了内存消耗。

## synchronized 能够实现线程安全的原理
`synchronized` 关键字能够实现线程安全，主要是因为它具有原子性、可见性和有序性这三大特性，具体如下：

### 原子性
+ **原理**：`synchronized` 会对代码块或方法进行加锁，确保在同一时刻只有一个线程能够进入被 `synchronized` 修饰的代码区域。
+ **示例**：在多线程环境下，多个线程同时访问一个被 `synchronized` 修饰的方法或代码块时，只有获得锁的线程才能执行其中的代码，其他线程则需要等待。例如，对一个共享变量进行自增操作，如果没有 `synchronized` 修饰，可能会出现数据不一致的情况。但使用 `synchronized` 修饰后，就可以保证自增操作的原子性，即一个线程执行自增操作时，其他线程无法同时访问该变量，避免了数据冲突。

### 可见性
+ **原理**：当一个线程修改了被 `synchronized` 修饰的共享变量的值后，会在释放锁时将该变量的值刷新到主内存中，而其他线程在获取锁后，会从主内存中读取最新的值，从而保证了可见性。
+ **示例**：假设有两个线程 `A` 和 `B`，线程 `A` 修改了一个被 `synchronized` 保护的共享变量 `x`，当线程 `A` 释放锁时，会将 `x` 的最新值刷新到主内存。随后，线程 `B` 获取到锁并访问变量 `x` 时，会从主内存中读取到线程 `A` 修改后的最新值，而不会读取到本地缓存中过期的值，确保了线程间数据的可见性。

### 有序性
+ **原理**：`synchronized` 关键字通过对代码块或方法进行加锁，使得在同一时刻只有一个线程能够执行被保护的代码。这就相当于对代码进行了串行化执行，从而避免了指令重排序带来的问题，保证了程序的有序性。
+ **示例**：在没有 `synchronized` 保护的情况下，编译器或处理器可能会对代码进行指令重排序以提高执行效率，但这可能会导致多线程环境下的程序出现错误。而使用 `synchronized` 后，由于同一时刻只有一个线程能执行同步代码块，就不会出现指令重排序的问题，保证了代码按照编写的顺序执行。

`synchronized` 关键字通过对代码块或方法进行加锁，使得同一时刻只有一个线程能够访问被保护的资源，从而保证了原子性、可见性和有序性，最终实现了线程安全。

##  什么是解释型语言和编译型语言，为什么说Java是解释型和编译型共存的语言？  
### 一、**编译型语言的定义**
**编译型语言**是指：**源代码在运行前需先由编译器一次性编译为机器代码**，生成独立可执行文件，之后运行时无需源代码和编译器。

+ **代表语言**：C、C++、Go
+ **特点**：
    - **运行速度快**：因为直接运行的是机器码。
    - **可脱离源码独立发布**。
    - **平台相关性强**：不同平台需重新编译生成对应的可执行文件。

---

### 二、**解释型语言的定义**
**解释型语言**是指：**源代码运行时由解释器逐行翻译并执行**，不生成独立的机器码文件。

+ **代表语言**：Python、JavaScript、PHP
+ **特点**：
    - **开发调试效率高**，但**运行速度较慢**。
    - **平台无关性较强**：只要有解释器就能运行。
    - **每次运行都需解释器参与**。

---

### 三、**Java为何是编译型与解释型共存语言**
Java语言在执行流程中**同时包含编译与解释两个阶段**，体现了二者的结合：

+ **编译阶段（编译型）**：
    - Java源代码（`.java`文件）首先被**Java编译器（javac）编译为字节码文件（**`**.class**`**）**。
    - 字节码并非机器码，无法直接在CPU上运行。
+ **运行阶段（解释型）**：
    - 字节码由**Java虚拟机（JVM）中的解释器逐条解释执行**；
    - 或者由**JIT编译器（Just-In-Time Compiler）**将字节码在运行时转为机器码以提升执行效率。

**因此：Java既有编译生成中间代码（字节码）的“编译型”特征，又依赖JVM解释/即时编译执行的“解释型”特征。**

## 为什么 boolean 类型占用一个或四个字节？
**总结语句：**  
**Java 的 boolean 类型语义上只需 1 位，但在 JVM 中实际常占 1 字节或 4 字节，这是为了内存对齐与访问效率考虑。**

### 一、Java 语言层面：boolean 表达的是逻辑含义
+ 在 Java 语言规范中，`boolean` 表示**逻辑值 true 或 false**，语义上只需 1 位即可表示。
+ 规范未规定其在内存中的实际大小，**强调语义抽象，不涉及底层实现细节**。
+ 因此，开发者通常**不需要关心 boolean 的物理大小**，只关注其逻辑用途。

### 二、JVM 层面：boolean 实际内存占用由实现决定
+ 在 JVM 的实现中，boolean 的**存储大小取决于运行时的实际内存分配策略**。
+ 出于性能和硬件访问效率的考虑，通常不会按位存储，而是以字节为基本单元处理。

### 三、数组场景：通常每个 boolean 元素占用 1 字节
+ 在 `boolean[]` 中，**每个 boolean 元素通常使用 1 字节（8 位）存储**。
+ 原因是 JVM 为了实现高效的随机访问，避免位级别计算，提高性能。

### 四、对象字段场景：可能按 4 字节（int）对齐
+ 当 boolean 是类的实例字段时，**JVM 可能按 4 字节对齐**，以适配处理器的内存对齐要求。
+ 字段对齐可减少内存访问次数、提升缓存命中率，**提高运行时性能**。

### 五、内存布局优化的相关提示
+ 使用工具如 JOL（Java Object Layout）可查看对象实际内存布局，验证字段对齐情况。
+ 多个 boolean 字段可能不会合并为位存储，**仍以 byte/int 为单位存储**，与操作系统内存对齐策略密切相关。

## 自动类型转换
当把一个范围较小的数值或变量赋给另外一个范围较大的变量时，会进行自动类型转换；反之，需要强制转换。

![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748150100575-f0e8904f-4552-420b-9f3a-e56cec1187c8.png)

①、`float f=3.4`，对吗？

不正确。3.4 默认是双精度，将双精度赋值给浮点型属于下转型（down-casting，也称窄化）会造成精度丢失，因

此需要强制类型转换`float f =(float)3.4;`或者写成 `float f =3.4F`

②、`short s1 = 1; s1 = s1 + 1;`对吗？`short s1 = 1; s1 += 1;` 对吗？

`short s1 = 1; s1 = s1 + 1;`会编译出错，由于 1 是 int 类型，因此 s1+1 运算结果也是 int 型，需要强制转换类型才能赋值给 short 型。

而`short s1 = 1; s1 += 1;`可以正确编译，因为 `s1+= 1;`相当于`s1 = (short(s1 + 1);`其中有隐含的强制类型转换。

## switch 语句能不能用在 byte/long/String 类型上？
Java 5 以前的`switch(expr)`中，expr 只能是 byte、short、char、int。

从 Java 5 开始，Java 引入了枚举类型，expr 也可以是 enum 类型。

从 Java 7 开始，expr 还可以是字符串，但是 long 目前仍然不可以。

## 为什么 Java 里面要多组合少继承？
**Java 提倡多组合少继承，核心在于组合通过低耦合的对象聚合实现功能复用，避免继承的强依赖、单继承限制和封装性破坏问题，更符合面向对象设计原则。**  

### 继承的局限性分析
**继承是一种强耦合关系**，存在以下核心问题：  

1. **类间依赖过强**：子类直接依赖父类实现细节，父类修改可能导致子类崩溃，违反开闭原则。  
2. **功能扩展受限**：Java 不支持多继承，子类无法同时复用多个类的功能。  
3. **破坏封装性**：子类可访问父类`protected`成员或覆盖方法，可能意外修改父类逻辑。

### 组合的优势解析
**组合通过对象聚合实现功能复用**，具有以下核心优势：  

1. **低耦合高内聚**：类间通过接口协作，不依赖具体实现，符合依赖倒置原则。  
2. **灵活的功能组合**：可同时组合多个对象，突破单继承限制（如`Bird`组合飞行和发声行为）。  
3. **增强可测试性**：对象可通过接口替换为模拟对象，便于独立测试。  
4. **符合合成复用原则（CRP）**：避免“类爆炸”，优先通过组合复用功能。

### 典型场景对比
| 场景 | 继承实现方式 | 组合实现方式 |
| --- | --- | --- |
| **日志功能集成** | 子类继承`LoggerBase`并添加逻辑 | 持有`Logger`接口实例，通过接口调用 |
| **交通工具扩展** | `Car`/`Airplane`继承`Vehicle` | `Vehicle`组合`Engine`/`Wheel`接口，注入不同实现 |


### 设计原则的贯彻
**多组合少继承的本质是遵循面向对象设计原则**：  

+ **单一职责原则（SRP）**：组合将功能封装到独立类，每个类仅负责单一职责。  
+ **接口隔离原则（ISP）**：基于接口协作，类仅依赖需要的接口，避免继承无关方法。

### 总结建议
+ **优先组合场景**：需动态切换功能、复用多维度能力、避免强耦合时。  
+ **谨慎继承场景**：仅当存在明确“is-a”关系（如“狗是动物”）且父类接口稳定时使用。  
+ **最佳实践**：通过“接口 + 组合”构建松耦合架构，提升系统可维护性与扩展性。

## 多态的作用和实现原理
+ 作用：在运行时根据对象的类型进行后期绑定，编译器在编译阶段并不知道对象的类型，但是 Java 的方法调用机制能找到正确的方法体，然后执行，得到正确的结果。
+ 实现原理：通过动态绑定实现，Java 使用虚方法表存储方法指针，方法调用时根据对象实际类型从虚方法表查找具体实现。



![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748151945875-186de067-c6c6-4bd0-834e-d9b86cc715ae.png)

## 访问修饰符 public、private、protected、默认 的区别
+  **default**：（即默认，什么也不写）: 在同一包内可见，不使用任何修饰符。可以修饰在类、接口、变量、方法。 
+ **private**：在同一类内可见。可以修饰变量、方法。不能修饰类（外部类）。
+  **public**：对所有类可见。可以修饰类、接口、变量、方法。
+ **protected**：对同一包内的类和所有子类可见。可以修饰变量、方法。注意：不能修饰类（外部类）。  

## 局部变量未初始化直接使用的编译错误分析
在 Java 中，**局部变量（方法内定义的变量）必须显式初始化后才能使用**，否则会触发**编译时错误**。以代码`public void test() { int a; System.out.println(a+1); }`为例，具体表现和原因如下：  

### 编译阶段报错信息
当尝试编译上述代码时，编译器会抛出类似以下错误：  

```plain
Error: variable a might not have been initialized
```

**核心原因**：  

+ 局部变量`a`在声明后未被赋予任何初始值（如`int a = 0;`），属于“未初始化变量”。  
+ Java 编译器强制要求局部变量必须显式初始化，**禁止读取未初始化的局部变量值**，以避免读取到不确定的垃圾值（如栈内存中的残留数据）。

### 局部变量与成员变量的区别
| **维度** | **局部变量（方法内）** | **成员变量（类中）** |
| --- | --- | --- |
| **初始化规则** | **必须显式初始化**（编译器强制检查） | **自动初始化**（默认值：`int=0`，`boolean=false`等） |
| **内存位置** | 存储于**栈帧**中（随方法调用创建/销毁） | 存储于**堆对象**中（随对象创建存在） |
| **作用域** | 仅限于方法体内或代码块（如`if`语句） | 整个类可见（可通过对象引用访问） |


**为什么局部变量不自动初始化？**  

+ 成员变量属于对象状态的一部分，自动初始化可确保对象状态的一致性（如避免`null`引用）。  
+ 局部变量是方法执行中的临时数据，其作用域短且生命周期与方法栈帧绑定。若自动初始化，可能导致开发者忽略未赋值的逻辑错误（如误读默认值），因此编译器强制要求显式初始化以提升代码健壮性。

### 底层原理：栈内存的不确定性
局部变量存储于方法栈帧中，其内存空间在方法调用时分配，方法结束后释放。  

+ **未初始化的局部变量**在栈中对应的内存位置可能存储着前一个方法调用残留的“脏数据”（如其他变量的旧值）。  
+ Java 通过编译器强制检查局部变量初始化，避免程序读取到这些不确定值，从而防止逻辑错误和安全隐患（如误判条件导致业务异常）。

### 总结
+ **核心规则**：局部变量必须**先赋值，后使用**，否则编译失败。  
+ **设计目的**：通过编译器强制检查，避免因读取未初始化变量的垃圾值导致的运行时问题，提升代码可靠性。  
+ **实践建议**：声明局部变量时立即赋予初始值（如`int a = 0;`），或在使用前确保所有代码路径均完成赋值，养成良好的编码习惯。

## 为什么重写equals时必须重写hashcode方法
在Java中，`equals`和`hashCode`是`Object`类的两个关键方法，二者的设计目标紧密关联。**当重写**`equals`**方法时必须重写**`hashCode`**方法**，否则会违反Java规范中二者的契约关系，导致哈希表（如`HashMap`、`HashSet`）等数据结构出现逻辑错误。以下是核心原因和细节分析：  

### 一、Java规范中的契约要求
根据`Object`类的文档说明，`equals`和`hashCode`需满足以下**强制契约**（Contract）：  

1. **如果两个对象通过**`equals`**方法比较相等（**`a.equals(b) == true`**），则它们的**`hashCode`**必须相等**（`a.hashCode() == b.hashCode()`）。  
2. **如果两个对象的**`hashCode`**不等（**`a.hashCode() != b.hashCode()`**），则它们通过**`equals`**比较必然不相等**（`a.equals(b) == false`）。

**违反契约的后果**：  

+ 当对象作为哈希表（如`HashMap`）的键时，可能导致**存入和取出时无法正确匹配**，例如：  
    - 存入键`A`时，根据`A.hashCode()`计算存储位置并保存键值对；  
    - 取出时，若键`B`与`A`通过`equals`相等但`hashCode`不等，则会根据`B.hashCode()`计算不同的位置，导致无法找到`A`对应的条目，引发数据丢失或逻辑错误。

### 二、哈希表的工作原理与依赖关系
#### 1. `HashMap`的存储逻辑
+ **定位桶（Bucket）**：通过`key.hashCode()`计算哈希值，再通过哈希函数确定键值对存储的桶位置。  
+ **比较键是否相等**：若桶中存在多个键（哈希冲突），则通过`equals`方法逐个比较键是否相等，以确定是否为同一键。

#### 2. 不重写`hashCode`的典型问题
假设自定义类`Person`仅重写`equals`而未重写`hashCode`：  

```java
public class Person {  
    private String name;  
    private int age;  

    // 重写equals（仅比较name和age）  
    @Override  
    public boolean equals(Object o) {  
        if (this == o) return true;  
        if (o == null || getClass() != o.getClass()) return false;  
        Person person = (Person) o;  
        return age == person.age && Objects.equals(name, person.name);  
    }  
    // **未重写hashCode，使用Object默认实现（基于对象内存地址）**  
}  
```

**问题场景**：  

```java
Person p1 = new Person("Alice", 25);  
Person p2 = new Person("Alice", 25);  
System.out.println(p1.equals(p2)); // 输出true（逻辑相等）  

HashMap<Person, String> map = new HashMap<>();  
map.put(p1, "data");  
System.out.println(map.get(p2)); // 预期输出"data"，实际输出null  
```

**原因分析**：  

+ `p1`和`p2`的`equals`相等，但`hashCode`不等（默认`hashCode`基于内存地址）。  
+ 存入`p1`时，根据`p1.hashCode()`确定桶位置；  
+ 取出`p2`时，根据`p2.hashCode()`计算出不同的桶位置，导致未命中存储`p1`的桶，直接返回`null`。

### 三、正确的重写方式与示例
#### 1. 重写`hashCode`的核心原则
+ **基于**`equals`**方法中用于比较的所有字段**计算哈希值，确保相等对象的哈希值一致。  
+ 推荐使用工具生成（如IDE的`hashCode`生成功能）或`Objects.hash()`方法，避免手动计算错误。

#### 2. 修正后的`Person`类
```java
public class Person {  
    private String name;  
    private int age;  

    @Override  
    public boolean equals(Object o) {  
        // 同前，省略  
    }  

    @Override  
    public int hashCode() {  
        // 基于name和age计算哈希值，确保相等对象哈希值一致  
        return Objects.hash(name, age);  
    }  
}  
```

**验证修正后逻辑**：  

```java
map.put(p1, "data");  
System.out.println(map.get(p2)); // 输出"data"（p1和p2的hashCode相等，且equals相等）  
```

### 四、例外情况：无需哈希表的场景
若类的实例**永远不会作为哈希表的键**（如仅用于值对象或普通数据传输），理论上可以不重写`hashCode`。但实际开发中：  

+ **违反Java规范**：可能导致后续代码中无意使用该类作为哈希表键时出现隐性bug。  
+ **最佳实践**：除非明确知道类不会用于哈希表，否则应始终遵循“重写`equals`必重写`hashCode`”的原则，保持代码的健壮性和可维护性。

### 五、总结
+ **核心原因**：`equals`和`hashCode`的契约要求相等对象的哈希值必须一致，否则哈希表无法正确工作。  
+ **本质目的**：保证对象在哈希表中的唯一性和可访问性，避免因哈希值不一致导致的数据操作异常。  
+ **实践建议**：使用IDE自动生成`equals`和`hashCode`方法，确保二者逻辑一致，从源头规避契约违反问题。

## Java 创建对象的四种方式
1. new 关键字：通过类的构造方法。
2. 反射机制：允许在运行时创建对象，并且可以访问类的私有成员。

```java
Class clazz = Class.forName("Person");
Person person = (Person) clazz.newInstance();
```

3. clone 拷贝：通过 clone 方法创建对象，需要实现 Cloneable 接口并重写 clone 方法。
4. 序列化机制：通过序列化将对象转换为字节流，再通过反序列化从字节流中恢复对象，需要实现 Serializable 接口。

```java
Person person = new Person();
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("Person.txt"));
oos.writeObject(person);
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("Person.txt"));
Person person2 = (Person) ois.readObject();
```

## new 子类时，子类和父类静态代码块、构造方法的执行顺序
1. **父类静态代码块**（包括静态变量初始化）  
2. **子类静态代码块**（包括静态变量初始化）  
3. **父类构造方法**（包括非静态变量初始化和普通代码块）  
4. **子类构造方法**（包括非静态变量初始化和普通代码块）

### **详细解析**
#### 1. **静态代码块的执行**
+ **特点**：静态代码块属于类级别，仅在类加载时执行**一次**，优先于实例化过程。  
+ **顺序**：  
    - 先加载父类，执行父类的静态代码块和静态变量初始化。  
    - 再加载子类，执行子类的静态代码块和静态变量初始化。
+ **场景**：适用于类级别的初始化（如加载配置⽂件、初始化静态资源）。

#### 2. **构造方法的执行**
+ **特点**：构造方法属于实例级别，每次创建实例时都会执行。  
+ **顺序**：  
    - **隐式调用父类构造方法**：子类构造方法的第一行默认隐含 `super()`，因此先执行父类的构造流程（包括父类的非静态变量初始化、普通代码块、构造方法体）。  
    - **执行子类构造逻辑**：完成父类初始化后，执行子类的非静态变量初始化、普通代码块、构造方法体。
+ **注意**：若父类没有无参构造方法，子类必须显式调用父类的有参构造方法（通过 `super(参数)`），否则编译报错。

```java
class Parent {
    static {
        System.out.println("父类静态代码块"); // 第 1 步执行
    }
    
    {
        System.out.println("父类普通代码块"); // 第 3 步执行（在构造方法前）
    }
    
    public Parent() {
        System.out.println("父类构造方法"); // 第 3 步执行（在普通代码块后）
    }
}

class Child extends Parent {
    static {
        System.out.println("子类静态代码块"); // 第 2 步执行
    }
    
    {
        System.out.println("子类普通代码块"); // 第 4 步执行（在构造方法前）
    }
    
    public Child() {
        System.out.println("子类构造方法"); // 第 4 步执行（在普通代码块后）
    }
}

public class Test {
    public static void main(String[] args) {
        new Child(); // 执行结果如下：
    }
}
```

#### **输出结果**
```plain
父类静态代码块
子类静态代码块
父类普通代码块
父类构造方法
子类普通代码块
子类构造方法
```

### **核心原理**
+ **类加载机制**：JVM 加载类时，先加载父类，再加载子类，静态代码块随类加载而执行。  
+ **继承链初始化**：子类实例化必须先完成父类初始化，确保父类成员可被正确访问，符合 OOP 的“父类优先”原则。

理解此顺序有助于避免初始化逻辑的冲突，尤其是在复杂继承关系中确保代码执行的正确性。

## String、StringBuilder、StringBuffer 的区别
### **1. 可变性（Mutability）**
+ `String`：**不可变**。一旦创建，其值不能被修改。任何对`String`的修改操作（如`concat`、`substring`）都会返回一个新的`String`对象。
+ `StringBuilder` 和 `StringBuffer`：**可变**。它们内部维护一个可变的字符数组，对字符串的修改操作（如`append`、`delete`）不会创建新对象，而是直接在原对象上修改。

### **2. 线程安全性**
+ `String`：是**线程安全的**。  
由于其不可变性，所有操作都不会影响原始对象，因此在多线程环境下无需额外同步。
+ `StringBuffer`：是**线程安全的**。  
它的所有公开方法都被`synchronized`修饰，保证了多线程环境下的操作安全。  
**示例**：

```java
public synchronized StringBuffer append(String str) {
    // ... 线程安全的实现
}
```

+ `StringBuilder`：是**非线程安全的**。  
它的方法没有同步机制，在多线程环境下可能出现数据不一致问题。但由于无需同步，性能更高。

### **3. 性能**
+ `String`：由于每次修改都会创建新对象，频繁操作时性能较差，尤其在循环中使用时可能导致大量临时对象和内存开销。
+ `StringBuilder`：没有同步开销，性能最高，适合单线程环境下的频繁字符串操作（如循环拼接）。
+ `StringBuffer`：由于同步锁的存在，性能略低于`StringBuilder`，但在多线程环境下更安全。

### **总结对比表**
| 特性 | String | StringBuilder | StringBuffer |
| --- | --- | --- | --- |
| **可变性** | 不可变 | 可变 | 可变 |
| **线程安全性** | 安全（不可变） | 不安全 | 安全（同步方法） |
| **性能** | 低（频繁创建新对象） | 高（无同步） | 中（有同步开销） |
| **适用场景** | 字符串常量、少量修改 | 单线程频繁操作 | 多线程频繁操作 |


## intern 方法有什么作用
在Java中，`String.intern()` 是一个本地方法，用于将字符串对象添加到字符串常量池（String Pool）中，并返回该池中字符串的引用。其核心作用和机制如下：

### **1. 字符串常量池（String Pool）**
+ **位置**：在 JDK 7及以后，字符串常量池位于堆内存中；之前位于方法区（永久代）。
+ **作用**：存储**唯一的字符串实例**，避免重复创建相同内容的字符串对象，节省内存。

### **2. **`intern()`** 方法的行为**
当调用 `str.intern()` 时：

1. **检查常量池**：  
若池中已存在内容与 `str` 相同的字符串（使用 `equals()` 比较），则返回池中的引用。
2. **不存在则添加**：  
若池中不存在，则将 `str` 的引用添加到常量池（JDK 7及以后），或先复制 `str` 的内容到常量池再返回新引用（JDK 6及以前）。

**示例**：

```java
String s1 = "hello";           // 直接使用字面量，"hello" 会被放入常量池
String s2 = new String("hello"); // 创建新对象，但内容与常量池中的 "hello" 相同
String s3 = s2.intern();       // 返回常量池中的 "hello" 引用

System.out.println(s1 == s3);  // true，s1 和 s3 指向常量池中的同一对象
System.out.println(s1 == s2);  // false，s2 是堆中的新对象
```

### **3. JDK 6 vs JDK 7+ 的差异**
+ **JDK 6**：  
常量池位于永久代，`intern()` 会将字符串内容**复制**到常量池，并返回新创建的对象引用。
+ **JDK 7+**：  
常量池移至堆内存，`intern()` 可以直接将堆中对象的**引用**添加到常量池，无需复制内容。

**示例（JDK 7+）**：

```java
String s = new String("java") + new String("script"); // 堆中创建 "javascript"
String interned = s.intern();                          // 将 s 的引用添加到常量池
String literal = "javascript";                         // 直接使用常量池中的引用

System.out.println(s == interned);  // true，s 的引用被添加到常量池
System.out.println(s == literal);   // true，literal 直接使用池中的引用
```

### **4. 典型应用场景**
+ **节省内存**：  
当需要处理大量重复字符串时（如解析文本、数据库查询结果），使用 `intern()` 可以减少内存占用。

```java
// 假设从文件读取100万次 "apple"
String fruit = readFromFile().intern(); // 只在常量池存储一份 "apple"
```

+ **字符串比较优化**：  
若需要频繁比较字符串是否相等，使用 `intern()` 后可直接通过 `==` 比较引用，比 `equals()` 更快。

```java
// 比较两个可能重复的长字符串
if (str1.intern() == str2.intern()) { ... } // 比 str1.equals(str2) 略快
```

+ **缓存或池化机制**：  
在框架或库中，用于缓存常用字符串以提高性能。

### **总结**
`intern()` 方法的核心价值在于通过字符串常量池**复用相同内容的字符串实例**，从而节省内存。但在实际开发中，应权衡其性能开销和潜在的内存风险，优先使用字符串字面量而非手动调用 `intern()`。

## Java 中的异常体系
常见异常：

![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748159548703-8d15337f-1b3e-4460-ad4e-2cd0e53a8ffc.png)

+ Error 表示严重的错误，无法由程序处理，通常与 JVM 有关；
+ Exception 代表程序可以处理的异常，分为编译时异常和运行时异常。编译时异常必须进行显示处理，捕获或直接抛出。而运行时异常不要求必须处理。

## catch 和 finally 的异常可以同时抛出吗？
如果 catch 块和 finally 块都抛出异常，那么最终抛出的将是 finally 中的异常，catch 抛出的异常会被丢弃，而 finally 块中的异常会覆盖并向上传递。

```java
public class Example {
    public static void main(String[] args) {
        try {
            throw new Exception("Exception in try");
         } catch (Exception e) {
            throw new RuntimeException("Exception in catch");
         } finally {
            throw new IllegalArgumentException("Exception in finally");
         }
     }
}
```

对于以上程序，最终会抛出 finally 中的`IllegalArgumentExceptio`。

但我们可以手动捕获 finally 中的异常，并将 catch 块中的异常保留下来，避免被覆盖。常见的作法是用一个变量临时存储 catch 中的异常，然后在 finally 中处理该异常，如：

```java
public class Example {
    public static void main(String[] args) {
        Exception catchException = null;
        try {
            throw new Exception("Exception in try");
        } catch (Exception e) {
            catchException = e;
            throw new RuntimeException("Exception in catch");
        } finally {
            try {
                throw new IllegalArgumentException("Exception in finally");
            } catch (IllegalArgumentException e) {
                if (catchException != null) {
                    System.out.println("Catch exception: " +
                            catchException.getMessage());
                }
                System.out.println("Finally exception: " + e.getMessage());
            }
        }
    }
}
```

执行结果：

![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748160113524-9eea2c19-b1b1-4ffa-b112-800ab29a0ea5.png)

## 易错 try-finally 例题
### Q1
```java
public class TryDemo {
    public static void main(String[] args) {
        System.out.println(test());
    }
    public static int test() {
        try {
            return 1;
        } catch (Exception e) {
            return 2;
        } finally {
            System.out.print("3");
        }
    }
}
```

输出结果：`31`

### Q2
```java
public class TryDemo {
    public static void main(String[] args) {
        System.out.println(test1());
    }
    public static int test1() {
        try {
            return 2;
        } finally {
            return 3;
        }
    }
}
```

返回结果：`3`

但实际中不应该在 finally 中编写或执行 return 语句。

### Q3
```java
public class TryDemo {
    public static void main(String[] args) {
        System.out.println(test1());
    }
    public static int test1() {
        int i = 0;
        try {
            i = 2;
            return i;
        } finally {
            i = 3;
        }
    }
}
```

返回结果：`2`

在执行 finally 之前，JVM 会先将 i 的值暂存起来，finally 执行结束后，会返回暂存的结果，而不是返回被 finally 操作后的 i。

## Java 中 IO 流分为几种？
+ 按照**数据流方向**分
    - 输入流 Input Stream：从源（文件、网络等）读取数据到程序。
    - 输出流 Output Stream：将数据从程序写出到目的地。
+ 按照**处理数据单位**分：
    - 字节流 Byte Streams：以字节为单位读写数据，主要用于处理二进制数据，如音频、图像文件等。
    - 字符流 Character Streams：以字符为单位读写数据，主要用于处理文本数据。
+ 按**功能**分：
    - 节点流 Node Streams：直接与数据源或目的地相连，如 FileInputStream。
    - 处理流 Processing Streams：对一个已存在的流进行包装，如缓冲流 BufferedInputStream。
    - 管道流 Piped Steams：用于线程之间的数据传输，如 PipedInputStream。

![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748160753245-3ae1de5a-1630-4496-8806-7fcfa7e72b6e.png)

### IO 流用到了什么设计模式
**装饰器模式**

![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748160901960-fef74889-c0fc-4c2a-8ad4-283998ee0cd8.png)

## 如何预防 Java 缓冲区溢出
主要原因：向缓冲区写入的数据超过其能够存储的数据量

措施：

+ **合理设置缓冲区大小**：创建缓冲区时，根据实际需求合理设置缓冲区的大小，避免创建过大或过小的缓冲区。
+ **控制写入数据量**：向缓冲区写入数据时，控制写入的数据量，确保不会超过缓冲区的容量。Java 的 ByteBuffer 类提供了 remaining 方法，可以获取缓冲区中剩余的可写入数据量。

```java
import java.nio.ByteBuffer;

public class ByteBufferExample {
    public static void main(String[] args) {
// 模拟接收到的数据
        byte[] receivedData = {1, 2, 3, 4, 5};
        int bufferSize = 1024; // 设置⼀个合理的缓冲区⼤⼩
// 创建ByteBuffer
        ByteBuffer buffer = ByteBuffer.allocate(bufferSize);
// 写⼊数据之前检查容量是否⾜够
        if (buffer.remaining() >= receivedData.length) {
            buffer.put(receivedData);
        } else {
            System.out.println("Not enough space in buffer to write data.");
        }
// 准备读取数据：将limit设置为当前位置，position设回0
        buffer.flip();
// 读取数据
        while (buffer.hasRemaining()) {
            byte data = buffer.get();
            System.out.println("Read data: " + data);
        }
// 清空缓冲区以便再次使⽤
        buffer.clear();
    }
}
```

## 已经有了字节流，为什么还要有字符流？
字符流其实是由 JVM 将字节转换得到的，问题是这个过程比较耗时，并且如果不知道编码类型，也容易出现编码问题。

所以 IO 流就提供了一个直接操作字符的接口，方便平时对字符进行流操作。如果音频、图片等媒体文件用字节流比较好，涉及到字符的话使用字符流比较好。

## BIO、NIO、AIO 之间的区别
![](https://cdn.nlark.com/yuque/0/2025/png/35335189/1748161564937-2e8fa8c5-e900-471e-9559-dcddf5cc5be2.png)

+ BIO：阻塞式 I/O 模型，线程在执行 I/O 操作时被阻塞，无法处理其他任务，适用于连接数较少的场景。
+ NIO：非阻塞 I/O 模型，线程在等待 I/O 时可执行其他任务，通过 Selector 监控多个 Channel 上的时间，适用于连接数多但连接时间段的场景。
+ AIO：使用异步 I/O 模型，线程发起 I/O 请求后立即返回，当 I/O 操作完成时通过回调函数通知线程，适用于链接数多且连接时间长的场景。

### BIO
Block，基于字节流或字符流进行文件读写，基于 Socket 和 ServerSocket 进行网络通信。

对于每个连接，都需要创建一个独立的线程来处理读写操作。

### NIO
JDK 1.4 时引入，提供了 Channel、Buffer、Selector 等类的抽象，基于 RandomAccessFile、FileChannel、ByteBuffer 进行文件读写，基于 SocketChannel 和 ServerSocketChannel 进行网络通信。

对于文件读写，NIO 并不能体现出比 BIO 更可靠的性能。但是在网络编程中，服务器可以用一个线程处理多个客户端的连接，铜鼓 Selector 监听多个 Channel 来实现多路复用，极大提高性能。

### AIO
Java 7 引入，在 java.nio.channels 包下，提供了 AsynchronousFileChannel、AsynchronousSocketChannel 等异步 Channel。

它引入了异步通信的概念，使得 I/O 操作可以异步进行。

```java
AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(Paths.get("test.txt"),
        StandardOpenOption.READ);
ByteBuffer buffer = ByteBuffer.allocate(1024);
Future<Integer> result = fileChannel.read(buffer, 0);
while(!result.isDone()){
    // do something
}
```

## 关于序列化
+  Java 序列化只会保存对象的状态，而静态变量属于类的状态，不会被保存。
+ 可使用`transient`关键字修饰不想序列化的变量。
+ 序列化的方式
    - Java 对象流序列化：原生序列化方法，通过 Java 原生流的方式进行转化，一般是对象输入输出流。
    - Json 序列化：最常用，一般使用 jackson 包，通过 ObjectMapper 类进行操作，如将对象转化为 byte 数组或将 json 串转化为对象。
    - ProtoBuff 序列化：ProtoBuffer 是一种高效轻便的结构化数据存储格式，ProtoBuff 序列化对象可以很大程度上将其压缩，可以大大减少数据传输大小，提高系统性能。

## 什么是泛型擦除（类型擦除）
Java 在编译期间，所有的类型信息都会被擦除掉。也就是在运行的时候是没有泛型的。

```java
LinkedList<Cat> cats = new LinkedList<Cat>();
LinkedList list = cats; // 注意我在这⾥把范型去掉了，但是list和cats是同⼀个链表！
list.add(new Dog()); // 完全没问题！
```

泛型类型检查只在编译时进行，运行时就不检查了，上面的代码在 JRE 看了像下面代码一样：

```java
LinkedList cats = new LinkedList(); // 注意：没有范型！
LinkedList list = cats;
list.add(new Dog());
```

类型擦除是为了向下兼容，兼容低版本（JDK5 以下）。

## Java 中 >>> 和 >> 的区别？
在Java中，`>>>` 和 `>>` 是两种不同的右移运算符，主要区别在于**符号位处理方式**。以下是详细对比：

### **1. 算术右移（**`>>`**）**
+ **符号位保留**：右移后，最高位（符号位）保持不变，即正数补 `0`，负数补 `1`。
+ **效果**：相当于**除以2的整数次幂**，但保留符号。

```java
int a = 8;     // 二进制: 0000 1000
int b = -8;    // 二进制: 1111 1000 (补码表示)

System.out.println(a >> 2);  // 结果: 2（0000 0010）
System.out.println(b >> 2);  // 结果: -2（1111 1110）
```

### **2. 逻辑右移（**`>>>`**）**
+ **符号位强制补0**：右移后，无论原数是正是负，最高位（符号位）一律补 `0`。
+ **效果**：将二进制数视为**无符号数**进行右移，可能导致符号变化。

```java
int a = 8;     // 二进制: 0000 1000
int b = -8;    // 二进制: 1111 1000 (补码表示)

System.out.println(a >>> 2);  // 结果: 2（0000 0010）
System.out.println(b >>> 2);  // 结果: 1073741822（0011 1111 ... 1110）
```

    - `-8` 的二进制补码为 `1111 1000`，右移2位后补 `0`，变为 `0011 1111 ... 1110`（十进制 `1073741822`）。

### **3. 核心区别对比**
| **运算符** | **符号位处理** | **适用场景** | **示例（-8右移2位）** |
| --- | --- | --- | --- |
| `>>` | 保留符号位 | 有符号数的除法（如 `n/4`） | `-2`（`1111 1110`） |
| `>>>` | 强制补0 | 无符号数操作（如处理二进制） | `1073741822`（`0011 ...`） |


### **4. 常见应用场景**
+ `>>`** 的应用**：  
    - 快速实现有符号整数的除法（如 `n >> 1` 等价于 `n/2`）。  
    - 高效计算平均值（如 `(a + b) >> 1`）。
+ `>>>`** 的应用**：  
    - 处理二进制位（如将负数视为无符号数进行位操作）。  
    - 哈希计算（如 `HashMap` 中的 `hash(key)` 方法）：  

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

### **5. 注意事项**
+ **性能差异**：两者均为原生操作，性能相近。  
+ **对负数的处理**：  
    - `>>` 保持负数特性（如 `-8 >> 2 = -2`）。  
    - `>>>` 将负数转为正数（如 `-8 >>> 2 = 1073741822`）。
+ **与 **`<<`** 的关系**：  
左移运算符 `<<` 无符号位问题，所有空位补 `0`。

### **总结**
+ `>>`**（算术右移）**：保留符号位，用于有符号数的除法。  
+ `>>>`**（逻辑右移）**：符号位补 `0`，用于无符号数操作或二进制位处理。

理解两者差异对位运算优化和底层编程（如网络协议解析）至关重要。











