import '../../../push_api_dart.dart';

Future<String> getUserDID(String address, ENV env) async {
  if (isValidCAIP10NFTAddress(address)) {
    if (address.split(':').length == 6) {
      return address;
    }

    User? user = await getUser(address: address);
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
  if (env == ENV.dev || env == ENV.staging || env == ENV.local) {
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
