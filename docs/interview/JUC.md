## 线程和进程的区别
+ **定义**：进程是**程序**在操作系统中的**一次执行过程**，是系统进行资源分配和调度的**基本单位**；线程是进程中的一个执行单元，是 CPU 调度和分派的基本单位。
+ **资源占用**：**进程**拥有自己**独立**的内存空间和系统资源，而**同一进程内的线程共享**进程的资源，如内存、文件句柄等。
+ **调度开销**：进程的创建、销毁和切换开销**较大**，线程的创建、销毁和切换开销相对**较小**。
+ **并发能力**：一个进程可以包含多个线程，多个线程可以并发执行，提高了程序的并发处理能力。

## 对并发编程的了解，有哪些锁？
+ **并发编程**：指在同一时间段内，多个任务可以同时执行的编程方式。Java 中通过多线程实现并发编程，以提高程序的性能和响应速度。
+ **常见锁**：
    - **synchronized**：Java 内置的同步锁，可修饰方法或代码块，保证同一时刻只有一个线程可以访问被保护的资源。
    - **ReentrantLock**：可重入锁，功能比 `synchronized` 更强大，支持公平锁和非公平锁，可手动加锁和解锁。
        * **公平锁**：指多个线程**按照申请**锁的**顺序**来获取锁，就像排队一样，**先到先得**。当一个线程请求公平锁时，如果锁当前被其他线程持有，那么该线程会被放入等待队列中，当锁被释放时，等待队列中排在最前面的线程会获得锁。缺点是由于需要维护一个等待队列，**线程上下文切换的开销较大，性能相对较低**。
        * **非公平锁**：**不保证**线程获取锁的**顺序**，当锁被释放时，任何一个等待锁的线程**都有机会**获得锁，而不是按照申请锁的顺序。非公平锁减少了线程上下文切换的开销，**性能较高**。但可能会导致某些线程长期无法获得锁，出现 **“饥饿” 现象**。
    - **ReadWriteLock**：读写锁，分为读锁和写锁，**允许**多个线程**同时**获取**读**锁，但**写锁**是**排他**的。
    - **StampedLock**：JDK 8 引入的锁，支持乐观读、悲观读和写锁，性能更好。
        * **适合读多写少**的场景：提供了乐观读锁，读操作时无需加锁，可直接读取数据，仅在读取后检查数据是否被修改，若未修改则读取有效，避免了传统读写锁读操作加锁带来的性能开销，提升了并发读性能。例如缓存系统，多个线程频繁读取缓存数据，偶尔有线程更新缓存内容。
        * 可容忍**短暂数据不一致**的场景：乐观读锁允许在读取数据时其他线程进行写操作，因此读取的数据可能是过期的。若业务场景能接受这种短暂的数据不一致性，使用 `StampedLock` 的乐观读模式可显著提高性能。
        * 能够**避免写线程饥饿**：对写操作有较好的支持，能一定程度上避免这种情况，保证写操作能及时执行。例如在一个实时数据更新系统中，写线程负责更新重要数据，需要保证其能及时获取锁进行数据更新。

## synchronized 和 ReentrantLock 区别
+ **锁的获取和释放**：`synchronized` 是 Java 关键字，**自动**获取和释放锁；`ReentrantLock` 需要**手动**调用 `lock()` 和 `unlock()` 方法来获取和释放锁。
+ **公平性**：`synchronized` 是**非公平**锁；`ReentrantLock` **可**以通过构造函数指定是否为**公平**锁。
+ **锁的特性**：`ReentrantLock` 提供了**更多的特性**，如可中断锁、超时锁等。
+ **性能**：在 JDK 6 之前，`synchronized` 性能较差，JDK 6 之后进行了优化，两者**性能差距不大**。

