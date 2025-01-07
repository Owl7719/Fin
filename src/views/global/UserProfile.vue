<template>
  <v-container fluid>
    <!-- COMPANY BACKGROUND -->
    <v-row>
      <v-col>
        <v-widget
          v-if="user.company"
          title="Company information"
          title-font-size="20px!important"
          variant="outlined"
          class="bg-white"
          content-bg="pa-4"
          :dense="false"
        >
          <template v-if="isAnyAdmin || isCorporate" #widget-header-action>
            <s-button
              type="secondary"
              :to="{
                name: 'view-company',
                params: { id: user.company_id },
              }"
            >
              View company
            </s-button>
          </template>
          <template #widget-content>
            <company-background-data
              :company="(user && user.company) || {}"
            ></company-background-data>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <template v-if="canSeeOwnershipData">
      <v-row v-show="companyOwnershipData.length > 0">
        <v-col>
          <v-widget
            :title="`Ownership in ${currentUserCompanyName} by ${user.company.name}`"
            content-bg="pa-0"
            variant="outlined"
            class="bg-white"
            :dense="false"
            title-font-size="20px !important"
          >
            <template #widget-header-action>
              <div class="text-right" style="min-width: 200px">
                <s-button
                  type="secondary"
                  :to="{
                    name: 'ownership-data-company',
                    params: { id: user.company.id, companyId: currentUser.company_id },
                  }"
                >
                  View details
                </s-button>
              </div>
            </template>
            <template #widget-content>
              <company-ownership
                :company="user.company"
                @ownership-data="companyOwnershipData = $event"
              ></company-ownership>
            </template>
          </v-widget>
        </v-col>
      </v-row>
    </template>

    <template
      v-if="canSeeOwnershipData && user.investmentProducts && user.investmentProducts.length > 0"
    >
      <v-row v-show="productOwnershipData.length > 0">
        <v-col>
          <v-widget
            :title="`Ownership in ${currentUserCompanyName} by Products managed by ${user.full_name}`"
            content-bg="pa-0"
            variant="outlined"
            class="bg-white"
            :dense="false"
            title-font-size="20px !important"
          >
            <template #widget-content>
              <investor-managed-products
                :investor="user"
                @ownership-data="productOwnershipData = $event"
              ></investor-managed-products>
            </template>
          </v-widget>
        </v-col>
      </v-row>
    </template>

    <!-- INTERACTION LOGS WITH INVESTOR-->
    <template v-if="canSeeLogs">
      <v-row v-show="totalLogsWithInvestor">
        <v-col>
          <v-widget
            id="interaction-logs"
            title="Interaction log with investor (last 5)"
            title-font-size="20px!important"
            variant="outlined"
            class="bg-white"
            content-bg="pa-0"
            :dense="false"
          >
            <template #widget-content>
              <v-row class="pa-4">
                <v-col class="d-inline-flex align-center interaction-logs__description">
                  Interaction log {{ companyName ? `for ${companyName}` : "" }} with
                  {{ user.full_name }} ({{ (user.company && user.company.name) || "-" }})
                </v-col>
                <v-col class="text-right">
                  <add-external
                    :button-icon="false"
                    button-type="secondary"
                    @external-interaction-created="updateLogs"
                  ></add-external>
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <logs-table
                ref="logs-with-investor-table"
                :with-border="false"
                :with-pagination="false"
                :default-filters="defaultLogsWithInvestorFilters"
                @total-items="totalLogsWithInvestor = $event"
              ></logs-table>
            </template>
          </v-widget>
        </v-col>
      </v-row>
    </template>

    <!-- INTERACTION LOGS WITH COMPANY-->
    <template v-if="canSeeLogs">
      <v-row v-show="totalLogsWithCompany && !user.is_hidden">
        <v-col>
          <v-widget
            id="interaction-logs"
            title="Interaction log with company (last 5)"
            title-font-size="20px!important"
            variant="outlined"
            class="bg-white"
            content-bg="pa-0"
            :dense="false"
          >
            <template #widget-content>
              <v-row class="pa-4">
                <v-col class="d-inline-flex align-center interaction-logs__description">
                  Interaction log {{ companyName ? `for ${companyName}` : "" }} with
                  {{ (user.company && user.company.name) || "-" }}
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <logs-table
                ref="logs-with-company-table"
                :with-border="false"
                :with-pagination="false"
                :default-filters="defaultLogsWithCompanyFilters"
                @total-items="totalLogsWithCompany = $event"
              ></logs-table>
            </template>
          </v-widget>
        </v-col>
      </v-row>
    </template>

    <!-- INVESTOR MAILING CONTACT INTEGRATION -->
    <v-row v-if="canSeeMailingContact">
      <v-col>
        <mailing-contact-widget
          :user="user"
          @contact-added="(data) => $emit('updateProfile', data)"
        ></mailing-contact-widget>
      </v-col>
    </v-row>

    <!-- COMPANY COMMENTS -->
    <template v-if="user.company && canSeeCompanyComments">
      <v-row v-show="companyComments.length > 0">
        <v-col>
          <v-widget
            content-bg="pa-0"
            class="profile__widget bg-white"
            :title="`${currentUserCompanyName}'s comments on ${user.company.name}`"
            title-font-size="20px!important"
            variant="outlined"
            :dense="false"
          >
            <template #widget-header-action>
              <div>
                <s-button type="secondary" @click="$refs['company-comments'].create()">
                  Add comment
                </s-button>
              </div>
            </template>
            <template #widget-content>
              <company-comments
                ref="company-comments"
                commentable-type="companies"
                :commentable-id="user.company_id"
                @updated="updateCompanyComments"
              ></company-comments>
            </template>
          </v-widget>
        </v-col>
      </v-row>
    </template>

    <!-- INVESTOR BACKGROUND -->
    <v-row>
      <v-col>
        <v-widget
          title="Investor background &amp; investment style"
          title-font-size="20px!important"
          variant="outlined"
          class="bg-white"
          content-bg="pa-4"
          :dense="false"
        >
          <template v-if="canEdit" #widget-header-action>
            <s-button
              type="secondary"
              :to="{
                name: 'edit-user-profile',
                query: { previous: 'profile' },
              }"
            >
              Edit
            </s-button>
          </template>
          <template #widget-content>
            <investor-background-data :user="user"></investor-background-data>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <!-- INVESTOR COMMENTS -->
    <template v-if="canSeeInvestorComment">
      <v-row v-show="investorDescription">
        <v-col>
          <v-widget
            :title="`${currentUserCompanyName}'s comment on investor`"
            title-font-size="20px!important"
            class="mb-1 profile__widget bg-white"
            variant="outlined"
            :dense="false"
          >
            <template #widget-header-action>
              <div>
                <s-button type="secondary" @click="$refs['investor-comment'].edit()">
                  {{ investorDescription ? "Edit comment" : "Add comment" }}
                </s-button>
              </div>
            </template>
            <template #widget-content>
              <investor-comment
                ref="investor-comment"
                :investor-uuid="user.uuid"
                :is-linked="user.is_linked"
                :comment="investorDescription"
                @updated="updateInvestorComment"
              ></investor-comment>
            </template>
          </v-widget>
        </v-col>
      </v-row>
    </template>

    <!-- INVESTOR TAGS -->
    <v-row v-if="canSeeCompanyTags && user.tags.length > 0">
      <v-col>
        <v-widget
          :title="`${currentUserCompanyName}'s tags on investor`"
          title-font-size="20px!important"
          variant="outlined"
          class="bg-white"
          content-bg="pa-4"
          :dense="false"
        >
          <template #widget-content>
            <user-tags-managing
              :user-id="user.uuid"
              :initial-user-tags="user.tags"
              @updated="updateUserTags"
            ></user-tags-managing>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <!-- INVESTOR TAGS DIALOG -->
    <user-tags-managing-dialog
      v-if="canSeeCompanyTags"
      ref="user-tags-managing-dialog"
      :user-id="user.uuid"
      :user-tags="user.tags"
      @updated="updateUserTags"
    ></user-tags-managing-dialog>

    <!-- INVESTOR INTERESTS -->
    <v-row>
      <v-col>
        <v-widget
          title="Investor interests / filters"
          title-font-size="20px!important"
          variant="outlined"
          class="mt-1 bg-white"
          content-bg="pa-4"
          :dense="false"
        >
          <template v-if="canEdit" #widget-header-action>
            <s-button
              type="secondary"
              :to="{
                name: 'edit-user-profile',
                params: { page: 2 },
                query: { previous: 'profile' },
              }"
            >
              Edit
            </s-button>
          </template>
          <template #widget-content>
            <investor-interests-data
              :user="user"
              :is-conference="conference"
            ></investor-interests-data>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <!-- ADDRESS & CONTACT DETAILS -->
    <v-row>
      <v-col>
        <v-widget
          title="Address &amp; contact details"
          title-font-size="20px!important"
          content-bg="pa-4"
          variant="outlined"
          class="mt-1 bg-white"
          :dense="false"
        >
          <template v-if="canEdit" #widget-header-action>
            <s-button
              :to="{ name: 'edit-user-profile', query: { previous: 'profile' } }"
              type="secondary"
              >Edit
            </s-button>
          </template>
          <template #widget-content>
            <investor-address-data :user="user" :can-edit="canEdit"></investor-address-data>
          </template>
        </v-widget>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InvestorComment from "./components/InvestorComment";
