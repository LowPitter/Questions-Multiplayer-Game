# Questions Multiplayer

Jogo de perguntas multiplayer — versão hospedada no GitHub Pages.

## Como usar (modo rápido)
1. Abra `index.html` no site (GitHub Pages).  
2. Crie uma sala (nome + senha) ou entre em uma sala existente.  
3. Configure regras (tempo por pergunta, número de perguntas).  
4. Inicie e responda. No final, verá tela de vitória/derrota.

## Multplayer com Supabase (opcional)
- Crie um projeto no Supabase.
- Crie as tabelas `rooms` e `scores` (veja README original para SQL).
- Copie a URL e a anon key para `js/api.js` (const SUPABASE_URL / SUPABASE_KEY).
- Habilite Realtime para a tabela `rooms`.

## Estrutura
