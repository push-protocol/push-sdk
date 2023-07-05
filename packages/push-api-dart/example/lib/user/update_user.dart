import 'package:ethers/signers/wallet.dart' as ether;
import 'package:flutter/foundation.dart';
import 'package:push_api_dart/push_api_dart.dart';

testUpdateUser() {
  const mnemonic =
      'wink cancel juice stem alert gesture rally pupil evidence top night fury';
  final walletMnemonic = ether.Wallet.fromMnemonic(mnemonic);

  print('walletMnemonic.address: ${walletMnemonic.address}');

  profileUpdate(
    pgpPrivateKey: walletMnemonic.privateKey!,
    account: walletMnemonic.address!,
    profile: Profile(name: 'Tester ${UniqueKey()}'),
  );
}
