module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  // plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript/base'],
  env: {
    browser: false,
    node: true
  },
  rules: {
    "func-names": 0
  }
};
