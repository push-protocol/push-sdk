// React + Web3 Essentials
import { useContext, useState } from 'react';

// External Packages
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { ethers } from 'ethers';
import styled from 'styled-components';

// Internal Compoonents
import { FILE_ICON, allowedNetworks } from '../../../../../config';
import {
  formatFileSize,
  getPfp,
  pCAIP10ToWallet,
  shortenText,
  sign,
  toSerialisedHexString,
} from '../../../../../helpers';
import { useChatData } from '../../../../../hooks';
import { extractWebLink, getFormattedMetadata, hasWebLink } from '../../../../../utilities';
import { Anchor, Button, Image, Section, Span } from '../../../../reusables';
import { TextInput } from '../../../reusables';
import useToast from '../../../reusables/NewToast';
import { ThemeContext } from '../../../theme/ThemeProvider';

// Internal Configs

// Assets
import { BsLightning } from 'react-icons/bs';
import { FaBell, FaLink, FaRegThumbsUp } from 'react-icons/fa';
import { MdError, MdOpenInNew } from 'react-icons/md';

// Interfaces & Types
import { IFrame, IFrameButton } from '../../../../../types';
import { IChatTheme } from '../../../exportedTypes';
import { getAddress, toHex } from 'viem';

interface FrameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  theme: IChatTheme;
}

// Constants

// Exported Interfaces & Types

