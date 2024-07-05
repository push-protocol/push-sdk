import { ENCRYPTION_TYPE, ENV } from '../constants';
import {
  IGetEncryptionResponse,
  IGetEncryptionResponseV1,
  IGetEncryptionResponseV2,
  IUpdateEncryptionOptions,
} from '../interfaces/iencryption';
import { IUserInfoResponse } from '../interfaces/iuser';
import { SignerType, ProgressHookType, IUser } from '../types';
import * as PUSH_USER from '../user';
import { PushAPI } from './PushAPI';
import { User, handleUserVersionedResponse, isIUser } from './user';

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

  async info(options?: {
    raw?: boolean;
    version?: number;
  }): Promise<IGetEncryptionResponse> {
    const { version = 1 } = options || {};
    let decryptedPassword;

    const userInfo = await this.userInstance.info();

    if (this.signer && isIUser(userInfo)) {
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

    if (version === 2) {
      const responseV2: IGetEncryptionResponseV2 = {
        pushPrivKey: this.decryptedPgpPvtKey,
        pushPubKey: this.pgpPublicKey,
        ...(decryptedPassword !== undefined && decryptedPassword !== null
          ? { decryptedPassword: decryptedPassword }
          : {}),
      };
      return responseV2;
    }

    const responseV1: IGetEncryptionResponseV1 = {
      decryptedPgpPrivateKey: this.decryptedPgpPvtKey,
      pgpPublicKey: this.pgpPublicKey,
      ...(decryptedPassword !== undefined && decryptedPassword !== null
        ? { decryptedPassword: decryptedPassword }
        : {}),
    };
    return responseV1;
  }

  async update(
    updatedEncryptionType: ENCRYPTION_TYPE,
    options?: IUpdateEncryptionOptions
  ): Promise<IUserInfoResponse> {
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    if (!this.decryptedPgpPvtKey || !this.pgpPublicKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    const user = await PUSH_USER.auth.update({
      account: this.account,
      pgpEncryptionVersion: updatedEncryptionType,
      additionalMeta: options?.versionMeta,
      progressHook: this.progressHook,
      signer: this.signer,
      env: this.env,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      pgpPublicKey: this.pgpPublicKey,
    });

    return handleUserVersionedResponse(user, options || {});
  }
}
