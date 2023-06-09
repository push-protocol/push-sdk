import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http_package;

HttpService http = HttpService();
log(String data) {
  print(data);
}

class HttpService {
  static const timeOutSeconds = 30;

  Map<String, String>? header() {
    final Map<String, String> header = {"Content-Type": "application/json"};

    log('HEADER---$header');

    return header;
  }

  Future<Map<String, dynamic>?> post({
    required String baseUrl,
    required String path,
    required data,
  }) async {
    http_package.Response? response;
    try {
      final url = Uri.parse(baseUrl + path);
      log('POST---$url');
      log('POST---DATA---$data');

      response = await http_package.post(
        url,
        body: jsonEncode(data),
        headers: header(),
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

  Future<Map<String, dynamic>?> get({
    required String baseUrl,
    required String path,
  }) async {
    http_package.Response? response;
    try {
      final url = Uri.parse((baseUrl + path));
      log('GET---$url');

      response = await http_package.get(
        url,
        headers: header(),
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

  Future getBytes({
    required String baseUrl,
    required String path,
  }) async {
    http_package.Response? response;
    try {
      final url = Uri.parse(baseUrl + path);
      log('GET---$url');

      response = await http_package.get(
        url,
        headers: header(),
      );
      log('Status Code:${response.statusCode}');
      log('Response : ${response.body}');
      if (response.body.isNotEmpty && response.statusCode != 400) {
        return response.body;
      }
      return json.decode(response.body);
    } catch (exception) {
      log(exception.toString());

      rethrow;
    }
  }

  Future<Map<String, dynamic>?> put({
    required String baseUrl,
    required String path,
    var data,
  }) async {
    http_package.Response? response;
    try {
      final url = Uri.parse((baseUrl) + path);
      log('PUT---$url');
      log('PUT---DATA---$data');

      response = await http_package.put(
        url,
        body: data == null ? null : jsonEncode(data),
        headers: header(),
      );
      log('Status Code:${response.statusCode}');
      log('Response : ${response.body}');
      if (response.body.isEmpty) {
        return <String, dynamic>{};
      }
      return json.decode(response.body);
    } catch (exception) {
      log(exception.toString());
      return data;
    }
  }

  Future<Map<String, dynamic>?> delete({
    required String baseUrl,
    required String path,
    String? id,
    bool check401 = true,
  }) async {
    http_package.Response? response;
    try {
      final url = Uri.parse((baseUrl) + path + (id != null ? '/$id' : ''));
      log('DELETE---$url');

      response = await http_package.delete(
        url,
        headers: header(),
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
}
