import 'dart:typed_data';

import 'dart:math' as m;
import 'package:hex/hex.dart';
import 'package:pointycastle/export.dart';

// ignore: constant_identifier_names
const MAX_SAFE_INTEGER = 0x1fffffffffffff;

String getChecksumAddress(String address) {
  if (!isHexString(address, 20)) {
    throw ArgumentError('invalid address');
  }
  address = address.toLowerCase();
  var chars = address.substring(2).split('');
  var expanded = Uint8List(40);
  for (var i = 0; i < 40; i++) {
    expanded[i] = chars[i].codeUnitAt(0);
  }
  var hashed = hexToBytes(HEX.encode(KeccakDigest(256).process(expanded)));
  for (var i = 0; i < 40; i += 2) {
    if ((hashed[i >> 1] >> 4) >= 8) {
      chars[i] = chars[i].toUpperCase();
    }
    if ((hashed[i >> 1] & 0x0f) >= 8) {
      chars[i + 1] = chars[i + 1].toUpperCase();
    }
  }
  return '0x${chars.join('')}';
}

bool isHexString(String value, int length) {
  if (value.length != length * 2 + 2) {
    return false;
  }
  try {
    HEX.decode(value.substring(2));
    return true;
  } catch (_) {
    return false;
  }
}

List<int> hexToBytes(String hex) {
  var result = <int>[];
  for (var i = 0; i < hex.length; i += 2) {
    var byte = int.parse(hex.substring(i, i + 2), radix: 16);
    result.add(byte);
  }
  return result;
}

Map<String, String> ibanLookup = {};

void createIbanLookup() {
  for (var i = 0; i < 10; i++) {
    ibanLookup[i.toString()] = i.toString();
  }
  for (var i = 0; i < 26; i++) {
    ibanLookup[String.fromCharCode(65 + i)] = (10 + i).toString();
  }
}

int safeDigits = (m.log(MAX_SAFE_INTEGER)).floor();

String ibanChecksum(String address) {
  address = address.toUpperCase();
  address = "${address.substring(4)}${address.substring(0, 2)}00";
  String expanded = address.split('').map((c) => ibanLookup[c]).join('');

  while (expanded.length >= safeDigits) {
    String block = expanded.substring(0, safeDigits);
    expanded =
        (int.parse(block) % 97).toString() + expanded.substring(block.length);
  }

  String checksum = (98 - (int.parse(expanded) % 97)).toString();
  while (checksum.length < 2) {
    checksum = "0$checksum";
  }

  return checksum;
}

bool isAddress(String address) {
  try {
    getAddress(address);
    return true;
  } catch (error) {
    return false;
  }
}

String getAddress(String address) {
  String result;

  if (RegExp(r'^(0x)?[0-9a-fA-F]{40}$').hasMatch(address)) {
    if (address.substring(0, 2) != '0x') {
      address = '0x$address';
    }
    result = getChecksumAddress(address);
    if (RegExp(r'([A-F].*[a-f])|([a-f].*[A-F])').hasMatch(address) &&
        result != address) {
      throw ArgumentError('bad address checksum');
    }
  } else if (RegExp(r'^XE[0-9]{2}[0-9A-Za-z]{30,31}$').hasMatch(address)) {
    if (address.substring(2, 4) != ibanChecksum(address)) {
      throw ArgumentError('bad icap checksum');
    }
    result = base36To16(address.substring(4)).toString();
    while (result.length < 40) {
      result = '0$result';
    }
    result = getChecksumAddress('0x$result');
  } else {
    throw ArgumentError('invalid address');
  }
  return result;
}

String base16To36(String base16Number) {
  BigInt decimalValue = BigInt.parse(base16Number, radix: 16);
  return decimalToBase36(decimalValue);
}

String decimalToBase36(BigInt decimalValue) {
  final base36Characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  final base36List = <String>[];

  while (decimalValue > BigInt.zero) {
    base36List.insert(
        0, base36Characters[(decimalValue % BigInt.from(36)).toInt()]);
    decimalValue ~/= BigInt.from(36);
  }

  return base36List.join('');
}

String base36To16(String base36Number) {
  BigInt decimalValue = base36ToDecimal(base36Number);
  return decimalValue.toRadixString(16).toUpperCase();
}

BigInt base36ToDecimal(String base36Number) {
  final base36Characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  BigInt decimalValue = BigInt.zero;

  for (int i = 0; i < base36Number.length; i++) {
    int digitValue = base36Characters.indexOf(base36Number[i]);
    decimalValue = decimalValue * BigInt.from(36) + BigInt.from(digitValue);
  }

  return decimalValue;
}