// Exported Functions
export const FrameRenderer = ({
  url,
  account,
  messageId,
  frameData,
  proxyServer,
}: {
  url: string;
  account: string;
  messageId: string;
  frameData: IFrame;
  proxyServer: string;
}) => {
  const { env, user, pgpPrivateKey } = useChatData();

  const [{ wallet }] = useConnectWallet();
  const [{ connectedChain }, setChain] = useSetChain();

  const frameRenderer = useToast();
  const [FrameData, setFrameData] = useState<IFrame>(frameData as IFrame);
  const [inputText, setInputText] = useState<string>('');
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);

  // get theme
  const theme = useContext(ThemeContext);

  const getButtonIconContent = (button: IFrameButton) => {
    switch (button.action) {
      case 'link':
        return (
          <FrameSpan>
            <FaLink /> {button.content}
          </FrameSpan>
        );

      case 'post_redirect':
        return (
          <FrameSpan>
            <MdOpenInNew /> {button.content}
          </FrameSpan>
        );
      case 'tx':
        return (
          <FrameSpan>
            <BsLightning /> {button.content}
          </FrameSpan>
        );

      case button?.action?.includes('subscribe') && 'subscribe':
        return (
          <FrameSpan>
            <FaBell /> {button.content}
          </FrameSpan>
        );
      default:
        return <FrameSpan style={{}}>{button.content}</FrameSpan>;
    }
  };

  const handleChainChange = async (desiredChainId: string) => {
    const desiredChainIdNumber = Number(desiredChainId.split(':')[1]);

    if (connectedChain?.id !== toHex(desiredChainIdNumber)) {
      if (allowedNetworks[env].some((chain) => chain === desiredChainIdNumber)) {
        await setChain({
          chainId: toHex(desiredChainIdNumber),
        });
      } else {
        frameRenderer.showMessageToast({
          toastTitle: 'Error',
          toastMessage: 'Chain not supported',
          toastType: 'ERROR',
          getToastIcon: (size: any) => (
            <MdError
              size={size}
              color="red"
            />
          ),
        });
        return { status: 'failure', message: 'Chain not supported' };
      }
    }
    return { status: 'success', message: 'Chain switch not required' };
  };

  // Function to subscribe to a channel
  const subscribeToChannel = async (button: IFrameButton) => {
    if (!user) {
      console.log('User not initialized');
      return { status: 'failure', message: 'User not initialized' };
    }
    const { status, message } = await handleChainChange(button.action!);
    if (status === 'failure') {
      console.log('Chain switch failed');
      return { status: 'failure', message };
    }
    try {
      const addressChecksummed = getAddress(button.target!);
      const chainId = button.action?.split(':')[1];
      const response = await user.notification.subscribe(`eip155:${chainId}:${addressChecksummed}`);
      if (response.status === 204) {
        frameRenderer.showMessageToast({
          toastTitle: 'Success',
          toastMessage: 'Subscribed Successfully',
          toastType: 'SUCCESS',
          getToastIcon: (size: any) => (
            <FaRegThumbsUp
              size={size}
              color="green"
            />
          ),
        });
        return { status: 'success', message: 'Subscribed' };
      } else {
        frameRenderer.showMessageToast({
          toastTitle: 'Error',
          toastMessage: JSON.stringify(response.message) ?? 'Subscription failed',
          toastType: 'ERROR',
          getToastIcon: (size: any) => (
            <MdError
              size={size}
              color="red"
            />
          ),
        });
        return {
          status: 'failure',
          message: JSON.stringify(response.message) ?? 'Subscription failed',
        };
      }
    } catch (error) {
      frameRenderer.showMessageToast({
        toastTitle: 'Error',
        toastMessage: 'Something went wrong',
        toastType: 'ERROR',
        getToastIcon: (size: any) => (
          <MdError
            size={size}
            color="red"
          />
        ),
      });
      return { status: 'failure', message: 'Something went wrong' };
    }
  };

  // Function to trigger a transaction
  const TriggerTx = async (data: any) => {
    if (!data || !data.params || !data.chainId) return { status: 'failure', message: 'Invalid data' };
    const { status, message } = await handleChainChange(data.chainId);
    if (status === 'failure') {
      console.log('Chain switch failed');
      return { status: 'failure', message };
    }
    if (!wallet) {
      console.log('wallet not connected');
      return { status: 'failure', message: 'Wallet not connected' };
    }
    let hash = undefined;
    try {
      const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');

      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        from: account,
        to: data.params.to,
        value: data.params.value,
        data: data.params.data,
        chainId: Number(data.chainId.slice(7)),
      });
      hash = tx.hash;
      return { hash, status: 'success', message: 'Transaction sent' };
    } catch (error: any) {
      frameRenderer.showMessageToast({
        toastTitle: 'Error',
        toastMessage: error?.data?.message ?? error?.message ?? 'Failed',
        toastType: 'ERROR',
        getToastIcon: (size: any) => (
          <MdError
            size={size}
            color="red"
          />
        ),
      });
      return {
        hash: 'Failed',
        status: 'failure',
        message: error?.data?.message ?? error?.message ?? 'Failed',
      };
    }
  };

  // Function to handle button click on a frame button
  const onButtonClick = async (button: IFrameButton) => {
    if (!FrameData.isValidFrame) return;

    if (button.action === 'mint') {
      frameRenderer.showMessageToast({
        toastTitle: 'Error',
        toastMessage: 'Mint Action is not supported',
        toastType: 'ERROR',
        getToastIcon: (size: any) => (
          <MdError
            size={size}
            color="red"
          />
        ),
      });
      return;
    }
    let hash;

    const serializedProtoMessage = await toSerialisedHexString({
      url: url,
      unixTimestamp: Date.now().toString(),
      buttonIndex: Number(button.index),
      inputText: FrameData.frameDetails?.inputText ? inputText : 'undefined',
      state: FrameData.frameDetails?.state ?? '',
      transactionId: hash ?? '',
      address: account,
      messageId: messageId,
      chatId: window.location.href.split('/').pop() ?? 'null',
      clientProtocol: 'push',
      env: env,
    });
    const signedMessage = await sign({
      message: serializedProtoMessage,
      signingKey: user?.decryptedPgpPvtKey ?? pgpPrivateKey!,
    });

    // If the button action is post_redirect or link, opens the link in a new tab
    if (button.action === 'post_redirect' || button.action === 'link') {
      window.open(button.target!, '_blank');
      return;
    }

    // If the button action is subscribe, subscribes to the channel and then makes a POST call to the Frame server
    if (button.action?.includes('subscribe')) {
      const response = await subscribeToChannel(button);
      if (response.status === 'failure') {
        return;
      }
    }

    // If the button action is tx, triggers a transaction and then makes a POST call to the Frame server
    if (button.action === 'tx' && button.target) {
      const response = await fetch(`${proxyServer}/${button.target}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: window.location.origin,
        },
        body: JSON.stringify({
          clientProtocol: 'push',
          untrustedData: {
            url: url,
            unixTimestamp: Date.now().toString(),
            buttonIndex: Number(button.index),
            inputText: FrameData.frameDetails?.inputText ? inputText : 'undefined',
            state: FrameData.frameDetails?.state ?? '',
            transactionId: hash ?? '',
            address: account,
            messageId: messageId,
            chatId: window.location.href.split('/').pop() ?? 'null',
            clientProtocol: 'push',
            env: env,
          },
          trustedData: {
            messageBytes: serializedProtoMessage,
            pgpSignature: signedMessage,
          },
        }),
      });

      if (!response.ok) return;

      const data = await response.json();
      const { hash: txid, status } = await TriggerTx(data);
      hash = txid;

      if (!txid || status === 'failure') return;
    }

    // Makes a POST call to the Frame server after the action has been performed

    let post_url = button.post_url ?? FrameData.frameDetails?.postURL ?? url;

    if (button.action === 'post') {
      post_url = button.target ?? button.post_url ?? FrameData.frameDetails?.postURL ?? url;
    }
    if (!post_url) return;
    const response = await fetch(`${proxyServer}/${post_url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: window.location.origin,
      },
      body: JSON.stringify({
        clientProtocol: 'push',
        untrustedData: {
          url: url,
          unixTimestamp: Date.now().toString(),
          buttonIndex: Number(button.index),
          inputText: FrameData.frameDetails?.inputText ? inputText : 'undefined',
          state: FrameData.frameDetails?.state ?? '',
          transactionId: hash ?? '',
          address: account,
          messageId: messageId,
          chatId: window.location.href.split('/').pop() ?? 'null',
          clientProtocol: 'push',
          env: env,
        },
        trustedData: {
          messageBytes: serializedProtoMessage,
          pgpSignature: signedMessage,
        },
      }),
    });

    const data = await response.text();

    const frameDetails: IFrame = getFormattedMetadata(url, data);
    setInputText('');

    setFrameData(frameDetails);
  };

  return (
    <Section
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      minWidth="inherit"
      maxWidth="inherit"
      background={theme.backgroundColor?.chatFrameBackground}
    >
      {FrameData.isValidFrame && (
        <>
          <Section padding="0px 0px 8px 0px">
            <Anchor
              href={url}
              target="blank"
            >
              {!imageLoadingError && (
                <Image
                  src={FrameData.frameDetails?.image ?? FrameData.frameDetails?.ogImage ?? ''}
                  alt="Frame Fallback"
                  style={{
                    width: '100%',
                  }}
                  onError={() => {
                    setImageLoadingError(true);
                  }}
                />
              )}
              {imageLoadingError && (
                <Section
                  width="100%"
                  padding="16px"
                  background={theme.backgroundColor?.chatFrameBackground}
                  color={theme.textColor?.chatReceivedBubbleText}
                >
                  Image cannot be loaded
                </Section>
              )}
            </Anchor>
          </Section>

          {/* Render input field */}
          {FrameData.frameDetails?.inputText && (
            <Section padding="8px 12px">
              <FrameInput
                theme={theme}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                value={inputText}
                placeholder={FrameData.frameDetails?.inputText}
              />
            </Section>
          )}

          {/* Render buttons */}
          {FrameData.frameDetails && FrameData.frameDetails.buttons.length > 0 && (
            <FrameButtonSection
              padding="8px 12px"
              gap="8px"
              justifyContent="space-between"
            >
              {FrameData.frameDetails.buttons.map((button) => (
                <FrameButton
                  theme={theme}
                  onClick={(e) => {
                    e.preventDefault();
                    onButtonClick(button);
                  }}
                >
                  {getButtonIconContent(button)}
                </FrameButton>
              ))}
            </FrameButtonSection>
          )}

          {/* Render Preview */}
          <Section
            padding="8px 12px"
            justifyContent="flex-end"
          >
            <PreviewAnchor
              href={url}
              target="_blank"
              rel="noreferrer"
              color={theme.textColor?.chatFrameURLText}
            >
              {new URL(url).hostname}
            </PreviewAnchor>
          </Section>
        </>
      )}
    </Section>
  );
};

