module.exports = {
  extends: ['../../packages/config/eslint/library.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['scripts/**/*'],
  root: true,
};