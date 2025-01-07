<template>
  <s-menu v-if="isBootstrapped">
    <s-menu-item
      if-can="dashboard"
      title="Dashboard"
      :to="{ name: 'dashboard' }"
      :active="$route.name === 'dashboard'"
      icon="grid_view"
    />

    <s-menu-item
      title="User management"
      :to="{ name: 'users-list' }"
      :active="isUserManagementActive"
      icon="assignment_ind"
    />

    <s-menu-item
      if-can="manage_owned_single_company_events|manage_six_events"
      title="Single company events"
      :to="{ name: 'single-company-events-list' }"
      :active="isEventsActive"
      icon="event"
    />

    <s-menu-item
      title="Companies"
      :to="{ name: 'companies-list' }"
      :active="isCompaniesActive"
      icon="domain"
    />

    <s-menu-item
      if-can="manage_owned_investor_requests|manage_all_investor_requests|isSuperAdmin"
      title="Investor requests"
      :active="$route.path.match('investor-requests') !== null"
      :to="{ name: 'investor-requests' }"
      icon="share"
    />

    <s-menu-group
      if-can="manage_owned_mailing_campaigns|manage_all_mailing_campaigns|news|isSuperAdmin"
      :active="isNewsAndMailingGroupOpened"
      title="News & mailing"
      group-key="news_mailing"
      icon="mail"
    >
      <s-menu-item
        if-can="news|isSuperAdmin"
        title="News"
        :to="{ name: 'news-list' }"
        :active="$route.path.match('news') !== null"
      />
      <s-menu-item
        if-can="manage_owned_mailing_campaigns|manage_all_mailing_campaigns|isSuperAdmin"
        title="Campaigns"
        :to="{ name: 'mailing-campaigns-list' }"
        :active="$route.path.match('campaigns') !== null"
      />
      <s-menu-item
        if-can="manage_owned_mailing_campaigns|manage_all_mailing_campaigns|news_distribution_channel_mailing|isSuperAdmin"
        title="Contacts & lists"
        :to="{ name: 'mailing-contacts' }"
        :active="isContactsAndListsActive"
      />

      <s-menu-item
        if-can="manage_mailing_segments|isSuperAdmin"
        title="Segments"
        :to="{ name: 'mailing-segments' }"
        :active="$route.path.match('mailing-segments') !== null"
      />

      <s-menu-item
        if-can="manage_mailing_signup_forms|isSuperAdmin"
        title="Signup forms"
        :to="{ name: 'mailing-signup-forms' }"
        :active="$route.path.match('signup-forms') !== null"
      />

      <s-menu-item
        if-can="manage_mailing_suppression|isSuperAdmin"
        title="Suppressions"
        :to="{ name: 'mailing-suppressions' }"
        :active="isSuppressionsActive"
      />
    </s-menu-group>

    <s-menu-item
      if-can="manage_all_ownership_data|isSuperAdmin"
      title="Ownership data"
      :to="{ name: 'ownership-data' }"
      :active="$route.name === 'ownership-data'"
      icon="pie_chart"
    />

    <s-menu-item
      if-can="irm|irm_full|isSuperAdmin"
      title="IRM"
      :to="{ name: 'logs-list' }"
      :active="isIrmActive"
      icon="comment"
    />

    <s-menu-item
      if-can="isAnyAdmin"
      title="Service center"
      :to="{ name: 'service-center-list' }"
      :active="isServiceCenterActive"
      icon="feedback"
    />

    <s-menu-item
      v-if="isCalendarNotifications"
      if-can="view_six_notifications|isSuperAdmin"
      title="SIX Calendar"
      :to="{ name: 'notifications-view' }"
      :active="$route.name === 'notifications-view'"
      icon="markunread_mailbox"
    />

    <s-menu-item
      if-can="manage_six_notifications|isSuperAdmin"
      title="Notifications admin"
      :to="{ name: 'notification-engagement' }"
      :active="isNotificationsAdminActive"
      icon="calendar_month"
    />

    <s-menu-item
      if-can="manage_research_reports|isSuperAdmin"
      title="Research reports"
      :to="{ name: 'research-reports-engagement' }"
      :active="isResearchReportsActive"
      icon="donut_large"
    />

    <s-menu-group
      :active="isSettingsGroupOpened"
      group-key="settings"
      title="Settings"
      icon="settings"
    >
      <s-menu-item
        if-can="isSuperAdmin"
        title="General settings"
        :to="{ name: 'general-settings' }"
        :active="$route.name === 'general-settings'"
      />
      <s-menu-item
        if-can="isSuperAdmin"
        title="Feedback settings"
        :to="{ name: 'feedback-settings' }"
        :active="$route.name === 'feedback-settings'"
      />
      <s-menu-item
        if-can="isSuperAdmin"
        title="Roles"
        :active="$route.path.indexOf('/settings/roles') === 0"
        :to="{ name: 'roles-list' }"
      />
      <s-menu-item
        if-can="can_merge_investors|isSuperAdmin"
        title="Investors merge"
        :to="{ name: 'investors-merge' }"
        :active="$route.name === 'investors-merge'"
      />
      <s-menu-item
        if-can="can_merge_companies|isSuperAdmin"
        title="Companies merge"
        :to="{ name: 'companies-merge' }"
        :active="$route.name === 'companies-merge'"
      />
      <s-menu-item
        if-can="edit_company_info"
        title="Company profile"
        :to="{ name: 'edit-company' }"
        :active="isEditingOwnCompany"
      />
      <s-menu-item
        title="Menu customization"
        :to="{ name: 'menu-customization' }"
        :active="$route.name === 'menu-customization'"
      />
      <s-menu-item
        if-can="tags"
        title="Tags"
        :to="{ name: 'tags' }"
        :active="$route.path.indexOf('/settings/tags') === 0"
      />
      <s-menu-item
        v-if="isCalendarNotifications"
        if-can="view_six_notifications|isSuperAdmin"
        title="Calendar notifications"
        :to="{ name: 'notifications-settings' }"
        :active="$route.name === 'notifications-settings'"
      />
      <s-menu-item
        if-can="manage_six_settings|isSuperAdmin"
        title="SIX settings"
        :to="{ name: 'manage-six-settings' }"
        :active="$route.name === 'manage-six-settings'"
      />
      <s-menu-item
        if-can="manage_widgets|isSuperAdmin"
        title="Widgets"
        :to="{ name: 'widgets' }"
        :active="isWidgetsActive"
      />
    </s-menu-group>
  </s-menu>
