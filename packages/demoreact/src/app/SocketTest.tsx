import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Section, SectionButton } from './components/StyledComponents';
import Loader from './components/Loader';
import { DarkIcon, LightIcon } from './components/Icons';
import { SocketContext } from './context';

const TabButtons = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ThemeSelector = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 32px;
`;

const Connection = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;

  &.connected {
    background: green;
  }

  &.disconnected {
    background: red;
  }
`;

const SocketTest = () => {  
  const [isLoading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  const {
    epnsSDKSocket,
    feedsSinceLastConnection,
    isSDKSocketConnected,
    lastConnectionTimestamp
  } = useContext<any>(SocketContext);

  const toggleTheme = () => {
    setTheme(lastTheme => {
      return lastTheme === 'dark' ? 'light' : 'dark'
    })
  };

  const toggleSocketConnection = () => {
    if (!epnsSDKSocket?.connected) {
      epnsSDKSocket?.connect();
    } else {
      epnsSDKSocket?.disconnect();
    }
  };  

  return (
      <div>
        <Header>
          <h2>Socket Test page</h2>
          
          <ThemeSelector>
            {theme === 'dark' ? <DarkIcon title="Dark" onClick={toggleTheme}/> : <LightIcon title="Light" onClick={toggleTheme}/>}
          </ThemeSelector>
        </Header>
                
        <TabButtons>
          <SectionButton onClick={toggleSocketConnection}>{isSDKSocketConnected ? 'Disconnect Socket' : 'Connect Socket'}</SectionButton>
          <Connection className={isSDKSocketConnected ? 'connected' : 'disconnected'} />
        </TabButtons>

        <p>{lastConnectionTimestamp ? `Last connected at: ${lastConnectionTimestamp}`: null}</p>

        <Loader show={isLoading} />

        <Section theme={theme}>
          <p style={{ color: 'green' }}>Socket feeds:</p>
          <pre style={{ color: 'green' }}>{JSON.stringify(feedsSinceLastConnection, null, 4)}</pre>
        </Section>

      </div>
  );
}

export default SocketTest;