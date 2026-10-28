# Plano de Gerenciamento de Configuração — Enfoque DevOps

**TDL — Lista de Tarefas** · Integração e Entrega Contínuas (CI/CD) · Versão 1.1

| Campo | Descrição |
|---|---|
| Projeto | TDL — Lista de Tarefas |
| Gerente de Projeto | Mateus Corrêa de Mira |
| Responsável de GCS/DevOps | Mateus Corrêa de Mira |
| Modalidade | Desenvolvimento individual, com 1 revisor externo (par de revisão) |
| Revisora (acesso Write) | [@elisamgomes](https://github.com/elisamgomes) |
| Repositório principal | https://github.com/mateusmira7/tdl-lista-de-tarefas |
| Aplicação publicada | GitHub Pages do repositório |

## Histórico de Revisões

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 23/09/2026 | 1.0 | Elaboração do PGCS do projeto TDL a partir do template da disciplina. | Mateus |
| 28/10/2026 | 1.1 | Inclusão do par de revisão, proteção da `main`, Environments `staging` e `production`; remoção de itens do template que não se aplicam ao projeto. | Mateus |

---

## 1. Introdução

Este Plano de Gerenciamento de Configuração (PGCS) descreve as atividades de Gestão de Configuração de Software (GCS) do projeto TDL — Lista de Tarefas: identificar os itens de configuração, manter sua integridade e controlar as mudanças, com o mínimo de burocracia e o máximo de automação, usando práticas DevOps (CI/CD).

### 1.1 Finalidade

Estabelecer o padrão seguido no projeto, garantindo rastreabilidade, versionamento e controle de mudanças, apoiado por pipeline automatizado de teste e implantação.

### 1.2 Escopo

Aplica-se ao desenvolvimento da aplicação TDL (HTML/CSS/JavaScript, com testes em Jest), conduzido individualmente por Mateus Corrêa de Mira. Abrange o código-fonte, os testes automatizados, o pipeline de CI/CD e a documentação. Há uma segunda pessoa no repositório, a revisora @elisamgomes, que aprova os Pull Requests.

### 1.3 Definições, Acrônimos e Abreviações

| Termo | Significado |
|---|---|
| GCS | Gestão de Configuração de Software |
| CI | Integração Contínua |
| CD | Entrega/Implantação Contínua |
| CCM | Comitê de Controle de Mudanças |
| Baseline | Conjunto de itens de configuração em estado estável e comprovado |
| Pipeline | Sequência automatizada de etapas de teste e implantação |
| GitHub Flow | Estratégia de branching com `main` sempre implantável e branches de feature curtas |
| SemVer | Versionamento Semântico (MAJOR.MINOR.PATCH) |
| DORA | Métricas de desempenho DevOps |

### 1.4 Referências

- Documento base: Processos de Desenvolvimento de Software e a Integração com GCS.
- Template do Plano de Gerenciamento de Configuração (RUP 7.0, IBM), adaptado.
- Documentação oficial do GitHub Actions, GitHub Environments, GitHub Pages e do Jest.

### 1.5 Visão Geral

A GCS é tratada como parte constante do pipeline: cada Pull Request revisado, testado e implantado gera evidências de rastreabilidade (histórico de PRs, logs do GitHub Actions, tags de versão e registros de deployment), reduzindo o esforço manual.

---

## 2. Papéis na Gerência de Configuração

O projeto é individual, então os papéis do template foram consolidados.

| Papel | Quem exerce | Responsabilidades |
|---|---|---|
| Gerente de Projeto / Product Owner | Mateus | Prioriza o backlog (GitHub Issues) e decide o que entra em cada release. |
| Engenheiro DevOps / Release Engineer | Mateus | Mantém o workflow de CI/CD, o branching, o versionamento e a configuração do repositório. |
| Desenvolvedor | Mateus | Implementa funcionalidades, escreve testes Jest e abre Pull Requests. |
| Revisora (par de revisão) | @elisamgomes (acesso Write) | Revisa e aprova os Pull Requests antes do merge. |
| Operação / Monitoramento | Mateus | Acompanha o resultado dos deployments no GitHub Actions e no GitHub Pages. |
| Segurança / Dependências | Mateus | Acompanha os alertas e PRs do Dependabot. |
| CCM | Mateus, com aprovação da revisora no PR | Ver seção 8.2. |
| Aprovador de produção | Mateus (revisor obrigatório do Environment `production`) | Aprova cada deploy em produção. |

> O autor de um PR não pode aprová-lo no GitHub. Por isso a revisora externa é necessária para cumprir a regra de 1 aprovação.

---

## 3. Ferramentas, Ambientes e Infraestrutura

### 3.1 Ferramentas do Pipeline

| Categoria | Ferramenta | Finalidade |
|---|---|---|
| Controle de versão | Git + GitHub | Versionamento do código, testes, documentação e pipeline como código. |
| Orquestração de CI/CD | GitHub Actions | Instalação de dependências, execução dos testes Jest e implantação. |
| Hospedagem / artefato publicado | GitHub Pages | Publicação da versão vigente da aplicação estática. |
| Proteção do fluxo | Proteção de branch da `main` e GitHub Environments | Impõem PR, aprovação e CI verde, e controlam a promoção para produção. |
| Gestão de segredos | `GITHUB_TOKEN` automático | Autentica o pipeline no GitHub Pages. Não há outros segredos. |
| Gestão de dependências (SCA) | Dependabot | Alertas e PRs de atualização da dependência Jest. |
| Rastreamento de tarefas | GitHub Issues | Vincula commits e PRs a itens de trabalho. |
| Empacotamento, containers, IaC | Não se aplica | A aplicação é estática, sem imagem nem infraestrutura a provisionar. |

### 3.2 Ambientes e Infraestrutura

Não há servidor dedicado. Os ambientes abaixo são etapas de validação e publicação.

| Ambiente | Finalidade | Gatilho de promoção |
|---|---|---|
| Desenvolvimento (local) | Execução da aplicação e dos testes Jest na máquina local, antes de abrir o PR. | Abertura do Pull Request. |
| `staging` (GitHub Environment) | Etapa do pipeline após o merge na `main`, em que os testes são executados e a versão é validada antes da produção. Sem regra de aprovação; deployment apenas a partir de branches protegidas. | Merge na `main` com CI verde. |
| `production` (GitHub Environment) | Aplicação publicada e acessível via GitHub Pages. | **Aprovação manual de Mateus, revisor obrigatório do Environment**, após o sucesso em `staging`. |

### 3.3 Estratégia de Branching e Versionamento

Adota-se **GitHub Flow**:

- `main`: sempre implantável e protegida (ver 5.2).
- `feature/<issue>-<descrição-curta>`: uma branch por mudança, de curta duração.
- `hotfix/<descrição>`: correções emergenciais, que também passam por PR.

Versionamento por **SemVer** (`vX.Y.Z`) e **Conventional Commits** (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`).

---

## 4. Identificação da Configuração

### 4.1 Itens de Configuração

Todos versionados no repositório:

- Código-fonte da aplicação (`index.html`, `style.css`, `app.js`, `utils.js`);
- Testes automatizados (Jest);
- Definição do pipeline como código (`.github/workflows`);
- Arquivos de dependências (`package.json` e `package-lock.json`);
- Configuração do Dependabot (`.github/dependabot.yml`), quando existir;
- Documentação: `README.md` e este PGCS, em `/docs`.

### 4.2 Convenção de Nomenclatura

| Item | Convenção | Exemplo |
|---|---|---|
| Branch de feature | `feature/<issue>-<descrição-curta>` | `feature/12-filtrar-tarefas` |
| Branch de hotfix | `hotfix/<descrição>` | `hotfix/corrige-exclusao` |
| Commit | `<tipo>(<escopo>): <descrição>` | `feat(tarefas): adiciona filtro por status` |
| Tag de release | `vX.Y.Z` | `v1.0.0` |
| Arquivo de teste | `<módulo>.test.js` | `utils.test.js` |

### 4.3 Estrutura do Repositório

```
/src                  código da aplicação (index.html, style.css, app.js, utils.js)
/tests                testes unitários em Jest
/docs                 documentação, incluindo este PGCS
/.github/workflows    pipeline de CI/CD
README.md             documentação do projeto
package.json          dependências e script de teste
package-lock.json     versões travadas das dependências
```

---

## 5. Integração Contínua (CI)

### 5.1 Etapas do Pipeline de CI

Executado em todo Pull Request e em todo push para a `main`:

1. Checkout do código.
2. Configuração do Node.js, com cache de dependências.
3. Instalação das dependências (`npm ci`).
4. Execução dos testes unitários (`npm test`, Jest).

Por ser uma aplicação estática, não há etapa de build nem de empacotamento. Lint, SAST e testes de integração não fazem parte desta versão do pipeline.

### 5.2 Política de Pull Request e Proteção da `main`

A `main` é protegida por uma **regra de proteção de branch do GitHub** (Settings → Branches), sem exceções, inclusive para o administrador:

- Pull Request obrigatório antes do merge, com **1 aprovação** da revisora @elisamgomes;
- Aprovações antigas descartadas quando há novos commits no PR;
- Histórico linear obrigatório e **somente squash merge** permitido (cada PR vira um commit, com o título do PR como mensagem);
- Branches de PR excluídas automaticamente após o merge;
- "Do not allow bypassing the above settings" ativo;
- Status check do job de testes (Jest) obrigatório, a ser ativado quando o CI estiver implantado.

**Consequência:** o push direto na `main` é recusado pelo GitHub. A evidência dessa recusa (captura do terminal com a mensagem `GH013: Repository rule violations found`) está em `docs/evidencias/`.

### 5.3 Critérios de Qualidade (Quality Gate)

Para o merge: todos os testes Jest passando, instalação das dependências sem erro e 1 aprovação da revisora. Não há percentual mínimo de cobertura exigido nesta versão, por ser um projeto individual pequeno.

---

## 6. Entrega e Implantação Contínua (CD)

### 6.1 Etapas do Pipeline de CD

Após o merge na `main`, o mesmo workflow executa:

1. Testes (job de CI).
2. Job `staging`: executa no Environment `staging` e valida a versão.
3. **Gate de aprovação:** o job `production` fica pausado até **Mateus aprovar** (revisor obrigatório do Environment `production`).
4. Job `production`: publica a aplicação no GitHub Pages.
5. Conferência manual da página publicada.
6. Criação da tag de release (`vX.Y.Z`).

### 6.2 Estratégia de Implantação

O GitHub Pages substitui a versão publicada de uma só vez (deploy atômico). Não se usam canary, blue-green nem rolling update.

### 6.3 Rollback e Recuperação

A versão anterior é recuperada por uma das opções:

- reverter o commit problemático via Pull Request (`git revert`), o que dispara novo deploy;
- reexecutar, na aba Actions, o workflow de um commit anterior que estava correto.

---

## 7. Configuração como Código (IaC)

Não se aplica IaC tradicional (Terraform, Ansible), pois não há infraestrutura a provisionar. A configuração versionada é a do pipeline, em `.github/workflows`.

As configurações feitas em **Settings** (proteção de branch da `main`, Environments `staging` e `production`, colaboradora) não ficam no repositório. Por isso são documentadas neste plano (seções 3.2 e 5.2), com evidências em `docs/evidencias/`.

---

## 8. Controle de Configuração e Mudança

### 8.1 Processo de Solicitação de Mudança

Fluxo padrão: abertura de Issue → branch `feature/...` → Pull Request → revisão e aprovação da revisora → CI verde → merge → CD (`staging` → aprovação → `production`). Esse fluxo é o registro formal e rastreável da mudança.

### 8.2 Comitê de Controle de Mudança (CCM)

O papel do CCM é exercido por Mateus. É acionado em mudanças de alto impacto, como:

- alteração da estrutura dos dados da tarefa (campos do objeto) de forma incompatível com versões anteriores;
- mudanças nas regras de proteção da `main` ou nos Environments;
- exceções ao fluxo padrão (hotfix emergencial).

Nesses casos, a mudança deve ser descrita no PR e **aprovada pela revisora** antes do merge.

---

## 9. Baselines e Releases

### 9.1 Baseline

Cada versão aprovada e publicada em produção é registrada por uma **tag SemVer** associada ao commit correspondente.

### 9.2 Notas de Versão

As notas são escritas por Mateus na página de **Release** do GitHub, a partir dos Conventional Commits desde a última tag.

---

## 10. Estimativa do Status de Configuração

### 10.1 Monitoramento

O resultado de cada deployment é acompanhado na aba **Actions** e no painel de deployments (Environments) do GitHub.

### 10.2 Métricas

Acompanham-se de forma simplificada duas métricas DORA:

| Métrica | Descrição |
|---|---|
| Deployment Frequency | Frequência de implantações em produção. |
| Change Failure Rate | Percentual de implantações que exigiram correção ou reversão. |

### 10.3 Relatórios e Auditorias

O histórico de PRs, aprovações, execuções do Actions e deployments dos Environments é o principal insumo de auditoria, dispensando relatórios manuais.

---

## 11. Marcos

| Marco | Situação |
|---|---|
| Pipeline de CI (testes a cada push/PR) | Concluído |
| Pipeline de CD (publicação no GitHub Pages) | Concluído |
| Publicação do PGCS em `/docs` | A concluir |
| Proteção da `main` + evidência da recusa de push direto | A concluir |
| Colaboradora @elisamgomes (Write) e PR aprovado por ela | A concluir |
| Environments `staging` e `production` (revisor: Mateus) | A concluir |
| Primeira release pública (`v1.0.0`) | A concluir |

> Atualize a coluna "Situação" e acrescente as datas conforme cada marco for concluído.

---

## 12. Treinamento e Recursos

Ferramentas: Git/GitHub, GitHub Actions, Node.js e Jest. O desenvolvedor concentra o conhecimento necessário, apoiado pela documentação oficial dessas ferramentas.

---

## 13. Dependências de Terceiros

Não há subcontratados nem fornecedores. A única dependência de terceiros é o **Jest**, gerenciado via npm, com versões travadas em `package-lock.json` e monitorado pelo **Dependabot**. As atualizações propostas seguem o mesmo fluxo de PR, revisão e CI.

---

## 14. Quadro-Resumo do Pipeline CI/CD

| Etapa | Descrição | Gatilho |
|---|---|---|
| CI | Instalação das dependências e testes Jest. | Abertura/atualização de PR e push na `main` |
| Revisão | Aprovação da revisora @elisamgomes. | PR com CI verde |
| Merge | Integração na `main` (push direto bloqueado). | 1 aprovação + CI verde |
| CD — `staging` | Execução no Environment `staging`. | Merge na `main` |
| Gate de release | Aprovação manual de Mateus (revisor obrigatório). | Sucesso em `staging` |
| CD — `production` | Publicação no GitHub Pages e tag de release. | Aprovação do gate |
