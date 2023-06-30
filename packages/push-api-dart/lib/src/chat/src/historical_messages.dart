// ignore_for_file: constant_identifier_names

import '../../../push_api_dart.dart';

class FetchLimit {
  static const MIN = 1;
  static const DEFAULT = 10;
  static const MAX = 30;
}

Future<List<IMessageIPFS>> history({
  required String threadhash,
  required String account,
  int limit = FetchLimit.DEFAULT,
  required String pgpPrivateKey,
  bool toDecrypt = false,
}) async {
  try {
    if (limit < FetchLimit.MIN || limit > FetchLimit.MAX) {
      if (limit < FetchLimit.MIN) {
        throw Exception('Limit must be more than equal to ${FetchLimit.MIN}');
      } else {
        throw Exception('Limit must be less than equal to ${FetchLimit.MAX}');
      }
    }

    final messages =
        await getMessagesService(threadhash: threadhash, limit: limit) ?? [];

    final updatedMessages = addDeprecatedInfoToMessages(messages);
    final connectedUser = await getUser(address: pCAIP10ToWallet(account));

    if (toDecrypt) {
      return await decryptConversation(
        messages: updatedMessages,
        connectedUser: connectedUser,
        pgpPrivateKey: pgpPrivateKey,
      );
    }
    return messages;
  } catch (err) {
    log('[Push SDK] - API history - : $err');
    throw Exception('[Push SDK] - API history - : $err');
  }
}
