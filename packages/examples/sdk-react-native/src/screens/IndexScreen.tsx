import {ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {CustomButton} from '../components';

type IndexScreenProps = NativeStackScreenProps<RootStackParamList, 'Index'>;

export const Index = ({navigation}: IndexScreenProps) => {
  const navigateToLowLvlFnsScreen = () => {
    navigation.navigate('LowLevelFns');
  };
  const navigateToNotificationScreen = () => {
    navigation.navigate('Notification');
  };

  return (
    <ScrollView style={styles.container} overScrollMode="never">
      <CustomButton
        onPress={navigateToLowLvlFnsScreen}
        title="Low level functions"
      />
      <CustomButton
        onPress={navigateToNotificationScreen}
        title="Notification"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 10,
    fontSize: 32,
    margin: 10,
  },
});
