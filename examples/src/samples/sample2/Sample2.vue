<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <MDateSelector id="DATE_FILTER" :store="store" :i18n="$t" />
        </v-row>
        <v-row>
          <MListSelector id="INSTANT_FILTER" :store="store" />
        </v-row>
        <v-row>
          <v-col cols="12">
            <MTimeline id="INSTANT_FILTER" :store="store" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import jsonSpec from "./specification.json";
import Store from "../../../../src/store";
import MyInterface from "./gettersImplementation";
import MDateSelector from "../../../../src/components/mDateFilter/DateFilterComponent.vue";
import MListSelector from "../../../../src/components/mListSelector/ListSelectorComponent.vue";
import MTimeline from "../../../../src/components/mTimeline/TimelineComponent.vue";

export default {
  name: "Sample2",
  components: { MDateSelector, MListSelector, MTimeline },
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
