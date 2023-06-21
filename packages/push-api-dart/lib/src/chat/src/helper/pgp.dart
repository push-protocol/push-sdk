import 'package:openpgp/openpgp.dart';

Future<KeyPair> generateKeyPair() async {
  final keys = await OpenPGP.generate();
  return keys;
}
