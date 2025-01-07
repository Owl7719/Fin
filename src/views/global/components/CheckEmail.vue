<template>
  <v-widget :enable-header="false">
    <template slot="widget-content">
      <h1 class="mb-4 display-1 text-sm-center">{{ title }}</h1>
      <p class="mb-2 body-1 text-sm-center">
        Thank you for your interest, please enter your business e-mail here.
      </p>
      <v-form ref="form" class="mb-4" @submit.prevent="submit">
        <v-text-field
          v-model="email"
          :rules="rules.email"
          label="E-mail"
          class="required"
        ></v-text-field>
        <v-btn type="submit" color="primary" class="text-none" block>Proceed with request</v-btn>
      </v-form>
      <p class="body-1 text-sm-center">
        If you are not registered on crm yet, the proceed button will lead you to the crm
        sign-up screen first
      </p>
    </template>
  </v-widget>
</template>

<script>
import { emailRule } from "@/functions/validation";
import AuthApi from "@/api/auth";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      email: "",
      rules: {
        email: [emailRule],
      },
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        AuthApi.checkUser({ email: this.email }).then((response) => {
          this.$emit("userChecked", Object.assign({ email: this.email }, response.data));
        });
      }
    },
  },
};
</script>
