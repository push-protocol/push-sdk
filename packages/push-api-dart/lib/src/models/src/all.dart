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

class Member {
  late String wallet;
  late String publicKey;
}

class GroupDTO {
  List<MemberDTO> members;
  List<MemberDTO> pendingMembers;
  String? contractAddressERC20;
  int numberOfERC20;
  String? contractAddressNFT;
  int numberOfNFTTokens;
  String verificationProof;
  String? groupImage;
  String groupName;
  bool isPublic;
  String? groupDescription;
  String groupCreator;
  String chatId;
  DateTime? scheduleAt;
  DateTime? scheduleEnd;
  String groupType;

  GroupDTO({
    required this.members,
    required this.pendingMembers,
    this.contractAddressERC20,
    required this.numberOfERC20,
    this.contractAddressNFT,
    required this.numberOfNFTTokens,
    required this.verificationProof,
    this.groupImage,
    required this.groupName,
    required this.isPublic,
    this.groupDescription,
    required this.groupCreator,
    required this.chatId,
    this.scheduleAt,
    this.scheduleEnd,
    required this.groupType,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['members'] = members.map((member) => member.toJson()).toList();
    data['pendingMembers'] =
        pendingMembers.map((member) => member.toJson()).toList();
    data['contractAddressERC20'] = contractAddressERC20;
    data['numberOfERC20'] = numberOfERC20;
    data['contractAddressNFT'] = contractAddressNFT;
    data['numberOfNFTTokens'] = numberOfNFTTokens;
    data['verificationProof'] = verificationProof;
    data['groupImage'] = groupImage;
    data['groupName'] = groupName;
    data['isPublic'] = isPublic;
    data['groupDescription'] = groupDescription;
    data['groupCreator'] = groupCreator;
    data['chatId'] = chatId;
    data['scheduleAt'] = scheduleAt?.toIso8601String();
    data['scheduleEnd'] = scheduleEnd?.toIso8601String();
    data['groupType'] = groupType;
    return data;
  }

  GroupDTO.fromJson(Map<String, dynamic> json)
      : members = (json['members'] as List)
            .map((member) => MemberDTO.fromJson(member))
            .toList(),
        pendingMembers = (json['pendingMembers'] as List)
            .map((member) => MemberDTO.fromJson(member))
            .toList(),
        contractAddressERC20 = json['contractAddressERC20'],
        numberOfERC20 = json['numberOfERC20'],
        contractAddressNFT = json['contractAddressNFT'],
        numberOfNFTTokens = json['numberOfNFTTokens'],
        verificationProof = json['verificationProof'],
        groupImage = json['groupImage'],
        groupName = json['groupName'],
        isPublic = json['isPublic'],
        groupDescription = json['groupDescription'],
        groupCreator = json['groupCreator'],
        chatId = json['chatId'],
        scheduleAt = json['scheduleAt'] != null
            ? DateTime.parse(json['scheduleAt'])
            : null,
        scheduleEnd = json['scheduleEnd'] != null
            ? DateTime.parse(json['scheduleEnd'])
            : null,
        groupType = json['groupType'];
}

class MemberDTO {
  String wallet;
  String publicKey;
  bool isAdmin;
  String image;

  MemberDTO({
    required this.wallet,
    required this.publicKey,
    required this.isAdmin,
    required this.image,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['wallet'] = wallet;
    data['publicKey'] = publicKey;
    data['isAdmin'] = isAdmin;
    data['image'] = image;
    return data;
  }

  MemberDTO.fromJson(Map<String, dynamic> json)
      : wallet = json['wallet'],
        publicKey = json['publicKey'],
        isAdmin = json['isAdmin'],
        image = json['image'];
}

class Subscribers {
  late int itemcount;
  late List<String> subscribers;
}

class MessageIPFSWithCID extends IMessageIPFS {
  late String cid;

  MessageIPFSWithCID(
      {required super.fromCAIP10,
      required super.toCAIP10,
      required super.fromDID,
      required super.toDID,
      required super.messageType,
      required super.messageContent,
      required super.signature,
      required super.sigType,
      required super.encType,
      required super.encryptedSecret});
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

class EncryptedPrivateKeyModel {
  EncryptedPrivateKeyModel({
    this.ciphertext,
    this.nonce,
    this.version,
    this.encryptedPassword,
    this.ephemPublicKey,
    this.salt,
    this.preKey,
  });
  String? version;
  String? nonce;
  String? ephemPublicKey;
  String? ciphertext;
  String? salt;
  String? preKey;
  dynamic encryptedPassword;

  toJson() {
    return {
      if (ciphertext != null) 'ciphertext': ciphertext,
      if (salt != null) 'salt': salt,
      if (nonce != null) 'nonce': nonce,
      if (version != null) 'version': version,
      if (preKey != null) 'preKey': preKey,
    };
  }

  static EncryptedPrivateKeyModel fromJson(Map<String, dynamic> json) {
    return EncryptedPrivateKeyModel(
      version: json['version'],
      nonce: json['nonce'],
      ephemPublicKey: json['ephemPublicKey'],
      ciphertext: json['ciphertext'],
      salt: json['salt'],
      preKey: json['preKey'],
    );
  }
}

class ProgressHookType {
  String progressId;
  String progressTitle;
  String progressInfo;
  String level;

  ProgressHookType({
    required this.progressId,
    required this.progressTitle,
    required this.progressInfo,
    required this.level,
  });
}

typedef ProgressHookTypeFunction = ProgressHookType Function(
    List<dynamic> args);



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
