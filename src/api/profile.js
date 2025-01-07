import { axios } from "@/plugins/axios";

class ProfileApi {
  constructor() {
    this.url = "profile";
  }

  checkEmail(params) {
    return axios
      .get(`${this.url}/email/check-availability`, { params })
      .then((response) => response);
  }

  deleteAccount() {
    return axios.delete(`${this.url}/delete-account`).then((response) => response.data);
  }
}

export default new ProfileApi();
