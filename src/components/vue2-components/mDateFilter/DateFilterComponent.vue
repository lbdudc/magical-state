<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :color="color"
        :dense="dense"
        :filled="filled"
        :flat="flat"
        :label="i18Label(storeElement.label)"
        :loading="storeElement.loading || store.state.loading"
        :outlined="outlined"
        append-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-model="storeElement.value"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :locale="$i18n.locale"
      :max="new Date().toISOString().slice(0, 10)"
      :next-month-aria-label="i18Label('datePicker.nextMonthAriaLabel')"
      :next-year-aria-label="i18Label('datePicker.nextYearAriaLabel')"
      :prev-month-aria-label="i18Label('datePicker.prevMonthAriaLabel')"
      :prev-year-aria-label="i18Label('datePicker.prevYearAriaLabel')"
      no-title
      persistent-hint
      v-model="storeElement.value"
      @input="
        () => {
          daySelected(storeElement.value, 0);
          menu = false;
        }
      "
    >
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "MagicalDateFilter",
  data() {
    return {
      menu: false,
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
    label: {
      type: String,
      required: false,
      default: "Picker date",
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false,
    },
    filled: {
      type: Boolean,
      required: false,
      default: false,
    },
    flat: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    storeElement() {
      return this.store.observable.find((el) => el.id === this.id);
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
    daySelected(pickedDate) {
      this.store.change(this.id, pickedDate);
    },
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
  },
};
</script>