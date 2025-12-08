/* ==========================================================
   CONFIG.JS — Salvar e carregar configurações da sala
   ========================================================== */

import { updateRoomConfig, getRoomData } from "./api.js";

/* -------------------------------------
   ELEMENTOS DA PÁGINA
--------------------------------------*/

const tempoEl = document.getElementById("tempo");
const qtdPerguntasEl = document.getElementById("qtdPerguntas");
const privacidadeEl = document.getElementById("privacidade");
const codigoPrivadoWrapper = document.getElementById("codigoPrivadoWrapper");
const codigoPrivadoEl = document.getElementById("codigoPrivado");
const btnSalvar = document.getElementById("btnSalvar");

/* -------------------------------------
   EXIBIR CAMPO DE CÓDIGO PRIVADO
--------------------------------------*/

privacidadeEl.addEventListener("change", () => {
    if (privacidadeEl.value === "privada") {
        codigoPrivadoWrapper.style.display = "block";
    } else {
        codigoPrivadoWrapper.style.display = "none";
    }
});

/* -------------------------------------
   CARREGAR CONFIGURACÕES EXISTENTES
--------------------------------------*/

function loadLocalConfig() {
    const config = JSON.parse(localStorage.getItem("roomConfig"));

    if (!config) return;

    tempoEl.value = config.tempo;
    qtdPerguntasEl.value = config.qtdPerguntas;
    privacidadeEl.value = config.privacidade;

    if (config.privacidade === "privada") {
        codigoPrivadoWrapper.style.display = "block";
        codigoPrivadoEl.value = config.codigoPrivado;
    }
}

loadLocalConfig();


/* -------------------------------------
   SALVAR CONFIGURAÇÕES
--------------------------------------*/

btnSalvar.addEventListener("click", async () => {
    const config = {
        tempo: parseInt(tempoEl.value),
        qtdPerguntas: parseInt(qtdPerguntasEl.value),
        privacidade: privacidadeEl.value,
        codigoPrivado: codigoPrivadoEl.value.trim()
    };

    if (config.privacidade === "privada" && config.codigoPrivado.length < 4) {
        showToast("Código precisa de pelo menos 4 caracteres.", "error");
        return;
    }

    // salva localmente
    localStorage.setItem("roomConfig", JSON.stringify(config));
    showToast("Configurações salvas!", "success");

    // tenta salvar na sala se estiver em uma
    const roomId = localStorage.getItem("roomId");

    if (roomId) {
        try {
            showLoading();
            await updateRoomConfig(roomId, config);
            hideLoading();
            showToast("Configuração sincronizada com a sala!", "success");
        } catch {
            hideLoading();
            showToast("Não foi possível atualizar no servidor.", "error");
        }
    }

    // retorna para o lobby ou jogo
    changeScreen("game.html");
});
