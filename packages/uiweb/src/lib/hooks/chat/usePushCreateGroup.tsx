import * as PushAPI from '@pushprotocol/restapi';
import { useChatData } from './useChatData';
import { useRef, useState } from 'react';
import { User } from '../../components';
import useToast from '../../components/chat/helpers/NewToast';
import { MdCheckCircle, MdError } from "react-icons/md"
import { Button, Image } from '../../config/styles';
import { Section, Span } from '../../components/reusables';
import { AiTwotoneCamera } from "react-icons/ai"
import styled from 'styled-components';
import { ImCross } from "react-icons/im"
import { BiArrowBack } from "react-icons/bi"
import { AddWalletContent } from '../../components/chat/ChatProfile/AddWalletContent';

enum ProgressType {
  INITIATE = 'INITIATE',
  ADDMEMBERS = 'ADDMEMBERS',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARN = 'WARN',
}

type groupOptionsType = {
  id: number;
  title: string;
  subTitle: string;
  value: boolean;
};

const groupOptions: Array<groupOptionsType> = [
  {
    id: 1,
    title: 'Public',
    subTitle: 'Chats are not encrypted',
    value: true,
  },
  {
    id: 2,
    title: 'Private',
    subTitle: 'Chats are encrypted',
    value: false,
  },
];

const randomGroupImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==`;

type ProgressHookType = {
  level: ProgressType;
};

type handleSetPassFunc = () => void;

const useCreateGroup = () => {
  const { pgpPrivateKey, env, account, signer } = useChatData();
  const [step, setStep] = useState<number>(1);
  const [groupType, setGroupType] = useState<groupOptionsType | null>(null);
  const [modalClosable, setModalClosable] = useState<boolean>(true);
  const [groupName, setGroupName] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [members, setMembers] = useState<Array<User>>([]);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const [adminAddress, setAdminAddress] = useState<User[]>([]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
  const statusToast = useToast();

  const [modalInfo, setModalInfo] = useState<{
    title: string;
    type: string;
  }>({
    title: '',
    type: ProgressType.INITIATE
  });

  const memberAdddressList = members
    .filter((member) => !adminAddress.some((admin) => admin.did === member.did))
  const isModalInputsEmpty = () => {
    if (step === 1 && (!groupDescription || !groupName || !groupType)) {
      return true;
    }
    if (step === 2 && !memberAdddressList.length) {
      return true;
    }

    return false;
  }
  const handleProgress = (progress: ProgressHookType) => {
    setStep((step) => step + 1);
    setModalInfo({
      title: 'Create Group',
      type: progress.level
    });

    if (progress.level === 'SUCCESS') {
      setTimeout(() => {
        setShowCreateGroupModal(false);
      }, 2000)
    }
  };

  const initiateProcess = () => {
    setStep(1);
    setModalInfo({
      title: 'Create Group',
      type: ProgressType.INITIATE
    });
  };
  const handleCreateGroupCall = async () => {
    // should we check for currentProfile ?
    if (!signer || !pgpPrivateKey) {
      return;
    }

    try {
      const response = await PushAPI.chat.createGroup({
        groupName,
        groupDescription,
        members: memberAdddressList.map((member) => member.wallets),
        groupImage: groupImage ?? randomGroupImage,
        admins: adminAddress.map((admin) => admin.wallets),
        isPublic: groupType?.value ?? true,
        account: account,
        pgpPrivateKey: pgpPrivateKey,
        env: env,
      });
      setShowCreateGroupModal(false);
      if (response) {
        statusToast.showMessageToast({
          toastTitle: 'Success',
          toastMessage: 'Group created successfully',
          toastType: 'SUCCESS',
        });
        console.log(response);
      } else {
        statusToast.showMessageToast({
          toastTitle: 'Error',
          toastMessage: 'Group creation failed',
          toastType: 'ERROR',
        });
      }
    } catch (err) {
      console.log(err);
      setModalClosable(true);
    }
  };

  const handleChange = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }
    if (!e.target.files) {
      return;
    }
    if ((e.target as HTMLInputElement).files && ((e.target as HTMLInputElement).files as FileList).length) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onloadend = function () {
        setGroupImage(reader.result as string);
      };
    }
  }

  const handleNext: handleSetPassFunc = async () => {
    console.log(step, "stem")
    if (step === 1) {
      handleProgress({ level: ProgressType.ADDMEMBERS });
    }
    if (step === 2 && !isModalInputsEmpty()) {
      try {
        handleCreateGroupCall();
        setModalClosable(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handlePrevious = (progress: ProgressHookType) => {
    setStep((step) => step - 1);
    setModalInfo({
      title: 'Create Group',
      type: progress.level
    });
  };

  const resetStates = () => {
    setGroupImage(null);
    setGroupDescription('');
    setGroupName('');
    setGroupType(null);
    setMembers([]);
    // setSearchedMembers([]);
    setAdminAddress([]);
    setModalClosable(true);
  };
  const createGroup = async () => {
    setShowCreateGroupModal(true);
    resetStates();
    initiateProcess();
  };
  const handleUpload = () => {
    if (fileUploadInputRef.current) {
      fileUploadInputRef.current.click();
    }
  }

  // const onProfileSelected = (profile: Profile) => {
  // setSearchedMembers((prevMembers) => [...prevMembers, profile]);
  // };

  // const onAddMembers = (profile: Profile) => {
  //   setSearchedMembers(searchedMembers.filter((item) => item !== profile));

  let modalContent: JSX.Element;
  switch (modalInfo.type) {
    case ProgressType.INITIATE:
      modalContent = (
        <Container>
          <CancelButton onClick={() => setShowCreateGroupModal(false)}>
            <ImCross />
          </CancelButton>
          <Section>
            {modalInfo.title}
          </Section>
          <UploadContainer onClick={handleUpload}>
            {!!!groupImage && (
              <ImageContainer>
                <AiTwotoneCamera fontSize={40} color='black' />
              </ImageContainer>
            )}
            {!!groupImage && (
              <UpdatedImageContainer>
                <Image src={groupImage} alt='group Image' />
              </UpdatedImageContainer>
            )}
            <FileInput
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileUploadInputRef}
              onChange={(e) => handleChange(e as unknown as Event)}
            />
          </UploadContainer>
          <InputTextContainer>
            <InputTextSubContainer>
              <InputTextLabel>Group Name</InputTextLabel>
              <Span textAlign='center'>{50 - groupName.length}</Span>
            </InputTextSubContainer>
            <InputNameContainer autoComplete='off' value={groupName} onChange={(e) => setGroupName(e.target.value.slice(0, 50))} />
          </InputTextContainer>
          <InputTextContainer>
            <InputTextSubContainer>
              <InputTextLabel>Group Description</InputTextLabel>
              <Span textAlign='center'>{150 - groupDescription.length}</Span>
            </InputTextSubContainer>
            <InputDescriptionContainer rows={4} autoComplete='off' value={groupDescription} onChange={(e) => setGroupDescription(e.target.value.slice(0, 50))} />
          </InputTextContainer>
          <InputTextLabel style={{ marginTop: "16px" }}>Group Type</InputTextLabel>
          <OptionsContainer>
            <OptionSubContainer>
              <OptionsText>Public</OptionsText>
              <OptionsSubText>Chats are not encrypted</OptionsSubText>
            </OptionSubContainer>
            <OptionSubContainerPrivate>
              <OptionsText>Public</OptionsText>
              <OptionsSubText>Chats are not encrypted</OptionsSubText>
            </OptionSubContainerPrivate>
          </OptionsContainer>
          <Section margin='15px'>
            <NextButton onClick={handleNext}>
              Next
            </NextButton>
          </Section>
        </Container>
      );
      break;
    case ProgressType.ADDMEMBERS:
      modalContent = (
        <AddMembersContainer>
          <div style={{position: "relative"}}>
          <BiArrowBack />
          </div>
          <CancelButton onClick={() => setShowCreateGroupModal(false)}>
            <ImCross />
          </CancelButton>
          <Section>
            {modalInfo.title}
          </Section>
          {/* <AddWalletContent /> */}
        </AddMembersContainer>
      );
      break;
    default:
      modalContent = (
        <Container>
          <CancelButton
            onClick={() => setShowCreateGroupModal(false)}
          >
            X
          </CancelButton>
          <div className="pb-4 text-center text-base font-medium">{modalInfo.title}</div>
        </Container>
      );
  }

  return { createGroup, modalContent }

};

export default useCreateGroup;

const Container = styled.div`
position: relative;
width: 95%;
margin: auto;
display: flex;
flex-direction: column;
padding: 10px;
`

const CancelButton = styled.button`
position: absolute;
top: 0;
right: 0;
padding: 10px;
color: #82828A;
background: transparent;
border: none;
`

const FileInput = styled.input`
display: none;
`

const UploadContainer = styled.div`
width: fit-content;
cursor: pointer;
align-self: center;
`
const ImageContainer = styled.div`
margin-top: 10px;
width: fit-content;
cursor: pointer;
border-radius: 32px;
background-color: #2F3137;
padding: 40px;
`
const UpdatedImageContainer = styled.div`
margin-top: 10px;
width: 112px;
cursor: pointer;
height: 112px;
overflow: hidden;
border-radius: 32px;
`
const InputTextContainer = styled.div`
margin-top: 16px;
`
const InputTextSubContainer = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`
const InputTextLabel = styled.div`
padding-bottom: 8px;
font-size: 1rem;
line-height: 1.5;
display: flex;
align-items: center;
`
const InputNameContainer = styled.input`
font-size: 1rem;
display: flex;
width: 299px;
// height: 48px;
padding: 13px 16px;
align-items: flex-start;
border-radius: 12px;
border: 1px solid #4A4F67;
background-color: #2F3137;
`
const InputDescriptionContainer = styled.textarea`
font-size: 1rem;
display: flex;
width: 299px;
// height: 48px;
padding: 13px 16px;
align-items: flex-start;
border-radius: 12px;
border: 1px solid #4A4F67;
background-color: #2F3137;
`

const OptionsContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
// margin-top: 16px;
`
const OptionSubContainer = styled.small`
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
justify-content: center;
border-radius: 12px 0px 0px 12px;
height: 62px;
border: 1px solid #4A4F67;
padding: 0px 10px;
`
const OptionSubContainerPrivate = styled.small`
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
justify-content: center;
border-radius: 0px 12px 12px 0px;
height: 62px;
border: 1px solid #4A4F67;
padding: 0px 10px;
`
const OptionsText = styled.span`
font-size: 15px;
font-weight: 500;
line-height: 1.5;
display: flex;
align-items: center;
text-align: center;
`

const OptionsSubText = styled.span`
font-size: 12px;
font-weight: 700;
line-height: 1.5;
display: flex;
align-items: center;
text-align: center;
color: #82828A;
`
const NextButton = styled.button`
background: transparent;
border: 1px solid #787E99;
border-radius: 15px;
color: #787E99;
height: 48px;
width: 197px;
cursor: pointer;
`

const AddMembersContainer = styled.div`
position: relative;
display: flex;
max-height: 700px;
width: 100%;
flex-direction: column;
overflow: auto;
padding: 12px 16px;
`