import 'package:push_api_dart/push_api_dart.dart';

void testFetchP2PChat() async {
  final result =
      await chat(recipient: '0xB6E3Dc6b35A294f6Bc8de33969185A615e8596D3');

  print(result);
  if (result != null) {
    print('testFetchChats messageContent: ${result.msg?.messageContent}');
  }
}
