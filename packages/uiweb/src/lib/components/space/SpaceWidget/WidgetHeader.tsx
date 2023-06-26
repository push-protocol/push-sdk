import React, { MouseEventHandler } from 'react';
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
  const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

  const handleCloseWidget: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // Call for hiding the widget
    toggleWidgetVisibility();
  
    // Call for running onClose handler from prop
    onClose(event);
  };

  return (
    <Container>
      {!isLive && 
        <Section>
          <Item marginBottom={'12px'}>
            <HostPfpContainer statusTheme='Live' imageUrl={tempImageUrl} name={'Laris'} handle={'vjdfvjhvj'} />
          </Item>
          <Item display={'flex'} alignSelf={'flex-start'} alignItems={'center'}>
            {isHost &&
              <Button padding='6.5px 16.5px'>Edit space</Button>
            } 
            <Image
              src={SettingsIcon}
              alt="Settings icon"
            />
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
            <Image
              src={SettingsIcon}
              alt="Settings icon"
            />
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
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  padding: 16px 24px;
  background: linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%), linear-gradient(87.17deg, #EA4E93 0%, #DB2777 0.01%, #9963F7 100%), linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 50.52%, #FFDED3 100%, #FFCFC5 100%), linear-gradient(0deg, #8B5CF6, #8B5CF6), linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 57.29%, #FF95D5 100%), #FFFFFF;
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

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: fit-content;
  align-items: center;
  margin-bottom: 12px;
}`;

const PfpContainer = styled.div`
  display: flex;
}`;

const Pfp = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
}`;

const HostContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 8px;
}`;

const HostName = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 600;
  font-size: 15px;
}`;

const Host = styled.div<{ status?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 8px;
  margin-left: 8px;
  line-height: 18px;
  width: max-content;
  height: 19px;
  background: ${(props) =>
    props.status === 'live'
      ? 'rgba(255, 255, 255, 0.2);'
      : 'rgba(139, 92, 246, 0.2)'};
  color: ${(props) => (props.status === 'live' ? 'inherit' : '#8B5CF6')};
  border-radius: 6px;
  font-weight: 500;
  font-size: 10px;
}`;

const HostHandle = styled.div<{ status?: string }>`
  color: ${(props) => (props.status === 'live' ? 'inherit' : '#71717A')};
  padding: 0;
  font-weight: 450;
  font-size: 14px;
  line-height: 130%;
}`;

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
