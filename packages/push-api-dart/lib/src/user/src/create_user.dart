import 'dart:convert';

import '../../../push_api_dart.dart';

Future<User?> createUser({
  required Signer signer,
  String version = Constants.ENC_TYPE_V3,
  Map<dynamic, Map<String, dynamic>>? additionalMeta,
  required Function(ProgressHookType) progressHook,
}) async {
  const passPrefix = r'$0Pc';
  additionalMeta ??= {
    ENCRYPTION_TYPE.NFTPGP_V1: {
      'password': passPrefix + generateRandomSecret(10),
    },
  };
  final wallet = getWallet(signer: signer);
  final String address = signer.getAddress();

  if (!isValidETHAddress(address)) {
    throw Exception('Invalid address!');
  }

  final caip10 = walletToPCAIP10(address);
  var encryptionType = version;
  progressHook(PROGRESSHOOK['PUSH-CREATE-01'] as ProgressHookType);

  final keyPairs = await generateKeyPair();
  progressHook(PROGRESSHOOK['PUSH-CREATE-02'] as ProgressHookType);

  final publicKey = await preparePGPPublicKey(
    encryptionType: encryptionType,
    generatedPublicKey: keyPairs.publicKey,
    wallet: wallet,
  );
  progressHook(PROGRESSHOOK['PUSH-CREATE-03'] as ProgressHookType);
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
  } else if (result is String) {
    throw Exception(result);
  } else {
    return User.fromJson(result);
  }
}
