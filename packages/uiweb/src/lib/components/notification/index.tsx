import * as PropTypes from 'prop-types';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { MediaHelper, convertTimeStamp, extractTimeStamp } from '../../utilities';
import Loader from '../loader/loader';
import ImageOverlayComponent from '../overlay';
import { ParseMarkdownText } from '../parsetext';
import chainDetails from './chainDetails';
import { DecryptButton, useDecrypt } from './decrypt';

import { useDivOffsetWidth } from '../../hooks';
import { LinkIcon } from '../../icons/Link';

import type { INotificationItemTheme } from './theme';
import { getCustomTheme } from './theme';
import { Button } from '../reusables';
import { CloseIcon } from '../../icons/Close';
export {
  baseTheme as notificationBaseTheme,
  darkTheme as notificationDarkTheme,
  lightTheme as notificationLightTheme,
  type INotificationItemTheme,
} from './theme';

// ================= Define types
export type chainNameType =
  | 'ETH_TEST_SEPOLIA'
  | 'ETH_MAINNET'
  | 'POLYGON_MAINNET'
  | 'POLYGON_TEST_AMOY'
  | 'BSC_MAINNET'
  | 'BSC_TESTNET'
  | 'OPTIMISM_MAINNET'
  | 'OPTIMISM_TESTNET'
  | 'POLYGON_ZK_EVM_TESTNET'
  | 'POLYGON_ZK_EVM_MAINNET'
  | 'ARBITRUMONE_MAINNET'
  | 'ARBITRUM_TESTNET'
  | 'FUSE_TESTNET'
  | 'FUSE_MAINNET'
  | 'THE_GRAPH'
  | 'BERACHAIN_TESTNET'
  | 'LINEA_MAINNET'
  | 'LINEA_TESTNET'
  | 'CYBER_CONNECT_TESTNET'
  | 'CYBER_CONNECT_MAINNET'
  | 'BASE_TESTNET'
  | 'BASE_MAINNET'
  | undefined;

export type NotificationItemProps = {
  notificationTitle: string | undefined;
  notificationBody: string | undefined;
  cta: string | undefined;
  app: string | undefined;
  isToast?: boolean;
  icon: string | undefined;
  image: string | undefined;
  url: string | undefined;
  isSpam?: boolean;
  onClose?: () => void;
  subscribeFn?: () => Promise<unknown>;
  isSubscribedFn?: () => Promise<unknown>;
  theme?: string | undefined;
  customTheme?: INotificationItemTheme | undefined;
  chainName: chainNameType;
  isSecret?: boolean;
  decryptFn?: () => Promise<{
    title: string;
    body: string;
    cta: string;
    image: string;
  }>;
};

type ContainerDataType = {
  timestamp?: string;
} & OffsetWidthType;
type OffsetWidthType = {
  offsetWidth: number;
};

type FontSizeType = {
  fontSize: string;
};

type CustomThemeProps = {
  themeObject: INotificationItemTheme;
};
type CTADataType = {
  cta?: boolean;
};

type MetaDataType = {
  hidden?: boolean;
};

type MetaInfoType = MetaDataType & { hasLeft: boolean };

