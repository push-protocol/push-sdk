import {PushAPI, CONSTANTS} from '@pushprotocol/react-native-sdk';
import {FlatList, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {NotificationItem} from '@pushprotocol/uireactnative';

export const HighLevelFnsScreen = () => {
  const [notifications, setNotifications] = useState<any>();

  useEffect(() => {
    (async () => {
      const signer = new ethers.Wallet(
        '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
      );
      const account = `eip155:${signer.address}`;

      const alice = await PushAPI.initialize(signer, {
        account,
        env: CONSTANTS.ENV.DEV,
      });

      const spam = await alice.notification.list('SPAM', {
        limit: 10,
        page: 1,
      });
      setNotifications(spam);
    })();
  }, []);

  return (
    <View>
      <FlatList
        data={notifications}
        renderItem={({item}) => (
          <NotificationItem
            notificationTitle={item.title}
            notificationBody={item.message}
            cta={item.cta}
            app={item.app}
            icon={item.icon}
            image={item.image}
            url={item.url}
            theme={item.theme}
            chainName={item.chainName}
            customTheme={{
              fontSize: {
                notificationTitleText: 16,
              },
            }}
          />
        )}
        keyExtractor={item => item.sid}
      />
    </View>
  );
};
