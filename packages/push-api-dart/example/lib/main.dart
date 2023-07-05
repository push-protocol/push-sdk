import 'package:ethers/signers/wallet.dart';
import 'package:example/chat/fetch_group_by_name.dart';
import 'package:flutter/cupertino.dart';
import 'package:push_api_dart/push_api_dart.dart' as push ;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  const mnemonic =
      'wink cancel juice stem alert gesture rally pupil evidence top night fury';
  final walletMnemonic = Wallet.fromMnemonic(mnemonic);

  print('walletMnemonic.address: ${walletMnemonic.address}');

  final pushWallet = push.Wallet(
    address: walletMnemonic.address!,

  );
  await push.initPush(wallet: pushWallet);

  testFetchGroupByName();
}
