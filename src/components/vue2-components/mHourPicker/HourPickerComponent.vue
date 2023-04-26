<template>
  <magical-text-field
    :id="id"
    :store="store"
    :i18n="i18n"
    type="time"
    :prepend-inner-icon="prependInnerIcon"
    :append-icon="appendIcon"
    :dense="dense"
    :disabled="disabled"
    :readonly="readonly"
    :rules="rules"
    :override-store-change="overrideStoreChange"
    :hide-details="hideDetails"
    @change="change"
    @on-input-error="onInputError"
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
    hideDetails: {
      type: Boolean | String,
      required: false,
      default: false,
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
    onInputError() {
      this.$emit("onInputError", this.id);
    },
  },
};
</script>
