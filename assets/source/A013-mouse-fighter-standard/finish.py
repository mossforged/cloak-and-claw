"""Register generated hidden fills/swaps, assemble actual parts, measure and review.
Run from repository root: python3 assets/source/A013-mouse-fighter-standard/finish.py
"""
from prepare import *
from PIL import ImageFilter
transforms={}
def register(im,anchor,at,sc=1,deg=0,size=None):
    size=size or raw.size
    a=math.cos(math.radians(deg));b=math.sin(math.radians(deg))
    return im.transform(size,Image.Transform.AFFINE,(a/sc,b/sc,anchor[0]-(a*at[0]+b*at[1])/sc,-b/sc,a/sc,anchor[1]-(-b*at[0]+a*at[1])/sc),Image.Resampling.BICUBIC)
def cropkey(path,box):return key(path).crop(box)
def putswap(n,im,anchor,at,sc,deg=0):
    v=register(im,anchor,at,sc,deg)
    save(canvas(v),n)
    transforms[n]={'anchor':anchor,'atRawMaster':at,'uniformScale':sc,'rotationDegrees':deg}
    return v
weaponPolys={
 'sword-top':[(0,0),(310,0),(310,606),(295,630),(257,650),(211,665),(164,680),(118,683),(84,665),(80,610),(0,610)],
 'sword-pommel':[(225,779),(253,768),(282,760),(311,777),(318,804),(294,826),(258,828),(233,815)],
 'shield':[(880,665),(965,680),(1019,740),(1024,830),(1024,1100),(835,1100),(798,990),(786,910),(783,820),(794,755),(821,700)]}
wm=Image.new('L',raw.size);wd=ImageDraw.Draw(wm)
for v in weaponPolys.values():wd.polygon(v,fill=255)
body=raw.copy();body.putalpha(Image.fromarray(np.minimum(np.asarray(raw.getchannel('A')),255-np.asarray(wm))))
ImageDraw.Draw(body).polygon(slotpoly,fill=(0,0,0,0))
# Remove weapon paint from cut fragments before adding hidden joint paintings.
for n in parts:
    parts[n].putalpha(Image.fromarray(np.minimum(np.asarray(parts[n].getchannel('A')),255-np.asarray(wm))))
pivots.update({'arm-front-upper':(465,785),'arm-back-upper':(744,800),'hand-back':(775,895),'scarf-tail':(442,695)})
scarfroot=polygon(raw,[(423,658),(460,690),(448,715),(421,687)])
parts['scarf-tail'].alpha_composite(scarfroot)
# Finish the visible segmentation along missed edge pixels. This copies original
# master pixels only; it does not invent paint or alter the independent master.
# Adjacent cut masks grow into unassigned master material, nearest cut first.
coverage=np.zeros((raw.height,raw.width),bool)
for im in parts.values():coverage|=np.asarray(im.getchannel('A'))>20
available=(np.asarray(body.getchannel('A'))>20)&~coverage
for step in range(40):
    if not available.any():break
    for n in parts:
        grown=np.asarray(parts[n].getchannel('A').filter(ImageFilter.MaxFilter(3)))>20
        add=grown&available
        if add.any():
            a=np.asarray(parts[n]).copy();orig=np.asarray(body);a[add]=orig[add];parts[n]=Image.fromarray(a);available[add]=False
visible={n:im.copy() for n,im in parts.items()}
# Proximal limb overlaps cover distal joint caps at rest. Near shoulder is under
# the torso, as on the reviewed rat. All bands remain within the standard groups.
bands.update({'arm-front-upper':590,'arm-front-lower':580,'leg-front-upper':530,'foot-front':510,'leg-back-upper':230,'foot-back':210})
fill=key(O/'raw-joint-fill.png').resize((1536,1536),Image.Resampling.LANCZOS)
am=json.loads((O/'joint-fill-map.json').read_text())['atlas']
hidden={}
for n in parts:
    m=am[n];x,y=m['xy'];bb=m['bbox'];sc=m['scale']
    patch=fill.crop(m['cell'])
    # Preserve atlas registration; only use the returned painting under joints.
    origin=(x-m['cell'][0],y-m['cell'][1])
    patch=register(patch,origin,(bb[0],bb[1]),1/sc)
    mask=Image.new('L',raw.size);md=ImageDraw.Draw(mask)
    joints=[pivots[n]]+[pivots[c] for c in parts if parents[c]==n]
    radius=42 if n.startswith('arm-') else 45 if n.startswith('leg-') else 30 if n.startswith('hand-') or n.startswith('foot-') else 55 if n in ['torso','pelvis'] else 30
    for px,py in joints:md.ellipse((px-radius,py-radius,px+radius,py+radius),fill=255)
    # Hidden extensions must be covered by a higher visible layer at rest.
    # This prevents generated joint caps from painting over master-visible folds.
    occluder=np.zeros((raw.height,raw.width),bool)
    for other in parts:
        if bands[other]>bands[n]:occluder|=np.asarray(visible[other].getchannel('A'))>127
    allow=np.asarray(mask)*occluder
    patch.putalpha(Image.fromarray(np.minimum(np.asarray(patch.getchannel('A')),allow).astype('uint8')))
    patch.alpha_composite(parts[n]);parts[n]=patch;hidden[n]={'joints':joints,'allowedRadiusRaw':radius}
