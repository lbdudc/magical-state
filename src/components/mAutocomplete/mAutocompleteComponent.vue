<template>
  <v-container class="ma-0 pa-0" v-if="store">
    <v-row no-gutters>
      <v-col cols="12">
        <v-autocomplete
          :label="i18Label(item.label)"
          :items="item.items"
          :loading="item.loading || store.state.loading"
          :disabled="item.loading || store.state.loading"
          :clearable="clearable"
          :dense="dense"
          :outlined="outlined"
          v-model="item.value"
          :item-text="(el) => i18Label(el.label)"
          item-value="value"
          @change="store.change(item.id, item.value)"
        ></v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MagicalSelector",
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
    group: {
      type: String,
      required: false,
      default: null,
    },
    i18n: {
      type: Function,
      required: false,
      default: null,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false,
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false,
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    item() {
      return this.store.observable.find((el) => el.id === this.id);
    },
  },
  watch: {
    "item.value": {
      handler(newVal) {
        this.$emit("change", {
          id: this.item.id,
          value: newVal,
          store: this.store.observable,
        });
      },
      deep: true,
    },
  },
  methods: {
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
  },
};
</script>

<style></style>
