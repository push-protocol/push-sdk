import Constants, {
    ENV
} from '../constants';
import {
    SpaceDTO
} from '../types';
import {
    groupDtoToSpaceDto
} from './../chat/helpers';
import {
    getGroup
} from '../chat/getGroup';

export interface GetSpaceType {
    spaceId: string,
    env ? : ENV
}

export const get = async (
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
        console.error(`[Push SDK] - API  - Error - API ${get.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${get.name} -: ${err}`);
    }
};