<template>
  <v-container v-if="store">
    <v-row>
      <v-col v-if="store" cols="12">
        <v-row>
          <MDateFilter
            id="DATE_FILTER"
            :store="store"
            :close-on-content-click="true"
            :i18n="$t"
            :rules="[(v) => v != '2022-08-29' || 'date cant be today']"
          />
        </v-row>
        <v-row>
          <MListSelector id="INSTANT_FILTER" :store="store" />
        </v-row>
        <v-row>
          <v-col cols="12">
            <MTimeline
              id="INSTANT_FILTER"
              ref="timeline"
              :store="store"
              :i18n="$t"
              :instant-selector-function="mockSelectorF"
              :disable-play-button="disablePlayButton"
              :disable-stop-button="disableStopButton"
              :instant-selector-button-label="
                $t('timeline.instantSelectorButtonLabel')
              "
              @reproduction-started="isPlaying = true"
              @reproduction-stopped="isPlaying = false"
              @last-item-reached="lastElementReached"
              @first-item-reached="firstElementReached"
              @timeline-advanced="timelineAdvanced"
            />
          </v-col>
        </v-row>
        <br />
        <v-btn @click="setStoreState">Set store state</v-btn>
        <v-divider class="ma-10"></v-divider>
        <br />
        <span>INFORMACION TIMELINE EN REPRODUCCION</span>
        <br />
        <span>Hora definida como store value: {{ elementoAPintar }}</span>
        <br />
        <span
          >Hora con la que se pintaria en pantalla: {{ elementoPintado }}</span
        >
        <br />
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
import defaultValuesGetter from "./defaultValuesGetter";

export default {
  name: "InstantsExample",
  components: { MDateFilter, MListSelector, MTimeline },
  data: function () {
    return {
      store: null,
      implementacion: null,
      showMSInfo: false,
      changeEventDetected: null,
      isPlaying: false,
      loadingInterval: false,
      elementoPintado: null,
      elementoAPintar: null,
    };
  },
  computed: {
    paginationElement() {
      return this.store.getSelector("CURRENT_PAGE");
    },
    instantsElement() {
      return this.store.getSelector("INSTANT_FILTER");
    },
    disablePlayButton() {
      return (
        this.isPlaying ||
        this.instantsElement.items.length <= 0 ||
        this.loadingInterval
      );
    },
    disableStopButton() {
      return !this.isPlaying || this.instantsElement.items.length <= 0;
    },
  },
  async mounted() {
    this.store = await createStore(
      jsonSpec,
      { getValues: getValues, defaultValuesGetter: defaultValuesGetter },
      null,
      (storeContent) => {
        return new Promise(async (resolve) => {
          //should wait this delay before advancing to the next instant
          //await delay(1000);
          //console.log(storeContent);
          this.elementoAPintar = storeContent["INSTANT_FILTER"];
          resolve();
        });
      }
    );
  },
  beforeUnmount() {
    document.removeEventListener("change", this.handleChangeEvent);
  },
  methods: {
    setStoreState() {
      const state = {
        DATE_FILTER: "2022-06-29",
        CURRENT_PAGE: 0,
        INSTANT_FILTER: [2022, 3, 31, 16, 35],
      };
      this.store.setState(state, true);
    },
    mockSelectorF() {
      console.log("mocking behaviour");
    },
    async lastElementReached(wasPlaying) {
      this.loadingInterval = true;

      //example returns [] from page 3
      if (this.paginationElement.value >= 2) {
        this.$refs.timeline.stopTimeline();
      } else {
        // depending on how pagination is implemented it may be better to set
        // the new interval via triggerGetValues - setItems - setSelector
        // to avoid the specification default value setting
        await this.store.setSelector(
          this.paginationElement.id,
          this.paginationElement.value + 1
        );
        // stablishing first item as selector's value
        if (this.instantsElement.items.length > 0) {
          await this.store.setSelector(
            this.instantsElement.id,
            this.instantsElement.items[0].value
          );
        }

        if (wasPlaying && !this.disableStopButton) {
          //call delay to ensure that the first element is displayed
          await this.$refs.timeline.delay();
          this.$refs.timeline.playTimeline();
        }
      }
      this.loadingInterval = false;
    },
    async firstElementReached() {
      if (this.paginationElement.value != 0) {
        await this.store.setSelector(
          this.paginationElement.id,
          this.paginationElement.value - 1
        );
        if (this.instantsElement.items.length > 0) {
          await this.store.setSelector(
            this.instantsElement.id,
            this.instantsElement.items[this.instantsElement.items.length - 1]
              .value
          );
        }
      }
    },
    checkDisablePlayButton() {
      this.disablePlayButton =
        this.instantsElement.items.length <= 0 ? true : false;
    },
    timelineAdvanced() {
      this.elementoPintado = this.elementoAPintar;
    },
  },
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
