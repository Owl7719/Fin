<template>
  <v-text-field
    :model-value="formattedValue"
    :label="label"
    :rules="rules"
    :readonly="readonly"
    :clearable="clearable"
    :bg-color="backgroundColor"
    :density="density"
    :outlined="outlined"
    :error-messages="errorMessages"
    variant="underlined"
    color="primary"
    @update:model-value="formatValue"
    @keydown="checkForNonNumeric"
  >
  </v-text-field>
</template>

<script>
export default {
  name: "SNumberTextField",
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    separator: {
      type: String,
      default: "'",
    },
    label: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    density: {
      type: String,
      default: "default",
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:model-value"],
  data() {
    return {
      errorMessages: [],
    };
  },
  computed: {
    formattedValue() {
      return this.addSeparator(this.removeNonNumeric(this.modelValue));
    },
  },
  methods: {
    formatValue(text) {
      this.$emit("update:model-value", parseInt(this.removeNonNumeric(text)));
    },
    removeNonNumeric(str) {
      return str.toString().replace(/\D+/g, "");
    },
    addSeparator(str) {
      return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.separator);
    },
    checkForNonNumeric(event) {
      const key = event.which || event.keyCode;
      const ctrl = event.ctrlKey ? event.ctrlKey : key === 17 ? true : false;
      const copyPressed = key == 86 && ctrl;
      const pastePressed = key == 67 && ctrl;

      if (!/\d/.test(event.key)) {
        if (!copyPressed && !pastePressed && event.keyCode !== 8) {
          return event.preventDefault();
        }
      }
    },
  },
};
</script>

<style scoped></style>
