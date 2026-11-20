(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

/* time in Knysna */
function sast(){const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Johannesburg',weekday:'short',hour:'numeric',minute:'numeric',hour12:false,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date());const g=t=>p.find(x=>x.type===t).value;
  return{wd:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(g('weekday')),h:(+g('hour')%24)+(+g('minute'))/60,y:+g('year'),m:+g('month'),d:+g('day')}}
const T=sast();

/* the photo wall: every column has its own photos, so nothing repeats on screen */
document.documentElement.classList.add('js');
const hero=$('.hero'),nav=$('#nav'),rail=$('.rail'),sunset=$('.sunset');
const WALL=['w13','w18','w25','w22','inside-lights','w38','w29','w20','w17','sunset-mussels','w32','w30','w16','w36','long-table','w26','w40','w21','lagoon-deck','w23','w15','w35','w27','mussel-pot','w39','w31','w24','kitchen-hands','w37','w28','latte','w19','w34','w14'];
function buildWall(){const el=$('#wall');const vw=innerWidth,vh=hero.offsetHeight;
  let cols=vw<700?3:vw<1100?4:5;
  for(;cols>2;cols--){const colW=(vw*(vw<700?1.28:1.12))/cols,tileH=colW*1.25+14,showing=Math.ceil(vh*1.3/tileH)+1;if(Math.floor(WALL.length/cols)>showing)break}
  const rings=Array.from({length:cols},()=>[]);WALL.forEach((n,i)=>rings[i%cols].push(n));
  el.style.setProperty('--cols',cols);
  el.innerHTML=rings.map((r,i)=>{const imgs=r.map((n,k)=>`<img src="/assets/img/wall/${n}.jpg" alt="" ${k>3?'loading="lazy"':''} decoding="async">`).join('');
    return `<div class="col${i%2?' down':''}" style="--dur:${60+i*9}s;animation-delay:-${i*11}s">${imgs}${imgs}</div>`}).join('')}
buildWall();let rw;addEventListener('resize',()=>{clearTimeout(rw);rw=setTimeout(()=>{const c=+$('#wall').style.getPropertyValue('--cols');buildWall()},300)});
new IntersectionObserver(e=>hero.classList.toggle('paused',!e[0].isIntersecting)).observe(hero);

const par=$$('[data-parallax]');
let ticking=false;
function frame(){ticking=false;
  const vh=innerHeight,y=scrollY;
  const past=y>hero.offsetHeight-90;
  nav.classList.toggle('solid',past);rail.classList.toggle('show',y>hero.offsetHeight*.6);
  if(sunset){const r=sunset.getBoundingClientRect();sunset.style.setProperty('--s',clamp((vh-r.top)/(r.height+vh)).toFixed(3))}
  if(!RM)for(const el of par){const r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)continue;const c=(r.top+r.height/2-vh/2);el.style.translate=`0 ${(c*+el.dataset.parallax).toFixed(1)}px`}
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});
addEventListener('resize',frame);frame();

/* rail: where am I */
const items=$$('.rail li');
const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){items.forEach(li=>li.classList.toggle('on',li.dataset.for===e.target.id));
}},{rootMargin:'-45% 0px -50% 0px'});
items.forEach(li=>{const s=document.getElementById(li.dataset.for);s&&io.observe(s)});
items.forEach(li=>li.addEventListener('click',()=>document.getElementById(li.dataset.for)?.scrollIntoView({behavior:RM?'auto':'smooth'})));
rail.style.pointerEvents='auto';

/* reveal */
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
$$('.reveal').forEach(el=>rv.observe(el));

/* the week */
const W=[['Mon','Breakfast from 8'],['Tue','Lunch on the deck'],['Wed','Mussel Pot',1],['Thu','Sunset till 8'],['Fri','Weekend starts'],['Sat','Waffles',1],['Sun','Long lunches']];
$('#days').innerHTML=W.map((d,i)=>`<div class="day${d[2]?' hot':''}${i===T.wd?' today':''}"><b>${d[0]}</b><span>${d[1]}</span></div>`).join('');

/* menu board */
/* Nest summer menu 2026 (breakfast and sweet tooth from the printed menu, with prices).
   item: [name, description, price, {v:vegetarian, star:Nest Rockstar, opts:[[label,price],...]}] */
