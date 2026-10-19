# T034: before / after phone strips of the user's joint points: each move drawn by tools/pose-strip.mjs twice (old points,
# his points; or default vs his draw order) and stacked into one JPG (quality 80) in docs/screens/T034/.
# Usage: python3 tools/joint-points-strips.py            (the seven moves, old vs his points, and the two draw-order strips)
import subprocess, sys
from PIL import Image

OUT = 'docs/screens/T034/'
MOVES = {
    'walk': ['walk:0', 'walk:0.25', 'walk:0.5', 'walk:0.75'],
    'idle': ['idle:0', 'idle:40', '=stance'],
    'turning-slash': ['ratSlash:windup', 'ratSlash:strike', 'ratSlash:recover'],
    'overhead-chop': ['overheadChop:windup', 'overheadChop:strike', 'overheadChop:recover'],
    'dash-attack': ['dashAttack:windup', 'dashAttack:strike', 'dashAttack:recover'],
    'kick': ['kick:windup', 'kick:strike', 'kick:recover'],
    'kneeup-jump': ['jumpUp:windup', 'jumpUp:strike', 'jumpUp:recover'],
}
ORDER = {   # the two draw-order picks: the walk and a grip (the cutlass in the turning slash and the overhead chop)
    'order-walk': ['walk:0', 'walk:0.25', 'walk:0.5', 'walk:0.75'],
    'order-grip': ['idle:0', 'ratSlash:strike', 'overheadChop:strike', 'dashAttack:strike'],
}


def strip(out, title, cells, flags, zoom):
    subprocess.run(['node', 'tools/pose-strip.mjs', 'rat-raider', out, title, *cells, '--zoom', str(zoom), *flags], check=True)


def stack(name, rows, zoom=2):
    ims = []
    for i, (title, flags) in enumerate(rows):
        tmp = f'{OUT}_{name}-{i}.jpg'
        strip(tmp, title, MOVES.get(name) or ORDER[name], flags, zoom)
        ims.append(Image.open(tmp).convert('RGB'))
    W, H = max(i.width for i in ims), sum(i.height for i in ims)
    out = Image.new('RGB', (W, H), (110, 110, 118))
    y = 0
    for im in ims:
        out.paste(im, (0, y)); y += im.height
    out.save(f'{OUT}{name}.jpg', quality=80)
    import os
    for i in range(len(rows)): os.remove(f'{OUT}_{name}-{i}.jpg')
    print('wrote', f'{OUT}{name}.jpg')


only = sys.argv[1:]
for m in MOVES:
    if not only or m in only:
        stack(m, [(f'{m}: OLD points (A023 r5)', ['--old-joints']), (f'{m}: HIS points (Fitting Room)', [])])
for m in ORDER:
    if not only or m in only:
        stack(m, [(f'{m}: his points, standard order (bracer over hand, shin over foot)', []),
                  (f'{m}: his points, HIS order for wrist + ankle (hand over bracer, foot over shin)', ['--his-order']),
                  (f'{m}: his points, all his order picks (also arm over torso, upper arm over forearm, thigh over shin)', ['--his-order=all'])])
