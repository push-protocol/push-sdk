import { conversationHash, history } from '../../chat';
import { MessageType } from '../../constants';
import { EnvOptionsType, LiveSpaceData } from '../../types';
import { MetaMessage } from '../../types/messageTypes';
import { initLiveSpaceData } from '../Space';

interface GetLatestMessageType extends EnvOptionsType {
  localAddress: string;
  spaceId: string;
  pgpPrivateKey: string;
}

const getLiveSpaceData = async ({
  localAddress,
  spaceId,
  pgpPrivateKey,
  env,
}: GetLatestMessageType) => {
  const threadhash = (
    await conversationHash({
      account: localAddress,
      conversationId: spaceId,
      env,
    })
  ).threadHash;

  let liveSpaceData = initLiveSpaceData;

  // fetch the message history to retrieve the latest meta message
  // rn we only fetch the latest 10 messages
  const messages = await history({
    threadhash,
    account: localAddress,
    pgpPrivateKey,
    toDecrypt: true,
    env,
  });

  let latestMetaMessage = null;
  for (const message of messages) {
    if (
      message.messageType === MessageType.META &&
      typeof message.messageObj === 'object' &&
      message.messageObj !== null
    ) {
      latestMetaMessage = message;
      break;
    }
  }

  if (
    latestMetaMessage !== null &&
    typeof latestMetaMessage.messageObj === 'object' &&
    latestMetaMessage.messageObj !== null
  ) {
    // found the latest meta message
    liveSpaceData = (latestMetaMessage.messageObj as Omit<MetaMessage, 'type'>)
      ?.info?.arbitrary as LiveSpaceData;
  }

  return liveSpaceData;
};

export default getLiveSpaceData;
