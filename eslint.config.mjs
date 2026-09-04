import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "@next/next/no-img-element": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    files: ["components/resumeBuilder/CVDocument.tsx"],
    rules: {
      // Immutable legacy homepage PDF: keep its source byte-for-byte stable.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  prettier,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "coverage/**",
    "tmp/**",
    "next-env.d.ts",
    "*.tsbuildinfo",
  ]),
]);
