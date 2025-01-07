<template>
  <v-container v-if="company" fluid>
    <v-row>
      <v-col cols="12">
        <v-widget
          title="Company information"
          variant="outlined"
          class="bg-white"
          content-bg="pa-4"
          :dense="false"
          title-font-size="20px !important"
        >
          <template #widget-content>
            <company-background-data :company="company"></company-background-data>
          </template>
        </v-widget>
      </v-col>

      <template v-if="canSeeOwnershipData">
        <v-col v-show="companyOwnershipData.length > 0" cols="12">
          <v-widget
            :title="`Ownership in ${currentUserCompanyName} by ${company.name}`"
            content-bg="pa-0"
            class="view-page-widget__ownership-data bg-white"
            variant="outlined"
            :dense="false"
            title-font-size="20px !important"
          >
            <template #widget-header-action>
              <div class="text-right">
                <s-button
                  type="secondary"
                  :to="{
                    name: 'ownership-data-company',
                    params: { id: company.id, companyId: userData.company_id },
                  }"
                >
                  View details
                </s-button>
              </div>
            </template>
            <template #widget-content>
              <company-ownership
                :company="company"
                @ownership-data="companyOwnershipData = $event"
              ></company-ownership>
            </template>
          </v-widget>
        </v-col>
      </template>

      <v-col v-if="canSeeOwnershipData" cols="12">
        <v-widget
          :dense="false"
          title-font-size="20px !important"
          content-bg="pa-0"
          variant="outlined"
          class="view-page-widget__comments bg-white"
          :title="`${currentUserCompanyName}'s comments on ${company.name}`"
        >
          <template #widget-header-action>
            <div class="text-right">
              <s-button
                class="view-page-comments__btn-action"
                type="secondary"
                @click="$refs['company-comments'].create()"
              >
                Add
              </s-button>
            </div>
          </template>
          <template #widget-content>
            <company-comments
              ref="company-comments"
              commentable-type="companies"
              :commentable-id="companyId"
            ></company-comments>
          </template>
        </v-widget>
      </v-col>

      <v-col v-if="canSeeLogs" cols="12">
        <v-widget
          id="interaction-logs"
          title="Interaction logs (last 10)"
          title-font-size="20px!important"
          variant="outlined"
          content-bg="pa-0"
          class="bg-white"
          :dense="false"
        >
          <template #widget-header-action>
            <s-button
              type="secondary"
              :to="{
                name: 'logs-list',
                params: {
                  query: JSON.stringify({ company: { id: company.id, name: company.name } }),
                },
              }"
            >
              Show all
            </s-button>
          </template>
          <template #widget-content>
            <v-row class="pa-4">
              <v-col class="d-inline-flex align-center interaction-logs__description">
                {{ `Interaction log for investors associated with  ${company.name}` }}
              </v-col>
              <v-col class="text-right">
                <add-external
                  :button-icon="false"
                  button-type="secondary"
                  :user-search-filters="{ company: company.id }"
                  @external-interaction-created="$refs['logs-table'].fetchLogs()"
                ></add-external>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <logs-table
              ref="logs-table"
              :with-border="false"
              :with-pagination="false"
              :default-filters="{
                type: 'INTERACTION',
                company: company.id,
              }"
            ></logs-table>
          </template>
        </v-widget>
      </v-col>

      <v-col cols="12">
        <v-widget
          :title="`Company users (${users.length})`"
          title-font-size="20px !important"
          content-bg="pa-0"
          class="view-page-widget__comments bg-white"
          variant="outlined"
        >
          <template #widget-content>
            <simple-users-list
              borderless
              investor-type-column
              profile-button-column
              :role-column="isAnyAdmin"
              :edit-button-column="isAnyAdmin"
              :users="users"
            ></simple-users-list>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <create-ticket-dialog
      ref="create-ticket-dialog"
      :entity="companyEntity"
      type="company"
      success-message="Thank you for your submission! We will look into this. Updates will be posted in the service center."
      success-message-with-link
    ></create-ticket-dialog>
  </v-container>
</template>

