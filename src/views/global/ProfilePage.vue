<template>
  <div style="width: 100%">
    <user-profile
      v-if="investor"
      ref="user-profile"
      :last-event="lastEvent"
      :user="investor"
      :company="company"
      @update-profile="updateProfile"
      @company-comments="companyComments = $event"
    ></user-profile>

    <create-ticket-dialog
      v-if="investor.id"
      ref="create-ticket-dialog"
      :entity="investorEntity"
      type="investor"
      success-message="Thank you for your submission! We will look into this. Updates will be posted in the service center."
      success-message-with-link
    ></create-ticket-dialog>
  </div>
</template>

<script>
import { bus } from "@/plugins/bus";
import UserProfile from "./UserProfile";
import { mapGetters } from "vuex";
import { BASE_ROLE } from "@/constants";
import UserApi from "@/api/users";
import CompaniesApi from "@/api/companies";
import contacts from "@/api/contacts";
import CreateTicketDialog from "@/views/service-center/components/CreateTicketDialog.vue";

export default {
  components: { CreateTicketDialog, UserProfile },
  data() {
    return {
      investor: {
        profile: {},
        role: {},
        contact: {},
      },
      lastEvent: null,
      loaded: false,
      companyId: null,
      company: null,
      unhidingReason: "",
      companyComments: [],
    };
  },
  computed: {
    ...mapGetters(["isAuthorized", "isCorporate", "isAnyAdmin", "isInvestor", "settings"]),
    investorEntity() {
      return {
        id: this.investor.id,
        full_name: this.investor.full_name,
      };
    },
    canSeeCompanyComments() {
      return this.investor.id && this.investor.company_id && (this.isAnyAdmin || this.isCorporate);
    },
    canSeeInvestorComment() {
      return (
        this.investor.id &&
        (this.isAnyAdmin ||
          (this.isCorporate && this.isAuthorized("view_and_manage_linked_investors")))
      );
    },
    canSeeCompanyTags() {
      return (
        (this.isCorporate || this.isAnyAdmin) &&
        this.investor.id &&
        this.investor.tags &&
        this.investor.tags.length === 0
      );
    },
    canManageMailingCampaigns() {
      return (
        this.isAdmin ||
        (this.isCorporate && this.isAuthorized("manage_mailing_campaigns")) ||
        (this.isAnyAdmin &&
          (this.isAuthorized("manage_all_mailing_campaigns") ||
            this.isAuthorized("manage_owned_mailing_campaigns")))
      );
    },
    customFields() {
      return Array.isArray(this.settings.mailingSettings.custom_fields_definitions)
        ? this.settings.mailingSettings.custom_fields_definitions
        : [];
    },
  },
  watch: {
    investor: {
      handler() {
        this.$nextTick(() => {
          this.buildTopButtons();
          this.buildTopMenu();
        });
      },
      deep: true,
    },
  },
  mounted() {
    if (this.$store.getters.isAuthenticated) {
      if (this.$store.getters.isCorporate) {
        this.companyId = this.$store.state.user.data.company.id;
      } else if (this.$store.getters.isAdmin) {
        this.companyId = this.$route.query ? this.$route.query.company : null;

        if (this.companyId) {
          CompaniesApi.one(this.companyId).then((response) => (this.company = response.data));
        }
      }
      this.loadUser();
    } else {
      this.axios.get("public-user/" + this.$route.params.uuid).then((response) => {
        this.investor = response.data.data;
        this.loaded = true;
        this.$setPageTitle(null, this.investor.full_name);
      });
    }
  },
  methods: {
    buildTopButtons() {
      const buttons = [];
      const isCorporateWithManageLinkedInvestorsPermission =
        this.isCorporate && this.isAuthorized("view_and_manage_linked_investors");

      if (isCorporateWithManageLinkedInvestorsPermission) {
        buttons.push({
          icon: "edit",
          iconOutlined: true,
          type: "secondary",
          slot: "Update investor info",
          callback: { action: this.updateInvestor },
        });
      }

      if (this.investor && this.isAnyAdmin) {
        buttons.push({
          type: "secondary",
          icon: "edit",
          iconOutlined: true,
          slot:
            this.investor.role.base_role === BASE_ROLE.INVESTOR
              ? "Update investor info"
              : "Update user info",
          callback: {
            route: {
              name: "edit-user",
              params: { uuid: this.investor.uuid },
            },
          },
        });
      }

      this.setBreadcrumbButtons(buttons);
    },
    buildTopMenu() {
      const menu = [];
      const isCorporateWithManageLinkedInvestorsPermission =
        this.isCorporate && this.isAuthorized("view_and_manage_linked_investors");

      menu.push({
        text: "PDF",
        handler: {
          url: "users/" + this.investor.uuid + "/pdf",
        },
      });

      if (this.isAnyAdmin || isCorporateWithManageLinkedInvestorsPermission) {
        if (this.investor.is_linked) {
          menu.push({
            text: "Unlink investor",
            handler: { action: this.unlinkInvestor },
          });
        } else {
          menu.push({
            text: "Link investor",
            handler: { action: this.linkInvestor },
          });
        }
      }

      if (!this.investor.contact) {
        if (this.canManageMailingCampaigns) {
          menu.push({
            text: "Add mailing contact",
            handler: {
              action: this.addMailingContact,
            },
          });
        } else {
          menu.push({
            text: "Add mailing contact",
            handler: {
              action: () =>
                this.withConfirmDialog({
                  bodyText: `You do not have the required permissions, please contact your account manager.`,
                  headerText: "Permission required",
                  confirmButtonText: null,
                  cancelButtonText: "Close",
                }),
            },
          });
        }
      }

      if (
        this.investor.company_id &&
        this.canSeeCompanyComments &&
        this.companyComments.length === 0 &&
        this.$refs["user-profile"].$refs["company-comments"]
      ) {
        menu.push({
          text: "Add comment on company",
          handler: {
            action: this.$refs["user-profile"].$refs["company-comments"].create,
          },
        });
      }

      if (
        this.canSeeInvestorComment &&
        !this.investor.investor_description &&
        this.$refs["user-profile"].$refs["investor-comment"]
      ) {
        menu.push({
          text: "Add comment on investor",
          handler: {
            action: this.$refs["user-profile"].$refs["investor-comment"].edit,
          },
        });
      }

      if (this.canSeeCompanyTags && this.$refs["user-profile"].$refs["user-tags-managing-dialog"]) {
        menu.push({
          text: "Add tag to investor",
          handler: {
            action: this.$refs["user-profile"].$refs["user-tags-managing-dialog"].edit,
          },
        });
      }

      this.setBreadcrumbMenu(menu);
    },
    loadUser() {
      const includes = [
        "profile",
        "company.companyType",
        "company.aumOption",
        "aumOption",
        "eventLocations",
        "stockMarketCountries",
        "marketCaps",
        "sectors",
        "assetClasses",
        "linkedCompaniesData",
      ];

      UserApi.get(this.$route.params.uuid, {
        include: includes.join(),
        withContact: true,
        withManagedProducts: true,
      }).then((response) => {
        this.investor = response.data;
        this.loaded = true;
        this.$setPageTitle(null, this.investor.full_name);
      });
    },
    updateProfile() {
      this.loadUser();
    },
    setBreadcrumbButtons(val) {
      bus.emit("setPageTopButtons", val);
    },
    setBreadcrumbMenu(val) {
      bus.emit("setPageTopAdditionalActions", val);
    },
    updateInvestor() {
      if (this.investor.is_exclusively_linked) {
        this.$router.push({
          name: "edit-user",
          params: { uuid: this.investor.uuid },
        });
      } else {
        this.$refs["create-ticket-dialog"].create();
      }
    },
    linkInvestor() {
      UserApi.link(this.investor.uuid, {
        investor_description: null,
      }).then(() => {
        this.success("Investor linked successfully");
        this.investor.is_linked = true;
      });
    },
    unlinkInvestor() {
      UserApi.unlink(this.investor.uuid).then((response) => {
        this.success(response.message);
        this.investor.is_linked = false;
        this.investor.investor_description = "";
      });
    },
    async addMailingContact() {
      this.contactAddingInProgress = true;

      const data = await contacts.store({
        email: this.investor.email,
        first_name: this.investor.first_name,
        last_name: this.investor.last_name,
        data: this.mapFields(),
      });
      this.contactAddingInProgress = false;
      this.success("Contact added");
      await this.$router.push({
        name: "mailing-contacts-edit",
        params: { id: data.id },
      });
    },
    mapFields() {
      const customFieldsData = {};
      for (const item of this.customFields) {
        if (item.irm_link === "country" && this.investor.profile && this.investor.profile.country) {
          customFieldsData[item.var_name] = this.investor.profile.country;
        } else if (item.irm_link === "company_function" && this.investor.company_function) {
          customFieldsData[item.var_name] = this.investor.company_function;
        } else if (item.irm_link === "company" && this.investor.company) {
          customFieldsData[item.var_name] = this.investor.company.name;
        } else if (item.irm_link === "pronouns") {
          customFieldsData[item.var_name] = this.investor.profile.salutation;
        }
      }
      return customFieldsData;
    },
  },
};
</script>
