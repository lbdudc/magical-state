<template>
  <v-app>
    <component :is="example" />
    <v-divider class="ma-10"></v-divider>
    <v-row>
      <v-btn @click="picked = 'Example1'">Aggregations</v-btn>
      <v-btn @click="picked = 'Example2'">Instants</v-btn>
      <v-btn @click="picked = 'Example3'">Default State</v-btn>
      <v-btn @click="picked = 'Example4'">Update State</v-btn>
    </v-row>
  </v-app>
</template>

<script>
import AggregationsExample from "./samples/aggregationsExample/AggregationsExample";
import InstantsExample from "./samples/instantsExample/InstantsExample";
import DefaultStateExample from "./samples/defaultStateExample/DefaultStateExample";
import UpdateStateExample from "./samples/updateStateExample/UpdateStateExample";

export default {
  name: "App",
  components: {
    AggregationsExample,
    InstantsExample,
    DefaultStateExample,
    UpdateStateExample,
  },
  data() {
    return { picked: localStorage.getItem("picked") };
  },
  computed: {
    example() {
      localStorage.setItem("picked", this.picked);
      switch (this.picked) {
        case "Example1":
          return AggregationsExample;
        case "Example2":
          return InstantsExample;
        case "Example3":
          return DefaultStateExample;
        case "Example4":
          return UpdateStateExample;
        default:
          return AggregationsExample;
      }
    },
  },
};
</script>
