<template>
  <div>
    <v-list v-if="store">
      <v-list-item-group
        v-if="!storeElement.loading"
        v-model="index"
        @change="selectedValChanged"
        mandatory
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
    {{ "holis" + index }}
  </div>
</template>

<script>
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
  mounted() {
    this.index = 0;
  },
  computed: {
    storeElement() {
      return this.store.getSelector(this.id);
    },
    index: {
      get() {
        return this.storeElement.sharedProps.index;
      },
      set(newVal) {
        this.storeElement.sharedProps.index = newVal;
      },
    },
  },
  methods: {
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
    async selectedValChanged() {
      await this.store.change(
        this.id,
        this.storeElement.items[this.index].value
      );
      const { id, value } = this.storeElement;
      this.$emit("change", { id, value });
    },
  },
};
</script>
