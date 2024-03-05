import React, { useContext, useMemo, useState } from 'react';
import { Button, PoweredByPush } from '../reusables';
import { Section, Span, Spinner } from '../../reusables';
import styled from 'styled-components';
import CloseIcon from '../../../icons/close.svg';
import { useManageSubscriptionsUtilities, useWidgetData } from '../../../hooks';
import useToast from '../reusables/NewToast';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { ThemeContext } from '../theme/ThemeProvider';
import { ConnectButtonComp } from '../ConnectButton';
import { WidgetErrorCodes } from './types';
import { SettingsComponent } from './SettingsComponents';
import { notifUserSettingFormatString, notifUserSettingFromChannelSetting } from '../helpers';
import { NotificationSettingType } from '@pushprotocol/restapi';
import { ChannelDetailsComponent } from './ChannelDetailsComponent';

// /**
//  * @interface IThemeProps
//  * this interface is used for defining the props for styled components
//  */
// interface IThemeProps {
// }

const SubHeadingText = {
  withSettings:
    'Select which setting list you would like to receive notifications from.',
  withoutSettings:
    'Subscribe and receive notifications from your favorite protocol.',
};
interface ISubscribeComponentProps {
  autoconnect?: boolean;
  channelInfo: any;
  channelAddress: string;
  handleNext: () => void;
}
export const SubscribeComponent: React.FC<ISubscribeComponentProps> = (
  options: ISubscribeComponentProps
) => {
  const {
    channelInfo,
    handleNext,
    channelAddress,
    autoconnect = false,
  } = options || {};
  const { subscribeToChannel, subscribeError, subscribeLoading,setSubscribeError } =
    useManageSubscriptionsUtilities();
  const theme = useContext(ThemeContext);
  const { signer, setAccount, setSigner,user,account } = useWidgetData();
  const subscribeToast = useToast();
  const [modifiedSettings, setModifiedSettings] = useState<NotificationSettingType[]|null>(useMemo(() => {
    if (channelInfo && channelInfo?.channel_settings) {
      return notifUserSettingFromChannelSetting({settings:( JSON.parse(channelInfo?.channel_settings))});
    }
    return null;
  }, [channelInfo]));

 

  const handleSubscribe = async () => {
 
    try {
      const response = await subscribeToChannel({
        channelAddress: channelAddress,
        channelSettings:notifUserSettingFormatString({
            settings: modifiedSettings!,
          }),
      });
      if (response && response?.status === 204) {
        //show toast
        handleNext();
        subscribeToast.showMessageToast({
          toastTitle: 'Notifications Enabled',
          toastMessage: `You have successfully enabled notifications from ${channelInfo?.name}`,
          toastType: 'SUCCESS',
          getToastIcon: (size) => <MdCheckCircle size={size} color="green" />,
        });
    
      }
    } catch (e) {
      console.debug(e);
      setSubscribeError(
        WidgetErrorCodes.NOTIFICATION_WIDGET_SUBSCRIBE_ERROR
      );
    }
    if (subscribeError) {
      subscribeToast.showMessageToast({
        toastTitle: 'Error while Enabling Notifications',
        toastMessage:
          'We encountered an error while enabling notifications. Please try again.',
        toastType: 'ERROR',
        getToastIcon: (size) => <MdError size={size} color="red" />,
      });
    }
  };
  return (
    <Section flexDirection="column" gap="10px" margin="14px 10px 0px 10px">
        <Section
          flexDirection="column"
          alignItems="start"
          gap="5px"
          margin="0 0 10px 0"
        >
          <Span fontSize="21px" fontWeight="700" color={theme?.textColor?.modalHeaderText}>
            Subscribe to get Notified
          </Span>
          <Span
            fontSize="12px"
            textAlign="left"
            fontWeight="400"
            width="90%"
            color={theme?.textColor?.modalSubTitleText}
          >
            {SubHeadingText.withoutSettings}
          </Span>
        </Section>
        <ChannelDetailsComponent channelInfo={channelInfo}/>
     {channelInfo && channelInfo?.channel_settings && <Section margin=' 0' width='100%' >
      <SettingsComponent settings={modifiedSettings!} setSettings={setModifiedSettings}/>
      </Section>}
      
   {(user && !!user?.readmode)?
   <>
     {user?.readmode() && (
        <ConnectButtonComp
          autoconnect={autoconnect}
          setAccount={setAccount}
          setSigner={setSigner}
          signer={signer}
        />)}
         
       {!user?.readmode() &&  
      <Button onClick={handleSubscribe}>
        {subscribeLoading ? <Spinner color="#fff" size="24" /> : 'Subscribe'}
      </Button>}
      </>
     :null
    }
 
      <PoweredByPush />
    </Section>
  );
};
