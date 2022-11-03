import * as openpgp from 'openpgp';

export const generateKeyPair = async (): Promise<{ privateKeyArmored: string; publicKeyArmored: string }> => {
  const keys = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: '', email: '' }]
  })
  return {
    privateKeyArmored: keys.privateKey,
    publicKeyArmored: keys.publicKey
  }
}

export const pgpEncrypt = async ({
  plainText,
  toPublicKeyArmored,
  fromPublicKeyArmored
}: {
  plainText: string
  toPublicKeyArmored: string
  fromPublicKeyArmored: string
}): Promise<string> => {
  const toPublicKey: openpgp.Key = await openpgp.readKey({ armoredKey: toPublicKeyArmored })
  const fromPublicKey: openpgp.Key = await openpgp.readKey({ armoredKey: fromPublicKeyArmored })
  const message: openpgp.Message<string> = await openpgp.createMessage({ text: plainText })
  const encrypted: string = <string>await openpgp.encrypt({
    message: message,
    encryptionKeys: [toPublicKey, fromPublicKey]
  })
  return encrypted
}

export const sign = async ({ message, signingKey }: { message: string; signingKey: string }): Promise<string> => {
  const messageObject: openpgp.Message<string> = await openpgp.createMessage({ text: message })
  const privateKey: openpgp.PrivateKey = await openpgp.readPrivateKey({ armoredKey: signingKey })
  return <string>await openpgp.sign({ message: messageObject, signingKeys: privateKey, detached: true })
}

export const verifySignature = async ({
  messageContent,
  signatureArmored,
  publicKeyArmored
}: {
  messageContent: string
  signatureArmored: string
  publicKeyArmored: string
}): Promise<void> => {
  const message: openpgp.Message<string> = await openpgp.createMessage({ text: messageContent })
  const signature: openpgp.Signature = await openpgp.readSignature({
    armoredSignature: signatureArmored
  })
  const publicKey: openpgp.PublicKey = await openpgp.readKey({ armoredKey: publicKeyArmored })
  const verificationResult = await openpgp.verify({
    message,
    signature,
    verificationKeys: publicKey
  })
  const { verified } = verificationResult.signatures[0]
  try {
    await verified
  } catch (e) {
    throw new Error('Signature could not be verified: ' + e)
  }
}

export const pgpDecrypt = async ({
  cipherText,
  toPrivateKeyArmored
}: {
  cipherText: any
  toPrivateKeyArmored: string
}): Promise<string> => {
  const message = await openpgp.readMessage({ armoredMessage: cipherText })
  const privateKey: openpgp.PrivateKey = await openpgp.readPrivateKey({ armoredKey: toPrivateKeyArmored })

  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey
  })

  return decrypted as string
}
