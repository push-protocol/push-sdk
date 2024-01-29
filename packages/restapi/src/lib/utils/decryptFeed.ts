import { ParsedResponseType } from "../types";
import { decryptViaPGP, aesDecryption } from "../payloads/encHelpers";
import { SUPPORTED_ENC_TYPE } from "../payloads/constants";

export async function decryptFeed(options:{feed:ParsedResponseType, decryptionKey: string}): Promise<ParsedResponseType| null> {
    // do case wise decryption
    const {feed, decryptionKey} = options || {};
    const secretComponents = feed.secret.split(":")
    if(secretComponents[0] == SUPPORTED_ENC_TYPE.PGPV1){
         return await decryptFeedViaPGP({encryptedFeed: feed, pgpPrivateKey: decryptionKey, encryptedSecret: secretComponents[1]})
    }
    return null;
}

export async function decryptFeedViaPGP(options: {
    encryptedFeed: ParsedResponseType,
    pgpPrivateKey: string,
    encryptedSecret: string
}) {
    const {encryptedFeed, pgpPrivateKey, encryptedSecret} = options|| {};
    const secret = await decryptViaPGP({cipherText: encryptedSecret, pgpPrivateKey: pgpPrivateKey})
    const decryptedFeed = decryptFeedViaAES({ encryptedFeed, secret})
    return decryptedFeed;
}

export function decryptFeedViaAES(options: {
    encryptedFeed: ParsedResponseType,
    secret: string
}) {
    const {encryptedFeed, secret} = options || {}
    const decryptedFeed: ParsedResponseType = {
        notification: {
          title: aesDecryption({encryptedMessage: encryptedFeed.notification.title, secret}),
          body: aesDecryption({encryptedMessage: encryptedFeed.notification.body, secret})
        },
        cta: encryptedFeed.cta? aesDecryption({encryptedMessage: encryptedFeed.cta, secret}) : '',
        title: encryptedFeed.title? aesDecryption({encryptedMessage: encryptedFeed.cta, secret}): '',
        icon: encryptedFeed.icon,
        url: encryptedFeed.url,
        sid: encryptedFeed.sid,
        app: encryptedFeed.app,
        blockchain: encryptedFeed.blockchain,
        message: encryptedFeed.message? aesDecryption({encryptedMessage: encryptedFeed.message, secret}) : '',
        image: encryptedFeed.image? aesDecryption({encryptedMessage: encryptedFeed.image, secret}): '',
        secret: ''
      }
  
      return decryptedFeed
}