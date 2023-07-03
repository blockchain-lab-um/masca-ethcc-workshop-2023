module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    sourceType: 'module',
  },
};
