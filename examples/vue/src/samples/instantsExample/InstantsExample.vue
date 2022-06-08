<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <MDateFilter id="DATE_FILTER" :store="store" :i18n="$t" />
        </v-row>
        <v-row>
          <MListSelector id="INSTANT_FILTER" :store="store" />
        </v-row>
        <v-row>
          <v-col cols="12">
            <MTimeline
              id="INSTANT_FILTER"
              :store="store"
              :i18n="$t"
              :instantSelectorFunction="mockSelectorF"
              :instantSelectorButtonLabel="
                $t('timeline.instantSelectorButtonLabel')
              "
            />
          </v-col>
        </v-row>
        <v-divider class="ma-10"></v-divider>
        <span v-if="changeEventDetected"
          >Last change event detected: {{ changeEventDetected }}</span
        >
        <br />
        <span>{{ storeContent }}</span>
        <br />
        <span>{{ counter }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import jsonSpec from "./specification.json";
import { createStore } from "../../../../../index";
import {
  MDateFilter,
  MListSelector,
  MTimeline,
} from "../../../../../vue2-components";
import getValues from "./getters";

export default {
  name: "InstantsExample",
  components: { MDateFilter, MListSelector, MTimeline },
  data: function () {
    return {
      store: null,
      implementacion: null,
      storeContent: null,
      showMSInfo: false,
      changeEventDetected: null,
      counter: 0,
    };
  },
  async mounted() {
    this.store = await createStore(
      jsonSpec,
      getValues,
      null,
      (storeContent) => {
        return new Promise(async (resolve) => {
          this.storeContent = storeContent;
          ++this.counter;
          //should wait this delay before advancing to the next instant
          //await delay(3000);
          resolve();
        });
      }
    );
    document.addEventListener("change", this.handleChangeEvent);
  },
  methods: {
    handleChangeEvent(event) {
      this.changeEventDetected = {
        changedElement: event.detail.id,
        newValue: event.detail.value,
      };
      console.log("holis", event.detail);
    },
    mockSelectorF() {
      console.log("mocking behaviour");
    },
  },
  beforeDestroy() {
    document.removeEventListener("change", this.handleChangeEvent);
  },
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
