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
        <v-row>
          <v-col cols="6">
            <v-row v-if="showStore">
              <v-btn @click="showStore = !showStore">Hide Store</v-btn>
              <span>{{ store }}</span>
            </v-row>
            <v-row v-else>
              <v-btn @click="showStore = !showStore">Show Store</v-btn>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-btn @click="exported">Export</v-btn>
              <v-btn @click="imported">Import</v-btn>
            </v-row>
            <v-row>
              <span> {{ importExportValue }}</span>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import jsonSpec from "./specification.json";
import { Store } from "../../../../index";
import { MSelector } from "../../../../vue2-components";

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
      showStore: false,
      importExportValue: "MD0yJjI9Mg==",
    };
  },
  mounted() {
    this.store = new Store(
      jsonSpec,
      getValues,
      this.importExportValue,
      (storeContent) => {
        this.storeContent = storeContent;
      }
    );
  },
  methods: {
    routeChange() {
      console.log(this.store.route);
    },
    exported() {
      this.importExportValue = this.store.exportStoreEncodedURL();
    },
    imported() {
      this.store.importStoreEncodedURL(this.importExportValue);
    },
  },
};
</script>
