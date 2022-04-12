<template>
  <v-container v-if="store">
    <v-row no-gutters>
      <v-col cols="12" v-for="item in itemsFiltered" :key="item.id">
        <v-select
          :label="i18Label(item.label)"
          :items="item.items"
          :loading="item.loading"
          :disabled="item.loading"
          v-model="item.value"
          :item-text="(el) => i18Label(el.label)"
          item-value="value"
          @change="store.changeSelector(item.id, item.value)"
        ></v-select>
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
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    itemsFiltered() {
      if (this.group !== null) {
        return this.store.observable.filter((el) => el.group === this.group);
      } else {
        return [this.store.observable.find((el) => el.id === this.id)];
      }
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
