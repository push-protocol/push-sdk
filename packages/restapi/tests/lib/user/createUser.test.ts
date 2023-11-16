import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { create } from '../../../src/lib/user';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import CONSTANTS from '../../../src/lib/constantsV2';

chai.use(chaiAsPromised);

describe('Create Push Profile', () => {
  const _env = CONSTANTS.ENV.DEV;
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
    provider = ethers.getDefaultProvider(11155111);
    const WALLET = ethers.Wallet.createRandom();
    _signer = new ethers.Wallet(WALLET.privateKey, provider);
    walletAddress = _signer.address;
    account = `eip155:${walletAddress}`;
  });

  it('should throw error for invalid inputs', async () => {
    await expect(create({ env: _env })).to.be.rejected;
    await expect(create({ account: 'any', env: _env })).to.be.rejected;
    await expect(create({ account: account, env: _env, version: 'any' })).to.be
      .rejected;
  });
  it('Push Profile V1', async () => {
    const user = await create({
      account: account,
      env: _env,
      signer: _signer,
      version: Constants.ENC_TYPE_V1,
    });
    expect(user).to.be.an('object');
    expect(user).not.to.be.null;
    expect(user).not.to.be.undefined;
    expect(user.did).to.be.equal(account);
    expect(user.wallets).to.be.equal(account);
    expect(user.publicKey).to.contains(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n'
    );
    expect(user.encryptedPrivateKey).to.contains(
      `"version":"${Constants.ENC_TYPE_V1}"`
    );
    expect(user.profile.name).to.be.null;
    expect(user.profile.desc).to.be.null;
    expect(user.profile.picture).to.contains('data:image/png;base64,');

    expect(user.msgSent).to.be.equal(0);
  });
  it('Push Profile V3', async () => {
    const user = await create({
      account: account,
      env: _env,
      signer: _signer,
    });
    expect(user).to.be.an('object');
    expect(user).not.to.be.null;
    expect(user).not.to.be.undefined;
    expect(user.did).to.be.equal(account);
    expect(user.wallets).to.be.equal(account);
    expect(user.publicKey).to.contains(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n'
    );
    expect(user.encryptedPrivateKey).to.contains(
      `"version":"${Constants.ENC_TYPE_V3}"`
    );
    expect(user.profile.name).to.be.null;
    expect(user.profile.desc).to.be.null;
    expect(user.profile.picture).to.contains('data:image/png;base64,');
    expect(user.msgSent).to.be.equal(0);
  });
  it('Push Profile V4 ( NFT Profile )', async () => {
    const user = await create({
      account: _nftAccount1,
      env: _env,
      signer: _nftSigner1,
    });
    expect(user).to.be.an('object');
    expect(user).not.to.be.null;
    expect(user).not.to.be.undefined;
    expect(user.did).to.contains(_nftAccount1);
    expect(user.wallets).to.contains(_nftAccount1);
    expect(user.publicKey).to.contains(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n'
    );
    expect(user.encryptedPrivateKey).to.contains(
      `"version":"${Constants.ENC_TYPE_V4}"`
    );
    expect(user.profile.name).to.be.null;
    expect(user.profile.desc).to.be.null;
    expect(user.profile.picture).to.contains('data:image/png;base64,');

    expect(user.msgSent).to.be.equal(0);
  });
});
