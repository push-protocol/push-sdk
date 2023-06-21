class Message {
  String? fromCAIP10;
  String? toCAIP10;
  String? fromDID;
  String? toDID;
  String? messageContent;
  String? messageType;
  String? signature;
  int? timestamp;
  String? sigType;
  String? encType;
  String? encryptedSecret;
  String? link;

  Message(
      {this.fromCAIP10,
      this.toCAIP10,
      this.fromDID,
      this.toDID,
      this.messageContent,
      this.messageType,
      this.signature,
      this.timestamp,
      this.sigType,
      this.encType,
      this.encryptedSecret,
      this.link});

  Message.fromJson(Map<String, dynamic> json) {
    fromCAIP10 = json['fromCAIP10'];
    toCAIP10 = json['toCAIP10'];
    fromDID = json['fromDID'];
    toDID = json['toDID'];
    messageContent = json['messageContent'];
    messageType = json['messageType'];
    signature = json['signature'];
    timestamp = json['timestamp'];
    sigType = json['sigType'];
    encType = json['encType'];
    encryptedSecret = json['encryptedSecret'];
    link = json['link'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['fromCAIP10'] = fromCAIP10;
    data['toCAIP10'] = toCAIP10;
    data['fromDID'] = fromDID;
    data['toDID'] = toDID;
    data['messageContent'] = messageContent;
    data['messageType'] = messageType;
    data['signature'] = signature;
    data['timestamp'] = timestamp;
    data['sigType'] = sigType;
    data['encType'] = encType;
    data['encryptedSecret'] = encryptedSecret;
    data['link'] = link;
    return data;
  }
}
