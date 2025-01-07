import { store } from "@/store/store";

import { BASE_ROLE, INVESTOR_TYPE } from "@/constants";

const getUserData = (key) => localStorage.getItem(key);
const isOfBaseRole = (baseRole) => getUserData("base_role") == baseRole;

// --- PREDICATE FUNCTIONS FOR AUTHORIZE MIDDLEWARE FUNCTION ---
export const isAdmin = () => isOfBaseRole(BASE_ROLE.ADMIN);
export const isAdminSupport = () => isOfBaseRole(BASE_ROLE.ADMIN);
export const isSuperAdmin = () => isOfBaseRole(BASE_ROLE.SUPER_ADMIN);
export const isAnyAdmin = () => isAdmin() || isSuperAdmin();
export const isCorporate = () => isOfBaseRole(BASE_ROLE.CORPORATE);
export const isCorporateOwnCompany = (companyId) =>
  store.getters.userData.company_id === parseInt(companyId);

export const isInvestor = () => isOfBaseRole(BASE_ROLE.INVESTOR);
export const can = (permission) => () => store.getters.isAuthorized(permission);
export const areEventsEnabled = () =>
  store.getters.isAnyAdmin ? true : store.getters.areEventsEnabled;
export const getter = (getterName) => () => store.getters[getterName];
export const isNotPrivateInvestor = () =>
  store.getters.userData.investor_type != INVESTOR_TYPE.PRIVATE_INVESTOR;

// --- LOGICAL OPERATORS FOR CONVENIENCE ---
export const or =
  (...predicates) =>
  () =>
    predicates.reduce((carry, predicate) => (carry === true ? carry : predicate()), false);
export const and =
  (...predicates) =>
  () =>
    predicates.reduce((carry, predicate) => (carry === false ? carry : predicate()), true);

// --- MIDDLEWARE FUNCTIONS ---
export const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next({ name: store.getters.homeRouteName });
};

export const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
  } else {
    const routeName =
      to.query && to.query["guest-start"] && to.query["guest-start"] === "check-email"
        ? "check-email"
        : "login";
    next({ name: routeName });
  }
};

const allPredicatesPassed = (predicates) =>
  predicates.reduce((last, p) => (!last ? false : p()), true);

export const authorize =
  (...predicates) =>
  (to, from, next) => {
    if (allPredicatesPassed(predicates)) {
      next();
    } else {
      next("/403");
    }
  };

/**
 * Expects tuples (predicate, redirectPathOnFail)
 * Example: redirectableAuthorize([ [canEditEvents, '/403'], ... ])
 *
 * @param predicates
 * @returns {Function}
 */
export const redirectableAuthorize =
  (...predicates) =>
  (to, from, next) => {
    for (const [predicate, redirectPathOnFail] of predicates) {
      if (!predicate()) {
        next(redirectPathOnFail);
        return;
      }
    }
    next();
  };
