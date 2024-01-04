import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO } from '../types';
import { groupDtoToSpaceDto, groupDtoToSpaceDtoV2 } from '../chat/helpers';
import { removeMembers } from '../chat/removeMembers';

export interface RemoveListenersFromSpaceType extends EnvOptionsType {
  spaceId: string;
  listeners: Array<string>;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

export const removeListeners = async (
  options: RemoveListenersFromSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
    listeners,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};
  try {
    const group = await removeMembers({
      chatId: spaceId,
      members: listeners,
      account: account,
      signer: signer,
      env: env,
      pgpPrivateKey: pgpPrivateKey,
    });

    return groupDtoToSpaceDtoV2(group, env);
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${removeListeners.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${removeListeners.name} -: ${err}`
    );
  }
};
