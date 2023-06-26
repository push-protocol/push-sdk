import 'package:push_api_dart/push_api_dart.dart';

Future<GroupDTO?> getGroupByName({required String groupName}) async {
  if (groupName.isEmpty) {
    throw Exception('Group Name cannot be null or empty');
  }

  final result = await http.get(path: '/v1/chat/groups?groupName=$groupName');

  if (result == null) {
    return null;
  }
  return GroupDTO.fromJson(result);
}
