import { createStore } from "vuex";
import auth from "./modules/auth";
import user from "./modules/user";
import dashboard from "./modules/dashboard";
import settings from "./modules/settings";
import snackbar from "./modules/snackbar";
import globalConfirm from "./modules/globalConfirm";
import events from "./modules/events";
import feedback from "./modules/feedback";
import cache from "./modules/cache";
import terms from "./modules/terms";
import global from "./modules/global";
import investors from "@/store/modules/investors";
import changelog from "@/store/modules/changelog";
import company from "@/store/modules/company";

export const store = createStore({
  state: {
    session_refreshed: 0,
    loading: false,
    bootstrapped: false,
  },
  mutations: {
    refreshSession(state) {
      // this statement is updated just to trigger watcher in views/layouts/Auth component
      state.session_refreshed = (state.session_refreshed + 1) % 10;
    },
    startLoad(state) {
      state.loading = true;
    },
    stopLoad(state) {
      state.loading = false;
    },
    setState(state, payload) {
      state.bootstrapped = payload;
    },
  },
  actions: {
    async bootstrap({ dispatch, commit }) {
      commit("setState", false);
      commit("resetUserModule");
      commit("resetDashboardModule");
      commit("resetEventModule");

      /*
       * Those empty then() and catch() calls are
       * important! Settings retrieval is the first
       * request done by SPA. When access token is
       * expired for correct it refreshing those
       * 2 calls must be in place.
       */
      await dispatch("getSettings")
        .then(() => {})
        .catch(() => {});

      await dispatch("getUser");
      commit("setState", true);
    },
  },
  modules: {
    settings,
    auth,
    global,
    user,
    dashboard,
    snackbar,
    globalConfirm,
    events,
    feedback,
    cache,
    terms,
    investors,
    changelog,
    company,
  },
  getters: {
    isBootstrapped: (state) => state.bootstrapped,
    isLoading: (state) => state.loading,
  },
});
