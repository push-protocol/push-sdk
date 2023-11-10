import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO } from '../types';
import { groupDtoToSpaceDto, groupDtoToSpaceDtoV2 } from '../chat/helpers';
import { removeAdmins } from '../chat/removeAdmins';
export interface RemoveSpeakersFromSpaceType extends EnvOptionsType {
  spaceId: string;
  speakers: Array<string>;
  signer: SignerType;
  pgpPrivateKey?: string;
}

export const removeSpeakers = async (
  options: RemoveSpeakersFromSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
    speakers,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};
  try {
    const group = await removeAdmins({
      chatId: spaceId,
      admins: speakers,
      signer: signer,
      env: env,
      pgpPrivateKey: pgpPrivateKey,
    });

    return groupDtoToSpaceDtoV2(group, env);
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${removeSpeakers.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${removeSpeakers.name} -: ${err}`
    );
  }
};
