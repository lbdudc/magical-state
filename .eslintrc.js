module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    "no-case-declarations": "off",
    "no-async-promise-executor": "off",
    "no-useless-catch": "off",
  },
};
