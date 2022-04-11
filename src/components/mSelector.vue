<template>
  <v-container v-if="store">
    <v-col v-for="item in itemsFiltered" :key="item.id">
      <v-select
        :label="item.label"
        :items="item.items"
        :loading="item.loading"
        :disabled="item.loading"
        v-model="item.value"
        item-text="label"
        item-value="value"
        @change="store.changeSelector(item.id, item.value)"
      ></v-select>
    </v-col>
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
      required: true,
    },
    group: {
      type: String,
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
};
</script>

<style></style>
