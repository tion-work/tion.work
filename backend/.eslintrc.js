module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended"],
  rules: {
    // 防止未闭合的字符串
    quotes: ["error", "double", { avoidEscape: true }],

    // 防止缺少分号
    semi: ["error", "always"],

    // 防止缺少逗号
    "comma-dangle": ["error", "always-multiline"],

    // 防止未使用的变量
    "@typescript-eslint/no-unused-vars": "error",

    // 防止 console.log
    "no-console": "warn",

    // 强制使用 const
    "prefer-const": "error",

    // TypeScript 特定规则
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-inferrable-types": "off",
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: [
    "dist/",
    "node_modules/",
    "*.js",
    "**/__tests__/**",
    "**/*.test.ts",
  ],
};
