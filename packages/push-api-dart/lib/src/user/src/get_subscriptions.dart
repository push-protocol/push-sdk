import '../../../push_api_dart.dart';

getSubscriptions({
  required String address,
}) async {
  final user = await getCAIPAddress(address: address);
  return await http.get(path: '/v1/users/$user/subscriptions');
}
