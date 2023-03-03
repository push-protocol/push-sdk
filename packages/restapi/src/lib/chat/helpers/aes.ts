import CryptoES from "crypto-es"

export const aesEncrypt = ({ plainText, secretKey }: { plainText: string; secretKey: string }): string => {
  return CryptoES.AES.encrypt(plainText, secretKey).toString()
}

export const aesDecrypt = ({ cipherText, secretKey }: { cipherText: string; secretKey: string }): string => {
  const bytes = CryptoES.AES.decrypt(cipherText, secretKey)
  return bytes.toString(CryptoES.enc.Utf8)
}

export const generateRandomSecret = (length: number): string => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}
