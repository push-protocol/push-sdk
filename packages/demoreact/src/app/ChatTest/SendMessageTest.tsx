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
import ChatTest from './ChatTest';
import { ethers } from 'ethers';

const SendMessageTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [messageContent, setMessageContent] = useState<string>('');
  const [messageType, setMessageType] = useState<string>('Text');
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const [sendResponse, setSendResponse] = useState<any>('');
  const [fromDID, setFromDID] = useState<string>('');
  const updateMessageContent = (e: React.SyntheticEvent<HTMLElement>) => {
    setMessageContent((e.target as HTMLInputElement).value);
  };
  const updateFromDID = (e: React.SyntheticEvent<HTMLElement>) => {
    setFromDID((e.target as HTMLInputElement).value);
  };
  const updateReceiverAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    setReceiverAddress((e.target as HTMLInputElement).value);
  };

  const testSendMessage = async (index: number) => {
    try {
      setLoading(true);

      let response;
      switch (index) {
        case 0:
          {
            const librarySigner = await library.getSigner();
            response = await PushAPI.chat.send({
              messageContent,
              messageType: messageType as
                | 'Text'
                | 'Image'
                | 'File'
                | 'GIF'
                | 'MediaURL'
                | undefined,
              receiverAddress,
              signer: librarySigner,
              env,
              fromDID,
            });
          }
          break;
        case 1:
          {
            const walletPvtKey =
              '4f380c43fe3fcb887ce5104cfae4fa049427233855c9003cbb87f720a1d911bc';
            const Pkey = `0x${walletPvtKey}`;
            const pvtKeySigner = new ethers.Wallet(Pkey);
            response = await PushAPI.chat.send({
              messageContent,
              messageType: messageType as
                | 'Text'
                | 'Image'
                | 'File'
                | 'GIF'
                | 'MediaURL'
                | undefined,
              receiverAddress,
              signer: pvtKeySigner,
              env,
              fromDID,
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
                <label>GIF ( DEPRECATED )</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="messageType"
                  value="MediaURL"
                  checked={messageType === 'MediaURL'}
                  onChange={() => setMessageType('MediaURL')}
                />
                <label>MediaURL</label>
              </div>
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <label>Receiver ( account or NFT DID )</label>
              <input
                type="text"
                onChange={updateReceiverAddress}
                value={receiverAddress}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <label>From DID ( account or NFT DID )</label>
              <input
                type="text"
                onChange={updateFromDID}
                value={fromDID}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={() => testSendMessage(0)}>
                send message with library signer
              </SectionButton>
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={() => testSendMessage(1)}>
                send message with private key signer
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
