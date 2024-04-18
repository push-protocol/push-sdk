import { ENCRYPTION_TYPE, ENV } from '../constants';
import { SignerType, ProgressHookType } from '../types';
import * as PUSH_USER from '../user';
import { PushAPI } from './PushAPI';
import { User } from './user';

export class Encryption {
  private userInstance: User;

  constructor(
    private account: string,
    private env: ENV,
    private decryptedPgpPvtKey?: string,
    private pgpPublicKey?: string,
    private signer?: SignerType,
    private progressHook?: (progress: ProgressHookType) => void
  ) {
    this.userInstance = new User(this.account, this.env);
  }

  async info() {
    const userInfo = await this.userInstance.info();
    let decryptedPassword;
    if (this.signer) {
      decryptedPassword = await PUSH_USER.decryptAuth({
        account: this.account,
        env: this.env,
        signer: this.signer,
        progressHook: this.progressHook,
        additionalMeta: {
          NFTPGP_V1: {
            encryptedPassword: JSON.stringify(
              JSON.parse(userInfo.encryptedPrivateKey).encryptedPassword
            ),
          },
        },
      });
    }

    return {
      decryptedPgpPrivateKey: this.decryptedPgpPvtKey,
      pgpPublicKey: this.pgpPublicKey,
      ...(decryptedPassword !== undefined && decryptedPassword !== null
        ? { decryptedPassword: decryptedPassword }
        : {}),
    };
  }

  async update(
    updatedEncryptionType: ENCRYPTION_TYPE,
    options?: {
      versionMeta?: {
        NFTPGP_V1?: { password: string };
      };
    }
  ) {
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    if (!this.decryptedPgpPvtKey || !this.pgpPublicKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    return await PUSH_USER.auth.update({
      account: this.account,
      pgpEncryptionVersion: updatedEncryptionType,
      additionalMeta: options?.versionMeta,
      progressHook: this.progressHook,
      signer: this.signer,
      env: this.env,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      pgpPublicKey: this.pgpPublicKey,
    });
  }
}
