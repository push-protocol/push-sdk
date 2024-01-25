import { useWeb3React } from '@web3-react/core';
import { Buffer } from 'buffer';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as PushLogo } from '../assets/pushLogo.svg';
import AliasTest from './AliasTest';
import ChannelsTest from './ChannelsTest';
import AddAdminsToGroupTest from './ChatTest/AddAdminsToGroupTest';
import AddMembersToGroupTest from './ChatTest/AddMembersToGroupTest';
import ApproveRequestTest from './ChatTest/ApproveRequestTest';
import AuthUpdateUserTest from './ChatTest/AuthUpdateUser';
import ChatTest from './ChatTest/ChatTest';
import ConversationHashTest from './ChatTest/ConversationHash';
import CreateGroupTest from './ChatTest/CreateGroupTest';
import CreateUserTest from './ChatTest/CreateUser';
import GetChatsTest from './ChatTest/GetChats';
import GetGroupAccessTest from './ChatTest/GetGroupAccessTest';
import GetGroupTest from './ChatTest/GetGroupTest';
import GetRequestsTest from './ChatTest/GetRequests';
import GetUserTest from './ChatTest/GetUser';
import GetUsersBatchTest from './ChatTest/GetUsersBatchTest';
import HistoryTest from './ChatTest/History';
import RemoveAdminsFromGroupTest from './ChatTest/RemoveAdminsFromGroupTest';
import RemoveMembersFromGroupTest from './ChatTest/RemoveMembersFromGroupTest';
import SendMessageTest from './ChatTest/SendMessageTest';
import UpdateGroupTest from './ChatTest/UpdateGroupTest';
import UpdateUserProfile from './ChatTest/UpdateUserProfile';
import DelegationTest from './DelegationTest';
import EmbedTest from './EmbedTest';
import NotificationsTest from './NotificationsTest';
import PayloadsTest from './PayloadsTest';
import SecretNotificationsTest from './SecretNotificationsTest';
import SocketTest from './SocketTest';
import AddListenersToSpaceTest from './SpaceTest/AddListenersToSpaceTest';
import AddSpeakersToSpaceTest from './SpaceTest/AddSpeakersToSpaceTest';
import ApproveSpaceRequestTest from './SpaceTest/ApproveSpaceRequestTest';
import CreateSpaceTest from './SpaceTest/CreateSpaceTest';
import GetSpaceAccessTest from './SpaceTest/GetSpaceAccessTest';
import GetSpaceInfoTest from './SpaceTest/GetSpaceInfoTest';
import GetSpaceTest from './SpaceTest/GetSpaceTest';
import GetSpacesRequestsTest from './SpaceTest/GetSpacesRequestsTest';
import GetSpacesTest from './SpaceTest/GetSpacesTest';
import GetSpacesTrendingTest from './SpaceTest/GetSpacesTrendingTest';
import RemoveListenersFromSpaceTest from './SpaceTest/RemoveListenersFromSpaceTest';
import RemoveSpeakersFromSpaceTest from './SpaceTest/RemoveSpeakersFromSpaceTest';
import SpaceTest from './SpaceTest/SpaceTest';
import StartSpaceTest from './SpaceTest/StartSpaceTest';
import StopSpaceTest from './SpaceTest/StopSpaceTest';
import UpdateSpaceTest from './SpaceTest/UpdateSpaceTest';
import { Checkbox } from './components/Checkbox';
import ConnectButtonComp from './components/Connect';
import Dropdown from './components/Dropdown';
import {
  AccountContext,
  EnvContext,
  SocketContext,
  Web3Context,
} from './context';
import { ENV } from './helpers';
import { useSDKSocket } from './hooks';

