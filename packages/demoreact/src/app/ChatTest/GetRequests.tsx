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
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { isValidCAIP10NFTAddress } from 'packages/restapi/src/lib/helpers';

const GetRequestsTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [getRequestsResponse, setGetRequestsResponse] = useState<any>('');
  const [toDecrypt, setToDecrypt] = useState<boolean>(false);
  const [account, setAccount] = useState<string>(acc);

  const updateToDecrypt = (e: React.SyntheticEvent<HTMLElement>) => {
    setToDecrypt((e.target as HTMLInputElement).checked);
  };
  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };
  const testGetRequests = async () => {
    try {
      setLoading(true);
      const user = await PushAPI.user.get({ account: account, env });
      let pvtkey = null;
      const librarySigner = library.getSigner();
      if (user?.encryptedPrivateKey) {
        pvtkey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account,
          signer: librarySigner,
          encryptedPassword: user.encryptedPassword,
          isNFTProfile: isValidCAIP10NFTAddress(account),
          env,
        });
      }
      const response = await PushAPI.chat.requests({
        account: isCAIP ? walletToPCAIP10(account) : account,
        pgpPrivateKey: pvtkey,
        toDecrypt,
        env,
      });

      setGetRequestsResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ChatTest />
      <h2>Get Requests Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <div>
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
            <label>account</label>
            <input
              type="text"
              onChange={updateAccount}
              value={account}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>
          <SectionItem style={{ marginTop: 20 }}>
            <SectionButton onClick={testGetRequests}>
              get requests
            </SectionButton>
          </SectionItem>
        </div>
        <SectionItem>
          <div>
            {getRequestsResponse ? (
              <CodeFormatter>
                {JSON.stringify(getRequestsResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default GetRequestsTest;
