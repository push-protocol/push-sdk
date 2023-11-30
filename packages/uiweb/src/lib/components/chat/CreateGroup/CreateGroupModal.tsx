import React, { useContext, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { AiTwotoneCamera } from 'react-icons/ai';
import { MdError } from 'react-icons/md';

import { ModalHeader } from '../reusables/Modal';
import { Modal } from '../reusables/Modal';
import { TextInput } from '../reusables/TextInput';
import { TextArea } from '../reusables/TextArea';
import { Section, Span } from '../../reusables';
import { Button } from '../reusables';
import { CreateGroupType } from './CreateGroupType';
import useToast from '../reusables/NewToast';
import { CreateGroupModalProps, IChatTheme, MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE } from '../exportedTypes';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { DefineCondtion } from './DefineCondition';
import AddCriteria from './AddCriteria';
import { SpamIcon } from '../../../icons/SpamIcon';
import { ThemeContext } from '../theme/ThemeProvider';
import {
  CriteriaStateManagerType,
  useCriteriaStateManager,
} from '../../../hooks/chat/useCriteriaState';

import { Image } from '../../../config/styles';
import { ProfilePicture, device } from '../../../config';
import { CriteriaValidationErrorType } from '../types';
import AutoImageClipper from './AutoImageClipper';
import AddWalletsInCreateGroup from './AddWallets';

export const CREATE_GROUP_STEP_KEYS = {
  INPUT_DETAILS: 1,
  GROUP_TYPE: 2,
  ADD_MEMBERS: 3,
  DEFINITE_CONDITION: 4,
  ADD_CRITERIA: 5,
} as const;

export type CreateGroupStepKeys =
  typeof CREATE_GROUP_STEP_KEYS[keyof typeof CREATE_GROUP_STEP_KEYS];

interface GroupInputDetailsType {
  groupName: string;
  groupDescription: string;
  groupImage: string;
  groupMembers: string[];
  groupAdmins: string[];
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  modalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
  modalPositionType = MODAL_POSITION_TYPE.GLOBAL
}) => {
  const [activeComponent, setActiveComponent] = useState<CreateGroupStepKeys>(
    // replace it with info one
    CREATE_GROUP_STEP_KEYS.INPUT_DETAILS
  );

  const handleNext = () => {
    setActiveComponent((activeComponent + 1) as CreateGroupStepKeys);
  };
  const handlePrevious = () => {
    setActiveComponent((activeComponent - 1) as CreateGroupStepKeys);
  };

  const criteriaStateManager = useCriteriaStateManager();

  useEffect(() => {
    // reset update rules
    if (activeComponent === 2) {
      criteriaStateManager.resetRules();
    } else if (activeComponent === 3) {
      criteriaStateManager.resetCriteriaIdx();
    }
  }, [activeComponent]);

  const useDummyGroupInfo = false;
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [groupAdmins, setGroupAdmins] = useState<string[]>([]);
  const [groupInputDetails, setGroupInputDetails] =
    useState<GroupInputDetailsType>({
      groupName: useDummyGroupInfo ? 'This is duumy group name' : '',
      groupDescription: useDummyGroupInfo
        ? 'This is dummy group description for testing'
        : '',
      groupImage: useDummyGroupInfo ? ProfilePicture : '',
      groupMembers: useDummyGroupInfo ? groupMembers : [],
      groupAdmins: useDummyGroupInfo ? groupAdmins : [],
    });
  
    useEffect(() => {
      console.log('group members', groupInputDetails.groupMembers);
      console.log("nener", groupMembers)
      setGroupInputDetails({
        ...groupInputDetails,
        groupMembers: groupMembers,
      });
    }, [groupMembers])

  const renderComponent = () => {
    switch (activeComponent) {
      case CREATE_GROUP_STEP_KEYS.INPUT_DETAILS:
        return (
          <CreateGroupDetail
            criteriaStateManager={criteriaStateManager}
            handleNext={handleNext}
            onClose={onClose}
            groupInputDetails={groupInputDetails}
            setGroupInputDetails={setGroupInputDetails}
          />
        );
      case CREATE_GROUP_STEP_KEYS.GROUP_TYPE:
        return (
          <CreateGroupType
            criteriaStateManager={criteriaStateManager}
            groupInputDetails={groupInputDetails}
            handleNext={handleNext}
            onClose={onClose}
            handlePrevious={handlePrevious}
          />
        );
      case CREATE_GROUP_STEP_KEYS.DEFINITE_CONDITION:
        return (
          <DefineCondtion
            criteriaStateManager={criteriaStateManager}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            onClose={onClose}
          />
        );
      case CREATE_GROUP_STEP_KEYS.ADD_CRITERIA:
        return (
          <AddCriteria
            criteriaStateManager={criteriaStateManager}
            handlePrevious={handlePrevious}
            onClose={onClose}
          />
        );
      case CREATE_GROUP_STEP_KEYS.ADD_MEMBERS:
        return (
          <AddWalletsInCreateGroup groupAdmins={groupAdmins} setGroupAdmins={setGroupAdmins} groupInputDetails={groupInputDetails} setGroupInputDetails={setGroupInputDetails} groupMembers={groupMembers} setGroupMembers={setGroupMembers} />
        )
      default:
        return (
          <CreateGroupDetail
            criteriaStateManager={criteriaStateManager}
            handlePrevious={handlePrevious}
            onClose={onClose}
            groupInputDetails={groupInputDetails}
            setGroupInputDetails={setGroupInputDetails}
          />
        );
    }
  };

  return (
    <Modal clickawayClose={onClose} modalBackground={modalBackground} modalPositionType={modalPositionType}>
      {renderComponent()} <ToastContainer />
    </Modal>
  );
};

