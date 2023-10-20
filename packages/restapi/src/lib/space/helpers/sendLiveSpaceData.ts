import { send } from '../../chat';
import { MessageType } from '../../constants';
import { EnvOptionsType, LiveSpaceData, SignerType } from '../../types';

interface SendLiveSpaceData extends EnvOptionsType {
  liveSpaceData?: LiveSpaceData;
  action: string;
  spaceId: string;
  pgpPrivateKey: string;
  signer: SignerType;
}

const sendLiveSpaceData = async ({
  liveSpaceData,
  action,
  spaceId,
  pgpPrivateKey,
  signer,
  env,
}: SendLiveSpaceData) => {
  await send({
    receiverAddress: spaceId,
    pgpPrivateKey,
    env,
    signer,
    messageType: MessageType.META,
    messageObj: {
      content: action,
      info: {
        affected: [],
        arbitrary: liveSpaceData,
      },
    },
  });
};

export default sendLiveSpaceData;