import LogsTable from "@/views/logs/list/LogsTable";
import { mapGetters } from "vuex";
import UserTagsManaging from "@/views/tags/UserTagsManaging";
import AddExternal from "@/components/partials/AddExternal/AddExternal";
import CompanyBackgroundData from "@/views/global/components/profile/CompanyBackgroundData";
import InvestorBackgroundData from "@/views/global/components/profile/InvestorBackgroundData";
import InvestorInterestsData from "@/views/global/components/profile/InvestorInterestsData";
import InvestorAddressData from "@/views/global/components/profile/InvestorAddressData";
import CompanyComments from "@/components/CompanyComments";
import MailingContactWidget from "@/views/global/components/profile/MailingContactWidget";
import SButton from "@/s-components/Button/SButton.vue";
import CompanyOwnership from "@/components/CompanyOwnership.vue";
import InvestorManagedProducts from "@/views/global/components/profile/InvestorManagedProducts.vue";
import UserTagsManagingDialog from "@/views/tags/UserTagsManagingDialog.vue";

export default {
  components: {
    UserTagsManagingDialog,
    CompanyOwnership,
    SButton,
    CompanyComments,
    InvestorAddressData,
    InvestorInterestsData,
    InvestorBackgroundData,
    CompanyBackgroundData,
    AddExternal,
    InvestorComment,
    LogsTable,
    UserTagsManaging,
    MailingContactWidget,
    InvestorManagedProducts,
  },
  props: {
    user: {
      type: [Object, null],
      default: () => ({ profile: {} }),
    },
    lastEvent: {
      type: Object,
      default: null,
    },
    conference: {
      type: Boolean,
      default: false,
    },
    company: {
      type: Object,
      default: null,
    },
  },
  emits: ["update-profile", "company-comments", "updateProfile"],
  data() {
    return {
      companyCommentDialog: false,
      items: [
        {
          text: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
          info: "Renato Bollinger, January 25, 2021",
        },
        {
          text: "Wish I could come, but I'm out of town this weekend.",
          info: "Scarlet Johanson, January 25, 2021",
        },
        {
          text: "Do you have Paris recommendations? Have you ever been?",
          info: "Sandra Adams, Some day",
        },
        {
          text: "Wish I could come, but I'm out of town this weekend. Do you have Paris recommendations? Have you ever been?",
          info: "Sandra Adams, Some day",
        },
        {
          text: "Wish I could come, but I'm out of town this weekend.",
          info: "Scarlet Johanson, January 25, 2021",
        },
      ],
      events: 0,
      companyComments: [],
      companyOwnershipData: [],
      productOwnershipData: [],
      totalLogsWithInvestor: null,
      totalLogsWithCompany: null,
    };
  },
  computed: {
    ...mapGetters([
      "isAuthorized",
      "isSuperAdmin",
      "isAnyAdmin",
      "isCorporate",
      "isInvestor",
      "userData",
    ]),
    currentUser() {
      return this.userData;
    },
    canSeeLogs() {
      return (
        this.isSuperAdmin ||
        this.isAuthorized("irm") || // for corporate & regular admin
        this.isAuthorized("irm_full") // for regular admin
      );
    },
    canSeeOwnershipData() {
      return (
        this.user.company &&
        ((this.isAnyAdmin && this.isAuthorized("manage_all_ownership_data")) ||
          (this.isCorporate && this.isAuthorized("manage_related_ownership_data")))
      );
    },
    canSeeCompanyComments() {
      return this.user.id && this.user.company_id && (this.isAnyAdmin || this.isCorporate);
    },
    canSeeCompanyTags() {
      return (this.isCorporate || this.isAnyAdmin) && this.user.id;
    },
    canSeeInvestorComment() {
      return (
        this.user.id &&
        (this.isAnyAdmin ||
          (this.isCorporate && this.isAuthorized("view_and_manage_linked_investors")))
      );
    },
    canSeeMailingContact() {
      return this.currentUser.id && !this.isInvestor && this.user.contact;
    },
    investorDescription: {
      set: function (value) {
        this.user.investor_description = value;
      },
      get: function () {
        return this.user.investor_description || "";
      },
    },
    canEdit() {
      return (
        this.$store.getters.isInvestor &&
        parseInt(this.user.id) === parseInt(this.$store.state.user.data.id)
      );
    },
    companyTypes() {
      return this.$store.state.settings.companyTypes;
    },
    slotTypes() {
      return this.$store.state.settings.slotTypes;
    },
    companyName() {
      return this.$store.getters.isSuperAdmin
        ? this.company
          ? this.company.name
          : ""
        : this.currentUserCompanyName;
    },
    currentUserCompanyName() {
      return this.$store.state.user.data.company ? this.$store.state.user.data.company.name : "";
    },
    investorId() {
      return this.user.id;
    },
    investorCompanyId() {
      return this.user.company_id;
    },
    defaultLogsWithInvestorFilters() {
      return {
        type: "INTERACTION",
        user: this.investorId,
        owned_by_company: this.currentUser.company_id,
        itemsPerPage: 5,
      };
    },
    defaultLogsWithCompanyFilters() {
      return {
        type: "INTERACTION",
        company: this.investorCompanyId,
        except_user: this.investorId,
        owned_by_company: this.currentUser.company_id,
        itemsPerPage: 5,
      };
    },
  },
  watch: {
    investorId(newUserId, oldUserId) {
      if (this.canSeeLogs && newUserId !== oldUserId) {
        this.$nextTick(() => {
          this.updateLogs();
        });
      }
    },
  },
  methods: {
    updateLogs() {
      this.$refs["logs-with-investor-table"].fetchLogs();
      this.$refs["logs-with-company-table"].fetchLogs();
    },
    updateInvestorComment(newComment) {
      this.investorDescription = newComment;
      this.user.is_linked = true;
    },
    updateUserTags({ userTags }) {
      this.$emit("update-profile", userTags);
    },
    updateCompanyComments(comments) {
      this.companyComments = comments;
      this.$emit("company-comments", comments);
    },
  },
};
</script>

<style lang="scss" scoped>
.row + .row {
  margin-top: 6px;
}

:deep(.v-toolbar__title) {
  white-space: normal;
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

@media (max-width: 440px) {
  .profile__widget {
    & :deep(.v-toolbar__content) {
      flex-direction: column;
      align-items: start;
      gap: 5px;
      height: auto !important;
      padding: 16px;
    }
  }
}
</style>
