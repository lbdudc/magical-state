<template>
  <v-text-field
    v-model="storeElement.value"
    :label="i18n ? i18n(storeElement.label) : ''"
    :prependInnerIcon="prependInnerIcon"
    :appendIcon="appendIcon"
    :dense="dense"
    :disabled="disabled"
    :rules="rules"
    :type="type"
    :loading="storeElement.loading || store.state.loading"
    @change="valueChanged(storeElement.value)"
    :readonly="readonly"
    clearable
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
    },
    appendIcon: {
      type: String,
      required: false,
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
    },
    type: {
      type: String,
      default: "text",
      required: false,
    },
    overrideOnChange: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    storeElement() {
      return this.store.getSelector(this.id);
    },
  },
  methods: {
    async valueChanged(newVal) {
      if (!this.overrideOnChange) {
        await this.store.change(this.id, newVal);
      }
      const { id, value } = this.storeElement;
      this.$emit("change", { id, val: value });
    },
  },
};
</script>
