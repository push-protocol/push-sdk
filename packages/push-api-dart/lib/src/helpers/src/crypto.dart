// ignore_for_file: constant_identifier_names

import 'dart:math';
import 'dart:typed_data';
import 'dart:convert';

import 'package:crypto/crypto.dart' as crypto;
import 'package:cryptography/cryptography.dart';

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
  required Wallet wallet,
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

// Future<Map<String, dynamic>> getEip191Signature(
//   EthWallet? wallet,
//   String message, {
//   String version = 'v1',
// }) async {
//   if (wallet == null || wallet.privateKey == null) {
//     print('This method is deprecated. Provide signer in the function');
//     // Sending a random signature for backward compatibility
//     return {'signature': 'xyz', 'sigType': 'a'};
//   }

//   web3.Credentials credentials = web3.EthPrivateKey.fromHex(wallet.privateKey!);
//   List<int> codeUnits = utf8.encode(message);

//   // EIP191 signature
//   final signed = await credentials.sign(Uint8List.fromList(codeUnits));

//   final sigType = version == 'v1' ? 'eip191' : 'eip191v2';
//   return {'verificationProof': '$sigType:0x${bytesToHex(signed)}'};
// }

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

Future<EncryptedPrivateKeyModel> encryptPGPKey({
  String encryptionType = Constants.ENC_TYPE_V3,
  required String generatedPrivateKey,
  required Wallet wallet,
  dynamic additionalMeta,
}) async {
  if (wallet.signer == null) {
    throw Exception('Provide signer in the function');
  }

  EncryptedPrivateKeyModel encryptedPrivateKey;

  switch (encryptionType) {
    // case Constants.ENC_TYPE_V1:
    //   String walletPublicKey = wallet.publicKey!;

    //   encryptedPrivateKey =
    //       encryptV1(generatedPrivateKey, walletPublicKey, encryptionType);
    //   break;
    case Constants.ENC_TYPE_V3:
      Uint8List input = await getRandomValues(Uint8List(32));

      final decodedInput = bytesToHex(input);

      String enableProfileMessage = 'Enable Push Profile \n$decodedInput';

      final signature = await getEip191Signature(wallet, enableProfileMessage);
      dynamic secret = signature['verificationProof'];

      List<int> encodedPrivateKey = utf8.encode(generatedPrivateKey);

      encryptedPrivateKey = await encryptV2(
        data: encodedPrivateKey,
        secret: utf8.encode(secret),
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
        data: encodedPrivateKey,
        secret: hexToBytes(stringToHex(additionalMeta.NFTPGP_V1.password)),
      );
      encryptedPrivateKey.version = Constants.ENC_TYPE_V4;
      encryptedPrivateKey.preKey = '';
      break;
    default:
      throw Exception('Invalid Encryption Type');
  }
  return encryptedPrivateKey;
}

const KDFSaltSize = 32;
const AESGCMNonceSize = 12;

// Derive AES-256-GCM key from a shared secret and salt
Future<SecretKey> hkdf(List<int> secret, List<int> salt) async {
  final hkdfAlgorithm = Hkdf(
    hmac: Hmac.sha256(),
    outputLength: 32,
  );

  final derivedKey = await hkdfAlgorithm.deriveKey(
    secretKey: SecretKey(secret),
    nonce: salt,
    info: Uint8List(0), // Empty array buffer for info
  );

  return derivedKey;
}

/// AES-GCM Encryption
Future<EncryptedPrivateKeyModel> encryptV2(
    {required List<int> data, required List<int> secret}) async {
  final random = Random.secure();

  final salt = Uint8List(KDFSaltSize);
  for (var i = 0; i < salt.length; i++) {
    salt[i] = random.nextInt(256);
  }

  final algorithm = AesGcm.with256bits(nonceLength: AESGCMNonceSize);
  final nonce = algorithm.newNonce();

  final key = await hkdf(secret, salt);

  // Encrypt
  final secretBox = await algorithm.encrypt(
    data,
    secretKey: key,
    nonce: nonce,
  );

  return EncryptedPrivateKeyModel(
      ciphertext: bytesToHex(secretBox.cipherText),
      salt: bytesToHex(salt),
      nonce: bytesToHex(nonce));
}

/// AES-GCM Decryption
Future<List<int>> decryptV2({
  required EncryptedPrivateKeyModel encryptedData,
  required List<int> secret,
}) async {
  final key = await hkdf(secret, hexToBytes(encryptedData.salt!));

  final algorithm = AesGcm.with256bits(nonceLength: AESGCMNonceSize);

  // Construct the secret box
  final secretBox = SecretBox(hexToBytes(encryptedData.ciphertext!),
      nonce: hexToBytes(encryptedData.nonce!), mac: Mac.empty);

  // Decrypt
  final decryptedText = await algorithm.decrypt(
    secretBox,
    secretKey: key,
  );

  return decryptedText;
}

