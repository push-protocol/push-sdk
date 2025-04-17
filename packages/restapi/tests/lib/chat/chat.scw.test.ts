import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { ethers } from 'ethers';
import CONSTANTS from '../../../src/lib/constantsV2';
import {
  createPublicClient,
  http,
  isAddress,
  type PublicClient,
  type HttpTransport,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { createKernelAccount } from '@zerodev/sdk';
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import { KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { Signer, providers } from 'ethers';
import { fetch, Request, Response, Headers } from 'undici'; // Re-import fetch and related objects
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

// Re-add Polyfill globalThis for viem in Node environment
globalThis.fetch = fetch as any;
globalThis.Request = Request as any;
globalThis.Response = Response as any;
globalThis.Headers = Headers as any;

const entryPoint07Address =
  '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' as const;

describe('PushAPI.chat functionality', () => {
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let userJohn: PushAPI;

  let signer1: KernelSigner;
  let account1: string;
  let signer2: ethers.Wallet;
  let account2: string;
  let signer3: ethers.Wallet;
  let account3: string;
  const MESSAGE = 'Hey There!!!';

  // Accessing env dynamically
  type EnvStrings = keyof typeof CONSTANTS.ENV;
  const envMode = (process.env.ENV || 'STAGING') as EnvStrings;
  const env = CONSTANTS.ENV[envMode];

  // Hardcoded RPC URL
  const RPC_URL =
    'https://boldest-lingering-mansion.ethereum-sepolia.quiknode.pro/4e8ff9604fe745a7e3667de33e5e66d196fa5778/';

  // Validate SCW CAIP-10 address
  const isValidSCWCAIP = (wallet: string): boolean => {
    try {
      const walletComponent = wallet.split(':');
      return (
        walletComponent.length === 4 &&
        walletComponent[0] === 'scw' &&
        walletComponent[1] === 'eip155' &&
        !isNaN(Number(walletComponent[2])) &&
        Number(walletComponent[2]) > 0 &&
        isAddress(walletComponent[3])
      );
    } catch (err) {
      return false;
    }
  };

  // Custom ethers.js Signer for Kernel account
  class KernelSigner extends Signer {
    private readonly kernelAccount: any; // Using any since we don't have the exact type
    public override provider: providers.Provider;

    constructor(account: any, provider: providers.Provider) {
      super();
      this.kernelAccount = account;
      this.provider = provider;
    }

    async getAddress(): Promise<string> {
      return this.kernelAccount.address;
    }

    async signMessage(message: string | Uint8Array): Promise<string> {
      return await this.kernelAccount.signMessage({
        message: typeof message === 'string' ? message : { raw: message },
      });
    }

    async signTypedData(domain: any, types: any, value: any): Promise<string> {
      const primaryType = Object.keys(types).find(
        (key) => key !== 'EIP712Domain'
      );
      if (!primaryType) {
        throw new Error('No primaryType found');
      }
      return await this.kernelAccount.signTypedData({
        domain,
        types,
        primaryType,
        message: value,
      });
    }

    async signTransaction(): Promise<string> {
      throw new Error('Transaction signing not supported for Kernel account');
    }

    connect(provider: providers.Provider): KernelSigner {
      return new KernelSigner(this.kernelAccount, provider);
    }
  }

  beforeEach(async () => {
    // Revert http transport call to default again
    const transport: HttpTransport = http(RPC_URL);
    const publicClient: PublicClient<HttpTransport, typeof sepolia> =
      createPublicClient({
        chain: sepolia,
        transport,
      });

    // Signer 1: ZeroDev Kernel account
    const WALLET1 = ethers.Wallet.createRandom();
    const viemSigner = privateKeyToAccount(WALLET1.privateKey as `0x${string}`);

    const entryPoint = {
      address: entryPoint07Address,
      version: '0.7' as const,
    };
    const kernelVersion = KERNEL_V3_1;

    const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
      signer: viemSigner,
      entryPoint,
      kernelVersion,
    });

    const account = await createKernelAccount(publicClient, {
      plugins: {
        sudo: ecdsaValidator,
      },
      entryPoint,
      kernelVersion,
    });

    // Generate and validate CAIP-10 address
    if (!publicClient.chain?.id) {
      throw new Error('Chain ID not available');
    }
    const caipAddress = `scw:eip155:${publicClient.chain.id}:${account.address}`;
    const isValid = isValidSCWCAIP(caipAddress);
    if (!isValid) {
      throw new Error('Invalid CAIP-10 address');
    }

    signer1 = new KernelSigner(account, new providers.JsonRpcProvider(RPC_URL));
    account1 = account.address;

    const WALLET2 = ethers.Wallet.createRandom();
    account2 = WALLET2.address;
    signer2 = new ethers.Wallet(WALLET2.privateKey);

    const WALLET3 = ethers.Wallet.createRandom();
    account3 = WALLET3.address;
    signer3 = new ethers.Wallet(WALLET3.privateKey);

    userAlice = await PushAPI.initialize(signer1, {
      account: caipAddress,
      env: env,
    });

    userBob = await PushAPI.initialize(signer2, { env });
    userJohn = await PushAPI.initialize(signer3, { env });
  });

  it.only('Should send chat message', async () => {
    const response = await userAlice.chat.send(account2, { content: MESSAGE });
    console.log(response);

    const messagePayloads = await userBob.chat.history(account2);
    console.log(messagePayloads);

    const decryptedMessagePayloads = await userBob.chat.decrypt(
      messagePayloads
    );

    console.log(decryptedMessagePayloads);

    let groupName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    let groupDescription = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    const groupImage =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';

    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [],
      private: false,
    });
    console.log(group);

    const requests = await userAlice.chat.list('CHATS', {
      page: 1,
      limit: 10,
    });

    console.log(requests);

    await userAlice.chat.group.add(group.chatId, {
      role: 'ADMIN',
      accounts: [account2],
    });
    // Accept Invite
    const updatedGroup1 = await userBob.chat.group.join(group.chatId);
    console.log(updatedGroup1);
    const updatedGroup2 = await userAlice.chat.group.remove(group.chatId, {
      accounts: [account2],
    });
    console.log(updatedGroup2);

    const A = await userAlice.notification.list('SPAM');
    console.log(A);
    const B = await userBob.notification.list('SPAM', {
      account: account1,
    });
    console.log(B);
  });
});
