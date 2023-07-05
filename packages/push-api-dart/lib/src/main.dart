import '../push_api_dart.dart';

initPush({ENV env = ENV.staging, Wallet? wallet}) async {
  providerContainer.read(envProvider.notifier).setEnv(env);

  if (wallet != null) {
    await providerContainer
        .read(userEthWalletProvider.notifier)
        .setCurrentUserEthWallet(wallet);
  }
}
