import React, { useEffect, useState, useContext } from 'react';
import {
  Section,
  SectionItem,
  CodeFormatter,
  SectionButton,
} from './components/StyledComponents';
import Loader from './components/Loader';
import { Web3Context, EnvContext } from './context';
import * as PushAPI from '@pushprotocol/restapi';
import { getCAIPAddress } from './helpers';

const DelegationTest = () => {
  const { account } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [delegationData, setDelegationData] = useState();

  const testGetDelegations = async () => {
    try {
      const response = await PushAPI.user.getDelegations({
        user: isCAIP ? getCAIPAddress(env, account) : account,
        env,
      });

      setDelegationData(response);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Delegations Test Page</h2>

      <Section>
        <SectionItem>
          <SectionButton onClick={testGetDelegations}>
            get delegations data
          </SectionButton>
        </SectionItem>

        <SectionItem style={{ marginTop: 20 }}>
          <div>
            {delegationData ? (
              <CodeFormatter>
                {JSON.stringify(delegationData, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default DelegationTest;
