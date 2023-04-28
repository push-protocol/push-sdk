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

const ConversationHashTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>({});
  const [userAddr1, setUserAddr1] = useState<string>('');
  const [userAddr2, setUserAddr2] = useState<string>('');

  const updateUserAddress1 = (e: React.SyntheticEvent<HTMLElement>) => {
    setUserAddr1((e.target as HTMLInputElement).value);
  };

  const updateUserAddress2 = (e: React.SyntheticEvent<HTMLElement>) => {
    setUserAddr2((e.target as HTMLInputElement).value);
  };

  const testConversationHash = async () => {
    try {
      setLoading(true);

      // object for connected user data
      const response = await PushAPI.chat.conversationHash({
        account: userAddr1,
        conversationId: userAddr2,
        env,
      });

      setResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ChatTest />
      <h2>Conversation Hash Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <label>Sender's Address</label>
          <input
            type="text"
            onChange={updateUserAddress1}
            value={userAddr1}
            style={{ width: 400, height: 30 }}
          />
          <label>Conversation Id</label>
          <input
            type="text"
            onChange={updateUserAddress2}
            value={userAddr2}
            style={{ width: 400, height: 30 }}
          />
          <SectionButton onClick={testConversationHash}>
            get conversation hash
          </SectionButton>
        </SectionItem>

        <SectionItem>
          <div>
            {response ? (
              <CodeFormatter>{JSON.stringify(response, null, 4)}</CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default ConversationHashTest;
