<template>
  <div class="d-inline-flex align-center" style="height: 36px">
    <span v-if="!isActive" class="text-grey-darken-2 pr-2">Inactive</span>
    <span v-else class="text-teal-darken-2 pr-2">Active</span>

    <span v-if="isHidden" class="text-orange-darken-2 pr-2">Hidden</span>
    <span v-else class="text-teal-darken-2 pr-2">Visible</span>

    <v-tooltip location="bottom" open-on-click>
      <template #activator="{ props }">
        <v-icon color="#75808E" class="material-icons-outlined" v-bind="props"> info </v-icon>
      </template>
      <span>
        Active: The user can log in and book meetings.<br />
        Inactive: The user cannot log in or book meetings.<br />
        Visible: The user is visible to all corporates on the platform.<br />
        Hidden: The user is only visible to companies with whom they have had an interaction.
      </span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    isHidden: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
