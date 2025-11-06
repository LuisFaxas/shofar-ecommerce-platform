module.exports = {
  root: true,
  extends: ['@shofar/config/eslint/base.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  }
};