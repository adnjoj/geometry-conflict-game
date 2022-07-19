const typescript = require('typescript');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['svelte3', '@typescript-eslint'],
  settings: {
    'svelte3/typescript': typescript,
    'svelte3/ignore-styles': () => true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/first': 'off',
        'import/no-duplicates': 'off',
        'import/no-mutable-exports': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-multiple-empty-lines': 'off',
      },
    },
  ],
  ignorePatterns: ['node_modules'],
  rules: {
    'import/prefer-default-export': 'off',
  },
};
