const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'メニューを開く'); menuButton.textContent = '☰'; }
menuButton.addEventListener('click', () => { const expanded = menuButton.getAttribute('aria-expanded') === 'true'; mobileNav.hidden = expanded; menuButton.setAttribute('aria-expanded', String(!expanded)); menuButton.setAttribute('aria-label', expanded ? 'メニューを開く' : 'メニューを閉じる'); menuButton.textContent = expanded ? '☰' : '×'; });
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
const bookingDialog = document.querySelector('#booking-dialog');
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => bookingDialog.showModal()));
bookingDialog.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => bookingDialog.close()));
bookingDialog.addEventListener('click', event => { if (event.target !== bookingDialog) return; const rect = bookingDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) bookingDialog.close(); });


// Keep motion opt-in to system preferences; content remains visible without JavaScript.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.hero');
const heroImages = [...document.querySelectorAll('.hero-img')];
const moods = {
  heat: { image: 'assets/sauna.jpg', description: '木の香りと、やわらかな熱に包まれる。', alt: '間接照明が木のベンチを照らすサウナ空間のイメージ' },
  water: { image: 'assets/water.jpg', description: '水のゆらぎに、心までほどけていく。', alt: '光が揺らぐ青いプールのイメージ' },
  stillness: { image: 'assets/forest.jpg', description: '風と光の間に、ただ身をゆだねる。', alt: '木漏れ日が差し込む静かな森のイメージ' }
};
let imageLayer = 0;
let moodRequest = 0;
document.querySelectorAll('[data-mood]').forEach(button => button.addEventListener('click', () => {
  if (button.classList.contains('active')) return;
  const mood = moods[button.dataset.mood];
  const request = ++moodRequest;
  const preload = new Image();
  preload.onload = () => {
    if (request !== moodRequest) return;
    const nextLayer = 1 - imageLayer;
    heroImages[nextLayer].src = mood.image;
    heroImages[nextLayer].alt = mood.alt;
    heroImages[nextLayer].removeAttribute('aria-hidden');
    heroImages[nextLayer].style.opacity = '1';
    heroImages[imageLayer].style.opacity = '0';
    heroImages[imageLayer].setAttribute('aria-hidden', 'true');
    imageLayer = nextLayer;
    hero.dataset.mood = button.dataset.mood;
    document.querySelector('.steam').style.opacity = button.dataset.mood === 'heat' ? '.5' : '0';
    document.querySelector('.mood-description').textContent = mood.description;
    document.querySelectorAll('[data-mood]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  };
  preload.src = mood.image;
}));
const revealTargets = document.querySelectorAll('.section-label, .concept-main, .experience-copy, .experience-photo, .section-top>h2, .occasion>h2, .occasion-items>div, .plan, .faq, .access-main, .closing>h2');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
}, {threshold: .12});
revealTargets.forEach((element,index) => { element.classList.add('reveal'); element.style.setProperty('--reveal-delay', `${index % 2 * 100}ms`); revealObserver.observe(element); });
document.documentElement.classList.add('motion-ready');
const aura = document.querySelector('.cursor-aura');
const orbit = document.querySelector('.cursor-orbit');
const progress = document.querySelector('.reading-progress');
let pointerX = innerWidth / 2, pointerY = innerHeight / 2;
let orbitX = pointerX, orbitY = pointerY, pointerActive = false;
let frame = 0, scrollDirty = true;
const magneticButtons = [...document.querySelectorAll('.reserve')];
function renderMotion() {
  frame = 0;
  if (scrollDirty) {
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
    if (!reducedMotion.matches) {
      const offset = Math.min(Math.max(0, scrollY - (entrance.offsetHeight - innerHeight)), hero.offsetHeight) * .13;
      heroImages.forEach(image => image.style.transform = `translate3d(0,${offset}px,0) scale(1.08)`);
    }
    renderCinematic();
    scrollDirty = false;
  }
  if (finePointer.matches && !reducedMotion.matches && pointerActive) {
    orbitX += (pointerX - orbitX) * .16;
    orbitY += (pointerY - orbitY) * .16;
    orbit.style.left = `${orbitX}px`; orbit.style.top = `${orbitY}px`;
    aura.style.left = `${pointerX}px`; aura.style.top = `${pointerY}px`;
    if (Math.abs(pointerX-orbitX) + Math.abs(pointerY-orbitY) > .2) scheduleMotion();
  }
}
function scheduleMotion() { if (!frame) frame = requestAnimationFrame(renderMotion); }
window.addEventListener('scroll', () => { scrollDirty = true; scheduleMotion(); }, {passive:true});
window.addEventListener('resize', () => { scrollDirty = true; scheduleMotion(); }, {passive:true});
document.addEventListener('pointermove', event => {
  if (!finePointer.matches || reducedMotion.matches) return;
  pointerX = event.clientX; pointerY = event.clientY;
  if (!pointerActive) { orbitX = pointerX; orbitY = pointerY; }
  pointerActive = true; orbit.style.opacity = '.85'; aura.style.opacity = '1';
  const image = event.target.closest('.experience-photo');
  const link = event.target.closest('a, button, summary');
  orbit.classList.toggle('is-image', !!image);
  orbit.classList.toggle('is-link', !!link && !image);
  orbit.querySelector('span').textContent = image?.classList.contains('water') ? 'TOUCH' : 'EXPLORE';
  scheduleMotion();
}, {passive:true});
document.documentElement.addEventListener('pointerleave', () => { pointerActive = false; orbit.style.opacity='0'; aura.style.opacity='0'; });
window.addEventListener('blur', () => { pointerActive = false; orbit.style.opacity='0'; aura.style.opacity='0'; });
magneticButtons.forEach(button => {
  button.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    const box = button.getBoundingClientRect();
    button.style.transform = `translate(${(event.clientX-box.left-box.width/2)*.16}px,${(event.clientY-box.top-box.height/2)*.22}px)`;
  });
  button.addEventListener('pointerleave', () => button.style.transform = '');
});
document.querySelectorAll('.experience-photo').forEach(photo => {
  photo.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    const box=photo.getBoundingClientRect();
    const x=(event.clientX-box.left)/box.width, y=(event.clientY-box.top)/box.height;
    photo.style.setProperty('--light-x', `${x*100}%`); photo.style.setProperty('--light-y', `${y*100}%`);
    photo.style.transform=`perspective(1100px) rotateX(${(0.5-y)*5}deg) rotateY(${(x-0.5)*6}deg) translateY(-5px)`;
  });
  photo.addEventListener('pointerleave', () => photo.style.transform='');
});
const waterPhoto = document.querySelector('.water');
function ripple(x,y) {
  if (reducedMotion.matches) return;
  for (let i=0;i<2;i++) {
    const ring=document.createElement('span'); ring.className='ripple'; ring.setAttribute('aria-hidden','true');
    ring.style.setProperty('--ripple-x',x); ring.style.setProperty('--ripple-y',y);
    ring.style.animationDelay=`${i*.18}s`;
    ring.addEventListener('animationend',()=>ring.remove(),{once:true});
    waterPhoto.append(ring);
  }
}
waterPhoto.addEventListener('click',event=>{const box=waterPhoto.getBoundingClientRect();ripple(`${event.clientX-box.left}px`,`${event.clientY-box.top}px`);});
waterPhoto.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();ripple('50%','50%');}});
reducedMotion.addEventListener('change',()=>{
  if(reducedMotion.matches){heroImages.forEach(image=>image.style.transform='');magneticButtons.forEach(button=>button.style.transform='');document.querySelectorAll('.experience-photo').forEach(photo=>photo.style.transform='');orbit.style.opacity='0';aura.style.opacity='0';}
  scrollDirty=true;scheduleMotion();
});
scheduleMotion();