import * as PushApi from '@pushprotocol/restapi';
import { PushAPI } from "@pushprotocol/restapi";
import {
  CHAT_THEME_OPTIONS,
  ChatUIProvider,
  SpacesUI,
  SpacesUIProvider,
  darkChatTheme,
  lightChatTheme,
} from '@pushprotocol/uiweb';
import { ChatSupportTest } from './ChatSupportTest';
import GetGroupMemberStatusTest from './ChatTest/GetGroupMemberStatusTest';
import RejectRequestTest from './ChatTest/RejectRequestTest';
import SearchGroupTest from './ChatTest/SearchGroupTest';
import ChatPreviewTest from './ChatUITest/ChatPreview';
import ChatPreviewListTest from './ChatUITest/ChatPreviewList';
import { ChatProfileTest } from './ChatUITest/ChatProfile';
import ChatUITest from './ChatUITest/ChatUITest';
import { ChatViewBubbles } from './ChatUITest/ChatViewBubble';
import ChatViewComponentTest from './ChatUITest/ChatViewComponent';
import ChatViewListTest from './ChatUITest/ChatViewListTest';
import { ChatWidgetTest } from './ChatWidgetTest';
import SearchSpaceTest from './SpaceTest/SearchSpaceTest';
import {
  CreateSpaceComponent,
  SpaceBanner,
  SpaceFeed,
  SpaceInvitesComponent,
  SpaceWidget,
} from './SpaceUITest';
import SpaceUITest from './SpaceUITest/SpaceUITest';
import { useSpaceComponents } from './SpaceUITest/useSpaceComponents';
import GetGroupMemberCountTest from './ChatTest/GetGroupMemberCountTest';
import GetGroupInfoTest from './ChatTest/GetGroupInfoTest';
import GetGroupMembersTest from './ChatTest/GetGroupMembersTest';


window.Buffer = window.Buffer || Buffer;

interface Web3ReactState {
  chainId?: number;
  account?: string | null | undefined;
  active: boolean;
  error?: Error;
  library?: unknown;
}

