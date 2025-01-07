export const urlRule = (val) =>
  !val ||
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
    val
  ) ||
  "Link has invalid format.";

export const timeRule = (val) => {
  if (!val) return "Time is required";
  if (!/^\d{2}:\d{2}$/.test(val)) return "Time format is invalid.";
  const [h, m] = val.split(":");
  if (h < 0 || h > 24 || m < 0 || m > 59) return "Time format is invalid.";
  return true;
};

export const requiredRule = (val) => !!val || `This field is required.`;
export const requiredNumericRule = (val) =>
  (!isNaN(parseFloat(val)) && isFinite(val)) || `This field is required.`;

export const requiredFieldNameRule =
  (fieldName = "") =>
  (val) =>
    !!val || `The ${fieldName} field is required.`;

export const requiredNumericFieldNameRule =
  (fieldName = "") =>
  (val) =>
    (!isNaN(parseFloat(val)) && isFinite(val)) || `The ${fieldName} is required.`;

export const emailRule = (value) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !value || pattern.test(value) || "Please enter a valid email address.";
};

export const minLengthRule = (min) => (val) =>
  (val && val.length >= min) || `The field must be at least ${min} characters.`;
export const maxLengthRule = (max) => (val) =>
  !val || val.length <= max || `The field must not exceed ${max} characters.`;

export const minRule = (min) => (val) =>
  !val || val >= min || `The value must be greater than ${min - 1}.`;

export const maxFiles = (max) => (val) =>
  (val.length >= 0 && val.length <= max) || `Maximum number of files that can be uploaded is ${max}.`;

export const numberRule = (v) =>
  !v || Number.isInteger(Number(v)) || "The value must be an integer number.";

export const selectRule = (val) => typeof val != "undefined" || "This field is required.";

export const requiredOneOrMore = (values) => {
  return values.length > 0 || "This field is required.";
};
