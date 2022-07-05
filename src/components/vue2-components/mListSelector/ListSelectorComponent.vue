<template>
  <div>
    <v-list v-if="store">
      <v-list-item-group
        v-if="!storeElement.loading"
        v-model="index"
        @change="selectedValChanged"
        mandatory
      >
        <v-list-item v-for="(item, index) in storeElement.items" :key="index">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
      <v-progress-circular
        v-else
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-list>
    <span v-else class="text-center">No data available</span>
  </div>
</template>

<script>
export default {
  name: "MagicalListSelector",
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
    overrideStoreChange: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      index: null,
    };
  },
  computed: {
    storeElement() {
      return this.store.getSelector(this.id);
    },
  },
  watch: {
    "storeElement.value": function (newVal) {
      if (newVal == null) {
        this.index = null;
        return;
      }
      const idx = Array.isArray(newVal)
        ? this.storeElement.items.findIndex((item) => {
            for (var i = 0; i < item.value.length; ++i) {
              if (item.value[i] !== newVal[i]) return false;
            }
            return true;
          })
        : this.storeElement.items.findIndex((it) => it.value == newVal);
      this.index = idx == -1 ? null : idx;
    },
  },
  methods: {
    i18Label(label) {
      if (label) return this.i18n ? this.i18n(label) : label;
      return "";
    },
    async selectedValChanged() {
      if (!this.overrideStoreChange) {
        await this.store.change(
          this.id,
          this.storeElement.items[this.index].value
        );
      } else {
        this.storeElement.value = this.storeElement.items[this.index].value;
      }
      const { id, value } = this.storeElement;
      this.$emit("change", { id, val: value });
    },
  },
};
</script>
