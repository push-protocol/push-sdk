import 'package:openpgp/openpgp.dart';

Future<KeyPair> generateKeyPair() async {
  final keys = await OpenPGP.generate();
  return keys;
}

Future<String> sign(
    {required String message, required String signingKey}) async {
  //TODO implement sign


  // final messageObject = await OpenPGP.createMessage(text: message);
  // final privateKey = await OpenPGP.readPrivateKey(armoredKey: signingKey);
  // final signedMessage = await OpenPGP.sign(
  //   message: messageObject,
  //   signingKeys: [privateKey],
  //   detached: true,
  // );
  return message;
}
