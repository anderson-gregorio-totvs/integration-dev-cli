#!/usr/bin/env node

const { Command } = require("commander");
const simpleGit = require("simple-git");

const git = simpleGit();
const program = new Command();

program
  .name("integration-dev-cli")
  .description(
    "CLI para criar branches de integração com cherry-pick do último commit na development"
  )
  .action(async () => {
    try {
      // 1. Recupera o nome da branch atual
      const status = await git.status();
      const currentBranch = status.current;
      console.log(`📍 Branch atual: ${currentBranch}`);

      // 2. Recupera o ID do último commit na branch atual
      const log = await git.log({ maxCount: 1 });
      const lastCommitHash = log.latest.hash;
      console.log(`🆔 Último commit: ${lastCommitHash}`);

      // 3. Muda para a branch development
      await git.checkout("development");
      console.log("🔄 Feito checkout para a branch development");

      // 4. Atualiza a branch development com pull --rebase
      await git.pull("origin", "development", { "--rebase": "true" });
      console.log("📥 Pull com rebase feito na branch development");

      // 5. Cria a nova branch com prefixo "integration_"
      const newBranch = `integration_${currentBranch}`;
      await git.checkoutBranch(newBranch, "development");
      console.log(`🌿 Nova branch criada: ${newBranch}`);

      // 6. Cherry-pick do commit salvo anteriormente
      await git.raw(["cherry-pick", lastCommitHash]);
      console.log(`✅ Cherry-pick do commit ${lastCommitHash} realizado`);

      // 7. Push da nova branch
      await git.push("origin", newBranch);
      console.log(`🚀 Push realizado para origin/${newBranch}`);
    } catch (error) {
      console.error("❌ Erro durante a execução da CLI:", error.message);
    }
  });

program.parse(process.argv);
