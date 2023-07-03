import 'package:push_api_dart/push_api_dart.dart';

///Get the latest chat message
Future<List<IMessageIPFS>> latest({
  required String threadhash,
  required String account,
  int limit = FetchLimit.DEFAULT,
  required String pgpPrivateKey,
  bool toDecrypt = false,
}) async {
  return history(
    threadhash: threadhash,
    account: account,
    pgpPrivateKey: pgpPrivateKey,
    limit: 1,
    toDecrypt: toDecrypt,
  );
}
