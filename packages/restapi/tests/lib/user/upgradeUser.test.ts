import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { create, get } from '../../../src/lib/user';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { upgrade } from '../../../src/lib/user/upgradeUser';
import { decryptPGPKey } from '../../../src/lib/helpers';
chai.use(chaiAsPromised);

describe('Upgrade user keys', () => {
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
    await expect(upgrade({ account: 'any', signer: _signer, env: _env })).to.be
      .rejected;
  });
  it('upgrade user with Enc V1', async () => {
    const user = await create({
      account: account,
      env: _env,
      signer: _signer,
      version: Constants.ENC_TYPE_V1,
    });
    const upgradedUser = await upgrade({
      account: account,
      env: _env,
      signer: _signer,
    });
    expect(upgradedUser).to.be.an('object');
    expect(upgradedUser).not.to.be.null;
    expect(upgradedUser).not.to.be.undefined;
    expect(user.did).to.be.equal(upgradedUser.did);
    expect(user.wallets).to.be.equal(upgradedUser.wallets);
    expect(user.publicKey).to.be.equal(upgradedUser.publicKey);
    expect(upgradedUser.encryptedPrivateKey).to.contains(
      `"version":"${Constants.ENC_TYPE_V2}"`
    );
    expect(upgradedUser.encryptionType).to.be.equal(Constants.ENC_TYPE_V2);
    expect(user.encryptedPassword).to.be.equal(upgradedUser.encryptedPassword);
    expect(user.nftOwner).to.be.equal(upgradedUser.nftOwner);
    expect(user.profilePicture).to.be.equal(upgradedUser.profilePicture);
    expect(user.about).to.be.equal(upgradedUser.about);
    expect(user.name).to.be.equal(upgradedUser.name);
    const userPrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: _signer,
      env: _env,
      toUpgrade: false,
    });
    const upgradedUserPrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: upgradedUser.encryptedPrivateKey,
      signer: _signer,
      env: _env,
    });
    expect(userPrivatePGPKey).to.be.equal(upgradedUserPrivatePGPKey);
  });
  it('upgrade user with Enc V2', async () => {
    const user = await create({
      account: account,
      env: _env,
      signer: _signer,
    });
    const upgradedUser = await upgrade({
      account: account,
      env: _env,
      signer: _signer,
    });
    expect(upgradedUser).to.be.an('object');
    expect(upgradedUser).not.to.be.null;
    expect(upgradedUser).not.to.be.undefined;
    expect(user.did).to.be.equal(upgradedUser.did);
    expect(user.wallets).to.be.equal(upgradedUser.wallets);
    expect(user.publicKey).to.be.equal(upgradedUser.publicKey);
    expect(upgradedUser.encryptedPrivateKey).to.contains(
      `"version":"${Constants.ENC_TYPE_V2}"`
    );
    expect(upgradedUser.encryptionType).to.be.equal(Constants.ENC_TYPE_V2);
    expect(user.encryptedPassword).to.be.equal(upgradedUser.encryptedPassword);
    expect(user.nftOwner).to.be.equal(upgradedUser.nftOwner);
    expect(user.profilePicture).to.be.equal(upgradedUser.profilePicture);
    expect(user.about).to.be.equal(upgradedUser.about);
    expect(user.name).to.be.equal(upgradedUser.name);
    const userPrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: _signer,
      env: _env,
    });
    const upgradedUserPrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: upgradedUser.encryptedPrivateKey,
      signer: _signer,
      env: _env,
    });
    expect(userPrivatePGPKey).to.be.equal(upgradedUserPrivatePGPKey);
  });
  it('auto upgrade keys', async () => {
    const createdUser = await create({
      account: account,
      env: _env,
      signer: _signer,
      version: Constants.ENC_TYPE_V1,
    });
    expect(createdUser.encryptedPrivateKey).to.contains(
      `"version":"${Constants.ENC_TYPE_V1}"`
    );
    expect(createdUser.encryptionType).to.be.equal(Constants.ENC_TYPE_V1);
    const userPrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: createdUser.encryptedPrivateKey,
      signer: _signer,
      env: _env,
    });
    const user = await get({ account: account, env: _env });
    expect(user.encryptedPrivateKey).to.contains(
      `"version":"${Constants.ENC_TYPE_V2}"`
    );
    expect(user.encryptionType).to.be.equal(Constants.ENC_TYPE_V2);
    const upgradedPrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: _signer,
      env: _env,
    });
    expect(userPrivatePGPKey).to.be.equal(upgradedPrivatePGPKey);
  });
});
