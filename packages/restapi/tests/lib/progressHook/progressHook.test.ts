import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { create, get } from '../../../src/lib/user';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { ProgressHookType, ProgressHookTypeFunction } from '../../../src';
chai.use(chaiAsPromised);
import PROGRESSHOOK from './progressHookData';
import { decryptPGPKey } from '../../../src/lib/helpers';
import { profileUpdate } from '../../../src/lib/user/profile.updateUser';

describe.only('ProgressHook Tests', () => {
  const _env = Constants.ENV.DEV;
  let provider = ethers.getDefaultProvider(5);
  let _signer: any;
  let walletAddress: string;
  let account: string;

  const _nftSigner1 = new ethers.Wallet(
    `0x${process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_1']}`,
    provider
  );
  const _nftWalletAddress1 = _nftSigner1.address.toLowerCase();
  const _nftAccount1 = `nft:eip155:${process.env['NFT_CHAIN_ID_1']}:${process.env['NFT_CONTRACT_ADDRESS_1']}:${process.env['NFT_TOKEN_ID_1']}`;

  beforeEach(() => {
    provider = ethers.getDefaultProvider(5);
    const WALLET = ethers.Wallet.createRandom();
    _signer = new ethers.Wallet(WALLET.privateKey, provider);
    walletAddress = _signer.address;
    account = `eip155:${walletAddress}`;
  });

  it('Create Push Profile Success ProgressHooks', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    await create({
      account: account,
      env: _env,
      signer: _signer,
      progressHook: updateProgressInfo,
    });
    const expectedHooks = [
      PROGRESSHOOK['PUSH-CREATE-01'],
      PROGRESSHOOK['PUSH-CREATE-02'],
      PROGRESSHOOK['PUSH-CREATE-03'],
      PROGRESSHOOK['PUSH-CREATE-04'],
      PROGRESSHOOK['PUSH-CREATE-05'],
    ];

    expect(progressInfo).to.have.lengthOf(5);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i]).to.deep.equal(expectedHooks[i]);
    }
  });
  it('Create Push Profile Error ProgressHooks', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    try {
      await create({
        account: _nftAccount1,
        env: _env,
        signer: _signer,
        progressHook: updateProgressInfo,
      });
      // throw error if reached here
      expect(true).to.equal(false);
    } catch (err) {
      const expectedHooks = [
        PROGRESSHOOK['PUSH-CREATE-01'],
        PROGRESSHOOK['PUSH-CREATE-02'],
        PROGRESSHOOK['PUSH-CREATE-03'],
        PROGRESSHOOK['PUSH-CREATE-04'],
      ];

      expect(progressInfo).to.have.lengthOf(5);
      for (let i = 0; i < progressInfo.length - 1; i++) {
        expect(progressInfo[i]).to.deep.equal(expectedHooks[i]);
      }
      const expectedErrorHook = {
        progressId: 'PUSH-ERROR-00',
        progressTitle: 'Non Specific Error',
        progressInfo:
          '[Push SDK] - API  - Error - API create() -: Error: [Push SDK] - API https://backend-dev.epns.io/apis/v2/users/: AxiosError: Request failed with status code 400',
        level: 'ERROR',
      };
      expect(progressInfo[4]).to.deep.equal(expectedErrorHook);
    }
  });
  it('Decrypt Push Profile Success ProgressHooks', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };

    await create({
      account: account,
      env: _env,
      signer: _signer,
    });
    const user = await get({
      account: account,
      env: _env,
    });
    await decryptPGPKey({
      account: user.did,
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      env: _env,
      signer: _signer,
      progressHook: updateProgressInfo,
    });
    const expectedHooks = [
      PROGRESSHOOK['PUSH-DECRYPT-01'],
      PROGRESSHOOK['PUSH-DECRYPT-02'],
    ];

    expect(progressInfo).to.have.lengthOf(2);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i]).to.deep.equal(expectedHooks[i]);
    }
  });
  it('Decrypt Push Profile Error ProgressHooks', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    try {
      await decryptPGPKey({
        account: account,
        encryptedPGPPrivateKey: 'random',
        env: _env,
        signer: _signer,
        progressHook: updateProgressInfo,
      });
      // throw error if reached here
      expect(true).to.equal(false);
    } catch (err) {
      expect(progressInfo).to.have.lengthOf(1);
      const expectedErrorHook = {
        progressId: 'PUSH-ERROR-00',
        progressTitle: 'Non Specific Error',
        progressInfo:
          '[Push SDK] - API  - Error - API decryptPGPKey() -: SyntaxError: Unexpected token r in JSON at position 0',
        level: 'ERROR',
      };
      expect(progressInfo[0]).to.deep.equal(expectedErrorHook);
    }
  });
  it.only('Profile Update Success ProgressHooks', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    const user = await create({
      account: account,
      env: _env,
      signer: _signer,
      version: Constants.ENC_TYPE_V1,
    });
    const pk = await decryptPGPKey({
      account: user.did,
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      env: _env,
      signer: _signer,
    });
    await profileUpdate({
      account: account,
      env: _env,
      pgpPrivateKey: pk,
      profile: {
        name: 'Updated Name',
        desc: 'Updated Desc',
      },
      progressHook: updateProgressInfo,
    });
    const expectedHooks = [
      PROGRESSHOOK['PUSH-PROFILE-UPDATE-01'],
      PROGRESSHOOK['PUSH-PROFILE-UPDATE-02'],
    ];
    expect(progressInfo).to.have.lengthOf(2);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i]).to.deep.equal(expectedHooks[i]);
    }
  });
  it('Profile Update Error ProgressHooks', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    const user = await create({
      account: account,
      env: _env,
      signer: _signer,
      version: Constants.ENC_TYPE_V1,
    });
    const pk = await decryptPGPKey({
      account: user.did,
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      env: _env,
      signer: _signer,
    });
    try {
      await profileUpdate({
        account: account,
        env: _env,
        pgpPrivateKey: 'random',
        profile: {
          name: 'Updated Name',
        },
        progressHook: updateProgressInfo,
      });
      // throw error if reached here
      expect(true).to.equal(false);
    } catch (err) {
      console.log(progressInfo);
      expect(progressInfo).to.have.lengthOf(1);
      const expectedErrorHook = {};
      expect(progressInfo[0]).to.deep.equal(expectedErrorHook);
    }
  });
  it.skip('Upgrade Push Profile Success ProgressHooks', async () => {
    const progressInfo: ProgressHookType[] = [];
    const updateProgressInfo = (info: ProgressHookType) => {
      progressInfo.push(info);
    };
    const user = await create({
      account: account,
      env: _env,
      signer: _signer,
      version: Constants.ENC_TYPE_V1,
    });
    await decryptPGPKey({
      account: account,
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      env: _env,
      signer: _signer,
      toUpgrade: true,
      progressHook: updateProgressInfo,
    });
    const expectedHooks = [
      PROGRESSHOOK['PUSH-DECRYPT-01'],
      PROGRESSHOOK['PUSH-UPGRADE-02'],
      (PROGRESSHOOK['PUSH-AUTH-UPDATE-01'] as ProgressHookTypeFunction)(
        'PGP_V3'
      ),
      (PROGRESSHOOK['PUSH-AUTH-UPDATE-02'] as ProgressHookTypeFunction)(
        'PGP_V3'
      ),
      PROGRESSHOOK['PUSH-AUTH-UPDATE-03'],
      PROGRESSHOOK['PUSH-AUTH-UPDATE-04'],
      PROGRESSHOOK['PUSH-UPGRADE-05'],
      PROGRESSHOOK['PUSH-DECRYPT-02'],
    ];
    expect(progressInfo).to.have.lengthOf(8);
    for (let i = 0; i < progressInfo.length; i++) {
      expect(progressInfo[i]).to.deep.equal(expectedHooks[i]);
    }
  });
});
