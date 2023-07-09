import { NextPage } from 'next';
import styled from 'styled-components';
import { Button, Container } from '..';
import Link from 'next/link';

const Spaces: NextPage = () => {
  return (
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
    </Container>
  );
};

export default Spaces;

const Section = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    wrap: wrap;
}`;
