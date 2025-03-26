import IAuthService from "./interfaces/IAuthService";
import ApiService from "./ApiService";

class AuthService extends IAuthService {
  async login(credentials) {
    try {
      const data = await ApiService.post("/auth/login", credentials);
      return data;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  }

  async refreshToken(refreshToken) {
    try {
      const data = await ApiService.post("/auth/refresh", {
        refresh_token: refreshToken,
      });
      return data;
    } catch (error) {
      throw new Error(error.message || "Token refresh failed");
    }
  }

  async logout() {
    try {
      await ApiService.post("/auth/logout");
    } catch (error) {
      throw new Error(error.message || "Logout failed");
    }
  }
}

export default new AuthService();
