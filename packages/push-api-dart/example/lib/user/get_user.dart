import 'package:ethers/signers/wallet.dart';
import 'package:push_api_dart/push_api_dart.dart';

void testGetUser() async {
  const mnemonic =
      'wink cancel juice stem alert gesture rally pupil evidence top night fury';
  final walletMnemonic = Wallet.fromMnemonic(mnemonic);

  print('walletMnemonic.address: ${walletMnemonic.address}');
  final result = await getUser(address: walletMnemonic.address ?? '');

  print(result);
}
