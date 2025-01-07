import { BASE_ROLE } from "@/constants";
import difference from "lodash-es/difference";

export default {
  state: {
    data: {
      profile: {},
      company: {},
      aum_option: {},
      role: {},
    },
    companyRepresentatives: [],
    investorRequests: [],
    component: "global",
  },
  mutations: {
    resetUserModule(state) {
      Object.assign(state, {
        data: {
          profile: {},
          company: {},
          aum_option: {},
        },
        companyRepresentatives: [],
        investorRequests: [],
        component: "",
      });
    },
    setUser(state, payload) {
      state.data = payload;
      localStorage.setItem("profile_complete", payload.profile_complete);
      localStorage.setItem("user_id", payload.id);
      localStorage.setItem("base_role", payload.role.base_role);
      switch (payload.role.base_role) {
        case BASE_ROLE.SUPER_ADMIN:
        case BASE_ROLE.ADMIN:
          state.component = "admin";
          break;
        case BASE_ROLE.CORPORATE:
          state.component = "company";
          break;
        case BASE_ROLE.INVESTOR:
          state.component = "investor";
      }
    },
    updateUser(state, payload) {
      for (var property in payload) {
        state.data[property] = payload[property];
      }
    },
    updateCompany(state, payload) {
      for (var property in payload) {
        state.data.company[property] = payload[property];
      }
    },
    setCompany(state, payload) {
      state.data.company = payload;
    },
    setCompanyRepresentatives(state, payload) {
      state.companyRepresentatives = payload;
    },
    setInvestorRequests(state, payload) {
      state.investorRequests = payload;
    },
    addCompanyRepresentative(state, payload) {
      state.companyRepresentatives.push(payload);
    },
    setTotalInvestors(state, payload) {
      state.totalInvestors = payload;
    },
  },
  actions: {
    async getUser({ dispatch, commit, rootState }) {
      // eslint-disable-next-line
      await axios.get("auth-user").then(async (response) => {
        await commit("setUser", response.data.data);
        await dispatch("loadUserData");
      });

      if (rootState.settings.assetClasses[0] == undefined) {
        await dispatch("getSettings");
      }
    },
    loadUserData({ dispatch, state }) {
      if (state.data.role.base_role === BASE_ROLE.INVESTOR) {
        //dispatch("getInvestorEvents");
      } else {
        dispatch("getCompany");
        dispatch("getCompanyRepresentatives");
      }
    },
    getCompany({ state, commit }) {
      // eslint-disable-next-line
      axios.get(`companies/${state.data.company_id}`)
        .then(response => {
        commit("setCompany", response.data.data);
      });
    },
    getCompanyRepresentatives({ commit, getters }) {
      if (getters.isAuthorized("view_and_manage_company_representatives")) {
        // eslint-disable-next-line
        axios.get("users?companyRepresentatives&include=profile").then(response => {
          commit("setCompanyRepresentatives", response.data.data);
        });
      }
    },
    getInvestorRequests({ commit, getters }) {
      if (getters.isAuthorized("see_investor_requests")) {
        // eslint-disable-next-line
        axios
          .get("investor-requests")
          .then(response => {
          commit("setInvestorRequests", response.data.data);
        });
      }
    },
  },
  getters: {
    userData(state) {
      return state.data;
    },
    sixMarketingOptInState(state) {
      return state.data.six_marketing_opt_in_state;
    },
    latestTermsAccepted(state, getters) {
      return getters.isInvestor || getters.isCorporate ? state.data.last_terms_accepted : true;
    },
    homeRouteName(state, getters) {
      return [
        [
          "dashboard",
          () =>
            getters.isAuthorized("dashboard") &&
            getters.isAuthorizedAny([
              "view_single_company_events",
              "view_six_events",
              "view_and_manage_linked_investors",
              "manage_investor_requests",
              "irm",
            ]),
        ],
        [
          "events",
          () =>
            getters.isCorporate &&
            getters.isAuthorizedAny(["view_single_company_events", "view_six_events"]),
        ],
        ["investors", () => getters.isCorporate && getters.isAuthorized("view_investors")],
        ["users-list", () => getters.isSupportAdmin],
        ["upcoming-events", () => getters.isInvestor],
        ["edit-user-profile", () => true],
      ].find((tuple) => tuple[1]())[0];
    },
    isSuperAdmin(state) {
      return state.data.role.base_role === BASE_ROLE.SUPER_ADMIN;
    },
    isAdmin(state) {
      return state.data.role.base_role === BASE_ROLE.SUPER_ADMIN;
    },
    isSupportAdmin(state) {
      return state.data.role.base_role === BASE_ROLE.ADMIN;
    },
    isAnyAdmin(state) {
      return (
        state.data.role.base_role === BASE_ROLE.SUPER_ADMIN ||
        state.data.role.base_role === BASE_ROLE.ADMIN
      );
    },
    isUser(state) {
      return (
        state.data.role.base_role === BASE_ROLE.CORPORATE ||
        state.data.role.base_role === BASE_ROLE.INVESTOR
      );
    },
    /**
     * @deprecated
     * @param state
     * @returns {boolean}
     */
    isCompany(state) {
      return state.data.role.base_role === BASE_ROLE.CORPORATE;
    },
    isCorporate(state) {
      return state.data.role.base_role === BASE_ROLE.CORPORATE;
    },
    isInvestor(state) {
      return state.data.role && state.data.role.base_role === BASE_ROLE.INVESTOR;
    },
    isProfileCompleteComplete(state) {
      return !!state.data.profile_complete;
    },
    isProfileComplete(state) {
      const baseRole = state.data.role.base_role;
      if (baseRole === BASE_ROLE.SUPER_ADMIN || baseRole === BASE_ROLE.ADMIN) return true;

      if (baseRole === BASE_ROLE.CORPORATE) return state.data.first_name && state.data.last_name;

      return (
        state.data.first_name &&
        state.data.last_name &&
        state.data.company_id &&
        state.data.email &&
        state.data.company_function &&
        state.data.aum_option_id != null &&
        state.data.feedback_agreement != null &&
        state.data.terms_agreement != null &&
        state.data.profile.phone &&
        state.data.profile.city &&
        state.data.profile.country &&
        state.data.asset_classes.length > 0 &&
        state.data.sectors.length > 0 &&
        state.data.market_caps.length > 0 &&
        state.data.event_locations.length > 0 &&
        state.data.stock_market_countries.length > 0
      );
    },
    userRole(state) {
      return state.data.role;
    },
    isAuthorized: (state, getters, rootState) => (permission) => {
      const currentUserBaseRole = state.data.role.base_role;
      if (currentUserBaseRole === BASE_ROLE.SUPER_ADMIN) {
        return true;
      }
      const isExclusivelyCorporatesPermission = (permission) => {
        const corporatePermissions = Object.keys(
          rootState.settings.baseRolesPermissions[BASE_ROLE.CORPORATE]
        );
        const adminPermissions = Object.keys(
          rootState.settings.baseRolesPermissions[BASE_ROLE.ADMIN]
        );
        const exclusiveCorporatePermissions = difference(corporatePermissions, adminPermissions);
        return exclusiveCorporatePermissions.includes(permission);
      };
      if (
        currentUserBaseRole === BASE_ROLE.ADMIN &&
        isExclusivelyCorporatesPermission(permission)
      ) {
        return true;
      }
      const currentUserRole = rootState.settings.roles.find(
        (role) => role.id === state.data.role_id
      );
      if (!currentUserRole) {
        return false;
      }
      return currentUserRole.permissions.includes(permission);
    },
    isAuthorizedAny: (_, getters) => (permissions) => {
      for (let permission of permissions) {
        if (getters.isAuthorized(permission)) return true;
      }
      return false;
    },
    isAuthorizedAll: (_, getters) => (permissions) => {
      for (let permission of permissions) {
        if (!getters.isAuthorized(permission)) return false;
      }
      return true;
    },
    canManageEventsForOtherCompanies(state, getters) {
      return getters.isAnyAdmin;
    },
    areEventsEnabled(state) {
      return state.data.company.event_enabled;
    },
    zoomCredentials(state) {
      return state.data.company.zoom_credentials ? state.data.company.zoom_credentials : null;
    },
    widgetsEnabled(state) {
      return (
        state.data.company.widgets_enabled &&
        state.data.company.widget_templates &&
        state.data.company.widget_templates.length > 0
      );
    },
  },
};
