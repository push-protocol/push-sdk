// Add polyfill for fetch in node environment
import 'isomorphic-fetch';
import 'dotenv/config';

import { ethers, providers, Signer } from 'ethers';
import {
  createPublicClient,
  http,
} from 'viem';
import { sepolia } from 'viem/chains';
import { createKernelAccount } from '@zerodev/sdk';
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import { getEntryPoint, KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import CONSTANTS from '../../../src/lib/constantsV2';
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


// ============= CONFIGURATION =============
// Network Configuration with fallback to public RPC URLs
const NETWORK_CONFIG = {
  SEPOLIA_RPC_URL: "placeholder"
};

// Lit Protocol Configuration
const LIT_CONFIG = {
  NETWORK: LIT_NETWORK.DatilDev,
  PKP_PUB_KEY: '0x04e48499f0f44c505a4275b2b6c83a771ef4579469ac8773daddbc0090f86d6ff9b961a9301b378afb793db3aeebe47ec3b56511f007ede8b7e10e1b3898905e51',
  MOCK_AUTH_PRIVATE_KEY: '0x0b21bb37586bc78fe9feab33efae4e5c11dd97d3aca9d60049cb3abf40f200fa',
};

// ZeroDev Configuration
const ZERODEV_CONFIG = {
  entryPoint: getEntryPoint('0.7'),
  kernelVersion: KERNEL_V3_1,
};

// Push Protocol Configuration - SEPOLIA with STAGING
const PUSH_CONFIG = {
  ENV: CONSTANTS.ENV.STAGING,
  CHAIN_ID: sepolia.id,
  VIEM_CHAIN: sepolia,
  RPC_URL: NETWORK_CONFIG.SEPOLIA_RPC_URL,
};

// ============= HELPER FUNCTIONS =============
// CAIP validation function
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

// Generate random group name and description
const generateGroupInfo = () => {
  return {
    name: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }),
    description: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }),
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  };
};

// Lit Protocol Setup Functions
async function setupLitProtocol() {
  console.log('Connecting to Lit Node client...');
  const litNodeClient = new LitNodeClient({
    litNetwork: LIT_CONFIG.NETWORK,
    debug: false,
  });
  await litNodeClient.connect();
  console.log('Connected to Lit Node client');

  // Create authentication using a wallet
  const ethersWallet = new ethers.Wallet(
    LIT_CONFIG.MOCK_AUTH_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
  );

  const authMethod = await EthWalletProvider.authenticate({
    signer: ethersWallet,
    litNodeClient,
  });

  // Get PKP session signatures
  console.log('Getting PKP session signatures...');
  const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
    pkpPublicKey: LIT_CONFIG.PKP_PUB_KEY,
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

  return { litNodeClient, pkpSessionSigs };
}

// Setup PKP Wallet with Push Protocol compatibility
async function setupPKPWallet(litNodeClient: LitNodeClient, pkpSessionSigs: any) {
  console.log('Initializing PKP wallet...');
  const pkpEthersWallet = new PKPEthersWallet({
    litNodeClient,
    pkpPubKey: LIT_CONFIG.PKP_PUB_KEY,
    controllerSessionSigs: pkpSessionSigs,
  });

  pkpEthersWallet.setRpc(PUSH_CONFIG.RPC_URL);
  console.log('PKP wallet address:', pkpEthersWallet.address);

  // Tag the wallet as a PKP wallet for SDK detection
  (pkpEthersWallet as any).isPKPWallet = true;

  // Patch PKP wallet for compatibility
  patchPKPWalletForCompatibility(pkpEthersWallet, litNodeClient, pkpSessionSigs);

  return pkpEthersWallet;
}

// Patch PKP wallet to handle various request types
function patchPKPWalletForCompatibility(
  pkpEthersWallet: PKPEthersWallet,
  litNodeClient: LitNodeClient,
  pkpSessionSigs: any
) {
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

  // Enhance signMessage for EIP-191 compatibility
  const _savedSignMessage = pkpEthersWallet.signMessage.bind(pkpEthersWallet);
  pkpEthersWallet.signMessage = async (message: string | Uint8Array) => {
    const messageStr =
      typeof message === 'string'
        ? message
        : ethers.utils.toUtf8String(message);

    // For EIP-191 signing (used by Push Protocol)
    if (
      messageStr.startsWith('Enable Push Profile') ||
      messageStr.startsWith('Enable Push Chat Profile')
    ) {
      console.log('Using EIP-191 signature for Push Protocol message:', messageStr);

      const sigResponse = await litNodeClient.pkpSign({
        pubKey: LIT_CONFIG.PKP_PUB_KEY,
        toSign: ethers.utils.arrayify(ethers.utils.hashMessage(messageStr)),
        sessionSigs: pkpSessionSigs,
      });

      return sigResponse.signature;
    }

    // For hash messages
    const isHash = messageStr.startsWith('0x') && messageStr.length === 66;
    if (isHash) {
      const sigResponse = await litNodeClient.pkpSign({
        pubKey: LIT_CONFIG.PKP_PUB_KEY,
        toSign: ethers.utils.arrayify(messageStr),
        sessionSigs: pkpSessionSigs,
      });
      return sigResponse.signature;
    }

    return _savedSignMessage(message);
  };

  // Add _signTypedData stub
  pkpEthersWallet._signTypedData = async (domain: any, types: any, value: any) => {
    throw new Error('_signTypedData not implemented for PKP wallet');
  };
}

