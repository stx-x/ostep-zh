# 翻译任务简报 · OSTEP《操作系统导论》并发部分

把英文 Markdown 译文**完整、准确、通顺**地翻译为中文 Markdown（用于 VitePress 网页）。

## 输入输出

- 输入：`/Users/kk/WorkBuddy/os翻译/ostep/src/chXX.md`
- 输出：`/Users/kk/WorkBuddy/os翻译/ostep/docs/chapters/chXX.md`
- 文件开头**不要**加 frontmatter，直接从正文开始（外层会处理）。

## 源文件已做好的标记

| 标记 | 含义 | 输出要求 |
|---|---|---|
| ```` ```c ... ``` ```` | C 代码块 | **原样保留**，代码与注释都不译 |
| `<figure class="book-figure">…</figure>` | 已裁好的图，含 `Figure X.Y` 编号 | 保留 HTML 结构，只把图注文字译成中文 |
| `<div class="code-cap">…</div>` | 代码清单的题注 | 保留结构，译题注文字 |
| `<div class="fig-cap-plain">…</div>` | 无图题注（表格类） | 同上 |
| `::: aside 标题` / `::: tip` / `::: crux` … `:::` | 边注 / 提示 / 核心问题框 | 保留 `:::` 容器语法，**标题与正文都要译** |
| `## 26.1 Why Use Threads?` | 小节标题 | 译为 `## 26.1 为什么要用线程？` |

## 翻译要求

1. **逐段翻译，不省略、不合并、不概括。** 源文件每一段都要有对应中文。
2. **语言要通顺**：像中文技术书，不要翻译腔。避免"被…所…"、长定语堆叠、机械对应。
3. 代码里的标识符（`pthread_create`、`counter`、`lock`）保持英文，正文中提到时用反引号包裹。
4. **术语统一**（见下表），首次出现可括注英文。
5. 图注格式：`<span class="fig-label">图 26.1</span>单线程与多线程的地址空间`（把 Figure 改成 图）。
6. 对话章（ch25/ch34）是师生问答体，保持口语、轻松的语气，用**加粗人名**（如 **教授**、**学生**）。
7. 数学/符号保持原样（`1e7`、`<`、`&` 等）。

## 术语表

| 英文 | 中文 |
|---|---|
| thread | 线程 |
| concurrency | 并发 |
| race condition | 竞态条件 |
| critical section | 临界区 |
| mutual exclusion | 互斥 |
| atomic | 原子（的） |
| lock | 锁 |
| spin lock | 自旋锁 |
| mutex | 互斥锁 |
| condition variable | 条件变量 |
| semaphore | 信号量 |
| monitor | 管程 |
| deadlock | 死锁 |
| starvation | 饥饿 |
| livelock | 活锁 |
| coarse-grained / fine-grained | 粗粒度 / 细粒度 |
| scalability | 可扩展性 |
| contention | 争用 |
| context switch | 上下文切换 |
| scheduler | 调度器 |
| preemptive / non-preemptive | 抢占式 / 非抢占式 |
| interrupt | 中断 |
| system call | 系统调用 |
| kernel | 内核 |
| address space | 地址空间 |
| page fault | 缺页（异常） |
| blocking | 阻塞 |
| event loop | 事件循环 |
| non-blocking I/O | 非阻塞 I/O |
| thread-safe | 线程安全 |
| concurrent data structure | 并发数据结构 |
| approximate counter | 近似计数器 |
| lock-free | 无锁 |
| test-and-set | 测试并设置 |
| compare-and-swap | 比较并交换 |
| load-linked / store-conditional | 链接加载 / 条件存储 |
| fetch-and-add | 取并加 |
| ticket lock | 票据锁 |
| MCS lock | MCS 锁 |
| producer/consumer | 生产者 / 消费者 |
| bounded buffer | 有界缓冲区 |
| reader-writer lock | 读写锁 |
| barrier | 屏障 |
| dining philosophers | 哲学家就餐 |
| atomicity violation | 原子性违反 |
| order violation | 顺序违反 |
| CRUX | 关键问题 |
| ASIDE | 边注 |
| TIP | 提示 |

## 自检

译文写完后，检查：
1. 中文段落数与源文件段落数大致相当（不得少于 90%）。
2. 代码块、figure、`:::` 容器数量与源文件一致。
3. 没有整段英文残留（专有名词、代码除外）。

可用下面命令自查：

```bash
cd /Users/kk/WorkBuddy/os翻译/ostep
python3 - <<'EOF'
import re
src = open('src/chXX.md').read()
dst = open('docs/chapters/chXX.md').read()
for pat, name in [(r'```c', '代码块'), (r'book-figure', '图'), (r'^::: ', '容器')]:
    a = len(re.findall(pat, src, re.M)); b = len(re.findall(pat, dst, re.M))
    print(name, a, b, 'OK' if a == b else 'MISMATCH')
cn = len(re.findall(r'[\u4e00-\u9fff]', dst))
print('汉字数', cn)
EOF
```

## 完成后

回复：输出路径 + 汉字数 + 结构自检结果。**不要贴全文。**
