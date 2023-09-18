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
import { Rules } from '@pushprotocol/restapi';

const UpdateGroupTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [groupImage, setGroupImage] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [members, setMembers] = useState<string>('');
  const [admins, setAdmins] = useState<string>('');
  const [account, setAccount] = useState<string>(acc);
  const [sendResponse, setSendResponse] = useState<any>('');
  const [rules, setRules] = useState<string>();

  const updateChatId = (e: React.SyntheticEvent<HTMLElement>) => {
    setChatId((e.target as HTMLInputElement).value);
  };

  const updateGroupName = (e: React.SyntheticEvent<HTMLElement>) => {
    setGroupName((e.target as HTMLInputElement).value);
  };
  const updateGroupDescription = (e: React.SyntheticEvent<HTMLElement>) => {
    setGroupDescription((e.target as HTMLInputElement).value);
  };

  const updateGroupImage = (e: React.SyntheticEvent<HTMLElement>) => {
    setGroupImage((e.target as HTMLInputElement).value);
  };

  const updateMembers = (e: React.SyntheticEvent<HTMLElement>) => {
    setMembers((e.target as HTMLInputElement).value);
  };

  const updateAdmins = (e: React.SyntheticEvent<HTMLElement>) => {
    setAdmins((e.target as HTMLInputElement).value);
  };

  const updateRules = (e: React.SyntheticEvent<HTMLElement>) => {
    setRules((e.target as HTMLInputElement).value);
  };

  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };
  const testUpdateGroup = async () => {
    try {
      setLoading(true);
      const librarySigner = await library.getSigner();
      const response = await PushAPI.chat.updateGroup({
        chatId,
        groupName,
        groupImage,
        groupDescription,
        members: members ? members.split(',') : [],
        admins: admins ? admins.split(',') : [],
        account: isCAIP ? walletToPCAIP10(account) : account,
        signer: librarySigner,
        env,
        rules: rules ? JSON.parse(rules) as Rules : undefined
      });

      setSendResponse(response);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ChatTest />
      <h2>Update Group Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <div>
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
              <label>Group Name</label>
              <input
                type="text"
                onChange={updateGroupName}
                value={groupName}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem>
              <label>Group Description</label>
              <input
                type="text"
                onChange={updateGroupDescription}
                value={groupDescription}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>groupImage</label>
              <input
                type="text"
                onChange={updateGroupImage}
                value={groupImage}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>members</label>
              <input
                type="text"
                onChange={updateMembers}
                value={members}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>admins</label>
              <input
                type="text"
                onChange={updateAdmins}
                value={admins}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>rules</label>
              <input
                type="text"
                onChange={updateRules}
                value={rules}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>Group Creator ( Waller Addr or NFT DID )</label>
              <input
                type="text"
                onChange={updateAccount}
                value={account}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testUpdateGroup}>
                update group
              </SectionButton>
            </SectionItem>
          </div>
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

export default UpdateGroupTest;
