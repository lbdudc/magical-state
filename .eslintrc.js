module.exports = {
  extends: "plugin:prettier/recommended",
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    "no-undef": "error",
    "no-unused-vars": "warn"
  },
  globals: {
    L: false,
    MV: false
  },
  parserOptions: {
    sourceType: "module"
  }
};
