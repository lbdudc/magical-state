<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <m-autocomplete v-if="store" :store="store" :multiple="true" :pushSelectedValuesUp="true" :rules="[
            (v) => v.length > 0 || 'no puede estar vacío',
            (v) => v != 1 || 'no puede tomar valor 1',
          ]" @onInputError="onInputError" id="SPATIAL_AGGREGATION"></m-autocomplete>
          <m-autocomplete :store="store" id="SPATIAL_FILTER"> </m-autocomplete>
        </v-row>
        <v-divider class="ma-10"></v-divider>
      </v-col>
    </v-row>
    <v-btn @click="store.setSelector('SPATIAL_AGGREGATION', [3, 2])">set selector</v-btn>
    <span>set spatial aggregation to 2 and 3</span>
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import { MAutocomplete } from "../../../../../vue2-components";
import getValues from "./getters";
import defaultValuesGetter from "./defaultValuesGetter"

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
      { getValues: getValues, defaultValuesGetter: defaultValuesGetter },
      null,
      (storeContent) => {
        return new Promise(async (resolve) => {
          console.log(storeContent);
          resolve();
        });
      }
    );
  },
  methods: {
    onInputError(id) {
      console.log("input error on selector: " + id);
      console.log(this.store);
    },
  },
};
</script>
