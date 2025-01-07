<script>
export default {
  name: "SErrorWrapper",
  data() {
    return {
      errorMessages: [],
    };
  },
};
</script>

<template>
  <slot :error-messages="errorMessages"></slot>
</template>

<style scoped></style>
