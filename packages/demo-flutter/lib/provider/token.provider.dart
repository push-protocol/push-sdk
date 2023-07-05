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
    await push.getUser(address: state!);
  }

  logInWithEarthOne() async {
    final credentials =
        await earthoOne?.connectWithRedirect(AppKeys.earthOneAccessId);

    if (credentials == null) {
      return;
    } else {
      Map<String, dynamic> decodedToken =
          JwtDecoder.decode(credentials.idToken ?? '');

      final uid = decodedToken['user']['uid'];
      state = uid;
    }
  }

  logInWithMnemonics() async {
    const mnemonic =
        "wine album quarter custom birth great leisure bid gossip rabbit early choice";
    final walletMnemonic = Wallet.fromMnemonic(mnemonic);

    push.getUser(address: walletMnemonic.address ?? '');
  }

  testOopenGP() {
    const mnemonic =
        "wine album quarter custom birth great leisure bid gossip rabbit early choice";
    final wallet = Wallet.fromMnemonic(mnemonic);
    // push.createUser(
    //     wallet: push.EthWallet(
    //   address: wallet.address!,
    //   publicKey: wallet.publicKey,
    //   privateKey: wallet.privateKey,
    // ));
  }
}
