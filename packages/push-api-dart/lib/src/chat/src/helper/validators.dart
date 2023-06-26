import '../../../../push_api_dart.dart';

void createGroupRequestValidator({
  required String groupName,
  required String groupDescription,
  required List<String> members,
  required List<String> admins,
  String? contractAddressNFT,
  int? numberOfNFTs,
  String? contractAddressERC20,
  int? numberOfERC20,
}) {
  if (groupName.isEmpty) {
    throw Exception('groupName cannot be null or empty');
  }

  if (groupName.length > 50) {
    throw Exception('groupName cannot be more than 50 characters');
  }

  if (groupDescription.length > 150) {
    throw Exception('groupDescription cannot be more than 150 characters');
  }

  if (members.isEmpty) {
    throw Exception('members cannot be null');
  }

  for (int i = 0; i < members.length; i++) {
    if (!isValidETHAddress(members[i])) {
      throw Exception('Invalid member address!');
    }
  }

  if (admins.isEmpty) {
    throw Exception('admins cannot be null');
  }

  for (int i = 0; i < admins.length; i++) {
    if (!isValidETHAddress(admins[i])) {
      throw Exception('Invalid admin address!');
    }
  }

  if (contractAddressNFT != null &&
      contractAddressNFT.isNotEmpty &&
      !isValidNFTCAIP10Address(contractAddressNFT)) {
    throw Exception('Invalid contractAddressNFT address!');
  }

  if (numberOfNFTs != null && numberOfNFTs < 0) {
    throw Exception('numberOfNFTs cannot be negative number');
  }

  if (contractAddressERC20 != null &&
      contractAddressERC20.isNotEmpty &&
      !isValidNFTCAIP10Address(contractAddressERC20)) {
    throw Exception('Invalid contractAddressERC20 address!');
  }

  if (numberOfERC20 != null && numberOfERC20 < 0) {
    throw Exception('numberOfERC20 cannot be negative number');
  }
}
