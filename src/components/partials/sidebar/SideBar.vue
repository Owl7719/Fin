<template>
  <div class="custom-list pa-2">
    <v-row class="justify-center align-center py-3 pr-2">
      <v-col cols="8">
        <router-link :to="{ name: homeRouteName }">
          <img
            align="center"
            src="@/assets/logo-with-text.svg"
            alt="crm"
            class="crm-sidebar-logo ml-2"
          />
        </router-link>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn size="small" variant="text" icon="menu_open" @click="$emit('close-menu')"> </v-btn>
      </v-col>
    </v-row>

    <component :is="$store.state.user.component"></component>

    <v-list-subheader class="hidden-md-and-up pa-4 text-white"> User </v-list-subheader>

    <s-menu class="hidden-md-and-up">
      <s-menu-group :title="userName" icon="person" :active="isUserMenuOpened">
        <s-menu-item
          title="Profile"
          :to="{ name: 'edit-user-profile' }"
          :active="$route.name === 'edit-user-profile'"
        />
        <s-menu-item
          title="Change password"
          :to="{ name: 'change-password' }"
          :active="$route.name === 'change-password'"
        />
        <s-menu-item
          title="Two factor authentication"
          :to="{ name: 'two-factor-authentication-settings' }"
          :active="$route.name === 'two-factor-authentication-settings'"
        />
        <s-menu-item title="Help" :to="{ name: 'Help' }" :active="$route.name === 'Help'" />
        <s-menu-item title="Log out" :on-click="() => logout()" />
      </s-menu-group>
    </s-menu>
  </div>
</template>

<script>
import Investor from "./InvestorComponent.vue";
import Company from "./CompanyComponent.vue";
import Admin from "./AdminComponent.vue";
import { mapGetters } from "vuex";
import SMenu from "@/components/partials/sidebar/components/SMenu";
import SMenuGroup from "@/components/partials/sidebar/components/SMenuGroup";
import SMenuItem from "@/components/partials/sidebar/components/SMenuItem";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, SMenuItem, SMenuGroup, SMenu, Investor, Company, Admin },
  computed: {
    ...mapGetters(["homeRouteName"]),
    isUserMenuOpened() {
      return [
        "edit-user-profile",
        "change-password",
        "two-factor-authentication-settings",
        "Help",
      ].includes(this.$route.name);
    },
    userName() {
      return this.$store.state.user.data.full_name;
    },
    companyName() {
      const user = this.$store.state.user.data;
      return user.company && user.company.name ? user.company.name : "";
    },
  },
};
</script>

<style>
.crm-sidebar-logo {
  height: 30px;
}
.custom-list .v-list-group__header--active .v-list-group__header__append-icon .v-icon {
  transform: rotate(-90deg) !important;
}

.custom-list .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
  padding-inline: 0 !important;
}

.custom-list .v-list-item__content {
  display: flex;
  align-items: center;
}

.custom-list .v-list-group__items .v-list-item__content {
  padding-left: 22px;
}
.custom-list .v-list-item-action {
  justify-content: center;
  color: #a7b1c2;
  min-width: 44px;
}
.custom-list .v-list-item-title {
  font-size: 13px !important;
  color: #a7b1c2;
}
.custom-list .v-list-group__header__append-icon i {
  font-size: 20px;
  color: #a7b1c2;
}
.custom-list .v-list-group--open .v-list-group__header .v-list-item-title {
  color: #fff;
}
.custom-list .v-list-group--open .v-list-item-action {
  color: #fff;
}
.custom-list .s-menu-group--active .s-menu-group__activator .v-list-item-title {
  color: #fff;
}
.custom-list .v-list-item.text-white .v-list-item-title {
  color: #fff !important;
}
.custom-list .v-list-item--active .v-list-item-title {
  color: #fff;
  font-weight: bold;
}
.custom-list .v-list-item--active .v-list-item-action {
  color: #fff;
}
.custom-list .v-list-group__header__append-icon i {
  color: #fff;
}

.custom-list .v-list-item-action {
  margin-right: 0px !important;
}

.sch-sidebar-group .v-list-item {
  min-height: 0;
  overflow: initial !important;
}

.sch-sidebar-group .v-list-item:before {
  opacity: 0 !important;
}

.sch-sidebar-group .v-list-item__content::after {
  position: absolute;
  top: 22px;
  content: "";
  height: 16px;
  width: 2px;
  border-left: 2px solid rgba(255, 255, 255, 0.25);
}
.sch-sidebar-group .sch-sidebar-item:last-child .v-list-item__content::after {
  border-left: none;
}
.sch-sidebar-group .v-list-item__content::before {
  position: absolute;
  content: "";
  height: 14px;
  width: 2px;
  border-left: 2px solid rgba(255, 255, 255, 0.25);
}
.sch-sidebar-group .v-list-item--active.v-list-item .v-list-item__content::before {
  position: absolute;
  content: "";
  height: 14px;
  width: 2px;
  border-left: 2px solid #e5e7e9;
}

.sch-sidebar-group .v-list-item {
  height: 30px !important;
}
.sch-sidebar-group .v-list-item-title {
  padding-left: 20px;
}

.sch-sidebar-group .v-list-item--density-default.v-list-item--one-line {
  min-height: 30px;
}

.theme--dark.v-list .v-list-group--active:after,
.theme--dark.v-list .v-list-group--active:before {
  background: none !important;
}

.theme--dark.v-list-item__link:before {
  opacity: 0 !important;
}

.theme--dark.v-list-item--active:before,
.theme--dark.v-list-item--active:hover:before,
.theme--dark.v-list-item:focus:before {
  opacity: 0 !important;
}
</style>
