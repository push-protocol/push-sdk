import '../push_api_dart.dart';

initPush({
  ENV env = ENV.dev,
}) {
  providerContainer.read(envProvider.notifier).setEnv(env);
}