const MENU=[
 {k:'Breakfast',when:'Eight to eleven',items:[
  ['Granola jar','Granola, yoghurt, mango chia pudding and seasonal fruit',80,{v:1,star:1}],
  ['Spiced apple porridge','Creamy multigrain porridge with warm spices, fresh sliced apple, yoghurt, toasted nuts and honey',89,{v:1}],
  ['Berry bliss smoothie','Mixed berries, banana, yoghurt and a touch of honey, blended until smooth and creamy',68],
  ['Bread basket','A selection of artisan bread with butter and jam',52,{v:1}],
  ['Scramble me','Soft scrambled eggs',56,{v:1,opts:[['add toast',20],['add bacon',28]]}],
  ['Nest egg','Boiled egg with toasted brioche, jam and butter',64,{v:1,opts:[['add ham',30],['cheese',30],['bacon',28],['avo',22]]}],
  ['My avo half','Avo herb salsa, tomato and cucumber salad, carrot hummus, micro greens, bacon marmalade, seed loaf',102,{v:1,opts:[['add soft boiled egg',20]]}],
  ['Quinoa sunrise bowl','Quinoa, baby spinach, tomato, cucumber and roasted pumpkin, with avocado, yoghurt, boiled egg, pumpkin seeds and pumpkin oil',130,{v:1}],
  ['Nest benedict','Poached eggs, ponzu hollandaise and baby spinach on a grilled cheese waffle, with',null,{star:1,opts:[['pulled beef',185],['salmon',185],['gypsy ham',175],['bacon',170],['mushrooms (V)',155]]}],
  ['Nest classic breakfast','Bacon, beef sausage, mushrooms and tomato, with your choice of egg and bread',138],
  ['Nest breakfast bagel','Toasted bagel, avocado crema, rocket and chilli mayo, with',null,{opts:[['crispy bacon, grilled halloumi and fig',135],['egg, sautéed mushrooms and seasonal herbs',115]]}]]},
 {k:'Lunch & dinner',when:'Eleven thirty to nine',items:[
  ['#','Skinny dip'],
  ['Nest salad','Cos lettuce, cherry tomatoes, cucumber and peppers, served with crispy poppadoms',98],
  ['Crispy salmon bites','Crunchy rice paper, salmon tartare, avocado and wasabi mousse',155,{star:1}],
  ['Take a bao','Crispy, spicy cauliflower on a bao bun',140,{v:1,opts:[['chicken option',165]]}],
  ['Mediterranean burrata','Creamy burrata with seasonal tomatoes, basil, olive oil and balsamic dressing, served with a flatbread',165,{v:1}],
  ['Green & orange','Grilled carrots and tenderstem broccoli with toasted almonds and an Asian-spiced satay sauce',68,{v:1}],
  ['#','Flat out good'],
  ['Baba ganoush flatbread','Creamy baba ganoush, cherry tomato and crispy chickpeas, served with Nest flatbread',90,{v:1}],
  ['Moroccan cigar','Flaky phyllo, spinach, butternut, spices, nuts and harissa yoghurt',148,{v:1}],
  ['Lasagne light','A slender slice of lasagne with a bright fresh leaf salad, almond crunch and whipped feta',75],
  ['My avo half','Avo herb salsa, tomato and cucumber salad, carrot hummus, micro greens, bacon marmalade, seed loaf',102,{star:1}],
  ['Reuben','House-smoked beef brisket, cheese, sauerkraut, secret sauce and pickle on butter-toasted sourdough',152,{star:1}],
  ['Patti melt','Smashed burger on toasted brioche, bacon jam, cheese melt and Russian dressing',175,{star:1}],
  ['Slaai pie','Flatbread, soft cheese, garden greens, lemon dressing and parmesan',140,{v:1}],
  ['#','Pajama braai'],
  ['Korean beef skewers','Tender beef skewers glazed in a sticky Korean-style sauce, finished with sesame seeds',125],
  ['Chicken yakitori','Organic chicken fillet kebabs, peanut satay sauce and pineapple salsa',130],
  ['Sticky pork ribs','Asian sticky BBQ ribs, crispy onion and herb sprinkle',148],
  ['Nest steak','With rocket, parmesan shavings, horseradish cream, truffle oil and sea salt',165,{star:1,opts:[['supersize double portion',250]]}],
  ['#','Sea circus'],
  ['Tentacles','Crispy calamari tentacles with rouille',85],
  ['Crumbed prawns','Crumbed prawns with a zesty mayo dip',115],
  ['Citrus chilli prawns','Pan-seared prawns tossed in a citrus and chilli glaze, avocado-lime crema and baguette',148,{opts:[['supersize',280]]}],
  ['Burnt lemon seafood pasta','Linguine with seafood, peas and sugar snap peas in a buttery cream sauce with parmesan',180],
  ['#','Mussel pot Wednesday'],
  ['Creamy mussel pot','With baguette. Wednesdays only',185,{star:1}]]},
 {k:'Sunset bites',when:'Eleven thirty to nine',items:[
  ['Cheese balls','Crispy aged cheddar croquettes on basil aioli',74,{v:1}],
  ['Falafel balls','Crisp chickpea falafel with lemon herb yoghurt',72,{v:1}],
  ['Sunset fries','',null,{v:1,opts:[['with ketchup',52],['with parmesan and truffle mayo',82]]}],
  ['Onion rings','',62,{v:1}],
  ['Island harvest','A colourful selection of summer mezze, fresh accompaniments, dips and flatbread',225,{v:1,opts:[['add grilled chicken',45],['add prawns',85]]}],
  ['Cheese platter','A selection of cheese with flatbread and seasonal accompaniments, for two',236,{opts:[['add salami',45],['add coppa',45],['add smoked brisket',45]]}]]},
 {k:'Sweet tooth',when:'All day',items:[
  ['Crêpes suzette','Thin folded crêpes with a boozy citrus sauce and vanilla gelato',78],
  ['Summer cloud','Light crisp meringue, vanilla cream, lemon pastry cream, tropical mango coulis and seasonal fruit',75],
  ['Eclairs','Choux pastry, crème légère, chocolate glaze and hazelnut sprinkles',52],
  ['Dark chocolate and orange tart','Dark chocolate tart with citrus peel and vanilla gelato',94],
  ['Waffles','',null,{star:1,opts:[['berries and cream',95],['hazelchoc spread and cream',92],['kids special: choose 3 toppings, with ice cream',85]]}],
  ['Churro waffle','Golden churro-style waffle dusted in cinnamon sugar, with vanilla gelato',75],
  ['Pancakes','',null,{opts:[['milktart',68],['choc-hazelnut spread and strawberries',75]]}],
  ['Carrot cake','Moist, nutty, fruity carrot cake with cream cheese frosting',75],
  ['Chocolate cake','Chocolate cake with a silky buttercream',78],
  ['Cruffins','Filled with a smooth, creamy crème pâtissière or a decadent chocolate pâtissière',52],
  ['Raspberry sorbet','Bright, tangy and refreshingly light',55],
  ['#','Pantry and take me home'],
  ['Muesli bran rusks','',null,{opts:[['50 g',18],['400 g',85]]}],
  ['Almond & cranberry biscotti','250 g',60],
  ['Whole cakes to take home','',null,{opts:[['chocolate cake',850],['carrot cake',890]]}]]},
 {k:'Coffee & drinks',when:'All day',items:[
  ['#','Coffee · single / double'],
  ['Cappuccino','',[38,43]],['Flat white','',46],['Latte','',[42,46]],['Americano','',[36,38]],['Cortado','',38],['Espresso','',[32,36]],['Macchiato','',[32,36]],
  ['Affogato','',78],['Golden almond','',58],['Iced latte','',45],['Iced Americano','',38],['Hot chocolate','',56],['Café mocha','',68],
  ['#','Smith house of tea'],
  ['Teas','Rooibos, chamomile, juicy berry, ginger lemon, English breakfast, green sencha',37],
  ['#','Juiced'],
  ['Freshly made yellow juice','',64],['Juices','Orange, strawberry or fruit cocktail',60],['Coconut water','',43],['Kombucha','',53],['Hot apple cider','Homemade, non-alcoholic',64],
  ['#','Softs and water'],
  ['Aqua V still or sparkling','',null,{opts:[['300 ml',32],['750 ml',55]]}],['Appletiser or Grapetiser','330 ml',50],['Coke, Coke Zero, Sprite or Cream Soda','300 ml',35],
  ['Fitch & Leedes soda or tonic','200 ml',35],['Bos iced tea','300 ml',40],['Red Bull','',48]]},
 {k:'Bar & wine',when:'Eleven thirty to nine',items:[
  ['#','Cider and beer'],
  ['Savanna Dry or Light','',48],['Castle or Castle Lite','',42],['Windhoek Lager or Draught','',50],['Heineken','',49],['Devil’s Peak Lager','',49],['Red Bridge Zero','',69],['Beer on tap','',62],
  ['#','Spirits and cocktails'],
  ['Early Bird (non-alc)','Carrot, pineapple, ginger, egg white, club soda',80],['Pink Nest','Gin, dry vermouth, lemon juice, raspberry syrup',110],['Margarita','Blanco, Cointreau, lime juice, simple syrup',110],
  ['Red Feather','Tequila, hibiscus, lemon juice, smoky agave',110],['Knysna-cello','Limoncello, Stellenrust, syrup, dry lemon',119],['Whiskey sour','Bourbon, lemon, simple syrup',104],
  ['Mojito','White rum, mint, club soda',104],['Caipirinha','White rum, lime',96],['Espresso martini','Dark rum, Kahlúa, espresso',104],['Pineapple daiquiri twist','White rum, pineapple juice, syrup, Stellenrust',119],
  ['Aperol spritz','Aperol, prosecco, club soda',110],['Brandy old fashioned','Brandy, bitters',104],['Gin & tonic','',92],['Whiskey soda','',92],['Brandy & Coke','',92],['Irish coffee','',92],['Grappa','',75],
  ['#','Wine and bubbles · glass / bottle'],
  ['Moët & Chandon Impérial Brut N.V.','A sparkling bouquet',[null,1800]],['Genevieve Brut Rosé N.V.','Summery, clean, bright',[165,660]],['Graham Beck Brut','Rich, creamy complexity',[130,495]],
  ['Steenberg Sauvignon Blanc Brut N.V.','Prosecco style, fruity and fresh',[95,395]],['Gabrielskloof The Blank Sauvignon Blanc 2025','Well rounded but still fresh',[85,340]],['Sea Salter Sauvignon Blanc 2025','Tropical fruit with fynbos',[90,430]],
  ['Lands End Sauvignon Blanc 2023','Super delicate, mouth-watering',[105,450]],['Steenberg Sauvignon Blanc 2024','A seductive bouquet of fruity notes',[110,440]],['Le Sueur Chenin Blanc 2025','Fresh notes, enjoyed with good company',[80,320]],
  ['Gabrielskloof Chenin Blanc 2026','Lovely long finish',[85,340]],['Oldenburg Chenin Blanc 2024','Great South African chenin',[160,630]],['Chamonix Unoaked Chardonnay 2026','Summery, light, bright, great value',[85,340]],
  ['Eenzaamheid Chenin Blanc 2024','Precision with elegance',[145,575]],['Bouchard Finlayson Missionvale Chardonnay 2025','Go on, spoil yourself',[225,900]],['HPF Bloos Rosé 2026','Full and fruity',[75,295]],
  ['Chamonix Pinot Noir Rosé 2024','Our season’s pick',[80,320]],['La Brune Pinot Noir 2026','Summer red wine',[130,495]],['Illimis Pinotage 2023','Delicate, with structure and intense flavour',[160,640]],
  ['HPF Posmeester Merlot 2024','Big and meaty',[80,320]],['Chamonix Rouge 2023','A harmonious blend',[75,280]],['Luddite Saboteur Red 2023','Toffee, pomegranate, dark plum',[155,630]],
  ['Bouchard Finlayson Hannibal 2022','Our “almost” Italian friend',[null,890]],['Zorgvliet Cabernet Sauvignon 2023','A harmonious blend',[120,480]],['Vergelegen Reserve Cabernet Sauvignon 2021','Luxurious red',[null,850]]]},
 {k:'Vegan',when:'Eat well. Feel light. Live bright.',note:'All vegan. Breakfast dishes until 11:30, the rest from twelve to nine.',items:[
  ['Spiced multigrain porridge','Multigrain blend, warm spice-infused coconut milk, apple, almonds and a drizzle of maple syrup. 8 to 11:30',74],
  ['Quinoa sunrise bowl','Quinoa, baby spinach, tomato, cucumber and roasted pumpkin, with pumpkin seeds, pumpkin seed oil and carrot hummus topped with mushrooms. 8 to 11:30',130],
  ['Vegan avo half','Avo herb salsa, tomato and cucumber salad, carrot hummus, micro greens, mushrooms, seed loaf',102],
  ['Sunshine tartine','Baguette slice with golden vegetable hummus, pickled eggplant and peppers, rocket, olive oil and crunchy dukkah',98],
  ['Berry bliss smoothie','Mixed berries, banana, almond butter and almond milk with a touch of maple syrup',68],
  ['Baba ganoush flatbread','Creamy baba ganoush, cherry tomato and crispy chickpeas, served with Nest flatbread',90],
  ['Moroccan cigar','Flaky phyllo, spinach, butternut, maple syrup, spices, nuts and carrot hummus',148],
  ['Slaai pie','Flatbread, carrot hummus, garden greens, lemon dressing and toasted almonds',140,{star:1}],
  ['Nest salad','Avocado, cos lettuce, cherry tomatoes and cucumber, served with crispy poppadoms',98],
  ['Take a bao','Crispy, spicy cauliflower on a bao bun',140,{star:1}],
  ['Green & orange','Grilled carrots and tenderstem broccoli with toasted almonds and an Asian-spiced satay sauce',68],
  ['Sunset fries','',null,{opts:[['with ketchup',52],['with truffle mayo',82]]}],
  ['Onion rings','',62],
  ['Island harvest','A colourful selection of summer mezze, fresh accompaniments, dips and flatbread',225],
  ['Falafel balls','Crisp chickpea falafel on tahini dressing',140],
  ['Pineapple on fire','Caramelised pineapple on a golden crumble with raspberry sorbet',85]]}];
