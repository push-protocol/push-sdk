import React, { useContext, useEffect, useRef, useState } from 'react';
import { IChatTheme, MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE, UserProfileProps } from '../exportedTypes';

import { Section, Span, Image } from '../../reusables';
import { ProfilePicture, device } from '../../../config';

import { ThemeContext } from '../theme/ThemeProvider';
import { useChatData } from '../../../hooks/chat/useChatData';
import styled from 'styled-components';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { shortenText } from '../../../helpers';

import VerticalEllipsisIcon from '../../../icons/VerticalEllipsis.svg';
import { ProfileContainer } from '../reusables';
import { IUser } from '@pushprotocol/restapi';
import useChatProfile from '../../../hooks/chat/useChatProfile';
import { useClickAway } from '../../../hooks';
import { UpdateUserProfileModal } from './UpdateUserProfileModal';
import { ToastContainer } from 'react-toastify';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

export const UserProfile : React.FC<UserProfileProps> = ({
  updateUserProfileModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
  updateUserProfileModalPositionType = MODAL_POSITION_TYPE.GLOBAL
}) => {
  const { env, signer, account, user } = useChatData();
  const [userProfile, setUserProfile] = useState<IUser>();
  const [options, setOptions] = useState<boolean>();
  const [showUpdateUserProfileModal,setShowUpdateUserProfileModal] = useState<boolean>(false);
  const DropdownRef = useRef(null);

  const theme = useContext(ThemeContext);
  const { fetchChatProfile } = useChatProfile();

  const isMobile = useMediaQuery(device.mobileL);

  useEffect(() => {
    (async () => {
      const user = await fetchChatProfile({});
      if (user) {
        setUserProfile(user);
      }
    })();
  }, [account, user]);

  useClickAway(DropdownRef, () => {
    setOptions(false);
  });

  console.log(userProfile)
  return (
    <>
    <Conatiner
      height="inherit"
      justifyContent="space-between"
      overflow="hidden"
      padding="14px 10px"
      borderRadius={theme?.borderRadius?.userProfile}
      background={theme?.backgroundColor?.userProfileBackground}
      theme={theme}
    >
      <ProfileContainer
        theme={theme}
        member={{
          wallet: shortenText(account || '', 8, true) as string,
          image: userProfile?.profile?.picture || ProfilePicture,
        }}
        customStyle={{ fontSize: theme?.fontSize?.userProfileText,
          fontWeight: theme?.fontWeight?.userProfileText,
           textColor: theme?.textColor?.userProfileText}}
      />
      {user && (
        <Section>
          <Image
            src={VerticalEllipsisIcon}
            height="21px"
            maxHeight="21px"
            color={theme?.iconColor?.userProfileSettings}
            width={'auto'}
            cursor="pointer"
            onClick={() => setOptions(true)}
          />
         
        </Section>
      )}
       {options && (
            <DropDownBar theme={theme} ref={DropdownRef} onClick={()=>setShowUpdateUserProfileModal(true)}>
              <DropDownItem cursor="pointer" >
                <Image
                  src={''}
                  height="21px"
                  maxHeight="21px"
                  width={'auto'}
                  cursor="pointer"
                />

                <TextItem cursor="pointer" >Update Profile</TextItem>
              </DropDownItem>
            </DropDownBar>
          )}
           {showUpdateUserProfileModal && (
            <UpdateUserProfileModal
              theme={theme}
              setModal={setShowUpdateUserProfileModal}
              userProfile={userProfile!}
              updateUserProfileModalBackground={updateUserProfileModalBackground}
              updateUserProfileModalPositionType={updateUserProfileModalPositionType}
            />
          )}
          
    </Conatiner>
     <ToastContainer />
     </>
  );
};

//styles
const Conatiner = styled(Section)<IThemeProps>`
  border: ${(props) => props.theme.border?.userProfile};
  box-sizing: border-box;
`;

const DropDownBar = styled.div`
  position: absolute;
  bottom: 50px;
  right:20px;
  cursor: pointer;
  display: block;
  min-width: 140px;
  color: rgb(101, 119, 149);
  background: ${(props) => props.theme.backgroundColor.modalBackground};
  border: ${(props) => props.theme.border.modalInnerComponents};
  z-index: 10;
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
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