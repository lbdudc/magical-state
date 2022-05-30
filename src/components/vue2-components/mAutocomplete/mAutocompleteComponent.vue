<template>
  <v-container class="ma-0 pa-0" v-if="store">
    <v-row no-gutters>
      <v-col cols="12">
        <v-autocomplete
          :append-icon="appendIcon"
          :append-outer-icon="appendOuterIcon"
          :background-color="backgroundColor"
          :chips="chips"
          :clearable="clearable"
          :color="color"
          :deletable-chips="deletableChips"
          :dense="dense"
          :disabled="item.loading || store.state.loading || disabled"
          :filled="filled"
          :flat="flat"
          :hint="hint"
          :item-color="itemColor"
          :item-text="(el) => i18Items(el.label)"
          :items="item.items"
          :label="i18Label(item.label)"
          :loading="item.loading || store.state.loading"
          :multiple="multiple"
          :outlined="outlined"
          :persistent-hint="persistentHint"
          :prepend-icon="prependIcon"
          :prepend-inner-icon="prependInnerIcon"
          :reverse="reverse"
          :small-chips="smallChips"
          :solo="solo"
          item-value="value"
          v-model="item.value"
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
    i18nLabel: {
      type: Function,
      required: false,
      default: null,
    },
    i18nItems: {
      type: Function,
      required: false,
      default: null,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
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
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    appendIcon: {
      type: String,
      required: false,
      default: "$dropdown",
    },
    appendOuterIcon: {
      type: String,
      required: false,
      default: null,
    },
    prependIcon: {
      type: String,
      required: false,
      default: null,
    },
    prependInnerIcon: {
      type: String,
      required: false,
      default: null,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
    backgroundColor: {
      type: String,
      required: false,
      default: null,
    },
    itemColor: {
      type: String,
      required: false,
      default: "primary",
    },
    chips: {
      type: Boolean,
      required: false,
      default: false,
    },
    smallChips: {
      type: Boolean,
      required: false,
      default: false,
    },
    deletableChips: {
      type: Boolean,
      required: false,
      default: false,
    },
    filled: {
      type: Boolean,
      required: false,
      default: false,
    },
    solo: {
      type: Boolean,
      required: false,
      default: false,
    },
    flat: {
      type: Boolean,
      required: false,
      default: false,
    },
    reverse: {
      type: Boolean,
      required: false,
      default: false,
    },
    hint: {
      type: String,
      required: false,
      default: null,
    },
    persistentHint: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    item() {
      return this.store.find;
    },
  },
  methods: {
    i18Label(label) {
      if (label) return this.i18nLabel ? this.i18nLabel(label) : label;
      return "";
    },
    i18Items(text) {
      if (text) return this.i18nItems ? this.i18nItems(text) : text;
      return "";
    },
  },
};
</script>

<style></style>
