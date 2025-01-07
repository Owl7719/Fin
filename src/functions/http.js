import { axios, appDomain } from "@/plugins/axios";
import isNull from "lodash-es/isNull";
import isUndefined from "lodash-es/isUndefined";
import isArray from "lodash-es/isArray";
import reduce from "lodash-es/reduce";

export const url = (path, queryParams = {}) => {
  return appDomain + path + "?" + buildHttpQuery(queryParams);
};

export const apiUrl = (path, queryParams = {}) => {
  return appDomain + "/api" + path + "?" + buildHttpQuery(queryParams);
};

export function downloadFile(url, params = {}, data = {}, method = "GET") {
  axios({
    url: url,
    method: method,
    responseType: "blob", // important,
    params,
    data,
  }).then((response) => {
    const blob = new Blob([response.data], { type: response.data.type });
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "unknown";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="{0,1}(.+)"{0,1}/);
      if (fileNameMatch.length === 2) {
        fileName = fileNameMatch[1].replace(/"$/, "");
      }
    }
    if (window.navigator && window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  });
}

const flatListQueryData = (key, values) => {
  key = encodeURIComponent(key);
  return values.map((value) => `${key}[]=${encodeURIComponent(value)}`).join("&");
};

export function buildHttpQuery(obj) {
  return reduce(
    obj,
    function (result, value, key) {
      const hasValue = !isNull(value) && !isUndefined(value);
      if (hasValue) {
        if (isArray(value)) {
          return result + flatListQueryData(key, value) + "&";
        }
        return result + encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
      }
      return result;
    },
    ""
  ).slice(0, -1);
}
