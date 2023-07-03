import Constants from '../constants';
import {
    EnvOptionsType,
    SpaceDTO,
    SignerType,
    ChatStatus
} from '../types';
import {
    groupDtoToSpaceDto,
    getSpacesMembersList,
    getSpaceAdminsList
} from './../chat/helpers';
import {
    get
} from './get';
import {
    updateGroup
} from '../chat/updateGroup';
export interface StartSpaceType extends EnvOptionsType {
    spaceId: string;
    account ? : string;
    signer ? : SignerType;
    pgpPrivateKey ? : string;
}

export const start = async (
    options: StartSpaceType
): Promise < SpaceDTO > => {
    const {
        spaceId,
        account = null,
        signer = null,
        env = Constants.ENV.PROD,
        pgpPrivateKey = null,
    } = options || {};
    try {
        if (account == null && signer == null) {
            throw new Error(`At least one from account or signer is necessary!`);
        }

        const space = await get({
            spaceId: spaceId,
            env,
        })

        if (space.status !== ChatStatus.PENDING) {
            throw new Error("Unable to start the space as it is not in the pending state");
        }

        const convertedMembers = getSpacesMembersList(
            space.members, space.pendingMembers
        );
        const convertedAdmins = getSpaceAdminsList(
            space.members, space.pendingMembers
        );

        const group = await updateGroup({
            chatId: spaceId,
            groupName: space.spaceName,
            groupImage: space.spaceImage,
            groupDescription: space.spaceDescription,
            members: convertedMembers,
            admins: convertedAdmins,
            account: account,
            signer: signer,
            env: env,
            pgpPrivateKey: pgpPrivateKey,
            scheduleAt: space.scheduleAt,
            scheduleEnd: space.scheduleEnd,
            status: ChatStatus.ACTIVE
        });

        return groupDtoToSpaceDto(group);
    } catch (err) {
        console.error(
            `[Push SDK] - API  - Error - API ${start.name} -:  `,
            err
        );
        throw Error(
            `[Push SDK] - API  - Error - API ${start.name} -: ${err}`
        );
    }
};