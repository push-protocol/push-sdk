import { ChatStatus } from '../types';
import type Space from './Space';
import { get } from './get';
import getLiveSpaceData from './helpers/getLiveSpaceData';

export interface InitializeType {
  spaceId: string;
}

export async function initialize(this: Space, options: InitializeType) {
  const { spaceId } = options || {};

  const space = await get({
    spaceId,
    env: this.env,
  });

  const liveSpaceData = this.spaceSpecificData.liveSpaceData;

  // if the space is active then fetch the latest meta message and update the live space data state
  // if (space.status === ChatStatus.ACTIVE) {
  //   liveSpaceData = await getLiveSpaceData({
  //     localAddress: this.data.local.address,
  //     spaceId: this.spaceSpecificData.spaceId,
  //     pgpPrivateKey: this.pgpPrivateKey,
  //     env: this.env,
  //   });
  // }

  this.setSpaceSpecificData(() => ({ ...space, liveSpaceData }));
}
