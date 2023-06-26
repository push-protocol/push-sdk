import 'package:push_api_dart/push_api_dart.dart';

void testFetchGroupByChatId() async {
  final result = await getGroup(chatId: '5ed6ac1c59384fc447986141e5ff593b8fd446d63bd3a9a0f16e06e012bc86d3');

  print(result);

}
