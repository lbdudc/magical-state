<template>
  <v-row align="center" no-gutters class="mb-1">
    <v-col cols="auto">
      <v-btn
        class="first-button"
        :disabled="disablePlayButton"
        elevation="0"
        @click="play"
      >
        <v-icon class="icon">mdi-play</v-icon>
      </v-btn>
      <v-btn
        class="middle-button"
        :disabled="disableStopButton"
        elevation="0"
        @click="stop"
      >
        <v-icon class="icon">mdi-stop</v-icon>
      </v-btn>
    </v-col>
    <v-col class="speed-selector-container">
      <v-select
        :class="
          hasInstantSelectorFunction ? 'middle-selector' : 'last-selector'
        "
        color="#c3c9d0"
        elevation="0"
        dense
        :label="label"
        :items="availableSpeeds"
        :value="speedSelected"
        item-text="key"
        item-value="value"
        outlined
        @change="newSpeedSelected"
      ></v-select>
    </v-col>
    <v-col v-if="hasInstantSelectorFunction">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            class="last-button"
            elevation="0"
            :disabled="isLoading || !sliderSteps || !isPaused"
            v-bind="attrs"
            @click="setValueToNow"
            v-on="on"
          >
            <v-icon class="icon">{{ instantSelectorButtonIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ instantSelectorButtonLabel }}</span>
      </v-tooltip>
    </v-col>
  </v-row>
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
      default: "",
    },
    hasInstantSelectorFunction: {
      type: Boolean,
      required: true,
    },
    instantSelectorButtonIcon: {
      type: String,
      default: "mdi-function",
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
  emits: ["change-speed", "play", "stop", "now"],
  watch: {
    isPaused: function (newVal) {
      if (newVal) {
        this.$emit("stop");
      }
    },
  },
  methods: {
    newSpeedSelected(val) {
      this.$emit("change-speed", val);
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
.first-button {
  border: 1px solid #c3c9d0;
  border-radius: 8px 0px 0px 8px;
  height: 40px !important;
  min-width: 10px !important;
}
.middle-button {
  border-top: 1px solid #c3c9d0;
  border-bottom: 1px solid #c3c9d0;
  border-radius: 0px 0px 0px 0px;
  height: 40px !important;
  min-width: 10px !important;
}
.last-button {
  border: 1px solid #c3c9d0;
  border-radius: 0px 8px 8px 0px;
  height: 40px !important;
  min-width: 10px !important;
}
.middle-selector {
  background: #f5f5f5;
  border-radius: 0px 0px 0px 0px;
}
.last-selector {
  background: #f5f5f5;
  border-radius: 0px 8px 8px 0px;
}
.icon {
  color: #3d4d5f;
  font-size: 18px;
}
::v-deep .v-text-field--outlined fieldset {
  border: 1px solid #c3c9d0;
}
::v-deep .v-input--dense > .v-input__control > .v-input__slot {
  margin-bottom: 0px;
}
</style>
