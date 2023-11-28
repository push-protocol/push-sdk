import { useState, useContext } from 'react';
import { Section, SectionItem, CodeFormatter, SectionButton } from '../components/StyledComponents';
import Loader from '../components/Loader';
import { EnvContext } from '../context';
import * as PushAPI from '@pushprotocol/restapi';

const GetGroupMemberCountTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [totalMembersCount, setTotalMembersCount] = useState<PushAPI.ChatMemberCounts | null>(null);

  const updateChatId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatId(e.target.value);
  };

  const fetchMemberCount = async () => {
    try {
      setLoading(true);
      const counts = await PushAPI.chat.getGroupMemberCount({ chatId, env });
      setTotalMembersCount(counts);
    } catch (error) {
      console.error('Failed to fetch chat member count:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Get Chat Member Count Test Page</h2>
      <Loader show={isLoading} />
      <Section>
        <SectionItem>
          <label>Chat ID:</label>
          <input
            type="text"
            onChange={updateChatId}
            value={chatId}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <SectionButton onClick={fetchMemberCount}>Fetch Member Count</SectionButton>
        </SectionItem>
        {totalMembersCount && (
          <SectionItem>
            <div>
              <CodeFormatter>
                {JSON.stringify(totalMembersCount, null, 2)}
              </CodeFormatter>
            </div>
          </SectionItem>
        )}
      </Section>
    </div>
  );
};

export default GetGroupMemberCountTest;
