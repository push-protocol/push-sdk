import { useState } from 'react';
import { device } from '../../../config';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { Section, Spinner } from '../../reusables';
import {
  IChatTheme,
  MODAL_BACKGROUND_TYPE,
  MODAL_POSITION_TYPE,
  ModalBackgroundType,
  ModalPositionType,
} from '../exportedTypes';
import { Button, Modal, ModalHeader, TextInput } from '../reusables';
import { IUser } from '@pushprotocol/restapi';
import useUserInfoUtilities from '../../../hooks/chat/useUserInfoUtilities';
import { MdCheckCircle, MdError } from 'react-icons/md';
import useToast from '../reusables/NewToast';

type UpdateUserProfileModalProps = {
  theme: IChatTheme;
  userProfile: IUser;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserProfileModalBackground?: ModalBackgroundType;
  updateUserProfileModalPositionType?: ModalPositionType;
};
export interface UserProfileType {
  name: string;
  description: string;
  picture: string;
}

export const UpdateUserProfileModal = ({
  theme,
  setModal,
  userProfile,
  updateUserProfileModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
  updateUserProfileModalPositionType = MODAL_POSITION_TYPE.GLOBAL,
}: UpdateUserProfileModalProps) => {
  const [userProfileDetails, setUserProfileDetails] = useState<UserProfileType>(
    {
      name: userProfile ? userProfile?.profile?.name ?? '' : '',
      description: userProfile ? userProfile?.profile?.desc ?? '' : '',
      picture: userProfile ? userProfile?.profile?.picture ?? '' : '',
    }
  );
  const { updateProfileLoading, updateUserProfile } = useUserInfoUtilities();
  const isMobile = useMediaQuery(device.mobileL);
  const userUpdateToast = useToast();
  const onClose = (): void => {
    setModal(false);
  };

 
  const onUpdate = async () => {
    console.log('in here')
    const isSuccess = await updateUserProfile({ userProfileDetails });
    if (typeof isSuccess != 'string') {
      userUpdateToast.showMessageToast({
        toastTitle: 'Success',
        toastMessage: 'User profile updated successfully',
        toastType: 'SUCCESS',
        getToastIcon: (size: string | number | undefined) => (
          <MdCheckCircle size={size} color="green" />
        ),
      });
      onClose();
    } else {
      showError('User profile updation failed');
    }
  };
  const showError = (errorMessage: string) => {
    userUpdateToast.showMessageToast({
      toastTitle: 'Error',
      toastMessage: errorMessage,
      toastType: 'ERROR',
      getToastIcon: (size) => <MdError size={size} color="red" />,
    });
  };

  return (
    <Modal
      clickawayClose={onClose}
      modalBackground={updateUserProfileModalBackground}
      modalPositionType={updateUserProfileModalPositionType}
    >
      <Section
        flexDirection="column"
        alignItems="center"
        gap="16px"
        overflow="hidden auto"
        justifyContent="start"
        width={!isMobile ? '400px' : '300px'}
      >
        <ModalHeader title="Update Profile" handleClose={onClose} />

        <Section gap="10px" flexDirection="column" alignItems="start">
          <TextInput
            labelName="Name"
            // charCount={30}
            inputValue={userProfileDetails.name}
            onInputChange={(e: any) =>
              setUserProfileDetails((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </Section>
        <Section gap="10px" flexDirection="column" alignItems="start">
          <TextInput
            labelName="Description"
            // charCount={30}
            inputValue={userProfileDetails.description}
            onInputChange={(e: any) =>
              setUserProfileDetails((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </Section>

        <Button width="197px" onClick={() => onUpdate()}>
          {!updateProfileLoading ? 'Update' : <Spinner size="20" color="#fff" />}
        </Button>
      </Section>
    </Modal>
  );
};
