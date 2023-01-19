import { ethers, Signer } from 'ethers';
import { abis } from '../config';
import Constants from '../constants';
import { getConfig, isValidETHAddress } from '../helpers';

export type AddDelegateOptionsType = {
  signer: Signer;
  delegateAddress: string;
  env?: string;
};

export const addDelegate = async (options: AddDelegateOptionsType) => {
  const { signer, delegateAddress, env = Constants.ENV.PROD } = options || {};
  const networkId: number = await signer.getChainId();
  const { EPNS_COMMUNICATOR_CONTRACT } = getConfig(env, {
    blockchain: 'eip155',
    networkId: networkId.toString(),
  });
  try {
    if (!isValidETHAddress(delegateAddress)) {
      throw new Error(`Invalid address!`);
    }
    const communicatorSignerInstance = new ethers.Contract(
      EPNS_COMMUNICATOR_CONTRACT,
      abis.epnsComm,
      signer
    );
    console.log(communicatorSignerInstance)
    return communicatorSignerInstance['addDelegate'](delegateAddress);
  } catch (err) {
    console.error(`[EPNS-SDK] - Contract ${EPNS_COMMUNICATOR_CONTRACT}: `, err);
    throw Error(`[EPNS-SDK] - Contract ${EPNS_COMMUNICATOR_CONTRACT}: ${err}`);
  }
};

