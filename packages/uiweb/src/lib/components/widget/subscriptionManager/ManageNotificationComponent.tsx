import React, { useContext, useState } from 'react';
import { Button, PoweredByPush } from '../reusables';
import { Anchor, Section, Span, Spinner } from '../../reusables';
import styled from 'styled-components';
import { useManageSubscriptionsUtilities, useWidgetData } from '../../../hooks';
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

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme: IWidgetTheme;
}

interface IManageNotificationComponentProps {
  autoconnect?: boolean;
  channelInfo: any;
  channelAddress: string;
}
export const ManageNotficationsComponent: React.FC<
  IManageNotificationComponentProps
> = (options: IManageNotificationComponentProps) => {
  const { channelInfo, channelAddress, autoconnect = false } = options || {};
  const { unsubscribeError, unsubscribeLoading, unsubscribeToChannel } =
    useManageSubscriptionsUtilities();
  const theme = useContext(ThemeContext);
  const isMobile = useMediaQuery(device.tablet);

  return (
    <Section flexDirection="column" gap="20px" margin="12px 12px 0px 12px">
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
      <Section gap="20px" flexDirection={isMobile ? 'column' : 'row'}>
        <RightSection
          theme={theme}
          isMobile={isMobile}
          flexDirection="column"
          width="100%"
          gap="30px"
          flex="1"
       
        >
          <SettingsComponent />

          {/* {!(signer) && (
        <ConnectButtonComp
          autoconnect={autoconnect}
          setAccount={setAccount}
          setSigner={setSigner}
          signer={signer}
        />
      )}  */}
          {/* {signer &&  */}
          <Button height="auto" width="100%" >
            Update Preferences
          </Button>
          <Span
            color={theme.textColor?.modalSubTitleText}
            fontSize="12px"
            fontWeight="400"
          >
            <Anchor textDecoration="underline">Unsubscribe </Anchor>to stop
            receiving notifications
          </Span>
        </RightSection>
        <GettingStarted />
      </Section>
      <PoweredByPush />
    </Section>
  );
};

const GettingStarted = () => {
  const theme = useContext(ThemeContext);

  return (
    <Section
      gap="20px"
      width="100%"
      flex="1"
      justifyContent="start"
      alignItems="start"
      flexDirection="column"
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
          width="75%"
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
    </Section>
  );
};

//style
const RightSection = styled(Section)<IThemeProps & { isMobile: boolean }>`
  ${({ isMobile, theme }) =>
    isMobile
      ? `
  border-bottom: ${theme.border?.divider};
  padding:0 0 20px 0;

`
      : `border-right: ${theme.border?.divider};
      padding:0  20px 0 0;
`}
`;
