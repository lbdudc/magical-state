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
              ref="timeline"
              id="INSTANT_FILTER"
              :store="store"
              :i18n="$t"
              :instantSelectorFunction="mockSelectorF"
              :disablePlayButton="disablePlayButton"
              :disableStopButton="disableStopButton"
              @reproductionStarted="isPlaying = true"
              @reproductionStopped="isPlaying = false"
              @lastItemReached="lastElementReached"
              @firstItemReached="firstElementReached"
              :instantSelectorButtonLabel="
                $t('timeline.instantSelectorButtonLabel')
              "
            />
          </v-col>
        </v-row>
        <br />
        <v-btn @click="setStoreState">Set store state</v-btn>
        <v-divider class="ma-10"></v-divider>
        <span v-if="changeEventDetected"
          >Last change event detected: {{ changeEventDetected }}</span
        >
        <br />
        <span>{{ storeContent }}</span>
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
      isPlaying: false,
      loadingInterval: false,
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
    document.addEventListener("change", this.handleChangeEvent);
    this.store = await createStore(
      jsonSpec,
      getValues,
      null,
      (storeContent) => {
        return new Promise(async (resolve) => {
          //should wait this delay before advancing to the next instant
          await delay(1000);
          this.storeContent = storeContent;
          resolve();
        });
      }
    );
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
    handleChangeEvent(event) {
      this.changeEventDetected = {
        changedElement: event.detail.id,
        newValue: event.detail.value,
      };
    },
    mockSelectorF() {
      console.log("mocking behaviour");
    },
    async lastElementReached(wasPlaying) {
      this.loadingInterval = true;

      // depending on how pagination is implemented it may be better to set
      // the new interval via triggerGetValues - setItems - setSelector
      // to avoid the specification default value setting
      await this.store.setSelector(
        this.paginationElement.id,
        this.paginationElement.value + 1
      );
      // stablish first item as selector's value
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
        this.loadingInterval = false;
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
  },
  beforeDestroy() {
    document.removeEventListener("change", this.handleChangeEvent);
  },
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
