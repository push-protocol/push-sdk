import '../../../push_api_dart.dart';

getBatch({
  required List<String> userIds,
}) async {
  final maxUserIdsLength = 100;
  if (userIds.length > maxUserIdsLength) {
    throw Exception('Too many user IDs. Maximum allowed: $maxUserIdsLength');
  }

  for (int i = 0; i < userIds.length; i++) {
    if (!isValidETHAddress(userIds[i])) {
      throw Exception('Invalid user address!');
    }
  }

  final pcaipUserIds = userIds.map(walletToPCAIP10);
  final requestBody = {'userIds': pcaipUserIds};

  final result = await http.post(
    path: '/v2/users/batch',
    data: requestBody,
  );

  if (result == null) {
    return null;
  }

  if (result['users'] is List) {
    final output = [];
    for (var item in result['users']) {
      var user = User.fromJson(item);
      user.publicKey = verifyPGPPublicKey(
        encryptedPrivateKey: user.encryptedPrivateKey!,
        publicKey: user.publicKey!,
        did: user.did!,
      );

      user = await populateDeprecatedUser(user: user);
      output.add(user);
    }

    
  }
}
