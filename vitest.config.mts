/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: { globals: true, minWorkers: 1, maxWorkers: 1 },
  plugins: [tsconfigPaths()],
});
