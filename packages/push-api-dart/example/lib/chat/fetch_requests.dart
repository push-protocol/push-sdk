import 'package:push_api_dart/push_api_dart.dart';

void testFetchRequests() async {
  final result = await requests(toDecrypt: true);

  print(result);
  if (result != null && result.isNotEmpty) {
    print(
        'testFetchRequests messageContent: ${result.first.msg?.messageContent}');
  }
}
