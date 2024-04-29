import { useContext } from 'react';
import styled from 'styled-components';
import { useDeviceWidthCheck } from '../../../hooks';
import { EncryptionIcon } from '../../../icons/Encryption';
import { NoEncryptionIcon } from '../../../icons/NoEncryption';
import { PublicChatIcon } from '../../../icons/PushIcons';
import { Div, Section, Span } from '../../reusables';
import { ThemeContext } from '../theme/ThemeProvider';

export const ENCRYPTION_KEYS = {
  ENCRYPTED: 'ENCRYPTED',
  NO_ENCRYPTED: 'NO_ENCRYPTED',
  NO_ENCRYPTED_GROUP: 'NO_ENCRYPTED_GROUP',
  PREVIEW: 'PREVIEW',
  LOADING: 'LOADING',
} as const;

export type EncryptionKeys = typeof ENCRYPTION_KEYS[keyof typeof ENCRYPTION_KEYS];

export const EncryptionMessage = ({ id, className }: { id: EncryptionKeys; className?: string }) => {
  const theme = useContext(ThemeContext);
  const isMobile = useDeviceWidthCheck(771);

  const EncryptionMessageContent = {
    ENCRYPTED: {
      IconComponent: <EncryptionIcon size="15" />,
      text: 'Messages are end-to-end encrypted. Only users in this chat can view or listen to them. Click to learn more.',
    },
    NO_ENCRYPTED: {
      IconComponent: <NoEncryptionIcon size="15" />,
      text: `Messages are not encrypted`,
    },
    NO_ENCRYPTED_GROUP: {
      IconComponent: <NoEncryptionIcon size="15" />,
      text: `Messages in this group are not encrypted`,
    },
    PREVIEW: {
      IconComponent: (
        <PublicChatIcon
          size={15}
          color={theme?.iconColor?.subtleColor}
        />
      ),
      text: `Chat in preview mode. Only public groups messages are visible.`,
    },
    LOADING: {
      IconComponent: null,
      text: `Please wait while Push Chat loads the status of this chat...`,
    },
  };

  return (
    <Section
      padding="10px"
      alignSelf="center"
      borderRadius="12px"
      background={theme.backgroundColor?.encryptionMessageBackground}
      margin="10px 10px 0px"
      width={isMobile ? '80%' : 'fit-content'}
    >
      <EncryptionMessageDiv textAlign="center">
        {EncryptionMessageContent[id].IconComponent ? EncryptionMessageContent[id].IconComponent : null}

        <Span
          fontSize="13px"
          margin="0 0 0 5px"
          color={theme.textColor?.encryptionMessageText}
          fontWeight="400"
          textAlign="left"
          className={className}
        >
          {EncryptionMessageContent[id].text}
        </Span>
      </EncryptionMessageDiv>
    </Section>
  );
};

//styles
const EncryptionMessageDiv = styled(Div)`
  display: flex;
  text-align: center;
  svg {
    vertical-align: middle;
  }
`;
