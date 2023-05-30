import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO } from '../types';
import {
  groupDtoToSpaceDto
} from './../chat/helpers';


import { addMembersToGroup } from '../chat/addMembersToGroup';

export interface AddMembersToSpaceType extends EnvOptionsType {
  spaceId: string;
  members: Array<string>;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

export const addMembersToSpace = async (
  options: AddMembersToSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
    members,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};
  try {
    const group = await addMembersToGroup({
      chatId: spaceId,
      members: members,
      account: account,
      signer: signer,
      env: env,
      pgpPrivateKey: pgpPrivateKey
    });

    return groupDtoToSpaceDto(group);
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${addMembersToSpace.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${addMembersToSpace.name} -: ${err}`
    );
  }
};
