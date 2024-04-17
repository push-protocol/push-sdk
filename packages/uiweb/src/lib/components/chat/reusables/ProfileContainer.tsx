import { useState } from 'react';
import { copyToClipboard, pCAIP10ToWallet } from '../../../helpers';
import { CopySvg2 } from '../../../icons/CopySvg2';
import { Div, Image, Section, Span, Tooltip } from '../../reusables';
import { IChatTheme } from '../theme';

type ProfileProps = {
  theme: IChatTheme;
  member: {
    image: string | null;
    web3Name?: string | null;
    abbrRecipient: string | null;
    recipient?: string | null;
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
export const ProfileContainer = ({
  theme,
  member,
  copy,
  customStyle,
  loading,
}: ProfileProps) => {
  const [copyText, setCopyText] = useState<string>();

  return (
    <Section justifyContent="flex-start">
      <Section
        height={customStyle?.imgHeight ?? '48px'}
        width={customStyle?.imgHeight ?? '48px'}
        borderRadius="100%"
        overflow="hidden"
        margin="0px 12px 0px 0px"
        position="relative"
        className={loading ? 'skeleton' : ''}
      >
        {member?.image &&
          <Image
            height={customStyle?.imgHeight ?? '48px'}
            maxHeight={customStyle?.imgMaxHeight ?? '48px'}
            width={'auto'}
            cursor="pointer"
            src={member?.image}
          /> 
        }
      </Section>
      <Section
        flexDirection="column"
        alignItems="start"
        whiteSpace="nowrap"
        minWidth="150px"
      >
        <>
            {member?.web3Name || loading && (
              <Section
                justifyContent="flex-start"
                minWidth="120px"
                className={loading ? 'skeleton' : ''}
              >
                <Span
                  fontSize={customStyle?.fontSize ?? '18px'}
                  fontWeight={customStyle?.fontWeight ?? '400'}
                  color={
                    customStyle?.textColor ??
                    theme.textColor?.modalSubHeadingText
                  }
                  position="relative"
                >
                  {member.web3Name}
                </Span>
              </Section>
            )}

            <Tooltip content={copyText}>
              <Section
                justifyContent="flex-start"
                gap="5px"
                cursor="pointer"
                minHeight="22px"
                minWidth="180px"
                onMouseEnter={() => setCopyText('Copy to clipboard')}
                onMouseLeave={() => setCopyText('')}
                onClick={() => {
                  copyToClipboard(
                    pCAIP10ToWallet(member?.recipient || '')
                  );
                  setCopyText('copied');
                }}
                className={loading ? 'skeleton' : ''}
              >
                <Span
                  fontSize={
                    member?.web3Name ? '14px' : customStyle?.fontSize ?? '18px'
                  }
                  fontWeight={
                    member?.web3Name ? '500' : customStyle?.fontWeight ?? '400'
                  }
                  color={
                    member?.web3Name
                      ? theme.textColor?.modalSubHeadingText
                      : customStyle?.textColor ??
                        theme.textColor?.modalSubHeadingText
                  }
                  position="relative"
                  whiteSpace="nowrap"
                >
                  {member.abbrRecipient}
                </Span>
                {copy && copyText && (
                  <Div cursor="pointer">
                    <CopySvg2 />
                  </Div>
                )}
              </Section>
            </Tooltip>
          </>
      </Section>
    </Section>
  );
};
