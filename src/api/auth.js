import { appDomain, axios } from "@/plugins/axios";

class AuthApi {
  get config() {
    return { baseURL: appDomain };
  }

  refreshCsrfToken() {
    return axios.get("/sanctum/csrf-cookie", this.config);
  }

  async login(credentials) {
    await this.refreshCsrfToken();

    const data = {
      ...credentials,
      remember: credentials.remember ? "yes" : "",
    };
    return (await axios.post("/login", data, this.config)).data;
  }

  async logout() {
    await this.refreshCsrfToken();

    return axios.post("/logout", {}, this.config);
  }

  async loginWithToken(data) {
    await this.refreshCsrfToken();

    return axios.post("/login-with-token", data);
  }

  checkUser(data) {
    return axios.get(`check-user`, { params: data });
  }

  async resetPassword(data) {
    await this.refreshCsrfToken();

    return axios.post("/reset-password", data, this.config);
  }

  async forgotPassword(data) {
    await this.refreshCsrfToken();

    return axios.post("/forgot-password", data, this.config);
  }

  changePassword(data) {
    return axios.post("password/change", data);
  }

  async register(data) {
    await this.refreshCsrfToken();

    return axios.post("/register", data);
  }
}

export default new AuthApi();
