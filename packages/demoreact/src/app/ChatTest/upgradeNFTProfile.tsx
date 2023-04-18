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

const UpgradeNFTProfileTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [connectedUser, setConnectedUser] = useState<any>({});
  const [progress, setProgress] = useState<ProgressHookType | null>(null);
  const [nftTokenId, setNftTokenId] = useState<number>(1);
  const [nftChainId, setNftChainId] = useState<number>(5);
  const [newPassword, setNewPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [nftContractAddress, setNftContractAddress] = useState<string>('');

  const updateNFTTokenId = (e: React.SyntheticEvent<HTMLElement>) => {
    setNftTokenId(parseInt((e.target as HTMLInputElement).value));
  };

  const updateNFTChainId = (e: React.SyntheticEvent<HTMLElement>) => {
    setNftChainId(parseInt((e.target as HTMLInputElement).value));
  };

  const updateCurrentPassword = (e: React.SyntheticEvent<HTMLElement>) => {
    setCurrentPassword((e.target as HTMLInputElement).value);
  };

  const updateNewPassword = (e: React.SyntheticEvent<HTMLElement>) => {
    setNewPassword((e.target as HTMLInputElement).value);
  };

  const updateNftContractAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    setNftContractAddress((e.target as HTMLInputElement).value);
  };

  const handleProgress = (progress: ProgressHookType) => {
    setProgress(progress);
  };

  const testUpgradeNFTProfile = async (index: number) => {
    try {
      setLoading(true);
      let response;
      switch (index) {
        case 0:
          {
            const librarySigner = await library.getSigner();
            response = await PushAPI.user.upgradeNFTProfile({
              signer: librarySigner,
              account: account,
              currentPassword: currentPassword,
              newPassword: newPassword,
              did: `eip155:${nftChainId}:${nftContractAddress}:nft:${nftTokenId}`,
              progressHook: handleProgress,
              env,
            });
          }
          break;
        case 1:
          {
            const walletPvtKey = '';
            const Pkey = `0x${walletPvtKey}`;
            const pvtKeySigner = new ethers.Wallet(Pkey);
            response = await PushAPI.user.upgradeNFTProfile({
              signer: pvtKeySigner,
              account: account,
              currentPassword: currentPassword,
              newPassword: newPassword,
              did: `eip155:${nftChainId}:${nftContractAddress}:nft:${nftTokenId}`,
              progressHook: handleProgress,
              env,
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
      <h2>Upgrade NFT Profile Test page</h2>

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

        <SectionItem style={{ marginTop: 20 }}>
          <label>Current Password</label>
          <input
            type="text"
            onChange={updateCurrentPassword}
            value={currentPassword}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>

        <SectionItem style={{ marginTop: 20 }}>
          <label>New Password</label>
          <input
            type="text"
            onChange={updateNewPassword}
            value={newPassword}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>

        <SectionItem style={{ marginTop: 20 }}>
          <label>Note: Connected Wallet should hold the entered nft !!!</label>
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testUpgradeNFTProfile(0)}>
            UpgradeNFTProfile with library signer
          </SectionButton>
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testUpgradeNFTProfile(1)}>
            UpgradeNFTProfile with private key signer
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

export default UpgradeNFTProfileTest;
