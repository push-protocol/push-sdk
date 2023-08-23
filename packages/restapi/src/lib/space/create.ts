import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO, SpaceRules } from '../types';
import { convertSpaceRulesToRules, groupDtoToSpaceDto } from './../chat/helpers';
import { createGroup } from '../chat/createGroup';

export interface ChatCreateSpaceType extends EnvOptionsType {
  signer: SignerType;
  spaceName: string;
  spaceDescription: string;
  listeners: Array<string>;
  spaceImage: string | null;
  speakers: Array<string>;
  isPublic: boolean;
  contractAddressNFT?: string;
  numberOfNFTs?: number;
  contractAddressERC20?: string;
  numberOfERC20?: number;
  pgpPrivateKey?: string;
  scheduleAt: Date;
  scheduleEnd?: Date | null;
  rules?: SpaceRules | null;
}

export async function create(options: ChatCreateSpaceType): Promise<SpaceDTO> {
  const {
    signer,
    spaceName,
    spaceDescription,
    listeners,
    spaceImage,
    speakers,
    isPublic,
    contractAddressNFT,
    numberOfNFTs,
    contractAddressERC20,
    numberOfERC20,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    scheduleAt,
    scheduleEnd,
    rules,
  } = options || {};

  const groupRules = rules ? convertSpaceRulesToRules(rules) : null;

  try {
    const group = await createGroup({
      signer,
      groupName: spaceName,
      groupDescription: spaceDescription,
      members: listeners,
      groupImage: spaceImage,
      admins: speakers,
      isPublic: isPublic,
      contractAddressNFT: contractAddressNFT,
      numberOfNFTs: numberOfNFTs,
      contractAddressERC20: contractAddressERC20,
      numberOfERC20: numberOfERC20,
      env,
      pgpPrivateKey,
      groupType: 'spaces',
      scheduleAt: scheduleAt,
      scheduleEnd: scheduleEnd,
      rules: groupRules,
    });

    return groupDtoToSpaceDto(group);
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${create.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${create.name} -: ${err}`);
  }
}
