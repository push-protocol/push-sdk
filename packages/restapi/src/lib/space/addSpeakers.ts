import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO } from '../types';
import { groupDtoToSpaceDto } from '../chat/helpers';
import { addAdmins } from '../chat/addAdmins';

export interface AddSpeakersToSpaceType extends EnvOptionsType {
  spaceId: string;
  speakers: Array<string>;
  signer: SignerType;
  pgpPrivateKey?: string;
}

export const addSpeakers = async (
  options: AddSpeakersToSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
    speakers,
    signer = null,
    env = options?.env ?? Constants.ENV.PROD,
    pgpPrivateKey = options?.pgpPrivateKey ?? null,
  } = options;

  const group = await addAdmins({
    chatId: spaceId,
    admins: speakers,
    signer: signer,
    env: env,
    pgpPrivateKey: pgpPrivateKey,
  });

  return groupDtoToSpaceDto(group);
};
