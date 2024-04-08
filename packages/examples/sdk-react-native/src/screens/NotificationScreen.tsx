import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  NotificationItem,
  NotificationItemProps,
} from '@pushprotocol/uireactnative';

export const NotificationScreen = () => {
  const notificationItems: NotificationItemProps[] = [
    {
      notificationTitle: 'Notification with styled content',
      notificationBody:
        "[Hello World](https://github1.com) ***Bold&Italic*** \n **Bold** \n *Italic* \n <span color='green'>green text</span> \n [PUSH website](https://push.org) \n [timestamp: 1699347011]",
      app: 'Push',
      icon: 'https://picsum.photos/200',
      image: undefined,
      url: 'https://push.org/',
      theme: 'light',
      chainName: 'POLYGON_TEST_MUMBAI',
      cta: 'https://github.com/ethereum-push-notification-service/',
    },
    {
      notificationTitle: 'Notification with image',
      notificationBody:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      app: 'Push',
      icon: 'https://picsum.photos/200',
      image: 'https://picsum.photos/200',
      url: undefined,
      theme: 'dark',
      chainName: 'ETH_TEST_SEPOLIA',
      cta: undefined,
    },
    {
      notificationTitle: 'Notification with video',
      notificationBody:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      app: 'Push',
      icon: 'https://picsum.photos/200',
      image:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      url: undefined,
      theme: 'dark',
      chainName: 'BSC_TESTNET',
      cta: undefined,
    },
    {
      notificationTitle: 'Notification with youtube video',
      notificationBody:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      app: 'Push',
      icon: 'https://picsum.photos/200',
      image: 'https://www.youtube.com/watch?v=R8nsAhyrvTI',
      url: undefined,
      theme: 'light',
      chainName: 'ARBITRUM_TESTNET',
      cta: undefined,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      overScrollMode="never"
      removeClippedSubviews={true}>
      <FlatList
        scrollEnabled={false}
        data={notificationItems}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.nfItemContainer}>
            <NotificationItem
              notificationTitle={item.notificationTitle}
              notificationBody={item.notificationBody}
              cta={item.cta}
              app={item.app}
              icon={item.icon}
              image={item.image}
              url={item.url}
              theme={item.theme}
              chainName={item.chainName}
            />
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nfItemContainer: {
    margin: 10,
  },
});