## synchronized 底层原理，锁升级过程和原理
+ **底层原理**：`synchronized` 基于对象头中的 Mark Word 实现。Mark Word 是对象头的一部分，用于存储对象的哈希码、分代年龄和锁状态等信息。
+ **锁升级过程**：无锁 -> 偏向锁 -> 轻量级锁 -> 重量级锁。
    - **无锁**：对象初始状态为无锁状态。
    - **偏向锁**：当一个线程第一次访问同步块并获取锁时，会在对象头的 Mark Word 中记录该线程的 ID，以后该线程再次进入该同步块时无需进行任何同步操作，提高了单线程环境下的性能。
    - **轻量级锁**：当有其他线程尝试竞争偏向锁时，偏向锁会升级为轻量级锁。轻量级锁使用 CAS 操作来获取锁，避免了线程的阻塞和唤醒，提高了多线程环境下的性能。
    - **重量级锁**：当多个线程同时竞争轻量级锁时，轻量级锁会升级为重量级锁。重量级锁会使线程进入阻塞状态，性能较低。

## 实现线程安全的方式有哪些
+ **synchronized 关键字**：通过 `synchronized` 修饰方法或代码块，保证同一时刻只有一个线程可以访问被保护的资源。
+ **ReentrantLock**：使用 `ReentrantLock` 手动加锁和解锁，实现线程同步。
+ **原子类**：如 `AtomicInteger`、`AtomicLong` 等，使用 CAS 操作保证原子性。
+ **线程安全的集合**：如 `ConcurrentHashMap`、`CopyOnWriteArrayList` 等，内部实现了线程安全机制。
+ **volatile 关键字**：保证变量的可见性，禁止指令重排序。

## volatile 底层原理
`volatile` 关键字的底层原理基于内存屏障和 CPU 缓存一致性协议。当一个变量被声明为 `volatile` 时，会有以下效果：

+ **可见性**：当一个线程修改了 `volatile` 变量的值，会立即将该值刷新到主内存中，其他线程在读取该变量时，会直接从主内存中读取，保证了变量的可见性。
+ **禁止指令重排序**：编译器和处理器在进行指令优化时，会遵守 `volatile` 变量的读写顺序，不会将 `volatile` 变量的读写操作重排序到其他指令之前或之后。

## CAS 概念和原理
+ **概念**：CAS（Compare-And-Swap）是一种**无锁**算法，用于**实现原子操作**。它包含三个操作数：内存位置（V）、预期原值（A）和新值（B）。如果内存位置的值与预期原值相等，则将该位置的值更新为新值，否则不做任何操作。
+ **原理**：CAS 操作是通过 CPU 的原子指令实现的，保证了操作的原子性。在 Java 中，`Atomic` 系列类就是基于 CAS 实现的。

