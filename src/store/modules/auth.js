export default {
  state: {
    auth: localStorage.getItem("auth"),
    remember_me: localStorage.getItem("remember_me"),
  },
  mutations: {
    authSuccess(state, payload) {
      const auth = "1";
      localStorage.setItem("auth", auth);
      state.auth = auth;

      const rememberMe = payload.remember_me ? "1" : "";

      localStorage.setItem("remember_me", rememberMe);
      state.remember_me = rememberMe;
    },
    authLogout(state) {
      state.auth = "";
      state.remember_me = "";
      localStorage.removeItem("auth");
      localStorage.removeItem("remember_me");
    },
  },
  actions: {
    authRequest({ dispatch, commit }, payload = { remember_me: false }) {
      commit("authSuccess", payload);
      return dispatch("bootstrap");
    },
    authLogout({ commit }) {
      commit("authLogout");
      return Promise.resolve();
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.auth,
    isRememberMeChecked: (state) => !!state.remember_me,
  },
};
