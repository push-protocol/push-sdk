import 'dart:convert';

import 'package:push_api_dart/push_api_dart.dart';

class EthWallet {
  final String address;
  final String? publicKey, privateKey;

  EthWallet({
    required this.address,
    required this.publicKey,
    required this.privateKey,
  });
}

class User {
  late int msgSent;
  late int maxMsgPersisted;
  late String wallets;
  late String encryptedPrivateKey;
  late String publicKey;
  late String verificationProof;

  String? did;
  UserProfile? profile;
  String? name;
  String? about;
  String? profilePicture;
  int? numMsg;
  int? allowedNumMsg;
  String? encryptionType;
  String? signature;
  String? sigType;
  String? encryptedPassword;
  String? nftOwner;
  String? linkedListHash;
  List<dynamic>? nfts;

  String? privateKey;

  User.fromJson(Map<String, dynamic> json) {
    did = json['did'];
    wallets = json['wallets'];
    publicKey = json['publicKey'];
    encryptedPrivateKey = json['encryptedPrivateKey'];
    verificationProof = json['verificationProof'];
    msgSent = json['msgSent'];
    maxMsgPersisted = json['maxMsgPersisted'];
    profile =
        json['profile'] != null ? UserProfile.fromJson(json['profile']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['did'] = did;
    data['wallets'] = wallets;
    data['publicKey'] = publicKey;
    data['encryptedPrivateKey'] = encryptedPrivateKey;
    data['verificationProof'] = verificationProof;
    data['msgSent'] = msgSent;
    data['maxMsgPersisted'] = maxMsgPersisted;
    if (profile != null) {
      data['profile'] = profile!.toJson();
    }
    return data;
  }

  EncryptedPrivateKeyModel get parsedPrivateKey {
    final jsonDecodePrivateKey = jsonDecode(encryptedPrivateKey);
    return EncryptedPrivateKeyModel.fromJson(jsonDecodePrivateKey);
  }
}

class UserProfile {
  String? name;
  String? desc;
  String? picture;
  String? profileVerificationProof;

  UserProfile.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    desc = json['desc'];
    picture = json['picture'];
    profileVerificationProof = json['profileVerificationProof'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['name'] = name;
    data['desc'] = desc;
    data['picture'] = picture;
    data['profileVerificationProof'] = profileVerificationProof;
    return data;
  }
}
