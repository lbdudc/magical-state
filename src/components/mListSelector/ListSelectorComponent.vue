<template>
  <v-list v-if="store">
    <v-list-item-group
      v-if="!storeElement.loading"
      v-model="storeElement.value"
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
  computed: {
    storeElement() {
      return this.store.observable.find((el) => el.id === this.id);
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
