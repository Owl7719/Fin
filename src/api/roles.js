import { axios } from "@/plugins/axios";

class RoleApi {
  constructor() {
    this.url = "roles";
  }

  get(id) {
    return axios.get(`${this.url}/${id}`).then((response) => response.data);
  }

  list(params = {}) {
    return axios.get(this.url, { params }).then((response) => response.data);
  }

  create(data) {
    return axios.post(this.url, data).then((response) => response.data);
  }

  update(id, data) {
    return axios.put(`${this.url}/${id}`, data).then((response) => response.data);
  }

  delete(id) {
    return axios.delete(`${this.url}/${id}`).then((response) => response.data);
  }
}

export default new RoleApi();
