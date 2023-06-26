import 'package:push_api_dart/push_api_dart.dart';

Future<User?> getConnectedUserV2({required EthWallet wallet}) async {
  final user = await getUser(address: wallet.address);

  if (user == null) {
    return null;
  }

  if (wallet.privateKey != null) {
    user.privateKey = wallet.privateKey;
  } else {
    final decryptedPrivateKey = await getDecryptedPrivateKey(
      address: wallet.address,
      wallet: wallet,
      user: user,
    );

    user.privateKey = decryptedPrivateKey;
  }

  return user;
}
