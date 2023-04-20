import { expect } from 'chai';
import { create, get } from '../../../src/lib/user';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';

describe('Get user', () => {
  const _env = Constants.ENV.DEV;
  let provider = ethers.getDefaultProvider(5);
  let Pkey: string;
  let _signer: any;
  let walletAddress: string;
  let account: string;
  beforeEach(() => {
    provider = ethers.getDefaultProvider(5);
    const WALLET = ethers.Wallet.createRandom();
    Pkey = WALLET.privateKey;
    _signer = new ethers.Wallet(Pkey, provider);
    walletAddress = _signer.address;
    account = `eip155:${walletAddress}`;
  });

  it('get non-existing user', async () => {
    const user = await get({
      account: account,
      env: _env,
    });
    expect(user).to.be.null;
  });

  it('get existing Wallet Profile', async () => {
    await create({
      account: account,
      env: _env,
      signer: _signer,
    });
    const user = await get({
      account: account,
      env: _env,
    });
    expect(user).to.be.an('object');
    expect(user).not.to.be.null;
    expect(user).not.to.be.undefined;
    expect(user.did).to.be.equal(account);
    expect(user.wallets).to.be.equal(account);
    expect(user.publicKey).to.contains(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n'
    );
    expect(user.encryptedPrivateKey).to.satisfy((value: string) => {
      return (
        value.includes(`"version":"${Constants.ENC_TYPE_V1}"`) ||
        value.includes(`"version":"${Constants.ENC_TYPE_V2}"`) ||
        value.includes(`"version":"${Constants.ENC_TYPE_V3}"`)
      );
    });
    expect(user.profilePicture).to.contains('data:image/png;base64,');
  });

  it('get existing NFT Profile', async () => {
    const user = await get({
      account: process.env['NFT_DID_1'] as string,
      env: _env,
    });
    expect(user).to.be.an('object');
    expect(user).not.to.be.null;
    expect(user).not.to.be.undefined;
    expect(user.did.toLowerCase()).to.be.equal(
      (process.env['NFT_DID_1'] as string).toLowerCase()
    );
    expect(user.wallets.toLowerCase()).to.be.equal(
      (process.env['NFT_DID_1'] as string).toLowerCase()
    );
    expect(user.publicKey).to.contains(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n'
    );
    expect(user.encryptedPrivateKey).to.satisfy((value: string) => {
      return (
        value.includes(`"version":"${Constants.ENC_TYPE_V1}"`) ||
        value.includes(`"version":"${Constants.ENC_TYPE_V2}"`) ||
        value.includes(`"version":"${Constants.ENC_TYPE_V3}"`)
      );
    });
    expect(user.profilePicture).to.contains('data:image/png;base64,');
    expect(user.nfts).to.be.an('array');
  });
});
