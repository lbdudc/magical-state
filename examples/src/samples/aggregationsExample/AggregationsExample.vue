<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <m-selector :store="store" id="SPATIAL_AGGREGATION"> </m-selector>
          <m-selector :store="store" id="TEMPORAL_AGGREGATION"> </m-selector>
          <m-selector :store="store" id="SPATIAL_FILTER"> </m-selector>
          <m-selector :store="store" id="TEMPORAL_FILTER"> </m-selector>
        </v-row>
        <v-divider class="ma-10"></v-divider>
        <span>{{ store }}</span>
        <v-btn @click="routeChange"></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import jsonSpec from "./specification.json";
import { Store, MSelector } from "../../../../index";
import getValues from "./getters";

export default {
  name: "AggregationsExample",
  components: {
    MSelector,
  },
  data: function () {
    return {
      store: null,
      implementacion: null,
      storeContent: null,
    };
  },
  mounted() {
    this.store = new Store(jsonSpec, getValues, (storeContent) => {
      this.storeContent = storeContent;
    });
  },
  methods: {
    routeChange() {
      console.log(this.store.route);
    },
  },
};
</script>
