<template>
  <companies-list
    :edit-button="canManageCompanies"
    :meeting-request-button="showMeetingRequestLink"
    :additional-conditions="{ group_type_investor: isCorporate }"
  ></companies-list>
</template>

<script>
import CompaniesList from "@/views/companies/components/CompaniesList";
import { bus } from "@/plugins/bus";
import { mapGetters } from "vuex";

export default {
  components: { CompaniesList },
  computed: {
    ...mapGetters([
      "isAuthorizedAny",
      "isAuthorized",
      "isSuperAdmin",
      "isSupportAdmin",
      "isCorporate",
    ]),
    canManageCompanies() {
      return (
        this.isSuperAdmin || (this.isSupportAdmin && this.isAuthorized("can_manage_companies"))
      );
    },
    showMeetingRequestLink() {
      return (
        this.isSuperAdmin ||
        this.isAuthorizedAny(["manage_owned_investor_requests", "manage_all_investor_requests"])
      );
    },
  },
  mounted() {
    if (this.canManageCompanies) {
      bus.emit("setPageTopButtons", [
        {
          icon: "add",
          slot: "Create company",
          callback: {
            route: { name: "companies-create" },
          },
        },
      ]);
    }
  },
};
</script>
