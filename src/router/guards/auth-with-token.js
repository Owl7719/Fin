import { store } from "@/store/store";
import { bus } from "@/plugins/bus";
import omit from "lodash-es/omit";

import AuthApi from "@/api/auth";

const loginWithToken = async (to, next, token) => {
  try {
    const response = await AuthApi.loginWithToken({ token, unhide: to.query.unhide });

    if (response.data.two_factor === true) {
      const query = new URLSearchParams(omit(to.query, "auth")).toString();
      const lastPath = `${to.path}?${query}`;

      const nextUrl =
        "/login-two-factor-challenge" + (to.path === "/login" ? "" : "?last_path=" + lastPath);

      return next(nextUrl);
    } else {
      await store.dispatch("authRequest");
      return next(omit(to, ["query.auth"]));
    }
  } catch (error) {
    return next("/login");
  }
};

export default function (to, from, next) {
  document.title = to.meta.title ? "crm - " + to.meta.title : "crm";

  bus.emit("setPageTopButtons", null);

  const token = to.query.auth;

  if (token) {
    if (store.getters.isAuthenticated) {
      return AuthApi.logout().then(async () => {
        return loginWithToken(to, next, token);
      });
    } else {
      return loginWithToken(to, next, token);
    }
  }

  next();
}
