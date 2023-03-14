<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <m-selector v-if="store" id="SPATIAL_AGGREGATION" :store="store" :multiple="true" :push-selected-values-up="true">
          </m-selector>
          <m-selector id="TEMPORAL_AGGREGATION" :store="store" :rules="[(v) => !!v || 'cant be empty']">
          </m-selector>
          <m-selector id="SPATIAL_FILTER" :store="store"> </m-selector>
          <m-selector id="TEMPORAL_FILTER" :store="store"> </m-selector>
          <m-date-filter id="DATE_FILTER" :store="store"> </m-date-filter>
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
import { createStore, parseUrl } from "../../../../../index";
import { MSelector, MDateFilter } from "../../../../../vue2-components";
import getValues from "./getters";
import defaultValuesGetter from "./defaultValuesGetter";

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
      importExportValue: "MD0xLDImMT0xJjM9MjAyMSY0PTIwMjMtMDMtMDc=",
    };
  },
  async mounted() {
    const decodedUrl = parseUrl(this.importExportValue, jsonSpec);
    decodedUrl["SPATIAL_AGGREGATION"] = decodedUrl["SPATIAL_AGGREGATION"] != null ? decodedUrl["SPATIAL_AGGREGATION"].split(",").map(el => parseInt(el)) : [];
    this.store = await createStore(
      jsonSpec,
      { getValues: getValues, defaultValuesGetter: defaultValuesGetter },
      decodedUrl,
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
      const decodedUrl = parseUrl(this.importExportValue, jsonSpec);
      decodedUrl["SPATIAL_AGGREGATION"] = decodedUrl["SPATIAL_AGGREGATION"] != null ? decodedUrl["SPATIAL_AGGREGATION"].split(",").map(el => parseInt(el)) : [];
      this.store.setState(decodedUrl);
    },
  },
};
</script>
