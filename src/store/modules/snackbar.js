export default {
  state: {
    active: false,
    text: "",
    type: "info",
    timeout: 4000,
    action: null,
  },
  mutations: {
    closeSnackbar(state) {
      state.active = false;
    },
    snack(state, payload) {
      state.active = true;
      state.text = payload.text;
      state.type = payload.type || "info";
      state.timeout = payload.timeout || 4000;
      state.action = payload.action || null;
    },
  },
};
