<template>
  <div>
    <s-scrollable-card ref="scrollable-card" class="pa-0" header-divider>
      <template #header-actions>
        <v-spacer></v-spacer>
        <s-button @click="save">Save</s-button>
      </template>

      <template #scrollable-content>
        <v-row class="pa-3 justify-center">
          <v-col cols="12" md="10" lg="8">
            <v-switch
              v-if="isAnyAdmin"
              :model-value="Boolean(form.event_enabled)"
              class="pt-4"
              color="green"
              label="Events enabled"
              @update:model-value="form.event_enabled = $event"
            ></v-switch>
            <events-form
              ref="form"
              v-model="form"
              :form-disabled="!canEditCompany || !form.event_enabled"
              :errors="validationErrors"
            ></events-form>
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
  </div>
</template>

<script>
import EventsForm from "@/views/companies/components/EventsForm";
import { mapGetters } from "vuex";
import pick from "lodash-es/pick";
import omit from "lodash-es/omit";
import canEditCompany from "../mixins/can-edit-company";
import SScrollableCard from "@/s-components/SScrollableCard.vue";
import CompanyApi from "@/api/companies";
import SDialog from "@/s-components/Dialog/SDialog.vue";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, SDialog, EventsForm, SScrollableCard },
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
      companyLoaded: false,
      form: {
        id: null,
        event_enabled: false,
        isin: null,
        custom_sender_email: null,
        email_signature: null,
        marketing_opt_in_enabled: null,
        marketing_opt_in_text: null,
        six_interaction_request_enabled: null,
        widgets_enabled: null,
        widget_templates: null,
        hidden_1click_registrations: null,
        zoom_credentials: {},
        allRepresentatives: [],
        description: null,
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
    ...mapGetters(["isAnyAdmin"]),
    ...mapGetters({ storedCompany: "company/getCompany" }),
    company() {
      return this.form;
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
      if (!(await this.$refs.form.validate())) {
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
      return omit(this.form, ["company_type_id"]);
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
        const keys = [
          "description",
          "custom_sender_email",
          "email_signature",
          "marketing_opt_in_text",
        ];

        if (keys.includes(key)) {
          this.form[key] = this.form[key] ?? "";
        }
      });

      Object.keys(this.form.zoom_credentials).forEach((key) => {
        this.form.zoom_credentials[key] = this.form.zoom_credentials[key] ?? "";
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
