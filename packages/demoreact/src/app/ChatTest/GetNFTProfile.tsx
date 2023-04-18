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

const GetNFTProfileTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [connectedUser, setConnectedUser] = useState<any>({});
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState<string | null>(
    null
  );
  const [nftTokenId, setNftTokenId] = useState<number>(1);
  const [nftChainId, setNftChainId] = useState<number>(5);
  const [password, setPassword] = useState<string>('');
  const [nftContractAddress, setNftContractAddress] = useState<string>('');

  const updateNFTTokenId = (e: React.SyntheticEvent<HTMLElement>) => {
    setNftTokenId(parseInt((e.target as HTMLInputElement).value));
  };

  const updateNFTChainId = (e: React.SyntheticEvent<HTMLElement>) => {
    setNftChainId(parseInt((e.target as HTMLInputElement).value));
  };

  const updatePassword = (e: React.SyntheticEvent<HTMLElement>) => {
    setPassword((e.target as HTMLInputElement).value);
  };

  const updateNftContractAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    setNftContractAddress((e.target as HTMLInputElement).value);
  };
  const [progress, setProgress] = useState<ProgressHookType | null>(null);

  const handleProgress = (progress: ProgressHookType) => {
    setProgress(progress);
  };

  const testGetNFTProfile = async () => {
    try {
      setLoading(true);

      // object for connected user data
      const response = await PushAPI.user.getNFTProfile({
        did: `eip155:${nftChainId}:${nftContractAddress}:nft:${nftTokenId}`,
        env,
      });

      setConnectedUser(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testNFTProfileDecryption = async () => {
    try {
      setLoading(true);
      if (Object.keys(connectedUser).length > 0) {
        const librarySigner = await library.getSigner();
        const response = await PushAPI.user.decryptNFTProfile({
          encryptedPGPPrivateKey: (connectedUser as IUser).encryptedPrivateKey,
          signer: librarySigner,
          env,
          encryptedPassword: (connectedUser as IUser)
            .encryptedPassword as string,
          decryptedPassword: password === '' ? null : password,
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

  return (
    <div>
      <ChatTest />
      <h2>Get NFT PROFILE Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem style={{ marginTop: 20 }}>
          <label>nftTokenId</label>
          <input
            type="text"
            onChange={updateNFTTokenId}
            value={nftTokenId}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>

        <SectionItem style={{ marginTop: 20 }}>
          <label>nftChainId</label>
          <input
            type="text"
            onChange={updateNFTChainId}
            value={nftChainId}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>

        <SectionItem style={{ marginTop: 20 }}>
          <label>nftContractAddress</label>
          <input
            type="text"
            onChange={updateNftContractAddress}
            value={nftContractAddress}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <SectionButton onClick={testGetNFTProfile}>
            get NFT Profile
          </SectionButton>
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <div>
            {connectedUser ? (
              <CodeFormatter>
                {JSON.stringify(connectedUser, null, 4)}
              </CodeFormatter>
            ) : null}

            <SectionItem style={{ margin: 20 }}>
              <label>password</label>
              <input
                type="text"
                onChange={updatePassword}
                value={password}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionButton onClick={testNFTProfileDecryption}>
              decrypt NFT Profile
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
      </Section>
    </div>
  );
};

export default GetNFTProfileTest;
