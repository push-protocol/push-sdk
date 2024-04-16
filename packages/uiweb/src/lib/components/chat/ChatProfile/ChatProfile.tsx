// @typescript-eslint/no-non-null-asserted-optional-chain

import { useContext, useEffect, useRef, useState } from 'react';

import type { IUser } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import 'react-toastify/dist/ReactToastify.min.css';
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
import { GroupInfoModal } from './GroupInfoModal';

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
import useUserProfile from '../../../hooks/useUserProfile';
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
  cawallet: string | null;
  wallet: string | null;
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
  const { account, env, user } = useChatData();
  const { getGroupByIDnew } = useGetGroupByIDnew();
  const { fetchUserProfile } = useUserProfile();

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
      name: '',
      icon: '',
      wallet: '',
      cawallet: '',
      desc: '',
    } as IProfile,
    groupInfo: null as Group | null
  });

  const provider = new ethers.providers.InfuraProvider(
    CoreContractChainId[env],
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
          (address) => address != walletToPCAIP10(account)
        ) || formattedChatId
      );
      const ChatProfile = await fetchUserProfile({
        profileId: recipient,
        env,
        user,
      });

      // const ChatProfile = await fetchUserProfile({
      //   profileId: formattedChatId,
      //   env,
      //   user,
      // });
      const result = await resolveNewEns(recipient, provider, env);
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

  const getImage = () => {
    if (userInfo || groupInfo) {
      return Object.keys(groupInfo || {}).length
        ? groupInfo?.groupImage ?? GreyImage
        : userInfo?.profile?.picture ??
            createBlockie?.(formattedChatId)?.toDataURL()?.toString();
    } else {
      return createBlockie?.(formattedChatId)?.toDataURL()?.toString();
    }
  };

  const getProfileName = () => {
    return Object.keys(groupInfo || {}).length
      ? shortenText(groupInfo?.chatId || '', 6, true)
      : userInfo
      ? shortenText(userInfo.did?.split(':')[1] ?? '', 6, true)
      : shortenText(chatId?.split(':')[1], 6, true);
  };

  // Initiate profile fetch if chatId, account or user changes
  useEffect(() => {
    (async () => {
      console.log('Profile Init with chatId:', chatId)
      if (!user || !chatId || chatId === '' || initialized.loading) return;

      setInitialized(currentState => ({ ...currentState, loading: true}));

      // derive chatId
      const derivedChatId = await deriveChatId(chatId, env);

      // We have derived chatId, fetch chat info to see if it's group or dm
      const chatInfo = await user.chat.info(derivedChatId);
      if (chatInfo) {
        let groupInfo;

        // eslint-disable-next-line prefer-const
        let profile = {} as IProfile;

        // If group
        if (chatInfo.meta.group) {
          groupInfo = await user.chat.group.info(derivedChatId);
          profile.name = groupInfo.groupName;
          profile.icon = groupInfo.groupImage;
          profile.cawallet = chatId;
          profile.wallet = derivedChatId;
          profile.desc = groupInfo.groupDescription;
          
          // TODO - HANDLE ERROR IN UI
        } else {
          // This is DM
          const profileInfo = await user.profile.info({overrideAccount: chatId});
          console.log('Profile Info:', profileInfo);
          profile.name = profileInfo.name;
          profile.icon = profileInfo.icon ? profileInfo.icon : createBlockie?.(chatId)?.toDataURL()?.toString();
          profile.cawallet = chatId;
          profile.wallet = derivedChatId;
          profile.desc = profileInfo.profile?.bio;
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
  }, [chatId, user, env]);

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
              wallet: initialized.profile.wallet ? initialized.profile.wallet : chatId,
              image: initialized.profile.icon ? initialized.profile.icon : getImage(),
              web3Name: initialized.profile.name,
              completeWallet: initialized.profile.cawallet,
            }}
            copy={!!initialized.profile.wallet}
            customStyle={{
              fontSize: theme?.fontWeight?.chatProfileText,
              textColor: theme?.textColor?.chatProfileText,
            }}
            loading={initialized.loading}
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

          {!!Object.keys(initialized.groupInfo || {}).length && (
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

                    <TextItem cursor="pointer">Group Info</TextItem>
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
            setGroupInfo={setGroupInfo}
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
