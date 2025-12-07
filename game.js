// game.js
// Arquivo responsável pela lógica do jogo multiplayer (versão inicial simples)

console.log("game.js carregado!");

// Elementos da interface
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const roomTitle = document.getElementById("room-title");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers");

// Botões
const btnCreate = document.getElementById("create-room");
const btnJoin = document.getElementById("join-room");

// Entradas
const roomInput = document.getElementById("room-input");
const passwordInput = document.getElementById("password-input");

// Dados temporários (até conectar ao Supabase)
let currentRoom = null;
let currentPassword = null;

// IMPORTANTE: Nesta fase inicial o multiplayer ainda não está ativo.
// Vamos apenas simular a troca de telas e carregar perguntas da IA local.

btnCreate.onclick = () => {
    const room = roomInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!room || !pass) {
        alert("Digite o nome e a senha da sala!");
        return;
    }

    currentRoom = room;
    currentPassword = pass;

    iniciarSala();
};

btnJoin.onclick = () => {
    const room = roomInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!room || !pass) {
        alert("Digite o nome e a senha da sala!");
        return;
    }

    currentRoom = room;
    currentPassword = pass;

    iniciarSala();
};

function iniciarSala() {
    setupScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    roomTitle.textContent = `Sala: ${currentRoom}`;

    carregarNovaPergunta();
}

// Carrega uma nova pergunta usando a "IA simples" do generator.js
function carregarNovaPergunta() {
    const p = gerarPergunta(); // função vem do arquivo generator.js

    questionText.textContent = p.pergunta;
    answersBox.innerHTML = "";

    p.alternativas.forEach(alt => {
        const btn = document.createElement("button");
        btn.textContent = alt;
        btn.onclick = () => verificarResposta(alt, p.correta);
        answersBox.appendChild(btn);
    });
}

function verificarResposta(escolhida, correta) {
    if (escolhida === correta) {
        alert("Correto!");
    } else {
        alert("Errado! A resposta certa era: " + correta);
    }

    carregarNovaPergunta();
}
