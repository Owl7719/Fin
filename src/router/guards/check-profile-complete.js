import { store } from "@/store/store";

const allowedPagesForNonCompleteProfile = [
  "message",
  "simple-message",
  "result-message",
  "edit-user-profile",
  "edit-company",
  "provide-feedback",
  "feedback-invites",
  "investor-profile",
  "single-company-event-invite",
  "conference-invite",
  "conference-invites",
  "graphical-schedule",
  "conferences-user-schedule-details",
  "user-graphical-schedule",
  "unsubscribe",
  "About",
  "Support",
  "Terms Of Use",
  "Privacy Policy",
  "Imprint and Disclaimer",
  "Help",
  "Contact Us",
  "one-click-book",
  "notifications-view",
  "notifications-settings",
  "download-research-report",
];

const isProfileComplete = () => !!parseInt(localStorage.getItem("profile_complete"));
const isHeadingToEditProfilePage = (to) => to.name === "edit-user-profile";
const isHeadingToAllowedPage = (to) => allowedPagesForNonCompleteProfile.includes(to.name);

export const checkWhetherProfileComplete = (to, from, next) => {
  if (
    !store.getters.isAuthenticated ||
    !store.getters.isInvestor ||
    isHeadingToEditProfilePage(to) ||
    isProfileComplete() ||
    isHeadingToAllowedPage(to)
  ) {
    return next();
  }

  if (store.getters.isAuthenticated && store.getters.isInvestor) {
    return next();
  }

  store.commit("snack", {
    text: "Please update all required profile information.",
    type: "info",
  });
  next({ name: "edit-user-profile" });
};

const isOneClickBooking = (to) => to && to.name === "one-click-book";

export const showTermsDialogIfNeeded = (to, from) => {
  if (
    store.getters.isAuthenticated &&
    !store.getters.latestTermsAccepted &&
    !isOneClickBooking(to)
  ) {
    store.commit("showTermsDialog");
  }

  return true;
};
