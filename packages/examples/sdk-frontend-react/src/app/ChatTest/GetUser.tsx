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
import { IUser } from '@pushprotocol/restapi';
import { walletToPCAIP10 } from '../helpers';
import ChatTest from './ChatTest';

type ProgressHookType = {
  progressId: string;
  progressTitle: string;
  progressInfo: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
};

const GetUserTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [connectedUser, setConnectedUser] = useState<any>(null);
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState<string | null>(
    null
  );
  const [progress, setProgress] = useState<ProgressHookType | null>(null);
  const [account, setAccount] = useState(acc);
  const [password, setPassword] = useState<string | null>(null);

  const handleProgress = (progress: ProgressHookType) => {
    setProgress(progress);
  };

  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const testGetUser = async () => {
    try {
      setLoading(true);

      // object for connected user data
      const response = await PushAPI.user.get({
        account: isCAIP ? walletToPCAIP10(account) : account,
        env,
      });

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
      if (Object.keys(connectedUser).length > 0) {
        const librarySigner = await library.getSigner();
        const response = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: (connectedUser as IUser).encryptedPrivateKey,
          account: isCAIP ? walletToPCAIP10(account) : account,
          signer: librarySigner,
          env,
          toUpgrade: true,
          progressHook: handleProgress,
        });

        setDecryptedPrivateKey(response);
      } else return;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testPasswordDecryption = async () => {
    try {
      setLoading(true);
      if (Object.keys(connectedUser).length > 0) {
        const librarySigner = await library.getSigner();
        const { encryptedPassword } = JSON.parse(
          (connectedUser as IUser).encryptedPrivateKey
        );
        const response = await PushAPI.user.decryptAuth({
          account: isCAIP ? walletToPCAIP10(account) : account,
          signer: librarySigner,
          env,
          additionalMeta: {
            NFTPGP_V1: {
              encryptedPassword: JSON.stringify(encryptedPassword),
            },
          },
          progressHook: handleProgress,
        });
        setPassword(response);
      } else return;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ChatTest />
      <h2>Get User Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem style={{ marginTop: 20 }}>
          <label>account</label>
          <input
            type="text"
            onChange={updateAccount}
            value={account}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <SectionButton onClick={testGetUser}>get user data</SectionButton>
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <div>
            {connectedUser ? (
              <CodeFormatter>
                {JSON.stringify(connectedUser, null, 4)}
              </CodeFormatter>
            ) : null}
            <SectionButton onClick={testPrivateKeyDecryption}>
              decrypt private key
            </SectionButton>
            {progress && (
              <div>
                <h3>{progress.progressTitle}</h3>
                <p>{progress.progressInfo}</p>
                <p>Level: {progress.level}</p>
              </div>
            )}
            {decryptedPrivateKey ? (
              <CodeFormatter>
                {JSON.stringify(decryptedPrivateKey, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
        {connectedUser && (connectedUser as IUser).did.split(':')[0] === 'nft' && (
          <SectionItem style={{ marginTop: 20 }}>
            <div>
              {connectedUser ? <CodeFormatter>{password}</CodeFormatter> : null}
              <SectionButton onClick={testPasswordDecryption}>
                decrypt password
              </SectionButton>
              {progress && (
                <div>
                  <h3>{progress.progressTitle}</h3>
                  <p>{progress.progressInfo}</p>
                  <p>Level: {progress.level}</p>
                </div>
              )}
            </div>
          </SectionItem>
        )}
      </Section>
    </div>
  );
};

export default GetUserTest;
