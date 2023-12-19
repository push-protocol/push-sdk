import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { createUserWithProfile } from '../../../src/lib/user';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import CONSTANTS from '../../../src/lib/constantsV2';

chai.use(chaiAsPromised);

describe('Create Push Profile with Profile update', () => {
  const _env = CONSTANTS.ENV.DEV;
  let provider = ethers.getDefaultProvider(5);
  let _signer: any;
  let walletAddress: string;
  let account: string;

  beforeEach(() => {
    provider = ethers.getDefaultProvider(11155111);
    const WALLET = ethers.Wallet.createRandom();
    _signer = new ethers.Wallet(WALLET.privateKey, provider);
    walletAddress = _signer.address;
    account = `eip155:${walletAddress}`;
  });

  it('Push Profile V3', async () => {
    const name = 'John';
    const desc = 'He is web3 dev';
    const picture =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvUlEQVR4AcXBsa3CMBiF0Y+rFNarM0Jqi1EoU2QIj+IxPACTuGYEBnAH7Q+FI/SKe87lflxfGAkzYSbMFr7kMoh6TUTb2ph5PHeiXAZRr4lImAkzYbbkMoh6TUTb2vjFtjaiXneiXAaRMBNmwmzhxN9xI+o1MZPL4ENNzAgzYSbMFk70mohyGcz0mviFMBNmwmzhxLY2Pt2Y2dZG9HjuzAgzYSbMLvfj+mIil8F/9JqYEWbCTJgJM2EmzITZG0wkJb/EapQdAAAAAElFTkSuQmCC';
    const user = await createUserWithProfile({
      account: account,
      env: _env,
      signer: _signer,
      profile: {
        name: name,
        desc: desc,
        picture: picture,
      },
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
    expect(user.profile.name).to.be.equal(name);
    expect(user.profile.desc).to.be.equal(desc);
    expect(user.profile.picture).to.be.equal(picture);
    expect(user.msgSent).to.be.equal(0);
  });
});
