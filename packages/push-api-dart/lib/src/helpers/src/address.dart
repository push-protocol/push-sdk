import '../../../push_api_dart.dart';

Future<String> getUserDID(String address, ENV env) async {
  if (isValidCAIP10NFTAddress(address)) {
    if (address.split(':').length == 6) {
      return address;
    }

    User? user = await getUser(address: address, env: env);
    if (user != null && user.did != null) {
      return user.did!;
    }

    var epoch = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    address = '$address:$epoch';
  }

  if (isValidETHAddress(address)) {
    return walletToPCAIP10(address);
  }

  return address;
}

typedef AddressValidator = bool Function({required String address});

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

class AddressValidatorsType {
  final Map<String, AddressValidator> _validators;

  AddressValidatorsType(this._validators);

  bool validateAddress(String key, {required String address}) {
    final validator = _validators[key];
    if (validator != null) {
      return validator(address: address);
    }
    return false;
  }
}

AddressValidatorsType addressValidators = AddressValidatorsType({
  // Ethereum
  'eip155': ({required String address}) {
    return isValidETHAddress(address);
  },
  // Add other chains here
});

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

class CAIPDetailsType {
  final String blockchain;
  final String networkId;
  final String address;

  CAIPDetailsType(
      {required this.blockchain,
      required this.networkId,
      required this.address});
}

CAIPDetailsType? getCAIPDetails(String addressInCAIP) {
  if (validateCAIP(addressInCAIP)) {
    final addressComponents = addressInCAIP.split(':');
    return CAIPDetailsType(
      blockchain: addressComponents[0],
      networkId: addressComponents[1],
      address: addressComponents[2],
    );
  }
  return null;
}

String getFallbackETHCAIPAddress(ENV env, String address) {
  int chainId = 1; // by default PROD
  if (env == ENV.DEV || env == ENV.STAGING || env == ENV.LOCAL) {
    chainId = 5;
  }
  return 'eip155:$chainId:$address';
}

Future<String> getCAIPAddress(ENV env, String address, [String? msg]) async {
  if (isValidCAIP10NFTAddress(address)) {
    return await getUserDID(address, env);
  }
  if (validateCAIP(address)) {
    return address;
  } else {
    if (isValidETHAddress(address)) {
      return getFallbackETHCAIPAddress(env, address);
    } else {
      throw Error();
    }
  }
}

String getCAIPWithChainId(String address, int chainId, [String? msg]) {
  if (isValidETHAddress(address)) {
    if (!address.contains('eip155:')) {
      return 'eip155:$chainId:$address';
    } else {
      return address;
    }
  } else {
    throw Error();
  }
}

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
