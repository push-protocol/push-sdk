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

const GetChatsTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [getChatsResponse, setGetChatsResponse] = useState<any>('');
  const [toDecrypt, setToDecrypt] = useState<boolean>(false);
  const [account, setAccount] = useState<string>(acc);
  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const updateToDecrypt = (e: React.SyntheticEvent<HTMLElement>) => {
    setToDecrypt((e.target as HTMLInputElement).checked);
  };
  const testGetChats = async () => {
    try {
      setLoading(true);
      const librarySigner = await library.getSigner();
      const user = await PushAPI.user.get({ account: account, env });
      let pvtkey = null;
      if (user?.encryptedPrivateKey) {
        pvtkey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account,
          signer: librarySigner,
          env,
        });
      }
      const response = await PushAPI.chat.chats({
        account: account,
        pgpPrivateKey: pvtkey,
        toDecrypt,
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
      <ChatTest />
      <h2>Get Chats Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <div>
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
            <input
              type="checkbox"
              onChange={updateToDecrypt}
              checked={toDecrypt}
              style={{ width: 20, height: 20 }}
            />
            <label>Decrypt response</label>
          </SectionItem>
          <SectionItem style={{ marginTop: 20 }}>
            <SectionButton onClick={testGetChats}>get chats</SectionButton>
          </SectionItem>
        </div>
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
