<template>
  <v-card outlined v-if="store">
    <v-container
      class="ma-0 pa-0"
      v-if="!storeElement.loading && !store.state.loading"
    >
      <v-row no-gutters justify="start" align="center">
        <v-col cols="12" md="9" lg="9">
          <MTimelineSlider
            v-if="storeElement.items.length != 0"
            :isPaused="isPaused"
            :isLoading="isLoading"
            :sliderSteps="tickLabels.length"
            :sliderTickLabels="tickLabels"
            :sliderActualTime="index"
            :sliderColor="'secondary'"
            @change="changeSliderValue"
            @nextValue="changeSliderValue('next')"
            @prevValue="changeSliderValue('prev')"
          />
          <span v-else class="text-center">No data available</span>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="3" lg="3">
          <MTimelineControls
            :isPaused="isPaused"
            :isLoading="isLoading"
            :speedSelected="speedSelected"
            :sliderActualTime="index"
            :sliderSteps="tickLabels.length"
            :label="'Speed'"
            @changeSpeed="updateSpeedSelected"
            @play="playTimeline"
            @stop="stopTimeline"
          />
        </v-col>
      </v-row>
    </v-container>
    <div class="text-center" v-else>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import MTimelineControls from "./TimelineControls";
import MTimelineSlider from "./TimelineSlider";

const BASE_SPEED = 1000;

export default {
  components: {
    MTimelineControls,
    MTimelineSlider,
  },
  name: "MagicalTimeline",
  data() {
    return {
      // Controls
      isPaused: true,
      speedSelected: 1,
      isLoading: false,
      fullfillPromise: null,
    };
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
    availableSpeeds: {
      type: Array,
      required: false,
      default: null,
    },
  },
  computed: {
    storeElement() {
      return this.store.getSelector(this.id);
    },
    tickLabels() {
      return this.storeElement.items.map((el) => el.label);
    },
    index: {
      get() {
        return this.storeElement.sharedProps.index;
      },
      set(newVal) {
        this.storeElement.sharedProps.index = newVal;
      },
    },
  },
  mounted() {
    this.selector = this.store.getSelector(this.id);
    this.selector.sharedProps.index = 0;
    //This event will trigger after the store has called the callback function specified on its instantiation
    document.addEventListener(
      "redrawFullfilled",
      this.redrawFullfilledReceived
    );
  },
  beforeDestroy() {
    document.removeEventListener(
      "redrawFullfilled",
      this.redrawFullfilledReceived
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
      this.isPaused = false;
      this.startInterval();
    },
    stopTimeline() {
      this.isPaused = true;
    },
    /**
     * Starts an interval to be playing, with the actual speed selected
     */
    async startInterval() {
      // TODO, esta funcion tendrá que elegir un nuevo rango para mostrar
      // If value reaches end, we probably have to recover new data (API Fetch)
      let isLastElement = false;
      while (
        !this.isPaused &&
        !isLastElement &&
        this.index <= this.storeElement.items.length - 2
      ) {
        //Wait for the current time interval (based on the selected speed) and the reception of the "redrawFullfilled" event
        await Promise.all([
          delay(BASE_SPEED / this.speedSelected),
          this.changeStoreElementValuePromise(),
        ]);
        if (
          this.index != this.storeElement.items.length - 1 &&
          !this.isPaused
        ) {
          ++this.storeElement.sharedProps.index;
        } else {
          isLastElement = true;
        }
        this.fullfillPromise = null;
      }
      if (!this.isPaused) {
        this.stopTimeline();
      }
    },
    changeSliderValue(val) {
      if (val === "next") {
        if (this.index + 1 <= this.tickLabels.length - 1) {
          ++this.index;
          this.callStoreChange();
        }
      } else if (val === "prev") {
        if (this.index > 0) {
          --this.index;
          this.callStoreChange();
        }
      } else {
        this.index = val ? val : 0;
        this.callStoreChange();
      }
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
    callStoreChange() {
      this.store.change(this.id, this.storeElement.items[this.index].value);
    },
    redrawFullfilledReceived(event) {
      if (event.detail.id === this.id && this.fullfillPromise) {
        this.isLoading = false;
        this.fullfillPromise();
      }
    },
  },
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
