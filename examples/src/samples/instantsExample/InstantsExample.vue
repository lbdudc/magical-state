<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <MDateFilter
            id="DATE_FILTER"
            :store="store"
            :i18n="$t"
            @change="changed"
          />
        </v-row>
        <v-row>
          <MListSelector id="INSTANT_FILTER" :store="store" @change="changed" />
        </v-row>
        <v-row>
          <v-col cols="12">
            <MTimeline id="INSTANT_FILTER" :store="store" @change="changed" />
          </v-col>
        </v-row>
        <v-divider class="ma-10"></v-divider>
        <span>{{ storeContent }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import jsonSpec from "./specification.json";
import {
  Store,
  MDateFilter,
  MListSelector,
  MTimeline,
} from "../../../../index";
import getValues from "./getters";

export default {
  name: "InstantsExample",
  components: { MDateFilter, MListSelector, MTimeline },
  data: function () {
    return {
      store: null,
      implementacion: null,
      storeContent: null,
      showMSInfo: false,
    };
  },
  mounted() {
    this.store = new Store(jsonSpec, getValues, (storeContent) => {
      this.storeContent = storeContent;
    });
  },
  methods: {
    changed(res) {
      console.log("holis", res);
    },
  },
};
</script>
