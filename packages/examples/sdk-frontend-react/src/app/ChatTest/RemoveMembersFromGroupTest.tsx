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

const RemoveMembersFromGroupTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [memberAddress, setMemberAddress] = useState<string>('');
  const [sendResponse, setSendResponse] = useState<any>('');

  const updateChatId = (e: React.SyntheticEvent<HTMLElement>) => {
    setChatId((e.target as HTMLInputElement).value);
  };

  const updateMemberId = (e: React.SyntheticEvent<HTMLElement>) => {
    setMemberAddress((e.target as HTMLInputElement).value);
  };

  const removeMembersFromGroupTest = async () => {
    try {
      setLoading(true);
      const librarySigner = await library.getSigner();
      const response = await PushAPI.chat.removeMembers({
        chatId: chatId,
        members: memberAddress ? memberAddress.split(',') : [],
        env,
        account: account,
        signer: librarySigner,
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
      <ChatTest />
      <h2>Remove Member from Group Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <SectionButton onClick={removeMembersFromGroupTest}>
            Remove Member from Group
          </SectionButton>
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
          <label>members (comma separated)</label>
          <input
            type="text"
            onChange={updateMemberId}
            value={memberAddress}
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

export default RemoveMembersFromGroupTest;
