import 'dart:convert';

import 'package:push_api_dart/push_api_dart.dart';

class Wallet {
  String? _address;
  Signer? signer;

  Wallet({String? address, this.signer}) {
    _address = address;
  }

  String? get address => _address ?? signer?.getAddress();
}

abstract class Signer {
  String? privateKey;
  Future<String> getEip191Signature(String message);
  Future<String> getEip712Signature(String message);
  String getAddress();

  /// Returns the signed-message.
  Future<String> signMessage(String message);

  getChainId();
  Future<String> signTypedData({dynamic domain, dynamic types, dynamic value});
}

class ConnectedUser extends User {
  final User user;
  final String? privateKey;

  ConnectedUser({
    required this.user,
    required this.privateKey,
  });
}

class User {
  int? msgSent;
  int? maxMsgPersisted;
  String? wallets;
  String? encryptedPrivateKey;
  String? publicKey;

  String? verificationProof;
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

  User({
    this.did,
    this.profile,
    this.name,
    this.about,
    this.verificationProof,
  });

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

  EncryptedPrivateKeyModel? get parsedPrivateKey {
    if (encryptedPrivateKey == null) {
      return null;
    }
    final jsonDecodePrivateKey = jsonDecode(encryptedPrivateKey!);
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
