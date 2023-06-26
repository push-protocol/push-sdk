import 'package:ethers/signers/wallet.dart';
import 'package:flutter/cupertino.dart';
import 'package:push_api_dart/push_api_dart.dart';

import 'user/get_user.dart';

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
  // testFetchP2PChat();

  final bodyToBeHashed = {
    'groupName': 'groupName',
    'groupDescription': 'groupDescription',
    'members': <String>[],
    'groupImage': 'groupImage',
    'admins': <String>[],
    'isPublic': false,
    'contractAddressNFT': 'contractAddressNFT',
    'numberOfNFTs': 0,
    'contractAddressERC20': 'contractAddressERC20',
    'numberOfERC20': 0,
    'groupCreator': 'userDID',
  };

  final hash = generateHash(bodyToBeHashed);

  

  print('hash: $hash');
}
