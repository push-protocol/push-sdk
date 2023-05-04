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
  /*
    callStatus
    0 - call not initiated
    1 - call initiated by the caller address
    2 - call recieved by the receiver address
    3 - call is established
    4 - call ended
  */
  status: 1 | 2 | 3 | 4;
  env?: ENV;
}

interface UserInfoType {
  signer: SignerType;
  chainId: number;
  pgpPrivateKey: string | null;
}

interface videoPayloadType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalingData?: any;
  status: number;
}

const sendVideoCallNotification = async (
  { signer, chainId, pgpPrivateKey=null, }: UserInfoType,
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

    const wallet = getWallet({ account: senderAddress, signer });
    const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env); 

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
