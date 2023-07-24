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

const GetUserBatchTest = () => {
  const { account } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);

  const [userIds, setUserIds] = useState<string>('');
  const [sendResponse, setSendResponse] = useState<any>('');

  const updateUserIds = (e: React.SyntheticEvent<HTMLElement>) => {
    setUserIds((e.target as HTMLInputElement).value);
  };

  const testGetUsersBatch = async () => {
    try {
      setLoading(true);

      // object for connected user data
      const response = await PushAPI.user.getBatch({
        userIds: userIds.split(','),
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
      <ChatTest />
      <h2>Get Users Batch Test page</h2>
      <Loader show={isLoading} />
      <Section>
        <SectionItem>
          <SectionButton onClick={testGetUsersBatch}>
            get users batch data
          </SectionButton>
        </SectionItem>

        <SectionItem>
          <label>UserIds</label>
          <input
            type="text"
            onChange={updateUserIds}
            value={userIds}
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

export default GetUserBatchTest;
