import Constants from '../constants';
import {
    EnvOptionsType,
    SpaceDTO,
    SignerType,
    ChatStatus
} from '../types';
import {
    groupDtoToSpaceDto,
} from './../chat/helpers';
import {
    updateGroup
} from '../chat/updateGroup';

export interface ChatUpdateSpaceType extends EnvOptionsType {
    account ? : string;
    signer ? : SignerType;
    spaceId: string;
    spaceName: string;
    spaceImage: string | null;
    spaceDescription: string;
    members: Array < string > ;
    admins: Array < string > ;
    pgpPrivateKey ? : string;
    scheduleAt: Date
    scheduleEnd ? : Date | null
    status: ChatStatus
}

export const update = async (
    options: ChatUpdateSpaceType
): Promise < SpaceDTO > => {
    const {
        spaceId,
        spaceName,
        spaceImage,
        spaceDescription,
        members,
        admins,
        account = null,
        signer = null,
        env = Constants.ENV.PROD,
        pgpPrivateKey = null,
        scheduleAt,
        scheduleEnd,
        status,
    } = options || {};
    try {
        if (account == null && signer == null) {
            throw new Error(`At least one from account or signer is necessary!`);
        }
        const group = await updateGroup({
            chatId: spaceId,
            groupName: spaceName,
            groupImage: spaceImage,
            groupDescription: spaceDescription,
            members: members,
            admins: admins,
            account: account,
            signer: signer,
            env: env,
            pgpPrivateKey: pgpPrivateKey,
            scheduleAt: scheduleAt,
            scheduleEnd: scheduleEnd,
            status: status
        });

        return groupDtoToSpaceDto(group);
    } catch (err) {
        console.error(
            `[Push SDK] - API  - Error - API ${update.name} -:  `,
            err
        );
        throw Error(
            `[Push SDK] - API  - Error - API ${update.name} -: ${err}`
        );
    }
};