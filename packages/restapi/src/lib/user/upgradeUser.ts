import { upgradeUserService, getAccountAddress, getWallet } from "../chat/helpers";
import Constants, {ENV} from "../constants";
import { isValidETHAddress, walletToPCAIP10, encryptPGPKey, preparePGPPublicKey, decryptPGPKey } from "../helpers";
import { SignerType, encryptedPrivateKeyType, IUser } from "../types";
import { get } from "./getUser";

export type UpgradeUserProps = {
  env?:  ENV;
  account?: string;
  signer: SignerType;
};

export const upgrade = async (
  options: UpgradeUserProps
) => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer = null
  } = options || {};

  if(signer == null) {
    throw new Error(`Signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);

  if (!isValidETHAddress(address)) {
    throw new Error(`Invalid address!`);
  }

  const user:IUser = await get({account: address, env: env});
  const caip10: string = walletToPCAIP10(address);
  const encryptionType: string = Constants.ENC_TYPE_V2;
  const publicKey: string = await preparePGPPublicKey(encryptionType, user.publicKey, address, wallet);
  const privateKey = await decryptPGPKey
  ({encryptedPGPPrivateKey: user.encryptedPrivateKey,
    account: address,
    signer: signer,
    env,
    toUpgrade: false
   });
  const encryptedPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(encryptionType, privateKey, address, wallet);

  const body = {
    user: caip10,
    wallet,
    name: user.name ? user.name : '',
    encryptedPassword: user.encryptedPassword,
    nftOwner: user.nftOwner,
    publicKey: publicKey,
    encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
    encryptionType: encryptionType,
    env
  };

  return upgradeUserService(body);
}