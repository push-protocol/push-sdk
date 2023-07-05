import '../../../push_api_dart.dart';

Future<String> decryptAuth({
  String? account,
  Signer? signer,
  required additionalMeta,
  Function? progressHook,
}) async {
  if (account == null && signer == null) {
    throw Exception('At least one from account or signer is necessary!');
  }
  final wallet = getWallet(address: account, signer: signer);

  final encryptedPGPPrivateKey =
      additionalMeta['NFTPGP_V1']['encryptedPassword'];
  final password = await decryptPGPKey(
    encryptedPGPPrivateKey: encryptedPGPPrivateKey as String,
    wallet: wallet,
    progressHook: progressHook,
  );

  return password;
}
