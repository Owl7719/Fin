<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="8">
        <v-widget class="mb-3 pb-1 bg-white" title="Edit role" variant="outlined">
          <template #widget-content>
            <role-form
              :initial-data="roleData"
              :on-save="update"
              :on-back="() => $router.push({ name: 'roles-list' })"
              :loading="loading"
            ></role-form>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <s-confirm v-model="confirmDeleteDialog" @confirm="deleteRole">
      <span>Entry can not be recovered after deleting!</span>
    </s-confirm>
  </v-container>
</template>

<script>
import RoleForm from "./RoleForm";
import handle422 from "@/mixins/handle422";
import { bus } from "@/plugins/bus";
import SConfirm from "@/s-components/Dialog/SConfirm.vue";
import RoleApi from "@/api/roles";

export default {
  components: {
    RoleForm,
    SConfirm,
  },
  mixins: [handle422],
  data() {
    return {
      loading: false,
      roleData: {
        permissions: [],
      },
      confirmDeleteDialog: false,
    };
  },
  async created() {
    return this.getRoleData().then((roleData) => {
      this.roleData = roleData;
      if (this.canBeDeleted(roleData)) {
        this.showDeleteButton();
      }
    });
  },
  methods: {
    roleId() {
      return this.$route.params.id;
    },
    async getRoleData() {
      return RoleApi.get(this.roleId()).then((response) => response.data);
    },
    async update(data) {
      this.loading = true;
      return RoleApi.update(this.roleId(), data)
        .then(() => {
          this.$store.dispatch("getSettings");
          this.$store.commit("snack", {
            text: "Role was updated",
            type: "success",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showDeleteButton() {
      bus.emit("setPageTopButtons", [
        {
          icon: "delete",
          slot: "Delete",
          callback: {
            action: () => {
              this.confirmDeleteDialog = true;
            },
          },
        },
      ]);
    },
    canBeDeleted(role) {
      return role.users_count == 0 && !role.default;
    },
    deleteRole() {
      RoleApi.delete(this.roleId()).then((response) => {
        this.$store.dispatch("getSettings");
        this.$store.commit("snack", {
          type: "success",
          text: response.message,
        });
        this.$router.push({ name: "roles-list" });
      });
    },
  },
};
</script>
