// Basic interactions. All visible text is editable in index.html.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if(menuButton && nav){
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  }));
}
const year = document.getElementById('year');
if(year) year.textContent = String(new Date().getFullYear());

// Close mobile navigation when focus leaves via Escape.
document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape' && nav && menuButton && nav.classList.contains('is-open')){
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Открыть меню');
    menuButton.focus();
  }
});

// Client-side, offline-friendly brief helper. Does not transmit data.
const briefButton=document.getElementById('copy-brief');
if(briefButton){
 briefButton.addEventListener('click',async()=>{
  const service=document.getElementById('brief-service')?.value||'';
  const task=document.getElementById('brief-task')?.value.trim()||'Задачу и материалы уточню при обсуждении.';
  const message=`Здравствуйте! Интересует услуга ELFormat: ${service}.\nЗадача: ${task}\nПодскажите, пожалуйста, какие материалы нужны для оценки сроков и стоимости.`;
  const status=document.getElementById('copy-status');
  try{
   if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(message);}
   else {const field=document.createElement('textarea');field.value=message;field.style.position='fixed';field.style.left='-9999px';document.body.appendChild(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw Error('Clipboard not supported');}
   if(status)status.textContent='Описание скопировано. Отправьте его удобным вам способом.';
  }catch(e){if(status)status.textContent='Копирование недоступно: выделите текст задачи и скопируйте вручную.';}
 });
}

// ELFormat 1.11: accessible, local-file-compatible image preview.
(() => {
 const box=document.getElementById('portfolio-lightbox');
 const img=document.getElementById('lightbox-image');
 const title=document.getElementById('lightbox-title');
 const close=document.getElementById('lightbox-close');
 const original=document.getElementById('lightbox-original');
 const fileLink=document.getElementById('lightbox-file');
 if(!box||!img||!close||!title||!original||!fileLink)return;
 let previous=null;
 const prev=document.getElementById("slide-prev"),next=document.getElementById("slide-next"),counter=document.getElementById("slide-count");
 let slideIndex=-1;const slideFiles=Array.from({length:7},(_,i)=>`pharma_slide_${String(i+1).padStart(2,"0")}.webp`);
 function renderSlide(){if(slideIndex<0)return;const src=slideFiles[slideIndex];img.src=src;original.href=src;
     const downloadable=fileByPreview[src];if(downloadable){fileLink.href=downloadable[0];fileLink.download=downloadable[0];fileLink.dataset.downloadFile=downloadable[0];fileLink.textContent=downloadable[1];fileLink.hidden=false;}else{fileLink.hidden=true;fileLink.removeAttribute('href');delete fileLink.dataset.downloadFile;}title.textContent=`B2B Pharma · слайд ${slideIndex+1} из 7`;if(counter)counter.textContent=`${slideIndex+1} / 7 · `;}
 function moveSlide(delta){slideIndex=(slideIndex+delta+slideFiles.length)%slideFiles.length;renderSlide();}
 const fileByPreview={'excel_preview.png':['ELFormat_demo_sales_report.xlsx','⬇ Скачать Excel · XLSX'],'word_preview.jpg':['ELFormat_demo_business_proposal.docx','⬇ Скачать Word · DOCX']};
 const dismiss=()=>{
   if(box.hidden)return;
   box.hidden=true;
   img.removeAttribute('src');fileLink.hidden=true;fileLink.removeAttribute('href');delete fileLink.dataset.downloadFile;
   slideIndex=-1;if(counter)counter.textContent="";if(prev)prev.hidden=true;if(next)next.hidden=true;
   document.body.style.overflow='';
   if(previous&&previous.isConnected)previous.focus();
 };
 document.querySelectorAll('[data-lightbox]').forEach(link=>{
   link.addEventListener('click',event=>{
     event.preventDefault();previous=link;
     const src=link.getAttribute('data-lightbox');
     img.src=src;original.href=src;
     const downloadable=fileByPreview[src];if(downloadable){fileLink.href=downloadable[0];fileLink.download=downloadable[0];fileLink.dataset.downloadFile=downloadable[0];fileLink.textContent=downloadable[1];fileLink.hidden=false;}else{fileLink.hidden=true;fileLink.removeAttribute('href');delete fileLink.dataset.downloadFile;}
     title.textContent=link.getAttribute('data-lightbox-title')||'Просмотр работы';
     slideIndex=slideFiles.indexOf(src);if(prev)prev.hidden=slideIndex<0;if(next)next.hidden=slideIndex<0;if(slideIndex>=0)renderSlide();else if(counter)counter.textContent="";
     box.hidden=false;document.body.style.overflow='hidden';close.focus();
   });
 });
 close.addEventListener('click',dismiss);
 if(prev)prev.addEventListener("click",()=>moveSlide(-1));
 if(next)next.addEventListener("click",()=>moveSlide(1));
 box.addEventListener('click',event=>{if(event.target===box)dismiss()});
 document.addEventListener('keydown',event=>{
   if(box.hidden)return;
   if(event.key==='Escape')dismiss();
   if(slideIndex>=0&&event.key==='ArrowLeft')moveSlide(-1);
   if(slideIndex>=0&&event.key==='ArrowRight')moveSlide(1);
   if(event.key==='Tab'){
      const focusables=[original,...(fileLink.hidden?[]:[fileLink]),close,...(slideIndex>=0?[prev,next]:[])].filter(Boolean);
      const index=focusables.indexOf(document.activeElement);
      if(event.shiftKey&&index===0){event.preventDefault();focusables[focusables.length-1].focus()}
      else if(!event.shiftKey&&index===focusables.length-1){event.preventDefault();focusables[0].focus()}
   }
 });
})();

// ELFormat is served via HTTPS. Download links use native browser behavior.
// The Office source files are also available directly from GitHub as a fallback.
