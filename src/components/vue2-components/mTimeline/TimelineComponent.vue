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
            :sliderActualTime="selectedVal"
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
            :sliderActualTime="selectedVal"
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
import { raw } from "@nx-js/observer-util";

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
      selectedVal: null,
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
      return this.store.getSelector(this.id);
    },
    tickLabels() {
      return this.storeElement.items.map((el) => el.label);
    },
  },
  mounted() {
    document.addEventListener("change", this.setSelectedVal);
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
        // If value reaches end, we probably have to recover new data (API Fetch)
        if (this.selectedVal === this.storeElement.items.length - 1) {
          this.stopTimeline();
        } else {
          ++this.selectedVal;
          this.store.change(
            this.id,
            this.storeElement.items[this.selectedVal].value
          );
        }
      }, BASE_SPEED / this.speedSelected);
    },
    changeSliderValue(val) {
      if (val === "next") {
        if (this.selectedVal + 1 <= this.tickLabels.length - 1) {
          ++this.selectedVal;
          this.store.change(
            this.id,
            this.storeElement.items[this.selectedVal].value
          );
        }
      } else if (val === "prev") {
        if (this.selectedVal > 0) {
          --this.selectedVal;
          this.store.change(
            this.id,
            this.storeElement.items[this.selectedVal].value
          );
        }
      } else {
        this.selectedVal = val ? val : 0;
        this.store.change(
          this.id,
          this.storeElement.items[this.selectedVal].value
        );
      }
    },
    setSelectedVal(event) {
      if (event.detail.id === this.id) {
        if (Array.isArray(raw(event).detail.value)) {
          const eventValue = raw(event).detail.value;
          this.selectedVal = this.storeElement.items.findIndex(
            (el) =>
              eventValue.length === el.value.length &&
              eventValue.every((value, index) => value === el.value[index])
          );
        } else {
          this.selectedVal = this.storeElement.items.findIndex(
            (el) => el.value === event.detail.value
          );
        }
      }
    },
  },
};
</script>
