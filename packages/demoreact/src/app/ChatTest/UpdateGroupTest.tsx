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

const UpdateGroupTest = () => {
  const { account } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [numberOfNFTs, setNumberOfNFTs] = useState<string>();
  const [numberOfERC20, setNumberOfERC20] = useState<string>();
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [admin, setAdmin] = useState<string>('');
  const [addMembers, setAddMembers] = useState<string>('');
  const [removeMembers, setRemoveMembers] = useState<string>('');
  const [verificationProof, setVerificationProof] = useState<string>('');

  const [sendResponse, setSendResponse] = useState<any>('');

  const updateChatId = (e: React.SyntheticEvent<HTMLElement>) => {
    setChatId((e.target as HTMLInputElement).value);
  };

  const updateGroupName = (e: React.SyntheticEvent<HTMLElement>) => {
    setGroupName((e.target as HTMLInputElement).value);
  };

  const updateNumberOfNFTs= (e: React.SyntheticEvent<HTMLElement>) => {
    setNumberOfNFTs((e.target as HTMLInputElement).value);
  };

  const updateNumberOfERC20 = (e: React.SyntheticEvent<HTMLElement>) => {
    setNumberOfERC20((e.target as HTMLInputElement).value);
  };

  const updateProfilePicture= (e: React.SyntheticEvent<HTMLElement>) => {
    setProfilePicture((e.target as HTMLInputElement).value);
  };

  const updateAdmin= (e: React.SyntheticEvent<HTMLElement>) => {
    setAdmin((e.target as HTMLInputElement).value);
  };

  const updateAddMembers= (e: React.SyntheticEvent<HTMLElement>) => {
    setAddMembers((e.target as HTMLInputElement).value);
  };

 
  const updateRemoveMembers= (e: React.SyntheticEvent<HTMLElement>) => {
    setRemoveMembers((e.target as HTMLInputElement).value);
  };


  const updateVerificationProof = (e: React.SyntheticEvent<HTMLElement>) => {
    setVerificationProof((e.target as HTMLInputElement).value);
  };

  const testUpdateGroup = async () => {
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

      const response = await PushAPI.chat.updateGroup({
        chatId,
        groupName,
        numberOfERC20: Number(numberOfERC20),
        numberOfNFTs: Number(numberOfNFTs),
        profilePicture,
        addMembers: [addMembers],
        removeMembers: [removeMembers],
        admin,
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
      <h2>Send Message Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <div>


          <SectionItem>
              <label>members</label>
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

     

            <SectionItem style={{ marginTop: 20 }}>
              <label>profilePicture</label>
              <input
                type="text"
                onChange={updateProfilePicture}
                value={profilePicture}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
        
            <SectionItem style={{ marginTop: 20 }}>
              <label>admin</label>
              <input
                type="text"
                onChange={updateAdmin}
                value={admin}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>addMembers</label>
              <input
                type="text"
                onChange={updateAddMembers}
                value={addMembers}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>removeMembers</label>
              <input
                type="text"
                onChange={updateRemoveMembers}
                value={removeMembers}
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
              <label>numberOfERC20</label>
              <input
                type="text"
                onChange={updateNumberOfERC20}
                value={numberOfERC20}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

           <SectionItem style={{ marginTop: 20 }}>
              <label>VerificationProof</label>
              <input
                type="text"
                onChange={updateVerificationProof}
                value={verificationProof}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

  
        
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testUpdateGroup}>
                send message
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
