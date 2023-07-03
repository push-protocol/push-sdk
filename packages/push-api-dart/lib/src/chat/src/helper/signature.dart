Map<String, dynamic> getTypeInformation() {
  return {
    'Data': [
      {'name': 'data', 'type': 'string'}
    ],
  };
}

Map<String, dynamic> getDomainInformation(int chainId) {
  final chatVerifyingContract = '0x0000000000000000000000000000000000000000';
  return {
    'name': 'PUSH CHAT ID',
    'chainId': chainId,
    'verifyingContract': chatVerifyingContract,
  };
}
