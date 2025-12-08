/* ==========================================================
   UI.JS — Sistema de UI simples para toasts, modais e loading
   ========================================================== */

/* -------------------------------
   TOASTS (mensagens rápidas)
--------------------------------*/
export function showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/* -------------------------------
   MODAL (confirmar ações)
--------------------------------*/
export function openModal(title, message, onConfirm = null, onCancel = null) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal-box";
    modal.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="modal-buttons">
            <button id="modalConfirm" class="btn-primary">Confirmar</button>
            <button id="modalCancel" class="btn-secondary">Cancelar</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById("modalConfirm").onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };

    document.getElementById("modalCancel").onclick = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
}

/* -------------------------------
   TRANSIÇÃO ENTRE TELAS
--------------------------------*/
export function changeScreen(toPage) {
    const fade = document.createElement("div");
    fade.className = "screen-fade";
    document.body.appendChild(fade);

    fade.classList.add("fade-in");
    setTimeout(() => window.location.href = toPage, 300);
}

/* -------------------------------
   BOTÃO DESABILITÁVEL
--------------------------------*/
export function disableButton(id, disabled = true) {
    const el = document.getElementById(id);
    if (!el) return;
    el.disabled = disabled;
    if (disabled) el.classList.add("btn-disabled");
    else el.classList.remove("btn-disabled");
}

/* -------------------------------
   LOADING SPINNER
--------------------------------*/
export function showLoading() {
    const loader = document.createElement("div");
    loader.className = "loading-overlay";
    loader.innerHTML = `<div class="spinner"></div>`;
    loader.id = "globalLoader";
    document.body.appendChild(loader);
}

export function hideLoading() {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.remove();
}
