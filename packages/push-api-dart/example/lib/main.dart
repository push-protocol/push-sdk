import 'package:ethers/signers/wallet.dart';
import 'package:flutter/cupertino.dart';
import 'package:push_api_dart/push_api_dart.dart';

import 'chat/fetch_chat.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  const mnemonic =
      'wink cancel juice stem alert gesture rally pupil evidence top night fury';
  final walletMnemonic = Wallet.fromMnemonic(mnemonic);

  print('walletMnemonic.address: ${walletMnemonic.address}');

  final pushWallet = EthWallet(
    address: walletMnemonic.address!,
    publicKey: walletMnemonic.publicKey!,
    privateKey: walletMnemonic.privateKey!,
  );
  await initPush(wallet: pushWallet);

  // testCreateUser();
  // testGetUser();
  testFetchP2PChat();
}