EncryptedPrivateKeyModel encryptV1(
  String text,
  String encryptionPublicKey,
  String version,
) {
  String signature = '';

  // final result =
  //     SimplePublicKey(hexToBytes(stringToHex(text)), type: KeyPairType.x25519);

  return EncryptedPrivateKeyModel(
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

Future<String> decryptAndVerifySignature({
  required String cipherText,
  required String encryptedSecretKey,
  required String publicKeyArmored,
  required String signatureArmored,
  required String privateKeyArmored,
  required IMessageIPFS message,
}) async {
  //TODO implement  decryptAndVerifySignature

  try {
    aesDecrypt(cipherText: cipherText, secretKey: privateKeyArmored);
    return cipherText;
  } catch (err) {
    return 'Unable to decrypt message';
  }
}

Future<String> decryptPGPKey({
  required String encryptedPGPPrivateKey,
  required Wallet wallet,
  bool? toUpgrade = false,
  dynamic additionalMeta,
  Function? progressHook,
}) async {
  try {
    if (wallet.signer == null && wallet.address == null) {
      throw Exception('At least one from account or signer is necessary!');
    }

    final encryptionType = jsonDecode(encryptedPGPPrivateKey)['version'];
    String? privateKey;

    // Report Progress
    progressHook?.call(PROGRESSHOOK['PUSH-DECRYPT-01']);

    switch (encryptionType) {
      // case Constants.ENC_TYPE_V1:
      //   {}
      case Constants.ENC_TYPE_V2:
        {
          final input = jsonDecode(encryptedPGPPrivateKey)['preKey'];
          final enableProfileMessage = 'Enable Push Chat Profile \n$input';
          List<int> encodedPrivateKey;
          try {
            final secret = (await getEip712Signature(
              wallet,
              enableProfileMessage,
              true,
            ))['verificationProof'];
            encodedPrivateKey = await decryptV2(
              encryptedData: jsonDecode(encryptedPGPPrivateKey),
              secret: hexToBytes(secret ?? ''),
            );
          } catch (err) {
            final secret = (await getEip712Signature(
              wallet,
              enableProfileMessage,
              false,
            ))['verificationProof'];
            encodedPrivateKey = await decryptV2(
              encryptedData: jsonDecode(encryptedPGPPrivateKey),
              secret: hexToBytes(secret ?? ''),
            );
          }
          final dec = utf8.decoder;
          privateKey = dec.convert(encodedPrivateKey);
          break;
        }
      case Constants.ENC_TYPE_V3:
        {
          final input = jsonDecode(encryptedPGPPrivateKey)['preKey'];


          final enableProfileMessage = 'Enable Push Profile \n$input';
          final signed = await getEip191Signature(
            wallet,
            enableProfileMessage,
          );
          final secret = signed['verificationProof'];
          final secretBytes = hexToBytes(secret ?? '');
          // final secretBytes = utf8.encode(secret); //  hexToBytes(secret ?? '');


          final encodedPrivateKey = await decryptV2(
            encryptedData: EncryptedPrivateKeyModel.fromJson(
                jsonDecode(encryptedPGPPrivateKey)),
            secret: secretBytes,
          );
          final dec = utf8.decoder;
          privateKey = dec.convert(encodedPrivateKey);
          break;
        }
      case Constants.ENC_TYPE_V4:
        {
          String? password;
          if (additionalMeta?.containsKey('NFTPGP_V1') == true) {
            password = additionalMeta['NFTPGP_V1']['password'];
          } else {
            final encryptedPassword =
                jsonDecode(encryptedPGPPrivateKey)['encryptedPassword'];
            password = await decryptPGPKey(
              encryptedPGPPrivateKey: jsonEncode(encryptedPassword),
              wallet: wallet,
            );
          }
          final encodedPrivateKey = await decryptV2(
            encryptedData: jsonDecode(encryptedPGPPrivateKey),
            secret: hexToBytes(stringToHex(password ?? '')),
          );
          final dec = utf8.decoder;
          privateKey = dec.convert(encodedPrivateKey);
          break;
        }
      default:
        throw Exception('Invalid Encryption Type');
    }

    // TODO: Add key upgradation logic (not urgent)

    // Report Progress
    progressHook?.call(PROGRESSHOOK['PUSH-DECRYPT-02'] as ProgressHookType);
    return privateKey;
  } catch (err) {
    // Report Progress
    // final errorProgressHook =
    //     PROGRESSHOOK['PUSH-ERROR-00'] as ProgressHookTypeFunction;
    // progressHook?.call(errorProgressHook(['decryptPGPKey', err]));
    throw Exception('[Push SDK] - API - Error - API decryptPGPKey -: $err');
  }
}

verifyPGPPublicKey({
  required String encryptedPrivateKey,
  required String publicKey,
  required String did,
}) async {}
