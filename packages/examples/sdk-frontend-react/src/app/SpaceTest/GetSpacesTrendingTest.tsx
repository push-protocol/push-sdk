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

const GetSpacesTrendingTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [getSpacesTrendingResponse, setGetSpacesTrendingResponse] =
    useState<any>('');
  const [toDecrypt, setToDecrypt] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const updatePage = (e: React.SyntheticEvent<HTMLElement>) => {
    setPage(parseInt((e.target as HTMLInputElement).value));
  };

  const updateLimit = (e: React.SyntheticEvent<HTMLElement>) => {
    setLimit(parseInt((e.target as HTMLInputElement).value));
  };

  const updateToDecrypt = (e: React.SyntheticEvent<HTMLElement>) => {
    setToDecrypt((e.target as HTMLInputElement).checked);
  };
  const testGetSpacesTrending = async () => {
    try {
      setLoading(true);

      const response = await PushAPI.space.trending({
        env,
        page,
        limit,
      });

      setGetSpacesTrendingResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SpaceTest />
      <h2>Get Spaces Trending Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <div>
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
            <SectionButton onClick={testGetSpacesTrending}>
              get spaces
            </SectionButton>
          </SectionItem>
        </div>
        <SectionItem>
          <div>
            {getSpacesTrendingResponse ? (
              <CodeFormatter>
                {JSON.stringify(getSpacesTrendingResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default GetSpacesTrendingTest;
