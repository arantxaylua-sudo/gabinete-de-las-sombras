const items=[
{id:'001',name:'El espejo de las ausencias',kind:'objeto',tag:'REFLEJO NO VERIFICADO',price:189,img:'mirror.jpg',alt:'Espejo de marco rococó en madera dorada, con la luna empañada, sobre fondo oscuro.',intro:'En la fotografía original aparecía una persona que nadie recordaba haber invitado.',origin:'Casa Varela · Asturias · 1911',story:'Recuperado de una habitación sellada desde 1911. En el inventario de la casa constan siete habitantes; en los retratos familiares aparecen ocho.',warning:'No situarlo frente a una puerta abierta.',secret:'En el reverso del marco hay ocho nombres. El último sigue cambiando.'},
{id:'002',name:'La llave de la habitación cero',kind:'objeto',tag:'ACCESO DESCONOCIDO',price:76,img:'key.jpg',alt:'Llave antigua de hierro forjado con el paletón calado, en diagonal sobre fondo azul noche.',intro:'Ninguna cerradura la acepta. Sin embargo, algunas puertas aparecen abiertas.',origin:'Hotel desmantelado · Praga · 1936',story:'Hallada en el bolsillo de un conserje que nunca figuró en las nóminas. La etiqueta dice «0», aunque el hotel empezaba en la planta primera.',warning:'No dejarla junto a la cama.',secret:'El número grabado solo aparece cuando la llave está fría.'},
{id:'003',name:'El cuaderno de las 03:17',kind:'documento',tag:'MANUSCRITO INTERVENIDO',price:142,img:'journal.jpg',alt:'Cuaderno manuscrito cerrado, con tapas de cartón jaspeado y lomo de piel gastado.',intro:'Su última anotación describe una visita que aún no ha ocurrido.',origin:'Archivo privado · Lyon · 1924',story:'Las páginas están numeradas a mano. Entre la 41 y la 42 hay una hoja que no se puede arrancar y cuya tinta parece reciente.',warning:'No leer la última página en voz alta.',secret:'La página 42 contiene una fecha: la de hoy.'},
{id:'004',name:'El reloj que perdió una hora',kind:'instrumento',tag:'MEDICIÓN IMPOSIBLE',price:215,img:'clock.jpg',alt:'Reloj de sobremesa del siglo XVII en ébano, con esfera dorada y números romanos plateados.',intro:'Se detuvo hace noventa años. Cada madrugada se escucha una campanada.',origin:'Estación cerrada · Escocia · 1902',story:'Perteneció a un jefe de estación. El último tren de aquella línea llegó a destino una hora antes de partir.',warning:'No intentar ponerlo en hora.',secret:'Las agujas avanzan cuando nadie lo observa.'},
{id:'005',name:'La fotografía del noveno',kind:'documento',tag:'PRUEBA FOTOGRÁFICA',price:93,img:'photo.jpg',alt:'Retrato de grupo del siglo XIX en tonos sepia: una familia posa junto a una columna decorada.',intro:'Ocho personas posaron para la cámara. Nueve sombras quedaron impresas.',origin:'Colección anónima · 1898',story:'La placa de vidrio original se perdió. En todas las copias aparece una silueta junto a la ventana que no estaba presente durante la sesión.',warning:'Evitar ampliaciones del margen derecho.',secret:'La figura de la ventana parece estar mirando al fotógrafo.'},
{id:'006',name:'La caja de la última señal',kind:'instrumento',tag:'EMISIÓN SIN ORIGEN',price:268,img:'radio.jpg',alt:'Radio de válvulas de madera con la rejilla del altavoz calada y dos mandos, en penumbra.',intro:'Una radio sin batería que a veces emite nombres propios.',origin:'Laboratorio clausurado · Berlín · 1947',story:'Sus componentes fueron retirados antes de llegar al Gabinete. Aun así, en 1963 se registró una emisión de once segundos.',warning:'Si escucha su nombre, no responda.',secret:'La grabación termina con el sonido de una puerta cerrándose.'}];
items.forEach(x=>{x.year=+x.origin.match(/\d{4}/)[0];x.place=x.origin.replace(/\s*·\s*\d{4}$/,'')});
const ico={arrow:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M6 4.5h5.5V10"/></svg>',check:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg>',plus:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg>',close:'<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>',eye:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>',warn:'<svg class="ico" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2.5l6 11H2zM8 6.5v3.5M8 11.6v.4"/></svg>'};
const $=s=>document.querySelector(s);
// Escapa texto antes de interpolarlo en plantillas HTML: si los datos llegan algún día de fuera, no podrán inyectar código
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const gallery=$('#gallery'),filter=$('#filter'),search=$('#search'),sortSel=$('#sort'),dossier=$('#dossier'),body=$('#dossierBody'),basketDialog=$('#basketDialog'),basketList=$('#basketList'),clearBtn=$('#clearBasket');
const byId=id=>items.find(x=>x.id===id),pad=n=>String(n).padStart(2,'0');
let basket=[];
try{basket=JSON.parse(localStorage.getItem('gabineteCustodia')||'[]');if(!Array.isArray(basket))basket=[]}catch{basket=[]}
basket=basket.filter((id,i)=>byId(id)&&basket.indexOf(id)===i);
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
let investigated=load('gabineteInvestigados').filter((id,i,a)=>byId(id)&&a.indexOf(id)===i);
let toastTimer,openedFrom=null,confirmTimer;
// Con una ventana abierta, el aviso se mueve dentro de ella para verse y anunciarse (el resto de la página queda inerte)
function notify(msg){const el=$('#toast'),host=document.querySelector('dialog[open]')||document.body;if(el.parentElement!==host)host.append(el);el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3600)}
function save(){try{localStorage.setItem('gabineteCustodia',JSON.stringify(basket));localStorage.setItem('gabineteInvestigados',JSON.stringify(investigated))}catch{}$('#count').textContent=String(basket.length).padStart(2,'0')}
function addLabel(x,long){const held=basket.includes(x.id);return held?`BAJO CUSTODIA ${ico.check}`:`${long?'AÑADIR A CUSTODIA':'CUSTODIAR'} ${ico.plus}`}
function addAria(x){return basket.includes(x.id)?`${x.name}: ya está bajo custodia`:`Custodiar ${x.name}`}
// Actualiza los botones existentes sin redibujar el catálogo, para no perder el foco
function syncAddButtons(){document.querySelectorAll('[data-add]').forEach(b=>{const x=byId(b.dataset.add);b.innerHTML=addLabel(x,b.closest('#dossierBody'));b.setAttribute('aria-pressed',basket.includes(x.id));b.setAttribute('aria-label',addAria(x))})}
// Búsqueda sin distinguir mayúsculas ni tildes, sobre nombre, época y procedencia
const norm=t=>String(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const sorters={reg:(a,b)=>a.id.localeCompare(b.id),old:(a,b)=>a.year-b.year,new:(a,b)=>b.year-a.year,low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price};
function render(){const q=norm(search.value.trim());
const list=items.filter(x=>(filter.value==='all'||x.kind===filter.value)&&(!q||q.split(/\s+/).every(w=>norm([x.name,x.origin,x.year,x.tag].join(' ')).includes(w)))).sort(sorters[sortSel.value]||sorters.reg);
gallery.innerHTML=list.map(x=>`<article class="card" aria-labelledby="t${esc(x.id)}"><div class="cardVisual"><img src="assets/${esc(x.img)}" alt="${esc(x.alt)}" loading="lazy" width="900" height="1100"><span class="cardIndex">REG. / ${esc(x.id)}</span><span class="cardSeen" data-seen="${esc(x.id)}">${ico.eye} INVESTIGADO</span><span class="cardTag">${esc(x.tag)}</span></div><div class="cardBody"><h3 id="t${esc(x.id)}">${esc(x.name)}</h3><p class="cardMeta"><span>${esc(x.year)}</span>${esc(x.place)}</p><p>${esc(x.intro)}</p><div class="cardFoot"><span>VALOR ASIGNADO</span><b>${esc(x.price)} €</b></div><div class="cardActions"><button class="outline" data-open="${esc(x.id)}" aria-haspopup="dialog" aria-label="Ver expediente de ${esc(x.name)}">VER EXPEDIENTE ${ico.arrow}</button><button class="add" data-add="${esc(x.id)}"></button></div></div></article>`).join('');
$('#noResults').hidden=list.length>0;
$('#resultCount').textContent=list.length===items.length?`${list.length} PIEZAS EN EL CATÁLOGO`:list.length===1?'1 PIEZA ENCONTRADA':list.length?`${list.length} PIEZAS ENCONTRADAS`:'NINGUNA PIEZA ENCONTRADA';syncAddButtons();renderRegistry()}
// Registro de expedientes investigados
function renderRegistry(){const n=investigated.length;$('#invCount').textContent=`${n} / ${items.length}`;$('#invMeter').style.width=(n/items.length*100)+'%';
$('#invList').innerHTML=n?investigated.map(id=>{const x=byId(id);return `<li><button class="linkButton" data-reopen="${esc(id)}">REG. ${esc(id)} · ${esc(x.name)}</button></li>`}).join(''):'<li class="empty">Todavía no ha consultado ningún expediente.</li>';
$('#invReset').hidden=!n;document.querySelectorAll('[data-seen]').forEach(b=>b.hidden=!investigated.includes(b.dataset.seen))}
function markInvestigated(id){if(investigated.includes(id))return;investigated.push(id);save();renderRegistry();if(investigated.length===items.length)setTimeout(()=>notify('Ha investigado todos los expedientes. El Gabinete toma nota.'),400)}
function openFile(id,opener){const x=byId(id);openedFrom=opener||null;
body.innerHTML=`<div class="dossierGrid"><div class="dossierPhoto"><img src="assets/${esc(x.img)}" alt="${esc(x.alt)}"></div><div class="dialogInner"><span class="kicker">EXPEDIENTE CLASIFICADO / ${esc(x.id)}</span><h2 id="dossierTitle">${esc(x.name)}</h2><p><b>PROCEDENCIA:</b> ${esc(x.origin)}</p><p>${esc(x.story)}</p><p class="warning">${ico.warn}<span>ADVERTENCIA: ${esc(x.warning)}</span></p><div class="dossierActions"><button class="outline secretBtn" aria-expanded="false" aria-controls="secretText">DESPRECINTAR NOTA RESERVADA ${ico.arrow}</button><button class="add" data-add="${esc(x.id)}"></button></div><p class="secretText" id="secretText" aria-live="polite"></p></div></div>`;
syncAddButtons();body.scrollTop=0;dossier.showModal();markInvestigated(id);
body.querySelector('.secretBtn').addEventListener('click',e=>{const b=e.currentTarget;if(b.getAttribute('aria-expanded')==='true')return;$('#secretText').textContent=x.secret;b.setAttribute('aria-expanded','true');b.innerHTML=`NOTA DESPRECINTADA ${ico.check}`})}
function add(id){const x=byId(id);if(basket.includes(id)){notify('Esta pieza ya está bajo custodia.');return}basket.push(id);save();syncAddButtons();notify(`Pieza registrada: «${x.name}». Su custodia queda bajo su responsabilidad.`)}
gallery.addEventListener('click',e=>{const open=e.target.closest('[data-open]'),addBtn=e.target.closest('[data-add]');if(open)openFile(open.dataset.open,open);if(addBtn)add(addBtn.dataset.add)});
body.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)add(b.dataset.add)});
// Si falta una imagen, se oculta y queda el fondo de respaldo
[gallery,body].forEach(el=>el.addEventListener('error',e=>{if(e.target.tagName==='IMG'){e.target.parentElement.classList.add('noimg')}},true));
filter.addEventListener('change',render);sortSel.addEventListener('change',render);
let searchTimer;search.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(render,150)});
$('#clearSearch').addEventListener('click',()=>{search.value='';filter.value='all';render();search.focus()});
$('#invList').addEventListener('click',e=>{const b=e.target.closest('[data-reopen]');if(b)openFile(b.dataset.reopen,b)});
$('#invReset').addEventListener('click',()=>{investigated=[];save();renderRegistry();$('#registry summary').focus();notify('El registro de expedientes ha sido borrado.')});
$('#closeDossier').addEventListener('click',()=>dossier.close());
$('#closeBasket').addEventListener('click',()=>basketDialog.close());
dossier.addEventListener('close',()=>{if(openedFrom&&openedFrom.isConnected)openedFrom.focus();openedFrom=null});
function resetClear(){clearTimeout(confirmTimer);clearBtn.classList.remove('confirm');clearBtn.textContent='LIBERAR TODAS LAS PIEZAS'}
function renderBasket(){resetClear();
basketList.innerHTML=basket.length?basket.map(id=>{const x=byId(id);return `<div class="basketItem"><span>${esc(x.name)}</span><span>${esc(x.price)} € <button data-remove="${esc(id)}" aria-label="Retirar ${esc(x.name)}">${ico.close}</button></span></div>`}).join(''):'<p class="empty">El gabinete está vacío. De momento.</p>';
$('#total').textContent='TOTAL FICTICIO · '+basket.reduce((s,id)=>s+byId(id).price,0)+' €';clearBtn.hidden=!basket.length;$('#printActa').hidden=!basket.length}
$('#basketBtn').addEventListener('click',()=>{renderBasket();basketDialog.showModal()});
basketDialog.addEventListener('close',resetClear);
basketList.addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;
const ids=[...basketList.querySelectorAll('[data-remove]')].map(x=>x.dataset.remove),i=ids.indexOf(b.dataset.remove),x=byId(b.dataset.remove);
basket=basket.filter(id=>id!==b.dataset.remove);save();syncAddButtons();renderBasket();notify(`Pieza liberada: «${x.name}».`);
const next=basketList.querySelectorAll('[data-remove]');(next[Math.min(i,next.length-1)]||$('#basketTitle')).focus()});
// Liberar todo pide una segunda pulsación
clearBtn.addEventListener('click',()=>{if(!clearBtn.classList.contains('confirm')){clearBtn.classList.add('confirm');clearBtn.textContent='¿SEGURO? PULSE DE NUEVO PARA LIBERAR';notify('Pulse otra vez para liberar todas las piezas.');confirmTimer=setTimeout(resetClear,5000);return}
basket=[];save();syncAddButtons();renderBasket();$('#basketTitle').focus();notify('Las piezas han sido liberadas.')});
// Acta de custodia: se compone en una sección oculta que solo se muestra al imprimir
function printActa(){if(!basket.length)return;const d=new Date(),num='GS-'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'-'+pad(d.getHours())+pad(d.getMinutes()),list=basket.map(byId),total=list.reduce((t,x)=>t+x.price,0);
const fecha=d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}),hora=d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
$('#acta').innerHTML=`<header class="actaHead"><div class="actaBrand"><span aria-hidden="true">✳</span> EL GABINETE <small>DE LAS SOMBRAS</small></div><div class="actaNum">ACTA Nº ${num}</div></header><h1>Acta de <i>custodia.</i></h1><p class="actaLead">En la fecha de ${fecha}, a las ${hora}, el visitante abajo firmante declara recibir bajo su custodia las piezas que se relacionan, con pleno conocimiento de sus advertencias.</p><table><thead><tr><th>Reg.</th><th>Pieza</th><th>Procedencia</th><th>Advertencia</th><th class="num">Valor</th></tr></thead><tbody>${list.map(x=>`<tr><td>${esc(x.id)}</td><td>${esc(x.name)}</td><td>${esc(x.origin)}</td><td>${esc(x.warning)}</td><td class="num">${esc(x.price)} €</td></tr>`).join('')}</tbody><tfoot><tr><td colspan="4">TOTAL FICTICIO · ${list.length} ${list.length===1?'PIEZA':'PIEZAS'}</td><td class="num">${total} €</td></tr></tfoot></table><p class="actaClause">El Gabinete no certifica la procedencia de los objetos ni se responsabiliza de lo que ocurra una vez abandonen el archivo. Si una pieza regresa por sí sola a su vitrina, se considerará devuelta.</p><div class="actaSign"><div>Firma del custodio</div><div>Sello del Gabinete</div></div><p class="actaFoot">Documento ficticio sin validez legal · Proyecto experimental · Registro ${num}</p>`;
window.print()}
$('#printActa').addEventListener('click',printActa);
$('#reveal').addEventListener('click',e=>{const b=e.currentTarget;if(b.getAttribute('aria-expanded')==='true')return;$('#hiddenNote').textContent='ANEXO 04-B: La anotación fue escrita tres días después de la desaparición de su autor.';b.setAttribute('aria-expanded','true');b.innerHTML=`ANOTACIÓN DESCIFRADA ${ico.check}`});
[dossier,basketDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
// Cabecera opaca al descender
const header=$('.top');const onScroll=()=>header.classList.toggle('scrolled',scrollY>40);addEventListener('scroll',onScroll,{passive:true});onScroll();
const now=new Date();$('#accessDate').textContent=`${pad(now.getDate())} / ${pad(now.getMonth()+1)} / ${now.getFullYear()}`;
save();render();
