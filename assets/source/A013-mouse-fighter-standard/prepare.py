"""A013 source cutting/registration. Only this delivery folder is written.
Pillow + numpy. Coordinates below are measured on the 1024x1536 raw master.
Visible pixels are cut from the master; generated paintings extend hidden joints.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import numpy as np
import json, math
O=Path(__file__).resolve().parent
R=O.parents[2]
SZ=(1536,2304)
S=1350/1059
TX=50; TY=2050-1306*S
F='/System/Library/Fonts/Supplemental/Arial.ttf'
def font(n):return ImageFont.truetype(F,n)
def key(im):
    if not isinstance(im,Image.Image):im=Image.open(im)
    im=im.convert('RGBA');a=np.asarray(im).astype(float).copy()
    if a[:,:,3].min()<255:return im
    spill=a[:,:,1]-np.maximum(a[:,:,0],a[:,:,2])
    a[:,:,3]=np.clip(1-(spill-25)/70,0,1)*255
    a[:,:,1]=np.where(spill>0,np.minimum(a[:,:,1],np.maximum(a[:,:,0],a[:,:,2])+8),a[:,:,1])
    return Image.fromarray(a.astype('uint8'))
def green(im):
    c=Image.new('RGB',im.size,'#00ff00');c.paste(im,mask=im.getchannel('A'));return c
def save(im,n):green(im).save(O/(n+'.png'),optimize=True)
def point(p):return [round(TX+p[0]*S),round(TY+p[1]*S)]
def canvas(im):
    c=Image.new('RGBA',SZ)
    im=im.resize((round(im.width*S),round(im.height*S)),Image.Resampling.LANCZOS)
    c.alpha_composite(im,(round(TX),round(TY)));return c
def polygon(im,poly):
    m=Image.new('L',im.size);ImageDraw.Draw(m).polygon(poly,fill=255)
    out=im.copy();out.putalpha(Image.fromarray(np.minimum(np.asarray(im.getchannel('A')),np.asarray(m))))
    return out
raw=Image.open(O/'raw-boot-edit.png').convert('RGB')
# The complete boot-edit result is the selected front master. The first image
# is retained only as generation provenance, avoiding a rectangular patch seam.
raw=key(raw)
wide=Image.new('RGBA',(1120,1536));wide.alpha_composite(raw);raw=wide
# Registration dashes are metadata, not character material.
d=ImageDraw.Draw(raw);d.rectangle((0,1250,75,1290),fill=(0,0,0,0));d.rectangle((945,1250,1024,1290),fill=(0,0,0,0))
polys={
 'head':[(295,300),(850,300),(900,590),(895,655),(788,674),(779,695),(753,710),(715,723),(682,730),(639,726),(650,721),(606,711),(565,699),(523,690),(486,680),(462,665),(441,652),(421,637),(432,624),(410,617),(426,605),(398,596),(300,620)],
 'torso':[(435,675),(492,690),(603,718),(672,737),(717,751),(783,763),(753,796),(721,840),(717,897),(755,967),(798,1012),(799,1031),(620,1111),(594,1098),(561,1138),(475,1115),(352,1027),(343,993),(336,957),(348,902),(398,864),(436,848),(466,812)],
 'pelvis':[(370,944),(730,944),(790,1030),(649,1127),(552,1138),(459,1093),(349,1045)],
 'arm-front-upper':[(391,683),(447,696),(478,729),(483,806),(440,832),(387,846),(349,808),(341,776),(356,721)],
 'arm-front-lower':[(292,673),(333,681),(367,706),(359,766),(342,804),(302,791),(278,772),(268,719)],
 'hand-front':[(180,661),(225,650),(252,638),(279,638),(300,662),(311,698),(306,741),(285,772),(244,781),(205,774),(180,755),(161,715),(162,684)],
 'arm-back-upper':[(736,772),(777,797),(797,824),(774,865),(758,901),(730,898),(704,866),(706,828)],
 'arm-back-lower':[(771,827),(791,830),(811,857),(816,902),(804,937),(778,934),(756,904),(752,871)],
 'hand-back':[(779,840),(800,837),(815,860),(824,897),(821,937),(810,957),(787,951),(771,940),(765,914),(766,889)],
 'leg-front-upper':[(363,1013),(446,1028),(504,1060),(552,1090),(525,1117),(473,1146),(405,1174),(351,1164),(310,1131),(310,1097),(326,1050)],
 'leg-front-lower':[(301,1119),(351,1127),(406,1148),(425,1176),(402,1213),(367,1235),(284,1220),(267,1192),(277,1144)],
 'foot-front':[(292,1195),(350,1201),(394,1213),(422,1228),(459,1235),(482,1262),(480,1288),(447,1303),(397,1306),(339,1295),(287,1284),(250,1272),(249,1252),(267,1216)],
 'leg-back-upper':[(657,1090),(730,1070),(787,1037),(815,1060),(822,1077),(817,1127),(801,1168),(742,1177),(694,1156),(676,1117)],
 'leg-back-lower':[(693,1143),(748,1157),(801,1144),(814,1159),(804,1195),(817,1232),(754,1252),(696,1232),(680,1195),(669,1164)],
 'foot-back':[(704,1205),(774,1213),(806,1226),(850,1219),(894,1239),(920,1262),(929,1281),(918,1291),(879,1297),(821,1296),(759,1286),(693,1280),(690,1255)],
 'tail':[(372,1017),(340,1019),(303,1003),(278,971),(248,930),(210,899),(167,880),(121,881),(76,901),(43,932),(28,970),(28,1005),(44,1032),(78,1045),(99,1042),(64,1021),(58,996),(66,965),(89,945),(121,933),(150,934),(181,951),(205,981),(224,1020),(251,1049),(283,1069),(317,1075),(351,1062),(380,1044)],
 'scarf-tail':[(442,678),(408,650),(365,620),(305,610),(328,634),(351,662),(385,680),(351,701),(313,717),(300,732),(266,727),(232,714),(193,718),(140,729),(93,754),(55,795),(29,847),(57,825),(91,810),(145,803),(178,819),(226,833),(268,828),(311,808),(343,781),(383,750),(423,732),(453,720)]}
parts={n:polygon(raw,p) for n,p in polys.items()}
# The cloth travels behind the arm: remove the occluding glove and bracer.
scarfmask=Image.new('L',raw.size);sd=ImageDraw.Draw(scarfmask)
sd.polygon([(298,602),(373,603),(417,639),(443,678),(427,682),(394,665),(355,655),(322,644)],fill=255)
sd.polygon([(20,710),(156,710),(162,747),(186,770),(215,780),(222,803),(238,820),(225,840),(195,841),(145,816),(99,817),(56,837),(20,869)],fill=255)
parts['scarf-tail']=raw.copy();parts['scarf-tail'].putalpha(Image.fromarray(np.minimum(np.asarray(raw.getchannel('A')),np.asarray(scarfmask))))
# Remove handle material from the near palm: the item is rendered behind this slot.
slotpoly=[(224,665),(239,660),(270,757),(255,762)]
ImageDraw.Draw(parts['hand-front']).polygon(slotpoly,fill=(0,0,0,0))
parents={'pelvis':None,'torso':'pelvis','head':'torso','tail':'pelvis','scarf-tail':'torso'}
pivots={'pelvis':(570,1000),'torso':(575,945),'head':(649,724),'tail':(352,1042),'scarf-tail':(433,704)}
bands={'pelvis':400,'torso':600,'head':700,'tail':300,'scarf-tail':590}
for side,ss in [('front',800),('back',100)]:
    ns=['arm-'+side+'-upper','arm-'+side+'-lower','hand-'+side]
    pp=[(446,767),(351,747),(299,724)] if side=='front' else [(750,825),(770,868),(790,898)]
    for n,par,p,b in zip(ns,['torso',ns[0],ns[1]],pp,[ss+10,ss+20,ss+40]):parents[n]=par;pivots[n]=p;bands[n]=b
for side,ss in [('front',500),('back',200)]:
    ns=['leg-'+side+'-upper','leg-'+side+'-lower','foot-'+side]
    pp=[(459,1046),(352,1149),(335,1217)] if side=='front' else [(708,1065),(747,1159),(752,1220)]
    for n,par,p,b in zip(ns,['pelvis',ns[0],ns[1]],pp,[ss+10,ss+20,ss+30]):parents[n]=par;pivots[n]=p;bands[n]=b
# The cut/hidden-fill atlas is an image-tool input, never a replacement for visible pixels.
names=list(polys)
atlas=Image.new('RGB',(1536,1536),'#00ff00');atlasmeta={}
for i,n in enumerate(names):
    im=parts[n];bb=im.getbbox();crop=im.crop(bb);sc=min(240/crop.width,240/crop.height)
    sz=(round(crop.width*sc),round(crop.height*sc));x=(i%5)*307+33;y=(i//5)*384+60
    atlas.paste(crop.resize(sz,Image.Resampling.LANCZOS),(x,y),crop.resize(sz,Image.Resampling.LANCZOS))
    atlasmeta[n]={'bbox':list(bb),'scale':sc,'xy':[x,y],'size':list(sz),'cell':[i%5*307,i//5*384,(i%5+1)*307,(i//5+1)*384]}
atlas.save(O/'joint-fill-input.png')
(O/'cut-polygons.json').write_text(json.dumps({'rawCanvas':list(raw.size),'polygons':polys,'slot':slotpoly,'scale':S,'translate':[TX,TY],'atlas':atlasmeta},indent=2)+'\n')
for n,im in parts.items():save(canvas(im),n)
if __name__=='__main__':print('Prepared cuts and joint-fill-input.png')
