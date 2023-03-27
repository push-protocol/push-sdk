import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { create } from '../../../src/lib/user';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
chai.use(chaiAsPromised);

describe('Create user', () => {
  const _env = Constants.ENV.DEV;
  let provider = ethers.getDefaultProvider(5);
  let _signer: any;
  let walletAddress: string;
  let account: string;
  beforeEach(() => {
    provider = ethers.getDefaultProvider(5);
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
  it('create user with Enc V1', async () => {
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
    expect(user.encryptionType).to.be.equal(Constants.ENC_TYPE_V1);
    expect(user.encryptedPassword).to.be.null;
    expect(user.nftOwner).to.be.null;
    expect(user.profilePicture).to.contains('data:image/png;base64,');
    expect(user.about).to.be.null;
    expect(user.name).to.be.null;
    expect(user.numMsg).to.be.equal(0);
    expect(user.linkedListHash).to.be.equal('');
  });
  it('create user with Enc V2', async () => {
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
      `"version":"${Constants.ENC_TYPE_V2}"`
    );
    expect(user.encryptionType).to.be.equal(Constants.ENC_TYPE_V2);
    expect(user.encryptedPassword).to.be.null;
    expect(user.nftOwner).to.be.null;
    expect(user.profilePicture).to.contains('data:image/png;base64,');
    expect(user.about).to.be.null;
    expect(user.name).to.be.null;
    expect(user.numMsg).to.be.equal(0);
    expect(user.linkedListHash).to.be.equal('');
  });
});
