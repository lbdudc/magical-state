<template>
  <v-toolbar dense flat>
    <v-row align="center" no-gutters>
      <v-col cols="6">
        <v-row no-gutters>
          <v-col cols="6">
            <v-btn icon>
              <v-icon
                color="primary"
                @click="play"
                :disabled="
                  !sliderSteps ||
                  !isPaused ||
                  sliderActualTime === sliderSteps - 1
                "
                >mdi-play</v-icon
              >
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn icon>
              <v-icon
                color="error darken-1"
                @click="stop"
                :disabled="isPaused || sliderActualTime === sliderSteps - 1"
                >mdi-stop</v-icon
              >
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
  },
};
</script>

<style lang="css" scoped>
::v-deep .v-text-field__details {
  display: none !important;
}
</style>
