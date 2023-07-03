import 'package:push_api_dart/push_api_dart.dart';

Future<String?> approve({
  required String senderAddress,
  String? accountAddress,
  String? pgpPrivateKey,
  status = 'Approved',
}) async {
  String? userDID;
  if (accountAddress == null) {
    //copy cached did
    userDID = getCachedUser()?.did;
  } else {
    userDID = await getUserDID(address: accountAddress);
  }

  if (userDID == null) {
    throw Exception('Account address is required.');
  }

  pgpPrivateKey ??= getCachedWallet()?.privateKey;

  if (pgpPrivateKey == null) {
    throw Exception('Private Key is required.');
  }

  final isGroup = !isValidETHAddress(senderAddress);

  late String fromDID, toDID;

  if (isGroup) {
    fromDID = await getUserDID(address: userDID);
    toDID = await getUserDID(address: senderAddress);
  } else {
    fromDID = await getUserDID(address: senderAddress);
    toDID = await getUserDID(address: userDID);
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
