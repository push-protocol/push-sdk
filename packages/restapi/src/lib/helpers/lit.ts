// import * as LitJsSdk from '@lit-protocol/lit-node-client';

// class Lit {
//   private litNodeClient: LitJsSdk.LitNodeClient;
//   private chain: string;
//   private accessControlConditions: any[];

//   constructor(address: string, chain: string) {
//     this.litNodeClient = new LitJsSdk.LitNodeClient({});
//     this.chain = chain;

//     /// Assumption: This access control works for scw also ( ie Suppport EIP-1271 )
//     this.accessControlConditions = [
//       {
//         contractAddress: '',
//         standardContractType: '',
//         chain: this.chain,
//         method: '',
//         parameters: [':userAddress'],
//         returnValueTest: {
//           comparator: '=',
//           value: address,
//         },
//       },
//     ];
//   }

//   private async connect() {
//     this.litNodeClient.connect();
//   }

//   public async encrypt(message: string) {
//     if (!this.litNodeClient) {
//       await this.connect();
//     }

//     const authSig = await LitJsSdk.checkAndSignAuthMessage({
//       chain: this.chain,
//     });
//     const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
//       message
//     );

//     const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
//       accessControlConditions: this.accessControlConditions,
//       symmetricKey,
//       authSig,
//       chain: this.chain,
//     });

//     return {
//       encryptedString,
//       encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
//         encryptedSymmetricKey,
//         'base16'
//       ),
//       chain: this.chain,
//     };
//   }

//   public async decrypt(
//     encryptedString: Blob,
//     encryptedSymmetricKey: string
//   ): Promise<string> {
//     if (!this.litNodeClient) {
//       await this.connect();
//     }

//     const authSig = await LitJsSdk.checkAndSignAuthMessage({
//       chain: this.chain,
//     });
//     const symmetricKey = await this.litNodeClient.getEncryptionKey({
//       accessControlConditions: this.accessControlConditions,
//       toDecrypt: encryptedSymmetricKey,
//       chain: this.chain,
//       authSig,
//     });

//     const decryptedString = await LitJsSdk.decryptString(
//       encryptedString,
//       symmetricKey
//     );

//     return decryptedString;
//   }
// }

// export default Lit;
