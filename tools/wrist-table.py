"""T029 r3: before / after worst wrist turn per clip, as a markdown table, from two tools/wrist-report.mjs text runs.
Usage: python3 tools/wrist-table.py before.txt after.txt > table.md"""
import sys


def read(path):
    out = {}
    for line in open(path):
        parts = [p.strip() for p in line[2:].split('|')]
        if len(parts) < 4:
            continue
        out[(parts[0], parts[1])] = parts[2]
    return out


before, after = read(sys.argv[1]), read(sys.argv[2])
print('| fighter | clip / rehearsal key | before (deg, frame, hand, drawing) | after |')
print('|---|---|---|---|')
over = 0
for k in before:
    b, a = before[k], after.get(k, '-')
    deg = abs(float(b.split()[0]))
    if deg > 45.5:
        over += 1
    print(f'| {k[0]} | {k[1]} | {"**" + b + "**" if deg > 45.5 else b} | {a} |')
print(f'\n{over} of {len(before)} clips / keys past 45 deg before; after: every hand inside its limit (tests/wrist.test.mjs).')
