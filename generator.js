// js/generator.js (module)
export function gerarPergunta(nivel = 1, temaPref = null) {
  // simplified but improved generator; returns object:
  // { question, alternatives:[], correctIndex, correct }
  // For brevity implement simpler generator (you can expand DB later)
  const tipos = ['matematica','geografia','ciencia','curiosidade','historia'];
  const tipo = temaPref || tipos[Math.floor(Math.random()*tipos.length)];

  if(tipo === 'matematica'){
    const a = rand(1,12), b = rand(1,12); const ops = ['+','-','×']; const op = ops[rand(0,ops.length-1)];
    let res = op==='+'?a+b:(op==='-'?a-b:a*b);
    const q = `Quanto é ${a} ${op} ${b}?`;
    const alts = genNumAlts(res,3);
    return { question:q, alternatives:shuffle([String(res),...alts]), correct:String(res) };
  } else if(tipo==='geografia'){
    const countries = [
      {c:'Brasil',cap:'Brasília'},{c:'Japão',cap:'Tóquio'},
      {c:'França',cap:'Paris'},{c:'Canadá',cap:'Ottawa'},{c:'Argentina',cap:'Buenos Aires'}
    ];
    const pick = countries[rand(0,countries.length-1)];
    const distract = countries.filter(x=>x.cap!==pick.cap).map(x=>x.cap);
    const alts = shuffle([pick.cap,...pickMany(distract,3)]);
    return { question:`Qual é a capital de ${pick.c}?`, alternatives:alts, correct:pick.cap };
  } else if(tipo==='ciencia' || tipo==='curiosidade' || tipo==='historia'){
    const pool = [
      {q:'Qual planeta é conhecido como Planeta Vermelho?', a:'Marte', wrong:['Vênus','Júpiter','Saturno']},
      {q:'Qual gás as plantas produzem na fotossíntese?', a:'Oxigênio', wrong:['Hidrogênio','Nitrogênio','Dióxido de carbono']},
      {q:'Qual é o animal terrestre mais rápido do mundo?', a:'Guepardo', wrong:['Tigre','Gazela','Cavalo']},
      {q:'Em que ano ocorreu a Independência do Brasil?', a:'1822', wrong:['1808','1815','1830']}
    ];
    const p = pool[rand(0,pool.length-1)];
    return { question:p.q, alternatives:shuffle([p.a,...p.wrong]), correct:p.a };
  }

  // helpers
  function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
  function shuffle(arr){return arr.sort(()=>Math.random()-0.5);}
  function genNumAlts(correct,n){
    const s = new Set();
    while(s.size<n){
      const cand = correct + [ -3,-2,-1,1,2,3,5][rand(0,6)];
      if(cand!==correct) s.add(String(cand));
    }
    return Array.from(s);
  }
  function pickMany(arr, n){ return shuffle(arr).slice(0,n); }
}
