// .eslintrc.js

module.exports = {
  extends: [
    '@akijoey',
    'standard-with-typescript',
    'prettier/@typescript-eslint',
    'prettier/react'
  ],
  plugins: ['react'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 0
  }
}
