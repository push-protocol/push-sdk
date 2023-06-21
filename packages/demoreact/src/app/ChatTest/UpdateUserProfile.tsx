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
import ChatTest from './ChatTest';
import { walletToPCAIP10 } from '../helpers';

type ProgressHookType = {
  progressId: string;
  progressTitle: string;
  progressInfo: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
};

const UpdateUserProfile = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [connectedUser, setConnectedUser] = useState<any>({});
  const [progress, setProgress] = useState<ProgressHookType | null>(null);
  const [account, setAccount] = useState(acc);
  const [pic, setPic] = useState('');
  const [desc, setDesc] = useState('');
  const [name, setName] = useState('');
  const [blockedUsersList, setblockedUsersList] = useState('');

  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState<string | null>(
    null
  );
  const handleProgress = (progress: ProgressHookType) => {
    setProgress(progress);
  };
  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const updatePic = (e: React.SyntheticEvent<HTMLElement>) => {
    setPic((e.target as HTMLInputElement).value);
  };

  const updateDesc = (e: React.SyntheticEvent<HTMLElement>) => {
    setDesc((e.target as HTMLInputElement).value);
  };

  const updateName = (e: React.SyntheticEvent<HTMLElement>) => {
    setName((e.target as HTMLInputElement).value);
  };

  const updateBlockedUsersList = (e: React.SyntheticEvent<HTMLElement>) => {
    setblockedUsersList((e.target as HTMLInputElement).value);
  };

  const testUpdateUserProfile = async (index: number) => {
    try {
      setLoading(true);
      let response;
      await testPrivateKeyDecryption();
      switch (index) {
        case 0:
          response = await PushAPI.user.profile.update({
            pgpPrivateKey: decryptedPrivateKey as string,
            account: acc,
            profile: {
              name: name,
              desc: desc,
              picture: pic,
              blockedUsersList: blockedUsersList
                ? blockedUsersList.split(',')
                : undefined,
            },
            env,
            progressHook: handleProgress,
          });
          break;
        case 1:
          response = await PushAPI.user.profile.update({
            pgpPrivateKey: decryptedPrivateKey as string,
            account: acc,
            profile: {
              name: name,
              desc: desc,
              picture: pic,
              blockedUsersList: blockedUsersList
                ? blockedUsersList.split(',')
                : undefined,
            },
            env,
            progressHook: handleProgress,
          });
          break;
        default:
          break;
      }

      setConnectedUser(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const testPrivateKeyDecryption = async () => {
    try {
      setLoading(true);
      const response1 = await PushAPI.user.get({
        account: isCAIP ? walletToPCAIP10(account) : account,
        env,
      });
      const librarySigner = await library.getSigner();
      const response2 = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: response1.encryptedPrivateKey,
        account: isCAIP ? walletToPCAIP10(account) : account,
        signer: librarySigner,
        env,
        toUpgrade: true,
        progressHook: handleProgress,
      });

      await setDecryptedPrivateKey(response2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <ChatTest />
      <h2>Profile Update User Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem style={{ marginTop: 20 }}>
          <label>picture</label>
          <input
            type="text"
            onChange={updatePic}
            value={pic}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <label>name</label>
          <input
            type="text"
            onChange={updateName}
            value={name}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <label>Blocked Users (Comma seperated)</label>
          <input
            type="text"
            onChange={updateBlockedUsersList}
            value={blockedUsersList}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <label>desc</label>
          <input
            type="text"
            onChange={updateDesc}
            value={desc}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <label>account</label>
          <input
            type="text"
            onChange={updateAccount}
            value={account}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testUpdateUserProfile(0)}>
            Profile Update user with address & library signer
          </SectionButton>
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testUpdateUserProfile(1)}>
            Profile Update user with private key signer
          </SectionButton>
        </SectionItem>
        {progress && (
          <div>
            <h3>{progress.progressTitle}</h3>
            <p>{progress.progressInfo}</p>
            <p>Level: {progress.level}</p>
          </div>
        )}
        <SectionItem>
          <div>
            {connectedUser ? (
              <CodeFormatter>
                {JSON.stringify(connectedUser, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default UpdateUserProfile;
