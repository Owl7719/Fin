<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :eager="eager"
    scrollable
    :persistent="persistent"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #activator="{ props }">
      <slot name="activator" v-bind="props"></slot>
    </template>
    <v-card :height="height" class="card-round">
      <v-card-title class="card-title py-2 pr-1 px-6 d-flex align-center">
        <div class="card-title-text">{{ title }}</div>
        <slot name="header-title"></slot>
        <v-spacer></v-spacer>
        <slot name="header-actions"></slot>
        <s-button
          v-if="!noCloseButton"
          type="tertiary"
          size="small"
          icon
          @click="$emit('update:model-value', false)"
        >
          <v-icon>close</v-icon>
        </s-button>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text :class="noContentPadding ? 'pa-0' : 'py-4'">
        <slot name="content"></slot>
      </v-card-text>

      <v-divider v-if="$slots.actions"></v-divider>
      <v-card-actions class="px-4">
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton },
  props: {
    persistent: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: [Number, String],
      default: 800,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      default: "auto",
    },
    title: {
      type: String,
      default: "",
    },
    noContentPadding: {
      type: Boolean,
      default: false,
    },
    noCloseButton: {
      type: Boolean,
      default: false,
    },
    eager: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:model-value"],
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style scoped>
.card-round {
  border-radius: 8px;
}

.card-title-text {
  font-weight: 400;
  font-size: 21px;
  white-space: break-spaces;
}

.v-card__title {
  flex-wrap: nowrap;
}
</style>
