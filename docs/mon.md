---
title: "附录　管程"
---

# 附录　管程

<div class="chap-en">Monitors</div>

在并发编程开始大行其道的那个年代，面向对象编程也在逐步兴起。毫不意外，人们开始琢磨怎样才能把同步机制融入一个更有结构的编程环境。

由此产生的一种做法就是<strong>管程</strong>（monitor）。它最早由 Per Brinch Hansen 提出 [BH73]，后来由 Tony Hoare 加以完善 [H74]；管程背后的想法其实相当简单。看看下面这个用 C++ 记法写的“假想”管程：

```c
monitor class account {
private:
    int balance = 0;

public:
    void deposit(int amount) {
        balance = balance + amount;
    }
    void withdraw(int amount) {
        balance = balance - amount;
    }
};
```

<div class="code-cap"><span class="code-label">图 D.1</span>一个假想的管程类</div>

注意：之所以说它是“假想”的类，是因为 C++ 并不支持管程，所以 `monitor` 这个关键字根本不存在。不过 Java 确实支持管程，用的就是所谓的 `synchronized` 方法。下文我们既会看如何在 C/C++ 里做出一个很像管程的东西，也会看如何使用 Java 的 `synchronized` 方法。

在这个例子里，你会注意到有我们的老朋友 `account`，还有一些往余额里存入、从中取出款项的例程。你同样会注意到，这些都算临界区：如果多个线程并发地调用它们，就会出现竞态条件，结果可能出错。

可是在管程类里就不会有麻烦，因为管程保证同一时刻只有一个线程能在管程内部活动。于是上面那个例子就是一段完全安全、可以正常工作的代码；多个线程可以调用 `deposit()` 或 `withdraw()`，而互斥始终得到保持。

管程是怎么做到这一点的？很简单：用一把锁。只要有线程试图调用管程里的例程，它就会隐式地去获取管程锁。如果获取成功，它就能进入这个例程、执行方法里的代码；如果获取不到，它就会阻塞，直到正在管程内的那个线程把手头的事情做完。所以，如果我们写一个下面这样的 C++ 类，它就能达成与上面的管程类完全相同的目标：

```c
class account {
private:
    int balance = 0;
    pthread_mutex_t monitor;

public:
    void deposit(int amount) {
        pthread_mutex_lock(&monitor);
        balance = balance + amount;
        pthread_mutex_unlock(&monitor);
    }
    void withdraw(int amount) {
        pthread_mutex_lock(&monitor);
        balance = balance - amount;
        pthread_mutex_unlock(&monitor);
    }
};
```

<div class="code-cap"><span class="code-label">图 D.2</span>一个行为类似管程的 C++ 类</div>

从这个例子可以看出，管程自动替你做的事情其实并不多，基本上就是获取一把锁、再释放它而已。但正是靠这一点，我们达到了管程的要求：正如期望的那样，`deposit()` 或 `withdraw()` 内部同时只有一个线程在活动。

## D.1 为什么要用管程？

你也许会想，既然可以直接用显式加锁，为什么还要发明管程呢？在那个年代，面向对象编程刚刚开始流行。所以当时的想法是，把并发编程中的一些关键概念与面向对象的一些基本做法优雅地融合起来。仅此而已。

## D.2 除了自动加锁，我们还能得到什么？

```c
monitor class BoundedBuffer {
  private:
    int buffer[MAX];
    int fill, use;
    int fullEntries = 0;
    cond_t empty;
    cond_t full;

  public:
    void produce(int element) {
        if (fullEntries == MAX)    // line P0
            wait(&empty);          // line P1
        buffer[fill] = element;    // line P2
        fill = (fill + 1) % MAX;   // line P3
        fullEntries++;             // line P4
        signal(&full);             // line P5
    }

    int consume() {
        if (fullEntries == 0)      // line C0
            wait(&full);           // line C1
        int tmp = buffer[use];     // line C2
        use = (use + 1) % MAX;     // line C3
        fullEntries--;             // line C4
        signal(&empty);            // line C5
        return tmp;                // line C6
    }
}
```

<div class="code-cap"><span class="code-label">图 D.3</span>使用管程与 Hoare 语义的生产者/消费者</div>

回到正题。从前面关于信号量的讨论我们知道，光有锁还不够；举例来说，为了实现生产者/消费者方案，我们之前用信号量既让线程在等待某个条件变化时睡眠（比如生产者等待缓冲区被清空），也用来在某个条件发生变化时唤醒一个线程（比如消费者通知说它确实清空了一个缓冲区）。

