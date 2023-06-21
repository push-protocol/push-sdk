import 'package:push_api_dart/push_api_dart.dart';

Future<Message?> getCID({required String cid}) async {
  try {
    final result = await http.get(path: '/v1/ipfs/$cid');
    if (result == null) {
      return null;
    }
    return Message.fromJson(result);
  } catch (e) {
    throw Exception('[Push SDK] - API getCID: $e');
  }
}