const tabs=$('#tabs'),board=$('#board');
tabs.innerHTML=MENU.map((m,i)=>`<button role="tab" id="t${i}" aria-selected="${i?'false':'true'}" aria-controls="board">${m.k}</button>`).join('');
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const STAR='<span class="star" title="Nest Rockstar" aria-label="Nest Rockstar">★</span>';
const PR=p=>Array.isArray(p)?p.map(x=>x==null?'–':x).join(' / '):p;
function show(i){const m=MENU[i];$$('#tabs button').forEach((b,j)=>b.setAttribute('aria-selected',i===j));board.setAttribute('aria-labelledby','t'+i);
  const stars=m.items.some(x=>x[3]?.star);let j=0;
  board.innerHTML=`<h3>${m.k}</h3><p class="when">${m.when}</p>${m.note?`<p class="bnote">${esc(m.note)}</p>`:''}<ul>${m.items.map(x=>{const o=x[3]||{};const d=RM?0:Math.min(j++,24)*30;
    if(x[0]==='#')return `<li class="sec fade-in" style="animation-delay:${d}ms">${esc(x[1])}</li>`;
    return `<li class="fade-in" style="animation-delay:${d}ms"><div class="row"><b>${esc(x[0])}${o.v?' <i class="veg">(V)</i>':''}${o.star?' '+STAR:''}</b>${x[2]!=null?`<em class="pr">${PR(x[2])}</em>`:''}</div>${x[1]?`<span>${esc(x[1])}</span>`:''}${o.opts?`<dl>${o.opts.map(([l,pr])=>`<div><dt>${esc(l)}</dt><dd>${pr}</dd></div>`).join('')}</dl>`:''}</li>`}).join('')}</ul><p class="legend">${stars?'<span class="star">★</span> Nest Rockstars &nbsp;·&nbsp; ':''}Prices in Rand</p>`}
