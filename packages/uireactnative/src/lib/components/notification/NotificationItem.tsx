import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MediaHelper, TimeHelper } from '../../helpers';
import { useDecrypt } from '../../hooks';
import { GLOBALS } from '../../constants';
import { StylishLabel } from '../labels';
import { ImageLoader, VideoLoader } from '../loaders';
import DecryptButton from './DecryptButton';
import { LinearGradient } from 'expo-linear-gradient';
import { getCustomTheme, type INotificationItemTheme } from './theme';
import { Link } from '../../assets';

function extractTimeStamp(notificationBody: string): {
  notificationBody: string;
  timeStamp: string;
  originalBody: string;
} {
  const parsedBody = {
    notificationBody: notificationBody,
    timeStamp: '',
    originalBody: notificationBody,
  };
  const matches = notificationBody.match(/\[timestamp:(.*?)\]/);
  if (matches && matches[1]) {
    parsedBody.timeStamp = matches[1];
    const textWithoutTimeStamp = notificationBody.replace(
      / *\[timestamp:[^)]*\] */g,
      ''
    );
    parsedBody.notificationBody = textWithoutTimeStamp;
    parsedBody.originalBody = textWithoutTimeStamp;
  }
  return parsedBody;
}

type chainNameType =
  | 'ETH_TEST_SEPOLIA'
  | 'POLYGON_TEST_AMOY'
  | 'ETH_MAINNET'
  | 'POLYGON_MAINNET'
  | 'BSC_MAINNET'
  | 'BSC_TESTNET'
  | 'OPTIMISM_MAINNET'
  | 'OPTIMISM_TESTNET'
  | 'POLYGON_ZK_EVM_TESTNET'
  | 'POLYGON_ZK_EVM_MAINNET'
  | 'ARBITRUMONE_MAINNET'
  | 'ARBITRUM_TESTNET'
  | 'THE_GRAPH'
  | undefined;

