<template>
  <v-form ref="form">
    <s-error-wrapper ref="name" v-slot="{ errorMessages }">
      <v-text-field
        v-model="form.name"
        :rules="rules.name"
        label="Name"
        variant="underlined"
        color="primary"
        :error-messages="errorMessages"
      ></v-text-field>
    </s-error-wrapper>

    <v-select
      ref="type"
      v-model="form.base_role"
      :items="baseRoles"
      label="Type"
      variant="underlined"
      color="primary"
      @update:model-value="form.permissions = []"
    ></v-select>

    <v-textarea
      ref="description"
      v-model="form.description"
      :counter="500"
      label="Description"
      :rules="rules.description"
      variant="underlined"
      color="primary"
    ></v-textarea>

    <v-switch
      v-model="form.default"
      label="Default for base role"
      hide-details
      color="secondary"
    ></v-switch>

    <v-switch
      v-if="form.base_role === BASE_ROLE.CORPORATE"
      v-model="form.sensitive"
      label="Sensitive"
      hide-details
      color="red-darken-1"
    ></v-switch>
    <BaseRolePermission v-model="form.permissions" :base-role="form.base_role"></BaseRolePermission>
    <div class="mt-5 text-center">
      <s-button v-if="onBack" type="tertiary" class="mr-2" @click="onBack"> Back </s-button>
      <s-button class="mr-2" :disabled="loading" @click="save"> Save </s-button>
      <s-button :disabled="loading" @click="saveAndGoBack"> Save & Go Back </s-button>
    </div>
  </v-form>
</template>

<script>
import handle422 from "@/mixins/handle422";
import { BASE_ROLE } from "@/constants";
import BaseRolePermission from "@/views/roles/BaseRolePermission";
import { maxLengthRule, minLengthRule, requiredRule } from "@/functions/validation";
import SButton from "@/s-components/Button/SButton.vue";
import SErrorWrapper from "@/s-components/SErrorWrapper.vue";

export default {
  components: {
    SErrorWrapper,
    SButton,
    BaseRolePermission,
  },
  mixins: [handle422],
  props: {
    onSave: {
      type: Function,
      required: true,
    },
    onBack: {
      type: Function,
      default: () => true,
    },
    initialData: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      BASE_ROLE,
      form: {
        base_role: "CORPORATE",
        name: "",
        description: "",
        permissions: [],
      },
      rules: {
        name: [requiredRule, minLengthRule(3)],
        description: [maxLengthRule(500)],
      },
    };
  },
  computed: {
    baseRoles() {
      return Object.keys(this.$store.state.settings.baseRolesPermissions);
    },
  },
  watch: {
    initialData: {
      handler(newVal) {
        this.form = newVal;
      },
      deep: true,
    },
  },
  methods: {
    async save() {
      const { valid } = await this.isFormValid();
      if (!valid) return this.error("Form is invalid. Please, fill fields correctly.");
      this.onSave(this.form);
    },
    async saveAndGoBack() {
      const { valid } = await this.isFormValid();
      if (!valid) return this.error("Form is invalid. Please, fill fields correctly.");
      this.onSave(this.form).then(() => {
        this.$router.push({ name: "roles-list" });
      });
    },
    isFormValid() {
      return this.$refs["form"].validate();
    },
  },
};
</script>

<style scoped></style>
