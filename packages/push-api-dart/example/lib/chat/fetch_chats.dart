import 'package:push_api_dart/push_api_dart.dart';

void testFetchChats() async {
  final result = await chats(toDecrypt: true);

  print(result);
  if (result != null && result.isNotEmpty) {
    print('testFetchChats messageContent: ${result.first.msg?.messageContent}');
  }
}
