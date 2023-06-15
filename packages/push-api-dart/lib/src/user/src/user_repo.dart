import 'dart:convert';
import 'package:ethers/signers/wallet.dart';
import '../../../push_api_dart.dart';

class UserRepo {
  static Future<User?> getUser({
    required String address,
  }) async {
    if (!isValidETHAddress(address)) {
      throw Exception('Invalid address!');
    }

    final caip10 = walletToPCAIP10(address);
    final requestUrl = '/v2/users/?caip10=$caip10';
    final result = await http.get(path: requestUrl);
    if (result == null || result.isEmpty) {
      return null;
    }

    return User.fromJson(result);
  }

  static Future<User?> createUser({
    required Wallet wallet,
    String version = Constants.ENC_TYPE_V1,
    Map<ENCRYPTION_TYPE, Map<String, dynamic>>? additionalMeta,
  }) async {
    const passPrefix = r'$0Pc';
    additionalMeta ??= {
      ENCRYPTION_TYPE.NFTPGP_V1: {
        'password': passPrefix + generateRandomSecret(10),
      },
    };
    final String address = await wallet.getAddress();

    if (!isValidETHAddress(address)) {
      throw Exception('Invalid address!');
    }

    final caip10 = walletToPCAIP10(address);
    var encryptionType = version;

    final keyPairs = await generateKeyPair();

    final publicKey = await preparePGPPublicKey(
      encryptionType,
      keyPairs.publicKey,
      wallet,
    );
    log('public key preparePGPPublicKey: $publicKey');

    late EncryptedPrivateKeyType encryptedPrivateKey;
    if (encryptionType == Constants.ENC_TYPE_V4) {
      encryptedPrivateKey = await encryptPGPKey(
        encryptionType,
        keyPairs.privateKey,
        wallet,
      );
    } else {
      encryptedPrivateKey = await encryptPGPKey(
        encryptionType,
        keyPairs.privateKey,
        wallet,
      );
    }

    final data = {
      "caip10": caip10,
      "did": caip10,
      "publicKey": publicKey,
      "encryptedPrivateKey": jsonEncode(encryptedPrivateKey.toJson()),
      "signature": "xyz",
      "sigType": "a"
    };

    log('create user data:');
    log(data);

    final result = await http.post(path: '/apis/v2/users/', data: data);

    log('create user result');
    log(result);

    return null;
  }
}
