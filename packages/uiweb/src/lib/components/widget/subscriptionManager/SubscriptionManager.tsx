import React, { useContext, useEffect, useState } from 'react';
import {
  ISubscriptionManagerProps,
  WidgetErrorCodes,
  WidgetErrorMessages,
} from './types';
import {
  Modal,
} from '../reusables';
import { Section, Span, Image, Spinner } from '../../reusables';
import styled from 'styled-components';
import CloseIcon from '../../../icons/close.svg';
import { ToastContainer } from 'react-toastify';
import { SubscribeComponent } from './SubscribeComponent';
import { InstallSnapComponent } from './InstallSnapComponent';
import { useManageChannelUtilities, useWidgetData } from '../../../hooks';
import { getCAIPAddress } from '../helpers';
import { ThemeContext } from '../theme/ThemeProvider';
import { IWidgetTheme } from '../theme';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
    theme:IWidgetTheme
}
export const SUBSCRIPTION_MANAGER_STEP_KEYS = {
  SUBSCRIBE: 1,
  INSTALL_SNAP: 2,
} as const;

export type SubscriptionManagerStepKeys =
  typeof SUBSCRIPTION_MANAGER_STEP_KEYS[keyof typeof SUBSCRIPTION_MANAGER_STEP_KEYS];

export const SubscriptionManager: React.FC<ISubscriptionManagerProps> = (
  options: ISubscriptionManagerProps
) => {
  const { env } = useWidgetData();
  const theme = useContext(ThemeContext);

  const { channelAddress, modalBackground, modalPositionType, onClose,autoconnect = false } =
    options || {};
  //format channel address
  const formattedChannelAddress = getCAIPAddress(env, channelAddress);
  const [channelInfo, setChannelInfo] = useState();
  const [activeComponent, setActiveComponent] =
    useState<SubscriptionManagerStepKeys>(
      SUBSCRIPTION_MANAGER_STEP_KEYS.SUBSCRIBE
    );

  const { fetchChannelInfo, channelInfoError, channelInfoLoading } =
    useManageChannelUtilities();

  const handleNext = () => {
    setActiveComponent((activeComponent + 1) as SubscriptionManagerStepKeys);
  };

  console.log(formattedChannelAddress)

  useEffect(() => {
    (async () => {
      try {
        const info = await fetchChannelInfo({
          channelAddress: formattedChannelAddress,
        });
        console.log(info);
        if (info) {
          setChannelInfo(info);
        }
      } catch (e) {
        console.debug(e);
      }
    })();
  }, [channelAddress]);
  console.log(channelInfoError);

  const renderComponent = () => {
    switch (activeComponent) {
      case SUBSCRIPTION_MANAGER_STEP_KEYS.SUBSCRIBE:
        return (
          <SubscribeComponent
            handleNext={handleNext}
            autoconnect={autoconnect}
            channelAddress={formattedChannelAddress}

            channelInfo={channelInfo}
          />
        );
      case SUBSCRIPTION_MANAGER_STEP_KEYS.INSTALL_SNAP:
        return (
          <InstallSnapComponent handleNext={handleNext}  />
        );
      default:
        return (
          <SubscribeComponent
            handleNext={handleNext}
            channelAddress={formattedChannelAddress}
            channelInfo={channelInfo}
          />
        );
    }
  };
  return (
    <Modal
      clickawayClose={onClose}
      modalBackground={modalBackground}
      modalPositionType={modalPositionType}
    >
      <Container
        theme={theme}
        flexDirection="column"
        alignItems="center"
        gap="10px"
        minHeight="178px"
        width="374px"
        overflow="hidden auto"
        justifyContent="center"
        background={theme.backgroundColor?.modalBackground}
        borderRadius={theme.borderRadius?.modal}
        padding="12px"
      >
        <Section position="absolute" top="10px" right="10px">
          <Image
            src={CloseIcon}
            height="20px"
            maxHeight="20px"
            width={'auto'}
            onClick={onClose}
            cursor="pointer"
          />
        </Section>
        {channelInfoError ? (
          <Span margin="20px" color={theme.textColor?.modalTitleText}>
            {
              WidgetErrorMessages[
                channelInfoError as keyof typeof WidgetErrorMessages
              ].title
            }
          </Span>
        ) : channelInfoLoading ? (
          <Span margin="20px">
            <Spinner color={theme?.spinnerColor} size="35" />
          </Span>
        ) : channelInfo ? (
          renderComponent()
        ) : null}
      </Container>

      <ToastContainer />
    </Modal>
  );
};

//styles
const Container = styled(Section)<IThemeProps>`
  border: ${(props) => props.theme.border?.modal};
`;
