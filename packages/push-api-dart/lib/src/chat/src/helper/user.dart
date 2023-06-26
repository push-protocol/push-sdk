import 'package:push_api_dart/push_api_dart.dart';

Future<ConnectedUser?> getConnectedUserV2({required EthWallet wallet}) async {
  final user = await getUser(address: wallet.address);

  if (user == null) {
    return null;
  }

  if (wallet.privateKey != null) {
    return ConnectedUser(user: user, privateKey: wallet.privateKey);
  } else {
    final decryptedPrivateKey = await getDecryptedPrivateKey(
      address: wallet.address,
      wallet: wallet,
      user: user,
    );

    return ConnectedUser(user: user, privateKey: decryptedPrivateKey);
  }
}
