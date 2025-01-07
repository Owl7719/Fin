<template>
  <v-footer
    v-if="isBootstrapped"
    app
    class="left-0 w-100"
    color="#f5f5f5"
    :height="56"
    :style="footerStyle"
  >
    <v-row
      align="center"
      justify="space-between"
      class="footer__container text-center flex-column flex-md-row"
      no-gutters
    >
      <v-col cols="auto" class="text-sm-center text-md-left">
        <div class="pl-2 text-no-wrap">
          &copy;
          <span id="refresh-settings" @click="$store.dispatch('getSettings')">
            {{ new Date().getFullYear() }}
          </span>
          - Interaction Partners
        </div>
      </v-col>
      <v-col class="footer__links text-sm-center text-md-right">
        <router-link
          v-for="staticPage in staticPages"
          :key="staticPage.name"
          :to="staticPage.meta.path ? staticPage.meta.path : staticPage.path"
          class="pl-2 pr-2 text-black"
        >
          {{ staticPage.meta.title }}
        </router-link>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import staticPages from "@/router/routes/static-routes";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isBootstrapped", "isCorporate"]),
    staticPages() {
      return staticPages;
    },
    footerStyle() {
      return {
        "z-index": this.isDesktopScreen ? 1008 : 1004,
      };
    },
    isDesktopScreen() {
      return this.$vuetify.display.lgAndUp;
    },
  },
};
</script>

<style>
div.col.footer__links {
  padding: 0 10px;
}

div.row.footer__container {
  flex-direction: column;
  min-height: 54px !important;
}

@media screen and (min-width: 960px) {
  div.row.footer__container {
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  div.col.footer__links {
    margin-right: 70px;
  }
}

@media (max-width: 768px) {
  .v-footer {
    position: relative !important;
    bottom: 0px;
  }
}
</style>
