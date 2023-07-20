import React, { MouseEventHandler, useContext } from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { Modal } from '../../reusables/Modal'
import { Button } from '../../reusables/Button';
import { ModalHeader } from '../../reusables/ModalHeader';
import { TextInputWithCounter } from '../../reusables/TextInput';

import { CalendarPurple } from '../../../../icons/CalendarPurple';
import { ThemeContext } from '../../theme/ThemeProvider';

export interface ISCWCModalProps { // Space Creation Widget Create Modal Interface
    isInviteVisible?: any;
    closeCreateModal?: MouseEventHandler;
    handleNameChange?: any;
    handleDescriptionChange?: any;
    nameValue?: any;
    descriptionValue?: any;
    isDescriptionEnabled: boolean;
    isScheduleVisible?: any;
    onClose: () => void;
}

export const SCWCreateModal: React.FC<ISCWCModalProps> = (props) => {
    const theme = useContext(ThemeContext);
    const {
        isInviteVisible, closeCreateModal, handleNameChange,
        handleDescriptionChange, nameValue, descriptionValue,
        isDescriptionEnabled, isScheduleVisible, onClose,
    } = props;

    const secBtn = {
        background: 'transparent',
        borderColor: theme.btnOutline
    }

    return (
      <ThemeProvider theme={theme}>
            <Modal
                clickawayClose={onClose}
            >
                <ModalHeader
                    heading='Create your space'
                    closeCallback={closeCreateModal}
                />

                <TextInputWithCounter
                    labelName='Name'
                    inputValue={nameValue}
                    onInputChange={handleNameChange}
                    charCount={50}
                />

                {
                    isDescriptionEnabled ?
                        <TextInputWithCounter
                            labelName='Description'
                            inputValue={descriptionValue}
                            onInputChange={handleDescriptionChange}
                            charCount={120}
                        />
                    : null
                }

                <ButtonContainer>
                    <Button
                        onClick={isInviteVisible}
                        width='85%'
                    >
                        Create Space
                    </Button>

                    <div title="Schedule your Space">
                        <Button
                            width='40px'
                            height='41px'
                            customStyle={secBtn}
                            onClick={isScheduleVisible}
                        >
                            <CalendarPurple height='20' width='20' color={theme.btnColorPrimary} />
                        </Button>
                    </div>
                </ButtonContainer>
            </Modal>
          </ThemeProvider>
    )
}

/* styling */
const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;
