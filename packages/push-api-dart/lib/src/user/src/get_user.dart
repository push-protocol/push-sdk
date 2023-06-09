import '../../../push_api_dart.dart';

Future<User?> getUser({required String address, required ENV env}) async {
  if (!isValidETHAddress(address)) {
    throw Exception('Invalid address!');
  }

  final caip10 = walletToPCAIP10(address);
  final baseUrl = getAPIBaseUrls(env);
  final requestUrl = '/v2/users/?caip10=$caip10';
  final result = await http.get(baseUrl: baseUrl, path: requestUrl);
  if (result == null || result.isEmpty) {
    return null;
  }

  return User.fromJson(result);
}
