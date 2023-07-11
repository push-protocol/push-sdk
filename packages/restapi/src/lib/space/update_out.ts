import Constants from '../constants';
import { EnvOptionsType, SpaceDTO, SignerType, ChatStatus } from '../types';
import { groupDtoToSpaceDto } from './../chat/helpers';
import { updateGroup } from '../chat/updateGroup';
import { get } from './get';

export interface ChatUpdateSpaceType extends EnvOptionsType {
  signer: SignerType;
  spaceId: string;
  spaceName: string;
  spaceImage: string | null;
  spaceDescription: string;
  members: Array<string>;
  admins: Array<string>;
  pgpPrivateKey?: string;
  scheduleAt: Date;
  scheduleEnd?: Date | null;
  status: ChatStatus;
}

export const update = async (
  options: ChatUpdateSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
    spaceName,
    spaceImage,
    spaceDescription,
    members,
    admins,
    signer,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    scheduleAt,
    scheduleEnd,
    status,
  } = options || {};
  try {
    const space = await get({
      spaceId,
      env,
    });

    if (space.status === ChatStatus.ACTIVE && scheduleAt) {
      throw new Error('Unable change the start date/time of an active space');
    }

    if (space.status === ChatStatus.ENDED && scheduleEnd) {
      throw new Error('Unable change the end date/time of an ended space');
    }

    const group = await updateGroup({
      chatId: spaceId,
      groupName: spaceName,
      groupImage: spaceImage,
      groupDescription: spaceDescription,
      members: members,
      admins: admins,
      signer: signer,
      env: env,
      pgpPrivateKey: pgpPrivateKey,
      scheduleAt: scheduleAt,
      scheduleEnd: scheduleEnd,
      status: status,
    });

    return groupDtoToSpaceDto(group);
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${update.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${update.name} -: ${err}`);
  }
};
