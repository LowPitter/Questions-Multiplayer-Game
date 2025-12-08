// game.js — Lógica principal do jogo Show do Milhão

import { gerarPergunta } from "./generator.js"; // IA offline
import { changeScreen, showToast } from "./ui.js";

const roomNameEl = document.getElementById("roomName");
const modeEl = document.getElementById("mode");
const currentIndexEl = document.getElementById("currentIndex");
const totalQuestionsEl = document.getElementById("totalQuestions");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");

let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;

// Pega parâmetros da URL
const url = new URL(location.href);
const roomName = url.searchParams.get("room") || "Demo";
const mode = url.searchParams.get("mode") || "normal";
const totalQuestions = parseInt(url.searchParams.get("questions")) || 10;
timeLeft = parseInt(url.searchParams.get("time")) || 20;

roomNameEl.textContent = roomName;
modeEl.textContent = mode;
totalQuestionsEl.textContent = totalQuestions;

// Gera todas as perguntas
for (let i = 0; i < totalQuestions; i++) {
    questions.push(gerarPergunta());
}

loadQuestion(currentIndex);

function loadQuestion(index) {
    clearInterval(timer);

    const q = questions[index];
    questionTextEl.textContent = q.pergunta;
    answersEl.innerHTML = "";

    // Shuffle alternativas
    const shuffled = [...q.alternativas].sort(() => Math.random() - 0.5);

    shuffled.forEach(a => {
        const btn = document.createElement("button");
        btn.textContent = a;
        btn.onclick = () => selectAnswer(a, q.correta, btn);
        answersEl.appendChild(btn);
    });

    currentIndexEl.textContent = index + 1;
    startTimer(timeLeft);
}

function selectAnswer(selected, correct, btn) {
    clearInterval(timer);

    // Marca resposta
    const buttons = answersEl.querySelectorAll("button");
    buttons.forEach(b => {
        b.disabled = true;
        if (b.textContent === correct) b.classList.add("correct");
        if (b.textContent === selected && selected !== correct) b.classList.add("wrong");
    });

    if (selected === correct) {
        score += 10;
        scoreEl.textContent = score;
        showToast("Correto!", "success");
    } else {
        showToast(`Errado! A resposta era: ${correct}`, "error");
    }

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < totalQuestions) {
            loadQuestion(currentIndex);
        } else {
            endGame();
        }
    }, 1500);
}

function startTimer(seconds) {
    let time = seconds;
    timerEl.textContent = time;

    timer = setInterval(() => {
        time--;
        timerEl.textContent = time;

        if (time <= 0) {
            clearInterval(timer);
            showToast(`Tempo esgotado!`, "error");
            selectAnswer(null, questions[currentIndex].correta);
        }
    }, 1000);
}

function endGame() {
    if (score === totalQuestions * 10) {
        changeScreen(`/victory.html?score=${score}`);
    } else {
        changeScreen(`/defeat.html?score=${score}`);
    }
}
