import 'dart:math';
import 'dart:typed_data';

import 'package:crypto/crypto.dart' as crypto;
import 'package:cryptography/cryptography.dart';
import 'package:ethers/signers/wallet.dart' as ethers;
import 'package:ethers/signers/wallet.dart';
import 'package:pointycastle/export.dart';

import 'dart:convert';
import 'package:pointycastle/random/fortuna_random.dart' as pcrandom;
import '../../../push_api_dart.dart';

String generateHash(dynamic message) {
  final jsonMessage = jsonEncode(message);
  final bytes = utf8.encode(jsonMessage);
  final hash = crypto.sha256.convert(bytes);
  return hash.toString();
}

Future<String> preparePGPPublicKey(
  String encryptionType,
  String publicKey,
  ethers.Wallet? wallet,
) async {
  String chatPublicKey;
  switch (encryptionType) {
    case Constants.ENC_TYPE_V1:
      {
        chatPublicKey = publicKey;
        break;
      }
    case Constants.ENC_TYPE_V3:
      {
        final createProfileMessage =
            'Create Push Profile \n${generateHash(publicKey)}';
        final signature =
            await getEip191Signature(wallet, createProfileMessage);
        chatPublicKey = jsonEncode({
          'key': publicKey,
          'signature': signature['verificationProof'],
        });
        break;
      }
    case Constants.ENC_TYPE_V4:
      {
        final createProfileMessage =
            'Create Push Profile \n${generateHash(publicKey)}';
        final signature =
            await getEip191Signature(wallet, createProfileMessage);
        chatPublicKey = jsonEncode({
          'key': publicKey,
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
    ethers.Wallet? wallet, String message,
    {String version = 'v1'}) async {
  if (wallet == null || wallet.signingKey == null) {
    print('This method is deprecated. Provide signer in the function');
    // Sending a random signature for backward compatibility
  }
  return {'signature': 'xyz', 'sigType': 'a'};

  // final signer = wallet.signingKey;
  // // EIP191 signature
  // final signature = await signer.signPersonalMessage(hexToBytes(message));
  // final sigType = version == 'v1' ? 'eip191' : 'eip191v2';
  // return {'verificationProof': '$sigType:${bytesToHex(signature)}'};
}

String bytesToHex(List<int> bytes) {
  final hexPairs = bytes.map((byte) => byte.toRadixString(16).padLeft(2, '0'));
  return hexPairs.join('');
}

Future<List<int>> getRandomValues(pcrandom.FortunaRandom random, int length) {
  final values = Uint8List(length).toList();
  return Future.value(values);
}

String stringToHex(String input) {
  final bytes = input.codeUnits;
  final hexPairs = bytes.map((byte) => byte.toRadixString(16).padLeft(2, '0'));
  return hexPairs.join('');
}

Future<EncryptedPrivateKeyType> encryptPGPKey(
  String encryptionType,
  String privateKey,
  Wallet wallet, {
  dynamic additionalMeta,
}) async {
  EncryptedPrivateKeyType encryptedPrivateKey;
  switch (encryptionType) {
    case Constants.ENC_TYPE_V1:
      String walletPublicKey = wallet.publicKey ?? '';

      encryptedPrivateKey =
          encryptV1(privateKey, walletPublicKey, encryptionType);
      break;
    case Constants.ENC_TYPE_V3:
      List<int> input = await getRandomValues(FortunaRandom(), 32);
      String enableProfileMessage =
          'Enable Push Profile \n${bytesToHex(input)}';
      dynamic secret = (await getEip191Signature(
          wallet, enableProfileMessage))['verificationProof'];
      List<int> encodedPrivateKey = Utf8Codec().encode(privateKey);
      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey,
        hexToBytes(secret ?? ''),
      );
      encryptedPrivateKey.version = Constants.ENC_TYPE_V3;
      encryptedPrivateKey.preKey = bytesToHex(input);
      break;
    case Constants.ENC_TYPE_V4:
      if (additionalMeta?.NFTPGP_V1?.password == null) {
        throw Exception('Password is required!');
      }
      List<int> encodedPrivateKey = utf8.encode(privateKey);
      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey,
        hexToBytes(stringToHex(additionalMeta.NFTPGP_V1.password)),
      );
      encryptedPrivateKey.version = Constants.ENC_TYPE_V4;
      encryptedPrivateKey.preKey = '';
      break;
    default:
      throw Exception('Invalid Encryption Type');
  }
  return encryptedPrivateKey;
}

Future<EncryptedPrivateKeyType> encryptV2(
  List<int> encodedPrivateKey,
  List<int> data,
) async {
  var hkdfSalt = generateRandomBytes(32);
  var nonce = generateRandomBytes(12);
  final hkdf = Hkdf(
    hmac: Hmac(Sha256()),
    outputLength: 32,
  );
  final key = await hkdf.deriveKey(
    secretKey: SecretKey(encodedPrivateKey),
    nonce: hkdfSalt,
  );

  final List<int> aad = const <int>[];

  var payload = await _aesGcm256.encrypt(
    data,
    secretKey: key,
    aad: aad,
    nonce: nonce,
  );
  return EncryptedPrivateKeyType(
    ciphertext: '',
    nonce: bytesToHex(nonce),
  );
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

final _aesGcm256 = AesGcm.with256bits(nonceLength: 12);

final ECDomainParameters _params = ECCurve_secp256k1();
Future encrypt(
  List<int> secret,
  List<int> message, {
  List<int> aad = const <int>[],
}) async {
  var hkdfSalt = generateRandomBytes(32);
  var gcmNonce = generateRandomBytes(12);
  final hkdf = Hkdf(
    hmac: Hmac(Sha256()),
    outputLength: 32,
  );
  final key = await hkdf.deriveKey(
    secretKey: SecretKey(secret),
    nonce: hkdfSalt,
  );
  var payload = await _aesGcm256.encrypt(
    message,
    secretKey: key,
    aad: aad,
    nonce: gcmNonce,
  );

  final pay = payload.concatenation();
  log(bytesToHex(pay));
  // return xmtp.Ciphertext(
  //     aes256GcmHkdfSha256: xmtp.Ciphertext_Aes256gcmHkdfsha256(
  //   hkdfSalt: hkdfSalt,
  //   gcmNonce: gcmNonce,
  //   payload: payload.concatenation(nonce: false),
  // ));
}

final _rand = Random.secure();

/// This produces a list of `count` random bytes.
List<int> generateRandomBytes(int count) {
  return List.generate(count, (_) => _rand.nextInt(256));
}

Future<EncryptedPrivateKeyType> encryptPGPKeyV2(
  String encryptionType,
  String privateKey,
  Wallet wallet,
  Map<String, dynamic>? additionalMeta,
) async {
  EncryptedPrivateKeyType encryptedPrivateKey;

  switch (encryptionType) {
    case Constants.ENC_TYPE_V1:
      String walletPublicKey;
      if (wallet.signer.privateKey != null) {
        walletPublicKey =
            getEncryptionPublicKey(wallet.signer.privateKey.substring(2));
      } else {
        walletPublicKey = await getPublicKey(wallet);
      }
      encryptedPrivateKey =
          encryptV1(privateKey, walletPublicKey, encryptionType);
      break;
    case Constants.ENC_TYPE_V3:
      final input = bytesToHex(await getRandomValues(FortunaRandom(), 32));
      final enableProfileMessage = 'Enable Push Profile \n$input';
      final verificationProof =
          await getEip191Signature(wallet, enableProfileMessage);
      final secret = verificationProof['secret'];
      final encodedPrivateKey = utf8.encode(privateKey);
      encryptedPrivateKey =
          await encryptV2(encodedPrivateKey, hexToBytes(secret ?? ''));
      encryptedPrivateKey.version = Constants.ENC_TYPE_V3;
      encryptedPrivateKey.preKey = input;
      break;
    case Constants.ENC_TYPE_V4:
      if (additionalMeta == null ||
          additionalMeta['NFTPGP_V1']['password'] == null) {
        throw Exception('Password is required!');
      }
      final encodedPrivateKey = utf8.encode(privateKey);
      encryptedPrivateKey = await encryptV2(encodedPrivateKey,
          hexToBytes(stringToHex(additionalMeta['NFTPGP_V1']['password'])));
      encryptedPrivateKey.version = Constants.ENC_TYPE_V4;
      encryptedPrivateKey.preKey = '';
      break;
    default:
      throw Exception('Invalid Encryption Type');
  }

  return encryptedPrivateKey;
}
