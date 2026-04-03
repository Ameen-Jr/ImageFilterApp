import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react" } }],
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFiles: ["./__tests__/setup.ts"],
};

export default config;
