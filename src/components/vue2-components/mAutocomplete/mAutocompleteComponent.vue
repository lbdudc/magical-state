<template>
  <v-container
    class="ma-0 pa-0"
    v-if="store"
  >
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
          :multiple="item.type === 'multiple'"
          :outlined="outlined"
          :persistent-hint="persistentHint"
          :prepend-icon="prependIcon"
          :prepend-inner-icon="prependInnerIcon"
          :reverse="reverse"
          :small-chips="smallChips"
          :solo="solo"
          :error-messages="i18Label(errorMessage)"
          v-model="itemValue"
        >
          <template v-slot:selection="{item, index}">
            <slot :item="item" :index="index" name="selection">
            </slot>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import selectorItemPositionHelper from "../common/selectorItemPositionHelper";

let selectedPrevPos = {};

export default {
  name: "MagicalSelector",
  data() {
    return {
      errorMessage: null,
    };
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
    overrideStoreChange: {
      type: Boolean,
      default: false,
      required: false,
    },
    pushSelectedValuesUp: {
      type: Boolean,
      default: false,
      required: false,
    },
    rules: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  computed: {
    item() {
      return this.store.getSelector(this.id);
    },
    itemValue: {
      get() {
        return this.item.value;
      },
      set(newVal) {
        const error = this.rules.find((f) => f(newVal) != true);
        if (error == null) {
          this.change(this.item.id, newVal);
        } else {
          this.errorMessage = error(newVal);
          this.item.hasErrors = true;
          this.$emit("onInputError", this.id);
        }
      },
    },
  },
  mounted() {
    if (
      this.pushSelectedValuesUp &&
      this.item.type === "multiple" &&
      this.item.value &&
      this.item.value.length > 0
    ) {
      this.item.value.forEach((v) => {
        const { items, positions } = selectorItemPositionHelper.itemSelection(
          v,
          this.item.items,
          selectedPrevPos
        );
        this.item.items = items;
        selectedPrevPos = positions;
      });
    }
    if (this.rules.length > 0) {
      document.addEventListener("checkErrors", this.checkForErrors);
    }
  },
  beforeDestroy() {
    document.removeEventListener("checkErrors", this.checkForErrors);
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
    async change(id, val) {
      this.errorMessage = null;
      this.item.hasErrors = false;
      this.item.value = val;
      if (this.pushSelectedValuesUp && this.item.type === "multiple") {
        if (val.length > Object.keys(selectedPrevPos).length) {
          //get the new element and its current position on the items
          const newEl = val.filter((x) => selectedPrevPos[x] == null);
          const { items, positions } = selectorItemPositionHelper.itemSelection(
            newEl,
            this.item.items,
            selectedPrevPos
          );
          this.item.items = items;
          selectedPrevPos = positions;
        } else {
          const { items, positions } =
            selectorItemPositionHelper.itemDeselection(
              val,
              this.item.items,
              selectedPrevPos
            );
          this.item.items = items;
          selectedPrevPos = positions;
        }
      }
      if (!this.overrideStoreChange) {
        await this.store.change(id, val);
      }
      this.$emit("change", { id, val });
    },
    checkForErrors() {
      const error = this.rules.find((f) => f(this.itemValue) != true);
      if (error == null) {
        this.change(this.id, this.itemValue);
      }
    },
  },
};
</script>

<style></style>
