import '../../push_api_dart.dart';

List<FeedResponse> parseApiResponse(List response) {
  return response.map((apiNotification) {
    final payload = apiNotification['payload'];
    final notification = apiNotification['payload']['notification'];

    return FeedResponse(
      cta: payload['cta'],
      title: payload['asub'] ?? '',
      message: payload['bigMessage'] ?? notification['body'] ?? '',
      icon: payload['icon'],
      url: payload['url'],
      sid: payload['sid'],
      app: payload['app'],
      image: payload['aimg'],
      blockchain: apiNotification['source'],
      secret: payload['secret'],
      notification: Notification.fromJson(notification),
    );
  }).toList();
}
