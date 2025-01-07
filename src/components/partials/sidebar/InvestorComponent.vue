<template>
  <s-menu v-if="isBootstrapped">
    <!--    <s-menu-item-->
    <!--      title="Dashboard"-->
    <!--      :to="{ name: 'dashboard' }"-->
    <!--      :active="$route.name === 'dashboard'"-->
    <!--      icon="grid_view"-->
    <!--    />-->

    <s-menu-item
      title="Events"
      :to="{ name: 'upcoming-events' }"
      icon="event"
      :active="isEventsActive"
    />

    <!--    <s-menu-item-->
    <!--      v-if="isCalendarNotifications"-->
    <!--      title="Calendar notifications"-->
    <!--      :to="{ name: 'notifications-view' }"-->
    <!--      :active="$route.name === 'notifications-view'"-->
    <!--      icon="markunread_mailbox"-->
    <!--    />-->

    <s-menu-group
      :active="isSettingsGroupOpened"
      group-key="settings"
      title="Settings"
      icon="settings"
    >
      <s-menu-item
        title="User profile"
        :to="{ name: 'edit-user-profile' }"
        :active="$route.name === 'edit-user-profile'"
      />
      <!--      <s-menu-item-->
      <!--        title="Menu customization"-->
      <!--        :to="{ name: 'menu-customization' }"-->
      <!--        :active="$route.name === 'menu-customization'"-->
      <!--      />-->
      <s-menu-item
        title="Calendar notifications"
        :to="{ name: 'notifications-settings' }"
        :active="$route.name === 'notifications-settings'"
      />
    </s-menu-group>
  </s-menu>
</template>

<script>
import SMenu from "@/components/partials/sidebar/components/SMenu";
import SMenuItem from "@/components/partials/sidebar/components/SMenuItem";
import SMenuGroup from "@/components/partials/sidebar/components/SMenuGroup";
import { mapGetters } from "vuex";
import { INVESTOR_TYPE } from "@/constants";

const eventRoutes = ["booked-events", "upcoming-events", "event-details", "event-notifications"];

export default {
  components: {
    SMenu,
    SMenuItem,
    SMenuGroup,
  },
  computed: {
    ...mapGetters(["isBootstrapped", "userData"]),
    isSettingsGroupOpened() {
      return ["edit-user-profile", "menu-customization", "notifications-settings"].includes(
        this.$route.name
      );
    },
    isPrivateInvestor() {
      return this.userData.investor_type === INVESTOR_TYPE.PRIVATE_INVESTOR;
    },
    isCalendarNotifications() {
      return this.userData.customization
        ? this.userData.customization.menu.calendar_notifications
        : false;
    },
    isEventsActive() {
      return eventRoutes.includes(this.$route.name);
    },
  },
};
</script>
