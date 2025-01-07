<template>
  <div v-if="isBootstrapped">
    <!-- LEFT SIDE OF TEMPLATE -->
    <v-navigation-drawer
      v-model="drawer"
      width="250"
      ripple
      color="secondary"
      class="pb-0 pb-lg-14"
      floating
    >
      <side-bar @close-menu="drawer = false"></side-bar>
    </v-navigation-drawer>

    <!-- TOP SIDE OF TEMPLATE -->
    <v-app-bar app color="#f5f5f5" flat class="border-b app-bar">
      <template #prepend>
        <v-btn
          size="small"
          :class="{ 'hidden-md-and-up': drawer, 'sch-menu-open': true }"
          variant="text"
          icon="menu_open"
          @click="drawer = !drawer"
        >
        </v-btn>

        <s-button type="tertiary" icon @click="goBack">
          <v-icon>chevron_left</v-icon>
        </s-button>

        <add-external
          v-if="isAuthorized('irm') || isAnyAdmin"
          :default-hover="true"
          :button-icon="false"
        ></add-external>
      </template>

      <terms-changed-dialog v-if="isInvestor || isCorporate"></terms-changed-dialog>

      <top-bar-user-menu class="hidden-sm-and-down h-100"></top-bar-user-menu>
    </v-app-bar>

    <!-- CONTENT OF TEMPLATE -->
    <v-main :class="mainClass">
      <v-container v-if="!hidePageTop" class="pb-0" fluid>
        <page-top class="pa-0 pa-sm-3" />
      </v-container>
      <v-container
        fluid
        :style="hidePageTop ? 'height: 100%' : 'height: auto'"
        :class="mainContainerClass"
        class="pt-0"
      >
        <v-row style="height: 100%" no-gutters>
          <v-col>
            <router-view></router-view>
            <v-fade-transition>
              <v-btn
                v-show="showScrollToTopButton"
                v-scroll="onScroll"
                class="v-btn--scroll-top"
                size="large"
                variant="flat"
                position="fixed"
                icon="keyboard_arrow_up"
                color="secondary"
                @click="toTop"
              >
              </v-btn>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-global-confirm></v-global-confirm>

    <!-- FOOTER OF TEMPLATE -->
    <bottom-bar id="bottom-bar"></bottom-bar>
  </div>
</template>
<script>
import AddExternal from "@/components/partials/AddExternal/AddExternal.vue";
import TermsChangedDialog from "@/components/partials/TermsChangedDialog.vue";
import TopBarUserMenu from "@/components/partials/TopBarUserMenu.vue";
import SideBar from "@/components/partials/sidebar/SideBar.vue";
import BottomBar from "@/components/partials/BottomBar.vue";
import PageTop from "@/components/partials/PageTop.vue";
import VGlobalConfirm from "@/components/VGlobalConfirm";
import { mapGetters } from "vuex";
import SButton from "@/s-components/Button/SButton.vue";
import { useGoTo } from "vuetify";

export default {
  components: {
    SButton,
    VGlobalConfirm,
    AddExternal,
    TermsChangedDialog,
    TopBarUserMenu,
    BottomBar,
    SideBar,
    PageTop,
  },
  data: () => ({
    showScrollToTopButton: false,
    timeout: null,
    goTo: useGoTo(),
  }),
  computed: {
    drawer: {
      set(value) {
        this.$store.commit("setNavigationMenuOpened", value);
      },
      get() {
        return this.$store.state.global.navigationMenuOpened;
      },
    },
    companyName() {
      return this.$store.state.user.data.company ? this.$store.state.user.data.company.name : "";
    },
    ...mapGetters([
      "isRememberMeChecked",
      "sessionLifetime",
      "isBootstrapped",
      "isAuthorized",
      "isAnyAdmin",
      "isInvestor",
      "isCorporate",
    ]),
    hidePageTop() {
      return this.$route.meta.hidePageTop;
    },
    noBackgroundColor() {
      return this.$route.meta.noBackgroundColor;
    },
    isMobileScreen() {
      return this.$vuetify.display.xs;
    },
    isTabletScreen() {
      return this.$vuetify.display.sm;
    },
    mainContainerClass() {
      return {
        "pa-0": this.hidePageTop || this.isMobileScreen,
      };
    },
    mainClass() {
      return {
        "bg-white": this.isMobileScreen && !this.noBackgroundColor,
      };
    },
  },
  watch: {
    "$store.state.session_refreshed": function () {
      this.refreshLogoutTimeOut();
    },
  },
  created() {
    this.refreshLogoutTimeOut();
    this.closeNavigationMenuOnSmallerScreen();
  },
  beforeUnmount() {
    if (!this.isRememberMeChecked) {
      clearTimeout(this.timeout);
    }
  },
  methods: {
    closeNavigationMenuOnSmallerScreen() {
      const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      if (width < 1264) {
        this.drawer = false;
      }
    },
    refreshLogoutTimeOut() {
      if (!this.isRememberMeChecked) {
        const lifetime = this.sessionLifetime * 60 * 1000;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
          this.logout();
        }, lifetime);
      }
    },
    goBack() {
      history.back();
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.showScrollToTopButton = top > 30;
    },
    toTop() {
      this.goTo(0, {
        offset: 0,
      });
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}

.hover:hover {
  cursor: pointer;
}

td .v-select__selection {
  font-size: 13px;
  font-weight: 400;
}

table .v-input__slot,
table .v-input {
  padding-top: 0px;
  margin-top: 0px;
}

div.flex {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

.v-btn--scroll-top {
  bottom: 16px;
  right: 16px;
  z-index: 1009;
  opacity: 0.7;
}

.v-main {
  min-height: calc(100vh - 54px);
}

@media (max-width: 525px) {
  .v-main {
    min-height: calc(100vh - 71px);
  }
}

@media (max-width: 768px) {
  .v-main {
    padding-bottom: 0 !important;
  }
}

.sch-menu-open i {
  transform: rotate(180deg);
  position: relative;
  top: -2px;
}

.app-bar.theme--light.v-sheet--outlined {
  border: none !important;
  border-bottom: thin solid #d1d5da !important;
}
</style>
