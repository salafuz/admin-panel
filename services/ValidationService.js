export class ValidationService {
  static validateCredentials(credentials) {
    const errors = {};

    if (!credentials.username?.trim()) {
      errors.username = "Username is required";
    }

    if (!credentials.password?.trim()) {
      errors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default ValidationService;
