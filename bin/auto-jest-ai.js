#!/usr/bin/env node

import { main } from "../src/index.js";

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
