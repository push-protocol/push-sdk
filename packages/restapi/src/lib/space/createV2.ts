import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceInfoDTO, SpaceRules } from '../types';
import {
  convertSpaceRulesToRules,
  groupInfoDtoToSpaceInfoDto,
} from './../chat/helpers';
import { createGroupV2 } from '../chat';

export interface ChatCreateSpaceTypeV2 extends EnvOptionsType {
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
  spaceName: string;
  spaceDescription: string | null;
  spaceImage: string | null;
  listeners: Array<string>;
  speakers: Array<string>;
  isPublic: boolean;
  rules?: SpaceRules | null;
  config: {
    scheduleAt: Date;
    scheduleEnd: Date | null;
  };
}

export async function createV2(
  options: ChatCreateSpaceTypeV2
): Promise<SpaceInfoDTO> {
  const {
    signer,
    spaceName,
    spaceDescription,
    listeners,
    spaceImage,
    speakers,
    isPublic,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    rules,
    config,
  } = options || {};

  const spaceRules = rules ? convertSpaceRulesToRules(rules) : null;

  try {
    const group = await createGroupV2({
      signer,
      groupName: spaceName,
      groupDescription: spaceDescription,
      members: listeners,
      groupImage: spaceImage,
      admins: speakers,
      isPublic: isPublic,
      env,
      pgpPrivateKey,
      groupType: 'spaces',
      config: {
        meta: null,
        scheduleAt: config.scheduleAt,
        scheduleEnd: config.scheduleEnd ?? null,
        status: 'PENDING',
      },
      rules: spaceRules,
    });

    return groupInfoDtoToSpaceInfoDto(group);
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${createV2.name} -:  `, err);
    throw new Error(
      `[Push SDK] - API  - Error - API ${createV2.name} -: ${err}`
    );
  }
}
