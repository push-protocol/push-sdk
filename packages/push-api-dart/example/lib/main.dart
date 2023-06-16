import 'package:ethers/signers/wallet.dart';
import 'package:flutter/cupertino.dart';
import 'package:push_api_dart/push_api_dart.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  const mnemonic =
      "wine album quarter custom birth great leisure bid gossip rabbit early choice";
  final walletMnemonic = Wallet.fromMnemonic(mnemonic);
  final result = await UserRepo.createUser(wallet: walletMnemonic);

  print(result);
}
