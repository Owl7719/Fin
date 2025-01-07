<template>
  <auth-layout>
    <register
      title="Register as corporate"
      :info-message="infoMessage"
      :register-account-type="type"
    ></register>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/views/authentication/components/AuthLayout.vue";
import Register from "@/views/authentication/components/RegisterForm.vue";
import { BASE_ROLE } from "@/constants.js";

export default {
  components: {
    AuthLayout,
    Register,
  },
  data() {
    return { infoMessage: "", type: BASE_ROLE.CORPORATE };
  },
  created() {
    if (this.$route.params.status) {
      this.infoMessage = this.$route.params.status;
    }
  },
};
</script>
