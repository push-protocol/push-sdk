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

const GetUserTest = () => {
  const { account } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [connectedUser, setConnectedUser] = useState<any>({});
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState<string | null>(
    null
  );

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
        const response = await PushAPI.chat.decryptWithWalletRPCMethod(
          (connectedUser as IUser).encryptedPrivateKey,
          isCAIP ? walletToPCAIP10(account) : account
        );

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
      <h2>Get User Test page</h2>

      <Loader show={isLoading} />

      <Section>
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

export default GetUserTest;
