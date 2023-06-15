import 'package:openpgp/openpgp.dart';

Future<KeyPair> generateKeyPair() async {
  final keys = await OpenPGP.generate();
  return keys;
}
/*
Future<String> pgpEncrypt(String plainText, List<String> keys) async {
  final pgpKeys = <KeyOptions>[];

  for (var i = 0; i < keys.length; i++) {
    pgpKeys.add(await OpenPGP.readKey(armoredKey: keys[i]));
  }

  final message = OpenPGP.createMessage(text: plainText);
  final encrypted = await OpenPGP.encrypt(
    message: message,
    encryptionKeys: pgpKeys,
  );

  return encrypted.toString();
}

Future<String> sign(String message, String signingKey) async {
  final messageObject = OpenPGP.createMessage(text: message);
  final privateKey = await OpenPGP.readPrivateKey(armoredKey: signingKey);
  final signature = await OpenPGP.sign(
    message: messageObject,
    signingKeys: privateKey,
    detached: true,
  );

  return signature.toString();
}

Future<void> verifySignature(String messageContent, String signatureArmored,
    String publicKeyArmored) async {
  final message = OpenPGP.createMessage(text: messageContent);
  final signature =
      await OpenPGP.readSignature(armoredSignature: signatureArmored);
  final publicKey = await OpenPGP.readKey(armoredKey: publicKeyArmored);

  final verificationResult = await OpenPGP.verify(
    message: message,
    signature: signature,
    verificationKeys: publicKey,
  );

  final verified = verificationResult.signatures[0].verified;

  try {
    await verified;
  } catch (e) {
    throw Exception('Signature could not be verified: $e');
  }
}

Future<String> pgpDecrypt(String cipherText, String toPrivateKeyArmored) async {
  final message = await OpenPGP.readMessage(armoredMessage: cipherText);
  final privateKey =
      await OpenPGP.readPrivateKey(armoredKey: toPrivateKeyArmored);

  final decrypted = await OpenPGP.decrypt(
    message: message,
    decryptionKeys: privateKey,
  );

  return decrypted.data.toString();
}
*/