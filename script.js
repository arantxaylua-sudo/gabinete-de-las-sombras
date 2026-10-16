const items=[
{id:'001',name:'El espejo de las ausencias',kind:'objeto',tag:'REFLEJO NO VERIFICADO',price:189,img:'mirror.jpg',alt:'Espejo de marco rococó en madera dorada, con la luna empañada, sobre fondo oscuro.',intro:'En la fotografía original aparecía una persona que nadie recordaba haber invitado.',origin:'Casa Varela · Asturias · 1911',story:'Recuperado de una habitación sellada desde 1911. En el inventario de la casa constan siete habitantes; en los retratos familiares aparecen ocho.',warning:'No situarlo frente a una puerta abierta.',secret:'En el reverso del marco hay ocho nombres. El último sigue cambiando.'},
{id:'002',name:'La llave de la habitación cero',kind:'objeto',tag:'ACCESO DESCONOCIDO',price:76,img:'key.jpg',alt:'Llave antigua de hierro forjado con el paletón calado, en diagonal sobre fondo azul noche.',intro:'Ninguna cerradura la acepta. Sin embargo, algunas puertas aparecen abiertas.',origin:'Hotel desmantelado · Praga · 1936',story:'Hallada en el bolsillo de un conserje que nunca figuró en las nóminas. La etiqueta dice «0», aunque el hotel empezaba en la planta primera.',warning:'No dejarla junto a la cama.',secret:'El número grabado solo aparece cuando la llave está fría.'},
{id:'003',name:'El cuaderno de las 03:17',kind:'documento',tag:'MANUSCRITO INTERVENIDO',price:142,img:'journal.jpg',alt:'Cuaderno manuscrito cerrado, con tapas de cartón jaspeado y lomo de piel gastado.',intro:'Su última anotación describe una visita que aún no ha ocurrido.',origin:'Archivo privado · Lyon · 1924',story:'Las páginas están numeradas a mano. Entre la 41 y la 42 hay una hoja que no se puede arrancar y cuya tinta parece reciente.',warning:'No leer la última página en voz alta.',secret:'La página 42 contiene una fecha: la de hoy.'},
{id:'004',name:'El reloj que perdió una hora',kind:'instrumento',tag:'MEDICIÓN IMPOSIBLE',price:215,img:'clock.jpg',alt:'Reloj de sobremesa del siglo XVII en ébano, con esfera dorada y números romanos plateados.',intro:'Se detuvo hace noventa años. Cada madrugada se escucha una campanada.',origin:'Estación cerrada · Escocia · 1902',story:'Perteneció a un jefe de estación. El último tren de aquella línea llegó a destino una hora antes de partir.',warning:'No intentar ponerlo en hora.',secret:'Las agujas avanzan cuando nadie lo observa.'},
{id:'005',name:'La fotografía del noveno',kind:'documento',tag:'PRUEBA FOTOGRÁFICA',price:93,img:'photo.jpg',alt:'Retrato de grupo del siglo XIX en tonos sepia: una familia posa junto a una columna decorada.',intro:'Ocho personas posaron para la cámara. Nueve sombras quedaron impresas.',origin:'Colección anónima · 1898',story:'La placa de vidrio original se perdió. En todas las copias aparece una silueta junto a la ventana que no estaba presente durante la sesión.',warning:'Evitar ampliaciones del margen derecho.',secret:'La figura de la ventana parece estar mirando al fotógrafo.'},
{id:'006',name:'La caja de la última señal',kind:'instrumento',tag:'EMISIÓN SIN ORIGEN',price:268,img:'radio.jpg',alt:'Radio de válvulas de madera con la rejilla del altavoz calada y dos mandos, en penumbra.',intro:'Una radio sin batería que a veces emite nombres propios.',origin:'Laboratorio clausurado · Berlín · 1947',story:'Sus componentes fueron retirados antes de llegar al Gabinete. Aun así, en 1963 se registró una emisión de once segundos.',warning:'Si escucha su nombre, no responda.',secret:'La grabación termina con el sonido de una puerta cerrándose.'}];
const ico={arrow:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M6 4.5h5.5V10"/></svg>',check:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg>',plus:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg>',close:'<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>',warn:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2.5l6 11H2zM8 6.5v3.5M8 11.6v.4"/></svg>'};
const $=s=>document.querySelector(s);
const gallery=$('#gallery'),filter=$('#filter'),dossier=$('#dossier'),body=$('#dossierBody'),basketDialog=$('#basketDialog'),basketList=$('#basketList'),clearBtn=$('#clearBasket');
const byId=id=>items.find(x=>x.id===id);
let basket=[];
try{basket=JSON.parse(localStorage.getItem('gabineteCustodia')||'[]');if(!Array.isArray(basket))basket=[]}catch{basket=[]}
basket=basket.filter((id,i)=>byId(id)&&basket.indexOf(id)===i);
let toastTimer,openedFrom=null,confirmTimer;
// Con una ventana abierta, el aviso se mueve dentro de ella para verse y anunciarse (el resto de la página queda inerte)
function notify(msg){const el=$('#toast'),host=document.querySelector('dialog[open]')||document.body;if(el.parentElement!==host)host.append(el);el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3600)}
function save(){try{localStorage.setItem('gabineteCustodia',JSON.stringify(basket))}catch{}$('#count').textContent=String(basket.length).padStart(2,'0')}
function addLabel(x,long){const held=basket.includes(x.id);return held?`BAJO CUSTODIA ${ico.check}`:`${long?'AÑADIR A CUSTODIA':'CUSTODIAR'} ${ico.plus}`}
function addAria(x){return basket.includes(x.id)?`${x.name}: ya está bajo custodia`:`Custodiar ${x.name}`}
// Actualiza los botones existentes sin redibujar el catálogo, para no perder el foco
function syncAddButtons(){document.querySelectorAll('[data-add]').forEach(b=>{const x=byId(b.dataset.add);b.innerHTML=addLabel(x,b.closest('#dossierBody'));b.setAttribute('aria-pressed',basket.includes(x.id));b.setAttribute('aria-label',addAria(x))})}
function render(){const list=items.filter(x=>filter.value==='all'||x.kind===filter.value);
gallery.innerHTML=list.map(x=>`<article class="card" aria-labelledby="t${x.id}"><div class="cardVisual"><img src="assets/${x.img}" alt="${x.alt}" loading="lazy" width="900" height="1100"><span class="cardIndex">REG. / ${x.id}</span><span class="cardTag">${x.tag}</span></div><div class="cardBody"><h3 id="t${x.id}">${x.name}</h3><p>${x.intro}</p><div class="cardFoot"><span>VALOR ASIGNADO</span><b>${x.price} €</b></div><div class="cardActions"><button class="outline" data-open="${x.id}" aria-haspopup="dialog" aria-label="Ver expediente de ${x.name}">VER EXPEDIENTE ${ico.arrow}</button><button class="add" data-add="${x.id}"></button></div></div></article>`).join('');
$('#resultCount').textContent=list.length===1?'1 PIEZA EN EL CATÁLOGO':`${list.length} PIEZAS EN EL CATÁLOGO`;syncAddButtons()}
function openFile(id,opener){const x=byId(id);openedFrom=opener||null;
body.innerHTML=`<div class="dossierGrid"><div class="dossierPhoto"><img src="assets/${x.img}" alt="${x.alt}"></div><div class="dialogInner"><span class="kicker">EXPEDIENTE CLASIFICADO / ${x.id}</span><h2 id="dossierTitle">${x.name}</h2><p><b>PROCEDENCIA:</b> ${x.origin}</p><p>${x.story}</p><p class="warning">${ico.warn}<span>ADVERTENCIA: ${x.warning}</span></p><div class="dossierActions"><button class="outline secretBtn" aria-expanded="false" aria-controls="secretText">DESPRECINTAR NOTA RESERVADA ${ico.arrow}</button><button class="add" data-add="${x.id}"></button></div><p class="secretText" id="secretText" aria-live="polite"></p></div></div>`;
syncAddButtons();body.scrollTop=0;dossier.showModal();
body.querySelector('.secretBtn').addEventListener('click',e=>{const b=e.currentTarget;if(b.getAttribute('aria-expanded')==='true')return;$('#secretText').textContent=x.secret;b.setAttribute('aria-expanded','true');b.innerHTML=`NOTA DESPRECINTADA ${ico.check}`})}
function add(id){const x=byId(id);if(basket.includes(id)){notify('Esta pieza ya está bajo custodia.');return}basket.push(id);save();syncAddButtons();notify(`Pieza registrada: «${x.name}». Su custodia queda bajo su responsabilidad.`)}
gallery.addEventListener('click',e=>{const open=e.target.closest('[data-open]'),addBtn=e.target.closest('[data-add]');if(open)openFile(open.dataset.open,open);if(addBtn)add(addBtn.dataset.add)});
body.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)add(b.dataset.add)});
// Si falta una imagen, se oculta y queda el fondo de respaldo
[gallery,body].forEach(el=>el.addEventListener('error',e=>{if(e.target.tagName==='IMG'){e.target.parentElement.classList.add('noimg')}},true));
filter.addEventListener('change',render);
$('#closeDossier').addEventListener('click',()=>dossier.close());
$('#closeBasket').addEventListener('click',()=>basketDialog.close());
dossier.addEventListener('close',()=>{const id=openedFrom&&openedFrom.dataset.open,b=id&&gallery.querySelector(`[data-open="${id}"]`);if(b)b.focus();openedFrom=null});
function resetClear(){clearTimeout(confirmTimer);clearBtn.classList.remove('confirm');clearBtn.textContent='LIBERAR TODAS LAS PIEZAS'}
function renderBasket(){resetClear();
basketList.innerHTML=basket.length?basket.map(id=>{const x=byId(id);return `<div class="basketItem"><span>${x.name}</span><span>${x.price} € <button data-remove="${id}" aria-label="Retirar ${x.name}">${ico.close}</button></span></div>`}).join(''):'<p class="empty">El gabinete está vacío. De momento.</p>';
$('#total').textContent='TOTAL FICTICIO · '+basket.reduce((s,id)=>s+byId(id).price,0)+' €';clearBtn.hidden=!basket.length}
$('#basketBtn').addEventListener('click',()=>{renderBasket();basketDialog.showModal()});
basketDialog.addEventListener('close',resetClear);
basketList.addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;
const ids=[...basketList.querySelectorAll('[data-remove]')].map(x=>x.dataset.remove),i=ids.indexOf(b.dataset.remove),x=byId(b.dataset.remove);
basket=basket.filter(id=>id!==b.dataset.remove);save();syncAddButtons();renderBasket();notify(`Pieza liberada: «${x.name}».`);
const next=basketList.querySelectorAll('[data-remove]');(next[Math.min(i,next.length-1)]||$('#basketTitle')).focus()});
// Liberar todo pide una segunda pulsación
clearBtn.addEventListener('click',()=>{if(!clearBtn.classList.contains('confirm')){clearBtn.classList.add('confirm');clearBtn.textContent='¿SEGURO? PULSE DE NUEVO PARA LIBERAR';notify('Pulse otra vez para liberar todas las piezas.');confirmTimer=setTimeout(resetClear,5000);return}
basket=[];save();syncAddButtons();renderBasket();$('#basketTitle').focus();notify('Las piezas han sido liberadas.')});
$('#reveal').addEventListener('click',e=>{const b=e.currentTarget;if(b.getAttribute('aria-expanded')==='true')return;$('#hiddenNote').textContent='ANEXO 04-B: La anotación fue escrita tres días después de la desaparición de su autor.';b.setAttribute('aria-expanded','true');b.innerHTML=`ANOTACIÓN DESCIFRADA ${ico.check}`});
[dossier,basketDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
// Cabecera opaca al descender
const header=$('.top');const onScroll=()=>header.classList.toggle('scrolled',scrollY>40);addEventListener('scroll',onScroll,{passive:true});onScroll();
const now=new Date(),pad=n=>String(n).padStart(2,'0');$('#accessDate').textContent=`${pad(now.getDate())} / ${pad(now.getMonth()+1)} / ${now.getFullYear()}`;
save();render();
