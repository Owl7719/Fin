<template>
  <auth-layout>
    <v-form ref="form" lazy-validation @submit.prevent="submit">
      <v-row class="flex-column">
        <h1 class="title mb-3">Two-factor authentication</h1>

        <span class="auth-help">{{ tokenText }}</span>

        <v-text-field
          ref="code"
          v-model="form.code"
          autofocus
          name="code"
          :error-messages="errorMessages"
          :label="tokenLabel"
          :rules="validation.code"
          variant="underlined"
          color="primary"
        ></v-text-field>

        <s-button class="mb-3 text-none" :loading="loading" submit> Login </s-button>
        <s-button class="text-none" type="secondary" :loading="loading" @click="switchMode">
          {{ switchButtonLabel }}
        </s-button>
      </v-row>
    </v-form>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/views/authentication/components/AuthLayout.vue";
import { requiredRule } from "@/functions/validation.js";
import AuthApi from "@/api/auth.js";
import onLoginSuccessMixin from "@/views/authentication/mixins/on-login-success-mixin.js";
import get from "lodash-es/get";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, AuthLayout },
  mixins: [onLoginSuccessMixin],
  data() {
    return {
      errorMessages: [],
      loading: false,
      recovery: false,
      form: {
        code: "",
      },
      validation: {
        code: [requiredRule],
      },
    };
  },
  computed: {
    tokenLabel() {
      return this.recovery ? "Recovery Code" : "Code";
    },
    tokenText() {
      return this.recovery
        ? "Please confirm access to your account by entering one of your emergency recovery codes."
        : "Please confirm access to your account by entering the authentication code provided by your authenticator application.";
    },
    switchButtonLabel() {
      return this.recovery ? "Use an authentication code" : "Use a recovery code";
    },
  },
  methods: {
    switchMode() {
      this.recovery = !this.recovery;
      this.$refs.form.reset();
      this.$refs.code.focus();
    },
    async submit() {
      this.errorMessages = [];
      if (!this.$refs.form.validate()) {
        return;
      }
      const { code } = this.form;

      const challengeData = {
        [this.recovery ? "recovery_code" : "code"]: code,
      };

      try {
        this.loading = true;
        await AuthApi.submitTwoFactorChallenge(challengeData);
        const remember = this.$route.query.remember || false;
        return this.loginSuccess(remember);
      } catch (er) {
        const error = get(er, "response.data.message", "Two factor authentication failed");
        this.errorMessages.push(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
