<template>
  <auth-layout>
    <v-row no-gutters class="flex-column">
      <v-col>
        <div class="headline font-weight-medium mb-3">Reset your password</div>
      </v-col>

      <v-col v-if="successMessage">
        <v-alert :model-value="true" type="success" variant="outlined" class="mb-2">
          {{ successMessage }}
        </v-alert>
      </v-col>

      <v-col v-else>
        <v-form ref="form" lazy-validation @submit.prevent="submit">
          <span class="auth-help">Type email address associated with your account</span>
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
          <s-button class="mx-0 text-none" :loading="loading" block submit> Reset </s-button>
        </v-form>
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
      successMessage: "",
      form: { email: "" },
      validation: { email: [requiredRule, emailRule] },
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
        this.loading = true;
        const formData = { email: this.form.email };

        {
          const { data } = await AuthApi.checkUser(formData);

          if (!data.verified) {
            this.$refs.email.errorMessages.push("This email does not match our records.");
            return;
          }
          if (!data.active) {
            this.$refs.email.errorMessages.push("Your account is not active.");
            return;
          }
        }
        const { data } = await AuthApi.forgotPassword(formData);

        this.successMessage = data.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
