<template>
  <v-card outlined v-if="store">
    <v-container>
      <v-row no-gutters justify="start" align="center">
        <v-col cols="12" md="9" lg="9">
          <MTimelineSlider
            :sliderSteps="storeElement.items.length"
            :sliderTickLabels="storeElement.itemsLabels"
            :sliderActualTime="storeElement.value"
            :sliderColor="'secondary'"
            @change="changeSliderValue"
            @nextValue="changeSliderValue('next')"
            @prevValue="changeSliderValue('prev')"
          />
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="3" lg="3">
          <MTimelineControls
            :isPaused="isPaused"
            :availableSpeeds="availableSpeeds"
            :speedSelected="speedSelected"
            :label="'Speed'"
            @changeSpeed="updateSpeedSelected"
            @play="playTimeline"
            @stop="stopTimeline"
          />
        </v-col>
      </v-row>
    </v-container>
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
    timeLine: {
      type: boolean,
      required: false,
      default: false,
    },
    instantSelector: {
      type: boolean,
    },
    availableSpeeds: {
      type: Array,
      required: false,
      default: null,
    },
  },
  computed: {
    storeElement() {
      return [this.store.observable.find((el) => el.id === this.id)];
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
        ++storeElement.value;
        // If value reaches end, we probably have to recover new data (API Fetch)
        if (this.storeElement.value === this.storeElement.items.length) {
          storeElement.value = 0;
        }
      }, BASE_SPEED / this.speedSelected);
    },
    changeSliderValue(val) {
      if (val === "next") {
        ++storeElement.value;
      } else if (val === "prev") {
        --storeElement.value;
      } else {
        storeElement.value = 0;
      }
    },
  },
};
</script>
