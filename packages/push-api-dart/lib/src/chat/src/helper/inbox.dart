import 'package:push_api_dart/push_api_dart.dart';
import 'package:push_api_dart/src/providers/src/user_provider.dart';

getInboxList({
  required List<Feeds> feedsList,
  required String user,
  required String pgpPrivateKey,
  required bool toDecrypt,
}) async {
  final List<Feeds> feedsOutputlist = [];
  for (var feed in feedsList) {
    late Message? message;
    if (feed.threadhash != null) {
      message = await getCID(cid: feed.threadhash!);
    }
    // This is for groups that are created without any message
    message ??= Message(
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
    final connectedUser = providerContainer.read(userProvider) ??
        await getUser(address: pCAIP10ToWallet(user));
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
