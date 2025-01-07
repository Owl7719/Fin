<template>
  <auth-layout>
    <v-row class="flex-column">
      <h1 class="title mb-3">Set/Reset your password</h1>

      <v-col v-if="successMessage">
        <v-alert :model-value="true" type="success" variant="outlined" class="mb-2">
          {{ successMessage }}
        </v-alert>
      </v-col>

      <v-col v-else>
        <v-form ref="form" @submit.prevent="submit">
          <s-error-wrapper ref="email" v-slot="{ errorMessages }">
            <v-text-field
              name="email"
              :model-value="form.email"
              label="Email address"
              :rules="validation.email"
              variant="underlined"
              :error-messages="errorMessages"
              color="primary"
              :disabled="true"
            ></v-text-field>
          </s-error-wrapper>

          <s-error-wrapper ref="password" v-slot="{ errorMessages }">
            <password
              v-model="form.password"
              name="password"
              label="Password"
              :error-messages="errorMessages"
              :rules="validation.password"
            ></password>
          </s-error-wrapper>

          <s-error-wrapper ref="password_confirmation" v-slot="{ errorMessages }">
            <password
              v-model="form.password_confirmation"
              name="password_confirmation"
              label="Re-enter password"
              type="password"
              :error-messages="errorMessages"
              :rules="validation.password_confirmation"
            ></password>
          </s-error-wrapper>

          <s-button class="mx-0 text-none" block :loading="loading" submit @click="submit">
            Set/Reset password
          </s-button>
        </v-form>
      </v-col>
    </v-row>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/views/authentication/components/AuthLayout.vue";
import AuthApi from "@/api/auth.js";
import { emailRule, minLengthRule, requiredRule } from "@/functions/validation.js";
import handle422 from "@/mixins/handle422.js";
import Password from "@/s-components/Form/PasswordComponent.vue";
import onLoginSuccessMixin from "@/views/authentication/mixins/on-login-success-mixin.js";
import SButton from "@/s-components/Button/SButton.vue";
import SErrorWrapper from "@/s-components/SErrorWrapper.vue";

export default {
  components: {
    SErrorWrapper,
    SButton,
    Password,
    AuthLayout,
  },
  mixins: [handle422, onLoginSuccessMixin],

  data() {
    return {
      unhide: false,
      loading: false,
      successMessage: "",
      token: window.getParameterByName("token"),
      form: {
        email: window.getParameterByName("email"),
        password: "",
        password_confirmation: "",
      },
    };
  },
  computed: {
    validation() {
      return {
        email: [requiredRule, emailRule],
        password: [requiredRule, minLengthRule(8)],
        password_confirmation: [
          requiredRule,
          this.form.password === this.form.password_confirmation || "Password does not match",
        ],
      };
    },
  },
  created() {
    this.unhide = this.$route.query.unhide === "1";
  },
  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      try {
        this.loading = true;
        const { data } = await AuthApi.resetPassword({
          ...this.form,
          token: this.token,
          unhide: this.unhide,
        });

        this.successMessage = data.message;
        await this.login();
      } finally {
        this.loading = false;
      }
    },
    async login() {
      try {
        const response = await AuthApi.login(this.form);
        if (response.two_factor) {
          this.$router.push({
            name: "login-two-factor-challenge",
          });
        } else {
          await this.loginSuccess(true);
        }
      } catch (error) {
        this.$router.push({ name: "login-password" });
      }
    },
  },
};
</script>
