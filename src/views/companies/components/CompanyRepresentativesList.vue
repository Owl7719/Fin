<template>
  <div class="mt-2">
    <v-row class="mb-2">
      <v-col cols="6">
        <h3 class="pt-2 title">Company representatives</h3>
      </v-col>
      <v-col cols="6" class="text-right">
        <s-button :disabled="formDisabled" type="secondary" @click="openCreateDialog">
          Add
        </s-button>
      </v-col>
    </v-row>

    <v-alert
      color="error"
      variant="outlined"
      :model-value="receiveEmailsCount === 0 && representativesCount > 0 && canSeeMessage"
      class="mb-2"
    >
      Nobody in the company receives email notifications
    </v-alert>

    <v-data-table
      id="representatives"
      class="border-1"
      light
      :items="filterUsers"
      :headers="headers"
      hide-default-footer
      :mobile-breakpoint="0"
      :items-per-page="-1"
    >
      <template #item="{ item }">
        <tr>
          <td class="text-left">
            {{ item.first_name }}
          </td>
          <td class="text-left">
            {{ item.last_name }}
          </td>
          <td class="text-left">
            {{ item.company_function }}
          </td>
          <td class="text-left">[{{ item.role.base_role }}] {{ item.role.name }}</td>
          <td class="text-left">
            {{ item.active ? "Yes" : "No" }}
          </td>
          <td class="text-center">
            {{ item.email_groups.corporate ? "Yes" : "No" }}
          </td>
          <td class="text-center">
            <v-menu offset-y>
              <template #activator="{ props }">
                <s-button type="tertiary" size="small" icon v-bind="props">
                  <v-icon>more_vert</v-icon>
                </s-button>
              </template>
              <v-list>
                <v-list-item
                  @click="
                    $router.push({
                      name: 'investor-profile',
                      params: { uuid: item.uuid },
                    })
                  "
                >
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="formDisabled || !isRepresentativeActionEnabled(item)"
                  @click="openEditDialog(item)"
                >
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.active"
                  :disabled="formDisabled || !isRepresentativeActionEnabled(item)"
                  @click="deactivateRepresentative(item.uuid)"
                >
                  <v-list-item-title>Inactivate</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-else
                  :disabled="formDisabled || !isRepresentativeActionEnabled(item)"
                  @click="activateRepresentative(item.uuid)"
                >
                  <v-list-item-title>Activate</v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="formDisabled || !isRepresentativeActionEnabled(item)"
                  @click="removePermissions(item.uuid)"
                >
                  <v-list-item-title>Remove Permissions</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <error-message ref="representatives"></error-message>

    <company-representative-dialog
      ref="company-representative-dialog"
      v-model="dialogRepresentative"
      :dialog="representativeDialogOpened"
      @close="representativeDialogOpened = false"
      @submit="submitRepresentative"
    >
      <div
        v-show="receiveEmailsCount === 0 && canSeeMessage"
        class="mt-2 text-deep-orange-darken-3"
      >
        It is recommended for at least one company's corporate to receive notifications
      </div>
    </company-representative-dialog>
    <send-set-password-email-dialog ref="send-confirmation"></send-set-password-email-dialog>
  </div>
</template>

<script>
import ErrorMessage from "@/components/form/ErrorMessage";
import CompanyRepresentativeDialog from "@/views/companies/components/CompanyRepresentativeDialog";
import SendSetPasswordEmailDialog from "@/views/companies/components/SendSetPasswordEmailDialog";
import { mapGetters } from "vuex";
import { COMPANIES_TYPES } from "@/constants";
import UsersApi from "@/api/users";
import SButton from "@/s-components/Button/SButton.vue";

const defaultRepresentativeData = {
  profile: { country: null },
  email_groups: {
    crm: true,
  },
};

