import '../../../push_api_dart.dart';

Future<User?> authUpdateUserService({
  required String address,
  wallet,
  required String publicKey,
  required String encryptedPrivateKey,
}) async {
  final data = {
    'caip10': walletToPCAIP10(address),
    'did': walletToPCAIP10(address),
    'publicKey': publicKey,
    'encryptedPrivateKey': encryptedPrivateKey,
  };

  final hash = generateHash(data);
  final signatureObj = await getEip191Signature(wallet!, hash, version: 'v2');

  signatureObj.remove('did');

  final body = {...data, ...signatureObj};

  final result = await http.put(
    path: '/v2/users/${walletToPCAIP10(address)}/auth',
    data: body,
  );

  if (result == null) {
    return null;
  }

  final user = User.fromJson(result);
  return populateDeprecatedUser(user: user);
}
