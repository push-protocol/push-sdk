import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { send } from '../../../src/lib/chat';
chai.use(chaiAsPromised);

const ENV = Constants.ENV.DEV;

const getAccount = (pk: string, did: string) => {
  const privateKey = `0x${pk}`;
  const provider = ethers.getDefaultProvider(5);
  const signer = new ethers.Wallet(privateKey, provider);
  const address = signer.address;
  const caipAddress = `eip155:${address}`;
  return {
    signer,
    address,
    caipAddress,
    did,
  };
};

const ACCOUNT1 = getAccount(
  process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_1'] as string,
  process.env['NFT_DID_1'] as string
);
const ACCOUNT2 = getAccount(
  process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_2'] as string,
  process.env['NFT_DID_2'] as string
);

const MESSAGE_1 = 'Hey There NFT-NFT';
const MESSAGE_2 = 'Hey There NFT-WALLET';
const MESSAGE_3 = 'Hey There WALLET_NFT';

describe('Send Chat Message ( NFT TO NFT )', () => {
  it('NFT Profile sending msg to NFT Profile', async () => {
    //ACC 2 -> ACC 1
    await send({
      messageContent: MESSAGE_1,
      receiverAddress: ACCOUNT1.did,
      signer: ACCOUNT2.signer,
      toDID: ACCOUNT1.did,
      fromDID: ACCOUNT2.did,
      env: ENV,
    });
  });

  it('NFT Profile sending msg to Wallet Profile', async () => {
    //ACC 2 -> RANDOM ACC
    await send({
      messageContent: MESSAGE_2,
      receiverAddress: '0x9B28E6b3fbeD1C38bFF14DE2b05883ec426A3C80',
      signer: ACCOUNT2.signer,
      toDID: '0x9B28E6b3fbeD1C38bFF14DE2b05883ec426A3C80',
      fromDID: ACCOUNT2.did,
      env: ENV,
    });
  });

  it('Wallet Profile sending msg to NFT Profile', async () => {
    //ACC 1 ( wallet) -> ACC 2
    await send({
      messageContent: MESSAGE_3,
      receiverAddress: ACCOUNT2.did,
      signer: ACCOUNT1.signer,
      toDID: ACCOUNT2.did,
      fromDID: ACCOUNT1.caipAddress,
      env: ENV,
    });
  });
});
