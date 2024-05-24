// React + Web3 Essentials
import { useEffect, useRef, useState } from 'react';

// External Packages
import styled from 'styled-components';

// Internal Compoonents
import { copyToClipboard, pCAIP10ToWallet } from '../../../helpers';
import { createBlockie } from '../../../helpers/blockies';
import { Div, Image, Section, Span, Tooltip } from '../../reusables';
import { device } from '../../../config';

// Internal Configs

// Assets
import { CopyIcon } from '../../../icons/PushIcons';

// Interfaces & Types
import { IChatTheme } from '../theme';
type ProfileProps = {
  theme: IChatTheme;
  member: {
    name?: string | null;
    icon?: string | null;
    chatId?: string | null;
    abbrRecipient?: string | null;
    recipient?: string | null;
    web3Name?: string | null;
    desc?: string | null;
    isGroup?: boolean | null;
  };
  copy?: boolean;
  customStyle?: CustomStyleParamsType | null;
  loading?: boolean;
};

type CustomStyleParamsType = {
  fontSize?: string;
  fontWeight?: string;
  imgHeight?: string;
  imgMaxHeight?: string;
  textColor?: string;
};

// Constants

// Exported Interfaces & Types

// Exported Functions
export const ProfileContainer = ({ theme, member, copy, customStyle, loading }: ProfileProps) => {
  const [copyText, setCopyText] = useState<string>();

  // For blockie if icon is missing
  const blockieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blockieContainerRef.current && !member?.icon) {
      const address = pCAIP10ToWallet(member?.recipient || '');
      const blockie = createBlockie(address, { size: 8, scale: 6 });
      blockieContainerRef.current.innerHTML = ''; // Clear the container to avoid duplicating the canvas
      blockieContainerRef.current.appendChild(blockie);
    }
  }, [member?.recipient, member?.icon]);

  return (
    <Section justifyContent="flex-start">
      <Section
        height={customStyle?.imgHeight ?? '48px'}
        width={customStyle?.imgHeight ?? '48px'}
        margin="0px 12px 0px 0px"
        position="relative"
        flex="none"
        borderRadius="100%"
        overflow="hidden"
        className={loading ? 'skeleton' : ''}
      >
        {member?.icon && (
          <Image
            height={customStyle?.imgHeight ?? '48px'}
            maxHeight={customStyle?.imgMaxHeight ?? '48px'}
            width={'auto'}
            cursor="pointer"
            src={member?.icon}
          />
        )}
        {/* If no icon then show blockie */}
        {!member?.icon && (
          <Div
            ref={blockieContainerRef}
            height={customStyle?.imgHeight ?? '48px'}
            width={customStyle?.imgHeight ?? '48px'}
            cursor="pointer"
          ></Div>
        )}
      </Section>

      <Section
        flexDirection="column"
        alignItems="start"
        whiteSpace="nowrap"
        minWidth="150px"
        cursor="pointer"
      >
        <>
          {member?.name || member?.web3Name ? (
            <Span
              fontSize={customStyle?.fontSize ?? '18px'}
              fontWeight={customStyle?.fontWeight ?? '400'}
              color={customStyle?.textColor ?? theme.textColor?.modalSubHeadingText}
              position="relative"
              textAlign="left"
            >
              {member.name && member.web3Name ? member.name : member.name || member.web3Name}
            </Span>
          ) : null}

          <Tooltip content={copyText}>
            <Section
              justifyContent="flex-start"
              gap="5px"
              cursor="pointer"
              minHeight="22px"
              minWidth="140px"
              onMouseEnter={() => {
                const text = member.chatId === member.recipient ? 'Copy Chat ID' : 'Copy Wallet';
                setCopyText(text);
              }}
              onMouseLeave={() => setCopyText('')}
              onClick={() => {
                copyToClipboard(pCAIP10ToWallet(member?.recipient || ''));
                setCopyText('Copied');
              }}
              className={loading ? 'skeleton' : ''}
            >
              <RecipientSpan
                fontSize={member?.name || member?.web3Name ? '14px' : customStyle?.fontSize ?? '18px'}
                fontWeight={member?.name || member?.web3Name ? '500' : customStyle?.fontWeight ?? '400'}
                color={
                  member?.name || member?.web3Name
                    ? theme.textColor?.modalSubHeadingText
                    : customStyle?.textColor ?? theme.textColor?.modalSubHeadingText
                }
                position="relative"
                whiteSpace="nowrap"
                cursor="pointer"
                textAlign="left"
              >
                {member?.name && member?.web3Name
                  ? `${member?.web3Name} | ${member.abbrRecipient}`
                  : member.abbrRecipient}
              </RecipientSpan>
              {copy && copyText && (
                <Div cursor="pointer">
                  <CopyIcon
                    size={16}
                    color={theme?.iconColor?.primaryColor}
                  />
                </Div>
              )}
            </Section>
          </Tooltip>
        </>
      </Section>
    </Section>
  );
};

const RecipientSpan = styled(Span)`
  text-wrap: nowrap;

  @media ${device.mobileL} {
    text-wrap: pretty;
  }
`;
