import 'package:ethers/signers/wallet.dart';
import 'package:push_api_dart/push_api_dart.dart' as push;

void testCreateUser() async {
  const mnemonic =
      'wink cancel juice stem alert gesture rally pupil evidence top night fury';
  final walletMnemonic = Wallet.fromMnemonic(mnemonic);

  print('walletMnemonic.address: ${walletMnemonic.address}');
  final pushWallet = Wallet(
    address: walletMnemonic.address!,
    publicKey: walletMnemonic.publicKey!,
    privateKey: walletMnemonic.privateKey!,
  );
  // final result = await push.createUser(signer: push.Signer);

  // print(result);
}
