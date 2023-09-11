/**
 * @file sendMetaMessage helper function
 * This module provides a function for sending metadata-related messages within a live space.
 */

import { send } from '../../chat';
import { MessageType } from '../../constants';
import { EnvOptionsType, LiveSpaceData, SignerType } from '../../types';
import { META_ACTION } from '../../types/messageTypes';

interface ISendMetaMessage extends EnvOptionsType {
    liveSpaceData?: LiveSpaceData;
    action: META_ACTION;
    spaceId: string;
    pgpPrivateKey: string;
    signer: SignerType;
}

const sendMetaMessage = async ({
    liveSpaceData,
    action,
    spaceId,
    pgpPrivateKey,
    signer,
    env,
}: ISendMetaMessage) => {
    await send({
        receiverAddress: spaceId,
        pgpPrivateKey,
        env,
        signer,
        messageType: MessageType.META,
        messageObj: {
            content: 'PUSH SPACE V2 META MESSAGE',
            action,
            info: {
                affected: [],
                arbitrary: liveSpaceData,
            },
        },
    });
};

export default sendMetaMessage;
