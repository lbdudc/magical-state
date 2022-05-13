<template>
  <v-slider
    v-if="sliderTickLabels"
    v-bind:value="sliderActualTime"
    :tickLabels="sliderTickLabels"
    :max="sliderTickLabels.length - 1"
    :min="0"
    :color="sliderColor"
    :step="step"
    :ticks="ticks"
    :dense="dense"
    :discrete="discrete"
    :append-icon="appendIcon"
    :prepend-icon="prependIcon"
    @change="changeValue"
    @click:append="nextValue"
    @click:prepend="previousValue"
  ></v-slider>
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
      default: "primary",
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
  },
  methods: {
    changeValue(val) {
      this.$emit("change", val);
    },
    nextValue(val) {
      this.$emit("nextValue", val);
    },
    previousValue(val) {
      this.$emit("prevValue", val);
    },
  },
};
</script>

<style lang="css" scoped>
::v-deep .v-input__icon {
  height: 50px;
}
</style>
