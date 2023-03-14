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

const UpgradeUserTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [connectedUser, setConnectedUser] = useState<any>({});


  const testCreateUser = async (index: number) => {
    try {
      setLoading(true);
      let response;
      switch (index) {
        case 1: {
          const librarySigner = await library.getSigner();
          response = await PushAPI.user.upgrade({
            signer: librarySigner,
            env
          });
        }
          break;
        case 2: {
          const librarySigner = await library.getSigner();
          response = await PushAPI.user.upgrade({
            signer: librarySigner,
            account: account,
            env
          });
        }
          break;
        case 3: {
          const walletPvtKey = '';
          const Pkey = `0x${walletPvtKey}`;
          const pvtKeySigner = new ethers.Wallet(Pkey);
          response = await PushAPI.user.upgrade({
            signer: pvtKeySigner,
            account: account,
            env
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
      <h2>Upgrade User Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testCreateUser(1)}>
            Upgrade user with library signer
          </SectionButton>
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testCreateUser(2)}>
            Upgrade user with address & library signer
          </SectionButton>
        </SectionItem>
        <SectionItem style={{ marginTop: 20 }}>
          <SectionButton onClick={() => testCreateUser(3)}>
            Upgrade user with private key signer
          </SectionButton>
        </SectionItem>

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

export default UpgradeUserTest;
