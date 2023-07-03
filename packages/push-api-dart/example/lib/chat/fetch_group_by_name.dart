import 'package:push_api_dart/push_api_dart.dart';

void testFetchGroupByName() async {
  final result = await getGroupByName(groupName: 'cloth');

  print(result);
}
