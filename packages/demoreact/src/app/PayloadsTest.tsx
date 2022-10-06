import { useState, useContext } from 'react';
import styled from 'styled-components';
// import * as ethers from 'ethers';
import { Section, SectionButton, CodeFormatter } from './components/StyledComponents';
import Loader from './components/Loader';
import Dropdown from './components/Dropdown';
import { APIFeedback } from './components/Feedback';
import { DarkIcon, LightIcon } from './components/Icons';
import { Web3Context, EnvContext } from './context';
import * as PushAPI from '@pushprotocol/restapi';
import { getCAIPAddress } from './helpers';

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

const NOTIFICATION_TYPE = {
  BROADCAST: 1,
  TARGETTED: 3,
  SUBSET: 4
};

const IDENTITY_TYPE = {
  MINIMAL: 0,
  IPFS: 1,
  DIRECT_PAYLOAD: 2,
  SUBGRAPH: 3
};

type optionsMatrixType = {
  [key: string]: {
    [key: string]: any
  }
};

const getOptionsMatrix = (
  { signer, env = 'prod', isCAIP, channel, timestamp } :
  { signer: any, env?: string, isCAIP?: boolean, channel: string, timestamp: string }
) : optionsMatrixType => {
  if (!signer) throw Error(`No Signer provided`);

  const channelAddr = isCAIP ? getCAIPAddress(env, channel) : channel;


  // EDIT here to change recipients, title, body etc

  return {
    [NOTIFICATION_TYPE.TARGETTED]: {
      [IDENTITY_TYPE.DIRECT_PAYLOAD]:  {
          signer,
          env,
          type: NOTIFICATION_TYPE.TARGETTED,
          identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.TARGETTED} identity:${IDENTITY_TYPE.DIRECT_PAYLOAD}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? getCAIPAddress(env, '0xD8634C39BBFd4033c0d3289C4515275102423681') : '0xD8634C39BBFd4033c0d3289C4515275102423681',
          channel: channelAddr,
      },
      [IDENTITY_TYPE.IPFS]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.TARGETTED,
          identityType: IDENTITY_TYPE.IPFS,
          ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // from BE devtools
          recipients: isCAIP ? getCAIPAddress(env, '0xD8634C39BBFd4033c0d3289C4515275102423681') : '0xD8634C39BBFd4033c0d3289C4515275102423681',
          channel: channelAddr,
      },
      [IDENTITY_TYPE.MINIMAL]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.TARGETTED,
          identityType: IDENTITY_TYPE.MINIMAL,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.TARGETTED} identity:${IDENTITY_TYPE.MINIMAL}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? getCAIPAddress(env, '0xD8634C39BBFd4033c0d3289C4515275102423681') : '0xD8634C39BBFd4033c0d3289C4515275102423681',
          channel: channelAddr,
      },
      [IDENTITY_TYPE.SUBGRAPH]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.TARGETTED,
          identityType: IDENTITY_TYPE.SUBGRAPH,
          graph: {
            id: 'aiswaryawalter/graph-poc-sample',
            counter: 3
          },
          recipients: isCAIP ? getCAIPAddress(env, '0xD8634C39BBFd4033c0d3289C4515275102423681') : '0xD8634C39BBFd4033c0d3289C4515275102423681',
          channel: channelAddr,
      }
    },
    [NOTIFICATION_TYPE.SUBSET]: {
      [IDENTITY_TYPE.DIRECT_PAYLOAD]:  {
          signer,
          env,
          type: NOTIFICATION_TYPE.SUBSET,
          identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.SUBSET} identity:${IDENTITY_TYPE.DIRECT_PAYLOAD}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? 
            ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0xD8634C39BBFd4033c0d3289C4515275102423681'].map(addr => getCAIPAddress(env, addr))
            : ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0xD8634C39BBFd4033c0d3289C4515275102423681'],
          channel: channelAddr,
      },
      [IDENTITY_TYPE.IPFS]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.SUBSET,
          identityType: IDENTITY_TYPE.IPFS,
          ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // from BE devtools
          recipients: isCAIP ? 
            ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0xD8634C39BBFd4033c0d3289C4515275102423681'].map(addr => getCAIPAddress(env, addr))
            : ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0xD8634C39BBFd4033c0d3289C4515275102423681'],
          channel: channelAddr,
      },
      [IDENTITY_TYPE.MINIMAL]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.SUBSET,
          identityType: IDENTITY_TYPE.MINIMAL,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.SUBSET} identity:${IDENTITY_TYPE.MINIMAL}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? 
            ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0xD8634C39BBFd4033c0d3289C4515275102423681'].map(addr => getCAIPAddress(env, addr))
            : ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0xD8634C39BBFd4033c0d3289C4515275102423681'],
          channel: channelAddr,
      },
      [IDENTITY_TYPE.SUBGRAPH]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.SUBSET,
          identityType: IDENTITY_TYPE.SUBGRAPH,
          graph: {
            id: 'aiswaryawalter/graph-poc-sample',
            counter: 3
          },
          recipients: isCAIP ? 
            ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0xD8634C39BBFd4033c0d3289C4515275102423681'].map(addr => getCAIPAddress(env, addr))
            : ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0xD8634C39BBFd4033c0d3289C4515275102423681'],
          channel: channelAddr,
      }
    },
    [NOTIFICATION_TYPE.BROADCAST]: {
      [IDENTITY_TYPE.DIRECT_PAYLOAD]:  {
          signer,
          env,
          type: NOTIFICATION_TYPE.BROADCAST,
          identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.BROADCAST} identity:${IDENTITY_TYPE.DIRECT_PAYLOAD}`,
              cta: '',
              img: ''
          },
          channel: channelAddr,
      },
      [IDENTITY_TYPE.IPFS]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.BROADCAST,
          identityType: IDENTITY_TYPE.IPFS,
          ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // from BE devtools
          channel: channelAddr,
      },
      [IDENTITY_TYPE.MINIMAL]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.BROADCAST,
          identityType: IDENTITY_TYPE.MINIMAL,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.BROADCAST} identity:${IDENTITY_TYPE.MINIMAL}`,
              cta: '',
              img: ''
          },
          channel: channelAddr,
      },
      [IDENTITY_TYPE.SUBGRAPH]: {
          signer,
          env,
          type: NOTIFICATION_TYPE.BROADCAST,
          identityType: IDENTITY_TYPE.SUBGRAPH,
          graph: {
            id: 'aiswaryawalter/graph-poc-sample',
            counter: 3
          },
          channel: channelAddr,
      }
    },
  };

}

