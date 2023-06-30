import 'package:push_api_dart/push_api_dart.dart';

Future<List<Feeds>> getInboxList({
  required List<Feeds> feedsList,
  required String user,
  required String pgpPrivateKey,
  required bool toDecrypt,
}) async {
  final List<Feeds> feedsOutputlist = [];
  for (var feed in feedsList) {
    late IMessageIPFS? message;
    if (feed.threadhash != null) {
      message = await getCID(cid: feed.threadhash!);
    }
    // This is for groups that are created without any message
    message ??= IMessageIPFS(
      encType: 'PlainText',
      encryptedSecret: '',
      fromCAIP10: '',
      fromDID: '',
      link: '',
      messageContent: '',
      messageType: '',
      sigType: '',
      signature: '',
      toCAIP10: '',
      toDID: '',
    );

    feed.msg = message;

    feedsOutputlist.add(feed);
  }

  if (toDecrypt) {
    final connectedUser =
        getCachedUser() ?? await getUser(address: pCAIP10ToWallet(user));
    if (connectedUser == null) {
      throw Exception('Cannot find user');
    }
    return decryptFeeds(
      feeds: feedsOutputlist,
      connectedUser: connectedUser,
      pgpPrivateKey: pgpPrivateKey,
    );
  }

  return feedsOutputlist;
}

List<Feeds> addDeprecatedInfo(List<Feeds> chats) {
  Map<String, String> latestDIDs = {};

  for (var chat in chats) {
    if (isValidCAIP10NFTAddress(chat.did!)) {
      List<String> didParts = chat.did!.split(':');
      String didWithoutTimestamp = didParts.sublist(0, 5).join(':');
      String timestamp = didParts[5];

      if (!latestDIDs.containsKey(didWithoutTimestamp) ||
          timestamp.compareTo(
                  latestDIDs[didWithoutTimestamp].toString().split(':')[5]) >
              0) {
        latestDIDs[didWithoutTimestamp] = chat.did!;
      }
    }
  }

  for (var chat in chats) {
    if (isValidCAIP10NFTAddress(chat.did!)) {
      List<String> didParts = chat.did!.split(':');
      String didWithoutTimestamp = didParts.sublist(0, 5).join(':');

      if (latestDIDs[didWithoutTimestamp] != chat.did!) {
        chat.deprecated = true;
        chat.deprecatedCode = 'NFT Owner Changed';
      }
    }
  }

  return chats;
}

List<IMessageIPFS> addDeprecatedInfoToMessages(List<IMessageIPFS> chats) {
  Map<String, String> latestDIDs = {};

  for (var chat in chats) {
    if (isValidCAIP10NFTAddress(chat.fromDID)) {
      String didWithoutTimestamp =
          chat.fromDID.split(':').sublist(0, 5).join(':');
      String timestamp = chat.fromDID.split(':')[5];

      if (!latestDIDs.containsKey(didWithoutTimestamp) ||
          timestamp.compareTo(
                  latestDIDs[didWithoutTimestamp].toString().split(':')[5]) >
              0) {
        latestDIDs[didWithoutTimestamp] = chat.fromDID;
      }
    }
  }

  for (var chat in chats) {
    if (isValidCAIP10NFTAddress(chat.fromDID)) {
      String didWithoutTimestamp =
          chat.fromDID.split(':').sublist(0, 5).join(':');

      if (latestDIDs[didWithoutTimestamp] != chat.fromDID) {
        chat.deprecated = true;
        chat.deprecatedCode = 'NFT Owner Changed';
      }
    }
  }

  return chats;
}

decryptConversation({
  required List<IMessageIPFS> messages,
  required User? connectedUser,
  required String pgpPrivateKey,
}) {}
