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
import { FileMessageContent, FrameButton, FrameDetails, IFrame } from '../../../../../types';
import { extractWebLink, getFormattedMetadata, hasWebLink } from '../../../../../utilities';
import { Anchor, Image, Section, Span } from '../../../../reusables';
import { Button, TextInput } from '../../../reusables';
import useToast from '../../../reusables/NewToast';
import { ThemeContext } from '../../../theme/ThemeProvider';

// Internal Configs

// Assets
import { BsLightning } from 'react-icons/bs';
import { FaBell, FaLink, FaRegThumbsUp } from 'react-icons/fa';
import { MdError, MdOpenInNew } from 'react-icons/md';

// Interfaces & Types

// Constants

// Exported Interfaces & Types

// Exported Functions
export const FrameRenderer = ({
  url,
  account,
  messageId,
  frameData,
  position,
  background,
}: {
  url: string;
  account: string;
  messageId: string;
  frameData: IFrame;
  position: number;
  background: string;
}) => {
  const { env, user, pgpPrivateKey } = useChatData();

  const [{ wallet }] = useConnectWallet();
  const [{ connectedChain }, setChain] = useSetChain();

  const frameRenderer = useToast();
  const proxyServer = 'https://proxy.push.org';
  const [FrameData, setFrameData] = useState<IFrame>(frameData as IFrame);
  const [inputText, setInputText] = useState<string>('');
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);

  // get theme
  const theme = useContext(ThemeContext);

  const getButtonIconContent = (button: FrameButton) => {
    switch (button.action) {
      case 'link':
        return (
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              width: '90%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <FaLink /> {button.content}
          </span>
        );

      case 'post_redirect':
        return (
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              width: '90%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <MdOpenInNew /> {button.content}
          </span>
        );
      case 'tx':
        return (
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              width: '90%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <BsLightning /> {button.content}
          </span>
        );

      case button?.action?.includes('subscribe') && 'subscribe':
        return (
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              width: '90%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <FaBell /> {button.content}
          </span>
        );
      default:
        return (
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              width: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {button.content}
          </span>
        );
    }
  };

  const handleChainChange = async (desiredChainId: string) => {
    if (Number(connectedChain?.id) !== Number(desiredChainId.slice(7))) {
      if (allowedNetworks[env].some((chain) => chain === Number(desiredChainId.slice(7)))) {
        await setChain({
          chainId: ethers.utils.hexValue(Number(desiredChainId.slice(7))),
        });
        return { status: 'success', message: 'Chain switched' };
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
  const subscribeToChannel = async (button: FrameButton) => {
    if (!user) return { status: 'failure', message: 'User not initialized' };
    const { status, message } = await handleChainChange(button.action!);
    if (status === 'failure') return { status: 'failure', message };
    try {
      const response = await user.notification.subscribe(`${button.action}:${button.target}`);

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
    if (status === 'failure') return { status: 'failure', message };
    if (!wallet) return { status: 'failure', message: 'Wallet not connected' };
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
  const onButtonClick = async (button: FrameButton) => {
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
    <Section>
      {FrameData.isValidFrame && (
        <Section
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          background={background}
        >
          <a
            href={url}
            target="blank"
          >
            {!imageLoadingError && (
              <img
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
              <div
                style={{
                  width: '100%',
                  height: '300px', // Set the height to match the image height
                  backgroundColor: '#f0f0f0', // Background color for the div
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#333', // Text color for the message
                }}
              >
                Image cannot be loaded
              </div>
            )}
          </a>
          {FrameData.frameDetails?.inputText && (
            <div style={{ width: '95%', margin: 'auto', color: 'black' }}>
              <TextInput
                onInputChange={(e: any) => {
                  setInputText(e.target.value);
                }}
                inputValue={inputText as string}
                placeholder={FrameData.frameDetails?.inputText}
              />
            </div>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '95%',
              margin: 'auto',
            }}
          >
            {FrameData.frameDetails &&
              FrameData.frameDetails.buttons.map((button) => (
                <div
                  style={{
                    width: '100%',
                  }}
                >
                  <Button
                    width="98%"
                    customStyle={{
                      maxHeight: '12px',
                      padding: '12px 6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onButtonClick(button);
                    }}
                  >
                    {getButtonIconContent(button)}
                  </Button>
                </div>
              ))}
          </div>
          <div
            style={{
              display: 'flex',
              width: '96%',
              justifyContent: 'flex-end',

              marginTop: '10px',
              marginBottom: '10px',
            }}
          >
            <PreviewAnchor
              href={url}
              target="_blank"
              rel="noreferrer"
              color={theme.textColor?.chatFrameURLText}
            >
              {new URL(url).hostname}
            </PreviewAnchor>
          </div>
        </Section>
      )}
    </Section>
  );
};

const PreviewAnchor = styled(Anchor)`
  text-decoration: none;
`;
