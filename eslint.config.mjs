import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // データ整備・OCR用の使い捨てスクリプト群。アプリ本体ではないため対象外。
    "scripts/**",
    "scratch/**",
  ]),
  {
    rules: {
      // any の使用は警告として可視化する（段階的に解消する。エラーには昇格させていない）
      "@typescript-eslint/no-explicit-any": "warn",
      // _ 始まりの引数・変数は「意図的に未使用」とみなす
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
    }
  }
]);

export default eslintConfig;
