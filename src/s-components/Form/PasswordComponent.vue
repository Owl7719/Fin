<template>
  <v-text-field
    ref="text"
    variant="underlined"
    color="primary"
    :model-value="modelValue"
    :error-messages="errorMessages"
    :label="label"
    :disabled="disabled"
    :rules="rules"
    :autofocus="autofocus"
    :required="required"
    :name="name"
    :append-inner-icon="inputType ? 'visibility' : 'visibility_off'"
    :type="inputType ? 'password' : 'text'"
    @update:model-value="$emit('update:model-value', $event)"
    @click:append-inner="inputType = !inputType"
  ></v-text-field>
</template>

<script>
export default {
  name: "PasswordComponent",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: null,
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    rules: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: () => "",
    },
  },
  emits: ["update:model-value"],
  data() {
    return {
      inputType: String,
    };
  },
  methods: {
    async validate() {
      const { valid } = await this.$refs.text.validate();
      return valid;
    },
  },
};
</script>

<style scoped>
:deep(.material-icons) {
  font-family: "Material Icons Outlined";
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}
</style>
