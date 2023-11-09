import { NextPage } from 'next';
import styled from 'styled-components';
import { Button, Container } from '..';
import Link from 'next/link';

import { useSpaceComponents } from './../../components/Spaces/useSpaceComponent';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { AccountContext } from '../../contexts';

const Spaces: NextPage = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const { pgpPrivateKey, setPgpPrivateKey } = useContext<any>(AccountContext);
  const { SpaceWidgetComponent } = useSpaceComponents();
  const env = ENV.DEV;

  useEffect(() => {
    (async () => {
      if (!signer || !address || pgpPrivateKey) return;

      const user = await PushAPI.user.get({
        account: address,
        env,
      });
      let PgpPrivateKey = null;
      if (user?.encryptedPrivateKey) {
        PgpPrivateKey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account: address,
          signer,
          env,
        });
      }

      setPgpPrivateKey(PgpPrivateKey);
    })();
  }, [address, env, signer]);

  return (
    <AccountContext.Provider value={{ pgpPrivateKey }}>
      <Container>
        <h1>Spaces UI Test</h1>
        <Section>
          <Button>
            <Link href="/spaces/widget">Spaces Widget</Link>
          </Button>
          <Button>
            <Link href="/spaces/feed">Spaces Feed</Link>
          </Button>
          <Button>
            <Link href="/spaces/banner">Spaces Banner</Link>
          </Button>
          <Button>
            <Link href="/spaces/create">Create Space</Link>
          </Button>
          <Button>
            <Link href="/spaces/invites">Spaces Invites</Link>
          </Button>
        </Section>
        <SpaceWidgetComponent />
      </Container>
    </AccountContext.Provider>
  );
};

export default Spaces;

const Section = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;
