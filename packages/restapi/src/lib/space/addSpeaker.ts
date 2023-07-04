import { EnvOptionsType } from '../types';
import { groupDtoToSpaceDto } from '../chat/helpers';
import { addAdminsToGroup } from '../chat/addAdminsToGroup';

import type Space from './Space';

export interface AddSpeakerType extends EnvOptionsType {
  address: string;
}

export async function addSpeaker(
  this: Space,
  options: AddSpeakerType
): Promise<void> {
  const { address } = options;
  try {
    const group = await addAdminsToGroup({
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
      `[Push SDK] - API  - Error - API ${addSpeaker.name} -:  `,
      err
    );
    throw Error(`[Push SDK] - API  - Error - API ${addSpeaker.name} -: ${err}`);
  }
}
