<template>
  <s-dialog
    :model-value="modelValue"
    :max-width="500"
    title="Your email address already exists on crm"
    persistent
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #content>
      <v-alert
        v-if="actionComplete && successMessage"
        :model-value="true"
        type="success"
        variant="outlined"
        :style="{ width: '100%' }"
        class="mb-2"
        >{{ successMessage }}
      </v-alert>
      <v-alert
        v-else-if="actionComplete && errorMessage"
        :model-value="true"
        type="error"
        variant="outlined"
        :style="{ width: '100%' }"
        class="mb-2"
        >{{ errorMessage }}
      </v-alert>
      <p v-else>
        Email address <b>{{ email }}</b> already exists on crm. Please reset your password or
        use magic link to login.
      </p>
    </template>
    <template v-if="!actionComplete" #actions>
      <v-spacer></v-spacer>
      <s-button :loading="resetPasswordLoading" :disabled="magicLinkLoading" @click="resetPassword">
        Reset password
      </s-button>
      <s-button
        :loading="magicLinkLoading"
        :disabled="resetPasswordLoading"
        class="text-none"
        @click="sendMagicLink"
      >
        Send me a magic link
      </s-button>
    </template>
  </s-dialog>
</template>

<script>
import SDialog from "@/s-components/Dialog/SDialog.vue";
import AuthApi from "@/api/auth.js";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, SDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  emits: ["update:model-value"],
  data() {
    return {
      successMessage: "",
      errorMessage: "",
      resetPasswordLoading: false,
      magicLinkLoading: false,
      actionComplete: false,
    };
  },
  computed: {
    loading() {
      return this.resetPasswordLoading || this.magicLinkLoading;
    },
  },
  watch: {
    value(value) {
      if (!value) {
        this.actionComplete = false;
        this.successMessage = false;
        this.errorMessage = false;
      }
    },
  },
  methods: {
    async sendMagicLink() {
      this.magicLinkLoading = true;
      try {
        const { data } = await AuthApi.sendMagicLink({ email: this.email });
        this.successMessage = data.message;
      } catch (e) {
        this.errorMessage = "Failed to send an email with a magic link.";
      } finally {
        this.actionComplete = true;
        this.magicLinkLoading = false;
      }
    },
    async resetPassword() {
      try {
        this.resetPasswordLoading = true;
        const { data } = await AuthApi.forgotPassword({ email: this.email });

        this.successMessage = data.message;
      } catch (e) {
        this.errorMessage = "Failed to send an email with a reset password link.";
      } finally {
        this.resetPasswordLoading = false;
        this.actionComplete = true;
      }
    },
  },
};
</script>