管程通过一种称为<strong>条件变量</strong>（condition variable）的显式构造来提供这类功能。下面来看看用管程和条件变量写成的生产者/消费者方案。

这个管程类里有两个例程：`produce()` 和 `consume()`。生产者线程会反复调用 `produce()` 把数据放进有界缓冲区，而消费者会反复调用 `consume()`。这个例子是对 Hoare 解法 [H74] 的现代改写。

你应当注意到，这段代码与上一篇里基于信号量的解法有不少相似之处。一个主要区别在于，条件变量必须与一个显式的状态变量配合使用；在本例中就是整数 `fullEntries`，它决定生产者或消费者是否需要等待，具体取决于它当时的状态。相比之下，信号量内部自带一个数值，起的是同样的作用。所以，条件变量必须搭配某种外部状态值，才能达到同样的目的。

不过，这段代码最关键的地方在于两个条件变量 `empty` 和 `full` 的使用，以及分别作用于它们的 `wait()` 与 `signal()` 调用。这两个操作的作用与你想的完全一致：`wait()` 在某个条件上把调用线程阻塞住；`signal()` 唤醒一个正在该条件上等待的线程。

不过，这些调用的运作方式有一些微妙之处；理解它们的语义，对理解这段代码为什么能工作是至关重要的。在操作系统研究者称为 **Hoare 语义**（没错，这名字有点不幸）的语义下，`signal()` 会立即唤醒一个正在等待的线程并让它运行；于是，当前运行线程隐式持有的管程锁会立刻转交给被唤醒的线程，后者一直运行，直到它阻塞或退出管程。注意，等待的线程可能不止一个；`signal()` 只唤醒其中一个并让它运行，其余的必须等待下一次信号。

一个简单的例子能帮我们更好地理解这段代码。假设有两个线程，一个是生产者，另一个是消费者。消费者先运行，调用 `consume()`，结果发现 `fullEntries = 0`（C0），因为缓冲区里还什么都没有。于是它调用 `wait(&full)`（C1），等待缓冲区被填满。接着生产者运行，发现不必等待（P0），把元素放入缓冲区（P2），递增 `fill` 索引（P3）和 `fullEntries` 计数（P4），然后调用 `signal(&full)`（P5）。在 Hoare 语义下，生产者发出信号之后不会继续运行；相反，这个信号会立刻把控制权转交给等待中的消费者，消费者从 `wait()` 返回（C1），随即取走生产者刚产生的元素（C2），如此继续。只有等消费者返回之后，生产者才会再次运行，并从 `produce()` 例程返回。

## D.3 当理论遇上实践

写出上面那个解法、并给出 `signal()` 与 `wait()` 精确语义的 Tony Hoare 是一位理论家。他显然也很聪明——毕竟快速排序就是他发明的 [H61]。但事实证明，这种发信号与等待的语义对真实实现来说并不理想。正如那句老话所说：理论上，理论与实践没有区别；但在实践中，有。

::: aside 老话：理论与实践

这句老话是“理论上，理论与实践没有区别；但在实践中，有。”当然，只有实践者才会这么对你说；搞理论的人无疑能证明这句话并不成立。
:::

几年之后，Xerox PARC 的 Butler Lampson 和 David Redell 正在构建一门名为 Mesa 的并发语言，他们决定把管程作为基本的并发原语 [LR80]。这两位是知名的系统研究者，他们很快发现，Hoare 语义虽然更便于做证明，却很难在真实系统中实现（原因很多，这里恐怕讲不完）。

具体来说，为了做出一个能工作的管程实现，Lampson 和 Redell 决定以一种微妙却关键的方式改变 `signal()` 的含义。`signal()` 现在只被当作一个提示 [L83]：它会把一个等待中的线程从阻塞态移到就绪态，但不会立刻让它运行。相反，发出信号的线程会继续掌握控制权，直到它退出管程并被调度出去为止。

## D.4 糟糕，出现竞态了

有了这套新的 Mesa 语义，我们再来检查上面的代码。仍然设想一个消费者（消费者 1）进入管程，发现缓冲区是空的，于是等待（C1）。这时生产者来了，把缓冲区填满，并发出“缓冲区已被填满”的信号，从而把等待中的消费者从在 `full` 条件变量上阻塞的状态变为就绪。生产者继续运行一段时间，最终让出 CPU。

