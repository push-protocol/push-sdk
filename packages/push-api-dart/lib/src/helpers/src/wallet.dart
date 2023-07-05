import '../../../push_api_dart.dart';

Wallet getWallet({
  String? address,
  Signer? signer,
}) {
  return Wallet(
    signer: signer,
    address: address != null ? pCAIP10ToWallet(address) : address,
  );
}

String getAccountAddress(Wallet wallet) {
  final address = wallet.address ?? wallet.signer?.getAddress();
  if (address == null) {
    throw Exception('Address not found');
  } else {
    return address;
  }
}
