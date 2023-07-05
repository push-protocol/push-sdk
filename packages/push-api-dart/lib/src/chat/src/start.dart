import 'package:push_api_dart/push_api_dart.dart';

Future<MessageWithCID?> start({
  String messageContent = '',
  String messageType = 'Text',
  required String receiverAddress,
  ConnectedUser? connectedUser,
  apiKey = '',
}) async {
  // connectedUser ??= getCachedUser();
  if (connectedUser == null) {
    throw Exception('Account address is required.');
  }

  final SendMessagePayload body = await sendMessagePayload(
    receiverAddress: receiverAddress,
    senderCreatedUser: connectedUser,
    messageContent: messageContent,
    messageType: messageType,
  );

  final bodyToBeHashed = {
    'fromDID': body.fromDID,
    'toDID': body.toDID,
    'messageContent': body.messageContent,
    'messageType': messageType,
  };

  final hash = generateHash(bodyToBeHashed);

  //TODO add sign function parameter values
  final String signature = await sign(
    message: hash,
    privateKey: connectedUser.user.encryptedPrivateKey!,
    publicKey: connectedUser.user.publicKey!,
  );

  const sigType = 'pgp';
  final String verificationProof = '$sigType:$signature';

  body.verificationProof = verificationProof;

  final result = await http.post(
    authorization: apiKey,
    path: '/v1/chat/request',
    data: body.toJson(),
  );

  if (result == null) {
    return null;
  }
  return MessageWithCID.fromJson(result);
}