但休斯顿，我们有麻烦了。你看出来了吗？设想另一个消费者（消费者 2）现在调用 `consume()` 例程；它会发现缓冲区是满的，于是消费掉，然后返回，同时把 `fullEntries` 置为 0。现在看出问题了吗？好，问题来了。我们的老朋友消费者 1 终于得以运行，从 `wait()` 返回，满心以为缓冲区是满的（C1……）；不幸的是，这已经不是事实了，因为消费者 2 趁消费者 1 还没来得及消费，就把缓冲区里的东西取走了。于是这段代码不工作，原因是在生产者调用 `signal()` 与消费者 1 从 `wait()` 返回之间，条件已经变了。下面的时间线展示了这个问题：

```c
Producer
Consumer1
Consumer2
C0 (fullEnt=0)
C1 (Con1: blocked)
P0 (fullEnt=0)
P4 (fullEnt=1)
P5 (Con1: ready)
C0 (fullEnt=1)
C4 (fullEnt=0)
C2 (using a buffer,
fullEnt=0!)
```

<div class="fig-cap-plain"><span class="fig-label">图 D.4</span>为什么这段代码在 Hoare 语义下不工作</div>

幸运的是，要从 Hoare 语义切换到 Mesa 语义，程序员只需做一点小改动，就能得到可用的解法。具体来说，线程被唤醒后应当重新检查它所等待的条件；因为 `signal()` 只是一个提示，条件有可能已经变了（甚至变了好几次），所以等待线程真正运行时，条件未必还处在期望的状态。在我们的例子里，有两行代码必须改，即 P0 和 C0：

```c
public:
  void produce(int element) {
    while (fullEntries == MAX) // P0 行（if 改为 while）
      wait(&empty);          // line P1
    buffer[fill] = element;    // line P2
    fill = (fill + 1) % MAX;   // line P3
    fullEntries++;             // line P4
    signal(&full);             // line P5
  }

  int consume() {
    while (fullEntries == 0)   // line C0 (CHANGED IF->WHILE)
      wait(&full);           // line C1
    int tmp = buffer[use];     // line C2
    use = (use + 1) % MAX;     // line C3
    fullEntries--;             // line C4
    signal(&empty);            // line C5
    return tmp;                // line C6
  }
```

<div class="code-cap"><span class="code-label">图 D.5</span>使用管程与 Mesa 语义的生产者/消费者</div>

说到底也不算太难。正因为这样实现起来很方便，今天几乎所有使用条件变量进行发信号和等待的系统，采用的都是 Mesa 语义。所以，如果这门课你别的什么都没记住，至少可以记住这一条：<strong>被唤醒后一定要重新检查条件！</strong>说得更直白些：检查条件时用 `while` 循环，别用 `if` 语句。注意，这样做在任何情况下都是正确的，哪怕你运行在采用 Hoare 语义的系统上；只不过在那种情况下，你会多做一次不必要的条件重测而已。

<div class="fig-cap-plain"><span class="fig-label">图 D.6</span>生产者/消费者运行过程中的队列变化</div>

## D.5 稍微窥探一下内部实现

为了更好地理解 Mesa 语义为什么更容易实现，我们再多了解一点 Mesa 管程的内部实现。在 [LR80] 中，Lampson 和 Redell 描述了线程在任意时刻可能身处的三种不同队列：就绪队列、管程锁队列和条件变量队列。注意，一个程序可能有多个管程类、多个条件变量实例；上述每一类东西的每个实例都对应一个队列。

因此，对于单个有界缓冲区管程，我们要考虑四个队列：一个就绪队列、一个管程队列，以及两个条件变量队列（一个对应 `full` 条件，一个对应 `empty`）。为了更好地理解线程库如何管理这些队列，我们将展示在生产者/消费者示例中，线程是如何在这些队列之间迁移的。

在这个例子里，我们走一遍这样一种情形：消费者可能被唤醒，却发现没有东西可消费。考虑下面这条时间线。左边是两个消费者（Con1 和 Con2）以及一个生产者（Prod），以及它们各自正在执行哪一行代码；右边是本例要跟踪的四个队列的状态：可运行进程的就绪队列、名为 Monitor 的管程锁队列，以及 `empty` 和 `full` 两个条件变量队列。我们还会跟踪时间（t）、当前运行的线程（就绪队列中正在运行的那个线程用方括号括起来），以及 `fullEntries` 的值（FE）。

