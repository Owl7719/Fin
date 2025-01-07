<template>
  <s-menu v-if="isBootstrapped">
    <s-menu-item
      v-if="canSeeDashboard"
      title="Dashboard"
      :to="{ name: 'dashboard' }"
      :active="$route.name === 'dashboard'"
      icon="grid_view"
    />
    <s-menu-item
      if-can="view_and_manage_linked_investors|view_investors"
      title="Investors"
      :to="{ name: 'investors-list' }"
      :active="isInvestorsActive"
      icon="assignment_ind"
    />
    <s-menu-item
      if-can="view_and_manage_linked_investors|view_investors"
      title="Companies"
      :to="{ name: 'companies-list' }"
      :active="isCompaniesActive"
      icon="domain"
    />
    <s-menu-item
      if-can="view_single_company_events|view_six_events"
      title="My events"
      :to="{ name: 'events' }"
      :active="isEventsActive"
      icon="event"
    />
    <s-menu-item
      if-can="manage_investor_requests"
      title="Investor requests"
      :to="{ name: 'investor-requests' }"
      :active="$route.path.match('investor-requests') !== null"
      icon="share"
    />
    <s-menu-group
      :active="isNewsAndMailingGroupOpened"
      title="News & mailing"
      icon="mail"
      if-can="manage_mailing_campaigns|news"
      group-key="news_mailing"
    >
      <s-menu-item
        if-can="news"
        title="News"
        :to="{ name: 'news-list' }"
        :active="$route.path.match('news') !== null"
      />
      <s-menu-item
        if-can="manage_mailing_campaigns"
        title="Campaigns"
        :to="{ name: 'mailing-campaigns-list' }"
        :active="$route.path.match('campaigns') !== null"
      />
      <s-menu-item
        if-can="manage_mailing_campaigns|news_distribution_channel_mailing"
        title="Contacts & lists"
        :to="{ name: 'mailing-contacts' }"
        :active="isContactsAndListsActive"
      />
      <s-menu-item
        if-can="manage_mailing_segments"
        title="Segments"
        :to="{ name: 'mailing-segments' }"
        :active="$route.path.match('mailing-segments') !== null"
      />
      <s-menu-item
        if-can="manage_mailing_signup_forms"
        title="Signup forms"
        :to="{ name: 'mailing-signup-forms' }"
        :active="$route.path.match('signup-forms') !== null"
      />
    </s-menu-group>
    <s-menu-item
      if-can="manage_related_ownership_data"
      title="Ownership data"
      :to="{ name: 'ownership-data' }"
      :active="$route.name === 'ownership-data'"
      icon="pie_chart"
    />
    <s-menu-item
      if-can="irm"
      title="IRM"
      :to="{ name: 'logs-list' }"
      :active="isIrmActive"
      icon="comment"
    />
    <s-menu-item
      title="Service center"
      :to="{ name: 'service-center-list' }"
      :active="isServiceCenterActive"
      icon="feedback"
    />
    <s-menu-item
      v-if="isCalendarNotifications"
      title="SIX Calendar"
      :to="{ name: 'upcoming-view' }"
      :active="$route.name === 'notifications-view' || $route.name === 'upcoming-view'"
      icon="markunread_mailbox"
    />
    <s-menu-group
      :active="isSettingsGroupOpened"
      title="Settings"
      icon="settings"
      group-key="settings"
    >
      <s-menu-item
        title="User profile"
        :to="{ name: 'edit-user-profile' }"
        :active="$route.name === 'edit-user-profile'"
      />
      <s-menu-item
        if-can="edit_company_info"
        title="Company profile"
        :to="{ name: 'edit-company' }"
        :active="isEditingOwnCompany"
      />
      <s-menu-item
        title="Customization"
        :to="{ name: 'menu-customization' }"
        :active="$route.name === 'menu-customization' || $route.name === 'dashboard-customization'"
      />
      <s-menu-item
        if-can="tags"
        title="Tags"
        :to="{ name: 'tags' }"
        :active="
          $route.name === 'tags' ||
          $route.name === 'manage-investor-tags' ||
          $route.name === 'manage-news-tags'
        "
      />
      <s-menu-item
        v-if="isCalendarNotifications"
        title="Calendar notifications"
        :to="{ name: 'notifications-settings' }"
        :active="$route.name === 'notifications-settings'"
      />
      <s-menu-item
        v-if="widgetsEnabled"
        if-can="manage_widgets"
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

const investorsRoutes = ["investors-list", "add-investor", "investor-profile", "edit-user"];

const newsContactsAndListsRoutes = [
  "mailing-contacts",
  "mailing-contacts-add",
  "mailing-contacts-edit",
  "mailing-contacts-log",
  "mailing-contact-lists",
  "mailing-contact-lists-add",
  "mailing-contact-lists-edit",
];

const irmRoutes = ["logs-list", "irm-analytics"];

const serviceCenterRoutes = ["service-center-list"];

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
      "widgetsEnabled",
      "userData",
    ]),
    canSeeDashboard() {
      return (
        this.isAuthorized("dashboard") &&
        this.isAuthorizedAny([
          "view_single_company_events",
          "view_six_events",
          "view_and_manage_linked_investors",
          "manage_investor_requests",
          "irm",
        ])
      );
    },
    isEditingOwnCompany() {
      return [
        "own-company-edit-general",
        "own-company-edit-six-bridge",
        "own-company-edit-events",
        "own-company-edit-mailing",
        "own-company-edit-api-keys",
      ].includes(this.$route.name);
    },
    isInvestorsActive() {
      return investorsRoutes.includes(this.$route.name);
    },
    isCompaniesActive() {
      return this.$route.path.match("/companies") !== null && !this.isEditingOwnCompany;
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
    isWidgetsActive() {
      return widgetRoutes.includes(this.$route.name);
    },
    isEventsActive() {
      return (
        ["events", "event-details", "event-changelog", "event-notifications"].includes(
          this.$route.name
        ) || this.$route.path.match("/single-company-events") !== null
      );
    },
    isNewsAndMailingGroupOpened() {
      const path = this.$route.path;
      return (
        path.indexOf("/mailing") === 0 ||
        path.indexOf("/news") === 0 ||
        this.$route.name === "news-changelog" ||
        this.$route.name === "campaign-changelog"
      );
    },
    isSettingsGroupOpened() {
      return (
        [
          "edit-user-profile",
          "edit-company",
          "menu-customization",
          "dashboard-customization",
          "tags",
          "notifications-settings",
          "manage-investor-tags",
          "manage-news-tags",
          ...widgetRoutes,
        ].includes(this.$route.name) || this.isEditingOwnCompany
      );
    },
    isCalendarNotifications() {
      return this.userData.customization
        ? this.userData.customization.menu.calendar_notifications
        : false;
    },
  },
  methods: {
    to(route) {
      this.$router.push(route);
    },
  },
};
</script>
