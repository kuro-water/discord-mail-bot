import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
    {files: ["**/*.{js,mjs,cjs,ts}"]},
    {languageOptions: {globals: {...globals.browser, ...globals.node}}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "no-console": "off",
            indent: ["error", 4], // インデントを4スペースで強制
            quotes: ["error", "double"], // ダブルクォートを強制
            semi: ["error", "always"],
            camelcase: ["error", {properties: "always"}], // キャメルケースを強制
            "no-magic-numbers": ["warn", {ignore: [0, 1]}], // マジックナンバーの使用を警告
            "prefer-const": ["error"], // 再代入されない変数に const を推奨
        }
    }
];