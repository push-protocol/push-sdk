import 'package:push_api_dart/src/utils/parse_api.dart';

import '../../../push_api_dart.dart';

Future<List<FeedResponse>?> getFeeds({
  required String address,
  int page = Pagination.INITIAL_PAGE,
  int limit = Pagination.LIMIT,
  bool spam = false,
  bool raw = false,
}) async {
  final userDID = await getCAIPAddress(address: address);

  final queryObj = {
    'page': page,
    'limit': limit,
    'spam': spam,
  };
  final path = '/v1/users/$userDID/feeds?${getQueryParams(queryObj)}';

  final result = await http.get(path: path);
  if (result == null) {
    return null;
  }

  return parseApiResponse(result["feeds"]);
}
