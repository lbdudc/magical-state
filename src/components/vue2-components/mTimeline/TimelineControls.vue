<template>
  <v-toolbar dense flat>
    <v-row align="center" no-gutters>
      <v-col cols="6">
        <v-row no-gutters>
          <v-col cols="6">
            <v-btn @click="play" icon :disabled="disablePlayButton">
              <v-icon color="primary">mdi-play</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn icon @click="stop" :disabled="disableStopButton">
              <v-icon color="error darken-1">mdi-stop</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-select
          :label="label"
          @change="newSpeedSelected"
          :items="availableSpeeds"
          :value="speedSelected"
          item-text="key"
          item-value="value"
          outlined
        ></v-select>
        <v-btn
          v-if="hasInstantSelectorFunction"
          @click="setValueToNow"
          :disabled="isLoading || !sliderSteps || !isPaused"
        >
          <span>
            {{ instantSelectorButtonLabel }}
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    isPaused: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    i18n: {
      type: Function,
      required: false,
      default: null,
    },
    instantSelectorButtonLabel: {
      type: String,
      required: false,
      default: null,
    },
    hasInstantSelectorFunction: {
      type: Boolean,
      required: true,
    },
    availableSpeeds: {
      type: Array,
      default: () => [
        {
          key: "1x",
          value: 1,
        },
        {
          key: "1.5x",
          value: 1.5,
        },
        {
          key: "2x",
          value: 2,
        },
        {
          key: "3x",
          value: 2,
        },
        {
          key: "5x",
          value: 5,
        },
      ],
    },
    speedSelected: {
      type: Number,
      default: 1,
    },
    label: {
      type: String,
      default: "Speed",
    },
    sliderActualTime: {
      type: Number,
      default: null,
    },
    sliderSteps: {
      type: Number,
      default: null,
    },
    disablePlayButton: {
      type: Boolean,
      default: false,
    },
    disableStopButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    newSpeedSelected(val) {
      this.$emit("changeSpeed", val);
    },
    play() {
      this.$emit("play");
    },
    stop() {
      this.$emit("stop");
    },
    setValueToNow() {
      this.$emit("now");
    },
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
  },
};
</script>

<style lang="css" scoped>
::v-deep .v-text-field__details {
  display: none !important;
}
</style>
