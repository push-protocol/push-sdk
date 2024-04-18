import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import { ChatIcon } from '../../icons/ChatIcon';
import { Modal } from './Modal';
import { Div } from '../reusables/sharedStyling';
import { ThemeContext } from '../chat/theme/ThemeProvider';
import { IChatTheme } from '../chat';

import { Constants } from '../../config';


/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

export type SupportChatV2Props = {
  supportAddress: string;
  modalTitle?: string;
  welcomeComponent?: React.ReactNode;
};

export const SupportChatV2: React.FC<SupportChatV2Props> = ({
  supportAddress,
  modalTitle = Constants.DEFAULT_TITLE,
  welcomeComponent = null
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const theme = useContext(ThemeContext);
 

  return (
    <Container>
      {!isModalOpen && (
        <Button theme={theme} onClick={() => setIsModalOpen(!isModalOpen)}>
          <Div cursor="pointer">
            <ChatIcon />
          </Div>
        </Button>
      )}
      {isModalOpen && (
        <Modal
          chatId={supportAddress}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalTitle={modalTitle}
          welcomeComponent={welcomeComponent}
        />
      )}
    </Container>
  );
};

//styles

const Container = styled.div`
  font-family: 'Strawford';
  flex: 1;
  display: flex;
  position: fixed;
  bottom: 0;
  right: 0;
  width: fit-content;
  z-index: 9999999999;
  margin: 0 3rem 2rem 0;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button<IThemeProps>`
  background: ${(props) => props.theme?.backgroundColor?.buttonBackground};
  border: none;
  cursor: pointer;
  border-radius: 18px;
  padding: 16.5px 16.5px 13px 18.5px;
`;

const Image = styled.img``;
