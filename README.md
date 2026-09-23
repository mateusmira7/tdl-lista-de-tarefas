# TDL — Lista de Tarefas

Aplicação web simples (HTML/CSS/JS puro) de lista de tarefas, criada como
projeto de apoio para a disciplina de Gerência, Configuração e Processos
de Software (Plano de Gerenciamento de Configuração — Enfoque DevOps).

## Rodar localmente
Basta abrir `src/index.html` no navegador.

## Rodar os testes
```
npm install
npm test
```

## Pipeline
- **CI** (`.github/workflows/ci.yml`): a cada push/PR, instala dependências e roda os testes unitários das funções em `src/utils.js`.
- **CD** (`.github/workflows/deploy.yml`): a cada push na branch `main`, publica o conteúdo de `src/` no GitHub Pages automaticamente.
