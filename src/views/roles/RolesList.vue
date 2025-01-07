<template>
  <v-container fluid>
    <v-row dense class="mb-2">
      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="filters.base_role"
          bg-color="white"
          label="Base Role"
          :items="baseRoles"
          hide-details
          class="mr-1"
          clearable
          persistent-clear
          variant="outlined"
          color="primary"
          density="comfortable"
          base-color="#D1D5DA"
          @update:model-value="resetPermissions"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="8" md="5">
        <v-select
          v-model="filters.permissions"
          variant="outlined"
          bg-color="white"
          label="Permissions"
          :items="availablePermissions()"
          multiple
          hide-details
          item-title="text"
          item-value="value"
          color="primary"
          density="comfortable"
          base-color="#D1D5DA"
          clearable
          persistent-clear
        ></v-select>
      </v-col>
    </v-row>

    <v-data-table
      :mobile-breakpoint="0"
      :items="roles"
      :headers="headers"
      class="border rounded"
      hide-default-footer
      :items-per-page="-1"
    >
      <template #item="{ item }">
        <tr>
          <td class="text-left">
            {{ item.base_role }}
          </td>
          <td class="text-left">
            {{ item.name }}
          </td>
          <td class="text-left">
            {{ item.users_count }}
          </td>
          <td class="text-left">
            {{ item.permissions.length }}
          </td>
          <td class="text-left">
            <v-chip v-if="item.default" size="small" label color="teal" dark>Default </v-chip>
            <v-chip v-else size="small" label>No</v-chip>
          </td>
          <td class="text-left">
            <v-chip v-if="item.sensitive" size="small" label color="red darken-1" dark
              >Sensitive
            </v-chip>
            <v-chip
              v-if="!item.sensitive && item.base_role === BASE_ROLE.CORPORATE"
              size="small"
              label
              >No
            </v-chip>
            <span
              v-if="!item.sensitive && item.base_role !== BASE_ROLE.CORPORATE"
              class="text-grey-darken-2"
              >Not applicable</span
            >
          </td>
          <td class="text-center d-flex align-center">
            <s-button
              type="tertiary-blue"
              class="mr-4"
              :to="{
                name: 'edit-role',
                params: { id: item.id },
              }"
            >
              <v-icon class="material-icons-outlined mr-1">edit</v-icon>
              Edit
            </s-button>
            <s-button type="error" :disabled="!canBeDeleted(item)" @click="confirmDeleting(item)">
              <v-icon class="material-icons-outlined mr-1">delete_outline</v-icon>
              Delete
            </s-button>
          </td>
        </tr>
      </template>
    </v-data-table>

    <s-confirm v-model="confirmDeleteDialog" @confirm="deleteRole">
      <span>Entry can not be recovered after deleting! </span>
    </s-confirm>
  </v-container>
</template>

<script>
import { bus } from "@/plugins/bus";
import isEmpty from "lodash-es/isEmpty";
import { BASE_ROLE } from "@/constants";
import SConfirm from "@/s-components/Dialog/SConfirm.vue";
import RoleApi from "@/api/roles";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: {
    SButton,
    SConfirm,
  },
  data() {
    return {
      BASE_ROLE,
      roles: [],
      headers: [
        { title: "Base role", sortable: false },
        { title: "Name", sortable: true, value: "name" },
        { title: "Users count", sortable: false },
        { title: "Permissions count", sortable: false },
        { title: "Default", sortable: false },
        { title: "Sensitive", sortable: false },
        { sortable: false, align: "center", width: "10%" },
      ],
      filters: {
        base_role: null,
        permissions: [],
      },
      itemToDelete: null,
      confirmDeleteDialog: false,
    };
  },
  computed: {
    baseRoles() {
      return Object.keys(this.$store.state.settings.baseRolesPermissions);
    },
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.getRoles();
      },
    },
  },
  mounted() {
    this.getRoles();
    this.addBreadcrumbButton();
  },
  methods: {
    resetPermissions(newValue) {
      if (newValue) {
        const availablePermissions = this.$store.state.settings.baseRolesPermissions[newValue];

        this.filters.permissions = this.filters.permissions.filter(
          (it) => !!availablePermissions[it]
        );
      }
    },
    availablePermissions() {
      const toDict = (obj) => {
        const keys = Object.keys(obj);
        return keys.map((key) => ({ value: key, text: obj[key] }));
      };

      const entries = Object.entries(this.$store.state.settings.baseRolesPermissions).map((it) => [
        it[0],
        isEmpty(it[1]) ? {} : it[1],
      ]);

      let permissions = {};
      for (const [k, v] of entries) {
        if (!this.filters.base_role || this.filters.base_role === k) {
          permissions = { ...permissions, ...v };
        }
      }

      return toDict(permissions);
    },
    addBreadcrumbButton() {
      bus.emit("setPageTopButtons", [
        {
          icon: "add",
          slot: "Create role",
          callback: {
            action: () => this.$router.push({ name: "create-role" }),
          },
        },
      ]);
    },
    getRoles() {
      RoleApi.list(this.filters).then((response) => {
        this.roles = response.data;
      });
    },
    canBeDeleted(role) {
      return role.users_count == 0 && !role.default;
    },
    confirmDeleting(role) {
      this.itemToDelete = role;
      this.confirmDeleteDialog = true;
    },
    deleteRole() {
      if (!this.itemToDelete) {
        return;
      }

      const showSuccessMessage = (text) => this.$store.commit("snack", { type: "success", text });
      const deleteEntryFromTable = (roles, deletedId) => {
        for (let i = 0; i < roles.length; i++) {
          if (parseInt(roles[i].id) == parseInt(deletedId)) {
            roles.splice(i, 1);
            return;
          }
        }
      };

      RoleApi.delete(this.itemToDelete.id).then((response) => {
        this.$store.dispatch("getSettings");
        showSuccessMessage(response.message);
        deleteEntryFromTable(this.roles, this.itemToDelete.id);
        this.itemToDelete = null;
      });
    },
  },
};
</script>

<style scoped>
:deep(.v-select__selections) {
  min-width: 0 !important;
}
</style>
