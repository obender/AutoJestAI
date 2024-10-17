import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { jest } from "@jest/globals";
import { main } from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "mocked test content" } }],
        }),
      },
    },
  })),
}));

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  writeFileSync: jest.fn(),
  statSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue("mock file content"),
}));

jest.mock("glob", () => ({
  sync: jest.fn().mockReturnValue(["mockFile1.js", "mockFile2.js"]),
}));

describe("auto-jest-ai", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.argv = ["node", "index.js", "mockPath"];
  });

  test("processes a single file", async () => {
    fs.statSync.mockReturnValue({ isFile: () => true, isDirectory: () => false });

    await main();

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining("mockPath.test.js"), "mocked test content");
  });

  test("processes a directory", async () => {
    fs.statSync.mockReturnValue({ isFile: () => false, isDirectory: () => true });

    await main();

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(1, expect.stringContaining("mockFile1.test.js"), "mocked test content");
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(2, expect.stringContaining("mockFile2.test.js"), "mocked test content");
  });

  test("handles invalid path", async () => {
    fs.statSync.mockReturnValue({ isFile: () => false, isDirectory: () => false });

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await main();

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("Invalid path"));

    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  test("handles missing path argument", async () => {
    process.argv = ["node", "index.js"];

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await main();

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("Please provide a file or folder path"));

    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });
});
