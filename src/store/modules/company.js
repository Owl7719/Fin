import CompaniesApi from "@/api/companies";

export default {
  namespaced: true,
  state: {
    data: null,
  },
  getters: {
    getCompany(state) {
      return state.data;
    },
  },
  mutations: {
    setCompany(state, payload) {
      state.data = payload;
    },
  },
  actions: {
    loadCompany({ commit }, { companyId, params }) {
      return new Promise((resolve, reject) => {
        CompaniesApi.one(companyId, params)
          .then((response) => {
            commit("setCompany", response.data);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
