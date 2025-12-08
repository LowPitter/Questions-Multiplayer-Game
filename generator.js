// generator.js
// IA simples offline para gerar perguntas aleatórias

function gerarPergunta() {
  const temas = [
    gerarMatematica,
    gerarGeografia,
    gerarHistoria,
    gerarCiencia,
    gerarCuriosidades
  ];

  const tema = temas[Math.floor(Math.random() * temas.length)];
  return tema();
}

// ----------------------
// 1. Matemática
// ----------------------
function gerarMatematica() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ["+", "-", "x"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let correta;
  if (op === "+") correta = a + b;
  if (op === "-") correta = a - b;
  if (op === "x") correta = a * b;

  const pergunta = `Quanto é ${a} ${op} ${b}?`;
  const alternativas = gerarAlternativasNumericas(correta);

  return { pergunta, correta: correta.toString(), alternativas };
}

function gerarAlternativasNumericas(correta) {
  const respostas = new Set([correta]);
  while (respostas.size < 4) {
    const erro = correta + (Math.floor(Math.random() * 10) - 5);
    respostas.add(erro);
  }
  return shuffleArray([...respostas].map(String));
}

// ----------------------
// 2. Geografia
// ----------------------
function gerarGeografia() {
  const paises = [
    { pais: "Brasil", capital: "Brasília" },
    { pais: "Japão", capital: "Tóquio" },
    { pais: "França", capital: "Paris" },
    { pais: "Canadá", capital: "Ottawa" },
    { pais: "Argentina", capital: "Buenos Aires" }
  ];

  const cidadesExtras = ["Roma", "Dubai", "Oslo", "Seul", "Sydney", "Lisboa"];

  const escolhido = paises[Math.floor(Math.random() * paises.length)];
  const correta = escolhido.capital;

  const alternativas = new Set([correta]);
  while (alternativas.size < 4) {
    alternativas.add(cidadesExtras[Math.floor(Math.random() * cidadesExtras.length)]);
  }

  return {
    pergunta: `Qual é a capital de ${escolhido.pais}?`,
    correta,
    alternativas: shuffleArray([...alternativas])
  };
}

// ----------------------
// 3. História
// ----------------------
function gerarHistoria() {
  const eventos = [
    { evento: "a Independência do Brasil", ano: 1822 },
    { evento: "a Revolução Francesa", ano: 1789 },
    { evento: "o descobrimento do Brasil", ano: 1500 },
    { evento: "o fim da Segunda Guerra Mundial", ano: 1945 }
  ];

  const e = eventos[Math.floor(Math.random() * eventos.length)];
  const correta = e.ano;
  return {
    pergunta: `Em que ano aconteceu ${e.evento}?`,
    correta: correta.toString(),
    alternativas: gerarAlternativasNumericas(correta)
  };
}

// ----------------------
// 4. Ciências
// ----------------------
function gerarCiencia() {
  const perguntas = [
    { p: "Qual planeta é conhecido como Planeta Vermelho?", correta: "Marte", erradas: ["Vênus", "Júpiter", "Saturno"] },
    { p: "Qual gás as plantas produzem na fotossíntese?", correta: "Oxigênio", erradas: ["Hidrogênio", "Nitrogênio", "Dióxido de carbono"] },
    { p: "Qual é o maior órgão do corpo humano?", correta: "Pele", erradas: ["Coração", "Fígado", "Pulmão"] }
  ];

  const q = perguntas[Math.floor(Math.random() * perguntas.length)];
  return {
    pergunta: q.p,
    correta: q.correta,
    alternativas: shuffleArray([q.correta, ...q.erradas])
  };
}

// ----------------------
// 5. Curiosidades
// ----------------------
function gerarCuriosidades() {
  const perguntas = [
    { p: "Qual é o animal terrestre mais rápido do mundo?", correta: "Guepardo", erradas: ["Tigre", "Gazela", "Cavalo"] },
    { p: "Qual é o metal mais leve?", correta: "Lítio", erradas: ["Alumínio", "Sódio", "Titânio"] },
    { p: "Qual país inventou o papel?", correta: "China", erradas: ["Egito", "Grécia", "Índia"] }
  ];

  const q = perguntas[Math.floor(Math.random() * perguntas.length)];
  return {
    pergunta: q.p,
    correta: q.correta,
    alternativas: shuffleArray([q.correta, ...q.erradas])
  };
}

// ----------------------
// Utilitário: embaralhar array
// ----------------------
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
