<template>
  <auth-layout>
    <v-row class="flex-column button-offset">
      <v-col v-if="infoMessage">
        <v-alert :model-value="true" type="info" variant="outlined" class="mb-2">
          {{ infoMessage }}
        </v-alert>
      </v-col>

      <v-col class="pb-1">
        <s-button class="text-none" block to="/login-password">
          Login with email and password
        </s-button>
      </v-col>
      <v-col class="pt-2">
        <s-button class="text-none" type="secondary" block to="/login-magic-link">
          Login with magic link
        </s-button>
      </v-col>
      <v-col class="mt-3">
        Don’t have an account?
        <router-link to="/register" class="auth-link">Create one here</router-link>
      </v-col>
    </v-row>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/views/authentication/components/AuthLayout.vue";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, AuthLayout },
  data() {
    return { infoMessage: "" };
  },
  created() {
    if (this.$route.query.status) {
      this.infoMessage = this.$route.query.status;
    }
  },
};
</script>

<style scoped>
@media screen and (min-height: 600px) {
  .button-offset {
    margin-top: 100px;
  }
}
</style>
