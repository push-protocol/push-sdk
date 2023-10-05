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

const CreateGroupTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
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
  const [meta, setMeta] = useState<string>();
  const [rules, setRules] = useState<string>();

  const [account, setAccount] = useState<string>(acc);

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

  const updateMeta = (e: React.SyntheticEvent<HTMLElement>) => {
    setMeta((e.target as HTMLInputElement).value);
  };

  const updateRules = (e: React.SyntheticEvent<HTMLElement>) => {
    setRules((e.target as HTMLInputElement).value);
  };

  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const testCreateGroup = async () => {
    try {
      setLoading(true);
      const librarySigner = await library.getSigner();
      // Remove empty string elements
      const response = await PushAPI.chat.createGroup({
        groupName,
        groupDescription,
        members: members ? members.split(',') : [],
        groupImage,
        admins: admins ? admins.split(',') : [],
        isPublic: isPublic === 'true',
        contractAddressNFT,
        numberOfNFTs: numberOfNFTs != null ? Number(numberOfNFTs) : undefined,
        contractAddressERC20,
        numberOfERC20:
          numberOfERC20 != null ? Number(numberOfERC20) : undefined,
        account: isCAIP ? walletToPCAIP10(account) : account,
        signer: librarySigner,
        env,
        meta: meta,
        rules: {
          'chat': {
            'conditions': [
              {
                'all': [
                  {
                    'type': PushAPI.ConditionType.PUSH,
                    'category': 'ERC20',
                    'subcategory': 'holder',
                    'data': {
                      'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                      'amount': 1,
                      'decimals': 18
                    }
                  }
                ]
              }
            ]
          }
        }
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
              <label>Account</label>
              <input
                type="text"
                onChange={updateAccount}
                value={account}
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
              <label>meta</label>
              <input
                type="text"
                onChange={updateMeta}
                value={meta}
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
