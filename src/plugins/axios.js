"use strict";

import axios from "axios";
import { store } from "@/store/store";
import { router } from "@/router/router";
import AuthApi from "@/api/auth";

axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const appDomain = import.meta.env.PROD ? "" : import.meta.env.VITE_API_DOMAIN;

const config = {
  baseURL: appDomain + "/api",
  timeout: 60 * 1000,
  withCredentials: true,
  ontimeout: () => {
    router.push("/500");
  },
};

let showErrorMessages = true;
let redirect404 = true;

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    store.commit("startLoad");
    return config;
  },
  function (error) {
    store.commit("stopLoad");
    return Promise.reject(error);
  }
);

_axios.interceptors.request.use(function (config) {
  return {
    ...config,
    headers: { ...config.headers },
  };
});

_axios.interceptors.response.use(function (response) {
  store.commit("refreshSession");
  return response;
});

_axios.interceptors.response.use(null, async function (error) {
  if (error.config && error.response && error.response.status === 419) {
    await AuthApi.refreshCsrfToken();
    const baseURL = error.config.baseURL === "/api" ? "" : error.config.baseURL;
    return axios({ ...error.config, baseURL });
  }

  return Promise.reject(error);
});

_axios.interceptors.response.use(
  function (response) {
    store.commit("stopLoad");
    return response;
  },
  async function (error) {
    if (error.code === "ERR_NETWORK") {
      store.commit("snack", {
        text: "Network error, please try again.",
        type: "error",
      });

      store.commit("stopLoad");

      return Promise.reject(error);
    }
    if (typeof error.response === "undefined") {
      router.push("/500");
      return Promise.reject(error);
    }

    if (redirect404 && error.response.status == 404) {
      router.push("/404");
    }
    if (error.config && error.response && error.response.status === 401) {
      await store.dispatch("authLogout");

      if (router.currentRoute.path !== "/login") {
        router.push("/login");
      }
    }

    if (showErrorMessages && error.response.data.message && error.response.status != 401) {
      store.commit("snack", {
        text: error.response.data.message,
        type: "error",
      });
    }
    store.commit("stopLoad");
    return Promise.reject(error);
  }
);

const AxiosPlugin = {
  install(app) {
    app.config.globalProperties.axios = _axios;
    app.config.globalProperties.showResponseErrors = () => (showErrorMessages = true);
    app.config.globalProperties.hideResponseErrors = () => (showErrorMessages = false);
    app.config.globalProperties.axiosRedirect404 = (value) => (redirect404 = value);
    window.axios = _axios;
    Object.defineProperties(app.config.globalProperties, {
      axios: {
        get() {
          return _axios;
        },
      },
      $axios: {
        get() {
          return _axios;
        },
      },
    });
  },
};

export { _axios as axios };

export default AxiosPlugin;
