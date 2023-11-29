import { getCAIPWithChainId } from '../../helpers';
import { sendNotification } from '../../payloads';

import Constants from '../../constants';
import {
  NOTIFICATION_TYPE,
  SPACE_ACCEPT_REQUEST_TYPE,
  SPACE_DISCONNECT_TYPE,
  SPACE_REQUEST_TYPE,
  VIDEO_CALL_TYPE,
} from '../../payloads/constants';
import {
  EnvOptionsType,
  SignerType,
  VideoCallStatus,
  VideNotificationRules,
} from '../../types';

interface CallDetailsType {
  type: SPACE_REQUEST_TYPE | SPACE_ACCEPT_REQUEST_TYPE | SPACE_DISCONNECT_TYPE;
  data: Record<string, unknown>;
}

export interface VideoDataType {
  /** @deprecated - Use `rules` object instead */
  chatId?: string;
  recipientAddress: string;
  senderAddress: string;
  signalData?: any;
  status: VideoCallStatus;
  callDetails?: CallDetailsType;
}

interface VideoCallInfoType extends VideoDataType, EnvOptionsType {
  callType?: VIDEO_CALL_TYPE;
  rules?: VideNotificationRules;
}

interface UserInfoType {
  signer: SignerType;
  chainId: number;
  pgpPrivateKey: string;
}

const sendVideoCallNotification = async (
  { signer, chainId, pgpPrivateKey }: UserInfoType,
  {
    recipientAddress,
    senderAddress,
    chatId,
    rules,
    status,
    signalData = null,
    env = Constants.ENV.PROD,
    callType = VIDEO_CALL_TYPE.PUSH_VIDEO,
    callDetails,
  }: VideoCallInfoType
) => {
  try {
    const videoData: VideoDataType = {
      recipientAddress,
      senderAddress,
      chatId: rules?.access.data ?? chatId,
      signalData,
      status,
      callDetails,
    };

    const senderAddressInCaip = getCAIPWithChainId(senderAddress, chainId);
    const recipientAddressInCaip = getCAIPWithChainId(
      recipientAddress,
      chainId
    );

    const notificationText = `Video Call from ${senderAddress}`;
    const notificationType = NOTIFICATION_TYPE.TARGETTED;

    await sendNotification({
      senderType: 1, // for chat notification
      signer,
      pgpPrivateKey,
      chatId,
      rules,
      type: notificationType,
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
          type: `${callType}+1`,
          data: JSON.stringify(videoData),
        },
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
