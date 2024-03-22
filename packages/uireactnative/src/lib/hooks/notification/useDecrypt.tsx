import { useState } from 'react';

export type DecryptNotifAttibutesType = {
  notifTitle: string;
  notifBody: string;
  notifCta: string;
  notifImage: string;
  isSecretRevealed: boolean;
};

export const useDecrypt = (
  initialValues: {
    notificationTitle?: string;
    parsedBody?: string;
    cta?: string;
    image?: string;
  },
  isSecret?: boolean
) => {
  const [notifAttributes, setNotifAttributes] =
    useState<DecryptNotifAttibutesType>({
      notifTitle: initialValues.notificationTitle || '',
      notifBody: initialValues.parsedBody || '',
      notifCta: initialValues.cta || '',
      notifImage: initialValues.image || '',
      isSecretRevealed: false, // avoids extra render
    });

  const hideSecretAttributes = isSecret
    ? notifAttributes?.isSecretRevealed
      ? false
      : true
    : false;

  const setDecryptedValues = ({
    title,
    body,
    cta,
    image,
  }: {
    title?: string;
    body: string;
    cta?: string;
    image?: string;
  }) => {
    setNotifAttributes({
      notifTitle: title || '',
      notifBody: body || '',
      notifCta: cta || '',
      notifImage: image || '',
      isSecretRevealed: true,
    });
  };

  return {
    notifTitle: notifAttributes.notifTitle,
    notifBody: notifAttributes.notifBody,
    notifCta: hideSecretAttributes ? '' : notifAttributes.notifCta,
    notifImage: hideSecretAttributes ? '' : notifAttributes.notifImage,
    isSecretRevealed: notifAttributes.isSecretRevealed,
    setDecryptedValues,
  };
};
