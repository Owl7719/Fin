<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <template v-if="!!$slots.left">
        <v-col cols="12" sm="6" class="text-left">
          <slot name="left"></slot>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          class="text-right d-flex justify-space-between justify-sm-end mt-3 mt-sm-0"
        >
          <slot></slot>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" class="text-right">
          <slot></slot>
        </v-col>
      </template>
    </v-row>
    <v-divider class="mt-3"></v-divider>
  </v-container>
</template>

<script>
export default {};
</script>
