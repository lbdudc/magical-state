<template>
  <v-form :ref="'form-' + storeElement.id">
    <v-text-field
      v-model="itemValue"
      :label="i18n ? i18n(storeElement.label) : ''"
      :prependInnerIcon="prependInnerIcon"
      :appendIcon="appendIcon"
      :dense="dense"
      :disabled="disabled"
      :rules="rules"
      :type="type"
      :loading="storeElement.loading || store.state.loading"
      @change="valueChanged(itemValue)"
      :readonly="readonly"
      clearable
    ></v-text-field>
  </v-form>
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
    overrideStoreChange: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      itemValue: null,
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
  },
  methods: {
    async valueChanged(newVal) {
      if (this.$refs["form-" + this.storeElement.id].validate()) {
        this.storeElement.value = newVal;
        if (!this.overrideStoreChange) {
          await this.store.change(this.id, newVal);
        }
        const { id } = this.storeElement;
        this.$emit("change", { id, val: newVal });
      } else {
        this.$emit("input-error", this.id);
      }
    },
  },
};
</script>
