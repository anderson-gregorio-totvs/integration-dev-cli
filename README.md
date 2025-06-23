# 🛠️ Integration Development CLI

CLI para aplicar cherry-pick de múltiplos commits diretamente na branch de desenvolvimento (`development` ou `develop`).

## 📦 Requisitos

- Node.js v14 ou superior
- Git instalado e configurado
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
chmod +x index.js   // este comando deve ser executado somente em ambientes linux
npm link
```

| Isso tornará o comando integration-cli disponível globalmente no seu terminal.

## 📌 Como Usar

Navegue até a raiz do repositório Git onde deseja usar o script e execute:

```bash
integration-dev-cli
```

## ✅ O que o script faz

1. Detectar a branch de destino (`development` ou `develop`) no remoto.
2. Perguntar a quantidade de commits recentes da sua branch atual você deseja realizar o cherry-pick.
3. Trocar automaticamente para a branch de destino (`development` ou `develop`).
4. Executa `git pull --rebase` para atualizar.
5. Executa `git cherry-pick` dos commit' selecionados.
6. Realizar o push da branch de desenvolvimento.

## 🧪 Exemplo de execução

```bash
📍 Branch de destino: development
📌 Branch atual: feature/login
Quantos últimos commits deseja cherry-pickar? 2
🆔 Commits selecionados para cherry-pick:
abc1234 - feat(button): implmenta ....
def5678 - fix(button): ajusta ....
🔄 Feito checkout para a branch development
📥 Pull com rebase realizado
🍒 Cherry-pickando commit: abc1234
🍒 Cherry-pickando commit: def5678
🚀 Push realizado para origin/development
```

## 🧯 Possíveis Erros

- ❌ "error: could not apply...": conflitos no cherry-pick. Resolva e finalize o cherry-pick com git cherry-pick --continue.
- ❌ Permissões de push negadas: verifique suas credenciais de acesso ao repositório.
