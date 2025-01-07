<template>
  <component :is="component"></component>
</template>

<script>
import InvestorEvents from "../../investor/events/InvestorEvents";
import CompanySixEventsOnly from "./CompanySixEventsOnly";
import AdminOrCorporateEvents from "@/views/events/list/AdminOrCorporateEvents";
import { mapGetters } from "vuex";

export default {
  components: {
    InvestorEvents,
    CompanySixEventsOnly,
    AdminOrCorporateEvents,
  },
  computed: {
    ...mapGetters(["isAuthorized", "isInvestor", "isCorporate"]),
    component() {
      if (this.isInvestor) {
        return InvestorEvents;
      }
      if (this.isCorporate && this.canOnlySeeSixEvents) {
        return CompanySixEventsOnly;
      }
      return AdminOrCorporateEvents;
    },
    canOnlySeeSixEvents() {
      return (
        this.isAuthorized("view_six_events") && !this.isAuthorized("view_single_company_events")
      );
    },
  },
};
</script>
