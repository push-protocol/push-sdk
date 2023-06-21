import 'dart:math' as math;

String generateRandomSecret(int length) {
  final random = math.Random.secure();
  final characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  final charactersLength = characters.length;
  final buffer = StringBuffer();
  for (var i = 0; i < length; i++) {
    buffer.write(characters[random.nextInt(charactersLength)]);
  }
  return buffer.toString();
}

aesDecrypt({required String cipherText, required String secretKey}) async {
  //TODO implement aesDecrypt
}
