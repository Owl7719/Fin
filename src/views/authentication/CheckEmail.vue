<template>
  <auth-layout>
    <v-row class="flex-column">
      <div class="auth-help">
        <p>To manage subscriptions you'll need a <b>crm</b> account.</p>
        <p>Please enter your email so we could check whether you already have an account</p>
      </div>
      <v-form ref="form" @submit.prevent="submit">
        <v-text-field
          v-model="email"
          name="email"
          :rules="rules.email"
          label="E-mail address"
          autofocus
          required
          autocomplete="email"
          variant="underlined"
          color="primary"
        />

        <s-button :loading="loading" block submit> Check email </s-button>
      </v-form>
    </v-row>
  </auth-layout>
</template>

<script>
import { emailRule } from "@/functions/validation";
import AuthLayout from "@/views/authentication/components/AuthLayout.vue";
import AuthApi from "@/api/auth";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, AuthLayout },
  data() {
    return {
      rules: {
        email: [emailRule],
      },
      loading: false,
      email: "",
    };
  },
  computed: {
    emailIsValid() {
      return this.email && emailRule(this.email) === true;
    },
  },
  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      AuthApi.checkUser({ email: this.email }).then((response) => {
        if (response.data.id && !response.data.trashed) {
          const msg = "Looks like you already have an account. Please log in.";
          this.$router.push({ name: "login-password", params: { status: msg, email: this.email } });
        } else {
          const msg = "Looks like you don't have an account yet. Please register.";
          this.$router.push({ name: "register", params: { status: msg, email: this.email } });
        }
      });
    },
  },
};
</script>
