import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { ProgressHookType } from '../../../src/lib/types';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';

describe.only('PushAPI.initialize functionality', () => {
  let signer: ethers.Wallet;

  beforeEach(async () => {
    const provider = ethers.getDefaultProvider();
    const WALLET = ethers.Wallet.createRandom();
    signer = new ethers.Wallet(WALLET.privateKey, provider);
  });

  it('Should initialize new user', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    await PushAPI.initialize(signer, { progressHook: updateProgressInfo });
    const expectedHooks = [
      'PUSH-CREATE-01',
      'PUSH-CREATE-02',
      'PUSH-CREATE-03',
      'PUSH-CREATE-04',
      'PUSH-CREATE-05',
    ];
    expect(progressInfo.length).to.deep.equal(expectedHooks.length);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i].progressId).to.deep.equal(expectedHooks[i]);
    }
  });
  it('Should initialize already created user', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    // New User
    await PushAPI.initialize(signer);
    // Existing User
    await PushAPI.initialize(signer, { progressHook: updateProgressInfo });
    const expectedHooks = ['PUSH-DECRYPT-01', 'PUSH-DECRYPT-02'];
    expect(progressInfo.length).to.deep.equal(expectedHooks.length);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i].progressId).to.deep.equal(expectedHooks[i]);
    }
  });
  it('Should initialize nft user', async () => {
    const nftSigner = new ethers.Wallet(
      `0x${process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_1']}`
    );
    const nftAccount = `nft:eip155:${process.env['NFT_CHAIN_ID_1']}:${process.env['NFT_CONTRACT_ADDRESS_1']}:${process.env['NFT_TOKEN_ID_1']}`;

    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    // Already Existing NFT User
    await PushAPI.initialize(nftSigner, {
      account: nftAccount,
      progressHook: updateProgressInfo,
    });
    const expectedHooks = ['PUSH-DECRYPT-01', 'PUSH-DECRYPT-02'];
    expect(progressInfo.length).to.deep.equal(expectedHooks.length);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i].progressId).to.deep.equal(expectedHooks[i]);
    }
  });
  it('Should upgrade user on initialize', async () => {
    // Create V1 User
    await PushAPI.initialize(signer, {
      version: Constants.ENC_TYPE_V1,
    });
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    await PushAPI.initialize(signer, {
      progressHook: updateProgressInfo,
      version: Constants.ENC_TYPE_V1,
    });
    const expectedHooks = [
      'PUSH-DECRYPT-01',
      'PUSH-UPGRADE-02',
      'PUSH-AUTH-UPDATE-01',
      'PUSH-AUTH-UPDATE-02',
      'PUSH-AUTH-UPDATE-03',
      'PUSH-AUTH-UPDATE-04',
      'PUSH-UPGRADE-05',
      'PUSH-DECRYPT-02',
    ];
    expect(progressInfo.length).to.deep.equal(expectedHooks.length);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i].progressId).to.deep.equal(expectedHooks[i]);
    }
  });
  it('Should not upgrade user on initialize with autoupgrade flag false', async () => {
    // Create V1 User
    await PushAPI.initialize(signer, {
      version: Constants.ENC_TYPE_V1,
    });
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    await PushAPI.initialize(signer, {
      progressHook: updateProgressInfo,
      version: Constants.ENC_TYPE_V1,
      autoUpgrade: false,
    });
    const expectedHooks = ['PUSH-DECRYPT-01', 'PUSH-DECRYPT-02'];
    expect(progressInfo.length).to.deep.equal(expectedHooks.length);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i].progressId).to.deep.equal(expectedHooks[i]);
    }
  });
  it('Should not initialize on wrong version meta', async () => {
    const nftSigner = new ethers.Wallet(
      `0x${process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_1']}`
    );
    const nftAccount = `nft:eip155:${process.env['NFT_CHAIN_ID_1']}:${process.env['NFT_CONTRACT_ADDRESS_1']}:${process.env['NFT_TOKEN_ID_1']}`;

    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    // Already Existing NFT User
    await expect(
      PushAPI.initialize(nftSigner, {
        account: nftAccount,
        progressHook: updateProgressInfo,
        versionMeta: { NFTPGP_V1: { password: 'wrongpassword' } },
      })
    ).to.be.rejected;
  });
});
