import { axios } from "@/plugins/axios";
import groupBy from "lodash-es/groupBy.js";

const buildStockCountriesTree = (countries) => {
  const items = countries.map((it) => ({ ...it, children: [], disabled: false }));

  const { parents, children } = groupBy(items, (it) => (it.parent_id ? "children" : "parents"));

  if (children) {
    for (const child of children) {
      const parentIndex = parents.findIndex((it) => it.id === child.parent_id);

      if (parentIndex !== -1) {
        child.disabled = !parents[parentIndex].active;
        parents[parentIndex].children.push(child);
      }
    }
  }

  return parents;
};

export default {
  state: {
    support: {
      name: null,
      phone: null,
      email: null,
    },
    assetClasses: [],
    aumOptions: [],
    countries: [],
    eventLocations: [],
    marketCaps: [],
    marketLiquidity: [],
    sectors: [],
    stockCountries: [],
    companyTypes: [],
    eventStatuses: [],
    eventTypes: [],
    investorRequestStatuses: [],
    interactionTypes: [],
    slotTypes: [],
    hedging: [],
    salutations: [],
    timePeriods: [],
    feedbackQuestionTypes: [],
    timezones: [],
    venueTypes: [],
    standardQuestions: [],
    calendarRows: [],
    investorTypes: [],
    roles: [],
    roleAllowedToManage: [],
    baseRolesPermissions: [],
    companiesRequiredDataShareOptIn: [],
    mailingSettings: {},
    logTypes: {},
    session_lifetime: 120,
    // 3rd party
    sixCategories: [],
    sixSerReportingStandards: [],
    newsTags: [],
  },
  mutations: {
    setSettings(state, payload) {
      for (let property in payload) {
        state[property] = payload[property];
      }
    },
    addSettings(state, payload) {
      state[payload.name].push(payload.data);
    },
    replaceSettings(state, payload) {
      state[payload.name] = payload.data;
    },
    addStandardQuestion(state, payload) {
      state.assetClasses.find((el) => el.id == payload.id).standardQuestions.push(payload.data);
    },
    removeSettings(state, payload) {
      state[payload.name].pop(payload.index);
    },
  },
  actions: {
    getSettings({ commit }) {
      // eslint-disable-next-line
      return axios.get("settings").then(response => {
        if (response && response.data && response.data.data) {
          commit("setSettings", response.data.data);
        }
      });
    },
    getPublicSettings({ commit }, keys) {
      // eslint-disable-next-line
      return axios.get(`settings/public?${keys.join('&')}`).then(response => {
        if (response && response.data && response.data.data) {
          commit("setSettings", response.data.data);
        }
      });
    },
  },
  getters: {
    logTypes: (state) => {
      return Object.entries(state.logTypes).map((it) => {
        return { name: it[1], id: it[0] };
      });
    },
    activeStockCountries: (state) => {
      return state.stockCountries.filter((it) => it.active);
    },
    activeNestedStockCountries: (state, getters) =>
      buildStockCountriesTree(getters.activeStockCountries),
    nestedStockCountries: (state) => buildStockCountriesTree(state.stockCountries),
    sessionLifetime: (state) => parseInt(state.session_lifetime),
    supportName: (state) => state.support.name,
    supportPhone: (state) => state.support.phone,
    supportEmail: (state) => state.support.email,
    settings: (state) => state,
    countryCodes: (state) => Array.from(state.countries.values()).map((c) => c.id),
    mailingFromEmails(state) {
      const mailingSettings = state.mailingSettings;
      if (!mailingSettings.domain) {
        return [];
      }
      const addDomainToName = (value) => {
        return { ...value, email: `${value.email}@${mailingSettings.domain}` };
      };

      return mailingSettings.send_from_names.map(addDomainToName) || [];
    },
    mailingFromEmailMap(state, getters) {
      const map = {};
      for (const item of getters.mailingFromEmails) {
        map[item.email] = {
          email: item.email,
          name: item.name,
          default: item.default,
          label: item.email + (item.name ? ` (sender name: ${item.name})` : ""),
        };
      }

      return map;
    },
  },
};
