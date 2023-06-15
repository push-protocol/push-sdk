import 'package:eartho_one/eartho_one.dart';
import 'package:ethers/signers/wallet.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:push_api_dart/push_api_dart.dart' as push;
import '../__lib.dart';

final uidProvider =
    StateNotifierProvider<UidProvider, String?>((ref) => UidProvider(null));

class UidProvider extends StateNotifier<String?> {
  UidProvider(super.state) {
    init();
  }

  EarthoOne? earthoOne;

  init() {
    push.initPush();
    earthoOne = EarthoOne(
        clientId: AppKeys.earthOneClientId,
        clientSecret: AppKeys.earthOneClientSecret);

    earthoOne?.init();
  }

  onGetUser() async {
    await push.UserRepo.getUser(address: state!);
  }

  logInWithEarthOne() async {
    final credentials =
        await earthoOne?.connectWithRedirect(AppKeys.earthOneAccessId);

    if (credentials == null) {
      return;
    } else {
      Map<String, dynamic> decodedToken =
          JwtDecoder.decode(credentials.idToken ?? '');

      print(decodedToken['user']);

      final uid = decodedToken['user']['uid'];
      state = uid;
    }
  }

  logInWithMnemonics() async {
    // // Create a wallet instance from a mnemonic...
    const mnemonic =
        "wine album quarter custom birth great leisure bid gossip rabbit early choice";
    // "announce room limb pattern dry unit scale effort smooth jazz weasel alcohol";
    final walletMnemonic = Wallet.fromMnemonic(mnemonic);
    // // print('adderss: ${walletMnemonic.address}');
    // // print('privateKey: ${walletMnemonic.privateKey}');
    // // print('publicKey: ${walletMnemonic.publicKey}');

    // push.UserRepo.createUser(wallet: walletMnemonic);

    push.encrypt(
      push.generateRandomBytes(32),
      push.generateRandomBytes(32),
    );
  }
}
