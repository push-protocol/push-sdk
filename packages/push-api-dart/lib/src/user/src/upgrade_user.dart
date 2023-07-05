import '../../../push_api_dart.dart';

Future<User?> upgrade({
  String? account,
  Signer? signer,
  additionalMeta,
  required Function(ProgressHookType) progressHook,
}) async {
  try {
    final wallet = getWallet(address: account, signer: signer);
    final address = getAccountAddress(wallet);

    if (!isValidETHAddress(address)) {
      throw Exception('Invalid address!');
    }

    var user = await getUser(address: address);
    if (user == null) {
      throw Exception('User Not Found!');
    }

    final recommendedPgpEncryptionVersion = ENCRYPTION_TYPE.PGP_V3;
    final version = user.parsedPrivateKey!.version;

    if (version == recommendedPgpEncryptionVersion ||
        version == ENCRYPTION_TYPE.NFTPGP_V1) {
      return user;
    }

    final pgpPrivateKey = await decryptPGPKey(
      encryptedPGPPrivateKey: user.encryptedPrivateKey!,
      wallet: wallet,
      toUpgrade: false,
      additionalMeta: additionalMeta,
    );

    final upgradedUser = await authUpdate(
      pgpPrivateKey: pgpPrivateKey, // decrypted pgp priv key
      pgpEncryptionVersion: recommendedPgpEncryptionVersion,
      wallet: wallet,
      pgpPublicKey: user.publicKey!,
      account: user.did!,
      additionalMeta: additionalMeta,
    );

    return upgradedUser;
  } catch (err) {
    log('[Push SDK] - API - Error - API upgrade -: $err');
    rethrow;
  }
}
