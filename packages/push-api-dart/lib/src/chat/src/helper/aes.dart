import 'dart:math';

String generateRandomSecret(int length) {
  final random = Random.secure();
  final characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  final charactersLength = characters.length;
  String result = '';
  for (var i = 0; i < length; i++) {
    result += characters[random.nextInt(charactersLength)];
  }
  return result;
}