## 聊一下知道的线程池（执行流程、创建参数等）
[https://javaguide.cn/java/concurrent/java-thread-pool-summary.html](https://javaguide.cn/java/concurrent/java-thread-pool-summary.html)

线程池是一种多线程处理技术，它维护着一个线程集合，**用于管理和复用线程**，能够减少频繁创建和销毁线程带来的开销，以提高线程的使用效率和系统性能。

+ **工作原理**：线程池创建时会初始化一定数量的线程并放入线程池中。当有任务提交时，线程池会从池中选取一个空闲线程来执行任务。任务执行完毕后，线程不会被销毁，而是返回线程池等待下一个任务，以此实现线程的复用。
+ **核心组件**：通常包含任务队列、线程集合、线程工厂、拒绝策略等部分。任务队列用于存放待执行的任务；线程集合存储了线程池中的所有线程；线程工厂负责创建新线程；拒绝策略则在任务队列已满且线程池中的线程都在忙碌时，决定如何处理新提交的任务。
+ **优点**：可以**减少线程创建和销毁的开销**，提高响应速度，因为无需每次执行任务时都创建新线程。同时，它还能**有效控制线程数量**，避免因线程过多导致系统资源耗尽，增强了系统的稳定性和可靠性。
+ **应用场景**：广泛应用于各种需要处理大量并发任务的场景，如 Web 服务器处理客户端请求、消息队列的消费者处理消息、分布式系统中的任务调度等。
+ **执行流程**：
    1. 当有新任务提交时，线程池会先判断核心线程数是否已满，如果未满，则创建新的核心线程来执行任务。
    2. 如果核心线程数已满，会将任务放入任务队列中。
    3. 如果任务队列已满，会判断线程池的最大线程数是否已满，如果未满，则创建新的非核心线程来执行任务。
    4. 如果最大线程数也已满，会根据拒绝策略处理该任务。
+ **创建参数**：
    - **corePoolSize**：核心线程数，线程池始终保持的线程数量。
    - **maximumPoolSize**：最大线程数，线程池允许的最大线程数量。
    - **keepAliveTime**：线程空闲时间，当线程空闲时间超过该值时，非核心线程会被销毁。
    - **unit**：时间单位，用于指定 `keepAliveTime` 的时间单位。
    - **workQueue**：任务队列，用于存储等待执行的任务。
    - **threadFactory**：线程工厂，用于创建线程。
    - **handler**：拒绝策略，当任务队列和线程池都已满时，如何处理新提交的任务。

## 有哪些常用的任务队列和拒绝策略？
### 常用任务队列
任务队列用于存放提交但尚未被执行的任务，`ThreadPoolExecutor` 支持以下几种常用的任务队列：

+ **`ArrayBlockingQueue`**
    - **特点**：这是一个**有界**阻塞队列，基于数组实现。创建时需要指定队列的容量，一旦队列**满了**，新任务将**无法加入**。
    - **适用场景**：适用于需要**严格控制**并发任务**数量**的场景，可避免系统资源过度消耗。
+ **`LinkedBlockingQueue`**
    - **特点**：这是一个基于链表实现的阻塞队列，有两种情况。若创建时**指定了容量**，它就是**有界**队列；若**不指定**容量，默认容量为 `Integer.MAX_VALUE`，**可视为无界**队列。
    - **适用场景**：指定容量时，和 `ArrayBlockingQueue` 类似；不指定容量时，**适合任务处理速度比提交速度慢**的场景，但要注意可能导致内存溢出。
+ **`SynchronousQueue`**
    - **特点**：这是一个**不存储元素**的阻塞队列，每个**插入**操作**必须等待**另一个线程的**移除**操作，反之亦然。
    - **适用场景**：适合任务执行时间短、提交频繁的场景，能减少任务在队列中的等待时间。
+ **`PriorityBlockingQueue`**
    - **特点**：这是一个**支持优先级**的**无界**阻塞队列，元素会按照优先级排序。
    - **适用场景**：适用于任务有不同优先级的场景，优先级高的任务会优先被执行。

### 常用拒绝策略
当线程池中的线程都在忙碌且任务队列已满时，新提交的任务会触发拒绝策略。`ThreadPoolExecutor` 提供了以下几种常用的拒绝策略：

+ **`AbortPolicy`**
    - **特点**：这是默认的拒绝策略，当触发拒绝时，会**直接抛**出 `RejectedExecutionException` **异常**。
    - **适用场景**：适用于希望让调用者**感知到任务无法执行**的场景，调用者可根据异常进行相应处理。
+ **`CallerRunsPolicy`**
    - **特点**：当触发拒绝时，会**将任务返回给调用者线程执行**，即哪个线程提交的任务，就由哪个线程来执行该任务。
    - **适用场景**：适合**不希望任务丢失且对性能要求不高**的场景，可降低新任务的提交速度。
+ **`DiscardPolicy`**
    - **特点**：当触发拒绝时，会**直接丢**弃新提交的任务，不会抛出任何异常。
    - **适用场景**：适用于**对**任务**丢失不敏感**的场景，如一些统计类任务。
+ **`DiscardOldestPolicy`**
    - **特点**：当触发拒绝时，会**丢**弃任务队列中**最老**的任务，然后**尝试**将**新**任务**加**入队列。
    - **适用场景**：适用于**希望执行最新任务**的场景，可保证新任务有机会被执行。

## 为什么 LinkedBlockingQueue 适合任务处理速度比提交速度慢的场景
+ **缓冲能力强**：`LinkedBlockingQueue` 可以是无界队列，默认容量为 `Integer.MAX_VALUE`。这意味着它理论上可以无限容纳新提交的任务，能在任务处理速度较慢时，为大量等待处理的任务**提供缓冲空间，减少任务被拒绝的可能性**。
+ **阻塞机制合理**：当生产者（提交任务的线程）向队列中添加任务时，如果队列已满，生产者线程会被阻塞，直到有消费者（处理任务的线程）从队列中取出任务，腾出空间。这种阻塞机制可以协调生产者和消费者的速度，避免因任务提交过快而导致系统资源耗尽或程序崩溃。
+ **并发性能较好**：`LinkedBlockingQueue` 内部采用了**分离的锁机制**，分别用于读写操作，这使得在高并发环境下，**生产者和消费者可以同时访问队列**，提高了队列的并发性能。即使任务提交速度快，处理速度慢，也能在一定程度上保证系统的稳定性和响应性。

## 核心线程数为 0 的情况怎么处理？
当核心线程数为 0 时，新提交的任务会直接放入任务队列中。如果任务队列已满，会根据最大线程数和拒绝策略来处理任务。由于没有核心线程，线程池在**没有任务时不会占用系统资源**，但在有新任务提交时，需要创建新的线程来执行任务，**可能会有一定的延迟**。

## 对 ThreadLocal 的了解，它的应用场景
[https://javaguide.cn/java/concurrent/threadlocal.html](https://javaguide.cn/java/concurrent/threadlocal.html)

+ **了解**：`ThreadLocal` 是一个线程局部变量，它为每个使用该变量的线程都提供一个独立的副本，每个线程都可以独立地改变自己的副本，而不会影响其他线程的副本。
+ **应用场景**：
    - **数据库连接管理**：每个线程使用独立的数据库连接，避免线程之间的干扰。
    - **会话管理**：每个线程保存自己的会话信息，方便在不同方法中使用。
    - **事务管理**：每个线程维护自己的事务状态。

## 多线程计数
+ **使用 `Synchronized` 关键字**：通过 `Synchronized` 修饰方法或代码块，保证同一时刻只有一个线程可以对计数器进行操作。
+ **使用 `ReentrantLock`**：手动加锁和解锁，实现线程同步。
+ **使用原子类**：如 `AtomicInteger`、`AtomicLong` 等，使用 CAS 操作保证原子性。

## 对 AQS 的了解
[https://javaguide.cn/java/concurrent/aqs.html#aqs-%E4%BB%8B%E7%BB%8D](https://javaguide.cn/java/concurrent/aqs.html#aqs-%E4%BB%8B%E7%BB%8D)

AQS（AbstractQueuedSynchronizer）是 Java 并发包中的一个**抽象类**，是**实现锁和同步器的基础框架**。它使用一个 `int` 类型的状态变量（`state`）来表示同步状态，通过 CAS 操作来修改状态。AQS 内部维护了一个 FIFO 队列，用于存储等待获取锁的线程。许多锁和同步器，如 `ReentrantLock`、`CountDownLatch` 等，都是基于 AQS 实现的。

## 线程池的创建方式
+ **使用 `Executors` 工厂类**：`Executors` 提供了一些静态方法来创建不同类型的线程池，如 `newFixedThreadPool`、`newCachedThreadPool`、`newSingleThreadExecutor` 等。
+ **使用 `ThreadPoolExecutor` 构造函数**：通过 `ThreadPoolExecutor` 的构造函数手动指定线程池的参数，创建自定义的线程池。

## Executors 是怎么创建线程的
`Executors` 是一个工具类，提供了一些静态方法来创建不同类型的线程池。这些方法内部实际上是通过 `ThreadPoolExecutor` 来创建线程池的，只是根据不同的需求设置了不同的参数。例如，`newFixedThreadPool` 方法创建一个固定大小的线程池，核心线程数和最大线程数相等，任务队列使用 `LinkedBlockingQueue`。

## 多线程的实现方式，两种实现接口有什么区别？
+ **实现方式**：
    - **继承 `Thread`** 类**：创建一个类继承 `Thread` 类，重写 `run()` 方法，调用 `start()` 方法启动线程。
    - **实现 `Runnable` 接口**：创建一个类实现 `Runnable` 接口，实现 `run()` 方法，然后将该类的实例作为参数传递给 `Thread` 类的构造函数，创建 `Thread` 对象并调用 `start()` 方法启动线程。
    - **实现 `Callable` 接口**：创建一个类实现 `Callable` 接口，实现 `call()` 方法，该方法有返回值。通过 `FutureTask` 包装 `Callable` 对象，再将 `FutureTask` 对象传递给 `Thread` 类的构造函数，创建 `Thread` 对象并调用 `start()` 方法启动线程。可以通过 `FutureTask` 的 `get()` 方法获取线程执行的结果。
    - **通过线程池创建**：
+ **区别**：
    - **继承 `Thread`** 类**：由于 Java 是**单继承**的，继承了 `Thread` 类就不能再继承其他类，**灵活性较差**。
    - **实现 `Runnable`** 接口**：可以**避免单继承**的限制，一个类可以实现多个接口，提高了代码的可扩展性和复用性。
    - **实现 `Callable`** 接口**：与 `Runnable` 接口相比，`Callable` 接口的 `call()` 方法**有返回值**，并且**可以抛出异常**。

```java
// 实现 Runnable 接口的任务类
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " is running.");
    }
}

public class ThreadPoolExample {
    public static void main(String[] args) {
        // 创建固定大小为 2 的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(2);

        // 创建任务
        MyRunnable task1 = new MyRunnable();
        MyRunnable task2 = new MyRunnable();

        // 提交任务到线程池
        executorService.execute(task1);
        executorService.execute(task2);

        // 关闭线程池
        executorService.shutdown();
    }
}
```

```java
// 实现 Callable 接口，泛型指定返回值类型为 Integer
class MyCallable implements Callable<Integer> {
    private final int taskId;

    public MyCallable(int taskId) {
        this.taskId = taskId;
    }

    // 重写 call 方法，该方法会在线程执行时被调用
    @Override
    public Integer call() throws Exception {
        System.out.println("Task " + taskId + " is running.");
        // 模拟任务执行耗时
        Thread.sleep(2000);
        return taskId * 10;
    }
}

public class CallableThreadExample {
    public static void main(String[] args) {
        // 创建一个固定大小为 2 的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        // 用于存储 Future 对象，Future 可用于获取异步任务的结果
        Future<Integer> future1 = executorService.submit(new MyCallable(1));
        Future<Integer> future2 = executorService.submit(new MyCallable(2));

        try {
            // 获取第一个任务的结果
            Integer result1 = future1.get();
            System.out.println("Task 1 result: " + result1);
            // 获取第二个任务的结果
            Integer result2 = future2.get();
            System.out.println("Task 2 result: " + result2);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        // 关闭线程池
        executorService.shutdown();
    }
}    
```

## Java 的线程怎么防止虚假唤醒
在 Java 中，线程的虚假唤醒是指线程在**没有收到明确的通知**时就从等待状态中**被唤醒**。为了防止虚假唤醒，**应该在 `while` 循环中调用 `wait()` 方法，而不是在 `if` 语句中**。示例代码如下：

```java
synchronized (lock) {
    while (condition) {
        lock.wait();
    }
    // 执行相应的操作
}
```

在上述代码中，`condition` 是一个布尔表达式，表示线程等待的条件。当线程被唤醒时，会再次检查 `condition` 的值，如果条件仍然不满足，线程会继续等待，从而避免了虚假唤醒的问题。

