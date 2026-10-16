// El Oráculo: tirada simbólica de tres cartas (pasado, presente, futuro). Solo entretenimiento.
(()=>{
const $=s=>document.querySelector(s);
const spread=$('#spread'),deck=$('#deck'),status=$('#oracleStatus'),reading=$('#reading'),readingList=$('#readingList');
if(!spread)return;
const positions=['PASADO','PRESENTE','FUTURO'];
const reduce=matchMedia('(prefers-reduced-motion: reduce)');

// Utilidades para dibujar los símbolos (viewBox 0 0 100 100)
const P=(r,a)=>[50+r*Math.cos(a),50+r*Math.sin(a)].map(n=>n.toFixed(2));
const rays=(n,r1,r2,off=0)=>Array.from({length:n},(_,i)=>{const a=off+i*2*Math.PI/n,[x1,y1]=P(r1,a),[x2,y2]=P(r2,a);return `M${x1} ${y1}L${x2} ${y2}`}).join('');
const star=(n,r1,r2,off=-Math.PI/2)=>'M'+Array.from({length:n*2},(_,i)=>P(i%2?r2:r1,off+i*Math.PI/n).join(' ')).join('L')+'Z';

// Los doce arcanos del Gabinete: dibujo propio, palabras clave y lectura para cada posición
const cards=[
{n:'I',name:'El Espejo',keys:'Verdad · reflejo',svg:`<ellipse cx="50" cy="56" rx="21" ry="28"/><ellipse cx="50" cy="56" rx="15.5" ry="22" opacity=".45"/><path d="M36 33Q50 18 64 33M50 22v-6"/><circle cx="50" cy="13" r="3"/><path class="a" d="M42 66Q47 54 58 44"/>`,
read:['Algo que creyó ver con claridad tenía otra cara. Esa imagen incompleta le trajo hasta aquí.','El presente le pide mirarse sin adornos. Lo que encuentre no será tan temible como imagina.','Se acerca un reencuentro con una parte de usted que había dejado al otro lado del cristal.']},
{n:'II',name:'La Llave',keys:'Acceso · permiso',svg:`<circle cx="32" cy="50" r="13"/><circle cx="32" cy="50" r="5.5" class="a"/><path d="M45 50H82M72 50v11M78 50v7M66 50v6"/>`,
read:['Una puerta se cerró a tiempo. Lo que quedó fuera ya no le pertenece.','Tiene en la mano más acceso del que cree. Falta decidir qué cerradura merece la pena.','Pronto le ofrecerán entrar en un lugar reservado. Pregunte antes quién guarda la salida.']},
{n:'III',name:'El Reloj',keys:'Tiempo · paciencia',svg:`<circle cx="50" cy="50" r="27"/><circle cx="50" cy="50" r="21" opacity=".45"/><path d="${rays(12,22,26)}"/><path class="a" d="M50 50V32M50 50L62 57"/><circle cx="50" cy="50" r="2.5"/>`,
read:['Hubo una espera que le pareció perdida. En realidad estaba madurando algo.','Las horas no corren igual para todos. Respete su propio ritmo en lo que tiene entre manos.','Una hora que creía perdida volverá, y con ella una segunda oportunidad.']},
{n:'IV',name:'La Luna',keys:'Intuición · sueños',svg:`<path d="M60 22A29 29 0 1 0 60 78A23 23 0 1 1 60 22Z"/><path class="a" d="${star(4,6,1.6)}" transform="translate(22 -20)"/><path d="${star(4,4,1.2)}" transform="translate(28 4) scale(.8)"/>`,
read:['Un presentimiento le guió mejor que cualquier razonamiento. Conviene recordarlo.','Lo que siente de noche tiene algo que decirle de día. Escuche sin juzgar.','Un sueño recurrente traerá una respuesta. Tenga papel junto a la cama.']},
{n:'V',name:'El Sol',keys:'Claridad · vitalidad',svg:`<circle cx="50" cy="50" r="15"/><circle cx="50" cy="50" r="8" class="a"/><path d="${rays(16,20,27)}"/><path d="${rays(16,30,32,Math.PI/16)}" opacity=".5"/>`,
read:['Una etapa luminosa le dejó fuerzas que todavía no ha gastado.','Las cosas son tan sencillas como parecen. Permítase disfrutar de lo que funciona.','Llega un periodo de claridad. Lo que hoy está en sombra se verá con nitidez.']},
{n:'VI',name:'La Estrella',keys:'Esperanza · guía',svg:`<path d="${star(8,26,11)}"/><path class="a" d="${star(8,11,5)}"/><circle cx="22" cy="24" r="1.6"/><circle cx="80" cy="30" r="1.2"/><circle cx="76" cy="78" r="1.6"/>`,
read:['En un momento difícil hubo una señal pequeña que le sostuvo. No fue casualidad.','Confíe en el rumbo aunque todavía no vea el destino.','Una ilusión que parecía apagada volverá a brillar, más modesta y más firme.']},
{n:'VII',name:'La Torre',keys:'Cambio · ruptura',svg:`<path d="M38 84V38H62V84M34 38H66M36 38V30H42V38M47 30H53V38M58 30H64V38"/><path d="M45 84V72A5 5 0 0 1 55 72V84M47 50h6v8h-6z" opacity=".6"/><path class="a" d="M78 10L66 30H74L63 48"/>`,
read:['Algo que parecía sólido cayó. Gracias a eso hoy tiene más espacio.','Una estructura de su vida cruje. No la apuntale por costumbre: revise si aún la necesita.','Un cambio repentino despejará el camino. Lo que se derrumba suele dejar ver el cielo.']},
{n:'VIII',name:'El Ermitaño',keys:'Búsqueda · silencio',svg:`<path d="M50 12V24M40 30H60L56 24H44ZM42 30V64H58V30M37 64H63L58 72H42Z"/><path d="M42 40H58" opacity=".5"/><path class="a" d="M50 56C43 50 47 42 50 37C53 42 57 50 50 56Z"/>`,
read:['Un tiempo a solas le enseñó más que muchas conversaciones.','Baje el ruido. La respuesta que busca necesita una lámpara, no un altavoz.','Encontrará lo que busca cuando deje de buscarlo en los demás.']},
{n:'IX',name:'La Rueda',keys:'Ciclos · fortuna',svg:`<circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="21" opacity=".45"/><circle cx="50" cy="50" r="6" class="a"/><path d="${rays(8,6,21,Math.PI/8)}"/><path d="${rays(8,28,33,Math.PI/8)}" opacity=".6"/>`,
read:['Lo que vivió formaba parte de un ciclo más largo. No todo dependía de usted.','La rueda gira: lo que hoy está abajo no permanecerá ahí.','Un giro inesperado le devolverá algo que creía perdido para siempre.']},
{n:'X',name:'El Umbral',keys:'Paso · transformación',svg:`<path d="M30 84V42A20 20 0 0 1 70 42V84M22 84H78"/><path class="a" d="M39 84V46A11 11 0 0 1 61 46V84"/><path d="M50 30V22M40 33l-4-6M60 33l4-6" opacity=".6"/>`,
read:['Cruzó una puerta sin saber que lo hacía. Desde entonces algo es distinto.','Está en el umbral: ni dentro ni fuera. Es un buen lugar para decidir con calma.','Una etapa termina para que empiece otra. El paso será más suave de lo que teme.']},
{n:'XI',name:'La Guardiana',keys:'Secreto · saber oculto',svg:`<path d="M27 20V84M22 20H32M22 84H32M73 20V84M68 20H78M68 84H78"/><path d="M27 30Q50 46 73 30M27 30Q50 66 73 30" opacity=".7"/><path class="a" d="M54 52A8 8 0 1 0 54 68A6 6 0 1 1 54 52Z"/>`,
read:['Guardó un secreto que le protegió. Su silencio tuvo sentido.','No todo debe contarse todavía. Hay saberes que maduran mejor en reserva.','Alguien le confiará algo valioso. Sabrá qué hacer con ello si no se precipita.']},
{n:'XII',name:'El Viajero',keys:'Comienzo · audacia',svg:`<circle cx="50" cy="50" r="27"/><path d="${rays(16,23,27)}" opacity=".5"/><path d="M50 22L56 50L50 78L44 50Z"/><path class="a" d="M50 22L56 50H44Z"/><path d="M22 50L50 45L78 50L50 55Z" opacity=".6"/>`,
read:['Un comienzo impulsivo le trajo hasta aquí. Fue más sabio de lo que parecía.','Es momento de dar un paso aunque no tenga el mapa completo.','Un viaje, real o interior, le espera. Lleve poco equipaje y mucha curiosidad.']}
];

const back=`<svg class="tBackArt" viewBox="0 0 120 200" aria-hidden="true"><rect x="6" y="6" width="108" height="188" rx="4"/><rect x="12" y="12" width="96" height="176" rx="2" opacity=".5"/><path d="M60 22L98 100L60 178L22 100Z" opacity=".55"/><path d="M60 40L86 100L60 160L34 100Z" opacity=".35"/><circle cx="60" cy="100" r="22"/><path class="a" d="${star(8,16,6,-Math.PI/2).replace(/(\d+\.\d+) (\d+\.\d+)/g,(m,x,y)=>`${(+x+10).toFixed(2)} ${(+y+50).toFixed(2)}`)}"/><path d="M60 36A8 8 0 1 0 60 52A6 6 0 1 1 60 36ZM60 148A8 8 0 1 0 60 164A6 6 0 1 1 60 148Z" opacity=".7"/></svg>`;
const face=c=>`<div class="tFaceArt"><span class="tNum">${c.n}</span><svg viewBox="0 0 100 100" aria-hidden="true">${c.svg}</svg><span class="tName">${c.name}</span></div>`;

let order=[],picked=[];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};

function setStatus(){status.textContent=picked.length<3?`Elija la ${['primera','segunda','tercera'][picked.length]} carta: ${positions[picked.length].toLowerCase()}.`:'La tirada está completa.'}
function build(){order=shuffle(cards.map((_,i)=>i));picked=[];
spread.innerHTML=positions.map((p,i)=>`<li class="slot" data-slot="${i}"><div class="tcard"><div class="tBack">${back}</div><div class="tFace"></div></div><span class="slotLabel">${p}</span><span class="slotName"></span></li>`).join('');
deck.innerHTML=order.map((c,i)=>`<button class="deckCard" data-deck="${i}" aria-label="Carta ${i+1} de 12, boca abajo">${back}</button>`).join('');
readingList.innerHTML='';reading.hidden=true;setStatus()}

function pick(btn){if(picked.length>=3||btn.getAttribute('aria-disabled')==='true')return;
const slotIndex=picked.length,c=cards[order[+btn.dataset.deck]];picked.push(c);
btn.setAttribute('aria-disabled','true');btn.classList.add('taken');btn.setAttribute('aria-label',`Carta ${+btn.dataset.deck+1}: elegida para el ${positions[slotIndex].toLowerCase()}`);
const slot=spread.querySelector(`[data-slot="${slotIndex}"]`);slot.querySelector('.tFace').innerHTML=face(c);slot.classList.add('filled');
requestAnimationFrame(()=>requestAnimationFrame(()=>slot.querySelector('.tcard').classList.add('flipped')));
const delay=reduce.matches?0:850;
setTimeout(()=>{slot.querySelector('.slotName').textContent=c.name;
const li=document.createElement('li');li.className='readingItem';li.innerHTML=`<span class="readingPos">${positions[slotIndex]} · ${c.n}</span><h4>${c.name}</h4><p class="readingKeys">${c.keys}</p><p>${c.read[slotIndex]}</p>`;readingList.append(li);reading.hidden=false;
status.textContent=`${positions[slotIndex]}: ${c.name}. ${c.read[slotIndex]}`;
if(picked.length===3){deck.classList.add('done');setTimeout(()=>{status.textContent='La tirada está completa. Puede barajar de nuevo cuando quiera.';$('#readingTitle').focus({preventScroll:true});reading.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'nearest'})},reduce.matches?0:400)}
else setTimeout(setStatus,1600)},delay)}

deck.addEventListener('click',e=>{const b=e.target.closest('.deckCard');if(b)pick(b)});
$('#reshuffle').addEventListener('click',()=>{deck.classList.remove('done');spread.querySelectorAll('.tcard').forEach(t=>t.classList.remove('flipped'));
deck.classList.add('shuffling');setTimeout(()=>{deck.classList.remove('shuffling');build();deck.querySelector('.deckCard').focus({preventScroll:true});spread.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'center'})},reduce.matches?0:600)});
build();
})();