// ================= Define base component
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notificationTitle,
  notificationBody,
  cta,
  app,
  icon,
  image,
  isToast = false,
  url,
  isSpam, //for rendering the spam conterpart of the notification component
  isSubscribedFn, //A function for getting if a user is subscribed to the channel in question
  subscribeFn, //A function for subscribing to the spam channel
  theme, //for specifying light and dark theme
  chainName,
  customTheme,
  isSecret,
  decryptFn,
  onClose,
}) => {
  const { notificationBody: parsedBody, timeStamp } = extractTimeStamp(notificationBody || '');
  const themeObject = getCustomTheme(theme, customTheme!);

  const { notifTitle, notifBody, notifCta, notifImage, setDecryptedValues, isSecretRevealed } = useDecrypt(
    { notificationTitle, parsedBody, cta, image },
    isSecret
  );

  const isCtaURLValid = MediaHelper.validURL(notifCta) && !isToast;
  const isChannelURLValid = MediaHelper.validURL(url);

  // store the image to be displayed in this state variable
  const [imageOverlay, setImageOverlay] = React.useState('');
  const [subscribeLoading, setSubscribeLoading] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(true); //use this to confirm if this is s
  const [divRef, offsetWidth] = useDivOffsetWidth();

  const gotToCTA = (e: React.SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isCtaURLValid) return;
    window.open(notifCta, '_blank');
  };

  const goToURL = (e: React.SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isChannelURLValid) return;
    window.open(url, '_blank');
  };

  /**
   * A function which wraps around the function to subscribe a user to a channel
   * @returns
   */
  const onSubscribe = async (clickEvent: React.SyntheticEvent<HTMLElement>) => {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();

    if (!subscribeFn) return;
    try {
      setSubscribeLoading(true);
      await subscribeFn();
      setIsSubscribed(true);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const onDecrypt = async () => {
    if (decryptFn) {
      try {
        const decryptedPayload = await decryptFn();
        // to check if always both title, body are present
        if (decryptedPayload) {
          setDecryptedValues(decryptedPayload);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  React.useEffect(() => {
    if (!isSpam || !isSubscribedFn) return;

    isSubscribedFn().then((res: unknown) => {
      setIsSubscribed(Boolean(res));
    });
  }, [isSubscribedFn, isSpam]);

  if (isSubscribed && isSpam) return null;
  // render
  return (
    <Container
      timestamp={timeStamp}
      offsetWidth={offsetWidth}
      ref={divRef}
      cta={isCtaURLValid}
      themeObject={themeObject!}
    >
      <MobileHeader themeObject={themeObject!}>
        <HeaderButton themeObject={themeObject!}>
          <ImageContainer
            offsetWidth={offsetWidth}
            theme={theme}
          >
            <img
              style={{ width: '100%', borderRadius: '8px' }}
              src={icon}
              title={`Channel icon for ${app}`}
              alt=""
            />
          </ImageContainer>
          <ChannelName
            fontSize={`calc(${themeObject?.fontSize?.channelNameText} - ${isToast ? '2px' : '0px'})`}
            themeObject={themeObject}
            onClick={goToURL}
          >
            {app}
          </ChannelName>
          <Ellipse background={theme === 'dark' ? '#757D8D' : '#c4cbd5'} />
          {timeStamp ? <TimestampLabel themeObject={themeObject!}>{convertTimeStamp(timeStamp)}</TimestampLabel> : null}
        </HeaderButton>
        <ChainCloseContainer>
          {chainName && chainDetails[chainName] ? (
            <BlockchainContainer>
              <ChainIconSVG offsetWidth={offsetWidth}>{chainDetails[chainName].icon}</ChainIconSVG>
            </BlockchainContainer>
          ) : null}
          {isToast && onClose && (
            <CloseContainer onClick={onClose}>
              <CloseIcon />
            </CloseContainer>
          )}
        </ChainCloseContainer>
      </MobileHeader>

      {/* content of the component */}
      <ContentSection
        isToast={isToast && !!notifImage}
        themeObject={themeObject!}
        offsetWidth={offsetWidth}
      >
        {/* section for media content */}
        {notifImage &&
          // if its an image then render this
          (!MediaHelper.isMediaSupportedVideo(notifImage) ? (
            <MobileImage
              theme={theme}
              size={isToast ? '56px' : '90px'}
              offsetWidth={offsetWidth}
              style={{ cursor: 'pointer' }}
              onClick={() => setImageOverlay(notifImage || '')}
            >
              <img
                src={notifImage}
                alt=""
              />
            </MobileImage>
          ) : // if its a youtube url, RENDER THIS
            MediaHelper.isMediaYoutube(notifImage) ? (
              <MobileImage
                offsetWidth={offsetWidth}
                size={isToast ? '56px' : '90px'}
              >
                <iframe
                  id="ytplayer"
                  width="640"
                  allow="fullscreen;"
                  height="360"
                  src={MediaHelper.isMediaExternalEmbed(notifImage)}
                  title="Youtube"
                ></iframe>
              </MobileImage>
            ) : (
              // if its aN MP4 url, RENDER THIS
              <MobileImage
                offsetWidth={offsetWidth}
                size={isToast ? '56px' : '90px'}
              >
                <video
                  width="360"
                  height="100%"
                  controls
                >
                  <source
                    src={notifImage}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </MobileImage>
            ))}
        {/* section for media content */}

        {/* section for text content */}
        <NotificationDetialsWrapper>
          <NotificationDetails
            offsetWidth={offsetWidth}
            themeObject={themeObject!}
          >
            <ChannelTitleWrapper
              cta={isCtaURLValid}
              onClick={isCtaURLValid ? gotToCTA : undefined}
            >
              <ChannelTitleText
                fontSize={`calc(${themeObject?.fontSize?.notificationTitleText} - ${isToast ? '2px' : '0px'})`}
                themeObject={themeObject!}
              >
                {notifTitle}
              </ChannelTitleText>
              {/* display link svg if notification has a valid cta url */}
              {isCtaURLValid ? (
                <span
                  style={{
                    width: `calc(16px - ${isToast ? '2px' : '0px'})`,
                    height: `calc(16px - ${isToast ? '2px' : '0px'})`,
                  }}
                >
                  <LinkIcon />
                </span>
              ) : (
                ''
              )}
            </ChannelTitleWrapper>
            <ChannelDesc
              themeObject={themeObject!}
              fontSize={`calc(${themeObject?.fontSize?.notificationContentText} - ${isToast ? '2px' : '0px'})`}
            >
              <ChannelDescLabel
                themeObject={themeObject!}
                cta={isCtaURLValid}
              >
                <ParseMarkdownText text={notifBody} />
              </ChannelDescLabel>
            </ChannelDesc>
          </NotificationDetails>
          {isSpam && (
            <Button
              height="32px"
              onClick={onSubscribe}
              width="fit-content"
              color={themeObject.color?.optInButtonText}
              fontWeight={(themeObject.fontWeight?.optInButtonText || 500).toString()}
              fontSize={themeObject.fontSize?.optInButtonText}
              borderRadius="8px"
              padding="12px 16px"
              background={themeObject.color?.optInButtonBackground}
            >
              {subscribeLoading ? <Loader /> : 'Subscribe'}
            </Button>
          )}
        </NotificationDetialsWrapper>
        {/* section for text content */}

        {isSecret && (
          <ButtonGroupContainer>
            <ButtonGroup>
              {isSecret ? (
                <DecryptButton
                  decryptFn={onDecrypt}
                  isSecretRevealed={isSecretRevealed}
                />
              ) : null}
            </ButtonGroup>
          </ButtonGroupContainer>
        )}
      </ContentSection>
      {/* content of the component */}

      {/* Meta Data section */}
      {isSecret && (
        <ChannelMetaInfo
          hidden={!isSecret}
          hasLeft={false}
        >
          {/* For left aligned items use ChannelMetaInfoLeft as parent */}
          <ChannelMetaInfoLeft hidden></ChannelMetaInfoLeft>

          {/* For right aligned items use ChannelMetaInfoRight */}
          <ChannelMetaInfoRight hidden={!isSecret}>
            {isSecret ? (
              <SecretIconContainer>
                <SecretIcon></SecretIcon>
              </SecretIconContainer>
            ) : null}
          </ChannelMetaInfoRight>
        </ChannelMetaInfo>
      )}

      {/* add image overlay for full screen images */}
      <ImageOverlayComponent
        imageOverlay={imageOverlay}
        setImageOverlay={setImageOverlay}
      />
      {/* add image overlay for full screen images */}
    </Container>
  );
};

// ================= Define default props
NotificationItem.propTypes = {
  notificationBody: PropTypes.string,
  notificationTitle: PropTypes.string,
  cta: PropTypes.string,
  image: PropTypes.string,
  app: PropTypes.string,
  url: PropTypes.string,
  isSpam: PropTypes.bool,
  subscribeFn: PropTypes.func,
  isSubscribedFn: PropTypes.func,
  theme: PropTypes.string,
  customTheme: PropTypes.object,
};

NotificationItem.defaultProps = {
  notificationTitle: '',
  notificationBody: '',
  cta: '',
  app: '',
  image: '',
  url: '',
  isSpam: false,
  theme: 'light',
};

// ================= Define styled components
// ================= Define styled components
const MD_BREAKPOINT = '50050px'; //set an arbitrarily large number because we no longer use this breakpoint
const SM_BREAKPOINT = '900px';

const ContentSection = styled.div<CustomThemeProps & OffsetWidthType & { isToast: boolean }>`
  display: flex;
  gap: 12px;
  justify-content: ${(props) => (props?.isToast ? 'space-between' : 'start')};
  flex-direction: ${(props) => (props?.isToast ? 'row-reverse' : 'row')};
  align-items: flex-start;
`;

const BlockchainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const Ellipse = styled.div<{ background?: string }>`
  width: 4px;
  height: 4px;
  background: ${(props) => props?.background};
  border-radius: 100%;
`;
const ChainIconSVG = styled.div<OffsetWidthType>`
  width: 18px;
  height: 18px;

  svg,
  svg image,
  img {
    width: 100%;
    height: 100%;
  }
  @media (max-width: ${SM_BREAKPOINT}) {
    width: 18px;
    height: 18px;
  }
`;

const MobileImage = styled.div<OffsetWidthType & { theme?: string; size?: string }>`
  overflow: hidden;
  flex-shrink: 0;
  width: ${(props) => props?.size};
  height: ${(props) => props?.size};
  img,
  iframe,
  video {
    max-width: 100% !important;
    width: 100%;
    height: 100% !important;
    object-fit: fill;
    border-radius: 100%;
    border: 0;
  }
`;

const ImageContainer = styled.div<OffsetWidthType & { theme?: string }>`
  border: 1px solid #eaebf2;
  overflow: hidden;
  border-radius: 8px;
  width: 24px;
  height: 24px;
`;

const NotificationDetialsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Container = styled.div<ContainerDataType & CustomThemeProps & CTADataType>`
  position: relative;
  padding: 16px;
  overflow: hidden;
  flex-direction: column;
  font-family: ${(props) => props?.themeObject?.fontFamily};
  flex: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border: ${(props) => `1px solid ${props?.themeObject?.color?.modalBorder}`};
  background: ${(props) => props?.themeObject?.color?.accentBackground};
  border-radius: ${(props) => props?.themeObject?.borderRadius?.modal};
  ${(props) =>
    props.cta &&
    css`
      &:hover {
        background: ${props?.themeObject?.color?.contentHoverBackground};
      }
    `};
`;

const MobileHeader = styled.div<CustomThemeProps>`
  display: flex;
  justify-content: space-between;
`;

const ChannelName = styled.div<CustomThemeProps & FontSizeType>`
  cursor: pointer;
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props?.themeObject?.fontWeight?.channelNameText};
  color: ${(props) => props?.themeObject?.color?.channelNameText};
`;

const HeaderButton = styled.div<CustomThemeProps>`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NotificationDetails = styled.div<OffsetWidthType & CustomThemeProps>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: ${MD_BREAKPOINT}) {
    color: ${(props) => props?.themeObject?.color?.notificationTitleText};
  }

  ${(props: any) =>
    props.offsetWidth > 461 &&
    css`
      @media (max-width: ${SM_BREAKPOINT}) {
        margin-bottom: 6px;
      }
    `};

  ${(props: any) =>
    props.offsetWidth <= 461 &&
    css`
      margin-bottom: 6px;
    `};
`;
const ChannelTitleWrapper = styled.div<CTADataType>`
  ${(props) =>
    props.cta &&
    css`
      &:hover {
        color: #c742dd;
        span {
          color: #c742dd;
        }
      }
    `};

  cursor: pointer;
  align-items: center;
  display: flex;
  gap: 8px;
`;

const ChannelTitleText = styled.span<CustomThemeProps & FontSizeType>`
  cursor: pointer;
  font-size: ${(props) => props?.fontSize};
  font-weight: ${(props) => props?.themeObject?.fontWeight?.notificationTitleText};
  color: ${(props) => props?.themeObject?.color?.notificationTitleText};
`;
const ChannelDesc = styled.div<CustomThemeProps & FontSizeType>`
  line-height: 20px;
  flex: 1;
  display: flex;
  font-size: ${(props) => props?.fontSize};
  color: ${(props) => props?.themeObject?.color?.notificationContentText};
  font-weight: ${(props) => props?.themeObject?.fontWeight?.notificationContentText};
  flex-direction: column;
`;

const ChannelDescLabel = styled.label<CTADataType & CustomThemeProps>`
  cursor: ${(props) => (props.cta ? 'pointer' : 'default')};
  color: ${(props) => props?.themeObject?.color?.notificationContentText};
  flex: 1;
  margin: 0px;
  text-align: left;
`;

const ChannelMetaInfo = styled.div<MetaInfoType>`
  display: ${(props) => (props.hidden ? 'none' : 'flex')};
  flex-direction: row;
  justify-content: ${(props) => (props.hasLeft ? 'space-between' : 'end')};
`;
const CloseContainer = styled.div`
  cursor: pointer;
  display: flex;
`;

const ChainCloseContainer = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;
const ChannelMetaSection = styled.div<MetaDataType>`
  display: ${(props) => (props.hidden ? 'none' : 'flex')};
  align-items: center;
`;

const ChannelMetaInfoLeft = styled(ChannelMetaSection)`
  justify-content: start;
`;

const ChannelMetaInfoRight = styled(ChannelMetaSection)`
  justify-content: end;
`;

const TimestampLabel = styled.label<CustomThemeProps>`
  color: ${(props) => props?.themeObject?.color?.timestamp};
  line-height: 14px;

  font-weight: ${(props) => props?.themeObject?.fontWeight?.timestamp};
  font-size: ${(props) => props?.themeObject?.fontSize?.timestamp};
`;

const SecretIconContainer = styled.div`
  margin: 6px;
`;

const SecretIcon = styled.div`
  width: 12px;
  height: 12px;

  border-radius: 50%;
  background: linear-gradient(135deg, #e20880 12.5%, #674c9f 49.89%, #35c5f3 87.5%);
`;

const ButtonGroupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;
