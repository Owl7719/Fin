<template>
  <s-dialog
    :model-value="modelValue"
    :eager="eager"
    :max-width="maxWidth"
    :title="title"
    :persistent="persistent"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #activator>
      <slot name="activator"></slot>
    </template>
    <template #content>
      <slot></slot>
    </template>
    <template #actions>
      <v-spacer></v-spacer>

      <s-button type="tertiary" @click="close"> Cancel </s-button>

      <s-button :disabled="confirmDisabled" @click="confirm">
        {{ confirmLabel }}
      </s-button>
    </template>
  </s-dialog>
</template>

<script>
import SDialog from "@/s-components/Dialog/SDialog";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: {
    SDialog,
    SButton,
  },
  props: {
    maxWidth: {
      type: Number,
      default: 600,
    },
    title: {
      type: String,
      default: "Are you sure?",
    },
    confirmLabel: {
      type: String,
      default: "Confirm",
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    confirmDisabled: {
      type: Boolean,
      required: false,
    },
    eager: {
      type: Boolean,
      default: true,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "confirm"],
  methods: {
    close() {
      this.$emit("update:modelValue", false);
    },
    confirm() {
      this.$emit("confirm");
      this.close();
    },
  },
};
</script>
