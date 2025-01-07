<template>
  <v-form ref="form" lazy-validation :class="{ 'text-grey': formDisabled }">
    <!-- COMPANY DESCRIPTION -->
    <div>
      <section-header title="Company description (Events)"></section-header>
      <editor
        v-if="!formDisabled"
        ref="description"
        :model-value="modelValue.description"
        :height="400"
        @update:model-value="changed({ description: $event })"
      ></editor>
      <div v-else v-sanitize="modelValue.description || 'n/a'" class="wysiwyg_text"></div>
      <input-validation-errors :errors="errors.description || []"></input-validation-errors>
      <div class="text-right">
        <char-counter class="mt-1" :text="modelValue.description" :max-chars="5000"></char-counter>
      </div>
    </div>

    <div class="mb-4">
      <section-header class="mt-5" title="Custom sender email & signature"></section-header>
      <div v-if="isSuperAdmin || modelValue.custom_sender_email">
        <v-text-field
          ref="custom_sender_email"
          :model-value="modelValue.custom_sender_email"
          label="Custom sender email address"
          :disabled="!canCustomSenderEmailBeSet || formDisabled"
          :error-messages="errors.custom_sender_email || []"
          variant="underlined"
          color="primary"
          @update:model-value="changed({ custom_sender_email: $event })"
        ></v-text-field>
        <v-alert
          color="bg-orange-darken-3"
          class="mb-3"
          variant="outlined"
          :model-value="receiveEmailsCount === 0 && modelValue.custom_sender_email"
        >
          In order for "custom email sender address" to work at least one representative should
          receive emails
        </v-alert>
      </div>

      <div v-if="isSupportAdmin && modelValue.custom_sender_email" class="custom_sender_email mb-2">
        <v-icon class="pr-1 material-icons-outlined" medium>info</v-icon>
        <strong>{{ modelValue.name }}</strong> has custom sender's email configured to
        <strong>{{ modelValue.custom_sender_email }}</strong>
      </div>
    </div>

    <div>
      <label class="d-block mb-1">
        Email signature
        <span v-if="!modelValue.email_signature" class="text--secondary">
          (if empty default crm signature will be used)
        </span>
        <span v-else class="text--secondary">
          (it will be used for invites, confirmations and reminders)
        </span>
      </label>
      <editor
        v-if="!formDisabled"
        :model-value="modelValue.email_signature"
        :height="400"
        :error-messages="errors.email_signature || []"
        @update:model-value="changed({ email_signature: $event })"
      ></editor>
      <div v-else v-sanitize="modelValue.email_signature || 'n/a'" class="wysiwyg_text"></div>
      <error-message ref="email_signature_error"></error-message>
      <div class="text-right">
        <char-counter
          class="mt-1"
          :text="modelValue.email_signature"
          :max-chars="2000"
        ></char-counter>
      </div>
    </div>

    <zoom-credentials
      :model-value="modelValue.zoom_credentials"
      :disabled="formDisabled"
      :error-messages="errors.zoom_credentials || []"
      @update:model-value="changed({ zoom_credentials: $event })"
    ></zoom-credentials>

    <div v-if="isAnyAdmin" class="pt-5">
      <section-header title="Marketing email opt-in"></section-header>
      <v-checkbox
        ref="marketing_opt_in_enabled"
        :model-value="modelValue.marketing_opt_in_enabled"
        color="primary"
        label="Show marketing email opt-in for investor requests"
        hide-details
        class="mb-2"
        :disabled="formDisabled"
        :error-messages="errors.marketing_opt_in_enabled || []"
        @update:model-value="changed({ marketing_opt_in_enabled: !!$event })"
      ></v-checkbox>
      <v-textarea
        ref="marketing_opt_in_text"
        rows="2"
        :model-value="modelValue.marketing_opt_in_text"
        :disabled="!modelValue.marketing_opt_in_enabled || formDisabled"
        label="Marketing email opt-in text"
        :error-messages="errors.marketing_opt_in_text || []"
        variant="underlined"
        color="primary"
        @update:model-value="changed({ marketing_opt_in_text: $event })"
      ></v-textarea>
    </div>

    <v-checkbox
      v-if="isOfCrmType"
      :model-value="modelValue.hidden_1click_registrations"
      :disabled="formDisabled"
      label="1-click registrations are hidden for owned events"
      color="primary"
      :error-messages="errors.hidden_1click_registrations || []"
      @update:model-value="changed({ hidden_1click_registrations: !!$event })"
    ></v-checkbox>
  </v-form>
</template>

<script>
import ZoomCredentials from "../components/ZoomCredentials";
import ErrorMessage from "@/components/form/ErrorMessage";
import CharCounter from "@/components/form/CharCounter";
import Editor from "@/components/TinyMCEField";
import { mapGetters } from "vuex";
import InputValidationErrors from "@/components/form/InputValidationErrors";
import SectionHeader from "@/views/companies/components/bridge/SectionHeader";

export default {
  components: {
    CharCounter,
    ZoomCredentials,
    ErrorMessage,
    Editor,
    InputValidationErrors,
    SectionHeader,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    formDisabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:model-value"],
  computed: {
    ...mapGetters(["isSupportAdmin", "isSuperAdmin", "userData", "isAuthorized", "isAnyAdmin"]),
    isOfCrmType() {
      return [1, 2].includes(this.modelValue.company_type_id);
    },
    canCustomSenderEmailBeSet() {
      return (this.modelValue.event_enabled || this.isOfCrmType) && this.isSuperAdmin;
    },
    receiveEmailsCount() {
      return this.modelValue.allRepresentatives.filter(
        (rep) => rep.active && rep.email_groups.corporate
      ).length;
    },
  },
  methods: {
    changed(changes) {
      this.$emit("update:model-value", { ...this.modelValue, ...changes });
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();
      return valid;
    },
  },
};
</script>
