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

const ChannelsTest = () => {
  const { library, account, chainId } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [channelAddr, setChannelAddr] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [isLoading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState();
  const [channelListData, setChannelListData] = useState();
  const [subscriberData, setSubscriberData] = useState<any>();
  const [channelDelegatesData, setChannelDelegatesData] = useState();
  const [subscriberStatus, setSubscriberStatus] = useState<boolean>();

  const updateChannelAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    setChannelAddr((e.target as HTMLInputElement).value);
  };

  const updateChannelName = (e: React.SyntheticEvent<HTMLElement>) => {
    setChannelName((e.target as HTMLInputElement).value);
  };

  const testGetChannelByAddress = async () => {
    try {
      setLoading(true);

      // object for channel data
      const response = await PushAPI.channels.getChannel({
        channel: isCAIP ? getCAIPAddress(env, channelAddr) : channelAddr,
        env,
      });

      setChannelData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testGetChannelByName = async () => {
    try {
      setLoading(true);

      // Array for channels data
      const response = await PushAPI.channels.search({
        query: channelName,
        env,
      });
      setChannelListData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testGetSubscribers = async () => {
    try {
      setLoading(true);
      const response = await PushAPI.channels.getSubscribers({
        channel: isCAIP ? getCAIPAddress(env, channelAddr) : channelAddr,
        env: env,
      });

      setSubscriberData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testGetChannelDelegates = async () => {
    try {
      setLoading(true);
      const response = await PushAPI.channels.getDelegates({
        channel: isCAIP ? getCAIPAddress(env, channelAddr) : channelAddr,
        env: env,
      });

      setChannelDelegatesData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testSubscriberStatus = async () => {
    try {
      setLoading(true);
      let subscriptions = await PushAPI.user.getSubscriptions({
        user: isCAIP ? getCAIPAddress(env, account) : account,
        env,
      });

      subscriptions = subscriptions.map((sub: any) =>
        sub.channel.toLowerCase()
      );

      const status = subscriptions.includes(channelAddr.toLowerCase());

      setSubscriberStatus(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testOptFunctionality = async () => {
    const _signer = library.getSigner(account);

    try {
      setLoading(true);

      if (subscriberStatus) {
        await PushAPI.channels.unsubscribe({
          signer: _signer,
          channelAddress: isCAIP
            ? getCAIPAddress(env, channelAddr)
            : channelAddr,
          userAddress: isCAIP ? getCAIPAddress(env, account) : account,
          env,
          onSuccess: () => {
            console.log('opt out success');
            setSubscriberStatus(false);
          },
          onError: (e) => {
            console.error('opt out error', e);
          },
        });
      } else {
        await PushAPI.channels.subscribe({
          signer: _signer,
          channelAddress: isCAIP
            ? getCAIPAddress(env, channelAddr)
            : channelAddr,
          userAddress: isCAIP ? getCAIPAddress(env, account) : account,
          env,
          onSuccess: () => {
            console.log('opt in success');
            setSubscriberStatus(true);
          },
          onError: (e) => {
            console.error('opt in error', e);
          },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelData && channelData['channel']) {
      setChannelAddr(channelData['channel']);
    }
  }, [channelData]);

  useEffect(() => {
    // update the other data sections as well on opt in/out completion
    if (typeof subscriberStatus === 'boolean') {
      testGetChannelByAddress();
      testGetSubscribers();
    }
  }, [subscriberStatus]);

  // console.log('LOG: --> ', { env, isCAIP });

  return (
    <div>
      <h2>Channels Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <label>Channel Address</label>
          <input
            type="text"
            onChange={updateChannelAddress}
            value={channelAddr}
            style={{ width: 400, height: 30 }}
          />
          <SectionButton onClick={testGetChannelByAddress}>
            get channel data
          </SectionButton>
        </SectionItem>

        <SectionItem>
          <div>
            {channelData ? (
              <CodeFormatter>
                {JSON.stringify(channelData, null, 4)}
              </CodeFormatter>
            ) : null}

            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testGetSubscribers}>
                get subscribers
              </SectionButton>
            </SectionItem>

            {subscriberData ? (
              <CodeFormatter>
                {JSON.stringify(subscriberData, null, 4)}
              </CodeFormatter>
            ) : null}

            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testGetChannelDelegates}>
                get channel delegates data
              </SectionButton>
            </SectionItem>

            {channelDelegatesData ? (
              <CodeFormatter>
                {JSON.stringify(channelDelegatesData, null, 4)}
              </CodeFormatter>
            ) : null}

            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testSubscriberStatus}>
                check if logged-in user is subscribed
              </SectionButton>
            </SectionItem>
            {typeof subscriberStatus === 'boolean' ? (
              <>
                <CodeFormatter>
                  {JSON.stringify(subscriberStatus, null, 4)}
                </CodeFormatter>

                <SectionButton onClick={testOptFunctionality}>
                  {subscriberStatus ? 'OPT OUT' : 'OPT IN'}
                </SectionButton>
              </>
            ) : null}
          </div>
        </SectionItem>

        <div style={{ marginTop: 50, paddingTop: 30, borderTop: '1px solid' }}>
          <SectionItem>
            <label>Channel Name</label>
            <input
              type="text"
              onChange={updateChannelName}
              value={channelName}
              style={{ width: 400, height: 30 }}
            />
            <SectionButton onClick={testGetChannelByName}>
              get channel data
            </SectionButton>
          </SectionItem>

          {channelListData ? (
            <CodeFormatter>
              {JSON.stringify(channelListData, null, 4)}
            </CodeFormatter>
          ) : null}
        </div>
      </Section>
    </div>
  );
};

export default ChannelsTest;
