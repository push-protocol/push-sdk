import 'dart:convert';

import 'package:ethers/signers/wallet.dart';
import 'package:push_api_dart/push_api_dart.dart' as push;

void testGetUser() async {
  const mnemonic =
      'wink cancel juice stem alert gesture rally pupil evidence top night fury';
  final walletMnemonic = Wallet.fromMnemonic(mnemonic);

  print('walletMnemonic.address: ${walletMnemonic.address}');
  final result = await push.getUser(address: walletMnemonic.address ?? '');

  final decodePVKey = jsonDecode('${result?.encryptedPrivateKey}');
  print('decodePVKey: ${(decodePVKey as Map).keys}');
}
