// The output response from parsing a notification object

class FeedResponse {
  String cta;
  String title;
  String message;
  String icon;
  String url;
  String sid;
  String app;
  String image;
  String blockchain;
  String secret;
  Notification notification;

  FeedResponse({
    required this.cta,
    required this.title,
    required this.message,
    required this.icon,
    required this.url,
    required this.sid,
    required this.app,
    required this.image,
    required this.blockchain,
    required this.secret,
    required this.notification,
  });

  Map<String, dynamic> toJson() {
    return {
      'cta': cta,
      'title': title,
      'message': message,
      'icon': icon,
      'url': url,
      'sid': sid,
      'app': app,
      'image': image,
      'blockchain': blockchain,
      'secret': secret,
      'notification': notification.toJson(),
    };
  }

  factory FeedResponse.fromJson(Map<String, dynamic> json) {
    return FeedResponse(
      cta: json['cta'] as String,
      title: json['title'] as String,
      message: json['message'] as String,
      icon: json['icon'] as String,
      url: json['url'] as String,
      sid: json['sid'] as String,
      app: json['app'] as String,
      image: json['image'] as String,
      blockchain: json['blockchain'] as String,
      secret: json['secret'] as String,
      notification:
          Notification.fromJson(json['notification'] as Map<String, dynamic>),
    );
  }
}

class Notification {
  String title;
  String body;

  Notification({
    required this.title,
    required this.body,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'body': body,
    };
  }

  factory Notification.fromJson(Map<String, dynamic> json) {
    return Notification(
      title: json['title'] as String,
      body: json['body'] as String,
    );
  }
}
