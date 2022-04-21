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
        v-model="storeElement.value"
        :label="i18Label(storeElement.label)"
        append-icon="mdi-calendar"
        :loading="storeElement.loading || store.state.loading"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :max="new Date().toISOString().slice(0, 10)"
      v-model="storeElement.value"
      persistent-hint
      :locale="$i18n.locale"
      :next-month-aria-label="i18Label('datePicker.nextMonthAriaLabel')"
      :prev-month-aria-label="i18Label('datePicker.prevMonthAriaLabel')"
      :prev-year-aria-label="i18Label('datePicker.prevYearAriaLabel')"
      :next-year-aria-label="i18Label('datePicker.nextYearAriaLabel')"
      no-title
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
  },
  computed: {
    storeElement() {
      return this.store.observable.find((el) => el.id === this.id);
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
