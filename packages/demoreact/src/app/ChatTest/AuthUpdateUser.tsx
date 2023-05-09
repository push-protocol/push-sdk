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
import { ethers } from 'ethers';

type ProgressHookType = {
  progressId: string;
  progressTitle: string;
  progressInfo: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
};

const AuthUpdateUserTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [connectedUser, setConnectedUser] = useState<any>({});
  const [progress, setProgress] = useState<ProgressHookType | null>(null);
  const [account, setAccount] = useState(acc);
  const [pgpPrivKey, setPgpPrivKey] = useState('');
  const [pgpPubKey, setPgpPubKey] = useState('');
  const [pgpEncVersion, setPgpEncVersion] = useState('');
  const [password, setPassword] = useState('#TestPassword1');
  const handleProgress = (progress: ProgressHookType) => {
    setProgress(progress);
  };
  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const updatePgpPrivKey = (e: React.SyntheticEvent<HTMLElement>) => {
    setPgpPrivKey((e.target as HTMLInputElement).value);
  };

  const updatePgpPubKey = (e: React.SyntheticEvent<HTMLElement>) => {
    setPgpPubKey((e.target as HTMLInputElement).value);
  };

  const updatePgpEncVersion = (e: React.SyntheticEvent<HTMLElement>) => {
    setPgpEncVersion((e.target as HTMLInputElement).value);
  };

  const updatePassword = (e: React.SyntheticEvent<HTMLElement>) => {
    setPassword((e.target as HTMLInputElement).value);
  };

  const testCreateUser = async (index: number) => {
    try {
      setLoading(true);
      let response;
      switch (index) {
        case 0:
          {
            const librarySigner = await library.getSigner();
            response = await PushAPI.user.auth.update({
              signer: librarySigner,
              pgpPrivateKey: pgpPrivKey,
              pgpPublicKey: pgpPubKey,
              pgpEncryptionVersion: pgpEncVersion as any,
              account: account,
              env,
              progressHook: handleProgress,
              additionalMeta: {
                NFTPGP_V1: {
                  password: password,
                },
              },
            });
          }
          break;
        case 1:
          {
            const walletPvtKey = '';
            const Pkey = `0x${walletPvtKey}`;
            const pvtKeySigner = new ethers.Wallet(Pkey);
            response = await PushAPI.user.auth.update({
              signer: pvtKeySigner,
              pgpPrivateKey: pgpPrivKey,
              pgpPublicKey: pgpPubKey,
              pgpEncryptionVersion: pgpEncVersion as any,
              account: account,
              env,
              additionalMeta: {
                NFTPGP_V1: {
                  password: password,
                },
              },
            });
          }
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

  return (
    <div>
      <ChatTest />
      <h2>Auth Update User Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem style={{ marginTop: 20 }}>
          <label>pgp Private Key</label>
          <input
            type="text"
            onChange={updatePgpPrivKey}
            value={pgpPrivKey}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <label>pgp Public Key</label>
          <input
            type="text"
            onChange={updatePgpPubKey}
            value={pgpPubKey}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <label>pgp Encryption Version</label>
          <input
            type="text"
            onChange={updatePgpEncVersion}
            value={pgpEncVersion}
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
          <label>password</label>
          <input
            type="text"
            onChange={updatePassword}
            value={password}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testCreateUser(0)}>
            Auth Update user with address & library signer
          </SectionButton>
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testCreateUser(1)}>
            Auth Update user with private key signer
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

export default AuthUpdateUserTest;
