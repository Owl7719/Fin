<template>
  <v-row no-gutters class="flex-column">
    <v-col class="mb-2">
      <div class="headline font-weight-medium mb-3">{{ title }}</div>
    </v-col>

    <v-col v-if="infoMessage && !successMessage">
      <v-alert :model-value="true" type="info" variant="outlined" class="mb-2">
        <div v-sanitize="infoMessage"></div>
      </v-alert>
    </v-col>

    <v-col v-if="successMessage">
      <v-alert :model-value="true" type="success" variant="outlined" class="mb-2">
        {{ successMessage }}
      </v-alert>
    </v-col>

    <v-col v-if="!successMessage" class="mb-3">
      <v-form ref="form" @submit.prevent="submit">
        <salutation
          ref="salutation"
          v-model="form.salutation"
          label="Pronouns"
          :rules="validation.salutation"
        ></salutation>

        <s-error-wrapper ref="first_name" v-slot="{ errorMessages }">
          <v-text-field
            v-model="form.first_name"
            name="first_name"
            label="First name"
            variant="underlined"
            color="primary"
            :error-messages="errorMessages"
            :rules="validation.first_name"
          ></v-text-field>
        </s-error-wrapper>

        <s-error-wrapper ref="last_name" v-slot="{ errorMessages }">
          <v-text-field
            v-model="form.last_name"
            name="last_name"
            label="Last name"
            type="text"
            variant="underlined"
            color="primary"
            :error-messages="errorMessages"
            :rules="validation.last_name"
          ></v-text-field>
        </s-error-wrapper>

        <s-error-wrapper ref="email" v-slot="{ errorMessages }">
          <v-text-field
            v-model="form.email"
            name="email"
            label="Email address"
            :disabled="lockEmail"
            :rules="validation.email"
            variant="underlined"
            color="primary"
            :error-messages="errorMessages"
            @update:model-value="form.email = String(form.email).toLowerCase()"
          ></v-text-field>
        </s-error-wrapper>

        <investor-type
          v-if="isInvestor"
          ref="investor_type"
          v-model="form.investor_type"
          label="Investor type"
          :rules="validation.investor_type"
        />
        <company-search
          v-if="!isInvestor || !isPrivateInvestor"
          ref="company_id"
          v-model="form.company"
          :clauses="companyClauses"
          label="Company"
          :force-selection="false"
          :rules="validation.company"
        ></company-search>

        <s-error-wrapper ref="company_function" v-slot="{ errorMessages }">
          <v-text-field
            v-if="!isInvestor"
            v-model="form.company_function"
            name="company_function"
            label="Company function"
            autocomplete="off"
            variant="underlined"
            color="primary"
            :error-messages="errorMessages"
            :rules="validation.company_function"
          ></v-text-field>
        </s-error-wrapper>

        <country
          ref="country"
          v-model="form.country"
          label="Country"
          autocomplete="off"
          :rules="validation.country"
        ></country>
        <v-checkbox
          ref="terms_and_conditions"
          v-model="form.terms_and_conditions"
          name="terms_and_conditions"
          class="mt-1"
          density="compact"
          color="primary"
          :rules="validation.terms_and_conditions"
        >
          <template #label>
            <div class="black-label">
              I agree to the
              <router-link target="_blank" to="/terms-of-use" class="document-link" @click.stop>
                Terms of Use
              </router-link>
            </div>
          </template>
        </v-checkbox>
        <div class="mb-4 text-black">
          For details on how we collect, use, and process your data please see our
          <router-link target="_blank" to="/privacy-policy" class="document-link">
            Privacy Policy
          </router-link>
        </div>

        <s-button block :loading="loading" class="mx-0 text-none" submit>Register</s-button>
      </v-form>
    </v-col>
    <v-col class="mt-3">
      Have an account?
      <router-link to="/login" class="auth-link">Login here</router-link>
    </v-col>
    <already-registered-dialog
      v-if="form.email"
      v-model="alreadyRegisteredDialog"
      :email="form.email"
    ></already-registered-dialog>
  </v-row>
</template>

<script>
import Salutation from "@/components/form/SalutationComponent.vue";
import InvestorType from "@/components/form/InvestorType.vue";
import CompanySearch from "@/components/form/CompanySearch.vue";
import AlreadyRegisteredDialog from "@/views/authentication/components/AlreadyRegisteredDialog.vue";
import {
  emailRule,
  minLengthRule,
  requiredNumericRule,
  requiredRule,
} from "@/functions/validation.js";
import { BASE_ROLE, INVESTOR_TYPE } from "@/constants.js";
import AuthApi from "@/api/auth.js";
import get from "lodash-es/get.js";
import handle422 from "@/mixins/handle422.js";
import { pick } from "lodash-es";
import Country from "@/components/form/CountryInput.vue";
import SButton from "@/s-components/Button/SButton.vue";
import SErrorWrapper from "@/s-components/SErrorWrapper.vue";

