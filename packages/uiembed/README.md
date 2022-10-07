# uiembed
This package helps to embed Push notifications in a sidebar to any dApp

## How to use in your app?

### Installation
```
  yarn add @pushprotocol/uiembed
```
  or
```
  npm install @pushprotocol/uiembed  
```

Import in your file
```typescript
import { EmbedSDK } from "@pushprotocol/uiembed";
```

add in HTML/JSX the below HTML tag -
```html
<button id="sdk-trigger-id">trigger button</button>
```

or any component with the ID ***sdk-trigger-id*** 

***Make sure the ID you give to the "button" is same as that of the targetID you pass to the init() below*** 

After the wallet connect happens in your app flow trigger the below code snippet.

**Note:** You have to have the wallet connected with an account to execute the below code because internally the SDK calls the PUSH `get_feeds()` API which needs the account address. You will see notifications if you have opted-in to a channel using [PUSH](https://staging.push.org/)

```typescript
  useEffect(() => {
    if (account) { // 'your connected wallet address'
      EmbedSDK.init({
        headerText: 'Hello DeFi', // optional
        targetID: 'sdk-trigger-id', // mandatory
        appName: 'consumerApp', // mandatory
        user: account, // mandatory
        chainId: 1, // mandatory
        viewOptions: {
            type: 'sidebar', // optional [default: 'sidebar', 'modal']
            showUnreadIndicator: true, // optional
            unreadIndicatorColor: '#cc1919',
            unreadIndicatorPosition: 'bottom-right',
        },
        theme: 'light',
        onOpen: () => {
          console.log('-> client dApp onOpen callback');
        },
        onClose: () => {
          console.log('-> client dApp onClose callback');
        }
      });
    }

    return () => {
      EmbedSDK.cleanup();
    };
  }, []);
```
**Init Config Options**

| option | type | mandatory | remarks |
| --- | --- | --- | --- |
| `targetID` | `string` | yes | can be any string but has to match the ID given to the trigger button in the HTML/JSX |
| `chainId` | `number` | yes | the chain ID of the blockchain network. by default is 1  |
| `appName` | `string` | yes | your app name e.g. - 'appName'  |
| `user` | `string` | yes | public wallet address e.g. - '0x1434A7882cDD877B458Df5b83c993e9571c65813' |
| `viewOptions.type` | `string` | no | default 'sidebar', can give 'modal'  |
| `viewOptions.showUnreadIndicator` | `boolean` | no | will show the unread indicator  |
| `viewOptions.unreadIndicatorColor` | `string` | no | color for the unread indicator e.g. - '#cc1919'  |
| `viewOptions.unreadIndicatorPosition` | `string` | no | default is 'top-right', other possible options - 'top-left', 'bottom-left', 'bottom-right'  |
| `headerText` | `string` | no | any header text  |
| `theme` | `string` | no | default is 'light', can give 'dark'  |
| `onOpen` | `function` | no | callback you want to trigger when the modal/sidebar opens  |
| `onClose` | `function` | no | callback you want to trigger when the modal/sidebar closes  |


## Building

Run `nx build uiembed` to build the library.

## Running unit tests

Run `nx test uiembed` to execute the unit tests via [Jest](https://jestjs.io).
