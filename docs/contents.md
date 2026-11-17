---
title: 完整目录
---

# 完整目录

<div class="toc-vol">

<a class="toc-ch" href="/ostep-zh/ch25">
<span class="toc-ch-no"></span>
<span class="toc-ch-title">关于并发的对话</span>
<span class="toc-ch-en">A Dialogue on Concurrency</span>
</a>
<div class="toc-secs">
关于并发的对话<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch26">
<span class="toc-ch-no">第 26  章</span>
<span class="toc-ch-title">并发：介绍</span>
<span class="toc-ch-en">Concurrency: An Introduction</span>
</a>
<div class="toc-secs">
26.1 为什么要用线程？<br>
26.2 一个例子：线程创建<br>
26.3 为什么更糟：共享数据<br>
26.4 问题的核心：不受控的调度<br>
26.5 对原子性的渴望<br>
26.6 还有一个问题：等待另一个线程<br>
26.7 小结：为什么要在操作系统课里讲？<br>
参考文献<br>
作业（模拟）<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch27">
<span class="toc-ch-no">第 27  章</span>
<span class="toc-ch-title">线程 API</span>
<span class="toc-ch-en">Interlude: Thread API</span>
</a>
<div class="toc-secs">
27.1 线程创建<br>
27.2 线程完成<br>
27.3 锁<br>
27.4 条件变量<br>
27.5 编译与运行<br>
27.6 小结<br>
参考文献<br>
作业（代码）<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch28">
<span class="toc-ch-no">第 28  章</span>
<span class="toc-ch-title">锁</span>
<span class="toc-ch-en">Locks</span>
</a>
<div class="toc-secs">
28.1 锁：基本思想<br>
28.2 Pthread 锁<br>
28.3 构造一把锁<br>
28.4 评估锁<br>
28.5 控制中断<br>
28.6 一次失败的尝试：只用加载和存储<br>
28.7 用测试并设置构造可用的自旋锁<br>
28.8 评估自旋锁<br>
28.9 比较并交换<br>
28.10 链接加载与条件存储<br>
28.11 取并加<br>
28.12 自旋太多怎么办？<br>
28.13 一个简单的办法：干脆让出 CPU<br>
28.14 用队列：睡眠代替自旋<br>
28.15 不同的操作系统，不同的支持<br>
28.16 两阶段锁<br>
28.17 小结<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch29">
<span class="toc-ch-no">第 29  章</span>
<span class="toc-ch-title">基于锁的并发数据结构</span>
<span class="toc-ch-en">Lock-based Concurrent Data Structures</span>
</a>
<div class="toc-secs">
29.1 并发计数器<br>
29.2 并发链表<br>
29.3 并发队列<br>
29.4 并发哈希表<br>
29.5 小结<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch30">
<span class="toc-ch-no">第 30  章</span>
<span class="toc-ch-title">条件变量</span>
<span class="toc-ch-en">Condition Variables</span>
</a>
<div class="toc-secs">
30.1 定义与例程<br>
30.2 生产者 / 消费者（有界缓冲区）问题<br>
30.3 覆盖条件<br>
30.4 小结<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch31">
<span class="toc-ch-no">第 31  章</span>
<span class="toc-ch-title">信号量</span>
<span class="toc-ch-en">Semaphores</span>
</a>
<div class="toc-secs">
31.1 信号量：定义<br>
31.2 二值信号量（锁）<br>
31.3 用信号量实现顺序<br>
31.4 生产者/消费者（有界缓冲区）问题<br>
31.5 读写锁<br>
31.6 哲学家就餐<br>
31.7 线程节流<br>
31.8 如何实现信号量<br>
31.9 小结<br>
参考文献<br>
作业（代码）<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch32">
<span class="toc-ch-no">第 32  章</span>
<span class="toc-ch-title">常见并发缺陷</span>
<span class="toc-ch-en">Common Concurrency Problems</span>
</a>
<div class="toc-secs">
32.1 存在哪些类型的缺陷？<br>
32.2 非死锁缺陷<br>
32.3 死锁缺陷<br>
32.4 小结<br>
参考文献<br>
作业（代码）<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch33">
<span class="toc-ch-no">第 33  章</span>
<span class="toc-ch-title">基于事件的并发</span>
<span class="toc-ch-en">Event-based Concurrency (Advanced)</span>
</a>
<div class="toc-secs">
33.1 基本思路：事件循环<br>
33.2 一个重要的 API：select()（或 poll()）<br>
33.3 使用 select()<br>
33.4 为什么更简单？不需要锁<br>
33.5 一个问题：阻塞的系统调用<br>
33.6 一种解决方案：异步 I/O<br>
33.7 另一个问题：状态管理<br>
33.8 事件驱动方式仍然困难的地方<br>
33.9 小结<br>
参考文献<br>
作业（代码）<br>
</div>
<a class="toc-ch" href="/ostep-zh/ch34">
<span class="toc-ch-no">第 34  章</span>
<span class="toc-ch-title">关于并发的总结对话</span>
<span class="toc-ch-en">Summary Dialogue on Concurrency</span>
</a>
<div class="toc-secs">
关于并发的总结对话<br>
</div>
<a class="toc-ch" href="/ostep-zh/mon">
<span class="toc-ch-no"></span>
<span class="toc-ch-title">附录　管程</span>
<span class="toc-ch-en">Monitors</span>
</a>
<div class="toc-secs">
D.1 为什么要用管程？<br>
D.2 除了自动加锁，我们还能得到什么？<br>
D.3 当理论遇上实践<br>
D.4 糟糕，出现竞态了<br>
D.5 稍微窥探一下内部实现<br>
D.6 管程的其他用途<br>
D.7 用管程实现信号量<br>
D.8 现实世界中的管程<br>
D.9 小结<br>
参考文献<br>
</div>
</div>
