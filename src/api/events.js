import { axios } from "@/plugins/axios";

class EventApi {
  get(id, params = {}) {
    return axios.get(`events/${id}`, { params }).then((response) => response.data);
  }

  list(params = {}) {
    return axios.get(`events`, { params }).then((response) => response.data);
  }

  create(data) {
    return axios.post(`events`, data).then((response) => response.data);
  }

  update(id, data) {
    return axios.put(`events/${id}`, data).then((response) => response.data);
  }

  delete(id) {
    return axios.delete(`events/${id}`).then((response) => response.data);
  }
}

export default new EventApi();