export default {
  components: {
    SErrorWrapper,
    SButton,
    Salutation,
    InvestorType,
    CompanySearch,
    Country,
    AlreadyRegisteredDialog,
  },
  mixins: [handle422],
  props: {
    defaults: {
      type: Object,
      default: () => ({}),
    },
    lockEmail: {
      type: Boolean,
      default: false,
    },
    infoMessage: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "Register new account",
    },
    registerAccountType: {
      type: String,
      default: BASE_ROLE.INVESTOR,
    },
    additionalFormData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["registered"],
  data() {
    return {
      alreadyRegisteredDialog: false,
      successMessage: "",
      loading: false,
      form: {
        salutation: null,
        first_name: "",
        last_name: "",
        email: "",
        investor_type: null,
        company: null,
        company_function: null,
        country: null,
        terms_and_conditions: null,
      },
    };
  },
  computed: {
    validation() {
      return {
        salutation: [requiredNumericRule],
        first_name: [requiredRule, minLengthRule(3)],
        last_name: [requiredRule],
        email: [requiredRule, emailRule],
        investor_type: [requiredRule],
        company: [requiredRule],
        company_function: [requiredRule],
        country: [requiredRule],
        terms_and_conditions: [(value) => !!value || "The terms and conditions must be accepted"],
      };
    },
    isInvestor() {
      return this.registerAccountType === BASE_ROLE.INVESTOR;
    },
    companyClauses() {
      return this.isInvestor ? "companyType=3,>" : "companyType=3";
    },
    isPrivateInvestor() {
      return this.form.investor_type === INVESTOR_TYPE.PRIVATE_INVESTOR;
    },
    investorFields() {
      return [
        "salutation",
        "first_name",
        "last_name",
        "email",
        "country",
        "investor_type",
        "terms_and_conditions",
      ];
    },
    corporateFields() {
      return [
        "salutation",
        "first_name",
        "last_name",
        "email",
        "company_function",
        "country",
        "terms_and_conditions",
      ];
    },
    formattedForm() {
      const fields = this.isInvestor ? this.investorFields : this.corporateFields;

      const form = pick(this.form, fields);

      for (const [key, value] of Object.entries(this.additionalFormData)) {
        form[key] = value;
      }

      const company = this.form.company;

      if (company && company.id && !this.isPrivateInvestor) {
        form["company_id"] = company.id;
      } else if (company && company.name) {
        form["company_name"] = company.name;
      }

      form["register_account_type"] = this.registerAccountType;

      return form;
    },
  },
  created() {
    if (this.$route.params.email) {
      this.form.email = this.$route.params.email;
    }
    for (const [key, value] of Object.entries(this.defaults)) {
      this.form[key] = value;
    }
    this.$store.dispatch("getPublicSettings", ["salutations", "countries"]);
  },
  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.clearAllValidationErrors();

      this.loading = true;

      try {
        const { data } = await AuthApi.register(this.formattedForm);
        this.successMessage =
          "Your account was created. Please check your email to activate your account.";

        this.$refs.form.reset();
        this.$emit("registered", data.data);
      } catch (e) {
        this.handleResponseError(e);
      } finally {
        this.loading = false;
      }
    },
    handleResponseError(error) {
      const errors = get(error, "response.data.errors", {});

      const userErrors = get(errors, "user", []);
      if (userErrors.includes("user_exists")) {
        this.alreadyRegisteredDialog = true;
      }

      const companyNameErrors = get(errors, "company_name", []);
      const companyIdErrors = get(errors, "company_id", []);
      if (companyIdErrors.length === 0 && companyNameErrors.length) {
        this.$refs.company_id.errorMessages =
          this.$refs.company_id.errorMessages.concat(companyNameErrors);
      }
    },
  },
};
</script>

<style scoped>
.document-link {
  text-decoration: underline !important;
  color: black !important;
}

:deep(.v-selection-control--error .document-link) {
  color: inherit !important;
}

.auth-link {
  text-decoration: underline !important;
  color: #016bbf;
}

:deep(.v-selection-control .v-icon--size-default) {
  font-size: 20px !important;
}

:deep(.v-selection-control--density-compact) {
  --v-selection-control-size: 24px;
}

:deep(.v-selection-control .v-selection-control__wrapper) {
  margin-right: 8px;
}

:deep(.v-input--density-compact) {
  --v-input-control-height: 24px;
}
</style>