从时间线可以看出，消费者 2（Con2）抢先一步，在消费者 1（Con1）有机会消费之前就把可用的数据消费掉了（t=9..14）——Con1 从 t=1 起就一直在 `full` 条件上等待被通知。不过，Con1 确实被生产者的信号唤醒了（t=7），因此它又运行起来，尽管等它真正运行时缓冲区已经空了。如果 Con1 不重新检查状态变量 `fullEntries`（t=16），它就会在没有数据可消费的时候错误地尝试去消费。可见，正是这种自然的实现方式把我们引向了 Mesa 语义（而不是 Hoare 语义）。

## D.6 管程的其他用途

在关于 Mesa 的论文中，Lampson 和 Redell 还指出了几处需要另一种发信号方式的场合。例如，考虑下面这个内存分配器（图 D.7）。

```c
monitor class Semaphore {
    int s; // 信号量的值
    Semaphore(int value) {
        s = value;
    }
    void wait() {
        while (s <= 0)
            wait();
        s--;
    }
    void post() {
        s++;
        signal();
    }
};
```

<div class="code-cap"><span class="code-label">图 D.7</span>一个简单的内存分配器</div>

为了把注意力集中在唤醒与发信号的条件上，这个例子省去了很多细节。结果发现，上面的 `signal`/`wait` 代码并不完全正确；你能看出为什么吗？

设想两个线程调用 `allocate`。第一个调用 `allocate(20)`，第二个调用 `allocate(10)`。此时没有可用内存，于是两个线程都调用 `wait()` 并阻塞。过了一段时间，另一个线程调用 `free(p, 15)`，释放了 15 字节内存，然后发出信号表示自己已经完成释放。不幸的是，它唤醒的是那个等待 20 字节的线程；该线程重新检查条件，发现只有 15 字节可用，于是再次调用 `wait()`。而那个本可以从这 15 字节中获益的线程（也就是调用 `allocate(10)` 的线程）却没有被唤醒。Lampson 和 Redell 给出了一个简单的解决办法：不用只唤醒一个等待线程的 `signal()`，而是使用唤醒所有等待线程的 `broadcast()`。于是所有线程都被唤醒，在上面这个例子里，等待 10 字节的线程会发现有 15 字节可用，从而成功完成分配。

在 Mesa 语义下，使用 `broadcast()` 总是正确的，因为线程被唤醒时本来就应该重新检查它关心的条件。但它可能带来性能问题，所以只在确实需要时才用。在上面的例子里，一次 `broadcast()` 可能唤醒上百个等待线程，结果只有一个线程成功继续执行，其余线程又立刻重新阻塞；这个问题有时被称为<strong>惊群</strong>（thundering herd），由于会引发大量额外的上下文切换，代价不小。

## D.7 用管程实现信号量

你大概已经看出管程和信号量有很多相似之处。不出所料，两者可以互相实现。下面我们展示如何用管程实现一个信号量类（图 D.8）。

```c
MONITORS (DEPRECATED)
```

<div class="code-cap"><span class="code-label">图 D.8</span>用管程实现一个信号量</div>

可以看到，`wait()` 只是等待信号量的值大于 0，然后把它的值减一；而 `post()` 把值加一，并唤醒一个等待中的线程（如果有的话）。就这么简单。

要把这个类当作二元信号量（也就是锁）使用，只需把信号量初始化为 1，然后在临界区前后成对地放上 `wait()`/`post()`。于是我们也就说明了：管程可以用来实现信号量。

## D.8 现实世界中的管程

前面我们已经提到，我们用的是“假想”的管程；C++ 根本没有这个概念。下面我们展示如何写一个类似管程的 C++ 类，以及 Java 如何用 `synchronized` 方法达到类似的目的。

### 一个还算像样的 C++ 管程

下面是用锁和条件变量写成的 C++ 版生产者/消费者代码（图 D.9）。

```c
            pthread_cond_wait(&empty, &monitor);
        buffer[fill] = element;
        fill = (fill + 1) % MAX;
        fullEntries++;
        pthread_cond_signal(&full);
        pthread_mutex_unlock(&monitor);
    }

    int consume() {
        pthread_mutex_lock(&monitor);
        while (fullEntries == 0)
            pthread_cond_wait(&full, &monitor);
        int tmp = buffer[use];
        use = (use + 1) % MAX;
        fullEntries--;
        pthread_cond_signal(&empty);
        pthread_mutex_unlock(&monitor);
        return tmp;
    }
}
```

