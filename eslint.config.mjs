import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import { fixupPluginRules, fixupConfigRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import esLintConfigPrettier from "eslint-config-prettier";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname || __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = defineConfig([
  // importPlugin.flatConfigs.typescript,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,

  ...nextVitals,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // js.configs.recommended,
  // Ignore patterns
  // ...fixupConfigRules(
  //   compat.extends(
  //     "next/core-web-vitals",
  //     "next/typescript",
  //     "plugin:react/recommended",
  //     "plugin:prettier/recommended",
  //     "plugin:@typescript-eslint/recommended",
  //     "plugin:@typescript-eslint/recommended-type-checked",
  //     "plugin:@typescript-eslint/stylistic-type-checked",
  //     "plugin:import/recommended",
  //   )
  // ),
  {
    ignores: [
      "**/next.config.js",
      "**/tsconfig.json",
      "node_modules/**/*",
      ".next/types/**/*.ts",
      "src/server/actions/images/sharp/worker/sharp-worker.js",
    ],
  },
  // Base config for JS/TS files
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "react-refresh": reactRefresh,
      prettier: fixupPluginRules(prettier),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      esLintConfigPrettier,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: true,
        project: ["./tsconfig.json", "tsconfig.node.json", "tsconfig.app.json"],
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      "import/internal-regex": "^/",
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",

      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "@typescript-eslint/require-await": "off",

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      curly: "warn",

      "no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],

      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],

      eqeqeq: [
        "error",
        "always",
        {
          null: "ignore",
        },
      ],

      "template-curly-spacing": "error",
      "rest-spread-spacing": ["error", "never"],
      "no-debugger": "error",
      "prettier/prettier": "error",
      "no-duplicate-imports": "error",

      "no-console": [
        "warn",
        {
          allow: ["info", "warn", "error"],
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-floating-promises": "warn",

      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "import/no-named-as-default-member": "off",
      "import/first": "warn",

      "import/newline-after-import": [
        "warn",
        {
          count: 1,
        },
      ],

      "import/prefer-default-export": "off",
      "import/group-exports": "off",
      "import/no-named-as-default": "off",
      "react/react-in-jsx-scope": "off",

      "react/no-unknown-property": [
        "error",
        {
          ignore: ["jsx"],
        },
      ],

      "react/prop-types": "off",

      "react/jsx-sort-props": [
        "warn",
        {
          ignoreCase: false,
          callbacksLast: true,
          shorthandFirst: true,
          reservedFirst: true,
        },
      ],

      "import/order": [
        "warn",
        {
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "after",
            },
            {
              pattern: "@",
              group: "internal",
              position: "before",
            },
          ],

          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["external"],

          groups: [
            "external",
            "unknown",
            "internal",
            ["sibling", "parent"],
            "builtin",
            "index",
            "object",
            "type",
          ],
        },
      ],

      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",

          prev: [
            "block",
            "block-like",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "do",
            "empty",
            "for",
            "function",
            "if",
            "iife",
            "import",
            "let",
            "return",
            "switch",
            "throw",
            "try",
            "var",
            "while",
            "with",
          ],

          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var", "import", "export"],
          next: ["const", "let", "var", "import", "export"],
        },
        {
          blankLine: "always",
          prev: ["*"],
          next: ["return"],
        },
      ],
    },
  },
]);

export default eslintConfig;
