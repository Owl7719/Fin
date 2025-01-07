<template>
  <auth-layout>
    <v-row class="flex-column">
      <v-col>
        <h2 class="font-weight-medium mb-3">Login with password</h2>
      </v-col>

      <v-col v-if="infoMessage">
        <v-alert :model-value="true" type="info" variant="outlined" class="mb-2">
          {{ infoMessage }}
        </v-alert>
      </v-col>

      <v-col>
        <v-form ref="form" lazy-validation @submit.prevent="submit">
          <v-text-field
            ref="email"
            v-model="form.email"
            variant="underlined"
            color="primary"
            name="email"
            type="email"
            label="Email address"
            :rules="validation.email"
            :error-messages="errorMessages.email"
          ></v-text-field>
          <password
            ref="password"
            v-model="form.password"
            name="password"
            label="Password"
            :rules="validation.password"
          ></password>
          <v-checkbox
            v-model="form.remember"
            label="Remember Me"
            class="mt-0 pb-3"
            name="remember"
            color="blue-darken-2"
            density="compact"
            hide-details
          ></v-checkbox>
          <s-button class="shrink mx-0 text-none" block :loading="loading" submit> Login </s-button>
        </v-form>
      </v-col>
      <v-col class="pb-1 mt-1">
        Don’t remember your password?
        <router-link class="auth-link" to="/password/email">Reset it here</router-link>
      </v-col>
      <v-col class="pt-1">
        Alternative login using a
        <router-link class="auth-link" to="/login-magic-link">magic link</router-link>
      </v-col>
      <v-col>
        Don’t have an account?
        <router-link class="auth-link" to="/register">Create one here</router-link>
      </v-col>
    </v-row>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/views/authentication/components/AuthLayout.vue";
import Password from "@/s-components/Form/PasswordComponent.vue";

import { emailRule, requiredRule } from "@/functions/validation.js";
import onLoginSuccessMixin from "@/views/authentication/mixins/on-login-success-mixin.js";
import AuthApi from "@/api/auth.js";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: {
    SButton,
    AuthLayout,
    Password,
  },
  mixins: [onLoginSuccessMixin],
  data() {
    return {
      validation: {
        email: [requiredRule, emailRule],
        password: [requiredRule],
      },
      loading: false,
      errorMessages: {},
      infoMessage: "",
      form: {
        email: "",
        password: "",
        remember: true,
      },
    };
  },
  created() {
    if (this.$route.params.status) {
      this.infoMessage = this.$route.params.status;
    }
    if (this.$route.params.email) {
      this.form.email = this.$route.params.email;
    }
    if (this.$route.params.error) {
      this.errorMessages.email = [this.$route.params.error];
    }
  },
  methods: {
    async submit() {
      this.errorMessages = {};
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      try {
        this.loading = true;
        const response = await AuthApi.login(this.form);

        if (response.two_factor === true) {
          this.$router.push({
            name: "login-two-factor-challenge",
            query: { remember: this.form.remember },
          });
        } else {
          return this.loginSuccess(this.form.remember);
        }
        // eslint-disable-next-line no-empty
      } catch (error) {
        this.loginFailed(error);
      } finally {
        this.loading = false;
      }
    },
    loginFailed(error) {
      this.loading = false;
      const data = error.response.data;

      let errors = {};
      if (data.errors) {
        errors = data.errors;
      } else if (data.message) {
        errors = { email: [data.message] };
      }

      this.errorMessages = errors;
    },
  },
};
</script>

<style scoped>
.auth-link {
  color: #016bbf;
}
</style>
