import React, { useContext, useState } from 'react';
import { Button, PoweredByPush } from '../reusables';
import { Anchor, Section, Span, Spinner } from '../../reusables';
import styled from 'styled-components';
import {
  useManageSubscriptionsUtilities,
  useWidgetData,
} from '../../../hooks';
import useToast from '../reusables/NewToast';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { ThemeContext } from '../theme/ThemeProvider';

import { WidgetErrorCodes } from './types';
import PushLogo from '../../../icons/pushLogo.svg';
import MetamaskIcon from '../../../icons/metamask.png';
import { SettingsComponent } from './SettingsComponents';
import { CTAHyperlink } from '../reusables/CtaHyperlink';
import { IWidgetTheme } from '../theme';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { device } from '../../../config';
import * as PushAPI from '@pushprotocol/restapi';
import { notifStrictUserSettingFromat, notifUserSettingFormatString } from '../helpers';
import { ChannelDetailsComponent } from './ChannelDetailsComponent';
import { ConnectButtonComp } from '../ConnectButton';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme: IWidgetTheme;
}

interface IManageNotificationComponentProps {
  autoconnect?: boolean;
  channelAddress: string;
  channelInfo: any;
  userSettings: any;
  handleNext: () => void;
}
export const ManageNotficationsComponent: React.FC<
  IManageNotificationComponentProps
> = (options: IManageNotificationComponentProps) => {
  const {
    userSettings,
    channelAddress,
    channelInfo,
    handleNext,
    autoconnect = false,
  } = options || {};
  const [modifiedSettings, setModifiedSettings] = useState<
    PushAPI.NotificationSettingType[] | null
  >([...userSettings]);
  const {
    unsubscribeError,
    unsubscribeLoading,
    setUnsubscribeError,
    unsubscribeToChannel,
    subscribeToChannel,
    subscribeError,
    subscribeLoading,
    setSubscribeError,
  } = useManageSubscriptionsUtilities();
  const theme = useContext(ThemeContext);
  const isMobile = useMediaQuery(device.tablet);
  const unsubscribeToast = useToast();
  const { signer, setAccount, setSigner, user, account } = useWidgetData();

  const showError = (title: string, subTitle: string) => {
    unsubscribeToast.showMessageToast({
      toastTitle: title,
      toastMessage: subTitle,
      toastType: 'ERROR',
      getToastIcon: (size) => <MdError size={size} color="red" />,
    });
  };

  const showSuccess = (title: string, subTitle: string) => {
    unsubscribeToast.showMessageToast({
      toastTitle: title,
      toastMessage: subTitle,
      toastType: 'SUCCESS',
      getToastIcon: (size) => <MdCheckCircle size={size} color="green" />,
    });
  };
  const handleUnsubscribe = async () => {
    try {
      const response = await unsubscribeToChannel({
        channelAddress: channelAddress,
      });
      if (response && response?.status === 204) {
        //show toast
        showSuccess(
          'Notification Disabled',
          `You have successfully disabled notifications from ${channelInfo?.name}`
        );
        handleNext();
      }
    } catch (e) {
      console.debug(e);
      setUnsubscribeError(WidgetErrorCodes.NOTIFICATION_WIDGET_SUBSCRIBE_ERROR);
    }
    if (unsubscribeError) {
      showError(
        'Error while Enabling Notifications',
        'We encountered an error while disabling notifications. Please try again.'
      );
    }
  };


  const getFlexDirection = () => {
    if (userSettings && userSettings.length) {
      if (isMobile) return 'column';
    } else return 'column-reverse';
    return 'row';
  };
  const handleSubscribe = async () => {
    try {
      const response = await subscribeToChannel({
        channelAddress: channelAddress,
        channelSettings: notifUserSettingFormatString({
          settings: modifiedSettings!,
        }),
      });
      if (response && response?.status === 204) {
        //show toast
        showSuccess(
          'Notification Preferences Updated',
          'Your notification settings were updated successfully.'
        );
      }
    } catch (e) {
      console.debug(e);
      setSubscribeError(WidgetErrorCodes.NOTIFICATION_WIDGET_SUBSCRIBE_ERROR);
    }
    if (subscribeError) {
      showError(
        'Preferences were not updated',
        'We encountered an error while updating your notification settings. Please try again.'
      );
    }
  };
  return (
    <Section flexDirection="column" margin="14px 10px 0px 10px">
      <Section
        flexDirection="column"
        alignItems="start"
        gap="5px"
        margin="0 0 10px 0"
      >
        <Span
          fontSize="21px"
          fontWeight="700"
          color={theme?.textColor?.modalHeaderText}
        >
          Manage Notifications
        </Span>
        <Span
          fontSize="12px"
          textAlign="left"
          fontWeight="400"
          width="90%"
          color={theme?.textColor?.modalSubTitleText}
        >
          Update your notification preferences below
        </Span>
      </Section>
      <Section
        gap="25px"
        margin="15px 0 0 0"
        flexDirection={getFlexDirection()}
      >
        <Section
          flexDirection="column"
          width="100%"
          justifyContent="start"
          gap="20px"
          flex="1"
        >
          <ChannelDetailsComponent channelInfo={channelInfo} />
          {!!userSettings && !!userSettings.length && (
            <>
              {' '}
              <SettingsComponent
                settings={userSettings}
                setSettings={setModifiedSettings}
              />
              {(user?.readmode()) && (
                <ConnectButtonComp
                  autoconnect={autoconnect}
                  setAccount={setAccount}
                  setSigner={setSigner}
                  signer={signer}
                />
              )}
              {!(user?.readmode()) && (
                <Button height="auto" width="100%" onClick={handleSubscribe}>
                  Update Preferences
                </Button>
              )}
            </>
          )}
          <UnsubscribeSpan
            color={theme.textColor?.modalSubTitleText}
            fontSize="12px"
            fontWeight="400"
          >
            <Anchor onClick={handleUnsubscribe} textDecoration="underline">
              {' '}
              {unsubscribeLoading ? (
                <Spinner color="#fff" size="20" />
              ) : (
                'Unsubscribe'
              )}{' '}
            </Anchor>
            to stop receiving notifications
          </UnsubscribeSpan>
        </Section>
        <GettingStarted divider={getFlexDirection()} />
      </Section>
      <PoweredByPush />
    </Section>
  );
};

