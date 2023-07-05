import '../../../push_api_dart.dart';

String getQueryParams(Map<dynamic, dynamic> data) {
  return data.keys
      .map((key) => '$key=${Uri.encodeComponent(data[key].toString())}')
      .join('&');
}

class Api {
  int getLimit([int? passedLimit]) {
    if (passedLimit == null) return Constants.PAGINATION['LIMIT'];

// if (passedLimit > Constants.PAGINATION['LIMIT_MAX']) {
// return Constants.PAGINATION['LIMIT_MAX'];
// }

    return passedLimit;
  }

  static String getAPIBaseUrls([ENV? env]) {
    env ??= providerContainer.read(envProvider);
    return Api._apiBaseUrlMap[env] ?? 'http://localhost:4000/apis';
  }

  static final Map<ENV, String> _apiBaseUrlMap = {
    ENV.prod: 'https://backend.epns.io/apis',
    ENV.staging: 'https://backend-staging.epns.io/apis',
    ENV.dev: 'https://backend-dev.epns.io/apis',
    /**
   * **This is for local development only**
   */
    ENV.local: 'http://localhost:4200/apis',
  };
}
