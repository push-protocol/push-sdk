import { SpaceDTO } from '../types';
import { groupDtoToSpaceDto } from './../chat/helpers';
import { createGroup } from '../chat/createGroup';

export interface ChatCreateSpaceType {
  spaceName: string;
  spaceDescription: string;
  members: Array<string>;
  spaceImage: string | null;
  admins: Array<string>;
  isPublic: boolean;
  contractAddressNFT?: string;
  numberOfNFTs?: number;
  contractAddressERC20?: string;
  numberOfERC20?: number;
  meta?: string;
  scheduleAt: Date;
  scheduleEnd?: Date | null;
}

import type Space from './Space';

export async function create(
  this: Space,
  options: ChatCreateSpaceType
): Promise<void> {
  const {
    spaceName,
    spaceDescription,
    members,
    spaceImage,
    admins,
    isPublic,
    contractAddressNFT,
    numberOfNFTs,
    contractAddressERC20,
    numberOfERC20,
    meta,
    scheduleAt,
    scheduleEnd,
  } = options || {};

  try {
    if (this.signer === null) {
      throw new Error(`Signer is necessary!`);
    }

    const group = await createGroup({
      signer: this.signer,
      groupName: spaceName,
      groupDescription: spaceDescription,
      members: members,
      groupImage: spaceImage,
      admins: admins,
      isPublic: isPublic,
      contractAddressNFT: contractAddressNFT,
      numberOfNFTs: numberOfNFTs,
      contractAddressERC20: contractAddressERC20,
      numberOfERC20: numberOfERC20,
      env: this.env,
      pgpPrivateKey: this.pgpPrivateKey,
      meta: meta,
      groupType: 'spaces',
      scheduleAt: scheduleAt,
      scheduleEnd: scheduleEnd,
    });

    this.setSpaceSpecificData(() => groupDtoToSpaceDto(group));
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${create.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${create.name} -: ${err}`);
  }
}
