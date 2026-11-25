import { checklists, isCoverageKey, type CoverageKey } from '../data/coverage';
import { checklistItemId, createEmailDraft, nextTabIndex, readinessSummary } from '../lib/planner';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-coverage]')];
const panels = [...document.querySelectorAll<HTMLElement>('[data-panel]')];
let selectedCoverage: CoverageKey = 'auto';

function animateCoverage(panel: HTMLElement, direction = 1) {
  panel.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
  if (reducedMotion.matches || !Element.prototype.animate) return;
  const intro = [...panel.querySelectorAll<HTMLElement>('.coverage-intro > *')];
  const details = [...panel.querySelectorAll<HTMLElement>('.detail-label, .coverage-points > div, .coverage-fine')];
  [...intro,...details].forEach((element,index)=>{
    const localIndex = index < intro.length ? index : index-intro.length;
    element.animate([
      {opacity:0, transform:`translate(${direction*20}px, 10px)`},
      {opacity:1, transform:'translate(0,0)'}
    ],{duration:520,delay:localIndex*55,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
  });
}
function selectCoverage(key: CoverageKey) {
  if (key === selectedCoverage) return;
  const direction = tabs.findIndex(tab=>tab.dataset.coverage===key) > tabs.findIndex(tab=>tab.dataset.coverage===selectedCoverage) ? 1 : -1;
  selectedCoverage=key;
  tabs.forEach(tab=>{
    const selected=tab.dataset.coverage===key;
    tab.setAttribute('aria-selected',String(selected));
    tab.tabIndex=selected?0:-1;
  });
  panels.forEach(panel=>{
    panel.hidden=panel.dataset.panel!==key;
    if (!panel.hidden) {panel.classList.add('visible');animateCoverage(panel,direction);}
  });
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>{const key=tab.dataset.coverage;if(key&&isCoverageKey(key))selectCoverage(key);});
  tab.addEventListener('keydown',event=>{
    const next=nextTabIndex(event.key,index,tabs.length);
    if(next===null)return;
    event.preventDefault();
    const target=tabs[next];
    const key=target?.dataset.coverage;
    if(target&&key&&isCoverageKey(key)){target.focus();selectCoverage(key);}
  });
});

const menu=document.querySelector<HTMLButtonElement>('.menu-button');
const nav=document.querySelector<HTMLElement>('#nav');
function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open menu');}
menu?.addEventListener('click',()=>{const open=nav?.classList.toggle('open')??false;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key!=='Escape'||!nav?.classList.contains('open'))return;closeMenu();menu?.focus();});
window.matchMedia('(min-width: 801px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const planner=document.querySelector<HTMLDialogElement>('#planner');
const choices=[...document.querySelectorAll<HTMLInputElement>('#planner .planner-options input[type="checkbox"]')];
const checklist=document.querySelector<HTMLElement>('#checklist');
const progress=document.querySelector<HTMLElement>('#planner-progress');
const emailLink=document.querySelector<HTMLAnchorElement>('#planner-email');
const plannerEmail=planner?.dataset.email??'';
let plannerTrigger:HTMLElement|null=null;
// Ticked items are remembered only while the page is open; nothing is stored or sent.
const ticked=new Set<string>();
function selectedKeys(){return choices.filter(choice=>choice.checked).map(choice=>choice.value).filter(isCoverageKey);}
function updateEmailDraft(){if(emailLink&&plannerEmail)emailLink.href=createEmailDraft(selectedKeys(),plannerEmail,ticked);}
function updateProgress(){
  updateEmailDraft();
  if(!checklist||!progress)return;
  const items=[...checklist.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
  progress.textContent=readinessSummary(items.filter(item=>item.checked).length,items.length);
}
function updateChecklist(){
  if(!checklist)return;
  const keys=selectedKeys();
  const fragment=document.createDocumentFragment();
  if(!keys.length){const empty=document.createElement('p');empty.className='checklist-empty';empty.textContent='Choose a category to see what to have ready.';fragment.append(empty);}
  for(const key of keys){
    const section=document.createElement('section');
    const title=document.createElement('h3');title.textContent=checklists[key].title;
    const list=document.createElement('ul');
    checklists[key].items.forEach((item,index)=>{
      const id=checklistItemId(key,index);
      const li=document.createElement('li');
      const label=document.createElement('label');
      const box=document.createElement('input');box.type='checkbox';box.checked=ticked.has(id);
      box.addEventListener('change',()=>{if(box.checked)ticked.add(id);else ticked.delete(id);updateProgress();});
      label.append(box,document.createTextNode(' '+item));li.append(label);list.append(li);
    });
    section.append(title,list);fragment.append(section);
  }
  checklist.replaceChildren(fragment);
  updateProgress();
}
document.querySelectorAll<HTMLButtonElement>('[data-open-planner]').forEach(button=>button.addEventListener('click',()=>{
  if(!planner)return;
  const key=button.dataset.openPlanner;
  if(key&&isCoverageKey(key))choices.forEach(choice=>choice.checked=choice.value===key);
  updateChecklist();
  plannerTrigger=button;
  planner.showModal();
  document.body.classList.add('dialog-open');
}));
planner?.querySelector('.close-dialog')?.addEventListener('click',()=>planner.close());
planner?.addEventListener('close',()=>{document.body.classList.remove('dialog-open');plannerTrigger?.focus();});
planner?.addEventListener('click',event=>{
  if(event.target!==planner)return;
  const rect=planner.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)planner.close();
});
choices.forEach(choice=>choice.addEventListener('change',updateChecklist));

if('IntersectionObserver' in window&&!reducedMotion.matches){
  document.body.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('visible','coverage-arrived');
    if(entry.target instanceof HTMLElement&&entry.target.dataset.panel)animateCoverage(entry.target);
    observer.unobserve(entry.target);
  }),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
}
reducedMotion.addEventListener('change',event=>{
  if(event.matches){document.body.classList.remove('motion-ready');document.querySelectorAll<HTMLElement>('.coverage-panel').forEach(panel=>panel.getAnimations({subtree:true}).forEach(animation=>animation.cancel()));}
});
document.querySelectorAll<HTMLElement>('.person,.coverage-panel').forEach(surface=>{
  let frame=0;
  surface.addEventListener('pointermove',event=>{
    if(!finePointer.matches||reducedMotion.matches||frame)return;
    const {clientX,clientY}=event;
    frame=requestAnimationFrame(()=>{const rect=surface.getBoundingClientRect();surface.style.setProperty('--light-x',`${clientX-rect.left}px`);surface.style.setProperty('--light-y',`${clientY-rect.top}px`);frame=0;});
  },{passive:true});
  surface.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);frame=0;surface.style.removeProperty('--light-x');surface.style.removeProperty('--light-y');});
});

// The year is rendered at build time; keep it current between rebuilds.
document.querySelectorAll<HTMLElement>('[data-year]').forEach(element=>{element.textContent=String(new Date().getFullYear());});
