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
            :sliderSteps="tickLabels.length"
            :sliderTickLabels="tickLabels"
            :sliderActualTime="storeElement.value"
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
            :speedSelected="speedSelected"
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
      // setInterval for playing
      playInterval: null,

      // Controls
      isPaused: true,
      speedSelected: 1,
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
      return this.store.observable.find((el) => el.id === this.id);
    },
    tickLabels() {
      return this.storeElement.items.map((el) => el.label);
    },
  },
  watch: {
    "storeElement.emitEvt": {
      handler(newVal) {
        if (!this.store.state.loading) {
          this.$emit("change", {
            id: this.storeElement.id,
            value: newVal,
            store: this.store.observable,
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Speed selector
     */
    updateSpeedSelected(newSpeed) {
      this.speedSelected = newSpeed;
      // If speed changes while playing, play with the new speed selected
      if (!this.isPaused && this.playInterval) {
        clearInterval(this.playInterval);
        this.startInterval();
      }
    },
    /**
     * Start and stop buttons
     */
    playTimeline() {
      this.isPaused = !this.isPaused;
      this.startInterval();
    },
    stopTimeline() {
      this.isPaused = !this.isPaused;
      clearInterval(this.playInterval);
    },
    /**
     * Starts an interval to be playing, with the actual speed selected
     */
    startInterval() {
      // TODO, esta funcion tendrá que elegir un nuevo rango para mostrar
      this.playInterval = setInterval(() => {
        this.store.change(this.id, ++this.storeElement.value);
        // If value reaches end, we probably have to recover new data (API Fetch)
        if (this.storeElement.value === this.storeElement.items.length - 1) {
          this.store.change(this.id, 0);
        }
      }, BASE_SPEED / this.speedSelected);
    },
    changeSliderValue(val) {
      if (val === "next") {
        if (this.storeElement.value < this.tickLabels.length - 1) {
          this.store.change(this.id, ++this.storeElement.value);
        }
      } else if (val === "prev") {
        if (this.storeElement.value > 0) {
          this.store.change(this.id, --this.storeElement.value);
        }
      } else {
        this.storeElement.value = val ? val : 0;
        this.store.change(this.id, this.storeElement.value);
      }
    },
  },
};
</script>
