<template>
  <v-container class="ma-0 pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-select
          v-model="itemValue"
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
          :item-text="(el) => i18Items(el)"
          :items="item.items"
          :label="i18Label(item.label)"
          :loading="(item.loading || store.state.loading) && !hideLoading"
          :multiple="multiple"
          :outlined="outlined"
          :persistent-hint="persistentHint"
          :prepend-icon="prependIcon"
          :prepend-inner-icon="prependInnerIcon"
          :reverse="reverse"
          :small-chips="smallChips"
          :solo="solo"
          :error-messages="i18Label(errorMessage)"
          :hide-details="hideDetails"
          :menu-props="{
            closeOnContentClick: true,
          }"
        >
          <template v-if="superdense" #item="{ item }">
            <v-list-item style="height: 24px; min-height: 24px; padding: 0px">
              <button
                :style="{
                  backgroundColor: item.hovered ? 'lightgray' : '',
                  width: '100%',
                  height: '100%',
                }"
                @click="superdenseSelected(item)"
                @mouseover="handleMouseOver(item)"
                @mouseout="handleMouseOut(item)"
              >
                {{ translate(item.label, item.params) }}
              </button>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import selectorItemPositionHelper from "../common/selectorItemPositionHelper";

let selectedPrevPos = {};
export default {
  name: "MagicalSelector",
  props: {
    store: {
      type: Object,
      required: false,
      default: null,
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
    superdense: {
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
    hideDetails: {
      type: [Boolean, String],
      required: false,
      default: false,
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
    hideLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
      required: false,
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["onInputError", "change"],
  data() {
    return {
      errorMessage: null,
    };
  },
  computed: {
    item() {
      if (this.store == null)
        return {
          loading: true,
          id: null,
          disabled: true,
          value: null,
          items: [],
        };
      return this.store.getSelector(this.id);
    },
    itemValue: {
      get() {
        return this.item.hasErrors ? this.item.prevVal : this.item.value;
      },
      set(newVal) {
        const error = this.rules.find((f) => f(newVal) != true);
        if (error == null) {
          this.change(this.item.id, newVal);
          this.item.prevVal = null;
          this.item.hasErrors = false;
        } else {
          this.item.prevVal = newVal;
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
  beforeUnmount() {
    document.removeEventListener("checkErrors", this.checkForErrors);
  },
  methods: {
    i18Label(label) {
      if (label) return this.i18nLabel ? this.i18nLabel(label) : label;
      return "";
    },
    i18Items(el) {
      if (el.label)
        return this.i18nItems ? this.i18nItems(el.label, el.params) : el.label;
    },
    async change(id, val) {
      this.errorMessage = null;
      this.item.hasErrors = false;
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
    superdenseSelected(item) {
      this.change("INSTANT_SELECTOR", item.value);
    },
    handleMouseOver(item) {
      this.$set(item, "hovered", true);
    },
    handleMouseOut(item) {
      this.$set(item, "hovered", false);
    },
    translate(label, params) {
      return isNaN(parseInt(label)) ? this.$t(label, params) : label;
    },
    checkForErrors() {
      const error = this.rules.find((f) => f(this.itemValue) != true);
      if (error == null && this.storeElement.value != this.itemValue) {
        this.change(this.id, this.itemValue);
      }
    },
  },
};
</script>

<style></style>