export interface ModalHeaderProps {
  handleNext?: () => void;
  handlePrevious?: () => void;
  onClose: () => void;
  criteriaStateManager: CriteriaStateManagerType;
}

interface GroupDetailState {
  groupInputDetails: GroupInputDetailsType;
  setGroupInputDetails: React.Dispatch<
    React.SetStateAction<GroupInputDetailsType>
  >;
}

export interface GroupTypeState {
  groupInputDetails: GroupInputDetailsType;
}

const CreateGroupDetail = ({
  handleNext,
  onClose,
  groupInputDetails,
  setGroupInputDetails,
}: ModalHeaderProps & GroupDetailState) => {
  const groupInfoToast = useToast();
  const { groupName, groupDescription, groupImage } = groupInputDetails;
  const theme = useContext(ThemeContext);
  const [validationErrors, setValidationErrors] =
    useState<CriteriaValidationErrorType>({});
  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(device.mobileL);
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>();

  const handleChange = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }
    if (!e.target.files) {
      return;
    }
    if (
      (e.target as HTMLInputElement).files &&
      ((e.target as HTMLInputElement).files as FileList).length
    ) {
      setIsImageUploaded(true);
      setGroupInputDetails({
        groupDescription,
        groupName,
        groupImage: '',
        groupMembers: [],
        groupAdmins: [],
      });
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onloadend = function () {
        setImageSrc(reader.result as string);
        // setGroupInputDetails({
        //   groupDescription,
        //   groupName,
        //   groupImage: reader.result as string,
        // });
      };
    }
  };

  const showError = (errorMessage: string) => {
    groupInfoToast.showMessageToast({
      toastTitle: 'Error',
      toastMessage: errorMessage,
      toastType: 'ERROR',
      getToastIcon: (size) => <MdError size={size} color="red" />,
    });
  };

  const verifyAndHandelNext = () => {
    const skipVerify = false;

    if (!skipVerify) {
      // verify name
      if (groupName.trim().length === 0) {
        setValidationErrors({
          groupName: 'Group name cannot be empty',
        });
        return;
      }

      // verify description
      if (groupDescription.trim().length === 0) {
        setValidationErrors({
          groupDescription: 'Group Description is empty',
        });
        return;
      }
    }

    if (handleNext) {
      handleNext();
    }
  };

  const handleUpload = () => {
    if (fileUploadInputRef.current) {
      fileUploadInputRef.current.click();
    }
  };

  //groupImage and desccription is optional
  return (
    <Section
      flexDirection="column"
      alignItems="center"
      gap="16px"
      overflow='hidden auto'
       justifyContent='start'
      width={!isMobile ? '400px' : '300px'}
    >
      <ModalHeader title="Create Group" handleClose={onClose} />

      <UploadContainer onClick={handleUpload}>
        {isImageUploaded ? (
          groupImage ? (
            <UpdatedImageContainer>
              <Image
                src={groupImage}
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
                setGroupInputDetails({
                  groupDescription,
                  groupName,
                  groupImage: croppedImage,
                  groupMembers: [],
                  groupAdmins: [],
                })
              }
              width={undefined}
              height={undefined}
            />
          )
        ) : (
          <ImageContainer theme={theme}>
            <AiTwotoneCamera fontSize={40} color={'rgba(87, 93, 115, 1)'} />
          </ImageContainer>
        )}
      
        <FileInput
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileUploadInputRef}
          onChange={(e) => handleChange(e as unknown as Event)}
        />
      </UploadContainer>
      <Section gap="10px" flexDirection="column" alignItems="start">
        <TextInput
          labelName="Group Name"
          charCount={30}
          inputValue={groupName}
          onInputChange={(e: any) =>
            setGroupInputDetails({
              groupDescription,
              groupName: e.target.value,
              groupImage,
              groupMembers: [],
              groupAdmins: [],
            })
          }
          error={!!validationErrors?.groupName}
        />
        {!!validationErrors?.groupName && (
          <ErrorSpan>{validationErrors?.groupName}</ErrorSpan>
        )}
      </Section>
      <Section gap="10px" flexDirection="column" alignItems="start">
        <TextArea
          labelName="Group Description"
          charCount={80}
          inputValue={groupDescription}
          onInputChange={(e: any) =>
            setGroupInputDetails({
              groupDescription: e.target.value,
              groupName,
              groupImage,
              groupMembers: [],
              groupAdmins: [],
            })
          }
          error={!!validationErrors?.groupDescription}
        />
        {!!validationErrors?.groupDescription && (
          <ErrorSpan>{validationErrors?.groupDescription}</ErrorSpan>
        )}
      </Section>
      <Button width="197px" onClick={verifyAndHandelNext}>
        Next
      </Button>
    </Section>
  );
};


//use the theme
const UploadContainer = styled.div`
  width: fit-content;
  min-width:128px;
  min-height:128px;
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
  display:flex;
  align-items:center;
  justify-content:center;
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

const ErrorSpan = styled(Span)`
  font-size: 12px;
  font-weight: 500;
  color: #ed5858;
`;
