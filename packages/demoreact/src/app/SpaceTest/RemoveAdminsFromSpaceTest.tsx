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

const RemoveAdminsFromGroupTest = () => {
  const { account,library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [spaceId, setSpaceId] = useState<string>('');
  const [memberAddress, setMemberAddress] = useState<string>('');
  const [sendResponse, setSendResponse] = useState<any>('');

  const updateSpaceId = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceId((e.target as HTMLInputElement).value);
  };

const updateMemberId = (e: React.SyntheticEvent<HTMLElement>) => {
    setMemberAddress((e.target as HTMLInputElement).value);
  };

  const testGetGroup = async () => {
    try {
      setLoading(true);
     const user = await PushAPI.user.get({ account: account, env });
      let pvtkey = null;
      const librarySigner = await library.getSigner();
      if (user?.encryptedPrivateKey) {
        pvtkey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account,
          signer: librarySigner,
          env
        });
      }
      // object for connected user data
      const response = await PushAPI.space.removeAdminsFromSpace({
        spaceId: spaceId,
        admins: memberAddress ? memberAddress.split(',') : [],
        env,
        account: account,
        signer: librarySigner,
        pgpPrivateKey: pvtkey,
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
      <h2>Remove Admins from Group Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <SectionButton onClick={testGetGroup}>Remove Admins from Group</SectionButton>
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
              <label>memberId</label>
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

export default RemoveAdminsFromGroupTest;
