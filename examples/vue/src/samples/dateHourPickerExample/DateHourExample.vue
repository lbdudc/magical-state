<template>
  <v-container v-if="store">
    <MTextField type="date" id="DATE_FILTER" :store="store" :overrideStoreChange="true" @change="change"
      :i18n="this.$t" />
    <MHourPicker id="HOUR_PICKER" :store="store" :disabled="!disableSelector" :rules="[(v) => !!v || 'error.empty']"
      :i18n="this.$t" />
    <v-divider></v-divider>
    {{ storeStatus }}
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import { MHourPicker, MTextField } from "../../../../../vue2-components";
import getValues from "./getters";
import defaultValuesGetter from "./defaultValuesGetter"

export default {
  name: "DateHourExample",
  components: {
    MHourPicker,
    MTextField,
  },
  data() {
    return {
      store: null,
      storeStatus: null,
    };
  },
  async mounted() {
    this.store = await createStore(
      jsonSpec,
      { getValues: getValues, defaultValuesGetter: defaultValuesGetter },
      null,
      (store) =>
        new Promise((resolve) => {
          this.storeStatus = store;
          resolve();
        })
    );
  },
  computed: {
    disableSelector() {
      return this.store.getSelector("DATE_FILTER").value != null;
    },
  },
  methods: {
    change(el) {
      this.store.setSelector("HOUR_PICKER", "12:20");
    },
  },
};
</script>