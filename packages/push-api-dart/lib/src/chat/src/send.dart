import 'package:push_api_dart/push_api_dart.dart';

Future<MessageWithCID?> send({
  required String messageContent,
  String messageType = 'Text',
  required String receiverAddress,
  String? account,
  Signer? signer,
  required String pgpPrivateKey,
  required String apiKey,
}) async {
  try {
    if (account == null && signer == null) {
      throw Exception('At least one from account or signer is necessary!');
    }
    final wallet = getWallet(address: account, signer: signer);
    String address = getAccountAddress(wallet);

    bool isGroup = !isValidETHAddress(receiverAddress);

    final connectedUser = await getConnectedUserV2(wallet: wallet);
    final receiver = await getUserDID(address: receiverAddress);

    String? conversationResponse;

    if (isGroup) {
      conversationResponse = await conversationHash(
        conversationId: receiver,
        account: address,
      );
    }

    if (conversationResponse != null) {
      return start(
        receiverAddress: receiverAddress,
        apiKey: apiKey,
        connectedUser: connectedUser,
        messageContent: messageContent,
        messageType: messageType,
      );
    } else {
      final body = await sendMessagePayload(
          receiverAddress: receiverAddress,
          senderCreatedUser: connectedUser!,
          messageContent: messageContent,
          messageType: messageType);
      final result =
          await http.post(path: '/v1/chat/message', data: body.toJson());

      if (result == null) {
        return null;
      }
      return MessageWithCID.fromJson(result);
    }
  } catch (err) {
    log('[Push SDK] - API history - : $err');
    throw Exception('[Push SDK] - API history - : $err');
  }
}
