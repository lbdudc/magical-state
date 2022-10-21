<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    :disabled="disabled"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :color="color"
        :dense="dense"
        :filled="filled"
        :flat="flat"
        :disabled="disabled"
        :label="i18Label(storeElement.label)"
        :loading="storeElement.loading || store.state.loading"
        :outlined="outlined"
        :error-messages="i18Label(errorMessage)"
        :error="errorMessage != null"
        append-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-model="itemValue"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :type="type"
      :locale="$i18n.locale"
      :max="maxValue"
      :disabled="disabled"
      :min="minValue"
      :allowed-dates="allowedDates"
      :next-month-aria-label="i18Label('datePicker.nextMonthAriaLabel')"
      :next-year-aria-label="i18Label('datePicker.nextYearAriaLabel')"
      :prev-month-aria-label="i18Label('datePicker.prevMonthAriaLabel')"
      :prev-year-aria-label="i18Label('datePicker.prevYearAriaLabel')"
      @change="daySelected"
      no-title
      persistent-hint
      v-model="itemValue"
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
      itemValue: null,
      errorMessage: null,
    };
  },
  props: {
    store: {
      type: Object,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
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
    overrideStoreChange: {
      type: Boolean,
      default: false,
      required: false,
    },
    maxValue: {
      type: String,
      default: null,
      required: false,
    },
    minValue: {
      type: String,
      default: null,
      required: false,
    },
    allowedDates: {
      type: Function,
      default: null,
      required: false,
    },
    closeOnContentClick: {
      type: Boolean,
      default: true,
      required: false,
    },
    rules: {
      type: Array,
      default: () => [],
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: "date",
    },
  },
  mounted() {
    this.itemValue = this.storeElement.value;
    if (this.rules.length > 0) {
      document.addEventListener("checkErrors", this.checkForErrors);
    }
  },
  beforeDestroy() {
    document.removeEventListener("checkErrors", this.checkForErrors);
  },
  watch: {
    "storeElement.value": function (newVal) {
      this.itemValue = newVal;
    },
  },
  computed: {
    storeElement() {
      if (this.store == null)
        return {
          loading: true,
          disabled: true,
          value: null,
        };
      return this.store.getSelector(this.id);
    },
  },
  methods: {
    async daySelected(pickedDate) {
      if (this.closeOnContentClick) {
        this.menu = false;
      }
      const error = this.rules.find((f) => f(pickedDate) != true);
      if (error != null) {
        this.errorMessage = error(pickedDate);
        this.storeElement.hasErrors = true;
        this.$emit("onInputError", this.id);
      } else {
        this.changeStoreValue(pickedDate);
      }
    },
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
    checkForErrors() {
      const error = this.rules.find((f) => f(this.itemValue) != true);
      if (error == null) {
        this.changeStoreValue(this.itemValue);
      }
    },
    async changeStoreValue(newVal) {
      this.errorMessage = null;
      this.storeElement.value = newVal;
      this.storeElement.hasErrors = false;
      if (!this.overrideStoreChange) {
        await this.store.change(this.id, newVal);
      }
      const { id, value } = this.storeElement;
      this.$emit("change", { id, val: value });
    },
  },
};
</script>
