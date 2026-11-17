import re, glob, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comment_map import LEAD, TRAIL

os.chdir('/Users/kk/WorkBuddy/os翻译/ostep/docs')


def fix_code(body):
    out = []
    for ln in body.split('\n'):
        m = re.match(r'^(\s*//\s*)(.*?)(\s*)$', ln)
        if m and m.group(2) in LEAD:
            out.append(m.group(1) + LEAD[m.group(2)])
            continue
        m2 = re.match(r'^(.*?\S)(\s+//\s*)(.*?)(\s*)$', ln)
        if m2 and m2.group(3) in TRAIL:
            out.append(m2.group(1) + m2.group(2) + TRAIL[m2.group(3)])
            continue
        out.append(ln)
    return '\n'.join(out)


total = 0
for f in sorted(glob.glob('*.md')):
    s = open(f).read()
    def rep(m):
        return '```' + m.group(1) + '\n' + fix_code(m.group(2)) + '\n```'
    new = re.sub(r'```(\w*)\n([\s\S]*?)\n```', rep, s)
    if new != s:
        open(f, 'w').write(new)
        total += 1
print('files updated:', total)

# 复查
left = set()
for f in glob.glob('*.md'):
    s = open(f).read()
    for m in re.finditer(r'```\w*\n([\s\S]*?)\n```', s):
        for line in m.group(1).split('\n'):
            for pat in (r'^\s*//\s*([A-Za-z].*?)\s*$', r'\S\s+//\s*([A-Za-z].*?)\s*$'):
                a = re.match(pat, line) if pat.startswith('^') else re.search(pat, line)
                if a and len(a.group(1)) > 3:
                    t = a.group(1)
                    if not re.match(r'[\u4e00-\u9fff]', t):
                        left.add(t)
print('剩余英文注释:', len(left))
for t in sorted(left)[:10]:
    print('  ', t)
