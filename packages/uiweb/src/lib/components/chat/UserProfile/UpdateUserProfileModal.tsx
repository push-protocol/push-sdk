import { useState } from 'react';
import { device } from '../../../config';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { Section } from '../../reusables';
import {
  IChatTheme,
  MODAL_BACKGROUND_TYPE,
  MODAL_POSITION_TYPE,
  ModalBackgroundType,
  ModalPositionType,
} from '../exportedTypes';
import { Button, Modal, ModalHeader, TextInput } from '../reusables';
import { IUser } from '@pushprotocol/restapi';

type UpdateUserProfileModalProps = {
  theme: IChatTheme;
  userProfile: IUser;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserProfileModalBackground?: ModalBackgroundType;
  updateUserProfileModalPositionType?: ModalPositionType;
};
interface UserProfileType {
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
  const isMobile = useMediaQuery(device.mobileL);

  const onClose = (): void => {
    setModal(false);
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
            charCount={30}
            inputValue={userProfileDetails.name}
            onInputChange={(e: any) =>
              setUserProfileDetails((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            //   error={!!validationErrors?.groupName}
          />
          {/* {!!validationErrors?.groupName && (
          <ErrorSpan>{validationErrors?.groupName}</ErrorSpan>
        )} */}
        </Section>
        <Section gap="10px" flexDirection="column" alignItems="start">
          <TextInput
            labelName="Description"
            charCount={30}
            inputValue={userProfileDetails.description}
              onInputChange={(e: any) =>
                setUserProfileDetails((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            //   error={!!validationErrors?.groupName}
          />
          {/* {!!validationErrors?.groupName && (
          <ErrorSpan>{validationErrors?.groupName}</ErrorSpan>
        )} */}
        </Section>

        <Button width="197px">Update</Button>
      </Section>
    </Modal>
  );
};
