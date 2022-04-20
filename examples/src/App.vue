<template>
  <v-app>
    <component :is="example" />
    <v-divider class="ma-10"></v-divider>
    <v-row>
      <v-btn @click="picked = 'Example1'">Example1</v-btn>
      <v-btn @click="picked = 'Example2'">Example2</v-btn>
    </v-row>
  </v-app>
</template>

<script>
import Sample1 from "./samples/sample1/Sample1";
import Sample2 from "./samples/sample2/Sample2";

export default {
  name: "App",
  components: {
    Sample1,
    Sample2,
  },
  data() {
    return { picked: "Example1" };
  },
  computed: {
    example() {
      switch (this.picked) {
        case "Example1":
          return Sample1;
        case "Example2":
          return Sample2;
        default:
          return Sample1;
      }
    },
  },
};
</script>
