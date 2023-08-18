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

const GetGroupAccessTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [did, setDid] = useState<string>('');
  const [sendResponse, setSendResponse] = useState<any>('');

  const updateChatId = (e: React.SyntheticEvent<HTMLElement>) => {
    setChatId((e.target as HTMLInputElement).value);
  };

  const updateDid = (e: React.SyntheticEvent<HTMLElement>) => {
    setDid((e.target as HTMLInputElement).value);
  };

  const testGetGroupAccess = async () => {
    try {
      setLoading(true);

      const response = await PushAPI.chat.getGroupAccess({
        chatId: chatId,
        did: did,
        env,
      });
      setSendResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Get Group Access Test Page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <SectionButton onClick={testGetGroupAccess}>get group access</SectionButton>
        </SectionItem>
        <SectionItem>
          <label>chatId</label>
          <input
            type="text"
            onChange={updateChatId}
            value={chatId}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <label>did</label>
          <input
            type="text"
            onChange={updateDid}
            value={did}
            style={{ width: 400, height: 30 }}
          />
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

export default GetGroupAccessTest;
