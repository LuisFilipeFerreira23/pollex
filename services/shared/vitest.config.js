import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    testTimeout: 10000,
    env: {
      TASKS_POSTGRES_URL: "postgres://test:test@localhost:5432/test",
      JWT_PRIVATE_KEY: "test-secret-key",
    },
    setupFiles: ["./vitest.setup.js"],
  },
});
