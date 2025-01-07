<template>
  <events-list
    class="admin-or-corporate-events"
    :show-invite-request-link-column="showInviteRequestLinkColumn"
    :show-company-column="showCompanyColumn"
    :get-events-query-params="getEventsQueryParams"
    :show-edit-button="showEditButton"
  >
    <template #filters>
      <event-filters
        :model-value="filters"
        :show-company-filter="showCompanyColumn"
        @update:model-value="filtersChanged"
      ></event-filters>
    </template>
  </events-list>
</template>

<script>
import EventsList from "./EventsList.vue";
import EventFilters from "@/views/events/list/components/EventFilters";
import { bus } from "@/plugins/bus";
import { mapGetters } from "vuex";

export default {
  components: {
    EventFilters,
    EventsList,
  },
  data() {
    return {
      filters: {
        text_filter: "",
        company: null,
        companyId: null,
        locationId: null,
        variants: null,
        typeId: null,
        status: null,
        dateAfter: null,
        dateBefore: null,
        with_trashed: null,
      },
    };
  },
  computed: {
    ...mapGetters(["isAuthorized", "isAuthorizedAny", "isAnyAdmin", "isInvestor", "isCorporate"]),
    showInviteRequestLinkColumn() {
      return this.isAnyAdmin ? true : this.isAuthorized("manage_investor_requests");
    },
    showCompanyColumn() {
      return this.isAnyAdmin;
    },
    showEditButton() {
      return this.isAnyAdmin
        ? true
        : this.isAuthorizedAny(["manage_single_company_events", "manage_six_events"]);
    },
    getEventsQueryParams() {
      return this.filters;
    },
  },
  created() {
    this.filters = this.$hasCachedListFilters() ? this.$getListFiltersCache() : {};
  },
  mounted() {
    this.addCreateButton();
  },
  methods: {
    addCreateButton() {
      if (this.isAuthorizedAny(["manage_single_company_events", "manage_six_events"])) {
        bus.emit("setPageTopButtons", [
          {
            icon: "add",
            slot: "Create",
            callback: () => this.$router.push({ name: "single-company-event-create" }),
          },
        ]);
      }
    },
    filtersChanged(filters) {
      this.$setListFiltersCache(filters);
      this.filters = filters;
    },
  },
};
</script>
