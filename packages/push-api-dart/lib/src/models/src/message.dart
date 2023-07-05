class IMessageIPFS {
  String fromCAIP10;
  String toCAIP10;
  String fromDID;
  String toDID;
  String messageType;
  String messageContent;
  String signature;
  String sigType;
  String? link;
  int? timestamp;
  String encType;
  String encryptedSecret;
  bool? deprecated;
  String? deprecatedCode;

  IMessageIPFS({
    required this.fromCAIP10,
    required this.toCAIP10,
    required this.fromDID,
    required this.toDID,
    required this.messageType,
    required this.messageContent,
    required this.signature,
    required this.sigType,
    this.link,
    this.timestamp,
    required this.encType,
    required this.encryptedSecret,
    this.deprecated,
    this.deprecatedCode,
  });

  factory IMessageIPFS.fromJson(Map<String, dynamic> json) {
    return IMessageIPFS(
      fromCAIP10: json['fromCAIP10'],
      toCAIP10: json['toCAIP10'],
      fromDID: json['fromDID'],
      toDID: json['toDID'],
      messageType: json['messageType'],
      messageContent: json['messageContent'],
      signature: json['signature'],
      sigType: json['sigType'],
      link: json['link'],
      timestamp: json['timestamp'],
      encType: json['encType'],
      encryptedSecret: json['encryptedSecret'],
      deprecated: json['deprecated'],
      deprecatedCode: json['deprecatedCode'],
    );
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {};
    data['fromCAIP10'] = fromCAIP10;
    data['toCAIP10'] = toCAIP10;
    data['fromDID'] = fromDID;
    data['toDID'] = toDID;
    data['messageType'] = messageType;
    data['messageContent'] = messageContent;
    data['signature'] = signature;
    data['sigType'] = sigType;
    data['link'] = link;
    data['timestamp'] = timestamp;
    data['encType'] = encType;
    data['encryptedSecret'] = encryptedSecret;
    data['deprecated'] = deprecated;
    data['deprecatedCode'] = deprecatedCode;
    return data;
  }
}

class MessageWithCID {
  String cid;
  String chatId;
  String link;
  String fromCAIP10;
  String toCAIP10;
  String fromDID;
  String toDID;
  String messageType;
  String messageContent;
  String signature;
  String sigType;
  int? timestamp;
  String encType;
  String encryptedSecret;
  String? verificationProof;

  MessageWithCID({
    required this.cid,
    required this.chatId,
    required this.link,
    required this.fromCAIP10,
    required this.toCAIP10,
    required this.fromDID,
    required this.toDID,
    required this.messageType,
    required this.messageContent,
    required this.signature,
    required this.sigType,
    this.timestamp,
    required this.encType,
    required this.encryptedSecret,
    this.verificationProof,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['cid'] = cid;
    data['chatId'] = chatId;
    data['link'] = link;
    data['fromCAIP10'] = fromCAIP10;
    data['toCAIP10'] = toCAIP10;
    data['fromDID'] = fromDID;
    data['toDID'] = toDID;
    data['messageType'] = messageType;
    data['messageContent'] = messageContent;
    data['signature'] = signature;
    data['sigType'] = sigType;
    data['timestamp'] = timestamp;
    data['encType'] = encType;
    data['encryptedSecret'] = encryptedSecret;
    data['verificationProof'] = verificationProof;
    return data;
  }

  static MessageWithCID fromJson(Map<String, dynamic> json) {
    return MessageWithCID(
      cid: json['cid'],
      chatId: json['chatId'],
      link: json['link'],
      fromCAIP10: json['fromCAIP10'],
      toCAIP10: json['toCAIP10'],
      fromDID: json['fromDID'],
      toDID: json['toDID'],
      messageType: json['messageType'],
      messageContent: json['messageContent'],
      signature: json['signature'],
      sigType: json['sigType'],
      timestamp: json['timestamp'],
      encType: json['encType'],
      encryptedSecret: json['encryptedSecret'],
      verificationProof: json['verificationProof'],
    );
  }
}
