// React + Web3 Essentials
import { ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// External Packages
import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import 'react-toastify/dist/ReactToastify.min.css';
import styled from 'styled-components';

// Internal Compoonents
import {
  deriveChatId,
  getAddress,
  getDomainIfExists,
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
import { device } from '../../../config';
import { ThemeContext } from '../theme/ThemeProvider';

// Assets
import { PublicChatIcon, TokenGatedIcon } from '../../../icons/PushIcons';
import VerticalEllipsisIcon from '../../../icons/VerticalEllipsis.svg';
import InfoIcon from '../../../icons/infodark.svg';

// Interfaces & Types
import useUserInfoUtilities from '../../../hooks/chat/useUserInfoUtilities';
import { Group, IChatProfile } from '../exportedTypes';

// Constants

// Exported Interfaces & Types
export interface IChatProfileUserInfo {
  name: string | null;
  icon: string | null;
  chatId: string | null;
  recipient: string | null;
  abbrRecipient: string | null;
  web3Name: string | null;
  desc: string | null;
  isGroup?: boolean | null;
}

// Exported Functions
export const ChatProfile: React.FC<IChatProfile> = ({
  chatId,
  closeChatProfileInfoModalOnClickAway,
  groupInfoModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
  groupInfoModalPositionType = MODAL_POSITION_TYPE.GLOBAL,
  chatProfileRightHelperComponent = null,
  chatProfileLeftHelperComponent = null,
}) => {
  const theme = useContext(ThemeContext);
  const { user } = useChatData();
  const [showoptions, setShowOptions] = useState(false);
  const { fetchChat } = useFetchChat();
  const { getGroupByIDnew } = useGetGroupByIDnew();
  const { fetchProfileInfo } = useUserInfoUtilities();

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
      isGroup: null,
    } as IChatProfileUserInfo,
    groupInfo: null as Group | null,
  });

  const DropdownRef = useRef(null);
  const [modal, setModal] = useState(false);

  useClickAway(DropdownRef, () => {
    setShowOptions(false);
  });

  // To setup web3 name, asynchrounously
  const setupWeb3Name = async (address: string) => {
    console.debug('UIWeb::ChatProfile::setupWeb3Name sending address for resolution', address);
    const result = await resolveWeb3Name(address, user?.env);
    console.debug('UIWeb::ChatProfile::setupWeb3Name got result as ', address, result);

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
        const derivedChatId = await deriveChatId(chatId, user);

        // We have derived chatId, fetch chat info to see if it's group or dm
        const chatInfo = await fetchChat({ chatId: derivedChatId });

        if (chatInfo) {
          let groupInfo;

          // eslint-disable-next-line prefer-const
          let profile = {} as IChatProfileUserInfo;

          // If group
          if (chatInfo.meta && chatInfo.meta.group) {
            groupInfo = await getGroupByIDnew({ groupId: derivedChatId });
            if (groupInfo) {
              profile.name = groupInfo.groupName;
              profile.icon = groupInfo.groupImage;
              profile.chatId = chatInfo.chatId;
              profile.recipient = derivedChatId;
              profile.abbrRecipient = getAbbreiatedRecipient(derivedChatId);
              profile.desc = groupInfo.groupDescription;
              profile.isGroup = true;
            }

            // TODO - HANDLE ERROR IN UI
          } else {
            // This is DM
            const recipient = await deriveChatId(chatInfo.recipient, user);
            console.debug('UIWeb::ChatProfile::user.chat.info fetched', chatInfo, recipient);

            try {
              const profileInfo = await fetchProfileInfo({
                recipient,
              });

              if (profileInfo) {
                console.debug('UIWeb::ChatProfile::user.profile.info fetched', profileInfo);

                profile.name = profileInfo.name;
                profile.icon = profileInfo.picture;
                profile.chatId = chatInfo.chatId;
                profile.recipient = recipient;
                profile.abbrRecipient = getAbbreiatedRecipient(recipient);
                profile.desc = profileInfo.profile?.desc;
                profile.isGroup = false;
                profile.web3Name = getDomainIfExists(chatId);
              } else {
                throw new Error(
                  'UIWeb::ChatProfile::user.profile.info fetch error, possible push user does not exist.'
                );
              }
            } catch (error) {
              console.warn(
                'UIWeb::ChatProfile::user.profile.info fetch error, possible push user does not exist.',
                error
              );
              profile.name = '';
              profile.icon = null;
              profile.chatId = derivedChatId;
              profile.recipient = recipient;
              profile.web3Name = getDomainIfExists(chatId);
              profile.abbrRecipient = getAbbreiatedRecipient(recipient);
              profile.desc = '';
              profile.isGroup = false;
            }

            // get and set web3 name asynchrounously
            if (profile.recipient && !profile.web3Name) {
              setupWeb3Name(profile.recipient);
            }
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
        <AddonComponentSection>
          {chatProfileLeftHelperComponent && (
            <Section
              cursor="pointer"
              flex="none"
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
            loading={initialized.loading || initialized.profile.recipient === '' || initialized.profile.icon === ''}
          />
        </AddonComponentSection>

        {/* For showing group related icons and menu */}
        <AddonComponentSection
          zIndex="unset"
          flexDirection="row"
          gap="10px"
          margin="0 10px 0 auto"
          alignSelf="center"
        >
          {/* For showing chat profile right helper component */}
          {chatProfileRightHelperComponent && !initialized.groupInfo && (
            <Section
              cursor="pointer"
              maxHeight="1.75rem"
              overflow="hidden"
              flex="none"
            >
              {chatProfileRightHelperComponent}
            </Section>
          )}

          {/* For showing Token Gated Group Icon */}
          {!!Object.keys(initialized.groupInfo?.rules || {}).length && (
            <Tooltip content={'Token Gated Group'}>
              <TokenGatedIcon
                size={20}
                color={theme?.iconColor?.subtleColor}
              />
            </Tooltip>
          )}

          {!!initialized.groupInfo?.isPublic && (
            <Tooltip content={'Public Group'}>
              <PublicChatIcon
                size={{ height: 20 }}
                color={theme?.iconColor?.subtleColor}
              />
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
                <DropDownBar
                  theme={theme}
                  ref={DropdownRef}
                >
                  <DropDownItem
                    cursor="pointer"
                    onClick={() => setModal(true)}
                  >
                    <Image
                      src={InfoIcon}
                      height="21px"
                      maxHeight="21px"
                      width={'auto'}
                      cursor="pointer"
                    />

                    <TextItem cursor="pointer">{initialized.groupInfo ? 'Group Info' : 'User Info'}</TextItem>
                  </DropDownItem>
                </DropDownBar>
              )}
            </ImageItem>
          )}
        </AddonComponentSection>

        {/* For showing chat info modal | modal && */}
        {modal &&
          createPortal(
            <GroupInfoModal
              theme={theme}
              setModal={setModal}
              closeModalOnClickAway={closeChatProfileInfoModalOnClickAway}
              groupInfo={initialized.groupInfo!}
              chatProfileInfo={initialized.profile}
              setGroupInfo={(mutatedGroupInfo) =>
                setInitialized((prevState) => ({
                  ...prevState,
                  mutatedGroupInfo,
                }))
              }
              groupInfoModalBackground={groupInfoModalBackground}
              groupInfoModalPositionType={groupInfoModalPositionType}
            />,
            document.body
          )}
      </Container>
    );
  } else {
    return null;
  }
};

const Container = styled(Section)`
  width: auto;
  max-width: 100%;
  background: ${(props) => props.theme.backgroundColor.chatProfileBackground};
  border: ${(props) => props.theme.border?.chatProfile};
  border-radius: ${(props) => props.theme.borderRadius?.chatProfile};
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  padding: 6px;
  box-sizing: border-box;
  align-self: stretch;
`;

const AddonComponentSection = styled(Section)`
  gap: 10px;

  @media ${device.mobileL} {
    gap: 5px;
  }
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
