<template>
  <s-dialog
    :model-value="dialog"
    max-width="500"
    eager
    persistent
    :title="dialogTitle"
    @update:model-value="close"
  >
    <template #content>
      <v-form ref="form" lazy-validation>
        <v-row class="pa-2">
          <v-col cols="12">
            <salutation-component
              ref="salutation"
              v-model="representative.profile.salutation"
              label="Pronouns"
              :rules="rules.salutation"
            ></salutation-component>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="representative.email"
              :disabled="!canChangeEmail"
              :rules="rules.email"
              :error-messages="emailError"
              label="Email"
              variant="underlined"
              color="primary"
              @blur="validateEmail"
              @update:model-value="(e) => (representative.email = String(e).toLowerCase())"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="representative.first_name"
              :rules="rules.firstName"
              label="First Name"
              variant="underlined"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="representative.last_name"
              :rules="rules.lastName"
              label="Last name"
              variant="underlined"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col v-if="isRoleEditable" cols="12">
            <v-select
              v-model="representative.role_id"
              label="Role"
              item-value="id"
              :item-title="roleText"
              variant="underlined"
              color="primary"
              :rules="rules.role"
              :items="nonSensitiveCorporateRoles"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="representative.company_function"
              :rules="rules.companyRole"
              label="Company function"
              variant="underlined"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <country
              v-model="representative.profile.country"
              :rules="rules.country"
              label="Country"
            ></country>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model="representative.email_groups.corporate"
              color="primary"
              label="Receives notifications"
              hint="If this box is ticked, user will receive e-mail notifications about incoming investor requests and new sign-up to the Company’s distribution list(s)"
              persistent-hint
            ></v-checkbox>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model="representative.email_groups.crm"
              color="primary"
              label="crm Emails"
              hint="If this box is ticked, user will receive e-mail notifications from crm (invites, confirmations, etc)"
              persistent-hint
            ></v-checkbox>
          </v-col>
          <v-col cols="12">
            <slot></slot>
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #actions>
      <v-spacer></v-spacer>
      <s-button type="tertiary" @click="close">Cancel</s-button>
      <s-button @click="submit">
        {{ isCreation ? "Create" : "Update" }}
      </s-button>
    </template>
  </s-dialog>
</template>

<script>
import { requiredRule, emailRule, requiredNumericRule } from "@/functions/validation";
import Country from "@/components/form/CountryInput";
import { cloneDeep } from "lodash-es";
import SDialog from "@/s-components/Dialog/SDialog.vue";
import UsersApi from "@/api/users.js";
import SalutationComponent from "@/components/form/SalutationComponent.vue";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, Country, SDialog, SalutationComponent },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      required: true,
    },
    canChangeEmail: {
      type: Boolean,
      default: true,
    },
    receiveEmailsCheckboxRecommendation: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "submit"],
  data() {
    return {
      representative: {},
      validEmail: true,
      emailError: "",
      rules: {
        salutation: [requiredNumericRule],
        email: [requiredRule, emailRule],
        firstName: [requiredRule],
        lastName: [requiredRule],
        role: [requiredRule],
        companyRole: [requiredRule],
        country: [requiredRule],
      },
    };
  },
  computed: {
    dialogTitle() {
      return `${this.isCreation ? "Add" : "Edit"} company representative`;
    },
    salutations() {
      return this.$store.state.settings.salutations;
    },
    isCreation() {
      return !this.representative.uuid;
    },
    isRoleEditable() {
      return (
        this.isCreation ||
        this.nonSensitiveCorporateRoles.find((it) => {
          return it.id === this.representative.role_id;
        })
      );
    },
    nonSensitiveCorporateRoles() {
      let roles = this.$store.state.settings.roles;

      const nonSensitiveCorporateRoles = roles.filter((it) => {
        return it.base_role === "CORPORATE" && (it.sensitive === false || it.default);
      });
      return nonSensitiveCorporateRoles;
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.representative = cloneDeep(newValue);
      },
    },
  },
  methods: {
    roleText(value) {
      return `[${value.base_role}] ${value.name}`;
    },
    close() {
      this.$emit("close");
    },
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        this.$nextTick(() => {
          const errorElement = document.querySelector(".v-messages__message:first-of-type");
          errorElement.scrollIntoView({ block: "center", behavior: "smooth" });
        });
        return this.error("Validation error. Please see form for details.");
      }
      this.$emit("submit", this.representative);
    },
    validateEmail() {
      if (emailRule(this.representative.email) !== true) {
        return;
      }
      UsersApi.checkEmail(this.representative.email).then((response) => {
        if (response.data.uuid && this.representative.uuid !== response.data.uuid) {
          this.validEmail = false;
          this.emailError = "The email has already been taken.";
        } else {
          this.validEmail = true;
          this.emailError = "";
        }
      });
    },
  },
};
</script>
