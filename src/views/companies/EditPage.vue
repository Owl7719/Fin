<template>
  <v-container v-if="!loading" fluid>
    <v-card variant="outlined">
      <div class="bg-white border-b">
        <v-tabs grow slider-color="primary">
          <v-tab
            v-for="[routeTitle, routeName] of tabRoutes"
            :key="routeName"
            color="primary"
            :to="
              isEditingOwnCompany
                ? { name: routeName }
                : { name: routeName, params: { id: companyId } }
            "
          >
            {{ routeTitle }}
          </v-tab>
        </v-tabs>
      </div>

      <router-view :company-id="companyId"></router-view>
    </v-card>
  </v-container>
</template>

<script>
import { bus } from "@/plugins/bus";
import { mapGetters } from "vuex";

export default {
  props: {
    companyId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters([
      "isSuperAdmin",
      "isSupportAdmin",
      "isCorporate",
      "isAuthorized",
      "userData",
      "isAnyAdmin",
    ]),
    ...mapGetters({ company: "company/getCompany" }),
    subRoutes() {
      return !this.isEditingOwnCompany
        ? [
            ["General", "companies-edit-general"],
            ["Funds/Products", "companies-edit-funds-products"],
            ["SIX Bridge", "companies-edit-six-bridge"],
            ["Events", "companies-edit-events"],
            ["Mailing", "companies-edit-mailing"],
            ["APIs & Widgets", "companies-edit-apis-and-widgets"],
            ["API", "companies-edit-api-keys"],
          ]
        : [
            ["General", "own-company-edit-general"],
            ["SIX Bridge", "own-company-edit-six-bridge"],
            ["Events", "own-company-edit-events"],
            ["Mailing", "own-company-edit-mailing"],
            ["API", "own-company-edit-api-keys"],
          ];
    },
    tabRoutes() {
      const enabledTabs = {
        General: true,
        "Funds/Products": this.canSeeFundsAndProducts,
        "SIX Bridge": this.canSeeSixBridgeTab,
        Events: this.canSeeEventsTab,
        Mailing: this.canSeeMailingTab,
        "APIs & Widgets": this.canSeeApisAndWidgetsTab,
        API: this.canSeeApi,
      };

      return this.subRoutes.filter((it) => enabledTabs[it[0]]);
    },
    canSeeEventsTab() {
      return (
        this.isSuperAdmin ||
        (this.isSupportAdmin && this.isAuthorized("manage_all_events")) ||
        (this.isCorporate &&
          this.isAuthorized("edit_company_info") &&
          this.isAuthorized("manage_single_company_events") &&
          this.userData.company.event_enabled)
      );
    },
    canSeeMailingTab() {
      return (
        this.isSuperAdmin ||
        (this.isSupportAdmin && this.isAuthorized("manage_all_mailing_campaigns")) ||
        (this.isCorporate &&
          (this.isAuthorized("manage_mailing_campaigns") ||
            this.isAuthorized("news_distribution_channel_mailing")))
      );
    },
    canSeeApisAndWidgetsTab() {
      return this.isSuperAdmin;
    },
    canSeeApi() {
      return (
        !this.isSuperAdmin &&
        (this.isAuthorized("manage_own_api_key") ||
          this.isAuthorized("manage_own_homepage_webhook")) &&
        this.company.id === this.userData.company_id
      );
    },
    canSeeSixBridgeTab() {
      return this.isAnyAdmin || (this.isCorporate && this.isAuthorized("manage_six_bridge_data"));
    },
    canSeeFundsAndProducts() {
      return (
        this.isInvestmentCompany &&
        (this.isSuperAdmin ||
          (this.isSupportAdmin && this.isAuthorized("manage_investment_products")))
      );
    },
    isInvestmentCompany() {
      return this.company && this.company.company_type_id > 3;
    },
    userOwnCompanyId() {
      return this.userData.company_id;
    },
    isEditingOwnCompany() {
      return !this.$route.params.id;
    },
  },
  watch: {
    company: {
      handler() {
        this.setTopButtons();
      },
      deep: true,
    },
  },
  created() {
    this.loadCompany();
  },
  methods: {
    loadCompany() {
      this.loading = true;

      const includes = [
        "company",
        "allRepresentatives",
        "allRepresentatives.profile",
        "sectors",
        "marketCaps",
        "stockMarketCountries",
        "eventLocations",
        "assetClasses",
      ];
      const params = {
        include: includes.join(),
      };

      const companyId = this.isEditingOwnCompany ? this.userOwnCompanyId : this.$route.params.id;

      this.$store
        .dispatch("company/loadCompany", { companyId, params })
        .catch((error) => {
          this.error(error.response.data.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setTopButtons() {
      const buttons = [];
      const companyId = this.$route.params.id || this.company.id;

      if (this.isSuperAdmin || this.isAuthorized("view_changelog_companies")) {
        buttons.push({
          slot: "Changelog",
          type: "secondary",
          callback: {
            route: {
              name: "company-changelog",
              params: { id: companyId },
            },
          },
        });
      }

      const canViewCompany =
        this.isCorporate &&
        (this.isAuthorized("view_and_manage_linked_investors") ||
          this.isAuthorized("view_investors"));

      if (this.isAnyAdmin || canViewCompany) {
        buttons.push({
          slot: "View",
          icon: "visibility",
          iconOutlined: true,
          type: "secondary",
          callback: {
            route: {
              name: "view-company",
              params: { id: companyId },
            },
          },
        });
      }

      bus.emit("setPageTopButtons", buttons);
    },
  },
};
</script>