export type NotificationItemProps = {
  notificationTitle: string | undefined;
  notificationBody: string | undefined;
  cta: string | undefined;
  app: string | undefined;
  icon: string | undefined;
  image: string | undefined;
  url: string | undefined;
  isSpam?: boolean;
  subscribeFn?: () => Promise<unknown>;
  isSubscribedFn?: () => Promise<unknown>;
  theme?: 'light' | 'dark';
  customTheme?: INotificationItemTheme;
  chainName: chainNameType;
  isSecret?: boolean;
  decryptFn?: () => Promise<{
    title: string;
    body: string;
    cta: string;
    image: string;
  }>;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notificationTitle,
  notificationBody,
  cta,
  app,
  icon,
  image,
  url,
  isSpam,
  isSubscribedFn,
  subscribeFn,
  theme = 'light',
  customTheme,
  chainName,
  isSecret,
  decryptFn,
}) => {
  const { notificationBody: parsedBody, timeStamp } = extractTimeStamp(
    notificationBody || ''
  );
  const {
    notifTitle,
    notifBody,
    notifCta,
    notifImage,
    setDecryptedValues,
    isSecretRevealed,
  } = useDecrypt({ notificationTitle, parsedBody, cta, image }, isSecret);

  const isCtaURLValid = MediaHelper.validURL(notifCta);
  const isChannelURLValid = MediaHelper.validURL(url);

  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);

  const showMetaInfo = isSecret || timeStamp;

  const styles = useMemo(
    () => StyleSheetFactory.getSheet(getCustomTheme(theme, customTheme)),
    [theme, customTheme]
  );

  const gotToCTA = () => {
    if (!isCtaURLValid || !notifCta) return;
    Linking.canOpenURL(notifCta).then((supported) => {
      if (supported) {
        Linking.openURL(notifCta!);
      }
    });
  };

  const goToURL = () => {
    if (!isChannelURLValid || !url) return;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url!);
      }
    });
  };

  const onSubscribe = async () => {
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
        if (decryptedPayload) {
          setDecryptedValues(decryptedPayload);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (!isSpam || !isSubscribedFn) return;

    isSubscribedFn().then((res: unknown) => {
      setIsSubscribed(Boolean(res));
    });
  }, [isSubscribedFn, isSpam]);

  if (isSubscribed && isSpam) return null;

  return (
    <View style={styles.cover}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.appLink}
          onPress={goToURL}
          disabled={!isChannelURLValid}
        >
          <View style={styles.row}>
            <Image style={styles.appicon} source={{ uri: icon }} />
            <Text style={styles.apptext} numberOfLines={1}>
              {app}
            </Text>
          </View>

          {chainName && (
            <>
              {GLOBALS.CHAINS[chainName].icon({
                width: 20,
                height: 20,
                viewBox: '0 0 25 25',
              })}
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View>
          {!notifImage ? null : MediaHelper.isMediaSupportedVideo(
              notifImage
            ) ? (
            <View style={styles.contentVid}>
              <VideoLoader videoUri={notifImage} />
            </View>
          ) : (
            <View style={styles.contentImg}>
              <ImageLoader imageUri={notifImage} />
            </View>
          )}

          <TouchableOpacity
            style={styles.contentBody}
            disabled={!isCtaURLValid}
            onPress={gotToCTA}
          >
            {!notifTitle ? null : (
              <View style={styles.titleContainer}>
                <Text style={styles.notificationTitle}>{notifTitle}</Text>
                {isCtaURLValid && (
                  <Link width={25} height={25} style={styles.linkIcon} />
                )}
              </View>
            )}

            <StylishLabel
              style={[styles.msg]}
              fontSize={14}
              title={notifBody}
              textStyle={styles.notificationContent}
            />

            <View style={styles.buttonGrpContainer}>
              <View style={styles.buttonGrp}>
                {isSpam && (
                  <TouchableOpacity
                    onPress={onSubscribe}
                    style={styles.subscribeBtn}
                  >
                    {subscribeLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={GLOBALS.COLORS.WHITE}
                      />
                    ) : (
                      <Text style={styles.subscribeBtnTxt}>opt-in</Text>
                    )}
                  </TouchableOpacity>
                )}

                {isSecret ? (
                  <DecryptButton
                    decryptFn={onDecrypt}
                    isSecretRevealed={isSecretRevealed}
                  />
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
          {showMetaInfo && (
            <View style={styles.metaInfoContainer}>
              {isSecret && (
                <View style={styles.appsecret}>
                  <LinearGradient
                    colors={[
                      GLOBALS.COLORS.GRADIENT_PRIMARY,
                      GLOBALS.COLORS.GRADIENT_SECONDARY,
                    ]}
                    style={[styles.cover]}
                    start={[0.1, 0.3]}
                    end={[1, 1]}
                  />
                </View>
              )}
              {timeStamp && (
                <View style={styles.timestampOuter}>
                  <Text style={styles.timestamp}>
                    {TimeHelper.convertTimeStamp(timeStamp)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

NotificationItem.defaultProps = {
  notificationTitle: '',
  notificationBody: '',
  cta: undefined,
  app: '',
  image: undefined,
  url: '',
  isSpam: false,
  theme: 'light',
};

class StyleSheetFactory {
  static getSheet(customTheme: INotificationItemTheme) {
    return StyleSheet.create({
      cover: {
        justifyContent: 'center',
        flex: 1,
        borderWidth: 1,
        borderRadius: customTheme.borderRadius?.modal,
        borderColor: customTheme.color?.modalBorder,
        margin: 1,
        overflow: 'hidden',
      },
      header: {
        width: '100%',
        paddingVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: customTheme.color?.accentBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
      },

      appLink: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      appicon: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        height: 24,
        aspectRatio: 1,
        marginRight: 5,
        overflow: 'hidden',
        backgroundColor: GLOBALS.COLORS.SLIGHT_GRAY,
      },
      apptext: {
        marginRight: 10,
        marginLeft: 5,
        color: customTheme.color?.channelNameText,
        fontWeight: customTheme.fontWeight?.channelNameText,
        fontSize: customTheme.fontSize?.channelNameText,
        fontFamily: customTheme.fontFamily,
      },
      appsecret: {
        width: 16,
        height: 16,
        borderRadius: 16,
      },
      content: {
        backgroundColor: customTheme.color?.contentBackground,
      },
      contentLoader: {
        margin: 20,
      },
      contentVid: {
        width: '100%',
      },
      msgVid: {
        borderColor: GLOBALS.COLORS.SLIGHT_GRAY,
        backgroundColor: GLOBALS.COLORS.SLIGHTER_GRAY,
        borderBottomWidth: 1,
      },
      contentImg: {
        width: '100%',
        aspectRatio: 2,
      },
      contentBody: {
        paddingHorizontal: 15,
      },
      titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
      },
      notificationTitle: {
        flex: 1,
        fontSize: customTheme.fontSize?.notificationTitleText,
        fontWeight: customTheme.fontWeight?.notificationTitleText,
        fontFamily: customTheme.fontFamily,
        color: customTheme.color?.notificationTitleText,
        paddingVertical: 10,
      },
      divider: {
        ...customTheme.modalDivider,
      },
      notificationContent: {
        fontSize: customTheme.fontSize?.notificationContentText,
        fontWeight: customTheme.fontWeight?.notificationContentText,
        fontFamily: customTheme.fontFamily,
        color: customTheme.color?.notificationContentText,
      },
      msg: {
        paddingTop: 5,
        paddingBottom: 20,
      },
      timestampOuter: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        borderColor: GLOBALS.COLORS.SLIGHT_GRAY,
      },
      timestamp: {
        fontSize: customTheme.fontSize?.timestamp,
        fontWeight: customTheme.fontWeight?.timestamp,
        fontFamily: customTheme.fontFamily,
        color: customTheme.color?.timestamp,
      },
      buttonGrpContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      },
      buttonGrp: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
      },
      subscribeBtn: {
        backgroundColor: customTheme.color?.optInButtonBackground,
        padding: 10,
        marginVertical: 10,
        borderRadius: customTheme.borderRadius?.optInButton,
      },
      subscribeBtnTxt: {
        color: customTheme.color?.optInButtonText,
        fontSize: customTheme.fontSize?.optInButtonText,
        fontWeight: customTheme.fontWeight?.optInButtonText,
        fontFamily: customTheme.fontFamily,
      },
      metaInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 5,
        gap: 5,
        backgroundColor: customTheme.color?.accentBackground,
        paddingRight: 12,
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      linkIcon: {
        marginLeft: 5,
      },
    });
  }
}
