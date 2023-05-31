import {
   SpaceDTO 
} from '../types';
import {
  groupDtoToSpaceDto
} from './../chat/helpers';
import { GetSpaceType } from './get';
import {
    getGroup
} from '../chat/getGroup';
import Constants from '../constants';

export const info = async (
    options: GetSpaceType
): Promise < SpaceDTO > => {
    const {
        spaceId,
        env = Constants.ENV.PROD
    } = options || {};
    try {
        if (spaceId == null || spaceId.length == 0) {
            throw new Error(`spaceId cannot be null or empty`);
        }
        const group = await getGroup({
            chatId: spaceId,
            env
        })
        return groupDtoToSpaceDto(group);
    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${info.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${info.name} -: ${err}`);
    }
};