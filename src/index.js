const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const glob = require("glob");
const chalk = require("chalk");
const ora = require("ora");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTest(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");

  const spinner = ora("Generating test...").start();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates Jest tests." },
        { role: "user", content: `Generate a Jest test for the following code:\n\n${fileContent}` },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    spinner.succeed("Test generated successfully");
    return response.choices[0].message.content.trim();
  } catch (error) {
    spinner.fail("Failed to generate test");
    throw error;
  }
}

async function processFile(filePath) {
  console.log(chalk.cyan(`\nProcessing file: ${filePath}`));
  const testContent = await generateTest(filePath);
  const dirname = path.dirname(filePath);
  const basename = path.basename(filePath, path.extname(filePath));
  const testFilePath = path.join(dirname, `${basename}.test.js`);

  fs.writeFileSync(testFilePath, testContent);
  console.log(chalk.green(`✔ Generated test for ${filePath} at ${testFilePath}`));
}

async function processFolder(folderPath) {
  console.log(chalk.yellow(`\nProcessing folder: ${folderPath}`));
  const files = glob.sync(path.join(folderPath, "**/*.js"), { ignore: ["**/*.test.js", "**/node_modules/**"] });

  console.log(chalk.blue(`Found ${files.length} file(s) to process`));

  for (const file of files) {
    await processFile(file);
  }
}

// Main function
async function main() {
  console.log(chalk.bold.magenta("\n🚀 OpenAI Jest Test Generator 🚀\n"));

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(chalk.red("Please provide a file or folder path"));
    process.exit(1);
  }

  const target = args[0];
  const stats = fs.statSync(target);

  if (stats.isFile()) {
    await processFile(target);
  } else if (stats.isDirectory()) {
    await processFolder(target);
  } else {
    console.error(chalk.red("Invalid path"));
    process.exit(1);
  }

  console.log(chalk.bold.green("\n✨ All tests generated successfully! ✨"));
}

main().catch((error) => {
  console.error(chalk.red("An error occurred:"), error);
});