const GettingStarted = ({ divider }: { divider: string }) => {
  const theme = useContext(ThemeContext);

  return (
    <RightSection
      gap="20px"
      width="100%"
      flex="1"
      justifyContent="start"
      alignItems="start"
      flexDirection="column"
      theme={theme}
      divider={divider}
    >
      <Section flexDirection="column" gap="5px" alignItems="start">
        <Span
          color={theme?.textColor?.modalTitleText}
          fontSize="14px"
          fontWeight="500"
          textAlign="left"
        >
          Getting Started
        </Span>
        <Span
          textAlign="left"
          width="80%"
          color={theme.textColor?.modalSubTitleText}
          fontSize="12px"
          fontWeight="400"
        >
          Subscribe, Install Push Snap to receive your favorite notifications.
        </Span>
      </Section>
      <CTAHyperlink
        title="Get Notifications in MetaMask"
        link="https://app.push.org/"
        linkText="Install Push Snap"
        icon={MetamaskIcon}
      />
      <CTAHyperlink
        title="Explore more ways to get notified"
        link="https://app.push.org/"
        linkText="Explore Options"
        icon={PushLogo}
      />
    </RightSection>
  );
};

//style
const RightSection = styled(Section)<IThemeProps & { divider: string }>`
  ${({ divider, theme }) =>
    divider == 'column'
      ? `
  border-top: ${theme.border?.divider};
  padding:25px 0 0 0;


`
      : divider == 'column-reverse'
      ? `
border-bottom: ${theme.border?.divider};
padding:0 0 25px 0;

`
      : `border-left: ${theme.border?.divider};
      padding:0  0  0 20px;
`}
`;

const UnsubscribeSpan = styled(Span)`
  display: flex;
  gap: 5px;
  align-items: center;
`;