<script>
import CompanyApi from "@/api/companies";
import CompanyComments from "@/components/CompanyComments";
import SimpleUsersList from "@/views/companies/components/SimpleUsersList";
import { BASE_ROLE } from "@/constants";
import { bus } from "@/plugins/bus";
import { mapGetters } from "vuex";
import CompanyBackgroundData from "@/views/global/components/profile/CompanyBackgroundData";
import UsersApi from "@/api/users";
import SButton from "@/s-components/Button/SButton.vue";
import CompanyOwnership from "@/components/CompanyOwnership.vue";
import CreateTicketDialog from "@/views/service-center/components/CreateTicketDialog.vue";
import AddExternal from "@/components/partials/AddExternal/AddExternal.vue";
import LogsTable from "@/views/logs/list/LogsTable.vue";

export default {
  components: {
    LogsTable,
    AddExternal,
    CreateTicketDialog,
    CompanyOwnership,
    SButton,
    CompanyBackgroundData,
    CompanyComments,
    SimpleUsersList,
  },
  data() {
    return {
      company: null,
      users: [],
      companyOwnershipData: [],
    };
  },
  computed: {
    ...mapGetters([
      "isSuperAdmin",
      "isSupportAdmin",
      "isAuthorized",
      "isAnyAdmin",
      "isCorporate",
      "userData",
    ]),
    canSeeOwnershipData() {
      return (
        (this.isAnyAdmin && this.isAuthorized("manage_all_ownership_data")) ||
        (this.isCorporate && this.isAuthorized("manage_related_ownership_data"))
      );
    },
    companyId() {
      return parseInt(this.$route.params.id);
    },
    currentUserCompanyName() {
      return this.$store.state.user.data.company ? this.$store.state.user.data.company.name : "";
    },
    companyEntity() {
      return this.company;
    },
    canSeeLogs() {
      return (
        this.isSuperAdmin ||
        this.isAuthorized("irm") || // for corporate & regular admin
        this.isAuthorized("irm_full") // for regular admin
      );
    },
  },
  async mounted() {
    const response = await this.loadCompany(this.companyId);
    this.company = response.data;
    this.users = await this.loadCompanyUsers(this.companyId);

    if (this.canSeeLogs) {
      this.$refs["logs-table"].fetchLogs();
    }

    this.setTopBarButtons();
    if (this.company) {
      this.$setPageTitle(null, this.company.name);
    }
  },
  methods: {
    loadCompany(companyId) {
      const include = ["companyType", "aumOption"].join(",");
      return CompanyApi.one(companyId, { include });
    },
    loadCompanyUsers(companyId) {
      const params = { companyId, limit: 100, sort: "last_name" };

      if (!this.isAnyAdmin) {
        params.base_roles = BASE_ROLE.INVESTOR;
      }

      return UsersApi.list(params).then((response) => response.data);
    },
    setTopBarButtons() {
      const buttons = [];

      if (this.isSuperAdmin || (this.isSuperAdmin && this.isAuthorized("can_manage_companies"))) {
        buttons.push({
          slot: "Edit",
          icon: "edit",
          iconOutlined: true,
          type: "secondary",
          callback: {
            action: () =>
              this.$router.push({
                name: "admin-companies-edit",
                params: { id: this.companyId },
              }),
          },
        });
      }

      if (this.isCorporate) {
        buttons.push({
          icon: "edit",
          iconOutlined: true,
          type: "secondary",
          slot: "Update company info",
          callback: {
            action: () => this.$refs["create-ticket-dialog"].create(),
          },
        });
      }

      bus.emit("setPageTopButtons", buttons);
    },
  },
};
</script>

<style scoped>
:deep(.scrollable-card) {
  box-shadow: none;
  background-color: transparent !important;
}

:deep(.scroll-wrapper) {
  background-color: transparent !important;
}

.interaction-logs__description {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #75808e;
}

:deep(.v-toolbar__content),
:deep(.v-toolbar) {
  height: auto !important;
  min-height: 56px;
}

:deep(.v-toolbar__title) {
  white-space: normal;
}

:deep(.view-page-comments__btn-action.v-btn:not(.v-btn--round, .v-btn--block).v-size--default) {
  min-width: auto !important;
}

@media (max-width: 595px) {
  .view-page-widget__comments :deep(.v-toolbar__content),
  .view-page-widget__ownership-data :deep(.v-toolbar__content) {
    flex-direction: column;
    align-items: start;
    gap: 5px;
    padding: 12px;
  }
}
</style>
