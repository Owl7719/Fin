<template>
  <v-snackbar
    v-model="snackbar.active"
    light
    :color="snackbar.type"
    location="bottom right"
    multi-line
    :timeout="snackbar.timeout"
    variant="outlined"
    :close-on-back="false"
  >
    <div class="d-flex align-center ga-1">
      <div v-sanitize="snackbar.text" :class="`text-${snackbar.type}`"></div>
      <v-spacer></v-spacer>
      <v-btn
        v-if="snackbar.action && snackbar.action.text && snackbar.action.callback"
        size="small"
        color="primary"
        class="my-0 mr-0 ml-1"
        variant="text"
        @click="runActionAndCloseSnackbar"
      >
        {{ snackbar.action.text }}
      </v-btn>
    </div>
    <template #actions>
      <v-btn icon size="small" variant="text" color="black" @click="$store.commit('closeSnackbar')">
        <v-icon size="16">close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      typeToColor: {
        success: "#4caf50",
        info: "#2099f2",
        warning: "#f8ac59",
        error: "#ff0000",
      },
    };
  },
  computed: {
    snackbar() {
      return this.$store.state.snackbar;
    },
  },
  methods: {
    runActionAndCloseSnackbar() {
      if (this.snackbar.action && this.snackbar.action.callback) {
        this.snackbar.action.callback();
      }
      this.$store.commit("closeSnackbar");
    },
  },
};
</script>

<style scoped>
:deep(.v-snackbar__wrapper) {
  background: white;
  border-radius: 4px;
  max-width: 840px;
}

:deep(.v-snackbar__content) {
  font-size: 14px;
}

@media screen and (max-width: 600px) {
  :deep(.v-snackbar__wrapper) {
    width: 100%;
  }
}
</style>
