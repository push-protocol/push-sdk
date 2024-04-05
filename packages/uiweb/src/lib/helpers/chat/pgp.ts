import * as openpgp from 'openpgp';
import * as protobuf from 'protobufjs';
export const toSerialisedHexString = async (data: {
  url: string;
  unixTimestamp: string;
  buttonIndex: number;
  inputText: string;
  state: string;
  transactionId: string;
  address: string;
  messageId: string;
  chatId: string;
  clientProtocol: string;
  env: string;
}) => {
  const protoDefinition = `
            syntax = "proto3";

            message ChatMessage {
              string url = 1;
              string unixTimestamp = 2;
              int32 buttonIndex = 3;
              string inputText = 4;
              string state = 5;
              string transactionId = 6;
              string address = 7;
              string messageId = 8;
              string chatId = 9;
              string clientProtocol = 10;
              string env = 11;
            }
        `;

  // Load the message
  const root = protobuf.parse(protoDefinition);
  const ChatMessage = root.root.lookupType('ChatMessage');
  const chatMessage = ChatMessage.create(data);
  const binaryData = ChatMessage.encode(chatMessage).finish();
  const hexString = Buffer.from(binaryData).toString('hex');

  return hexString;
};
export const sign = async ({
  message,
  signingKey,
}: {
  message: string;
  signingKey: string;
}): Promise<any> => {
  const messageObject = await openpgp.createMessage({ text: message });
  const privateKey = await openpgp.readPrivateKey({ armoredKey: signingKey });
  const signature = await openpgp.sign({
    message: messageObject,
    signingKeys: privateKey,
    detached: true,
  });
  return signature;
};