</template>

<script>
import SMenu from "@/components/partials/sidebar/components/SMenu";
import SMenuGroup from "@/components/partials/sidebar/components/SMenuGroup";
import SMenuItem from "@/components/partials/sidebar/components/SMenuItem";

import { mapGetters } from "vuex";

const userManagementRoutes = [
  "users-list",
  "edit-user",
  "users-add",
  "investor-profile",
  "user-changelog",
];

const newsContactsAndListsRoutes = [
  "mailing-contacts",
  "mailing-contacts-add",
  "mailing-contacts-edit",
  "mailing-contacts-log",
  "mailing-contact-lists",
  "mailing-contact-lists-add",
  "mailing-contact-lists-edit",
  "mailing-contacts-import",
];

const suppressionsRoutes = ["mailing-bounces", "mailing-soft-bounces", "mailing-unsubscribes"];

const irmRoutes = ["logs-list", "irm-analytics"];

const serviceCenterRoutes = ["service-center-list"];

const notificationsAdminRoutes = [
  "notification-engagement",
  "notification-settings",
  "notification-emails",
  "notification-logs",
];

const researchReportsRoutes = [
  "research-reports-engagement",
  "research-reports-settings",
  "research-reports-list",
];

const widgetRoutes = ["widgets", "widgets-add", "widgets-edit"];

export default {
  components: {
    SMenu,
    SMenuItem,
    SMenuGroup,
  },
  computed: {
    ...mapGetters([
      "isBootstrapped",
      "isAuthorized",
      "isAuthorizedAny",
      "isSuperAdmin",
      "userData",
    ]),
    activeClass() {
      return "secondary lighten-1 text-white";
    },
    isEditingOwnCompany() {
      return (
        [
          "own-company-edit-general",
          "own-company-edit-six-bridge",
          "own-company-edit-events",
          "own-company-edit-mailing",
          "own-company-edit-api-keys",
        ].includes(this.$route.name) ||
        (this.$route.params.id === this.userData.company_id &&
          this.$route.name === "company-changelog")
      );
    },
    isEventsActive() {
      return (
        ["events", "event-details", "event-changelog"].includes(this.$route.name) ||
        this.$route.path.match("/single-company-events") !== null
      );
    },
    isUserManagementActive() {
      return userManagementRoutes.includes(this.$route.name);
    },
    isContactsAndListsActive() {
      return newsContactsAndListsRoutes.includes(this.$route.name);
    },
    isIrmActive() {
      return irmRoutes.includes(this.$route.name);
    },
    isServiceCenterActive() {
      return serviceCenterRoutes.includes(this.$route.name);
    },
    isNotificationsAdminActive() {
      return notificationsAdminRoutes.includes(this.$route.name);
    },
    isResearchReportsActive() {
      return researchReportsRoutes.includes(this.$route.name);
    },
    isWidgetsActive() {
      return widgetRoutes.includes(this.$route.name);
    },
    isConferencesGroupOpened() {
      return this.$route.path.indexOf("/conferences") === 0;
    },
    isListConferencesActive() {
      return (
        this.$route.path.match("/conferences/event") !== null &&
        this.$route.name !== "conferences-create"
      );
    },
    isCompaniesActive() {
      return (
        (this.$route.path.indexOf("/companies/") === 0 ||
          this.$route.name === "company-changelog") &&
        this.$route.params.id !== this.userData.company_id
      );
    },
    isNewsAndMailingGroupOpened() {
      return (
        this.$route.path.indexOf("/mailing") === 0 ||
        this.$route.path.indexOf("/news") === 0 ||
        this.$route.name === "news-changelog" ||
        this.$route.name === "campaign-changelog"
      );
    },
    isSettingsGroupOpened() {
      return (
        [
          "general-settings",
          "feedback-settings",
          "roles-list",
          "investors-merge",
          "companies-merge",
          "edit-company",
          "menu-customization",
          "tags",
          "consolidated-tags-data",
          "notifications-settings",
          "manage-six-settings",
          "manage-investor-tags",
          "manage-news-tags",
          ...widgetRoutes,
        ].includes(this.$route.name) ||
        this.$route.path.indexOf("/settings/roles") === 0 ||
        this.isEditingOwnCompany
      );
    },
    isSuppressionsActive() {
      return suppressionsRoutes.includes(this.$route.name);
    },
    isCalendarNotifications() {
      return this.userData.customization
        ? this.userData.customization.menu.calendar_notifications
        : false;
    },
  },
};
</script>
