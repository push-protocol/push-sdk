import { getConnectedUser, getWallet } from '../../chat/helpers';
import Constants, { ENV } from '../../constants';
import { getCAIPWithChainId } from '../../helpers';
import { sendNotification } from '../../payloads';
import { SignerType, VideoCallStatus } from '../../types';

interface VideoCallInfoType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalingData: any;
  status: VideoCallStatus;
  env?: ENV;
}

interface UserInfoType {
  signer: SignerType;
  chainId: number;
  pgpPrivateKey: string | null;
}

interface VideoPayloadType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalingData?: any;
  status: VideoCallStatus;
}

const sendVideoCallNotification = async (
  { signer, chainId, pgpPrivateKey = null }: UserInfoType,
  {
    recipientAddress,
    senderAddress,
    chatId,
    signalingData = null,
    status,
    env = Constants.ENV.PROD,
  }: VideoCallInfoType
) => {
  try {
    const videoPayload: VideoPayloadType = {
      recipientAddress,
      senderAddress,
      chatId,
      signalingData,
      status,
    };

    console.log('sendVideoCallNotification', 'videoPayload', videoPayload);

    const senderAddressInCaip = getCAIPWithChainId(senderAddress, chainId);
    const recipientAddressInCaip = getCAIPWithChainId(
      recipientAddress,
      chainId
    );

    const wallet = getWallet({ account: senderAddress, signer });
    const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env);

    const notificationText = `Video Call from ${senderAddress}`;

    await sendNotification({
      senderType: 1, // for chat notification
      signer,
      pgpPrivateKey: connectedUser.privateKey!,
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
        additionalMeta: videoPayload,
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
