import * as openpgp from 'openpgp';
import { generateKey } from 'openpgp/lightweight';

export const generateKeyPair = async (): Promise<{ privateKeyArmored: string; publicKeyArmored: string }> => {
  const keys = await generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: '', email: '' }]
  })
  return {
    privateKeyArmored: keys.privateKey,
    publicKeyArmored: keys.publicKey
  }
}