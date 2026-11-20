"""Original vector food illustrations. Deterministic; no network assets."""
from pathlib import Path
import random, math

OUT=Path(__file__).resolve().parents[1]/'dist'/'assets'
OUT.mkdir(parents=True,exist_ok=True)

def ellipse(x,y,rx,ry,fill,rotate=0,extra=''):
    return f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{fill}" transform="rotate({rotate:.1f} {x:.1f} {y:.1f})" {extra}/>'

def grain_cloud(cx,cy,rx,ry,color='#f6e5b7',n=230,seed=3):
    rng=random.Random(seed);s=''
    for _ in range(n):
        a=rng.random()*math.tau;d=math.sqrt(rng.random());x=cx+math.cos(a)*rx*d;y=cy+math.sin(a)*ry*d
        s+=ellipse(x,y,rng.uniform(2.7,4.7),rng.uniform(1,1.8),rng.choice([color,'#f5e7c5','#e7ce95']),rng.uniform(-80,80))
    return s

def leaves(cx,cy,scale=1,angle=0):
    return f'<g transform="translate({cx} {cy}) rotate({angle}) scale({scale})"><path d="M-26 5Q0-12 31 5" fill="none" stroke="#366a43" stroke-width="2"/>'+''.join(ellipse(x,y,9,4,c,rot) for x,y,c,rot in [(-21,-1,'#517b42',35),(-9,-6,'#32633b',60),(4,-6,'#618d47',-50),(17,-2,'#31613a',-28),(-14,7,'#466c39',-32),(0,5,'#64894b',35),(24,5,'#507c40',32)])+'</g>'

def plate():
    return ellipse(259,163,158,103,'#243729',extra='opacity=".12"')+ellipse(250,148,160,102,'#faf4dc')+ellipse(250,148,144,90,'#c7b99a')+ellipse(250,147,140,87,'#fffcf0')+ellipse(250,147,122,75,'#efdfbd')

def beans(cx,cy,rx,ry,n=65):
    rng=random.Random(14);s=ellipse(cx,cy,rx+6,ry+4,'#553829')
    for _ in range(n):
        a=rng.random()*math.tau;d=math.sqrt(rng.random());x=cx+math.cos(a)*rx*d;y=cy+math.sin(a)*ry*d
        s+=ellipse(x,y,6,3.4,rng.choice(['#452b22','#36271f','#61422c','#725137']),rng.uniform(-90,90))
        s+=ellipse(x-1,y-1,2.3,.8,'#9b7351',20,extra='opacity=".6"')
    return s

def meat(cx,cy,scale=1):
    rng=random.Random(18);s=f'<g transform="translate({cx} {cy}) scale({scale})">'+ellipse(0,0,66,37,'#a44d30')
    for _ in range(70):
        x=rng.uniform(-54,49);y=rng.uniform(-26,25)
        s+=f'<path d="M{x:.1f} {y:.1f}q22 -9 34 0" stroke="{rng.choice(["#ba693c","#864126","#d0884f","#975033"])}" stroke-width="{rng.uniform(1.5,3.8):.1f}" fill="none" stroke-linecap="round"/>'
    for x,y in [(-35,-15),(16,14),(-16,22),(25,-15)]:s+=f'<path d="M{x} {y}q7 -15 28 -7" stroke="#cb4a27" stroke-width="5" fill="none"/>'
    return s+leaves(-10,-4,.45)+'</g>'

def chicken(cx,cy):
    s=''
    for x,y,a in [(-29,-8,-20),(30,15,25)]:
        s+=f'<g transform="translate({cx+x} {cy+y}) rotate({a})">'+ellipse(0,0,43,25,'#b66b30')+ellipse(-4,-4,37,20,'#d99749')+ellipse(-9,-8,26,11,'#e2a557')
        s+='<path d="M-27-7q19 16 46 8M-22 4q19 13 40 5" fill="none" stroke="#925127" stroke-width="3"/>'+leaves(5,2,.5)+'</g>'
    return s

def plantain(cx,cy,n=4):
    s=''
    for i in range(n):
        x=cx+i*22;y=cy+(i%2)*10;s+=ellipse(x,y,20,12,'#87452a',-22)+ellipse(x,y-2,18,10,'#dca144',-22)+ellipse(x-2,y-3,12,6,'#f2bf62',-22)+f'<path d="M{x-7} {y-4}l13 2" stroke="#ac7132" stroke-width="2"/>'
    return s

