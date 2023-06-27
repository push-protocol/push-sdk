import 'dart:convert';
import 'dart:math' as math;
import 'package:cryptography/cryptography.dart';

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

// AES 256 bits encryption with pkcs7 padding
Future<String> aesEncrypt(
    {required String plainText, required String secretKey}) async {
  // specifing the AES mode and key bit length
  final algorithm = AesCbc.with256bits(
    macAlgorithm: MacAlgorithm.empty,
  );

  // encrypt
  final secretBox = await algorithm.encryptString(
    plainText,
    secretKey: await algorithm.newSecretKeyFromBytes(utf8.encode(secretKey)),
  );

  // return the cipher text in string form
  return utf8.decode(secretBox.cipherText);
}

aesDecrypt({required String cipherText, required String secretKey}) async {
  // TODO implement aesDecrypt
}
