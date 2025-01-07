import { store } from "@/store/store";
import AuthRoutes from "@/router/auth-routes";
import pick from "lodash-es/pick";
import { router } from "@/router/router";

const isSameRoute = (route1, route2) => {
  return route1.name == route2.name || route1.path == route2.path;
};

const findRoute = (routes, route) => {
  for (let r of routes) {
    if (isSameRoute(r, route)) {
      return r;
    }
    if (r.children) {
      let found = findRoute(r.children, route);
      if (found) {
        return found;
      }
    }
  }
};

const requiresAuthentication = (route) => {
  return findRoute(AuthRoutes, route);
};

const isAuthenticated = () => store.getters.isAuthenticated;

// ---------- [ SAVING ORIGINAL ROUTE ] ----------

const LOCAL_STORAGE_KEY = "original-route-before-redirect-to-auth";

const rememberOriginalRoute = (routeData) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(routeData));
};

const popOriginalRoute = () => {
  let routeData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!routeData) {
    return null;
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return JSON.parse(routeData);
};

// ---------- [ End of SAVING ORIGINAL ROUTE ] ----------

export default function redirectAfterAuth(to, from, next) {
  if (!isAuthenticated() && requiresAuthentication(to)) {
    rememberOriginalRoute(pick(to, ["path", "params", "query"]));
    next();
    return;
  }

  if (isAuthenticated()) {
    const originalRoute = popOriginalRoute();
    if (originalRoute && to.path !== originalRoute.path) {
      if (store.getters.isInvestor && originalRoute.path === "/dashboard") {
        next();
        return;
      }
      router.push(originalRoute);
      return;
    }
  }

  next();
}
