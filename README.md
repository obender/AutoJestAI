# OpenAI Jest Test Generator

This project uses the OpenAI API to automatically generate Jest tests for JavaScript files.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set your OpenAI API key as an environment variable:

   ```
   export OPENAI_API_KEY='your-api-key-here'
   ```

3. Run the application:
   ```
   node src/index.js <path-to-file-or-folder>
   ```

## Usage

The application can generate tests for a single file or all JavaScript files in a folder:

- For a single file:

  ```
  node src/index.js path/to/your/file.js
  ```

- For a folder:
  ```
  node src/index.js path/to/your/folder
  ```

The generated test files will be saved with the same name as the original file, but with a `.test.js` extension.

## Note

This tool uses AI to generate tests, which may not always be perfect. Always review and adjust the generated tests as needed.

For more information on the OpenAI API, please refer to the [official documentation](https://platform.openai.com/docs/api-reference).
