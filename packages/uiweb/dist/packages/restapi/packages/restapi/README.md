# restapi

This package gives access to Push Protocol (Push Nodes) APIs. Visit [Developer Docs](https://push.org/docs) or [Push.org](https://push.org) to learn more.

# Index

- [How to use in your app?](#how-to-use-in-your-app)
  - [Installation](#installation)
  - [Import SDK](#import-sdk)
  - [About generating the "signer" object for different platforms](#about-generating-the-signer-object-for-different-platforms)
    - [When using in SERVER-SIDE code:](#when-using-in-server-side-code)
    - [When using in FRONT-END code:](#when-using-in-front-end-code)
  - [About blockchain agnostic address format](#about-blockchain-agnostic-address-format)
    - [Chat blockchain agnostic address format](#chat-blockchain-agnostic-address-format)
- [SDK Features](#sdk-features)
  - [Manage User](#manage-user)
    - [Initialize](#initialize)
    - [Reinitialize](#reinitialize)
    - [Fetch Info](#fetch-user-info)
    - [Fetch User Profile Info](#fetch-profile-info)
    - [Update user Profile Info](#update-profile-info)
    - [Fetch User Encryption Info](#fetch-encryption-info)
    - [Update User Encryption](#update-encryption)
  - [For Push Notifications](#for-push-notifications)
    - [Fetch Inbox Or Spam notifications](#fetch-inbox-or-spam-notifications)
    - [Fetch user subscriptions](#fetch-user-subscriptions)
    - [Subscribe to a channel](#subscribe-to-a-channel)
    - [Unsubscribe to a channel](#unsubscribe-to-a-channel)
    - [Channel information](#channel-information)
    - [Search Channels](#search-channels)
    - [Get Subscribers Of A Channel](#get-subscribers-of-a-channel)
    - [Send a notification](#send-a-notification)
    - [Create a channel](#create-a-channel)
    - [Update channel information](#update-channel-information)
    - [Verify a channel](#verify-a-channel)
    - [Create channel Setting](#create-channel-setting)
    - [Get delegators information](#get-delegators-information)
    - [Add delegator to a channel or alias](#add-delegator-to-a-channel-or-alias)
    - [Remove delegator from a channel or alias](#remove-delegator-from-a-channel-or-alias)
    - [Alias Information](#alias-information)
    - [Stream Notifications](#stream-notifications)
  - [For Push Chat](#for-push-chat)
    - [Fetch Latest Chat](#fetch-latest-chat)
    - [Fetch Chat History](#fetch-chat-history)
    - [Send Message](#send-message)
    - [Accept Chat Request](#accept-chat-request)
    - [Reject Chat Request](#reject-chat-request)
    - [Block Chat User](#block-chat-user)
    - [Unblock Chat User](#unblock-chat-user)
    - [Create Group](#create-group)
    - [Fetch Group Info](#fetch-group-info)
    - [Fetch Group Permission](#fetch-group-permissions)
    - [Update Group](#update-group)
    - [Add To Group](#add-to-group)
    - [Remove From Group](#remove-from-group)
    - [Join Group](#join-group)
    - [Leave Group](#leave-group)
    - [Reject Group Joining Request](#reject-group-joining-request)
    - [Stream Chat Events](#stream-chat-events)
  - [For Push Spaces](#for-push-spaces)
    - [To create a space](#to-create-a-space)
    - [To create a token gated space](#to-create-a-token-gated-space)
    - [To check user access of a token gated space](#to-check-user-access-of-a-token-gated-space)
    - [To update space details](#to-update-space-details)
    - [To update token gated space details](#to-update-token-gated-space-details)
    - [To get space details by spaceId](#to-get-space-details-by-spaceid)
    - [To start a space](#to-start-a-space)
    - [To stop a space](#to-stop-a-space)
    - [To approve a space request](#to-approve-a-space-request)
    - [To add listeners to space](#to-add-listeners-to-space)
    - [To remove listeners from space](#to-remove-listeners-from-space)
    - [To add speakers to space](#to-add-speakers-to-space)
    - [To remove speakers from space](#to-remove-speakers-from-space)
    - [Fetching list of user spaces](#fetching-list-of-user-spaces)
    - [Fetching list of user space requests](#fetching-list-of-user-space-requests)
    - [Fetching list of trending spaces](#fetching-list-of-trending-spaces)
  - [For Push Video](#for-push-video)
    - [data & setData](#data--setdata)
    - [Stream API](#stream-video)
    - [Initialize Video API](#initializing-video-api)
    - [Request a Video Call](#request-a-video-call)
    - [Accept an incoming Video Call](#approve-a-incoming-video-call-request)
    - [Reject an incoming Video Call](#reject-an-incoming-video-call-request)
    - [Disconnect an ongoing video call](#disconnect-an-ongoing-video-call)
    - [Managing Media Config](#manage-media-config)
    - [Read Current Media State](#read-current-media-state)

# How to use in your app?

## Installation

```bash
yarn add @pushprotocol/restapi@latest
```

or

```bash
npm install @pushprotocol/restapi@latest
```

**Note** - ethers is an optional peer dependency and is required only when sdk is used with ethers signer.

## Import SDK

```typescript
import { PushAPI } from '@pushprotocol/restapi';
```

## **About generating the "signer" object for different platforms**

### When using in SERVER-SIDE code:

```typescript
const ethers = require('ethers');
const PK = 'your_channel_address_secret_key';
const Pkey = `0x${PK}`;
const _signer = new ethers.Wallet(Pkey);
```

### When using in FRONT-END code:

```typescript
// any other web3 ui lib is also acceptable
import { useWeb3React } from "@web3-react/core";
.
.
.
const { account, library, chainId } = useWeb3React();
const _signer = library.getSigner(account);
```

## **About blockchain agnostic address format**

In any of the below methods (unless explicitly stated otherwise) we accept either -

- [CAIP format](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md#test-cases): for any on chain addresses **_We strongly recommend using this address format_**. [Learn more about the format and examples](https://docs.push.org/developers/concepts/web3-notifications).
  (Example : `eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)

- ETH address format: only for backwards compatibility.
  (Example: `0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)

### Chat blockchain agnostic address format

**Note** - For chat related apis, the address is in the format: eip155:&lt;address&gt; instead of eip155:&lt;chainId&gt;:&lt;address&gt;, we call this format **Partial CAIP**
(Example : `eip155:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)

# SDK Features

## Manage User

APIs to Initialise User and User APIs.

### **Initialize**

```typescript
// Initialize PushAPI class instance
const userAlice = await PushAPI.initialize(signer, {
  env: 'staging',
});
```

**Parameters**

| Param                    | Type                                    | Default       | Remarks                                                                                                         |
| ------------------------ | --------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| `signer`                 | `SignerType`                            | -             | Ethers or Viem Signer.                                                                                          |
| `options` \*             | `PushAPIInitializeProps`                | -             | Optional configuration properties for initializing the PushAPI.                                                 |
| `options.env` \*         | `ENV`                                   | `staging`     | API env - 'prod', 'staging', 'dev'.                                                                             |
| `options.progressHook`\* | `(progress: ProgressHookType) => void`  | -             | A callback function to receive progress updates during initialization.                                          |
| `options.account` \*     | `string`                                | -             | The account to associate with the PushAPI. If not provided, it is derived from signer.                          |
| `options.version` \*     | `string`                                | `ENC_TYPE_V3` | The encryption version to use for the PushAPI.                                                                  |
| `options.versionMeta` \* | `{ NFTPGP_V1 ?: { password: string } }` | -             | Metadata related to the encryption version, including a password if needed, and reset for resetting nft profile |
| `options.autoUpgrade` \* | `boolean`                               | `true`        | If `true`, upgrades encryption keys to the latest encryption version.                                           |
| `options.origin` \*      | `string`                                | -             | Specify origin or source while creating a Push Profile.                                                         |

\* - Optional

---

### **Reinitialize**

```typescript
// Reinitialize PushAPI for fresh start of NFT Account
// Reinitialize only succeeds if the signer account is the owner of the NFT
await userAlice.reinitialize({
  versionMeta: { NFTPGP_V1: { password: 'NewPassword' } },
});
```

**Parameters**

| Param                 | Type                                | Default | Remarks                                                                     |
| --------------------- | ----------------------------------- | ------- | --------------------------------------------------------------------------- |
| `options`             | `PushAPIInitializeProps`            | -       | Optional configuration properties for initializing the PushAPI.             |
| `options.versionMeta` | `{ NFTPGP_V1 ?: password: string }` | -       | Metadata related to the encryption version, including a password if needed. |

---

### **Fetch User Info**

```typescript
// userAlice.info({options?})
const response = await userAlice.info();
```

**Parameters:**
| Param | Type | Default | Remarks|
| ---------- | ---------- | ------------- | ---------------------- |
| `options` | `InfoOptions` | - | Optional configuration properties |
| - | `options.overrideAccount` | - | The account for which info is retrieved, can override to get info of other accounts not owned by the user. If not provided, it is derived from signer. |

---

### **Fetch Profile Info**

```typescript
// userAlice.profile.info({options?})
const response = await userAlice.profile.info();
```

**Parameters:**
| Param | Type | Default | Remarks|
| ---------- | --------- | ------------- | ---------------------- |
| `options` | `InfoOptions` | - | Optional configuration properties |
| - | `options.overrideAccount` | - | The account for which info is retrieved, can override to get info of other accounts not owned by the user. If not provided, it is derived from signer. |

---

### **Update Profile Info**

```typescript
// Update Push Profile
// userAlice.profile.update({options?})
const response = await userAlice.profile.update({
  name: 'Alice',
  description: 'Alice is a software developer',
  picture: imageInBase64Format, // base64 encoded image
});
```

| Param                    | Type     | Default | Remarks                                    |
| ------------------------ | -------- | ------- | ------------------------------------------ |
| `options`                | `object` | -       | Configuration options for updating profile |
| `options.name` \*        | `string` | -       | Profile Name                               |
| `options.description` \* | `string` | -       | Profile Description                        |
| `options.picture` \*     | `string` | -       | Profile Picture                            |

\* - Optional

---

### **Fetch Encryption Info**

```typescript
// Fetch Encryption Info
const aliceEncryptionInfo = await userAlice.encryption.info();
```

---

### **Update Encryption**

```typescript
// userAlice.encryption.update(ENCRYPTION_TYPE, {options?})
// Wallet User Update,
// Usually not required as it's handled internally by the SDK to automatically update to recommended encryption type
const walletAlice = await userAlice.encryption.update(
  CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V3
);

// NFT User Update
// Should be done when the NFT is transferred to a different user
// so messages and connections can be migrated to the new user
const nftAlice = await userAlice.encryption.update(
  CONSTANTS.USER.ENCRYPTION_TYPE.NFTPGP_V1,
  {
    versionMeta: {
      NFTPGP_V1: {
        password: 'new_password',
      },
    },
  }
);
```

| Param                   | Type                                    | Default | Remarks                                        |
| ----------------------- | --------------------------------------- | ------- | ---------------------------------------------- |
| `options` \*            | `object`                                | -       | Optional Configuration for updating encryption |
| `options.versionMeta`\* | `{ NFTPGP_V1 ?: { password : string} }` | -       | New Password ( In case of NFT Profile )        |

\* - Optional

---

## For Push Notifications

> Initializing User is the first step before proceeding to sending/interacting with Notification APIs. Please refer [Initialize User Section](#initialize)

### **Fetch Inbox Or Spam notifications**

```tsx
// lists feeds
const aliceInfo = await userAlice.notification.list('INBOX');
```

**Parameters:**

| Parameter            | Type              | Default | Description                                                             |
| -------------------- | ----------------- | ------- | ----------------------------------------------------------------------- |
| `spam`               | `INBOX` or `SPAM` | INBOX   | A string representing the type of feed to retrieve.                     |
| `options`\*          | `object`          | -       | An object containing additional options for filtering and pagination.   |
| `options.account`\*  | `string`          | -       | Account in full CAIP                                                    |
| `options.channels`\* | `string[] `       | -       | An array of channels to filter feeds by.                                |
| `options.page`\*     | `number`          | -       | A number representing the page of results to retrieve.                  |
| `options.limit`\*    | `number`          | -       | A number representing the maximum number of feeds to retrieve per page. |
| `options.raw`\*      | `boolean`         | -       | A boolean indicating whether to retrieve raw feed data.                 |

\* - Optional

---

### **Fetch user subscriptions**

```tsx
// fetches list of channels to which the user is subscribed
const subscriptions = await userAlice.notification.subscriptions();
```

**Parameters:**

| Parameter           | Type     | Default | Description                                                          |
| ------------------- | -------- | ------- | -------------------------------------------------------------------- |
| `options`\*         | `object` | -       | An object containing additional options for subscriptions.           |
| `options.account`\* | `string` | -       | Account in supported address format.                                 |
| `options.page`\*    | `number` | -       | page of results to retrieve.                                         |
| `options.limit`\*   | `number` | -       | represents the maximum number of subscriptions to retrieve per page. |

\* - Optional

---

### **Subscribe to a channel**

```tsx
// subscribes to a channel
const subscribeStatus = await userAlice.notification.subscribe(channelInCAIP, {
  settings,
});
```

**Parameters:**

| Parameter    | Type         | Default | Description                                  |
| ------------ | ------------ | ------- | -------------------------------------------- |
| `channel`    | `string`     | -       | Channel/Alias address in CAIP format         |
| `settings`\* | `objects[] ` | -       | Contain array of individual `setting` object |

**Individual setting object:**

| Param     | Type      | Subtype   | Default | Remarks                                     |
| --------- | --------- | --------- | ------- | ------------------------------------------- |
| `setting` | `object`  | -         | -       | Individual setting object                   |
| -         | `enabled` | `boolean` | `true`  | Indicates if setting is enabled or disabled |
| -         | `value`   | `string`  | -       | The value set by the user                   |

\* - Optional

---

### **Unsubscribe to a channel**

```tsx
// unsubscribes to the channel
const unsubscribeResponse = await userAlice.notification.unsubscribe(
  channelAddressInCAIP
);
```

**Parameters:**

| Parameter | Type     | Default | Description                          |
| --------- | -------- | ------- | ------------------------------------ |
| `channel` | `string` | -       | Channel/Alias address in CAIP format |

\* - Optional

---

### **Channel information**

```tsx
// fetches information about the channel
const channelInfo = await userAlice.channel.info(channelAddressInCAIP);
```

**Parameters:**

| Parameter   | Type     | Default | Description                    |
| ----------- | -------- | ------- | ------------------------------ |
| `channel`\* | `string` | -       | Channel address in CAIP format |

\* - Optional

---

### **Search Channels**

```tsx
// returns channel matching the query
const searchResult = await userAlice.channel.search('push');
```

**Parameters:**

| Parameter       | Type                 | Default | Description                                                               |
| --------------- | -------------------- | ------- | ------------------------------------------------------------------------- |
| query           | string               | -       | The search query to find channels.                                        |
| options\*       | ChannelSearchOptions | -       | Configuration options for the search.                                     |
| options.page\*  | number               | -       | The page of results to retrieve. Default is set to 1                      |
| options.limit\* | number               | -       | The maximum number of channels to retrieve per page. Default is set to 10 |

\* - Optional

---

### **Get Subscribers Of A Channel**

```tsx
// userAlice.channel.subscribers({options?})
const channelSubscribers = await userAlice.channel.subscribers();
```

**Parameters:**

| Param     | Type               | Subtype   | Default             | Remarks                                                                                                                                                                                              |
| --------- | ------------------ | --------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options` | `object`           | -         | -                   | Configuration options for retrieving subscribers.                                                                                                                                                    |
| -         | `options.channel`  | `string`  | Derived from signer | Channel address in [chain specific wallet format](/docs/notifications/important-concepts/#chain-specific-wallet-address). If no channel address is passed, then signer is used to derive the channel |
| -         | `options.page`     | `number`  | -                   | A number representing the page of results to retrieve.                                                                                                                                               |
| -         | `options.limit`    | `number`  | -                   | Represents the maximum number of subscriptions to retrieve per page                                                                                                                                  |
| -         | `options.setting`  | `boolean` | false               | A boolean flag if when set to true, fetches user settings along with the subscriber                                                                                                                  |
| -         | `options.category` | `number`  | -                   | Filters out subscribers that have enabled a specific category of notification settings                                                                                                               |

\* - Optional

---

### **Send a notification**

```tsx
// sends a notification
// userAlice.channel.send([recipients], {options?})
const sendNotifRes = await userAlice.channel.send(['*'], {
  notification: { title: 'test', body: 'test' },
});
```

**Parameters:**

| Param                              | Type                                              | Remarks                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _`recipients`_                     | `string[]`                                        | An array of recipient addresses passed in [any supported wallet address format](/docs/notifications/important-concepts/#types-of-supported-wallet-address-account). Possible values are: Broadcast -> [*], Targeted -> [0xA], Subset -> [0xA, 0xB], see [types of notifications](/docs/notifications/build/types-of-notification) for more info.                                                                                                                                      |
| `options`                          | `NotificationOptions`                             | Configuration options for sending notifications.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `options.notification`             | `INotification`                                   | An object containing the notification's title and body. (Mandatory)                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `options.notification.title`       | `string`                                          | The title for the notification. If not provided, it is taken from notification.title.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `options.notification.body`        | `string`                                          | The body of the notification. If not provided, it is taken from notification.body.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `options.payload`\*                | `IPayload`                                        | An object containing additional payload information for the notification.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `options.payload.title`\*          | `string`                                          | The title for the notification. If not provided, it is taken from notification.title.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `options.payload.body`\*           | `string`                                          | The body of the notification. If not provided, it is taken from notification.body.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `options.payload.cta`\*            | `string`                                          | Call to action for the notification.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `options.payload.embed`\*          | `string`                                          | Media information like image/video links                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `options.payload.category`\*       | `string`                                          | Don't pass category if you are sending a generic notification. Notification category represents index point of each individual settings. Pass this if you want to indicate what category of notification you are sending (If channel has settings enabled). For example, if a channel has 10 settings, then a notification of category 7 indicates it's a notification sent for setting 7, if user has turned setting 7 off then Push ndoes will stop notif from getting to the user. |
| `options.payload.meta`\*           | `{ domain?: string, type: string, data: string }` | Metadata for the notification, including domain, type, and data.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `options.config`\*                 | `IConfig`                                         | An object containing configuration options for the notification.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `options.config.expiry`\*          | `number`                                          | Expiry time for the notification in seconds                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `options.config.silent`\*          | `boolean`                                         | Indicates whether the notification is silent.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `options.config.hidden`\*          | `boolean`                                         | Indicates whether the notification is hidden.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `options.advanced`\*               | `IAdvance`                                        | An object containing advanced options for the notification.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `options.advanced.graph`\*         | `{ id: string, counter: number }`                 | Advanced options related to the graph based notification.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `options.advanced.ipfs`\*          | `string`                                          | IPFS information for the notification.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `options.advanced.minimal`\*       | `string`                                          | Minimal Payload type notification.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `options.advanced.chatid`\*        | `string`                                          | For chat based notification.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `options.advanced.pgpPrivateKey`\* | `string`                                          | PGP private key for chat based notification.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `options.channel`\*                | `string`                                          | Channel address in CAIP. Mostly used when a delegator sends a notification on behalf of the channel                                                                                                                                                                                                                                                                                                                                                                                   |

\* - Optional

---

### **Create a channel**

```tsx
// creates a channel
// userAlice.channel.create({options})
const response = await userAlice.channel.create({
  name: 'Test Channel',
  description: 'Test Description',
  icon: imageBase64Format,
  url: 'https://push.org',
});
```

**Parameters:**

| Param                   | Type                      | Default | Remarks                                                                                                                                                                        |
| ----------------------- | ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _`options`_             | `object`                  | -       | Configuration options for creating a channel                                                                                                                                   |
| _`options.name`_        | `string`                  | -       | The name of the channel                                                                                                                                                        |
| _`options.description`_ | `string`                  | -       | A description of the channel                                                                                                                                                   |
| _`options.icon`_        | `string (base64 encoded)` | -       | The channel's icon in base64 encoded string format                                                                                                                             |
| _`options.url`_         | `string`                  | -       | The URL associated with the channel                                                                                                                                            |
| `options.alias`         | `string`                  | -       | alias address in in [chain specific wallet format](/docs/notifications/important-concepts/#chain-specific-wallet-address)                                                      |
| `options.progresshook`  | `(progress) => void`      | -       | A callback function that's called during channel creation progress, [see progress object](/docs/notifications/build/create-channel/#create-channel-progress-object-parameters) |

\* - Optional

_`Optional:`_ Informs about individual progress stages during channel creation if progresshook is function is passed during channel creation API call.

| Param            | Type     | Default | Remarks                                                |
| ---------------- | -------- | ------- | ------------------------------------------------------ |
| `progress`       | `object` | -       | progress object that is passed in the callback         |
| `Progress.id`    | `string` | -       | Predefined, ID associated with the progress objects    |
| `Progress.level` | `string` | -       | Predefined, Level associated with the progress objects |
| `Progress.title` | `string` | -       | Predefined, title associated with the progress objects |
| `Progress.info`  | `string` | -       | Predefined, info associated with the progress objects  |

_`Progress object details`_

| Progress\.id             | Progress.level | Progress.title                                      | Progress\.info                                          |
| ------------------------ | -------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `PUSH-CHANNEL-CREATE-01` | `INFO`         | Uploading data to IPFS                              | The channel’s data is getting uploaded to IPFS          |
| `PUSH-CHANNEL-CREATE-02` | `INFO`         | Approving PUSH tokens                               | Gives approval to Push Core contract to spend 50 $PUSH  |
| `PUSH-CHANNEL-CREATE-03` | `INFO`         | Channel is getting created                          | Calls Push Core contract to create your channel         |
| `PUSH-CHANNEL-CREATE-04` | `SUCCESS`      | Channel creation is done, Welcome to Push Ecosystem | Channel creation is completed                           |
| `PUSH-CHANNEL-UPDATE-01` | `INFO`         | Uploading new data to IPFS                          | The channel’s new data is getting uploaded to IPFS      |
| `PUSH-CHANNEL-UPDATE-02` | `INFO`         | Approving PUSH tokens                               | Gives approval to Push Core contract to spend 50 $PUSH  |
| `PUSH-CHANNEL-UPDATE-03` | `INFO`         | Channel is getting updated                          | Calls Push Core contract to update your channel details |
| `PUSH-CHANNEL-UPDATE-04` | `SUCCESS`      | Channel is updated with new data                    | Channel is successfully updated                         |
| `PUSH-ERROR-02`          | `ERROR`        | Transaction failed for a function call              | Transaction failed                                      |

---

### **Update channel information**

```tsx
// updates channel info
// userAlice.channel.update({options?})
const updateChannelRes = await userAlice.channel.update({
  name: newChannelName,
  description: newChannelDescription,
  url: newChannelURL,
  icon: newBase64FormatImage,
  alias: newAliasAddressInCAIP,
});
```

**Parameters:**

| Parameter                | Type                      | Default | Description                                                          |
| ------------------------ | ------------------------- | ------- | -------------------------------------------------------------------- |
| `options`                | -                         | -       | Configuration options for creating a channel.                        |
| `options\.name `         | `string`                  | -       | New name of the channel.                                             |
| `options.description`    | `string`                  | -       | New description of the channel.                                      |
| `options.icon`           | `string` (base64 encoded) | -       | The channel's new icon in base64 encoded string format.              |
| `options.url`            | `string`                  | -       | New URL associated with the channel.                                 |
| `options.alias`\*        | `string`                  | -       | New alias address in CAIP                                            |
| `options.progresshook`\* | `() => void`              | -       | A callback function to execute when the channel updation progresses. |

\* - Optional

_`Optional:`_ Informs about individual progress stages during channel creation if progresshook is function is passed during channel creation API call.

| Param            | Type     | Default | Remarks                                                |
| ---------------- | -------- | ------- | ------------------------------------------------------ |
| `progress`       | `object` | -       | progress object that is passed in the callback         |
| `Progress.id`    | `string` | -       | Predefined, ID associated with the progress objects    |
| `Progress.level` | `string` | -       | Predefined, Level associated with the progress objects |
| `Progress.title` | `string` | -       | Predefined, title associated with the progress objects |
| `Progress.info`  | `string` | -       | Predefined, info associated with the progress objects  |

_`Progress object details`_

| Progress\.id             | Progress.level | Progress.title                                      | Progress\.info                                          |
| ------------------------ | -------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `PUSH-CHANNEL-CREATE-01` | `INFO`         | Uploading data to IPFS                              | The channel’s data is getting uploaded to IPFS          |
| `PUSH-CHANNEL-CREATE-02` | `INFO`         | Approving PUSH tokens                               | Gives approval to Push Core contract to spend 50 $PUSH  |
| `PUSH-CHANNEL-CREATE-03` | `INFO`         | Channel is getting created                          | Calls Push Core contract to create your channel         |
| `PUSH-CHANNEL-CREATE-04` | `SUCCESS`      | Channel creation is done, Welcome to Push Ecosystem | Channel creation is completed                           |
| `PUSH-CHANNEL-UPDATE-01` | `INFO`         | Uploading new data to IPFS                          | The channel’s new data is getting uploaded to IPFS      |
| `PUSH-CHANNEL-UPDATE-02` | `INFO`         | Approving PUSH tokens                               | Gives approval to Push Core contract to spend 50 $PUSH  |
| `PUSH-CHANNEL-UPDATE-03` | `INFO`         | Channel is getting updated                          | Calls Push Core contract to update your channel details |
| `PUSH-CHANNEL-UPDATE-04` | `SUCCESS`      | Channel is updated with new data                    | Channel is successfully updated                         |
| `PUSH-ERROR-02`          | `ERROR`        | Transaction failed for a function call              | Transaction failed                                      |

---

### **Verify a channel**

```tsx
const verifyChannelRes = await userAlice.channel.verify(channel);
```

**Parameters:**

| Parameter | Type     | Default | Description                            |
| --------- | -------- | ------- | -------------------------------------- |
| `channel` | `string` | -       | Channel address in CAIP to be verified |

---

### **Create channel Setting**

```tsx
// creates channel settings
const createChannelSettingRes = userAlice.channel.setting([
  {
    type: 1, // Boolean type
    default: 1,
    description: 'Receive marketing notifications',
  },
  {
    type: 2, // Slider type
    default: 10,
    description: 'Notify when loan health breaches',
    data: { upper: 100, lower: 5, ticker: 1 },
  },
]);
```

**Parameters:**

| Property        | Type     | Default | Description                                                                |
| --------------- | -------- | ------- | -------------------------------------------------------------------------- |
| `type`          | `number` | -       | The type of notification setting. 1 for boolean type and 2 for slider type |
| `default`       | `number` | -       | The default value for the setting.                                         |
| `description`   | `string` | -       | A description of the setting.                                              |
| `data.upper`\*  | `number` | -       | Valid for slider type only. The upper limit for the setting.               |
| `data.lower`\*  | `number` | -       | Valid for slider type only. The lower limit for the setting.               |
| `data.ticker`\* | `number` |         | Valid for slider type only. The ticker by which the slider moves.          |

| \* - Optional

---

### **Get delegators information**

```tsx
// fetch delegate information
const delegates = await userAlice.channel.delegate.get();
```

**Parameters:**

| Parameter           | Type                 | Default | Description                                                 |
| ------------------- | -------------------- | ------- | ----------------------------------------------------------- |
| `options`\*         | `ChannelInfoOptions` | -       | Configuration options for retrieving delegator information. |
| `options.channel`\* | `string`             | -       | channel address in CAIP                                     |

\* - Optional

---

### **Add delegator to a channel or alias**

```tsx
// adds a delegate
const addedDelegate = await userAlice.channel.delegate.add(delegate);
```

**Parameters:**

| Parameter                                                      | Type     | Default | Description               |
| -------------------------------------------------------------- | -------- | ------- | ------------------------- |
| `delegate`                                                     | `string` | -       | delegator address in CAIP |
| Note: Support for contract interaction via viem is coming soon |          |         |                           |

---

### **Remove delegator from a channel or alias**

```tsx
// removes a delegate
const removeDelegate = await userAlice.channel.delegate.remove(delegate);
```

**Parameters:**

| Parameter                                                      | Type     | Default | Description               |
| -------------------------------------------------------------- | -------- | ------- | ------------------------- |
| `delegate`                                                     | `string` | -       | delegator address in CAIP |
| Note: Support for contract interaction via viem is coming soon |          |         |                           |

---

### **Alias Information**

```tsx
// fetch alias info
const aliasInfo = userAlice.channel.alias.info({
  alias: aliasAddress,
  aliasChain: 'POLYGON',
});
```

**Parameters:**

| Param                | Type          | Default | Description                                                                                  |
| -------------------- | ------------- | ------- | -------------------------------------------------------------------------------------------- |
| `options`            | `object`      | -       | Configuration options for retrieving alias information.                                      |
| `options.alias`      | `string`      | -       | The alias address                                                                            |
| `options.aliasChain` | `ALIAS_CHAIN` | -       | The name of the alias chain, which can be 'POLYGON' or 'BSC' or 'OPTIMISM' or 'POLYGONZKEVM' |

### **Stream Notifications**

```tsx
// userAlice.stream(listen, {options?})
// Initial setup
const stream = await userAlice.initStream([CONSTANTS.STREAM.NOTIF], {
  filter: {
    channels: ['*'], // pass in specific channels to only listen to those
    chats: ['*'], // pass in specific chat ids to only listen to those
  },
  connection: {
    retries: 3, // number of retries in case of error
  },
  raw: false, // enable true to show all data
});

// Listen for notifications events
stream.on(CONSTANTS.STREAM.NOTIF, (data: any) => {
  console.log(data);
});

// Connect stream, Important to setup up listen events first
stream.connect();

// stream supports other products as well, such as STREAM.CHAT, STREAM.CHAT_OPS
// more info can be found at push.org/docs/chat
```

**Parameters:**
| Param | Type | Default | Remarks |
| ----- | ---- | ------- | ------- |
| `listen` | `constant` | - | can be `CONSTANTS.STREAM.CHAT`, `CONSTANTS.STREAM.CHAT_OPS`, `CONSTANTS.STREAM.NOTIF`, `CONSTANTS.STREAM.CONNECT`, `CONSTANTS.STREAM.DISCONNECT` |
| `options`\* | `PushStreamInitializeProps` | - | Optional configuration properties for initializing the stream. |
| `options.filter`\* | `object` | - | Option to configure to enable listening to only certain chats or notifications. |
| `options.filter.channels`\* | `array of strings` | `['*']` | pass list of **channels** over here to only listen to notifications coming from them. |
| `options.filter.chats`\* | `array of strings` | `['*']` | pass list of **chatids** over here to only listen to chats coming from them. |
| `options.connection`\* | `object` | - | Option to configure the connection settings of the stream |
| `options.connection.retries`\* | `number` | `3` | Number of automatic retries incase of error |
| `options.raw`\* | `boolean` | `false` | If enabled, will also respond with meta data useful in verifying the integrity of incoming chats or notifications among other things. |

**Stream Notification Events**

| Listen events                 | When is it triggered?                                  |
| ----------------------------- | ------------------------------------------------------ |
| `CONSTANTS.STREAM.NOTIF`      | Whenever a new notification is emitted for the wallet. |
| `CONSTANTS.STREAM.CONNECT`    | Whenever the stream establishes connection.            |
| `CONSTANTS.STREAM.DISCONNECT` | Whenever the stream gets disconnected.                 |

---

## For Push Chat

> Initializing User is the first step before proceeding to Chat APIs. Please refer [Manage User Section](#initialize)

### **Fetch List of Chats**

```typescript
// List all chats
const aliceChats = await userAlice.chat.list('CHATS');
// List all chat requests
const aliceRequests = await userAlice.chat.list('REQUESTS');
```

| Param              | Type                  | Default | Remarks                                            |
| ------------------ | --------------------- | ------- | -------------------------------------------------- |
| `type`             | `CHATS` or `REQUESTS` | -       | Type of Chats to be listed                         |
| `options` \*       | `Object`              | -       | Optional configuration properties for listing chat |
| `options.page` \*  | `number`              | `1`     | The page number for pagination                     |
| `options.limit` \* | `number`              | `10`    | The maximum number of items to retrieve per page   |

\* - Optional

---

### **Fetch Latest Chat**

```typescript
// Latest Chat message with the target(bob) user
const aliceChats = await userAlice.chat.latest(bobAddress);
```

| Param       | Type     | Default | Remarks                                                                             |
| ----------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `recipient` | `string` | -       | Target DID ( For Group Chats target is chatId, for 1 To 1 chat target is Push DID ) |

---

### **Fetch Chat History**

```typescript
// userAlice.chat.history(recipient. {options?})
const aliceChatHistoryWithBob = await userAlice.chat.history(bobAddress);
```

| Param                 | Type               | Default | Remarks                                                                                                                         |
| --------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `recipient`           | `string`           | -       | Target DID ( For Group Chats target is chatId, for 1 To 1 chat target is Push DID )                                             |
| `options` \*          | `object`           | -       | Optional Configuration for fetching chat history                                                                                |
| `options.reference`\* | `string` or `null` | -       | Refers to message refernce hash from where the previous messages are fetched. If null, messages are fetched from latest message |
| `options.limit` \*    | `number`           | 10      | No. of messages to be loaded                                                                                                    |

\* - Optional

---

### **Send Message**

```typescript
// Alice sends message to bob
const aliceMessagesBob = await userAlice.chat.send(bobAddress, {
  content: 'Hello Bob!',
  type: 'Text',
});
```

| Param                  | Type                                                                                                                                                                                                                               | Default | Remarks                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `recipient`            | `string`                                                                                                                                                                                                                           | -       | Recipient ( For Group Chats target is chatId, for 1 To 1 chat target is Push DID ) |
| `options`              | `object`                                                                                                                                                                                                                           | -       | Configuration for message to be sent                                               |
| `options.type` \*      | `Text` or `Image` or `Audio` or `Video` or `File` or `MediaEmbed` or `GIF` or `Meta` or `Reaction` or `Receipt` or `Intent` or `Reply` or `Composite`                                                                              | -       | Type of message Content                                                            |
| `options.content`      | `string` or `{type: `Text`or`Image`or`Audio`or`Video`or`File`or`MediaEmbed`or`GIF` ; content: string}` [For Reply] or `{type: `Text`or`Image`or`Audio`or`Video`or`File`or`MediaEmbed`or`GIF` ; content: string}[]` [For Composite] | -       | Message Content                                                                    |
| `options.reference` \* | `string`                                                                                                                                                                                                                           | -       | Message reference hash ( Only available for Reaction & Reply Messages )            |
| `options.info` \*      | `{ affected : string[]: arbitrary?: { [key: string]: any } }`                                                                                                                                                                      | -       | Message reference hash ( Only available for Meta & UserActivity Messages )         |

\* - Optional

---

### **Accept Chat Request**

```typescript
// Accept Chat Request of Alice
const bobAcceptAliceRequest = await userBob.chat.accept(aliceAddress);
```

| Param       | Type     | Default | Remarks                                                                             |
| ----------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `recipient` | `string` | -       | Target ( For Group Chats target is chatId, for 1 To 1 chat target is Push Account ) |

---

### **Reject Chat Request**

```typescript
// Accept Chat Request of alice
await userBob.chat.reject(aliceAddress);
```

| Param       | Type     | Default | Remarks                                                                             |
| ----------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `recipient` | `string` | -       | Target ( For Group Chats target is chatId, for 1 To 1 chat target is Push Account ) |

---

### **Block Chat User**

```typescript
// Block chat user
const AliceBlocksBob = await userAlice.chat.block([bobAddress]);
```

| Param   | Type       | Default | Remarks              |
| ------- | ---------- | ------- | -------------------- |
| `users` | `string[]` | -       | Users to be blocked. |

---

### **Unblock Chat User**

```typescript
// Unblock chat user
const AliceUnblocksBob = await userAlice.chat.unblock([bobAddress]);
```

| Param   | Type       | Default | Remarks                |
| ------- | ---------- | ------- | ---------------------- |
| `users` | `string[]` | -       | Users to be unblocked. |

---

### **Create Group**

```typescript
// Create a Group
// userAlice.chat.group.create(name, {options?})
const createdGroup = await userAlice.chat.group.create(name);
```

| Param                    | Type       | Default | Remarks                                    |
| ------------------------ | ---------- | ------- | ------------------------------------------ |
| `name`                   | `string`   | -       | The name of the group to be created.       |
| `options` \*             | `object`   | -       | Optional Configuration for creating group. |
| `options.description` \* | `string`   | -       | A description of the group.                |
| `options.image` \*       | `string`   | -       | Image for the group.                       |
| `options.members` \*     | `string[]` | `[]`    | An array of member DID.                    |
| `options.admins` \*      | `string[]` | -       | An array of admin DID.                     |
| `options.private` \*     | `boolean`  | `false` | Indicates if the group is private.         |
| `options.rules` \*       | `any[]`    | -       | Conditions for entry to the group.         |

\* - Optional

---

### **Fetch Group Info**

```typescript
// Fetch Group Info
const fetchGroupInfo = await userAlice.chat.group.info(groupChatId);
```

| Param    | Type     | Default | Remarks      |
| -------- | -------- | ------- | ------------ |
| `chatId` | `string` | -       | Group ChatId |

---

### **Fetch Group Permissions**

```typescript
// Fetch Group Permissions
const fetchGroupPermissions = await userAlice.chat.group.permissions(
  groupChatId
);
```

| Param    | Type     | Default | Remarks      |
| -------- | -------- | ------- | ------------ |
| `chatId` | `string` | -       | Group ChatId |

---

### **Update Group**

```typescript
// Update Group Info
// userAlice.chat.group.update(chatid, {options?})
const updatedGroup = await userAlice.chat.group.update(chatid, options);
```

| Param                   | Type                     | Default | Remarks                                                                                                                                                                                                                          |
| ----------------------- | ------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chatId`                | `string`                 | -       | Unique identifier of the group.                                                                                                                                                                                                  |
| `options` \*            | `object`                 | -       | Optional Configuration for updating group.                                                                                                                                                                                       |
| `options.name` \*       | `string`                 | -       | Updated Group Name                                                                                                                                                                                                               |
| `options.description`\* | `string`                 | -       | Updated Description                                                                                                                                                                                                              |
| `options.image`\*       | `string`(base 64 format) | -       | Updated Image                                                                                                                                                                                                                    |
| `options.private`\*     | `boolean`                | `false` | Indicates if the group is private.                                                                                                                                                                                               |
| `options.rules` \*      | `any[]`                  | -       | Define conditions such as token gating, nft gating, custom endpoint for joining or sending message in a group. See conditional group gating to understand rule engine and how to fine tune conditional rules of your group Rules |

\* - Optional

---

### **Add To Group**

```typescript
// await userAlice.chat.group.add(chatid, {options?})
const addAdminToGroup = await userAlice.chat.group.add(groupChatId, {
  role: 'ADMIN', // 'ADMIN' or 'MEMBER'
  accounts: [account1, account2],
});
```

| Param              | Type                | Default | Remarks                                         |
| ------------------ | ------------------- | ------- | ----------------------------------------------- |
| `chatId`           | `string`            | -       | Unique identifier of the group.                 |
| `options`          | `object`            | -       | Configuration for adding participants to group. |
| `options.role`     | `ADMIN` or `MEMBER` | -       | Role of added participant                       |
| `options.accounts` | `string[]`          | -       | Added participant addresses                     |

---

### **Remove From Group**

```typescript
// await userAlice.chat.group.remove(chatid, {options?})
const removeAdminFromGroup = await userAlice.chat.group.remove(groupChatId, {
  role: 'ADMIN', // 'ADMIN' or 'MEMBER'
  accounts: [account1, account2],
});
```

| Param              | Type                | Default | Remarks                                         |
| ------------------ | ------------------- | ------- | ----------------------------------------------- |
| `chatId`           | `string`            | -       | Unique identifier of the group.                 |
| `options`          | `object`            | -       | Configuration for adding participants to group. |
| `options.role`     | `ADMIN` or `MEMBER` | -       | Role of added participant                       |
| `options.accounts` | `string[]`          | -       | Added participant addresses                     |

---

### **Join Group**

```typescript
const joinGroup = await userAlice.chat.group.join(groupChatId);
```

| Param    | Type     | Default | Remarks                         |
| -------- | -------- | ------- | ------------------------------- |
| `chatId` | `string` | -       | Unique identifier of the group. |

---

### **Leave Group**

```typescript
// Leave Group
const leaveGrp = await userAlice.chat.group.leave(groupChatId);
```

| Param    | Type     | Default | Remarks                         |
| -------- | -------- | ------- | ------------------------------- |
| `chatId` | `string` | -       | Unique identifier of the group. |

---

### **Reject Group Joining Request**

```typescript
// Reject Group Request
await userAlice.chat.group.reject(groupChatId);
```

| Param    | Type     | Default | Remarks                         |
| -------- | -------- | ------- | ------------------------------- |
| `chatId` | `string` | -       | Unique identifier of the group. |

---

### **Stream Chat Events**

```tsx
// Initialize stream to listen for events:
const stream = await userAlice.initStream(
  [
    CONSTANTS.STREAM.CHAT, // Listen for chat messages
    CONSTANTS.STREAM.NOTIF, // Listen for notifications
    CONSTANTS.STREAM.CONNECT, // Listen for connection events
    CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
  ],
  {
    // Filter options:
    filter: {
      // Listen to all channels and chats (default):
      channels: ['*'],
      chats: ['*'],

      // Listen to specific channels and chats:
      // channels: ['channel-id-1', 'channel-id-2'],
      // chats: ['chat-id-1', 'chat-id-2'],

      // Listen to events with a specific recipient:
      // recipient: '0x...' (replace with recipient wallet address)
    },
    // Connection options:
    connection: {
      retries: 3, // Retry connection 3 times if it fails
    },
    raw: false, // Receive events in structured format
  }
);

// Chat event listeners:

// Stream connection established:
stream.on(CONSTANTS.STREAM.CONNECT, async (a) => {
  console.log('Stream Connected');

  // Send initial message to PushAI Bot:
  console.log('Sending message to PushAI Bot');

  await userAlice.chat.send(pushAIWalletAddress, {
    content: 'Hello, from Alice',
    type: 'Text',
  });

  console.log('Message sent to PushAI Bot');
});

// Chat message received:
stream.on(CONSTANTS.STREAM.CHAT, (message) => {
  console.log('Encrypted Message Received');
  console.log(message); // Log the message payload
});

// Chat operation received:
stream.on(CONSTANTS.STREAM.CHAT_OPS, (data) => {
  console.log('Chat operation received.');
  console.log(data); // Log the chat operation data
});

// Connect the stream:
await stream.connect(); // Establish the connection after setting up listeners

// Stream disconnection:
stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
  console.log('Stream Disconnected');
});

// Stream Chat also supports other products like CONSTANTS.STREAM.NOTIF.
// For more information, please refer to push.org/docs/notifications.
```

**Stream chat parameters**
| Param| Type| Default| Remarks|
| ---- | --- | ------ | ------- |
| `listen` | `constant`| -| Choose from various streams: `CONSTANTS.STREAM.CHAT`, `CONSTANTS.STREAM.CHAT_OPS`, `CONSTANTS.STREAM.NOTIF`, `CONSTANTS.STREAM.CONNECT`, `CONSTANTS.STREAM.DISCONNECT` |
| `options`\* | `PushStreamInitializeProps` | -| Optional configuration properties for initializing the stream.|
|`options.filter`\*| `object`| -| Configure to listen to specific chats or notifications.|
| `options.filter.channels`\*| `array of strings` | `['*']` | Pass list of **channels** over here to only listen to notifications coming from them. |
| `options.filter.chats`\*| `array of strings` | `['*']` | Pass list of **chatids** over here to only listen to chats coming from them. |
| `options.connection`\*| `object` | - | Option to configure the connection settings of the stream |
| `options.connection.retries`\* | `number`| `3`| Number of automatic retries incase of error|
| `options.raw`\*| `boolean`| `false`| If enabled, respond with metadata useful in verifying the integrity of incoming chats or notifications among other things. |

**Stream chat listen events**

| Listen events                 | When is it triggered?                       |
| ----------------------------- | ------------------------------------------- |
| `CONSTANTS.STREAM.CHAT`       | Whenever a chat is received.                |
| `CONSTANTS.STREAM.CHAT_OPS`   | Whenever a chat operation is received.      |
| `CONSTANTS.STREAM.CONNECT`    | Whenever the stream establishes connection. |
| `CONSTANTS.STREAM.DISCONNECT` | Whenever the stream gets disconnected.      |

> For Expected Stream Chat Responses, [Visit Push Chat Docs](https://push.org/docs/chat/build/stream-chat/)

---

## For Push Spaces

### **To create a space**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.space.create({
  spaceName:'wasteful_indigo_warbler',
  spaceDescription: 'boring_emerald_gamefowl',
  listeners: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  spaceImage: &lt;space image link&gt; ,
  speakers: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  isPublic: true,
  account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
  env: 'staging',
  pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
  scheduleAt: new Date("2024-07-15T14:48:00.000Z"),
  scheduleEnd: new Date("2024-07-15T15:48:00.000Z")
});
```

### **To create a token gated space**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.space.create({
  spaceName:'wasteful_indigo_warbler',
  spaceDescription: 'boring_emerald_gamefowl',
  listeners: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  spaceImage: &lt;space image link&gt; ,
  speakers: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  rules: {
    'spaceAccess': {
      'conditions': [
        {
          'any': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'holder',
              'data': {
                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            }
          ]
        }
      ]
    }
  },
  isPublic: true,
  account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
  env: 'staging',
  pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
  scheduleAt: new Date("2024-07-15T14:48:00.000Z"),
  scheduleEnd: new Date("2024-07-15T15:48:00.000Z")
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| account_ | string | - | user address |
| spaceName* | string | - | group name |
| spaceDescription* | string | - | group description |
| spaceImage* | string | - | group image link |
| listeners* | Array<string> | - | wallet addresses of all listeners except speakers and spaceCreator |
| speakers* | Array<string> | - | wallet addresses of all speakers except listeners and spaceCreator |
| isPublic* | boolean | - | true for public space, false for private space |
| scheduleAt\* | Date | - | Date time when the space is scheduled to start |
| scheduleEnd | Date | - | Date time when the space is scheduled to end |
| contractAddressERC20 (deprecated) | string | null | ERC20 Contract Address |
| numberOfERC20 (deprecated) | int | 0 | Minimum number of tokens required to join the group |
| contractAddressNFT (deprecated) | string | null | NFT Contract Address |
| numberOfNFTTokens (deprecated) | int | 0 | Minimum number of nfts required to join the group |
| rules | Rules | - | conditions for space access (see format below) |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

## **Rules format**

```typescript
export enum ConditionType {
  PUSH = 'PUSH',
  GUILD = 'GUILD',
}

export type Data = {
  contract?: string;
  amount?: number;
  decimals?: number;
  guildId?: string;
  guildRoleId?: string;
  guildRoleAction?: 'all' | 'any';
  url?: string;
  comparison?: '>' | '<' | '>=' | '<=' | '==' | '!=';
};

export type ConditionBase = {
  type?: ConditionType;
  category?: string;
  subcategory?: string;
  data?: Data;
  access?: Boolean;
};

export type Condition = ConditionBase & {
  any?: ConditionBase[];
  all?: ConditionBase[];
};

export interface Rules {
  entry?: {
    conditions: Array<Condition | ConditionBase>;
  };
  chat?: {
    conditions: Array<Condition | ConditionBase>;
  };
}
```

---

### **To check user access of a token gated space**

```typescript

// actual api
const response = await PushAPI.space.getAccess({
  spaceId:'8f7be0068a677df166c2e5b8a9030fe8a4341807150339e588853c0049df3106',
  did: '0x9e60c47edF21fa5e5Af33347680B3971F2FfD464'
  env: 'staging',
});
```

Allowed Options (params with \_ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId | string | - | space address |
| did | string | - | user address |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To update space details**

Note - updateSpace is an idompotent call

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.space.update({
    spaceId: 'spaces:e0553610da88dacac70b406d1222a6881c0bde2c5129e58b526b5ae729d82116',
    spaceName: 'Push Space 3',
    spaceDescription: 'This is the oficial space for Push Protocol',
    listeners: ['0x2e60c47edF21fa5e5A333347680B3971F1FfD456','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    spaceImage: &lt;group image link&gt; ,
    speakers: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
	  scheduleAt: '2023-07-15T14:48:00.000Z',
	  scheduleEnd: '2023-07-15T15:48:00.000Z',
    status: PushAPI.ChatStatus.PENDING,
    account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
    env: 'staging',
    pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

### **To update token gated space details**

Note - updateSpace is an idompotent call

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.space.update({
    spaceId: 'spaces:e0553610da88dacac70b406d1222a6881c0bde2c5129e58b526b5ae729d82116',
    spaceName: 'Push Space 3',
    spaceDescription: 'This is the oficial space for Push Protocol',
    listeners: ['0x2e60c47edF21fa5e5A333347680B3971F1FfD456','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    spaceImage: &lt;group image link&gt; ,
    speakers: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
	  scheduleAt: '2023-07-15T14:48:00.000Z',
	  scheduleEnd: '2023-07-15T15:48:00.000Z',
    status: PushAPI.ChatStatus.PENDING,
    rules: {
      'entry': {
        'conditions': [
          {
            'any': [
              {
                'type': 'PUSH',
                'category': 'ERC20',
                'subcategory': 'token_holder',
                'data': {
                  'address': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                  'amount': 1000,
                  'decimals': 18
                }
              },
              {
                'type': 'GUILD',
                'category': 'guildRoles',
                'subcategory': 'allRoles',
                'data': {
                  'guildId': '13468'
                }
              }
            ]
          }
        ]
      },
      'chat': {
        'conditions': [
          {
            'all': [
              {
                'type': 'PUSH',
                'category': 'ERC20',
                'subcategory': 'token_holder',
                'data': {
                  'address': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                  'amount': 1000,
                  'decimals': 18
                }
              },
              {
                'type': 'GUILD',
                'category': 'guildRoles',
                'subcategory': 'specificRole',
                'data': {
                  'guildId': '13468',
                  'guildRoleId': '19924'
                }
              }
            ]
          }
        ]
      }
    },
    account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
    env: 'staging',
    pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId_ | string | - | Id of the space |
| account* | string | - | user address |
| spaceName* | string | - | space name |
| spaceDescription* | string | - | space description |
| spaceImage* | string | - | space image |
| status* | string | - | space status - 'ACTIVE', 'PENDING', 'ENDED' |
| listeners* | Array<string> | - | wallet addresses of all listeners except speakers and spaceCreator |
| speakers* | Array<string> | - | wallet addresses of all speakers except listeners and spaceCreator |
| scheduleAt* | Date | - | Date time when the space is scheduled to start |
| scheduleEnd | Date | - | Date time when the space is scheduled to end |
| contractAddressERC20 (deprecated) | string | null | ERC20 Contract Address |
| numberOfERC20 (deprecated) | int | 0 | Minimum number of tokens required to join the space |
| contractAddressNFT (deprecated) | string | null | NFT Contract Address |
| numberOfNFTTokens (deprecated) | int | 0 | Minimum number of nfts required to join the space |
| rules | Rules | - | conditions for space and chat access (see format above) |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To get space details by spaceId**

```typescript
const response = await PushAPI.space.get({
  spaceId:
    'spaces:108f766a5053e2b985d0843e806f741da5ad754d128aff0710e526eebc127afc',
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId_ | string | - | space id |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To start a space**

```typescript
const response = await PushAPI.space.start({
  spaceId:
    'spaces:108f766a5053e2b985d0843e806f741da5ad754d128aff0710e526eebc127afc',
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId_ | string | - | space id |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To stop a space**

```typescript
const response = await PushAPI.space.stop({
  spaceId:
    'spaces:108f766a5053e2b985d0843e806f741da5ad754d128aff0710e526eebc127afc',
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId_ | string | - | space id |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To approve a space request**

```typescript
const response = await PushAPI.space.approve({
  status: 'Approved',
  account: '0x18C0Ab0809589c423Ac9eb42897258757b6b3d3d',
  senderAddress: '0x873a538254f8162377296326BB3eDDbA7d00F8E9', // spaceId
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| status | 'Approved' | 'Approved' | flag for approving and rejecting space request, supports only approving for now|
| senderAddress_ | string | - | space request sender's address or spaceId of a space |
| signer\* | - | - | signer object |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To add listeners to space**

```typescript
const response = await PushAPI.space.addListeners({
  spaceId,
  listeners: [
    `eip155:0x65585D8D2475194A26C0B187e6bED494E5D68d5F`,
    `eip155:0xE99F29C1b2A658a478E7766D5A2bB28322326C45`,
  ],
  signer: signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: env as ENV,
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId_ | string | - | space id |
| listeners | Array | - | new listeners that needs to be added to the space. Don't add listeners which are already part of space |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To remove listeners from space**

```typescript
const response = await PushAPI.space.removeListeners({
  spaceId,
  listeners: [
    `eip155:0xB12869BD3a0F9109222D67ba71e8b109B46908f9`,
    `eip155:0x2E3af36E1aC6EEEA2C0d59E43Be1926aBB9eE0BD`,
  ],
  signer: signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: env as ENV,
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId_ | string | - | space id |
| listeners | Array | - | existing listeners that needs to be removed from the space. Don't add listeners which are not part of space |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To add speakers to space**

```typescript
const response = await PushAPI.space.addSpeakers({
  spaceId,
  listeners: [
    `eip155:0x65585D8D2475194A26C0B187e6bED494E5D68d5F`,
    `eip155:0xE99F29C1b2A658a478E7766D5A2bB28322326C45`,
  ],
  signer: signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: env as ENV,
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId_ | string | - | space id |
| speakers | Array | - | new speakers that needs to be added to the space. Don't add speakers which are already part of space |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **To remove speakers from space**

```typescript
const response = await PushAPI.space.removeSpeakers({
  spaceId,
  speakers: [
    `eip155:0xB12869BD3a0F9109222D67ba71e8b109B46908f9`,
    `eip155:0x2E3af36E1aC6EEEA2C0d59E43Be1926aBB9eE0BD`,
  ],
  signer: signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: env as ENV,
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| spaceId_ | string | - | space id |
| speakers | Array | - | existing speakers that needs to be removed from the space. Don't add speakers which are not part of space |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

---

### **Fetching list of user spaces**

```typescript
const spaces = await PushAPI.space.spaces({
  account: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  /**
   * Environment variable
   */
  env?: ENV;
});
```

| Param         | Type    | Default | Remarks                                                                |
| ------------- | ------- | ------- | ---------------------------------------------------------------------- |
| account       | string  | -       | user address (Partial CAIP)                                            |
| toDecrypt     | boolean | false   | if "true" the method will return decrypted message content in response |
| pgpPrivateKey | string  | null    | mandatory for users having pgp keys                                    |
| env           | string  | 'prod'  | API env - 'prod', 'staging', 'dev'                                     |

**Example normal user:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  env: ENV.STAGING,
})

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: signer);

// actual api
const spaces = await PushAPI.space.spaces({
    account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
    toDecrypt: true,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: ENV.STAGING,
});
```

**Example NFT user:**

```typescript
// Fetch user
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: env as ENV,
});

// Decrypt PGP Key
const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  signer: nftSigner,
});

// Actual api
const spaces = await PushAPI.space.spaces({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  toDecrypt: true,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: env as ENV,
});
```

---

### **Fetching list of user space requests**

```typescript
const spaces = await PushAPI.space.requests({
  account: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  /**
   * Environment variable
   */
  env?: ENV;
});
```

| Param         | Type    | Default | Remarks                                                                |
| ------------- | ------- | ------- | ---------------------------------------------------------------------- |
| account       | string  | -       | user address (Partial CAIP)                                            |
| toDecrypt     | boolean | false   | if "true" the method will return decrypted message content in response |
| pgpPrivateKey | string  | null    | mandatory for users having pgp keys                                    |
| env           | string  | 'prod'  | API env - 'prod', 'staging', 'dev'                                     |

**Example normal user:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  env: ENV.STAGING,
})

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: signer);

// actual api
const spaces = await PushAPI.space.requests({
    account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
    toDecrypt: true,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: ENV.STAGING,
});
```

**Example NFT user:**

```typescript
// Fetch user
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: env as ENV,
});

// Decrypt PGP Key
const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  signer: nftSigner,
});

// Actual api
const spaces = await PushAPI.space.requests({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  toDecrypt: true,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: env as ENV,
});
```

---

### **Fetching list of trending spaces**

```typescript
const spaces = await PushAPI.space.trending({
  env?: ENV;
});
```

| Param | Type   | Default | Remarks                            |
| ----- | ------ | ------- | ---------------------------------- |
| env   | string | 'prod'  | API env - 'prod', 'staging', 'dev' |
| page  | number | 1       | page index of the results          |
| limit | number | 10      | number of items in 1 page          |

---

## For Push Video

> Initializing User is the first step before proceeding to Initializing Video API. Please refer [Manage User Section](#initialize)

#### **data & setData**

```tsx
import { TYPES, CONSTANTS } from '@pushprotocol/restapi';

// 1. For a vanilla JS project
let data: TYPES.VIDEO.DATA = CONSTANTS.VIDEO.INITIAL_DATA;
/*
- fn function is supplied by the caller of setData()
- fn is a function that accepts current 'data' as input and returns updated 'data'
*/
const setData = (fn: (data: TYPES.VIDEO.DATA) => TYPES.VIDEO.DATA): void => {
  /*
    - Here, we are passing the current value of 'data' to fn
    - The return value of fn() i.e., the updated value of 'data' is assigned back to 'data'
  */
  data = fn(data);
};

// 2. For a React project
import { useState } from 'react';
const [data, setData] = useState<TYPES.VIDEO.DATA>(
  CONSTANTS.VIDEO.INITIAL_DATA
);
```

---

### **Stream Video**

These APIs enable you to receive incoming video call request and other video events in real time without polling the API. Push Video achieves this by the use of sockets.

```tsx
import { CONSTANTS, TYPES } from '@pushprotocol/restapi';

// userAlice.initStream(listen, {options?})
// Initial setup
const stream = await userAlice.initStream([CONSTANTS.STREAM.VIDEO], {
  filter: {
    channels: ['*'], // pass in specific channels to only listen to those
    chats: ['*'], // pass in specific chat ids to only listen to those
  },
  connection: {
    retries: 3, // number of retries in case of error
  },
  raw: false, // enable true to show all data
});

// Listen for video events
await stream.on(CONSTANTS.STREAM.VIDEO, (data: TYPES.VIDEO.EVENT) => {
  console.log(data);
});

// Connect stream, Important to setup up listen first
stream.connect();

// stream supports other products as well, such as CONSTANTS.STREAM.NOTIF, CONSTANTS.STREAM.CHAT
// more info can be found at push.org/docs
```

**Stream chat parameters**
| Param| Type| Default| Remarks|
| ---- | --- | ------ | ------- |
| `listen` | `constant`| -| Choose from various streams: `CONSTANTS.STREAM.VIDEO`,`CONSTANTS.STREAM.CHAT`, `CONSTANTS.STREAM.CHAT_OPS`, `CONSTANTS.STREAM.NOTIF`, `CONSTANTS.STREAM.CONNECT`, `CONSTANTS.STREAM.DISCONNECT` |
| `options`\* | `PushStreamInitializeProps` | -| Optional configuration properties for initializing the stream.|
|`options.filter`\*| `object`| -| Configure to listen to specific chats or notifications.|
| `options.filter.channels`\*| `array of strings` | `['*']` | Pass list of **channels** over here to only listen to notifications coming from them. |
| `options.filter.chats`\*| `array of strings` | `['*']` | Pass list of **chatids** over here to only listen to chats coming from them. |
| `options.connection`\*| `object` | - | Option to configure the connection settings of the stream |
| `options.connection.retries`\* | `number`| `3`| Number of automatic retries incase of error|
| `options.raw`\*| `boolean`| `false`| If enabled, respond with metadata useful in verifying the integrity of incoming chats or notifications among other things. |

\* - Optional

**Stream events**

| Listen events                 | When is it triggered?                       |
| ----------------------------- | ------------------------------------------- |
| `CONSTANTS.STREAM.VIDEO`      | Whenever video call operation is received.  |
| `CONSTANTS.STREAM.CHAT`       | Whenever a chat is received.                |
| `CONSTANTS.STREAM.CHAT_OPS`   | Whenever a chat operation is received.      |
| `CONSTANTS.STREAM.CONNECT`    | Whenever the stream establishes connection. |
| `CONSTANTS.STREAM.DISCONNECT` | Whenever the stream gets disconnected.      |

> For Expected Stream Responses, [Visit Push Chat Docs](https://push.org/docs/video/build/stream-video/)

---

### **Initializing Video API**

```tsx
// Initialising the video API
// async initialize(onChange, {options?});
const aliceVideoCall = await userAlice.video.initialize(setData, {
  stream: stream, // pass the stream object created using Stream API, please refer to [Initializing Stream API] to learn how to get this stream object.
  config: {
    video: true, // to enable video on start, for frontend use
    audio: true, // to enable audio on start, for frontend use
  },
  media: MediaStream, // to pass your existing media stream(for backend use)
});
```

**Parameters:**
| Param | Type | Sub-Type | Default | Remarks |
| ------------ | ------------------------ | ------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onChange` | `constant` | - | - | Function to update the video call data, takes a function as an argument which receives the latest state of data as a param and should return the modified/new state of data |
| `options` | `VideoInitializeOptions` | - | - | configuration properties for initializing the video. |
| - | `options.stream` | `PushStream` | - | Option to configure to enable listening to only certain chats or notifications. |
| - | `options.config.video`\* | `boolean` | - | pass `true`to enable video on start, else pass `false`. |
| - | `options.config.audio`\* | `boolean` | - | pass `true`to enable audio on start, else pass `false`. |
| - | `options.media`\* | `MediaStream` | - | Local stream. For backend use. Defaults to `null`. |

\* - Optional

### **Request a Video Call**

```tsx
// Make a video call request to recipient
// aliceVideoCall.request(recipients[], options?);
await aliceVideoCall.request([recipient]);
```

**Parameters:**
| Param | Type | Sub Type | Description |
| -------------- | ----------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `recipients` | `string[]` | - | Wallet address or addresses of the recipient(s) |
| `options`\* | `VideoInitializeOptions` | - | - |
| | `options.rules.access.type` | `string` | Identifier for Push Video or Space. We use `VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT` from `@pushprotocol/restapi` here for Push Video |
| | `options.rules.access.data.chatId?` | `string` | Unique identifier for every push chat, here, the one between the alice and the bob |

\* - Optional

### **Approve a incoming video call request**

```tsx
// aliceVideoCall.approve(address?);
await aliceVideoCall.approve();
```

**Parameters:**
| Param | Type | Sub Type | Description |
| -------------- | ----------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `address`\* | `string` | - | Wallet address of the caller, received in stream listener(s) |

\* - Optional

---

### **Reject an incoming video call request**

```tsx
// aliceVideoCall.deny(address?);
await aliceVideoCall.deny();
```

**Parameters:**
| Param | Type | Sub Type | Description |
| -------------- | ----------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `address`\* | `string` | - | Wallet address of the caller, received in stream listener(s) |

\* - Optional

---

### **Disconnect an ongoing video call**

```tsx
// aliceVideoCall.disconnect();
await aliceVideoCall.disconnect();
```

---

### **Manage Media Config**

```tsx
aliceVideoCall.config({
  video: true, // true to enable and false to disable video
  audio: true, // true to enable and false to disable audio
});
```

**Parameters:**
| Property | Type | Description |
| -------- | --------- | --------------------------------------------------- |
| `video`\* | `Boolean` | `true` to enable video and `false` to disable video |
| `audio`\* | `Boolean` | `true` to enable audio and `false` to disable audio |

\* - Optional

---

### **Read current media state**

- `data.local.stream` will hold the media stream of local video.
- `data.incoming[0].stream` will hold the media stream of the peer.
- `data.local.audio` will be `true` if the local user audio is enabled and vice versa.
- `data.local.video` will be `true` if the local user video is enabled and vice versa.
- `data.incoming[0].audio` will be `true` if the remote user audio is enabled and vice versa.
- `data.incoming[0].video` will be `true` if the remote user video is enabled and vice versa.

---
