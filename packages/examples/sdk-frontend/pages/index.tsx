import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';

const Index: NextPage = () => {
  return (
    <Container>
      <h1>Hello Next.js 👋</h1>
      <ConnectButton />
      <Button>
        <Link href="/video">Video</Link>
      </Button>
      {/* <Button>
        <Link href="/spaces">Spaces UI</Link>
      </Button> */}
    </Container>
  );
};

export default Index;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}`;

export const Button = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.7;
  }
}`;
