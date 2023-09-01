import { useState, useContext } from 'react';
import {
  Section,
  SectionItem,
  CodeFormatter,
  SectionButton,
} from '../components/StyledComponents';
import Loader from '../components/Loader';
import * as PushAPI from '@pushprotocol/restapi';
import { EnvContext } from '../context';

const SearchSpaceTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchResponse, setSendResponse] = useState<any>([]);

  const updateSearchTerm = (e: React.SyntheticEvent<HTMLElement>) => {
    setSearchTerm((e.target as HTMLInputElement).value);
  };

  const updatePageNumber = (e: React.SyntheticEvent<HTMLElement>) => {
    setPageNumber(parseInt((e.target as HTMLInputElement).value));
  };

  const updatePageSize = (e: React.SyntheticEvent<HTMLElement>) => {
    setPageSize(parseInt((e.target as HTMLInputElement).value));
  };

  const testSearchSpaces = async () => {
    try {
      setLoading(true);

      const response = await PushAPI.space.searchSpaces({
        searchTerm,
        pageNumber,
        pageSize,
        env
      });
      setSendResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Space Test Page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <SectionButton onClick={testSearchSpaces}>Search Spaces</SectionButton>
        </SectionItem>
        <SectionItem>
          <label>Search Term</label>
          <input
            type="text"
            onChange={updateSearchTerm}
            value={searchTerm}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <label>Page Number</label>
          <input
            type="number"
            onChange={updatePageNumber}
            value={pageNumber}
            style={{ width: 100, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <label>Page Size</label>
          <input
            type="number"
            onChange={updatePageSize}
            value={pageSize}
            style={{ width: 100, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <div>
            {searchResponse.length > 0 ? (
              <CodeFormatter>
                {JSON.stringify(searchResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default SearchSpaceTest;
