import { axios } from "@/plugins/axios";

class UsersApi {
  constructor() {
    this.url = "users";
  }

  list(params = {}) {
    return axios.get(this.url, { params }).then((response) => response.data);
  }

  get(id, params = {}) {
    return axios.get(`${this.url}/${id}`, { params }).then((response) => response.data);
  }

  create(data) {
    return axios.post(this.url, data).then((response) => response.data);
  }

  update(id, data) {
    return axios.put(`${this.url}/${id}`, data).then((response) => response.data);
  }

  delete(uuid) {
    return axios.delete(`${this.url}/${uuid}`).then((response) => response.data);
  }

  checkEmail(email) {
    return axios
      .get(`${this.url}/check-email`, { params: { email } })
      .then((response) => response.data);
  }
}

export default new UsersApi();
