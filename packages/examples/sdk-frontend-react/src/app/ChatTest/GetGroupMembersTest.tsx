import { useState, useContext, useEffect } from 'react';
import { Section, SectionItem, CodeFormatter, SectionButton } from '../components/StyledComponents';
import Loader from '../components/Loader';
import { EnvContext } from '../context';
import * as PushAPI from '@pushprotocol/restapi';

const GetGroupMembersTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [sendResponse, setSendResponse] = useState<any>('');


  const updateChatId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatId(e.target.value);
  };

  const updatePageNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(parseInt(e.target.value));
  };

  const updatePageSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(e.target.value));
  };

  const fetchGroupMembers = async () => {
    setLoading(true);
    try {
      const result = await PushAPI.chat.getGroupMembers({
        chatId,
        page: pageNumber,
        limit: pageSize,
        env,
      });
      setSendResponse(result);
    } catch (error) {
      console.error('Failed to fetch group members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members when component mounts
  useEffect(() => {
    fetchGroupMembers();
  }, []);

  return (
    <div>
      <h2>Get Group Members Test Page</h2>
      <Loader show={isLoading} />
      <Section>
        <SectionItem>
          <label>Chat ID:</label>
          <input
            type="text"
            onChange={updateChatId}
            value={chatId}
            placeholder="Enter chat ID"
            style={{ width: '100%', height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <label>Page Number:</label>
          <input
            type="number"
            onChange={updatePageNumber}
            value={pageNumber}
            style={{ width: '100%', height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <label>Page Size:</label>
          <input
            type="number"
            onChange={updatePageSize}
            value={pageSize}
            style={{ width: '100%', height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <SectionButton onClick={fetchGroupMembers}>Fetch Group Members</SectionButton>
        </SectionItem>
        {sendResponse && (
          <SectionItem>
             <CodeFormatter>
              {JSON.stringify(sendResponse, null, 2)}
            </CodeFormatter>
          </SectionItem>
        )}
      </Section>
    </div>
  );
};

export default GetGroupMembersTest;
