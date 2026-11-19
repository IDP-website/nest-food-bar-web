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
 {k:'Sweet tooth',when:'All day',items:[
  ['Waffles','Saturdays are waffle day',null,{star:1,opts:[['berries and cream',95],['hazelchoc spread and cream',92],['kids special: choose 3 toppings, with ice cream',85]]}],
  ['Churro waffle','Golden churro-style waffle dusted in cinnamon sugar, with vanilla gelato',75],
  ['Pancakes','',null,{opts:[['milktart',68],['choc-hazelnut spread and strawberries',75]]}],
  ['Cruffin','Filled with a creamy crème pâtissière or a smooth chocolate pâtissière',52,{star:1}],
  ['Eclairs','Choux pastry, crème légère, chocolate glaze and hazelnut sprinkles',52],
  ['Carrot cake','Moist, nutty, fruity, with cream cheese frosting',78,{star:1}],
  ['Chocolate cake','Decadent chocolate cake with a silky Swiss meringue buttercream',75],
  ['Summer cloud','Light crisp meringue, vanilla cream, lemon pastry cream, tropical mango coulis and seasonal fruit',75],
  ['Dark chocolate and orange tart','Dark chocolate tart with citrus peel and vanilla gelato',94]]},
 {k:'Lunch & dinner',when:'11:30 to 20:00',note:'Our summer lunch and dinner menu is on its way. Here are a few favourites; ask your waiter for today\'s menu and prices.',items:[
  ['Knysna Mussel Pot','With bread for the sauce. Wednesdays only'],
  ['Pumping Prawns','Grilled prawns with chimichurri'],
  ['Picanha Steak','White veg purée, roasted cauliflower, truffle oil and sea salt'],
  ['Patti Melt','Double smashed burger on toasted brioche, bacon jam, cheese melt, Russian dressing'],
  ['Sticky Pork Ribs','Asian sticky BBQ ribs, peanuts and herbs'],
  ['Veggie Curry','Chickpea, lentil and roasted butternut curry on millet',null,{v:1}]]},
 {k:'Sunset bites',when:'For the deck, from 12:00',note:'Ask your waiter for today\'s sunset bites and prices.',items:[
  ['Tentacles','Crispy calamari tentacles with rouille'],
  ['Sunset Fries','With parmesan and truffle mayo'],
  ['Cheese Balls','Crispy aged cheddar croquettes on basil aioli'],
  ['Brisket Fingers','Crispy smoked brisket, corn and jalapeño'],
  ['Meat and cheese platters','For two or for four, made for sharing']]}];
const tabs=$('#tabs'),board=$('#board');
tabs.innerHTML=MENU.map((m,i)=>`<button role="tab" id="t${i}" aria-selected="${i?'false':'true'}" aria-controls="board">${m.k}</button>`).join('');
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const STAR='<span class="star" title="Nest Rockstar" aria-label="Nest Rockstar">★</span>';
function show(i){const m=MENU[i];$$('#tabs button').forEach((b,j)=>b.setAttribute('aria-selected',i===j));board.setAttribute('aria-labelledby','t'+i);
  const priced=m.items.some(x=>x[2]!=null||x[3]?.opts);
  board.innerHTML=`<h3>${m.k}</h3><p class="when">${m.when}</p>${m.note?`<p class="bnote">${esc(m.note)}</p>`:''}<ul>${m.items.map((x,j)=>{const o=x[3]||{};
    return `<li class="fade-in" style="animation-delay:${RM?0:j*35}ms"><div class="row"><b>${esc(x[0])}${o.v?' <i class="veg">(V)</i>':''}${o.star?' '+STAR:''}</b>${x[2]!=null?`<em class="pr">${x[2]}</em>`:''}</div>${x[1]?`<span>${esc(x[1])}</span>`:''}${o.opts?`<dl>${o.opts.map(([l,pr])=>`<div><dt>${esc(l)}</dt><dd>${pr}</dd></div>`).join('')}</dl>`:''}</li>`}).join('')}</ul>${priced?'<p class="legend"><span class="star">★</span> Nest Rockstars &nbsp;·&nbsp; Prices in Rand</p>':''}`}
$$('#tabs button').forEach((b,i)=>{b.onclick=()=>show(i);b.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=(i+(e.key==='ArrowRight'?1:-1)+MENU.length)%MENU.length;show(n);$('#t'+n).focus()}}});
show(T.h<11?0:T.h>=17?3:(T.h<12?1:2));

/* open now */
const st=$('#status');const open=T.h>=8&&T.h<20;
const fmt=h=>String(Math.floor(h)).padStart(2,'0')+':'+String(Math.round(h%1*60)).padStart(2,'0');
st.textContent=open?`Open now · until 20:00`:(T.h<8?'Closed · opens today at 08:00':'Closed · opens tomorrow at 08:00');
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