// Setup ZeroDev Smart Contract Wallet
async function setupZeroDevWallet(pkpEthersWallet: PKPEthersWallet) {
  console.log('Setting up Viem public client...');
  const publicClient = createPublicClient({
    transport: http(),
    chain: PUSH_CONFIG.VIEM_CHAIN,
  });

  // Create ECDSA validator with PKP wallet
  console.log('Creating ECDSA validator with PKP wallet...');
  console.log('Using RPC:', PUSH_CONFIG.RPC_URL);
  console.log('Chain ID:', publicClient.chain.id);
  
  let ecdsaValidator;
  try {
    ecdsaValidator = await signerToEcdsaValidator(publicClient, {
      // @ts-ignore
      signer: pkpEthersWallet,
      entryPoint: ZERODEV_CONFIG.entryPoint,
      kernelVersion: ZERODEV_CONFIG.kernelVersion,
    });
    console.log('ECDSA validator created successfully');
  } catch (error) {
    console.error('Error creating ECDSA validator:', error);
    throw error;
  }

  // Create kernel account with explicit configuration for Sepolia
  console.log('Creating kernel account with PKP wallet...');
  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint: ZERODEV_CONFIG.entryPoint,
    kernelVersion: ZERODEV_CONFIG.kernelVersion,
    index: BigInt(0), // Explicitly set account index
  });

  console.log('Smart Contract Wallet address:', account.address);

  return { publicClient, account };
}

// Initialize Push Protocol
async function initializePushProtocol(account: any, publicClient: any) {
  const caipAddress = `scw:eip155:${publicClient.chain.id}:${account.address}`;
  console.log('CAIP-10 address:', caipAddress);
  console.log('Is valid CAIP address:', isValidSCWCAIP(caipAddress));

  console.log('Initializing Push Protocol...');
  const provider = new ethers.providers.JsonRpcProvider(PUSH_CONFIG.RPC_URL);
  const kernelSigner = new KernelSigner(account, provider);

  const user = await PushAPI.initialize(kernelSigner, {
    account: caipAddress,
    env: PUSH_CONFIG.ENV,
    versionMeta: {
      SCWPGP_V1: {
        password: '123*Abcdefgh',
      },
    },
  });

  console.log('Push Protocol initialized successfully with PKP wallet!');
  console.log('User:', user.account);

  return user;
}

// Test Push Protocol functionality
async function testPushProtocolFeatures(user: any) {
  if (!user.decryptedPgpPvtKey) {
    console.error('Cannot test features in Guest mode');
    return;
  }

  // Create test recipient
  const testWallet = ethers.Wallet.createRandom();
  const recipientAddress = testWallet.address;

  // Test sending a message
  const MESSAGE = 'Hey There!!!';
  const sendResponse = await user.chat.send(recipientAddress, {
    content: MESSAGE,
  });
  console.log('Message sent successfully:', sendResponse);

  // Initialize recipient
  const recipientSigner = new ethers.Wallet(testWallet.privateKey);
  const recipientUser = await PushAPI.initialize(recipientSigner, {
    env: PUSH_CONFIG.ENV,
  });

  // Accept chat request
  const acceptResponse = await recipientUser.chat.accept(user.account);
  console.log('Accept:', acceptResponse);

  // Get message history
  const messagePayloads = await recipientUser.chat.history(recipientAddress);
  console.log('Message payloads:', messagePayloads);

  const decryptedMessages = await recipientUser.chat.decrypt(messagePayloads);
  console.log('Decrypted messages:', decryptedMessages);

  // Test group creation
  const groupInfo = generateGroupInfo();
  const group = await user.chat.group.create(groupInfo.name, {
    description: groupInfo.description,
    image: groupInfo.image,
    members: [],
    admins: [],
    private: false,
  });
  console.log('Group created:', group);

  // Get chat requests
  const requests = await user.chat.list('CHATS', {
    page: 1,
    limit: 10,
  });
  console.log('Chat requests:', requests);

  // Test group member management
  await user.chat.group.add(group.chatId, {
    role: 'ADMIN',
    accounts: [recipientAddress],
  });

  const joinedGroup = await recipientUser.chat.group.join(group.chatId);
  console.log('Joined group:', joinedGroup);

  const updatedGroup = await user.chat.group.remove(group.chatId, {
    accounts: [recipientAddress],
  });
  console.log('Updated group after removal:', updatedGroup);

  // Test notifications
  const userNotifications = await user.notification.list('SPAM');
  console.log('User notifications:', userNotifications);

  const recipientNotifications = await recipientUser.notification.list('SPAM', {
    account: user.account,
  });
  console.log('Recipient notifications:', recipientNotifications);
}

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

// ============= MAIN TEST =============
describe('ZeroDev Smart Contract Wallet with Push Protocol Demo - Sepolia', () => {
  it.only('should create a smart contract wallet using PKP and initialize Push Protocol on Sepolia', async function (this: Mocha.Context) {
    this.timeout(300000); // Extend timeout to 5 minutes for network operations

    console.log(
      'Creating ZeroDev Smart Contract Wallet with PKP and Push Protocol demo on Sepolia...'
    );

    try {
      // ========== STEP 1: Lit Protocol Setup ==========
      const { litNodeClient, pkpSessionSigs } = await setupLitProtocol();

      // ========== STEP 2: PKP Wallet Setup ==========
      const pkpEthersWallet = await setupPKPWallet(litNodeClient, pkpSessionSigs);

      // ========== STEP 3: ZeroDev Smart Contract Wallet Setup ==========
      const { publicClient, account } = await setupZeroDevWallet(pkpEthersWallet);

      // ========== STEP 4: Push Protocol Initialization ==========
      const user = await initializePushProtocol(account, publicClient);

      // ========== STEP 5: Test Push Protocol Features ==========
      try {
        await testPushProtocolFeatures(user);
      } catch (error: unknown) {
        console.error(
          'Error during Push Protocol tests:',
          error instanceof Error ? error.message : String(error)
        );
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