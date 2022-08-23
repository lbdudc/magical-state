<template>
  <v-container class="ma-0 pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-select
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
          item-value="value"
          v-model="item.value"
          @change="change(item.id, item.value)"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
let selectedPrevPos = {};
export default {
  name: "MagicalSelector",
  props: {
    store: {
      type: Object,
      required: false,
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
  },
  mounted() {
    console.log(this.item.items);
    if (
      this.pushSelectedValuesUp &&
      this.item.type === "multiple" &&
      this.item.value &&
      this.item.value.length > 0
    ) {
      this.item.value.forEach((el, idx) => (selectedPrevPos[el] = idx));
    }
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
      if (this.pushSelectedValuesUp && this.item.type === "multiple") {
        if (val.length > Object.keys(selectedPrevPos).length) {
          //get the new element and its current position on the items
          const newEl = val.filter((x) => selectedPrevPos[x] == null);
          let pos = this.item.items.findIndex((el) => {
            return el.value == newEl;
          });
          let notOnInitPos = true;
          let aux = null;
          while (notOnInitPos) {
            const deeper = Object.keys(selectedPrevPos).filter(
              (el) =>
                selectedPrevPos[el] >= pos &&
                (!aux || aux > selectedPrevPos[el])
            );
            if (deeper.length == 0) {
              notOnInitPos = false;
            } else {
              aux = pos;
              pos = pos - deeper.length;
            }
          }
          selectedPrevPos[newEl] = pos;
          //push the new element to the first position of the items
          const selected = this.item.items.splice(
            this.item.items.findIndex((el) => {
              return el.value == newEl;
            }),
            1
          );
          this.item.items.unshift(selected[0]);
        } else {
          const key = Object.keys(selectedPrevPos).find(
            (el) => val.find((v) => v == el) == null
          );
          const el = this.item.items.find((el) => el.value == key);
          this.item.items.splice(
            this.item.items.findIndex((el) => el.value == key),
            1
          );
          //count the elements that should be positioned after the deselected element
          let toAdd = 0;
          val.forEach(
            (el) =>
              (toAdd =
                selectedPrevPos[el] > selectedPrevPos[key] ? toAdd + 1 : toAdd)
          );

          this.item.items.splice(selectedPrevPos[key] + toAdd, 0, el);
          delete selectedPrevPos[key];
        }
      }
      if (!this.overrideStoreChange) {
        await this.store.change(id, val);
      }
      this.$emit("change", { id, val });
    },
  },
};
</script>

<style></style>
