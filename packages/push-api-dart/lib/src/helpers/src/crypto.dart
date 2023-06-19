// ignore_for_file: constant_identifier_names

import 'dart:math';
import 'dart:typed_data';
import 'dart:convert';

import 'package:web3lib/web3lib.dart' as web3;
import 'package:crypto/crypto.dart' as crypto;
import 'package:cryptography/cryptography.dart';
import 'package:ethers/signers/wallet.dart' as ethers;
import 'package:ethers/signers/wallet.dart';

import '../../../push_api_dart.dart';

String generateHash(dynamic message) {
  final jsonMessage = jsonEncode(message);
  final bytes = utf8.encode(jsonMessage);
  final hash = crypto.sha256.convert(bytes);
  return hash.toString();
}

Future<String> preparePGPPublicKey({
  String encryptionType = Constants.ENC_TYPE_V3,
  required String generatedPublicKey,
  required ethers.Wallet wallet,
}) async {
  String chatPublicKey;

  switch (encryptionType) {
    case Constants.ENC_TYPE_V1:
      {
        chatPublicKey = generatedPublicKey;
        break;
      }
    case Constants.ENC_TYPE_V3:
      {
        final createProfileMessage =
            'Create Push Profile \n${generateHash(generatedPublicKey)}';
        final signature =
            await getEip191Signature(wallet, createProfileMessage);

        chatPublicKey = jsonEncode({
          'key': generatedPublicKey,
          'signature': signature['verificationProof'],
        });
        break;
      }
    case Constants.ENC_TYPE_V4:
      {
        final createProfileMessage =
            'Create Push Profile \n${generateHash(generatedPublicKey)}';
        final signature =
            await getEip191Signature(wallet, createProfileMessage);

        chatPublicKey = jsonEncode({
          'key': generatedPublicKey,
          'signature': signature['verificationProof'],
        });
        break;
      }
    default:
      throw Exception('Invalid Encryption Type');
  }

  return chatPublicKey;
}

Future<Map<String, dynamic>> getEip191Signature(
  ethers.Wallet? wallet,
  String message, {
  String version = 'v1',
}) async {
  if (wallet == null || wallet.signingKey == null) {
    print('This method is deprecated. Provide signer in the function');
    // Sending a random signature for backward compatibility
    return {'signature': 'xyz', 'sigType': 'a'};
  }

  web3.Credentials credentials =
      web3.EthPrivateKey.fromHex('${wallet.privateKey}');
  List<int> codeUnits = utf8.encode(message);

  // EIP191 signature
  final signed = await credentials.sign(Uint8List.fromList(codeUnits));

  final sigType = version == 'v1' ? 'eip191' : 'eip191v2';
  return {'verificationProof': '$sigType:0x${bytesToHex(signed)}'};
}

String bytesToHex(List<int> bytes) {
  final hexPairs = bytes.map((byte) => byte.toRadixString(16).padLeft(2, '0'));
  return hexPairs.join('');
}

Future<Uint8List> getRandomValues(Uint8List array) async {
  var random = Random.secure();
  var values = Uint8List(array.length);
  for (var i = 0; i < array.length; i++) {
    values[i] = random.nextInt(256);
  }
  return values;
}

String stringToHex(String input) {
  final bytes = input.codeUnits;
  final hexPairs = bytes.map((byte) => byte.toRadixString(16).padLeft(2, '0'));
  return hexPairs.join('');
}

Future<EncryptedPrivateKeyType> encryptPGPKey({
  String encryptionType = Constants.ENC_TYPE_V3,
  required String generatedPrivateKey,
  required Wallet wallet,
  dynamic additionalMeta,
}) async {
  EncryptedPrivateKeyType encryptedPrivateKey;

  switch (encryptionType) {
    case Constants.ENC_TYPE_V1:
      String walletPublicKey = wallet.publicKey ?? '';

      encryptedPrivateKey =
          encryptV1(generatedPrivateKey, walletPublicKey, encryptionType);
      break;
    case Constants.ENC_TYPE_V3:
      Uint8List input = await getRandomValues(Uint8List(32));

      final decodedInput = bytesToHex(input);

      String enableProfileMessage = 'Enable Push Profile \n$decodedInput';

      final signature = await getEip191Signature(wallet, enableProfileMessage);
      dynamic secret = signature['verificationProof'];

      List<int> encodedPrivateKey = utf8.encode(generatedPrivateKey);

      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey: encodedPrivateKey,
        data: utf8.encode(secret),
      );

      encryptedPrivateKey.version = encryptionType;
      encryptedPrivateKey.preKey = bytesToHex(input);

      break;
    case Constants.ENC_TYPE_V4:
      if (additionalMeta?.NFTPGP_V1?.password == null) {
        throw Exception('Password is required!');
      }
      List<int> encodedPrivateKey = utf8.encode(generatedPrivateKey);
      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey: encodedPrivateKey,
        data: hexToBytes(stringToHex(additionalMeta.NFTPGP_V1.password)),
      );
      encryptedPrivateKey.version = Constants.ENC_TYPE_V4;
      encryptedPrivateKey.preKey = '';
      break;
    default:
      throw Exception('Invalid Encryption Type');
  }
  return encryptedPrivateKey;
}

const KDFSaltSize = 32; // bytes
const AESGCMNonceSize = 12; // property iv

Future<EncryptedPrivateKeyType> encryptV2({
  required List<int> encodedPrivateKey,
  required List<int> data,
}) async {
  final algorithm = AesGcm.with128bits(nonceLength: AESGCMNonceSize);
  final secretKey = await algorithm.newSecretKey();
  final nonce = algorithm.newNonce();

  // Encrypt
  final secretBox = await algorithm.encrypt(
    data,
    secretKey: secretKey,
    nonce: nonce,
  );

  return EncryptedPrivateKeyType(
      ciphertext: bytesToHex(secretBox.cipherText),
      nonce: bytesToHex(nonce),
      salt: generateRandomSecret(KDFSaltSize));
}

EncryptedPrivateKeyType encryptV1(
  String text,
  String encryptionPublicKey,
  String version,
) {
  String signature = '';

  final result =
      SimplePublicKey(hexToBytes(stringToHex(text)), type: KeyPairType.x25519);

  print(bytesToHex(result.bytes));
  print(bytesToHex(result.bytes));

  return EncryptedPrivateKeyType(
    version: version,
    ciphertext: signature,
    nonce: '',
  );
}

final _rand = Random.secure();

/// This produces a list of `count` random bytes.
List<int> generateRandomBytes(int count) {
  return List.generate(count, (_) => _rand.nextInt(256));
}
