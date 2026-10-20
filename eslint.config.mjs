import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "node_modules/**"],
  },
  ...compat.config({
    extends: ["next", "prettier"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  }),
];

export default eslintConfig;
