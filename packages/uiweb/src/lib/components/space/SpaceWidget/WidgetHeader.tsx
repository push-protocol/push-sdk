import React, { useState, MouseEventHandler, useContext } from 'react';
import styled from 'styled-components';

import { Item, Text } from '../../../config';
import { formatDate } from '../../../helpers';

import SettingsIcon from '../../../icons/settings.svg';
import CaretDownIcon from '../../../icons/CaretDown.svg';
import CaretUpIcon from '../../../icons/CaretUp.svg';
import CalendarIcon from '../../../icons/calendar.svg';
import LiveIcon from '../../../icons/live.svg';
import { CloseSvg } from '../../../icons/CloseSvg';
import { HostPfpContainer } from '../reusables';
import { SpacesInfo } from './SpacesInfo';
import { ThemeContext } from '../theme/ThemeProvider';

export interface IWidgetHeaderProps {
  onClose: MouseEventHandler;
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  toggleWidgetVisibility: () => void;

  // temp props
  isLive?: boolean;
  isHost?: boolean;
}

export const WidgetHeader: React.FC<IWidgetHeaderProps> = ({ isLive, isHost, onClose, isMinimized, setIsMinimized, toggleWidgetVisibility }: IWidgetHeaderProps) => {
  const theme = useContext(ThemeContext);

  const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

  const [isSpacesInfoVisible, setIsSpacesInfoVisible] = useState(false);

  const handleCloseWidget: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // Call for hiding the widget
    toggleWidgetVisibility();
  
    // Call for running onClose handler from prop
    onClose(event);
  };

  const showSpacesInfo = () => {
    setIsSpacesInfoVisible(!isSpacesInfoVisible);
    console.log(isSpacesInfoVisible)
  }

  const closeSpacesInfo = () => {
    setIsSpacesInfoVisible(false);
  }

  return (
    <Container theme={theme}>
      {!isLive && 
        <Section>
          <Item marginBottom={'12px'}>
            <HostPfpContainer statusTheme='Live' imageUrl={tempImageUrl} name={'Laris'} handle={'vjdfvjhvj'} />
          </Item>
          <Item display={'flex'} alignSelf={'flex-start'} alignItems={'center'}>
            {isHost &&
              <Button padding='6.5px 16.5px'>Edit space</Button>
            } 
            <Item marginLeft={'8px'} display={'flex'} onClick={showSpacesInfo}>
              <Image
                alt="Settings icon"
                src={SettingsIcon}
              />
            </Item>
            <Item marginLeft={'8px'} display={'flex'}>
              <Image
                onClick={() => setIsMinimized(!isMinimized)}
                src={isMinimized ? CaretUpIcon : CaretDownIcon}
                alt="Maximize/Minimize icon"
              />
            </Item>
            <Item marginLeft={'8px'} display={'flex'} onClick={handleCloseWidget}>
              <CloseSvg stroke='white' height='15' width='15'/>
            </Item>
          </Item>
        </Section>
      }
      <Section>
        <Text fontSize={'16px'} fontWeight={700}>Lenster partners with Push Protocol to bring seamless and secure data transfer</Text>
        {isLive &&
          <Item display={'flex'} alignSelf={'flex-start'} alignItems={'center'} marginLeft={'24px'}>
            <Item marginLeft={'8px'} display={'flex'} onClick={showSpacesInfo}>
              <Image
                alt="Settings icon"
                src={SettingsIcon}
              />
            </Item>
            <Item marginLeft={'8px'} display={'flex'}>
              <Image
                onClick={() => setIsMinimized(!isMinimized)}
                src={isMinimized ? CaretUpIcon : CaretDownIcon}
                alt="Maximize/Minimize icon"
              />
            </Item>
            <Item marginLeft={'8px'} display={'flex'} onClick={handleCloseWidget}>
              <CloseSvg stroke='white' height='15' width='15'/>
            </Item>
          </Item>
          }
      </Section>
      {!isLive &&
        <Item display={'flex'} marginTop={'12px'} alignItems={'center'}>
          <Image
            src={CalendarIcon}
            alt="Calendar Icon"
          />
          <Item marginLeft={'4px'} fontSize={'14px'} fontWeight={600}>{formatDate(Date.now())}</Item>
        </Item>
      }
      {isLive &&
        <Section marginTop='12px'>
          <Item display={'flex'} alignItems={'center'}>
            <Image
              src={LiveIcon}
              alt="Calendar Icon"
            />
            <Text fontSize={'14px'} fontWeight={600} marginLeft={'4px'}>Live</Text>
          </Item>
          <Item display={'flex'} alignItems={'center'}>
            <Item>
              {/* ToDo: Add participants icons */}
            </Item>
            <Text fontSize={'14px'} fontWeight={600} marginLeft={'4px'}>+190 Listeners</Text>
          </Item>
        </Section>
      }
      {
        isSpacesInfoVisible ?
        <SpacesInfo
          closeSpacesInfo={closeSpacesInfo}
        />
        : null
      }
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props => props.theme.titleTextColor)};
  padding: 16px 24px;
  background: ${(props => props.theme.titleBg)};
`;

const Image = styled.img`
  display: flex;
  max-height: initial;
  vertical-align: middle;
  overflow: initial;
  cursor: pointer;
  height: ${(props: any): string => props.height || '24px'};
  width: ${(props: any): string => props.width || '20px'};
  align-self: center;
`;

const Section = styled.div<{marginTop?: string}>`
  display: flex;
  justify-content: space-between;
  margin-top: ${(props) => props.marginTop};
`

const Button = styled.button<{
  padding?: string;
  color?: string;
}>`
  padding: ${(props) => (props.padding ?? '0px')};
  color: ${(props) => props.color ?? 'inherit'};
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  border: none;
  cursor: pointer;
`
