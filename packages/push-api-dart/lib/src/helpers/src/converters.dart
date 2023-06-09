import '../../../push_api_dart.dart';

String walletToPCAIP10(String account) {
  if (isValidCAIP10NFTAddress(account) || account.contains('eip155:')) {
    return account;
  }
  return 'eip155:$account';
}

String pCAIP10ToWallet(String wallet) {
  if (isValidCAIP10NFTAddress(wallet)) return wallet;
  wallet = wallet.replaceFirst('eip155:', '');
  return wallet;
}
