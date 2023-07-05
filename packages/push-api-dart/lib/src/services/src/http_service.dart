import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http_package;

import '../../../push_api_dart.dart';

HttpService http = HttpService();

log(Object? data) {
  final env = providerContainer.read(envProvider);
  if (env == ENV.dev || env == ENV.local || env == ENV.staging) {
    print(data);
  }
}

class HttpService {
  static const timeOutSeconds = 30;

  Map<String, String>? header(String? authorization) {
    final Map<String, String> header = {"Content-Type": "application/json"};

    log('HEADER---$header');

    return header;
  }

  Future<dynamic> post({
    String? baseUrl,
    String? authorization,
    required String path,
    required data,
    bool skipJsonDecode = false,
  }) async {
    http_package.Response? response;
    try {
      baseUrl ??= Api.getAPIBaseUrls();
      final url = Uri.parse(baseUrl + path);
      log('POST---$url');
      log('POST---DATA---$data');

      response = await http_package.post(
        url,
        body: jsonEncode(data),
        headers: header(authorization),
      );
      log('Status Code:${response.statusCode}');
      log('Response : ${response.body}');
      log('isFailure : ${isFailure(response.statusCode)}');

      if (skipJsonDecode || isFailure(response.statusCode)) {
        return response.body;
      }

      if (response.body.isEmpty) {
        return <String, dynamic>{};
      }
      return json.decode(response.body);
    } catch (exception) {
      log(exception);
      return null;
    }
  }

  /// make skipJsonDecode = true if expected result is not in json format
  Future<dynamic> get({
    String? baseUrl,
    String? authorization,
    required String path,
    bool skipJsonDecode = false,
  }) async {
    http_package.Response? response;
    try {
      baseUrl ??= Api.getAPIBaseUrls();
      final url = Uri.parse((baseUrl + path));
      log('GET---$url');

      response = await http_package.get(
        url,
        headers: header(authorization),
      );
      log('Status Code:${response.statusCode}');
      log('Response : ${response.body}');

      if (skipJsonDecode || isFailure(response.statusCode)) {
        return response.body;
      }

      if (response.body.isEmpty) {
        return <String, dynamic>{};
      }
      return json.decode(response.body);
    } catch (exception) {
      log(exception);
      return null;
    }
  }

  Future getBytes({
    String? baseUrl,
    String? authorization,
    required String path,
  }) async {
    http_package.Response? response;
    try {
      baseUrl ??= Api.getAPIBaseUrls();
      final url = Uri.parse(baseUrl + path);
      log('GET---$url');

      response = await http_package.get(
        url,
        headers: header(authorization),
      );
      log('Status Code:${response.statusCode}');
      log('Response : ${response.body}');
      if (response.body.isNotEmpty && response.statusCode != 400) {
        return response.body;
      }
      return json.decode(response.body);
    } catch (exception) {
      log(exception);

      return null;
    }
  }

  Future<Map<String, dynamic>?> put({
    String? baseUrl,
    String? authorization,
    required String path,
    var data,
  }) async {
    http_package.Response? response;
    try {
      baseUrl ??= Api.getAPIBaseUrls();
      final url = Uri.parse((baseUrl) + path);
      log('PUT---$url');
      log('PUT---DATA---$data');

      response = await http_package.put(
        url,
        body: data == null ? null : jsonEncode(data),
        headers: header(authorization),
      );
      log('Status Code:${response.statusCode}');
      log('Response : ${response.body}');
      if (response.body.isEmpty) {
        return <String, dynamic>{};
      }
      return json.decode(response.body);
    } catch (exception) {
      log(exception.toString());
      return null;
    }
  }

  Future<Map<String, dynamic>?> delete({
    String? baseUrl,
    String? authorization,
    required String path,
    String? id,
    bool check401 = true,
  }) async {
    http_package.Response? response;
    try {
      baseUrl ??= Api.getAPIBaseUrls();
      final url = Uri.parse((baseUrl) + path + (id != null ? '/$id' : ''));
      log('DELETE---$url');

      response = await http_package.delete(
        url,
        headers: header(authorization),
      );
      log('Status Code:${response.statusCode}');
      log('Response : ${response.body}');
      if (response.body.isEmpty) {
        return <String, dynamic>{};
      }
      return json.decode(response.body);
    } catch (exception) {
      log(exception.toString());
      rethrow;
    }
  }

  bool isFailure(int statusCode) {
    return statusCode < 200 || statusCode > 299;
  }
}
