import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO } from '../types';
import { groupDtoToSpaceDto } from './../chat/helpers';
import { addAdminsToGroup } from '../chat/addAdminsToGroup';

export interface AddAdminsToSpaceType extends EnvOptionsType {
  spaceId: string;
  admins: Array<string>;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

export const addAdminsToSpace = async (options: AddAdminsToSpaceType): Promise<SpaceDTO> => {
  const {
    spaceId,
    admins,
    account = null,
    signer = null,
    env = options?.env ?? Constants.ENV.PROD,
    pgpPrivateKey = options?.pgpPrivateKey ?? null,
  } = options;

  const group = await addAdminsToGroup({
    chatId: spaceId,
    admins: admins,
    account: account,
    signer: signer,
    env: env,
    pgpPrivateKey: pgpPrivateKey
  });

  return groupDtoToSpaceDto(group);
};