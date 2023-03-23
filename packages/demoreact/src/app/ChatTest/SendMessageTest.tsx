import { useState, useContext } from 'react';
import {
  Section,
  SectionItem,
  CodeFormatter,
  SectionButton,
} from '../components/StyledComponents';
import Loader from '../components/Loader';
import { Web3Context, EnvContext } from '../context';
import * as PushAPI from '@pushprotocol/restapi';
import { walletToPCAIP10 } from '../helpers';
import ChatTest from './ChatTest';
import { ethers } from 'ethers';

const SendMessageTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [messageContent, setMessageContent] = useState<string>('');
  const [messageType, setMessageType] = useState<string>('Text');

  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

  const [sendResponse, setSendResponse] = useState<any>('');

  const updateMessageContent = (e: React.SyntheticEvent<HTMLElement>) => {
    setMessageContent((e.target as HTMLInputElement).value);
  };

  const updateMessageType = (e: React.SyntheticEvent<HTMLElement>) => {
    setMessageType((e.target as HTMLInputElement).value);
  };

  const updateReceiverAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    setReceiverAddress((e.target as HTMLInputElement).value);
  };

  const updateApiKey = (e: React.SyntheticEvent<HTMLElement>) => {
    setApiKey((e.target as HTMLInputElement).value);
  };

  const testSendMessage = async (index: number) => {
    try {
      setLoading(true);
      const user = await PushAPI.user.get({ account: account, env });
      let pvtkey = null;

      let response;
      switch (index) {
        case 0: {
          if (user?.encryptedPrivateKey) {
            pvtkey = await PushAPI.chat.decryptWithWalletRPCMethod(
              user.encryptedPrivateKey,
              account
            );
          }
          response = await PushAPI.chat.send({
            messageContent,
            messageType: messageType as "Text" | "Image" | "File" | "GIF" | undefined,
            receiverAddress,
            account: isCAIP ? walletToPCAIP10(account) : account,
            pgpPrivateKey: pvtkey,
            apiKey,
            env,
          });
        }
          break;
        case 1: {
          const librarySigner = await library.getSigner();
          if (user?.encryptedPrivateKey) {
            pvtkey = await PushAPI.chat.decryptPGPKey({
              encryptedPGPPrivateKey: user.encryptedPrivateKey,
              signer: librarySigner,
              env
            });
          }
          response = await PushAPI.chat.send({
            messageContent,
            messageType: messageType as "Text" | "Image" | "File" | "GIF" | undefined,
            receiverAddress,
            signer: librarySigner,
            pgpPrivateKey: pvtkey,
            apiKey,
            env,
          });
        }
          break;
        case 2: {
          const librarySigner = await library.getSigner();
          if (user?.encryptedPrivateKey) {
            pvtkey = await PushAPI.chat.decryptPGPKey({
              encryptedPGPPrivateKey: user.encryptedPrivateKey,
              signer: librarySigner,
              env
            });
          }
          response = await PushAPI.chat.send({
            messageContent,
            messageType: messageType as "Text" | "Image" | "File" | "GIF" | undefined,
            receiverAddress,
            signer: librarySigner,
            account: isCAIP ? walletToPCAIP10(account) : account,
            pgpPrivateKey: pvtkey,
            apiKey,
            env,
          });
        }
          break;
        case 3: {
          const walletPvtKey = '4f380c43fe3fcb887ce5104cfae4fa049427233855c9003cbb87f720a1d911bc';
          const Pkey = `0x${walletPvtKey}`;
          const pvtKeySigner = new ethers.Wallet(Pkey);
          if (user?.encryptedPrivateKey) {
            pvtkey = await PushAPI.chat.decryptPGPKey({
              encryptedPGPPrivateKey: user.encryptedPrivateKey,
              signer: pvtKeySigner,
              env
            });
          }
          response = await PushAPI.chat.send({
            messageContent,
            messageType: messageType as "Text" | "Image" | "File" | "GIF" | undefined,
            receiverAddress,
            signer: pvtKeySigner,
            pgpPrivateKey: pvtkey,
            apiKey,
            env,
          });
        }
          break;
        case 4: {
          if (user?.encryptedPrivateKey) {
            pvtkey = await PushAPI.chat.decryptWithWalletRPCMethod(
              user.encryptedPrivateKey,
              account
            );
          }
          response = await PushAPI.chat.send({
            messageContent,
            messageType: messageType as "Text" | "Image" | "File" | "GIF" | undefined,
            receiverAddress,
            pgpPrivateKey: pvtkey,
            apiKey,
            env,
          });
        }
          break;
        default:
          break;
      }

      setSendResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ChatTest />
      <h2>Send Message Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <div>
            <SectionItem>
              <label>Message Content</label>
              <input
                type="text"
                onChange={updateMessageContent}
                value={messageContent}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <label>Message Type</label>
              <div>
                <input
                  type="radio"
                  name="messageType"
                  value="Text"
                  checked={messageType === 'Text'}
                  onChange={() => setMessageType('Text')}
                />
                <label>Text</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="messageType"
                  value="Image"
                  checked={messageType === 'Image'}
                  onChange={() => setMessageType('Image')}
                />
                <label>Image</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="messageType"
                  value="File"
                  checked={messageType === 'File'}
                  onChange={() => setMessageType('File')}
                />
                <label>File</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="messageType"
                  value="GIF"
                  checked={messageType === 'GIF'}
                  onChange={() => setMessageType('GIF')}
                />
                <label>GIF</label>
              </div>
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <label>Receiver's Address</label>
              <input
                type="text"
                onChange={updateReceiverAddress}
                value={receiverAddress}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <label>Api Key</label>
              <input
                type="text"
                onChange={updateApiKey}
                value={apiKey}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={() => testSendMessage(0)}>
                send message with address
              </SectionButton>
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={() => testSendMessage(1)}>
                send message with library signer
              </SectionButton>
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={() => testSendMessage(2)}>
                send message with both address and signer
              </SectionButton>
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={() => testSendMessage(3)}>
                send message with pvt key signer
              </SectionButton>
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={() => testSendMessage(4)}>
                send message with nothing
              </SectionButton>
            </SectionItem>
          </div>
        </SectionItem>

        <SectionItem>
          <div>
            {sendResponse ? (
              <CodeFormatter>
                {JSON.stringify(sendResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default SendMessageTest;
