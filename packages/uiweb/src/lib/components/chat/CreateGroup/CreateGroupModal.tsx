import React, { useContext, useRef, useState } from 'react';

import styled from 'styled-components';
import { AiTwotoneCamera } from 'react-icons/ai';

//spaces things shouldnot be used
import { ModalHeader } from '../reusables/Modal';
import { Modal } from '../reusables/Modal';
import { TextInput } from '../reusables/TextInput';
import { TextArea } from '../reusables/TextArea';
import { Section, Span } from '../../reusables';
import { Button } from '../reusables';
import { CreateGroupType } from './CreateGroupType';
import useToast from '../reusables/NewToast';
import { MdError } from 'react-icons/md';


import { Image, device } from '../../../config';
import { CreateGroupModalProps } from '../exportedTypes';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { DefineCondtion } from './DefineCondition';
import AddCriteria from './AddCriteria';
import { SpamIcon } from '../../../icons/SpamIcon';
import { ThemeContext } from '../theme/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import { CriteriaStateType, useCriteriaState } from './Type';

export const CREATE_GROUP_STEP_KEYS = {
  INPUT_DETAILS: 1,
  GROUP_TYPE: 2,
  DEFINITE_CONDITION: 3,
  ADD_CRITERIA: 4,
} as const;

export type CreateGroupStepKeys =
  (typeof CREATE_GROUP_STEP_KEYS)[keyof typeof CREATE_GROUP_STEP_KEYS];


interface GroupInputDetailsType{
  groupName:string; 
  groupDescription:string; 
  groupImage:string|null; 
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
}) => {
  const [activeComponent, setActiveComponent] = useState<CreateGroupStepKeys>(
    // replace it with info one
    CREATE_GROUP_STEP_KEYS.INPUT_DETAILS
  );

  const handleNext = () => {
    console.log('active')
      setActiveComponent(activeComponent+1 as CreateGroupStepKeys);
      console.log(activeComponent)
  };
  const handlePrevious = () => {
    setActiveComponent(activeComponent-1 as CreateGroupStepKeys);
  };

  const [groupInputDetails, setGroupInputDetails] = useState<GroupInputDetailsType>({
    groupName:'',
    groupDescription:'',
    groupImage:null
  })

  const entryCriteria = useCriteriaState()

  const renderComponent = () => {
    switch (activeComponent) {
      case CREATE_GROUP_STEP_KEYS.INPUT_DETAILS:
        return <CreateGroupDetail 
          entryCriteria={entryCriteria}
          handleNext={handleNext} 
          onClose={onClose} 
          groupInputDetails={groupInputDetails} 
          setGroupInputDetails={setGroupInputDetails}
        />;
      case CREATE_GROUP_STEP_KEYS.GROUP_TYPE:
        return <CreateGroupType entryCriteria={entryCriteria}  groupInputDetails={groupInputDetails}  handleNext={handleNext} onClose={onClose} handlePrevious={handlePrevious}/>;
      case CREATE_GROUP_STEP_KEYS.DEFINITE_CONDITION:
        return <DefineCondtion entryCriteria={entryCriteria} handleNext={handleNext} handlePrevious={handlePrevious} onClose={onClose}/>
      case CREATE_GROUP_STEP_KEYS.ADD_CRITERIA:
        return <AddCriteria entryCriteria={entryCriteria} handlePrevious={handlePrevious} onClose={onClose} />
      default:
        return <CreateGroupDetail entryCriteria={entryCriteria} handlePrevious={handlePrevious} onClose={onClose}   groupInputDetails={groupInputDetails} 
        setGroupInputDetails={setGroupInputDetails}/>;
    }
  };

  return <Modal>{renderComponent()}   <ToastContainer /></Modal>;
};

export interface ModalHeaderProps {
  handleNext?: () => void;
  handlePrevious?:() =>void;
  onClose: () => void;
  entryCriteria:CriteriaStateType;
}

interface GroupDetailState{
  groupInputDetails: GroupInputDetailsType;
  setGroupInputDetails: React.Dispatch<React.SetStateAction<GroupInputDetailsType>>
}

export interface GroupTypeState{
  groupInputDetails: GroupInputDetailsType;
}

const CreateGroupDetail = ({handleNext, onClose, groupInputDetails, setGroupInputDetails }: ModalHeaderProps & GroupDetailState ) => {

  const groupInfoToast = useToast();
  const { groupName, groupDescription, groupImage } = groupInputDetails;
 
  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(device.mobileL);
  
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
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onloadend = function () {
        setGroupInputDetails({groupDescription,groupName,groupImage:reader.result as string})
      };
    }
  };

  const showError =(errorMessage:string)=>{
    groupInfoToast.showMessageToast({
      toastTitle: 'Error',
      toastMessage: errorMessage,
      toastType: 'ERROR',
      getToastIcon: (size) => <MdError size={size} color="red" />,
    });
  }

  const verifyAndHandelNext = ()=>{
    const skipVerify = true;

    if(!skipVerify){
      // verify name
      if (groupName.trim().length === 0){
        showError("Group Name is empty")
        return
      }

      // verify description
      if (groupDescription.trim().length === 0){
        showError("Group Description is empty")
        return
      }

      // verify description 
      if (!groupImage){
        showError("Group image can't be empty")
        return
      }
    }
    
    if(handleNext){
      handleNext()
    }
  }

  //groupImage and desccription is optional
  return (
    <Section flexDirection="column" alignItems='center' gap='20px' width={!isMobile?'400px':'300px'}>
      <ModalHeader title="Create Group" handleClose={onClose} />

      <UploadContainer>
        {!groupImage && (
          <ImageContainer>
            <AiTwotoneCamera fontSize={40} color="black" />
          </ImageContainer>
        )}
        {groupImage && (
          <UpdatedImageContainer>
            <Image src={groupImage} alt="group image" />
          </UpdatedImageContainer>
        )}
        <FileInput
          type="file"
          accept="image/*"
          ref={fileUploadInputRef}
          onChange={(e) => handleChange(e as unknown as Event)}
        />
      </UploadContainer>
      <TextInput
        labelName="Group Name"
        charCount={30}
        inputValue={groupName}
        onInputChange={(e: any) => setGroupInputDetails({groupDescription,groupName:e.target.value,groupImage})}
      />

      <TextArea
        labelName="Group Description"
        charCount={80}
        inputValue={groupDescription}
        onInputChange={(e: any) => setGroupInputDetails({groupDescription:e.target.value,groupName,groupImage})} 
      />
      <Button width="197px" onClick={verifyAndHandelNext}>
        Next
      </Button>
    </Section>
  );
};

export const GatingRulesInformation = () => {

    const theme = useContext(ThemeContext);
    return (
      <Section gap="4px">
        <SpamIcon />
        <Span color={theme.textColor?.modalSubHeadingText} fontSize="15px">
          Learn more about gating rules
        </Span>
      </Section>
    )
  }



//use the theme
const UploadContainer = styled.div`
  width: fit-content;
  cursor: pointer;
  align-self: center;
`;

const ImageContainer = styled.div`
  margin-top: 10px;
  width: fit-content;
  cursor: pointer;
  border-radius: 32px;
  background-color: #2f3137;
  padding: 40px;
`;
const UpdatedImageContainer = styled.div`
  margin-top: 10px;
  width: 112px;
  cursor: pointer;
  height: 112px;
  overflow: hidden;
  border-radius: 32px;
`;

const FileInput = styled.input`
  hidden: true;
`;
