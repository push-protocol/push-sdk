import { send } from '../../chat';
import { MessageType } from '../../constants';
import { EnvOptionsType, LiveSpaceData, SignerType } from '../../types';
import { META_ACTION } from '../../types/metaTypes';

interface SendLiveSpaceData extends EnvOptionsType {
  liveSpaceData?: LiveSpaceData;
  action: META_ACTION,
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
      content: '',
      meta: {
        action,
        info: {
          affected: [],
          arbitrary: liveSpaceData,
        },
      },
    },
  });
};

export default sendLiveSpaceData;
