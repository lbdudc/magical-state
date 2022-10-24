<template>
  <v-container v-if="store">
    <v-row>
      <v-col
        v-if="store"
        cols="12"
      >
        <v-row>
          <MDateFilter
            id="START_DATE"
            :store="store"
            :rules="[(v) => store.getSelector('END_DATE').value == null || v < store.getSelector('END_DATE').value || 'error.initDate']"
            :closeOnContentClick="true"
            :i18n="$t"
          />
        </v-row>
        <v-row>
          <MDateFilter
            id="END_DATE"
            :rules="[(v) => store.getSelector('START_DATE').value == null || v > store.getSelector('START_DATE').value || 'error.endDate']"
            :store="store"
            :closeOnContentClick="true"
            :i18n="$t"
          />
        </v-row>
        <v-row>
          dos selectores de abajo han de ser distintos entre si
          <m-selector
            :store="store"
            id="SELECTOR"
            :rules="[(v) => store.getSelector('AUTOCOMPLETE').value != v || 'tiene que ser distinto a selector multiple']"
            :i18nLabel="$t"
          ></m-selector>
        </v-row>
        <v-row>
          <m-autocomplete
            v-if="store"
            :store="store"
            :pushSelectedValuesUp="true"
            :rules="[
              (v) => store.getSelector('SELECTOR').value != v || 'tiene que ser distinto a selector',
            ]"
            id="AUTOCOMPLETE"
          ></m-autocomplete>
        </v-row>
        <v-row>
          text field depende de start date != null
          <MTextField
            id="TEXT"
            :store="store"
            :rules="[
              () => store.getSelector('START_DATE').value != null || 'start date = null',
            ]"
          ></MTextField>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import {
  MDateFilter,
  MSelector,
  MAutocomplete,
  MTextField,
} from "../../../../../vue2-components";
import getValues from "./getters";

export default {
  name: "InstantsExample",
  components: { MDateFilter, MSelector, MAutocomplete, MTextField },
  data: function () {
    return {
      store: null,
    };
  },
  async mounted() {
    this.store = await createStore(jsonSpec, getValues, null, () => {
      return new Promise(async (resolve) => {
        resolve();
      });
    });
  },
  methods: {},
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
