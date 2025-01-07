import {
  formatDateTime as fDT,
  formatDateTimeWithZone,
  formatNow,
  FORMAT,
} from "@/functions/dates";
import AuthApi from "@/api/auth";

// Get query string param
const getParameterByName = function (name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

// Pop up a success message
const success = function (text, action = null) {
  this.$store.commit("snack", { text, type: "success", action });
};

// Pop up an error message
const error = function (text, action = null) {
  this.$store.commit("snack", { text, type: "error", action });
};

// Pop up an info message
const info = function (text, action = null) {
  this.$store.commit("snack", { text, type: "info", action });
};

// Pop up a warning message
const warning = function (text, action = null) {
  this.$store.commit("snack", { text, type: "warning", action });
};

// Logout the current user and redirect to login
const logout = function (query = "") {
  AuthApi.logout().then((response) => {
    if (response && response.data && response.data.message) {
      this.info(response.data.message);
    }
    this.$store
      .dispatch("authLogout")
      .then(() =>
        this.$router.push(
          "/login" + (typeof query == "string" && query != "" ? "?last_path=" + query : "")
        )
      );
  });
};

const resetForm = function () {
  this.$refs.form.inputs.forEach((el) => {
    el.errorMessages.pop();
  });
};

const setErrors = function (errors) {
  for (let property in errors) {
    if (this.$refs[property].errorMessages !== undefined) {
      this.$refs[property].errorMessages.push(errors[property][0]);
    }
  }
};

const inputDateFormat = function (date) {
  return fDT(date, FORMAT.DATE);
};

const dateValue = (input) => {
  return typeof input === "object" && !!input ? input.date : input;
};

const formatDate = function (date) {
  return fDT(dateValue(date), FORMAT.DATE, false);
};

const formatNumberWithApostropheSign = function (value) {
  return value
    .toString()
    .replace(/,/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

const formatDateSql = function (date) {
  return fDT(dateValue(date), FORMAT.DATE_SQL);
};

const formatDateTime = function (dateTime) {
  dateTime = dateValue(dateTime);
  return dateTime ? fDT(dateTime, FORMAT.DATETIME) : "";
};

const formatDateTimeFull = function (dateTime) {
  dateTime = dateValue(dateTime);
  return dateTime ? fDT(dateTime, FORMAT.DATETIME_FULL) : "";
};

const formatTime = function (dateTime, convertTimeZone = true) {
  dateTime = dateValue(dateTime);
  return dateTime ? fDT(dateTime, FORMAT.TIME, convertTimeZone) : "";
};

const formatCurrentUserTimezone = function () {
  return formatNow(FORMAT.ZONE_SHORT);
};

const formatTimeFull = function (dateTime) {
  dateTime = dateValue(dateTime);
  return dateTime ? fDT(dateTime, FORMAT.TIME_FULL) : "";
};

const minuteRestriction = function (min) {
  return min % 5 == 0;
};

const getSlotTypeIcon = function (id) {
  switch (id) {
    case 1:
      return "link";
    case 2:
      return "people";
    default:
      return "error_outline";
  }
};

const $fullCountryName = function (countryCode, returnIfEmpty = " - ") {
  return (
    this.$store.state.settings.countries.find((country) => country.id === countryCode) || {
      name: returnIfEmpty,
    }
  ).name;
};

const $isEventOwner = function (event) {
  const currentUserCompanyId = this.$store.getters.userData.company_id;
  const secondaryOwners = event.secondary_owners ? event.secondary_owners.map((c) => c.id) : [];
  return (
    event.owned_company_id === currentUserCompanyId ||
    secondaryOwners.includes(currentUserCompanyId)
  );
};

const $setPageTitle = function (title, suffix = null, separator = null) {
  const titleData = Object.assign(
    { title },
    suffix !== null ? { suffix } : {},
    separator !== null ? { separator } : {}
  );
  this.$store.commit("setPageTitle", titleData);
};

const $setPageSubTitle = function (subtitle) {
  this.$store.commit("setPageSubTitle", subtitle);
};

const $eventTimezoneAbbreviation = (contextualDate, tz) => {
  return formatDateTimeWithZone(contextualDate, tz, FORMAT.ZONE_SHORT);
};

/**
 * @param {object} params for available params list check store/modules/globalConfirm.js
 */
const withConfirmDialog = function (params) {
  this.$store.commit("showConfirmationDialog", params);
};

export const helpers = {
  withConfirmDialog,
  $eventTimezoneAbbreviation,
  $setPageSubTitle,
  $setPageTitle,
  formatDateTime,
  getParameterByName,
  formatDate,
  formatTime,
  formatTimeFull,
  formatDateTimeFull,
  formatCurrentUserTimezone,
  formatNumberWithApostropheSign,
  formatDateSql,
  success,
  info,
  error,
  inputDateFormat,
  logout,
  $isEventOwner,
  $fullCountryName,
  getSlotTypeIcon,
  minuteRestriction,
  setErrors,
  resetForm,
  warning,
};
