/**
 * This is the new flat config for Eslint.v9, note:
 * "eslint.useFlatConfig: true" - must be set in VSC 'settings.json'
 */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/next.config.js", "**/tsconfig.json", "node_modules/**/*", ".next/types/**/*.ts"],
  },
  ...fixupConfigRules(
    compat.extends(
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:prettier/recommended",
      "plugin:@typescript-eslint/recommended",
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked",
      "plugin:import/recommended",
      "plugin:import/typescript"
    )
  ),
  {
    plugins: {
      "react-refresh": reactRefresh,
      react: fixupPluginRules(react),
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      prettier: fixupPluginRules(prettier),
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: true,
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

      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "error",
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
];
