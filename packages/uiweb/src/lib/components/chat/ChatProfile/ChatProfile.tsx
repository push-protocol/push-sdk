// @typescript-eslint/no-non-null-asserted-optional-chain

import { useContext, useEffect, useRef, useState } from 'react';

import type { IUser } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import 'react-toastify/dist/ReactToastify.min.css';
import { Constants } from '../../../config';
import { deriveChatId } from '../../../helpers';
import { useChatData, useClickAway } from '../../../hooks';
import useChatProfile from '../../../hooks/chat/useChatProfile';
import useGetGroupByIDnew from '../../../hooks/chat/useGetGroupByIDnew';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE } from '../../../types';
import { Image, Section, Span } from '../../reusables';
import { createBlockie } from '../../space/helpers/blockies';
import { Group, IChatProfile } from '../exportedTypes';
import { ProfileContainer } from '../reusables';
import { ThemeContext } from '../theme/ThemeProvider';
import { GroupInfoModal } from './ChatProfileInfoModal';

import {
  CoreContractChainId,
  InfuraAPIKey,
  allowedNetworks,
  device,
} from '../../../config';
import {
  getAddress,
  pCAIP10ToWallet,
  resolveNewEns,
  shortenText,
  walletToPCAIP10,
} from '../../../helpers';
import useFetchChat from '../../../hooks/chat/useFetchChat';
import usePushUser from '../../../hooks/usePushUser';
import PublicChatIcon from '../../../icons/Public-Chat.svg';
import { TokenGatedSvg } from '../../../icons/TokenGatedSvg';
import VerticalEllipsisIcon from '../../../icons/VerticalEllipsis.svg';
import GreyImage from '../../../icons/greyImage.png';
import InfoIcon from '../../../icons/infodark.svg';
import { formatAddress, isValidETHAddress } from '../helpers/helper';
import { ChatInfoResponse } from '../types';

// Interfaces
interface IProfile {
  name: string | null;
  icon: string | null;
  chatId: string | null;
  recipient: string | null;
  abbrRecipient: string | null;
  desc: string | null;
}

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
      desc: null,
    } as IProfile,
    groupInfo: null as Group | null
  });

  const provider = new ethers.providers.InfuraProvider(
    CoreContractChainId[user ? user.env : Constants.ENV.PROD],
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

  const fetchProfileData = async () => {
    if (
      chatInfo &&
      !chatInfo?.meta?.group &&
      chatInfo?.participants &&
      account
    ) {
      const recipient = pCAIP10ToWallet(
        chatInfo?.participants.find(
          (address) => address !== walletToPCAIP10(account)
        ) || formattedChatId
      );
      const ChatProfile = await fetchUserProfile({
        profileId: recipient,
        user,
      });

      // const ChatProfile = await fetchUserProfile({
      //   profileId: formattedChatId,
      //   user.env,
      //   user,
      // });
      const result = await resolveNewEns(recipient, provider, Constants.ENV.PROD);
      setWeb3Name(result);
      setUserInfo(ChatProfile);
      setGroupInfo(null);
      // setIsGroup(false);
    } else if (chatInfo && chatInfo?.meta?.group) {
      const GroupProfile = await getGroupByIDnew({ groupId: formattedChatId });
      setGroupInfo(GroupProfile);
      setUserInfo(null);
      setWeb3Name(null);
    }
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

      setInitialized(currentState => ({ ...currentState, loading: true}));

      // derive chatId
      const derivedChatId = await deriveChatId(chatId, user.env);

      // We have derived chatId, fetch chat info to see if it's group or dm
      console.log("FETCHING CHAT INFO", derivedChatId, user);
      const chatInfo = await user.chat.info(derivedChatId);
      console.log("FETCHING CHAT INFO FETCHED", chatInfo);

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
          const recipient = await deriveChatId(chatInfo.participants[0], user.env);
          
          // Resolve ENS as well
          // const result = await resolveNewEns(recipient, provider, Constants.ENV.PROD);

          const profileInfo = await user.profile.info({overrideAccount: recipient});
          profile.name = profileInfo.name;
          profile.icon = profileInfo.picture;
          profile.chatId = chatInfo.chatId;
          profile.recipient = recipient;
          profile.abbrRecipient = getAbbreiatedRecipient(recipient);
          profile.desc = profileInfo.profile?.desc;
        }

        // Finally set everything
        setInitialized({
          loading: false,
          profile: profile,
          groupInfo: groupInfo,
        });

      } else {
        // Handle Error

      }
      
      // if (chatId) {
      //   let formattedChatId;
      //   if (chatId.includes('eip155:')) {
      //     formattedChatId = chatId.replace('eip155:', '');
      //   } else if (chatId.includes('.')) {
      //     formattedChatId = (await getAddress(chatId, env))!;
      //   } else formattedChatId = chatId;
      //   setFormattedChatId(formattedChatId);
      //   const chat = await fetchChat({ chatId: formattedChatId });
      //   if (Object.keys(chat || {}).length) {
      //     setChatInfo(chat as ChatInfoResponse);
      //   }
      // }
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
              recipient: initialized.profile.recipient,
              abbrRecipient: initialized.profile.abbrRecipient,
              image: initialized.profile.icon,
              web3Name: initialized.profile.name,
            }}
            copy={!!initialized.profile.recipient}
            customStyle={{
              fontSize: theme?.fontWeight?.chatProfileText,
              textColor: theme?.textColor?.chatProfileText,
            }}
            loading={initialized.loading || initialized.profile.recipient === '' || initialized.profile.icon === ''} 
          />
        </Section>
        <Section
          zIndex="unset"
          flexDirection="row"
          gap="10px"
          margin="0 20px 0 auto"
          alignSelf="center"
        >
          {chatProfileRightHelperComponent && !initialized.groupInfo && (
            <Section cursor="pointer" maxHeight="1.75rem" overflow="hidden">
              {chatProfileRightHelperComponent}
            </Section>
          )}
          {!!Object.keys(initialized.groupInfo?.rules || {}).length && <TokenGatedSvg />}
          {!!initialized.groupInfo?.isPublic && (
            <Image
              src={PublicChatIcon}
              height="28px"
              maxHeight="32px"
              width={'auto'}
            />
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
                  <DropDownItem cursor="pointer" onClick={ShowModal}>
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
        </Section>
        {modal && (
          <GroupInfoModal
            theme={theme}
            setModal={setModal}
            groupInfo={initialized.groupInfo!}
            setGroupInfo={(mutatedGroupInfo) => setInitialized((prevState) => ({ ...prevState, mutatedGroupInfo}))}
            groupInfoModalBackground={groupInfoModalBackground}
            groupInfoModalPositionType={groupInfoModalPositionType}
          />
        )}
        {/* {!isGroup && 
                    <VideoChatSection>
                        <Image src={VideoChatIcon} height="18px" maxHeight="18px" width={'auto'} />
                    </VideoChatSection>
                    } */}

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
