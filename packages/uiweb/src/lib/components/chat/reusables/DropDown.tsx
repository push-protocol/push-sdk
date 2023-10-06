// React + Web3 Essentials
import { useContext } from 'react';

// External Packages
import styled from 'styled-components';
import { shortenText } from '../../../helpers';

// Internal Components
import { Image, Section, Span } from '../../reusables';
import { ThemeContext } from '../theme/ThemeProvider';

export type DropdownValueType = {
  invertedIcon?: any;
  id: number | string;
  link?: string;
  value?: string;
  title: string;
  icon?: string;
  textColor?: string;
  function: () => void;
};

type DropdownProps = {
  dropdownValues: DropdownValueType[];
  textColor?: string;
  iconFilter?: string;
  hoverBGColor?: string;
};

// Create Dropdown
function Dropdown({
  dropdownValues,
  textColor,
  iconFilter,
  hoverBGColor,
}: DropdownProps) {
  const theme = useContext(ThemeContext);

  const getTextColor = (dropdownValue: DropdownValueType) => {
    return dropdownValue.textColor
      ? dropdownValue.textColor
      : textColor
        ? textColor
        : theme.textColor?.modalSubHeadingText;
  };

  const copyToClipboard = (address: string) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(address);
    } else {
      const el = document.createElement('textarea');
      el.value = address;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };
  console.log(dropdownValues)
  return (
    <>
      {dropdownValues.map((dropdownValue) =>
        dropdownValue?.id === 'walletAddress' ? (
          <Section
            background="linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 57.29%, #FF95D5 100%)"
            // flexDirection='column'
            borderRadius="17px"
            padding="2px 12px"
            // wrap="nowrap"
            margin="0px 0 8px 0"
            width="100%"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              dropdownValue?.function()
              // setshowDropdown?(false): true
            }}
          >
            <Span
              margin="11px 22px 11px 2px"
              fontWeight="400"
              fontSize="14px"
              textTransform="uppercase"
              color="#fff"
              textAlign="start"
              letterSpacing="1px"
              width="100%"
            >
              <DesktopAddress>{dropdownValue?.title}</DesktopAddress>
              <MobileAddress>
                {shortenText(dropdownValue?.title, 6)}
              </MobileAddress>
            </Span>
            {dropdownValue?.invertedIcon && (
              <Image
                src={dropdownValue.invertedIcon}
                alt="icon"
                width="auto"
                cursor="pointer"
                filter="brightness(0) invert(1)"
                onClick={() => {
                  copyToClipboard(dropdownValue?.value || '');
                }}
              />
            )}
            {dropdownValue?.icon && (
              <Image
                src={dropdownValue.icon}
                alt="icon"
                width="auto"
                cursor="pointer"
                onClick={() => {
                  copyToClipboard(dropdownValue?.value || '');
                }}
              />
            )}
          </Section>
        ) : (
          <DropdownItemContainer
            hoverBGColor={hoverBGColor}
            onClick={() => dropdownValue?.function()}
          >
            {dropdownValue?.invertedIcon && (
              <Image
                src={dropdownValue.invertedIcon}
                alt="icon"
                width="100%"
                // spacing="1px"
                filter={
                  iconFilter ? iconFilter : theme.textColor?.modalSubHeadingText
                }
              />
            )}
            {dropdownValue?.icon && (
              <Image
                src={dropdownValue.icon}
                alt="icon"
                width="24px"
                cursor="pointer"
              />
            )}
            {!dropdownValue?.link && (
              <Span
                // width="100%"
                color={getTextColor(dropdownValue)}
                textAlign="start"
                margin="8px 10px"
                fontWeight="400"
                fontSize="15px"
                cursor="pointer"
              >
                {dropdownValue.title}
              </Span>
            )}
            {dropdownValue?.link && (
              <A
                href={dropdownValue?.link}
                target="_blank"
                rel="nofollow"
                color={getTextColor(dropdownValue)}
              >
                {dropdownValue.title}
              </A>
            )}
          </DropdownItemContainer>
        )
      )}
    </>
  );
}

// css styles
const SpanAddress = styled(Span)`
  margin: 11px 22px 11px 2px;
  font-weight: 400;
  size: 14px;
  text-transform: uppercase;
  color: #fff;
  spacing: 1px;
  width: 100%;
`;

const MobileAddress = styled(SpanAddress)`
  @media (min-width: 993px) {
    display: none;
  }
`;

const DesktopAddress = styled(SpanAddress)`
  @media (max-width: 992px) {
    display: none;
  }
`;

const DropdownItemContainer = styled(Section) <{ hoverBGColor?: string }>`
  justify-content: flex-start;
  flex-wrap: nowrap;
  margin: 1px 0;
  padding: 2px 8px;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: ${(props) => props.hoverBGColor || 'none'};
  }
`;

const A = styled.a`
  margin: 8px 10px;
  font-weight: 400;
  font-size: 16px;
  width: max-content;

  background: ${(props) => props.color};
  z-index: 11;
  &:hover {
    background: transparent !important;
  }
`;

export default Dropdown;
