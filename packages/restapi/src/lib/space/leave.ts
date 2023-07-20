import type Space from './Space';
import { SPACE_DISCONNECT_TYPE } from '../payloads/constants';

export async function leave(this: Space): Promise<void> {
  try {
    // should be only called by the host or the speakers

    // if the host is leaving then we need to make someone else the host

    // handle the case where a listner is leaving

    // disconnect with every incoming peer in the mesh connection
    this.data.incoming.slice(1).forEach(({ address }) => {
      this.disconnect({
        peerAddress: address,
        details: {
          type: SPACE_DISCONNECT_TYPE.LEAVE,
          data: {},
        },
      });
    });
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${stop.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${stop.name} -: ${err}`);
  }
}
