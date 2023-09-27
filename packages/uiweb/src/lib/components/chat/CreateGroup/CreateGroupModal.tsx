import React, { useRef, useState } from 'react'
import { ModalHeader } from '../../space/reusables/ModalHeader'
import { Modal } from '../../space/reusables/Modal'
import { TextInputWithCounter } from '../../space/reusables/TextInput'
import styled from 'styled-components'
import { AiTwotoneCamera } from "react-icons/ai"
import { Image } from '../../../config'
import { TextArea } from '../../space/reusables/TextArea'
import { Button } from '../../space/reusables/Button'
import ChooseOneButtons from '../../space/reusables/ChooseOneButtons'
import { Section, Span } from '../../reusables'
import { ToggleInput } from '../reusables'
import GroupButton from '../../space/reusables/GroupButton'
import { SpamIcon } from '../../../icons/SpamIcon'

export const CreateGroupModal = () => {

    const [activeComponent, setActiveComponent] = useState("CreateGroupInformation");
    const handleNext = () => {
        if (activeComponent === "CreateGroupInformation") {
            setActiveComponent("GroupType");
        }
    }

    const renderComponent = () => {
        switch (activeComponent) {
            case "CreateGroupInformation":
                return (
                    <CreateGroupDetailModal NextFunc={handleNext} />
                );
            case "GroupType":
                return (
                    <CreateGroupTypeModal />
                );
            default:
                return (
                    <CreateGroupDetailModal />
                );
        }
    }

    return (
        <Modal>
            <ModalHeader heading='Create Group' />
            {renderComponent()}
        </Modal>
    )
}

const CreateGroupDetailModal = ({ NextFunc }: any) => {
    const [groupName, setGroupName] = useState<string>('');
    const [groupImage, setGroupImage] = useState<string | null>(null);
    const [groupDescription, setGroupDescription] = useState<string>('');
    const fileUploadInputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: Event) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        if (!e.target.files) {
            return;
        }
        if ((e.target as HTMLInputElement).files && ((e.target as HTMLInputElement).files as FileList).length) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onloadend = function () {
                setGroupImage(reader.result as string);
            };
        }
    }
    return (
        <Section flexDirection='column'>

            <UploadContainer>
                {!groupImage && (
                    <ImageContainer>
                        <AiTwotoneCamera fontSize={40} color='black' />
                    </ImageContainer>
                )}
                {groupImage && (
                    <UpdatedImageContainer>
                        <Image src={groupImage} alt="group image" />
                    </UpdatedImageContainer>
                )}
                <FileInput type='file' accept="image/*" ref={fileUploadInputRef} onChange={(e) => handleChange(e as unknown as Event)} />
            </UploadContainer>
            <TextInputWithCounter labelName='Group Name' charCount={30} inputValue={groupName} onInputChange={(e: any) => setGroupName(e.target.value)} />
            <TextArea labelName='Group Description' charCount={80} inputValue={groupDescription} onInputChange={(e: any) => setGroupDescription(e.target.value)} />
            <GroupButton title={'Next'} onClick={NextFunc} />
        </Section>
    )
}

const CreateGroupTypeModal = () => {
    const [checked, setChecked] = useState<boolean>(false);
    return (
        <div>
            <Section flexDirection='column' gap='32px' padding='10px'>
                <ChooseOneButtons option1='Open' option2='Encrypted' shortheading1='Anyone can view chats' shortheading2='Users must join group to view' />
                <Section justifyContent='space-between' alignItems='center'>
                    <Section alignItems='start' flexDirection='column'>
                        <Span color='#1E1E1E' fontSize='16px' fontWeight='500'>Gated Group</Span>
                        <Span color='#657795' fontWeight='400' fontSize='12px'>
                            Turn this on for Token/NFT gating options
                        </Span>
                    </Section>
                    <ToggleInput checked={checked} onToggle={() => setChecked(!checked)} />
                </Section>
                {checked && (
                    <Section flexDirection='column'>
                        <Section margin='20px 0px 10px 0px' alignItems='start' flexDirection='column'>
                            <Span color='#1E1E1E' fontSize='16px' fontWeight='500'>
                                Conditions to Join
                            </Span>
                            <Span color='#657795' fontWeight='400' fontSize='12px'>
                                Add a condition to join or leave it open for everyone
                            </Span>
                            <Span cursor='pointer' color='#D53A94' fontSize='15px' margin='10px 0px 0px 15px' fontWeight='500'>
                                + Add conditions
                            </Span>
                        </Section>
                        <Section margin='20px 0px 10px 0px' alignItems='start' flexDirection='column'>
                            <Span color='#1E1E1E' fontSize='16px' fontWeight='500'>
                                Conditions to Chat
                            </Span>
                            <Span color='#657795' fontWeight='400' fontSize='12px'>
                                Add a condition to chat or leave it open for everyone
                            </Span>
                            <Span color='#D53A94' cursor='pointer' fontSize='15px' margin='10px 0px 0px 15px' fontWeight='500'>
                                + Add conditions
                            </Span>
                        </Section>
                    </Section>
                )}
                <Section gap='20px' flexDirection='column'>
                    <GroupButton title={'Create Group'} />
                    <Section gap='4px'>
                        <SpamIcon />
                        <Span color='#657795' fontSize='15px'>Learn more about gating rules</Span>
                    </Section>
                </Section>
            </Section>
        </div>
    )
}

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

const FileInput = styled.input`
hidden: true;
`