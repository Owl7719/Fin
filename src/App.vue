<template>
  <v-app id="inspire">
    <s-snackbar />

    <router-view :key="$route.fullPath"></router-view>
  </v-app>
</template>

<script>
import SSnackbar from "@/s-components/SSnackbar";

export default {
  components: { SSnackbar, VLoader },
};
</script>

<style lang="scss">
@import "./styles/styles.scss";
</style>
