export default {
  state: {
    navigationMenuOpened: true,
    interactionTypes: [],
    recaptchaKey: "",
    pageTitle: "",
    pageTitleSuffix: "",
    pageTitleSeparator: "-",
    pageSubTitle: "",
  },
  mutations: {
    setNavigationMenuOpened(state, value) {
      state.navigationMenuOpened = value;
    },
    setPageTitle(state, { title, suffix = null, separator = null }) {
      if (title) {
        state.pageTitle = title;
      }
      state.pageTitleSuffix = suffix || "";
      state.pageTitleSeparator = suffix && separator === null ? "-" : separator;
    },
    setPageSubTitle(state, value) {
      state.pageSubTitle = value;
    },
    setGlobal(state, payload) {
      state.interactionTypes = payload;
    },
    setRecaptcha(state, payload) {
      state.recaptchaKey = payload.recaptcha_key;
    },
  },
  actions: {
    getGlobal({ commit }) {
      // eslint-disable-next-line
      axios.get("/settings/public?interactionTypes").then(response => {
        commit("setGlobal", response.data.data.interactionTypes);
      });
      // eslint-disable-next-line
      axios.get("/settings/recaptcha").then(response => {
        commit("setRecaptcha", response.data);
      });
    },
  },
  getters: {
    pageTitle(state) {
      return state.pageTitle;
    },
    pageSubTitle(state) {
      return state.pageSubTitle;
    },
    pageTitleSuffix(state) {
      return state.pageTitleSuffix;
    },
    pageTitleSeparator(state) {
      return state.pageTitleSeparator;
    },
  },
};
