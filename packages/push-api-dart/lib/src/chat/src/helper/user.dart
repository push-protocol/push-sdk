import 'package:push_api_dart/push_api_dart.dart';

Future<ConnectedUser?> getConnectedUserV2({
  required Wallet wallet,
  String? privateKey,
}) async {
  final user = await getUser(address: getAccountAddress(wallet));

  if (user == null) {
    return null;
  }

  if (privateKey != null) {
    return ConnectedUser(user: user, privateKey: privateKey);
  } else {
    final decryptedPrivateKey = await getDecryptedPrivateKey(
      address: wallet.address!,
      wallet: wallet,
      user: user,
    );

    return ConnectedUser(user: user, privateKey: decryptedPrivateKey);
  }
}
