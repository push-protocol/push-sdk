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
import SpaceTest from './SpaceTest';

const RemoveMembersFromSpaceTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [spaceId, setSpaceId] = useState<string>('');
  const [memberAddress, setMemberAddress] = useState<string>('');
  const [sendResponse, setSendResponse] = useState<any>('');
  const [account, setAccount] = useState<string>(acc);

  const updateSpaceId = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceId((e.target as HTMLInputElement).value);
  };

  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const updateMemberId = (e: React.SyntheticEvent<HTMLElement>) => {
    setMemberAddress((e.target as HTMLInputElement).value);
  };

  const removeMembersFromSpaceTest = async () => {
    try {
      setLoading(true);
      const librarySigner = await library.getSigner();
      const response = await PushAPI.space.removeMembersFromSpace({
        spaceId: spaceId,
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
      <SpaceTest />
      <h2>Remove Member from Space Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <SectionButton onClick={removeMembersFromSpaceTest}>Remove Member from Space</SectionButton>
        </SectionItem>
         <SectionItem>
              <label>spaceId</label>
              <input
                type="text"
                onChange={updateSpaceId}
                value={spaceId}
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
        <SectionItem style={{ marginTop: 20 }}>
              <label>Account</label>
              <input
                type="text"
                onChange={updateAccount}
                value={account}
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

export default RemoveMembersFromSpaceTest;
