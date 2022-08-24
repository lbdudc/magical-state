<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <m-autocomplete
            v-if="store"
            :store="store"
            :pushSelectedValuesUp="true"
            id="SPATIAL_AGGREGATION"
          ></m-autocomplete>
          <m-autocomplete :store="store" id="SPATIAL_FILTER"> </m-autocomplete>
        </v-row>
        <v-divider class="ma-10"></v-divider>
      </v-col>
    </v-row>
    <v-btn @click="store.setSelector('SPATIAL_AGGREGATION', [3, 2])"
      >set selector</v-btn
    >
    <span>set spatial aggregation to 2 and 3</span>
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import { MAutocomplete } from "../../../../../vue2-components";
import getValues from "./getters";

export default {
  name: "AutocompleteExample",
  components: {
    MAutocomplete,
  },
  data() {
    return {
      store: null,
      implementacion: null,
    };
  },
  async mounted() {
    this.store = await createStore(
      jsonSpec,
      getValues,
      null,
      (storeContent) => {
        return new Promise(async (resolve) => {
          console.log(storeContent);
          resolve();
        });
      }
    );
  },
};
</script>
