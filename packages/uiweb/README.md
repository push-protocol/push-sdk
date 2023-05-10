# uiweb

Package for React based UI web components to be used by DAPPs.

## How to use in your app?

### Installation
```
  yarn add @pushprotocol/uiweb
```
  or
```
  npm install @pushprotocol/uiweb  
```
<br />

***Note:***  `styled-components` is a `peerDependency`. Please install it in your dApp if you don't have it already!
```
  yarn add styled-components
```
  or
```
  npm install styled-components  
```

<br />

### Notification Item component

Import the sdk package in the component file where you want to render notification(s)
```typescript
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
```

After you get the Notification data from the [API](../restapi/README.md#fetching-user-notifications) or otherwise

```typescript
const notifications = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
  env: 'staging'
});
```

render the Notification UI as follows
```typescript
<div>
{notifications.map((oneNotification, i) => {
    const { 
        cta,
        title,
        message,
        app,
        icon,
        image,
        url,
        blockchain,
        notification
    } = oneNotification;

    return (
        <NotificationItem
            key={id} // any unique id
            notificationTitle={title}
            notificationBody={message}
            cta={cta}
            app={app}
            icon={icon}
            image={image}
            url={url}
            theme={theme}
            chainName={blockchain}
            // chainName={blockchain as chainNameType} // if using Typescript
        />
        );
    })}
</div>
```
For Spam data [API](../restapi/README.md#fetching-user-spam-notifications)

```typescript
const spams = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
  spam: true,
  env: 'staging'
});
```

render the Spam UI as follows
```typescript
 {spams.map((oneNotification, i) => {
    const { 
      cta,
      title,
      message,
      app,
      icon,
      image,
      url,
      blockchain,
      secret,
      notification
    } = oneNotification;

    return (
      <NotificationItem
        key={`spam-${i}`}
        notificationTitle={title}
        notificationBody={message}
        cta={cta}
        app={app}
        icon={icon}
        image={image}
        url={url}
        theme={theme}
        chainName={blockchain}
        // optional parameters for rendering spams
        isSpam
        subscribeFn={subscribeFn} // see below
        isSubscribedFn={isSubscribedFn} // see below
      />
    );
  })}
```

```typescript
const subscribeFn = async () => {
  // opt in to the spam notification item channel
}
```
we can use this `@pushprotocol/restapi` method to do that - [subscribe](../restapi/README.md#opt-in-to-a-channel)


```typescript
const isSubscribedFn = async () => {
  // return boolean which says whether the channel for the 
  // spam notification item is subscribed or not by the user.
}
```
we can use this `@pushprotocol/restapi` method to find out that - [getSubscriptions](../restapi/README.md#fetching-user-subscriptions)

where

| Prop    | Type    | Remarks                                    |
|----------|--------|--------------------------------------------|
| notificationTitle    | string  | Title of the notification (given during notification creation)    |
| notificationBody     | number  | Message body of the notification (given during notification creation) |
| icon | string  | Channel Icon (IPFS url) (given during channel setup)     |
| app  | string  | Channel Name (given during channel setup)    |
| cta      | string | Call To Action Link (given during notification creation)  |
| image      | string | Any media link (given during notification creation) |
| url      | string | Channel Link (given during channel setup)   |
| chainName      | string | Can be anyone of the following blockchain networks on which the notification was sent - "ETH_MAINNET", "ETH_TEST_GOERLI", "POLYGON_MAINNET", "POLYGON_TEST_MUMBAI", "BSC_MAINNET, "BSC_TESTNET", "OPTIMISM_MAINNET", "OPTIMISM_TESTNET", "POLYGON_ZK_EVM_TESTNET", "POLYGON_ZK_EVM_MAINNET", "THE_GRAPH" |
| theme      | string | 'light' or 'dark' (customization to be given by the dApp)  |
| isSpam      | boolean | whether a spam notification or not   |
| subscribeFn  | Promise | Function to subscribe to the channel  |
| isSubscribedFn  | Promise | Function that returns the subscription status of a channel   |



<br/>


### Support Chat Item component

Import the SDK package in the component file where you want to render the support chat component.
```typescript
import { Chat } from "@pushprotocol/uiweb";
import { ITheme } from '@pushprotocol/uiweb';
```

Render the Chat Component as follows
```typescript
<Chat
   account="0x6430C47973FA053fc8F055e7935EC6C2271D5174" //user address
   signer={librarySigner}
   supportAddress="0xd9c1CCAcD4B8a745e191b62BA3fcaD87229CB26d" //support address
   env="staging"
 />
```
<br/>

Allowed Options (props with * are mandatory)

| Prop    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address(sender)                |
| supportAddress*    | string  | -       | support user's address(receiver)                |
| greetingMsg    | string  | 'Hi there!'       | first message in chat scree               |
| theme    | ITheme  | &lt;lightTheme&gt;   | theme for chat modal (only lightTheme available now)  |
| modalTitle    | string  | 'Chat with us!'       | Modal header title               |
| apiKey    | string  | ''       | api key       |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


<br/>
<br/>

Example code for using custom theme
```typescript
import React from 'react';
import { Chat, ITheme } from '@pushprotocol/uiweb';


export const ChatSupportTest = () => {
  const theme: ITheme = {
    bgColorPrimary: 'gray',
    bgColorSecondary: 'purple',
    textColorPrimary: 'white',
    textColorSecondary: 'green',
    btnColorPrimary: 'red',
    btnColorSecondary: 'purple',
    border: '1px solid black',
    borderRadius: '40px',
    moduleColor: 'pink',
  };

  return (
    <Chat
      account='0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7'
      supportAddress="0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7"
      apiKey="tAWEnggQ9Z.UaDBNjrvlJZx3giBTIQDcT8bKQo1O1518uF1Tea7rPwfzXv2ouV5rX9ViwgJUrXm"
      env='staging'
      theme={theme}
    />
  );
};
```

#### List of all theme variables
![image](https://user-images.githubusercontent.com/42746736/219010647-32013301-a260-4426-8034-16ecd88bad32.png)

