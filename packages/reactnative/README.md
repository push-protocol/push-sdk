# reactnative

Package for React Native Views for React Native based mobile apps.

## How to use in your Mobile app?

### Installation
```
  yarn add @pushprotocol/reactnative
```
  or
```
  npm install @pushprotocol/reactnative  
```

### **Please read this carefullly**

We need to install peer dependencies for `@pushprotocol/reactnative` in your mobile app. And have it set up as below to make it run.

```
yarn add @react-native-masked-view/masked-view react-native-svg react-native-video react-native-youtube
```
Then for different types of react native apps use the below instructions.
### FOR EXPO APPS
```
expo install expo-file-system
expo install expo-linear-gradient
```

### Running IOS
```
cd ios && pod install
```
```
yarn ios
```

#### [ViewPropTypes Error](https://github.com/facebook/react-native/issues/33734#issuecomment-1190506381) - 
If only you get below error
```
Invariant Violation: ViewPropTypes has been removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'
```

#### ViewPropTypes Error Fix
1. In `node_modules/react-native/index.js`
Replace the below code
```
// Deprecated Prop Types
get ColorPropType(): $FlowFixMe {
  invariant(
    false,
    "ColorPropType has been removed from React Native. Migrate to " +
      "ColorPropType exported from 'deprecated-react-native-prop-types'.",
 );
},
get EdgeInsetsPropType(): $FlowFixMe {
  invariant(
    false,
    "EdgeInsetsPropType has been removed from React Native. Migrate to " +
      "EdgeInsetsPropType exported from 'deprecated-react-native-prop-types'.",
  );
},
get PointPropType(): $FlowFixMe {
  invariant(
    false,
    "PointPropType has been removed from React Native. Migrate to " +
     "PointPropType exported from 'deprecated-react-native-prop-types'.",
 );
},
get ViewPropTypes(): $FlowFixMe {
 invariant(
   false,
   "ViewPropTypes has been removed from React Native. Migrate to " +
     "ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
 );
},
```
with below snippet
```
// Deprecated Prop Types
get ColorPropType(): $FlowFixMe {
  return require("deprecated-react-native-prop-types").ColorPropType
},
get EdgeInsetsPropType(): $FlowFixMe {
  return require("deprecated-react-native-prop-types").EdgeInsetsPropType
},
get PointPropType(): $FlowFixMe {
  return require("deprecated-react-native-prop-types").PointPropType
},
get ViewPropTypes(): $FlowFixMe {
  return require("deprecated-react-native-prop-types").ViewPropTypes
},
```

2. `yarn add -D patch-package`
3. `yarn patch-package react-native`
4. `cd ios && pod install`
5. `yarn ios`

#### [Image.propTypes.resizeMode error](https://github.com/react-native-video/react-native-video/issues/2714)
```
ERROR TypeError: undefined is not an object (evaluating '_reactNative.Image.propTypes.resizeMode')
```
then use this 
#### [Image.propTypes fix](https://github.com/react-native-video/react-native-video/pull/2795/files)

After that,
```
yarn patch-package react-native-video
cd ios && pod install
yarn ios
```

### Running Android
If you get this Error
```
Could not find com.yqritc:android-scalablevideoview:1.0.4.
		 Required by:
		         project :react-native-video

```
add this in `android/build.gradle`
```
jcenter() {
  content {
		includeModule("com.yqritc", "android-scalablevideoview")
	}
}
```

Run `yarn android`


### FOR REACT NATIVE CLI GENERATED APPS

```
npx install-expo-modules
expo install expo-file-system
expo install expo-linear-gradient
```
```
cd iOS && pod install
yarn iOS
```

Similarly, 
if you get this [ViewPropTypes error](#viewproptypes-errorhttpsgithubcomfacebookreact-nativeissues33734issuecomment-1190506381) then use this [fix](#viewproptypes-error-fix)

and [ImagePropTypes error](#imageproptypesresizemode-errorhttpsgithubcomreact-native-videoreact-native-videoissues2714) then use this [fix](https://github.com/react-native-video/react-native-video/pull/2795/files)

## Notification Item View

Import in your file
```typescript
import { Notification } from "@pushprotocol/reactnative";
```

Inside JSX,

After you get the Notification data from the API

```
const [notifData, setNotifData] = React.useState([]);

// fetch data, parse and set it in state
import * as PushAPI from '@pushprotocol/restapi';


const notifications = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
  env: 'dev',
  limit: parseInt(pageSize, 10)
});
setNotifData(notifications);
```


```
   <View style={styles.list}>
        {notifData.map((oneNotification: any, idx: number) => {
        const {cta, title, message, app, icon, image, blockchain, appbot } = oneNotification;
            return (
            <Notification
                key={idx}
                notificationTitle={title}
                notificationBody={message}
                cta={cta}
                app={app}
                icon={icon}
                image={image}
                chainName={blockchain}
                appbot={appbot}
                youTubeAPIKey={config.YOUTUBE_API_KEY} // pass your YOUTUBE_API_KEY here
            />
            );
        })}
    </View>
```

where

| Prop    | Type    | Remarks                                    |
|----------|--------|--------------------------------------------|
| notificationTitle    | string  | Title of the notification (given during notification creation)    |
| notificationBody     | number  | Message body of the notification (given during notification creation) |
| icon | string  | Channel Icon (IPFS url) (given during channel setup)     |
| app  | string  | Channel Name (given during channel setup)    |
| cta      | string | Call To Action Link (given during notification creation)  |
| image      | string | Any media link (given during notification creation) |
| appbot      | string | is the notification is from EPNS bot the value is "1" else "0" |
| chainName      | string | Can be anyone of the following blockchain networks on which the notification was sent - "ETH_MAINNET", "ETH_TEST_GOERLI", "POLYGON_MAINNET", "POLYGON_TEST_MUMBAI", "THE_GRAPH" |
| youTubeAPIKey      | string | Your generated Youtube API key |