const fs = require("fs");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const glob = require("glob");

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateTest(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");

  const prompt = `Generate a Jest test for the following code:\n\n${fileContent}\n\nJest test:`;

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    max_tokens: 500,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  return response.data.choices[0].text.trim();
}

async function processFile(filePath) {
  const testContent = await generateTest(filePath);
  const dirname = path.dirname(filePath);
  const basename = path.basename(filePath, path.extname(filePath));
  const testFilePath = path.join(dirname, `${basename}.test.js`);

  fs.writeFileSync(testFilePath, testContent);
  console.log(`Generated test for ${filePath} at ${testFilePath}`);
}

async function processFolder(folderPath) {
  const files = glob.sync(path.join(folderPath, "**/*.js"), { ignore: ["**/*.test.js", "**/node_modules/**"] });

  for (const file of files) {
    await processFile(file);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Please provide a file or folder path");
    process.exit(1);
  }

  const target = args[0];
  const stats = fs.statSync(target);

  if (stats.isFile()) {
    await processFile(target);
  } else if (stats.isDirectory()) {
    await processFolder(target);
  } else {
    console.error("Invalid path");
    process.exit(1);
  }
}

main().catch(console.error);
