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

const GetChatsTest = () => {
  const { account } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string | undefined>(
    undefined
  );
  const [getChatsResponse, setGetChatsResponse] = useState<any>('');

  const updatePgpPrivateKey = (e: React.SyntheticEvent<HTMLElement>) => {
    setPgpPrivateKey((e.target as HTMLInputElement).value);
  };

  const testGetChats = async () => {
    try {
      setLoading(true);

      const response = await PushAPI.chat.chats({
        account: isCAIP ? walletToPCAIP10(account) : account,
        pgpPrivateKey,
        env,
      });

      setGetChatsResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Send Message Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <div>
            <SectionItem style={{ marginTop: 20 }}>
              <label>Decrypted Pgp Private Key</label>
              <input
                type="text"
                onChange={updatePgpPrivateKey}
                value={pgpPrivateKey}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testGetChats}>get chats</SectionButton>
            </SectionItem>
          </div>
        </SectionItem>

        <SectionItem>
          <div>
            {getChatsResponse ? (
              <CodeFormatter>
                {JSON.stringify(getChatsResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default GetChatsTest;
