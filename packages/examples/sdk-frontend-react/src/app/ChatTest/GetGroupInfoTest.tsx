import React, { useState, useContext } from 'react';
import { EnvContext } from '../context';
import * as PushAPI from '@pushprotocol/restapi';
import Loader from '../components/Loader';
import { Section, SectionItem, CodeFormatter, SectionButton } from '../components/StyledComponents';

const GetGroupInfoTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [chatId, setChatId] = useState('');
  const [sendResponse, setSendResponse] = useState<any>('');
  const [isLoading, setLoading] = useState(false);

  const updateChatId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatId(e.target.value);
  };

  const fetchGroupInfo = async () => {
    setLoading(true);
    try {
      const groupInfo = await PushAPI.chat.getGroupInfo({ chatId, env });
      setSendResponse(groupInfo);
    } catch (error) {
      console.error('Error fetching group info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Get Group Info Test</h2>
      <Loader show={isLoading} />
      <Section>
        <SectionItem>
          <label htmlFor="chatId">Chat ID:</label>
          <input
            id="chatId"
            type="text"
            onChange={updateChatId}
            value={chatId}
            placeholder="Enter chat ID"
            style={{ width: '100%', height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <SectionButton onClick={fetchGroupInfo}>
            Fetch Group Info
          </SectionButton>
        </SectionItem>
        {sendResponse && (
          <SectionItem>
            <h3>Group Information:</h3>
            <CodeFormatter>
              {JSON.stringify(sendResponse, null, 2)}
            </CodeFormatter>
          </SectionItem>
        )}
      </Section>
    </div>
  );
};

export default GetGroupInfoTest;