def pastry(cx,cy,rotate=0):
    return f'<g transform="translate({cx} {cy}) rotate({rotate})"><path d="M-48-28 47-26 51 32-43 37Z" fill="#a95b2f"/><path d="M-48-32 47-30 49 24-44 29Z" fill="#e2a85a"/><path d="M-42-27 40-25 43 20-38 23Z" fill="#f2c580"/><path d="M-44 28 48 24" stroke="#792b30" stroke-width="4"/><path d="M-28-12 27-13m-51 12 53-1m-50 13 45-2" stroke="#cf8f46" stroke-width="2"/><path d="m-38-20 5-1m17 2 4-2m31 7 3-1m-16 21 5-2m-39-2 4-1" stroke="#fff0ca" stroke-width="3" stroke-linecap="round"/></g>'

def base(content,bg):
    return '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300" viewBox="0 0 500 300"><rect width="500" height="300" fill="'+bg+'"/><path d="M0 265 500 55M0 285 500 75" stroke="#fff" stroke-width="1" opacity=".2"/><path d="M410 0 485 300M425 0 500 300" stroke="#52785c" stroke-width="2" opacity=".1"/>'+content+'</svg>'

def decor():
    return '<path d="M37 42h45v70H37z" fill="#fff8e5" opacity=".45" transform="rotate(-18 60 80)"/><path d="M43 53h33m-33 12h33m-33 12h33m-33 12h33" stroke="#4b7959" opacity=".18" transform="rotate(-18 60 80)"/>'+leaves(430,228,1.4,23)+ellipse(60,240,19,16,'#e8c75d')+ellipse(60,240,15,12,'#fff0ad')

art={}
art['carnes']=plate()+grain_cloud(199,124,57,37)+meat(286,159,1)+plantain(165,192,3)+leaves(282,110,.8)
art['aves']=plate()+grain_cloud(202,130,55,35)+chicken(277,159)+leaves(239,98,.8)+plantain(173,194,2)
art['pescados']=plate()+grain_cloud(189,152,43,44)+f'<g transform="translate(285 150) rotate(-16)"><path d="M-66 0Q-13-54 63-6l27-22v49L63 6Q-13 51-66 0" fill="#ac713e"/><path d="M-60-3Q-10-47 60-4Q1 29-60-3" fill="#e8bd73"/><path d="M-25-22v38m20-43v45m20-43v37m20-27v17" stroke="#ac844a" stroke-width="2"/><circle cx="-44" cy="-6" r="3" fill="#3d4533"/></g>'+leaves(265,104,.9)+ellipse(318,184,21,15,'#e4bf4e')+ellipse(318,183,17,12,'#fae594')
art['arroces']=plate()+ellipse(250,143,104,66,'#cdb078')+grain_cloud(250,141,103,63,n=650)+beans(281,144,45,35,65)+leaves(223,106,.9)+plantain(199,202,4)
art['granos_sopas']=ellipse(250,174,136,78,'#343e2922')+ellipse(250,150,137,91,'#fbf3dd')+ellipse(250,150,121,78,'#d8b688')+beans(250,148,111,69,210)+leaves(260,137,1)+ellipse(209,167,8,5,'#be653c')+ellipse(281,120,11,6,'#bb673d')
art['viandas_ensaladas']=plate()+''.join(f'<g transform="translate({x} {y}) rotate({a})"><rect x="-35" y="-12" width="70" height="24" rx="7" fill="#cabc82"/><rect x="-34" y="-15" width="69" height="23" rx="7" fill="#f7e9b9"/><path d="M-29-6h57m-50 6h49" stroke="#e0d099" fill="none"/></g>' for x,y,a in [(215,130,-20),(253,163,18),(289,127,42),(213,178,-34),(275,191,-5)])+leaves(255,126,1.1)+plantain(180,196,2)
art['entrantes']=plate()+''.join(f'<g transform="translate({x} {y}) rotate({a})"><rect x="-38" y="-14" width="76" height="29" rx="15" fill="#ad612f"/><rect x="-37" y="-17" width="72" height="27" rx="14" fill="#d79b49"/><path d="M-23-8h3m10 10h3m4-11h3m8 4h4m-41 9h3" stroke="#f0c57b" stroke-width="3" stroke-linecap="round"/></g>' for x,y,a in [(208,116,-19),(283,123,18),(203,167,10),(280,176,-28)])+leaves(262,148,.85)
art['pasteleria']=plate()+pastry(201,118,-13)+pastry(294,138,13)+pastry(239,195,-4)+leaves(367,213,.9)
art['postres']=plate()+'<path d="M167 126 178 184Q250 224 323 184l10-58Z" fill="#dba755"/><path d="M177 139v43q73 37 147-1l7-44" fill="#f7d595"/>'+ellipse(250,126,84,46,'#98542b')+ellipse(250,122,81,44,'#b96d34')+ellipse(245,117,68,33,'#cd8b48')+'<path d="M175 127q18 24 43 18v28q-7 16-10-7v-19m105-18q-9 9-13 13v30q-7 17-9-5v-18" fill="#9c542d"/>'+ellipse(216,110,26,6,'#efd3a0',-12,extra='opacity=".5"')+leaves(342,198,.7)
art['bebidas']=ellipse(247,232,91,25,'#40512d22')+'<path d="M183 69h130l-14 148q-52 25-102 0Z" fill="#f6f2dc"/><path d="M190 87h115l-13 125q-46 21-88 0Z" fill="#dc9b57"/><path d="m298 84-10 128q-9 5-16 6l10-131Z" fill="#f1c58d" opacity=".8"/>'+ellipse(248,86,58,15,'#f3cf94')+ellipse(246,81,57,13,'#fae4b9')+'<path d="m274 121 12-89h35" fill="none" stroke="#64877b" stroke-width="7"/>'+leaves(306,191,.8,50)+ellipse(166,208,25,19,'#dda554',-22)+ellipse(165,205,20,15,'#eed889',-22)
colors={'carnes':'#e8d9bf','aves':'#e8dfc0','pescados':'#d8e7df','arroces':'#e7ddbe','granos_sopas':'#e0dac5','viandas_ensaladas':'#dfe7d2','entrantes':'#ebdcc9','pasteleria':'#efdcce','postres':'#eadecb','bebidas':'#e0e8ce'}
for category,content in art.items():
    (OUT/(category+'.svg')).write_text(base(decor()+content,colors[category]))

