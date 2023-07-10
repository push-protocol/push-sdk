import { EnvOptionsType } from '../types';
import { groupDtoToSpaceDto } from '../chat/helpers';
import {
  removeAdmins
} from '../chat/removeAdmins';
import type Space from './Space';

export interface RemoveSpeakerType extends EnvOptionsType {
  address: string;
}

export async function removeSpeaker(
  this: Space,
  options: RemoveSpeakerType
): Promise<void> {
  const { address } = options;
  try {
    const group = await removeAdmins({
      chatId: this.spaceSpecificData.spaceId,
      admins: [address],
      signer: this.signer,
      env: this.env,
      pgpPrivateKey: this.pgpPrivateKey,
    });

    // update space specific data
    this.setSpaceSpecificData(() => groupDtoToSpaceDto(group));
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${removeSpeaker.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${removeSpeaker.name} -: ${err}`
    );
  }
}
