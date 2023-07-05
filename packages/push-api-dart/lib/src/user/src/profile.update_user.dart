import '../../../push_api_dart.dart';

class Profile {
  String? name;
  String? desc;
  String? picture;

  Profile({
    this.name,
    this.desc,
    this.picture,
  });
}

Future<User?> profileUpdate({
  required String pgpPrivateKey,
  required String account,
  required Profile profile,
}) async {
  try {
    if (!isValidETHAddress(account)) {
      throw Exception('Invalid account!');
    }

    final user = await getUser(address: account);
    if (user == null || user.did == null) {
      throw Exception('User not Found!');
    }

    final updatedProfile = {
      'name': profile.name ?? user.profile?.name,
      'desc': profile.desc ?? user.profile?.desc,
      'picture': profile.picture ?? user.profile?.picture,
    };

    final hash = generateHash(updatedProfile);

    //TODO add sign function parameter values
    final signature = await sign(
      message: hash,
      privateKey: pgpPrivateKey,
      publicKey: pgpPrivateKey,
    );

    final sigType = 'pgp';
    final verificationProof = '$sigType:$signature';

    final body = {
      ...updatedProfile,
      'verificationProof': verificationProof,
    };

    final result = await http.put(
      path: '/v2/users/${user.did}/profile',
      data: body,
    );

    if (result == null) {
      return null;
    }

    var updatedUser = User.fromJson(result);
    updatedUser.publicKey = verifyPGPPublicKey(
      encryptedPrivateKey: updatedUser.encryptedPrivateKey!,
      publicKey: updatedUser.publicKey!,
      did: updatedUser.did!,
    );

    return populateDeprecatedUser(user: updatedUser);
  } catch (err) {
    log('[Push SDK] - API - Error - API profileUpdate -: $err');
    rethrow;
  }
}