hero='<svg xmlns="http://www.w3.org/2000/svg" width="550" height="430" viewBox="0 0 550 430"><g transform="translate(-20 32) scale(1.13)">'+plate()+grain_cloud(191,130,55,42,n=280)+beans(260,110,43,30,70)+meat(297,165,.9)+plantain(181,199,4)+leaves(243,136,.65)+'</g>'+leaves(464,61,1.7,-20)+leaves(410,346,1.7,16)+'<path d="m66 304 74 22-20 74-74-22Z" fill="#f4e6c6" opacity=".93"/><path d="m58 326 73 22m-78-5 73 22m-78-5 73 22" stroke="#be684b" stroke-width="3"/>'+ellipse(454,294,40,28,'#e4d395')+ellipse(454,291,34,22,'#8d452b')+ellipse(454,286,29,16,'#5b3626')+'</svg>'
(OUT/'mesa-cubana.svg').write_text(hero)
icon='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#0e514b"/><path d="M113 258h286c-13 100-62 148-143 148s-130-48-143-148Z" fill="#fff3d5"/><path d="M105 246h302" stroke="#e9cf9f" stroke-width="20" stroke-linecap="round"/><path d="M192 167q-23-28 0-56m65 56q-23-28 0-56m65 56q-23-28 0-56" stroke="#f1c36f" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M210 421h92" stroke="#fff3d5" stroke-width="15" stroke-linecap="round"/></svg>'
(OUT/'icon.svg').write_text(icon)
try:
    from PIL import Image,ImageDraw
    for size in [192,512]:
        im=Image.new('RGB',(size,size),'#0e514b');d=ImageDraw.Draw(im);s=size/512
        d.pieslice(tuple(round(v*s) for v in [112,116,400,404]),0,180,fill='#fff3d5')
        d.line([(round(112*s),round(256*s)),(round(400*s),round(256*s))],fill='#e9cf9f',width=max(1,round(16*s)))
        for x in [192,257,322]:
            d.line([(round((x+6)*s),round(173*s)),(round((x-4)*s),round(145*s)),(round((x+6)*s),round(116*s))],fill='#f1c36f',width=max(2,round(13*s)))
        d.line([(round(212*s),round(425*s)),(round(300*s),round(425*s))],fill='#fff3d5',width=max(1,round(14*s)))
        im.save(OUT/f'icon-{size}.png')
except ImportError:
    raise SystemExit('Pillow is required to build PWA PNG icons')
print('Created 12 SVG illustrations and 2 PNG app icons.')
