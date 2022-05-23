<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <m-selector :store="store" id="SPATIAL_AGGREGATION" :i18n="$t">
          </m-selector>
          <m-selector :store="store" id="TEMPORAL_AGGREGATION" :i18n="$t">
          </m-selector>
          <m-selector :store="store" id="SPATIAL_FILTER"> </m-selector>
          <m-selector :store="store" id="TEMPORAL_FILTER"> </m-selector>
          <m-date-filter :store="store" id="DATE_FILTER"></m-date-filter>
        </v-row>
        <v-divider class="ma-10"></v-divider>
        <span>{{ storeContent }}</span>
        <span style="color: red">{{ customText }}</span>
      </v-col>
    </v-row>
    <v-btn @click="getUrl()">Get URL</v-btn>
    <v-btn @click="setUrl()">Set URL</v-btn>
    <v-btn @click="updateState()">Update State</v-btn>
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { Store } from "../../../../../index";
import { MSelector, MDateFilter } from "../../../../../vue2-components";

import getValues from "./getters";

export default {
  name: "DefaultStateExample",
  components: {
    MSelector,
    MDateFilter,
  },
  data() {
    return {
      store: null,
      implementacion: null,
      storeContent: null,
      customText: null,
    };
  },
  async mounted() {
    this.store = new Store(jsonSpec, getValues, null, (storeContent) => {
      this.storeContent = storeContent;
    });
  },
  methods: {
    getUrl() {
      console.log(this.store.exportStoreEncodedURL());
    },
    setUrl() {
      const enc = this.store.exportStoreEncodedURL();
      const url = new URL("http://localhost:8080/?" + enc);
      history.pushState(null, null, url.href);
    },
    async updateState() {
      const enc = window.location.search;
      await this.store.importStoreEncodedURL(enc.substring(1));
    },
  },
};
</script>
