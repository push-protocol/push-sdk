// the type for the the response of the input data to be parsed
import '../../../push_api_dart.dart';

class ApiNotificationType {
  late int payloadId;
  late String channel;
  late String epoch;
  late Payload payload;
  late String source;
}

class Payload {
  late Apns apns;
  late Data data;
  late Android android;
  late Notification notification;
}

class Apns {
  late ApnsPayload payload;
  late FcmOptions fcmOptions;
}

class ApnsPayload {
  late Aps aps;
}

class Aps {
  late String category;
  late int mutableContent;
  late int contentAvailable;
}

class FcmOptions {
  late String image;
}

class Data {
  late String app;
  late String sid;
  late String url;
  late String acta;
  late String aimg;
  late String amsg;
  late String asub;
  late String icon;
  late String type;
  late String epoch;
  late String appbot;
  late String hidden;
  late String secret;
}

class Android {
  late AndroidNotification notification;
}

class AndroidNotification {
  late String icon;
  late String color;
  late String image;
  late bool defaultVibrateTimings;
}

class Notification {
  late String body;
  late String title;
}

// The output response from parsing a notification object
class ParsedResponseType {
  late String cta;
  late String title;
  late String message;
  late String icon;
  late String url;
  late String sid;
  late String app;
  late String image;
  late String blockchain;
  late String secret;
  late Notification notification;
}

class SendNotificationInputOptions {
  int? senderType;
  late dynamic signer;
  late String type;
  late String identityType;
  NotificationOptions? notification;
  PayloadOptions? payload;
  late dynamic recipients;
  late String channel;
  int? expiry;
  bool? hidden;
  Graph? graph;
  String? ipfsHash;
  late String env;
  String? chatId;
  String? pgpPrivateKey;
}

class NotificationOptions {
  late String title;
  late String body;
}

class PayloadOptions {
  String? sectype;
  late String title;
  late String body;
  late String cta;
  late String img;
  dynamic metadata;
  dynamic additionalMeta;
}

class Graph {
  late String id;
  late int counter;
}

class NotificationPayload {
  late NotificationOptions notification;
  late Data data;
  late dynamic recipients;
}

class MessageIPFS {
  late String fromCAIP10;
  late String toCAIP10;
  late String fromDID;
  late String toDID;
  late String messageType;
  late String messageContent;
  late String signature;
  late String sigType;
  late String? link;
  late int? timestamp;
  late String encType;
  late String encryptedSecret;
  bool? deprecated; // scope only at sdk level
  String? deprecatedCode; // scope only at sdk level
}

class Feeds {
  late MessageIPFS msg;
  late String did;
  late String wallets;
  String? profilePicture;
  String? publicKey;
  String? about;
  String? threadhash;
  String? intent;
  String? intentSentBy;
  late DateTime intentTimestamp;
  late String combinedDID;
  String? cid;
  String? chatId;
  GroupDTO? groupInformation;
  bool? deprecated; // scope only at sdk level
  String? deprecatedCode; // scope only at sdk level
}

class Member {
  late String wallet;
  late String publicKey;
}

class GroupDTO {
  late List<Member> members;
  late List<Member> pendingMembers;
  String? contractAddressERC20;
  late int numberOfERC20;
  String? contractAddressNFT;
  late int numberOfNFTTokens;
  late String verificationProof;
  String? groupImage;
  late String groupName;
  late bool isPublic;
  String? groupDescription;
  late String groupCreator;
  late String chatId;
  DateTime? scheduleAt;
  DateTime? scheduleEnd;
  late String groupType;
}

class Subscribers {
  late int itemcount;
  late List<String> subscribers;
}

class ConnectedUser extends User {
  String? privateKey;

  ConnectedUser.fromJson(super.json) : super.fromJson();
}

class MessageIPFSWithCID extends MessageIPFS {
  late String cid;
}

class AccountEnvOptionsType extends EnvOptionsType {
  late String account;
}

