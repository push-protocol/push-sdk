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

const CreateGroupTest = () => {
  const { account } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [members, setMembers] = useState<string>('');
  const [groupImage, setGroupImage] = useState<string>('');
  const [admins, setAdmins] = useState<string>('');
  const [isPublic, setIsPublic] = useState<string>('');
  const [contractAddressNFT, setContractAddressNFT] = useState<string>();
  const [numberOfNFTs, setNumberOfNFTs] = useState<string>();
  const [contractAddressERC20, setContractAddressERC20] = useState<string>();
  const [numberOfERC20, setNumberOfERC20] = useState<string>();
  const [groupCreator, setGroupCreator] = useState<string>('');


  const [sendResponse, setSendResponse] = useState<any>('');

  const updateGroupName = (e: React.SyntheticEvent<HTMLElement>) => {
    setGroupName((e.target as HTMLInputElement).value);
  };

  const updateGroupDescription = (e: React.SyntheticEvent<HTMLElement>) => {
    setGroupDescription((e.target as HTMLInputElement).value);
  };

  const updateMembers = (e: React.SyntheticEvent<HTMLElement>) => {
    setMembers((e.target as HTMLInputElement).value);
  };

  const updateGroupImage = (e: React.SyntheticEvent<HTMLElement>) => {
    setGroupImage((e.target as HTMLInputElement).value);
  };

  const updateAdmins = (e: React.SyntheticEvent<HTMLElement>) => {
    setAdmins((e.target as HTMLInputElement).value);
  };

  const updateIsPublic = (e: React.SyntheticEvent<HTMLElement>) => {
    setIsPublic((e.target as HTMLInputElement).value);
  };

  const updateContractAddressNFT = (e: React.SyntheticEvent<HTMLElement>) => {
    setContractAddressNFT((e.target as HTMLInputElement).value);
  };

  const updateNumberOfNFTs = (e: React.SyntheticEvent<HTMLElement>) => {
    setNumberOfNFTs((e.target as HTMLInputElement).value);
  };

  const updateContractAddressERC20 = (e: React.SyntheticEvent<HTMLElement>) => {
    setContractAddressERC20((e.target as HTMLInputElement).value);
  };

  const updateNumberOfERC20 = (e: React.SyntheticEvent<HTMLElement>) => {
    setNumberOfERC20((e.target as HTMLInputElement).value);
  };

  const updateGroupCreator = (e: React.SyntheticEvent<HTMLElement>) => {
    setGroupCreator((e.target as HTMLInputElement).value);
  };


  const testCreateGroup = async () => {
    try {
      setLoading(true);
      const user = await PushAPI.user.get({ account: account, env });
      let pvtkey = null;
      if (user?.encryptedPrivateKey) {
        pvtkey = await PushAPI.chat.decryptWithWalletRPCMethod(
          user.encryptedPrivateKey,
          account
        );
      }

      // Remove empty string elements
      let membersNotEmpty = [members]
      membersNotEmpty = membersNotEmpty.filter(str => str !== '')
      let adminNotEmpty = [admins]
      adminNotEmpty = adminNotEmpty.filter(str => str !== '')

      const response = await PushAPI.chat.createGroup({
        groupName,
        groupDescription,
        members: membersNotEmpty,
        groupImage,
        admins: adminNotEmpty,
        isPublic: (isPublic === "true"),
        groupCreator,
        contractAddressNFT,
        numberOfNFTs: numberOfNFTs != null ? Number(numberOfNFTs) : undefined,
        contractAddressERC20,
        numberOfERC20: numberOfERC20 != null ? Number(numberOfERC20) : undefined,
        account: isCAIP ? walletToPCAIP10(account) : account,
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
      <h2>Create Group Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <div>
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


            <SectionItem>
              <label>members</label>
              <input
                type="text"
                onChange={updateMembers}
                value={members}
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
              <label>admins</label>
              <input
                type="text"
                onChange={updateAdmins}
                value={admins}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>isPublic</label>
              <input
                type="text"
                onChange={updateIsPublic}
                value={isPublic}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>contractAddressNFT</label>
              <input
                type="text"
                onChange={updateContractAddressNFT}
                value={contractAddressNFT}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>


            <SectionItem style={{ marginTop: 20 }}>
              <label>numberOfNFTs</label>
              <input
                type="text"
                onChange={updateNumberOfNFTs}
                value={numberOfNFTs}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>contractAddressERC20</label>
              <input
                type="text"
                onChange={updateContractAddressERC20}
                value={contractAddressERC20}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>numberOfERC20</label>
              <input
                type="text"
                onChange={updateNumberOfERC20}
                value={numberOfERC20}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>groupCreator</label>
              <input
                type="text"
                onChange={updateGroupCreator}
                value={groupCreator}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>





            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testCreateGroup}>
                create group
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

export default CreateGroupTest;
