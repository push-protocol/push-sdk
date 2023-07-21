import React, { useEffect, useState, useContext } from 'react';
import {
  Section,
  SectionItem,
  CodeFormatter,
  SectionButton,
} from './components/StyledComponents';
import Loader from './components/Loader';
import { Web3Context, EnvContext } from './context';
import Dropdown from './components/Dropdown';
import * as PushAPI from '@pushprotocol/restapi';
import { getCAIPAddress } from './helpers';

const AliasTest = () => {
  const { library, account, chainId } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [aliasAddr, setAliasAddr] = useState<string>('');
  const [aliasChain, setAliasChain] = useState<'POLYGON' | 'BSC'>('POLYGON');
  const [isLoading, setLoading] = useState(false);
  const [aliasData, setAliasData] = useState();

  const updateAliasAddr = (e: React.SyntheticEvent<HTMLElement>) => {
    setAliasAddr((e.target as HTMLInputElement).value);
  };

  const updateAliasChain = (e: any) => {
    setAliasChain(e.target.value);
  };

  const testGetAliasInfo = async () => {
    try {
      setLoading(true);

      // object for channel data
      const response = await PushAPI.alias.getAliasInfo({
        aliasChain: aliasChain,
        alias: aliasAddr,
        env: env,
      });

      setAliasData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Alias Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <label>Alias Address</label>
          <input
            type="text"
            onChange={updateAliasAddr}
            value={aliasAddr}
            style={{ width: 400, height: 30 }}
          />
          <label>Alias ChainId</label>
          <Dropdown
            label=""
            options={[
              { label: 'POLYGON', value: 'POLYGON' },
              { label: 'BSC', value: 'BSC' },
            ]}
            value={aliasChain}
            onChange={updateAliasChain}
          />
          <SectionButton onClick={testGetAliasInfo}>
            get alias info
          </SectionButton>
        </SectionItem>

        {aliasData ? (
          <CodeFormatter>{JSON.stringify(aliasData, null, 4)}</CodeFormatter>
        ) : null}
      </Section>
    </div>
  );
};

export default AliasTest;
