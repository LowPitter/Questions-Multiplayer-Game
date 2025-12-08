// js/ui.js (module)
export function showToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  Object.assign(toast.style, {
    position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',
    background: type==='success' ? '#16a34a' : (type==='error' ? '#dc2626' : '#111'),
    color:'#fff',padding:'10px 16px',borderRadius:'10px',zIndex:9999,opacity:0,transition:'0.25s'
  });
  document.body.appendChild(toast);
  requestAnimationFrame(()=> toast.style.opacity = '1');
  setTimeout(()=> {
    toast.style.opacity = '0';
    setTimeout(()=> toast.remove(), 300);
  }, 2200);
}

export function openModal(el) {
  if(!el) return;
  el.classList.remove('hidden');
  el.setAttribute('aria-hidden','false');
}
export function closeModal(el) {
  if(!el) return;
  el.classList.add('hidden');
  el.setAttribute('aria-hidden','true');
}

export function showLoading(){
  if(document.getElementById('globalLoader')) return;
  const loader = document.createElement('div');
  loader.id = 'globalLoader';
  Object.assign(loader.style, {position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'grid',placeItems:'center',zIndex:9998});
  loader.innerHTML = `<div style="width:56px;height:56px;border-radius:8px;background:#fff;display:grid;place-items:center">Loading...</div>`;
  document.body.appendChild(loader);
}
export function hideLoading(){
  const l = document.getElementById('globalLoader'); if(l) l.remove();
}
