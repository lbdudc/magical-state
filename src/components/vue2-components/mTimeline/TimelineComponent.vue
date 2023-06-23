<template>
  <v-container class="ma-0 pa-2" fluid>
    <v-row justify="start" align="center">
      <v-col cols="12" md="9">
        <MTimelineSlider
          v-if="!storeElement.loading && !store.state.loading && !loading"
          :is-paused="isPaused"
          :is-loading="isLoading"
          :limit-buttons="limitButtons"
          :slider-steps="tickLabels.length"
          :slider-tick-labels="tickLabels"
          :slider-actual-time="index"
          :slider-color="'secondary'"
          @change="changeSliderValue"
          @nextValue="changeSliderValue('next')"
          @prevValue="changeSliderValue('prev')"
          @goToFirstItem="$emit('goToFirstItem')"
          @goToLastItem="$emit('goToLastItem')"
        />
        <span
          v-if="
            !storeElement.loading &&
            !store.state.loading &&
            storeElement.items.length == 0
          "
          class="text-center"
          >No data available</span
        >
      </v-col>
      <v-col cols="12" md="3">
        <MTimelineControls
          :is-paused="isPaused"
          :is-loading="isLoading"
          :speed-selected="speedSelected"
          :slider-actual-time="index"
          :slider-steps="tickLabels.length"
          :instant-selector-button-label="instantSelectorButtonLabel"
          :label="'Speed'"
          :has-instant-selector-function="instantSelectorFunction != null"
          :i18n="i18n"
          :available-speeds="availableSpeeds"
          :disable-play-button="disablePlayButton"
          :disable-stop-button="disableStopButton"
          @change-speed="updateSpeedSelected"
          @play="playTimeline"
          @stop="stopTimeline"
          @now="setValueToNow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MTimelineControls from "./TimelineControls";
import MTimelineSlider from "./TimelineSlider";

const BASE_SPEED = 1000;

export default {
  name: "MagicalTimeline",
  components: {
    MTimelineControls,
    MTimelineSlider,
  },
  props: {
    store: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: false,
      default: null,
    },
    i18n: {
      type: Function,
      required: false,
      default: null,
    },
    instantSelectorFunction: {
      type: Function,
      required: false,
      default: null,
    },
    instantSelectorButtonLabel: {
      type: String,
      required: false,
      default: null,
    },
    availableSpeeds: {
      type: Array,
      required: false,
      default: null,
    },
    disablePlayButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableStopButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    limitButtons: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    "goToFirstItem",
    "goToLastItem",
    "reproductionStarted",
    "reproductionStopped",
    "lastItemReached",
    "timelineAdvanced",
    "firstItemReached",
    "prev",
    "next",
    "change",
  ],
  data() {
    return {
      // Controls
      isPaused: true,
      speedSelected: 1,
      isLoading: false,
      fullfillPromise: null,
      index: null,
    };
  },
  computed: {
    storeElement() {
      return this.store.getSelector(this.id);
    },
    tickLabels() {
      return this.storeElement.items.map((el) =>
        this.i18n ? this.i18n(el) : el.label
      );
    },
  },
  watch: {
    "storeElement.value": function (newVal) {
      this.checkIndexMatchesValue(newVal);
    },
  },
  mounted() {
    this.selector = this.store.getSelector(this.id);
    //This event will trigger after the store has called the callback function specified on its instantiation
    document.addEventListener(
      "callbackFulfilled",
      this.callbackFullfilledReceived
    );
    this.checkIndexMatchesValue(this.storeElement.value);
  },
  beforeUnmount() {
    document.removeEventListener(
      "callbackFulfilled",
      this.callbackFullfilledReceived
    );
  },
  methods: {
    /**
     * Speed selector
     */
    updateSpeedSelected(newSpeed) {
      this.speedSelected = newSpeed;
      // If speed changes while playing, play with the new speed selected
      if (!this.isPaused) {
        this.startInterval();
      }
    },
    /**
     * Start and stop buttons
     */
    playTimeline() {
      this.$emit("reproductionStarted");
      this.isPaused = false;
      this.startInterval();
    },
    stopTimeline() {
      this.$emit("reproductionStopped");
      this.isPaused = true;
    },
    /**
     * Starts an interval to be playing, with the actual speed selected
     */
    async startInterval() {
      // TODO, esta funcion tendrá que elegir un nuevo rango para mostrar
      // If value reaches end, we probably have to recover new data (API Fetch)
      while (!this.isPaused) {
        if (this.storeElement.items.length == 0) {
          return;
        }
        if (this.index == this.storeElement.items.length - 1) {
          await this.delay();
          this.$emit("lastItemReached", true);
          return;
        } else {
          //Wait for the current time interval (based on the selected speed) and the reception of the "callbackFulfilled" event
          await Promise.all([
            this.delay(),
            this.changeStoreElementValuePromise(),
          ]);
          this.fullfillPromise = null;
          if (!this.isPaused) {
            ++this.index;
            this.$emit("timelineAdvanced");
          }
        }
      }
      //set the element value to the one pointed by the index
      await this.callStoreChange();
      this.isLoading = false;
    },
    async changeSliderValue(val) {
      if (val === "next") {
        if (this.index + 1 <= this.tickLabels.length - 1) {
          ++this.index;
          await this.callStoreChange();
          const { id, value } = this.storeElement;
          this.$emit("next", { id, value });
        } else {
          this.$emit("lastItemReached");
        }
      } else if (val === "prev") {
        if (this.index > 0) {
          --this.index;
          await this.callStoreChange();
          const { id, value } = this.storeElement;
          this.$emit("prev", { id, value });
        } else {
          this.$emit("firstItemReached");
        }
      } else {
        this.index = val ? val : 0;
        await this.callStoreChange();
        const { id, value } = this.storeElement;
        this.$emit("change", { id, val: value });
      }

      this.isLoading = false;
    },
    changeStoreElementValuePromise() {
      return new Promise((resolve) => {
        this.isLoading = true;
        this.fullfillPromise = resolve;
        this.store.change(
          this.id,
          this.storeElement.items[this.index + 1].value
        );
      });
    },
    async callStoreChange() {
      this.isLoading = true;
      return this.store.change(
        this.id,
        this.storeElement.items[this.index].value
      );
    },
    callbackFullfilledReceived(event) {
      if (event.detail.id === this.id && this.fullfillPromise) {
        this.isLoading = false;
        this.fullfillPromise();
      }
    },
    async setValueToNow() {
      if (this.instantSelectorFunction) {
        this.instantSelectorFunction();
      } else {
        this.index = this.storeElement.items.length - 1;
        await this.callStoreChange();
        this.isLoading = false;
      }
    },
    checkIndexMatchesValue(newVal) {
      if (newVal == null) {
        this.index = null;
        return;
      }
      if (this.isPaused) {
        const idx = Array.isArray(newVal)
          ? this.storeElement.items.findIndex((item) => {
              for (var i = 0; i < item.value.length; ++i) {
                if (item.value[i] !== newVal[i]) return false;
              }
              return true;
            })
          : this.storeElement.items.findIndex((it) => it.value == newVal);
        this.index = idx == -1 ? null : idx;
      }
    },
    delay() {
      return new Promise((resolve) =>
        setTimeout(resolve, BASE_SPEED / this.speedSelected)
      );
    },
  },
};
</script>
