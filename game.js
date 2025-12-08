// js/game.js (module)
import { gerarPergunta } from './generator.js';
import { showToast, openModal, closeModal, showLoading, hideLoading } from './ui.js';
import { createRoomOnServer, getRoomByCode, subscribeRoom, updateRoom } from './api.js';

const roomNameEl = document.getElementById('roomName');
const modeEl = document.getElementById('mode');
const currentIndexEl = document.getElementById('currentIndex');
const totalQuestionsEl = document.getElementById('totalQuestions');
const timerEl = document.getElementById('timer');
const qTextEl = document.getElementById('question-text');
const answersEl = document.getElementById('answers');
const statusEl = document.getElementById('status');
const scoreEl = document.getElementById('score');

const btnSettings = document.getElementById('btn-settings');
const modal = document.getElementById('settings-modal');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnExit = document.getElementById('btn-exit');

let state = {
  room: null,
  host: false,
  config: { questions: 10, time: 20, mode: 'normal' },
  questions: [],
  current: 0,
  score: 0,
  timer: null,
  timeLeft: 0,
  answered: false
};

// read nav params from sessionStorage
function readNav(path){
  const raw = sessionStorage.getItem(`nav:${path}`);
  if(!raw) return null;
  try{ return JSON.parse(raw);}catch(e){return null;}
}
const nav = readNav('/game.html') || {};
state.room = nav.room || 'LOCAL';
state.host = !!nav.host;
const savedCfg = sessionStorage.getItem(`roomcfg:${state.room}`);
if(savedCfg) try{ state.config = JSON.parse(savedCfg);}catch(e){}

initUI();
startGame();

function initUI(){
  roomNameEl.textContent = state.room;
  modeEl.textContent = state.config.mode || 'normal';
  totalQuestionsEl.textContent = state.config.questions;
  currentIndexEl.textContent = 0;
  scoreEl.textContent = 0;
  btnSettings.addEventListener('click', ()=> openModal(modal));
  btnCloseSettings.addEventListener('click', ()=> closeModal(modal));
  btnExit.addEventListener('click', ()=>{
    if(confirm('Deseja sair da sala?')) location.href = '/index.html';
  });
}

async function startGame(){
  // if host and supabase configured, optionally create room on server (best-effort)
  if(state.host){
    try{
      // attempt server create — optional; silent if keys missing
      await createRoomOnServer({ room: state.room, config: state.config });
    }catch(e){
      // ignore if server not set
    }
  }

  // pre-generate questions locally
  for(let i=0;i<state.config.questions;i++){
    const q = gerarPergunta();
    state.questions.push(q);
  }
  renderQuestion(0);
}

function renderQuestion(index){
  state.current = index;
  state.answered = false;
  currentIndexEl.textContent = index+1;
  const q = state.questions[index];
  qTextEl.textContent = q.question || q.questionText || '—';
  answersEl.innerHTML = '';
  q.alternatives.forEach((alt, i)=>{
    const b = document.createElement('button');
    b.textContent = alt;
    b.dataset.index = i;
    b.onclick = ()=> onAnswer(i);
    answersEl.appendChild(b);
  });

  startTimer(state.config.time);
}

function startTimer(seconds){
  stopTimer();
  state.timeLeft = seconds;
  timerEl.textContent = state.timeLeft;
  state.timer = setInterval(()=>{
    state.timeLeft--;
    timerEl.textContent = state.timeLeft;
    if(state.timeLeft <= 0){
      stopTimer();
      onTimeUp();
    }
  },1000);
}
function stopTimer(){ if(state.timer) { clearInterval(state.timer); state.timer=null; } }

function onAnswer(choiceIndex){
  if(state.answered) return;
  const q = state.questions[state.current];
  const chosen = q.alternatives[choiceIndex];
  state.answered = true;
  stopTimer();

  if(chosen === q.correct){
    // correct
    state.score += 100;
    showToast('Acertou!', 'success');
    // highlight
    markButtons(choiceIndex, 'correct');
  } else {
    showToast(`Errado! Resposta: ${q.correct}`, 'error');
    markButtons(choiceIndex, 'wrong');
    // highlight correct
    const correctIdx = q.alternatives.indexOf(q.correct);
    if(correctIdx >= 0) markButtons(correctIdx, 'correct');
  }
  scoreEl.textContent = state.score;

  setTimeout(()=> {
    // next or finish
    if(state.current + 1 >= state.config.questions){
      finishGame();
    } else {
      renderQuestion(state.current+1);
    }
  }, 1500);
}

function onTimeUp(){
  showToast('Tempo esgotado!', 'error');
  const q = state.questions[state.current];
  const correctIdx = q.alternatives.indexOf(q.correct);
  if(correctIdx >= 0) markButtons(correctIdx, 'correct');
  setTimeout(()=> {
    if(state.current + 1 >= state.config.questions) finishGame();
    else renderQuestion(state.current+1);
  }, 1500);
}

function markButtons(idx, cls){
  const btns = answersEl.querySelectorAll('button');
  btns.forEach((b,i)=>{
    b.classList.remove('correct','wrong');
    b.disabled = true;
    if(i===idx) b.classList.add(cls);
  });
}

function finishGame(){
  stopTimer();
  // navigate to victory or defeat depending on score threshold
  const threshold = state.config.questions * 50; // arbitrary
  const final = state.score;
  if(final >= threshold){
    location.href = `/victory.html?score=${final}`;
  } else {
    location.href = `/defeat.html?score=${final}`;
  }
}
