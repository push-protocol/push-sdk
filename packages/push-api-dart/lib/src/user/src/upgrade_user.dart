import '../../../push_api_dart.dart';

Future<User?> upgrade({
  EthWallet? wallet,
  additionalMeta,
}) async {
  try {
    wallet ??= getCachedWallet();
    final address = wallet?.address ?? getCachedUser()?.did;

    if (address == null || !isValidETHAddress(address)) {
      throw Exception('Invalid address!');
    }

    var user = getCachedUser() ?? await getUser(address: address);
    if (user == null) {
      throw Exception('User Not Found!');
    }

    final recommendedPgpEncryptionVersion = ENCRYPTION_TYPE.PGP_V3;
    final version = user.parsedPrivateKey.version;

    if (version == recommendedPgpEncryptionVersion ||
        version == ENCRYPTION_TYPE.NFTPGP_V1) {
      return user;
    }

    final pgpPrivateKey = await decryptPGPKey(
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: wallet,
      toUpgrade: false,
      additionalMeta: additionalMeta,
    );

    final upgradedUser = await authUpdate(
      pgpPrivateKey: pgpPrivateKey, // decrypted pgp priv key
      pgpEncryptionVersion: recommendedPgpEncryptionVersion,
      wallet: wallet,
      pgpPublicKey: user.publicKey,
      account: user.did!,
      additionalMeta: additionalMeta,
    );

    return upgradedUser;
  } catch (err) {
    log('[Push SDK] - API - Error - API upgrade -: $err');
    rethrow;
  }
}
