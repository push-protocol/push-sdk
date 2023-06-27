import 'package:openpgp/openpgp.dart';

Future<KeyPair> generateKeyPair() async {
  final keys = await OpenPGP.generate();
  return keys;
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

  // TODO: Figure out the armor part
  // for (var i = 0; i < keys.length; i++) {
  //   final armoredKey = keys[i];
  //   final pgpKey = await OpenPGP.armorEncode(armoredKey);
  //   pgpKeys.add(pgpKey);
  // }

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
