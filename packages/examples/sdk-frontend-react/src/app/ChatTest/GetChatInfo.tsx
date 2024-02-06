import { useState, useContext } from 'react';
import {
  Section,
  SectionItem,
  CodeFormatter,
  SectionButton,
} from '../components/StyledComponents';
import Loader from '../components/Loader';
import { EnvContext } from '../context';
import * as PushAPI from '@pushprotocol/restapi';
import ChatTest from './ChatTest';

const GetChatInfoTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [getChatInfoReponse, setGetChatInfoResponse] = useState<any>('');
  const [chatId, setChatId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const updateChatId = (e: React.SyntheticEvent<HTMLElement>) => {
    setChatId((e.target as HTMLInputElement).value);
  };
  const updateAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    setAddress((e.target as HTMLInputElement).value);
  };

  const testGetChatInfo = async () => {
    try {
      setLoading(true);

      const response = await PushAPI.chat.getChatInfo({
        chatId: chatId,
        address: address,
        env: env,
      });

      setGetChatInfoResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ChatTest />
      <h2>Get Chat Info Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <div>
          <SectionItem style={{ marginTop: 20 }}>
            <label>chatId</label>
            <input
              type="text"
              onChange={updateChatId}
              value={chatId}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>
          <SectionItem style={{ marginTop: 20 }}>
            <label>address</label>
            <input
              type="text"
              onChange={updateAddress}
              value={address}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>

          <SectionItem style={{ marginTop: 20 }}>
            <SectionButton onClick={testGetChatInfo}>
              get chat info
            </SectionButton>
          </SectionItem>
        </div>
        <SectionItem>
          <div>
            {getChatInfoReponse ? (
              <CodeFormatter>
                {JSON.stringify(getChatInfoReponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default GetChatInfoTest;
