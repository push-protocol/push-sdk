import { useState } from 'react';
import styled from 'styled-components';
import { Route, Routes, Link } from 'react-router-dom';
import { useWeb3React } from "@web3-react/core";
import ConnectButton from './components/Connect';
import { Checkbox } from './components/Checkbox';
import Dropdown from './components/Dropdown';
import { Web3Context, EnvContext, SocketContext } from './context';
import { useSDKSocket } from './hooks';
import { ReactComponent as PushLogo }  from '../assets/pushLogo.svg';
import NotificationsTest from './NotificationsTest';
import SecretNotificationsTest from './SecretNotificationsTest';
import ChannelsTest from './ChannelsTest';
import EmbedTest from './EmbedTest';
import PayloadsTest from './PayloadsTest';
import SocketTest from './SocketTest';


interface Web3ReactState {
  chainId?: number;
  account?: string | null | undefined;
  active: boolean;
  error?: Error;
  library?: unknown;
}

const StyledApp = styled.div`
  font-family: "Source Sans Pro",Arial,sans-serif;

  & .homeLink {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    text-decoration: none;
    &: hover {
      text-decoration: underline;
    }
  }

  & h1 {
    text-align: center;
    text-transform: uppercase;
    margin: 20px 0px;
    padding: 0px;
    letter-spacing: 0.1em;
    font-family: "Source Sans Pro", Helvetica, sans-serif;
    font-weight: 200;
    font-size: 2rem;
    line-height: 1.25em;
  }

  .nav-button {
    align-items: center;
    background-image: linear-gradient(132deg,#574762,#4a36c4 50%,#ee5555);
    border: 0;
    border-radius: 8px;
    box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
    box-sizing: border-box;
    color: #FFFFFF;
    display: flex;
    font-family: Phantomsans, sans-serif;
    font-size: 20px;
    justify-content: center;
    line-height: 1em;
    max-width: 100%;
    min-width: 140px;
    padding: 19px 24px;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    cursor: pointer;
  }

  .nav-button:hover {
    opacity: 0.8;
  }

  .nav-button:active,
  .nav-button:hover {
    outline: 0;
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;

  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }


`


const checkForWeb3Data = ({ library, active, account, chainId  } : Web3ReactState) => {
  return library && active && account && chainId;
}

export function App() {
  const web3Data : Web3ReactState = useWeb3React();

  const [env, setEnv] = useState('prod');
  const [isCAIP, setIsCAIP] = useState(false);
 
  const socketData = useSDKSocket({
    account: web3Data.account,
    chainId: web3Data.chainId,
    env,
    isCAIP,
  })

  const onChangeEnv = (e: any) => {
    setEnv(e.target.value);
  };

  const onChangeCAIP = () => {
    setIsCAIP(!isCAIP);
  };

  return (
    <StyledApp>
      <Link className='homeLink' to="/">
        <PushLogo style={{ marginRight: 12 }}/>
        <h1>SDK Demo React App</h1>
      </Link>

      <ConnectButton />

      <Dropdown
        label="ENV"
        options={[
          { label: 'prod', value: 'prod' },
          { label: 'staging', value: 'staging' },
          { label: 'dev', value: 'dev' }
        ]}
        value={env}
        onChange={onChangeEnv}
      />

      <div style={{ marginTop: 10 }}>
        <Checkbox id="isCAIP" label="Convert to CAIP" value={isCAIP} onChange={onChangeCAIP} />
      </div>
      

      <hr />
      <EnvContext.Provider value={{ env, isCAIP }}>
      {checkForWeb3Data(web3Data) ? (
        <Web3Context.Provider value={web3Data}>
          <SocketContext.Provider value={socketData}>
            <Routes>
              <Route
                path="/"
                element={
                  <NavMenu>
                    <Link to="/notifications" className='nav-button'>NOTIFICATIONS</Link>
                    <Link to="/secret" className='nav-button'>SECRET NOTIFICATION</Link>
                    <Link to="/channels" className='nav-button'>CHANNELS</Link>
                    <Link to="/payloads" className='nav-button'>PAYLOADS</Link>
                    <Link to="/socket" className='nav-button'>SOCKET</Link>
                    <Link to="/embed" className='nav-button'>EMBDED</Link>
                  </NavMenu>
                }
              />
              <Route
                path="/notifications"
                element={<NotificationsTest />}
              />
              <Route
                path="/secret"
                element={<SecretNotificationsTest />}
              />
          
              <Route
                path="/channels"
                element={<ChannelsTest />}
              />

              <Route
                path="/payloads"
                element={<PayloadsTest />}
              />

              <Route
                path="/socket"
                element={<SocketTest />}
              />

              <Route
                path="/embed"
                element={<EmbedTest />}
              />
            </Routes>
          </SocketContext.Provider>
        </Web3Context.Provider>
      ) : null}
      </EnvContext.Provider>
      
    </StyledApp>
  );
}

export default App;
