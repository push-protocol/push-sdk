import '../../../push_api_dart.dart';

/// All chat messages are stored on IPFS. This function will return the latest message's CID (Content Identifier on IPFS).
/// Whenever a new message is sent or received, this CID will change.
Future<String?> conversationHash({
  required String conversationId,
  required String account,
}) async {
  try {
    if (!isValidETHAddress(account)) {
      throw Exception('Invalid address!');
    }

    final updatedConversationId = await getUserDID(
      address: conversationId,
    );
    final accountDID = await getUserDID(
      address: account,
    );

    final response = await getConversationHashService(
      conversationId: updatedConversationId,
      account: accountDID,
    );
    return response;
  } catch (e) {
    log('[Push SDK] - Error - API conversationHash: $e');
    rethrow;
  }
}
