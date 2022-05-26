<template>
  <v-list v-if="store">
    <v-list-item-group
      v-if="!storeElement.loading"
      v-model="selectedVal"
      @change="selectedValChanged"
    >
      <v-list-item v-for="(item, index) in storeElement.items" :key="index">
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list-item-group>
    <v-progress-circular
      v-else
      indeterminate
      color="primary"
    ></v-progress-circular>
  </v-list>
  <span v-else class="text-center">No data available</span>
</template>

<script>
import { raw } from "@nx-js/observer-util";

export default {
  name: "MagicalListSelector",
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
  },
  data() {
    return {
      selectedVal: null,
    };
  },
  computed: {
    storeElement() {
      return this.store.getSelector(this.id);
    },
  },
  mounted() {
    document.addEventListener("change", this.setSelectedVal);
  },
  methods: {
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
    selectedValChanged() {
      this.store.change(
        this.id,
        this.storeElement.items[this.selectedVal].value
      );
    },
    setSelectedVal(event) {
      if (event.detail.id === this.id) {
        if (Array.isArray(raw(event).detail.value)) {
          const eventValue = raw(event).detail.value;
          this.selectedVal = this.storeElement.items.findIndex((el) =>
            eventValue.every((value, index) => value === el.value[index])
          );
        } else {
          this.selectedVal = this.storeElement.items.findIndex(
            (el) => el.value === event.detail.value
          );
        }
      }
    },
  },
};
</script>