const FrameButtonSection = styled(Section)`
  flex-wrap: wrap;
`;

const FrameButton = styled(Button)`
  flex: 1;
  flex-wrap: wrap;
  padding: 12px 8px;
  background: ${(props) =>
    props.theme.backgroundColor.buttonHotBackground ? props.theme.backgroundColor.buttonHotBackground : 'initial'};
  color: ${(props) => (props.theme.textColor.buttonText ? props.theme.textColor.buttonText : 'initial')};
  border-radius: ${(props) =>
    props.theme?.borderRadius.modalInnerComponents ? props.theme?.borderRadius.modalInnerComponents : '0'};
  border: ${(props) => (props.theme.border.modal ? props.theme.border.modal : 'initial')};
  min-width: 120px;
  cursor: pointer;
`;

const FrameSpan = styled(Span)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const FrameInput = styled.input<FrameInputProps>`
  width: 100%;
  padding: 16px;
  margin-top: 8px;
  color: ${(props) => props.theme.textColor?.chatReceivedBubbleText ?? 'inherit'};
  background: ${(props) => props.theme.backgroundColor?.inputBackground ?? 'inherit'};
  border: 1px solid transparent;
  border-radius: ${(props) => props.theme.borderRadius?.chatViewComponent ?? 'inherit'};

  font-family: ${(props) => props.theme.fontFamily};
  font-size: 16px;

  font-weight: 500;
  [readonly='readonly'] {
    pointer-events: none;
  }

  &:focus,
  &:focus-visible {
    outline: none;
    background-image: ${(props) => props.theme.backgroundColor?.inputHoverBackground ?? 'initial'};
    background-clip: padding-box, border-box;
    border: 1px solid transparent !important;
  }
`;

const PreviewAnchor = styled(Anchor)`
  text-decoration: none;
  align-self: flex-end;
`;
