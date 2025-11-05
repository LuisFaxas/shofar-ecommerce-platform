module.exports = {
  extends: ['@shofar/config/eslint/base.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  root: true,
};