import React from 'react';
import WebViewCrypto from 'react-native-webview-crypto';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Index, LowLevelFnsScreen, NotificationScreen} from './screens';

export type RootStackParamList = {
  Index: undefined;
  LowLevelFns: undefined;
  Notification: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <WebViewCrypto />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Index">
          <Stack.Screen
            name="Index"
            component={Index}
            options={{title: 'Push Example Application'}}
          />
          <Stack.Screen
            name="LowLevelFns"
            component={LowLevelFnsScreen}
            options={{title: 'Low Level Functions'}}
          />
          <Stack.Screen
            name="Notification"
            component={NotificationScreen}
            options={{title: 'Notification'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
