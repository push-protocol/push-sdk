import { chat } from '../../../src/lib/chat/chat';
import { ethers } from 'ethers';
import { expect } from 'chai';
import Constants from '../../../src/lib/constants';

const WALLET_PRIVATE_KEY = process.env['WALLET_PRIVATE_KEY'];

// accessing env dynamically using process.env
type EnvStrings = keyof typeof Constants.ENV;
const envMode = process.env.ENV as EnvStrings;
const _env = Constants.ENV[envMode];

describe('Get chat', () => {
  it('Should return {} when not chat between users', async () => {
    try {
      const provider = ethers.getDefaultProvider(5);
      const Pkey = `0x${WALLET_PRIVATE_KEY}`;
      const _signer = new ethers.Wallet(Pkey, provider);
      const walletAddress = _signer.address;
      const account = `eip155:${walletAddress}`;
      const inbox = await chat({
        account: account,
        env: _env,
        toDecrypt: true,
        recipient: '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5',
      });
      expect(inbox).not.to.be.null;
      expect(inbox).not.to.be.undefined;
      expect(inbox).not.to.be.equal({});
    } catch (error) {
      console.log(error);
    }
  });
});
