import '../__lib.dart';

class ConnectMetaMaskScreen extends ConsumerWidget {
  const ConnectMetaMaskScreen({super.key});

  @override
  Widget build(BuildContext context, ref) {
    final uid = ref.watch(uidProvider);
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 64),
            const Text(
              'Push',
              style: TextStyle(
                  fontSize: 24,
                  color: Colors.purple,
                  fontWeight: FontWeight.w500),
            ),
            const Spacer(),
            if (uid != null) Center(child: Text('your uId is \n$uid')),
            const SizedBox(height: 64),
            Center(
              child: MaterialButton(
                color: Colors.purple,
                textColor: Colors.white,
                child: const Text('Create Account with mnemonics'),
                onPressed: () {
                  ref.read(uidProvider.notifier).logInWithMnemonics();
                },
              ),
            ),
            const SizedBox(height: 64),
            Center(
              child: MaterialButton(
                color: Colors.purple,
                textColor: Colors.white,
                child: const Text('Log in with  Metamask'),
                onPressed: () {
                  ref.read(uidProvider.notifier).logInWithEarthOne();
                },
              ),
            ),
            const SizedBox(height: 64),
            if (uid != null)
              Center(
                child: MaterialButton(
                  color: Colors.purple,
                  textColor: Colors.white,
                  child: const Text('Get user info'),
                  onPressed: () {
                    ref.read(uidProvider.notifier).onGetUser();
                  },
                ),
              ),
            const Spacer(),
          ],
        ),
      ),
    );
  }
}
