class CryptoHelper {
 static void validatePassword(String password) {
    if (password.length < 8) {
      throw Exception('Password must be at least 8 characters long!');
    }
    if (!RegExp(r'[A-Z]').hasMatch(password)) {
      throw Exception('Password must contain at least one uppercase letter!');
    }
    if (!RegExp(r'[a-z]').hasMatch(password)) {
      throw Exception('Password must contain at least one lowercase letter!');
    }
    if (!RegExp(r'\d').hasMatch(password)) {
      throw Exception('Password must contain at least one digit!');
    }
    if (!RegExp('[!@#\$%^&*()_+\\-=[\\]{};\':"\\\\|,.<>/?]')
        .hasMatch(password)) {
      throw Exception('Password must contain at least one special character!');
    }
  }
}
