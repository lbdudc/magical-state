<template>
  <v-container v-if="store">
    <MTextField
      type="date"
      id="DATE_FILTER"
      :store="store"
      :rules="[(v) => !!v || 'Date field cannot be empty']"
      :overrideStoreChange="true"
      @change="change"
    />
    <MHourPicker id="HOUR_PICKER" :store="store" :disabled="!disableSelector" />
    <v-divider></v-divider>
    {{ storeStatus }}
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import { MHourPicker, MTextField } from "../../../../../vue2-components";

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
      () => Promise.resolve([]),
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