<template>
  <v-container v-if="store">
    <MTextField
      id="DATE_FILTER"
      type="date"
      :store="store"
      :override-store-change="true"
      :i18n="$t"
      @change="change"
    />
    <MHourPicker
      id="HOUR_PICKER"
      :store="store"
      :disabled="!disableSelector"
      :rules="[(v) => !!v || 'error.empty']"
      :i18n="$t"
    />
    <v-divider></v-divider>
    {{ storeStatus }}
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import { MHourPicker, MTextField } from "../../../../../vue2-components";
import getValues from "./getters";
import defaultValuesGetter from "./defaultValuesGetter";

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
  computed: {
    disableSelector() {
      return this.store.getSelector("DATE_FILTER").value != null;
    },
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
  methods: {
    change(el) {
      this.store.setSelector("HOUR_PICKER", "12:20");
    },
  },
};
</script>
