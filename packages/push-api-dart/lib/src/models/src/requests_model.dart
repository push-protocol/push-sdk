import 'package:push_api_dart/push_api_dart.dart';

class Feeds {
  String? chatId;
  String? about;
  String? did;
  String? intent;
  String? intentSentBy;
  String? intentTimestamp;
  String? publicKey;
  String? profilePicture;
  String? threadhash;
  String? wallets;
  String? combinedDID;
  String? name;
  dynamic groupInformation;
  IMessageIPFS? msg;
  bool? deprecated;
  String? deprecatedCode;

  Feeds(
      {this.chatId,
      this.about,
      this.did,
      this.intent,
      this.intentSentBy,
      this.intentTimestamp,
      this.publicKey,
      this.profilePicture,
      this.threadhash,
      this.wallets,
      this.combinedDID,
      this.name,
      this.groupInformation});

  Feeds.fromJson(Map<String, dynamic> json) {
    chatId = json['chatId'];
    about = json['about'];
    did = json['did'];
    intent = json['intent'];
    intentSentBy = json['intentSentBy'];
    intentTimestamp = json['intentTimestamp'];
    publicKey = json['publicKey'];
    profilePicture = json['profilePicture'];
    threadhash = json['threadhash'];
    wallets = json['wallets'];
    combinedDID = json['combinedDID'];
    name = json['name'];
    groupInformation = json['groupInformation'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['chatId'] = chatId;
    data['about'] = about;
    data['did'] = did;
    data['intent'] = intent;
    data['intentSentBy'] = intentSentBy;
    data['intentTimestamp'] = intentTimestamp;
    data['publicKey'] = publicKey;
    data['profilePicture'] = profilePicture;
    data['threadhash'] = threadhash;
    data['wallets'] = wallets;
    data['combinedDID'] = combinedDID;
    data['name'] = name;
    data['groupInformation'] = groupInformation;
    data['msg'] = msg?.toJson();
    return data;
  }
}

class IEncryptedRequest {
  final String message;
  final String encryptionType;
  final String aesEncryptedSecret;
  final String signature;

  IEncryptedRequest({
    required this.message,
    required this.encryptionType,
    required this.aesEncryptedSecret,
    required this.signature,
  });
}
