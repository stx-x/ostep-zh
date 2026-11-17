import re, os, glob

os.chdir('/Users/kk/WorkBuddy/os翻译/ostep/docs')

CH = [
    ('ch25', '关于并发的对话', 'A Dialogue on Concurrency', ''),
    ('ch26', '第 26 章　并发：介绍', 'Concurrency: An Introduction', '26'),
    ('ch27', '第 27 章　线程 API', 'Interlude: Thread API', '27'),
    ('ch28', '第 28 章　锁', 'Locks', '28'),
    ('ch29', '第 29 章　基于锁的并发数据结构', 'Lock-based Concurrent Data Structures', '29'),
    ('ch30', '第 30 章　条件变量', 'Condition Variables', '30'),
    ('ch31', '第 31 章　信号量', 'Semaphores', '31'),
    ('ch32', '第 32 章　常见并发缺陷', 'Common Concurrency Problems', '32'),
    ('ch33', '第 33 章　基于事件的并发', 'Event-based Concurrency (Advanced)', '33'),
    ('ch34', '第 34 章　关于并发的总结对话', 'Summary Dialogue on Concurrency', '34'),
    ('mon', '附录　管程', 'Monitors', 'D'),
]

stats = []
for key, title, en, num in CH:
    p = 'chapters/%s.md' % key
    if not os.path.exists(p):
        print('MISSING', p)
        continue
    s = open(p).read()
    s = re.sub(r'^---[\s\S]*?---\s*', '', s)          # 去已有 frontmatter
    s = re.sub(r'^#\s+[^\n]*\n', '', s)               # 去已有 h1
    head = '---\ntitle: "%s"\n---\n\n# %s\n\n<div class="chap-en">%s</div>\n\n' % (title, title, en)
    open(p, 'w').write(head + s.strip() + '\n')
    cn = len(re.findall(r'[\u4e00-\u9fff]', s))
    figs = len(re.findall(r'book-figure', s))
    secs = re.findall(r'^##\s+([^\n]+)$', s, re.M)
    stats.append((key, title, cn, figs, secs))

print('%-6s %-28s %6s %4s %3s' % ('key', 'title', '汉字', '图', '节'))
for k, t, cn, fg, sc in stats:
    print('%-6s %-28s %6d %4d %3d' % (k, t, cn, fg, len(sc)))
print('总汉字:', sum(x[2] for x in stats))

# 目录页
out = ['---', 'title: 完整目录', '---', '', '# 完整目录', '', '<div class="toc-vol">', '']
for k, t, cn, fg, secs in stats:
    href = '/ostep-zh/%s' % k
    no, _, name = t.partition('章　')
    if not name:
        no, name = '', t
    out.append('<a class="toc-ch" href="%s">' % href)
    out.append('<span class="toc-ch-no">%s</span>' % (no + ' 章' if no else ''))
    out.append('<span class="toc-ch-title">%s</span>' % name)
    out.append('<span class="toc-ch-en">%s</span>' % dict((c[0], c[2]) for c in CH)[k])
    out.append('</a>')
    if secs:
        out.append('<div class="toc-secs">')
        for s in secs:
            st = re.sub(r'[*`]', '', s).strip()
            out.append(st + '<br>')
        out.append('</div>')
out.append('</div>')
open('contents.md', 'w').write('\n'.join(out) + '\n')
print('contents.md written')
