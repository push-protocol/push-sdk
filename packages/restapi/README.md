# restapi
This package gives access to Push Protocol (Push Nodes) APIs. Visit [Developer Docs](https://docs.push.org/developers) or [Push.org](https://push.org) to learn more.

# Index
- [How to use in your app?](#how-to-use-in-your-app)
  - [Installation](#installation)
  - [About blockchain agnostic address format](#about-blockchain-agnostic-address-format)
  - [About generating the signer object for different platforms](#about-generating-the-signer-object-for-different-platforms)
- [SDK Features](#sdk-features)
  - [Notification](#for-notification)
    -  [Fetching user notifications](#fetching-user-notifications)
    -  [Fetching user spam notifications](#fetching-user-spam-notifications)
    -  [Fetching user subscriptions](#fetching-user-subscriptions)
    -  [Fetching channel details](#fetching-channel-details)
    -  [Searching for channel(s)](#searching-for-channels)
    -  [Opt in to a channel](#opt-in-to-a-channel)
    -  [Opt out to a channel](#opt-out-to-a-channel)
    -  [Sending notification](#sending-notification)
        -  [Direct payload for single recipient(target)](#direct-payload-for-single-recipienttarget)
        -  [Direct payload for group of recipients(subset)](#direct-payload-for-group-of-recipientssubset)
        -  [Direct payload for all recipients(broadcast)](#direct-payload-for-all-recipientsbroadcast)
        -  [IPFS payload for single recipient(target)](#ipfs-payload-for-single-recipienttarget)
        -  [IPFS payload for group of recipients(subset)](#ipfs-payload-for-group-of-recipientssubset)
        -  [IPFS payload for all recipients(broadcast)](#ipfs-payload-for-all-recipientsbroadcast)
        -  [Minimal payload for single recipient(target)](#minimal-payload-for-single-recipienttarget)
        -  [Minimal payload for a group of recipient(subset)](#minimal-payload-for-a-group-of-recipientsubset)
        -  [Minimal payload for all recipients(broadcast)](#minimal-payload-for-all-recipientsbroadcast)
        -  [Graph payload for single recipient(target)](#graph-payload-for-single-recipienttarget)
        -  [Graph payload for group of recipients(subset)](#graph-payload-for-group-of-recipientssubset)
        -  [Graph payload for all recipients(broadcast)](#graph-payload-for-all-recipientsbroadcast)
    -  [Notification helper utils](#notification-helper-utils)
        -  [Parsing notifications](#parsing-notifications)
    -  [Advanced Notification (WIP)](#advanced-notifications-wip)
        -  [**Deprecated** Get a channel’s subscriber list of addresses](#get-a-channels-subscriber-list-of-addresses)
  - [Chat](#for-chat)
    -  [Create user for chat](#create-user-for-chat)
    -  [Get user data for chat](#get-user-data-for-chat)
    -  [Fetching list of user chats](#fetching-list-of-user-chats)
    -  [Fetching list of user chat requests](#fetching-list-of-user-chat-requests)
    -  [Fetching conversation hash between two users](#fetching-conversation-hash-between-two-users)
    -  [Fetching history between two users](#fetching-history-between-two-users)
    -  [Fetching latest chat between two users](#fetching-latest-chat-between-two-users)
    -  [To approve a chat request](#to-approve-a-chat-request)
    -  [To send a message](#to-send-a-message)
    -  [To create a group](#to-create-a-group)
    -  [To update group details](#to-update-group-details)
    -  [Chat helper utils](#chat-helper-utils)
        -  [Decrypting encrypted pgp private key](#decrypting-encrypted-pgp-private-key)
        -  [Decrypting messages](#decrypting-messages)

# How to use in your app?
## Installation
```
  yarn add @pushprotocol/restapi ethers
```
  or
```
  npm install @pushprotocol/restapi ethers 
```
Import in your file
```typescript
import * as PushAPI from "@pushprotocol/restapi";
```

## **About blockchain agnostic address format**

In any of the below methods (unless explicitly stated otherwise) we accept either - 
- [CAIP format](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md#test-cases): for any on chain addresses ***We strongly recommend using this address format***. [Learn more about the format and examples](https://docs.push.org/developers/concepts/web3-notifications).
(Example : `eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)
 
 **Note** - For chat related restapis, the address is in the format: eip155:&lt;address&gt; instead of eip155:&lt;chainId&gt;:&lt;address&gt;

- ETH address format: only for backwards compatibility. 
(Example: `0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)



## **About generating the "signer" object for different platforms**

### When using in SERVER-SIDE code: 
```typescript
const ethers = require('ethers');
const PK = 'your_channel_address_secret_key';
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);
```
### When using in FRONT-END code: 
```typescript
// any other web3 ui lib is also acceptable
import { useWeb3React } from "@web3-react/core";
.
.
.
const { account, library, chainId } = useWeb3React();
const signer = library.getSigner(account);
```

# SDK Features
## For Notification

### **Fetching user notifications**
```typescript
const notifications = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
  env: 'staging'
});
```

### **Fetching user spam notifications**
```typescript
const spams = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
  spam: true,
  env: 'staging'
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| user*    | string  | -       | user account address (CAIP)                |
| page     | number  | 1       | page index of the results                  |
| limit    | number  | 10      | number of items in 1 page                  |
| spam     | boolean  | false   | if "true" it will fetch spam feeds         |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| raw      | boolean  | false      | if "true" the method will return unformatted raw API response|

### **Fetching user subscriptions**
```typescript
const subscriptions = await PushAPI.user.getSubscriptions({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
  env: 'staging'
});
```

where `subscriptions` is a list of channels `[{ channel: '0xaddress', ... }]` subscribed by the user.

*Note: We can find out if a user is subscribed to a channel by checking if the channel address is present in the subscriptions list*

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| user*    | string  | -       | user address (CAIP)                 |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


### **Fetching channel details**
```typescript
const channelData = await PushAPI.channels.getChannel({
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // channel address in CAIP
  env: 'staging'
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| channel*    | string  | -       | channel address  (CAIP)                 |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


### **Searching for channel(s)**
```typescript
const channelsData = await PushAPI.channels.search({
  query: 'push', // a search query
  page: 1, // page index
  limit: 20, // no of items per page
  env: 'staging'
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| query*    | string  | -       | search query                              |
| page     | number  | 1       | page index of the results                  |
| limit    | number  | 10      | number of items in 1 page                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


### **Opt in to a channel**
```typescript
await PushAPI.channels.subscribe({
  signer: _signer,
  channelAddress: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // channel address in CAIP
  userAddress: 'eip155:5:0x52f856A160733A860ae7DC98DC71061bE33A28b3', // user address in CAIP
  onSuccess: () => {
   console.log('opt in success');
  },
  onError: () => {
    console.error('opt in error');
  },
  env: 'staging'
})
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| signer*    | -  | -       | Signer object                       |
| channelAddress*    | string  | -       | channel address (CAIP)                 |
| userAddress*    | string  | -       | user address   (CAIP)            |                    |
| verifyingContractAddress      | string | - | Push communicator contract address|
| onSuccess      | function | -   | on success callback |
| onError      | function | -   | on error callback |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


### **Opt out to a channel**
```typescript
await PushAPI.channels.unsubscribe({
  signer: _signer,
  channelAddress: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // channel address in CAIP
  userAddress: 'eip155:5:0x52f856A160733A860ae7DC98DC71061bE33A28b3', // user address in CAIP
  onSuccess: () => {
   console.log('opt out success');
  },
  onError: () => {
    console.error('opt out error');
  },
  env: 'staging'
})
```
Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| signer*    | -  | -       | Signer object                       |
| channelAddress*    | string  | -       | channel address (CAIP)         |
| userAddress*    | string  | -       | user address  (CAIP)                       |                   |
| verifyingContractAddress      | string | - | Push communicator contract address|
| onSuccess      | function | -   | on success callback |
| onError      | function | -   | on error callback |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|



<sup>*</sup>Push communicator contract address
```
ETH Mainnet - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
ETH Goerli - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
```

### **Sending notification**


#### **Direct payload for single recipient(target)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 3, // target
  identityType: 2, // direct payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: ''
  },
  recipients: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // recipient address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **Direct payload for group of recipients(subset)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 4, // subset
  identityType: 2, // direct payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: ''
  },
  recipients: ['eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', 'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1'], // recipients addresses
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **Direct payload for all recipients(broadcast)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 1, // broadcast
  identityType: 2, // direct payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: ''
  },
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **IPFS payload for single recipient(target)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 3, // target
  identityType: 1, // ipfs payload
  ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // IPFS hash of the payload
  recipients: 'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', // recipient address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **IPFS payload for group of recipients(subset)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 4, // subset
  identityType: 1, // ipfs payload
  ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // IPFS hash of the payload
  recipients: ['eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', 'eip155:5:0x52f856A160733A860ae7DC98DC71061bE33A28b3'], // recipients addresses
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **IPFS payload for all recipients(broadcast)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 1, // broadcast
  identityType: 1, // direct payload
  ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // IPFS hash of the payload
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **Minimal payload for single recipient(target)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 3, // target
  identityType: 0, // Minimal payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: ''
  },
  recipients: 'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', // recipient address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **Minimal payload for a group of recipient(subset)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 4, // subset
  identityType: 0, // Minimal payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: ''
  },
  recipients: ['eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', 'eip155:5:0x52f856A160733A860ae7DC98DC71061bE33A28b3'], // recipients address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **Minimal payload for all recipients(broadcast)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 1, // broadcast
  identityType: 0, // Minimal payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: ''
  },
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **Graph payload for single recipient(target)**
***Make sure the channel has the graph id you are providing!!***
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 3, // target
  identityType: 3, // Subgraph payload
  graph: {
    id: '_your_graph_id',
    counter: 3
  },
  recipients: 'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', // recipient address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **Graph payload for group of recipients(subset)**
***Make sure the channel has the graph id you are providing!!***
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 4, // subset
  identityType: 3, // graph payload
  graph: {
    id: '_your_graph_id',
    counter: 3
  },
  recipients: ['eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', 'eip155:5:0x52f856A160733A860ae7DC98DC71061bE33A28b3'], // recipients addresses
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

#### **Graph payload for all recipients(broadcast)**
***Make sure the channel has the graph id you are providing!!***
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer,
  type: 1, // broadcast
  identityType: 3, // graph payload
  graph: {
    id: '_your_graph_id',
    counter: 3
  },
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| signer*    | -  | -       | Signer object                       |
| channel*    | string  | -       | channel address (CAIP)                  |
| type*    | number  | -       | Notification Type <br/>Target = 3 (send to 1 address), <br/>Subset = 4 (send to 1 or more addresses),<br/> Broadcast = 1 (send to all addresses)                     |
| identityType*    | number  | -       | Identity Type <br/> Minimal = 0, <br/>IPFS = 1, <br/>Direct Payload = 2, <br/>Subgraph = 3 }                      |
| recipients*    | string or string[]  | -       | for Notification Type = Target it is 1 address, <br /> for Notification Type = Subset, Broadcast it is an array of addresses (CAIP) |
| notification.title*      | string | - | Push Notification Title (not required for identityType IPFS, Subgraph)|
| notification.body*      | string | - | Push Notification Body (not required for identityType IPFS, Subgraph)|
| payload.title      | string | - | Notification Title (not required for identityType IPFS, Subgraph)|
| payload.body      | string | - | Notification Body (not required for identityType IPFS, Subgraph)|
| payload.cta      | string | - | Notification Call To Action url (not required for identityType IPFS, Subgraph)|
| payload.img      | string | - | Notification Media url (not required for identityType IPFS, Subgraph)|
| payload.sectype      | string | - | If Secret Notification then pass (not required for identityType IPFS, Subgraph)|
| graph.id      | string | - | graph id, required only if the identityType is 3 |
| graph.counter      | string | - | graph counter, required only if the identityType is 3 |
| ipfsHash      | string | - | ipfsHash, required only if the identityType is 1 |
| expiry      | number | - | (optional) epoch value if the notification has an expiry |
| hidden      | boolean | false | (optional) true if we want to hide the notification |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|



### Notification Helper Utils
#### **Parsing notifications**
Utils method to parse raw Push Feeds API response into a pre-defined shape as below.
```typescript
// fetch some raw feeds data
const apiResponse = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address
  raw: true,
  env: 'staging'
});
// parse it to get a specific shape of object.
const parsedResults = PushAPI.utils.parseApiResponse(apiResponse);

const [oneNotification] = parsedResults;

// Now this object can be directly used by for e.g. "@pushprotocol/uiweb"  NotificationItem component as props.

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

```
*We get the above `keys` after the parsing of the API repsonse.*

### Advanced Notifications (WIP)

### DEPRECATED
#### **Get a channel's subscriber list of addresses**
```typescript
const subscribers = await PushAPI.channels._getSubscribers({
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // channel address in CAIP
  env: 'staging'
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| channel*    | string  | -       | channel address    (CAIP)                 |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


## For Chat
### **Create user for chat**
```typescript
const user = await PushAPI.user.create({
   account: '0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
   env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|



### **Get user data for chat**
```typescript
const user = await PushAPI.user.get({
   account: '0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
   env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


### **Fetching list of user chats**
```typescript
const chats = await PushAPI.chat.chats({
    account: 0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7,
    pgpPrivateKey: decryptedPvtKey,
    toDecrypt: true,
    env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|


### **Fetching list of user chat requests**
```typescript
const chats = await PushAPI.chat.requests({
    account: 0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7,
    pgpPrivateKey: decryptedPvtKey,
    toDecrypt: true,
    env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|


### **Fetching conversation hash between two users**
```typescript
const threadhash = await PushAPI.chat.conversationHash({
        account: '20x18C0Ab0809589c423Ac9eb42897258757b6b3d3d',
        conversationId: '0xFA3F8E79fb9B03e7a04295594785b91588Aa4DC8', // receiver's address or chatId of a group
        env,
      });
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| conversationId*    | string  | -       | receiver's address or chatId of a group|


### **Fetching history between two users**
```typescript

      const chatHistory = await PushAPI.chat.history({
        threadhash:threadhash.threadHash,
        account: '0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
        pgpPrivateKey: decryptedPvtKey,
        limit:2,
        toDecrypt:true,
        env:'staging',
      });
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| threadhash*    | string  | -       | conversation hash between two users |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| limit    | number  | 10       | number of messages between two users |


### **Fetching latest chat between two users**
```typescript

      const chatHistory = await PushAPI.chat.latest({
        threadhash:threadhash.threadHash,
        account: '0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
        pgpPrivateKey: decryptedPvtKey,
        limit:2,
        toDecrypt:true,
        env:'staging',
      });
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| threadhash*    | string  | -       | conversation hash between two users |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|


### **To approve a chat request**
```typescript
const response = await PushAPI.chat.approve({
        status: 'Approved',
        account: '0x18C0Ab0809589c423Ac9eb42897258757b6b3d3d',
        senderAddress : '0x873a538254f8162377296326BB3eDDbA7d00F8E9', // receiver's address or chatId of a group
        env:'staging',
      });
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| senderAddress*    | string  | -       | receiver's address or chatId of a group |
| status    | 'Approved' | 'Approved'  | flag for approving and rejecting chat request, supports only approving for now|



### **To send a message**
```typescript
const response = await PushAPI.chat.send({
        messageContent: 'Hi',
        messageType: 'Text',
        receiverAddress: '0x08E834a388Cee21d4d7571075146841C8eE621a4', // receiver's address or chatId of a group
        account: '0x57eAd5826B1E0A7074E1aBf1A062714A2dE0f8B4',
        pgpPrivateKey: decryptedPvtKey,
        apiKey:"tAWEnggQ9Z.UaDBNjrvlJZx3giBTIQDcT8bKQo1O1518uF1Tea7rPwfzXv2ouV5rX9ViwgJUrXm"
        env: 'staging',
      });
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| senderAddress*    | string  | -       | receiver's address or chatId of a group |
| messageContent    | string  | ''       | message to be sent |
| messageType    | 'Text' &#124;  'Image' &#124;  'File'  | 'Text'| type of messageContent |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| apiKey    | string  | ''       | apiKey for using chat|


### **To create a group**
```typescript
const response = await PushAPI.chat.createGroup({
        groupName:'Push Protocol group',
        groupDescription:'This is the oficial group for Push Protocol,
        members: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
        groupImage: &lt;group image link&gt; ,
        admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
        isPublic: true,
        groupCreator: '0xD993eb61B8843439A23741C0A3b5138763aE11a4' ,
        account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
        env: 'staging',
        pgpPrivateKey: decryptedPvtKey, //decrypted private key
      });
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| groupName*    | string  | -       | group name |
| groupDescription*    | string  | -       | group description |
| groupImage*    | string  | -       | group image link |
| members*    | Array<string>  | -  | wallet addresses of all members except admins and groupCreator |
| admins*    | Array<string>  | -  | wallet addresses of all admins except members and groupCreator |
| groupCreator*    | string | -  | wallet address groupCreator|
| isPublic*    | boolean  | -       | true for public group, false for private group |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|


### **To get group details by chatId**

```typescript
const response = await PushAPI.chat.getGroup({
  chatId: '190591e84108cdf12e62eecabf02ddb123ea92f1c06fb98ee9b5cf3871f46fa9',
  env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| chatId*    | string  | -       | group chat id                 |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

### **To update group details**
Note - updateGroup is an idompotent call
```typescript
const response = await PushAPI.chat.updateGroup({
        groupName:'Push Chat group',
        groupDescription:'This is the updated description for Push Chat,
        members: ['0x2e60c47edF21fa5e5A333347680B3971F1FfD456','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
        groupImage: &lt;group image link&gt; ,
        admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
        account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
        env: 'staging',
        pgpPrivateKey: decryptedPvtKey, //decrypted private key
      });
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| groupName*    | string  | -       | group name |
| groupDescription*    | string  | -       | group description |
| groupImage*    | string  | -       | group image link |
| members*    | Array<string>  | -  | wallet addresses of all members except admins and groupCreator |
| admins*    | Array<string>  | -  | wallet addresses of all admins except members and groupCreator |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|



### Chat Helper Utils
#### **Decrypting encrypted pgp private key**
```typescript
import { IUser } from '@pushprotocol/restapi';

const decryptedPvtKey = await PushAPI.chat.decryptWithWalletRPCMethod(
          (connectedUser as IUser).encryptedPrivateKey, //encrypted private key 
          '0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7' //user address
        );
```

#### **Decrypting messages**
```typescript
import { IUser } from '@pushprotocol/restapi';

const decryptedChat = await PushAPI.chat.decryptConversation({
    messages: chatHistory, //array of message object fetched from chat.history method
    connectedUser, // user meta data object fetched from chat.get method
    pgpPrivateKey:decryptedPvtKey, //decrypted private key
    env:'staging',
  });
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| messages*    | string  | -       | array of message object fetched from chat.history method |
| connectedUser*    | IUser  | false | user meta data object|
| pgpPrivateKey    | string  | null  | mandatory for users having pgp keys|
