<template>
  <v-data-table
    hide-default-footer
    :headers="headers"
    :items="filterUsers"
    :class="{ 'border-1': !borderless }"
    :mobile-breakpoint="0"
    :items-per-page="-1"
  >
    <template #item="{ item }">
      <tr>
        <td class="text-left">{{ item.first_name }}</td>
        <td class="text-left">{{ item.last_name }}</td>
        <td v-if="companyNameColumn" class="text-left">
          {{ item.company ? item.company.name : "n/a" }}
        </td>
        <td class="text-left">
          {{ item.company_function || "-" }}
        </td>
        <td v-if="roleColumn" class="text-left">
          {{ roleName(item) }}
        </td>
        <td v-if="investorTypeColumn" class="text-left">
          {{ investorType(item) }}
        </td>
        <td v-if="profileButtonColumn || editButtonColumn" class="text-center">
          <s-button
            v-if="profileButtonColumn"
            type="tertiary-blue"
            :to="{ name: 'investor-profile', params: { uuid: item.uuid } }"
          >
            <v-icon class="mr-1 material-icons-outlined">person</v-icon>
            Profile
          </s-button>
          <s-button
            v-if="editButtonColumn"
            type="tertiary-blue"
            :to="{ name: 'edit-user', params: { uuid: item.uuid } }"
          >
            <v-icon class="mr-1 material-icons-outlined">edit</v-icon>
            Edit
          </s-button>
        </td>
      </tr>
    </template>

    <template #no-data>
      <div class="simple-user-list__no-data">No company users</div>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from "vuex";
import SButton from "@/s-components/Button/SButton.vue";
import { store } from "@/store/store";

export default {
  components: { SButton },
  props: {
    users: {
      type: Array,
      default: () => [],
    },
    editButtonColumn: {
      type: Boolean,
      default: false,
    },
    profileButtonColumn: {
      type: Boolean,
      default: false,
    },
    companyNameColumn: {
      type: Boolean,
      default: false,
    },
    roleColumn: {
      type: Boolean,
      default: false,
    },
    investorTypeColumn: {
      type: Boolean,
      default: false,
    },
    borderless: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["isAnyAdmin"]),
    headers() {
      const defaults = { sortable: false, align: "left" };
      return [
        { text: "First name", ...defaults },
        { text: "Last name", ...defaults },
        ...(this.companyNameColumn ? [{ text: "Company", ...defaults }] : []),
        { text: "Company function", ...defaults },
        ...(this.roleColumn ? [{ text: "System role", ...defaults }] : []),
        ...(this.investorTypeColumn ? [{ text: "Investor type", ...defaults }] : []),
        ...(this.profileButtonColumn ? [{ ...defaults, width: "280px", align: "center" }] : []),
      ];
    },
    filterUsers() {
      return !this.isAnyAdmin ? this.users.filter((user) => user.active) : this.users;
    },
  },
  methods: {
    roleName(user) {
      if (!(user.role && user.role.base_role)) {
        return "n/a";
      }
      return `[${user.role.base_role}] ${user.role.name}`;
    },
    investorType(user, noValueText = "n/a") {
      if (!user.investor_type) {
        return noValueText;
      }
      const entry = store.state.settings.investorTypes.find(({ id }) => id == user.investor_type);
      if (!entry) {
        return noValueText;
      }
      return entry.name;
    },
  },
};
</script>

<style scoped>
.simple-user-list__no-data {
  color: #75808e !important;
  font-size: 12px !important;
  line-height: 14px !important;
  font-weight: 400 !important;
  text-align: center !important;
}
</style>
