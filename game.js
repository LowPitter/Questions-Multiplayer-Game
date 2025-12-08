// game.js
// Lógica principal do jogo

// --- Elementos ---
const url = new URL(location.href);
const roomName = url.searchParams.get("room") || "Demo";
const mode = url.searchParams.get("mode") || "normal";
const totalQuestions = parseInt(url.searchParams.get("questions")) || 10;
const timePerQuestion = parseInt(url.searchParams.get("time")) || 20;

const roomNameEl = document.getElementById("roomName");
const modeEl = document.getElementById("mode");
const currentIndexEl = document.getElementById("currentIndex");
const totalQuestionsEl = document.getElementById("totalQuestions");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");

let currentQuestionIndex = 0;
let score = 0;
let timerInterval = null;

// --- Inicialização ---
roomNameEl.textContent = roomName;
modeEl.textContent = mode;
totalQuestionsEl.textContent = totalQuestions;

carregarPergunta();

// --- Funções ---
function carregarPergunta() {
  if (currentQuestionIndex >= totalQuestions) {
    finalizarJogo();
    return;
  }

  currentQuestionIndex++;
  currentIndexEl.textContent = currentQuestionIndex;

  const p = gerarPergunta(); // generator.js

  questionTextEl.textContent = p.pergunta;
  answersEl.innerHTML = "";

  p.alternativas.forEach(alt => {
    const btn = document.createElement("button");
    btn.textContent = alt;
    btn.onclick = () => verificarResposta(alt, p.correta, btn);
    answersEl.appendChild(btn);
  });

  iniciarTimer();
}

function verificarResposta(escolhida, correta, btn) {
  pararTimer();

  const botoes = answersEl.querySelectorAll("button");
  botoes.forEach(b => b.disabled = true);

  if (escolhida === correta) {
    btn.classList.add("correct");
    score += 100;
    scoreEl.textContent = score;
    showToast("Correto!", "success");
  } else {
    btn.classList.add("wrong");
    // marca a correta
    botoes.forEach(b => {
      if (b.textContent === correta) b.classList.add("correct");
    });
    showToast("Errado!", "error");
  }

  setTimeout(carregarPergunta, 1500);
}

function iniciarTimer() {
  let time = timePerQuestion;
  timerEl.textContent = time;

  timerInterval = setInterval(() => {
    time--;
    timerEl.textContent = time;
    if (time <= 0) {
      pararTimer();
      showToast("Tempo esgotado!", "error");
      verificarResposta("", ""); // força mostrar correta
    }
  }, 1000);
}

function pararTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

function finalizarJogo() {
  changeScreen(`/victory.html?score=${score}`);
}
