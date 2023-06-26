import '../../../../push_api_dart.dart';

Future<List<Feeds>> decryptFeeds({
  required List<Feeds> feeds,
  required User connectedUser,
  required String pgpPrivateKey,
}) async {
  late User? otherPeer;
  late String
      signatureValidationPubliKey; // To do signature verification it depends on who has sent the message

  for (var feed in feeds) {
    bool gotOtherPeer = false;
    final msg = feed.msg!;

    if (msg.encType != 'PlainText') {
      if (msg.fromCAIP10 != connectedUser.wallets.split(',')[0]) {
        if (!gotOtherPeer) {
          otherPeer = await getUser(address: msg.fromCAIP10 ?? '');
          gotOtherPeer = true;
        }
        signatureValidationPubliKey = otherPeer!.publicKey;
      } else {
        signatureValidationPubliKey = connectedUser.publicKey;
      }

      feed.msg?.messageContent = await decryptAndVerifySignature(
        cipherText: msg.messageContent!,
        encryptedSecretKey: msg.encryptedSecret!,
        publicKeyArmored: signatureValidationPubliKey,
        signatureArmored: msg.signature!,
        privateKeyArmored: pgpPrivateKey,
        message: msg,
      );
    }
  }

  return feeds;
}

getEncryptedRequest({
  required String receiverAddress,
  required User senderCreatedUser,
  required String message,
  required bool isGroup,
  GroupDTO? group,
}) {
  //Todo implement getEncryptedRequest
}

Future<String> getDecryptedPrivateKey({
  required String address,
  required EthWallet wallet,
  required User user,
}) async {
//TODO implement getDecryptedPrivateKey

  return '';
}