const entrance = document.querySelector('.entrance');
const doorLeft = document.querySelector('.door-left');
const doorRight = document.querySelector('.door-right');
const invitation = document.querySelector('.entrance-invitation');
const journey = document.querySelector('.journey');
const chapters = [...document.querySelectorAll('.journey-scene')];
const chapterButtons = [...document.querySelectorAll('[data-jump]')];
const clamp = value => Math.min(1,Math.max(0,value));
let currentChapter = -1;
function renderCinematic(){
  if(reducedMotion.matches) return;
  const entranceProgress=clamp(-entrance.getBoundingClientRect().top / Math.max(1,entrance.offsetHeight-innerHeight));
  const open=clamp(entranceProgress/ .9);
  const eased=1-Math.pow(1-open,2);
  doorLeft.style.transform=`translateX(${-eased*105}%) rotateY(${-eased*22}deg)`;
  doorRight.style.transform=`translateX(${eased*105}%) rotateY(${eased*22}deg)`;
  document.querySelector('.door-seam').style.opacity=1-clamp(open*6);
  invitation.style.opacity=1-clamp(open*3);
  invitation.style.transform=`scale(${1+open*.3})`;
  invitation.style.visibility=open>.4?'hidden':'visible';
  const reveal=clamp((open-.12)/.65);
  document.querySelectorAll('.entrance .hero-content,.entrance .sensory-switch').forEach(el=>{el.style.opacity=reveal;el.style.transform=`translateY(${(1-reveal)*35}px)`;});
  const jp=clamp(-journey.getBoundingClientRect().top / Math.max(1,journey.offsetHeight-innerHeight));
  const firstTransition=clamp((jp-.27)/.14);
  const secondTransition=clamp((jp-.63)/.14);
  chapters[1].style.clipPath=`circle(${firstTransition*150}% at 65% 55%)`;
  chapters[2].style.clipPath=`circle(${secondTransition*150}% at 50% 55%)`;
  const active=jp<.34?0:jp<.70?1:2;
  if(active!==currentChapter){currentChapter=active;chapters.forEach((chapter,index)=>{chapter.classList.toggle('is-current',index===active);chapter.setAttribute('aria-hidden',String(index!==active));});chapterButtons.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===active)));}
  chapters.forEach((chapter,index)=>{
    const local=clamp((jp-index*.34)/.34);
    chapter.querySelector('img').style.transform=`scale(${1.18-local*.16}) translateY(${local*-3}%)`;
    chapter.querySelector('.giant-word').style.transform=`translateX(${(local-.4)*-13}%)`;
  });
  document.querySelector('.journey-track i').style.transform=`scaleX(${jp})`;
}
document.querySelector('.enter-button').addEventListener('click',()=>window.scrollTo({top:entrance.offsetTop+entrance.offsetHeight-innerHeight,behavior:reducedMotion.matches?'instant':'smooth'}));
chapterButtons.forEach((button,index)=>button.addEventListener('click',()=>{
  if(reducedMotion.matches){chapters[index].scrollIntoView();return;}
  window.scrollTo({top:journey.offsetTop+(journey.offsetHeight-innerHeight)*[.10,.48,.86][index],behavior:'smooth'});
}));
function updateCinematicPreference(){
  if(reducedMotion.matches) chapters.forEach(chapter=>chapter.removeAttribute('aria-hidden'));
  else {currentChapter=-1;renderCinematic();}
}
reducedMotion.addEventListener('change',updateCinematicPreference);
updateCinematicPreference();
