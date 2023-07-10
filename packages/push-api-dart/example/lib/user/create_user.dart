import 'dart:convert';
import 'dart:typed_data';

import 'package:ethers/signers/wallet.dart';
import 'package:push_api_dart/push_api_dart.dart' as push;
import 'package:eth_sig_util/eth_sig_util.dart' as eth_sig;

void testCreateUser() async {
  const mnemonic =
      'wink cancel juice stem alert gesture rally pupil evidence top night fury';
  final walletMnemonic = Wallet.fromMnemonic(mnemonic);
  final w = SignerPrivateKey(
      wallet: walletMnemonic, address: walletMnemonic.address!);

  print('walletMnemonic.address: ${walletMnemonic.address}');

  try {
    final result = await push.createUser(
      signer: w,
      progressHook: (push.ProgressHookType progress) {
        print(progress.progressInfo);
      },
    );

    print(result);
  } catch (e) {
    print(e);
  }
}

class SignerPrivateKey extends push.Signer {
  final Wallet wallet;

  final String address;

  SignerPrivateKey({required this.wallet, required this.address});

  @override
  String getAddress() {
    return address;
  }

  @override
  Future<String> getEip191Signature(String message) async {
    try {
      var m = utf8.encode(message);
      

      String signature = eth_sig.EthSigUtil.signMessage(
          privateKey: wallet.privateKey, message: Uint8List.fromList(m));
      return signature;
    } catch (e) {
      print('override: getEip191Signature: error$e');
      return message;
    }
  }

  @override
  Future<String> getEip712Signature(String message) {
    // TODO: implement getEip712Signature
    throw UnimplementedError();
  }

  @override
  Future<String> signMessage(String message) async {
    try {
      var m = utf8.encode(message);

      String signature = eth_sig.EthSigUtil.signMessage(
          privateKey: wallet.privateKey, message: Uint8List.fromList(m));
      return signature;
    } catch (e) {
      return message;
    }
  }

  @override
  getChainId() {
    // TODO: implement getChainId
    throw UnimplementedError();
  }

  @override
  Future<String> signTypedData({domain, types, value}) {
    // TODO: implement signTypedData
    throw UnimplementedError();
  }
}
