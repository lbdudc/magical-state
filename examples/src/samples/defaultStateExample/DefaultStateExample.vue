<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <m-selector :store="store" group="Aggregation" :i18n="$t">
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
    <v-btn @click="updateState()">Update</v-btn>
    <v-btn @click="updateCustomState()">Update custom callback</v-btn>
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { Store, MSelector, MDateFilter } from "../../../../index";
import MyInterface from "./gettersImplementation";

const initialState = [
  {
    id: "SPATIAL_FILTER",
    value: 2,
  },
  {
    id: "SPATIAL_AGGREGATION",
    value: 3,
  },
  {
    id: "DATE_FILTER",
    value: "2019-01-01",
  },
];

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
  mounted() {
    this.implementacion = new MyInterface();
    this.store = new Store(jsonSpec, this.implementacion, (storeContent) => {
      this.storeContent = storeContent;
    });
  },
  methods: {
    updateState() {
      this.customText = null;
      this.store.setState(initialState, true);
    },
    updateCustomState() {
      this.storeContent = null;
      this.store.setState(initialState, true, () => {
        console.log(this.store._observable);
        this.customText = "I am custom";
      });
    },
  },
};
</script>
