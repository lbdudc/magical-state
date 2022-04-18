<template>
  <v-date-picker
    :max="new Date().toISOString().slice(0, 10)"
    v-model="date"
    persistent-hint
    :locale="$i18n.locale"
    :next-month-aria-label="i18Label('datePicker.nextMonthAriaLabel')"
    :prev-month-aria-label="i18Label('datePicker.prevMonthAriaLabel')"
    :prev-year-aria-label="i18Label('datePicker.prevYearAriaLabel')"
    :next-year-aria-label="i18Label('datePicker.nextYearAriaLabel')"
    no-title
    @input="daySelected(date, 0)"
  >
  </v-date-picker>
</template>

<script>
export default {
  name: "MagicalDateFilter",
  data() {
    return {
      date: null,
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
  },
  computed: {
    storeElement() {
      return this.store.observable.find((el) => el.id === this.id);
    },
  },
  methods: {
    daySelected(pickedDate) {
      this.store.change(this.id, new Date(pickedDate));
    },
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
  },
};
</script>
