import { addMembers, groupDtoToSpaceDto } from '../chat';
import type Space from './Space';

export async function join(this: Space) {
  try {
    const group = await addMembers({
      chatId: this.spaceSpecificData.spaceId,
      members: [this.data.local.address],
      signer: this.signer,
      env: this.env,
      pgpPrivateKey: this.pgpPrivateKey,
    });

    // update space specific data
    this.setSpaceSpecificData(() => groupDtoToSpaceDto(group));
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${join.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${join.name} -: ${err}`);
  }
}
