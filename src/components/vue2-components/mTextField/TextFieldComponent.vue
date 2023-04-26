<template>
  <v-text-field
    v-model="itemValue"
    :label="i18n ? i18n(storeElement.label) : ''"
    :prepend-inner-icon="prependInnerIcon"
    :append-icon="appendIcon"
    :dense="dense"
    :disabled="disabled"
    :error-messages="i18Label(errorMessage)"
    :type="type"
    :loading="storeElement.loading || store.state.loading"
    :readonly="readonly"
    clearable
    @change="valueChanged(itemValue)"
  ></v-text-field>
</template>
<script>
export default {
  name: "MagicalTextField",
  props: {
    store: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: false,
      default: null,
    },
    i18n: {
      type: Function,
      required: false,
      default: null,
    },
    prependInnerIcon: {
      type: String,
      required: false,
      default: null,
    },
    appendIcon: {
      type: String,
      required: false,
      default: null,
    },
    dense: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    readonly: {
      type: Boolean,
      required: false,
    },
    rules: {
      type: Array,
      required: false,
      default: () => [],
    },
    type: {
      type: String,
      default: "text",
      required: false,
    },
    overrideStoreChange: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      itemValue: null,
      errorMessage: null,
    };
  },
  computed: {
    storeElement() {
      return this.store.getSelector(this.id);
    },
  },
  watch: {
    "storeElement.value": function (newVal) {
      this.itemValue = newVal;
    },
  },
  mounted() {
    this.itemValue = this.storeElement.value;
    if (this.rules.length > 0) {
      document.addEventListener("checkErrors", this.checkForErrors);
    }
  },
  beforeUnmount() {
    document.removeEventListener("checkErrors", this.checkForErrors);
  },
  methods: {
    async valueChanged(newVal) {
      const error = this.rules.find((f) => f(newVal) != true);
      if (error == null) {
        this.storeElement.value = newVal;
        this.errorMessage = null;
        this.storeElement.hasErrors = false;
        if (!this.overrideStoreChange) {
          await this.store.change(this.id, newVal);
        }
        const { id } = this.storeElement;
        this.$emit("change", { id, val: newVal });
      } else {
        this.errorMessage = error(newVal);
        this.storeElement.hasErrors = true;
        this.$emit("onInputError", this.id);
      }
    },
    checkForErrors() {
      const error = this.rules.find((f) => f(this.itemValue) != true);
      if (error == null && this.storeElement.value != this.itemValue) {
        this.valueChanged(this.itemValue);
      }
    },
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
  },
};
</script>
