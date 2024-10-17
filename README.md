# OpenAI Jest Test Generator

This project uses the OpenAI API to automatically generate Jest tests for JavaScript files, with a beautiful and informative command-line interface.

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

## Sample Code

Here's an example of how to use the OpenAI Jest Test Generator:

1. Create a file named `sample.js` with the following content:

```javascript
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };
```

2. Run the test generator:

```
node src/index.js sample.js
```

3. The generator will create a file named `sample.test.js` with content similar to:

```javascript
const { add, subtract } = require("./sample");

describe("add function", () => {
  test("adds two positive numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("adds a positive and a negative number correctly", () => {
    expect(add(5, -3)).toBe(2);
  });
});

describe("subtract function", () => {
  test("subtracts two positive numbers correctly", () => {
    expect(subtract(5, 3)).toBe(2);
  });

  test("subtracts a negative number correctly", () => {
    expect(subtract(5, -3)).toBe(8);
  });
});
```

You can then run these tests using Jest:

```
npx jest sample.test.js
```

## Features

- Colorful console output for better readability
- Loading spinners to show progress
- Clear success and error messages
- Summary of processed files and generated tests

## Note

This tool uses AI to generate tests, which may not always be perfect. Always review and adjust the generated tests as needed.

For more information on the OpenAI API, please refer to the [official documentation](https://platform.openai.com/docs/api-reference).
