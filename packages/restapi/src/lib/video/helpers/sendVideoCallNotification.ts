import Constants, { ENV } from '../../constants';
import { getCAIPWithChainId } from '../../helpers';
import { sendNotification } from '../../payloads';
import { ADDITIONAL_META_TYPE } from '../../payloads/constants';
import { SignerType, VideoCallStatus } from '../../types';

interface VideoCallInfoType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalData: any;
  status: VideoCallStatus;
  env?: ENV;
}

interface UserInfoType {
  signer: SignerType;
  chainId: number;
  pgpPrivateKey: string;
}

interface VideoDataType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalData?: any;
  status: VideoCallStatus;
}

const sendVideoCallNotification = async (
  { signer, chainId, pgpPrivateKey }: UserInfoType,
  {
    recipientAddress,
    senderAddress,
    chatId,
    signalData = null,
    status,
    env = Constants.ENV.PROD,
  }: VideoCallInfoType
) => {
  try {
    const videoData: VideoDataType = {
      recipientAddress,
      senderAddress,
      chatId,
      signalData,
      status,
    };

    console.log('sendVideoCallNotification', 'videoData', videoData);

    const senderAddressInCaip = getCAIPWithChainId(senderAddress, chainId);
    const recipientAddressInCaip = getCAIPWithChainId(
      recipientAddress,
      chainId
    );

    const notificationText = `Video Call from ${senderAddress}`;

    await sendNotification({
      senderType: 1, // for chat notification
      signer,
      pgpPrivateKey,
      chatId,
      type: 3,
      identityType: 2,
      notification: {
        title: notificationText,
        body: notificationText,
      },
      payload: {
        title: 'VideoCall',
        body: 'VideoCall',
        cta: '',
        img: '',
        additionalMeta: {
          type: `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`,
          data: JSON.stringify(videoData),
        }
      },
      recipients: recipientAddressInCaip,
      channel: senderAddressInCaip,
      env,
    });
  } catch (err) {
    console.log('Error occured while sending notification for video call', err);
  }
};

export default sendVideoCallNotification;
