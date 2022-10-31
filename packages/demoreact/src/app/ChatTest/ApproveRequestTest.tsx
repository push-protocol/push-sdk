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

const ApproveRequestTest = () => {
  const { account } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [senderAddress, setSenderAddress] = useState<string>('');
  const [approveResponse, setApproveResponse] = useState<any>('');

  const updateSenderAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    setSenderAddress((e.target as HTMLInputElement).value);
  };

  const testApproveRequest = async () => {
    try {
      setLoading(true);

      const response = await PushAPI.chat.approve({
        status: 'Approved',
        account: isCAIP ? walletToPCAIP10(account) : account,
        senderAddress,
        env,
      });

      setApproveResponse(response);
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
            <SectionItem style={{ marginTop: 20 }}>
              <label>Sender's Address</label>
              <input
                type="text"
                onChange={updateSenderAddress}
                value={senderAddress}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testApproveRequest}>
                approve request
              </SectionButton>
            </SectionItem>
          </div>
        </SectionItem>

        <SectionItem>
          <div>
            {approveResponse ? (
              <CodeFormatter>
                {JSON.stringify(approveResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default ApproveRequestTest;
