import * as LitJsSdk from '@lit-protocol/lit-node-client';
import * as siwe from 'siwe';
import { SignerType } from '../types';

const client = new LitJsSdk.LitNodeClient({
  debug: false,
  //   litNetwork: 'cayenne',
});

class Lit {
  private litNodeClient: any;
  private chain: string;
  private accessControlConditions: any[];
  private address: string;
  private signer: SignerType;

  constructor(signer: SignerType, address: string, chain: string) {
    this.signer = signer;
    this.address = address;
    this.chain = chain;

    /// Assumption: This access control works for scw also ( ie Suppport EIP-1271 )
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

  private async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  private async prepareAuthSig(signer: SignerType, address: string) {
    // const siweMessage = new siwe.SiweMessage('Creating Push Profile');
    const domain = 'push.org';
    const origin = 'https://app.push.org';
    const statement = 'Create Push Profile';
    const siweMessage = new siwe.SiweMessage({
      domain,
      address: address,
      statement,
      uri: origin,
      version: '1',
      chainId: 1,
    });
    const messageToSign = siweMessage.prepareMessage();

    // Sign the message and format the authSig
    const signature = await signer.signMessage(messageToSign as any);

    const authSig = {
      sig: signature,
      derivedVia: 'web3.eth.personal.sign',
      signedMessage: messageToSign,
      address: address,
    };
    return authSig;
  }

  public async encrypt(message: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    // const authSig = await LitJsSdk.checkAndSignAuthMessage({
    //   chain: this.chain,
    // });
    const authSig = await this.prepareAuthSig(this.signer, this.address);
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    );

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: this.accessControlConditions,
      symmetricKey,
      authSig,
      chain: this.chain,
    });

    return {
      encryptedString: Buffer.from(
        await encryptedString.arrayBuffer()
      ).toString('base64'),
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16'
      ),
      chain: this.chain,
    };
  }

  public async decrypt(
    encryptedString: string,
    encryptedSymmetricKey: string
  ): Promise<string> {
    if (!this.litNodeClient) {
      await this.connect();
    }
    // const authSig = await LitJsSdk.checkAndSignAuthMessage({
    //   chain: this.chain,
    // });
    const authSig = await this.prepareAuthSig(this.signer, this.address);

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: this.accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain: this.chain,
      authSig,
    });

    // Create a Buffer from the base64 string
    const buffer = Buffer.from(encryptedString, 'base64');
    const encryptedBlob = new Blob([buffer]);

    const decryptedString = await LitJsSdk.decryptString(
      encryptedBlob,
      symmetricKey
    );

    return decryptedString;
  }
}

export default Lit;
