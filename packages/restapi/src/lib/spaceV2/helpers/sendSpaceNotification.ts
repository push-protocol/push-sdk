import Constants, { ENV } from '../../constants';
import { getCAIPWithChainId } from '../../helpers';
import { sendNotification } from '../../payloads';
import {
  NOTIFICATION_TYPE,
  SPACE_ACCEPT_REQUEST_TYPE,
  SPACE_DISCONNECT_TYPE,
  SPACE_REQUEST_TYPE,
  VIDEO_CALL_TYPE,
} from '../../payloads/constants';
import { SignerType, VideoCallStatus } from '../../types';

interface CallDetailsType {
  type: SPACE_REQUEST_TYPE | SPACE_ACCEPT_REQUEST_TYPE | SPACE_DISCONNECT_TYPE;
  data: Record<string, unknown>;
};

interface SpaceInfoType {
  recipientAddress: string;
  senderAddress: string;
  spaceId: string;
  signalData: any;
  status: VideoCallStatus;
  env?: ENV;
  callType?: VIDEO_CALL_TYPE;
  callDetails?: CallDetailsType;
}

interface UserInfoType {
  signer: SignerType;
  chainId: number;
  pgpPrivateKey: string;
}

export interface SpaceDataType {
  recipientAddress: string;
  senderAddress: string;
  spaceId: string;
  signalData?: any;
  status: VideoCallStatus;
  callDetails?: CallDetailsType;
}

const sendSpaceNotification = async (
  { signer, chainId, pgpPrivateKey }: UserInfoType,
  {
    recipientAddress,
    senderAddress,
    spaceId,
    status,
    signalData = null,
    env = Constants.ENV.PROD,
    callType = VIDEO_CALL_TYPE.PUSH_VIDEO,
    callDetails
  }: SpaceInfoType
) => {
  try {
    const spaceData: SpaceDataType = {
      recipientAddress,
      senderAddress,
      spaceId,
      signalData,
      status,
      callDetails
    };

    console.log('sendSpacelNotification', 'spaceData', spaceData);

    const senderAddressInCaip = getCAIPWithChainId(senderAddress, chainId);
    const recipientAddressInCaip = getCAIPWithChainId(
      recipientAddress,
      chainId
    );

    const notificationText = `Space connection from ${senderAddress}`;

    const notificationType = NOTIFICATION_TYPE.TARGETTED;

    await sendNotification({
      senderType: 1, // for chat notification
      signer,
      pgpPrivateKey,
      chatId: spaceId,
      type: notificationType,
      identityType: 2,
      notification: {
        title: notificationText,
        body: notificationText,
      },
      payload: {
        title: 'SpaceConnection',
        body: 'SpaceConnection',
        cta: '',
        img: '',
        additionalMeta: {
          type: `${callType}+1`,
          data: JSON.stringify(spaceData),
        },
      },
      recipients: recipientAddressInCaip,
      channel: senderAddressInCaip,
      env,
    });
  } catch (err) {
    console.log('Error occured while sending notification for spaces connection', err);
  }
};

export default sendSpaceNotification;
