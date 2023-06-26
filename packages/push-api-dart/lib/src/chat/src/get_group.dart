import 'package:push_api_dart/push_api_dart.dart';

Future<GroupDTO?> getGroup({required String chatId}) async {
  if (chatId.isEmpty) {
    throw Exception('chatId cannot be null or empty');
  }

  final result = await http.get(path: '/v1/chat/groups/$chatId');

  if (result == null) {
    return null;
  }
  return GroupDTO.fromJson(result);
}
