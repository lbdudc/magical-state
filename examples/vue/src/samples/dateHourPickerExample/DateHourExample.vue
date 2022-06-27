<template>
  <v-container v-if="store">
    <MTextField
      type="date"
      id="DATE_FILTER"
      :store="store"
      :rules="[(v) => !!v || 'Date field cannot be empty']"
    />
    <MTextField
      type="time"
      id="HOUR_PICKER"
      :store="store"
      :disabled="!disableSelector"
    />
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import { MTextField } from "../../../../../vue2-components";

export default {
  name: "DateHourExample",
  components: {
    MTextField,
  },
  data() {
    return {
      store: null,
    };
  },
  async mounted() {
    this.store = await createStore(
      jsonSpec,
      () => Promise.resolve([]),
      null,
      () =>
        new Promise((resolve) => {
          console.log("callback called");
          resolve();
        })
    );
  },
  computed: {
    disableSelector() {
      return this.store.getSelector("DATE_FILTER").value != null;
    },
  },
};
</script>