$$('#tabs button').forEach((b,i)=>{b.onclick=()=>show(i);b.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=(i+(e.key==='ArrowRight'?1:-1)+MENU.length)%MENU.length;show(n);$('#t'+n).focus()}}});
show(T.h<11?0:T.h>=17?2:1);

/* open now */
const st=$('#status');const open=T.h>=8&&T.h<21;
const fmt=h=>String(Math.floor(h)).padStart(2,'0')+':'+String(Math.round(h%1*60)).padStart(2,'0');
st.textContent=open?`Open now · last orders 21:00`:(T.h<8?'Closed · opens today at 08:00':'Closed · opens tomorrow at 08:00');
st.classList.toggle('closed',!open);

/* sunset tonight in Knysna (NOAA approximation) */
(function(){const lat=-34.04,lng=23.05,rad=Math.PI/180;
  const N=Math.round((Date.UTC(T.y,T.m-1,T.d)-Date.UTC(T.y,0,0))/864e5);
  const g=2*Math.PI/365*(N-1);
  const eq=229.18*(0.000075+0.001868*Math.cos(g)-0.032077*Math.sin(g)-0.014615*Math.cos(2*g)-0.040849*Math.sin(2*g));
  const dc=0.006918-0.399912*Math.cos(g)+0.070257*Math.sin(g)-0.006758*Math.cos(2*g)+0.000907*Math.sin(2*g)-0.002697*Math.cos(3*g)+0.00148*Math.sin(3*g);
  const ha=Math.acos(Math.cos(90.833*rad)/(Math.cos(lat*rad)*Math.cos(dc))-Math.tan(lat*rad)*Math.tan(dc))/rad;
  const min=720-4*(lng-ha)-eq+120;if(!isFinite(min))return;
  const el=$('#sunclock');el.querySelector('b').textContent=fmt(min/60);el.hidden=false})();

$('#yr').textContent=T.y;
})();
