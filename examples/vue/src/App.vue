<template>
  <v-app>
    <component :is="example" />
    <v-divider class="ma-10"></v-divider>
    <v-row>
      <v-btn @click="picked = 'Example1'">Selectors</v-btn>
      <v-btn @click="picked = 'Example2'">Instants</v-btn>
      <v-btn @click="picked = 'Example3'">Default State</v-btn>
      <v-btn @click="picked = 'Example4'">Update State</v-btn>
      <v-btn @click="picked = 'Example5'">Autocompletes</v-btn>
      <v-btn @click="picked = 'Example6'">Hour Picker</v-btn>
    </v-row>
  </v-app>
</template>

<script>
import SelectorsExample from "./samples/selectorExample/SelectorsExample";
import InstantsExample from "./samples/instantsExample/InstantsExample";
import DefaultStateExample from "./samples/defaultStateExample/DefaultStateExample";
import UpdateStateExample from "./samples/updateStateExample/UpdateStateExample";
import AutocompleteExample from "./samples/autocompleteExample/AutocompleteExample.vue";
import DateHourExample from "./samples/dateHourPickerExample/DateHourExample.vue";

export default {
  name: "App",
  components: {
    SelectorsExample,
    InstantsExample,
    DefaultStateExample,
    UpdateStateExample,
    AutocompleteExample,
  },
  data() {
    return { picked: localStorage.getItem("picked") };
  },
  computed: {
    example() {
      localStorage.setItem("picked", this.picked);
      switch (this.picked) {
        case "Example1":
          return SelectorsExample;
        case "Example2":
          return InstantsExample;
        case "Example3":
          return DefaultStateExample;
        case "Example4":
          return UpdateStateExample;
        case "Example5":
          return AutocompleteExample;
        case "Example6":
          return DateHourExample;
        default:
          return SelectorsExample;
      }
    },
  },
};
</script>
