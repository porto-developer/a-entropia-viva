# A Entropia Viva

Ferramenta web para o mestre do RPG pedagógico **A Entropia Viva**: medidores de Colapso e Cofre, cartas de desastre/procurar e telão para os jogadores.

Stack: HTML, CSS e JavaScript puro (sem build). Dados das cartas em JSON; estado da sessão no `localStorage` do navegador.

## Como rodar

Use um servidor estático na pasta do projeto (necessário para carregar os JSON das cartas):

```bash
cd a-entropia-viva
python3 -m http.server 8766
```

Abra no navegador:

| Página | URL |
|--------|-----|
| Login do mestre | http://localhost:8766/ |
| Painel do mestre | http://localhost:8766/admin.html |
| Telão (jogadores) | http://localhost:8766/publico.html |

**Senha inicial do mestre:** `entropia2026` — altere em [`js/config.js`](js/config.js) (`senhaMestre`).

## Uso rápido

1. Entre no painel com a senha.
2. Ajuste os medidores durante a sessão.
3. Abra `publico.html` em outra aba ou na TV — os medidores e desastres ativos sincronizam automaticamente.
4. Ative cartas de desastre no painel para exibi-las no telão.

## Deploy (Railway)

O repositório inclui `Dockerfile` e `railway.toml`. No Railway, gere um domínio público apontando para a porta **8080**.

## Estrutura principal

```
index.html          Login
admin.html          Painel do mestre
publico.html        Telão
js/config.js        Senha, medidores, regras
data/*.json         Cartas de desastre e procurar
```
