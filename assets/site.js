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
const MENU=[
 {k:'Breakfast',when:'08:00 to 11:00',items:[
  ['Nest Benedict','Pulled beef brisket, soft eggs, yuzu hollandaise, baby spinach on a grilled cheese waffle'],
  ['Waffles','With berries and cream. The Saturday favourite'],
  ['My Avo Half (V option)','Avo herb salsa, tomato and cucumber, carrot hummus, micro greens, bacon marmalade, seed loaf'],
  ['Trout Soufflé','Hot smoked trout soufflé with toast soldiers'],
  ['Boer & Brit','Bacon, egg and boerewors on baked beans with soldiers'],
  ['Granola Bowl (V)','Granola, chia, yoghurt or nogurt and fresh fruit']]},
 {k:'Lunch & dinner',when:'11:30 to 20:00',items:[
  ['Knysna Mussel Pot','With bread ends for the sauce. Wednesdays only'],
  ['Pumping Prawns','Grilled prawns with chimichurri'],
  ['Picanha Steak','White veg purée, roasted cauliflower, truffle oil and sea salt'],
  ['Patti Melt','Double smashed burger on toasted brioche, bacon jam, cheese melt, Russian dressing'],
  ['Sticky Pork Ribs','Asian sticky BBQ ribs, peanuts and herbs'],
  ['Hotpot Bowl','Sliced beef, rice noodles, pak choi and miso mushrooms in broth'],
  ['Veggie Curry (V)','Chickpea, lentil and roasted butternut curry on millet'],
  ['Take a Bao (V)','Crispy, spicy cauliflower on a bao bun']]},
 {k:'Sunset bites',when:'For the deck, from 12:00',items:[
  ['Tentacles','Crispy calamari tentacles with rouille'],
  ['Sunset Fries','With parmesan and truffle mayo, or just ketchup'],
  ['Cheese Balls','Crispy aged cheddar croquettes on basil aioli'],
  ['Snoek Cigars','With a chilli apricot dip'],
  ['Brisket Fingers','Crispy smoked brisket, corn and jalapeño'],
  ['Meat & cheese platters','For two or for four, made for sharing']]},
 {k:'Sweet tooth',when:'All day',items:[
  ['Crêpes Suzette','Thin crêpes, boozy citrus sauce, vanilla gelato'],
  ['Koffie-misu','Coffee and Amarula soaked sponge fingers, mascarpone cream, cocoa'],
  ['B&B','Raisin and croissant bread and butter pudding'],
  ['Chocolate Ice Cream Sandwich','Chocolate cake, creamy vanilla gelato, vermicelli'],
  ['Eclairs','Choux pastry, crème légère, chocolate glaze, hazelnut'],
  ['Carrot Cake','Moist, nutty, fruity, cream cheese frosting']]}];
const tabs=$('#tabs'),board=$('#board');
tabs.innerHTML=MENU.map((m,i)=>`<button role="tab" id="t${i}" aria-selected="${i?'false':'true'}" aria-controls="board">${m.k}</button>`).join('');
function show(i){const m=MENU[i];$$('#tabs button').forEach((b,j)=>b.setAttribute('aria-selected',i===j));board.setAttribute('aria-labelledby','t'+i);
  board.innerHTML=`<h3>${m.k}</h3><p class="when">${m.when}</p><ul>${m.items.map((x,j)=>`<li class="fade-in" style="animation-delay:${RM?0:j*45}ms"><b>${x[0]}</b><span>${x[1]}</span></li>`).join('')}</ul>`}
$$('#tabs button').forEach((b,i)=>{b.onclick=()=>show(i);b.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=(i+(e.key==='ArrowRight'?1:-1)+MENU.length)%MENU.length;show(n);$('#t'+n).focus()}}});
show(T.h<11?0:T.h>=17?2:1);

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