const NOTIFICATION_TYPE_OPTIONS = [
  { label: 'TARGETTED', value: '3' },
  { label: 'SUBSET', value: '4' },
  { label: 'BROADCAST', value: '1' }
];

const IDENTITY_TYPE_OPTIONS = [
  { label: 'MINIMAL', value: '0' },
  { label: 'IPFS', value: '1' },
  { label: 'DIRECT_PAYLOAD', value: '2' },
  { label: 'SUBGRAPH', value: '3' }
]


const PayloadsTest = () => {
  const { library, account, chainId } = useContext<any>(Web3Context);
  const { env, isCAIP }  = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');
 
  const [apiStatus, setApiStatus] = useState<any>();


  const [notificationTypeOption, setNotificationTypeOption] = useState('3');
  const [identityTypeOption, setIdentityTypeOption] = useState('2');

  // const PK = 'd5797b255933f72a6a084fcfc0f5f4881defee8c1ae387197805647d0b10a8a0'; // PKey, server code
  // const Pkey = `0x${PK}`;
  // const testChannelAddress = '0xD8634C39BBFd4033c0d3289C4515275102423681'; // server code
  const testChannelAddress = account; // UI 
  

  // for server code
  // const signer = new ethers.Wallet(Pkey);

  // for UI code
  const signer = library.getSigner(account);

  const OPTIONS_MATRIX: optionsMatrixType = getOptionsMatrix({
    signer,
    channel: testChannelAddress,
    env,
    isCAIP,
    timestamp: JSON.stringify(Date.now())
  });

  const onChangeNotificationType = (e: any) => {
    setApiStatus('');
    setNotificationTypeOption(e.target.value);
  };

  const onChangeIdentityType = (e: any) => {
    setApiStatus('');
    setIdentityTypeOption(e.target.value);
  };


  const toggleTheme = () => {
    setTheme(lastTheme => {
      return lastTheme === 'dark' ? 'light' : 'dark'
    })
  };

  const triggerNotification = async () => {
    setApiStatus('');
    setLoading(true);
    try {
      const sdkInput = OPTIONS_MATRIX[notificationTypeOption][identityTypeOption];

      console.log('sdkInput: ', sdkInput);

      const apiResponse = await PushAPI.payloads.sendNotification(sdkInput);
      console.log('apiResponse: ', apiResponse);
      setApiStatus({
        status: apiResponse?.status,
        data: apiResponse?.config?.data
      });
    } catch (e) {
      console.error('sendNotification error: \n', e);
      setApiStatus(JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  };


  const renderInputOption = () => {
    const optionsObject = OPTIONS_MATRIX[notificationTypeOption.toString()][identityTypeOption.toString()];

    if (optionsObject) {
      const { signer, ...renderInputOption} = optionsObject;

      return (
        <CodeFormatter>  
          {JSON.stringify({ ...renderInputOption, signer: {} }, null, 4)}
        </CodeFormatter>
      );
    }

    return null;
  }

  return (
      <div>
        <Header>
          <h2>Payloads Test page</h2>
          <ThemeSelector>
            {theme === 'dark' ? <DarkIcon title="Dark" onClick={toggleTheme}/> : <LightIcon title="Light" onClick={toggleTheme}/>}
          </ThemeSelector>
        </Header>

        <p>IMPORTANT: Will only work if the channel address you are providing exists in the ENV you are running the app!!</p>
                

        <Loader show={isLoading} />

       
        <Section theme={theme}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: 16 }}>
            <p style={{ color: '#b57f38' }}>Please choose both the options below and hit "send notification" button</p>

            <div style={{ display: 'flex', gap: 20 }}>
              <Dropdown
                style={{ color: 'green' }}
                width={200}
                label="NOTIFICATION TYPE"
                options={NOTIFICATION_TYPE_OPTIONS}
                value={notificationTypeOption}
                onChange={onChangeNotificationType}
              />

              <Dropdown
                style={{ color: 'green' }}
                width={200}
                label="IDENTITY TYPE"
                options={IDENTITY_TYPE_OPTIONS}
                value={identityTypeOption}
                onChange={onChangeIdentityType}
              />
            </div>


            <div>
              {renderInputOption()}
            </div>

            <SectionButton style={{ width: 400 }} onClick={() => triggerNotification()}>send notification</SectionButton>
            {apiStatus ? <APIFeedback status={apiStatus?.status === 204 ? 'success' : 'error'}>{JSON.stringify(apiStatus)}</APIFeedback> : null}
          </div>
        </Section>

      </div>
  );
}

export default PayloadsTest;