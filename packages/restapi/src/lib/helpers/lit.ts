import * as LitJsSdk from '@lit-protocol/lit-node-client';
import * as siwe from 'siwe';
import { SignerType } from '../types';
import { ENV } from '../constants';
import { pCAIP10ToWallet } from './address';

export class Lit {
  public static LitInstance: Lit;
  private litNodeClient: LitJsSdk.LitNodeClient;
  private chain: string;
  private accessControlConditions: any[];
  private address: string;
  private signer: SignerType;

  private constructor(
    signer: SignerType,
    address: string,
    chain: string,
    litNodeClient: LitJsSdk.LitNodeClient
  ) {
    this.signer = signer;
    this.address = address;
    this.chain = chain;
    this.litNodeClient = litNodeClient;
    // Access control conditions for encryption and decryption
    // wallet owner can encrypt and decrypt
    this.accessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: this.chain,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: address,
        },
      },
    ];
  }

  private async prepareSCWAuthSig(signer: SignerType, address: string) {
    const domain = 'push.org';
    const origin = 'https://app.push.org';
    const statement = 'Create Push Profile';
    const siweMessage = new siwe.SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
    });
    const messageToSign = siweMessage.prepareMessage();

    // Sign the message and format the authSig
    const signature = await signer.signMessage(messageToSign as any);

    const authSig = {
      sig: signature,
      derivedVia: 'EIP1271',
      signedMessage: messageToSign,
      address,
    };
    return authSig;
  }

  public async encrypt(dataToEncrypt: string) {
    const authSig = await this.prepareSCWAuthSig(this.signer, this.address);
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions: this.accessControlConditions,
        authSig,
        chain: this.chain,
        dataToEncrypt,
      },
      this.litNodeClient
    );

    return {
      ciphertext,
      dataToEncryptHash,
    };
  }

  public async decrypt(
    ciphertext: string,
    dataToEncryptHash: string
  ): Promise<string> {
    const authSig = await this.prepareSCWAuthSig(this.signer, this.address);

    return LitJsSdk.decryptToString(
      {
        accessControlConditions: this.accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig,
        chain: this.chain,
      },
      this.litNodeClient
    );
  }

  public static async createInstance(
    signer: SignerType,
    address: string,
    chain: string,
    env: ENV = ENV.STAGING
  ) {
    if (!this.LitInstance) {
      const litNodeClient = new LitJsSdk.LitNodeClient({
        debug: false,
        litNetwork: env === ENV.PROD ? 'habanero' : 'manzano',
      });
      await litNodeClient.connect();
      this.LitInstance = new Lit(
        signer,
        pCAIP10ToWallet(address),
        chain,
        LitNodeClient
      );
    }
    return this.LitInstance;
  }
}
