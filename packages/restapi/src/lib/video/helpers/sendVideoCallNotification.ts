import Constants, { ENV } from '../../constants';
import { getCAIPWithChainId } from '../../helpers';
import { sendNotification } from '../../payloads';

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
  library: any;
  chainId: number;
  connectedUser: any;
  createUserIfNecessary: any;
}

interface videoPayloadType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalingData: any;
  status: number;
}

const sendVideoCallNotification = async (
  {
    account,
    library,
    chainId,
    connectedUser,
    createUserIfNecessary,
  }: UserInfoType,
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
    const _signer = await library.getSigner(account);

    // TODO
    let createdUser;
    if (!connectedUser.publicKey) {
      createdUser = await createUserIfNecessary();
    }

    const recipientAddressInCaip = getCAIPWithChainId(
      recipientAddress,
      chainId
    );

    await sendNotification({
      senderType: 1, // for chat notification
      signer: _signer,
      pgpPrivateKey: connectedUser?.privateKey || createdUser?.privateKey,
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
