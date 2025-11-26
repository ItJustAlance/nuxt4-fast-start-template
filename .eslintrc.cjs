module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended', // Включает интеграцию Prettier с ESLint
    'prettier', // Отключает конфликтующие правила ESLint, чтобы Prettier мог форматировать код
  ],
  plugins: [
    'import', // Плагин для управления импортами
    'vue', // Поддержка Vue.js
    'prettier', // Плагин Prettier для применения правил форматирования как ESLint-правил
  ],
  rules: {
    'prettier/prettier': [
      'error', // Отображает ошибки для нарушений правил Prettier
      {
        semi: true, // Использовать точку с запятой в конце строки
        singleQuote: true, // Использовать одинарные кавычки
        trailingComma: 'all', // Запятые в конце всех объектов и массивов
        printWidth: 120, // Максимальная ширина строки
        tabWidth: 2, // Ширина табуляции — 2 пробела
        useTabs: false, // Использовать пробелы вместо табуляции
        bracketSpacing: true, // Пробелы внутри фигурных скобок { foo: bar }
        endOfLine: 'crlf', // Устанавливаем 'lf' как символ конца строки
      },
    ],
    'linebreak-style': ['error', 'windows'], // или 'crlf'
    // 'no-console': 'warn',
    'no-console': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-comment-content-newline': 'off',
    'import/order': [
      'error',
      {
        // 'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
  },
};
