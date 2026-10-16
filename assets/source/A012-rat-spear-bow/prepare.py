"""A012 source registration and static review only; writes within this folder.
Run: python3 assets/source/A012-rat-spear-bow/prepare.py
Requires Pillow and numpy. Original generation paths recorded in generation.json;
after delivery, raw-*.png are used instead. No game files are written.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
import numpy as np
import math, json, shutil
O=Path(__file__).resolve().parent
R=O.parents[2]
B=R/'assets/source/A010-rat-raider-standard'
G=R/'assets/source/A011-rat-raider-finishing'
SZ=(1536,2304)
shutil.copyfile(B/'reference.png',O/'reference.png')
F='/System/Library/Fonts/Supplemental/Arial.ttf'
def font(n): return ImageFont.truetype(F,n)
def key(p):
    im=Image.open(p).convert('RGBA'); a=np.asarray(im).astype(float).copy()
    if im.getchannel('A').getextrema()[0]<255: return im
    spill=a[:,:,1]-np.maximum(a[:,:,0],a[:,:,2])
    a[:,:,3]=np.clip(1-(spill-25)/70,0,1)*255
    a[:,:,1]=np.where(spill>0,np.minimum(a[:,:,1],np.maximum(a[:,:,0],a[:,:,2])+8),a[:,:,1])
    return Image.fromarray(a.astype('uint8'))
def green(im):
    c=Image.new('RGB',im.size,'#00ff00');c.paste(im,mask=im.getchannel('A'));return c
def save(im,n): im.save(O/(n+'.png'),optimize=True)
def label(c,xy,t,n=22):ImageDraw.Draw(c).text(xy,t,font=font(n),fill='white',stroke_width=1,stroke_fill='#333338')
def fit(c,im,box):
    x,y,w,h=box;im=im.crop(im.getbbox());im.thumbnail((w,h),Image.Resampling.LANCZOS);c.paste(im,(x+(w-im.width)//2,y+(h-im.height)//2),im)
meta=json.loads((O/'generation.json').read_text())
for n,p in meta['paths'].items():
    dst=O/('raw-'+n+'.png')
    if not dst.exists():shutil.copyfile(p,dst)
for n in ['spear','bow','arrow']:save(green(key(O/('raw-'+n+'.png'))),n)
# Register the generated local thumb/index patch back to its exact input crop.
# Retain original cuff and lower fingers pixel-for-pixel. Fill only the old
# hidden handle slot below the edited thumb, with the generated palm.
base=Image.open(B/'hand-front-grip.png').convert('RGB')
patch=green(key(O/'raw-hand.png')).resize((280,260),Image.Resampling.LANCZOS)
arr=np.asarray(base).copy(); pa=np.asarray(patch)
yy,xx=np.mgrid[1120:1380,180:460]
mask=((xx<350)&(yy<1240))|((xx>=320)&(xx<=338)&(yy>=1195)&(yy<=1326))
weight=np.asarray(Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.GaussianBlur(4))).astype(float)/255
weight*=np.clip((350-xx)/12,0,1)
original=arr[1120:1380,180:460].copy()
# The green handle slot is hidden material: replace it fully, not by blending
# orange skin with the keyed background. Feather only against existing skin.
oldgreen=(original[:,:,1]>original[:,:,0]*1.3)&(original[:,:,1]>original[:,:,2]*1.3)
weight=np.where(oldgreen&mask,1,weight)
weight=np.where((yy>=1240)&(xx<310),0,weight)
arr[1120:1380,180:460]=np.round(original*(1-weight[:,:,None])+pa*weight[:,:,None]).astype('uint8')
save(Image.fromarray(arr),'hand-front-pinch')
rig={'canvas':list(SZ),'extends':'../A010-rat-raider-standard/rig-source.json','master':'reference.png','floorY':1997,
     'parts':{'hand-front':{'img':'../A010-rat-raider-standard/hand-front.png','parent':'arm-front-lower','pivot':[410,1260],'band':840}},
     'swaps':{'hand-front-pinch':{'img':'hand-front-pinch.png','of':'hand-front'}},
     'note':'Swap extension only; merge swaps into A010/A011. Original wrist pivot [410,1260]. Pinch contact [270,1190] on this canvas. Cuff and lower visible fingers retained from A010; generated local thumb/index and hidden palm patch.'}
(O/'rig-source.json').write_text(json.dumps(rig,indent=2)+'\n')
W={
 'spear':{'img':'spear.png','grip':[510,1120],'grip2':[510,690],'tip':[512,25],'reviewScale':0.115,'rest':90},
 'bow':{'img':'bow.png','grip':[610,754],'tips':[[400,100],[400,1410]],'nock':[400,754],'reviewScale':0.065,'rest':0,'reviewPull':400},
 'arrow':{'img':'arrow.png','nock':[100,366],'tip':[2076,364],'reviewScale':0.035,'rest':0}}
for n,v in W.items():v['canvas']=list(Image.open(O/v['img']).size)
(O/'weapons.json').write_text(json.dumps({'coordinateSpace':'Full delivered source PNG pixels; origin top-left, x right, y down. All points measured before trim.','importNote':'For a trimmed/scaled game item, subtract trim origin then multiply points by the import scale. reviewScale maps source pixels to screen pixels directly; do not apply the old item px values unchanged.','weapons':W},indent=2)+'\n')
prompts='# A012 prompts\n\nTool: built-in image_gen.imagegen. Flat green backgrounds; no seed exposed.\n\n'
for j in meta['jobs']:prompts+='## '+j['name']+'\n\nReferences: '+', '.join(j['refs'])+'\n\n```text\n'+j['prompt']+'\n```\n\n'
prompts+='## Near pinch edit\n\nInput: A010 hand-front-grip crop [180,1120,460,1380], uniformly enlarged 3x; keyed for viewing.\n\n```text\n'+meta['handPrompt']+'\n```\n\nPreparation: normalize green background; register hand edit to the input crop with uniform scaling. Composite only thumb/index patch and hidden grip-slot palm onto the unchanged A010 hand. Cuff and lower fingers stay original. No body pixels repainted. See prepare.py for exact masks and review transforms.\n'
(O/'prompt.md').write_text(prompts)
# Review uses rigid transforms of actual A010 parts and A011 gear, never a
# generated replacement character. Render oversampled, then reduce to game res.
Q=3; CS=(960*Q,540*Q); S=136/(1997-650)
def xform(im,p,at,s,deg=0):
    a=math.cos(math.radians(deg));b=math.sin(math.radians(deg))
    sc=s*Q;tx,ty=at[0]*Q,at[1]*Q
    return im.transform(CS,Image.Transform.AFFINE,(a/sc,b/sc,p[0]-(a*tx+b*ty)/sc,-b/sc,a/sc,p[1]-(-b*tx+a*ty)/sc),Image.Resampling.BICUBIC)
def point(p,at,s,deg,q):
    a=math.cos(math.radians(deg));b=math.sin(math.radians(deg));x,y=q[0]-p[0],q[1]-p[1]
    return (at[0]+s*(a*x-b*y),at[1]+s*(b*x+a*y))
def angle(v):return math.degrees(math.atan2(v[1],v[0]))
def vec(a,b):return (b[0]-a[0],b[1]-a[1])
def dist(a,b):return math.dist(a,b)
rig0=json.loads((B/'rig-source.json').read_text())
def actor(kind,root):
    layers=[];placements={};p0=(850,1570)
    def pos(p):return point(p0,root,S,0,p)
    for n,v in rig0['parts'].items():
        if n.startswith(('arm-','hand-')):continue
        layers.append((v['band'],xform(key(B/v['img']),p0,root,S)))
    for n,z in ([('gear-jerkin',650),('gear-helmet',750)] if kind=='spear' else [('gear-quiver',90),('gear-hood',750)]):
        layers.append((z,xform(key(G/(n+'.png')),p0,root,S)))
    def arm(side,wrist,deg,hand):
        un='arm-'+side+'-upper';ln='arm-'+side+'-lower';hn='hand-'+side
        sh=rig0['parts'][un]['pivot'];el=rig0['parts'][ln]['pivot'];wr=rig0['parts'][hn]['pivot'];A=pos(sh)
        l1,l2=dist(sh,el)*S,dist(el,wr)*S;d=dist(A,wrist)
        if d>l1+l2+0.05:raise ValueError((kind,side,'unreachable',d,l1+l2))
        co=(l1*l1+d*d-l2*l2)/(2*l1*d);off=math.acos(max(-1,min(1,co)))
        theta=math.atan2(wrist[1]-A[1],wrist[0]-A[0])+(off if side=='front' else -off)
        E=(A[0]+l1*math.cos(theta),A[1]+l1*math.sin(theta))
        for n,p,at,dd in [(un,sh,A,angle(vec(A,E))-angle(vec(sh,el))),(ln,el,E,angle(vec(E,wrist))-angle(vec(el,wr)))]:layers.append((rig0['parts'][n]['band'],xform(key(B/(n+'.png')),p,at,S,dd)))
        hp=O/'hand-front-pinch.png' if hand=='pinch' else B/('hand-'+side+'-grip.png')
        layers.append((rig0['parts'][hn]['band'],xform(key(hp),wr,wrist,S,deg)))
        placements[hn]={'wrist':wrist,'rotation':deg,'hand':hand,'elbow':E}
    if kind=='spear':
        v=W['spear'];at=(root[0]-25,root[1]-13);s=v['reviewScale'];deg=78
        layers.append((830,xform(key(O/'spear.png'),v['grip'],at,s,deg)))
        at2=point(v['grip'],at,s,deg,v['grip2'])
        # Same finger slot as A010's cutlass; rotate hand across the shaft.
        hd=-12
        offset=point([410,1260],(0,0),S,hd,[330,1274])
        arm('front',(at[0]-offset[0],at[1]-offset[1]),hd,'grip')
        offset2=point([1310,1360],(0,0),S,0,[1440,1370])
        arm('back',(at2[0]-offset2[0],at2[1]-offset2[1]),0,'grip')
        placements['weapon']={'grip':at,'grip2':at2,'rotation':deg,'scale':s}
    else:
        v=W['bow'];at=(root[0]+52,root[1]-36);s=v['reviewScale']
        layers.append((125,xform(key(O/'bow.png'),v['grip'],at,s)))
        tops=[point(v['grip'],at,s,0,t) for t in v['tips']]
        nock=point(v['grip'],at,s,0,v['nock']);pull=(nock[0]-v['reviewPull']*s,nock[1])
        string=Image.new('RGBA',CS);d=ImageDraw.Draw(string)
        d.line([(x*Q,y*Q) for x,y in [tops[0],pull,tops[1]]],fill='#e4c99a',width=Q)
        layers.append((805,string));av=W['arrow'];layers.append((810,xform(key(O/'arrow.png'),av['nock'],pull,av['reviewScale'])))
        off=point([1310,1360],(0,0),S,0,[1440,1370]);arm('back',(at[0]-off[0],at[1]-off[1]),0,'grip')
        hd=180;off=point([410,1260],(0,0),S,hd,[270,1190]);arm('front',(pull[0]-off[0],pull[1]-off[1]),hd,'pinch')
        placements['weapon']={'grip':at,'tips':tops,'drawnNock':pull,'scale':s}
    out=Image.new('RGBA',CS)
    for z,im in sorted(layers,key=lambda t:t[0]):out.alpha_composite(im)
    return out,placements

spearman,sp=actor('spear',(290,408));archer,ar=actor('bow',(650,408))
save(spearman,'reference-spearman');save(archer,'reference-archer')
stage=ImageOps.fit(Image.open(R/'assets/art/stages/harbor-market.png').convert('RGBA'),(960,540)).resize(CS,Image.Resampling.LANCZOS)
stage.alpha_composite(spearman);stage.alpha_composite(archer)
game=stage.resize((960,540),Image.Resampling.LANCZOS)
label(game,(210,470),'Spearman / two hands',16);label(game,(585,470),'Archer / full draw',16);save(game,'review-game-size')
floor=ImageOps.fit(Image.open(R/'assets/art/stages/harbor-market.png').convert('RGBA'),(960,540)).resize(CS,Image.Resampling.LANCZOS)
for n,at,deg in [('spear',(220,440),78),('bow',(465,440),90),('arrow',(610,440),0)]:
    v=W[n];floor.alpha_composite(xform(key(O/v['img']),v.get('grip',v.get('nock')),at,v['reviewScale'],deg))
cut=key(R/'assets/art/items/rat-cutlass.png');floor.alpha_composite(xform(cut,[48,56],(795,440),.36,0))
floor=floor.resize((960,540),Image.Resampling.LANCZOS)
for x,n in [(195,'Spear'),(440,'Bow'),(610,'Arrow'),(765,'A003 cutlass')]:label(floor,(x,480),n,16)
save(floor,'review-floor')
review=Image.new('RGB',(1920,2420),'#707078')
label(review,(30,22),'A012 | Rat spear, bow, arrow + near pinch hand',35)
label(review,(30,75),'Actual A010 parts + A011 gear | rigid source mock-ups | 136 px body',24)
review.paste(game,(0,120));review.paste(floor,(960,120))
label(review,(30,680),'Held fit enlarged 3x | same drawings, scales and measured points',28)
for im,box in [(spearman,(70,740,780,540)),(archer,(1010,740,780,540))]:fit(review,im,box)
label(review,(30,1320),'A004 old / A012 new | equal silhouette height for style comparison',28)
for i,n in enumerate(['spear','bow','arrow']):
    old=key(R/('assets/source/A004-rat-raider-rig/'+n+'.png'))
    if n=='arrow':old=old.rotate(-90,expand=True)
    x=30+i*520
    fit(review,old,(x,1390,220,610));fit(review,key(O/(n+'.png')),(x+230,1390,220,610))
    label(review,(x,2010),n+' / old       new',22)
fit(review,key(O/'hand-front-pinch.png'),(1600,1400,280,400))
label(review,(1580,1840),'Near pinch',24);label(review,(1580,1880),'A010 cuff retained',19)
label(review,(30,2090),'Measured attachment points | full source pixel coordinates in weapons.json',28)
for i,n in enumerate(['spear','bow','arrow']):
    v=W[n];p=key(O/v['img']);p=p.crop(p.getbbox());p.thumbnail((240,235),Image.Resampling.LANCZOS)
    fit(review,key(O/v['img']),(i*620+15,2150,180,235))
    rows=[n]+[k+': '+str(v[k]) for k in ['grip','grip2','tips','nock','tip'] if k in v]
    for j,t in enumerate(rows):label(review,(i*620+200,2160+j*38),t,18)
save(review,'review')
points=Image.new('RGB',(1800,1120),'#707078')
label(points,(25,20),'A012 | measured points on full source canvases',30)
for i,n in enumerate(['spear','bow','arrow']):
    v=W[n];im=key(O/v['img']);sc=min(530/im.width,900/im.height);size=(round(im.width*sc),round(im.height*sc))
    x=i*600+30;y=120+(900-size[1])//2
    small=im.resize(size,Image.Resampling.LANCZOS);points.paste(small,(x,y),small)
    d=ImageDraw.Draw(points)
    for k in ['grip','grip2','tip','nock','tips']:
        if k not in v:continue
        pts=v[k] if k=='tips' else [v[k]]
        for j,p in enumerate(pts):
            xx,yy=x+p[0]*sc,y+p[1]*sc
            d.ellipse((xx-5,yy-5,xx+5,yy+5),outline='#00ffff',width=2)
            label(points,(min(xx+10,i*600+430),yy-12),k+(str(j) if k=='tips' else ''),16)
    label(points,(i*600+30,1060),n,22)
save(points,'review-points')
validation={'handCanvas':list(Image.open(O/'hand-front-pinch.png').size),'handPivot':[410,1260],'lowerFingersAndCuffUnchanged':bool(np.array_equal(arr[1240:1380,180:310],np.asarray(base)[1240:1380,180:310]) and np.array_equal(arr[:,350:],np.asarray(base)[:,350:])),'poses':{'spearman':sp,'archer':ar},'note':'Uniform scales, no stretched limbs. IK validates both wrists reachable. Static review only; human look and runtime motion check pending.'}
(O/'validation.json').write_text(json.dumps(validation,indent=2)+'\n')
print(json.dumps(validation,indent=2))
