"""Mechanical source preparation and review only; no runtime edits or anatomy painting."""
from pathlib import Path
import json, shutil, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
GREEN = (0,255,0,255)
GREY = (108,108,114,255)
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'
def font(n): return ImageFont.truetype(FONT,n)
def key(im):
    im=im.convert('RGBA'); a=np.array(im)
    r,g,b=a[:,:,0].astype(float),a[:,:,1].astype(float),a[:,:,2].astype(float)
    mask=(g>100)&(g>1.5*r)&(g>1.5*b)
    a[mask,3]=0
    return Image.fromarray(a)
def crop(im):
    return im.crop(im.getbbox())
def loadpart(name): return key(Image.open(ROOT/(name+'.png')))
def fit(im,w,h):
    im=crop(im); s=min(w/im.width,h/im.height)
    return im.resize((round(im.width*s),round(im.height*s)),Image.Resampling.LANCZOS)
def label(im,xy,text,n=24,fill='white'):
    ImageDraw.Draw(im).text(xy,text,font=font(n),fill=fill)
def green_export(im,path):
    bg=Image.new('RGBA',im.size,GREEN);bg.alpha_composite(im);bg.convert('RGB').save(path)
def gather():
    data=json.loads((ROOT/'generation-inputs.json').read_text())
    for row in data['outputs']:
        if row.get('path'): shutil.copy2(row['path'],ROOT/'generated'/(row['name']+'.png'))
    sheet=Image.new('RGBA',(1500,math.ceil(len(data['outputs'])/4)*280),GREY)
    for i,row in enumerate(data['outputs']):
        path=ROOT/'generated'/(row['name']+'.png')
        if not path.exists(): continue
        part=fit(key(Image.open(path)),350,230);x=(i%4)*375;y=(i//4)*280
        sheet.alpha_composite(part,(x+(375-part.width)//2,y))
        label(sheet,(x+8,y+240),row['name'],20)
    sheet.convert('RGB').save(ROOT/'generated-contact.png')

# Bounding boxes in the unscaled generated reference coordinate system (1317 x 1194).
# All fits use uniform scaling only. Target boxes include hidden joint overlap.
BOXES={
 'torso':(385,330,1050,930), 'torso-back':(385,330,1050,930),
 'scarf-tail':(300,205,655,385),'tail':(20,650,455,850),
 'arm-front-upper':(350,355,665,580),
 'arm-front-lower':(270,430,455,600),
 'hand-front-grip':(170,450,365,645),
 'arm-back-upper':(875,510,1120,710),
 'arm-back-lower':(1080,490,1330,735),
 'arm-back-lower-grip':(1080,490,1330,735),
 'arm-back-lower-pinch':(1080,490,1330,735),
 'leg-front-upper':(271,721,726,1016),
 'leg-front-lower':(117,948,417,1213),
 'leg-back-upper':(745,735,1110,960),
 'leg-back-lower':(880,910,1210,1135),
}
for name in ['head-neutral','head-snarl','head-hurt','head-neutral-r','head-snarl-r','head-hurt-r']:
    BOXES[name]=(510,0,1245,540)
ORDER=['tail','leg-back-lower','leg-back-upper','arm-back-upper','arm-back-lower','leg-front-upper','leg-front-lower','scarf-tail','torso','arm-front-upper','arm-front-lower','hand-front-grip','head-neutral']
SCALE=1350/1190
OFFSET=(20,650)
ROTATIONS={'arm-back-upper':20,'arm-back-lower-grip':40,'arm-back-lower-pinch':46}
FIT_WIDTHS={'arm-front-upper':335,'arm-front-lower':230,'leg-front-upper':400,'arm-back-upper':245}
def point(x,y): return round(OFFSET[0]+x*SCALE),round(OFFSET[1]+y*SCALE)
def prepare():
    gather()
    ref=key(Image.open(ROOT/'generated/reference.png'))
    ref=ref.resize((round(ref.width*SCALE),round(ref.height*SCALE)),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(1536,2304));canvas.alpha_composite(ref,OFFSET)
    green_export(canvas,ROOT/'reference.png')
    layout={'canvas':[1536,2304],'reference_uniform_scale':SCALE,'reference_offset':OFFSET,'parts':{}}
    for name,box in BOXES.items():
        raw=crop(key(Image.open(ROOT/'generated'/(name+'.png'))))
        rotation=ROTATIONS.get(name,0)
        raw=crop(raw.rotate(rotation,Image.Resampling.BICUBIC,expand=True))
        p=fit(raw,(box[2]-box[0])*SCALE,(box[3]-box[1])*SCALE)
        if name in FIT_WIDTHS:
            s=FIT_WIDTHS[name]*SCALE/raw.width
            p=raw.resize((round(raw.width*s),round(raw.height*s)),Image.Resampling.LANCZOS)
        center=point((box[0]+box[2])/2,(box[1]+box[3])/2)
        xy=(round(center[0]-p.width/2),round(center[1]-p.height/2))
        dest=Image.new('RGBA',(1536,2304));dest.alpha_composite(p,xy)
        green_export(dest,ROOT/(name+'.png'))
        layout['parts'][name]={'target_box_in_reference':box,'placed_bounds':list(dest.getbbox()),'uniform_scale':p.width/raw.width,'rotation_degrees':rotation}
    shutil.copy2(ROOT/'head-neutral.png',ROOT/'head.png')
    (ROOT/'part-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
    review()
def assemble(head='head-neutral'):
    im=Image.new('RGBA',(1536,2304))
    for name in ORDER:
        im.alpha_composite(loadpart(head if name=='head-neutral' else name))
    return im
def review():
    ref=loadpart('reference');assembled=assemble();r=assemble('head-neutral-r')
    green_export(assembled,ROOT/'assembled-s.png');green_export(r,ROOT/'assembled-r.png')
    # The original A004 cutlass is reused only as a review prop; no weapon source is delivered.
    def armed(im):
        sword=key(Image.open(REPO/'assets/source/A004-rat-raider-rig/sword.png'))
        sword=crop(sword).rotate(165,Image.Resampling.BICUBIC,expand=True)
        sword=fit(sword,round(330*SCALE),round(650*SCALE))
        with_weapon=Image.new('RGBA',im.size);with_weapon.alpha_composite(sword,point(0,35));with_weapon.alpha_composite(im)
        return with_weapon
    a=armed(assembled);b=armed(r)
    standee=Image.open(REPO/'assets/art/enemies/rat-raider.png').convert('RGBA')
    mouse=Image.open(REPO/'assets/art/heroes/mouse-fighter.png').convert('RGBA')
    # Main comparisons and exact-size scene above all isolated part thumbnails.
    sheet=Image.new('RGBA',(1800,2650),GREY)
    label(sheet,(30,20),'A009 | Rat Raider redrawn from the standee',36)
    label(sheet,(30,72),'Actual assembled parts | same silhouette height | S and R head options',24)
    old=Image.open(REPO/'docs/screens/T011/5-body-variants-vs-standee.jpg').convert('RGBA').crop((750,68,1058,302))
    pixels=np.array(old);rgb=pixels[:,:,:3].astype(float);bg=rgb[0,0];pixels[np.max(np.abs(rgb-bg),axis=2)<20,3]=0;old=crop(Image.fromarray(pixels))
    for x,title,im in [(30,'Art-bible standee',standee),(460,'A009 assembled S',a),(890,'A009 assembled R',b),(1320,'T011 variant C (screen crop)',old)]:
        p=crop(im);p=p.resize((round(p.width*360/p.height),360),Image.Resampling.LANCZOS);sheet.alpha_composite(p,(x+(410-p.width)//2,210));label(sheet,(x,590),title,23)
    stage=Image.open(REPO/'assets/art/stages/harbor-market.png').convert('RGBA')
    stage=fit(stage,960,500);game=Image.new('RGBA',(960,540),GREY);game.alpha_composite(stage,(0,40));floor=450
    for x,title,im,h in [(120,'Mouse 130 px',mouse,130),(350,'S 136 px',a,136),(580,'R 136 px',b,136),(820,'Standee 136 px',standee,136)]:
        p=crop(im);p=p.resize((round(p.width*h/p.height),h),Image.Resampling.LANCZOS)
        game.alpha_composite(p,(x-p.width//2,floor-h));label(game,(x-50,floor+12),title,14)
    label(game,(15,10),'960 x 540 | exact-size source assembly comparison',18)
    game.convert('RGB').save(ROOT/'review-game-size.png');sheet.alpha_composite(game,(420,650))
    label(sheet,(30,1220),'All delivered part images | grey background | thumbnails normalized for inspection',25)
    names=list(BOXES);top=1270
    for i,name in enumerate(names):
        x=(i%6)*300;y=top+(i//6)*255
        p=fit(loadpart(name),270,205);sheet.alpha_composite(p,(x+(300-p.width)//2,y))
        label(sheet,(x+10,y+211),name,19)
    label(sheet,(30,2600),'Source review: anatomical fit approximate; joints and weapon attachment require import review.',22)
    sheet.convert('RGB').save(ROOT/'review.png')
    # Full placement overlays: every individual piece over a faded reference.
    fit_sheet=Image.new('RGBA',(1800,3100),GREY)
    label(fit_sheet,(25,20),'A009 | fit checks: delivered parts over faded reference',32)
    for i,name in enumerate(BOXES):
        cell=Image.new('RGBA',(1536,2304),(235,235,235,255));f=ref.copy();f.putalpha(f.getchannel('A').point(lambda a:round(a*.22)));cell.alpha_composite(f);cell.alpha_composite(loadpart(name))
        p=fit(cell,280,410);x=(i%6)*300;y=70+(i//6)*450
        fit_sheet.alpha_composite(p,(x+10,y));label(fit_sheet,(x+8,y+412),name,19)
    label(fit_sheet,(30,1920),'Actual assembly over faded standee | body heights matched',28)
    for x,im,title in [(100,assembled,'Set S'),(950,r,'Set R')]:
        p=crop(im);p=p.resize((round(p.width*650/p.height),650),Image.Resampling.LANCZOS)
        st=crop(standee);st=st.resize((round(st.width*650/st.height),650),Image.Resampling.LANCZOS)
        panel=Image.new('RGBA',(750,900),(225,225,225,255));st.putalpha(st.getchannel('A').point(lambda v:round(v*.28)));panel.alpha_composite(st,((750-st.width)//2,850-st.height));panel.alpha_composite(p,((750-p.width)//2,850-p.height))
        fit_sheet.alpha_composite(panel,(x,1980));label(fit_sheet,(x,2900),title,28)
    fit_sheet.convert('RGB').save(ROOT/'fit-check.png')

def measurements():
    samples=[
        ('upper arm','arm-front-upper',(176,190),(.48,.88)),
        ('forearm','arm-front-lower',(145,207),(.25,.97)),
        ('thigh','leg-front-upper',(147,365),(.48,.88)),
        ('calf','leg-front-lower',(107,410),(.90,.44)),
        ('boot','leg-front-lower',(96,444),(1,0)),
    ]
    original=Image.open(REPO/'assets/art/enemies/rat-raider.png').convert('RGBA')
    ref=loadpart('reference')
    def width(im,center,normal):
        mask=np.array(im.getchannel('A'))>127
        cx,cy=center;dx,dy=normal;norm=math.hypot(dx,dy);dx/=norm;dy/=norm
        def inside(t):
            x,y=round(cx+dx*t),round(cy+dy*t)
            return 0<=x<im.width and 0<=y<im.height and mask[y,x]
        if not inside(0): return None
        ends=[]
        for sign in [-1,1]:
            t=0
            while t<im.width and inside(t*sign): t+=.25
            ends.append(t)
        return round(sum(ends),1)
    out=[]
    for name,part,p,n in samples:
        ref_p=point(p[0]*1317/516,p[1]*1194/470)
        shift={'leg-front-upper':(-22,-22),'leg-front-lower':(14,26)}.get(part,(0,0))
        part_p=(ref_p[0]+shift[0],ref_p[1]+shift[1])
        ow=width(original,p,n);rw=width(ref,ref_p,n);pw=width(loadpart(part),part_p,n) if (ROOT/(part+'.png')).exists() else None
        out.append({'anatomy':name,'original_center':p,'normal':n,'source_center':ref_p,'part_center':part_p,'standee_px':ow,'reference_px':rw,'part_px':pw,'standee_ratio':round(ow/467,4) if ow else None,'reference_ratio':round(rw/1350,4) if rw else None,'part_ratio':round(pw/1350,4) if pw else None})
    (ROOT/'measurements.json').write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps(out,indent=2))

def prompts():
    d=json.loads((ROOT/'generation-inputs.json').read_text())
    text=['# A009 exact generation prompts','',
          'Tool: built-in `image_gen.imagegen` (`image_gen__imagegen`), not the CLI/API fallback. `transparent_background: false` for every call. PNG output. Seed and model/version settings were not exposed. Selected raw images are in `generated/`; selected output paths and every successful prompt are in `generation-inputs.json`.', '',
          'Input roles: the initial reference uses `assets/art/enemies/rat-raider.png` as the identity/pose target. Base parts use the generated assembled reference plus that original standee; initial hurt heads additionally use A005 head-hurt only as an expression guide. The retried far upper arm uses the assembled reference alone. Corrective edits use the preceding output for that part; the S hurt correction uses the S neutral head as target and the prior hurt output as expression guide.', '',
          'Preparation: Pillow/NumPy mechanically select green background (G > 100, G > 1.5R, G > 1.5B), crop, rotate where recorded, uniformly resize and place each part on the 1536 × 2304 exact-green source canvas. No anisotropic stretching or anatomy painting. Review compositions reuse existing stage, Mouse Fighter, original Rat Raider, T011 screen crop and A004 sword. `prepare.py` and `part-layout.json` record the process. Mechanical preparation does not call a generation API.', '',
          '## Assembled reference','',d['reference']['prompt'],'']
    groups=[('Initial isolated part requests (far upper arm includes its successful retry)',d['attempts']),('First corrective edits',d['revisions']),('Generated thickness revisions',d['bulk_revisions']),('Shortened far forearms',d['forearm_revisions']),('Final clear pinch hand',[d['pinch_revision']])]
    for title,rows in groups:
        text+=['## '+title,'']
        for row in rows: text+=['### '+row['name'],'',row['prompt'],'']
    if d.get('failed_initial_far_upper_prompt'):
        text+=['## Initial far-upper-arm request without an output (retried above)','',d['failed_initial_far_upper_prompt'],'']
    (ROOT/'prompt.md').write_text('\n'.join(text))

if __name__=='__main__':
    import sys
    if '--gather' in sys.argv: gather()
    elif '--measure' in sys.argv: measurements()
    elif '--prompts' in sys.argv: prompts()
    else: prepare()
