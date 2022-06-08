<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <m-selector :store="store" id="SPATIAL_AGGREGATION"> </m-selector>
          <m-selector :store="store" id="TEMPORAL_AGGREGATION"> </m-selector>
          <m-selector :store="store" id="SPATIAL_FILTER"> </m-selector>
          <m-selector :store="store" id="TEMPORAL_FILTER"> </m-selector>
          <m-date-filter :store="store" id="DATE_FILTER"> </m-date-filter>
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
import { createStore } from "../../../../../index";
import { MSelector, MDateFilter } from "../../../../../vue2-components";
import getValues from "./getters";

export default {
  name: "SelectorsExample",
  components: {
    MSelector,
    MDateFilter,
  },
  data: function () {
    return {
      store: null,
      implementacion: null,
      storeContent: null,
      showStore: false,
      importExportValue: "MD0xLDI=",
    };
  },
  async mounted() {
    this.store = await createStore(
      jsonSpec,
      getValues,
      this.importExportValue,
      (storeContent) => {
        return new Promise(async (resolve) => {
          this.storeContent = storeContent;
          resolve();
        });
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
