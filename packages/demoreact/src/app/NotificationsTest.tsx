import { useEffect, useState, useContext, useCallback } from 'react';
import styled from 'styled-components';
import { Section, SectionItem, SectionButton } from './components/StyledComponents';
import Loader from './components/Loader';
import { DarkIcon, LightIcon } from './components/Icons';
import { Web3Context, EnvContext } from './context';
import * as PushAPI from '@pushprotocol/restapi';
import { NotificationItem, chainNameType, SubscribedModal } from '@pushprotocol/uiweb';
import { getCAIPAddress } from './helpers';

import sampleNotifications from './data';

const NotificationListContainer = styled.div`
  margin: 20px;
  padding: 20px;
  width: 100%;

  @media (max-width: 600px) {
    margin: 0;
    padding: 0;
  }
`


const TabButtons = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: row;
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

const devWorkingAddress = '0xD8634C39BBFd4033c0d3289C4515275102423681';

const NotificationsTest = () => {
  const { account, chainId } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [notifs, setNotifs] = useState<PushAPI.ParsedResponseType[]>();
  const [spams, setSpams] = useState<PushAPI.ParsedResponseType[]>();
  const [theme, setTheme] = useState('dark');
  const [viewType, setViewType] = useState('notif');
  const [showSubscribe, setShowSubscribe] = useState(false);


  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const feeds = await PushAPI.user.getFeeds({
        user: isCAIP ? getCAIPAddress(env, account) : account,
        // user: isCAIP ? getCAIPAddress(env, devWorkingAddress) : devWorkingAddress,
        limit: 30,
        env: env
      });

      console.log('feeds: ', feeds);

      setNotifs(feeds);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [account, env, isCAIP]);

  const loadSpam = useCallback(async () => {
    try {
      setLoading(true);
      const spams = await PushAPI.user.getFeeds({
        user: isCAIP ? getCAIPAddress(env, account) : account,
        spam: true,
        env: env
      });

      setSpams(spams);
  
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [account, env, isCAIP]);

  const toggleTheme = () => {
    setTheme(lastTheme => {
      return lastTheme === 'dark' ? 'light' : 'dark'
    })
  };

  const toggleSubscribedModal = () => {
    setShowSubscribe((lastVal) => !lastVal);
  };


  useEffect(() => {
    if (account) {
      if (viewType === 'notif') {
        loadNotifications();
      } else {
        loadSpam();
      }
    }
  }, [account, viewType, loadNotifications, loadSpam]);

  return (
      <div>
        <Header>
          <h2>Notifications Test page</h2>

          {/* <TestModal /> */}
          
          <ThemeSelector>
            {theme === 'dark' ? <DarkIcon title="Dark" onClick={toggleTheme}/> : <LightIcon title="Light" onClick={toggleTheme}/>}
          </ThemeSelector>
        </Header>
                
        <TabButtons>
          <SectionButton onClick={() => { setViewType('notif') }}>Notifications</SectionButton>
          <SectionButton onClick={() => { setViewType('spam') }}>Spam</SectionButton>
          <SectionButton onClick={toggleSubscribedModal}>show subscribed modal</SectionButton>
        </TabButtons>

        <Loader show={isLoading} />

        {showSubscribe ? <SubscribedModal onClose={toggleSubscribedModal}/> : null}

        <Section theme={theme}>
          {viewType === 'notif' ? (
            <>
            <b className='headerText'>Notifications: </b>
            <SectionItem>
              {notifs ? (
                <NotificationListContainer>
                  {notifs.map((oneNotification, i) => {
  
                  const { 
                    cta,
                    title,
                    message,
                    app,
                    icon,
                    image,
                    url,
                    blockchain,
                    secret,
                    notification
                  } = oneNotification;

                  // const chainName = blockchain as chainNameType;

                  return (
                    <NotificationItem
                      key={`notif-${i}`}
                      notificationTitle={secret ? notification['title'] : title}
                      notificationBody={secret ? notification['body'] : message}
                      cta={cta}
                      app={app}
                      icon={icon}
                      image={image}
                      url={url}
                      theme={theme}
                      // chainName="ETH_TEST_GOERLI"
                      chainName={blockchain as chainNameType}
                    />
                  );
                })}
                </NotificationListContainer>
              ) : null}
            </SectionItem>
            </>

          ) : (
            <>
              <b className='headerText'>Spams: </b>
              <SectionItem>
              {spams ? (
                <NotificationListContainer>
                  {spams.map((oneNotification, i) => {
                  const { 
                    cta,
                    title,
                    message,
                    app,
                    icon,
                    image,
                    url,
                    blockchain,
                    secret,
                    notification
                  } = oneNotification;

                  return (
                    <NotificationItem
                      key={`spam-${i}`}
                      notificationTitle={secret ? notification['title'] : title}
                      notificationBody={secret ? notification['body'] : message}
                      cta={cta}
                      app={app}
                      icon={icon}
                      image={image}
                      url={url}
                      // optional parameters for rendering spambox
                      isSpam
                      subscribeFn={async () => console.log("yayy spam")}
                      isSubscribedFn={async () => false}
                      theme={theme}
                      chainName={blockchain as chainNameType}
                    />
                  );
                })}
                </NotificationListContainer>
              ) : null}
              </SectionItem>
            </>

          )}
        </Section>

      </div>
  );
}

export default NotificationsTest;