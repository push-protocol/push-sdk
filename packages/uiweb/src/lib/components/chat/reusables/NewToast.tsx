/* eslint-disable @typescript-eslint/no-inferrable-types */
// React + Web3 Essentials
import { useContext, useRef } from 'react';

// External Packages
import { toast } from 'react-toastify';
import { MdOutlineClose } from 'react-icons/md';
import styled, { ThemeProvider } from 'styled-components';

import { Spinner } from '../../supportChat/spinner/Spinner';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { ThemeContext } from '../theme/ThemeProvider';
import { useChatData } from '../../../hooks/chat/useChatData';

import { device } from '../../../config';

// Types
type LoaderToastType = { msg: string; loaderColor: string; textColor: string };

const LoaderToast = ({ msg, loaderColor, textColor }: LoaderToastType) => (
  <LoaderNotification>
    <Spinner
      color={loaderColor}
      size="35px"
    />
    <LoaderMessage
      style={{
        color: textColor,
      }}
    >
      {msg}
    </LoaderMessage>
  </LoaderNotification>
);

const CloseButton = ({ closeToast }: { closeToast: any }) => (
  <Button onClick={closeToast}>
    <MdOutlineClose
      color="#657795"
      size="100%"
    />
  </Button>
);
export type ShowLoaderToastType = ({ loaderMessage }: { loaderMessage: string }) => void;
export type ShowMessageToastType = ({
  toastTitle,
  toastMessage,
  toastType,
  getToastIcon,
}: {
  toastTitle: string;
  toastMessage: string;
  toastType: 'SUCCESS' | 'ERROR' | 'WARNING';
  getToastIcon?: (size: number) => JSX.Element;
}) => void;

const useToast = (
  autoClose: number = 3000,
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right'
) => {
  const { uiConfig } = useChatData();

  const toastId = useRef<any>(null);
  const theme = useContext(ThemeContext);
  const isMobile = useMediaQuery(device.tablet);

  const showLoaderToast: ShowLoaderToastType = ({ loaderMessage }) => {
    if (toastId.current) {
      // Update existing toast
      toast.update(toastId.current, {
        render: (
          <ThemeProvider theme={theme}>
            <LoaderToast
              msg={loaderMessage}
              loaderColor={theme.spinnerColor!}
              textColor={theme.textColor!.modalHeadingText!}
            />
          </ThemeProvider>
        ),
        position,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: false,
        style: {
          background: theme.backgroundColor?.modalBackground,
          border: theme.border?.modalInnerComponents,
          // boxShadow: `8px 8px 8px ${theme.backgroundColor?.toastShadowBackground}`,
          borderRadius: '20px',
        },
      });
    } else {
      if (!uiConfig.suppressToast) {
        // Create new toast
        toastId.current = toast(
          <ThemeProvider theme={theme}>
            <LoaderToast
              msg={loaderMessage}
              loaderColor={theme.spinnerColor!}
              textColor={theme.textColor!.modalHeadingText!}
            />
          </ThemeProvider>,
          {
            position,
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            closeButton: false,
            style: {
              background: theme.backgroundColor?.modalBackground,
              border: theme.border?.modalInnerComponents,
              // boxShadow: `8px 8px 8px ${theme.backgroundColor?.toastShadowBackground}`,
              borderRadius: '20px',
            },
          }
        );
      } else {
        console.debug('UIWeb::reusables::NewToast::useToast::showLoaderToast::Toast suppressed');
      }
    }
  };

  const showMessageToast: ShowMessageToastType = ({ toastTitle, toastMessage, toastType, getToastIcon }) => {
    const toastUI = (
      <Toast>
        <ToastIcon>{getToastIcon ? getToastIcon(30) : ''}</ToastIcon>
        <ToastContent>
          <ToastTitle
            style={{
              color: theme.textColor?.modalHeadingText,
            }}
          >
            {toastTitle}
          </ToastTitle>
          <ToastMessage
            style={{
              color: theme.textColor?.modalSubHeadingText,
            }}
          >
            {toastMessage}
          </ToastMessage>
        </ToastContent>
      </Toast>
    );

    const toastRenderParams = {
      position,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: toast.TYPE.DEFAULT,
      closeButton: CloseButton,
      autoClose: autoClose,
      style: {
        background:
          toastType === 'SUCCESS'
            ? theme.backgroundColor?.toastSuccessBackground
            : toastType === 'ERROR'
            ? theme.backgroundColor?.toastErrorBackground
            : theme.backgroundColor?.toastWarningBackground,
        // boxShadow: `10px 10px 10px ${theme.backgroundColor?.toastShadowBackground}`,
        borderRadius: '20px',
        margin: isMobile ? '20px' : '0px',
      },
    };

    if (!toast.isActive(toastId.current)) {
      if (!uiConfig.suppressToast) {
        if (toastId.current) {
          // Update existing toast
          toast.update(toastId.current, {
            render: toastUI,
            ...toastRenderParams,
          });
        } else {
          // Create new toast
          toastId.current = toast(toastUI, {
            ...toastRenderParams,
          });
        }
      } else {
        console.debug('UIWeb::reusables::NewToast::useToast::showMessageToast::Toast suppressed');
      }
    }
  };

  return {
    showLoaderToast,
    showMessageToast,
  };
};

const LoaderNotification = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1% 3%;
`;
const LoaderMessage = styled.div`
  margin-left: 3%;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3rem;
  letter-spacing: 0em;
  text-align: left;
`;

const Toast = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 1.5% 1%;
`;
const ToastIcon = styled.div`
  width: 15%;
  margin-right: 4%;
`;
const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const ToastTitle = styled.div`
  font-weight: 500;
  font-size: 1.125rem;
  letter-spacing: -0.019em;
  line-height: 1.4rem;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 1%;
`;
const ToastMessage = styled.div`
  font-weight: 400;
  font-size: 0.9375rem;
  line-height: 1.3rem;
  text-align: left;
`;

const Button = styled.button`
  cursor: pointer;
  background: none;
  margin: 0;
  padding: 0;
  width: 1.3rem;
  height: 1.3rem;
  border: none;
`;

export default useToast;
