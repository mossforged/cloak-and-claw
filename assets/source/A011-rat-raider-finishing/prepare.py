"""A011 source preparation: register generated overlays, derive masks, render reviews.
Run with Pillow and NumPy. No game files are written.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import numpy as np
import json, colorsys, math

O=Path(__file__).resolve().parent
R=O.parents[2]
B=R/'assets/source/A010-rat-raider-standard'
SZ=(1536,2304)
F='/System/Library/Fonts/Supplemental/Arial.ttf'
def font(n): return ImageFont.truetype(F,n)
def keyed(p):
    a=np.array(Image.open(p).convert('RGBA'))
    green=(a[:,:,1]>a[:,:,0]*1.3)&(a[:,:,1]>a[:,:,2]*1.3)&(a[:,:,1]>90)
    a[green,3]=0
    return Image.fromarray(a)
def load(n): return keyed(B/(n+'.png'))
def overlay(n): return Image.open(O/(n+'.png')).convert('RGBA')
def save(im,n): im.save(O/(n+'.png'),optimize=True)
def register():
    meta=json.loads((O/'generation.json').read_text())
    for n,v in meta.items():
        im=Image.open(v['path']).convert('RGBA')
        # Output canvas is square but may differ in resolution from the input.
        im=im.resize((1024,1024),Image.Resampling.LANCZOS)
        rgba=np.array(im);rgba[rgba[:,:,3]<16,3]=0
        im=Image.fromarray(rgba)
        c=Image.new('RGBA',SZ)
        xy=(500,400) if v['input'].startswith('head') else (350,850)
        c.alpha_composite(im,xy)
        save(c,n)
        v['canvas_translation']=list(xy);v['generated_size']=list(Image.open(v['path']).size)
    (O/'registration.json').write_text(json.dumps(meta,indent=2)+'\n')

def translate(im,dx,dy):
    c=Image.new('RGBA',SZ);c.alpha_composite(im,(dx,dy));return c

def variants():
    fitted={
      'gear-sash':(.85,527,1390),
      'gear-sash-side':(.64,650,1470),
      'gear-sash-back':(1.0,560,1340),
      'gear-jerkin-side':(.85,680,1120),
      'gear-jerkin-back':(1.0,570,1040)}
    fitmeta={}
    for n,(s,x,y) in fitted.items():
        im=overlay(n);box=im.getbbox();im=im.crop(box)
        im=im.resize((round(im.width*s),round(im.height*s)),Image.Resampling.LANCZOS)
        c=Image.new('RGBA',SZ);c.alpha_composite(im,(x,y));save(c,n)
        fitmeta[n]={'uniform_scale':s,'crop_before_fit':box,'top_left_after_fit':[x,y]}
    (O/'gear-fitting.json').write_text(json.dumps(fitmeta,indent=2)+'\n')
    # Clear the painted dark interior of the front armhole so A010's actual
    # shoulder can show through. This is a cut in the garment source only.
    im=overlay('gear-jerkin');a=np.array(im.getchannel('A'))
    hole=Image.new('L',SZ);ImageDraw.Draw(hole).ellipse((594,1068,678,1188),fill=255)
    a[np.asarray(hole)>0]=0;im.putalpha(Image.fromarray(a));save(im,'gear-jerkin')
    # Cut the accidentally painted template ears out of the rear hood. Keep
    # only the generated garment; A010 supplies both actual ears beneath it.
    im=overlay('gear-hood-back');cut=Image.new('L',SZ);draw=ImageDraw.Draw(cut)
    polygons=[[(0,0),(475,0),(475,330),(450,360),(443,410),(425,450),(400,485),(376,520),(345,550),(325,575),(320,605),(0,650)],
              [(666,408),(800,250),(1024,250),(1024,760),(740,660),(695,648),(666,615),(664,588),(644,530),(634,475)]]
    for poly in polygons:draw.polygon([(x+500,y+400) for x,y in poly],fill=255)
    alpha=np.array(im.getchannel('A'));alpha[np.asarray(cut)>0]=0;im.putalpha(Image.fromarray(alpha));save(im,'gear-hood-back')
    (O/'ear-cut-polygons.json').write_text(json.dumps({'crop_origin':[500,400],'polygons':polygons,'purpose':'Remove generated template ears, retain original A010 ears'},indent=2)+'\n')
    # The neutral tricorn's brim was too low in the source fit check.
    save(translate(overlay('gear-captain-hat'),0,-95),'gear-captain-hat')
    if (O/'gear-captain-hat-hurt.png').exists():
        save(translate(overlay('gear-captain-hat-hurt'),0,-95),'gear-captain-hat-hurt')
    # Detail positions follow the changed hurt-head landmarks. These are rigid
    # registration moves of existing paintings, not newly drawn face variants.
    offsets={'detail-eyepatch':(-25,-35),'detail-scar2':(-45,-30),
             'detail-ear-notch':(10,-30),'detail-earring':(-5,-65)}
    for n,(x,y) in offsets.items(): save(translate(overlay(n),x,y),n+'-hurt')
    # Face-only marks are correctly hidden on a rear head. Ear jewellery and
    # the healed split stay visible on the same physical ear from behind.
    for n in offsets:
        im=overlay(n)
        if n in ['detail-eyepatch','detail-scar2']: im=Image.new('RGBA',SZ)
        else: im=translate(im,65,30)
        save(im,n+'-back')

def manifest():
    rig=json.loads((B/'rig-source.json').read_text())
    rig['master']='../A010-rat-raider-standard/reference.png'
    for group in ['parts','swaps']:
        for v in rig[group].values():v['img']='../A010-rat-raider-standard/'+v['img']
    rig['note']='A011 overlay extension of unchanged A010. Relative image paths deliberately reuse the approved parts. Source overlays align at [0,0]; do not re-center trimmed overlays. See compatibility.json for view selection. Static source fit reviewed; G4 human look and in-motion review remain pending.'
    names=list(json.loads((O/'generation.json').read_text()))
    names+=list(n+'-'+s for n in ['detail-eyepatch','detail-scar2','detail-ear-notch','detail-earring'] for s in ['hurt','back'])
    for n in names:
        on='head' if n.startswith('detail-') or any(n.startswith(g) for g in ['gear-hood','gear-helmet','gear-captain-hat']) else 'torso'
        rig['overlays'][n]={'img':n+'.png','on':on,'band':90 if n=='gear-quiver' else 750 if on=='head' and n.startswith('gear') else 740 if on=='head' else 650}
    rig['masks']=json.loads((O/'masks.json').read_text())
    compat={}
    for n in ['gear-hood','gear-helmet','gear-captain-hat','detail-eyepatch','detail-scar2','detail-ear-notch','detail-earring']:
        compat[n]={'on':'head','views':{h:n+('-back' if h=='head-back' else '-hurt' if h=='head-hurt' else '') for h in ['head-neutral','head-attack','head-hurt','head-effort','head-ko','head-back']}}
        compat[n]['views']['head']=n
    for n in ['gear-jerkin','gear-sash']:
        compat[n]={'on':'torso','views':{'torso':n,'torso-side':n+'-side','torso-back':n+'-back'}}
    compat['gear-quiver']={'on':'torso','band':90,'views':{'torso':'gear-quiver','torso-side':'gear-quiver','torso-back':'gear-quiver'},'note':'Behind torso; shared rigid quiver. Rear torso may occlude most of the tube.'}
    (O/'rig-source.json').write_text(json.dumps(rig,indent=2)+'\n')
    (O/'compatibility.json').write_text(json.dumps(compat,indent=2)+'\n')

def validate():
    rig=json.loads((O/'rig-source.json').read_text());checks={}
    for group in ['parts','swaps','overlays']:
        for n,v in rig[group].items():
            p=O/v['img'];assert p.exists(),p
            im=Image.open(p);assert im.size==SZ,(n,im.size)
            if group=='overlays':
                assert im.mode=='RGBA',(n,im.mode)
                a=np.asarray(im.getchannel('A'));ys,xs=np.where(a>=16)
                intentionally_hidden=n in ['detail-eyepatch-back','detail-scar2-back']
                assert len(xs)>0 or intentionally_hidden,n
                bounds=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)] if len(xs) else None
                checks[n]={'size':list(im.size),'mode':im.mode,'visible_bounds':bounds,'intentionally_hidden':intentionally_hidden}
    masks=json.loads((O/'masks.json').read_text())
    for n,v in masks.items():
        im=Image.open(O/v['img']);assert im.size==SZ and im.mode=='L',n
        parent=overlay(v['on']) if v['on'].startswith('gear-') else load(v['on'])
        assert not np.any((np.asarray(im)>0)&(np.asarray(parent.getchannel('A'))==0)),n
    compat=json.loads((O/'compatibility.json').read_text())
    for v in compat.values():
        for name in v['views'].values():assert name in rig['overlays'],name
    out={'canvas':list(SZ),'parts_reused':len(rig['parts']),'swaps_reused':len(rig['swaps']),
      'overlays':checks,'mask_files':len(masks),'nonempty_masks':sum(not v['empty'] for v in masks.values()),
      'missing_required_files':[],'same_canvas':True,'masks_within_parent_alpha':True,
      'all_view_mappings_resolve':True,'review_game_size':list(Image.open(O/'review-game-size.png').size),
      'note':'Static source integrity and fit review only. The current bench does not animate overlays. G4 human look and moving gear review remain open.'}
    (O/'validation.json').write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps({k:v for k,v in out.items() if k!='overlays'}))

def masks():
    rig=json.loads((B/'rig-source.json').read_text())
    names=list(rig['parts'])+list(rig['swaps'])
    if (O/'generation.json').exists():
        names += [n for n in json.loads((O/'generation.json').read_text()) if n.startswith(('gear-hood','gear-jerkin','gear-sash')) and (O/(n+'.png')).exists()]
    info={}
    yy,xx=np.indices((SZ[1],SZ[0]))
    for n in names:
        im=overlay(n) if n.startswith('gear-') else load(n); a=np.asarray(im); rgb=a[:,:,:3].astype(float)
        red,green,blue=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
        opaque=a[:,:,3]>200
        warm=(red>green*1.08)&(green>blue*1.08)
        pink=(red>green*1.65)&(blue>green*.55)
        cloth=np.zeros(opaque.shape,bool);fur=cloth.copy()
        if n.startswith('gear-'):
            gold=(red>160)&(green>80)&(blue<green*.65)
            cloth=~gold&(red+green+blue>90)
            if n.startswith('gear-hood'): cloth&=(red<green*1.9)
        elif n.startswith('head'):
            fur=warm&~pink&(yy>800)
            # Preserve eyes, mouth and ear interiors; only warm fur pixels shift.
        elif n=='scarf-tail': cloth=red>green*1.6
        elif n.startswith('torso'):
            regions={
              'torso':[(350,180),(405,220),(430,290),(490,340),(570,375),(650,395),(715,400),(655,455),(595,490),(560,540),(510,485),(465,420),(430,350),(395,280),(370,230)],
              'torso-side':[(420,192),(480,200),(550,230),(630,280),(680,300),(675,365),(690,420),(700,530),(660,450),(620,400),(590,340),(550,290),(500,260),(430,250),(390,260)],
              'torso-back':[(400,195),(478,200),(475,245),(455,275),(438,320),(425,280)]}
            poly=Image.new('L',SZ);ImageDraw.Draw(poly).polygon([(x+350,y+850) for x,y in regions[n]],fill=255)
            points=[(x+350,y+850) for x,y in regions[n]]
            ImageDraw.Draw(poly).line(points+[points[0]],fill=255,width=50,joint='curve')
            scarf=(np.asarray(poly)>0)&(red>green*2.2)&(red>blue*2.0)
            if n=='torso':
                vest=np.zeros(opaque.shape,bool)
                fur=warm&(yy>1310)&(yy<1445)&(xx>760)&(xx<1010)&~scarf
            elif n=='torso-side':
                vest=np.zeros(opaque.shape,bool)
                fur=warm&(yy>1300)&(yy<1510)&(xx>845)&(xx<990)&~scarf
            else:
                vest=np.zeros(opaque.shape,bool)
                fur=warm&(yy>1500)&(xx<850)
            cloth=scarf|(vest&warm&~pink)
        elif n=='pelvis' or ('leg-' in n and n.endswith('upper')):
            cloth=(green>blue*1.25)&(red<green*1.9)&(red>green*.95)&~pink
            # Exclude the belt and pale fur fringe from trouser tint.
            cloth&=(yy>1555)&(red<185)
            cloth&=~((red-green>40)&(red>130))
        elif n in ['arm-front-upper','arm-back-upper']:
            fur=warm&~pink
            if n=='arm-front-upper': fur&=(xx<690)&(xx>490)&(yy>1130)&(yy<1330)
            else: fur&=(xx<1190)&(yy>1260)&(yy<1400)
        cloth&=opaque
        fur&=opaque&~cloth
        # White is full tint weight, black protects material; grey edge antialias.
        for kind,m in [('mask',cloth),('fur-mask',fur)]:
            mask=Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.6))
            mask=Image.fromarray(np.minimum(np.array(mask),a[:,:,3]))
            save(mask,n+'-'+kind)
            info[n+'-'+kind]={'on':n,'img':n+'-'+kind+'.png','selected_pixels':int(m.sum()),'empty':not bool(m.any())}
    (O/'masks.json').write_text(json.dumps(info,indent=2)+'\n')

def tint(im,n,cloth,fur):
    a=np.asarray(im).copy(); rgb=a[:,:,:3].astype(float)
    for suffix,col in [('mask',cloth),('fur-mask',fur)]:
        p=O/(n+'-'+suffix+'.png')
        if not p.exists(): continue
        weight=np.asarray(Image.open(p)).astype(float)/255
        if suffix=='fur-mask':
            dest=rgb*np.array(col)
        else:
            lum=rgb@np.array([.299,.587,.114])
            dest=lum[:,:,None]*np.array(col)/max(.1,np.dot(col,[.299,.587,.114]))
        rgb=rgb*(1-weight[:,:,None])+dest*weight[:,:,None]
    a[:,:,:3]=np.clip(rgb,0,255).astype('uint8');return Image.fromarray(a)

def assemble(kind='plain',detail=None,colors=None):
    rig=json.loads((B/'rig-source.json').read_text()); layers=[]
    for n,v in rig['parts'].items():
        im=load(n)
        if colors: im=tint(im,n,*colors)
        layers.append((v['band'],im))
    gears={'plain':[],'archer':['gear-quiver','gear-hood'],'spearman':['gear-jerkin','gear-helmet'],'captain':['gear-sash','gear-captain-hat']}[kind]
    for n in gears:
        im=overlay(n)
        if colors:im=tint(im,n,*colors)
        layers.append((90 if n=='gear-quiver' else 750 if n in ['gear-hood','gear-helmet','gear-captain-hat'] else 650,im))
    if kind in ['plain','captain']:
        # Reuse A010's measured fit of the actual A003 floor-item cutlass.
        item=Image.open(R/'assets/art/items/rat-cutlass.png').convert('RGBA')
        theta=math.radians(-75);s=3.5655882352941175
        a,b=math.cos(theta)/s,math.sin(theta)/s
        cc,dd=-b,a
        weapon=item.transform(SZ,Image.Transform.AFFINE,(a,b,48-a*330-b*1274,cc,dd,56-cc*330-dd*1274),Image.Resampling.BICUBIC)
        layers.append((830,weapon))
    if detail: layers.append((740,overlay(detail)))
    out=Image.new('RGBA',SZ)
    for z,im in sorted(layers,key=lambda t:t[0]):out.alpha_composite(im)
    return out

def fit(im,w,h):
    im=im.crop(im.getbbox());im.thumbnail((w,h),Image.Resampling.LANCZOS);return im
def label(im,xy,s,n=22):ImageDraw.Draw(im).text(xy,s,font=font(n),fill='white')
def pastefit(c,im,box):
    x,y,w,h=box;p=fit(im,w,h);c.paste(p,(x+(w-p.width)//2,y+(h-p.height)//2),p)
def review():
    gray='#74747b'; heads=['neutral','attack','hurt','effort','ko','back']
    rats=[assemble(k) for k in ['plain','archer','spearman','captain']]
    for k,im in zip(['plain','archer','spearman','captain'],rats):save(im,'reference-'+k)
    save(rats[0],'reference')
    c=Image.new('RGB',(2100,3800),gray)
    label(c,(30,15),'A011 | Rat Raider finishing set | actual A010 parts',36)
    mouse=Image.open(R/'assets/art/heroes/mouse-fighter.png').convert('RGBA')
    stage=ImageOps.fit(Image.open(R/'assets/art/stages/harbor-market.png').convert('RGBA'),(960,540))
    scale=136/(1997-650)
    for x,name,im in [(110,'Mouse',mouse)]+[(290+i*185,k,im) for i,(k,im) in enumerate(zip(['Plain','Archer','Spearman','Captain'],rats))]:
        if name=='Mouse':
            p=fit(im,180,130);stage.alpha_composite(p,(x-p.width//2,460-p.height))
        else:
            p=im.resize((round(SZ[0]*scale),round(SZ[1]*scale)),Image.Resampling.LANCZOS)
            stage.alpha_composite(p,(x-round(850*scale),460-round(1997*scale)))
        ImageDraw.Draw(stage).text((x-35,480),name,font=font(16),fill='white',stroke_width=2,stroke_fill='black')
    save(stage,'review-game-size');c.paste(stage,(30,70))
    label(c,(1030,90),'Rat body 136 px; Mouse 130 px. Gear adds height.',24)
    for i,im in enumerate(rats):pastefit(c,im,(1020+i*265,160,255,410))
    label(c,(30,635),'Headgear fit | neutral / attack / hurt / effort / KO / back',30)
    for row,gear in enumerate(['gear-hood','gear-helmet','gear-captain-hat']):
        for col,h in enumerate(heads):
            im=load('head-'+h); gn=gear+('-back' if h=='back' else '-hurt' if h=='hurt' and (O/(gear+'-hurt.png')).exists() else '')
            im.alpha_composite(overlay(gn));pastefit(c,im,(col*350,row*330+690,345,285));label(c,(col*350+15,row*330+985),gear.replace('gear-','')+' / '+h,19)
    label(c,(30,1710),'Torso gear | front / side / back',30)
    for row,gear in enumerate(['gear-jerkin','gear-sash']):
        for col,v in enumerate(['','-side','-back']):
            im=load('torso'+v);im.alpha_composite(overlay(gear+v));pastefit(c,im,(col*350,1760+row*350,345,300));label(c,(col*350+15,2065+row*350),gear+v,20)
    label(c,(1100,1710),'Six individuals | detail + cloth tint + slight fur shift',26)
    details=['detail-eyepatch','detail-scar2','detail-ear-notch','detail-earring',None,'detail-earring']
    palette=[((.35,.55,.75),(1.05,.97,.90)),((.65,.35,.30),(.90,.95,1.05)),((.42,.55,.30),(1.05,1.02,.95)),((.65,.49,.25),(.94,.98,1.02)),((.48,.38,.62),(1.03,.97,.94)),((.30,.60,.56),(.95,1.02,.97))]
    for i in range(6):
        im=assemble(['plain','archer','spearman','captain','plain','archer'][i],details[i],palette[i]);pastefit(c,im,(1080+i%3*330,1770+i//3*340,320,290));label(c,(1100+i%3*330,2070+i//3*340),str(i+1)+' / '+(details[i] or 'plain').replace('detail-',''),19)
    label(c,(30,2515),'Face details | all six heads (rear hides face-only markings)',29)
    for row,detail in enumerate(['detail-eyepatch','detail-scar2','detail-ear-notch','detail-earring']):
        for col,h in enumerate(heads):
            im=load('head-'+h);dn=detail+('-back' if h=='back' else '-hurt' if h=='hurt' and (O/(detail+'-hurt.png')).exists() else '')
            im.alpha_composite(overlay(dn));pastefit(c,im,(col*350,2570+row*295,340,245));label(c,(col*350+12,2820+row*295),detail.replace('detail-','')+' / '+h,18)
    c.save(O/'review.png',optimize=True)
    # Every overlay, plus every nonempty mask and its tinted source example.
    names=list(json.loads((O/'generation.json').read_text()))
    maskinfo=json.loads((O/'masks.json').read_text()); active=[n for n,v in maskinfo.items() if not v['empty']]
    rows=(len(names)+len(active)+5)//6
    sheet=Image.new('RGB',(2100,80+rows*310),gray);label(sheet,(25,15),'A011 | isolated overlays and grey masks / tint examples',30)
    for i,n in enumerate(names+active):
        x=i%6*350;y=80+i//6*310
        if n in maskinfo:
            m=Image.open(O/(n+'.png'));a=np.asarray(m);p=Image.new('RGBA',SZ,(220,220,220,0));p.putalpha(m);pastefit(sheet,p,(x,y,165,255)); part=maskinfo[n]['on'];base=overlay(part) if part.startswith('gear-') else load(part);pastefit(sheet,tint(base,part,(.35,.55,.75),(1.08,.96,.9)),(x+170,y,175,255))
        else:pastefit(sheet,overlay(n),(x,y,340,255))
        label(sheet,(x+10,y+265),n,17)
    sheet.save(O/'review-parts.png',optimize=True)
    combined=Image.new('RGB',(2100,c.height+sheet.height),gray)
    combined.paste(c,(0,0));combined.paste(sheet,(0,c.height))
    combined.save(O/'review.png',optimize=True)

if __name__=='__main__':
    import sys
    for action in sys.argv[1:]:globals()[action]()
