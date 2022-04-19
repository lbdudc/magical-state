<template>
  <v-container v-if="store">
    <v-row>
      <h1>Filters</h1>
    </v-row>

    <v-row>
      <v-col v-if="store" cols="12">
        <v-row> </v-row>
      </v-col>
    </v-row>
    <v-divider class="ma-10"></v-divider>
    <v-btn v-if="!showMSInfo" @click="showMsInfo = !showMSInfo"
      >show magical state info</v-btn
    >
    <v-btn v-else @click="showMsInfo = !showMSInfo"
      >hide magical state info</v-btn
    >
    <v-divider class="ma-10"></v-divider>
    <v-row v-if="showMSInfo">
      <v-col cols="12">
        <v-row>
          <h1>Store:</h1>
        </v-row>
        <v-row>
          <v-col v-if="store._store" cols="4">
            <h3>Store.store:</h3>
            <pre>{{ store._store }}</pre>
          </v-col>
          <v-col v-if="store._observable" cols="4">
            <h3>Observable</h3>
            <pre>{{ store._observable }}</pre>
          </v-col>
          <v-col v-if="store._jsonSpec" cols="4">
            <h3>JsonSpec:</h3>
            <pre>{{ store._jsonSpec }}</pre>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import jsonSpec from "./specification.json";
import Store from "../../../../src/store";
import MyInterface from "./storeImpl";

export default {
  name: "Example1",
  components: {},
  data: function () {
    return {
      store: null,
      implementacion: null,
      showMSInfo: false,
    };
  },
  mounted() {
    this.implementacion = new MyInterface();
    this.store = new Store(jsonSpec, this.implementacion, () => {
      console.log("store mounted");
    });
  },
};
</script>
