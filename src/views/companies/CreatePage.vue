<template>
  <v-container fluid>
    <v-card variant="outlined">
      <div class="bg-white border-b">
        <company-tabs-stub></company-tabs-stub>
      </div>

      <s-scrollable-card ref="scrollable-card" class="pa-0" header-divider>
        <template #header-actions>
          <v-spacer></v-spacer>
          <s-button @click="create">Create</s-button>
        </template>

        <template #scrollable-content>
          <v-row>
            <v-col cols="12" md="10" lg="8" offset-md="1" offset-lg="2">
              <general-form
                ref="form"
                v-model="company"
                :errors="validationErrors"
                class="py-3"
              ></general-form>
            </v-col>
          </v-row>
        </template>
      </s-scrollable-card>
    </v-card>
  </v-container>
</template>

<script>
import GeneralForm from "@/views/companies/components/GeneralForm";
import CompanyTabsStub from "@/views/companies/components/CompanyTabsStub";
import SScrollableCard from "@/s-components/SScrollableCard.vue";
import CompanyApi from "@/api/companies";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: {
    CompanyTabsStub,
    GeneralForm,
    SScrollableCard,
    SButton,
  },
  data() {
    return {
      company: {},
      validationErrors: {},
    };
  },
  methods: {
    async create() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return this.error("Validation error. Please see form for details");
      }
      this.validationErrors = {};
      return CompanyApi.create(this.company)
        .then((response) => {
          this.success("Company created");
          this.goToEditPage(response.data.id);
        })
        .catch((error) => {
          this.error("Validation error. Please see form for details");
          if (error.response && error.response.status === 422) {
            this.validationErrors = error.response.data.errors;
          }
        });
    },
    goToEditPage(companyId) {
      this.$router.push({
        name: "admin-companies-edit",
        params: { id: companyId },
      });
    },
    resizable() {
      return this.$refs["should-fit-height"];
    },
  },
};
</script>

<style scoped>
:deep(.v-divider) {
  margin: 0 16px !important;
}
</style>
