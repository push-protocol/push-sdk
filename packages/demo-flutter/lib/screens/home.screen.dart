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
                child: const Text('Connect Metamask'),
                onPressed: () {
                  ref.read(uidProvider.notifier).logIn();
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
