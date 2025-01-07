<template>
  <v-list-item
    v-if="isVisible"
    :class="{ 'font-weight-bold text-white v-list-item--active': active }"
    class="sch-sidebar-item"
    :active="active"
    color="transparent"
    :to="to"
    @click="onClick"
  >
    <v-list-item-action v-if="icon">
      <v-icon size="18" color="white" class="material-icons-outlined">{{ icon }}</v-icon>
    </v-list-item-action>
    <v-list-item-title>{{ title }}</v-list-item-title>
  </v-list-item>
</template>

<script>
import permissionsMixin from "./permissions-mixin";

export default {
  mixins: [permissionsMixin],
  props: {
    title: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    to: {
      type: Object,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    ifCan: {
      type: String,
      default: null,
    },
    onClick: {
      type: Function,
      default: () => null,
    },
  },
};
</script>
