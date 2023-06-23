class SendMessagePayload {
  String fromDID;
  String toDID;
  String fromCAIP10;
  String toCAIP10;
  String messageContent;
  String messageType;
  String? signature;
  String encType;
  String? encryptedSecret;
  String? sigType;
  String? verificationProof;

  SendMessagePayload({
    required this.fromDID,
    required this.toDID,
    required this.fromCAIP10,
    required this.toCAIP10,
    required this.messageContent,
    required this.messageType,
    this.signature,
    required this.encType,
    this.encryptedSecret,
    this.sigType,
    this.verificationProof,
  });

  Map<String, dynamic> toJson() {
    return {
      'fromDID': fromDID,
      'toDID': toDID,
      'fromCAIP10': fromCAIP10,
      'toCAIP10': toCAIP10,
      'messageContent': messageContent,
      'messageType': messageType,
      'signature': signature,
      'encType': encType,
      'encryptedSecret': encryptedSecret,
      'sigType': sigType,
      'verificationProof': verificationProof,
    };
  }

  static SendMessagePayload fromJson(Map<String, dynamic> json) {
    return SendMessagePayload(
      fromDID: json['fromDID'],
      toDID: json['toDID'],
      fromCAIP10: json['fromCAIP10'],
      toCAIP10: json['toCAIP10'],
      messageContent: json['messageContent'],
      messageType: json['messageType'],
      signature: json['signature'],
      encType: json['encType'],
      encryptedSecret: json['encryptedSecret'],
      sigType: json['sigType'],
      verificationProof: json['verificationProof'],
    );
  }
}
