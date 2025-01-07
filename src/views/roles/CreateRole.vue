<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="8">
        <v-widget class="mb-3 pb-1 bg-white" title="Create new role" variant="outlined">
          <template #widget-content>
            <role-form
              :on-save="saved"
              :on-back="() => $router.push({ name: 'roles-list' })"
              :loading="loading"
            ></role-form>
          </template>
        </v-widget>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RoleForm from "./RoleForm";
import handle422 from "@/mixins/handle422";
import RoleApi from "@/api/roles";

export default {
  components: {
    RoleForm,
  },
  mixins: [handle422],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    saved(data) {
      this.loading = true;
      return RoleApi.create(data)
        .then(() => {
          this.$store.dispatch("getSettings");
          this.$store.commit("snack", { text: "Role was created", type: "success" });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped></style>
