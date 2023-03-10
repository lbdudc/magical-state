module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    "no-fallthrough": "off",
    "no-case-declarations": "off",
    "no-async-promise-executor": "off",
    "no-unused-vars": "off",
    "vue/require-prop-type-constructor": "off",
    "no-useless-catch": "off",
    "vue/require-explicit-emits": "off",
    "vue/no-template-shadow": "off",
  },
};
