<template>
  <auth-layout>
    <v-row class="flex-column">
      <v-col class="pb-0">
        <div class="headline font-weight-medium mb-3">Login with a magic link</div>
      </v-col>

      <v-col v-if="successMessage">
        <v-alert :model-value="true" type="success" variant="outlined" class="mb-2">
          {{ successMessage }}
        </v-alert>
      </v-col>
      <v-col v-else>
        <v-form ref="form" lazy-validation @submit.prevent="submit">
          <s-error-wrapper ref="email" v-slot="{ errorMessages }">
            <v-text-field
              v-model="form.email"
              name="email"
              label="Email address"
              variant="underlined"
              color="primary"
              :error-messages="errorMessages"
              :rules="validation.email"
            ></v-text-field>
          </s-error-wrapper>
          <s-button class="mx-0 text-none" block submit>Send me a magic link </s-button>
        </v-form>
      </v-col>
      <v-col class="mt-3">
        Alternative login using
        <router-link to="/login-password" class="auth-link">email and password</router-link>
      </v-col>
    </v-row>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/views/authentication/components/AuthLayout.vue";
import AuthApi from "@/api/auth.js";
import { emailRule, requiredRule } from "@/functions/validation.js";
import handle422 from "@/mixins/handle422.js";
import SButton from "@/s-components/Button/SButton.vue";
import SErrorWrapper from "@/s-components/SErrorWrapper.vue";

export default {
  components: {
    SErrorWrapper,
    SButton,
    AuthLayout,
  },
  mixins: [handle422],
  data() {
    return {
      loading: false,
      form: {
        email: "",
      },
      errorMessage: "",
      successMessage: "",
      validation: {
        email: [requiredRule, emailRule],
      },
    };
  },
  methods: {
    async submit() {
      this.clearAllValidationErrors();

      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }

      try {
        {
          const { data } = await AuthApi.checkUser(this.form);

          if (!data.verified) {
            this.$refs.email.errorMessages.push("This email does not match our records.");
            return;
          }
          if (!data.active) {
            this.$refs.email.errorMessages.push("Your account is not active.");
            return;
          }
        }

        const { data } = await AuthApi.sendMagicLink(this.form);
        this.successMessage = data.message;
        // eslint-disable-next-line no-empty
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-link {
  text-decoration: underline !important;
  color: #016bbf;
}
</style>
