import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO } from '../types';
import {
  groupDtoToSpaceDto
} from '../chat/helpers';


import { addMembers } from '../chat/addMembers';

export interface AddListenersToSpaceType extends EnvOptionsType {
  spaceId: string;
  listeners: Array<string>;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

export const addListeners = async (
  options: AddListenersToSpaceType
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
    const group = await addMembers({
      chatId: spaceId,
      members: listeners,
      account: account,
      signer: signer,
      env: env,
      pgpPrivateKey: pgpPrivateKey
    });

    return groupDtoToSpaceDto(group);
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${addListeners.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${addListeners.name} -: ${err}`
    );
  }
};
