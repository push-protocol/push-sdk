import 'package:openpgp/openpgp.dart';

Future<KeyPair> generateKeyPair() async {
  final keyOptions = KeyOptions()
    ..algorithm = Algorithm.RSA
    ..rsaBits = 2048;

  final keyPair = await OpenPGP.generate(
      options: Options()
        ..name = ''
        ..email = ''
        ..keyOptions = keyOptions);
  return keyPair;
}

Future<String> sign(
    {required String message,
    required String publicKey,
    required String privateKey}) async {
  return await OpenPGP.sign(message, publicKey, privateKey, "");
}

Future<String> pgpEncrypt({
  required String plainText,
  required List<String> keys,
}) async {
  final combinedPGPKey = keys.join();

  final encrypted = await OpenPGP.encrypt(
    plainText,
    combinedPGPKey,
  );

  return encrypted;
}

pgpDecrypt({
  required String cipherText,
  required String privateKeyArmored,
  required String signatureArmored,
}) async {
//TODO implement pgpDecrypt
}
