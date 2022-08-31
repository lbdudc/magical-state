<template>
  <magical-text-field
    :store="store"
    :id="id"
    :i18n="i18n"
    type="time"
    :prependInnerIcon="prependInnerIcon"
    :appendIcon="appendIcon"
    :dense="dense"
    :disabled="disabled"
    :readonly="readonly"
    :rules="rules"
    :overrideStoreChange="overrideStoreChange"
    @change="change"
    @input-error="inputError"
  />
</template>
<script>
import MagicalTextField from "../mTextField/TextFieldComponent.vue";

export default {
  name: "HourPickerComponent",
  components: {
    MagicalTextField,
  },
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
    overrideStoreChange: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  methods: {
    change(changedEl) {
      this.$emit("change", changedEl);
    },
    inputError() {
      this.$emit("input-error", this.id);
    },
  },
};
</script>