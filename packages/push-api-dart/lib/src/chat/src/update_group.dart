import '../../../push_api_dart.dart';

Future<GroupDTO?> updateGroup({
  EthWallet? wallet,
  required String groupName,
  required String groupDescription,
  required String groupImage,
  required List<String> members,
  required List<String> admins,
  required bool isPublic,
  String? contractAddressNFT,
  int? numberOfNFTs,
  String? contractAddressERC20,
  int? numberOfERC20,
  String? pgpPrivateKey,
  String? meta,
  required String chatId,
}) async {
  try {
    String? userDID;
    wallet ??= getCachedWallet();

    if (wallet == null) {
      //copy cached did
      userDID = getCachedUser()?.did;
    } else {
      userDID = await getUserDID(address: wallet.address);
    }

    if (userDID == null) {
      throw Exception('Account address is required.');
    }

    if (wallet?.privateKey == null) {
      throw Exception('Private Key is required');
    }

    updateGroupRequestValidator(
      chatId,
      groupName,
      groupDescription,
      groupImage,
      members,
      admins,
      userDID,
    );

    final convertedMembersDIDList =
        await Future.wait(members.map((item) => getUserDID(address: item)));
    final convertedAdminsDIDList =
        await Future.wait(admins.map((item) => getUserDID(address: item)));

    final bodyToBeHashed = {
      'groupName': groupName,
      'groupDescription': groupDescription,
      'groupImage': groupImage,
      'members': convertedMembersDIDList,
      'admins': convertedAdminsDIDList,
      'chatId': chatId,
    };

    final hash = generateHash(bodyToBeHashed);

    final signature = await sign(
      message: hash,
      privateKey: wallet!.privateKey!,
      publicKey: wallet.publicKey!,
    );

    final sigType = 'pgp';
    final verificationProof = '$sigType:$signature:$userDID';

    final body = {
      'groupName': groupName,
      'groupImage': groupImage,
      'groupDescription': groupDescription,
      'members': convertedMembersDIDList,
      'admins': convertedAdminsDIDList,
      'address': userDID,
      'verificationProof': verificationProof,
    };

    final result = await http.put(
      path: '/v1/chat/groups/$chatId',
      data: body,
    );

    if (result == null) {
      return null;
    }

    return GroupDTO.fromJson(result);
  } catch (e) {
    log("[Push SDK] - API  - Error - API updateGroup -: $e ");
    rethrow;
  }
}