const StyledApp = styled.div`
  font-family: 'Source Sans Pro', Arial, sans-serif;

  & .homeLink {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  & h1 {
    text-align: center;
    text-transform: uppercase;
    margin: 20px 0px;
    padding: 0px;
    letter-spacing: 0.1em;
    font-family: 'Source Sans Pro', Helvetica, sans-serif;
    font-weight: 200;
    font-size: 2rem;
    line-height: 1.25em;
  }

  .nav-button {
    align-items: center;
    background-image: linear-gradient(132deg, #574762, #4a36c4 50%, #ee5555);
    border: 0;
    border-radius: 8px;
    box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
    box-sizing: border-box;
    color: #ffffff;
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
  flex-flow: wrap;
  gap: 30px;
  justify-content: center;

  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const customtheme = {
  titleBg: 'linear-gradient(45deg, #E165EC 0.01%, #A483ED 100%)', //not changed
  titleTextColor: '#FFFFFF',
  bgColorPrimary: '#fff',
  bgColorSecondary: '#F7F1FB',
  textColorPrimary: '#000',
  textColorSecondary: '#657795',
  textGradient: 'linear-gradient(45deg, #B6A0F5, #F46EF6, #FFDED3, #FFCFC5)', //not changed
  btnColorPrimary: '#D53A94',
  btnOutline: '#D53A94',
  borderColor: '#FFFF',
  borderRadius: '17px',
  containerBorderRadius: '12px',
  statusColorError: '#E93636',
  statusColorSuccess: '#30CC8B',
  iconColorPrimary: '#82828A',
};

const customDarkTheme = {
  titleBg: 'linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%)',
  titleTextColor: '#fff',
  bgColorPrimary: '#000',
  bgColorSecondary: '#292344',
  textColorPrimary: '#fff',
  textColorSecondary: '#71717A',
  textGradient: 'linear-gradient(45deg, #B6A0F5, #F46EF6, #FFDED3, #FFCFC5)',
  btnColorPrimary: '#8B5CF6',
  btnOutline: '#8B5CF6',
  borderColor: '#3F3F46',
  borderRadius: '17px',
  containerBorderRadius: '12px',
  statusColorError: '#E93636',
  statusColorSuccess: '#30CC8B',
  iconColorPrimary: '#71717A',
};

const checkForWeb3Data = ({
  library,
  active,
  account,
  chainId,
}: Web3ReactState) => {
  return library && active && account && chainId;
};

export function App() {
  const { account, library, active, chainId } = useWeb3React();
  const [env, setEnv] = useState<ENV>(ENV.PROD);
  const [isCAIP, setIsCAIP] = useState(false);
  const [signer, setSigner] = useState();
  const [user, setUser] = useState<PushAPI>();

  const { SpaceWidgetComponent } = useSpaceComponents();
  const [spaceId, setSpaceId] = useState<string>('');
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>('');

  const socketData = useSDKSocket({
    account: account,
    chainId: chainId,
    env,
    isCAIP,
  });

  const onChangeEnv = (e: any) => {
    setEnv(e.target.value);
  };

  const onChangeCAIP = () => {
    setIsCAIP(!isCAIP);
  };

  useEffect(() => {
    (async () => {
      if (!account || !env || !library) return;

      const user = await PushApi.user.get({ account: account, env });
      let pgpPrivateKey;
      const librarySigner = await library.getSigner(account);
      setSigner(librarySigner);
      const pushUser = await PushAPI.initialize(librarySigner!, {
        env: env,
        account: account,
        alpha: { feature: ['SCALABILITY_V2'] },
    })
    setUser(pushUser);
      if (user?.encryptedPrivateKey) {
        pgpPrivateKey = await PushApi.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account: account,
          signer: librarySigner,
          env,
        });
      }

      setPgpPrivateKey(pgpPrivateKey);
    })();
  }, [account, env, library]);
  const spaceUI = useMemo(
    () =>
      new SpacesUI({
        account: account as string,
        signer: library?.getSigner(),
        pgpPrivateKey: pgpPrivateKey,
        env: env,
      }),
    [account, library, pgpPrivateKey, env]
  );

  return (
    <StyledApp>
      <Link className="homeLink" to="/">
        <PushLogo style={{ marginRight: 12 }} />
        <h1>SDK Demo React App</h1>
      </Link>

      <ConnectButtonComp />

      <Dropdown
        label="ENV"
        options={[
          { label: 'prod', value: 'prod' },
          { label: 'staging', value: 'staging' },
          { label: 'dev', value: 'dev' },
        ]}
        value={env}
        onChange={onChangeEnv}
      />

      <div style={{ marginTop: 10 }}>
        <Checkbox
          id="isCAIP"
          label="Convert to CAIP"
          value={isCAIP}
          onChange={onChangeCAIP}
        />
      </div>

      <hr />
      <EnvContext.Provider value={{ env, isCAIP }}>
        {checkForWeb3Data({
          active,
          account,
          library,
          chainId,
        }) ? (
          <Web3Context.Provider value={{ account, active, library, chainId }}>
            <SocketContext.Provider value={socketData}>
              <AccountContext.Provider value={{ pgpPrivateKey, setSpaceId }}>
                <ChatUIProvider  env={env} theme={lightChatTheme}  user={user}>
                  <SpacesUIProvider spaceUI={spaceUI} theme={customDarkTheme}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <NavMenu>
                            <Link to="/notifications" className="nav-button">
                              NOTIFICATIONS
                            </Link>
                            <Link to="/secret" className="nav-button">
                              SECRET NOTIFICATION
                            </Link>
                            <Link to="/channels" className="nav-button">
                              CHANNELS
                            </Link>
                            <Link to="/alias" className="nav-button">
                              ALIAS
                            </Link>
                            <Link to="/delegations" className="nav-button">
                              DELEGATIONS
                            </Link>
                            <Link to="/payloads" className="nav-button">
                              PAYLOADS
                            </Link>
                            <Link to="/socket" className="nav-button">
                              SOCKET
                            </Link>
                            <Link to="/embed" className="nav-button">
                              EMBED
                            </Link>
                            <Link to="/chat" className="nav-button">
                              CHAT
                            </Link>
                            <Link to="/chatUI" className="nav-button">
                              CHAT UI
                            </Link>
                            <Link to="/space" className="nav-button">
                              SPACE
                            </Link>
                            <Link to="/spaceUI" className="nav-button">
                              SPACE UI
                            </Link>
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
                      <Route path="/channels" element={<ChannelsTest />} />
                      <Route path="/alias" element={<AliasTest />} />
                      <Route path="/delegations" element={<DelegationTest />} />
                      <Route path="/payloads" element={<PayloadsTest />} />
                      <Route path="/socket" element={<SocketTest />} />
                      <Route path="/embed" element={<EmbedTest />} />
                      <Route path="/chat" element={<ChatTest />} />
                      <Route path="/space" element={<SpaceTest />} />
                      <Route path="/chatUI" element={<ChatUITest />} />
                      <Route path="/spaceUI" element={<SpaceUITest />} />
                      {/* chat method  routes */}
                      <Route path="/get" element={<GetUserTest />} />
                      <Route
                        path="/getUsersBatch"
                        element={<GetUsersBatchTest />}
                      />
                      <Route path="/create" element={<CreateUserTest />} />
                      <Route
                        path="/updateUserprofile"
                        element={<UpdateUserProfile />}
                      />
                      <Route
                        path="/authUpdate"
                        element={<AuthUpdateUserTest />}
                      />
                      <Route path="/send" element={<SendMessageTest />} />
                      <Route path="/approve" element={<ApproveRequestTest />} />
                      <Route path="/chats" element={<GetChatsTest />} />
                      <Route path="/hash" element={<ConversationHashTest />} />
                      <Route path="/history" element={<HistoryTest />} />
                      <Route path="/requests" element={<GetRequestsTest />} />
                      <Route
                        path="/createGroup"
                        element={<CreateGroupTest />}
                      />
                      <Route path="/getGroup" element={<GetGroupTest />} />
                      <Route
                        path="/addMembersToGroup"
                        element={<AddMembersToGroupTest />}
                      />
                      <Route
                        path="/addAdminsToGroup"
                        element={<AddAdminsToGroupTest />}
                      />
                      <Route
                        path="/removeMembersFromGroup"
                        element={<RemoveMembersFromGroupTest />}
                      />
                      <Route
                        path="/removeAdminsFromGroup"
                        element={<RemoveAdminsFromGroupTest />}
                      />
                      <Route
                        path="/updateGroup"
                        element={<UpdateGroupTest />}
                      />
                      {/* chat method  routes */}
                      <Route path="/get" element={<GetUserTest />} />
                      <Route
                        path="/getUsersBatch"
                        element={<GetUsersBatchTest />}
                      />
                      <Route path="/create" element={<CreateUserTest />} />
                      <Route
                        path="/updateUserprofile"
                        element={<UpdateUserProfile />}
                      />
                      <Route
                        path="/authUpdate"
                        element={<AuthUpdateUserTest />}
                      />
                      <Route path="/send" element={<SendMessageTest />} />
                      <Route path="/approve" element={<ApproveRequestTest />} />
                      <Route path="/reject" element={<RejectRequestTest />} />
                      <Route path="/chats" element={<GetChatsTest />} />
                      <Route path="/hash" element={<ConversationHashTest />} />
                      <Route path="/history" element={<HistoryTest />} />
                      <Route path="/requests" element={<GetRequestsTest />} />
                      <Route
                        path="/createGroup"
                        element={<CreateGroupTest />}
                      />
                      <Route path="/getGroup" element={<GetGroupTest />} />
                      <Route
                        path="/getGroupAccess"
                        element={<GetGroupAccessTest />}
                      />
                      <Route
                        path="/getGroupMemberStatus"
                        element={<GetGroupMemberStatusTest />}
                      />
                      <Route
                        path="/getGroupMemberCountTest"
                        element={<GetGroupMemberCountTest />}
                      />
                      <Route
                        path="/getGroupInfoTest"
                        element={<GetGroupInfoTest />}
                      />
                      <Route
                        path="/getGroupMembersTest"
                        element={<GetGroupMembersTest />}
                      />
                      <Route
                        path="/addMembersToGroup"
                        element={<AddMembersToGroupTest />}
                      />
                      <Route
                        path="/addAdminsToGroup"
                        element={<AddAdminsToGroupTest />}
                      />
                      <Route
                        path="/removeMembersFromGroup"
                        element={<RemoveMembersFromGroupTest />}
                      />
                      <Route
                        path="/removeAdminsFromGroup"
                        element={<RemoveAdminsFromGroupTest />}
                      />
                      <Route
                        path="/updateGroup"
                        element={<UpdateGroupTest />}
                      />
                      <Route
                        path="/searchGroups"
                        element={<SearchGroupTest />}
                      />
                      {/* spaces method  routes */}
                      <Route
                        path="/createSpace"
                        element={<CreateSpaceTest />}
                      />
                      <Route
                        path="/updateSpace"
                        element={<UpdateSpaceTest />}
                      />
                      <Route path="/getSpace" element={<GetSpaceTest />} />
                      <Route
                        path="/getSpaceInfo"
                        element={<GetSpaceInfoTest />}
                      />
                      <Route
                        path="/approveSpace"
                        element={<ApproveSpaceRequestTest />}
                      />
                      <Route path="/startSpace" element={<StartSpaceTest />} />
                      <Route path="/stopSpace" element={<StopSpaceTest />} />
                      <Route
                        path="/addSpeakersToSpace"
                        element={<AddSpeakersToSpaceTest />}
                      />
                      <Route
                        path="/addListenersToSpace"
                        element={<AddListenersToSpaceTest />}
                      />
                      <Route
                        path="/removeListenersFromSpace"
                        element={<RemoveListenersFromSpaceTest />}
                      />
                      <Route
                        path="/removeSpeakersFromSpace"
                        element={<RemoveSpeakersFromSpaceTest />}
                      />
                      <Route path="/getSpaces" element={<GetSpacesTest />} />
                      <Route
                        path="/getSpacesRequests"
                        element={<GetSpacesRequestsTest />}
                      />
                      <Route
                        path="/getSpacesTrending"
                        element={<GetSpacesTrendingTest />}
                      />
                      <Route
                        path="/getSpaceAccess"
                        element={<GetSpaceAccessTest />}
                      />
                      <Route
                        path="/searchSpaces"
                        element={<SearchSpaceTest />}
                      />
                      {/* spaces ui components routes */}
                      <Route path="spaceWidget" element={<SpaceWidget />} />
                      <Route path="spaceFeed" element={<SpaceFeed />} />
                      <Route path="spaceBanner" element={<SpaceBanner />} />
                      <Route
                        path="spaceInvites"
                        element={<SpaceInvitesComponent />}
                      />
                      <Route
                        path="createSpaceUI"
                        element={<CreateSpaceComponent />}
                      />
                      {/* chat ui components routes */}
                      <Route
                        path="ChatViewBubble"
                        element={<ChatViewBubbles />}
                      />
                      <Route
                        path="ChatViewList"
                        element={<ChatViewListTest />}
                      />
                      <Route
                        path="ChatView"
                        element={<ChatViewComponentTest />}
                      />
                      <Route
                        path="ChatProfile"
                        element={<ChatProfileTest />}
                      />
                      <Route
                        path="ChatPreview"
                        element={<ChatPreviewTest />}
                      /> 
                      <Route
                        path="ChatPreviewList"
                        element={<ChatPreviewListTest />}
                      /> 
                      <Route
                        path="ChatSupport"
                        element={<ChatSupportTest />}
                      />
                  </Routes>
                  {/* <ChatWidgetTest/> */}
                  {/* <ChatWidgetTest /> */}
                  <SpaceWidgetComponent spaceId={spaceId} />
                </SpacesUIProvider>
                </ChatUIProvider>
              </AccountContext.Provider>
            </SocketContext.Provider>
          </Web3Context.Provider>
        ) : (
          <ChatUIProvider
            account={account!}
            pgpPrivateKey={pgpPrivateKey}
            env={ENV.STAGING}
            theme={darkChatTheme}
          >
            <Routes>
              <Route path="/chatUI" element={<ChatUITest />} />
              <Route path="messageList" element={<ChatViewListTest />} />
            </Routes>
          </ChatUIProvider>
        )}
      </EnvContext.Provider>
    </StyledApp>
  );
}

export default App;
