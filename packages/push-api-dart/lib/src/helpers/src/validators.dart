import '../../../push_api_dart.dart';

void validatePassword(String password) {
  if (password.length < 8) {
    throw Exception('Password must be at least 8 characters long!');
  }
  if (!RegExp(r'[A-Z]').hasMatch(password)) {
    throw Exception('Password must contain at least one uppercase letter!');
  }
  if (!RegExp(r'[a-z]').hasMatch(password)) {
    throw Exception('Password must contain at least one lowercase letter!');
  }
  if (!RegExp(r'\d').hasMatch(password)) {
    throw Exception('Password must contain at least one digit!');
  }
  if (!RegExp('[!@#\$%^&*()_+\\-=[\\]{};\':"\\\\|,.<>/?]').hasMatch(password)) {
    throw Exception('Password must contain at least one special character!');
  }
}

bool isValidETHAddress(String address) {
  if (isValidCAIP10NFTAddress(address)) return true;
  if (address.contains('eip155:')) {
    final splittedAddress = address.split(':');
    if (splittedAddress.length == 3) {
      return isAddress(splittedAddress[2]);
    }
    if (splittedAddress.length == 2) {
      return isAddress(splittedAddress[1]);
    }
  }
  return isAddress(address);
}

bool isValidNFTCAIP10Address(String realCAIP10) {
  final walletComponent = realCAIP10.split(':');
  if (double.tryParse(walletComponent[1]) == null) return false;
  return walletComponent.length == 3 &&
      walletComponent[0] == 'eip155' &&
      isAddress(walletComponent[2]);
}

bool isValidCAIP10NFTAddress(String wallet) {
  try {
    final walletComponent = wallet.split(':');
    return (walletComponent.length == 5 || walletComponent.length == 6) &&
        walletComponent[0].toLowerCase() == 'nft' &&
        double.tryParse(walletComponent[4]) != null &&
        double.parse(walletComponent[4]) > 0 &&
        double.tryParse(walletComponent[2]) != null &&
        double.parse(walletComponent[2]) > 0 &&
        isAddress(walletComponent[3]) &&
        walletComponent[1] == 'eip155';
  } catch (err) {
    return false;
  }
}

bool validateCAIP(String addressInCAIP) {
  final List<String> addressComponents = addressInCAIP.split(':');

  if (addressComponents.length != 3) return false;
  final String blockchain = addressComponents[0];
  final String networkId = addressComponents[1];
  final String address = addressComponents[2];
  if (blockchain.isEmpty || networkId.isEmpty || address.isEmpty) return false;

  if (isValidCAIP10NFTAddress(addressInCAIP)) return true;

  final validatorFn =
      addressValidators.validateAddress('eip155', address: address);
  return validatorFn;
}
