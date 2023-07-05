import 'package:push_api_dart/push_api_dart.dart';

Future<String?> approve({
  required String senderAddress,
  String? account,
  Signer? signer,
  String? pgpPrivateKey,
  status = 'Approved',
}) async {
  if (account == null && signer == null) {
    throw Exception('At least one from account or signer is necessary!');
  }
  final wallet = getWallet(address: account, signer: signer);
  final address = getAccountAddress(wallet);

  if (pgpPrivateKey == null) {
    throw Exception('Private Key is required.');
  }

  final isGroup = !isValidETHAddress(senderAddress);

  late String fromDID, toDID;

  if (isGroup) {
    fromDID = await getUserDID(address: address);
    toDID = await getUserDID(address: senderAddress);
  } else {
    fromDID = await getUserDID(address: senderAddress);
    toDID = await getUserDID(address: address);
  }

  final bodyToBeHashed = {
    "fromDID": fromDID,
    "toDID": toDID,
    "status": status,
  };
  final hash = generateHash(bodyToBeHashed);

  //TODO add sign function parameter values
  final signature = await sign(
    message: hash,
    privateKey: pgpPrivateKey,
    publicKey: pgpPrivateKey,
  );

  final sigType = "pgp";
  final body = {
    "fromDID": fromDID,
    "toDID": toDID,
    "signature": signature,
    "status": status,
    "sigType": sigType,
    "verificationProof": '$sigType:$signature',
  };

  final result = await http.put(
    path: '/v1/chat/request/accept',
    data: body,
  );

  return result?['data'];
}
