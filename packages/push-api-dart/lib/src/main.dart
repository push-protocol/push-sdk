import 'package:push_api_dart/src/providers/src/user_provider.dart';

import '../push_api_dart.dart';

initPush({ENV env = ENV.staging, EthWallet? wallet}) async {
  providerContainer.read(envProvider.notifier).setEnv(env);

  if (wallet != null) {
    await providerContainer
        .read(userEthWalletProvider.notifier)
        .setCurrentUserEthWallet(wallet);
  }
}
