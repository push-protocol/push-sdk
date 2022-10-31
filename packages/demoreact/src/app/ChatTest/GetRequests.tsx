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

const GetRequestsTest = () => {
  const { account } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string | undefined>(
    undefined
  );
  const [getRequestsResponse, setGetRequestsResponse] = useState<any>('');

  const updatePgpPrivateKey = (e: React.SyntheticEvent<HTMLElement>) => {
    setPgpPrivateKey((e.target as HTMLInputElement).value);
  };

  const testGetRequests = async () => {
    try {
      setLoading(true);

      const response = await PushAPI.chat.requests({
        account: isCAIP ? walletToPCAIP10(account) : account,
        pgpPrivateKey,
        env,
      });

      setGetRequestsResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ChatTest />
      <h2>Get Requests Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <div>
            <SectionItem style={{ marginTop: 20 }}>
              <label>Decrypted Pgp Private Key</label>
              <input
                type="text"
                onChange={updatePgpPrivateKey}
                value={pgpPrivateKey}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testGetRequests}>get requests</SectionButton>
            </SectionItem>
          </div>
        </SectionItem>

        <SectionItem>
          <div>
            {getRequestsResponse ? (
              <CodeFormatter>
                {JSON.stringify(getRequestsResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default GetRequestsTest;
