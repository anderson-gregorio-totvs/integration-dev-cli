#!/usr/bin/env node

const { Command } = require("commander");
const simpleGit = require("simple-git");
const readline = require("readline");

const git = simpleGit();
const program = new Command();

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
};

program
  .name("integration-dev-cli")
  .description(
    "CLI para realizar cherry-pick de múltiplos commits na branch de desenvolvimento (development ou develop)"
  )
  .action(async () => {
    try {
      //#region Verificar branch de desenvolvimento remoto

      const branches = await git.branch(["-r"]);
      const remoteBranches = branches.all;

      let targetBranch = null;
      if (remoteBranches.includes("origin/development")) {
        targetBranch = "development";
      } else if (remoteBranches.includes("origin/develop")) {
        targetBranch = "develop";
      } else {
        console.error(
          "❌ Nenhuma branch 'development' ou 'develop' encontrada no remoto."
        );
        process.exit(1);
      }

      console.log(`📍 Branch de destino: ${targetBranch}`);

      //#endregion

      //#region Perguntar quantidade de commits

      const answer = await askQuestion(
        "Qual a quantidde commits deseja realizar cherry-pickar? (default: 1) "
      );
      const numberOfCommits = answer === "" ? 1 : parseInt(answer);

      if (isNaN(numberOfCommits) || numberOfCommits <= 0) {
        console.error("❌ Quantidade inválida de commits.");
        process.exit(1);
      }

      //#endregion

      //#region Obter branch atual

      const status = await git.status();
      const currentBranch = status.current;
      console.log(`📌 Branch atual: ${currentBranch}`);

      //#endregion

      //#region Recuperar os últimos X commits

      const log = await git.log({ maxCount: numberOfCommits });
      const commitsToPick = log.all.reverse(); // Ordem cronológica

      console.log("\n🆔 Commits selecionados para cherry-pick:\n");
      commitsToPick.forEach((commit, index) => {
        console.log(`${index + 1}. ${commit.hash} - ${commit.message}`);
      });

      //#endregion

      //#region Checkout na branch de destino

      await git.checkout(targetBranch);
      console.log(`\n🔄 Feito checkout para a branch ${targetBranch}`);

      //#endregion

      //#region Pull com rebase

      await git.pull("origin", targetBranch, { "--rebase": "true" });
      console.log("📥 Pull com rebase realizado\n");

      //#endregion

      //#region Cherry-pick dos commits

      for (const commit of commitsToPick) {
        console.log(`🍒 Cherry-pick commit: ${commit.hash}`);
        await git.raw(["cherry-pick", commit.hash]);
      }

      //#endregion

      //#region Confirmação antes do push

      const confirmPush = await askQuestion(
        "\n❓ Deseja fazer o push para o remoto? (Y/n) (default: yes): "
      );

      if (
        confirmPush === "" ||
        confirmPush.toLowerCase() === "y" ||
        confirmPush.toLowerCase() === "yes"
      ) {
        await git.push("origin", targetBranch);
        console.log(`🚀 Push realizado para origin/${targetBranch}`);
      } else {
        console.log("🚫 Push cancelado pelo usuário.");
      }

      //#endregion
    } catch (error) {
      console.error("\n❌ Erro durante a execução da CLI:", error.message);
    }
  });

program.parse(process.argv);
