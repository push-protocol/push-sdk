import '../../../push_api_dart.dart';

class Api {
  static String getQueryParams(Map<dynamic, dynamic> obj) {
    return obj.keys
        .map((key) => '$key=${Uri.encodeComponent(obj[key])}')
        .join('&');
  }

  int getLimit([int? passedLimit]) {
    if (passedLimit == null) return Constants.PAGINATION['LIMIT'];

// if (passedLimit > Constants.PAGINATION['LIMIT_MAX']) {
// return Constants.PAGINATION['LIMIT_MAX'];
// }

    return passedLimit;
  }
}
