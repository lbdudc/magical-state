<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <m-selector :store="store" id="SPATIAL_AGGREGATION" :i18n="$t">
          </m-selector>
          <m-selector
            :store="store"
            id="TEMPORAL_AGGREGATION"
            :i18n="$t"
            :overrideOnChange="true"
            @change="temporalAggChange"
          >
          </m-selector>
          <m-selector :store="store" id="SPATIAL_FILTER"> </m-selector>
          <m-selector :store="store" id="TEMPORAL_FILTER"> </m-selector>
          <m-date-filter :store="store" id="DATE_FILTER"></m-date-filter>
        </v-row>
        <v-divider class="ma-10"></v-divider>
        <span>{{ storeContent }}</span>
        <span style="color: red">{{ customText }}</span>
      </v-col>
    </v-row>
    <v-btn @click="updateState()">Update</v-btn>
    <v-btn @click="updateCustomState()">Update custom callback</v-btn>
    <br />
    <span v-if="changeEventDetected"
      >Last change event detected: {{ changeEventDetected }}</span
    >
  </v-container>
</template>
<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import { MSelector, MDateFilter } from "../../../../../vue2-components";
import getValues from "./getters";

const initialState = {
  SPATIAL_FILTER: 2,
  SPATIAL_AGGREGATION: 3,
  DATE_FILTER: "2019-01-01",
};

export default {
  name: "DefaultStateExample",
  components: {
    MSelector,
    MDateFilter,
  },
  data() {
    return {
      store: null,
      implementacion: null,
      storeContent: null,
      customText: null,
      changeEventDetected: null,
    };
  },
  async mounted() {
    this.store = await createStore(
      jsonSpec,
      getValues,
      initialState,
      (storeContent) => {
        return new Promise(async (resolve) => {
          this.storeContent = storeContent;
          resolve();
        });
      }
    );

    this.redirect();

    document.addEventListener("change", this.handleChangeEvent);
  },
  methods: {
    async updateState() {
      this.customText = null;
      await this.store.setState(initialState, true);
    },
    updateCustomState() {
      this.storeContent = null;
      this.store.setState(initialState, true, () => {
        return new Promise((resolve) => {
          console.log(this.store._observable);
          this.customText = "I am custom";
          resolve();
        });
      });
    },
    redirect() {
      console.log(this.store.objFromObservable);
      // this.$router.replace({
      //   path: this.$route.path,
      //   query: this.store.objFromObservable,
      // });
    },
    handleChangeEvent(event) {
      this.changeEventDetected = {
        changedElement: event.detail.id,
        newValue: event.detail.value,
      };
      console.log("holis", event.detail);
      this.redirect();
    },
    async temporalAggChange(el) {
      if (el.val == 1) {
        const date = new Date();
        await this.store.setSelector(
          "TEMPORAL_FILTER",
          date.getFullYear(),
          true
        );
        await this.store.setSelector(
          "DATE_FILTER",
          date.toISOString().split("T")[0],
          false
        );
      } else {
        this.store.change("TEMPORAL_AGGREGATION", el.val);
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("change", this.handleChangeEvent);
  },
};
</script>
