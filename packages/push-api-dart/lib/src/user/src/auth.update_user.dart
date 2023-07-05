import '../../../push_api_dart.dart';

Future<User?> authUpdate({
  required String pgpPrivateKey,
  required String pgpEncryptionVersion,
  Wallet? wallet,
  required String pgpPublicKey,
  required String account,
  additionalMeta,
}) async {
  try {
    wallet ??= getCachedWallet();
    final address = wallet?.address;

    if (wallet == null || address == null || !isValidETHAddress(address)) {
      throw Exception('Invalid address!');
    }

    final caip10 = walletToPCAIP10(address);
    final user = await getUser(address: caip10);

    if (user == null) {
      throw Exception('User not Found!');
    }

    final signedPublicKey = await preparePGPPublicKey(
        encryptionType: pgpEncryptionVersion,
        generatedPublicKey: pgpPublicKey,
        wallet: wallet);

    final EncryptedPrivateKeyModel encryptedPgpPrivateKey = await encryptPGPKey(
        encryptionType: pgpEncryptionVersion,
        generatedPrivateKey: pgpPrivateKey,
        wallet: wallet,
        additionalMeta: additionalMeta);

    if (pgpEncryptionVersion == ENCRYPTION_TYPE.NFTPGP_V1) {
      final encryptedPassword = await encryptPGPKey(
        encryptionType: ENCRYPTION_TYPE.PGP_V3,
        additionalMeta: additionalMeta,
        wallet: wallet,
        generatedPrivateKey: additionalMeta,
      );

      encryptedPgpPrivateKey.encryptedPassword = encryptedPassword;
    }

    final updatedUser = await authUpdateUserService(
      address: user.did!,
      wallet: wallet,
      publicKey: signedPublicKey,
      encryptedPrivateKey: encryptedPgpPrivateKey.toJson(),
    );

    return updatedUser;
  } catch (err) {
    log('[Push SDK] - API - Error - API upgrade -: $err');
    rethrow;
  }
}
