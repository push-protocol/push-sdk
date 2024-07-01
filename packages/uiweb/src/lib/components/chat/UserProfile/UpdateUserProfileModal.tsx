import { useRef, useState } from 'react';

import { AiTwotoneCamera } from 'react-icons/ai';
import styled from 'styled-components';
import { IUser } from '@pushprotocol/restapi';

import { IChatTheme } from '../exportedTypes';
import { MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE, ModalBackgroundType, ModalPositionType } from '../../../types';

import { Button, Modal, ModalHeader, TextArea, TextInput } from '../reusables';
import { useChatData } from '../../../hooks/chat/useChatData';
import useUserInfoUtilities from '../../../hooks/chat/useUserInfoUtilities';
import { MdCheckCircle, MdError } from 'react-icons/md';
import AutoImageClipper from '../reusables/AutoImageClipper';
import { device } from '../../../config';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { Section, Spinner, Image, Span } from '../../reusables';

type UpdateUserProfileModalProps = {
  theme: IChatTheme;
  userProfile: IUser;
  setUserProfile: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  closeUserProfileModalOnClickAway?: boolean;
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
  closeUserProfileModalOnClickAway,
  userProfile,
  setUserProfile,
  updateUserProfileModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
  updateUserProfileModalPositionType = MODAL_POSITION_TYPE.GLOBAL,
}: UpdateUserProfileModalProps) => {
  const { toast, user } = useChatData();

  const [userProfileDetails, setUserProfileDetails] = useState<UserProfileType>({
    name: userProfile ? userProfile?.profile?.name ?? '' : '',
    description: userProfile ? userProfile?.profile?.desc ?? '' : '',
    picture: userProfile ? userProfile?.profile?.picture ?? '' : '',
  });
  const [imageSrc, setImageSrc] = useState<string | null>();

  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false || !!userProfileDetails.picture);
  const { updateProfileLoading, updateUserProfile } = useUserInfoUtilities();
  const isMobile = useMediaQuery(device.mobileL);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const onClose = (): void => {
    setModal(false);
  };

  const updateUserDetails = () => {
    setUserProfile((prev) => ({
      ...(prev as IUser),
      profile: {
        ...prev!.profile,
        name: userProfileDetails.name,
        desc: userProfileDetails.description,
        picture: userProfileDetails.picture,
      },
    }));
  };

  const onUpdate = async () => {
    if (user) {
      if (user.readmode()) {
        console.error('UIWeb::UserProfile::onUpdate::User is in read mode.Switch to write mode');
        toast.showMessageToast({
          toastTitle: 'Error',
          toastMessage: 'Unable to edit in readMode. Switch to write mode',
          toastType: 'ERROR',
          getToastIcon: (size: number) => (
            <MdError
              size={size}
              color="red"
            />
          ),
        });
      } else {
        const isSuccess = await updateUserProfile({ userProfileDetails });
        if (typeof isSuccess != 'string') {
          toast.showMessageToast({
            toastTitle: 'Success',
            toastMessage: 'User profile updated successfully',
            toastType: 'SUCCESS',
            getToastIcon: (size: string | number | undefined) => (
              <MdCheckCircle
                size={size}
                color="green"
              />
            ),
          });

          updateUserDetails();
          onClose();
          //set new user profile
        } else {
          showError('User profile updation failed');
        }
      }
    }
  };
  const showError = (errorMessage: string) => {
    toast.showMessageToast({
      toastTitle: 'Error',
      toastMessage: errorMessage,
      toastType: 'ERROR',
      getToastIcon: (size: number) => (
        <MdError
          size={size}
          color="red"
        />
      ),
    });
  };
  const handleChange = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }
    if (!e.target.files) {
      return;
    }
    if (
      (e.target as HTMLInputElement).files &&
      ((e.target as HTMLInputElement).files as FileList).length &&
      setIsImageUploaded
    ) {
      setIsImageUploaded(true);
      setUserProfileDetails((prev) => ({
        ...prev,
        picture: '',
      }));
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onloadend = function () {
        setImageSrc(reader.result as string);
      };
    }
  };

  const handleRemove = () => {
    setIsImageUploaded(false);
    setUserProfileDetails((prev) => ({
      ...prev,
      picture: '',
    }));
    setImageSrc(null);
  };
  const handleUpload = () => {
    if (fileUploadInputRef.current) {
      fileUploadInputRef.current.click();
    }
  };

  return (
    <Modal
      onClose={onClose}
      closeonClickAway={closeUserProfileModalOnClickAway}
      modalBackground={updateUserProfileModalBackground}
      modalPositionType={updateUserProfileModalPositionType}
    >
      <Section
        flexDirection="column"
        alignItems="center"
        gap="16px"
        overflow="hidden auto"
        justifyContent="start"
        padding="5px"
        width={!isMobile ? '400px' : '300px'}
      >
        <ModalHeader
          title="Edit Profile"
          handleClose={onClose}
        />
        <Section
          alignItems="center"
          gap="20px"
          justifyContent="start"
        >
          <UploadContainer onClick={handleUpload}>
            {isImageUploaded ? (
              userProfileDetails.picture ? (
                <UpdatedImageContainer>
                  <Image
                    src={userProfileDetails.picture}
                    objectFit="contain"
                    alt="group image"
                    width="100%"
                    height="100%"
                  />
                </UpdatedImageContainer>
              ) : (
                <AutoImageClipper
                  imageSrc={imageSrc}
                  onImageCropped={(croppedImage: string) =>
                    setUserProfileDetails((prev) => ({
                      ...prev,
                      picture: croppedImage,
                    }))
                  }
                  width={undefined}
                  height={undefined}
                />
              )
            ) : (
              <ImageContainer theme={theme}>
                <AiTwotoneCamera
                  fontSize={40}
                  color={'rgba(87, 93, 115, 1)'}
                />
              </ImageContainer>
            )}
            <FileInput
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileUploadInputRef}
              onChange={(e: any) => handleChange(e as unknown as Event)}
            />
          </UploadContainer>

          <Section
            flexDirection="column"
            gap="20px"
            alignItems="center"
          >
            <Button
              width="auto"
              height="auto"
              customStyle={{
                background: theme?.backgroundColor?.modalBackground,
                fontSize: '14px',
                border: `1px solid ${theme?.backgroundColor?.buttonBackground}
                `,
                color: theme?.backgroundColor?.buttonBackground,
                padding: '10px 15px',
              }}
              onClick={handleUpload}
            >
              Upload Photo
            </Button>
            <Span
              cursor="pointer"
              color={theme?.textColor?.modalSubHeadingText}
              fontSize="14px"
              fontWeight="400"
              onClick={handleRemove}
            >
              Remove
            </Span>
          </Section>
        </Section>
        <Section
          gap="10px"
          flexDirection="column"
          alignItems="start"
        >
          <TextInput
            labelName="Display Name"
            charCount={50}
            inputValue={userProfileDetails.name}
            onInputChange={(e: any) =>
              setUserProfileDetails((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </Section>
        <Section
          gap="10px"
          flexDirection="column"
          alignItems="start"
        >
          <TextArea
            labelName="Bio"
            charCount={150}
            inputValue={userProfileDetails.description}
            onInputChange={(e: any) =>
              setUserProfileDetails((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </Section>

        <Button
          width="197px"
          onClick={() => onUpdate()}
        >
          {!updateProfileLoading ? (
            'Save Changes'
          ) : (
            <Spinner
              size="20"
              color="#fff"
            />
          )}
        </Button>
      </Section>
    </Modal>
  );
};

//style
const UploadContainer = styled(Section)`
  width: fit-content;
  min-width: 128px;
  min-height: 128px;
  cursor: pointer;
  align-self: center;
`;

const ImageContainer = styled.div<{ theme: IChatTheme }>`
  margin-top: 10px;
  cursor: pointer;
  border-radius: 32px;
  background: ${(props) => props.theme.backgroundColor!.modalHoverBackground};
  width: 128px;
  cursor: pointer;
  height: 128px;
  max-height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const UpdatedImageContainer = styled.div`
  margin-top: 10px;
  width: 128px;
  cursor: pointer;
  height: 128px;
  overflow: hidden;
  max-height: 128px;
  border-radius: 32px;
`;

const FileInput = styled.input`
  display: none;
`;
