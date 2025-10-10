import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 防止未闭合的字符串
      quotes: ["error", "double", { avoidEscape: true }],
      "jsx-quotes": ["error", "prefer-double"],

      // 防止缺少分号
      semi: ["error", "always"],

      // 防止缺少逗号
      "comma-dangle": ["error", "always-multiline"],

      // 防止未使用的变量
      "no-unused-vars": "error",

      // 防止 console.log
      "no-console": "warn",

      // 强制使用 const
      "prefer-const": "error",

      // 防止未闭合的 JSX
      "react/jsx-closing-bracket-location": "error",
      "react/jsx-closing-tag-location": "error",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
