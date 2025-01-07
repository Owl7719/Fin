<template>
  <div v-if="selectedBaseRolePermissions.length > 0">
    <h2 class="mb-4 mt-5">Role permissions</h2>

    <div class="permission-groups">
      <error-message ref="permissions_error" class="mb-3"></error-message>
      <div class="permission-group__permissions">
        <div v-for="(selectedBaseRolePermission, key) in selectedBaseRolePermissions" :key="key">
          <v-checkbox-btn
            v-for="p in selectedBaseRolePermission"
            :key="p.key"
            v-model="permissions"
            class="mt-0"
            :value="p.key"
            :label="p.value"
            multiple
            hide-details
            color="secondary"
          ></v-checkbox-btn>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from "@/components/form/ErrorMessage";

export default {
  components: { ErrorMessage },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    baseRole: {
      type: String,
      required: true,
    },
  },
  emits: ["update:model-value"],
  data: function () {
    return {
      baseRolesPermissions: [],
      baseRolesPermissionsGroupCorporate: [
        ["dashboard"],
        ["view_six_events", "manage_six_events"],
        ["view_single_company_events", "manage_single_company_events"],
        ["irm", "view_investors", "view_and_manage_linked_investors"],
        ["edit_company_info", "view_and_manage_company_representatives", "can_change_emails"],
        ["manage_investor_requests"],
        ["manage_widgets"],
        [
          "news",
          "news_distribution_channel_six",
          "news_distribution_channel_mailing",
          "news_distribution_channel_awp",
          "news_distribution_channel_homepage",
          "news_distribution_channel_north_american",
        ],
        ["manage_mailing_campaigns", "manage_mailing_signup_forms", "manage_mailing_segments"],
        [
          "view_changelog_users",
          "view_changelog_companies",
          "view_changelog_events",
          "view_changelog_news",
          "view_changelog_campaigns",
        ],
        [
          "manage_six_bridge_data",
          "tags",
          "manage_own_api_key",
          "manage_own_homepage_webhook",
          "manage_related_ownership_data",
        ],
      ],
      baseRolesPermissionsGroupAdmin: [
        [
          "dashboard",
          "see_dashboard_widget_last_logins",
          "see_dashboard_widget_recent_registrations",
          "see_dashboard_widget_six_performance_indicators",
        ],
        ["manage_owned_conferences"],
        ["manage_owned_single_company_events", "manage_six_events", "manage_all_events"],
        ["irm", "irm_full"],
        ["manage_owned_investor_requests", "manage_all_investor_requests"],
        ["see_hidden_investors", "manage_hidden_investors"],
        ["can_delete_users", "can_merge_investors", "can_merge_companies"],
        [
          "can_assign_sensitive_roles",
          "can_change_email_and_company_of_corporate",
          "can_change_email_and_company_of_sensitive_corporate",
          "can_change_email_and_company_of_regular_admin",
        ],
        ["can_manage_companies"],
        ["manage_widgets"],
        [
          "news",
          "news_distribution_channel_six",
          "news_distribution_channel_mailing",
          "news_distribution_channel_awp",
          "news_distribution_channel_homepage",
          "news_distribution_channel_north_american",
        ],
        [
          "manage_owned_mailing_campaigns",
          "manage_all_mailing_campaigns",
          "manage_mailing_suppression",
          "manage_mailing_signup_forms",
          "manage_mailing_segments",
        ],
        [
          "view_changelog_users",
          "view_changelog_companies",
          "view_changelog_events",
          "view_changelog_news",
          "view_changelog_campaigns",
        ],
        ["manage_six_notifications", "view_six_notifications"],
        ["manage_six_settings", "manage_research_reports"],
        ["manage_own_api_key", "manage_own_homepage_webhook"],
        ["manage_investment_products", "manage_all_ownership_data"],
      ],
    };
  },
  computed: {
    selectedBaseRolePermissions() {
      if (this.baseRole in this.$store.state.settings.baseRolesPermissions) {
        const permissionsMap = this.$store.state.settings.baseRolesPermissions[this.baseRole];

        const baseRolesPermissionsGroups = this.getPermissionsGroupsByRole(this.baseRole);
        baseRolesPermissionsGroups.push(
          this.permissionsWithoutGroups(baseRolesPermissionsGroups, permissionsMap)
        );
        return baseRolesPermissionsGroups.map((groupArr) => {
          return this.groupPermissionsMap(groupArr, permissionsMap);
        });
      }
      return [];
    },
    permissions: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:model-value", value);
      },
    },
  },
  methods: {
    groupPermissionsMap(groupArr, permissionsMap) {
      return groupArr.map((key) => ({ key, value: permissionsMap[key] }));
    },
    getPermissionsGroupsByRole(role) {
      if (role == "CORPORATE") {
        return this.baseRolesPermissionsGroupCorporate;
      } else if (role == "ADMIN") {
        return this.baseRolesPermissionsGroupAdmin;
      } else {
        return [];
      }
    },
    permissionsWithoutGroups(baseRolesPermissionsGroups, permissionsMap) {
      const definedPermissions = baseRolesPermissionsGroups.flatMap((it) => it);
      return Object.keys(permissionsMap).filter((key) => !definedPermissions.includes(key));
    },
  },
};
</script>
