import 'package:riverpod/riverpod.dart';

enum ENV {
  prod,
  staging,
  dev,
  local,
}

final envProvider =
    StateNotifierProvider<EnvProvider, ENV>((ref) => EnvProvider(ENV.staging));

class EnvProvider extends StateNotifier<ENV> {
  EnvProvider(super.state);

  setEnv(ENV newValue) {
    state = newValue;
  }
}
