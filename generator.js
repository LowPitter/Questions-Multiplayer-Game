// generator.js
// IA simples, totalmente offline, para gerar perguntas aleatórias

function gerarPergunta() {
    // --- Lista de temas ---
    const temas = [
        gerarMatematica,
        gerarGeografia,
        gerarHistoria,
        gerarCiencia,
        gerarCuriosidades
    ];

    // Escolher tema aleatório
    const tema = temas[Math.floor(Math.random() * temas.length)];

    // Gerar pergunta e respostas
    return tema();
}

// ----------------------
// 1. Perguntas de Matemática
// ----------------------
function gerarMatematica() {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const operacoes = ["+", "-", "x"];
    const op = operacoes[Math.floor(Math.random() * operacoes.length)];

    let correta;

    if (op === "+") correta = a + b;
    if (op === "-") correta = a - b;
    if (op === "x") correta = a * b;

    const pergunta = `Quanto é ${a} ${op} ${b}?`;

    const alternativas = gerarAlternativasNumericas(correta);

    return { pergunta, correta: correta.toString(), alternativas };
}

function gerarAlternativasNumericas(correta) {
    let respostas = [correta];

    while (respostas.length < 4) {
        const erro = correta + (Math.floor(Math.random() * 10) - 5);
        if (!respostas.includes(erro)) respostas.push(erro);
    }

    return respostas.map(String).sort(() => Math.random() - 0.5);
}

// ----------------------
// 2. Perguntas de Geografia
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

    let alternativas = [correta];

    while (alternativas.length < 4) {
        const aleatoria = cidadesExtras[Math.floor(Math.random() * cidadesExtras.length)];
        if (!alternativas.includes(aleatoria)) alternativas.push(aleatoria);
    }

    return {
        pergunta: `Qual é a capital de ${escolhido.pais}?`,
        correta,
        alternativas: alternativas.sort(() => Math.random() - 0.5)
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

    const alternativas = gerarAlternativasNumericas(correta);

    return {
        pergunta: `Em que ano aconteceu ${e.evento}?`,
        correta: correta.toString(),
        alternativas
    };
}

// ----------------------
// 4. Ciências
// ----------------------
function gerarCiencia() {
    const perguntas = [
        {
            p: "Qual planeta é conhecido como Planeta Vermelho?",
            correta: "Marte",
            erradas: ["Vênus", "Júpiter", "Saturno"]
        },
        {
            p: "Qual gás as plantas produzem na fotossíntese?",
            correta: "Oxigênio",
            erradas: ["Hidrogênio", "Nitrogênio", "Dióxido de carbono"]
        },
        {
            p: "Qual é o maior órgão do corpo humano?",
            correta: "Pele",
            erradas: ["Coração", "Fígado", "Pulmão"]
        }
    ];

    const q = perguntas[Math.floor(Math.random() * perguntas.length)];

    const alternativas = [q.correta, ...q.erradas].sort(() => Math.random() - 0.5);

    return {
        pergunta: q.p,
        correta: q.correta,
        alternativas
    };
}

// ----------------------
// 5. Curiosidades
// ----------------------
function gerarCuriosidades() {
    const perguntas = [
        {
            p: "Qual é o animal terrestre mais rápido do mundo?",
            correta: "Guepardo",
            erradas: ["Tigre", "Gazela", "Cavalo"]
        },
        {
            p: "Qual é o metal mais leve?",
            correta: "Lítio",
            erradas: ["Alumínio", "Sódio", "Titânio"]
        },
        {
            p: "Qual país inventou o papel?",
            correta: "China",
            erradas: ["Egito", "Grécia", "Índia"]
        }
    ];

    const q = perguntas[Math.floor(Math.random() * perguntas.length)];
    const alternativas = [q.correta, ...q.erradas].sort(() => Math.random() - 0.5);

    return {
        pergunta: q.p,
        correta: q.correta,
        alternativas
    };
}
