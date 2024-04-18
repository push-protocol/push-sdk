// React + Web3 Essentials
import { ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';

// External Packages
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import styled from 'styled-components';

// Internal Compoonents
import {
  deriveChatId,
  getAddress,
  pCAIP10ToWallet,
  resolveWeb3Name,
  shortenText,
  walletToPCAIP10,
} from '../../../helpers';
import { useChatData, useClickAway } from '../../../hooks';
import useFetchChat from '../../../hooks/chat/useFetchChat';
import useGetGroupByIDnew from '../../../hooks/chat/useGetGroupByIDnew';
import usePushUser from '../../../hooks/usePushUser';
import { MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE } from '../../../types';
import { Div, Image, Section, Span, Tooltip } from '../../reusables';
import { ProfileContainer } from '../reusables';
import { GroupInfoModal } from './ChatProfileInfoModal';

// Internal Configs
import { CONSTANTS, IUser } from '@pushprotocol/restapi';
import {
  CoreContractChainId,
  InfuraAPIKey,
  allowedNetworks,
  device,
} from '../../../config';
import { ThemeContext } from '../theme/ThemeProvider';

// Assets
import { ICON_COLOR, PublicChatIcon, TokenGatedIcon } from '../../../icons/PushIcons';
import VerticalEllipsisIcon from '../../../icons/VerticalEllipsis.svg';
import InfoIcon from '../../../icons/infodark.svg';

// Interfaces & Types
import { Group, IChatProfile } from '../exportedTypes';
import { ChatInfoResponse } from '../types';

interface IProfile {
  name: string | null;
  icon: string | null;
  chatId: string | null;
  recipient: string | null;
  abbrRecipient: string | null;
  web3Name: string | null;
  desc: string | null;
}

// Constants

// Exported Interfaces & Types

// Exported Functions
export const ChatProfile: React.FC<IChatProfile> = ({
  chatId,
  groupInfoModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
  groupInfoModalPositionType = MODAL_POSITION_TYPE.GLOBAL,
  chatProfileRightHelperComponent = null,
  chatProfileLeftHelperComponent = null,
}) => {
  const theme = useContext(ThemeContext);
  const { account, user } = useChatData();
  const { getGroupByIDnew } = useGetGroupByIDnew();
  const { fetchUserProfile } = usePushUser();

  // const [isGroup, setIsGroup] = useState<boolean>(false);
  const [showoptions, setShowOptions] = useState(false);
  const [formattedChatId, setFormattedChatId] = useState<string>('');
  const [chatInfo, setChatInfo] = useState<ChatInfoResponse | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>();
  const [groupInfo, setGroupInfo] = useState<Group | null>();
  const [web3Name, setWeb3Name] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState({
    loading: false,
    profile: {
      name: null,
      icon: null,
      chatId: null,
      recipient: null,
      abbrRecipient: null,
      web3Name: null,
      desc: null,
    } as IProfile,
    groupInfo: null as Group | null,
  });

  const provider = new ethers.providers.InfuraProvider(
    CoreContractChainId[user ? user.env : CONSTANTS.ENV.PROD],
    InfuraAPIKey
  );
  const DropdownRef = useRef(null);
  const [modal, setModal] = useState(false);
  const { fetchChat } = useFetchChat();

  useClickAway(DropdownRef, () => {
    setShowOptions(false);
  });

  const ShowModal = () => {
    setModal(true);
  };

  // To setup web3 name, asynchrounously
  const setupWeb3Name = async (address: string) => {
    const result = await resolveWeb3Name(address, user);
    setInitialized((prevState) => ({
      ...prevState,
      profile: { ...prevState.profile, web3Name: result },
    }));
  };

  // To get the abbreviated recipient
  const getAbbreiatedRecipient = (recipient: string) => {
    // split recipient into two parts, 6 characters each and join them with '...' but only if recipient is more than 15 characters
    if (recipient.length <= 15) return recipient;

    const firstPart = recipient.slice(0, 6);
    const secondPart = recipient.slice(-6);
    return `${firstPart}...${secondPart}`;
  };

  // Initiate profile fetch if chatId, account or user changes
  useEffect(() => {
    (async () => {
      if (!user || !chatId || chatId === '' || initialized.loading) return;

      setInitialized((currentState) => ({ ...currentState, loading: true }));

      try {
        // derive chatId
        const derivedChatId = await deriveChatId(chatId, user.env);

        // We have derived chatId, fetch chat info to see if it's group or dm
        console.log('FETCHING CHAT INFO', derivedChatId, user);
        const chatInfo = await user.chat.info(derivedChatId);
        console.log('FETCHING CHAT INFO FETCHED', chatInfo);

        if (chatInfo) {
          let groupInfo;

          // eslint-disable-next-line prefer-const
          let profile = {} as IProfile;

          // If group
          if (chatInfo.meta.group) {
            groupInfo = await user.chat.group.info(derivedChatId);
            profile.name = groupInfo.groupName;
            profile.icon = groupInfo.groupImage;
            profile.chatId = chatInfo.chatId;
            profile.recipient = derivedChatId;
            profile.abbrRecipient = getAbbreiatedRecipient(derivedChatId);
            profile.desc = groupInfo.groupDescription;

            // TODO - HANDLE ERROR IN UI
          } else {
            // This is DM
            const recipient = await deriveChatId(
              chatInfo.participants[0],
              user.env
            );

            const profileInfo = await user.profile.info({
              overrideAccount: recipient,
            });
            profile.name = profileInfo.name;
            profile.icon = profileInfo.picture;
            profile.chatId = chatInfo.chatId;
            profile.recipient = recipient;
            profile.abbrRecipient = getAbbreiatedRecipient(recipient);
            profile.desc = profileInfo.profile?.desc;

            // get and set web3 name asynchrounously
            setupWeb3Name(profile.recipient);
          }

          // Finally set everything
          setInitialized({
            loading: false,
            profile: profile,
            groupInfo: groupInfo,
          });
        } else {
          // Handle Error
          console.error('UIWeb::ChatProfile::ChatInfo is null');
        }
      } catch (error) {
        console.error('UIWeb::ChatProfile::Error', error);

        // TODO - Handle the error appropriately
      }
    })();
  }, [chatId, user]);

  // useEffect(() => {
  //   (async () => {
  //     await fetchProfileData();
  //   })();
  // }, [chatInfo]);

  if (chatId) {
    return (
      <Container theme={theme}>
        {/* For showing Chat Profile */}
        <Section gap="10px">
          {chatProfileLeftHelperComponent && (
            <Section
              cursor="pointer"
              maxHeight="1.75rem"
              overflow="hidden"
              justifyContent="center"
              alignSelf="center"
            >
              {chatProfileLeftHelperComponent}
            </Section>
          )}
          <ProfileContainer
            theme={theme}
            member={{
              icon: initialized.profile.icon,
              name: initialized.profile.name,
              chatId: initialized.profile.chatId,
              recipient: initialized.profile.recipient,
              abbrRecipient: initialized.profile.abbrRecipient,
              web3Name: initialized.profile.web3Name,
              desc: initialized.profile.desc,
            }}
            copy={!!initialized.profile.recipient}
            customStyle={{
              fontSize: theme?.fontWeight?.chatProfileText,
              textColor: theme?.textColor?.chatProfileText,
            }}
            loading={
              initialized.loading ||
              initialized.profile.recipient === '' ||
              initialized.profile.icon === ''
            }
          />
        </Section>

        {/* For showing group related icons and menu */}
        <Section
          zIndex="unset"
          flexDirection="row"
          gap="10px"
          margin="0 20px 0 auto"
          alignSelf="center"
        >
          {/* For showing chat profile right helper component */}
          {chatProfileRightHelperComponent && !initialized.groupInfo && (
            <Section cursor="pointer" maxHeight="1.75rem" overflow="hidden">
              {chatProfileRightHelperComponent}
            </Section>
          )}

          {/* For showing Token Gated Group Icon */}
          {!!Object.keys(initialized.groupInfo?.rules || {}).length && (
            <Tooltip content={"Token Gated Group"}>
              <TokenGatedIcon size={20} color={ICON_COLOR.BLUISH_GRAY} />
            </Tooltip>
          )}

          {!!initialized.groupInfo?.isPublic && (
            <Tooltip content={"Token Gated Group"}>
              <PublicChatIcon size={{ height: 20 }} color={ICON_COLOR.BLUISH_GRAY} />
            </Tooltip>
          )}

          {!initialized.loading && (
            <ImageItem onClick={() => setShowOptions(true)}>
              <Image
                src={VerticalEllipsisIcon}
                height="21px"
                maxHeight="32px"
                width={'auto'}
                cursor="pointer"
              />

              {showoptions && (
                <DropDownBar theme={theme} ref={DropdownRef}>
                  <DropDownItem cursor="pointer" onClick={() => setModal(true)}>
                    <Image
                      src={InfoIcon}
                      height="21px"
                      maxHeight="21px"
                      width={'auto'}
                      cursor="pointer"
                    />

                    <TextItem cursor="pointer">
                      {initialized.groupInfo ? 'Group Info' : 'User Info'}
                    </TextItem>
                  </DropDownItem>
                </DropDownBar>
              )}
            </ImageItem>
          )}
        </Section>
        
        {/* For showing chat info modal */}
        {modal && (
          <GroupInfoModal
            theme={theme}
            setModal={setModal}
            groupInfo={initialized.groupInfo!}
            setGroupInfo={(mutatedGroupInfo) =>
              setInitialized((prevState) => ({
                ...prevState,
                mutatedGroupInfo,
              }))
            }
            groupInfoModalBackground={groupInfoModalBackground}
            groupInfoModalPositionType={groupInfoModalPositionType}
          />
        )}

        <ToastContainer />
      </Container>
    );
  } else {
    return null;
  }
};

const Container = styled.div`
  width: 100%;
  background: ${(props) => props.theme.backgroundColor.chatProfileBackground};
  border: ${(props) => props.theme.border?.chatProfile};
  border-radius: ${(props) => props.theme.borderRadius?.chatProfile};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  box-sizing: border-box;
`;

const ImageItem = styled.div`
  position: relative;
`;

const DropDownBar = styled.div`
  position: absolute;
  top: 30px;
  left: -130px;
  cursor: pointer;
  display: block;
  min-width: 140px;
  color: rgb(101, 119, 149);
  background: ${(props) => props.theme.backgroundColor.modalBackground};
  border: ${(props) => props.theme.border.modalInnerComponents};
  z-index: 10;
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
`;

const VideoChatSection = styled.div`
  margin: 0 25px 0 auto;
`;

const DropDownItem = styled(Span)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 16px;
  z-index: 3000000;
  width: 100%;
`;

const TextItem = styled(Span)`
  white-space: nowrap;
  overflow: hidden;
`;

//auto update members when an user accepts not done
