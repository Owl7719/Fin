<template>
  <component :is="component"></component>
</template>

<script>
import { mapGetters } from "vuex";
import InvestorComponent from "@/views/events/view/InvestorComponent.vue";
import AdminOrCorporateComponent from "@/views/events/view/AdminOrCorporateComponent.vue";

export default {
  name: "EventView",
  computed: {
    ...mapGetters(["isInvestor"]),
    component() {
      return this.isInvestor ? InvestorComponent : AdminOrCorporateComponent;
    },
  },
};
</script>

<style scoped></style>
