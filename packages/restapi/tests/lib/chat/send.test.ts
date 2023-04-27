import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { create } from '../../../src/lib/user';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { upgrade } from '../../../src/lib/user/upgradeUser';
import { decryptPGPKey } from '../../../src/lib/helpers';
import { send, requests } from '../../../src/lib/chat';
chai.use(chaiAsPromised);

describe('PushAPI.chat.send', () => {
  const _env = Constants.ENV.DEV;
  const provider = ethers.getDefaultProvider(5);
  let _signer1: any;
  let walletAddress1: string;
  let account1: string;
  let _signer2: any;
  let walletAddress2: string;
  let account2: string;

  const MESSAGE = 'Hey There!!!';
  const MESSAGE2 = 'Hey There Upgraded User!!!';
  const MESSAGE3 = 'Hey There from Upgraded User!!!';

  const _nftSigner1 = new ethers.Wallet(
    `0x${process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_1']}`,
    provider
  );
  const _nftWalletAddress1 = _nftSigner1.address;
  const _nftAccount1 = `nft:eip155:${process.env['NFT_CHAIN_ID_1']}:${process.env['NFT_CONTRACT_ADDRESS_1']}:${process.env['NFT_TOKEN_ID_1']}`;
  const _nftSigner2 = new ethers.Wallet(
    `0x${process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_2']}`,
    provider
  );
  const _nftWalletAddress2 = _nftSigner2.address;
  const _nftAccount2 = `nft:eip155:${process.env['NFT_CHAIN_ID_2']}:${process.env['NFT_CONTRACT_ADDRESS_2']}:${process.env['NFT_TOKEN_ID_2']}`;

  beforeEach(() => {
    const WALLET1 = ethers.Wallet.createRandom();
    _signer1 = new ethers.Wallet(WALLET1.privateKey, provider);
    walletAddress1 = _signer1.address;
    account1 = `eip155:${walletAddress1}`;
    const WALLET2 = ethers.Wallet.createRandom();
    _signer2 = new ethers.Wallet(WALLET2.privateKey, provider);
    walletAddress2 = _signer2.address;
    account2 = `eip155:${walletAddress2}`;
  });

  it('W2W Profile to NFT Profile', async () => {
    await send({
      messageContent: MESSAGE,
      receiverAddress: _nftAccount1,
      account: account1,
      signer: _signer1,
      env: _env,
    });
  });
  it('NFT Profile to W2W Profile', async () => {
    await send({
      messageContent: MESSAGE,
      receiverAddress: account1,
      account: _nftAccount1,
      signer: _nftSigner1,
      env: _env,
    });
  });
  it('NFT Profile to NFT Profile', async () => {
    await send({
      messageContent: MESSAGE,
      receiverAddress: _nftAccount2,
      account: _nftAccount1,
      signer: _nftSigner1,
      env: _env,
    });
  });
  it('v1 W2W Profile to v1 W2W Profile', async () => {
    const user1 = await create({
      account: account1,
      env: _env,
      signer: _signer1,
      version: Constants.ENC_TYPE_V1,
    });
    const user2 = await create({
      account: account2,
      env: _env,
      signer: _signer2,
      version: Constants.ENC_TYPE_V1,
    });
    const user1PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user1.encryptedPrivateKey,
      signer: _signer1,
      env: _env,
      toUpgrade: false,
    });
    const user2PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user2.encryptedPrivateKey,
      signer: _signer2,
      env: _env,
      toUpgrade: false,
    });
    const msgRequest = await send({
      messageContent: MESSAGE,
      receiverAddress: walletAddress2,
      pgpPrivateKey: user1PrivatePGPKey,
      signer: _signer1,
      env: _env,
    });
    expect(msgRequest.encType).to.be.equal('pgp');
    const receivedMessage = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessage.messageContent).to.be.equal(MESSAGE);
  });
  it('v1 W2W Profile to v3 W2W Profile', async () => {
    const user1 = await create({
      account: account1,
      env: _env,
      signer: _signer1,
      version: Constants.ENC_TYPE_V1,
    });
    const user2 = await create({
      account: account2,
      env: _env,
      signer: _signer2,
      version: Constants.ENC_TYPE_V3,
    });
    const user1PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user1.encryptedPrivateKey,
      signer: _signer1,
      env: _env,
      toUpgrade: false,
    });
    const user2PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user2.encryptedPrivateKey,
      signer: _signer2,
      env: _env,
      toUpgrade: false,
    });
    const msgRequest = await send({
      messageContent: MESSAGE,
      receiverAddress: walletAddress2,
      pgpPrivateKey: user1PrivatePGPKey,
      signer: _signer1,
      env: _env,
    });
    expect(msgRequest.encType).to.be.equal('pgp');
    const receivedMessage = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessage.messageContent).to.be.equal(MESSAGE);
  });
  it('v3 W2W Profile to v1 W2W Profile', async () => {
    const user1 = await create({
      account: account1,
      env: _env,
      signer: _signer1,
      version: Constants.ENC_TYPE_V3,
    });
    const user2 = await create({
      account: account2,
      env: _env,
      signer: _signer2,
      version: Constants.ENC_TYPE_V1,
    });
    const user1PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user1.encryptedPrivateKey,
      signer: _signer1,
      env: _env,
      toUpgrade: false,
    });
    const user2PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user2.encryptedPrivateKey,
      signer: _signer2,
      env: _env,
      toUpgrade: false,
    });
    const msgRequest = await send({
      messageContent: MESSAGE,
      receiverAddress: walletAddress2,
      pgpPrivateKey: user1PrivatePGPKey,
      signer: _signer1,
      env: _env,
    });
    expect(msgRequest.encType).to.be.equal('pgp');
    const receivedMessage = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessage.messageContent).to.be.equal(MESSAGE);
  });
  it('v3 W2W Profile to v3 W2W Profile', async () => {
    const user1 = await create({
      account: account1,
      env: _env,
      signer: _signer1,
      version: Constants.ENC_TYPE_V3,
    });
    const user2 = await create({
      account: account2,
      env: _env,
      signer: _signer2,
      version: Constants.ENC_TYPE_V3,
    });
    const user1PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user1.encryptedPrivateKey,
      signer: _signer1,
      env: _env,
      toUpgrade: false,
    });
    const user2PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user2.encryptedPrivateKey,
      signer: _signer2,
      env: _env,
      toUpgrade: false,
    });
    const msgRequest = await send({
      messageContent: MESSAGE,
      receiverAddress: walletAddress2,
      pgpPrivateKey: user1PrivatePGPKey,
      signer: _signer1,
      env: _env,
    });
    expect(msgRequest.encType).to.be.equal('pgp');
    const receivedMessage = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessage.messageContent).to.be.equal(MESSAGE);
  });
  it('v1 W2W Profile to v1 W2W Profile(upgraded to v3 in between)', async () => {
    const user1 = await create({
      account: account1,
      env: _env,
      signer: _signer1,
      version: Constants.ENC_TYPE_V1,
    });
    const user2 = await create({
      account: account2,
      env: _env,
      signer: _signer2,
      version: Constants.ENC_TYPE_V1,
    });
    const user1PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user1.encryptedPrivateKey,
      signer: _signer1,
      env: _env,
      toUpgrade: false,
    });
    const user2PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user2.encryptedPrivateKey,
      signer: _signer2,
      env: _env,
      toUpgrade: false,
    });
    const msgRequest = await send({
      messageContent: MESSAGE,
      receiverAddress: walletAddress2,
      pgpPrivateKey: user1PrivatePGPKey,
      signer: _signer1,
      env: _env,
    });
    expect(msgRequest.encType).to.be.equal('pgp');
    const receivedMessage = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessage.messageContent).to.be.equal(MESSAGE);
    await upgrade({
      account: account2,
      env: _env,
      signer: _signer2,
    });
    // able to depcrypt after upgrade
    const receivedMessagePostUpdate = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessagePostUpdate.messageContent).to.be.equal(MESSAGE);
    // able to decrypt new messages post upgrade
    const msgRequest2 = await send({
      messageContent: MESSAGE2,
      receiverAddress: walletAddress2,
      pgpPrivateKey: user1PrivatePGPKey,
      signer: _signer1,
      env: _env,
    });
    expect(msgRequest2.encType).to.be.equal('pgp');
    const receivedMessagePostUpdate2 = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessagePostUpdate2.messageContent).to.be.equal(MESSAGE2);
  });
  it('v1 W2W Profile(upgraded to v3 in between) to v1 W2W Profile', async () => {
    const user1 = await create({
      account: account1,
      env: _env,
      signer: _signer1,
      version: Constants.ENC_TYPE_V1,
    });
    const user2 = await create({
      account: account2,
      env: _env,
      signer: _signer2,
      version: Constants.ENC_TYPE_V1,
    });
    const user1PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user1.encryptedPrivateKey,
      signer: _signer1,
      env: _env,
      toUpgrade: false,
    });
    const user2PrivatePGPKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user2.encryptedPrivateKey,
      signer: _signer2,
      env: _env,
      toUpgrade: false,
    });
    const msgRequest = await send({
      messageContent: MESSAGE,
      receiverAddress: walletAddress2,
      pgpPrivateKey: user1PrivatePGPKey,
      signer: _signer1,
      env: _env,
    });
    expect(msgRequest.encType).to.be.equal('pgp');
    const receivedMessage = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessage.messageContent).to.be.equal(MESSAGE);
    await upgrade({
      account: account1,
      env: _env,
      signer: _signer1,
    });
    // able to send after upgrade
    const msgRequest2 = await send({
      messageContent: MESSAGE3,
      receiverAddress: walletAddress2,
      pgpPrivateKey: user1PrivatePGPKey,
      signer: _signer1,
      env: _env,
    });
    expect(msgRequest2.encType).to.be.equal('pgp');
    const receivedMessagePostUpdate2 = (
      await requests({
        account: account2,
        pgpPrivateKey: user2PrivatePGPKey,
        toDecrypt: true,
        env: _env,
      })
    )[0].msg;
    expect(receivedMessagePostUpdate2.messageContent).to.be.equal(MESSAGE3);
  });
});
