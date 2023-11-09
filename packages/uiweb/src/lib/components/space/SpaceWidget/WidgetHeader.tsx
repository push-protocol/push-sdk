import React, {
  useState,
  useEffect,
  MouseEventHandler,
  useContext,
} from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { Item, Text } from '../../../config';
import { formatDate } from '../../../helpers';

import SettingsIcon from '../../../icons/settings.svg';
import CaretDownIcon from '../../../icons/CaretDown.svg';
import CaretUpIcon from '../../../icons/CaretUp.svg';
import CalendarIcon from '../../../icons/calendar.svg';
import LiveIcon from '../../../icons/live.svg';
import { CloseSvg } from '../../../icons/CloseSvg';
import { HostPfpContainer, ParticipantContainer } from '../reusables';
import { SpacesInfo } from './SpacesInfo';
import { ThemeContext } from '../theme/ThemeProvider';
import { useSpaceData } from '../../../hooks';

import { SpaceStatus } from './WidgetContent';

export interface IWidgetHeaderProps {
  onClose: MouseEventHandler;
  spaceData?: any;
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  toggleWidgetVisibility: () => void;

  // temp props
  spaceStatus?: any;
  isHost?: boolean;
}

export const WidgetHeader: React.FC<IWidgetHeaderProps> = ({
  onClose,
  isMinimized,
  isHost,
  setIsMinimized,
  toggleWidgetVisibility,
  spaceData,
  spaceStatus,
}: IWidgetHeaderProps) => {
  const theme = useContext(ThemeContext);
  const { isJoined } = useSpaceData();

  const tempImageUrl =
    'https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg';

  const [isSpacesInfoVisible, setIsSpacesInfoVisible] = useState(false);
  const [isSpaceLive, setIsSpaceLive] = useState<any>(SpaceStatus.Scheduled);

  const handleCloseWidget: React.MouseEventHandler<HTMLDivElement> = (
    event
  ) => {
    // Call for hiding the widget
    toggleWidgetVisibility();

    // Call for running onClose handler from prop
    onClose(event);
  };

  const showSpacesInfo = () => {
    setIsSpacesInfoVisible(!isSpacesInfoVisible);
    console.log(isSpacesInfoVisible);
  };

  const closeSpacesInfo = () => {
    setIsSpacesInfoVisible(false);
  };

  useEffect(() => {
    if (spaceStatus === SpaceStatus.Live) {
      setIsSpaceLive(SpaceStatus.Live);
    }
    if (spaceStatus === SpaceStatus.Scheduled) {
      setIsSpaceLive(SpaceStatus.Scheduled);
    }
    if (spaceStatus === SpaceStatus.Ended) {
      setIsSpaceLive(SpaceStatus.Ended);
    }
  }, [spaceStatus]);

  return (
    <ThemeProvider theme={theme}>
      <Container theme={theme}>
        {(isSpaceLive === SpaceStatus.Scheduled ||
          isSpaceLive === SpaceStatus.Ended) && (
            <Section>
              <Item marginBottom={'12px'}>
                <HostPfpContainer
                  statusTheme="Live"
                  imageUrl={spaceData?.members[0]?.image || tempImageUrl}
                  name={
                    `${spaceData?.spaceCreator?.slice(
                      7,
                      12
                    )}...${spaceData?.spaceCreator?.slice(-6, -1)}` || 'Host'
                  }
                  handle={
                    `${spaceData?.spaceCreator?.slice(
                      7,
                      12
                    )}...${spaceData?.spaceCreator?.slice(-6, -1)}` || 'Host'
                  }
                />
              </Item>
              <Item
                display={'flex'}
                alignSelf={'flex-start'}
                alignItems={'center'}
              >
                {/* {isHost && <Button padding="6.5px 16.5px" color="#fff">Edit space</Button>} */}
                <Item
                  marginLeft={'8px'}
                  display={'flex'}
                  onClick={showSpacesInfo}
                >
                  <Image alt="Settings icon" src={SettingsIcon} />
                </Item>
                <Item marginLeft={'8px'} display={'flex'}>
                  <Image
                    onClick={() => setIsMinimized(!isMinimized)}
                    src={isMinimized ? CaretUpIcon : CaretDownIcon}
                    alt="Maximize/Minimize icon"
                  />
                </Item>
                {/* COMMENTED FOR FUTURE IMPLEMENTATION */}
                {!isJoined && 
                  <Item
                    marginLeft={'8px'}
                    display={'flex'}
                    onClick={handleCloseWidget}
                  >
                    <CloseSvg stroke="white" height="15" width="15" />
                  </Item>
                }
              </Item>
            </Section>
          )}
        <Section>
          <Text fontSize={'16px'} fontWeight={700}>
            {spaceData?.spaceName || 'Test Space'}
          </Text>
          {isSpaceLive === SpaceStatus.Live && (
            <Item
              display={'flex'}
              alignSelf={'flex-start'}
              alignItems={'center'}
              marginLeft={'24px'}
            >
              <Item
                marginLeft={'8px'}
                display={'flex'}
                onClick={showSpacesInfo}
              >
                <Image alt="Settings icon" src={SettingsIcon} />
              </Item>
              <Item marginLeft={'8px'} display={'flex'}>
                <Image
                  onClick={() => setIsMinimized(!isMinimized)}
                  src={isMinimized ? CaretUpIcon : CaretDownIcon}
                  alt="Maximize/Minimize icon"
                />
              </Item>
              {!isJoined &&
                <Item
                  marginLeft={'8px'}
                  display={'flex'}
                  onClick={handleCloseWidget}
                >
                  <CloseSvg stroke="white" height="15" width="15" />
                </Item>
              }
            </Item>
          )}
        </Section>
        {isSpaceLive === SpaceStatus.Scheduled && (
          <Item display={'flex'} marginTop={'12px'} alignItems={'center'}>
            <Image src={CalendarIcon} alt="Calendar Icon" />
            <Item marginLeft={'4px'} fontSize={'14px'} fontWeight={600}>
              {formatDate(spaceData?.scheduleAt || new Date())}
            </Item>
          </Item>
        )}
        {isSpaceLive === SpaceStatus.Live && (
          <Section marginTop="12px">
            <Item display={'flex'} alignItems={'center'}>
              <Image src={LiveIcon} alt="Calendar Icon" />
              <Text fontSize={'14px'} fontWeight={600} marginLeft={'4px'}>
                Live
              </Text>
            </Item>
            <Item display={'flex'} alignItems={'center'}>
              <Item>
                <ParticipantContainer
                  participants={spaceData?.members}
                  orientation="maximized"
                />
              </Item>
              {/* <Text fontSize={'14px'} fontWeight={600} marginLeft={'4px'}>
              +190 Listeners
            </Text> */}
            </Item>
          </Section>
        )}
        {isSpacesInfoVisible ? (
          <SpacesInfo closeSpacesInfo={closeSpacesInfo} spaceData={spaceData} />
        ) : null}
      </Container>
    </ThemeProvider>
  );
};

//styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.titleTextColor};
  padding: 16px 24px;
  background: ${(props) => props.theme.titleBg};
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

const Section = styled.div<{ marginTop?: string }>`
  display: flex;
  justify-content: space-between;
  margin-top: ${(props) => props.marginTop};
`;
