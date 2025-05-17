# 🛠️ Integration Development CLI

Este é um utilitário de linha de comando (CLI) em Node.js que automatiza o processo de criação de uma branch de integração a partir da branch development, aplicando o último commit de uma outra branch usando git cherry-pick.

## 📦 Requisitos

- Node.js v14 ou superior
- Git instalado e configurado
- A branch `development` deve existir e estar atualizada com o repositório remoto
- Ter permissões de push para o repositório Git

## 🚀 Instalação

1. Clone este repositório:

```bash
git clone https://github.com/anderson-gregorio-totvs/integration-dev-cli
cd integration-dev-cli
```

2. Instale as dependências:

```bash
npm install
```

3. Torne o script executável e registre como CLI:

```bash
chmod +x index.js
npm link
```

| Isso tornará o comando integration-cli disponível globalmente no seu terminal.

## 📌 Como Usar

Navegue até a raiz do repositório Git onde deseja usar o script e execute:

```bash
integration-cli
```

## ✅ O que o script faz

1. Detecta a branch atual (ex: feature/nova-funcionalidade)
2. Armazena o ID do último commit da branch atual
3. Muda para a branch `development`
4. Executa `git pull --rebase` para atualizar a branch development
5. Cria uma nova branch chamada `integration_feature/nova-funcionalidade` a partir de `development`
6. Executa `git cherry-pick` do último commit salvo
7. Realiza `git push` da nova branch para o repositório remoto

## 🧪 Exemplo de Fluxo

```bash
# Estando na branch feature/ajuste-api
git checkout feature/ajuste-api

# Rode a CLI
integration-cli
```

Esse comando criará e fará push de uma nova branch chamada `integration_feature/ajuste-api` com o último commit.

## 🧯 Possíveis Erros

- ❌ "error: could not apply...": conflitos no cherry-pick. Resolva e finalize o cherry-pick com git cherry-pick --continue.
- ❌ "branch `development` not found": certifique-se de que sua branch development existe localmente e remotamente.
- ❌ Permissões de push negadas: verifique suas credenciais de acesso ao repositório.
