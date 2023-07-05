import '../../../../push_api_dart.dart';

Future<SendMessagePayload> sendMessagePayload({
  required String receiverAddress,
  required ConnectedUser senderCreatedUser,
  required String messageContent,
  required String messageType,
}) async {
  bool isGroup = true;

  if (isValidETHAddress(receiverAddress)) {
    isGroup = false;
  }

  GroupDTO? group;

  if (isGroup) {
    group = await getGroup(
      chatId: receiverAddress,
    );

    if (group == null) {
      throw Exception('Group not found!');
    }
  }

  var encryptedRequest = await getEncryptedRequest(
      receiverAddress: receiverAddress,
      senderCreatedUser: senderCreatedUser,
      message: messageContent,
      isGroup: isGroup);

  var message = encryptedRequest?.message;
  var encryptionType = encryptedRequest?.encryptionType;
  var aesEncryptedSecret = encryptedRequest?.aesEncryptedSecret;
  var signature = encryptedRequest?.signature;

  final body = SendMessagePayload(
    fromDID: walletToPCAIP10(senderCreatedUser.wallets!.split(',')[0]),
    toDID: isGroup ? receiverAddress : walletToPCAIP10(receiverAddress),
    fromCAIP10: walletToPCAIP10(senderCreatedUser.wallets!.split(',')[0]),
    toCAIP10: isGroup ? receiverAddress : walletToPCAIP10(receiverAddress),
    messageContent: message!,
    messageType: messageType,
    signature: signature!,
    encType: encryptionType!,
    encryptedSecret: aesEncryptedSecret!,
    sigType: 'pgp',
  );
  return body;
}
