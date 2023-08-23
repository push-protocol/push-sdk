import Constants, { ENV } from '../constants';
import { getGroupAccess, groupAccessToSpaceAccess } from '../chat';
import { SpaceAccess } from '../types';

/**
 * GET /v1/chat/groups/:chatId/access/:did
 */

export interface GetSpaceAccessType {
  spaceId: string;
  did: string; // Decentralized Identifier
  env?: ENV;
}

export const getAccess = async (options: GetSpaceAccessType): Promise<SpaceAccess> => {
  // Replace "any" with the actual response type
  const { spaceId, did, env = Constants.ENV.PROD } = options || {};
  try {
    if (spaceId == null || spaceId.length === 0) {
      throw new Error(`spaceId cannot be null or empty`);
    }
    if (did == null || did.length === 0) {
      throw new Error(`did cannot be null or empty`);
    }

    const access = await getGroupAccess({ chatId: spaceId, did: did, env: env });
    return groupAccessToSpaceAccess(access);
  } catch (err) {
    console.error(`[Push SDK] - API - Error - API ${getAccess.name} -:  `, err);
    throw Error(`[Push SDK] - API - Error - API ${getAccess.name} -: ${err}`);
  }
};