export default {
  components: {
    SButton,
    CompanyRepresentativeDialog,
    ErrorMessage,
    SendSetPasswordEmailDialog,
  },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    companyId: {
      type: Number,
      required: true,
    },
    formDisabled: {
      type: Boolean,
      default: false,
    },
    companyTypeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      representativeDialogOpened: false,
      dialogRepresentative: { ...defaultRepresentativeData },
    };
  },
  computed: {
    ...mapGetters(["isSuperAdmin", "isAnyAdmin"]),
    headers() {
      return [
        {
          title: "First name",
          align: "left",
          sortable: false,
          value: "first_name",
        },
        {
          title: "Last name",
          align: "left",
          value: "last_name",
          sortable: false,
        },
        {
          title: "Company function",
          align: "left",
          value: "company_function",
          sortable: false,
        },
        {
          title: "Role",
          align: "left",
          value: "role",
          sortable: false,
        },
        {
          title: "Active",
          align: "left",
          value: "active",
          sortable: false,
        },
        {
          title: "Receives corporate emails",
          align: "center",
          sortable: false,
        },
        {
          title: "Actions",
          align: "center",
          value: "name",
          sortable: false,
          width: "20",
        },
      ];
    },
    receiveEmailsCount() {
      return this.modelValue.filter((rep) => rep.active && rep.email_groups.corporate).length;
    },
    representativesCount() {
      return (this.modelValue || []).length;
    },
    canSeeMessage() {
      return Object.values(COMPANIES_TYPES).includes(this.companyTypeId);
    },
    filterUsers() {
      return !this.isAnyAdmin ? this.modelValue.filter((user) => user.active) : this.modelValue;
    },
  },
  methods: {
    openCreateDialog() {
      this.dialogRepresentative = { ...defaultRepresentativeData };
      this.representativeDialogOpened = true;
      this.$refs["company-representative-dialog"].$refs.form.resetValidation();
    },
    openEditDialog(existingRepresentativeData) {
      this.dialogRepresentative = { ...existingRepresentativeData };
      this.representativeDialogOpened = true;
      this.$refs["company-representative-dialog"].$refs.form.resetValidation();
    },
    closeDialog() {
      this.representativeDialogOpened = false;
      this.dialogRepresentative = { ...defaultRepresentativeData };
    },
    isRepresentativeActionEnabled(representative) {
      return (
        this.isSuperAdmin || (representative.role && "CORPORATE" === representative.role.base_role)
      );
    },
    activateRepresentative(uuid) {
      UsersApi.toggleRepresentative(uuid, { active: 1 }).then((response) => {
        this.updateRepresentativeData(uuid, response.data);
        this.success("Representative activated");
      });
    },
    deactivateRepresentative(uuid) {
      UsersApi.toggleRepresentative(uuid, { active: 0 }).then((response) => {
        this.updateRepresentativeData(uuid, response.data);
        this.success("Representative inactivated");
      });
    },
    removePermissions(uuid) {
      UsersApi.resetRepresentativeRoles(uuid, { active: 0 }).then((response) => {
        this.updateRepresentativeData(uuid, response.data);
        this.success("Permissions are removed");
      });
    },
    updateRepresentativeData(uuid, data) {
      this.$emit(
        "update:modelValue",
        this.modelValue.map((it) => {
          if (it.uuid === uuid) {
            return data;
          }
          return it;
        })
      );
    },
    submitRepresentative(representativeData) {
      const handleSubmit = representativeData.id
        ? this.updateRepresentative
        : this.addRepresentative;
      handleSubmit(representativeData);
    },
    addRepresentative(userData) {
      const data = { ...userData, company_id: this.companyId };
      UsersApi.addRepresentative(data)
        .then((response) => {
          this.$emit("update:modelValue", [...this.modelValue, response.data]);
          this.success("Company representative added");
          this.closeDialog();
          this.$refs["send-confirmation"].open(response.data);
        })
        .catch(() => {
          this.error("Error occurred, please try later");
        });
    },
    updateRepresentative(userData) {
      UsersApi.updateRepresentative(userData.uuid, userData)
        .then((response) => {
          this.updateRepresentativeData(userData.uuid, response.data);
          this.success("Company representative updated");
          this.closeDialog();
        })
        .catch(() => {
          this.error("Error occurred, please try later");
        });
    },
  },
};
</script>
