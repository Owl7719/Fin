<template>
  <auth-layout>
    <register :info-message="infoMessage"></register>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/views/authentication/components/AuthLayout.vue";
import Register from "./components/RegisterForm.vue";

export default {
  components: {
    AuthLayout,
    Register,
  },
  data() {
    return { infoMessage: "" };
  },
  created() {
    if (this.$route.params.status) {
      this.infoMessage = this.$route.params.status;
    }
  },
};
</script>
