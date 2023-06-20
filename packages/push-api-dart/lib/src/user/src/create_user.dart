import 'dart:convert';

import '../../../push_api_dart.dart';

Future<User?> createUser({
  required EthWallet wallet,
  String version = Constants.ENC_TYPE_V3,
  Map<ENCRYPTION_TYPE, Map<String, dynamic>>? additionalMeta,
}) async {
  const passPrefix = r'$0Pc';
  additionalMeta ??= {
    ENCRYPTION_TYPE.NFTPGP_V1: {
      'password': passPrefix + generateRandomSecret(10),
    },
  };
  final String address = wallet.address;

  if (!isValidETHAddress(address)) {
    throw Exception('Invalid address!');
  }

  final caip10 = walletToPCAIP10(address);
  var encryptionType = version;

  final keyPairs = await generateKeyPair();

  final publicKey = await preparePGPPublicKey(
    encryptionType: encryptionType,
    generatedPublicKey: keyPairs.publicKey,
    wallet: wallet,
  );

  EncryptedPrivateKeyModel encryptedPrivateKey = await encryptPGPKey(
    encryptionType: encryptionType,
    generatedPrivateKey: keyPairs.privateKey,
    wallet: wallet,
  );

  final data = {
    "caip10": caip10,
    "did": caip10,
    "publicKey": publicKey,
    "encryptedPrivateKey": jsonEncode(encryptedPrivateKey.toJson()),
    "signature": "xyz",
    "sigType": "a"
  };

  final result = await http.post(path: '/v2/users', data: data);

  if (result == null) {
    return null;
  } else {
    return User.fromJson(result);
  }
}

class UserRepo {}
