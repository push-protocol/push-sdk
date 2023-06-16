import 'package:ethers/signers/wallet.dart';
import 'package:flutter/cupertino.dart';
import 'package:push_api_dart/push_api_dart.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  /*var user = await UserRepo.getUser(
      address: 'eip155:0x754E2C9f31D7DB279E9d4A9140e33ad8839E1FAd');

  print(user?.toJson());*/

  const mnemonic =
      "wine album quarter custom birth great leisure bid gossip rabbit early choice";
  final walletMnemonic = Wallet.fromMnemonic(mnemonic);
  final result = await UserRepo.createUser(wallet: walletMnemonic);

  print(result);
}
