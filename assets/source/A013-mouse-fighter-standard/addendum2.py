"""Register the painted foot view and render the A013 stance comparison.
Run from the repository root. Only this source folder is written.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

O = Path(__file__).resolve().parent
R = O.parents[2]
SIZE = (1536, 2304)

def key(path):
    im = Image.open(path).convert('RGBA')
    if im.getchannel('A').getextrema()[0] < 255:
        return im
    a = np.array(im).astype(float)
    spill = a[:, :, 1] - np.maximum(a[:, :, 0], a[:, :, 2])
    a[:, :, 3] = np.clip(1 - (spill - 25) / 70, 0, 1) * 255
    a[:, :, 1] = np.where(spill > 0, np.minimum(a[:, :, 1], np.maximum(a[:, :, 0], a[:, :, 2]) + 8), a[:, :, 1])
    return Image.fromarray(a.astype('uint8'))

def save_green(im, name):
    bg = Image.new('RGB', im.size, '#00ff00')
    bg.paste(im, mask=im.getchannel('A'))
    bg.save(O / name, optimize=True)

def label(im, xy, text, size=26):
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', size)
    ImageDraw.Draw(im).text(xy, text, font=font, fill='white', stroke_width=1, stroke_fill='#303038')

def fit(dst, im, box):
    x, y, w, h = box
    im = im.crop(im.getbbox())
    im.thumbnail((w, h), Image.Resampling.LANCZOS)
    dst.paste(im, (x + (w-im.width)//2, y + h-im.height), im)

registration = json.loads((O / 'foot-front-out-registration.json').read_text())
raw = key(O / 'raw-foot-front-out.png')
anchor = registration['rawAnklePivot']
at = registration['canvasAnklePivot']
s = registration['uniformScale']
foot = raw.transform(SIZE, Image.Transform.AFFINE,
    (1/s, 0, anchor[0]-at[0]/s, 0, 1/s, anchor[1]-at[1]/s), Image.Resampling.BICUBIC)
save_green(foot, 'foot-front-out.png')
rig = json.loads((O / 'rig-source.json').read_text())
assert at == rig['parts']['foot-front']['pivot']
rig['swaps'].pop('foot-back-out', None)
rig['swaps']['foot-front-out'] = {'img': 'foot-front-out.png', 'of': 'foot-front'}
(O / 'rig-source.json').write_text(json.dumps(rig, indent=2)+'\n')

items = json.loads((O / 'item-fits.json').read_text())
layers = []
for name, part in rig['parts'].items():
    layers.append((part['band'], name, key(O / part['img'])))
for name in ['sword', 'shield']:
    item = items[name]
    im = key(O / item['img'])
    pivot = item.get('grip', item.get('strapGrip'))
    x, y = item['canvasGrip']
    scale = item['sourceToCanvasScale']
    angle = np.deg2rad(item['rotationDegrees'])
    a, b = np.cos(angle)/scale, np.sin(angle)/scale
    im = im.transform(SIZE, Image.Transform.AFFINE,
        (a, b, pivot[0]-a*x-b*y, -b, a, pivot[1]+b*x-a*y), Image.Resampling.BICUBIC)
    layers.append((item['band'], name, im))

def assemble(turned):
    im = Image.new('RGBA', SIZE)
    for band, name, layer in sorted(layers):
        im.alpha_composite(foot if turned and name == 'foot-front' else layer)
    return im

before, after = assemble(False), assemble(True)
save_green(after, 'assembled-foot-front-out.png')
standee = key(R / 'assets/art/heroes/mouse-fighter.png')
review = Image.new('RGB', (1920, 2440), '#707078')
label(review, (35, 25), 'A013 addendum 2 | turned-out NEAR foot (foot-front)', 38)
for x, title, im in [(20, 'Approved standee', standee), (650, 'Original foot-front / walk', before), (1280, 'Near foot-front-out / planted', after)]:
    label(review, (x+20, 95), title)
    fit(review, im, (x, 145, 610, 1120))
for x, title, im in [(40, 'Forward', before), (960, 'Turned toward camera', after)]:
    label(review, (x, 1320), title)
    fit(review, im.crop((250, 1800, 700, 2090)), (x, 1380, 820, 440))
stage = ImageOps.fit(Image.open(R / 'assets/art/stages/harbor-market.png').convert('RGBA'), (960, 540))
body_top = key(O / 'head.png').getbbox()[1]
body_bottom = key(O / 'foot-front.png').getbbox()[3]
for x, title, im, scale in [(200, 'Standee', standee, 130/standee.getbbox()[3]), (470, 'Forward', before, 130/(body_bottom-body_top)), (740, 'Turned out', after, 130/(body_bottom-body_top))]:
    im = im.crop(im.getbbox())
    im = im.resize((round(im.width*scale), round(im.height*scale)), Image.Resampling.LANCZOS)
    stage.alpha_composite(im, (round(x-im.width/2), 426-im.height))
    label(stage, (x-45, 448), title, 18)
stage.save(O / 'review-foot-front-out-game-size.png')
review.paste(stage.convert('RGB').resize((960, 540)), (480, 1880))
review.save(O / 'review-foot-front-out.png', optimize=True)
original_review = Image.open(O / 'review.png').crop((0, 0, 1920, 2920))
combined = Image.new('RGB', (1920, 5360), '#707078')
combined.paste(original_review, (0, 0))
combined.paste(review, (0, 2920))
combined.save(O / 'review.png', optimize=True)
assert foot.getchannel('A').getpixel(tuple(at)) > 127
parent = key(O / 'leg-front-lower.png')
assert parent.getchannel('A').getpixel(tuple(at)) > 127
report = {'canvas': foot.size, 'pivot': at, 'paintBounds': foot.getbbox(), 'ankleOverlapsParent': True, 'swapCount': len(rig['swaps'])}
(O / 'foot-front-out-validation.json').write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps(report))
