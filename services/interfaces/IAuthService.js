/**
 * Interface for authentication service
 */
export default class IAuthService {
  login(credentials) {
    throw new Error('Method not implemented');
  }

  refreshToken(token) {
    throw new Error('Method not implemented');
  }

  logout() {
    throw new Error('Method not implemented');
  }
}
