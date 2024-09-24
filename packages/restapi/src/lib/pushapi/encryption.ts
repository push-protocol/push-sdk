import { ENCRYPTION_TYPE, ENV } from '../constants';
import {
  IGetEncryptionResponseV1,
  IUpdateEncryptionOptions,
} from '../interfaces/iencryption';
import {
  GetUserEncryptionResponseV2,
  UpdateUserEncryptionRequestOptionsV2,
  UserResponseV2,
} from '../interfaces/v2/user';
import { SignerType, ProgressHookType, IUser } from '../types';
import * as PUSH_USER from '../user';
import { PushAPI } from './PushAPI';
import { createUserResponseV2, User } from './user';

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

    const info = async (options?: {
      raw?: boolean;
    }): Promise<IGetEncryptionResponseV1> => {
      let decryptedPassword;

      const userInfo = await this.userInstance.info();

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

      const responseV1: IGetEncryptionResponseV1 = {
        decryptedPgpPrivateKey: this.decryptedPgpPvtKey,
        pgpPublicKey: this.pgpPublicKey,
        ...(decryptedPassword !== undefined && decryptedPassword !== null
          ? { decryptedPassword: decryptedPassword }
          : {}),
      };
      return responseV1;
    };

    const infoV2 = async (): Promise<GetUserEncryptionResponseV2> => {
      let decryptedPassword;

      const userInfo = await this.userInstance.info();

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

      const responseV2: GetUserEncryptionResponseV2 = {
        pushPrivKey: this.decryptedPgpPvtKey,
        pushPubKey: this.pgpPublicKey,
        ...(decryptedPassword !== undefined && decryptedPassword !== null
          ? { decryptedPassword: decryptedPassword }
          : {}),
      };
      return responseV2;
    };

    (info as any).v2 = infoV2;
    this.info = info as any;

    const update = async (
      updatedEncryptionType: ENCRYPTION_TYPE,
      options?: IUpdateEncryptionOptions
    ): Promise<IUser> => {
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

      return user as IUser;
    };

    const updateV2 = async (
      updatedEncryptionType: ENCRYPTION_TYPE,
      options?: UpdateUserEncryptionRequestOptionsV2
    ): Promise<UserResponseV2> => {
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

      return createUserResponseV2(user, options?.raw ?? false);
    };

    (update as any).v2 = updateV2;
    this.update = update as any;
  }

  info!: {
    (options?: { raw?: boolean }): Promise<IGetEncryptionResponseV1>;
    v2(): Promise<GetUserEncryptionResponseV2>;
  };

  update!: {
    (
      updatedEncryptionType: ENCRYPTION_TYPE,
      options?: IUpdateEncryptionOptions
    ): Promise<IUser>;
    v2(
      updatedEncryptionType: ENCRYPTION_TYPE,
      options?: UpdateUserEncryptionRequestOptionsV2
    ): Promise<UserResponseV2>;
  };
}