<div class="code-cap"><span class="code-label">图 D.9</span>用 C++ 实现的“管程式”生产者/消费者</div>

从这个例子可以看出，假想管程代码和我们上面这个能真正工作的 C++ 类差别不大。当然，一个明显的区别是显式使用了一把名为 `monitor` 的锁。更微妙的差别在于改用 POSIX 标准的 `pthread_cond_signal()` 和 `pthread_cond_wait()` 调用。特别要注意，调用 `pthread_cond_wait()` 时还要把等待时持有的那把锁一并传进去。`pthread_cond_wait()` 内部需要这把锁，因为它在让当前线程睡眠时必须释放这把锁，而在返回调用者之前又必须重新获取它（这与管程内部的行为相同，只不过这里是显式的锁）。

### 一个 Java 管程

有意思的是，Java 的设计者决定采用管程，因为他们认为这是把同步原语优雅地加进一门语言的好办法。要使用它，只需给想当作管程使用的方法或一组方法加上 `synchronized` 关键字（下面这个例子来自 Sun 官方文档站点 [S12a,S12b]）：

```c
public class SynchronizedCounter {
private int c = 0;
public synchronized void increment() {
public synchronized void decrement() {
public synchronized int value() {
return c;
```

<div class="code-cap"><span class="code-label">图 D.10</span>一个使用同步方法的简单 Java 类</div>

这段代码做的正是你所想的事：提供一个线程安全的计数器。因为同一时刻只允许一个线程进入管程，所以只有一个线程能更新 `c` 的值，竞态条件也就被避免了。

### Java 与单一条件变量

在最初的 Java 版本里，每个 `synchronized` 类还附带一个条件变量。要使用它，就调用 `wait()` 或 `notify()`（有时人们用 notify 这个词代替 signal，但两者意思相同）。奇怪的是，在这个最初的实现里，无法拥有两个（或更多）条件变量。你可能已经注意到，在生产者/消费者方案中我们总是用两个：一个用来通知缓冲区已被清空，另一个用来通知缓冲区已被填满。

为了理解只提供一个条件变量有什么局限，我们设想一个只有一个条件变量的生产者/消费者方案。假设两个消费者先运行，都卡在等待上。然后生产者运行，填入一个缓冲区，唤醒一个消费者，接着想再填一次，却发现缓冲区已满（MAX=1）。于是我们的处境是：一个生产者在等待空缓冲区，一个消费者在等待满缓冲区，还有一个先前在等待的消费者因为被唤醒而即将运行。

这个消费者随后运行，取走缓冲区里的数据。可是当它调用 `notify()` 时，唤醒的是在该条件上等待的某一个线程。由于只有一个条件变量，它可能唤醒的是那个等待中的消费者，而不是等待中的生产者。于是这个方案行不通。

要解决这个问题，可以再一次采用广播的办法。在 Java 里，调用 `notifyAll()` 来唤醒所有等待线程。这样，消费者会同时唤醒一个生产者和一个消费者，但被唤醒的消费者会发现 `fullEntries` 等于 0，于是重新睡去，而生产者则继续往下执行。和通常情况一样，唤醒所有等待者可能引发惊群问题。

由于这一缺陷，Java 后来加入了显式的 `Condition` 类，从而能够更高效地解决这个问题以及其他类似的并发问题。

## D.9 小结

我们介绍了管程这一结构化概念，它由 Brinch Hansen 在 70 年代初提出，随后由 Hoare 加以完善。线程在管程内部运行时隐式持有一把管程锁，从而阻止其他线程进入管程，这就让互斥的构造变得轻而易举。

我们还介绍了显式的条件变量，它让线程能够像上一篇使用信号量那样进行 `signal()` 和 `wait()`。`signal()` 与 `wait()` 的语义至关重要；由于所有现代系统实现的都是 Mesa 语义，线程在睡眠时所等的那个条件必须重新检查，才能保证执行正确。因此，`signal()` 只是一个“有东西变了”的提示；确保条件适合自己继续执行，是被唤醒线程自己的责任。

最后，由于 C++ 不支持管程，我们展示了如何用显式的 pthread 锁和条件变量来模拟管程；也看到了 Java 如何用 `synchronized` 例程支持管程，以及在这种环境里只提供一个条件变量会带来哪些局限。

## 参考文献
