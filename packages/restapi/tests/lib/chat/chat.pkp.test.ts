// Add polyfill for fetch in node environment
import 'isomorphic-fetch';
import 'dotenv/config';

import { ethers, providers, Signer } from 'ethers';
import {
  createPublicClient,
  hashMessage,
  http,
  isAddress,
  Hex,
  type Account,
} from 'viem';
import { sepolia } from 'viem/chains';
import { createKernelAccount, verifyEIP6492Signature } from '@zerodev/sdk';
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import { getEntryPoint, KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { privateKeyToAccount } from 'viem/accounts';
import CONSTANTS from '../../../src/lib/constantsV2';
import { IUser } from '../../../src/lib/types';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

// Import Lit Protocol libraries
import { LitActionResource, LitPKPResource } from '@lit-protocol/auth-helpers';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { LIT_ABILITY, LIT_NETWORK, LIT_RPC } from '@lit-protocol/constants';
import { ETHRequestSigningPayload } from '@lit-protocol/pkp-ethers/src/lib/pkp-ethers-types';
import { EthWalletProvider } from '@lit-protocol/lit-auth-client';
import { LitAccessControlConditionResource } from '@lit-protocol/auth-helpers';
import { AccessControlConditions } from '@lit-protocol/types';

// Import PGP library
import * as openpgp from 'openpgp';

// Constants
const SEPOLIA_RPC_URL =
  'https://sepolia.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8';
const RPC_URL =
  'https://boldest-lingering-mansion.ethereum-sepolia.quiknode.pro/4e8ff9604fe745a7e3667de33e5e66d196fa5778/';
const PKP_PUB_KEY =
  '0x04e48499f0f44c505a4275b2b6c83a771ef4579469ac8773daddbc0090f86d6ff9b961a9301b378afb793db3aeebe47ec3b56511f007ede8b7e10e1b3898905e51';
const NETWORK = LIT_NETWORK.DatilDev;
const MOCK_PRIVATE_KEY =
  '0x8665803180babd49f9e48194cf8f78e493a3d961d0d2685abc4b1a3771925ef8';
const MOCK_AUTH_PRIVATE_KEY =
  '0x0b21bb37586bc78fe9feab33efae4e5c11dd97d3aca9d60049cb3abf40f200fa';
const entryPoint = getEntryPoint('0.7');
const kernelVersion = KERNEL_V3_1;

// Define the CAIP validation function
const isValidSCWCAIP = (wallet: string): boolean => {
  try {
    const walletComponent = wallet.split(':');
    return (
      walletComponent.length === 4 &&
      walletComponent[0] === 'scw' &&
      walletComponent[1] === 'eip155' &&
      !isNaN(Number(walletComponent[2])) &&
      Number(walletComponent[2]) > 0 &&
      walletComponent[3].startsWith('0x')
    );
  } catch (err) {
    return false;
  }
};

// Define a custom signer class that wraps the ZeroDev kernel account
class KernelSigner extends Signer {
  private readonly kernelAccount: any;
  public override provider: providers.Provider;
  public isPKPWallet: boolean = true; // Flag to indicate this is a PKP wallet

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

describe('ZeroDev Smart Contract Wallet with Push Protocol Demo', () => {
  it.only('should create a smart contract wallet using PKP and initialize Push Protocol', async function (this: Mocha.Context) {
    this.timeout(120000); // Extend timeout for this test

    console.log(
      'Creating ZeroDev Smart Contract Wallet with PKP and Push Protocol demo...'
    );

    try {
      // ---- Lit Protocol Setup ----
      console.log('Connecting to Lit Node client...');
      const litNodeClient = new LitNodeClient({
        litNetwork: NETWORK,
        debug: false,
      });
      await litNodeClient.connect();
      console.log('Connected to Lit Node client');

      // Create authentication using a wallet
      const ethersWallet = new ethers.Wallet(
        MOCK_AUTH_PRIVATE_KEY,
        new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
      );

      const authMethod = await EthWalletProvider.authenticate({
        signer: ethersWallet,
        litNodeClient,
      });

      // Get PKP session signatures
      console.log('Getting PKP session signatures...');
      const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
        pkpPublicKey: PKP_PUB_KEY,
        chain: 'ethereum',
        authMethods: [authMethod],
        resourceAbilityRequests: [
          {
            resource: new LitActionResource('*'),
            ability: LIT_ABILITY.LitActionExecution,
          },
          {
            resource: new LitPKPResource('*'),
            ability: LIT_ABILITY.PKPSigning,
          },
        ],
      });

      // Initialize PKP wallet
      console.log('Initializing PKP wallet...');
      const pkpEthersWallet = new PKPEthersWallet({
        litNodeClient,
        pkpPubKey: PKP_PUB_KEY,
        controllerSessionSigs: pkpSessionSigs,
      });

      pkpEthersWallet.setRpc(SEPOLIA_RPC_URL);
      console.log('PKP wallet address:', pkpEthersWallet.address);

      // Tag the wallet as a PKP wallet for SDK detection
      (pkpEthersWallet as any).isPKPWallet = true;

      // ---- Patch PKP wallet for compatibility ----
      // Handle eth_accounts requests
      const _savedRequestFunc = pkpEthersWallet.request;
      // @ts-ignore
      pkpEthersWallet.request = async (payload: any) => {
        if (
          payload?.method === 'eth_accounts' ||
          payload?.method === 'eth_requestAccounts'
        ) {
          return [pkpEthersWallet.address];
        } else {
          return await _savedRequestFunc(payload as ETHRequestSigningPayload);
        }
      };

      // Enhance signMessage to handle hash messages and proper EIP-191 formatting
      const _savedSignMessage =
        pkpEthersWallet.signMessage.bind(pkpEthersWallet);
      pkpEthersWallet.signMessage = async (message: string | Uint8Array) => {
        const messageStr =
          typeof message === 'string'
            ? message
            : ethers.utils.toUtf8String(message);

        // For EIP-191 signing (used by Push Protocol)
        // Format: "\x19Ethereum Signed Message:\n" + message.length + message
        if (
          messageStr.startsWith('Enable Push Profile') ||
          messageStr.startsWith('Enable Push Chat Profile')
        ) {
          console.log(
            'Using EIP-191 signature for Push Protocol message:',
            messageStr
          );

          // Use session signatures to sign with the PKP
          const sigResponse = await litNodeClient.pkpSign({
            pubKey: PKP_PUB_KEY,
            toSign: ethers.utils.arrayify(ethers.utils.hashMessage(messageStr)),
            sessionSigs: pkpSessionSigs,
          });

          return sigResponse.signature;
        }

        // For normal messages and hash messages
        const isHash = messageStr.startsWith('0x') && messageStr.length === 66;
        if (isHash) {
          const sigResponse = await litNodeClient.pkpSign({
            pubKey: PKP_PUB_KEY,
            toSign: ethers.utils.arrayify(messageStr),
            sessionSigs: pkpSessionSigs,
          });
          return sigResponse.signature;
        }

        return _savedSignMessage(message);
      };

      // Add special handling for EIP-191 signatures used by Push Protocol
      pkpEthersWallet._signTypedData = async (
        domain: any,
        types: any,
        value: any
      ) => {
        // Implement if needed for Push Protocol
        throw new Error('_signTypedData not implemented for PKP wallet');
      };

      // ---- ZeroDev Smart Wallet Setup ----
      console.log('Setting up Viem public client...');
      const publicClient = createPublicClient({
        transport: http(),
        chain: sepolia,
      });

      // Create ECDSA validator with PKP wallet
      console.log('Creating ECDSA validator with PKP wallet...');
      const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
        // @ts-ignore
        signer: pkpEthersWallet,
        entryPoint,
        kernelVersion,
      });

      // Create kernel account
      console.log('Creating kernel account with PKP wallet...');
      const account = await createKernelAccount(publicClient, {
        plugins: {
          sudo: ecdsaValidator,
        },
        entryPoint,
        kernelVersion,
      });

      console.log('Smart Contract Wallet address:', account.address);

      // Test message signing
      console.log('Testing message signing with PKP wallet...');

      // Create CAIP address for Push Protocol
      const caipAddress = `scw:eip155:${publicClient.chain.id}:${account.address}`;
      console.log('CAIP-10 address:', caipAddress);
      const isValid = isValidSCWCAIP(caipAddress);
      console.log('Is valid CAIP address:', isValid);

      // ---- Push Protocol Initialization ----
      console.log('Initializing Push Protocol...');
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const kernelSigner = new KernelSigner(account, provider);

      try {
        // Initialize PushAPI with PKP wallet support and pre-generated PGP keys
        const user = await PushAPI.initialize(kernelSigner, {
          account: caipAddress,
          env: CONSTANTS.ENV.LOCAL,
          versionMeta: {
            SCWPGP_V1: {
              password: '123*Abcdefgh',
            },
          },
        });

        console.log('Push Protocol initialized successfully with PKP wallet!');
        console.log('User:', user.account);

        // Test sending a message - only if not in Guest mode
        if (user.decryptedPgpPvtKey) {
          const MESSAGE = 'Hey There!!!';
          const WALLET2 = ethers.Wallet.createRandom();
          const account2 = WALLET2.address;

          const response = await user.chat.send(account2, {
            content: MESSAGE,
          });

          console.log('Message sent successfully:', response);

          const signer2 = new ethers.Wallet(WALLET2.privateKey);
          const userBob = await PushAPI.initialize(signer2, {
            env: CONSTANTS.ENV.LOCAL,
          });

          const messagePayloads = await userBob.chat.history(account2);
          console.log(messagePayloads);

          const decryptedMessagePayloads = await userBob.chat.decrypt(
            messagePayloads
          );
          console.log('Decrypted message payloads:', decryptedMessagePayloads);

          let groupName = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
          });
          let groupDescription = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
          });

          const groupImage =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';

          const group = await user.chat.group.create(groupName, {
            description: groupDescription,
            image: groupImage,
            members: [],
            admins: [],
            private: false,
          });
          console.log(group);

          const requests = await user.chat.list('CHATS', {
            page: 1,
            limit: 10,
          });

          console.log(requests);

          await user.chat.group.add(group.chatId, {
            role: 'ADMIN',
            accounts: [account2],
          });
          // Accept Invite
          const updatedGroup1 = await userBob.chat.group.join(group.chatId);
          console.log(updatedGroup1);
          const updatedGroup2 = await user.chat.group.remove(group.chatId, {
            accounts: [account2],
          });
          console.log(updatedGroup2);

          const A = await user.notification.list('SPAM');
          console.log(A);
          const B = await userBob.notification.list('SPAM', {
            account: account.address,
          });
          console.log(B);
        } else {
          console.error('Cannot send message in Guest mode');
        }
      } catch (error: unknown) {
        console.error(
          'Error initializing Push Protocol:',
          error instanceof Error ? error.message : String(error)
        );

        // Log more details if available
        if (error instanceof Error && error.stack) {
          console.error('Error stack:', error.stack);
        }
      }
    } catch (error) {
      console.error('Error in demo:', error);
      throw error;
    }
  });
});
