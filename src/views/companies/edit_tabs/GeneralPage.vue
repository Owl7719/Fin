<template>
  <s-scrollable-card ref="scrollable-card" class="pb-2 pa-0" header-divider>
    <template #header-actions>
      <meeting-request-dialog-outer v-if="company" :company="company" />
      <v-spacer></v-spacer>
      <s-button @click="save">Save</s-button>
    </template>

    <template #scrollable-content>
      <v-row class="pa-3">
        <v-col cols="12" md="10" lg="8" offset-md="1" offset-lg="2">
          <general-form
            ref="form"
            v-model="form"
            :errors="validationErrors"
            :form-disabled="!canEditCompany"
          ></general-form>

          <company-representatives-list
            v-if="canSeeAndEditRepresentatives"
            v-model="form.allRepresentatives"
            :company-id="storedCompany.id"
            :company-type-id="companyTypeId"
            class="pb-5 mt-5"
          ></company-representatives-list>
        </v-col>
      </v-row>

      <s-dialog
        :model-value="unsavedChangesData.dialog"
        :max-width="500"
        title="Leave Page?"
        persistent
        @update:model-value="unsavedChangesData.dialog = false"
      >
        <template #content>
          <div>You have unsaved changes.</div>
        </template>
        <template #actions>
          <v-spacer></v-spacer>
          <s-button type="tertiary" @click="cancel">Cancel</s-button>
          <s-button type="tertiary" @click="leaveWithoutSaving">Leave</s-button>
          <s-button @click="leaveWithSaving">Save & Leave</s-button>
        </template>
      </s-dialog>
    </template>
  </s-scrollable-card>
</template>

<script>
import GeneralForm from "@/views/companies/components/GeneralForm";
import CompanyRepresentativesList from "@/views/companies/components/CompanyRepresentativesList";
import MeetingRequestDialogOuter from "@/views/companies/components/MeetingRequestDialogOuter";
import pick from "lodash-es/pick";
import omit from "lodash-es/omit";
import { mapGetters } from "vuex";
import canEditCompany from "../mixins/can-edit-company";
import SButton from "@/s-components/Button/SButton.vue";
import SScrollableCard from "@/s-components/SScrollableCard.vue";
import CompanyApi from "@/api/companies";
import SDialog from "@/s-components/Dialog/SDialog.vue";

export default {
  components: {
    SDialog,
    MeetingRequestDialogOuter,
    CompanyRepresentativesList,
    GeneralForm,
    SButton,
    SScrollableCard,
  },
  mixins: [canEditCompany],
  beforeRouteLeave(to, from, next) {
    if (this.hasChanges) {
      this.unsavedChangesData.dialog = true;
      this.unsavedChangesData.goToNextPage = next;
    } else {
      next();
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: null,
        isin: null,
        isin2: null,
        company_type_id: null,
        country: null,
        description: null,
        address: null,
        zip_code: null,
        city: null,
        aum_option_id: null,
        aum: null,
        allRepresentatives: [],
        // fields needed for meeting request dialog
        event_enabled: null,
        market_cap_id: null,
        average_market_liquidity_id: null,
        sector_id: null,
        stock_market_country_id: null,
        shares_outstanding: null,
      },
      validationErrors: {},
      snapshot: null,
      unsavedChangesData: {
        dialog: false,
        goToNextPage: null,
      },
    };
  },
  computed: {
    ...mapGetters(["isAnyAdmin", "isCorporate", "isAuthorized"]),
    ...mapGetters({ storedCompany: "company/getCompany" }),
    canSeeAndEditRepresentatives() {
      return (
        this.isAnyAdmin ||
        (this.isCorporate && this.isAuthorized("view_and_manage_company_representatives"))
      );
    },
    company() {
      return this.form;
    },
    companyTypeId() {
      return this.form.company_type_id || 0;
    },
    hasChanges() {
      return this.snapshot !== JSON.stringify(this.form);
    },
  },
  mounted() {
    this.form = {
      ...this.form,
      ...pick(this.storedCompany, Object.keys(this.form)),
    };

    this.convertNullValuesToString();
    this.saveSnapshot();
  },
  methods: {
    async save() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return this.error("Validation error. Please see form for details");
      }
      this.validationErrors = {};
      return CompanyApi.update(this.storedCompany.id, this.updateRequestData())
        .then(() => {
          this.success("Company updated");
          this.saveSnapshot();

          if (this.unsavedChangesData.goToNextPage) {
            this.unsavedChangesData.goToNextPage();
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 422) {
            this.validationErrors = error.response.data.errors;
          }

          this.unsavedChangesData.goToNextPage = null;
        })
        .finally(() => {
          if (this.$refs["scrollable-card"]) {
            this.$refs["scrollable-card"].scrollToTop();
          }
        });
    },
    updateRequestData() {
      const omitForCorporateType = ["aum", "aum_option_id"];
      const omitForInvestmentType = [
        "market_cap_id",
        "average_market_liquidity_id",
        "stock_market_country_id",
        "sector_id",
      ];
      const omitForCrmType = [...omitForCorporateType, ...omitForInvestmentType];

      if (this.form.company_type_id === 3) {
        return omit(this.form, omitForCorporateType);
      }
      if (this.form.company_type_id > 3) {
        return omit(this.form, omitForInvestmentType);
      }
      return omit(this.form, omitForCrmType);
    },
    saveSnapshot() {
      this.snapshot = JSON.stringify(this.form);
    },
    leaveWithoutSaving() {
      this.unsavedChangesData.goToNextPage();
      this.unsavedChangesData.dialog = false;
    },
    leaveWithSaving() {
      this.unsavedChangesData.dialog = false;
      this.save();
    },
    cancel() {
      this.unsavedChangesData.dialog = false;
    },
    convertNullValuesToString() {
      Object.keys(this.form).forEach((key) => {
        const keys = ["description", "isin", "isin2", "shares_outstanding", "aum"];

        if (keys.includes(key)) {
          this.form[key] = this.form[key] ?? "";
        }
      });
    },
  },
};
</script>

<style scoped>
:deep(.v-divider) {
  margin: 0 16px !important;
}
@media (max-width: 800px) {
  :deep(.scroll-wrapper) {
    overflow: hidden;
    height: 100% !important;
  }
}
</style>
