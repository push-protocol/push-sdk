import 'package:push_api_dart/push_api_dart.dart';

Future<MessageWithCID?> send({
  required String messageContent,
  String messageType = 'Text',
  required String receiverAddress,
  required String account,
  EthWallet? wallet,
  required String pgpPrivateKey,
  required String apiKey,
}) async {
  try {
    String? address;
    wallet ??= getCachedWallet();

    if (wallet == null) {
      //copy cached did
      address = getCachedUser()?.did;
    } else {
      address = await getUserDID(address: wallet.address);
    }

    if (address == null) {
      throw Exception('Account address is required.');
    }

    if (wallet?.privateKey == null) {
      throw Exception('Private Key is required');
    }

    bool isGroup = !isValidETHAddress(receiverAddress);

    final connectedUser = await getConnectedUserV2(wallet: wallet!);
    final receiver = await getUserDID(address: receiverAddress);

    String? conversationResponse;

    if (isGroup) {
      conversationResponse = await conversationHash(
        conversationId: receiver,
        account: connectedUser?.user.did ?? account,
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
