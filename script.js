const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','メニューを開く');menuButton.textContent='☰';}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';mobileNav.hidden=open;menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'メニューを開く':'メニューを閉じる');menuButton.textContent=open?'☰':'×';});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelectorAll('[data-guide]').forEach(b=>b.addEventListener('click',()=>{const target=b.closest('.plan')?'#visit-guide':'#plan';document.querySelector(target).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
const moods={heat:['sauna.jpg','木の香りと、やわらかな熱に包まれる。','木のベンチとストーブが見えるサウナ室の素材写真'],water:['water.jpg','熱から水へ。感覚を、ゆっくり切り替える。','サウナ小屋の隣の小型プールの素材写真'],stillness:['forest.jpg','緑を眺め、風に身をゆだねる。','緑を望むデッキとリクライニングチェアの素材写真']};
document.querySelectorAll('[data-mood]').forEach(b=>b.addEventListener('click',()=>{const mood=moods[b.dataset.mood];const img=document.querySelector('.hero-img');img.src='assets/'+mood[0];img.alt=mood[2];document.querySelector('.mood-description').textContent=mood[1];document.querySelectorAll('[data-mood]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});}));
