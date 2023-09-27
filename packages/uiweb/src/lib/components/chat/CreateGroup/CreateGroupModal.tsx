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


import { Image, device } from '../../../config';
import { CreateGroupModalProps } from '../exportedTypes';
import useMediaQuery from '../../../hooks/useMediaQuery';

export const CREATE_GROUP_STEP_KEYS = {
  INPUT_DETAILS: 1,
  GROUP_TYPE: 2,
} as const;

export type CreateGroupStepKeys =
  (typeof CREATE_GROUP_STEP_KEYS)[keyof typeof CREATE_GROUP_STEP_KEYS];


  
export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
}) => {
  const [activeComponent, setActiveComponent] = useState<CreateGroupStepKeys>(
    CREATE_GROUP_STEP_KEYS.INPUT_DETAILS
  );
  const handleNext = () => {
      setActiveComponent(activeComponent+1 as CreateGroupStepKeys);
  };
  const handlePrevious = () => {
    setActiveComponent(activeComponent-1 as CreateGroupStepKeys);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case CREATE_GROUP_STEP_KEYS.INPUT_DETAILS:
        return <CreateGroupDetail handleNext={handleNext} onClose={onClose} />;
      case CREATE_GROUP_STEP_KEYS.GROUP_TYPE:
        return <CreateGroupType onClose={onClose} handlePrevious={handlePrevious}/>;
      default:
        return <CreateGroupDetail onClose={onClose} />;
    }
  };

  return <Modal>{renderComponent()}</Modal>;
};

export interface ModalHeaderProps {
  handleNext?: () => void;
  handlePrevious?:() =>void;
  onClose: () => void;
}
const CreateGroupDetail = ({ handleNext, onClose }: ModalHeaderProps) => {
  const [groupName, setGroupName] = useState<string>('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [groupDescription, setGroupDescription] = useState<string>('');
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
        setGroupImage(reader.result as string);
      };
    }
  };
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
        onInputChange={(e: any) => setGroupName(e.target.value)}
      />

      <TextArea
        labelName="Group Description"
        charCount={80}
        inputValue={groupDescription}
        onInputChange={(e: any) => setGroupDescription(e.target.value)}
      />
      <Button width="197px" onClick={handleNext}>
        Next
      </Button>
    </Section>
  );
};




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
