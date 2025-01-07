import { axios } from "@/plugins/axios";

class CompanyApi {
  constructor() {
    this.url = "companies";
  }

  list(params = {}) {
    return axios.get(this.url, { params }).then((response) => response.data);
  }

  one(id, params = {}) {
    return axios.get(`${this.url}/${id}`, { params }).then((response) => response.data);
  }

  create(data) {
    return axios.post(this.url, data).then((response) => response.data);
  }

  update(id, data, params) {
    return axios.patch(`${this.url}/${id}`, data, { params }).then((response) => response.data);
  }
}

export default new CompanyApi();