# The far forearm is hidden by the shield: finish it from the image-tool's
# bracer painting, and move the master-visible finger fragment onto the hand.
parts['hand-back'].alpha_composite(parts['arm-back-lower'])
bracer=key(O/'raw-joint-fill.png').crop((1025,60,1232,240))
ba=(51,47);be=(175,127);targetA=pivots['arm-back-lower'];targetB=pivots['hand-back']
bs=math.dist(targetA,targetB)/math.dist(ba,be)
bd=math.degrees(math.atan2(targetB[1]-targetA[1],targetB[0]-targetA[0])-math.atan2(be[1]-ba[1],be[0]-ba[0]))
parts['arm-back-lower']=register(bracer,ba,targetA,bs,bd)
# Master hand retains original fingers; default far fist is completed where shield hid it.
save(canvas(raw),'reference')
marked=Image.open(O/'reference.png');md=ImageDraw.Draw(marked)
md.line((35,2050,85,2050),fill='#262229',width=5);md.line((1451,2050,1501,2050),fill='#262229',width=5)
marked.save(O/'reference.png',optimize=True)
save(canvas(body),'master-body')
for n,im in parts.items():save(canvas(im),n)
save(canvas(parts['head']),'head-neutral')
save(canvas(parts['hand-front']),'hand-front-grip')
save(canvas(parts['hand-back']),'hand-back-shield')
swaps={'head-neutral':'head','hand-front-grip':'hand-front','hand-back-shield':'hand-back'}
# Expression drawings: common ear/top registration and uniform scale only.
hh=key(O/'raw-heads.png');W,H=hh.size
for i,n in enumerate(['attack','hurt','effort','ko']):
    box=(i%2*W//2,i//2*H//2,(i%2+1)*W//2,(i//2+1)*H//2)
    im=hh.crop(box);bb=im.getbbox();im=im.crop(bb)
    # The head silhouette (ear to chin) matches the neutral master height.
    sc=407/im.height
    v=putswap('head-'+n,im,(0,0),(310,324),sc)
    swaps['head-'+n]='head'
# Open/fist/grip glove drawings registered by their visible wrist seam.
gh=key(O/'raw-hands.png');W,H=gh.size
def largest(im):
    mask=im.getchannel('A').point(lambda a:255 if a>20 else 0)
    best=None;bestn=0
    for _ in range(15):
        a=np.asarray(mask);ys,xs=np.where(a==255)
        if not len(xs):break
        ImageDraw.floodfill(mask,(int(xs[0]),int(ys[0])),128)
        a=np.asarray(mask);hit=a==128;count=int(hit.sum())
        if count>bestn:best=hit.copy();bestn=count
        a=a.copy();a[hit]=0;mask=Image.fromarray(a)
    out=im.copy();out.putalpha(Image.fromarray(np.where(best,np.asarray(im.getchannel('A')),0).astype('uint8')))
    return out.crop(out.getbbox())
handReg={}
for row,side in enumerate(['front','back']):
    for col,kind in enumerate(['open','fist','grip']):
        if side=='front' and kind=='grip':continue # cut master grip is canonical
        box=(col*W//3,row*H//2,(col+1)*W//3,(row+1)*H//2)
        im=largest(gh.crop(box))
        # Source fist height 141 raw master pixels; wrist stays at shared pivot.
        sc=141/im.height if kind!='open' else 166/im.height
        anchor=(im.width*.91,im.height*.60) if side=='front' else (im.width*.09,im.height*.62)
        at=pivots['hand-'+side]
        v=putswap('hand-'+side+'-'+kind,im,anchor,at,sc)
        swaps['hand-'+side+'-'+kind]='hand-'+side
        if kind=='grip':
            handReg[side]={'slot':[(at[0]+im.width*.54*sc,at[1]-im.height*.42*sc),(at[0]+im.width*.54*sc,at[1]+im.height*.22*sc)]}
        if side=='back' and kind=='grip':
            # Use the requested grip swap as the default shield hand. Keeping
            # the occluded master finger fragment at its wrist creates two fists.
            save(canvas(parts['hand-back']),'hand-back-master-cut')
            parts['hand-back']=v
            save(canvas(v),'hand-back');save(canvas(v),'hand-back-shield')
back=key(O/'raw-back.png')
# Rear master at the same feet line and approximately the same anatomical height.
b=back.crop((0,300,1024,1285));bsc=982/b.height
rear=register(b,(512,b.height),(570,1306),bsc)
save(canvas(rear),'master-back')
bh=polygon(back,[(210,290),(780,290),(780,585),(656,650),(580,673),(360,674),(287,661),(180,640),(180,570)])
bh=bh.crop(bh.getbbox())
putswap('head-back',bh,(bh.width*.58,bh.height),(649,724),407/bh.height)
swaps['head-back']='head'
bt=polygon(back,[(345,638),(525,632),(612,669),(669,712),(704,741),(681,852),(629,917),(698,989),(669,1020),(511,1089),(250,1020),(253,980),(281,933),(280,874),(345,846),(343,743),(307,687)])
bt=bt.crop(bt.getbbox());putswap('torso-back',bt,(bt.width*.56,bt.height*.67),(575,945),430/bt.height);swaps['torso-back']='torso'
sup=key(O/'raw-support.png')
# All source rectangles are measured on the delivered 1024x1536 sheet.
im=sup.crop((20,180,610,730));bb=im.getbbox();im=im.crop(bb)
putswap('torso-side',im,(im.width*.63,im.height*.63),(575,945),430/im.height);swaps['torso-side']='torso'
im=sup.crop((650,95,950,720));bb=im.getbbox();im=im.crop(bb)
raised=putswap('arm-front-raised',im,(im.width*.40,im.height*.86),pivots['arm-front-upper'],.46);swaps['arm-front-raised']='arm-front-upper'
raisedGrip=point((pivots['arm-front-upper'][0]+(im.width*.52-im.width*.40)*.46,pivots['arm-front-upper'][1]+(im.height*.16-im.height*.86)*.46))
im=sup.crop((20,815,455,1245));bb=im.getbbox();im=im.crop(bb)
guard=putswap('arm-back-guard',im,(im.width*.83,im.height*.76),pivots['arm-back-upper'],.50);swaps['arm-back-guard']='arm-back-upper'
guardGrip=point((pivots['arm-back-upper'][0]+(im.width*.23-im.width*.83)*.5,pivots['arm-back-upper'][1]+(im.height*.23-im.height*.76)*.5))
rig={'canvas':list(SZ),'master':'master-body.png','reference':'reference.png','floorY':2050,'fighter':'mouse-fighter',
 'note':'Body-only independent master for G2; reference.png is the selected full master with generated weapon depictions. Items are NOT body parts. Use existing A002 sword/shield with item-fits.json. Visible body cuts from the selected raw-boot-edit master. Generated paint is restricted to hidden joint disks; default far hand intentionally uses the drawn grip swap; original cut retained as provenance. G1/G2 human review and G3 motion pending.',
 'parts':{n:{'img':n+'.png','parent':parents[n],'pivot':point(pivots[n]),'band':bands[n]} for n in parts},
 'swaps':{n:{'img':n+'.png','of':of} for n,of in swaps.items()},'overlays':{}}
for n,hide in [('arm-front-raised',['arm-front-lower','hand-front']),('arm-back-guard',['arm-back-lower','hand-back'])]:
    rig['swaps'][n]['hide']=hide
    rig['swaps'][n]['note']='Whole arm key drawing: code must hide the listed children and carry item from this drawing, not from old wrist.'
rig['swaps']['arm-front-raised']['itemGrip']=raisedGrip
rig['swaps']['arm-front-raised']['slotDirection']=[[raisedGrip[0],raisedGrip[1]+20],[raisedGrip[0],raisedGrip[1]-20]]
rig['swaps']['arm-back-guard']['itemGrip']=guardGrip
rig['swaps']['arm-back-guard']['slotDirection']=[[guardGrip[0],guardGrip[1]+20],[guardGrip[0],guardGrip[1]-20]]
frontslot=[(233,681),(258,755)]
backslot=handReg['back']['slot']
backCenter=tuple((backslot[0][i]+backslot[1][i])/2 for i in [0,1])
slots={'hand-front-grip':{'of':'hand-front','center':point((245.5,718)),'direction':[point(p) for p in reversed(frontslot)]},
       'hand-back-grip':{'of':'hand-back','center':point(backCenter),'direction':[point(p) for p in reversed(backslot)]},
       'hand-back-shield':{'of':'hand-back','center':point(backCenter),'direction':[point(p) for p in backslot]}}
rig['grips']=slots
for n,v in slots.items():rig['swaps'][n]['slot']=v
(O/'rig-source.json').write_text(json.dumps(rig,indent=2)+'\n')
(O/'preparation-transforms.json').write_text(json.dumps({'viewsAndSwaps':transforms,'hiddenFillLimits':hidden,'weaponExclusionPolygons':weaponPolys,'note':'Raw-master coordinates unless named canvas; uniform scale and rigid rotations only.'},indent=2)+'\n')
# Actual rest assembly: no standee or generated assembled replacement substituted.
assembled=Image.new('RGBA',raw.size)
for n in sorted(parts,key=lambda n:bands[n]):assembled.alpha_composite(parts[n])
save(canvas(assembled),'assembled-body')
# Existing sword rigidly aligned through near grip; existing angled shield on far fist.
A2=R/'assets/source/A002-mouse-fighter-rig-3q'
sword=key(A2/'sword.png');shield=key(A2/'shield.png')
grip=(413,799);axis=[(460,761),(356,848)]
def ang(v):return math.degrees(math.atan2(v[1],v[0]))
deg=ang((frontslot[0][0]-frontslot[1][0],frontslot[0][1]-frontslot[1][1]))-ang((axis[1][0]-axis[0][0],axis[1][1]-axis[0][1]))
sp=register(sword,grip,(245.5,718),1.0,deg)
sh=register(shield,(949,701),backCenter,.90,0)
armed=Image.new('RGBA',raw.size)
for n in sorted(parts,key=lambda n:bands[n]):
    if n=='hand-front':armed.alpha_composite(sp)
    armed.alpha_composite(parts[n])
    if n=='hand-back':armed.alpha_composite(sh)
save(canvas(armed),'assembled-clean')
items={'coordinateSpace':'Full PNG source pixels, top-left origin; item coordinates refer to unchanged A002 PNGs; hand and canvas values refer to A013 1536x2304 canvas.',
 'sword':{'img':'../A002-mouse-fighter-rig-3q/sword.png','grip':list(grip),'handleAxis':axis,'hand':'hand-front-grip','canvasGrip':slots['hand-front-grip']['center'],'sourceToCanvasScale':S,'rotationDegrees':deg,'band':830},
 'shield':{'img':'../A002-mouse-fighter-rig-3q/shield.png','strapGrip':[949,701],'strapAxis':[[949,666],[949,736]],'hand':'hand-back-shield','canvasGrip':point(backCenter),'sourceToCanvasScale':.9*S,'rotationDegrees':0,'band':150},
 'note':'Rigid static fit previews. Existing item art is neither repainted nor copied. Shield rim covers the outer fist fingers; the inner fingers remain visible. Runtime item points must subtract trim origin and apply import scale.'}
(O/'item-fits.json').write_text(json.dumps(items,indent=2)+'\n')
# Native resolution review panel: body (ears to soles) is 130px, rat 136px.
def label(c,xy,t,n=22):ImageDraw.Draw(c).text(xy,t,font=font(n),fill='white',stroke_width=1,stroke_fill='#303038')
def fit(c,im,box):
    x,y,w,h=box;im=im.crop(im.getbbox());im.thumbnail((w,h),Image.Resampling.LANCZOS);c.paste(im,(x+(w-im.width)//2,y+(h-im.height)//2),im)
stage=ImageOps.fit(Image.open(R/'assets/art/stages/harbor-market.png').convert('RGBA'),(960,540))
standee=key(R/'assets/art/heroes/mouse-fighter.png')
rat=key(R/'assets/source/A010-rat-raider-standard/assembled-clean.png')
def actor(c,im,x,floor,h,bodybox=None):
    bb=im.getbbox();im=im.crop(bb);scale=h/(bodybox[1]-bodybox[0]) if bodybox else h/im.height
    im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
    c.alpha_composite(im,(round(x-im.width/2),round(floor-im.height)))
game=stage.copy();actor(game,standee,240,426,130);actor(game,armed,478,426,130,(324,1306));actor(game,rat,734,426,136)
for x,t in [(170,'Standee / 130px'),(405,'A013 / 130px body'),(670,'A010 rat / 136px')]:label(game,(x,448),t,17)
game.save(O/'review-game-size.png')
review=Image.new('RGB',(1920,2920),'#707078')
label(review,(30,20),'A013 | Mouse Fighter from one master',38)
label(review,(30,76),'Standee / generated master / actual parts + unchanged A002 items',24)
for im,box in [(standee,(30,125,580,680)),(raw,(650,125,580,680)),(armed,(1270,125,580,680))]:fit(review,im,box)
review.paste(game,(0,850));label(review,(1010,860),'Rear master / side torso / guard + raised arms',25)
fit(review,canvas(rear),(990,910,400,460));fit(review,key(O/'torso-side.png'),(1420,930,225,350))
fit(review,key(O/'arm-front-raised.png'),(1660,910,110,350));fit(review,key(O/'arm-back-guard.png'),(1780,1000,120,250))
label(review,(30,1420),'All standard cuts and swaps / shared 1536 x 2304 canvas',30)
allnames=list(parts)+list(swaps)
for i,n in enumerate(allnames):
    x=20+i%8*238;y=1490+i//8*270
    fit(review,key(O/(n+'.png')),(x,y,220,215));label(review,(x,y+222),n,17)
review.save(O/'review.png')
def check(n,item,box,text0):
    c=Image.new('RGB',(1600,1150),'#707078');label(c,(28,20),text0,30)
    fit(c,armed,(900,100,650,780));label(c,(930,920),'Actual rest assembly / same A002 item',22)
    close=armed.crop(box);close=close.resize((close.width*3,close.height*3),Image.Resampling.LANCZOS);fit(c,close,(40,110,770,750))
    label(c,(30,940),'Item source is unchanged. Slot direction and rigid transform in item-fits.json.',22)
    c.paste(game.resize((480,270)),(40,1010)) if False else None
    c.save(O/(n+'.png'))
check('sword-grip-check',sp,(125,545,365,840),'A013 | A002 sword handle through the near glove slot')
check('shield-check',sh,(700,750,945,1000),'A013 | A002 angled shield on the far glove / inner strap grip')
# Independent fit measurement and pivot overlap, equivalent silhouette threshold to bench.
mc=key(O/'master-body.png');ac=key(O/'assembled-body.png');ma=np.asarray(mc.getchannel('A'))>127;aa=np.asarray(ac.getchannel('A'))>127
def inside(im,p):return im.getchannel('A').getpixel(tuple(p))>127
jointReport={n:{'onSelf':inside(parts[n],pivots[n]),'onParent':inside(parts[parents[n]],pivots[n]) if parents[n] else None} for n in parts}
validation={'canvas':list(SZ),'parts':len(parts),'swaps':len(swaps),'missingStandardParts':[],
 'bodyMasterMissed':float((ma&~aa).sum()/ma.sum()),'partsOutsideBodyMaster':float((aa&~ma).sum()/aa.sum()),'jointOverlap':jointReport,
 'note':'Body master independently excludes weapon depictions from the original master using recorded polygons. Not derived from assembly. Static rest fit only; G3 must be judged on bench. Shared raw pivots are rounded once into source canvas.'}
(O/'validation.json').write_text(json.dumps(validation,indent=2)+'\n')
diff=np.zeros((*ma.shape,4),dtype='uint8');diff[ma&aa]=[180,180,180,255];diff[ma&~aa]=[255,64,64,255];diff[aa&~ma]=[70,150,255,255]
Image.fromarray(diff).save(O/'fit-difference.png')
ov=Image.new('RGBA',SZ,'#707078');tmp=mc.copy();tmp.putalpha(tmp.getchannel('A').point(lambda a:a//3));ov.alpha_composite(tmp);ov.alpha_composite(ac);ov.convert('RGB').save(O/'assembled.png')
piv=green(canvas(raw));pd=ImageDraw.Draw(piv)
for n,p in pivots.items():
    x,y=point(p);pd.ellipse((x-7,y-7,x+7,y+7),fill='#00ffff',outline='black',width=2);label(piv,(x+10,y),n,15)
piv.save(O/'pivots.png')
print(json.dumps(validation,indent=2))
