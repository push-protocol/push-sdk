import { getConnectedUser, getWallet } from '../../chat/helpers';
import Constants, { ENV } from '../../constants';
import { getCAIPWithChainId } from '../../helpers';
import { sendNotification } from '../../payloads';
import { SignerType } from '../../types';

interface VideoCallInfoType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalingData: any;
  status: 1 | 2 | 3; // 1 is call initiated, 2 is call answered, 3 is call completed
  env?: ENV;
}

interface UserInfoType {
  account: string;
  signer: SignerType;
  chainId: number;
}

interface videoPayloadType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalingData: any;
  status: number;
}

const sendVideoCallNotification = async (
  { account, signer, chainId }: UserInfoType,
  {
    recipientAddress,
    senderAddress,
    chatId,
    signalingData,
    status,
    env = Constants.ENV.PROD,
  }: VideoCallInfoType
) => {
  try {
    const videoPayload: videoPayloadType = {
      recipientAddress,
      senderAddress,
      chatId,
      signalingData,
      status,
    };

    const senderAddressInCaip = getCAIPWithChainId(senderAddress, chainId);
    const recipientAddressInCaip = getCAIPWithChainId(
      recipientAddress,
      chainId
    );

    const wallet = getWallet({ account, signer });
    const connectedUser = await getConnectedUser(wallet, null, env);

    await sendNotification({
      senderType: 1, // for chat notification
      signer,
      pgpPrivateKey: connectedUser.privateKey!,
      chatId,
      type: 3,
      identityType: 2,
      hidden: true,
      notification: {
        title: 'VideoCall',
        body: 'VideoCall',
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