class ChatOptionsType extends AccountEnvOptionsType {
  String? messageContent;
  String? messageType;
  late String receiverAddress;
  String? pgpPrivateKey;
  late ConnectedUser connectedUser;
  String? apiKey;
}

class ChatSendOptionsType {
  String? messageContent;
  String? messageType;
  late String receiverAddress;
  String? pgpPrivateKey;
  String? apiKey;
  late String env;
  String? account;
  dynamic signer;
}

class ConversationHashOptionsType extends AccountEnvOptionsType {
  late String conversationId;
}

class UserInfo {
  late String wallets;
  late String publicKey;
  late String name;
  late String image;
  late bool isAdmin;
}

class EnvOptionsType {
  String? env;
}

// class WalletType {
//   String? account;
//   Object? signer;
//   // SignerType? signer;
// }

class EncryptedPrivateKeyTypeV1 {}
// class EncryptedPrivateKeyTypeV1 extends EthEncryptedData {}

class EncryptedPrivateKeyTypeV2 {
  late String ciphertext;
  String? version;
  String? salt;
  late String nonce;
  String? preKey;
  EncryptedPrivateKeyTypeV2? encryptedPassword;
}

class EncryptedPrivateKeyType {
  EncryptedPrivateKeyType({
    this.ciphertext,
    this.nonce,
    this.version,
    this.encryptedPassword,
    this.salt,
    this.preKey,
  });
  String? version;
  String? nonce;
  String? ephemPublicKey;
  String? ciphertext;
  String? salt;
  String? preKey;
  EncryptedPrivateKeyTypeV2? encryptedPassword;

  toJson() {
    return {
      if (ciphertext != null) 'ciphertext': ciphertext,
      if (salt != null) 'salt': salt,
      if (nonce != null) 'nonce': nonce,
      if (version != null) 'version': version,
      if (preKey != null) 'preKey': preKey,
    };
  }
}

class MessageWithCID {
  late String cid;
  late String chatId;
  late String link;
  late String fromCAIP10;
  late String toCAIP10;
  late String fromDID;
  late String toDID;
  late String messageType;
  late String messageContent;
  late String signature;
  late String sigType;
  int? timestamp;
  late String encType;
  late String encryptedSecret;
  String? verificationProof;
}

class MediaStream {
  MediaStream? stream;
  String? audio;
  String? video;
  late String address;
  late Object status; //MediaStream
  late int retryCount;
}

class VideoCallData {
  late VideoCallMeta meta;
  late VideoCallLocal local;
  late List<VideoCallIncoming> incoming;
}

class VideoCallMeta {
  late String chatId;
  late VideoCallInitiator initiator;
  VideoCallBroadcast? broadcast;
}

class VideoCallInitiator {
  late String address;
  late dynamic signal;
}

class VideoCallBroadcast {
  late dynamic livepeerInfo;
  late String hostAddress;
  late String coHostAddress;
}

class VideoCallLocal {
  MediaStream? stream;
  String? audio;
  String? video;
  late String address;
}

class VideoCallIncoming {
  MediaStream? stream;
  String? audio;
  String? video;
  late String address;
  late Object status; //MediaStream
  late int retryCount;
}

class VideoCreateInputOptions {
  String? video;
  String? audio;
  MediaStream? stream;
}

class VideoRequestInputOptions {
  late String senderAddress;
  late String recipientAddress;
  late String chatId;
  void Function(String)? onReceiveMessage;
  bool? retry;
}

class VideoAcceptRequestInputOptions {
  late dynamic signalData;
  late String senderAddress;
  late String recipientAddress;
  late String chatId;
  void Function(String)? onReceiveMessage;
  bool? retry;
}

class VideoConnectInputOptions {
  late dynamic signalData;
}

class EnableVideoInputOptions {
  late bool state;
}

class EnableAudioInputOptions {
  late bool state;
}
