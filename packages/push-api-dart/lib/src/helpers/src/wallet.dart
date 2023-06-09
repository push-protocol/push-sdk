import '../../../push_api_dart.dart';

Map<String, dynamic> getWallet({required WalletType options}) {
  final String? account = options.account;
  final Object? signer = options.signer;
  // final SignerType? signer = options.signer;

  return {
    'account': account != null ? pCAIP10ToWallet(account) : null,
    'signer': signer,
  };
}

Future<String> getAccountAddress({required WalletType options}) async {
  final String? account = options.account;
  // final Object? signer = options.signer;
  // final SignerType? signer = options.signer;

  return account ?? '';
  // return account ?? (await signer?.getAddress()) ?? '';
}
