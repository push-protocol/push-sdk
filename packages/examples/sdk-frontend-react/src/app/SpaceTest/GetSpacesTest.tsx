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
import SpaceTest from './SpaceTest';

const GetSpacesTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [getSpacesResponse, setGetSpacesResponse] = useState<any>('');
  const [toDecrypt, setToDecrypt] = useState<boolean>(false);
  const [account, setAccount] = useState<string>(acc);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const updatePage = (e: React.SyntheticEvent<HTMLElement>) => {
    setPage(parseInt((e.target as HTMLInputElement).value));
  };

  const updateLimit = (e: React.SyntheticEvent<HTMLElement>) => {
    setLimit(parseInt((e.target as HTMLInputElement).value));
  };

  const updateToDecrypt = (e: React.SyntheticEvent<HTMLElement>) => {
    setToDecrypt((e.target as HTMLInputElement).checked);
  };
  const testGetSpaces = async () => {
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
      const response = await PushAPI.space.spaces({
        account: account,
        pgpPrivateKey: pvtkey,
        toDecrypt,
        env,
        page,
        limit,
      });

      setGetSpacesResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SpaceTest />
      <h2>Get Spaces Test page</h2>

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
          <SectionItem style={{ marginTop: 20 }}>
            <label>page</label>
            <input
              type="text"
              onChange={updatePage}
              value={page}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>
          <SectionItem style={{ marginTop: 20 }}>
            <label>limit</label>
            <input
              type="text"
              onChange={updateLimit}
              value={limit}
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
            <SectionButton onClick={testGetSpaces}>get spaces</SectionButton>
          </SectionItem>
        </div>
        <SectionItem>
          <div>
            {getSpacesResponse ? (
              <CodeFormatter>
                {JSON.stringify(getSpacesResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default GetSpacesTest;
