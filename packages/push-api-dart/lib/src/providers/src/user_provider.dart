import 'package:riverpod/riverpod.dart';

import '../../../push_api_dart.dart';

final userProvider =
    StateNotifierProvider<UserProvider, User?>((ref) => UserProvider(ref));

final userEthWalletProvider = StateNotifierProvider<EthWalletProvider, Wallet?>(
    (ref) => EthWalletProvider(ref));

class UserProvider extends StateNotifier<User?> {
  StateNotifierProviderRef ref;
  UserProvider(this.ref, [super.state]);

  setCurrentUserByAddress(String address) async {
    state = await getUser(address: address);
  }

  setCurrentUser(User user) {
    state = user;
  }
}

class EthWalletProvider extends StateNotifier<Wallet?> {
  StateNotifierProviderRef ref;
  EthWalletProvider(this.ref, [super.state]);

  setCurrentUserEthWallet(Wallet wallet) async {
    state = wallet;

    await ref
        .read(userProvider.notifier)
        .setCurrentUserByAddress(wallet.address??'');
  }
}

User? getCachedUser() {
  return providerContainer.read(userProvider);
}

Wallet? getCachedWallet() {
  return providerContainer.read(userEthWalletProvider);
}
