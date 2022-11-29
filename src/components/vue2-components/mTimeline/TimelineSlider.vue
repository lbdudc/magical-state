<template>
  <v-row>
    <v-btn
      v-if="limitButtons"
      class="slider-button"
      :disabled="isDisabled"
      elevation="0"
      fab
      @click="$emit('goToFirstItem')"
    >
      <v-icon class="slider-icon">{{prependLimitIcon}}</v-icon>
    </v-btn>
    <v-btn
      class="slider-button first-button-left"
      :disabled="isDisabled"
      elevation="0"
      fab
      @click="previousValue"
    >
      <v-icon class="slider-icon">{{prependIcon}}</v-icon>
    </v-btn>
    <v-slider
      v-if="sliderTickLabels"
      :class="isDisabled ? 'noClickSlider' : 'slider'"
      v-bind:value="sliderActualTime"
      :tickLabels="sliderTickLabels"
      :max="sliderTickLabels.length - 1"
      :min="0"
      :color="sliderColor"
      :track-color="sliderTrackColor"
      :thumb-color="sliderThumbColor"
      :step="step"
      :ticks="ticks"
      :dense="dense"
      :discrete="discrete"
      :disabled="isDisabled"
      @change="changeValue"
    ></v-slider>
    <v-btn
      class="slider-button first-button-right"
      :disabled="isDisabled"
      elevation="0"
      fab
      @click="nextValue"
    >
      <v-icon class="slider-icon">{{appendIcon}}</v-icon>
    </v-btn>
    <v-btn
      v-if="limitButtons"
      class="slider-button mr-2"
      :disabled="isDisabled"
      elevation="0"
      fab
      @click="$emit('goToLastItem')"
    >
      <v-icon class="slider-icon">{{appendLimitIcon}}</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
export default {
  props: {
    sliderSteps: {
      type: Number,
      default: null,
    },
    sliderTickLabels: {
      type: Array,
      default: null,
    },
    sliderActualTime: {
      type: Number,
      default: null,
    },
    sliderColor: {
      type: String,
      default: "#898a8b",
    },
    sliderTrackColor: {
      type: String,
      default: "#898a8b"
    },
    sliderThumbColor: {
      type: String,
      default: "#282829"
    },
    step: {
      type: Number,
      default: 1,
    },
    ticks: {
      type: Boolean,
      default: true,
    },
    dense: {
      type: Boolean,
      default: true,
    },
    discrete: {
      type: Boolean,
      default: true,
    },
    appendIcon: {
      type: String,
      default: "mdi-chevron-right",
    },
    prependIcon: {
      type: String,
      default: "mdi-chevron-left",
    },
    appendLimitIcon: {
      type: String,
      default: "mdi-chevron-double-right",
    },
    prependLimitIcon: {
      type: String,
      default: "mdi-chevron-double-left",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isPaused: {
      type: Boolean,
      default: false,
    },
    limitButtons: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    isDisabled() {
      return !this.isPaused || this.isLoading || this.sliderTickLabels?.length == 0;
    },
  },
  methods: {
    changeValue(val) {
      if (this.isPaused && !this.isLoading) this.$emit("change", val);
    },
    nextValue(val) {
      if (this.isPaused && !this.isLoading) this.$emit("nextValue", val);
    },
    previousValue(val) {
      if (this.isPaused && !this.isLoading) this.$emit("prevValue", val);
    },
  },
};
</script>

<style lang="css" scoped>
::v-deep .v-input__icon {
  height: 50px;
}
.noClickSlider {
  font-size: 12px;
  margin-left: 20px;
  margin-top: 10px;
  pointer-events: none;
}

.slider {
  font-size: 12px;
  margin-left: 20px;
  margin-top: 10px;
}

.slider-button {
  margin-top: 12px;
  background: #f6f7fa;
  height: 30px;
  width: 30px;
}

.slider-icon {
  font-size: 15px !important;
  color: #3d4d5f !important;
}

.first-button-right {
  margin-left: 10px;
}

.first-button-left {
  margin-right: -15px;
}
</style>
