<template>
  <v-tooltip location="top" open-on-click>
    <template #activator="{ props }">
      <span v-bind="props">
        <v-icon v-if="isDeleted" color="red"> close </v-icon>
        <v-icon v-else-if="isActive" :color="!isHidden ? 'primary' : 'orange'"> done </v-icon>
        <v-icon v-else :color="!isHidden ? 'grey' : 'orange'"> close </v-icon>
      </span>
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    tooltipText() {
      if (this.isDeleted) {
        return "User is deleted";
      }
      if (this.isHidden && !this.isActive) {
        return "User is inactive & hidden";
      }
      if (this.isHidden) {
        return "User is hidden";
      }
      if (!this.isActive) {
        return "User is inactive";
      }
      return "User is active";
    },
  },
};
</script>
