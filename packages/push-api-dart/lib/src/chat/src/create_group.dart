import '../../../push_api_dart.dart';

createGroup({
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

    createGroupRequestValidator(
        groupName: groupName,
        groupDescription: groupDescription,
        members: members,
        admins: admins);

    final convertedMembersDIDList =
        await Future.wait(members.map((item) => getUserDID(address: item)));
    final convertedAdminsDIDList =
        await Future.wait(admins.map((item) => getUserDID(address: item)));

    final bodyToBeHashed = {
      'groupName': groupName,
      'groupDescription': groupDescription,
      'members': convertedMembersDIDList,
      'groupImage': groupImage,
      'admins': convertedAdminsDIDList,
      'isPublic': isPublic,
      'contractAddressNFT': contractAddressNFT,
      'numberOfNFTs': numberOfNFTs ?? 0,
      'contractAddressERC20': contractAddressERC20,
      'numberOfERC20': numberOfERC20 ?? 0,
      'groupCreator': userDID,
    };

    final hash = generateHash(bodyToBeHashed);

    final signature = await sign(
      message: hash,
      signingKey: wallet!.privateKey!,
    );

    const sigType = 'pgp';

    final String verificationProof = '$sigType:$signature';

    final body = {
      'groupName': groupName,
      'groupDescription': groupDescription,
      'members': members,
      'groupImage': groupImage,
      'admins': admins,
      'isPublic': isPublic,
      'contractAddressNFT': contractAddressNFT,
      'numberOfNFTs': numberOfNFTs,
      'contractAddressERC20': contractAddressERC20,
      'numberOfERC20': numberOfERC20,
      'groupCreator': userDID,
      'verificationProof': verificationProof,
      'meta': meta,
    };

    final result = await http.post(
      path: '/v1/chat/groups',
      data: body,
    );

    if (result == null) {
      throw Exception(result);
    }

    return GroupDTO.fromJson(result);
    
  } catch (e) {
    log("[Push SDK] - API  - Error - API createGroup -: $e ");
    rethrow;
  }
}
