import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import CONSTANTS from '../../../src/lib/constantsV2';

const env = CONSTANTS.ENV.DEV;
describe('PushAPI.encryption functionality', () => {
  let signer1: any;
  let account1: string;

  beforeEach(async () => {
    const WALLET1 = ethers.Wallet.createRandom();
    signer1 = new ethers.Wallet(WALLET1.privateKey);
    account1 = WALLET1.address;
  });

  it('Encryption.info', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
    });
    const response = await userAlice.encryption.info();
    expect(response.decryptedPgpPrivateKey).to.include(
      '-----BEGIN PGP PRIVATE KEY BLOCK-----\n'
    );
    expect(response.pgpPublicKey).to.be.include(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n'
    );
  });

  it('Encryption.info in Read Mode', async () => {
    // To make sure user exits
    await PushAPI.initialize(signer1, {
      env,
    });
    const readUserAlice = await PushAPI.initialize(undefined, {
      env,
      account: account1,
    });
    const response = await readUserAlice.encryption.info();
    expect(response.decryptedPgpPrivateKey).to.be.undefined;
    expect(response.pgpPublicKey).to.be.include(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n'
    );
  });

  it('Encryption.update | v1 -> v2', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1,
    });
    const res = await userAlice.info();
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2
    );
  });

  it('Encryption.update | v1 -> v3', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1,
    });
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3
    );
  });

  it('Encryption.update | v1 -> NFT_v1', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1,
    });
    await userAlice.encryption.update(
      CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1,
      {
        versionMeta: {
          NFTPGP_V1: {
            password: '#0123Test',
          },
        },
      }
    );
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1
    );
  });

  it('Encryption.update | v2 -> v1', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2,
    });
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1
    );
  });

  it('Encryption.update | v2 -> v3', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2,
    });
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3
    );
  });

  it('Encryption.update | v2 -> NFT_v1', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2,
    });
    await userAlice.encryption.update(
      CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1,
      {
        versionMeta: {
          NFTPGP_V1: {
            password: '#0123Test',
          },
        },
      }
    );
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1
    );
  });

  it('Encryption.update | v3 -> v1', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3,
    });
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1
    );
  });

  it('Encryption.update | v3 -> v2', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3,
    });
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2
    );
  });

  it('Encryption.update | v3 -> NFT_v1', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3,
    });
    await userAlice.encryption.update(
      CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1,
      {
        versionMeta: {
          NFTPGP_V1: {
            password: '#0123Test',
          },
        },
      }
    );
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1
    );
  });

  it('Encryption.update | NFT_v1 -> v1', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1,
    });
    const res = await userAlice.info();
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1
    );
  });

  it('Encryption.update | NFT_v1 -> v2', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1,
    });
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V2
    );
  });

  it('Encryption.update | NFT_v1 -> v3', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
      version: CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1,
    });
    await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3);
    const response = await userAlice.info();
    const encryptedPrivKey = JSON.parse(response.encryptedPrivateKey);
    expect(encryptedPrivKey.version).to.be.equal(
      CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3
    );
  });
});
