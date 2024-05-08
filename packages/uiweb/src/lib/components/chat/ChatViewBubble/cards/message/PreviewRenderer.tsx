// React + Web3 Essentials
import { useEffect, useState } from 'react';

// External Packages

// Internal Compoonents
import { IFrame } from '../../../../../types';
import { extractWebLink, getFormattedMetadata, hasWebLink, isSupportedVideoLink } from '../../../../../utilities';

import { FrameRenderer } from './FrameRenderer';
import { VideoRenderer } from './VideoRenderer';

// Internal Configs

// Assets

// Interfaces & Types

// Constants
const PROXY_SERVER = 'https://proxy.push.org';

// Exported Interfaces & Types
export interface IPreviewCallback {
  loading: boolean;
  urlType: 'video' | 'frame' | 'other';
  error: unknown | null;
}

// Exported Functions
export const PreviewRenderer = ({
  message,
  account,
  messageId,
  position,
  background,
  previewCallback,
}: {
  message: string | undefined;
  account: string;
  messageId: string;
  position: number;
  background: string;
  previewCallback?: (callback: IPreviewCallback) => void;
}) => {
  // setup frame data
  const [initialized, setInitialized] = useState({
    loading: true,
    frameData: {} as IFrame,
    url: null as string | null,
    urlType: 'other' as 'video' | 'frame' | 'other',
    error: null as unknown | null,
  });

  // Start by fetching meta tags for the URL
  useEffect(() => {
    const fetchMetaTags = async (url: string) => {
      try {
        const response = await fetch(`${PROXY_SERVER}/${url}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Origin: window.location.origin,
          },
        });

        const htmlText = await response.text();

        // Load frame details
        const frameDetails: IFrame = getFormattedMetadata(url, htmlText);

        // Check validity
        if (!frameDetails.isValidFrame) {
          throw new Error('Invalid frame');
        }

        // Determine if it's a video
        const supportedVideo = isSupportedVideoLink(url);

        // define initialized and callback
        setInitialized((prevState) => ({
          error: null,
          loading: false,
          frameData: frameDetails,
          url: url,
          urlType: supportedVideo ? 'video' : 'frame',
        }));
      } catch (err) {
        setInitialized((prevState) => ({
          ...prevState,
          loading: false,
          error: err, // Set the error object here
          urlType: 'other',
        }));
      }
    };

    if (message && hasWebLink(message)) {
      const url = extractWebLink(message);
      fetchMetaTags(url ?? '');
    } else {
      // Initiate the callback
      setInitialized((prevState) => ({
        ...prevState,
        loading: false,
        error: null,
        urlType: 'other',
      }));
    }
  }, [message]);

  // handle callback on initialization changes
  useEffect(() => {
    // callback
    if (!initialized.loading && previewCallback) {
      previewCallback({
        loading: initialized.loading,
        error: initialized.error,
        urlType: initialized.urlType,
      });
    }
  }, [initialized]);

  // Render
  return !initialized.loading && !initialized.error && initialized.url && initialized.urlType === 'frame' ? (
    <FrameRenderer
      url={initialized.url}
      account={account}
      messageId={messageId}
      frameData={initialized.frameData}
      position={position}
      background={background}
    />
  ) : !initialized.loading && !initialized.error && initialized.url && initialized.urlType === 'video' ? (
    <VideoRenderer
      url={initialized.url}
      account={account}
      messageId={messageId}
      frameData={initialized.frameData}
      position={position}
      background={background}
    />
  ) : null;
};
