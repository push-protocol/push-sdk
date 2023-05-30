import Constants from '../constants';
import {
  EnvOptionsType,
  SignerType,
  SpaceDTO
} from '../types';
import {
  groupDtoToSpaceDto
} from './../chat/helpers';
import {
    removeAdminsFromGroup
} from '../chat/removeAdminsFromGroup';
export interface RemoveAdminsFromSpaceType extends EnvOptionsType {
  spaceId: string;
  admins: Array < string > ;
  account ? : string;
  signer ? : SignerType;
  pgpPrivateKey ? : string;
}

export const removeAdminsFromSpace = async (
  options: RemoveAdminsFromSpaceType
): Promise < SpaceDTO > => {
  const {
      spaceId,
      admins,
      account = null,
      signer = null,
      env = Constants.ENV.PROD,
      pgpPrivateKey = null,
  } = options || {};
  try {
      const group = await removeAdminsFromGroup({
        chatId: spaceId,
        admins: admins,
        account: account,
        signer: signer,
        env: env,
        pgpPrivateKey: pgpPrivateKey
      });

      return groupDtoToSpaceDto(group);
  } catch (err) {
      console.error(
          `[Push SDK] - API  - Error - API ${removeAdminsFromSpace.name} -:  `,
          err
      );
      throw Error(
          `[Push SDK] - API  - Error - API ${removeAdminsFromSpace.name} -: ${err}`
      );
  }
};