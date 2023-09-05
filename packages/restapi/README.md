# restapi

This package gives access to Push Protocol (Push Nodes) APIs. Visit [Developer Docs](https://docs.push.org/developers) or [Push.org](https://push.org) to learn more.

# Index

- [restapi](#restapi)
- [Index](#index)
- [How to use in your app?](#how-to-use-in-your-app)
  - [Installation](#installation)
  - [Import SDK](#import-sdk)
  - [About generating the "signer" object for different platforms](#about-generating-the-signer-object-for-different-platforms)
    - [When using in SERVER-SIDE code:](#when-using-in-server-side-code)
    - [When using in FRONT-END code:](#when-using-in-front-end-code)
  - [About blockchain agnostic address format](#about-blockchain-agnostic-address-format)
    - [Chat blockchain agnostic address format](#chat-blockchain-agnostic-address-format)
  - [About Push contract addresses](#about-push-contract-addresses)
    - [Push core contract address](#push-core-contract-address)
    - [Push communicator contract address](#push-communicator-contract-address)
- [SDK Features](#sdk-features)
  - [For Notification](#for-notification)
    - [Fetching user notifications](#fetching-user-notifications)
    - [Fetching user spam notifications](#fetching-user-spam-notifications)
    - [Fetching user subscriptions](#fetching-user-subscriptions)
    - [Fetching channel details](#fetching-channel-details)
    - [Searching for channel(s)](#searching-for-channels)
    - [Opt in to a channel](#opt-in-to-a-channel)
    - [Opt out to a channel](#opt-out-to-a-channel)
    - [Sending notification](#sending-notification)
      - [Direct payload for single recipient(target)](#direct-payload-for-single-recipienttarget)
      - [Direct payload for group of recipients(subset)](#direct-payload-for-group-of-recipientssubset)
      - [Direct payload for all recipients(broadcast)](#direct-payload-for-all-recipientsbroadcast)
      - [IPFS payload for single recipient(target)](#ipfs-payload-for-single-recipienttarget)
      - [IPFS payload for group of recipients(subset)](#ipfs-payload-for-group-of-recipientssubset)
      - [IPFS payload for all recipients(broadcast)](#ipfs-payload-for-all-recipientsbroadcast)
      - [Minimal payload for single recipient(target)](#minimal-payload-for-single-recipienttarget)
      - [Minimal payload for a group of recipient(subset)](#minimal-payload-for-a-group-of-recipientsubset)
      - [Minimal payload for all recipients(broadcast)](#minimal-payload-for-all-recipientsbroadcast)
      - [Graph payload for single recipient(target)](#graph-payload-for-single-recipienttarget)
      - [Graph payload for group of recipients(subset)](#graph-payload-for-group-of-recipientssubset)
      - [Graph payload for all recipients(broadcast)](#graph-payload-for-all-recipientsbroadcast)
    - [Notification Helper Utils](#notification-helper-utils)
      - [Parsing notifications](#parsing-notifications)
    - [Advanced Notifications (WIP)](#advanced-notifications-wip)
    - [DEPRECATED](#deprecated)
      - [Get a channel's subscriber list of addresses](#get-a-channels-subscriber-list-of-addresses)
  - [For Chat](#for-chat)
    - [Create user for chat](#create-user-for-chat)
    - [Get user data for chat](#get-user-data-for-chat)
    - [Decrypting encrypted pgp private key from user data](#decrypting-encrypted-pgp-private-key-from-user-data)
    - [Updating User Profile](#updating-user-profile)
    - [Fetching list of user chats](#fetching-list-of-user-chats)
    - [Fetching list of user chat requests](#fetching-list-of-user-chat-requests)
    - [Fetching conversation hash between two users](#fetching-conversation-hash-between-two-users)
    - [Fetching latest chat between two users](#fetching-latest-chat-between-two-users)
    - [Fetching chat history between two users](#fetching-chat-history-between-two-users)
    - [To send a message](#to-send-a-message)
    - [To approve a chat request](#to-approve-a-chat-request)
    - [To create a group](#to-create-a-group)
    - [To create a token gated group](#to-create-a-token-gated-group)
    - [To check user access of a token gated group](#to-check-user-access-of-a-token-gated-group)
    - [To update group details](#to-update-group-details)
    - [To update token gated group details](#to-update-token-gated-group-details)
    - [To get group details by group name](#to-get-group-details-by-group-name)
    - [To get group details by chatId](#to-get-group-details-by-chatid)
    - [Chat Helper Utils](#chat-helper-utils)
      - [Decrypting messages](#decrypting-messages)
  - [For Video](#for-video)
    - [Instance Variables](#instance-variables)
      - [peerInstance](#peerinstance)
      - [signer](#signer)
      - [chainId](#chainid)
      - [pgpPrivateKey](#pgpprivatekey)
      - [env](#env)
    - [data](#data)
      - [setData](#setdata)
    - [Methods](#methods)
      - [constructor](#constructor)
      - [create](#create)
      - [request](#request)
      - [acceptRequest](#acceptrequest)
      - [connect](#connect)
      - [disconnect](#disconnect)
      - [enableVideo](#enablevideo)
      - [enableAudio](#enableaudio)
      - [isInitiator](#isinitiator)
  - [For Spaces](#for-spaces)
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
  - [PushAPI Class](#pushapi-class)
    - [Initialize](#initialize)
    - [Fetch Info](#fetch-info)
    - [Fetch Profile Info](#fetch-profile-info)
    - [Update Profile Info](#update-profile)
    - [Fetch Latest Chat](#fetch-latest-chat)
    - [Fetch Chat History](#fetch-chat-history)
    - [Send Message](#send-message)
    - [Accept Chat Request](#accept-chat-request)
    - [Reject Chat Request](#reject-chat-request)
    - [Block Chat User](#block-chat-user)
    - [Unblock Chat User](#unblock-chat-user)
    - [Create Group](#create-group)
    - [Fetch Group Info](#fetcg-group-info)
    - [Fetch Group Permission](#fetch-group-permissions)
    - [Update Group Info](#update-group-info)
    - [Add To Group](#add-to-group)
    - [Remove From Group](#remove-from-group)
    - [Join Group](#join-group)
    - [Leave Group](#leave-group)
    - [Reject Group Joining Request](#reject-group-joining-request)
    - [Fetch Encryption Info](#fetch-encryption-info)
    - [Update Encryption](#update-encryption)

# How to use in your app?

## Installation

```bash
yarn add @pushprotocol/restapi@latest ethers@^5.6
```

or

```bash
npm install @pushprotocol/restapi@latest ethers@^5.6
```

## Import SDK

```typescript
import * as PushAPI from '@pushprotocol/restapi';
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

## **About Push contract addresses**

### Push core contract address

```
ETH Mainnet - 0x66329Fdd4042928BfCAB60b179e1538D56eeeeeE
```

### Push communicator contract address

```
ETH Mainnet - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
ETH Goerli - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
Polygon Mainnet - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
Polygon Mumbai - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
Binance Mainnet - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
Binance Testnet - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
Optimism Mainnet - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
Optimism Testnet - 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa
```

# SDK Features

## For Notification

### **Fetching user notifications**

```typescript
const notifications = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
  env: 'staging',
});
```

<details>
  <summary><b>Expected response (Fetching user notifications)</b></summary>

```typescript
// PushAPI.user.getFeeds | Response - 200 OK
[
  {
    cta: 'https://idle.finance/#/governance/proposals',
    title: 'New Proposal',
    message:
      '[d:Proposer] : 0xe8eA8bAE250028a8709A3841E0Ae1a44820d677b\n' +
      '\n' +
      '[d:Proposal] : IIP-32: Add Euler staking PYT wrappers for AA tranche to IdleDAI\n' +
      '[timestamp:1676570405.922][timestamp: 1676570405]',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeidgjepmup44yqmghcmmzp5aohj6yemjuwal3hozowp2mnxmtdjv5u/bafkreieqw4su7yuqf5ycow4ajpzjyimfl4umnnoe5fz2mq7ukrmqnesk2y',
    url: 'https://idle.finance/',
    sid: '3401597',
    app: 'Idle Finance',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: 'New Proposal On Idle Finance',
      title: 'Idle Finance - New Proposal',
    },
    secret: '',
  },
  {
    cta: '',
    title: '',
    message: 'hi socket',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeicahk2k5jcprepvqxl7xvh5ia4wyruikvpvcrel2rt7tsuefc7ktu/bafkreihjprcvuf2er5etxh7hsvslxzbntum5fqournkrsrtvhvppwx7jqy',
    url: 'https://www.google.com/',
    sid: '2491520',
    app: 'AKP Test Channel',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: { body: 'hi socket', title: 'AKP Test Channel - ' },
    secret: '',
  },
  {
    cta: '',
    title: '',
    message: 'hiii',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeicahk2k5jcprepvqxl7xvh5ia4wyruikvpvcrel2rt7tsuefc7ktu/bafkreihjprcvuf2er5etxh7hsvslxzbntum5fqournkrsrtvhvppwx7jqy',
    url: 'https://www.google.com/',
    sid: '2490919',
    app: 'AKP Test Channel',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: { body: 'hiii', title: 'AKP Test Channel - ' },
    secret: '',
  },
  {
    cta: '',
    title: '',
    message: 'Hey -testing',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeifvbiegzbgyoikdxe2rqhxf2uuvrqtfmllzy2ueidzyxnqkvkuizu/bafkreia26pvmuo2ugyub7boo2zxxj6dqhwqt3gcllpotmau3t7gsvy6vfq',
    url: 'https://gnosis.io',
    sid: '2429211',
    app: 'Gnosis',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: { body: 'Hey -testing', title: 'Gnosis - ' },
    secret: '',
  },
  {
    cta: '',
    title: '',
    message: 'Hey',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeifvbiegzbgyoikdxe2rqhxf2uuvrqtfmllzy2ueidzyxnqkvkuizu/bafkreia26pvmuo2ugyub7boo2zxxj6dqhwqt3gcllpotmau3t7gsvy6vfq',
    url: 'https://gnosis.io',
    sid: '2429210',
    app: 'Gnosis',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: { body: 'Hey', title: 'Gnosis - ' },
    secret: '',
  },
  {
    cta: 'https://idle.finance/#/governance/proposals',
    title: 'New Proposal',
    message:
      '[d:Proposer] : 0xe8eA8bAE250028a8709A3841E0Ae1a44820d677b\n' +
      '\n' +
      '[d:Proposal] : IIP-31: Add AA Euler staking PYT wrappers to IdleUSDT, IdleUSDC and IdleWETH. Gauges rate to 0. Extend LM. \n' +
      '[timestamp:1674583206.258][timestamp: 1674583206]',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeidgjepmup44yqmghcmmzp5aohj6yemjuwal3hozowp2mnxmtdjv5u/bafkreieqw4su7yuqf5ycow4ajpzjyimfl4umnnoe5fz2mq7ukrmqnesk2y',
    url: 'https://idle.finance/',
    sid: '1784234',
    app: 'Idle Finance',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: 'New Proposal On Idle Finance',
      title: 'Idle Finance - New Proposal',
    },
    secret: '',
  },
  {
    cta: '',
    title: '',
    message: 'hi 2023',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeicahk2k5jcprepvqxl7xvh5ia4wyruikvpvcrel2rt7tsuefc7ktu/bafkreihjprcvuf2er5etxh7hsvslxzbntum5fqournkrsrtvhvppwx7jqy',
    url: 'https://www.google.com/',
    sid: '1132231',
    app: 'AKP Test Channel',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: { body: 'hi 2023', title: 'AKP Test Channel - ' },
    secret: '',
  },
  {
    cta: '',
    title: '',
    message: 'hi',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeicahk2k5jcprepvqxl7xvh5ia4wyruikvpvcrel2rt7tsuefc7ktu/bafkreihjprcvuf2er5etxh7hsvslxzbntum5fqournkrsrtvhvppwx7jqy',
    url: 'https://www.google.com/',
    sid: '1132230',
    app: 'AKP Test Channel',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: { body: 'hi', title: 'AKP Test Channel - ' },
    secret: '',
  },
  {
    cta: 'https://idle.finance/#/governance/proposals',
    title: 'New Proposal',
    message:
      '[d:Proposer] : 0xe8eA8bAE250028a8709A3841E0Ae1a44820d677b\n' +
      '\n' +
      '[d:Proposal] : IIP-30: Remove idleDAI wrapper for cpFOL-USDC (DAI) senior. Same for idleUSDC with cpWIN-USDC. Remove idleRAI, idleSUSD, idleTUSD and idleFEI from IdleController. Update voting delay in Governor \n' +
      ' \n' +
      '[timestamp:1672769747.911][timestamp: 1672769747]',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeidgjepmup44yqmghcmmzp5aohj6yemjuwal3hozowp2mnxmtdjv5u/bafkreieqw4su7yuqf5ycow4ajpzjyimfl4umnnoe5fz2mq7ukrmqnesk2y',
    url: 'https://idle.finance/',
    sid: '1080072',
    app: 'Idle Finance',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: 'New Proposal On Idle Finance',
      title: 'Idle Finance - New Proposal',
    },
    secret: '',
  },
  {
    cta: 'https://idle.finance/#/governance/proposals',
    title: 'New Proposal',
    message:
      '[d:Proposer] : 0xe8eA8bAE250028a8709A3841E0Ae1a44820d677b\n' +
      '\n' +
      '[d:Proposal] : IIP-29: Remove idleDAI wrapper for cpFOL-USDC (DAI) senior. Same for idleUSDC with cpWIN-USDC. Remove idleRAI, idleSUSD, idleTUSD and idleFEI from IdleController. Update voting delay in Governor \n' +
      ' \n' +
      '[timestamp:1671624005.155][timestamp: 1671624005]',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeidgjepmup44yqmghcmmzp5aohj6yemjuwal3hozowp2mnxmtdjv5u/bafkreieqw4su7yuqf5ycow4ajpzjyimfl4umnnoe5fz2mq7ukrmqnesk2y',
    url: 'https://idle.finance/',
    sid: '935285',
    app: 'Idle Finance',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: 'New Proposal On Idle Finance',
      title: 'Idle Finance - New Proposal',
    },
    secret: '',
  },
];
```

</details>

---

### **Fetching user spam notifications**

```typescript
const spams = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
  spam: true,
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| user_ | string | - | user account address (CAIP) |
| page | number | 1 | page index of the results |
| limit | number | 10 | number of items in 1 page |
| spam | boolean | false | if "true" it will fetch spam feeds |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|
| raw | boolean | false | if "true" the method will return unformatted raw API response|

<details>
  <summary><b>Expected response (Fetching user spam notifications)</b></summary>

```typescript
PushAPI.user.getFeeds [Spam] | Response - 200 OK
[
  {
    cta: 'https://goerli.etherscan.io/tx/0xe1d230d2139b0d726d5a80713ac437bed3b55b808eb651d85d8b86a377b56aa3',
    title: 'PUSH Tokens Received',
    message: 'Received 500 PUSH from 0x69e666767ba3a661369e1e2f572ede7adc926029',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeih7t3hftdcfz6axqvcnszou6tfo6blrlmis3cns33jad7dqhdcjpi/Qmah3yyjjcQGtkHDRkyrs4VoXsrgyr9SqEsLekLPW2nhpb',
    url: 'https://uniswap.org',
    sid: '3436148',
    app: 'Uniswap Test',
    image: 'https://play-lh.googleusercontent.com/i911_wMmFilaAAOTLvlQJZMXoxBF34BMSzRmascHezvurtslYUgOHamxgEnMXTklsF-S',
    blockchain: 'THE_GRAPH',
    notification: {
      body: 'Received 500 PUSH from 0x69e666767ba3a661369e1e2f572ede7adc926029',
      title: 'Uniswap Test - PUSH Tokens Received'
    },
    secret: ''
  },
  {
    cta: '',
    title: '[sdk-test] payload title',
    message: 'sample msg body',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihvggzdcvfbjw4bqytpbldeauc7chru3mj62wz4af7lezqvuyxj6i/QmW8vCUVk43gtm8CzAqKBUR13HK4fiaFHk7EfEnJYSonZw',
    url: 'https://stream-2-earn.vercel.app/',
    sid: '3258266',
    app: 'Stream2Earn',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: '[sdk-test] notification BODY',
      title: 'Stream2Earn - [SDK-TEST] notification TITLE:'
    },
    secret: ''
  },
  {
    cta: 'https://goerli.etherscan.io/tx/0xc4a01fd9ac033b5e00b45ad52af51821add8db4f31cae93e19326aff01b4e9c7',
    title: 'PUSH Tokens Received',
    message: 'Received 50 PUSH from 0x7b9e036bd304fd1bea0523de718038bbe345521a',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeih7t3hftdcfz6axqvcnszou6tfo6blrlmis3cns33jad7dqhdcjpi/Qmah3yyjjcQGtkHDRkyrs4VoXsrgyr9SqEsLekLPW2nhpb',
    url: 'https://uniswap.org',
    sid: '2868333',
    app: 'Uniswap Test',
    image: 'https://play-lh.googleusercontent.com/i911_wMmFilaAAOTLvlQJZMXoxBF34BMSzRmascHezvurtslYUgOHamxgEnMXTklsF-S',
    blockchain: 'THE_GRAPH',
    notification: {
      body: 'Received 50 PUSH from 0x7b9e036bd304fd1bea0523de718038bbe345521a',
      title: 'Uniswap Test - PUSH Tokens Received'
    },
    secret: ''
  },
  {
    cta: '',
    title: '[sdk-test] payload title 1675241933583',
    message: 'type:3 identity:2',
    icon: 'na',
    url: 'https://app.push.org',
    sid: '2427470',
    app: 'internal',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: '[sdk-test] notification BODY 1675241933583',
      title: 'internal - [SDK-TEST] notification TITLE: 16752419'
    },
    secret: ''
  },
  {
    cta: '',
    title: '[sdk-test] payload title 1673154212899',
    message: 'type:3 identity:2',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihffthqhvxdt73pe4voisz63mm2fydnrctypmh5byaglujjejjvzm/QmcHvKxoCDgN7mH2sMzFkoqDaRLUWdNMa2FbJbGRVkdF3d',
    url: 'https://www.google.com',
    sid: '1178703',
    app: 'Test Channel',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: '[sdk-test] notification BODY 1673154212899',
      title: 'Test Channel - [SDK-TEST] notification TITLE: 1673'
    },
    secret: ''
  },
  {
    cta: '',
    title: '[sdk-test] payload title 1673154141751',
    message: 'type:3 identity:2',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihffthqhvxdt73pe4voisz63mm2fydnrctypmh5byaglujjejjvzm/QmcHvKxoCDgN7mH2sMzFkoqDaRLUWdNMa2FbJbGRVkdF3d',
    url: 'https://www.google.com',
    sid: '1178702',
    app: 'Test Channel',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: '[sdk-test] notification BODY 1673154141751',
      title: 'Test Channel - [SDK-TEST] notification TITLE: 1673'
    },
    secret: ''
  },
  {
    cta: '',
    title: '[sdk-test] payload title 1669794606748',
    message: 'type:4 identity:2',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeih4qfevv2ms3tzognoscd5r5kenjcjjzvkzb6w6jctzcjzqoaxite/Qma13kPK6pcv8Z4Xjjw1MULfXgHxXPafp5Fqm1D9b5UXuv',
    url: 'https://google.com',
    sid: '839794',
    app: 'asdf',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: '[sdk-test] notification BODY 1669794606748',
      title: 'asdf - [SDK-TEST] notification TITLE: 166979460674'
    },
    secret: ''
  },
  {
    cta: '',
    title: '[sdk-test] payload title 1669794334167',
    message: 'type:4 identity:2',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeih4qfevv2ms3tzognoscd5r5kenjcjjzvkzb6w6jctzcjzqoaxite/Qma13kPK6pcv8Z4Xjjw1MULfXgHxXPafp5Fqm1D9b5UXuv',
    url: 'https://google.com',
    sid: '839772',
    app: 'asdf',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: '[sdk-test] notification BODY 1669794334167',
      title: 'asdf - [SDK-TEST] notification TITLE: 166979433416'
    },
    secret: ''
  },
  {
    cta: '',
    title: '[SDK-TEST] notification TITLE: 1669793429997',
    message: '[sdk-test] notification BODY 1669793429997',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeih4qfevv2ms3tzognoscd5r5kenjcjjzvkzb6w6jctzcjzqoaxite/Qma13kPK6pcv8Z4Xjjw1MULfXgHxXPafp5Fqm1D9b5UXuv',
    url: 'https://google.com',
    sid: '839723',
    app: 'asdf',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: '[sdk-test] notification BODY 1669793429997',
      title: 'asdf - [SDK-TEST] notification TITLE: 166979342999'
    },
    secret: ''
  },
  {
    cta: '',
    title: '[sdk-test] payload title 1668866110431',
    message: 'type:3 identity:2',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeibmpivnqppyhg2avfnkk4v4idnfo4jvfmkdxthtkxwooaglg5kxau/QmbokNY79DDthAQ5QNc64HisnEvH7Q1Wdnay7Gg2yHqULo',
    url: 'https://cryptobulb.io/',
    sid: '802376',
    app: 'CryptobulbNFT',
    image: '',
    blockchain: 'ETH_TEST_GOERLI',
    notification: {
      body: '[sdk-test] notification BODY 1668866110431',
      title: 'CryptobulbNFT - [SDK-TEST] notification TITLE: 166'
    },
    secret: ''
  }
]
```

</details>

---

### **Fetching user subscriptions**

```typescript
const subscriptions = await PushAPI.user.getSubscriptions({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address in CAIP
  env: 'staging',
});
```

where `subscriptions` is a list of channels `[{ channel: '0xaddress', ... }]` subscribed by the user.

_Note: We can find out if a user is subscribed to a channel by checking if the channel address is present in the subscriptions list_

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| user_ | string | - | user address (CAIP) |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (Fetching user opted in channels / subscriptions)</b></summary>

```typescript
// PushAPI.user.getSubscriptions | Response - 200 OK
[
  { channel: '0x0000000000000000000000000000000000000000' },
  { channel: '0xa3B6712fB922cdbbdce9AB22571e75d0d81B3b00' },
  { channel: '0xde3aEA26fDC3ADdC1dB32baf1a058Cf0878FEac1' },
  { channel: '0x69e666767Ba3a661369e1e2F572EdE7ADC926029' },
  { channel: '0x466AEEf0943C5F098dBcEf3c1eEC03322E1F97eD' },
  { channel: '0xcE98113b998380729B04596e3eA0255fbA138D34' },
  { channel: '0xa89523351BE1e2De64937AA9AF61Ae06eAd199C7' },
  { channel: '0x0a651cF7A9b60082fecdb5f30DB7914Fd7d2cf93' },
  { channel: '0x0b5E9fa12C4C1946fA2f14b7271cC60541508f23' },
  { channel: '0x2AEcb6DeE3652dA1dD6b54D5fd4f7D8F43DaEb78' },
  { channel: '0xcB6C7b2E340D50701d45d55507f19A5cE5d72330' },
  { channel: '0xB59Cdc85Cacd15097ecE4C77ed9D225014b4D56D' },
  { channel: '0xA5E269eec042Bf61183DEf9911D03359597494b7' },
  { channel: '0x6bf1ee9DE5D11Fa558c1FA8D8855E26C38Fa582A' },
  { channel: '0x72Ac64A3aE0ab60D725980b73Ef460ED9e742cc7' },
  { channel: '0xEc6CbD318CB7BA8a0fBbffF697681C0a4ADA0349' },
  { channel: '0xAb9415961F58eBD6d79029bC76F261Fa65a80D3D' },
  { channel: '0x08D77bD7500a07d791dD1323919C22e1FDb72224' },
  { channel: '0xa1016081D6Da53b4246178eD83922C55F7171e54' },
  { channel: '0x6A06014AC6BdE2906D194e63ec3b1B5B4c9C2Abb' },
  { channel: '0xf69389475E082f4BeFDb9dee4a1E9fe6cd29f6e7' },
  { channel: '0x9601f08b9EcB981D273B72e7f33964Cb98f977fe' },
  { channel: '0x47A2910432016CA9f62B20dCE09b89d357d0c3d7' },
  { channel: '0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924' },
  { channel: '0x14c0157f9eEA7AEe61ba2606E75716E210b4697a' },
  { channel: '0x025846389950A13292E63e4794C7D148FF57F995' },
  { channel: '0x2aecb6dee3652da1dd6b54d5fd4f7d8f43daeb77' },
  { channel: '0xD8634C39BBFd4033c0d3289C4515275102423681' },
  { channel: '0x19fB80f16EAFCfb5BBFa07451CC5694E8932EA52' },
  { channel: '0x94c3016ef3e503774630fC71F59B8Da9f7D470B7' },
];
```

</details>

---

### **Fetching channel details**

```typescript
const channelData = await PushAPI.channels.getChannel({
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // channel address in CAIP
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| channel_ | string | - | channel address (CAIP) |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (Fetching channel details)</b></summary>

```typescript
// PushAPI.channels.getChannel | Response - 200 OK
{
  id: 39,
  channel: '0xD8634C39BBFd4033c0d3289C4515275102423681',
  ipfshash: 'bafkreia26pvmuo2ugyub7boo2zxxj6dqhwqt3gcllpotmau3t7gsvy6vfq',
  name: 'Gnosis',
  info: 'Gnosis builds new market mechanisms for decentralized finance.\n',
  url: 'https://gnosis.io',
  icon: 'https://gateway.ipfs.io/ipfs/bafybeifvbiegzbgyoikdxe2rqhxf2uuvrqtfmllzy2ueidzyxnqkvkuizu/bafkreia26pvmuo2ugyub7boo2zxxj6dqhwqt3gcllpotmau3t7gsvy6vfq',
  processed: 1,
  attempts: 0,
  alias_address: '0xD8634C39BBFd4033c0d3289C4515275102423681',
  alias_verification_event: null,
  is_alias_verified: 1,
  alias_blockchain_id: 'NULL',
  activation_status: 1,
  verified_status: 0,
  timestamp: '2023-02-07T16:29:27.000Z',
  blocked: 0,
  counter: null,
  subgraph_details: null
}
```

</details>

---

### **Searching for channel(s)**

```typescript
const channelsData = await PushAPI.channels.search({
  query: 'push', // a search query
  page: 1, // page index
  limit: 20, // no of items per page
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| query_ | string | - | search query |
| page | number | 1 | page index of the results |
| limit | number | 10 | number of items in 1 page |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (Searching for channel)</b></summary>

```typescript
// PushAPI.channels.search | Response - 200 OK
[
  {
    id: 58,
    channel: '0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924',
    ipfshash: 'QmSbRT16JVF922yAB26YxWFD6DmGsnSHm8VBrGUQnXTS74',
    name: 'Ethereum Push Notification Service',
    info: 'The channel provides useful information, notifications, etc to all the users of the EPNS platform. While not recommended, you can unsubcribe if you want to.',
    url: 'https://epns.io/',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihwgapkthxi6udojr7soqetk5xx22bdy56uupivcwkriaiqzwlyiu/QmSbRT16JVF922yAB26YxWFD6DmGsnSHm8VBrGUQnXTS74',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 756,
  },
  {
    id: 817,
    channel: '0xBA36124E8af635d9d32C4cC49802cacade133a5F',
    ipfshash: 'QmUf7zuo4NXvkijhELfHAdmm8dQVY9VqesEs4xhobLZx4f',
    name: 'push-ap-test',
    info: 'testing push notifications',
    url: 'https://www.google.com',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeigyk6kqiyn2dkburguqmnlkgvos4yld4hswcjcjnxbq6c5dqs7ih4/QmUf7zuo4NXvkijhELfHAdmm8dQVY9VqesEs4xhobLZx4f',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 57,
  },
  {
    id: 243,
    channel: '0xC533ec1f876eA99088c85896F246C2ec8c7b05f9',
    ipfshash: 'bafkreibc36t5tlygsa75w6nnkjmjieyzrohuscwzvohbj5tq6v6tgm2q4y',
    name: 'EPNS PUSH Governance',
    info: 'Get notifications on new proposals, grants, and stay up to date on all things PUSH Governance.',
    url: 'https://epns.io/',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihluvteyktaz6u7it6etf7jglqckcym5h5hxoqcilen73pcrz2wkq/bafkreibc36t5tlygsa75w6nnkjmjieyzrohuscwzvohbj5tq6v6tgm2q4y',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 9,
  },
  {
    id: 923,
    channel: '0x7F69eec6cC1F619Ea8d27323d4430BbA5b739354',
    ipfshash: 'QmeBqut7zMg4NSLbyEbUeLn2g9UnUE9fKjiVhYvWwJ3vqu',
    name: 'Polygon Ahmedabad <> PUSH',
    info: "You'll get cool notifications and update here.",
    url: 'https://polygon.technology/blog/polygons-web3-made-in-india-tour-starts-rolling-with-7-guild-events-web3-education-programs',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeiaxryfpf2gzmpq7uvye2kv3slru4vvdela5onldzder3zbbt3hoom/QmeBqut7zMg4NSLbyEbUeLn2g9UnUE9fKjiVhYvWwJ3vqu',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 9,
  },
  {
    id: 274,
    channel: '0x554d29160f779Adf0a4328597cD33Ea1Df4D9Ee9',
    ipfshash: 'bafkreichmnqqcn6tfcv5lnbbluchr3tqgbhiu45qnq56p2razdhvgnblcy',
    name: 'Push Governance',
    info: 'Get notifications on new proposals, grants, and stay up to date on all updates regarding PUSH Governance',
    url: 'https://epns.io/gov',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihkfdd4lch5vvcmziowi7dmuum2pouvk3st4v5rvfxo3etcoxh7oe/bafkreichmnqqcn6tfcv5lnbbluchr3tqgbhiu45qnq56p2razdhvgnblcy',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 5,
  },
  {
    id: 1242,
    channel: '0x453552953C4e2732A38B93F7fB834e5AeF6F60f8',
    ipfshash: 'QmU7PC7yjdPfXJTgYuuqqvvWbxTn1rE3z8iWZEcorK3VPM',
    name: 'Test push notifications',
    info: 'Test push notifications',
    url: 'https://www.youtube.com',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeiarff4fukkj7fvmjuav6xvqzg5pfzyj2jcytzcbb5tdgyfzjfakfa/QmU7PC7yjdPfXJTgYuuqqvvWbxTn1rE3z8iWZEcorK3VPM',
    processed: 1,
    attempts: 0,
    alias_address: '0x453552953C4e2732A38B93F7fB834e5AeF6F60f8',
    alias_verification_event:
      '{"aliasAddress": "0x453552953C4e2732A38B93F7fB834e5AeF6F60f8", "aliasBlockchainId": "80001"}',
    is_alias_verified: 1,
    alias_blockchain_id: '80001',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 5,
  },
  {
    id: 210,
    channel: '0x8DaFfe9d1b5aDB33F53aDDC183C6b91F9cb30bc7',
    ipfshash: 'bafkreiac6g3iul2uk6r6h2x5rsthgoq2y6uw23n4gzkvstfn7rl5tjq3v4',
    name: 'PUSH for EthDenver',
    info: 'Get notifications about everything EPNS at ETHDenver.',
    url: 'http://ethdenver.epns.io/',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeia2emdjy63kap2yqig3h4qlsjuawdby777osyr4rls2nyno2qsv6u/bafkreiac6g3iul2uk6r6h2x5rsthgoq2y6uw23n4gzkvstfn7rl5tjq3v4',
    processed: 1,
    attempts: 1,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 4,
  },
  {
    id: 809,
    channel: '0x9dFe790B3baBCBD888dA7093017a0B7A68b99937',
    ipfshash: 'QmbrQeT4FdvYRQDrDhVvZ9XMhs2TUNSA7UHc4M53vvNcKK',
    name: 'Push-Graph Test',
    info: 'This channel is to test subgraph notifications.',
    url: 'https://push.org/',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihniwj5eflkxah7feqdgjnfuoyeq5iw4ka7qze3h6hdxsydx3gx3e/QmbrQeT4FdvYRQDrDhVvZ9XMhs2TUNSA7UHc4M53vvNcKK',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-02-03T12:26:00.000Z',
    blocked: 0,
    counter: 18,
    subgraph_details: '60+aiswaryawalter/push-graph-test',
    subscriber_count: 4,
  },
  {
    id: 956,
    channel: '0x85Cb63e3D8cEf31a421e59b6678bF0444Fa5d8BE',
    ipfshash: 'QmUAgUYKteWdpcWkKmNtySGY5w7XkRpUYdYtqcSfEfXzLP',
    name: 'Transfer PUSHNOTIFICATION',
    info: 'Notification for Transfer',
    url: 'https://push.org/',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeidwsc4kws4fvzzsdj5e46re46qmwxmgidouhcfeel34xmhxbqbroe/QmUAgUYKteWdpcWkKmNtySGY5w7XkRpUYdYtqcSfEfXzLP',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 4,
  },
  {
    id: 967,
    channel: '0xa45bdc5B11ce6F0952401bE35156398d8c40Ce64',
    ipfshash: 'QmPWEKaJsfVweeyWT5bCftXDnbDFMgqw3sVpTnKtd3fH5a',
    name: 'Push Graph Notif',
    info: 'Subgraph notification test',
    url: 'https://push.org/',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihlt5qyhs3g3ii5vrrhb4evcsltoa6bssb2qiuh3bamxx4ndorkr4/QmPWEKaJsfVweeyWT5bCftXDnbDFMgqw3sVpTnKtd3fH5a',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-02-03T12:26:00.000Z',
    blocked: 0,
    counter: 18,
    subgraph_details: '60+aiswaryawalter/push-graph-test',
    subscriber_count: 4,
  },
  {
    id: 1425,
    channel: '0x49403ae592C82fc3f861cD0b9738f7524Fb1F38C',
    ipfshash: 'QmZ1t5upH5zHxvzefWppVNfv7ciacrDq9VUL3SZJ7trnNz',
    name: 'SuperPush',
    info: 'Create, Update and Delete Superfluid streams seemlessly and get alerted to your device with Push Notifications for every actions.',
    url: 'https://www.superfluid.finance/',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeibfnawzeadz7d2exw2ncbytanzwjb3mdkx74whga5b5scz6mmuymu/QmZ1t5upH5zHxvzefWppVNfv7ciacrDq9VUL3SZJ7trnNz',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 0,
    verified_status: 0,
    timestamp: '2023-02-18T21:02:50.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 4,
  },
  {
    id: 1659,
    channel: '0x43097889162A9f2b7D85104f16aB7aB090056975',
    ipfshash: 'QmQKuiR9nZw46pnrW16J7GZTsg3hteh93mWHcHV5Khrj24',
    name: 'Push Protocol Demo',
    info: 'A demo channel for testing out Push Protocol',
    url: 'https://youtube.com',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeiaadvr565fk5mkam4hlmnaxdb7lxemfcffzqd24berqxw6sf3efny/QmQKuiR9nZw46pnrW16J7GZTsg3hteh93mWHcHV5Khrj24',
    processed: 1,
    attempts: 1,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-02-20T04:40:04.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 4,
  },
  {
    id: 287,
    channel: '0x72F569DE6d77B1D4C3810767865FC706A1C39915',
    ipfshash: 'bafkreidlxu5pnjeamnriukkqskv4v6ndfz5nifb2adrqwsvqiypg4oq4yi',
    name: 'Push for DevConnect',
    info: 'Stay upto date on all the happenings at DevConnect',
    url: 'https://devconnect.org/schedule',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeicgoxqjc3trzthp4chvdwyfe2nqm5lfaumkyztvm6vh6anwzztuty/bafkreidlxu5pnjeamnriukkqskv4v6ndfz5nifb2adrqwsvqiypg4oq4yi',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3,
  },
  {
    id: 369,
    channel: '0x2b107f1B57F2A381dc8c09F8786FA3bdb3c70b27',
    ipfshash: 'bafkreicnfx2wfjlphaoe7d3vttegbomdoc55n43p2r7wzpg2zzu2zcelrq',
    name: 'Dapp Push notifications',
    info: 'A channel to test out dapp push notifications',
    url: 'animepahe.com',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihwyx4s5pv7afk7hskcvtz4j5o7yqkdwtb3t6mqsueqer4lbk53wy/bafkreicnfx2wfjlphaoe7d3vttegbomdoc55n43p2r7wzpg2zzu2zcelrq',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3,
  },
  {
    id: 445,
    channel: '0x24a8E20a63DC3149BD7Ee136632161cDb8857522',
    ipfshash: 'bafkreigglf54mwxxxzfhbexbyqgolyry4wfxkxvmxo3xojt6765rgi2r34',
    name: 'Push Token Alerter',
    info: 'Push Token alerter',
    url: 'https://epns.io/',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeiaxnibay6ezfwmsytoiilcppa7piutbdzqzmm6vfcqi7wrmlx4qmm/bafkreigglf54mwxxxzfhbexbyqgolyry4wfxkxvmxo3xojt6765rgi2r34',
    processed: 1,
    attempts: 2,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3,
  },
  {
    id: 735,
    channel: '0x76AF8b0ED41EEBda6Eb2aA7991e0564cCFD1eC1F',
    ipfshash: 'QmeMSv9UrL5znYJoLkJgKnivzaN67WnfCWB7donSx8AbXP',
    name: 'Push x Polygon',
    info: 'Push x Polygon Integration',
    url: 'https://push.org',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeiejlm3hfthuprnxyqj4onxnm3gy2tuygubaaapgw2bdhuqhhqggq4/QmeMSv9UrL5znYJoLkJgKnivzaN67WnfCWB7donSx8AbXP',
    processed: 1,
    attempts: 0,
    alias_address: '0x76AF8b0ED41EEBda6Eb2aA7991e0564cCFD1eC1F',
    alias_verification_event:
      '{"aliasAddress": "0x76AF8b0ED41EEBda6Eb2aA7991e0564cCFD1eC1F", "aliasBlockchainId": "80001"}',
    is_alias_verified: 1,
    alias_blockchain_id: '80001',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3,
  },
  {
    id: 737,
    channel: '0x0fEdC054075d14CF941A5cC62d22EBE9ad5de742',
    ipfshash: 'QmZ3VQ87hNLeda2bgmvwZhKDaMgEboDVgGqTYktJGVNggG',
    name: 'SeaLightPush',
    info: 'Decentralized Exchange',
    url: 'Https://SealightSwap.org',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeicn4gmyg5gq3u3eoo5lbkuo4pbstrhw6uu2u6lgx6yd43e6zgxyg4/QmZ3VQ87hNLeda2bgmvwZhKDaMgEboDVgGqTYktJGVNggG',
    processed: 1,
    attempts: 0,
    alias_address: '0x0fEdC054075d14CF941A5cC62d22EBE9ad5de742',
    alias_verification_event:
      '{"aliasAddress": "0x0fEdC054075d14CF941A5cC62d22EBE9ad5de742", "aliasBlockchainId": "80001"}',
    is_alias_verified: 1,
    alias_blockchain_id: '80001',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3,
  },
  {
    id: 929,
    channel: '0x983d0aD6D9c8778889311bC0E45DE417E9D74a90',
    ipfshash: 'QmcqBzru5FFJDvLk7SYGEFYhgz9bokU77DWL4Kzt3NEDEJ',
    name: 'Push amplify',
    info: 'This channel will be used to test Push amplify features, and UI changes.',
    url: 'https://twitter.com/pranshu3196',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeihkrzovmnbscultfjfrnjqnsfqmrhrjuvnnokjwm35n7gcqy7xefi/QmcqBzru5FFJDvLk7SYGEFYhgz9bokU77DWL4Kzt3NEDEJ',
    processed: 1,
    attempts: 0,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3,
  },
  {
    id: 1039,
    channel: '0xc092d5Aa8c23165484486F246C828e4980b6C707',
    ipfshash: 'QmXc2CE1c9fR34HVmkwQNaHRUvt7YxtiUcJfpBSbKTyBzD',
    name: 'testPushHack',
    info: 'test',
    url: 'https://iamzub.in',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeia6djth6wbxpkujkxuftbkeot6d6atnhtyfb5k3bn5metcyj2pk3q/QmXc2CE1c9fR34HVmkwQNaHRUvt7YxtiUcJfpBSbKTyBzD',
    processed: 1,
    attempts: 1,
    alias_address: 'NULL',
    alias_verification_event: null,
    is_alias_verified: 0,
    alias_blockchain_id: 'NULL',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3,
  },
  {
    id: 1241,
    channel: '0x11EaB508c309595F14E363e6a8d434BEab91eEBC',
    ipfshash: 'QmZm14LgHZB2hYHcENkJNhrrL11QRKDCpX3AeVmXEiy2Hq',
    name: 'Test for push',
    info: 'Test for push',
    url: 'https://www.youtube.com',
    icon: 'https://gateway.ipfs.io/ipfs/bafybeicnv3jv7ylfxqgb5cqyzzi4lumbjeqyimcljewqbexszjrqeqkn5m/QmZm14LgHZB2hYHcENkJNhrrL11QRKDCpX3AeVmXEiy2Hq',
    processed: 1,
    attempts: 0,
    alias_address: '0x11EaB508c309595F14E363e6a8d434BEab91eEBC',
    alias_verification_event:
      '{"aliasAddress": "0x11EaB508c309595F14E363e6a8d434BEab91eEBC", "aliasBlockchainId": "80001"}',
    is_alias_verified: 1,
    alias_blockchain_id: '80001',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3,
  },
];
```

</details>

---

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
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| signer_ | - | - | Signer object |
| channelAddress* | string | - | channel address (CAIP) |
| userAddress* | string | - | user address (CAIP) | |
| verifyingContractAddress | string | - | Push communicator contract address|
| onSuccess | function | - | on success callback |
| onError | function | - | on error callback |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (Opt in to channel)</b></summary>

```typescript
// PushAPI.channels.subscribe | Response - 200 OK
{ status: 'success', message: 'successfully opted into channel' }

```

</details>

---

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
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| signer_ | - | - | Signer object |
| channelAddress* | string | - | channel address (CAIP) |
| userAddress* | string | - | user address (CAIP) | |
| verifyingContractAddress | string | - | Push communicator contract address|
| onSuccess | function | - | on success callback |
| onError | function | - | on error callback |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (Opt out of a channel)</b></summary>

```typescript
// PushAPI.channels.unsubscribe | Response - 200 OK
{ status: 'success', message: 'successfully opted out channel' }
```

</details>

---

### **Sending notification**

```typescript
async function sendNotification(options: {
  senderType?: 0 | 1;
  signer: any;
  type: NOTIFICATION_TYPE;
  identityType: IDENTITY_TYPE;
  notification?: {
    title: string;
    body: string;
  };
  payload?: {
    sectype?: string;
    title: string;
    body: string;
    cta: string;
    img: string;
    metadata?: any;
    additionalMeta?: any;
  };
  recipients?: string | string[]; // CAIP or plain ETH
  channel: string; // CAIP or plain ETH
  expiry?: number;
  hidden?: boolean;
  graph?: {
    id: string;
    counter: number;
  };
  ipfsHash?: string;
  env?: ENV;
  chatId?: string;
  pgpPrivateKey?: string;
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| senderType_ | number | 0 | 0 for channel notification. 1 for chat notification |
| signer* | - | - | Signer object |
| channel* | string | - | channel address (CAIP) |
| type* | number | - | Notification Type <br/>Target = 3 (send to 1 address), <br/>Subset = 4 (send to 1 or more addresses),<br/> Broadcast = 1 (send to all addresses) |
| identityType* | number | - | Identity Type <br/> Minimal = 0, <br/>IPFS = 1, <br/>Direct Payload = 2, <br/>Subgraph = 3 } |
| recipients* | string or string[] | - | for Notification Type = Target it is 1 address, <br /> for Notification Type = Subset, Broadcast it is an array of addresses (CAIP) |
| notification.title* | string | - | Push Notification Title (not required for identityType IPFS, Subgraph)|
| notification.body\* | string | - | Push Notification Body (not required for identityType IPFS, Subgraph)|
| payload.title | string | - | Notification Title (not required for identityType IPFS, Subgraph)|
| payload.body | string | - | Notification Body (not required for identityType IPFS, Subgraph)|
| payload.cta | string | - | Notification Call To Action url (not required for identityType IPFS, Subgraph)|
| payload.img | string | - | Notification Media url (not required for identityType IPFS, Subgraph)|
| payload.sectype | string | - | If Secret Notification then pass (not required for identityType IPFS, Subgraph)|
| graph.id | string | - | graph id, required only if the identityType is 3 |
| graph.counter | string | - | graph counter, required only if the identityType is 3 |
| ipfsHash | string | - | ipfsHash, required only if the identityType is 1 |
| expiry | number | - | (optional) epoch value if the notification has an expiry |
| hidden | boolean | false | (optional) true if we want to hide the notification |
| pgpPrivateKey | string | - | (optional) pgp private key for new notification verification proof |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

#### **Direct payload for single recipient(target)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.TARGETTED, // target
  identityType: PushAPI.payloads.IDENTITY_TYPE.DIRECT_PAYLOAD, // direct payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`,
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: '',
  },
  recipients: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // recipient address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **Direct payload for group of recipients(subset)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: 4, // subset
  identityType: 2, // direct payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`,
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: '',
  },
  recipients: [
    'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
    'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1',
  ], // recipients addresses
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **Direct payload for all recipients(broadcast)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.BROADCAST, // broadcast
  identityType: PushAPI.payloads.IDENTITY_TYPE.DIRECT_PAYLOAD, // direct payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`,
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: '',
  },
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **IPFS payload for single recipient(target)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.TARGETTED, // target
  identityType: PushAPI.payloads.IDENTITY_TYPE.IPFS, // ipfs payload
  ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // IPFS hash of the payload
  recipients: 'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', // recipient address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **IPFS payload for group of recipients(subset)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.SUBSET, // subset
  identityType: PushAPI.payloads.IDENTITY_TYPE.IPFS, // ipfs payload
  ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // IPFS hash of the payload
  recipients: [
    'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1',
    'eip155:5:0x52f856A160733A860ae7DC98DC71061bE33A28b3',
  ], // recipients addresses
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **IPFS payload for all recipients(broadcast)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.BROADCAST, // broadcast
  identityType: PushAPI.payloads.IDENTITY_TYPE.DIRECT_PAYLOAD, // direct payload
  ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // IPFS hash of the payload
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **Minimal payload for single recipient(target)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.TARGETTED, // target
  identityType: PushAPI.payloads.IDENTITY_TYPE.MINIMAL, // Minimal payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`,
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: '',
  },
  recipients: 'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', // recipient address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **Minimal payload for a group of recipient(subset)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.SUBSET, // subset
  identityType: PushAPI.payloads.IDENTITY_TYPE.MINIMAL, // Minimal payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`,
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: '',
  },
  recipients: [
    'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1',
    'eip155:5:0x52f856A160733A860ae7DC98DC71061bE33A28b3',
  ], // recipients address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **Minimal payload for all recipients(broadcast)**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.BROADCAST, // broadcast
  identityType: PushAPI.payloads.IDENTITY_TYPE.MINIMAL, // Minimal payload
  notification: {
    title: `[SDK-TEST] notification TITLE:`,
    body: `[sdk-test] notification BODY`,
  },
  payload: {
    title: `[sdk-test] payload title`,
    body: `sample msg body`,
    cta: '',
    img: '',
  },
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **Graph payload for single recipient(target)**

**_Make sure the channel has the graph id you are providing!!_**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.TARGETTED, // target
  identityType: PushAPI.payloads.IDENTITY_TYPE.SUBGRAPH, // Subgraph payload
  graph: {
    id: '_your_graph_id',
    counter: 3,
  },
  recipients: 'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', // recipient address
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **Graph payload for group of recipients(subset)**

**_Make sure the channel has the graph id you are providing!!_**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.SUBSET, // subset
  identityType: PushAPI.payloads.IDENTITY_TYPE.SUBGRAPH, // graph payload
  graph: {
    id: '_your_graph_id',
    counter: 3,
  },
  recipients: [
    'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1',
    'eip155:5:0x52f856A160733A860ae7DC98DC71061bE33A28b3',
  ], // recipients addresses
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

#### **Graph payload for all recipients(broadcast)**

**_Make sure the channel has the graph id you are providing!!_**

```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.BROADCAST, // broadcast
  identityType: PushAPI.payloads.IDENTITY_TYPE.SUBGRAPH, // graph payload
  graph: {
    id: '_your_graph_id',
    counter: 3,
  },
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging',
});
```

<details>
  <summary><b>Expected response (Send Notification)</b></summary>

```typescript
// PushAPI.payloads.sendNotification | Response - 204 OK
```

</details>

---

### Notification Helper Utils

#### **Parsing notifications**

Utils method to parse raw Push Feeds API response into a pre-defined shape as below.

```typescript
// fetch some raw feeds data
const apiResponse = await PushAPI.user.getFeeds({
  user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // user address
  raw: true,
  env: 'staging',
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
  notification,
} = oneNotification;
```

_We get the above `keys` after the parsing of the API repsonse._

---

### Advanced Notifications (WIP)

### DEPRECATED

#### **Get a channel's subscriber list of addresses**

```typescript
const subscribers = await PushAPI.channels.getSubscribers({
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // channel address in CAIP
  page: 1, // Optional, defaults to 1
  limit : 10 // Optional, defaults to 10
  env: 'staging'
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| channel_ | string | - | channel address (CAIP) |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (Get channel's subscribers list)</b></summary>

```typescript
// PushAPI.channels.getSubscribers | Response - 200 OK
{
    "itemcount": 11,
    "subscribers": [
        "0x1d4f52775344f9a32093af0ccd03a4fb6dac8e30",
        "0x28d615edd8404f8ca1e0271a0b5a48171589921a",
        "0x4352639b99689069f9b0b847eee349c3c1b0706c",
        "0x50029e62540537045bcfd3d320483865344edb33",
        "0x5ac9e6205eaca2bbba6ef716fd9aabd76326eeee",
        "0x778d3206374f8ac265728e18e3fe2ae6b93e4ce4",
        "0xa44f2994750cf774eab05751d90ade4dedabe7fe",
        "0xbcfb7da1dcf40e8cfb331683bb7d6f4eba091b08",
        "0xcf5dbf241fc65a5af56c95101ac4e9ec2c57d941",
        "0xd8634c39bbfd4033c0d3289c4515275102423681"
    ]
}
```

</details>

---

## For Chat

### **Create user for chat**

```typescript
const user = await PushAPI.user.create({
  env?: ENV;
  account?: string;
  signer?: SignerType;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  additionalMeta?: {
    NFTPGP_V1?: {
      password: string;
    };
  };
  progressHook?: (progress: ProgressHookType) => void;
  origin? : string | null;
})
```

| Param          | Remarks                                                       |
| -------------- | ------------------------------------------------------------- |
| env            | API env - 'prod', 'staging', 'dev'                            |
| account        | Account address                                               |
| signer         | ethers.js signer                                              |
| version        | 'x25519-xsalsa20-poly1305' or 'eip191-aes256-gcm-hkdf-sha256' |
| additionalMeta | Additional meta data for user                                 |
| progressHook   | Progress hook                                                 |
| origin         | Origin through which user is created                          |

Example creating normal user for chat:

```typescript
const user = await PushAPI.user.create({
  signer: signer, // ethers.js signer
  env: env as ENV,
});
```

Example creating NFT user for chat:

```typescript
const user = await PushAPI.user.create({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  signer: nftSigner, // ethers.js signer
  env: env as ENV,
  additionalMeta: { NFTPGP_V1: { password: '@Test0i1223de' } },
});
```

<details>
  <summary><b>Expected response (Create Chat User)</b></summary>

**Version 1.2.x**

```typescript
export interface IUser {
  did: string;
  wallets: string;
  profilePicture: string | null;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptionType: string;
  signature: string;
  sigType: string;
  about: string | null;
  name: string | null;
  encryptedPassword: string | null;
  nftOwner: string | null;
  numMsg: number;
  allowedNumMsg: number;
  linkedListHash?: string | null;
  nfts?: [] | null;
}
```

| Parameter             | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `did`                 | user decentralized identity                                     |
| `wallets`             | all wallets associated to the did                               |
| `profilePicture`      | user chat profile picture. As of now i cannot be changed        |
| `publicKey`           | PGP public key                                                  |
| `encryptedPrivateKey` | encrypted private PGP key                                       |
| `encryptionType`      | encryption type used to encrypt the private key                 |
| `signature`           | user payload signature used when creating a user                |
| `sigType`             | signature type used when creating a user                        |
| `about`               | short user description                                          |
| `name`                | user name                                                       |
| `encryptedPassword`   | encrypted password used to encrypt the private key for NFT chat |
| `nftOwner`            | NFT owner address                                               |
| `numMsg`              | number of messages sent by the user                             |
| `allowedNumMsg`       | number of messages allowed to be sent by the user               |
| `linkedListHash`      | cid from all messages this user has sent                        |
| `nfts`                | array of NFTs owned by the user                                 |

Example response normal user:

```typescript
// PushAPI_user_get | Response - 200 OK
{
  did: 'eip155:0x85e6350861136e65BE141d8DB1eEa25cA346743f',
  wallets: 'eip155:0x85e6350861136e65BE141d8DB1eEa25cA346743f',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRUAu8BCACV4muD50mKJeGPU33ZkTXi7x6eMpjXlmMQbVERQ7MVKvOc\n' +
    'cN+9iz2A18bi73vPYq9FwF/Ibok+A/SuwTbiEe/5E0FXJSnC87DWVF6Aq6At\n' +
    'lzCT4WHYlkHU2h5+JNaD8CXOxe6bsGfzbZ9dSZ9zfs5IoCh6Qf035cjV7wH6\n' +
    'lcGykxvZUIfKiJuwXotkglGzk0317oo37ZXl6f2hCJBg7NdewXGxVKFYu1JS\n' +
    'n5ztzAkoRyiHUnuFDje+HmkU4PjhtrHiFrEeooRyvR/6YCvyIue7f2lIXKV9\n' +
    'rOCyczJyDWTf3wwpklDZVEB0Guv4PHcWsTuN1pqyxgz2bT+umctEvla3ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZFQC7wQLCQcICZAzo8jUDaqidgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBNgrG501gFGxwttFzDOjyNQNqqJ2AACgaQf/Rt33rLH7Ayxb\n' +
    'UED4L7a5f6aw//jk9Y+yqpB3QbwJTSoD02yUqUJ5J9sW46m8k3eQc6ds4OkP\n' +
    'ylaQtoUkumELSuS5hON3Y2IQ78fMvv+My8pQoxD4HzzLj7uVOHaHaElygfoC\n' +
    'pfWSDU2UrJB5TK6noOTspcdB5QlCKh5fU0fDtRQ9OKVTM4NTAmYxsDa3OZO6\n' +
    'DvqfMAK75tlHJr+Xro7GUbKebaJft/guA2ZHpGTHhs2Q+grjQcvljx6BoN3o\n' +
    'NydGwkCorcVZZO7XKr73hPE0VH/LlRqZJ2lcBn/kUJzG1Z1LFYcny+FCrM3U\n' +
    'cCg5eI+Is436jSWBl3bhtdYptNwdNM7ATQRkVALvAQgAt7ghdqho1nII81Vk\n' +
    'BAs2LN3Vb56GyUCTgZjBP+nbIVat6Kjd2H9dmXVhYEbZMFZyjqAdUwFzoJ8p\n' +
    '3Y6qAJxmCktSZ77mzBeojZXi3VesOVfrCzi6MDU+SnN4mguL72YWr6gEbQK5\n' +
    'Ypto4uuEh836Dcf7WCj20fTSRvRSKakmBGwnzP/0Gj7fo8S8OQLwFMMEo7bf\n' +
    '5ExVuB5Is2SEUxWdeXligBMSiajLJo6thlzs0rTsY/ugbz/czulAMDh1MnST\n' +
    'Yol6nHEQUgZFgWx56ARwOn+Y8hJPQqnpWmQie+BakUEabHQjY9sEJ5UDozZ5\n' +
    'GwGVrfgETiNblc0crVnUI7CQKQARAQABwsB2BBgBCAAqBYJkVALvCZAzo8jU\n' +
    'DaqidgKbDBYhBNgrG501gFGxwttFzDOjyNQNqqJ2AACmjwf/eZuqTjk9MIgq\n' +
    'fdlWMM6kLD7W6hScgHIvms9V21Zwy7WQtMrxmQRhCqCHai/eXe/hFABmWxUK\n' +
    'nHbosXKL3DQUapvn2cm40BWseW8Il93oRbSQb7xvFQ3g+mNEiSgn0oWBCTSf\n' +
    'W9HM/3Kowfc34ilvqfquan+ilCID8OzXHHZXx/nxHeVbpARZiHe2ebk1lr6r\n' +
    'KJzq/2S0C65xgn8ShTU1Aewio3+5kr3oHzlTlSnF8Ov5c9VzfEKb+UP7tBMO\n' +
    'b8quBez/BgDetebCxaqy881+/LY535i9xVUNDkMK50jY+JvqW10HeuVXOVxZ\n' +
    'NrSotIw2xObkCFV2WN46DVNt2S541Q==\n' +
    '=Zf86\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  encryptedPrivateKey: '{"ciphertext":"7496a39864b0882212956f02270d8b34ad8fbdcbbcf97d359eb8c95eeba70d8daf810d9874ff8cfff5e7840bef8ee12b82a2c7783c28685035ad81dee5233d37570bc4e57cc2d56ac252a14db2cec9777a73094f3efaead3843f59f0a64efcd4f9ded45edb54c3e933811790eee9c5bc9877f9faadf50fe6436510111cf62f1b3419816bdd80f292326b5f58dd8fb595bafe56970479530de30cfd4b3a9c6ca82554016ce902e0bee2db1f636f8e0bd7b2c6f98157220885b07bc9c213a67de847c97c21fabd40440fdaa911219118b9a0efe2ff34fe78fbe2365963f8e2f0d6e22c12d067614d921eb021cea67d8fc36866efe82401ef124de229f27686b93183cfffa75332821939bfd9b5c2ebddb8b388fcee489d06f9bebbc407b68d2a57dd247b3edf51d14010da4cb8325e392475c68383a4dec063e8d8f84e6d553da2c4f84fe9143b2e212e5a17a436d14431e421a7eac40c9e460f37819831f692e9d14617969ecb2cebe4a934f0d36fb85e9694857cb87ebc7186c420362a2582d641bb1112c1bb32822e161ac1c130841ed69d9cdd7c5683352c51315d87abad1c844c1b46017346642482ede19e6be01f8bed93f29fd1d899bc02e99a4463d37b30f3e682877d1cf266c5a30862f27aa9a044ab90cd4e9d069512d0b22f57240480d71671b7d8d9bf3261eab7cb6c0279f159bd53bec28dd48a9f6433f225cc45c5dbaa7d58f0dc6b0e0e52ae0f197d6e9ba458e47ed8dac43351bf1099ce8e367bb67cd706c1a25f5388af9f6370781ecf2296b148eae9e9f554fc3a9dcaffd53cb9650937f1f5d50a566b314542cf5e0994c99fce26053a794f1b38c480ca6a6f344ba023092ca039f37c74b6fee0d0dde4d5553b192cbcdfa50d733d874483a269069e260394a6cb515e2a7a5e6daf6221fe9f7540845457514d38119d858abdcee09595b9266ae06110726391b652881f07f41988abc9080a6dc1fce8929bac13761ca12c66178a487e1d42b07a128e42c6582999fa0e8d2f47ae079ee46c3b13ac058f58e3f27dcfb22e4a2620785ae317258397bc42d64ce0e02c769c426fcfb5b6d9c7862872f19bf1bfae517e60bf853ecbe269143f67c6b2245cba29335a264b3d94a2f5444223aff7f1dab63ee4846cdda557a9b8041a3edc8d5b1ba23f6e4080129e3c25b3336a3ebaf23de2140f1020d332a472795c6f7ab1a767997c6c9a679a1bbdc34415ca83ea46d818af26ae92a0c05c7e8de2a0d960a92975a2709d25c33d2f980a7e5e5b279c6b8c733241b1447448a4b673f28e45d72409a3929b51d86ff3f2fa1aa07e0b355993d2d14035283a366c4d55fb2172bacebd7a7c3745f4e9aebb6096a2a7bb094e29be60aa206c26cdf5aeda9ba7cd40ea291ab7980020fd3b8a69bd1889cf8a347f327b79b21ce370cb2ca75920fd258704da8d23c8df55ecefa528a37adcc06f37113fccffaa958d13b3435fe81823107bf01274c0ab6912cb1960c0d4c7a4f40e3b23b3c50a65785b12ff8663a31fb1718cc6a4dd2a57c3456ad1743c81743c4366d31d987d016f800502c189a12c55e562cb3fb1c198837aa9a9735d3b7d18ea4ce2936df1e579330d773f3da0f7b733a527d11b68accd1fad3166e61b30594b76d8a1594e4ebd692ed4e54d955778d752a707513a5278502dd0ef64c6474c46df0cbba3c763e6366d005a0580f91f9f3674e06421d6ac3828fa2f79cea6d81686926df8092389e04d3e290ce3fc8d9b885b0df75beb5b6307e4fa6f2c4efe7005ac4f3779a48e290d8afdb98ec82046b2621d9ed09cc59f11cedccdeca85962e6b50f4ec9e512da6f547537e75f254aaefb76cb6981f3ccabb7e3230610aa3a50adfe23e04feb1e0b0dc67e1e9e1570808ae3f029583c25fa5f10f983c285d7b2fe0cd13cdd2a91294adcceb3b57bd6687d2b880d963872ba56b5696d63b8110ce4ef7e3af8c7c091fd65b2ceee3bf206d0c54c1127b051d74779545b344389f843eabe5c9459e421176f912ddb2a31f75dd12c964f01ec0f53d164b92c95f175a900e8a707401d2898141ec52d9c3ea619b71e46fc492b6ae9e524c6da32373d19dfbfe9ee3e2a3898fac7f57cff2b1eabd72ab3f48d6021b996a3fd1015ace78742b969a4754ae5a47d510e98f7c02b6833de4c89e1be31d5448a433e3032eaa0e5ecd8b3a40a89f493415dd8c0ca7d467b3ea2e01e902579206354d7dd7936b1593cbd481eca61dd19c62eaf25737c2a70db08f6cddb7776fc849b5cc1ada596d6b07b24f0cae171a281a70f2c8eeed67c74d4b79fc74facbf40d6f89f4f0a91510463454117f1d99d08aef055605452761daea5f8dd47d7f5b7015bc51ccabce1f64c6cbf564eda011fc3bdb3cf809594fa620b98202fd86c0ca5b083f9e77457cace4cc854c37541c1cd2e2faf41bf003eda90165d7b5646ba1884bd9e75c4941ddca0dc1dbeace314021362237795e9993cb438ab45749516b5d7a91ef2b1aa645cf3a054e04893c5bb9fbb1dc4006b4ee7cb4705521d05500a565598097469d0ac7401cb75a08e185dc316901c666f1ecda5e426f45c87a9692045974c1762b25440bdde119d82ec76d33508d26c7c3058a73995182fe82d56e725643cfb722db7bc7a1b7fe36ac1c2dcea391cb7db048e7bb127950f44347e7aa3010e2b72977774ad5b568acc2fd3381e9a7631d196b4a64fd9a1a65b5831b0bb66d78af49a711b7a1e212fd1869847c71a1db467b24858f16b794ff769452bc8be1f3aff7ad38d317de0c235a51b0d28de7b8d0525e7a2278aeed8e6c7cc0419f5967c86919fff31d02b205226d0c1cc05fe81e9bc3c8196aa813deef424ae01d8d140af04b9295658d1c4f8f4958b321dbe38564476d1c43096eeaea7c2d92c81a8a774a277092db570b1ecfb3f36a63006fef8692029ed409d265718ef988ab86bf5f3bd8cdd9de1ecd25c4ba27d5538416a6b86af4d3a2bd6aa3b43dbcbb8862ec2892a3bb7b173daae9ec9d72666f6a9150dda0ebe5edb6f64cc6cda224506e0712975c30c021e1cf83cfc62ed2801252a1d8d5f82f02772d9bc166cf10757c03384f3842d339b27d270f79079e79404e6d933b17530cc9ff004bce21e2cd271e7d9353aef118f99a93ba226d2e78f07e16b40212b2f48d19c2567d5873af7e49bdfe12a9da702409d1c4d7ced214d1e55259442222d827b590484b8b9706b805c25c7162c0c6c9c5d58efa91a9cb9dc6e87349bc95afa5a04c41d1ce41ad594adcfd93fb7357c32b46f1351291ecee68696843fa849da57ed1e50cec9d46d6b99d0a30e70dae05935960e6254e94dba3c6134fd7eac1ff3bf60567fa2a046772a866104823f2904351c6046fe11df8156791057171f0127ceb23cadd2440b0df7d87e5e3eab477b868e69f3da9e78e1fc02626310be982dc2b78367916932b4e16cf9ab4e8eab25480de37714f6f91141e7858a0c5486b274c017310bea58bc4b9af6552a10e255c50130691430d5dc732196b320475c0ebfd35814e1e18c6d0007cd0d1de40565f539a46a7a0bcc40ca8f633a922f278ee4f23677182d001a24676592d375dea7b7187659099b3955465264d97000445dee10669b286b5651e3d4c908ecfaa98a87362ed4674636fc6c6c61de8dd55c024658170751033f6294361c1add6f759317a3390ffdb0da4343a02f5ae3b63d7b7be60b0a949be10e887aa67cf1def7c408db6b89f3258780b998c8a70ad19e2fff3316933a7658191dbb78e25f73a22d1c9a1010421fb4abf243b7170bc8bd83550902af9388d671d402bd74e10f4b0fa82011f9bf34c4d9ca8728b6e7af7b6a1f7dcb2b28c34d6ac8dd6a23baddf7f22851b65ca2fb7e8f69b5cdc4a13bb36ce197f5ca1adc6c1404472afa8fe0f92cbf139a9745cdff3b325cc0b58f1d4410366ec1d3614e8c93f7dbdde78122d7371b81c66b34a4884058f0c0101bbf9e5081392d6a84b7f01e4636d8998f78df9d3a8519906d3aea09e3d67c919351c431ea3a882efe19c35853f15d1689235d6bc453311d8f8f2be841083b048478e5e04e57adfc0e20d0454e25636b995107e4b4ff587584413a5b75f4b500a4244d2b65fcb4a36aced81773339edb8317d4a6c9c3c71a02312b4d41e19f45f4749d91127a5aa993e98ba3fa99e749419455521dccc90e15603e45640383bd455e90d5724073eef83e6093fa9521bc77f5eb563bf398099433dfd7161c1b3a22a8696263c1ebb1cf1b0bbcbc4272c2632e12607164e3688f1ea88bc63622f57d5531a369921c71ada66f62a2ac7a0d7c7d65d9e052ae1484c7112c6426c2f346c002d05df90af2d40137c2ebc2a5b391e7077b8cba458b3a67d4080b10ad1bf7b73b889815e9f94149b44ed0234fddc9c74ceebb1dec82afc6a197257bc84924d2a831c2affbac3262c77da4a9bf1752ea9c3ca041ec6c49f603c052ec568332fb0fbd3ad7374c9cdb0b5b71889eced082feb6f1dabe91bb9819e663a5625dc24671ec0fb00c3c001bc7dee9a886e08be7f52fad9a13bbd2ef913a02a4f144785991ccfa33bb9bb00d42b5660886416ffd756b8c7d027b7ad8a45b0966770bdefcde889d2b155de4ec2721a1b11e7f582426ea12538f1bab2bfba3e0586f2f2302e38d7c398bf8d0b39c36f1e35dfa5e877d29c7e8bd66bb23d09aa6d5cc3091da7988a4acc5b5feacb2d2adc247668b9d7d9f45e51cb3f315d00ec3e5cf7a6ee68001e054f59933c0befcb22c807c7c5c2ab1f679bd2a9401ba10ef6aeb4dd240ecbb23910b07f3edd7dc45830cf29a36ba0325359c2b4871628b3f6163d132023223981bdf2acc5418f3b25db22b0c2575d5865d877386eea6e2d5b80c759057608ace72fc0c803ac46e7eb2678471458f","salt":"7920d0b688208bd58eab85208237ab1ea06e6ca05a692d291581d7c1aea9aa60","nonce":"c2b1e7da7fd7b1659e52e692","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"3ab0388b3b6772457a82cfb7cc125a2d36cd1e568594d0bbfdaee29d3e07c8ef"}',
  encryptionType: 'eip191-aes256-gcm-hkdf-sha256',
  encryptedPassword: null,
  nftOwner: null,
  signature: '0xaa451b258c31cdff4e4aaffff5df6b48d8de9ddcb7fa31183c745c0295905705637af5ab3bee1484f11a150bb35db4bbb49243f6439d9e357dc0830685fdd72b1b',
  sigType: 'eip191',
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
  about: null,
  name: null,
  numMsg: 0,
  allowedNumMsg: 1000,
  linkedListHash: ''
}
```

Example response NFT user:

```typescript
{
  about: null,
  name: null,
  allowedNumMsg: 1000,
  did: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  encryptedPrivateKey: '{"ciphertext":"833ddc6dfe07e8af7f78991f679ecb5b64d60b1cffc2fed4ecb6287dd04fb27e712c1fd8988b1f15c7b6f30914941f52b316a67b4cc1a8172c7918f00ee333b8a8610cca0320b9593145087a27d4dbd0582043d47538735d087455afacfa3b48b5aa40d82040778f5de3b8bed2c281fa9a381024dc233a92132afd745853a1abb2f305a4eafe7072dc3df405af93ceec52f1b8ce9bb796b5567993ef29e735c7ddcfd8b5b5e7ac6c261b67a76e0c392505777591a98e85f7829796d35efaed030b348b14349539bcd6bd34d4599c7af95db1fb605672d3318737184f92c0d54580abf4be00138f047d8ad69952f368192ab62906dd7f9ef66d1573f9ffdb129bf40c11816057541aefaf8fbee93e80d27e6b09854aef29b8d853bd8b9d994c955400b90e8d4e2b40dd1885ebad81f6c6bf2c41e16039e6a94b8213a501d100ae0b5351198ababe328a8f17480daa70cc0cb65c0f4791903ddb8508f1d304daf64b91f43bbcb489163fb01a6c43815d18e6befbeb78c30be4699366b64b5687335a1f910eb7bb542df5b3fee6f01807656e7b498a55914453dc08c17d89aed5b68d65959959e1a6381944491c7f709cbdec6192f2431f8f47bf94939c866539e5869b1b2ada24159b217fb30f117064120c8eab40eea54b7cf5b2ecb862bb9cdbe45c2d6f5a83476ae3c04019a7920120fc98ae704017f0b93a7ea84ef2a0b503ddbceef31fb31b5e57e6b3e782a4622dfd3fc9df59e4d8100fbf9901ec5a18768c2368182a4a6db10d2bbdaf5972ba8c7a57d4d45d6bbfaecdc529522e4dbe852b6cedcb82d7e105e8f8c169537e15bbb87c64270856328af88262b89ac2abe038d9d185d0cf8e03b760a4f08ce02c06ea205bce7c837259f06bce42795e5bfd8aa769175cba15fd29bbced2f39748e5ed992760aa6da6379560b2247976fec08614226d5090ece1daff0013fec33dd9bee160d9eee9d357c9efc859af81944996d7f4f12c56910b96dfc4b1ae7530c259027229a0e6cd8da0f352bc296611d7ae3d83aee6007aa72ff0a6de0e49a4f73eaea9b688162845f28875da97b0968caa39cdb9d64c4440799fde517b63e2836840173054952ecb7a70dcb139cf78261056cc9120bc78adb815380038b1c4c1c7502ab0ec065349a3f44ebc838663f1618c9ba1c22920baee2f8ab97fd4526c7a6ba7f6d69a8a2bd5b0142e63e2fd29c7618c2c902d50de3b0c16cc849acc003c6865460ce81280ab4fc1eeb93aaa21ec2093e3337e05b3755bc2bff3157ab5c292dcdac3b514560b14ac60e08b770f008e4e77217a84a153f2fa246f728317f06470ca31abcc060f00b6eee751a99e38f56b3759e395c2ec58a77e7cca5312077a0f23d3e456ae329f8e1ec54e9f59d21537756b1b1f07b776edd8ea5dea34c84ada1331cb0d6f2b84df6785a36615786985082f7f8a6b8ef52f1111245f5cdda223d6e5e3794e5fd7afdafaa104280337e0bb2db832c004e9ea74f10b95c272ea4361d4bc6f5ed79ee361fbafedc629da0ecfb91f14da9b687b0c569982fe8682b383476a445c67d3929b4b80fa2478ea3b49d9fc73aa58c3567f2271679978ccfc0c511bf596bd5e4bd1ff79fc939bcb9f4f21781098411043a20aa0b48b91bcf55bcf0bea1af34acef1c27c2d3e1b6afef2dc0265e40ac812872faed5ef0f948181fceb303eb8a43ba5f25523f06031bc6ad151dddabd7df2296f91d1f6a9840b3d3651c02c93a467249d01b364302b7a2def68ba64114861ec61eebf353823d043ad72ec40068e2b60b19a1582a817e1048f02578a2933f4cdbfd87029b5329b1c05babf3650d1f7895333100a695fcba41ceb092fc0c539c62960b232ddd83fbefe8b757b1f69f853657493ea5ed23009ace2faa47a6bd0f253c8990f934e7c26a4924bd5628b59a969e56ffea4fdb3fba9aeb0213149cbb4f9cb33ee62bde1ab4330f3a7674264e89d97d131ceade5e11c9de12305602c6c148d7e19fa77457396ca9bd0d7d5816dd46a9e14690f4d3c40843d17489b70b89a655566fd01d3fd3d2dfb559599e2f450b137ef5fad512b98bff6f783ee6b348edcd4163b7ff554e3bd093c5c7bf1a4823a82bb2ae641f24963ad54409f65db3ab094d0605397ca2774204af5bcac834ce0c987c1b5d2afb43f07c461dd64a523030f9329cbc48f6cfbe6a28a41bc8c6ead39fab275f6d6c6e07be9313702f314dd12c1fb3f1d6666d5d05623d9633ae892b9545b96a77f48de349ed3105b714c7cafa8990e1a7e7a135624374dd1b9338fbe2dabc583f8faa4f5e3978b10c2b6ff0218c51fe604267e93757fa3a65d2ce9698e6ac50d1bf3bb7721b54a8395084d20d9a85d774389f867e91650e4699cfb0f2850e0512d2b53efbf5df6ef3a816fdb1829ab32ce3ae96b564d36f415a55721d0b9f5b6277d23f47c1a58669083d77a11c9d543332ca73e261f8046639b07f35bf727ce2ccbf86a15f853350b58cde58992bba4ba79b6d52654bb956093c6d876b1cc18566677da4d281273305e20eeab54dfbc8f9d00f7a36d3addb9f622986936f80a2c74798a9dadd3fc0fa489f9211e32bc7e3b33752249a1911b44d873128b22ecbe95451c8b693ad40f7898f7e5b76e5f09b51a1dd9dd9ca838e4f8c19eeca153f99b57387ae8d7fc71939d7f48ae75296cfc4db6ddab08b4d2cb15b7d69acdf13e2a0e9a6839db390ba9744b421c029a9811c9fea18948eaebaeeb75b9476e3be90fdd162419152cdd6b7f4a099c1a807f55882415f936add29210dbd8f6462be8c7f1949011f62529f98dcfb9766c60d40292f01c6fcab1f5a899bfe4ebe8b60515f6afbe4803ee99e37b976a92891251d28a43d56fca6ce736f1eb6ef94d20b84c53c822edc94a3ccc55de033a852f3da27508b1c81de1cca9f19b46a5909b0ba8bf7c38ddef2179d119ea205a00573c435befe16cbfdc0c315922a24cdcfc789c965297c64017ac0a0ab23e8ed5b47f76f42ab3552e470a4080564fc7b77149b997761f1a4b3b9f15ba22fa1a6da3f7366a7f90df62124ae637573b92a50b3c29870edd96250d310e8e8413e958880d73619840ecc1b8a8c5f6ce7133dae4740d2deba69ad89d4a7b637db48df5f36491793042ecd88605863024db842768acb43d12cd61aedcf8ab7a34957918d4688f2728b02431dee06a28ed6d6b149f714b7f89986ad684991f291459bbd97bbeb1ab73da5475dc75b48b6417a25a9c2836cb4f3d30e433382b6cb78d5b8642c37b8e9a8c02bbc0fac47e84f80cbf555f8e886a1f4e4ed9064884d7ffa8833933d30d13a31f1deb875f86f4a25b7456a96eeaceb44f4dc39620ac3fe1f8a4830a6bc30c584adadada3dd4a612c8941f6b97417411cc1ed2aa41c6bc442b8971bf5efb1998d5110861fb650004d0a33a5ca4522bb6ac7cd904909f206ae15f66314be98d7772ee4bf7185455c867719c3b61bbc753ca3e6b5b4052fb2a71c80dce5ee31fff0380ce786c934f94896c2c344561f8da151eefec62c84784dd38b2c19d32e3d27571ddb4c30b673e6aac7ea59e56455c7bd1084fbe0eaacd23e3c72a4d16e7cf3296bdde8037ba085a5d8e5e12e506be8696b97f0a4cdbdc3ba63ab5a3567f558d287e67ed897d084a66fc9e74ea5f8c3f4c66b5b132d123d81a6bd313fa735a3472776f917ae6c9b2e1ede2dea152277338d60c4c27446f1dd55f338cdd22dc30002c2a4c9bf7d8c82a0dca395062a3cbe6d3d1e67aed0bfd877334f134228221b530aee740a9fd96cdbf2dab8ac178d53a690edb592e5264f05faacc83721d35bb878724a90369b6b339884f53d51583ae7110caaf5790964c7adcc50d6310226b1fee785616ed47ae54b9e89233be47b7c53c7c51d7cf99bf2785d742b1927ae1b46b389c00c9be90def2475d5ef01fb30477b864389172686bf27af83c68ee0811fa03c12d3356b44cb8aed2cbc0e562ac0d7b2da58293b568bda2d73a2cc716f6796583b6f1213654153997e4f9e0fd68b47df65d933d14be7876d66d7a80b45ef1e53a172473b6b70e9d5eee0e4e77fa15c63c8dc21d452dcf9346973d6b539eebf88d1163314aeb180b44fc19e37a155537075e905155001935b2a09d041c4afbf9ebb688e70c0d90867af9f18b005ff0f6765b5e1483e5b9af9faefd12208ed285ab46a19f4f147e0a30aa66b683a84db4942953ca4b65cef720819d1c6b67983c16d78da3b6e649b55a26b69fa307a339139fc51c56fc8eccf3297fddd1fbfcdda60d3906225160091380725673dfa0e508e7407b1a1d6668ab63c6e2f171dbf647abe0e9c0edc231b99c0ccf7ef64206a51aa566e00e6c549104a5139e844d1876b85123aa6f4bb42a643279da16190c272ddd11ab854a6f8420ceff18108646bb2a7fc914cfcb93dc496ced49c72afc97dea4d285ecd09f55797178e7d366931117ce55532a1ded360635f64d3ea1553ee7dbad5945391810927f22c378970c0d26fd0d9662e381bed5d066cf99b4e52660a10c86ca116fdd2fa763c2d4be36871c24b577a12b6e405a49776f691b5e72567c38d0ea5b302fe5c190eb3e3e97f7145dc67bfbed9bc4371747e7d015b528b21c7fcdfd189d0801849950aeb23dd9d727ce524138ce382c02f17f4b5b62923150abfdabd254e96a62ae3acbfd136febed24b693c124ae8b38e18e69bf1dc0835dcaa38891a6b78bef84317d817964d92b97e48ed4dc4a79b1939bc020bde8b58eed6bd72c380fb1872101d08e340f593daa5ad1aed1dfb13734aa0e8f6c6fe6aae8b3c7cbbb17b2a152424c29e3b7c47a7803c4b1ab0536c3f74e3b1b9c103d64c8f1895b48f71fe881bf1d82e9e6c0f9a7da703a7b774dfd72f0293ca25f338cd7a63354bf912b1668","salt":"cfdf1532770a3b27e0329a8fb1053f9d8a226e836192be779e17d41433bf460d","nonce":"f5d61962ead20df2cd138c89","version":"pgpv1:nft","preKey":"","encryptedPassword":{"ciphertext":"7cae72fd38d784c7e200a7e503042876cd9fae923c0614a1d1f66a3008","salt":"7af2cf5b44bbeb31f19559fccbab9890fae5ecc67e0e3a1e0654cb2caadb51e3","nonce":"194fca4778be7d05348d9c04","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"78217c6716dc1f346f7335d5bc7e3c39cd71cfc866fec1ac0daae98af0787909"}}',
  encryptionType: 'pgpv1:nft',
  encryptedPassword: null,
  nftOwner: 'eip155:0x736cd8461132a1b52d95d535230ca4cd4c8bd7e5',
  numMsg: 0,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsYnEMBRF0bsfgWKVNLCgzAqmBRegUlSAWnBgZ45cw1aiWNFu+tjAMMzAP+fr+2f7RYzZuJNi5c6YjTspVpThzHBmOAtjNtR67qieC+9Yzx3Vc0EZzgxnhrOwnjuq54JKsfKKFCuq54Jazx1lODOcGc7CtlyoREWN2XhHihW1LRfKcGY4M5wF/hmz8UljNlSKFWU4M5wZzsKYjVekWLkzZuPOmA1lODOcGc5CihX1PB6ongvvWM8dtS0XynBmODOchefxQPVc+KSeC2o9dpThzHBmOPsD9rc47ZwLW74AAAAASUVORK5CYII=',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRklv0BCACT75kx7wWnXEqbCi9wqV0wVTcw+qMmEcL0gVoov9xu1ZqO\n' +
    '5v/MP4i9O4HyvqiPprI3tZP+7tdGs6l49oOhZfNDJ+fzgwVNbB2h3B7bMv0D\n' +
    'VDEwaqU1vwLZD7REFoCFyG3XQZ1sm+kzeWBU32i1B3gfwDb/k851bZtIl2Xg\n' +
    'E31SmAehMq8ndoxNz4T6emRf3l6f76Cd3tFHzaScYXxEkebATxmfNkt/PAEa\n' +
    'K8ArbkYGwzzIbR6QfIP2DIzeIkL1Cv+dkTNFoU3mmbllL+73VezXy60GhtjJ\n' +
    'dsNONtTxZ80gIYznRsyfXLMAGhmIU6+jU9jC5dI0TUjMSCFEetBeIGi/ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZGSW/QQLCQcICZAPoYjqh/J4mgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBFA32mzi6MqpsczcbA+hiOqH8niaAAD22QgAgpRqs1lCIedY\n' +
    'trMpey7xBbBbMbV3c+XOX0PK720Z2DY3B+rf8WDbOnZwiKhYFO0SEYL8Tjd3\n' +
    '/VmkwgOXeY9fwgAdb1yUAUv95P9C9SOqC6SnMEwumQhbwuf5QpQL2YKV9uCE\n' +
    '/nzVhqZtofoOVZg/d0+oGzh41VIPzg4XRHYVl1m+5WblgT+r80iV3KxPEJ5o\n' +
    '0zTZVDH6O8E4JUxJogzacCg/d8iswOhrph/GwhI5W/vwfoZpVGPxoH5tWSrV\n' +
    'VbHlXC4UczUPbuUdmSUclgxW1slKPm/ZvoG7g1dkiTKT1pePefp/OeyUqOOi\n' +
    'dGaJvwptzSUh5HipNhZJSJLNal5b8s7ATQRkZJb9AQgAv9+bMh0+JFWEg2CB\n' +
    'z7WV6AV37m9Thx5zKmwKrnrJvJ1ksEPkSu+a2TZzulWXIHFQ0R7ZA/I1P/TF\n' +
    'aZU3LeRbo8XE8sUxiDN+QKeUUIVQed69jVEiw6A0qlZ6CCLprYnrMTEcBj1z\n' +
    'n9ORrQEankOSnrBNnvV0FoWapPMpYB05vrzQHzFwSDRnunC8lW3ctnxsOqLV\n' +
    'kX38L4yg7RSFgpvLh9wIEu3jZEbq1NCAa6WWuJ6SiyX8YC5xq/TQUdSG5k2d\n' +
    'mbvhKiKIoqL5RlkRxRNro4zTzC0S7dxDngTnXu2US208k97B9rq+jYZeEajG\n' +
    'DN0OxjjUECwU3w3m1Zd06dLmIQARAQABwsB2BBgBCAAqBYJkZJb9CZAPoYjq\n' +
    'h/J4mgKbDBYhBFA32mzi6MqpsczcbA+hiOqH8niaAADfGgf/SL6CCFj9b6sO\n' +
    'bw08wCT3gddIG174HIMGJ1VUuajaTU4ex5ibuhpumJmRQdx5fykM1k23C676\n' +
    'mXKbXqnmT6Gk2Lu54gl44m+phBbwjyedb9nqTeeuS+2r/cubm+BLH9MQphbF\n' +
    'N8uMxsCJ2tPO9pTsBNFoOSkqVHYcwxtQp5/wkczSqWFvgf9Z8966QOpd/j/i\n' +
    'aopY/oO/fca36wDn1Gh50YZJ0IFLiHtyqNtY+3nfukycmwc9+LXXB33cagmk\n' +
    'ciku7y7o1+i8eLOi4Nu+trK23hx7/W2l3EHPrW4pyrywr1zhTNehLaacb7AB\n' +
    '/3vvjFt8AVCXLJRB5vcwnf4O+CnfLA==\n' +
    '=Ji6t\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  sigType: '0x2422c8b422b5437cd3718823b4bd952c418108f77e0f5d67994d268445ff076d0ca9b73555e642d4ae656af1bff1a7ac87b856181067175541168b7ae492b0c61c',
  signature: 'eip191v2',
  wallets: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  linkedListHash: null,
  nfts: []
}
```

**Version 1.3.x**

```typescript
export interface IUser {
  msgSent: number;
  maxMsgPersisted: number;
  did: string;
  wallets: string;
  profile: {
    name: string | null;
    desc: string | null;
    picture: string | null;
    profileVerificationProof: string | null;
  };
  encryptedPrivateKey: string;
  publicKey: string;
  verificationProof: string;

  /**
   * @deprecated Use `profile.name` instead.
   */
  name: string | null;
  /**
   * @deprecated Use `profile.desc` instead.
   */
  about: string | null;
  /**
   * @deprecated Use `profile.picture` instead.
   */
  profilePicture: string | null;
  /**
   * @deprecated Use `msgSent` instead.
   */
  numMsg: number;
  /**
   * @deprecated Use `maxMsgPersisted` instead.
   */
  allowedNumMsg: number;
  /**
   * @deprecated Use `encryptedPrivateKey.version` instead.
   */
  encryptionType: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  signature: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  sigType: string;
  /**
   * @deprecated Use `encryptedPrivateKey.encryptedPassword` instead.
   */
  encryptedPassword: string | null;
  /**
   * @deprecated
   */
  nftOwner: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  linkedListHash?: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  nfts?: [] | null;
}
```

| Parameter             | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `msgSent`             | number of messages sent by the user                      |
| `maxMsgPersisted`     | number of messages allowed to be sent by the user        |
| `did`                 | user decentralized identity                              |
| `wallets`             | all wallets associated to the did                        |
| `name`                | user name                                                |
| `desc`                | short user description                                   |
| `profilePicture`      | user chat profile picture. As of now i cannot be changed |
| `encryptedPrivateKey` | encrypted private PGP key                                |
| `publicKey`           | PGP public key                                           |
| `verificationProof`   | verification proof                                       |

</details>

---

### **Get user data for chat**

```typescript
const user = await PushAPI.user.get({
  env?: ENV;
  account?: string;
});
```

| Param   | Remarks                            |
| ------- | ---------------------------------- |
| account | Account address                    |
| env     | API env - 'prod', 'staging', 'dev' |

Example request get normal user data:

```typescript
const user = await PushAPI.user.get({
  account: `eip155:${signer.address}`,
  env: ENV.STAGING,
});
```

Example request get NFT user data:

```typescript
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: ENV.STAGING,
});
```

<details>
<summary><b>Expected response (Get Push Chat User)</b></summary>

**Version 1.2.x**

```typescript
export interface IUser {
  did: string;
  wallets: string;
  profilePicture: string | null;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptionType: string;
  signature: string;
  sigType: string;
  about: string | null;
  name: string | null;
  encryptedPassword: string | null;
  nftOwner: string | null;
  numMsg: number;
  allowedNumMsg: number;
  linkedListHash?: string | null;
  nfts?: [] | null;
}
```

| Parameter             | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `did`                 | user decentralized identity                                     |
| `wallets`             | all wallets associated to the did                               |
| `profilePicture`      | user chat profile picture. As of now i cannot be changed        |
| `publicKey`           | PGP public key                                                  |
| `encryptedPrivateKey` | encrypted private PGP key                                       |
| `encryptionType`      | encryption type used to encrypt the private key                 |
| `signature`           | user payload signature used when creating a user                |
| `sigType`             | signature type used when creating a user                        |
| `about`               | short user description                                          |
| `name`                | user name                                                       |
| `encryptedPassword`   | encrypted password used to encrypt the private key for NFT chat |
| `nftOwner`            | NFT owner address                                               |
| `numMsg`              | number of messages sent by the user                             |
| `allowedNumMsg`       | number of messages allowed to be sent by the user               |
| `linkedListHash`      | cid from all messages this user has sent                        |
| `nfts`                | array of NFTs owned by the user                                 |

Example response normal user:

**Version 1.2.x**

```typescript
export interface IUser {
  did: string;
  wallets: string;
  profilePicture: string | null;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptionType: string;
  signature: string;
  sigType: string;
  about: string | null;
  name: string | null;
  encryptedPassword: string | null;
  nftOwner: string | null;
  numMsg: number;
  allowedNumMsg: number;
  linkedListHash?: string | null;
  nfts?: [] | null;
}
```

| Parameter             | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `did`                 | user decentralized identity                                     |
| `wallets`             | all wallets associated to the did                               |
| `profilePicture`      | user chat profile picture. As of now i cannot be changed        |
| `publicKey`           | PGP public key                                                  |
| `encryptedPrivateKey` | encrypted private PGP key                                       |
| `encryptionType`      | encryption type used to encrypt the private key                 |
| `signature`           | user payload signature used when creating a user                |
| `sigType`             | signature type used when creating a user                        |
| `about`               | short user description                                          |
| `name`                | user name                                                       |
| `encryptedPassword`   | encrypted password used to encrypt the private key for NFT chat |
| `nftOwner`            | NFT owner address                                               |
| `numMsg`              | number of messages sent by the user                             |
| `allowedNumMsg`       | number of messages allowed to be sent by the user               |
| `linkedListHash`      | cid from all messages this user has sent                        |
| `nfts`                | array of NFTs owned by the user                                 |

Example response:

```typescript
// PushAPI_user_get | Response - 200 OK
{
  did: 'eip155:0x85e6350861136e65BE141d8DB1eEa25cA346743f',
  wallets: 'eip155:0x85e6350861136e65BE141d8DB1eEa25cA346743f',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRUAu8BCACV4muD50mKJeGPU33ZkTXi7x6eMpjXlmMQbVERQ7MVKvOc\n' +
    'cN+9iz2A18bi73vPYq9FwF/Ibok+A/SuwTbiEe/5E0FXJSnC87DWVF6Aq6At\n' +
    'lzCT4WHYlkHU2h5+JNaD8CXOxe6bsGfzbZ9dSZ9zfs5IoCh6Qf035cjV7wH6\n' +
    'lcGykxvZUIfKiJuwXotkglGzk0317oo37ZXl6f2hCJBg7NdewXGxVKFYu1JS\n' +
    'n5ztzAkoRyiHUnuFDje+HmkU4PjhtrHiFrEeooRyvR/6YCvyIue7f2lIXKV9\n' +
    'rOCyczJyDWTf3wwpklDZVEB0Guv4PHcWsTuN1pqyxgz2bT+umctEvla3ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZFQC7wQLCQcICZAzo8jUDaqidgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBNgrG501gFGxwttFzDOjyNQNqqJ2AACgaQf/Rt33rLH7Ayxb\n' +
    'UED4L7a5f6aw//jk9Y+yqpB3QbwJTSoD02yUqUJ5J9sW46m8k3eQc6ds4OkP\n' +
    'ylaQtoUkumELSuS5hON3Y2IQ78fMvv+My8pQoxD4HzzLj7uVOHaHaElygfoC\n' +
    'pfWSDU2UrJB5TK6noOTspcdB5QlCKh5fU0fDtRQ9OKVTM4NTAmYxsDa3OZO6\n' +
    'DvqfMAK75tlHJr+Xro7GUbKebaJft/guA2ZHpGTHhs2Q+grjQcvljx6BoN3o\n' +
    'NydGwkCorcVZZO7XKr73hPE0VH/LlRqZJ2lcBn/kUJzG1Z1LFYcny+FCrM3U\n' +
    'cCg5eI+Is436jSWBl3bhtdYptNwdNM7ATQRkVALvAQgAt7ghdqho1nII81Vk\n' +
    'BAs2LN3Vb56GyUCTgZjBP+nbIVat6Kjd2H9dmXVhYEbZMFZyjqAdUwFzoJ8p\n' +
    '3Y6qAJxmCktSZ77mzBeojZXi3VesOVfrCzi6MDU+SnN4mguL72YWr6gEbQK5\n' +
    'Ypto4uuEh836Dcf7WCj20fTSRvRSKakmBGwnzP/0Gj7fo8S8OQLwFMMEo7bf\n' +
    '5ExVuB5Is2SEUxWdeXligBMSiajLJo6thlzs0rTsY/ugbz/czulAMDh1MnST\n' +
    'Yol6nHEQUgZFgWx56ARwOn+Y8hJPQqnpWmQie+BakUEabHQjY9sEJ5UDozZ5\n' +
    'GwGVrfgETiNblc0crVnUI7CQKQARAQABwsB2BBgBCAAqBYJkVALvCZAzo8jU\n' +
    'DaqidgKbDBYhBNgrG501gFGxwttFzDOjyNQNqqJ2AACmjwf/eZuqTjk9MIgq\n' +
    'fdlWMM6kLD7W6hScgHIvms9V21Zwy7WQtMrxmQRhCqCHai/eXe/hFABmWxUK\n' +
    'nHbosXKL3DQUapvn2cm40BWseW8Il93oRbSQb7xvFQ3g+mNEiSgn0oWBCTSf\n' +
    'W9HM/3Kowfc34ilvqfquan+ilCID8OzXHHZXx/nxHeVbpARZiHe2ebk1lr6r\n' +
    'KJzq/2S0C65xgn8ShTU1Aewio3+5kr3oHzlTlSnF8Ov5c9VzfEKb+UP7tBMO\n' +
    'b8quBez/BgDetebCxaqy881+/LY535i9xVUNDkMK50jY+JvqW10HeuVXOVxZ\n' +
    'NrSotIw2xObkCFV2WN46DVNt2S541Q==\n' +
    '=Zf86\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  encryptedPrivateKey: '{"ciphertext":"7496a39864b0882212956f02270d8b34ad8fbdcbbcf97d359eb8c95eeba70d8daf810d9874ff8cfff5e7840bef8ee12b82a2c7783c28685035ad81dee5233d37570bc4e57cc2d56ac252a14db2cec9777a73094f3efaead3843f59f0a64efcd4f9ded45edb54c3e933811790eee9c5bc9877f9faadf50fe6436510111cf62f1b3419816bdd80f292326b5f58dd8fb595bafe56970479530de30cfd4b3a9c6ca82554016ce902e0bee2db1f636f8e0bd7b2c6f98157220885b07bc9c213a67de847c97c21fabd40440fdaa911219118b9a0efe2ff34fe78fbe2365963f8e2f0d6e22c12d067614d921eb021cea67d8fc36866efe82401ef124de229f27686b93183cfffa75332821939bfd9b5c2ebddb8b388fcee489d06f9bebbc407b68d2a57dd247b3edf51d14010da4cb8325e392475c68383a4dec063e8d8f84e6d553da2c4f84fe9143b2e212e5a17a436d14431e421a7eac40c9e460f37819831f692e9d14617969ecb2cebe4a934f0d36fb85e9694857cb87ebc7186c420362a2582d641bb1112c1bb32822e161ac1c130841ed69d9cdd7c5683352c51315d87abad1c844c1b46017346642482ede19e6be01f8bed93f29fd1d899bc02e99a4463d37b30f3e682877d1cf266c5a30862f27aa9a044ab90cd4e9d069512d0b22f57240480d71671b7d8d9bf3261eab7cb6c0279f159bd53bec28dd48a9f6433f225cc45c5dbaa7d58f0dc6b0e0e52ae0f197d6e9ba458e47ed8dac43351bf1099ce8e367bb67cd706c1a25f5388af9f6370781ecf2296b148eae9e9f554fc3a9dcaffd53cb9650937f1f5d50a566b314542cf5e0994c99fce26053a794f1b38c480ca6a6f344ba023092ca039f37c74b6fee0d0dde4d5553b192cbcdfa50d733d874483a269069e260394a6cb515e2a7a5e6daf6221fe9f7540845457514d38119d858abdcee09595b9266ae06110726391b652881f07f41988abc9080a6dc1fce8929bac13761ca12c66178a487e1d42b07a128e42c6582999fa0e8d2f47ae079ee46c3b13ac058f58e3f27dcfb22e4a2620785ae317258397bc42d64ce0e02c769c426fcfb5b6d9c7862872f19bf1bfae517e60bf853ecbe269143f67c6b2245cba29335a264b3d94a2f5444223aff7f1dab63ee4846cdda557a9b8041a3edc8d5b1ba23f6e4080129e3c25b3336a3ebaf23de2140f1020d332a472795c6f7ab1a767997c6c9a679a1bbdc34415ca83ea46d818af26ae92a0c05c7e8de2a0d960a92975a2709d25c33d2f980a7e5e5b279c6b8c733241b1447448a4b673f28e45d72409a3929b51d86ff3f2fa1aa07e0b355993d2d14035283a366c4d55fb2172bacebd7a7c3745f4e9aebb6096a2a7bb094e29be60aa206c26cdf5aeda9ba7cd40ea291ab7980020fd3b8a69bd1889cf8a347f327b79b21ce370cb2ca75920fd258704da8d23c8df55ecefa528a37adcc06f37113fccffaa958d13b3435fe81823107bf01274c0ab6912cb1960c0d4c7a4f40e3b23b3c50a65785b12ff8663a31fb1718cc6a4dd2a57c3456ad1743c81743c4366d31d987d016f800502c189a12c55e562cb3fb1c198837aa9a9735d3b7d18ea4ce2936df1e579330d773f3da0f7b733a527d11b68accd1fad3166e61b30594b76d8a1594e4ebd692ed4e54d955778d752a707513a5278502dd0ef64c6474c46df0cbba3c763e6366d005a0580f91f9f3674e06421d6ac3828fa2f79cea6d81686926df8092389e04d3e290ce3fc8d9b885b0df75beb5b6307e4fa6f2c4efe7005ac4f3779a48e290d8afdb98ec82046b2621d9ed09cc59f11cedccdeca85962e6b50f4ec9e512da6f547537e75f254aaefb76cb6981f3ccabb7e3230610aa3a50adfe23e04feb1e0b0dc67e1e9e1570808ae3f029583c25fa5f10f983c285d7b2fe0cd13cdd2a91294adcceb3b57bd6687d2b880d963872ba56b5696d63b8110ce4ef7e3af8c7c091fd65b2ceee3bf206d0c54c1127b051d74779545b344389f843eabe5c9459e421176f912ddb2a31f75dd12c964f01ec0f53d164b92c95f175a900e8a707401d2898141ec52d9c3ea619b71e46fc492b6ae9e524c6da32373d19dfbfe9ee3e2a3898fac7f57cff2b1eabd72ab3f48d6021b996a3fd1015ace78742b969a4754ae5a47d510e98f7c02b6833de4c89e1be31d5448a433e3032eaa0e5ecd8b3a40a89f493415dd8c0ca7d467b3ea2e01e902579206354d7dd7936b1593cbd481eca61dd19c62eaf25737c2a70db08f6cddb7776fc849b5cc1ada596d6b07b24f0cae171a281a70f2c8eeed67c74d4b79fc74facbf40d6f89f4f0a91510463454117f1d99d08aef055605452761daea5f8dd47d7f5b7015bc51ccabce1f64c6cbf564eda011fc3bdb3cf809594fa620b98202fd86c0ca5b083f9e77457cace4cc854c37541c1cd2e2faf41bf003eda90165d7b5646ba1884bd9e75c4941ddca0dc1dbeace314021362237795e9993cb438ab45749516b5d7a91ef2b1aa645cf3a054e04893c5bb9fbb1dc4006b4ee7cb4705521d05500a565598097469d0ac7401cb75a08e185dc316901c666f1ecda5e426f45c87a9692045974c1762b25440bdde119d82ec76d33508d26c7c3058a73995182fe82d56e725643cfb722db7bc7a1b7fe36ac1c2dcea391cb7db048e7bb127950f44347e7aa3010e2b72977774ad5b568acc2fd3381e9a7631d196b4a64fd9a1a65b5831b0bb66d78af49a711b7a1e212fd1869847c71a1db467b24858f16b794ff769452bc8be1f3aff7ad38d317de0c235a51b0d28de7b8d0525e7a2278aeed8e6c7cc0419f5967c86919fff31d02b205226d0c1cc05fe81e9bc3c8196aa813deef424ae01d8d140af04b9295658d1c4f8f4958b321dbe38564476d1c43096eeaea7c2d92c81a8a774a277092db570b1ecfb3f36a63006fef8692029ed409d265718ef988ab86bf5f3bd8cdd9de1ecd25c4ba27d5538416a6b86af4d3a2bd6aa3b43dbcbb8862ec2892a3bb7b173daae9ec9d72666f6a9150dda0ebe5edb6f64cc6cda224506e0712975c30c021e1cf83cfc62ed2801252a1d8d5f82f02772d9bc166cf10757c03384f3842d339b27d270f79079e79404e6d933b17530cc9ff004bce21e2cd271e7d9353aef118f99a93ba226d2e78f07e16b40212b2f48d19c2567d5873af7e49bdfe12a9da702409d1c4d7ced214d1e55259442222d827b590484b8b9706b805c25c7162c0c6c9c5d58efa91a9cb9dc6e87349bc95afa5a04c41d1ce41ad594adcfd93fb7357c32b46f1351291ecee68696843fa849da57ed1e50cec9d46d6b99d0a30e70dae05935960e6254e94dba3c6134fd7eac1ff3bf60567fa2a046772a866104823f2904351c6046fe11df8156791057171f0127ceb23cadd2440b0df7d87e5e3eab477b868e69f3da9e78e1fc02626310be982dc2b78367916932b4e16cf9ab4e8eab25480de37714f6f91141e7858a0c5486b274c017310bea58bc4b9af6552a10e255c50130691430d5dc732196b320475c0ebfd35814e1e18c6d0007cd0d1de40565f539a46a7a0bcc40ca8f633a922f278ee4f23677182d001a24676592d375dea7b7187659099b3955465264d97000445dee10669b286b5651e3d4c908ecfaa98a87362ed4674636fc6c6c61de8dd55c024658170751033f6294361c1add6f759317a3390ffdb0da4343a02f5ae3b63d7b7be60b0a949be10e887aa67cf1def7c408db6b89f3258780b998c8a70ad19e2fff3316933a7658191dbb78e25f73a22d1c9a1010421fb4abf243b7170bc8bd83550902af9388d671d402bd74e10f4b0fa82011f9bf34c4d9ca8728b6e7af7b6a1f7dcb2b28c34d6ac8dd6a23baddf7f22851b65ca2fb7e8f69b5cdc4a13bb36ce197f5ca1adc6c1404472afa8fe0f92cbf139a9745cdff3b325cc0b58f1d4410366ec1d3614e8c93f7dbdde78122d7371b81c66b34a4884058f0c0101bbf9e5081392d6a84b7f01e4636d8998f78df9d3a8519906d3aea09e3d67c919351c431ea3a882efe19c35853f15d1689235d6bc453311d8f8f2be841083b048478e5e04e57adfc0e20d0454e25636b995107e4b4ff587584413a5b75f4b500a4244d2b65fcb4a36aced81773339edb8317d4a6c9c3c71a02312b4d41e19f45f4749d91127a5aa993e98ba3fa99e749419455521dccc90e15603e45640383bd455e90d5724073eef83e6093fa9521bc77f5eb563bf398099433dfd7161c1b3a22a8696263c1ebb1cf1b0bbcbc4272c2632e12607164e3688f1ea88bc63622f57d5531a369921c71ada66f62a2ac7a0d7c7d65d9e052ae1484c7112c6426c2f346c002d05df90af2d40137c2ebc2a5b391e7077b8cba458b3a67d4080b10ad1bf7b73b889815e9f94149b44ed0234fddc9c74ceebb1dec82afc6a197257bc84924d2a831c2affbac3262c77da4a9bf1752ea9c3ca041ec6c49f603c052ec568332fb0fbd3ad7374c9cdb0b5b71889eced082feb6f1dabe91bb9819e663a5625dc24671ec0fb00c3c001bc7dee9a886e08be7f52fad9a13bbd2ef913a02a4f144785991ccfa33bb9bb00d42b5660886416ffd756b8c7d027b7ad8a45b0966770bdefcde889d2b155de4ec2721a1b11e7f582426ea12538f1bab2bfba3e0586f2f2302e38d7c398bf8d0b39c36f1e35dfa5e877d29c7e8bd66bb23d09aa6d5cc3091da7988a4acc5b5feacb2d2adc247668b9d7d9f45e51cb3f315d00ec3e5cf7a6ee68001e054f59933c0befcb22c807c7c5c2ab1f679bd2a9401ba10ef6aeb4dd240ecbb23910b07f3edd7dc45830cf29a36ba0325359c2b4871628b3f6163d132023223981bdf2acc5418f3b25db22b0c2575d5865d877386eea6e2d5b80c759057608ace72fc0c803ac46e7eb2678471458f","salt":"7920d0b688208bd58eab85208237ab1ea06e6ca05a692d291581d7c1aea9aa60","nonce":"c2b1e7da7fd7b1659e52e692","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"3ab0388b3b6772457a82cfb7cc125a2d36cd1e568594d0bbfdaee29d3e07c8ef"}',
  encryptionType: 'eip191-aes256-gcm-hkdf-sha256',
  encryptedPassword: null,
  nftOwner: null,
  signature: '0xaa451b258c31cdff4e4aaffff5df6b48d8de9ddcb7fa31183c745c0295905705637af5ab3bee1484f11a150bb35db4bbb49243f6439d9e357dc0830685fdd72b1b',
  sigType: 'eip191',
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
  about: null,
  name: null,
  numMsg: 0,
  allowedNumMsg: 1000,
  linkedListHash: ''
}
```

Example response NFT user:

```typescript
{
  about: null,
  name: null,
  allowedNumMsg: 1000,
  did: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  encryptedPrivateKey: '{"ciphertext":"833ddc6dfe07e8af7f78991f679ecb5b64d60b1cffc2fed4ecb6287dd04fb27e712c1fd8988b1f15c7b6f30914941f52b316a67b4cc1a8172c7918f00ee333b8a8610cca0320b9593145087a27d4dbd0582043d47538735d087455afacfa3b48b5aa40d82040778f5de3b8bed2c281fa9a381024dc233a92132afd745853a1abb2f305a4eafe7072dc3df405af93ceec52f1b8ce9bb796b5567993ef29e735c7ddcfd8b5b5e7ac6c261b67a76e0c392505777591a98e85f7829796d35efaed030b348b14349539bcd6bd34d4599c7af95db1fb605672d3318737184f92c0d54580abf4be00138f047d8ad69952f368192ab62906dd7f9ef66d1573f9ffdb129bf40c11816057541aefaf8fbee93e80d27e6b09854aef29b8d853bd8b9d994c955400b90e8d4e2b40dd1885ebad81f6c6bf2c41e16039e6a94b8213a501d100ae0b5351198ababe328a8f17480daa70cc0cb65c0f4791903ddb8508f1d304daf64b91f43bbcb489163fb01a6c43815d18e6befbeb78c30be4699366b64b5687335a1f910eb7bb542df5b3fee6f01807656e7b498a55914453dc08c17d89aed5b68d65959959e1a6381944491c7f709cbdec6192f2431f8f47bf94939c866539e5869b1b2ada24159b217fb30f117064120c8eab40eea54b7cf5b2ecb862bb9cdbe45c2d6f5a83476ae3c04019a7920120fc98ae704017f0b93a7ea84ef2a0b503ddbceef31fb31b5e57e6b3e782a4622dfd3fc9df59e4d8100fbf9901ec5a18768c2368182a4a6db10d2bbdaf5972ba8c7a57d4d45d6bbfaecdc529522e4dbe852b6cedcb82d7e105e8f8c169537e15bbb87c64270856328af88262b89ac2abe038d9d185d0cf8e03b760a4f08ce02c06ea205bce7c837259f06bce42795e5bfd8aa769175cba15fd29bbced2f39748e5ed992760aa6da6379560b2247976fec08614226d5090ece1daff0013fec33dd9bee160d9eee9d357c9efc859af81944996d7f4f12c56910b96dfc4b1ae7530c259027229a0e6cd8da0f352bc296611d7ae3d83aee6007aa72ff0a6de0e49a4f73eaea9b688162845f28875da97b0968caa39cdb9d64c4440799fde517b63e2836840173054952ecb7a70dcb139cf78261056cc9120bc78adb815380038b1c4c1c7502ab0ec065349a3f44ebc838663f1618c9ba1c22920baee2f8ab97fd4526c7a6ba7f6d69a8a2bd5b0142e63e2fd29c7618c2c902d50de3b0c16cc849acc003c6865460ce81280ab4fc1eeb93aaa21ec2093e3337e05b3755bc2bff3157ab5c292dcdac3b514560b14ac60e08b770f008e4e77217a84a153f2fa246f728317f06470ca31abcc060f00b6eee751a99e38f56b3759e395c2ec58a77e7cca5312077a0f23d3e456ae329f8e1ec54e9f59d21537756b1b1f07b776edd8ea5dea34c84ada1331cb0d6f2b84df6785a36615786985082f7f8a6b8ef52f1111245f5cdda223d6e5e3794e5fd7afdafaa104280337e0bb2db832c004e9ea74f10b95c272ea4361d4bc6f5ed79ee361fbafedc629da0ecfb91f14da9b687b0c569982fe8682b383476a445c67d3929b4b80fa2478ea3b49d9fc73aa58c3567f2271679978ccfc0c511bf596bd5e4bd1ff79fc939bcb9f4f21781098411043a20aa0b48b91bcf55bcf0bea1af34acef1c27c2d3e1b6afef2dc0265e40ac812872faed5ef0f948181fceb303eb8a43ba5f25523f06031bc6ad151dddabd7df2296f91d1f6a9840b3d3651c02c93a467249d01b364302b7a2def68ba64114861ec61eebf353823d043ad72ec40068e2b60b19a1582a817e1048f02578a2933f4cdbfd87029b5329b1c05babf3650d1f7895333100a695fcba41ceb092fc0c539c62960b232ddd83fbefe8b757b1f69f853657493ea5ed23009ace2faa47a6bd0f253c8990f934e7c26a4924bd5628b59a969e56ffea4fdb3fba9aeb0213149cbb4f9cb33ee62bde1ab4330f3a7674264e89d97d131ceade5e11c9de12305602c6c148d7e19fa77457396ca9bd0d7d5816dd46a9e14690f4d3c40843d17489b70b89a655566fd01d3fd3d2dfb559599e2f450b137ef5fad512b98bff6f783ee6b348edcd4163b7ff554e3bd093c5c7bf1a4823a82bb2ae641f24963ad54409f65db3ab094d0605397ca2774204af5bcac834ce0c987c1b5d2afb43f07c461dd64a523030f9329cbc48f6cfbe6a28a41bc8c6ead39fab275f6d6c6e07be9313702f314dd12c1fb3f1d6666d5d05623d9633ae892b9545b96a77f48de349ed3105b714c7cafa8990e1a7e7a135624374dd1b9338fbe2dabc583f8faa4f5e3978b10c2b6ff0218c51fe604267e93757fa3a65d2ce9698e6ac50d1bf3bb7721b54a8395084d20d9a85d774389f867e91650e4699cfb0f2850e0512d2b53efbf5df6ef3a816fdb1829ab32ce3ae96b564d36f415a55721d0b9f5b6277d23f47c1a58669083d77a11c9d543332ca73e261f8046639b07f35bf727ce2ccbf86a15f853350b58cde58992bba4ba79b6d52654bb956093c6d876b1cc18566677da4d281273305e20eeab54dfbc8f9d00f7a36d3addb9f622986936f80a2c74798a9dadd3fc0fa489f9211e32bc7e3b33752249a1911b44d873128b22ecbe95451c8b693ad40f7898f7e5b76e5f09b51a1dd9dd9ca838e4f8c19eeca153f99b57387ae8d7fc71939d7f48ae75296cfc4db6ddab08b4d2cb15b7d69acdf13e2a0e9a6839db390ba9744b421c029a9811c9fea18948eaebaeeb75b9476e3be90fdd162419152cdd6b7f4a099c1a807f55882415f936add29210dbd8f6462be8c7f1949011f62529f98dcfb9766c60d40292f01c6fcab1f5a899bfe4ebe8b60515f6afbe4803ee99e37b976a92891251d28a43d56fca6ce736f1eb6ef94d20b84c53c822edc94a3ccc55de033a852f3da27508b1c81de1cca9f19b46a5909b0ba8bf7c38ddef2179d119ea205a00573c435befe16cbfdc0c315922a24cdcfc789c965297c64017ac0a0ab23e8ed5b47f76f42ab3552e470a4080564fc7b77149b997761f1a4b3b9f15ba22fa1a6da3f7366a7f90df62124ae637573b92a50b3c29870edd96250d310e8e8413e958880d73619840ecc1b8a8c5f6ce7133dae4740d2deba69ad89d4a7b637db48df5f36491793042ecd88605863024db842768acb43d12cd61aedcf8ab7a34957918d4688f2728b02431dee06a28ed6d6b149f714b7f89986ad684991f291459bbd97bbeb1ab73da5475dc75b48b6417a25a9c2836cb4f3d30e433382b6cb78d5b8642c37b8e9a8c02bbc0fac47e84f80cbf555f8e886a1f4e4ed9064884d7ffa8833933d30d13a31f1deb875f86f4a25b7456a96eeaceb44f4dc39620ac3fe1f8a4830a6bc30c584adadada3dd4a612c8941f6b97417411cc1ed2aa41c6bc442b8971bf5efb1998d5110861fb650004d0a33a5ca4522bb6ac7cd904909f206ae15f66314be98d7772ee4bf7185455c867719c3b61bbc753ca3e6b5b4052fb2a71c80dce5ee31fff0380ce786c934f94896c2c344561f8da151eefec62c84784dd38b2c19d32e3d27571ddb4c30b673e6aac7ea59e56455c7bd1084fbe0eaacd23e3c72a4d16e7cf3296bdde8037ba085a5d8e5e12e506be8696b97f0a4cdbdc3ba63ab5a3567f558d287e67ed897d084a66fc9e74ea5f8c3f4c66b5b132d123d81a6bd313fa735a3472776f917ae6c9b2e1ede2dea152277338d60c4c27446f1dd55f338cdd22dc30002c2a4c9bf7d8c82a0dca395062a3cbe6d3d1e67aed0bfd877334f134228221b530aee740a9fd96cdbf2dab8ac178d53a690edb592e5264f05faacc83721d35bb878724a90369b6b339884f53d51583ae7110caaf5790964c7adcc50d6310226b1fee785616ed47ae54b9e89233be47b7c53c7c51d7cf99bf2785d742b1927ae1b46b389c00c9be90def2475d5ef01fb30477b864389172686bf27af83c68ee0811fa03c12d3356b44cb8aed2cbc0e562ac0d7b2da58293b568bda2d73a2cc716f6796583b6f1213654153997e4f9e0fd68b47df65d933d14be7876d66d7a80b45ef1e53a172473b6b70e9d5eee0e4e77fa15c63c8dc21d452dcf9346973d6b539eebf88d1163314aeb180b44fc19e37a155537075e905155001935b2a09d041c4afbf9ebb688e70c0d90867af9f18b005ff0f6765b5e1483e5b9af9faefd12208ed285ab46a19f4f147e0a30aa66b683a84db4942953ca4b65cef720819d1c6b67983c16d78da3b6e649b55a26b69fa307a339139fc51c56fc8eccf3297fddd1fbfcdda60d3906225160091380725673dfa0e508e7407b1a1d6668ab63c6e2f171dbf647abe0e9c0edc231b99c0ccf7ef64206a51aa566e00e6c549104a5139e844d1876b85123aa6f4bb42a643279da16190c272ddd11ab854a6f8420ceff18108646bb2a7fc914cfcb93dc496ced49c72afc97dea4d285ecd09f55797178e7d366931117ce55532a1ded360635f64d3ea1553ee7dbad5945391810927f22c378970c0d26fd0d9662e381bed5d066cf99b4e52660a10c86ca116fdd2fa763c2d4be36871c24b577a12b6e405a49776f691b5e72567c38d0ea5b302fe5c190eb3e3e97f7145dc67bfbed9bc4371747e7d015b528b21c7fcdfd189d0801849950aeb23dd9d727ce524138ce382c02f17f4b5b62923150abfdabd254e96a62ae3acbfd136febed24b693c124ae8b38e18e69bf1dc0835dcaa38891a6b78bef84317d817964d92b97e48ed4dc4a79b1939bc020bde8b58eed6bd72c380fb1872101d08e340f593daa5ad1aed1dfb13734aa0e8f6c6fe6aae8b3c7cbbb17b2a152424c29e3b7c47a7803c4b1ab0536c3f74e3b1b9c103d64c8f1895b48f71fe881bf1d82e9e6c0f9a7da703a7b774dfd72f0293ca25f338cd7a63354bf912b1668","salt":"cfdf1532770a3b27e0329a8fb1053f9d8a226e836192be779e17d41433bf460d","nonce":"f5d61962ead20df2cd138c89","version":"pgpv1:nft","preKey":"","encryptedPassword":{"ciphertext":"7cae72fd38d784c7e200a7e503042876cd9fae923c0614a1d1f66a3008","salt":"7af2cf5b44bbeb31f19559fccbab9890fae5ecc67e0e3a1e0654cb2caadb51e3","nonce":"194fca4778be7d05348d9c04","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"78217c6716dc1f346f7335d5bc7e3c39cd71cfc866fec1ac0daae98af0787909"}}',
  encryptionType: 'pgpv1:nft',
  encryptedPassword: null,
  nftOwner: 'eip155:0x736cd8461132a1b52d95d535230ca4cd4c8bd7e5',
  numMsg: 0,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsYnEMBRF0bsfgWKVNLCgzAqmBRegUlSAWnBgZ45cw1aiWNFu+tjAMMzAP+fr+2f7RYzZuJNi5c6YjTspVpThzHBmOAtjNtR67qieC+9Yzx3Vc0EZzgxnhrOwnjuq54JKsfKKFCuq54Jazx1lODOcGc7CtlyoREWN2XhHihW1LRfKcGY4M5wF/hmz8UljNlSKFWU4M5wZzsKYjVekWLkzZuPOmA1lODOcGc5CihX1PB6ongvvWM8dtS0XynBmODOchefxQPVc+KSeC2o9dpThzHBmOPsD9rc47ZwLW74AAAAASUVORK5CYII=',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRklv0BCACT75kx7wWnXEqbCi9wqV0wVTcw+qMmEcL0gVoov9xu1ZqO\n' +
    '5v/MP4i9O4HyvqiPprI3tZP+7tdGs6l49oOhZfNDJ+fzgwVNbB2h3B7bMv0D\n' +
    'VDEwaqU1vwLZD7REFoCFyG3XQZ1sm+kzeWBU32i1B3gfwDb/k851bZtIl2Xg\n' +
    'E31SmAehMq8ndoxNz4T6emRf3l6f76Cd3tFHzaScYXxEkebATxmfNkt/PAEa\n' +
    'K8ArbkYGwzzIbR6QfIP2DIzeIkL1Cv+dkTNFoU3mmbllL+73VezXy60GhtjJ\n' +
    'dsNONtTxZ80gIYznRsyfXLMAGhmIU6+jU9jC5dI0TUjMSCFEetBeIGi/ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZGSW/QQLCQcICZAPoYjqh/J4mgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBFA32mzi6MqpsczcbA+hiOqH8niaAAD22QgAgpRqs1lCIedY\n' +
    'trMpey7xBbBbMbV3c+XOX0PK720Z2DY3B+rf8WDbOnZwiKhYFO0SEYL8Tjd3\n' +
    '/VmkwgOXeY9fwgAdb1yUAUv95P9C9SOqC6SnMEwumQhbwuf5QpQL2YKV9uCE\n' +
    '/nzVhqZtofoOVZg/d0+oGzh41VIPzg4XRHYVl1m+5WblgT+r80iV3KxPEJ5o\n' +
    '0zTZVDH6O8E4JUxJogzacCg/d8iswOhrph/GwhI5W/vwfoZpVGPxoH5tWSrV\n' +
    'VbHlXC4UczUPbuUdmSUclgxW1slKPm/ZvoG7g1dkiTKT1pePefp/OeyUqOOi\n' +
    'dGaJvwptzSUh5HipNhZJSJLNal5b8s7ATQRkZJb9AQgAv9+bMh0+JFWEg2CB\n' +
    'z7WV6AV37m9Thx5zKmwKrnrJvJ1ksEPkSu+a2TZzulWXIHFQ0R7ZA/I1P/TF\n' +
    'aZU3LeRbo8XE8sUxiDN+QKeUUIVQed69jVEiw6A0qlZ6CCLprYnrMTEcBj1z\n' +
    'n9ORrQEankOSnrBNnvV0FoWapPMpYB05vrzQHzFwSDRnunC8lW3ctnxsOqLV\n' +
    'kX38L4yg7RSFgpvLh9wIEu3jZEbq1NCAa6WWuJ6SiyX8YC5xq/TQUdSG5k2d\n' +
    'mbvhKiKIoqL5RlkRxRNro4zTzC0S7dxDngTnXu2US208k97B9rq+jYZeEajG\n' +
    'DN0OxjjUECwU3w3m1Zd06dLmIQARAQABwsB2BBgBCAAqBYJkZJb9CZAPoYjq\n' +
    'h/J4mgKbDBYhBFA32mzi6MqpsczcbA+hiOqH8niaAADfGgf/SL6CCFj9b6sO\n' +
    'bw08wCT3gddIG174HIMGJ1VUuajaTU4ex5ibuhpumJmRQdx5fykM1k23C676\n' +
    'mXKbXqnmT6Gk2Lu54gl44m+phBbwjyedb9nqTeeuS+2r/cubm+BLH9MQphbF\n' +
    'N8uMxsCJ2tPO9pTsBNFoOSkqVHYcwxtQp5/wkczSqWFvgf9Z8966QOpd/j/i\n' +
    'aopY/oO/fca36wDn1Gh50YZJ0IFLiHtyqNtY+3nfukycmwc9+LXXB33cagmk\n' +
    'ciku7y7o1+i8eLOi4Nu+trK23hx7/W2l3EHPrW4pyrywr1zhTNehLaacb7AB\n' +
    '/3vvjFt8AVCXLJRB5vcwnf4O+CnfLA==\n' +
    '=Ji6t\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  sigType: '0x2422c8b422b5437cd3718823b4bd952c418108f77e0f5d67994d268445ff076d0ca9b73555e642d4ae656af1bff1a7ac87b856181067175541168b7ae492b0c61c',
  signature: 'eip191v2',
  wallets: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  linkedListHash: null,
  nfts: []
}
```

**Version 1.3.x**

```typescript
export interface IUser {
  msgSent: number;
  maxMsgPersisted: number;
  did: string;
  wallets: string;
  profile: {
    name: string | null;
    desc: string | null;
    picture: string | null;
    profileVerificationProof: string | null;
  };
  encryptedPrivateKey: string;
  publicKey: string;
  verificationProof: string;

  /**
   * @deprecated Use `profile.name` instead.
   */
  name: string | null;
  /**
   * @deprecated Use `profile.desc` instead.
   */
  about: string | null;
  /**
   * @deprecated Use `profile.picture` instead.
   */
  profilePicture: string | null;
  /**
   * @deprecated Use `msgSent` instead.
   */
  numMsg: number;
  /**
   * @deprecated Use `maxMsgPersisted` instead.
   */
  allowedNumMsg: number;
  /**
   * @deprecated Use `encryptedPrivateKey.version` instead.
   */
  encryptionType: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  signature: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  sigType: string;
  /**
   * @deprecated Use `encryptedPrivateKey.encryptedPassword` instead.
   */
  encryptedPassword: string | null;
  /**
   * @deprecated
   */
  nftOwner: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  linkedListHash?: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  nfts?: [] | null;
}
```

| Parameter             | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `msgSent`             | number of messages sent by the user                      |
| `maxMsgPersisted`     | number of messages allowed to be sent by the user        |
| `did`                 | user decentralized identity                              |
| `wallets`             | all wallets associated to the did                        |
| `name`                | user name                                                |
| `desc`                | short user description                                   |
| `picture`             | user chat profile picture. As of now i cannot be changed |
| `encryptedPrivateKey` | encrypted private PGP key                                |
| `publicKey`           | PGP public key                                           |
| `verificationProof`   | verification proof                                       |

</details>

---

### **Decrypting encrypted pgp private key from user data**

```typescript
const response = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: string;
  account?: string;
  signer?: SignerType;
  additionalMeta?: { password?: string };
  env?: ENV;
  toUpgrade?: boolean;
  progressHook?: (progress: ProgressHookType) => void;
})
```

| Parameter                | Type                                   | Description                                              |
| ------------------------ | -------------------------------------- | -------------------------------------------------------- |
| `encryptedPGPPrivateKey` | `string`                               | encrypted pgp private key                                |
| `account`                | `string`                               | user account                                             |
| `signer`                 | `SignerType`                           | ethers.js signer                                         |
| `additionalMeta`         | `{ password?: string }`                | additional meta data                                     |
| `env`                    | `ENV`                                  | environment                                              |
| `toUpgrade`              | `boolean`                              | if true, the user will be upgraded to the latest version |
| `progressHook`           | `(progress: ProgressHookType) => void` | progress hook                                            |

**Example request for normal user:**

```typescript
const user = await PushAPI.user.get({
  account: `eip155:${signer.address}`,
  env: ENV.STAGING,
});

// decrypt the PGP Key
const pgpKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  signer: signer,
});
```

**Example request for NFT user:**

```typescript
// get user and derive encrypted PGP key
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: env as ENV,
});

// decrypt the PGP Key
const pgpKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  signer: nftSigner,
});
```

<details>
  <summary><b>Expected response (Decrypt PGP key of a specific user)</b></summary>

```typescript
// PushAPI_chat_decryptPGPKey | Response - 200 OK
// Dummy PGP Key response below
-----BEGIN PGP PRIVATE KEY BLOCK-----

xcASBGP5FCITBSuBBAAiAwMEjbf6BZTz5QEzR6eiZzTKnh4I0k96UTKlqYuoUIHn
tseu+wX3Iir+3Qx8RUMroIfzW4vPfvRT9Asyiy6lgX7INRva5NmcGF5K/Ajb1FbU
etXLQpI2t7jgCBnwZuPYIuyb/gkDCAc1hVXWhLZqYDdwksEN87qo2VmkTc8anibt
Vr3LzZ9HIE0UzVFw5TJ8edc1PUhuNSvECi6bNC5ikq2U36J9laZIui/w8Ep8Qiap
ThdHWn6irZSct2jM2PTxzXi1/3pyzQ1hc2QgPGFzZGFAYXM+wpwEExMKACQFAmP5
FCICGy8DCwkHAxUKCAIeAQIXgAMWAgECGQEFCQHhM4AACgkQE3CXg+QOmOvYFwF/
SFGt6+1HDB5wgJK0I7U+4KBqrbskKosFIiCu28z/+kH4XNsbfAokUeEHGlR7dbTJ
AX9He9aDN/+HVXDluqbFjtiuOPt0o+rh2q+VqlWoZNSd5KYZf5eooLZ5QCeXTwGv
QqXHpQRj+RQiEwgqhkjOPQMBBwIDBK3/1kmZzkyeFy5uGLnLlHrliqg8S0opzQdL
JO7KJ0i4w7sj8ixIk8MCfTlhdOCn9/GJWpj4zbLmh4LRIi1tBpb+CQMIa3eosFni
UqxguopAXYFt/NoA5UWsyBpt4+FyItaSXuuU1h8iFTRC4yuJ0NIlreuudAlwb36R
cLm19yXJh9npgzxQqKKIAHZZpBRdp0alG8LAJwQYEwoADwUCY/kUIgUJAeEzgAIb
LgBqCRATcJeD5A6Y618gBBkTCgAGBQJj+RQiAAoJEO0UKAv9yVcJ8uUBAOm/XYO2
BaQbFNzhZdJBCm/aaLArNKT/+ub+SkI/Fx3+AP0c0oNutj/+5W8b/Ce+UI8at1L4
CymTBlUIl3R2rnBDTQIgAX40L8DDXoEQyXYAzGjB8HcZe7WX2fjxpGm7aj6H8iMo
kYHdfC/mwoUNY1eV8zfsEnIBfR/yFmf3/QT72X+SBaR4D9dw/D0xjSoAyPhYr93H
F00iYdiGdhT/cniA8ZFpFgkfwMelBGP5FCITCCqGSM49AwEHAgME6yddDDmq0ejZ
jbv/mJ395lGDdQVbkJE2Tv5oT0p3rj/9pEh5KJnh9wgmsSf2+22aY9Z19Rv8Wl/l
m4a9PsaZ0P4JAwjRmhmCO7pFAmC1uwxXLWMyU2+eAHdxO1Ss2qaz/5652ExsUuPI
88ZMOX+xo7utXHRNmNWipLdPaJqNbcWhLzYengHrM7On0y5feOO46AGswsAnBBgT
CgAPBQJj+RQiBQkB4TOAAhsuAGoJEBNwl4PkDpjrXyAEGRMKAAYFAmP5FCIACgkQ
ZbEnxLqhlXrZwwEA494obuihsfgTJGjeWansPkhjCvqPGLLfDwVpyM//fYIA/1oU
yVJsET+iG0vMiNigPywJQR6UiGERCQ+Q3XdrczqSEPsBgPswjBYJtRiFi6adx8Yb
LL+rV4kpBdz22i8fEeHkVQ0VpVFcyCjIso+PnyIDFt52QwGA1Zu1NfUps4ooHhfs
n4FxJNoL/lmuCqhQm4Zgduj3GdYUunMDID3k54J1FPGN+iCj
=OX08
-----END PGP PRIVATE KEY BLOCK-----
```

</details>

---

### **Updating User Profile**

```typescript
const response = await PushAPI.user.profile.update({
  pgpPrivateKey: string;
  account: string;
   profile: {
    name?: string;
    desc?: string;
    picture?: string;
  };
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
})
```

| Parameter       | Type                                                | Description               |
| --------------- | --------------------------------------------------- | ------------------------- |
| `pgpPrivateKey` | `string`                                            | decrypted pgp private key |
| `account`       | `string`                                            | user account              |
| `profile`       | `{name?: string; desc?: string; picture?: string;}` | new profile data          |
| `env`           | `ENV`                                               | environment               |
| `progressHook`  | `(progress: ProgressHookType) => void`              | progress hook             |

**Example request for normal user:**

```typescript
const user = await PushAPI.user.get({
  account: `eip155:${signer.address}`,
  env: ENV.STAGING,
});

// decrypt the PGP Key
const pgpKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  signer: signer,
});

// update user profile
const updateUser = await PushAPI.user.profile.update({
  pgpPrivateKey: pgpKey,
  account: `eip155:${signer.address}`,
  profile: {
    name: 'New Name',
  },
  env: ENV.STAGING,
});
```

**Example request for NFT user:**

```typescript
// get user and derive encrypted PGP key
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: env as ENV,
});

// decrypt the PGP Key
const pgpKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  signer: nftSigner,
});
// update user profile
const updateUser = await PushAPI.user.profile.update({
  pgpPrivateKey: pgpKey,
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  profile: {
    name: 'New Name',
  },
  env: ENV.STAGING,
});
```

<details>
  <summary><b>Expected response (Updating User Profile for a specific user)</b></summary>

```typescript
// PushAPI_user_profile_update | Response - 201 OK
{
  verificationProof: 'eip191:0x9d9b38cdd483e401f1fac315bc2c9c2f9e291be0ec3bff6ce4c3b33ca39ae8430768ae58bfa7bbde8576e26e79e68db852129cb222ebd56c79c50b7965b164d21b',
  msgSent: 35,
  maxMsgPersisted: 100,
  profile : {
    name : 'New Name',
    desc: null,
    picture : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsYnEMBRF0bsfgWKVNLCgzAqmBRegUlSAWnBgZ45cw1aiWNFu+tjAMMzAP+fr+2f7RYzZuJNi5c6YjTspVpThzHBmOAtjNtR67qieC+9Yzx3Vc0EZzgxnhrOwnjuq54JKsfKKFCuq54Jazx1lODOcGc7CtlyoREWN2XhHihW1LRfKcGY4M5wF/hmz8UljNlSKFWU4M5wZzsKYjVekWLkzZuPOmA1lODOcGc5CihX1PB6ongvvWM8dtS0XynBmODOchefxQPVc+KSeC2o9dpThzHBmOPsD9rc47ZwLW74AAAAASUVORK5CYII='
    verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n\nwsBzBAEBCAAnBQJkdvaTCRB4Ndl+kqYWaxYhBLCZHoCE/gPBMl4lJHg12X6S\nphZrAAA6AQf/XuQVgCSl8V0WSSPCUbRjlw/c65nVBZ6ETr32FRaYxWSqo8h0\nTfsUA6G1V2j2G5JylkeH3W+3LBcaurefw7aZtutbS3TO9CuYBiW3UbXdXO+W\nbqV2iNfB/ppQzqlkTmET/baMouRNxkxlKBCuYQkSGvKTi7LQ14RP+ZkuG+Fd\n4DhvCFuhHWpOoWM+17/cCpUJ4nl0nOVO6e1Sp5TVvHvaISWmMRbZ5pTeWfgm\nv0dheNXTFunREXymR7Xrv1gElU8y6k9ChtDAyxo4uVMAEJHqghtqiylRcm36\n/zi3GMG3G3WtSaJkDgJH3Eue+n+4wAp9IcZmVMMC1tNBruGXNWhBBg==\n=SBvb\n-----END PGP SIGNATURE-----\n'
  }
  about: null,
  name: 'New Name',
  allowedNumMsg: 1000,
  did: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  encryptedPrivateKey: '{"ciphertext":"833ddc6dfe07e8af7f78991f679ecb5b64d60b1cffc2fed4ecb6287dd04fb27e712c1fd8988b1f15c7b6f30914941f52b316a67b4cc1a8172c7918f00ee333b8a8610cca0320b9593145087a27d4dbd0582043d47538735d087455afacfa3b48b5aa40d82040778f5de3b8bed2c281fa9a381024dc233a92132afd745853a1abb2f305a4eafe7072dc3df405af93ceec52f1b8ce9bb796b5567993ef29e735c7ddcfd8b5b5e7ac6c261b67a76e0c392505777591a98e85f7829796d35efaed030b348b14349539bcd6bd34d4599c7af95db1fb605672d3318737184f92c0d54580abf4be00138f047d8ad69952f368192ab62906dd7f9ef66d1573f9ffdb129bf40c11816057541aefaf8fbee93e80d27e6b09854aef29b8d853bd8b9d994c955400b90e8d4e2b40dd1885ebad81f6c6bf2c41e16039e6a94b8213a501d100ae0b5351198ababe328a8f17480daa70cc0cb65c0f4791903ddb8508f1d304daf64b91f43bbcb489163fb01a6c43815d18e6befbeb78c30be4699366b64b5687335a1f910eb7bb542df5b3fee6f01807656e7b498a55914453dc08c17d89aed5b68d65959959e1a6381944491c7f709cbdec6192f2431f8f47bf94939c866539e5869b1b2ada24159b217fb30f117064120c8eab40eea54b7cf5b2ecb862bb9cdbe45c2d6f5a83476ae3c04019a7920120fc98ae704017f0b93a7ea84ef2a0b503ddbceef31fb31b5e57e6b3e782a4622dfd3fc9df59e4d8100fbf9901ec5a18768c2368182a4a6db10d2bbdaf5972ba8c7a57d4d45d6bbfaecdc529522e4dbe852b6cedcb82d7e105e8f8c169537e15bbb87c64270856328af88262b89ac2abe038d9d185d0cf8e03b760a4f08ce02c06ea205bce7c837259f06bce42795e5bfd8aa769175cba15fd29bbced2f39748e5ed992760aa6da6379560b2247976fec08614226d5090ece1daff0013fec33dd9bee160d9eee9d357c9efc859af81944996d7f4f12c56910b96dfc4b1ae7530c259027229a0e6cd8da0f352bc296611d7ae3d83aee6007aa72ff0a6de0e49a4f73eaea9b688162845f28875da97b0968caa39cdb9d64c4440799fde517b63e2836840173054952ecb7a70dcb139cf78261056cc9120bc78adb815380038b1c4c1c7502ab0ec065349a3f44ebc838663f1618c9ba1c22920baee2f8ab97fd4526c7a6ba7f6d69a8a2bd5b0142e63e2fd29c7618c2c902d50de3b0c16cc849acc003c6865460ce81280ab4fc1eeb93aaa21ec2093e3337e05b3755bc2bff3157ab5c292dcdac3b514560b14ac60e08b770f008e4e77217a84a153f2fa246f728317f06470ca31abcc060f00b6eee751a99e38f56b3759e395c2ec58a77e7cca5312077a0f23d3e456ae329f8e1ec54e9f59d21537756b1b1f07b776edd8ea5dea34c84ada1331cb0d6f2b84df6785a36615786985082f7f8a6b8ef52f1111245f5cdda223d6e5e3794e5fd7afdafaa104280337e0bb2db832c004e9ea74f10b95c272ea4361d4bc6f5ed79ee361fbafedc629da0ecfb91f14da9b687b0c569982fe8682b383476a445c67d3929b4b80fa2478ea3b49d9fc73aa58c3567f2271679978ccfc0c511bf596bd5e4bd1ff79fc939bcb9f4f21781098411043a20aa0b48b91bcf55bcf0bea1af34acef1c27c2d3e1b6afef2dc0265e40ac812872faed5ef0f948181fceb303eb8a43ba5f25523f06031bc6ad151dddabd7df2296f91d1f6a9840b3d3651c02c93a467249d01b364302b7a2def68ba64114861ec61eebf353823d043ad72ec40068e2b60b19a1582a817e1048f02578a2933f4cdbfd87029b5329b1c05babf3650d1f7895333100a695fcba41ceb092fc0c539c62960b232ddd83fbefe8b757b1f69f853657493ea5ed23009ace2faa47a6bd0f253c8990f934e7c26a4924bd5628b59a969e56ffea4fdb3fba9aeb0213149cbb4f9cb33ee62bde1ab4330f3a7674264e89d97d131ceade5e11c9de12305602c6c148d7e19fa77457396ca9bd0d7d5816dd46a9e14690f4d3c40843d17489b70b89a655566fd01d3fd3d2dfb559599e2f450b137ef5fad512b98bff6f783ee6b348edcd4163b7ff554e3bd093c5c7bf1a4823a82bb2ae641f24963ad54409f65db3ab094d0605397ca2774204af5bcac834ce0c987c1b5d2afb43f07c461dd64a523030f9329cbc48f6cfbe6a28a41bc8c6ead39fab275f6d6c6e07be9313702f314dd12c1fb3f1d6666d5d05623d9633ae892b9545b96a77f48de349ed3105b714c7cafa8990e1a7e7a135624374dd1b9338fbe2dabc583f8faa4f5e3978b10c2b6ff0218c51fe604267e93757fa3a65d2ce9698e6ac50d1bf3bb7721b54a8395084d20d9a85d774389f867e91650e4699cfb0f2850e0512d2b53efbf5df6ef3a816fdb1829ab32ce3ae96b564d36f415a55721d0b9f5b6277d23f47c1a58669083d77a11c9d543332ca73e261f8046639b07f35bf727ce2ccbf86a15f853350b58cde58992bba4ba79b6d52654bb956093c6d876b1cc18566677da4d281273305e20eeab54dfbc8f9d00f7a36d3addb9f622986936f80a2c74798a9dadd3fc0fa489f9211e32bc7e3b33752249a1911b44d873128b22ecbe95451c8b693ad40f7898f7e5b76e5f09b51a1dd9dd9ca838e4f8c19eeca153f99b57387ae8d7fc71939d7f48ae75296cfc4db6ddab08b4d2cb15b7d69acdf13e2a0e9a6839db390ba9744b421c029a9811c9fea18948eaebaeeb75b9476e3be90fdd162419152cdd6b7f4a099c1a807f55882415f936add29210dbd8f6462be8c7f1949011f62529f98dcfb9766c60d40292f01c6fcab1f5a899bfe4ebe8b60515f6afbe4803ee99e37b976a92891251d28a43d56fca6ce736f1eb6ef94d20b84c53c822edc94a3ccc55de033a852f3da27508b1c81de1cca9f19b46a5909b0ba8bf7c38ddef2179d119ea205a00573c435befe16cbfdc0c315922a24cdcfc789c965297c64017ac0a0ab23e8ed5b47f76f42ab3552e470a4080564fc7b77149b997761f1a4b3b9f15ba22fa1a6da3f7366a7f90df62124ae637573b92a50b3c29870edd96250d310e8e8413e958880d73619840ecc1b8a8c5f6ce7133dae4740d2deba69ad89d4a7b637db48df5f36491793042ecd88605863024db842768acb43d12cd61aedcf8ab7a34957918d4688f2728b02431dee06a28ed6d6b149f714b7f89986ad684991f291459bbd97bbeb1ab73da5475dc75b48b6417a25a9c2836cb4f3d30e433382b6cb78d5b8642c37b8e9a8c02bbc0fac47e84f80cbf555f8e886a1f4e4ed9064884d7ffa8833933d30d13a31f1deb875f86f4a25b7456a96eeaceb44f4dc39620ac3fe1f8a4830a6bc30c584adadada3dd4a612c8941f6b97417411cc1ed2aa41c6bc442b8971bf5efb1998d5110861fb650004d0a33a5ca4522bb6ac7cd904909f206ae15f66314be98d7772ee4bf7185455c867719c3b61bbc753ca3e6b5b4052fb2a71c80dce5ee31fff0380ce786c934f94896c2c344561f8da151eefec62c84784dd38b2c19d32e3d27571ddb4c30b673e6aac7ea59e56455c7bd1084fbe0eaacd23e3c72a4d16e7cf3296bdde8037ba085a5d8e5e12e506be8696b97f0a4cdbdc3ba63ab5a3567f558d287e67ed897d084a66fc9e74ea5f8c3f4c66b5b132d123d81a6bd313fa735a3472776f917ae6c9b2e1ede2dea152277338d60c4c27446f1dd55f338cdd22dc30002c2a4c9bf7d8c82a0dca395062a3cbe6d3d1e67aed0bfd877334f134228221b530aee740a9fd96cdbf2dab8ac178d53a690edb592e5264f05faacc83721d35bb878724a90369b6b339884f53d51583ae7110caaf5790964c7adcc50d6310226b1fee785616ed47ae54b9e89233be47b7c53c7c51d7cf99bf2785d742b1927ae1b46b389c00c9be90def2475d5ef01fb30477b864389172686bf27af83c68ee0811fa03c12d3356b44cb8aed2cbc0e562ac0d7b2da58293b568bda2d73a2cc716f6796583b6f1213654153997e4f9e0fd68b47df65d933d14be7876d66d7a80b45ef1e53a172473b6b70e9d5eee0e4e77fa15c63c8dc21d452dcf9346973d6b539eebf88d1163314aeb180b44fc19e37a155537075e905155001935b2a09d041c4afbf9ebb688e70c0d90867af9f18b005ff0f6765b5e1483e5b9af9faefd12208ed285ab46a19f4f147e0a30aa66b683a84db4942953ca4b65cef720819d1c6b67983c16d78da3b6e649b55a26b69fa307a339139fc51c56fc8eccf3297fddd1fbfcdda60d3906225160091380725673dfa0e508e7407b1a1d6668ab63c6e2f171dbf647abe0e9c0edc231b99c0ccf7ef64206a51aa566e00e6c549104a5139e844d1876b85123aa6f4bb42a643279da16190c272ddd11ab854a6f8420ceff18108646bb2a7fc914cfcb93dc496ced49c72afc97dea4d285ecd09f55797178e7d366931117ce55532a1ded360635f64d3ea1553ee7dbad5945391810927f22c378970c0d26fd0d9662e381bed5d066cf99b4e52660a10c86ca116fdd2fa763c2d4be36871c24b577a12b6e405a49776f691b5e72567c38d0ea5b302fe5c190eb3e3e97f7145dc67bfbed9bc4371747e7d015b528b21c7fcdfd189d0801849950aeb23dd9d727ce524138ce382c02f17f4b5b62923150abfdabd254e96a62ae3acbfd136febed24b693c124ae8b38e18e69bf1dc0835dcaa38891a6b78bef84317d817964d92b97e48ed4dc4a79b1939bc020bde8b58eed6bd72c380fb1872101d08e340f593daa5ad1aed1dfb13734aa0e8f6c6fe6aae8b3c7cbbb17b2a152424c29e3b7c47a7803c4b1ab0536c3f74e3b1b9c103d64c8f1895b48f71fe881bf1d82e9e6c0f9a7da703a7b774dfd72f0293ca25f338cd7a63354bf912b1668","salt":"cfdf1532770a3b27e0329a8fb1053f9d8a226e836192be779e17d41433bf460d","nonce":"f5d61962ead20df2cd138c89","version":"pgpv1:nft","preKey":"","encryptedPassword":{"ciphertext":"7cae72fd38d784c7e200a7e503042876cd9fae923c0614a1d1f66a3008","salt":"7af2cf5b44bbeb31f19559fccbab9890fae5ecc67e0e3a1e0654cb2caadb51e3","nonce":"194fca4778be7d05348d9c04","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"78217c6716dc1f346f7335d5bc7e3c39cd71cfc866fec1ac0daae98af0787909"}}',
  encryptionType: 'pgpv1:nft',
  encryptedPassword: null,
  nftOwner: 'eip155:0x736cd8461132a1b52d95d535230ca4cd4c8bd7e5',
  numMsg: 0,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsYnEMBRF0bsfgWKVNLCgzAqmBRegUlSAWnBgZ45cw1aiWNFu+tjAMMzAP+fr+2f7RYzZuJNi5c6YjTspVpThzHBmOAtjNtR67qieC+9Yzx3Vc0EZzgxnhrOwnjuq54JKsfKKFCuq54Jazx1lODOcGc7CtlyoREWN2XhHihW1LRfKcGY4M5wF/hmz8UljNlSKFWU4M5wZzsKYjVekWLkzZuPOmA1lODOcGc5CihX1PB6ongvvWM8dtS0XynBmODOchefxQPVc+KSeC2o9dpThzHBmOPsD9rc47ZwLW74AAAAASUVORK5CYII=',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRklv0BCACT75kx7wWnXEqbCi9wqV0wVTcw+qMmEcL0gVoov9xu1ZqO\n' +
    '5v/MP4i9O4HyvqiPprI3tZP+7tdGs6l49oOhZfNDJ+fzgwVNbB2h3B7bMv0D\n' +
    'VDEwaqU1vwLZD7REFoCFyG3XQZ1sm+kzeWBU32i1B3gfwDb/k851bZtIl2Xg\n' +
    'E31SmAehMq8ndoxNz4T6emRf3l6f76Cd3tFHzaScYXxEkebATxmfNkt/PAEa\n' +
    'K8ArbkYGwzzIbR6QfIP2DIzeIkL1Cv+dkTNFoU3mmbllL+73VezXy60GhtjJ\n' +
    'dsNONtTxZ80gIYznRsyfXLMAGhmIU6+jU9jC5dI0TUjMSCFEetBeIGi/ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZGSW/QQLCQcICZAPoYjqh/J4mgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBFA32mzi6MqpsczcbA+hiOqH8niaAAD22QgAgpRqs1lCIedY\n' +
    'trMpey7xBbBbMbV3c+XOX0PK720Z2DY3B+rf8WDbOnZwiKhYFO0SEYL8Tjd3\n' +
    '/VmkwgOXeY9fwgAdb1yUAUv95P9C9SOqC6SnMEwumQhbwuf5QpQL2YKV9uCE\n' +
    '/nzVhqZtofoOVZg/d0+oGzh41VIPzg4XRHYVl1m+5WblgT+r80iV3KxPEJ5o\n' +
    '0zTZVDH6O8E4JUxJogzacCg/d8iswOhrph/GwhI5W/vwfoZpVGPxoH5tWSrV\n' +
    'VbHlXC4UczUPbuUdmSUclgxW1slKPm/ZvoG7g1dkiTKT1pePefp/OeyUqOOi\n' +
    'dGaJvwptzSUh5HipNhZJSJLNal5b8s7ATQRkZJb9AQgAv9+bMh0+JFWEg2CB\n' +
    'z7WV6AV37m9Thx5zKmwKrnrJvJ1ksEPkSu+a2TZzulWXIHFQ0R7ZA/I1P/TF\n' +
    'aZU3LeRbo8XE8sUxiDN+QKeUUIVQed69jVEiw6A0qlZ6CCLprYnrMTEcBj1z\n' +
    'n9ORrQEankOSnrBNnvV0FoWapPMpYB05vrzQHzFwSDRnunC8lW3ctnxsOqLV\n' +
    'kX38L4yg7RSFgpvLh9wIEu3jZEbq1NCAa6WWuJ6SiyX8YC5xq/TQUdSG5k2d\n' +
    'mbvhKiKIoqL5RlkRxRNro4zTzC0S7dxDngTnXu2US208k97B9rq+jYZeEajG\n' +
    'DN0OxjjUECwU3w3m1Zd06dLmIQARAQABwsB2BBgBCAAqBYJkZJb9CZAPoYjq\n' +
    'h/J4mgKbDBYhBFA32mzi6MqpsczcbA+hiOqH8niaAADfGgf/SL6CCFj9b6sO\n' +
    'bw08wCT3gddIG174HIMGJ1VUuajaTU4ex5ibuhpumJmRQdx5fykM1k23C676\n' +
    'mXKbXqnmT6Gk2Lu54gl44m+phBbwjyedb9nqTeeuS+2r/cubm+BLH9MQphbF\n' +
    'N8uMxsCJ2tPO9pTsBNFoOSkqVHYcwxtQp5/wkczSqWFvgf9Z8966QOpd/j/i\n' +
    'aopY/oO/fca36wDn1Gh50YZJ0IFLiHtyqNtY+3nfukycmwc9+LXXB33cagmk\n' +
    'ciku7y7o1+i8eLOi4Nu+trK23hx7/W2l3EHPrW4pyrywr1zhTNehLaacb7AB\n' +
    '/3vvjFt8AVCXLJRB5vcwnf4O+CnfLA==\n' +
    '=Ji6t\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  sigType: '0x2422c8b422b5437cd3718823b4bd952c418108f77e0f5d67994d268445ff076d0ca9b73555e642d4ae656af1bff1a7ac87b856181067175541168b7ae492b0c61c',
  signature: 'eip191v2',
  wallets: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  linkedListHash: null,
  nfts: []
}
```

</details>

---

### **Fetching list of user chats**

```typescript
const chats = await PushAPI.chat.chats({
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
const chats = await PushAPI.chat.chats({
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
const response = await PushAPI.chat.chats({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  toDecrypt: true,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: env as ENV,
});
```

<details>
  <summary><b>Expected response (Get chats of a specific user)</b></summary>

```typescript
// PushAPI_chat_chats | Response - 200 OK
// Array of chats
[
  {
    chatId: 'dafdc288ccd416c22caa8adfc2c62ee23e83b2e351f60df91531e82fa7ca243e',
    about: null,
    did: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    intent:
      'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7+eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    intentSentBy: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
    intentTimestamp: '2023-05-08T12:56:16.000Z',
    publicKey:
      '{"key":"-----BEGIN PGP PUBLIC KEY BLOCK-----\\n\\nxsBNBGRYo/8BCADhbpiwQf8PEXdi1V2BKfoHs8Vo7dM0FvukAlTGlk/778kV\\neriOXsBmFT3PciLWXRbh5CqsxXmshY030Ugb6h9x2FcgglzsLhJxc8cbCbpk\\nlK3wkZSAJbPX42rX6y2yvLZffdziAddliJFnE0gfV5WD/rxugYP/FIHyGt9y\\njKXuDwNAihp5qQeXaPs+vEqaVhExGUlwWhbBj/EepD8LMc4+inZMTBNxN213\\nnZTSWudaV6mnnrKNjkHTtK3tT6TTHAb5f5Xoz+zTNbMQecktRtF4r27ctRgQ\\nBUEnFkREdQR9vAmJuMmDeh0SKFAE44bNm8moSTHtwSyyjfoL2y7rLmkLABEB\\nAAHNAMLAigQQAQgAPgWCZFij/wQLCQcICZC/GLX8yhr5DwMVCAoEFgACAQIZ\\nAQKbAwIeARYhBIXvLPhJE+agImuJ578YtfzKGvkPAAA8eggAx6GWFsiVU0Jd\\nj3FxkYPwitvF2PdkzPKKLczhj82zNAt4njioYijjpItjw8Wq0cyWtTKfwb0v\\nZ5ty1X0MsOZATsF46PBz0nsBp7BxDutFjgKHQxGwlss+WD6yYqujPUdzmhMO\\n5KYh/McDrGhP939UZhSRhvAH78Id+2EG8Q74KHgAhfcrJvpHf/aBrF1+Gn07\\nSGuZ4GpzqVO7NaQlme1BAAFSZI+EZeCoCODZXJ6gdh1HC1/splLYtcT+FL0/\\nj0VQxVoaVpD5B5AgIQJp1QeFOIcLcFecRLY+RiXkfNJHHbkcCBXGTHuPY5CT\\noIohJfb45Y8wSjcZ3Ec+YOf+00UmP87ATQRkWKP/AQgA2MUK+aUDZE3PFaXG\\n/0H02iqUzu18FmSnPW0TmisHezdzI/LcZwqKapJawxHLsPiGK42xWa2ZBwgh\\n8xyMhspY9jv9u3uDaR/vR6y83+KaUlsSyvpUu0HAapWVIlE79p1/lLld5+Ui\\ny4Ap8VPMSd7sU0TZXGw/s8sBol1Lv1O1wJj0gc17IB1dahMppxnZlnoCtqBA\\nNeFZ8Ssx7+ZAhfvglCqvBo154+4UphqZLoGmGCZWIY3B3NU1EGRjQNnVNaSC\\nuRet3Qi85ni++52k6wR3tJLDqOxFKnYrv93nPENABSuYS8Uc04VvE0hfbjNF\\n6qeo5gah5O68F/xtI6MATZRIAQARAQABwsB2BBgBCAAqBYJkWKP/CZC/GLX8\\nyhr5DwKbDBYhBIXvLPhJE+agImuJ578YtfzKGvkPAAC3zgf+LZ2aNe1nY3au\\n9T57MqhfTMYIEWn/PJ0LAJFg3jgPTmzL4K+ZLSTdWEV7p8aMKrTloYSWENW+\\nuuj+MhMnOC1EonhmqYGHrsFTPdZR902a/mNPnxl8A8r7ixq1OAgq81qYVsQ1\\nQaC8uuJaqCxLediM5lVP95xz1qdKgNhKtG7cPlX8ljAL4KE3U2/Jjj/KiqED\\n0XaMqrt1y2qjjNF+ct+NbmqmwRaOKq8mWpFlPygA9dq6Sp1nCcwvYmxBQrbg\\nmTDldPF6tg7SqF83DN7DnUQt1cNQEUUv8SUiGnS/Dd01nhManNBLNtNpgCCf\\n4etbnA/WK08gsOhSeM3bBOSOjavwmA==\\n=qZBP\\n-----END PGP PUBLIC KEY BLOCK-----\\n","signature":"eip191:0xc56d79a25a832134b0438981f534c1c811bb8d1d1ea6f19b639e4dbc1fb64a4c65be377120dc4402d29b371dc378f00289640b037f6ad9e475fab5781ce067b81c"}',
    profilePicture:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyklEQVR4AcXBoa3DMABF0ZunTFBSVNQBAr1IFdA1AoMNvYiVRQy9QSUPklKX+Cv64J0zfdrz5IKwBEZKLVwhzISZMJv5Q4uJX5mRFhO9x74xIsyEmTCbW0z0HvvGyLGu/EeLiZ4wE2bCbLrf3idGwkyYCbO51EIvLIGRUgsjYQmMlFroCTNhJszmFhO/Mr1SC1eUWuiFJdBrMdETZsJMmE332/ukc6wrI6+cGTnWlZFXzvSEmTATZtOnPU8uaDEx8tg3rhBmwkyYfQE/njNZjYo1IgAAAABJRU5ErkJggg==',
    threadhash: 'bafyreidfnsaz7pz3hsedtlgzj7beqnwj44h3bunpaouwmk4r4i5y5psyti',
    wallets: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    combinedDID:
      'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7_eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    name: null,
    msg: {
      fromCAIP10: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toCAIP10: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      fromDID: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toDID: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJkWKQWCZB7dzg7q3axjBYhBJFuYslzDGbuE+3FMnt3ODur\n' +
        'drGMAAAjtAf/TXjtm2qb6aSikFPKYXm0Ekws+65fisJGf7T48MYkkfcD4t2e\n' +
        'HXd9LtohzGhcztbOQfAND3yME1GWuMBIksq9rlyEA0ezwsGzCJVhBnkAHBe3\n' +
        '+1v4/mNSMmInU8y6sOiLiOcW7ameJvZvDdPDJ0YHhc9dKDCIh1UAZEPAgx+z\n' +
        'Wc0DM6pW8bT70dfgnuW2LlLGF5Z23Z1vbHmeszt78+xYY3ez/hoMHXUIE25z\n' +
        'Wrnt75nasBBahtJ0mwH10ATnsQNE9hTi6XPGYxRSNDM9nyRxTQUpjhNmGS/+\n' +
        '7oFyq8xTcRSaL7d3h8URp9hgFWher5ZZDyMV0jvk+HPguUX54g6Kgw==\n' +
        '=dcRD\n' +
        '-----END PGP SIGNATURE-----\n',
      timestamp: 1683530775648,
      sigType: 'pgp',
      encType: 'pgp',
      encryptedSecret:
        '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMA9aU+JGZVRn/AQgA1pIJHyeJinU21r6At5S5ZaWeN0OEKVB2TjpqZ0IW\n' +
        'lHLKQrQ8k3M16bN+Vf0P+DzDVOL84QRkBD56qSNVHOOCox5wcQeR01CczenV\n' +
        'LUVvVjBzR2hj7Sdw+Q+M//rgeZPPUDbNyiVmGijelhwDqWd7IOoZY26AGXlm\n' +
        '7YQiElvHN2HcYXaTlLAOy36BcccwHu3Tn06F77ZXaf8FnGMWOUy7wh1/jugg\n' +
        'D17jUZGLYbmw+u5l9BOfljbw2pb4vtjWht0I1b4GYlKb+bYg/NY0UNsq7mSh\n' +
        'dGAmOhy5tC2NMjLRRLfD2qasxHoHN50onlB6HcYLl0RCf31ebOgO6rMhUnxt\n' +
        '9cHATAMLWLG2xubrYAEH/2tVeq2j7nJALGSFxjJPboOY57aiFrhXNQ/e/oXH\n' +
        '//TNJgGWx4Ta++OuF2Oexbh9DIZhl6DWld9adXDDtBS/fEyjNsYqwoYlNEJN\n' +
        'kLvSmokNNrE4MKC1A0GkhSh2MGQDNk42GSgz1tep8XSVc98MHqfNXCHVb5Oa\n' +
        'OBeWKLFyElT3+KuZxSkCsnoO5YjuCGbXPyG06tXMHXMTncpj1ri+vpjUSnhD\n' +
        'wn3o0zpNWu0GaWXIgTqj2ZouVwV2S1+wAJQjE8uI1JvBiMhA+X63/GCcApBu\n' +
        'C7rN0Cs5NGXCn9VWp8i1SCp2NuZ38POABwsXUUkjpF24txyUDX8dbXlkzpao\n' +
        'g93SQAElYYmyKbGp1TKhAZl2u40mgf2yCYDv2DLRfAKMJDLvmjXoUGEg2UYO\n' +
        '11w6LD0pIykdKJmFtRls/uMnlcoBgDA=\n' +
        '=kzUH\n' +
        '-----END PGP MESSAGE-----\n',
      link: 'bafyreib34jgnpp573rwquejcq5avxvydis7fbykat6dd5z7uazobucoumm',
    },
    groupInformation: undefined,
  },
];
```

| Parameter        | Type           | Description                                                                                                                     |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| msg              | `IMessageIPFS` | message object                                                                                                                  |
| did              | `string`       | user DID                                                                                                                        |
| wallets          | `string`       | user wallets                                                                                                                    |
| profilePicture   | `string`       | user profile picture                                                                                                            |
| publicKey        | `string`       | user public key                                                                                                                 |
| about            | `string`       | user description                                                                                                                |
| threadhash       | `string`       | cid from the latest message sent on this conversation                                                                           |
| intent           | `string`       | addresses concatenated from the users who have approved the intent                                                              |
| intentSentBy     | `string`       | address of the user who sent the intent                                                                                         |
| intentTimestamp  | `number`       | timestamp of the intent                                                                                                         |
| combinedDID      | `string`       | concatenated addresses of the members of this chat (for DM the 2 addresses and from Group the addresses from all group members) |
| cid              | `string`       | content identifier on IPFS                                                                                                      |
| chatId           | `string`       | chat identifier                                                                                                                 |
| groupInformation | `GroupDTO`     | if group chat, all group information                                                                                            |

</details>

---

### **Fetching list of user chat requests**

```typescript
const chats = await PushAPI.chat.requests({
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

**Example:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: ENV.STAGING);

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const chats = await PushAPI.chat.requests({
    account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
    toDecrypt: true,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: ENV.STAGING,
});
```

<details>
  <summary><b>Expected response (Get chat requests of a specific user)</b></summary>

```typescript
// PushAPI_chat_requests | Response - 200 OK
// Array of chat requests
[
  {
    about: null,
    did: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    intent: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    intentSentBy: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    intentTimestamp: '2023-01-07T03:51:11.000Z',
    publicKey:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
      '\n' +
      'xsBNBGOhhq8BCADP5Nzw0jOXhKO86ndGkY/JlD8AadVXmsLA+Yvoc22LrNTU\n' +
      'QrfcDWaMAzpmtMWJlNEHSTieUPEgODm/qj422+rdskSedum3gq1HWn2bmqEI\n' +
      'LrFc+zR3B70Pe7saEEmC/hXG53/8m7V0HsOuvkEjBa3pW3KElZIhimVvcgYR\n' +
      '9AnLjUYKR/lci1eXXsAz+J+RjgPlFfiIE0/3KYXwkjt9meSJDPCIcEIZ1tqw\n' +
      'IkGRINM5XINMvC+FxPNQ+jIHF9WIzmUg4YfYZQbMo96j4LAV0kYvAB0qI2Y8\n' +
      'DHAjHXYQ+fafRGOJwePASjDHUjcB9QEr1EPIMG3i4iFaBV2ZmePjzE7XABEB\n' +
      'AAHNAMLAigQQAQgAPgUCY6GGrwQLCQcICRCUVlBnqYwnwgMVCAoEFgACAQIZ\n' +
      'AQIbAwIeARYhBPYJKSdUrZzVgB9jy5RWUGepjCfCAABLZAgAtVdxz75k3qFY\n' +
      'qtwMdsrIPX4A7rpT/zCd2Yjl2asFdlkyAusfNdFEiff1dHz5+qBM88z/Zh+O\n' +
      '1FNDKS/WKL9qmZ+AceyidCjnRVTUeH6Mi/ZD/YZInJyLozCksb0Gciswl6Rp\n' +
      'RHb6nXt0PebUFXTsOVxSeodaEGBgltd/V1bDHpfx8Wu03z3h/Jq2tI4s28XA\n' +
      'S2lSZpG8+nC1zLOmpbYx8mdOe00ONBdnMvxAqckd437ns7Tu8sKW4SsRzjg1\n' +
      'YHTmApRjai1L6bHn0P5Utz0BcynzrUn+bZ0cC+5Rq3kZvrjnaJOIutY+ALDF\n' +
      '4yWoVIz8KzzAUx1caVyVvwdFtjVTS87ATQRjoYavAQgA3nCB6WLASwBwp5r/\n' +
      'WU8SiUzf/2srENNObpjxavmv2FVKcKfO0ehSi6ti22KSKnUgm5prlOMWsVl/\n' +
      'wEClvpGw0Btdar4OQI7XdwkY8XUVB5Jff7cNpi4qE+4lIYqCTQief9H5GLC/\n' +
      'QvpE53yZWGFK581OSaeomtibN5xAaUyEE8qITnYyjqA+SgffRFVN5/WOnnBK\n' +
      'zbIHrXl2lXOFkegXaOk+Qxxikw9cSpHNV5YHVoDStRCJZKVU8JhKa7pYKkmC\n' +
      'pSIiXT3IdSAqDiglDRxwX4KlFFhGZ1OGbBmPefN3pZ7/xvaM28TqSDNB7f89\n' +
      '/lc5UKLz5Em2aroEclT0YpKYGQARAQABwsB2BBgBCAAqBQJjoYavCRCUVlBn\n' +
      'qYwnwgIbDBYhBPYJKSdUrZzVgB9jy5RWUGepjCfCAAC6rwgAji6/qPQn/BN/\n' +
      'BbwGBN+A8tWRuQLwrgOilg8oHWkyCIUK7DeBp+gpkSghjsnaEAqc94xaGD3U\n' +
      'AfgcPGmC/Jx92W+bX8P40Iq8OvPgLgvG1u5Rf1a1SNYAuypQemuHYu3HOvUU\n' +
      'vP+0omoiTWyNZVqsZA0FGIYQk9uRg8KGsLvXwzPPLqC5Yo3fyfQUmytBZfEf\n' +
      'OwYwuvzx1RBHtvyZ32sfq//q4t2fXY0d49rg6l475zo3JsZsYtqZJCf9h6uK\n' +
      'MrSFgvn8mJFlpwI1+g7X46VB+t8D1Ac35r9Bn9UIWieIyS2Aux2UwBsY2iET\n' +
      'CdgkH8gWFBU7bdKsFh7BQX2ZhrxHXQ==\n' +
      '=Lr7Q\n' +
      '-----END PGP PUBLIC KEY BLOCK-----\n',
    profilePicture:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBobGEMBSG0W//idlKiKARaohMAzEIzFoEhgaQ1EAV6xCkmn32PpMZZue9e87j9Xx/uKGkSMu6X9whnAlnwlkoKdKy7hdWnTJN+4hVUqRFOBPOhLPH6/n+YAznwl86+hFLOBPOhLNQUsRa+5GW4VxoOfqRlpIilnAmnAlnYd0v/tO6X1jCmXAmnIWSIladMtbRj3xjOBesbt6whDPhTDgLdcrc0c0bLQcXLXXKWMKZcCachW7esOqUsUqKWHXKtBQ2rMpv3bxhCWfCmXD2A590MfREqrg1AAAAAElFTkSuQmCC',
    threadhash: 'bafyreigs26i7k3g5u4xmqg44tecmkfvelclp5lletnikfbsrj7dhg5oi4y',
    wallets: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    combinedDID:
      'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029_eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
    name: 'copper-screeching-herring',
    msg: {
      link: 'bafyreibuez6o5hqqf6j45ekqxz7ixdtbxs6mhu3m6iv63etja6p2g43qom',
      toDID: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
      encType: 'pgp',
      fromDID: 'eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
      sigType:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBQJjuJ7WCRCszcBmB607ShYhBEWdLV876c+znjS0l6zNwGYH\n' +
        'rTtKAAAEUQgAiSLgvLRf4UM/VIOImO4I/CHt5vBCqvOjq8068K5Bb2ciRn0o\n' +
        '8IqLV2eYKe8c0LK8Gf/CzZn7S13eux4FUlXcX7TlU9BpgHAVQIP4gDe7Q1XN\n' +
        '1+rXFH+QW4P/Zv0knObHAby/7wYfD1ZfBrLbo5SpZEBDYQNYZ5t29y7aVD5e\n' +
        'QMOoSvj5+y6SLDLJalb5daeSfaZtpNBsTZvUBLndNomT///gzrXRutkgW4T4\n' +
        'bDipFPUvLMNvWM1qXJjDyYbyQnr8J8aq3FKoGs4Qs5Z2wcwx9RF54Izh81vd\n' +
        'Y5jkZdpULqxjB4BH2mFGyB9Cp2e5cIpKriY597JCAc6Y6WfhgbIZoA==\n' +
        '=n2B5\n' +
        '-----END PGP SIGNATURE-----\n',
      toCAIP10: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBQJjuJ7WCRCszcBmB607ShYhBEWdLV876c+znjS0l6zNwGYH\n' +
        'rTtKAAAEUQgAiSLgvLRf4UM/VIOImO4I/CHt5vBCqvOjq8068K5Bb2ciRn0o\n' +
        '8IqLV2eYKe8c0LK8Gf/CzZn7S13eux4FUlXcX7TlU9BpgHAVQIP4gDe7Q1XN\n' +
        '1+rXFH+QW4P/Zv0knObHAby/7wYfD1ZfBrLbo5SpZEBDYQNYZ5t29y7aVD5e\n' +
        'QMOoSvj5+y6SLDLJalb5daeSfaZtpNBsTZvUBLndNomT///gzrXRutkgW4T4\n' +
        'bDipFPUvLMNvWM1qXJjDyYbyQnr8J8aq3FKoGs4Qs5Z2wcwx9RF54Izh81vd\n' +
        'Y5jkZdpULqxjB4BH2mFGyB9Cp2e5cIpKriY597JCAc6Y6WfhgbIZoA==\n' +
        '=n2B5\n' +
        '-----END PGP SIGNATURE-----\n',
      timestamp: 1673043671357,
      fromCAIP10: 'eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
      messageType: 'Text',
      messageContent: 'hey',
      encryptedSecret:
        '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMAzJsNgcerTKoAQgAvzX9pBj4j7ytnwU7DwMsCMl6PUDx6qAQybQxrlby\n' +
        '+xkP1Cf1tOkLj1HP/oFHg3cX5HioM600jAaIYhCr8ib+M3ydvhKnti0mcpbn\n' +
        'VnbWilrzyFUBE7T3eZY54JeFxIQ9mtjl/TmGryXpWD9FHjnSp22NRnbZIcZZ\n' +
        'SHpatgDZYzRhHf9zqusBH2QUDKX1Ty7dIq9JD2AeS55l40IHNMPcP2btxfY1\n' +
        'T7od8WvFYhlWQGtkbm8k42fwdK1mIJ3H/rOSeM8sTliYAECe+IhmpIevg4II\n' +
        'Eel7eG81HjGciWt3Vs3FXkhuEUbQnMRAKfhaqalJNDriaWwzUMMt5a/rWdS1\n' +
        'gMHATAN7roGwZ8OLswEH/2RmDHNAaDi11UT3uLAuQxNzlLeqxFaTPecSFaEW\n' +
        'IFdJ+3ujcy3FHoyndK0S+ucFhP2V0hJRMHyyMiKNKSuUp6Q03NZ7Uqavqku3\n' +
        'kVfAJ3tH6jlUWNetvV8t95OmYInqhC4MNk0nIhdI10bl89KmNRqsfQqKu5Hn\n' +
        '5b9Jy7B+XgjKNdj7iWx0FuFabVIQ3NIDnVBDLy8/mDTeB1HuAv/7KljBr0fC\n' +
        'TtzSZij1Pu5+aIPWaGG2hJvxga9g5Zqfvdm79Wn3gfoOCz3FdXcp/n3732rY\n' +
        '+mrIE0DVUlWa0YbVotcSCzLlUpXlFts85Ok8W/N8ERtBMbbd2+e2tBKAP8Hs\n' +
        'iYHSQAHz9V5LwQaFvujErtV5KZfD5DnB8RlUVJU4JKLDgYiXaP18O0fpsZyO\n' +
        '4fym770psCEPU4sc+flSJ0SxBa8m+yM=\n' +
        '=Cp3M\n' +
        '-----END PGP MESSAGE-----\n',
    },
    groupInformation: undefined,
  },
];
```

| Parameter        | Type           | Description                                                                                                                     |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| msg              | `IMessageIPFS` | message object                                                                                                                  |
| did              | `string`       | user DID                                                                                                                        |
| wallets          | `string`       | user wallets                                                                                                                    |
| profilePicture   | `string`       | user profile picture                                                                                                            |
| publicKey        | `string`       | user public key                                                                                                                 |
| about            | `string`       | user description                                                                                                                |
| threadhash       | `string`       | cid from the latest message sent on this conversation                                                                           |
| intent           | `string`       | addresses concatenated from the users who have approved the intent                                                              |
| intentSentBy     | `string`       | address of the user who sent the intent                                                                                         |
| intentTimestamp  | `number`       | timestamp of the intent                                                                                                         |
| combinedDID      | `string`       | concatenated addresses of the members of this chat (for DM the 2 addresses and from Group the addresses from all group members) |
| cid              | `string`       | content identifier on IPFS                                                                                                      |
| chatId           | `string`       | chat identifier                                                                                                                 |
| groupInformation | `GroupDTO`     | if group chat, all group information                                                                                            |

</details>

---

### **Fetching conversation hash between two users**

```typescript
const conversationHash = await PushAPI.chat.conversationHash({
  conversationId: string;
  /**
   * Environment variable
  */
  account: string;
  env?: ENV;
});
```

| Param          | Type   | Default | Remarks                                                |
| -------------- | ------ | ------- | ------------------------------------------------------ |
| account        | string | -       | user address                                           |
| conversationId | string | -       | receiver's address (partial CAIP) or chatId of a group |
| env            | string | 'prod'  | API env - 'prod', 'staging', 'dev'                     |

**Example:**

```typescript
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: ENV.STAGING,
});
```

<details>
  <summary><b>Expected response (Get conversation hash between two users)</b></summary>

```typescript
// PushAPI_chat_conversationHash | Response - 200 OK
{
  threadHash: 'bafyreign2egu7so7lf3gdicehyqjvghzmwn5gokh4fmp4oy3vjwrjk2rjy';
}
```

| Param      | Type   | Default | Remarks                    |
| ---------- | ------ | ------- | -------------------------- |
| threadHash | string | -       | message content identifier |

</details>

---

### **Fetching latest chat between two users**

```typescript
const chatHistory = await PushAPI.chat.latest({
  threadhash: string;
  toDecrypt?: boolean;
  pgpPrivateKey?: string;
  account: string;
  env?: ENV;
});
```

| Param         | Type    | Remarks                                   |
| ------------- | ------- | ----------------------------------------- |
| threadHash    | string  | message content identifier                |
| toDecrypt     | boolean | true if you want messages to be decrypted |
| pgpPrivateKey | string  | PGP Private Key                           |
| account       | string  | user account                              |
| env           | ENV     | environment variable                      |

**Example:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: 'staging'
});

// actual api
const chatHistory = await PushAPI.chat.latest({
  threadhash: conversationHash.threadHash,
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  toDecrypt: true,
  pgpPrivateKey: decryptedPvtKey,
  env: 'staging',
});
```

<details>
  <summary><b>Expected response (Get latest chat between two users)</b></summary>

```typescript
// PushAPI_chat_latest | Response - 200 OK
[
  {
    link: 'bafyreibfikschwlfi275hr7lrfqgj73mf6absailazh4sm5fwihspy2ky4',
    toDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    encType: 'pgp',
    fromDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    sigType: 'pgp',
    toCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    signature:
      '-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBQJjh5tjCRBaJmgmByp5FRYhBJC23yBJT2d/pTAID1omaCYH\n' +
      'KnkVAAAZmwf/buPLw6caSZmYnw6D3/p6HF1kWlkGUOTP4RasaU/6dkeDaZs9\n' +
      'SJlz2wC8oOpBGWHMJ/5n3ZWmU71E6U7IKIY793MyIv5t32vTNkwsRHUX7IIn\n' +
      'QFF+FzTIEtHHVTRlnkqNR2YUk1kqcpZCZWHfahi5W2d/WkXlFNdvyyFH4W8L\n' +
      'd03FGhOyXbWwU3xicBz5mSBpIFaaSCXl1SdgJDPXLSk3b65EEOjCOaiz85xC\n' +
      'G+6SW4RUzCGSDcOd9F2EXvvY5H9LgQNi1jjlZn6JrPTPJTJ+wXZXzcZmtOXG\n' +
      'EKcwvPbbPY9wd+gavRSOgYLYn5xoZQW/o3hW7AQlbC5Kj6js48Z0HQ==\n' +
      '=qLiJ\n' +
      '-----END PGP SIGNATURE-----\n',
    timestamp: 1669831523684,
    fromCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    messageType: 'Text',
    messageContent: 'Hi',
    encryptedSecret:
      '-----BEGIN PGP MESSAGE-----\n' +
      '\n' +
      'wcBMA1fn1CNqxQ7nAQgArlo75qe54WerfRKFv1+F9j4NRMvSTgUztvIe51eg\n' +
      'd5MVuj6RYxKERr2bTuBt5cMDJMlNuTnBBkPe4L8+SlsI46L9wmXV9xLoZq1a\n' +
      '94JdxD98RGMF99Jde/3hC/X6GS1yVqPpKPKdWx/tkOPeyqeO/wFF7kqShgIi\n' +
      'Wgq6hGz1fzD3GZhKGY0VSLuC3s0aUy/qw5En1Xd0uX0jdXBl07IIj8p1G2zx\n' +
      '9BuVlksSK34yvIc0RQfCeRadMHkxbA0Hyj31Wrr+Y310YLTppL0s5bQR9APL\n' +
      'WHsIztJ1fHTnXsPhnA7YG0SQpHTyJhuX3rgBjxGrvbZBArmZ+R/Pq9IkOkJe\n' +
      'z8HATAMOsbaZjGN5JwEH/jYjLN6AFRWeaB5CSBSAF+CvHsUgadGmxTdSHBM6\n' +
      'LM9rfGg/MCnpRBuHckA0NNZh+wepq6TDA54ZopsdP14gHj4MKCdfqZr86Jft\n' +
      'ldtjeSgPTFEEJxPMJ4/Z3UeFU9rvOgfxX6l0eHWS0MYwJ3sVYvSyqqHir1K5\n' +
      'TRdEIgtQ3NvLTKkX4bKTSU+SInrvDA+wsc2BcBsbgNhRiGb+XYrbqXBshL1a\n' +
      'lIdpnomkAQgOZMO2n347uURYoruH3OtFeNABJ9D/nEU+LdhDOPGZPefvPBc5\n' +
      'BxK4ExKZ2Wo/TZw8lgC53uqOljsGV63Hp71LkyesKWu5/+vdVrYx/vU63shh\n' +
      'x/TSQAEiaFYEfkWSOthtH0nrJHhkY7FWgjp/1bj/J4J9HCQrVtt2WlQfhowZ\n' +
      'ILxhKk/vep0sJviM3SfJ4hPtoYpZESc=\n' +
      '=43Ta\n' +
      '-----END PGP MESSAGE-----\n',
  },
];
```

| Param             | Type   | Remarks                                     |
| ----------------- | ------ | ------------------------------------------- |
| `fromCAIP10`      | string | sender address                              |
| `toCAIP10`        | string | receiver address                            |
| `fromDID`         | string | sender did                                  |
| `toDID`           | string | receiver did                                |
| `messageType`     | string | message type                                |
| `messageContent`  | string | message content                             |
| `signature`       | string | signature of the message                    |
| `sigType`         | string | signature type                              |
| `link`            | string | content identifier of the previous messages |
| `timestamp`       | number | timestamp of the message                    |
| `encType`         | string | encryption type                             |
| `encryptedSecret` | string | encrypted secret                            |

</details>

---

### **Fetching chat history between two users**

```typescript
const chatHistory = await PushAPI.chat.history({
  account: string;
  env: ENV;
  threadhash: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  limit?: number;
});
```

| Param         | Type    | Default | Remarks                                                                |
| ------------- | ------- | ------- | ---------------------------------------------------------------------- |
| account       | string  | -       | user address                                                           |
| threadhash    | string  | -       | conversation hash between two users                                    |
| toDecrypt     | boolean | false   | if "true" the method will return decrypted message content in response |
| limit         | number  | 10      | number of messages between two users                                   |
| pgpPrivateKey | string  | null    | mandatory for users having pgp keys                                    |
| env           | ENV     | 'prod'  | API env - 'prod', 'staging', 'dev'                                     |

**Example:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// get threadhash, this will fetch the latest conversation hash
// you can also use older conversation hash (called link) by iterating over to fetch more historical messages
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: 'staging'
});

// actual api
const chatHistory = await PushAPI.chat.history({
  threadhash: conversationHash.threadHash,
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  limit: 2,
  toDecrypt: true,
  pgpPrivateKey: pgpDecryptedPvtKey,
  env: 'staging',
});
```

<details>
  <summary><b>Expected response (Get chat history between two users)</b></summary>

```typescript
// PushAPI_chat_history | Response - 200 OK
[
  {
    link: 'bafyreibfikschwlfi275hr7lrfqgj73mf6absailazh4sm5fwihspy2ky4',
    toDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    encType: 'pgp',
    fromDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    sigType: 'pgp',
    toCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    signature:
      '-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBQJjh5tjCRBaJmgmByp5FRYhBJC23yBJT2d/pTAID1omaCYH\n' +
      'KnkVAAAZmwf/buPLw6caSZmYnw6D3/p6HF1kWlkGUOTP4RasaU/6dkeDaZs9\n' +
      'SJlz2wC8oOpBGWHMJ/5n3ZWmU71E6U7IKIY793MyIv5t32vTNkwsRHUX7IIn\n' +
      'QFF+FzTIEtHHVTRlnkqNR2YUk1kqcpZCZWHfahi5W2d/WkXlFNdvyyFH4W8L\n' +
      'd03FGhOyXbWwU3xicBz5mSBpIFaaSCXl1SdgJDPXLSk3b65EEOjCOaiz85xC\n' +
      'G+6SW4RUzCGSDcOd9F2EXvvY5H9LgQNi1jjlZn6JrPTPJTJ+wXZXzcZmtOXG\n' +
      'EKcwvPbbPY9wd+gavRSOgYLYn5xoZQW/o3hW7AQlbC5Kj6js48Z0HQ==\n' +
      '=qLiJ\n' +
      '-----END PGP SIGNATURE-----\n',
    timestamp: 1669831523684,
    fromCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    messageType: 'Text',
    messageContent: 'Hi',
    encryptedSecret:
      '-----BEGIN PGP MESSAGE-----\n' +
      '\n' +
      'wcBMA1fn1CNqxQ7nAQgArlo75qe54WerfRKFv1+F9j4NRMvSTgUztvIe51eg\n' +
      'd5MVuj6RYxKERr2bTuBt5cMDJMlNuTnBBkPe4L8+SlsI46L9wmXV9xLoZq1a\n' +
      '94JdxD98RGMF99Jde/3hC/X6GS1yVqPpKPKdWx/tkOPeyqeO/wFF7kqShgIi\n' +
      'Wgq6hGz1fzD3GZhKGY0VSLuC3s0aUy/qw5En1Xd0uX0jdXBl07IIj8p1G2zx\n' +
      '9BuVlksSK34yvIc0RQfCeRadMHkxbA0Hyj31Wrr+Y310YLTppL0s5bQR9APL\n' +
      'WHsIztJ1fHTnXsPhnA7YG0SQpHTyJhuX3rgBjxGrvbZBArmZ+R/Pq9IkOkJe\n' +
      'z8HATAMOsbaZjGN5JwEH/jYjLN6AFRWeaB5CSBSAF+CvHsUgadGmxTdSHBM6\n' +
      'LM9rfGg/MCnpRBuHckA0NNZh+wepq6TDA54ZopsdP14gHj4MKCdfqZr86Jft\n' +
      'ldtjeSgPTFEEJxPMJ4/Z3UeFU9rvOgfxX6l0eHWS0MYwJ3sVYvSyqqHir1K5\n' +
      'TRdEIgtQ3NvLTKkX4bKTSU+SInrvDA+wsc2BcBsbgNhRiGb+XYrbqXBshL1a\n' +
      'lIdpnomkAQgOZMO2n347uURYoruH3OtFeNABJ9D/nEU+LdhDOPGZPefvPBc5\n' +
      'BxK4ExKZ2Wo/TZw8lgC53uqOljsGV63Hp71LkyesKWu5/+vdVrYx/vU63shh\n' +
      'x/TSQAEiaFYEfkWSOthtH0nrJHhkY7FWgjp/1bj/J4J9HCQrVtt2WlQfhowZ\n' +
      'ILxhKk/vep0sJviM3SfJ4hPtoYpZESc=\n' +
      '=43Ta\n' +
      '-----END PGP MESSAGE-----\n',
  },
  {
    link: null,
    toDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    encType: 'PlainText',
    fromDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    sigType: '',
    toCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    signature: '',
    timestamp: 1669831499724,
    fromCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    messageType: 'Text',
    messageContent: 'Hey Fabio!',
    encryptedSecret: '',
  },
];
```

| Param             | Type   | Remarks                                     |
| ----------------- | ------ | ------------------------------------------- |
| `fromCAIP10`      | string | sender address                              |
| `toCAIP10`        | string | receiver address                            |
| `fromDID`         | string | sender did                                  |
| `toDID`           | string | receiver did                                |
| `messageType`     | string | message type                                |
| `messageContent`  | string | message content                             |
| `signature`       | string | signature of the message                    |
| `sigType`         | string | signature type                              |
| `link`            | string | content identifier of the previous messages |
| `timestamp`       | number | timestamp of the message                    |
| `encType`         | string | encryption type                             |
| `encryptedSecret` | string | encrypted secret                            |

</details>

---

### **To send a message**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
// sending Text message
const response = await PushAPI.chat.send({
  messageObj: {
    content: "Gm gm! It's me... Mario"
  },
  messageType: 'Text', // can be "Text" | "Image" | "File" | "MediaEmbed" | "Meta"
  receiverAddress: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
  signer: _signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: 'staging',
});

// sending File message
const response = await PushAPI.chat.send({
  messageObj: {
    content: "{\"content\":\"data:application/pdf;base64,JVBERi0xLjQKJ}"
  },
  messageType: 'File', // can be "Text" | "Image" | "File" | "MediaEmbed" | "Meta"
  receiverAddress: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
  signer: _signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: 'staging',
});

// sending Meta Message
// Note - Meta messages are only allowed in Groups and only from admins
const response = await PushAPI.chat.send({
  messageObj: {
    content: "Alice.eth create the grp 'xyz'",
    meta: {
      action: META_ACTION.CREATE_GROUP
      info: { // any added info that is not visible but can be programmatically understoodaffected: [] // address[] that are affected by meta action
			}
    }
  }
  messageType: 'Meta', // can be "Text" | "Image" | "File" | "MediaEmbed" | "Meta"
  receiverAddress: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
  signer: _signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: 'staging',
});

```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| messageObj | `{ content : string; meta?: META_MESSAGE_META; }` | - | message to be sent |
| messageContent | string | '' | ( DEPRECATED ) message to be sent |
| messageType | 'Text' &#124; 'Image' &#124; 'File' &#124; 'MediaEmbed' &#124; 'Meta' | 'Text'| type of messageContent |
| receiverAddress_ | string | - | user address or group chat id (Partial CAIP) |
| signer\* | - | - | signer object |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (send chat message or chat request to a wallet)</b></summary>

```typescript
// PushAPI_chat_send | Response - 200 OK
{
  fromCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  toCAIP10: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  fromDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  toDID: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  messageObj: {
    content: "Gm gm! It's me... Mario",
  },
  messageContent: "Gm gm! It's me... Mario",
  messageType: 'Text',
  signature: '',
  timestamp: 1677290956187,
  sigType: 'pgp',
  encType: 'PlainText',
  encryptedSecret: '',
  link: 'bafyreigcgszt6nvrkh2qitl3ppstlnl5jf246gj6udhiomkhjnfijsmb7m',
  cid: 'bafyreih6ji4iwntsv6d6bqxggkdzubtvmhcy5hz2f6hda2ac2yf35hh63q'
}

```

</details>

---

### **To approve a chat request**

```typescript
const response = await PushAPI.chat.approve({
  status: 'Approved',
  account: '0x18C0Ab0809589c423Ac9eb42897258757b6b3d3d',
  senderAddress: '0x873a538254f8162377296326BB3eDDbA7d00F8E9', // receiver's address or chatId of a group
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| status | 'Approved' | 'Approved' | flag for approving and rejecting chat request, supports only approving for now|
| senderAddress_ | string | - | chat request sender's address or chatId of a group |
| signer\* | - | - | signer object |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (approve chat request for a wallet / group chat id)</b></summary>

```typescript
// PushAPI_chat_approve | Response - 204 OK
```

</details>

---

### **To create a group**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.createGroup({
  groupName:'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  members: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  groupImage: &lt;group image link&gt; ,
  admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  isPublic: true,
  account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
  env: 'staging',
  pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

### **To create a token gated group**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.createGroup({
  groupName:'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  members: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  groupImage: &lt;group image link&gt; ,
  admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  rules: {
    'groupAccess': {
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
              'type': 'PUSH',
              'category': 'ERC721',
              'subcategory': 'nft_owner',
              'data': {
                'address': 'eip155:5:0x42af3147f17239341477113484752D5D3dda997B',
                'amount': 1
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
    },
    'chatAccess': {
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
  isPublic: true,
  account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
  env: 'staging',
  pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| account_ | string | - | user address |
| groupName* | string | - | group name |
| groupDescription* | string | - | group description |
| groupImage* | string | - | group image link |
| members* | Array<string> | - | wallet addresses of all members except admins and groupCreator |
| admins* | Array<string> | - | wallet addresses of all admins except members and groupCreator |
| isPublic* | boolean | - | true for public group, false for private group |
| contractAddressERC20 (deprecated) | string | null | ERC20 Contract Address |
| numberOfERC20 (deprecated) | int | 0 | Minimum number of tokens required to join the group |
| contractAddressNFT (deprecated) | string | null | NFT Contract Address |
| numberOfNFTTokens (deprecated) | int | 0 | Minimum number of nfts required to join the group |
| rules | Rules | - | conditions for group and chat access (see format below) |
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
  groupAccess?: {
    conditions: Array<Condition | ConditionBase>;
  };
  chatAccess?: {
    conditions: Array<Condition | ConditionBase>;
  };
}
```

## Rules Object Description

The rules object consists of two main sections: `groupAccess` and `chatAccess`, both of which contain conditions to manage access and permissions within a chat application. These conditions may involve different criteria related to token holdings or guild membership.

### Conditions

Conditions can be either an "any" or "all" logic structure. If a condition has an "any" property, it means that only one of the nested conditions needs to be met. If a condition has an "all" property, it means that all the nested conditions must be satisfied.

### Types

There are two main types of conditions: `PUSH` and `GUILD`.

#### PUSH Conditions

PUSH conditions may relate to:

- **ERC721**: Needs an address and an amount, and can only have the `owner` subcategory.
- **ERC20**: Needs an address, an amount, and a decimals value. It can only have the `holder` subcategory.
- **CustomEndpoint**: The `CustomEndpoint` provides a flexible way to validate a condition based on the response from a custom API endpoint. This is particularly useful when you want to incorporate data or validation logic that is external to your main application. As of now the Get API is supported and should return the 200 OK if the user is allowed to access.
  <pre>
    {
      "type": "PUSH",
      "category": "CustomEndpoint",
      "subcategory": "GET",
      "data": {
        "url": "https://api.example.com/user/{{user_address}}/validate"
      }
    }
  </pre>

  Explanation:

- **_type_**: Represents the type of the condition, in this case "PUSH".
- **_category_**: Specifies that this is a condition based on a custom endpoint.
- **_subcategory_**: Represents the HTTP method for the request, in this case, a "GET" request.
- **_data_**: Contains the properties for the condition.
- **_url_**: The endpoint URL with a placeholder ({{user_address}}) which will be replaced with the actual user address when the condition is being evaluated.

#### GUILD Conditions

Sample GUILD condition schema

<pre>
{
	"type": "GUILD",
	"category": "guildRoles",
	"subcategory": <Role Type>,
	"data": {
		"guildId": <Guild ID>,
		"guildRoleId": <Specific Role ID>
	}
}
</pre>

- **Working**:

Fields:
type:
Always set to: "GUILD"
category:
Always set to: "guildRoles"
subcategory:
Role type classification.
Values:
specificRole: For a singular role.
allRoles: Pertaining to all roles in the guild.
anyRole: Referring to any role within the guild.
data:
guildId: Unique identifier of a guild.
guildRoleId: Role ID within the guild. (Required only for the specificRole subcategory.)
Usage:
This structure governs user permissions within a guild. The subcategory dictates the manner of role-based operations, from checking permissions of a single role (specificRole) to broad checks across any or all roles (anyRole, allRoles).

<details>
  <summary><b>Expected response (create group)</b></summary>

```typescript
// PushAPI_chat_createGroup | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHmnwBCACaJgURQRJ4uP9St06i8nw9betHTTCvSvvWTkqJQvsnT1oh\n' +
        'm1fV+wv5q7i3uQQqJV1Ip8hSC5YOANnjQM+5CxXi5g8k3se5joMawDCkC/MP\n' +
        'fwidmsVPEZwKmLPf4ZDMJqmzAscfyLgHVnT7sG23LQD8pTVQkgsWRReA8cTJ\n' +
        'pof6YgGF9YxQGvgTyBZGA9ocswXUdtgm5qHhaQL0+FxnniZCN7HIMJ5XKMBQ\n' +
        'GlMik23wL4MqgLZXjn2D/lgDvYglJeDTI0EvnIuoPZTUruKW8xrmqvHojG/5\n' +
        'Oi2XnorseUDUxytICqZRac0Pqh+b7GMTg8ttG8gowA4AyUOMG6KNliGhABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4eafAQLCQcICRCGEDC4tnEnkAMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAB/Vwf/fBz0RTjYzWwA\n' +
        'J/yU9IhUqVJlc9/mP4fKPNgT9UTmlpquu7MWc3VqNCJmXAmeVjw5mlqf7Aic\n' +
        'JTQ/cHKu2LQ4ZTRY+Mvq2DEzuPmqfyhYt8w6F3VY3Vz4w4yKv2sSliHr7PVD\n' +
        'b0OAz9WiavJYIKigwPKA3wRITCLAeda7WGXyYxFPfZ7xt5Tv9t3bl8SCsZB5\n' +
        'V4CwwmPryOJHtffhxApoFs8cCGxY/9B5tX481q1QAyBJ1fp3HAwW8V8iNs7A\n' +
        'AgkHRVyanhLRGQ/pQJd6yvXAfSFkRNjO1be22xZIIzQ3VGjlCUABUVjHm8Xn\n' +
        'CjvPD7t4IwWWV1GIrHhp9dZSqVwIks7ATQRjh5p8AQgAuGT25MVW+nkvXRaS\n' +
        'rCiKPhCYoJEb8NUCoCP+Lmp/LPNn1NJ+6jtOepQ+ipesmGrbtNSCA6/9vFwo\n' +
        't7MRK2yPXrwTAevcvnDxDSAdkkjvbjhEmA0NALLv6NtUbxQOkdfdItcVDOG5\n' +
        'D0VgpkdeF1V5YbMJSzopQCFKxIiJ4nmY+/jyOQedqaHvLwKN7QfXrPpn2sr2\n' +
        's/mKjWwHNuHyKTYlVkA4LsIzvPb5ApDXau93DdmENumD3FcjF4zUFnZjz0ci\n' +
        'ZnQGp+ncnnX05m02qyDaUiEHXLYpMZdaFMQ+6pkSUoDGIS9o46Nlzh75w9c+\n' +
        'Kpz5TGkLrWbmJgey0Z5gV9sl5QARAQABwsB2BBgBCAAqBQJjh5p8CRCGEDC4\n' +
        'tnEnkAIbDBYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAClzAf/ZEuta8nVlB9n\n' +
        'eWLw7uKFU0jbxZBZ+hfF67j5RIwrZHAQDFu3WFrzhDr+wgOWQTt8c7L1C4iv\n' +
        '5GWBpoTLHUCdfEnQyfUWkKTWFwXqMpst5AmR4oSrRWYMUNH5Pw1u5xTOseyS\n' +
        'fpJGEW09bJ+bSots8NOgSjon8q00i90H77pwMYa6xEct4Rf6MleabFWpYymG\n' +
        'XjzHW7ImoybP6DJQ2ciD7O6EBjfrUmGRm76D6rvu6zqypaZLasYlwcFwvGfb\n' +
        'Pkr3HA7hSvRCAZ96gkCXKSmnSq394aZswEgG9ztdkZAGbdbsgA3SSiSqizTA\n' +
        'auQEzIjcvPdpGZaYmkp4Vm6H42ZKaA==\n' +
        '=cVEH\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBIXICMRiG4Xe/WRNRA8eoqOMCHATTSGxsfSwymL1DT7FuBWeJpPanIjMM037PM719f90JDqcLUSuJV+TaidblTCTMhJkwm7fblSjzKNdO1EpiJNfOyHa7EgkzYSbMZn5pJRHl2oly7TyjlcSIMBNmwmzOtRO1kvhLuXYiYSbMhNncSuI/tZKIhJkwE2bTcb+784RWEiO5dp4hzISZMJvX5Ux0OF2IWklEH++fjGzlSpRrJ1qXM5EwE2bCbDrud3cGWkm8ItfOiDATZsLsB4vIMrfRE1WNAAAAAElFTkSuQmCC'
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHm1MBCAC4lZZapY6Xy3uK6HbnfDhPZOPAKr9nWhU0klj/ySH4+2Xb\n' +
        'Ieqni5KH9+ez/5YVNmwAFX4CExbekZSpSd8EkgLX9gl2/R+y3u2sam88Msgv\n' +
        'ODxfROCvIhkAxViyoCMq4Tm71QVzfgvnLOaglGKMxCoJguMBnwNxHo3iG7V5\n' +
        'TeXB6iUorT4qp1kgrwhMNNY+n5ZYMgSvP7g8rNA3KTHYdUGPXQWzb3d/G3cv\n' +
        'L5hErgXbXQpoutkgBapHOIKkEDYn3iB9ORwvOb8phIXG6ISkxTmS+2em9CNB\n' +
        '/ackJJiBfqrLiPfBELyiV+QJARdpi75cOiGhtsNh8DnQ3bjw7YNzcIBJABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4ebUwQLCQcICRBaJmgmByp5FQMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBJC23yBJT2d/pTAID1omaCYHKnkVAACDpAf/XZk5LXsxtAqr\n' +
        '18CSlzLQlAB970oydJuzQ4DGSD+dSMoZsSOlFxZvA06tbXcjM3hfkuFaKzdb\n' +
        'Ida4YOIvnw1cJ8bTLYmxEtiLtIjfTjCGri3yZ5tiPGaEo4/IaUvs1VbeN8VQ\n' +
        '4d2hCUoXLzQPavMllVqM1fJkLlCE3FHJvSRTIMwm5Y8Ok4RY9b84oesQeOkU\n' +
        'P2BneUhE0/iIllKtqMnykEOm46LK0ITzlvSWAFC2cQ74uG0M27LN3kan+tSm\n' +
        'bEsCYLskHQZwzriv8l/JETJP+ZoMJRmp8SFbRVn8tkVCuA8wI73n3X7DbAu0\n' +
        'hfrYZknhotvoai0W61oq81Afatu/A87ATQRjh5tTAQgAk2Q+HkNdLZ0UDWCm\n' +
        'DxrXV7iB7HBybf0i7oaB2aQnhkBqqIlC9jlwll7Y982hsWbdiNJR2jH2hWwo\n' +
        'DPBV8IAlAT2FCb0E1LW0ts9lr5+SLulx/S7UGNpGzNOsvTT8R/CmlfiqJozC\n' +
        'ySHDU6FrLz+s2MTdW0yHt6XDnL8DN3CIUfHOUSjuMNnq34ZsD4Yf6sLmuYN7\n' +
        'UfJpg0j7+24c7+WmWHrO+SSlKc+8rTZT3s1vV+B/vTv0H+1StU001YlxeTnb\n' +
        'sbkbdXii22dNxmvvwLhZ67Zu4Vg1RMyhLi4SajIJPUR/oKeXfcb3WLpkrJNg\n' +
        'iirZ+RirDOHdSM0ak65l6IRNAwARAQABwsB2BBgBCAAqBQJjh5tTCRBaJmgm\n' +
        'Byp5FQIbDBYhBJC23yBJT2d/pTAID1omaCYHKnkVAAB5VQgAt5JaM/LCNRY4\n' +
        'ix8BMS2X/HgW0I2tJDQbvitbbVBRVAjh6wBqUVGC40JoI1bKz49JWiMqrg6u\n' +
        'L6rDD6Ou2UchvqPtczAS+oWBQSRPwh/dOZJ15EFgu0m2ofNKp+i19Ik5X+QV\n' +
        'tbk7hX9+HOIkK8lk1syJl7+G02egK5EVr6oMKWrMuCbkqNMphIQY0airPNi9\n' +
        'keLYrbp7Pt4SlLxLzIP6jejQX9lJj+nA9nHxTfBRMLxq3sUgCsVr3AzkN5VB\n' +
        '5gEeYBAdGVF0pl7DASVXLSrGAm7Q508OyJa1F2VFZT9ZIvEo2ES7YVZx2tkE\n' +
        '0t5jFnfbm8KdXhWBwO1xZc7ctRadGg==\n' +
        '=CgF7\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR4AcXBsWkDQRCG0W9/FEygIsxFakThgbcMs/UsLmOdKVAjCl3GRFqng4OFQ6B5r2z7fRJ0r0TNBtHzUVjRZRJ1r0TNBpFIJpKJZGXb75MDuldWmg2OEMlEMpHsxD/dK1GzQdRscET3StRsEIlkIplIdupeeafulUgkE8lEslOzwUr3yiuaDVZEMpFMJCu363kSNBusdK+sNBusdK9EIplIJpKVbb9PFrpXXtFssCKSiWQiWbldz5Pg6/eHSJdJ1L2y0mwQPR+F6Pvjk0gkE8lEsj8InjfLsCXbSAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      publicKey: '',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2ElEQVR4AcXBsYnEMBRF0TsPJSpgsklVg2sxOLKbUAlqQhMMAtfiGlSCC3A4m342EBiW/ec80uvzxdhbxVqnE+t9PBlZpxPrfTyx5mXDEs6EM+Es7K3yn/ZWsYQz4Uw4C/OyYe2tYl0pY83c1CrWvGxYwplwJpyF2AvWyljshZErZax1OrFiL1jCmXAmnAVuulLmLwlnwplwFvjlShlrbxVrXjZG9lax5pSxYi9YwplwJpwFboq9MHQ8uUM4E86Es0d6fb4YsRdGrpQZib0wcqWMJZwJZ8LZDzUmMp+amfSXAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: "0x8Afa8FDf9fB545C8412499E8532C958086608b30",
  numberOfERC20: 20,
  contractAddressNFT: "0x42af3147f17239341477113484752D5D3dda997B",
  numberOfNFTTokens: 2,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJj+WS9CZCGEDC4tnEnkBYhBOsVjR1d6YVXhTJwoYYQMLi2\n' +
    'cSeQAAAlAwf9EWPoXHOaq6r+nURbhjGfIhr6QszaQDGS5p+hGHOrwqNT569J\n' +
    'tHf7g0GZ2XEmQ7iH8DzCE29urrAh3LrtcUvKtk/mRSUBZ8OBm9EfYLyS6OIV\n' +
    'tuq7pZiX961K7Z4UtnQ1RG/ksypWmfHGf3Ut5tZoWcmZ9KazIeepUKzy3InF\n' +
    'hAi7vZzwUgLHe6UKViflR+umyAsvfgx6zYDvWoAUvKwLZYx4GJnYUjLETTuP\n' +
    'kCmf7wNwAsyANk29IDiFxMvxRXnF9axuRGPfpAfxS2Hz8aDuh6P2IFmU1Ekb\n' +
    'ZjXBpZN8LnidDCW3BtddDPUmE9+PlGLyy/VHm+J5isA1rwuSOuzC1A==\n' +
    '=MFXs\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  isPublic: true,
  groupCreator: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  chatId: '0364908cbaef95a5a3124c394ada868177c158a4d677cedd6fd1e42db1852386',
  rules: {
    'groupAccess': {
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
            },
            {
              "type": "PUSH",
              "category": 'CustomEndpoint',
              "subcategory": "GET"
              "data": {
                "url": "https://api.example.com/users/{{user_address}}/checkAccess",
              }
	          }
          ]
        }
      ]
    },
    'chatAccess': {
      'conditions': [
        {
          'all': [
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
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'anyRole',
              'data': {
                'guildId': '13468'
              }
            }
          ]
        }
      ]
    }
  }
}


```

</details>

---

### **To check user access of a token gated group**

```typescript

// actual api
const response = await PushAPI.chat.getGroupAccess({
  chatId:'8f7be0068a677df166c2e5b8a9030fe8a4341807150339e588853c0049df3106',
  did: '0x9e60c47edF21fa5e5Af33347680B3971F2FfD464'
  env: 'staging',
});
```

Allowed Options (params with \_ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| chatId | string | - | group address |
| did | string | - | user address |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (group access)</b></summary>

```typescript
// PushAPI_chat_getGroupAccess | Response - 200 OK
{
    'groupAccess': true,
    'chatAccess': false,
    'rules': {
        'groupAccess': {
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
                            },
                            'access': false
                        },
                        {
                            'type': 'GUILD',
                            'category': 'guildRoles',
                            'subcategory': 'specificRole',
                            'data': {
                                'guildId': '13468',
                                'guildRoleId': '19924'
                            },
                            'access': true
                        },
                        {
                            'type': 'PUSH',
                            'category': 'ERC721',
                            'subcategory': 'owner',
                            'data': {
                                'contract': 'eip155:5:0x42af3147f17239341477113484752D5D3dda997B',
                                'amount': 1
                            },
                            'access': true
                        }
                    ]
                }
            ]
        },
        'chatAccess': {
            'conditions': [
                {
                    'all': [
                        {
                            'type': 'PUSH',
                            'category': 'ERC20',
                            'subcategory': 'holder',
                            'data': {
                                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                                'amount': 1000,
                                'decimals': 18
                            },
                            'access': false
                        },
                        {
                            'type': 'GUILD',
                            'category': 'guildRoles',
                            'subcategory': 'specificRole',
                            'data': {
                                'guildId': '13468',
                                'guildRoleId': '19924'
                            },
                            'access': true
                        }
                    ]
                }
            ]
        }
    }
}

```

</details>

---

### **To update group details**

Note - updateGroup is an idompotent call

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.updateGroup({
    chatId: '870cbb20f0b116d5e461a154dc723dc1485976e97f61a673259698aa7f48371c',
    groupName: 'Push Group Chat 3',
    groupDescription: 'This is the oficial group for Push Protocol',
    members: ['0x2e60c47edF21fa5e5A333347680B3971F1FfD456','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    groupImage: &lt;group image link&gt; ,
    admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
    env: 'staging',
    pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

### **To update token gated group details**

Note - updateGroup is an idompotent call

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.updateGroup({
    chatId: '870cbb20f0b116d5e461a154dc723dc1485976e97f61a673259698aa7f48371c',
    groupName: 'Push Group Chat 3',
    groupDescription: 'This is the oficial group for Push Protocol',
    members: ['0x2e60c47edF21fa5e5A333347680B3971F1FfD456','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    groupImage: &lt;group image link&gt; ,
    admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    rules: {
    'groupAccess': {
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
                'guidlRoleId': '19924'
              }
            }
          ]
        }
      ]
    },
    'chatAccess': {
      'conditions': [
        {
          'all': [
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
    account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
    env: 'staging',
    pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| chatId_ | string | - | chatId of the group |
| account* | string | - | user address |
| groupName* | string | - | group name |
| groupDescription* | string | - | group description |
| groupImage* | string | - | group image link |
| members* | Array<string> | - | wallet addresses of all members except admins and groupCreator |
| admins* | Array<string> | - | wallet addresses of all admins except members and groupCreator |
| contractAddressERC20 (deprecated) | string | null | ERC20 Contract Address |
| numberOfERC20 (deprecated) | int | 0 | Minimum number of tokens required to join the group |
| contractAddressNFT (deprecated) | string | null | NFT Contract Address |
| numberOfNFTTokens (deprecated) | int | 0 | Minimum number of nfts required to join the group |
| rules | Rules | - | conditions for group and chat access (see format below) |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

### **To get group details by group name**

```typescript
const response = await PushAPI.chat.getGroupByName({
  groupName: 'Push Group Chat 3',
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| groupName_ | string | - | name of the group |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (get group by name)</b></summary>

```typescript
// PushAPI_chat_getGroupByName | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHmnwBCACaJgURQRJ4uP9St06i8nw9betHTTCvSvvWTkqJQvsnT1oh\n' +
        'm1fV+wv5q7i3uQQqJV1Ip8hSC5YOANnjQM+5CxXi5g8k3se5joMawDCkC/MP\n' +
        'fwidmsVPEZwKmLPf4ZDMJqmzAscfyLgHVnT7sG23LQD8pTVQkgsWRReA8cTJ\n' +
        'pof6YgGF9YxQGvgTyBZGA9ocswXUdtgm5qHhaQL0+FxnniZCN7HIMJ5XKMBQ\n' +
        'GlMik23wL4MqgLZXjn2D/lgDvYglJeDTI0EvnIuoPZTUruKW8xrmqvHojG/5\n' +
        'Oi2XnorseUDUxytICqZRac0Pqh+b7GMTg8ttG8gowA4AyUOMG6KNliGhABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4eafAQLCQcICRCGEDC4tnEnkAMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAB/Vwf/fBz0RTjYzWwA\n' +
        'J/yU9IhUqVJlc9/mP4fKPNgT9UTmlpquu7MWc3VqNCJmXAmeVjw5mlqf7Aic\n' +
        'JTQ/cHKu2LQ4ZTRY+Mvq2DEzuPmqfyhYt8w6F3VY3Vz4w4yKv2sSliHr7PVD\n' +
        'b0OAz9WiavJYIKigwPKA3wRITCLAeda7WGXyYxFPfZ7xt5Tv9t3bl8SCsZB5\n' +
        'V4CwwmPryOJHtffhxApoFs8cCGxY/9B5tX481q1QAyBJ1fp3HAwW8V8iNs7A\n' +
        'AgkHRVyanhLRGQ/pQJd6yvXAfSFkRNjO1be22xZIIzQ3VGjlCUABUVjHm8Xn\n' +
        'CjvPD7t4IwWWV1GIrHhp9dZSqVwIks7ATQRjh5p8AQgAuGT25MVW+nkvXRaS\n' +
        'rCiKPhCYoJEb8NUCoCP+Lmp/LPNn1NJ+6jtOepQ+ipesmGrbtNSCA6/9vFwo\n' +
        't7MRK2yPXrwTAevcvnDxDSAdkkjvbjhEmA0NALLv6NtUbxQOkdfdItcVDOG5\n' +
        'D0VgpkdeF1V5YbMJSzopQCFKxIiJ4nmY+/jyOQedqaHvLwKN7QfXrPpn2sr2\n' +
        's/mKjWwHNuHyKTYlVkA4LsIzvPb5ApDXau93DdmENumD3FcjF4zUFnZjz0ci\n' +
        'ZnQGp+ncnnX05m02qyDaUiEHXLYpMZdaFMQ+6pkSUoDGIS9o46Nlzh75w9c+\n' +
        'Kpz5TGkLrWbmJgey0Z5gV9sl5QARAQABwsB2BBgBCAAqBQJjh5p8CRCGEDC4\n' +
        'tnEnkAIbDBYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAClzAf/ZEuta8nVlB9n\n' +
        'eWLw7uKFU0jbxZBZ+hfF67j5RIwrZHAQDFu3WFrzhDr+wgOWQTt8c7L1C4iv\n' +
        '5GWBpoTLHUCdfEnQyfUWkKTWFwXqMpst5AmR4oSrRWYMUNH5Pw1u5xTOseyS\n' +
        'fpJGEW09bJ+bSots8NOgSjon8q00i90H77pwMYa6xEct4Rf6MleabFWpYymG\n' +
        'XjzHW7ImoybP6DJQ2ciD7O6EBjfrUmGRm76D6rvu6zqypaZLasYlwcFwvGfb\n' +
        'Pkr3HA7hSvRCAZ96gkCXKSmnSq394aZswEgG9ztdkZAGbdbsgA3SSiSqizTA\n' +
        'auQEzIjcvPdpGZaYmkp4Vm6H42ZKaA==\n' +
        '=cVEH\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBIXICMRiG4Xe/WRNRA8eoqOMCHATTSGxsfSwymL1DT7FuBWeJpPanIjMM037PM719f90JDqcLUSuJV+TaidblTCTMhJkwm7fblSjzKNdO1EpiJNfOyHa7EgkzYSbMZn5pJRHl2oly7TyjlcSIMBNmwmzOtRO1kvhLuXYiYSbMhNncSuI/tZKIhJkwE2bTcb+784RWEiO5dp4hzISZMJvX5Ux0OF2IWklEH++fjGzlSpRrJ1qXM5EwE2bCbDrud3cGWkm8ItfOiDATZsLsB4vIMrfRE1WNAAAAAElFTkSuQmCC'
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHm1MBCAC4lZZapY6Xy3uK6HbnfDhPZOPAKr9nWhU0klj/ySH4+2Xb\n' +
        'Ieqni5KH9+ez/5YVNmwAFX4CExbekZSpSd8EkgLX9gl2/R+y3u2sam88Msgv\n' +
        'ODxfROCvIhkAxViyoCMq4Tm71QVzfgvnLOaglGKMxCoJguMBnwNxHo3iG7V5\n' +
        'TeXB6iUorT4qp1kgrwhMNNY+n5ZYMgSvP7g8rNA3KTHYdUGPXQWzb3d/G3cv\n' +
        'L5hErgXbXQpoutkgBapHOIKkEDYn3iB9ORwvOb8phIXG6ISkxTmS+2em9CNB\n' +
        '/ackJJiBfqrLiPfBELyiV+QJARdpi75cOiGhtsNh8DnQ3bjw7YNzcIBJABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4ebUwQLCQcICRBaJmgmByp5FQMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBJC23yBJT2d/pTAID1omaCYHKnkVAACDpAf/XZk5LXsxtAqr\n' +
        '18CSlzLQlAB970oydJuzQ4DGSD+dSMoZsSOlFxZvA06tbXcjM3hfkuFaKzdb\n' +
        'Ida4YOIvnw1cJ8bTLYmxEtiLtIjfTjCGri3yZ5tiPGaEo4/IaUvs1VbeN8VQ\n' +
        '4d2hCUoXLzQPavMllVqM1fJkLlCE3FHJvSRTIMwm5Y8Ok4RY9b84oesQeOkU\n' +
        'P2BneUhE0/iIllKtqMnykEOm46LK0ITzlvSWAFC2cQ74uG0M27LN3kan+tSm\n' +
        'bEsCYLskHQZwzriv8l/JETJP+ZoMJRmp8SFbRVn8tkVCuA8wI73n3X7DbAu0\n' +
        'hfrYZknhotvoai0W61oq81Afatu/A87ATQRjh5tTAQgAk2Q+HkNdLZ0UDWCm\n' +
        'DxrXV7iB7HBybf0i7oaB2aQnhkBqqIlC9jlwll7Y982hsWbdiNJR2jH2hWwo\n' +
        'DPBV8IAlAT2FCb0E1LW0ts9lr5+SLulx/S7UGNpGzNOsvTT8R/CmlfiqJozC\n' +
        'ySHDU6FrLz+s2MTdW0yHt6XDnL8DN3CIUfHOUSjuMNnq34ZsD4Yf6sLmuYN7\n' +
        'UfJpg0j7+24c7+WmWHrO+SSlKc+8rTZT3s1vV+B/vTv0H+1StU001YlxeTnb\n' +
        'sbkbdXii22dNxmvvwLhZ67Zu4Vg1RMyhLi4SajIJPUR/oKeXfcb3WLpkrJNg\n' +
        'iirZ+RirDOHdSM0ak65l6IRNAwARAQABwsB2BBgBCAAqBQJjh5tTCRBaJmgm\n' +
        'Byp5FQIbDBYhBJC23yBJT2d/pTAID1omaCYHKnkVAAB5VQgAt5JaM/LCNRY4\n' +
        'ix8BMS2X/HgW0I2tJDQbvitbbVBRVAjh6wBqUVGC40JoI1bKz49JWiMqrg6u\n' +
        'L6rDD6Ou2UchvqPtczAS+oWBQSRPwh/dOZJ15EFgu0m2ofNKp+i19Ik5X+QV\n' +
        'tbk7hX9+HOIkK8lk1syJl7+G02egK5EVr6oMKWrMuCbkqNMphIQY0airPNi9\n' +
        'keLYrbp7Pt4SlLxLzIP6jejQX9lJj+nA9nHxTfBRMLxq3sUgCsVr3AzkN5VB\n' +
        '5gEeYBAdGVF0pl7DASVXLSrGAm7Q508OyJa1F2VFZT9ZIvEo2ES7YVZx2tkE\n' +
        '0t5jFnfbm8KdXhWBwO1xZc7ctRadGg==\n' +
        '=CgF7\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR4AcXBsWkDQRCG0W9/FEygIsxFakThgbcMs/UsLmOdKVAjCl3GRFqng4OFQ6B5r2z7fRJ0r0TNBtHzUVjRZRJ1r0TNBpFIJpKJZGXb75MDuldWmg2OEMlEMpHsxD/dK1GzQdRscET3StRsEIlkIplIdupeeafulUgkE8lEslOzwUr3yiuaDVZEMpFMJCu363kSNBusdK+sNBusdK9EIplIJpKVbb9PFrpXXtFssCKSiWQiWbldz5Pg6/eHSJdJ1L2y0mwQPR+F6Pvjk0gkE8lEsj8InjfLsCXbSAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      publicKey: '',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2ElEQVR4AcXBsYnEMBRF0TsPJSpgsklVg2sxOLKbUAlqQhMMAtfiGlSCC3A4m342EBiW/ec80uvzxdhbxVqnE+t9PBlZpxPrfTyx5mXDEs6EM+Es7K3yn/ZWsYQz4Uw4C/OyYe2tYl0pY83c1CrWvGxYwplwJpyF2AvWyljshZErZax1OrFiL1jCmXAmnAVuulLmLwlnwplwFvjlShlrbxVrXjZG9lax5pSxYi9YwplwJpwFboq9MHQ8uUM4E86Es0d6fb4YsRdGrpQZib0wcqWMJZwJZ8LZDzUmMp+amfSXAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: "0x8Afa8FDf9fB545C8412499E8532C958086608b30",
  numberOfERC20: 20,
  contractAddressNFT: "0x42af3147f17239341477113484752D5D3dda997B",
  numberOfNFTTokens: 2,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJj+WlwCZCGEDC4tnEnkBYhBOsVjR1d6YVXhTJwoYYQMLi2\n' +
    'cSeQAABUjgf+LdMzlxCCZcmXSNuW2XRQtaefXwCaRzWcD2U20AGlECMCMIkx\n' +
    '3gvytlkqaLnApAQuUZoPubCV/N1tZyAPk6oY61xIBEeYfIm6sEec2it054Pp\n' +
    'eue3KxOZNn0TB8Ww0MoGhvKFyZ0FRPuQCDFk7BLPilx/C2vl2i4nrlVVCD+1\n' +
    'gA9/bNabvD9DqHkzaEL1W7OdYB98QmeSrjM2ewkRQv3W7FwNqlP6LhbR6hHV\n' +
    'oT7/jTkRiTQ+4CwNTnhmFS70aOuCaKSmo28K3TVRdxqjX/TInA0hwuABiSFn\n' +
    'IT3GrK/thmGpF9+Cyy4lhyJQS5XxaFyIIvpVndJd2xRydYcjCYgaoQ==\n' +
    '=/7cW\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'https://uploads-ssl.webflow.com/61bf814c420d049df2225c5a/634fd263f7785f51dcb79f9d_b22fe859ab3d28c370d97c4ab3d4464b1a634c8b.png',
  groupName: 'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  isPublic: true,
  groupCreator: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  chatId: '870cbb20f0b116d5e461a154dc723dc1485976e97f61a673259698aa7f48371c',
  rules: {
    'groupAccess': {
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
    },
    'chatAccess': {
      'conditions': [
        {
          'all': [
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
  }
}

```

</details>

---

### **To get group details by chatId**

```typescript
const response = await PushAPI.chat.getGroup({
  chatId: '190591e84108cdf12e62eecabf02ddb123ea92f1c06fb98ee9b5cf3871f46fa9',
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| chatId_ | string | - | group chat id |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (get group by chat id)</b></summary>

```typescript
// PushAPI_chat_getGroup | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHmnwBCACaJgURQRJ4uP9St06i8nw9betHTTCvSvvWTkqJQvsnT1oh\n' +
        'm1fV+wv5q7i3uQQqJV1Ip8hSC5YOANnjQM+5CxXi5g8k3se5joMawDCkC/MP\n' +
        'fwidmsVPEZwKmLPf4ZDMJqmzAscfyLgHVnT7sG23LQD8pTVQkgsWRReA8cTJ\n' +
        'pof6YgGF9YxQGvgTyBZGA9ocswXUdtgm5qHhaQL0+FxnniZCN7HIMJ5XKMBQ\n' +
        'GlMik23wL4MqgLZXjn2D/lgDvYglJeDTI0EvnIuoPZTUruKW8xrmqvHojG/5\n' +
        'Oi2XnorseUDUxytICqZRac0Pqh+b7GMTg8ttG8gowA4AyUOMG6KNliGhABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4eafAQLCQcICRCGEDC4tnEnkAMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAB/Vwf/fBz0RTjYzWwA\n' +
        'J/yU9IhUqVJlc9/mP4fKPNgT9UTmlpquu7MWc3VqNCJmXAmeVjw5mlqf7Aic\n' +
        'JTQ/cHKu2LQ4ZTRY+Mvq2DEzuPmqfyhYt8w6F3VY3Vz4w4yKv2sSliHr7PVD\n' +
        'b0OAz9WiavJYIKigwPKA3wRITCLAeda7WGXyYxFPfZ7xt5Tv9t3bl8SCsZB5\n' +
        'V4CwwmPryOJHtffhxApoFs8cCGxY/9B5tX481q1QAyBJ1fp3HAwW8V8iNs7A\n' +
        'AgkHRVyanhLRGQ/pQJd6yvXAfSFkRNjO1be22xZIIzQ3VGjlCUABUVjHm8Xn\n' +
        'CjvPD7t4IwWWV1GIrHhp9dZSqVwIks7ATQRjh5p8AQgAuGT25MVW+nkvXRaS\n' +
        'rCiKPhCYoJEb8NUCoCP+Lmp/LPNn1NJ+6jtOepQ+ipesmGrbtNSCA6/9vFwo\n' +
        't7MRK2yPXrwTAevcvnDxDSAdkkjvbjhEmA0NALLv6NtUbxQOkdfdItcVDOG5\n' +
        'D0VgpkdeF1V5YbMJSzopQCFKxIiJ4nmY+/jyOQedqaHvLwKN7QfXrPpn2sr2\n' +
        's/mKjWwHNuHyKTYlVkA4LsIzvPb5ApDXau93DdmENumD3FcjF4zUFnZjz0ci\n' +
        'ZnQGp+ncnnX05m02qyDaUiEHXLYpMZdaFMQ+6pkSUoDGIS9o46Nlzh75w9c+\n' +
        'Kpz5TGkLrWbmJgey0Z5gV9sl5QARAQABwsB2BBgBCAAqBQJjh5p8CRCGEDC4\n' +
        'tnEnkAIbDBYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAClzAf/ZEuta8nVlB9n\n' +
        'eWLw7uKFU0jbxZBZ+hfF67j5RIwrZHAQDFu3WFrzhDr+wgOWQTt8c7L1C4iv\n' +
        '5GWBpoTLHUCdfEnQyfUWkKTWFwXqMpst5AmR4oSrRWYMUNH5Pw1u5xTOseyS\n' +
        'fpJGEW09bJ+bSots8NOgSjon8q00i90H77pwMYa6xEct4Rf6MleabFWpYymG\n' +
        'XjzHW7ImoybP6DJQ2ciD7O6EBjfrUmGRm76D6rvu6zqypaZLasYlwcFwvGfb\n' +
        'Pkr3HA7hSvRCAZ96gkCXKSmnSq394aZswEgG9ztdkZAGbdbsgA3SSiSqizTA\n' +
        'auQEzIjcvPdpGZaYmkp4Vm6H42ZKaA==\n' +
        '=cVEH\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBIXICMRiG4Xe/WRNRA8eoqOMCHATTSGxsfSwymL1DT7FuBWeJpPanIjMM037PM719f90JDqcLUSuJV+TaidblTCTMhJkwm7fblSjzKNdO1EpiJNfOyHa7EgkzYSbMZn5pJRHl2oly7TyjlcSIMBNmwmzOtRO1kvhLuXYiYSbMhNncSuI/tZKIhJkwE2bTcb+784RWEiO5dp4hzISZMJvX5Ux0OF2IWklEH++fjGzlSpRrJ1qXM5EwE2bCbDrud3cGWkm8ItfOiDATZsLsB4vIMrfRE1WNAAAAAElFTkSuQmCC'
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHm1MBCAC4lZZapY6Xy3uK6HbnfDhPZOPAKr9nWhU0klj/ySH4+2Xb\n' +
        'Ieqni5KH9+ez/5YVNmwAFX4CExbekZSpSd8EkgLX9gl2/R+y3u2sam88Msgv\n' +
        'ODxfROCvIhkAxViyoCMq4Tm71QVzfgvnLOaglGKMxCoJguMBnwNxHo3iG7V5\n' +
        'TeXB6iUorT4qp1kgrwhMNNY+n5ZYMgSvP7g8rNA3KTHYdUGPXQWzb3d/G3cv\n' +
        'L5hErgXbXQpoutkgBapHOIKkEDYn3iB9ORwvOb8phIXG6ISkxTmS+2em9CNB\n' +
        '/ackJJiBfqrLiPfBELyiV+QJARdpi75cOiGhtsNh8DnQ3bjw7YNzcIBJABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4ebUwQLCQcICRBaJmgmByp5FQMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBJC23yBJT2d/pTAID1omaCYHKnkVAACDpAf/XZk5LXsxtAqr\n' +
        '18CSlzLQlAB970oydJuzQ4DGSD+dSMoZsSOlFxZvA06tbXcjM3hfkuFaKzdb\n' +
        'Ida4YOIvnw1cJ8bTLYmxEtiLtIjfTjCGri3yZ5tiPGaEo4/IaUvs1VbeN8VQ\n' +
        '4d2hCUoXLzQPavMllVqM1fJkLlCE3FHJvSRTIMwm5Y8Ok4RY9b84oesQeOkU\n' +
        'P2BneUhE0/iIllKtqMnykEOm46LK0ITzlvSWAFC2cQ74uG0M27LN3kan+tSm\n' +
        'bEsCYLskHQZwzriv8l/JETJP+ZoMJRmp8SFbRVn8tkVCuA8wI73n3X7DbAu0\n' +
        'hfrYZknhotvoai0W61oq81Afatu/A87ATQRjh5tTAQgAk2Q+HkNdLZ0UDWCm\n' +
        'DxrXV7iB7HBybf0i7oaB2aQnhkBqqIlC9jlwll7Y982hsWbdiNJR2jH2hWwo\n' +
        'DPBV8IAlAT2FCb0E1LW0ts9lr5+SLulx/S7UGNpGzNOsvTT8R/CmlfiqJozC\n' +
        'ySHDU6FrLz+s2MTdW0yHt6XDnL8DN3CIUfHOUSjuMNnq34ZsD4Yf6sLmuYN7\n' +
        'UfJpg0j7+24c7+WmWHrO+SSlKc+8rTZT3s1vV+B/vTv0H+1StU001YlxeTnb\n' +
        'sbkbdXii22dNxmvvwLhZ67Zu4Vg1RMyhLi4SajIJPUR/oKeXfcb3WLpkrJNg\n' +
        'iirZ+RirDOHdSM0ak65l6IRNAwARAQABwsB2BBgBCAAqBQJjh5tTCRBaJmgm\n' +
        'Byp5FQIbDBYhBJC23yBJT2d/pTAID1omaCYHKnkVAAB5VQgAt5JaM/LCNRY4\n' +
        'ix8BMS2X/HgW0I2tJDQbvitbbVBRVAjh6wBqUVGC40JoI1bKz49JWiMqrg6u\n' +
        'L6rDD6Ou2UchvqPtczAS+oWBQSRPwh/dOZJ15EFgu0m2ofNKp+i19Ik5X+QV\n' +
        'tbk7hX9+HOIkK8lk1syJl7+G02egK5EVr6oMKWrMuCbkqNMphIQY0airPNi9\n' +
        'keLYrbp7Pt4SlLxLzIP6jejQX9lJj+nA9nHxTfBRMLxq3sUgCsVr3AzkN5VB\n' +
        '5gEeYBAdGVF0pl7DASVXLSrGAm7Q508OyJa1F2VFZT9ZIvEo2ES7YVZx2tkE\n' +
        '0t5jFnfbm8KdXhWBwO1xZc7ctRadGg==\n' +
        '=CgF7\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR4AcXBsWkDQRCG0W9/FEygIsxFakThgbcMs/UsLmOdKVAjCl3GRFqng4OFQ6B5r2z7fRJ0r0TNBtHzUVjRZRJ1r0TNBpFIJpKJZGXb75MDuldWmg2OEMlEMpHsxD/dK1GzQdRscET3StRsEIlkIplIdupeeafulUgkE8lEslOzwUr3yiuaDVZEMpFMJCu363kSNBusdK+sNBusdK9EIplIJpKVbb9PFrpXXtFssCKSiWQiWbldz5Pg6/eHSJdJ1L2y0mwQPR+F6Pvjk0gkE8lEsj8InjfLsCXbSAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      publicKey: '',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2ElEQVR4AcXBsYnEMBRF0TsPJSpgsklVg2sxOLKbUAlqQhMMAtfiGlSCC3A4m342EBiW/ec80uvzxdhbxVqnE+t9PBlZpxPrfTyx5mXDEs6EM+Es7K3yn/ZWsYQz4Uw4C/OyYe2tYl0pY83c1CrWvGxYwplwJpyF2AvWyljshZErZax1OrFiL1jCmXAmnAVuulLmLwlnwplwFvjlShlrbxVrXjZG9lax5pSxYi9YwplwJpwFboq9MHQ8uUM4E86Es0d6fb4YsRdGrpQZib0wcqWMJZwJZ8LZDzUmMp+amfSXAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJj+WlwCZCGEDC4tnEnkBYhBOsVjR1d6YVXhTJwoYYQMLi2\n' +
    'cSeQAABUjgf+LdMzlxCCZcmXSNuW2XRQtaefXwCaRzWcD2U20AGlECMCMIkx\n' +
    '3gvytlkqaLnApAQuUZoPubCV/N1tZyAPk6oY61xIBEeYfIm6sEec2it054Pp\n' +
    'eue3KxOZNn0TB8Ww0MoGhvKFyZ0FRPuQCDFk7BLPilx/C2vl2i4nrlVVCD+1\n' +
    'gA9/bNabvD9DqHkzaEL1W7OdYB98QmeSrjM2ewkRQv3W7FwNqlP6LhbR6hHV\n' +
    'oT7/jTkRiTQ+4CwNTnhmFS70aOuCaKSmo28K3TVRdxqjX/TInA0hwuABiSFn\n' +
    'IT3GrK/thmGpF9+Cyy4lhyJQS5XxaFyIIvpVndJd2xRydYcjCYgaoQ==\n' +
    '=/7cW\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'https://uploads-ssl.webflow.com/61bf814c420d049df2225c5a/634fd263f7785f51dcb79f9d_b22fe859ab3d28c370d97c4ab3d4464b1a634c8b.png',
  groupName: 'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  isPublic: true,
  groupCreator: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  chatId: '870cbb20f0b116d5e461a154dc723dc1485976e97f61a673259698aa7f48371c'
}
```

</details>

---

### **Chat Helper Utils**

#### **Decrypting messages**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// get threadhash, this will fetch the latest conversation hash
// you can also use older conversation hash (called link) by iterating over to fetch more historical messages
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: 'staging'
});

// chat history but with decrypt helper so everything is encrypted
const encryptedChats = await PushAPI.chat.history({
  threadhash: conversationHash.threadHash,
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  limit: 2,
  toDecrypt: false,
  pgpPrivateKey: pgpDecryptedPvtKey,
  env: 'staging',
});

// actual api
const decryptedChat = await PushAPI.chat.decryptConversation({
  messages: encryptedChats, // array of message object fetched from chat.history method
  connectedUser: user, // user meta data object fetched from chat.get method
  pgpPrivateKey: pgpDecrpyptedPvtKey, //decrypted private key
  env: _env,
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| messages_ | string | - | array of message object fetched from chat.history method |
| connectedUser\* | IUser | false | user meta data object|
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (decrypt conversation)</b></summary>

```typescript
// PushAPI_chat_decryptConversation | Response - 200 OK
// Helper method, incase you don't want to decrypt from api itself
[
  {
    link: 'bafyreibfikschwlfi275hr7lrfqgj73mf6absailazh4sm5fwihspy2ky4',
    toDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    encType: 'pgp',
    fromDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    sigType: 'pgp',
    toCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    signature:
      '-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBQJjh5tjCRBaJmgmByp5FRYhBJC23yBJT2d/pTAID1omaCYH\n' +
      'KnkVAAAZmwf/buPLw6caSZmYnw6D3/p6HF1kWlkGUOTP4RasaU/6dkeDaZs9\n' +
      'SJlz2wC8oOpBGWHMJ/5n3ZWmU71E6U7IKIY793MyIv5t32vTNkwsRHUX7IIn\n' +
      'QFF+FzTIEtHHVTRlnkqNR2YUk1kqcpZCZWHfahi5W2d/WkXlFNdvyyFH4W8L\n' +
      'd03FGhOyXbWwU3xicBz5mSBpIFaaSCXl1SdgJDPXLSk3b65EEOjCOaiz85xC\n' +
      'G+6SW4RUzCGSDcOd9F2EXvvY5H9LgQNi1jjlZn6JrPTPJTJ+wXZXzcZmtOXG\n' +
      'EKcwvPbbPY9wd+gavRSOgYLYn5xoZQW/o3hW7AQlbC5Kj6js48Z0HQ==\n' +
      '=qLiJ\n' +
      '-----END PGP SIGNATURE-----\n',
    timestamp: 1669831523684,
    fromCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    messageType: 'Text',
    messageContent: 'Hi',
    encryptedSecret:
      '-----BEGIN PGP MESSAGE-----\n' +
      '\n' +
      'wcBMA1fn1CNqxQ7nAQgArlo75qe54WerfRKFv1+F9j4NRMvSTgUztvIe51eg\n' +
      'd5MVuj6RYxKERr2bTuBt5cMDJMlNuTnBBkPe4L8+SlsI46L9wmXV9xLoZq1a\n' +
      '94JdxD98RGMF99Jde/3hC/X6GS1yVqPpKPKdWx/tkOPeyqeO/wFF7kqShgIi\n' +
      'Wgq6hGz1fzD3GZhKGY0VSLuC3s0aUy/qw5En1Xd0uX0jdXBl07IIj8p1G2zx\n' +
      '9BuVlksSK34yvIc0RQfCeRadMHkxbA0Hyj31Wrr+Y310YLTppL0s5bQR9APL\n' +
      'WHsIztJ1fHTnXsPhnA7YG0SQpHTyJhuX3rgBjxGrvbZBArmZ+R/Pq9IkOkJe\n' +
      'z8HATAMOsbaZjGN5JwEH/jYjLN6AFRWeaB5CSBSAF+CvHsUgadGmxTdSHBM6\n' +
      'LM9rfGg/MCnpRBuHckA0NNZh+wepq6TDA54ZopsdP14gHj4MKCdfqZr86Jft\n' +
      'ldtjeSgPTFEEJxPMJ4/Z3UeFU9rvOgfxX6l0eHWS0MYwJ3sVYvSyqqHir1K5\n' +
      'TRdEIgtQ3NvLTKkX4bKTSU+SInrvDA+wsc2BcBsbgNhRiGb+XYrbqXBshL1a\n' +
      'lIdpnomkAQgOZMO2n347uURYoruH3OtFeNABJ9D/nEU+LdhDOPGZPefvPBc5\n' +
      'BxK4ExKZ2Wo/TZw8lgC53uqOljsGV63Hp71LkyesKWu5/+vdVrYx/vU63shh\n' +
      'x/TSQAEiaFYEfkWSOthtH0nrJHhkY7FWgjp/1bj/J4J9HCQrVtt2WlQfhowZ\n' +
      'ILxhKk/vep0sJviM3SfJ4hPtoYpZESc=\n' +
      '=43Ta\n' +
      '-----END PGP MESSAGE-----\n',
  },
  {
    link: null,
    toDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    encType: 'PlainText',
    fromDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    sigType: '',
    toCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    signature: '',
    timestamp: 1669831499724,
    fromCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    messageType: 'Text',
    messageContent: 'Hey Fabio!',
    encryptedSecret: '',
  },
];
```

</details>

---

## For Video

### **Instance Variables**

#### **peerInstance**

- Used to store the simple peer instance used for the webRTC connection.

```typescript
private peerInstance: any = null;
```

---

#### **signer**

- Used to store the signer of a user.
- Used in the request, acceptRequest and disconnect methods to send notifications.

```typescript
  private signer: SignerType;
```

---

#### **chainId**

The chain id of the chain on which the call is being conducted.

```typescript
  private chainId: number;
```

---

#### **pgpPrivateKey**

- Used to store the PGP private key of a user.
- Used in the request, acceptRequest and disconnect methods to send notifications.

```typescript
  private pgpPrivateKey: string;
```

---

#### **env**

- The environment on which the call is being conducted.

```typescript
private env: ENV;
```

---

### **data**

- Stores data related to the video call.

```typescript
export type IMediaStream = MediaStream | null;

export enum VideoCallStatus {
  UNINITIALIZED,
  INITIALIZED,
  RECEIVED,
  CONNECTED,
  DISCONNECTED,
  RETRY_INITIALIZED,
  RETRY_RECEIVED,
}

export type PeerData = {
  stream: IMediaStream; // incoming media stream
  audio: boolean | null; // incoming audio status
  video: boolean | null; // incoming video status
  address: string; // incoming address
  status: VideoCallStatus; // status for the connection with incoming peer
  retryCount: number; // number of retires done
};

export type VideoCallData = {
  meta: {
    chatId: string; // unique chatId for the corresponding push w2w chat
    initiator: {
      address: string; // initiator's address
      signal: any; // initiator's signaling data for webRTC connection
    };
    broadcast?: {
      livepeerInfo: any;
      hostAddress: string;
      coHostAddress: string;
    };
  };
  local: {
    stream: IMediaStream; // local media stream
    audio: boolean | null; // local audio status
    video: boolean | null; // local video status
    address: string; // local address
  };
  incoming: [PeerData];
};

private data: VideoCallData;
```

---

#### **setData**

- This function can be used to update the video call `data`

```typescript
setData: (fn: (data: VideoCallData) => VideoCallData) => void;

// usage

import { produce } from 'immer';

setData((oldData) => {
	return produce(oldData, (draft) => {
		// update the draft object, example
		draft.incoming.status = VideoCallStatus.INITIALIZED;
 });
});
```

---

### **Methods**

#### **constructor**

```typescript
constructor({
    signer,
    chainId,
    pgpPrivateKey,
    env,
    setData,
  }: {
    signer: SignerType;
    chainId: number;
    pgpPrivateKey: string;
    env?: ENV;
    setData: (fn: (data: VideoCallData) => VideoCallData) => void;
  }) {}
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| signer_ | SignerType | - | signer object for a user |
| chainId* | number | - | chainId for the video call - Eth Mainnet: 1, Polygon Mainnet: 137 |
| pgpPrivatekey* | string | - | PGP private key of the user, used while sending video call notifications |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|
| setData\* | `(fn: (data: VideoCallData) => VideoCallData) => void` | - | Function to update video call data |

---

#### **create**

- This method is used to create a local stream
- Assigns the local stream obtained from the `navigator.mediaDevices.getUserMedia` to `data.local.stream` state.

```typescript
export type VideoCreateInputOptions = {
  video?: boolean;
  audio?: boolean;
};

async create(options: VideoCreateInputOptions): Promise<void> {}
```

Allowed Options (params with \* are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| video | boolean | true | video status for the local stream |
| audio | boolean | true | audio status for the local stream |

Note - If audio, video aren't enabled in create() then they wont be available during the call respectively.

---

#### **request**

- This method is used to request a push video call.
- Will be triggered on the initiator's end.

```typescript
export type VideoRequestInputOptions = {
  senderAddress: string;
  recipientAddress: string;
  chatId: string;
  onReceiveMessage?: (message: string) => void;
  retry?: boolean;
};

async request(options: VideoRequestInputOptions): Promise<void> {}
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| senderAddress_ | string | - | Local peer address |
| recipientAddress* | string | - | Incoming/remote peer address |
| chatId* | string | - | Unique identifier for every wallet-to-wallet push chat, will be used during verification proof generation |
| onReceiveMessage | `(message: string) => void` | `(message: string) => {console.log('received a meesage', message);}` | Function which will be called when the sender receives a message via webRTC data channel |
| retry | boolean | false | If we are retrying the call, only for internal use |

---

#### **acceptRequest**

- This method is used to accept a push video call.
- Will be triggered on the receiver's end.

```typescript
export type VideoAcceptRequestInputOptions = {
  signalData: any;
  senderAddress: string;
  recipientAddress: string;
  chatId: string;
  onReceiveMessage?: (message: string) => void;
  retry?: boolean;
};

async acceptRequest(options: VideoAcceptRequestInputOptions): Promise<void> {}
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| signalData_ | any | - | Signal data received from the initiator peer via psuh notification upon call request |
| senderAddress* | string | - | Local peer address |
| recipientAddress* | string | - | Incoming/remote peer address |
| chatId\* | string | - | Unique identifier for every wallet-to-wallet push chat, will be used during verification proof generation |
| onReceiveMessage | `(message: string) => void` | `(message: string) => {console.log('received a meesage', message);}` | Function which will be called when the sender receives a message via webRTC data channel |
| retry | boolean | false | If we are retrying the call, only for internal use |

---

#### **connect**

- This is the final method which is used to connect a push video call.
- Will be triggered on the initiator's end.

```typescript
export type VideoConnectInputOptions = {
  signalData: any;
  peerAddress?: string;
};

connect(options: VideoConnectInputOptions): void {}
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| signalData_ | any | - | Signal data received from the receiver peer via push notification upon call acceptRequest |
| peerAddress | string | data.incoming[0].address | Address of the receiver peer, received via push notification upon call acceptRequest |

---

#### **disconnect**

- This method is used to end a push video call.
- Can be triggered on the initiator as well as receivers end.

```typescript
export type VideoDisconnectOptions = {
  peerAddress: string;
} | null;

disconnect(options: VideoDisconnectOptions): void {}
```

Allowed Options (params with \* are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| peerAddress | string | data.incoming[0].address | Address of the peer to be disconnected from |

---

#### **enableVideo**

- This method is used to enable/disable the video (from `data.local.stream`) for a push video call.
- Can be triggered on the initiator as well as receivers end.
  <<<<<<< HEAD
- # **Note -** If video was not enabled during `create()` then it will always remain off.
- **Note -** If video was not enabled during `create()` then it will always remain off.
  > > > > > > > main

```typescript
  export type EnableVideoInputOptions = {
  state: boolean;
}

enableVideo(options: EnableVideoInputOptions): void
```

Allowed Options (params with \* are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| state | boolean | - | true for enable and false for disable |

---

#### **enableAudio**

- This method is used to enable/disable the audio (from `data.local.stream`) for a push video call.
- Can be triggered on the initiator as well as receivers end.
  <<<<<<< HEAD
- # **Note -** If audio was not enabled during `create()` then it will always remain off.
- **Note -** If audio was not enabled during `create()` then it will always remain off.
  > > > > > > > main

```typescript
export type EnableAudioInputOptions = {
  state: boolean;
}

enableAudio(options: EnableAudioInputOptions): void
```

Allowed Options (params with \* are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| state | boolean | - | true for enable and false for disable |

---

#### **isInitiator**

- This method is used to tell if the current peer is the initator of the push video call or not.
- Can be triggered on the initiator as well as receivers end.

```typescript
isInitiator(): boolean
```

---

## For Spaces

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
  groupAccess?: {
    conditions: Array<Condition | ConditionBase>;
  };
  chatAccess?: {
    conditions: Array<Condition | ConditionBase>;
  };
}
```

<details>
  <summary><b>Expected response (create space)</b></summary>

```typescript
// PushAPI.space.create | Response - 200 OK
{
	members: [{
		wallet: 'eip155:0x727C819feB2c7F99c66d71B8411521bca2010023',
		publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
			'\n' +
			'xsBNBGSrssEBCACg3ZjrZB40Xqr5IKIEtFldaeQyJPNwDACMekY77yApav0B\n' +
			'RwiqhFJDFJKcprSHg/vYdqalAIGRQ+J98VMBtHweurIubD/ODB6WknOms7ZY\n' +
			'3ummaEzyFRombuq/C75o/0ImCi2v0PJBI3kdpwzOjiTt8S44yoAVOcTf9jyg\n' +
			'vTEVCOM81yqCf0mDB4t0jqRYewlQuJegORXDKHKTfZcnQybBkDYUGgmxOcyF\n' +
			'BaPMhSiWqAAqqb4gcFO2QKq69JoiE9dzSuF/7dvAq2QZRogC/GQW2Q9yQbq3\n' +
			'CvMNO4H2KUZzegaq2s2nMPGMXPNf4GZcZVJE1phWgAnApxTf5kUFfKr1ABEB\n' +
			'AAHNAMLAigQQAQgAPgWCZKuywQQLCQcICZDwrCS5ulOLwQMVCAoEFgACAQIZ\n' +
			'AQKbAwIeARYhBFKpO7zcSRed+QmbIfCsJLm6U4vBAABZMwf+OIbBcFQ7x++1\n' +
			'NINOYbP9v0PyJvpllDcUORbk3uiPMpvDuQYAe2Fd4dY2Y91l3VdpIm/w6HQy\n' +
			'y81Y694w4E7PRVhDwHivv5D10VE9MF3h6qOHrLLpvdhpMaB5Ur8ts5rU2zOu\n' +
			'64HR04/BVO9N0nrE9iywIgVMOy6IrS+OgK3r75PPX35bam/kbbmZHeygFaE9\n' +
			'+mgQVdhwgF5borekIiz1Rc8CPA/P1yZy8QQl4KGmJEs+hOc5rPnUWwarvaAH\n' +
			'mPb6H0/mG81eXBOjpJlSFu6d/uqKLpoAw5fkvFoIsNwovYpyQkSbhzwe4T2N\n' +
			'jGqGd0+La03QdB5FbaiwcnJ96lU6oM7ATQRkq7LBAQgAxu9uK1+p62+/RvcF\n' +
			'Mz7g3A8SJiN76NYxk29sjQ9gW74B/IdPv5TlUVhG6PGr2c3SucASlEHieagY\n' +
			'CXM2+fpdu4rQ6EKRAe+30GFopfzhX1d0zv9d5BE6q1ML5mkrpDECH5iuqah7\n' +
			'smmbRdWE7zRSGaHyEfVqAG3wfMzzN0BcchxxR4vMCNKYLs9v2Q09ecO7DgaY\n' +
			'5CZqxaFlTo+auuDhE0XU7WRbNL77izocV1Sm+McRyo28PrFTcrRRznD1nP0V\n' +
			'eZ4+aoulqyYA+gBBaIUdSA5kQXJiy67crB50yX3V6zLIfptD2ThHPjTY/inW\n' +
			'wVHVug4jIWUQ1QQw/q9qvGxAzQARAQABwsB2BBgBCAAqBYJkq7LBCZDwrCS5\n' +
			'ulOLwQKbDBYhBFKpO7zcSRed+QmbIfCsJLm6U4vBAADu6wf+NJDX/3NAxQKN\n' +
			'Iigj0GkBm/y69iFmQvWJxxtiYCNu8VBhm8MkcghUJ8G2tWP9ueUOM8sMTEa+\n' +
			'G+l+wSNwh/1yisF3FutDpy6l+fiy6kPPD4vl08jY3GrqSuWWfMxTJhMZ5D6v\n' +
			'OW2EfdyET+oP5eOnCd6p0EXP2ic48rVHDdU2iWeg0RkGvZP3t2LljWFdLbvw\n' +
			'h7+wSD1i4LY4slUIdbLdDSLN1gWFN1HXzX10mpX0grV2sBdfkNyHhF0WcIat\n' +
			'sD9HpAx2M62yP2D9D9UZVrW7WfmOoyL1NrnXSJsI8CRFDzujvpIrr7875zSi\n' +
			'VnxDVyt7twc7cYqRDHsNYuxAuE815A==\n' +
			'=2jvb\n' +
			'-----END PGP PUBLIC KEY BLOCK-----\n',
		isSpeaker: true,
		image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4klEQVR4AcXBoW3FMBRA0dsn75E9skAU6BkMSk1CA0xNsoBnMLSyQPbIDgVlLX0OcPX1Vb1zPj6/v35QWg5o61bQok+MHHVHazmgrVtBE4wJxgRjjofzmuj4xCuiT2iRCe2gJxgTjAnGXMuBTi2MRJ8YOerOSMsBTTAmGBOMuXUraNEntKPuaEfdeUX0iU4taIIxwZhgzPGH6BP/STAmGBOMOR6W+UY7r4l3LPONttITjAnGBGMu+kSnFrQlB96xbgUt+oQmGBOMCcYcDy0HRs5rYmSZb7SWA1pkQhOMCcYEY78uSjTZAXCkaQAAAABJRU5ErkJggg=='
	}],
	pendingMembers: [{
			wallet: 'eip155:0x5f4e9e7Fcc17a943178c0b0881b09E8Ef9D34437',
			publicKey: null,
			isSpeaker: false,
			image: null
		},
		{
			wallet: 'eip155:0xFedfA2b276676C5c6ce753ddb4B05d00104E9236',
			publicKey: null,
			isSpeaker: false,
			image: null
		}
	],
  contractAddressERC20: "0x8Afa8FDf9fB545C8412499E8532C958086608b30",
  numberOfERC20: 20,
  contractAddressNFT: "0x42af3147f17239341477113484752D5D3dda997B",
  numberOfNFTTokens: 2,
	verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
		'\n' +
		'wsBzBAEBCAAnBYJkq7LBCZDwrCS5ulOLwRYhBFKpO7zcSRed+QmbIfCsJLm6\n' +
		'U4vBAAAAHwf+K4f0gxaP56X4Cv2zlPWB9iUPi/1FOnx8ZF7oEf9xJSv/xA7v\n' +
		'9LHBTZ2Y9AQlJpy0WLB7KGF7mVV1MdUKHjn2SFQ+1h+8d+FIHXfmB7Ie4alP\n' +
		'nnar6XjtMVKYyqXRzMzCq2F7Fjea1sUOXBxAeyJstAGG6nvsU51imaAtGQlQ\n' +
		'u7ih8D9UkiOe719v5GyI1vtiS+hHGlYo0+A7WVImH6SuVyPZ3UyPvLxXpeKs\n' +
		'1SeEfuvfmKHbswm1DDGOknyo7fJ/QgKqOfkwsBIrYRNGwPGEKt8pHdwNxsNn\n' +
		'hNQtlFqtmtvieaxbhJQKXHbVgNv206xNsUBrK/U2nCakx7EMmxikFg==\n' +
		'=tz9T\n' +
		'-----END PGP SIGNATURE-----\n',
	spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
	spaceName: 'wasteful_indigo_warbler',
	isPublic: true,
	spaceDescription: 'boring_emerald_gamefowl',
	spaceCreator: 'eip155:0x727C819feB2c7F99c66d71B8411521bca2010023',
	spaceId: 'spaces:e0553610da88dacac70b406d1222a6881c0bde2c5129e58b526b5ae729d82116',
	scheduleAt: '2023-07-15T14:48:00.000Z',
	scheduleEnd: '2023-07-15T15:48:00.000Z',
	status: 'PENDING',
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
  }
}


```

</details>

---

### **To check user access of a token gated group**

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

<details>
  <summary><b>Expected response (space access)</b></summary>

```typescript
// PushAPI_chat_getSpaceAccess | Response - 200 OK
{
    'spaceAccess': true,
    'rules': {
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
                            },
                            'access': false
                        },
                        {
                            'type': 'GUILD',
                            'category': 'guildRoles',
                            'subcategory': 'specificRole',
                            'data': {
                                'guildId': '13468',
                                'guildRoleId': '19924'
                            },
                            'access': true
                        },
                        {
                            'type': 'PUSH',
                            'category': 'ERC721',
                            'subcategory': 'owner',
                            'data': {
                                'contract': 'eip155:5:0x42af3147f17239341477113484752D5D3dda997B',
                                'amount': 1
                            },
                            'access': true
                        }
                    ]
                }
            ]
        }
}

```

</details>

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
      'groupAccess': {
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
      'chatAccess': {
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

<details>
  <summary><b>Expected response (update space)</b></summary>

```typescript
// PushAPI.space.update | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0x367c6555b2CAD9C2d2656066EC3996Ba12cD058d',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGSr17UBCADhEXWz/lsg0sDA+QRygzl+4t84/YYa459nzFRNB36jkbU8\n' +
        'FxRsE6oZTu0Leanup7aul4trJJ4qyA6xFfDjprDzrm1Gtp/gos46Lxk+br64\n' +
        'lzgqTfSKpBs9UWqOcr4Vnoq9WeOiFZax0DhN//7ibIQDWIJ0E6iOc8uiSoGZ\n' +
        's4AHTx7GtUvHxIUAk/hQY8UjjDNyhgCSrmdPeWt/SVbmFCHchdH/KhSK8JVq\n' +
        'qs8/nKx2Tm/nmAdWFZDqIJxd5tVuXXMxTZYZADZfmBltR2F/8GkF7hfX/aOo\n' +
        'gGQ/u2FPbCKRjtedfJi3WsPUKtyFg6QdwBnOQmYn0fGXlPGR7UVSsmIVABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZKvXtQQLCQcICZD2NRrvru2XMgMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBM1nsbalDm3PtLAK2/Y1Gu+u7ZcyAADzuwgAmTBbnBQZ2w06\n' +
        'RbLmcZf8cYTof1X3mpYBa1lprMltib2jZQdu8DxhZBapYIE1O0UzV2Dy8IXj\n' +
        'zavtNFZiLR8FTwkrXQ3DGrZylnqjLkQ6m2jZsGIypb2OpTlBIBnjW98Dh99F\n' +
        'egI/5wse59IfGhYXVcKluKDAW2ezUJx8BhacZCwf/S8iG9YKrZctS5cVZxQw\n' +
        'SymXv88msoQrWhxmu2AT0rNsZ656ANMr/MuUjKMxQsoNCNIkp5kE0UTGfMwc\n' +
        'c69Gabs9uOPOqAGeSBGVfw+uJig/RJ4MWDCbj6QIDsV5FFRvTmJmmSNLNH5y\n' +
        '83pHxE+923z6NiPWRonbns3pFNvhnc7ATQRkq9e1AQgAxjGMkGhs2OTW8fW/\n' +
        '4tloJOID0UIDrz/24uX4JU+qjTqMzFyNGaNagT8n0xDH2E63YFmketip4QA2\n' +
        '6kUBICKR2Y5kNNzkJXK4NYfa5OXEIS+lw+X7oMXd9YJ/D1fig1XD4Bf0ofsZ\n' +
        'QIxHOn6w3T/wQHOBpu+cqE3d0pW+6s6hZ4mkuPk6OXrkBSEtynk4ADQS+a3b\n' +
        'PrCGU9rJy2OnbP+lMr3onv/6BR/DFE4qCIfQt0cLu4nhAuYVYrOupi3p9eBQ\n' +
        'z/oWHCSNQVQSW2/vHp0YwMj2r3jSGdoZ3pcfy4iXOa7xEyeauOn/pHK+syOX\n' +
        'Pv64DHncql4AJFj9tw4rZ2/kkQARAQABwsB2BBgBCAAqBYJkq9e1CZD2NRrv\n' +
        'ru2XMgKbDBYhBM1nsbalDm3PtLAK2/Y1Gu+u7ZcyAADapwf/XF6I2NifyL/h\n' +
        '2aVsr2lL2At732336je3WM6QnA/q1x9lmxX646c9eETUQvLLhT5RZmx1X8Fa\n' +
        'X/qGMKJe+BWLFPy5k6LnOezvvOxHGV+dzRndlWbnC9d3AZhThciw/Rd8V9W6\n' +
        'd6luo7+Apdd3rS17hG4gElhNX1drq5TuWR89yxA5oXcIqA+u3jBdpz0qo/ME\n' +
        '+63r0AubixdM7rgV0skugaIXvqMKtfMC/V2A8mCL5AmRXCyfMBIsEA0L5YA1\n' +
        'wsKlHIQAy3jiPdY/2q5KUWJsR9o/IFirjnTd5vywtYsscOq/KnfLKdc2cVOr\n' +
        'e/vSkTOrD+dVTlxGhADoud4kvcOPtg==\n' +
        '=6H2/\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isSpeaker: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAy0lEQVR4AcXBMU5DMRBF0cvI63FJETn7oXY3K3CBNHX2g/WFKKdnLdCOUnyEgnjnPH2+v35RXPagOsbmEZc9qI6xqQwxQ8wQa9w5xuYvHWNzxhAzxAyxxg8ynKrPxZkMp+pzccYQM8QMsZbhVH0uzmQ4j8hwKkPMEDPEWp+LKsOp+lxUGc6ZPhdVhlP1uagMMUPMEGsZzn/KcCpDzBAzxBp3+lxUGU718vzGmVtcqfpcVBlOZYgZYoZY63PxG7ePK4/oc1EZYoaYIfYN05Y0ReqpB6sAAAAASUVORK5CYII='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0xB026B0A8BB1fea997a73c5a84fe7aF8cAab1AcF2',
      publicKey: '',
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4ElEQVR4AcXBsU0EMRCG0Y+RC3ETzpwheqAFOnBmOZtSNqGC02abOaUAdwLp3AU+IYT+916+Pj6/CXLp/Kc1B5EhZogZYokn1hxEuXR21hxEuXR2DDFDzBBLuXSiNQdRaxeR+2CntYvIfRDl0okMMUPMEEs8cZw37pQbO8fJnUVlxxAzxAyxxINcOtGag7/IpbNjiBlihlh6f30jcq9EuXSiNQc7uXSiNQdRaxeRIWaIGWLJvRK1dhEdJ3dy6fxGaxeReyUyxAwxQyzxwL0SLSpRLp2dNQeRT7YMMUPMEPsB1yM4zt7CMugAAAAASUVORK5CYII='
    },
    {
      wallet: 'eip155:0x9b70FD7164ec0Ed3E1B3E318836522340dd2e125',
      publicKey: '',
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA0UlEQVR4AcXBMWoDMRRF0ZtnkWYKgddgGKbSVrSILFBbUWUMLrICgwqXQ9L+NDKDIe+cj8+v7x+CPhpRyZV39NGISq5EwkyYCbN0f9z4a2Omj8ZMyZVo2Tei++NGJMyEmTBLz9OVqOTKTMmVIy7nlaiPRiTMhJkwS8u+8Z+WfSMSZsJMmKXLeWWmj0a07Bszz9OVqORKdDmvRMJMmAmzxAslV45ZOUKYCTNhlvpozJRcifpozJRcifpozAgzYSbMEi/00YhKrsz00ThCmAkzYfYLlLsvpsHyBx0AAAAASUVORK5CYII='
    },
    {
      wallet: 'eip155:0x1A050099a08D7faf3b5923669a0FAe42A0872D72',
      publicKey: null,
      isSpeaker: false,
      image: null
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJkq9e1CZD2NRrvru2XMhYhBM1nsbalDm3PtLAK2/Y1Gu+u\n' +
    '7ZcyAAA0igf/Tgo/WU4C5g4UtHPCwU/jThQwjElzCa96bZU8bCXsgnoO1NMI\n' +
    'fwI7FxIw8FmFrktHIWT10T/9vq2ItyUvpbWRhnD5zt5aRhJ1KA1z06iwkoUt\n' +
    'DLiPfveoSDyIhUIjx5PUMN0r/tXmLhj3CrkHx1hiPBxEkhi9brfFcOvX57HS\n' +
    'VOKOeeUa4G1cmk6dtzLHWT4p7ekrFhZPHXDtZUMZEU2wbMkB6bRqlZ7UYLbN\n' +
    '7+0AvCu7uaCYG0zfbl3oZc6DkIm9jnBknsII6Hqv7Dc9NLAUBWo8tPrW2/KN\n' +
    '8Bv/gk5HPb16tOihIUjs8v45wO3oTPAQYbJGdF6ta+HyiKO8JWipbw==\n' +
    '=wkHz\n' +
    '-----END PGP SIGNATURE-----\n' +
    ':null',
  spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  spaceName: 'mobile_aquamarine_constrictor',
  isPublic: true,
  spaceDescription: 'conventional_crimson_dove',
  spaceCreator: 'eip155:0x367c6555b2CAD9C2d2656066EC3996Ba12cD058d',
  spaceId: 'spaces:108f766a5053e2b985d0843e806f741da5ad754d128aff0710e526eebc127afc',
  scheduleAt: '2023-07-15T14:48:00.000Z',
  scheduleEnd: '2023-07-15T15:48:00.000Z',
  status: 'PENDING',
  rules: {
    'spaceAccess': {
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
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            },
            {
              'type': 'PUSH',
              'category': 'ERC721',
              'subcategory': 'nft_owner',
              'data': {
                  'address': 'eip155:5:0x42af3147f17239341477113484752D5D3dda997B',
                  'amount': 1
              }
            }
          ]
        }
      ]
    }
  }
}
```

</details>

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

<details>
  <summary><b>Expected response (get space by space id)</b></summary>

```typescript
// PushAPI_space_get | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xd1ab5Af3Be78bB1492099CE568761F0e706352a0',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGSr528BCADI8kQcWkaw9PKmSrwCtPBDWj+wzPhmok9jAzxzb2+qAjSV\n' +
        'rYdIrnx6PAp1rMU6qoVg4cdDbCYPV+kCj8l3lUzH/a/SfPsDWpspA/ICWMeS\n' +
        'dMdGYxHLk2gsu0wRz69qoddXMY1h5eMZEyRnr2fsX/cy15mxO2IEHYnC2/rp\n' +
        '06iFpx1T8k5HWgFDpyleWyMSQ7Bnn7GutrlHYEVtIGVfXDSkea8IDLLkzBEV\n' +
        '3jlBUFhpsrlcvDwDYcMYOrqSBEtg1a+GMK+2Ye/hF37KUYTAPleKXeN0cYIs\n' +
        'Va8oleZK960XYfuy5SYCJav2kaAggNWQBie5G9C4H3h7FuFwWk8LH3DhABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZKvnbwQLCQcICZBm9Bz6DvB6DwMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBPkdSvwnOBuAJaOWAGb0HPoO8HoPAAAkiQgAukm3owebckwr\n' +
        'xAR42r/+CBx1uoqM2ZeEAUeYtBF7sdLEsdxFrxl8wHKAbglZwtgWcfG95v2R\n' +
        'zLcBco3v9p0IuS6DZduIfhngZ49gpYwqFGyiCOvo+k14tuMbrbOZTTKp0uc6\n' +
        'icpTyP8/1U0nZrQmmSXyfh6Hgmx1OnW3zTM7oUN1ZVvj3V6rOl+ktUPjAaYo\n' +
        'CWJjth92xhDWEPZnC/4Gz2eRoTVtmx8u+/2vNPffQVgzzHznUxB+G5XeZmPk\n' +
        'z8oxxSxII8PNiAs5LizqPjyq2gEv25GlCsMXTYz60n/t/4G7Yc94yu8xD8u3\n' +
        'BpWluHC2eW0pYFcDfiNLfv0uJCrUcM7ATQRkq+dvAQgA7v7Zz4CZdPsd4jvB\n' +
        'uDwjop/Gvoz+rbvAdS3Xrsi+OTyrWAqidnXChhwExlUNelZ9v52lGxe1twwr\n' +
        'vxeQ4M0pv4oqSlZxhkqBCyj+E7ECR2WXG7ccLlzYOz3b5BXT+fEkmVsbVTjA\n' +
        'Kttjosm7FtY4igY2Hu4UlZZW8M1tYL1R/UegFeMYGY7aO7dcKeiP0NsDwm3c\n' +
        '0SiU6/JlOXAIi/ZSKDJ4b5BPK6GFj5pNWr92/V7LejlZfoHAVDbb91tiPGdP\n' +
        'y3+r9T3IYsgUDLgOpPQn6o82Nctm6CnIZqAN12nJ1DEJP2JyLDedg9b5H+aa\n' +
        'FDZFc7yQ3In/QPtjHImydLt9NwARAQABwsB2BBgBCAAqBYJkq+dvCZBm9Bz6\n' +
        'DvB6DwKbDBYhBPkdSvwnOBuAJaOWAGb0HPoO8HoPAABRUQf+KoF4UXuseLBO\n' +
        'd0PD0+hEcnsYbaPWmPZtJPWusxPl6kt421luymPiThDXwaMVzRrmxkz0dNZ3\n' +
        'bUFYtS24t2BhlXZ6cGFNRjXrA9OV0kLg/kNm1vboQ1GL8qRV9CIjPVEpksQp\n' +
        'tOiYN+X+/2XdPJkaQpITHIFV067qWQSAKIonvOI8OJYOovGRQTInz0VE71Yn\n' +
        'SeiOilKBK+p2RN38jGr0PGWt740KJ6560FzfUwTAQzz9vrkYa+vEhWe+bzOd\n' +
        'YBpxj/BRTGR19DrKlGcFPdTYz5ADxCjBuCxXgoRCbBiWwh+iIstk5qkT8uHK\n' +
        'NQjzDvo3RO1cROQp0zsikladmzGZHQ==\n' +
        '=q/e/\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isSpeaker: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA10lEQVR4AcXBsWnFMBSG0c8/brOD9kgfogHUGQIuAppInSsVAQ2gdbSD64fTXl4hMI/HPWf5fXxf3DDaxkxIlTuEM+FMOFt5MtqG1XvBipGpsp9YMWaskCqWcCacCWfL4+fzwogx8069FyzhTDgTzpavv3oxEVLlFaNtzAhnwplwtvIkpIpV9hMrxsxM7wUrHxVrtA1LOBPOhLM1pIo12oaVj4rV98JMPj6wRtuwQqpYwplwJpyt3BRjZiZQuUM4E86Es7XsJ1aMTIVUeUXZTyzhTDgTzv4BnGY033BWusUAAAAASUVORK5CYII='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0xaC6C69c657cF6022fa787B14BDdaA22936B56D65',
      publicKey: '',
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2UlEQVR4AcXBQWoEIRBA0Z+ikOwNDHirbARPKDiLvkzOIATaC4iQbGt6ITSzqPc+np8/fxhpVazzcfCOr99vrK4FS3AmOBOcKRddCy9GwQoxszNHw+rKluBMcCY407QqO10L1hyNO9Kq7AjOBGeCMz0fB9YcjZ20KjtdC1bXghVixhKcCc4EZzpH446uhXfM0bAEZ4IzwZmGmLHmaOyEmNmZo7ETYsYSnAnOBGfKRVoVq2vBmqNxR1oV6+SV4ExwJjhTLroWdkLM7MzRsLoWrMCBJTgTnAnO/gGd1jrTKk/8EAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xEf532414907E8c631307c0d501cDe6D1694bAF5e',
      publicKey: '',
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA00lEQVR4AcXBobHDMBBF0ZsdjftIDeGuIkzIaGsQC1MNQkZirsLcnaQCk3yqBOzMH4N3zu11f38I+GPiinacRAwxQ8wQS/zo1flSGqNenUgujVGvziiXxsgQM8QMscSPXBqjXp1RLo1Ir84ol0bEEDPEDLHkj4lI51uvzn/4YyJiiBlihlhqx0lkZ2U0Pxci+7YyasdJxBAzxAyx1KsT8W3lil6diCFmiBlit9f9/SHQq3NFLo2IIWaIGWKpVyeybyuj+bkQ2beV0VwXIoaYIWaI/QH8GTSs76EUEQAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0x2F5f27B523C8888eA79b7FA80a9CbA6b6980784c',
      publicKey: null,
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA0klEQVR4AcXBsW3DQAxA0W9CExjIDhogfboDCw9gICvcHmldcIAMoYLgJJ5CKzgto4KA4ILvXT5+Pl8kwydZqJHt60bl+ryRDZ9koUYmNBOaCc0u31+/L04INSrDJ2cIzYRmQrMl1Dhj+KQSapwhNBOaCc0WDvZ1o+ROZV83KtfnjUxoJjQTmi0c3B/OO+4PpxLKP0IzoZnQbBk+yUKNyvBJJdSoDJ9kQjOhmdBsCTWy4ZNKqFEZPqmEGpnQTGgmNFs4CDWy4ZN3hBoVoZnQTGj2BxvbMvuaMCXUAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJkq+dvCZBm9Bz6DvB6DxYhBPkdSvwnOBuAJaOWAGb0HPoO\n' +
    '8HoPAAD5ywf/cvaGM0DzcB22Q2FMzUZG4/ZmkN4OknvSj0d4hB/sPUIb9176\n' +
    'z+niFMjWZNFpIj8s36f16oMEZZ+Eleu9t6sECBxRDvO8pEwyByCXSmz8e/SH\n' +
    'Y659cvg5/A3bSe0FqR0VTI1o+Uz2BpnXG/P38C6D46btaIaJcr4cIh88wQ9J\n' +
    'lr05hOE7w/7Uo5OwyXala0NfB+8S4LIfpC2OlPOhyHQEJd2+WoFKb/6dO28D\n' +
    'TLuvgYJXJfc4R3ElcgFfm1N9ylG0Pt1F3c0C/k9bNokR2PVXgX2XSTQsx1rD\n' +
    'MCY/ePr93INyNZuTPcPlK87X6OTa2/gEW161vup2Xn2Did9HtL76Qw==\n' +
    '=EkOP\n' +
    '-----END PGP SIGNATURE-----\n' +
    ':null',
  spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  spaceName: 'intellectual_green_bat',
  isPublic: true,
  spaceDescription: 'sad_purple_pinniped',
  spaceCreator: 'eip155:0xd1ab5Af3Be78bB1492099CE568761F0e706352a0',
  spaceId: 'spaces:9dab226c7920fe06154d76f78dfe1187bdc4fda712cdd9a8b37cc6a99741a63b',
  scheduleAt: '2023-07-15T14:48:00.000Z',
  scheduleEnd: '2023-07-15T15:48:00.000Z',
  status: 'PENDING'
}
```

</details>

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

<details>
  <summary><b>Expected response (start space by space id)</b></summary>

```typescript
// PushAPI_space_start | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xd1ab5Af3Be78bB1492099CE568761F0e706352a0',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGSr528BCADI8kQcWkaw9PKmSrwCtPBDWj+wzPhmok9jAzxzb2+qAjSV\n' +
        'rYdIrnx6PAp1rMU6qoVg4cdDbCYPV+kCj8l3lUzH/a/SfPsDWpspA/ICWMeS\n' +
        'dMdGYxHLk2gsu0wRz69qoddXMY1h5eMZEyRnr2fsX/cy15mxO2IEHYnC2/rp\n' +
        '06iFpx1T8k5HWgFDpyleWyMSQ7Bnn7GutrlHYEVtIGVfXDSkea8IDLLkzBEV\n' +
        '3jlBUFhpsrlcvDwDYcMYOrqSBEtg1a+GMK+2Ye/hF37KUYTAPleKXeN0cYIs\n' +
        'Va8oleZK960XYfuy5SYCJav2kaAggNWQBie5G9C4H3h7FuFwWk8LH3DhABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZKvnbwQLCQcICZBm9Bz6DvB6DwMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBPkdSvwnOBuAJaOWAGb0HPoO8HoPAAAkiQgAukm3owebckwr\n' +
        'xAR42r/+CBx1uoqM2ZeEAUeYtBF7sdLEsdxFrxl8wHKAbglZwtgWcfG95v2R\n' +
        'zLcBco3v9p0IuS6DZduIfhngZ49gpYwqFGyiCOvo+k14tuMbrbOZTTKp0uc6\n' +
        'icpTyP8/1U0nZrQmmSXyfh6Hgmx1OnW3zTM7oUN1ZVvj3V6rOl+ktUPjAaYo\n' +
        'CWJjth92xhDWEPZnC/4Gz2eRoTVtmx8u+/2vNPffQVgzzHznUxB+G5XeZmPk\n' +
        'z8oxxSxII8PNiAs5LizqPjyq2gEv25GlCsMXTYz60n/t/4G7Yc94yu8xD8u3\n' +
        'BpWluHC2eW0pYFcDfiNLfv0uJCrUcM7ATQRkq+dvAQgA7v7Zz4CZdPsd4jvB\n' +
        'uDwjop/Gvoz+rbvAdS3Xrsi+OTyrWAqidnXChhwExlUNelZ9v52lGxe1twwr\n' +
        'vxeQ4M0pv4oqSlZxhkqBCyj+E7ECR2WXG7ccLlzYOz3b5BXT+fEkmVsbVTjA\n' +
        'Kttjosm7FtY4igY2Hu4UlZZW8M1tYL1R/UegFeMYGY7aO7dcKeiP0NsDwm3c\n' +
        '0SiU6/JlOXAIi/ZSKDJ4b5BPK6GFj5pNWr92/V7LejlZfoHAVDbb91tiPGdP\n' +
        'y3+r9T3IYsgUDLgOpPQn6o82Nctm6CnIZqAN12nJ1DEJP2JyLDedg9b5H+aa\n' +
        'FDZFc7yQ3In/QPtjHImydLt9NwARAQABwsB2BBgBCAAqBYJkq+dvCZBm9Bz6\n' +
        'DvB6DwKbDBYhBPkdSvwnOBuAJaOWAGb0HPoO8HoPAABRUQf+KoF4UXuseLBO\n' +
        'd0PD0+hEcnsYbaPWmPZtJPWusxPl6kt421luymPiThDXwaMVzRrmxkz0dNZ3\n' +
        'bUFYtS24t2BhlXZ6cGFNRjXrA9OV0kLg/kNm1vboQ1GL8qRV9CIjPVEpksQp\n' +
        'tOiYN+X+/2XdPJkaQpITHIFV067qWQSAKIonvOI8OJYOovGRQTInz0VE71Yn\n' +
        'SeiOilKBK+p2RN38jGr0PGWt740KJ6560FzfUwTAQzz9vrkYa+vEhWe+bzOd\n' +
        'YBpxj/BRTGR19DrKlGcFPdTYz5ADxCjBuCxXgoRCbBiWwh+iIstk5qkT8uHK\n' +
        'NQjzDvo3RO1cROQp0zsikladmzGZHQ==\n' +
        '=q/e/\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isSpeaker: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA10lEQVR4AcXBsWnFMBSG0c8/brOD9kgfogHUGQIuAppInSsVAQ2gdbSD64fTXl4hMI/HPWf5fXxf3DDaxkxIlTuEM+FMOFt5MtqG1XvBipGpsp9YMWaskCqWcCacCWfL4+fzwogx8069FyzhTDgTzpavv3oxEVLlFaNtzAhnwplwtvIkpIpV9hMrxsxM7wUrHxVrtA1LOBPOhLM1pIo12oaVj4rV98JMPj6wRtuwQqpYwplwJpyt3BRjZiZQuUM4E86Es7XsJ1aMTIVUeUXZTyzhTDgTzv4BnGY033BWusUAAAAASUVORK5CYII='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0xaC6C69c657cF6022fa787B14BDdaA22936B56D65',
      publicKey: '',
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2UlEQVR4AcXBQWoEIRBA0Z+ikOwNDHirbARPKDiLvkzOIATaC4iQbGt6ITSzqPc+np8/fxhpVazzcfCOr99vrK4FS3AmOBOcKRddCy9GwQoxszNHw+rKluBMcCY407QqO10L1hyNO9Kq7AjOBGeCMz0fB9YcjZ20KjtdC1bXghVixhKcCc4EZzpH446uhXfM0bAEZ4IzwZmGmLHmaOyEmNmZo7ETYsYSnAnOBGfKRVoVq2vBmqNxR1oV6+SV4ExwJjhTLroWdkLM7MzRsLoWrMCBJTgTnAnO/gGd1jrTKk/8EAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xEf532414907E8c631307c0d501cDe6D1694bAF5e',
      publicKey: '',
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA00lEQVR4AcXBobHDMBBF0ZsdjftIDeGuIkzIaGsQC1MNQkZirsLcnaQCk3yqBOzMH4N3zu11f38I+GPiinacRAwxQ8wQS/zo1flSGqNenUgujVGvziiXxsgQM8QMscSPXBqjXp1RLo1Ir84ol0bEEDPEDLHkj4lI51uvzn/4YyJiiBlihlhqx0lkZ2U0Pxci+7YyasdJxBAzxAyx1KsT8W3lil6diCFmiBlit9f9/SHQq3NFLo2IIWaIGWKpVyeybyuj+bkQ2beV0VwXIoaYIWaI/QH8GTSs76EUEQAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0x2F5f27B523C8888eA79b7FA80a9CbA6b6980784c',
      publicKey: null,
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA0klEQVR4AcXBsW3DQAxA0W9CExjIDhogfboDCw9gICvcHmldcIAMoYLgJJ5CKzgto4KA4ILvXT5+Pl8kwydZqJHt60bl+ryRDZ9koUYmNBOaCc0u31+/L04INSrDJ2cIzYRmQrMl1Dhj+KQSapwhNBOaCc0WDvZ1o+ROZV83KtfnjUxoJjQTmi0c3B/OO+4PpxLKP0IzoZnQbBk+yUKNyvBJJdSoDJ9kQjOhmdBsCTWy4ZNKqFEZPqmEGpnQTGgmNFs4CDWy4ZN3hBoVoZnQTGj2BxvbMvuaMCXUAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJkq+dvCZBm9Bz6DvB6DxYhBPkdSvwnOBuAJaOWAGb0HPoO\n' +
    '8HoPAAD5ywf/cvaGM0DzcB22Q2FMzUZG4/ZmkN4OknvSj0d4hB/sPUIb9176\n' +
    'z+niFMjWZNFpIj8s36f16oMEZZ+Eleu9t6sECBxRDvO8pEwyByCXSmz8e/SH\n' +
    'Y659cvg5/A3bSe0FqR0VTI1o+Uz2BpnXG/P38C6D46btaIaJcr4cIh88wQ9J\n' +
    'lr05hOE7w/7Uo5OwyXala0NfB+8S4LIfpC2OlPOhyHQEJd2+WoFKb/6dO28D\n' +
    'TLuvgYJXJfc4R3ElcgFfm1N9ylG0Pt1F3c0C/k9bNokR2PVXgX2XSTQsx1rD\n' +
    'MCY/ePr93INyNZuTPcPlK87X6OTa2/gEW161vup2Xn2Did9HtL76Qw==\n' +
    '=EkOP\n' +
    '-----END PGP SIGNATURE-----\n' +
    ':null',
  spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  spaceName: 'intellectual_green_bat',
  isPublic: true,
  spaceDescription: 'sad_purple_pinniped',
  spaceCreator: 'eip155:0xd1ab5Af3Be78bB1492099CE568761F0e706352a0',
  spaceId: 'spaces:9dab226c7920fe06154d76f78dfe1187bdc4fda712cdd9a8b37cc6a99741a63b',
  scheduleAt: '2023-07-15T14:48:00.000Z',
  scheduleEnd: '2023-07-15T15:48:00.000Z',
  status: 'ACTIVE'
}
```

</details>

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

<details>
  <summary><b>Expected response (stop space by space id)</b></summary>

```typescript
// PushAPI_space_stop | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xd1ab5Af3Be78bB1492099CE568761F0e706352a0',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGSr528BCADI8kQcWkaw9PKmSrwCtPBDWj+wzPhmok9jAzxzb2+qAjSV\n' +
        'rYdIrnx6PAp1rMU6qoVg4cdDbCYPV+kCj8l3lUzH/a/SfPsDWpspA/ICWMeS\n' +
        'dMdGYxHLk2gsu0wRz69qoddXMY1h5eMZEyRnr2fsX/cy15mxO2IEHYnC2/rp\n' +
        '06iFpx1T8k5HWgFDpyleWyMSQ7Bnn7GutrlHYEVtIGVfXDSkea8IDLLkzBEV\n' +
        '3jlBUFhpsrlcvDwDYcMYOrqSBEtg1a+GMK+2Ye/hF37KUYTAPleKXeN0cYIs\n' +
        'Va8oleZK960XYfuy5SYCJav2kaAggNWQBie5G9C4H3h7FuFwWk8LH3DhABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZKvnbwQLCQcICZBm9Bz6DvB6DwMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBPkdSvwnOBuAJaOWAGb0HPoO8HoPAAAkiQgAukm3owebckwr\n' +
        'xAR42r/+CBx1uoqM2ZeEAUeYtBF7sdLEsdxFrxl8wHKAbglZwtgWcfG95v2R\n' +
        'zLcBco3v9p0IuS6DZduIfhngZ49gpYwqFGyiCOvo+k14tuMbrbOZTTKp0uc6\n' +
        'icpTyP8/1U0nZrQmmSXyfh6Hgmx1OnW3zTM7oUN1ZVvj3V6rOl+ktUPjAaYo\n' +
        'CWJjth92xhDWEPZnC/4Gz2eRoTVtmx8u+/2vNPffQVgzzHznUxB+G5XeZmPk\n' +
        'z8oxxSxII8PNiAs5LizqPjyq2gEv25GlCsMXTYz60n/t/4G7Yc94yu8xD8u3\n' +
        'BpWluHC2eW0pYFcDfiNLfv0uJCrUcM7ATQRkq+dvAQgA7v7Zz4CZdPsd4jvB\n' +
        'uDwjop/Gvoz+rbvAdS3Xrsi+OTyrWAqidnXChhwExlUNelZ9v52lGxe1twwr\n' +
        'vxeQ4M0pv4oqSlZxhkqBCyj+E7ECR2WXG7ccLlzYOz3b5BXT+fEkmVsbVTjA\n' +
        'Kttjosm7FtY4igY2Hu4UlZZW8M1tYL1R/UegFeMYGY7aO7dcKeiP0NsDwm3c\n' +
        '0SiU6/JlOXAIi/ZSKDJ4b5BPK6GFj5pNWr92/V7LejlZfoHAVDbb91tiPGdP\n' +
        'y3+r9T3IYsgUDLgOpPQn6o82Nctm6CnIZqAN12nJ1DEJP2JyLDedg9b5H+aa\n' +
        'FDZFc7yQ3In/QPtjHImydLt9NwARAQABwsB2BBgBCAAqBYJkq+dvCZBm9Bz6\n' +
        'DvB6DwKbDBYhBPkdSvwnOBuAJaOWAGb0HPoO8HoPAABRUQf+KoF4UXuseLBO\n' +
        'd0PD0+hEcnsYbaPWmPZtJPWusxPl6kt421luymPiThDXwaMVzRrmxkz0dNZ3\n' +
        'bUFYtS24t2BhlXZ6cGFNRjXrA9OV0kLg/kNm1vboQ1GL8qRV9CIjPVEpksQp\n' +
        'tOiYN+X+/2XdPJkaQpITHIFV067qWQSAKIonvOI8OJYOovGRQTInz0VE71Yn\n' +
        'SeiOilKBK+p2RN38jGr0PGWt740KJ6560FzfUwTAQzz9vrkYa+vEhWe+bzOd\n' +
        'YBpxj/BRTGR19DrKlGcFPdTYz5ADxCjBuCxXgoRCbBiWwh+iIstk5qkT8uHK\n' +
        'NQjzDvo3RO1cROQp0zsikladmzGZHQ==\n' +
        '=q/e/\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isSpeaker: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA10lEQVR4AcXBsWnFMBSG0c8/brOD9kgfogHUGQIuAppInSsVAQ2gdbSD64fTXl4hMI/HPWf5fXxf3DDaxkxIlTuEM+FMOFt5MtqG1XvBipGpsp9YMWaskCqWcCacCWfL4+fzwogx8069FyzhTDgTzpavv3oxEVLlFaNtzAhnwplwtvIkpIpV9hMrxsxM7wUrHxVrtA1LOBPOhLM1pIo12oaVj4rV98JMPj6wRtuwQqpYwplwJpyt3BRjZiZQuUM4E86Es7XsJ1aMTIVUeUXZTyzhTDgTzv4BnGY033BWusUAAAAASUVORK5CYII='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0xaC6C69c657cF6022fa787B14BDdaA22936B56D65',
      publicKey: '',
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2UlEQVR4AcXBQWoEIRBA0Z+ikOwNDHirbARPKDiLvkzOIATaC4iQbGt6ITSzqPc+np8/fxhpVazzcfCOr99vrK4FS3AmOBOcKRddCy9GwQoxszNHw+rKluBMcCY407QqO10L1hyNO9Kq7AjOBGeCMz0fB9YcjZ20KjtdC1bXghVixhKcCc4EZzpH446uhXfM0bAEZ4IzwZmGmLHmaOyEmNmZo7ETYsYSnAnOBGfKRVoVq2vBmqNxR1oV6+SV4ExwJjhTLroWdkLM7MzRsLoWrMCBJTgTnAnO/gGd1jrTKk/8EAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xEf532414907E8c631307c0d501cDe6D1694bAF5e',
      publicKey: '',
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA00lEQVR4AcXBobHDMBBF0ZsdjftIDeGuIkzIaGsQC1MNQkZirsLcnaQCk3yqBOzMH4N3zu11f38I+GPiinacRAwxQ8wQS/zo1flSGqNenUgujVGvziiXxsgQM8QMscSPXBqjXp1RLo1Ir84ol0bEEDPEDLHkj4lI51uvzn/4YyJiiBlihlhqx0lkZ2U0Pxci+7YyasdJxBAzxAyx1KsT8W3lil6diCFmiBlit9f9/SHQq3NFLo2IIWaIGWKpVyeybyuj+bkQ2beV0VwXIoaYIWaI/QH8GTSs76EUEQAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0x2F5f27B523C8888eA79b7FA80a9CbA6b6980784c',
      publicKey: null,
      isSpeaker: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA0klEQVR4AcXBsW3DQAxA0W9CExjIDhogfboDCw9gICvcHmldcIAMoYLgJJ5CKzgto4KA4ILvXT5+Pl8kwydZqJHt60bl+ryRDZ9koUYmNBOaCc0u31+/L04INSrDJ2cIzYRmQrMl1Dhj+KQSapwhNBOaCc0WDvZ1o+ROZV83KtfnjUxoJjQTmi0c3B/OO+4PpxLKP0IzoZnQbBk+yUKNyvBJJdSoDJ9kQjOhmdBsCTWy4ZNKqFEZPqmEGpnQTGgmNFs4CDWy4ZN3hBoVoZnQTGj2BxvbMvuaMCXUAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJkq+dvCZBm9Bz6DvB6DxYhBPkdSvwnOBuAJaOWAGb0HPoO\n' +
    '8HoPAAD5ywf/cvaGM0DzcB22Q2FMzUZG4/ZmkN4OknvSj0d4hB/sPUIb9176\n' +
    'z+niFMjWZNFpIj8s36f16oMEZZ+Eleu9t6sECBxRDvO8pEwyByCXSmz8e/SH\n' +
    'Y659cvg5/A3bSe0FqR0VTI1o+Uz2BpnXG/P38C6D46btaIaJcr4cIh88wQ9J\n' +
    'lr05hOE7w/7Uo5OwyXala0NfB+8S4LIfpC2OlPOhyHQEJd2+WoFKb/6dO28D\n' +
    'TLuvgYJXJfc4R3ElcgFfm1N9ylG0Pt1F3c0C/k9bNokR2PVXgX2XSTQsx1rD\n' +
    'MCY/ePr93INyNZuTPcPlK87X6OTa2/gEW161vup2Xn2Did9HtL76Qw==\n' +
    '=EkOP\n' +
    '-----END PGP SIGNATURE-----\n' +
    ':null',
  spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  spaceName: 'intellectual_green_bat',
  isPublic: true,
  spaceDescription: 'sad_purple_pinniped',
  spaceCreator: 'eip155:0xd1ab5Af3Be78bB1492099CE568761F0e706352a0',
  spaceId: 'spaces:9dab226c7920fe06154d76f78dfe1187bdc4fda712cdd9a8b37cc6a99741a63b',
  scheduleAt: '2023-07-15T14:48:00.000Z',
  scheduleEnd: '2023-07-15T15:48:00.000Z',
  status: 'ENDED'
}
```

</details>

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

<details>
  <summary><b>Expected response (approve space request for a spaceId)</b></summary>

```typescript
// PushAPI_space_approve | Response - 204 OK
```

</details>

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

<details>
  <summary><b>Expected response (add Listeners to space)</b></summary>

```typescript
// PushAPI_space_add_listeners | Response - 200 OK
{
	members: [{
		wallet: 'eip155:0x4Be8cFD08B330853A530DEBB72a2DAf4d4F3D2Ba',
		publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
			'\n' +
			'xsBNBGSs51IBCAC+y8oXbU2YvfI7Z4xnSRfcPecRR+nO/XVLDbt30mbn1NU8\n' +
			'wHSXcuHLJTuU9yJy1t9AMB2SY8n/YWMFbeNICF0OQVINkvFS+8Ec/F42IIlb\n' +
			'StUY8rLS9pxTQoI3k1LnQKNL1krGiEuDl2ZT3l304aPGkF1sowu5w6xnzl/o\n' +
			'nb6cgc48jVqIgqoVUCnEoxc3GKdSORm35nl0RBDasFdFPJctnpg2n7hLofU1\n' +
			'RGOIzf/cITY7AE3nta0cqaFgNsO4rO0fXRwgDBAu66CtBG4Px2X8hT7IYMum\n' +
			'XJtCis3KvrmQAOhWrbAwmWjHbkSDSYigd39rmlht21GKf0/kfoILBgRfABEB\n' +
			'AAHNAMLAigQQAQgAPgWCZKznUgQLCQcICZDTsTetOyJa2gMVCAoEFgACAQIZ\n' +
			'AQKbAwIeARYhBHGBWhlF6JChmgQO7tOxN607IlraAADq/Af/XWeAagX5+JCX\n' +
			'ChzadMaUtI6m2F7nT8sJcJep/a0Ldyz6kPmP9k6kmWO+QXJwl4FrP3e7HPer\n' +
			'SjTeIWm0FJ2a+pRtF+lWk7xjIWJuZxbx79nOk98arde75fT+bebne1V0raUM\n' +
			'gXPQIc60++okAPif6vJVLAaSMNbCkv8+Lsy0mJqsjY3b9iMVKWHKb8XVvTuN\n' +
			'pobxVV4dLq53lrdNDIiwAWTlbxyuKLSEF4f+hIPJX3PAhquORinOubclUwTM\n' +
			'+kEmE6VI3pW4VL1VRi10cDI6ruEVwqOwQyYcp9gSDKXFR6ZXz7t0hjUUhl+3\n' +
			'z6T7yqAjExW1O4tETVSbt3jg6DjaAM7ATQRkrOdSAQgArRRrLZees3xCYyBO\n' +
			'9WDzy7XCM2FxmaIJs/ibWwTtD1ZVoc9NKeOx07FYwGiYjigY6FxxJHdr20IQ\n' +
			'3xieIyBLZM2XAIXrsxq4M9GLG8R6nhd35BenjcvSGiZH1Rq0aXtFt9Fd7gc6\n' +
			'E8XpMcHPH8KEnf66sPz18vrVCdstVU4Qj2ZjH25ilfeGdMj2HHfDxVN8sRhl\n' +
			'AXAcwblQ+IVXGjuKw19T4zN874bcAaOmXfzxu3+2PtxVSR5uV03x1ln3ji+b\n' +
			'+GF8atJMMHCqE0FC/dEciS+BWSQtv0D93XWjzExJeyhd7Z+I3BG8JPuJT5Yj\n' +
			'4PxktEgwUxQc83JFFwED9knzyQARAQABwsB2BBgBCAAqBYJkrOdSCZDTsTet\n' +
			'OyJa2gKbDBYhBHGBWhlF6JChmgQO7tOxN607IlraAABLdggAhe1KLjtHTsUI\n' +
			'SR0K25EJ+9gXC7wmebve9wNZL22/Ud9hnyS77/VUmMNBgdPyhm/9ITMhVtTt\n' +
			'rRNo1AzsVKDn3/dW1kc+nSribOufxzMoBM7Bm918Zt/0/7wCegz0bp3EAoQ8\n' +
			'KEa2KPY9lSh2WtEDoA87D8JB1xwIfcR98vg5/AZ7VdtE88foSqXAm+6F85hz\n' +
			'nAASNBO9CCDvUofR28b4exT/aWX0qZxLAukgH7fnYC3KPVv+9ug6mdyJPsOZ\n' +
			'LFjF327UKLrBuQ6VRlfKF+XULJbtNPxckgwO1V/oxycq/M67acGoXgc2MgP/\n' +
			'2qOkbiQC0ZxcA+Ze5TNNhuGWKv6d9g==\n' +
			'=S9Ba\n' +
			'-----END PGP PUBLIC KEY BLOCK-----\n',
		isSpeaker: true,
		image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBQU1FUQxF0f2bZ6gaIOkAC4yxUCRQHyRoqIo6wcJnesLgEgJJ17p9vDzeEe9vd046nZOo4eT59YYylhnLjGW3p8+HOwedzl9EDSfGMmOZsezim05HRQ2q0zmJGlSno6IGZSwzlhnLrk5HRQ2q01FRw0mno6IG1ekoY5mxzFh2RQ2q01FRw29EDarTUVGDMpYZy4xlV6ejogbV6aio4aTTUVGD6nSUscxYZiy7+KbT+U+dzomxzFhmLLv4QdSgnl9vHNWgOp0TY5mxzFj2BfKPPQUA5ipXAAAAAElFTkSuQmCC'
	}],
	pendingMembers: [{
			wallet: 'eip155:0x4d2eFB18383a48aCe19a198ae5228BB4bf854cec',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA9UlEQVR4AcXBoZHDMBCG0S87ZqEmooaiLmJJsNtwIyFuwzhERZgKmoqkhxz9HaCbmwP73u159w8iN0fVVFC5OT01FVRujqqpoIxgRjAj2JCbo6b1QE3LiDrpeywjF+vBRXOUEcwIZgQb+MW5zaiaCl3NUdN60GMEM4IZwYaaChfNUdN6cNGcnmk9UOc2o2oqKCOYEcwINuTmqJoKF835i3ObUTUVVG6OMoIZwYxgt+fdP4jHMqJe+xuVm9NTU0E9lhH12t8oI5gRzAg28OXcZlTeuKip0JObo06+7AVlBDOCGcFuz7t/6MjN+Y+aCj1GMCOYEewHE5pCbf3G8WQAAAAASUVORK5CYII='
		},
		{
			wallet: 'eip155:0x8E50Bfb57f803814c242c5a25890f5F0c13304fF',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA20lEQVR4AcXBsWkDQRCG0W+Gy53pkgVVsiXYFVx2rsANiCtEmQoxbCHmYBNd6gLW6aBgjDDmf89eXr8GiW6VqIxGplslKqORccQcMUdsWued6Ho/k+lW+Yt13okcMUfMEZt4sM470YUb0XYsZC6nG9HKTsYRc8Qcsel6P5PpVnnGdixEZTQyjpgj5ohNPOhWyZTRyHSrRN0qURmNyBFzxBwx+34rg0QZjahbJVNGI+pWyThijpgjNvGLbpWojEamW+UZjpgj5ojZx/vnINiOhf90Od2IHDFHzBH7AWIQNGL6hyehAAAAAElFTkSuQmCC'
		},
		{
			wallet: 'eip155:0xaA6E4434D881D2bDEea891AE127313AE5515a06B',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyklEQVR4AcXBsZGDMABE0c8OqQPGZShzCdCCVNZVIhVAYrpQ6g48lMClkgMlBPve9HjtF0bCTJgJszmXykiKgTtyqYwIM2EmzOYUAyO5VO5IMTAizISZMJu/70rrOOmkGLgjl0prXegIM2EmzKbHa79o5FIZSTEwkktlJMVAS5gJM2E282Nd6Dy3QCuXykiKgdb3XRkRZsJMmE375++isS50jpNOioGRXCqtdaFznHSEmTATZjM/nluglUvljucWaOVSaQkzYSbM/gGGCDCC/3c1nwAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0xf6106dd699B6e40f1E822c38DDA459F533470b11',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAwUlEQVR4AcXBsU2DMRSF0S9XHoIFIipmIEW2sPQ6pmGEdJa8BYXXsOgYxKF9afzrr+45l++39uSEUGenrcoZwkyYCbPCgVAna6uyE+pkbVV2hJkwE2Yl1MnaqmT364Ps5/eLnfv1QRZzkIU6mTATZsKscCDm4IXYijk4Q5gJM2FWONDeb7yYbLX3G1nMwY4wE2bCrHAg5iALdbYmpwgzYSbMLh+ff0+MhJkwE2Yl5iALdXbaquyEOjttVTJhJsyE2T84uix63kKmNgAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0xAF3d4989652a6ED5554b6191c555525977424Cc9',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsW3DMBCG0c8/tEMmUClkBDVaQAWHIKAZWHAGAxyChZDejbOCkcrDOO3ZxQlGENx7p4/t64Gj58JfpFbxiGAimAg2cOB6uWHNy4TnernxDhFMBBPBBl70XHg2YaVW8fRcsOalYKVWsUQwEUwEGziQWsXqueBJrWL1XPCIYCKYCHb6/vl8YKRW+U89FywRTAQTwQZebOOK53zf8Wzjim/CEsFEMBFs4MD5vmP1XPCktmNt44pHBBPBRLAhtYrVc+HZipXajmcbV6x5mbBSq1gimAgmgv0CTksv6eJNDqkAAAAASUVORK5CYII='
		},
		{
			wallet: 'eip155:0x2ccBeEf6e30dF46D0A7Ee79Bc66FBF3beA7EeA5A',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA00lEQVR4AcXBIW6AMBiG4XdfmnAYboLlCE3NFBLX4JB40hMsWM4x08OgNvsXUbMs//N8fH59/2DksfCfthqxhDPhTDgLvGw1Yq3nhLWnm571nLD2dNMjnAlnwlnIY8HaasQajplGpWs4ZhqVRh4LlnAmnAln4VkuGinSs54TXcdMz7NcWMKZcCachT3dWHksWM9yYQ3HTM+zXFj5oLGlG0s4E86Es8DLViONFLEyhZ493TQqXcKZcCacCWfCmXAmnAVe8lj4izwWerYasYQz4Uw4+wXktDHpzVVJlwAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0x65585D8D2475194A26C0B187e6bED494E5D68d5F',
			publicKey: null,
			isSpeaker: false,
			image: null
		},
		{
			wallet: 'eip155:0xE99F29C1b2A658a478E7766D5A2bB28322326C45',
			publicKey: null,
			isSpeaker: false,
			image: null
		},
		{
			wallet: 'eip155:0xa145b34443e28C8f718Cd0691Dc41A81E0d0A857',
			publicKey: null,
			isSpeaker: false,
			image: null
		}
	],
	contractAddressERC20: null,
	numberOfERC20: 0,
	contractAddressNFT: null,
	numberOfNFTTokens: 0,
	verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
		'\n' +
		'wsBzBAEBCAAnBYJkrOdUCZDTsTetOyJa2hYhBHGBWhlF6JChmgQO7tOxN607\n' +
		'IlraAAAqUQf9FvAtNouG7+2YSyyx7eiHRJZroDPFohH/F2xyc+oJkgh40p2y\n' +
		'hyKw+DSp0FA+IiT95/y8RbGDUrNFz+/kdMfZWCEYFim3Cy+c5k1/YNc8qxx6\n' +
		'VLwef+2YZepC1pSS9K0zbu04uVPWrNmDa5lHXqzTx/mOxWlxLD0NfpI60csE\n' +
		'iQx57duy2gMeW9MwOKSFjOSnWHKy7AySm/vBwZ9Rj4gnOhsvwbAfLprQQf4G\n' +
		'cUaxG/HOb0c/8Ugews0Z1uDJFmGKjT5R5CR63vPo5qDGQwWkm+LYpshCIV+K\n' +
		'ofLepDqQRuEFa7VyUlDOvMcF15LtlvAhwhkIVHvTGjXZC91e8/IUsQ==\n' +
		'=UpR2\n' +
		'-----END PGP SIGNATURE-----\n' +
		':null',
	spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
	spaceName: 'weird_moccasin_alligator',
	isPublic: true,
	spaceDescription: 'equivalent_blue_armadillo',
	spaceCreator: 'eip155:0x4Be8cFD08B330853A530DEBB72a2DAf4d4F3D2Ba',
	spaceId: 'spaces:d37c4e303a2ff194e546d3af94353ec829324a578ebffbeadebd1ba91ab88548',
	scheduleAt: '2023-07-15T14:48:00.000Z',
	scheduleEnd: '2023-07-15T15:48:00.000Z',
	status: 'PENDING'
}
```

</details>

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

<details>
  <summary><b>Expected response (remove Listeners from space)</b></summary>

```typescript
// PushAPI_space_from_speakers | Response - 200 OK
{
	members: [{
		wallet: 'eip155:0x5908D89B1390ec5833001b86302B868A808D506D',
		publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
			'\n' +
			'xsBNBGSs6YABCADC4ldJKGpZ0Z+JJwA1t/1JWp5+dnR98nr7RHPX8eEGxIhL\n' +
			'gtx5TZmek2BcGzNcg66+GEyC4np9USaCZ4/YC9ZMLw8BQKzhOcd3ZILyGtGV\n' +
			'BijBNwjPIbQcy5/cXVtfKCvf303BDYddPYuJ1xFAh7kpvhcR4a72CSpeyEjM\n' +
			'UndteAVTIxqwdpnXIdqpwu6HrSJ089GpHV+XeaDo4Uhg+iHJsCRJy2VJ5m61\n' +
			'CwGx55f3ror6rAXQd+hEx+keLxYINNJLLvfvE9IGsIbKRFZx+emjXQZusbJp\n' +
			'zXYhJnEeHPLVDjWhzo8Q3/4gvOz8m6a+A9sl49sqodLdxVlXQ7d4CuylABEB\n' +
			'AAHNAMLAigQQAQgAPgWCZKzpgAQLCQcICZCaDezdj8j4SwMVCAoEFgACAQIZ\n' +
			'AQKbAwIeARYhBGZpOFBNtTj1Oqt695oN7N2PyPhLAACCLgf/dB412nDRcOxR\n' +
			'dNSj2AYknJ+NKeX38KuksyR6wypnaJWpapmIeZCfFjeoBjuBCPd6unvN/IlZ\n' +
			'zPwl66lO5GKJxDaDd1/infxM/dbtFQSESLXlweRLQ/v1+plsntrBUyvbY4uH\n' +
			'Mh9PImYsLY+zo8P5mpBV5AGAMA6R9qmu3axH/MnKVdB0Ky6C/jP+7lPs/QVT\n' +
			'qsISyyI1E9E6Oivzxmao1axfXLdEvICHb6uD0R4p5SUVqHJX41OwM8BFevhK\n' +
			'07Hi+c7NhUWp0sxXEOs6dneJZwerCD3EahutpP1Oyt5T8MZitysn2yJ+s5ks\n' +
			'SZza+x8OmCMcMZfZnIsJNnIUvPboP87ATQRkrOmAAQgAteDgsJJ0ftPD+P15\n' +
			'rKgkLuSCD2iwQgm2k8/ZDaXJBsdm4sJYTt2y0ckx7MRpXgLuIyidOGctqVL6\n' +
			'/Rl2Hfl30JQPok5cYmYLENVuFz94MEvgDOo8jacyfPdLGPMWZMLRojyM/Yvs\n' +
			'nhDZ8if3zEstP4h3HcpdT+PWSmsJWjrq57la4vKbfILtKfTBaf8sibm5UuZA\n' +
			'5Y/SIPxfVC+ybCPAjo4tpDYP901V+wxXDJ8BlZ4AaVvk20MYMzuAjBna+iwD\n' +
			'f0j4CccEabd2EVtAQQcMCg2yTjOT22Dt0jfpDuohDNaXDhX2ZQlJIdlSLCEI\n' +
			'a3c7g+uU9bnNqt7LHPgMzLYKnwARAQABwsB2BBgBCAAqBYJkrOmACZCaDezd\n' +
			'j8j4SwKbDBYhBGZpOFBNtTj1Oqt695oN7N2PyPhLAAD2vQgAu9+sd4AT5b6c\n' +
			'mWOaQBXz2XVfJXYQFNlBdOF23reycF9r7vDAKSRpeyMSyOfRAi0qdLynQ1dN\n' +
			'MXV/gfO0G9dzFu513P/Y1sZxQi0uLRKL9hMcgEQ8FLo8/PGfVcoLfQASryGj\n' +
			'Z8ybCFqiXocGpt2VkkK4wwgv+ZwZ8M1ubz0Boby6A1/kTYs/6ll+QekpB4ao\n' +
			'kJKw3DWvVNR/xODFfMQcClvzAtqwfxhTZXBMbZ4vAG5m1ExGmA15cGXrAfwV\n' +
			'nR2vOhPYDeZGbBKktM3xfDts75N2NF/TBpvazV2DTKpkLqvVitFHWvSMMpVd\n' +
			'dwk9tEOmBlj2AoYATvQ9kKHRTD27Wg==\n' +
			'=IXzf\n' +
			'-----END PGP PUBLIC KEY BLOCK-----\n',
		isSpeaker: true,
		image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR4AcXBoXHEMBRF0Zs3oqpHNYgJecZdGKYMd5GZRWaCwaohZbiAhP5d8HeC3jkfnz/fvwSTRua+DjJ1nGQ6i0iYCTNhVnjRWUSTRlTHyX90FhlhJsyEWeHFpJG5r4NMHSfRpBF1FpEwE2bCrPDGfR1E29jJPK6DqI6TjDATZsKsTBqZOk6iSa6ORmbSiISZMBNmpbOIHtcXUR0nUWeRmTSi+zqItrETCTNhJswKL7ax82wRTRqZzuLJ2MkIM2EmzApvTBpRZ5GZNKLOIiPMhJkw+wPV2i2sD43hKwAAAABJRU5ErkJggg=='
	}],
	pendingMembers: [{
			wallet: 'eip155:0xC1469cB7b59d16dC887D4C11faB3E3C0abBeA12C',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA30lEQVR4AcXBsWnFMBSG0e9dBAGDPUs6LeAFNIEb1x5GtRtDei3gBQzZIFtYYEj10t73CkFw8Z/z+Pj+euJs14iXlsodJfd4U7fjGWKGmCEWzjnilUzTsB60nHOk5ZwjniFmiBligTdTt+MlIt52jbRVvKnb8RIRzxAzxAyxx+/nzxMhQ8wQM8RCyT0taancUXJPiyFmiBligTdTt+NNKy/OOdIyrAct2zXiGWKGmCEW0lJ5kUe8tFT+45wjXsk9XloqniFmiBliYVgPvHOOeCX33JGWijesB54hZogZYn8uFTTKoy9pgwAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0xccF7a3131E0E73F83Bc457C27494411a57f23248',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA9ElEQVR4AcXBIWoEMRSA4X8fw6qayBW9zULVEBFygLqcqMwdhlBCbKjqXSLjY7b2UZEVpbzvu3x8vT5QShhoqUa0Yz9ZSTWiHfuJ5rNDE4wJxgRjl8/v9wdKn43/dLve0QRjgjHB2NZnQ7td72h9NrQSBis+O7Tb9Y7WZ0MTjAnGBGMbv/TZ0EoYaD47VkoYaD43VgRjgjHB2MYTqUa0Yz9ZSTWi9dlYEYwJxgRjlzf38kDx2aGVMNBSjawc+4nms0MrYaAJxgRjgrGNJ1KNaH02VlKNaH02VgRjgjHB2OazQythoKXKn5Qw0Hx2aIIxwZhg7Ae2cUcV4Bl8pAAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0x052aD82D3a7b4DAb5b9BcFED771D28703a6faadf',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAy0lEQVR4AcXBoXFDQQxF0RtlkZsQNjHICKYYV7DFCAW6II2BycfbhklCNR/sTNA75+Pn+/MXIUPMEDPEBifhSVdr0oUnO7UmXXjS1Zp0hpghZogZYoaYIWaIDU5qTbrwpHtfnuyEJ12tyY4hZogZYiM86WpNdl7Hg53wL3bCk84QM8QMscFJeNLVmnS3652dOiZdeLJjiBlihtioNenCky486eqY7IQnO7UmnSFmiBliIzzpak262/XOf7wvT7rX8aALTzpDzBAzxP4AMOQyARcWaToAAAAASUVORK5CYII='
		},
		{
			wallet: 'eip155:0x956f73E5a3BF0D19299BF74bD6dc819D7f775eC7',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA20lEQVR4AcXBsYnDMBiG4dc/nsHgHeJWS1x7G6QzqNQUKlUHLn12ONdqNYTBS/ja/xqBCeF7nmFbbydODoVPSjXiGWKGmCE2Pu8vvPT45pOe9xeeIWaIGWLj0Xa8HAo9qUZ6cih0tR3PEDPEDLFhW28nTg4FL9XIO3IoeKlGPEPMEDPEhq+f3xNnWmZ6jrbTMy0zPUfb8QwxQ8wQG6dlxjvajpdq5JLKPzkUvGmZ8QwxQ8wQG4+246Ua8XIovCPViJcpeIaYIWaIDdt6O7kgh0JPqpErDDFDzBD7AzabOPmHFg/aAAAAAElFTkSuQmCC'
		},
		{
			wallet: 'eip155:0x19da526eD1a57E07D48aa25aDa6cbA7E41FF3129',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyUlEQVR4AcXBsY1CQQxF0cvTFEHuNn4jxB6JJggpw5Mh/UZogmByumBTi2DQahf5nMN2vr1IjvtG1ufgL8Kc7Hm6k4liopgo1i7XB1nsG990uT7IRDFRTBRrfBDmZH0OVsKc3xDFRDFRrPFBn4MszFnpc5CFOSuimCgmih228+1Fctw3vul5upOJYqKYKNaO+0bW5yALc7I+BythTtbnIAtzMlFMFBPFGm/CnP8U5qyIYqKYKNZ40+dgJcxZ6XOwEuZkopgoJor9AIckL2mEiBQrAAAAAElFTkSuQmCC'
		},
		{
			wallet: 'eip155:0x77059B40Ec974883b98a23eef519b4076D1Cf9F1',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsY0CMRRF0cuTQ6rYaQFiAvdBYMkFkFEAwWYTryxZ2kIcEE8N1MKmH4JJRuw7Z/d7uD0JRu1EuRW2GLUT5VaIhJkwE2a788/XEyNhJsyEWcqtEI3a+aTcCpEwE2bCLI3aia77E9EyT2xxvDyIvmsnEmbCTJgl3izzRDRqJ8qtsGbUzou58KLeiYSZMBNmKbfCf8qtEAkzYSbM0qidTxq1s0aYCTNhlq77E9EyT2yRW2HN8fIgEmbCTJj9AUPBKWCCQlIAAAAAAElFTkSuQmCC'
		}
	],
	contractAddressERC20: null,
	numberOfERC20: 0,
	contractAddressNFT: null,
	numberOfNFTTokens: 0,
	verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
		'\n' +
		'wsBzBAEBCAAnBYJkrOmCCZCaDezdj8j4SxYhBGZpOFBNtTj1Oqt695oN7N2P\n' +
		'yPhLAAD+iwf/dvaRCTwXKGH6iUe49NpyTHMaD6ZwaLerk+K4Ojehbdoo0mDf\n' +
		'aOu/MR8wfqk49h2436rcMmyeM5avcMgmtGUmIdy/6hCZ6zxR/3E5t/vq5UfO\n' +
		'3YFO1VLghR5cTYqR9bMLFkvvCB4P29rnaok2QVKTBZLfyAM4wu1h2DDBESoz\n' +
		'SS+ZtQLPz6/y7gOQobO0zbwBPmy8MpVVu1wxht+sneOMvZX+5al679nQbwNL\n' +
		'oCcU3UKrlqMhuFgMTCKx99VLcc4JbhBf2M+IHf78NtQ9mcQC/X+gxRfp6f+p\n' +
		'2RePQzkmUH5vqXjzcUsNBWJPOyjl09/IZWWwaeiUjsPazjxqDtYNHg==\n' +
		'=H4X4\n' +
		'-----END PGP SIGNATURE-----\n' +
		':null',
	spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
	spaceName: 'sheer_ivory_ox',
	isPublic: true,
	spaceDescription: 'specific_green_alpaca',
	spaceCreator: 'eip155:0x5908D89B1390ec5833001b86302B868A808D506D',
	spaceId: 'spaces:bc96011f182e2c86ad68aaf4c95c4a916c808088370cb0ba294f9168e2ff6328',
	scheduleAt: '2023-07-15T14:48:00.000Z',
	scheduleEnd: '2023-07-15T15:48:00.000Z',
	status: 'PENDING'
}
```

</details>

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

<details>
  <summary><b>Expected response (add Speakers to space)</b></summary>

```typescript
// PushAPI_space_add_speakers | Response - 200 OK
{
	members: [{
		wallet: 'eip155:0x4Be8cFD08B330853A530DEBB72a2DAf4d4F3D2Ba',
		publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
			'\n' +
			'xsBNBGSs51IBCAC+y8oXbU2YvfI7Z4xnSRfcPecRR+nO/XVLDbt30mbn1NU8\n' +
			'wHSXcuHLJTuU9yJy1t9AMB2SY8n/YWMFbeNICF0OQVINkvFS+8Ec/F42IIlb\n' +
			'StUY8rLS9pxTQoI3k1LnQKNL1krGiEuDl2ZT3l304aPGkF1sowu5w6xnzl/o\n' +
			'nb6cgc48jVqIgqoVUCnEoxc3GKdSORm35nl0RBDasFdFPJctnpg2n7hLofU1\n' +
			'RGOIzf/cITY7AE3nta0cqaFgNsO4rO0fXRwgDBAu66CtBG4Px2X8hT7IYMum\n' +
			'XJtCis3KvrmQAOhWrbAwmWjHbkSDSYigd39rmlht21GKf0/kfoILBgRfABEB\n' +
			'AAHNAMLAigQQAQgAPgWCZKznUgQLCQcICZDTsTetOyJa2gMVCAoEFgACAQIZ\n' +
			'AQKbAwIeARYhBHGBWhlF6JChmgQO7tOxN607IlraAADq/Af/XWeAagX5+JCX\n' +
			'ChzadMaUtI6m2F7nT8sJcJep/a0Ldyz6kPmP9k6kmWO+QXJwl4FrP3e7HPer\n' +
			'SjTeIWm0FJ2a+pRtF+lWk7xjIWJuZxbx79nOk98arde75fT+bebne1V0raUM\n' +
			'gXPQIc60++okAPif6vJVLAaSMNbCkv8+Lsy0mJqsjY3b9iMVKWHKb8XVvTuN\n' +
			'pobxVV4dLq53lrdNDIiwAWTlbxyuKLSEF4f+hIPJX3PAhquORinOubclUwTM\n' +
			'+kEmE6VI3pW4VL1VRi10cDI6ruEVwqOwQyYcp9gSDKXFR6ZXz7t0hjUUhl+3\n' +
			'z6T7yqAjExW1O4tETVSbt3jg6DjaAM7ATQRkrOdSAQgArRRrLZees3xCYyBO\n' +
			'9WDzy7XCM2FxmaIJs/ibWwTtD1ZVoc9NKeOx07FYwGiYjigY6FxxJHdr20IQ\n' +
			'3xieIyBLZM2XAIXrsxq4M9GLG8R6nhd35BenjcvSGiZH1Rq0aXtFt9Fd7gc6\n' +
			'E8XpMcHPH8KEnf66sPz18vrVCdstVU4Qj2ZjH25ilfeGdMj2HHfDxVN8sRhl\n' +
			'AXAcwblQ+IVXGjuKw19T4zN874bcAaOmXfzxu3+2PtxVSR5uV03x1ln3ji+b\n' +
			'+GF8atJMMHCqE0FC/dEciS+BWSQtv0D93XWjzExJeyhd7Z+I3BG8JPuJT5Yj\n' +
			'4PxktEgwUxQc83JFFwED9knzyQARAQABwsB2BBgBCAAqBYJkrOdSCZDTsTet\n' +
			'OyJa2gKbDBYhBHGBWhlF6JChmgQO7tOxN607IlraAABLdggAhe1KLjtHTsUI\n' +
			'SR0K25EJ+9gXC7wmebve9wNZL22/Ud9hnyS77/VUmMNBgdPyhm/9ITMhVtTt\n' +
			'rRNo1AzsVKDn3/dW1kc+nSribOufxzMoBM7Bm918Zt/0/7wCegz0bp3EAoQ8\n' +
			'KEa2KPY9lSh2WtEDoA87D8JB1xwIfcR98vg5/AZ7VdtE88foSqXAm+6F85hz\n' +
			'nAASNBO9CCDvUofR28b4exT/aWX0qZxLAukgH7fnYC3KPVv+9ug6mdyJPsOZ\n' +
			'LFjF327UKLrBuQ6VRlfKF+XULJbtNPxckgwO1V/oxycq/M67acGoXgc2MgP/\n' +
			'2qOkbiQC0ZxcA+Ze5TNNhuGWKv6d9g==\n' +
			'=S9Ba\n' +
			'-----END PGP PUBLIC KEY BLOCK-----\n',
		isSpeaker: true,
		image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBQU1FUQxF0f2bZ6gaIOkAC4yxUCRQHyRoqIo6wcJnesLgEgJJ17p9vDzeEe9vd046nZOo4eT59YYylhnLjGW3p8+HOwedzl9EDSfGMmOZsezim05HRQ2q0zmJGlSno6IGZSwzlhnLrk5HRQ2q01FRw0mno6IG1ekoY5mxzFh2RQ2q01FRw29EDarTUVGDMpYZy4xlV6ejogbV6aio4aTTUVGD6nSUscxYZiy7+KbT+U+dzomxzFhmLLv4QdSgnl9vHNWgOp0TY5mxzFj2BfKPPQUA5ipXAAAAAElFTkSuQmCC'
	}],
	pendingMembers: [{
			wallet: 'eip155:0x4d2eFB18383a48aCe19a198ae5228BB4bf854cec',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA9UlEQVR4AcXBoZHDMBCG0S87ZqEmooaiLmJJsNtwIyFuwzhERZgKmoqkhxz9HaCbmwP73u159w8iN0fVVFC5OT01FVRujqqpoIxgRjAj2JCbo6b1QE3LiDrpeywjF+vBRXOUEcwIZgQb+MW5zaiaCl3NUdN60GMEM4IZwYaaChfNUdN6cNGcnmk9UOc2o2oqKCOYEcwINuTmqJoKF835i3ObUTUVVG6OMoIZwYxgt+fdP4jHMqJe+xuVm9NTU0E9lhH12t8oI5gRzAg28OXcZlTeuKip0JObo06+7AVlBDOCGcFuz7t/6MjN+Y+aCj1GMCOYEewHE5pCbf3G8WQAAAAASUVORK5CYII='
		},
		{
			wallet: 'eip155:0x8E50Bfb57f803814c242c5a25890f5F0c13304fF',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA20lEQVR4AcXBsWkDQRCG0W+Gy53pkgVVsiXYFVx2rsANiCtEmQoxbCHmYBNd6gLW6aBgjDDmf89eXr8GiW6VqIxGplslKqORccQcMUdsWued6Ho/k+lW+Yt13okcMUfMEZt4sM470YUb0XYsZC6nG9HKTsYRc8Qcsel6P5PpVnnGdixEZTQyjpgj5ohNPOhWyZTRyHSrRN0qURmNyBFzxBwx+34rg0QZjahbJVNGI+pWyThijpgjNvGLbpWojEamW+UZjpgj5ojZx/vnINiOhf90Od2IHDFHzBH7AWIQNGL6hyehAAAAAElFTkSuQmCC'
		},
		{
			wallet: 'eip155:0xaA6E4434D881D2bDEea891AE127313AE5515a06B',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyklEQVR4AcXBsZGDMABE0c8OqQPGZShzCdCCVNZVIhVAYrpQ6g48lMClkgMlBPve9HjtF0bCTJgJszmXykiKgTtyqYwIM2EmzOYUAyO5VO5IMTAizISZMJu/70rrOOmkGLgjl0prXegIM2EmzKbHa79o5FIZSTEwkktlJMVAS5gJM2E282Nd6Dy3QCuXykiKgdb3XRkRZsJMmE375++isS50jpNOioGRXCqtdaFznHSEmTATZjM/nluglUvljucWaOVSaQkzYSbM/gGGCDCC/3c1nwAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0xf6106dd699B6e40f1E822c38DDA459F533470b11',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAwUlEQVR4AcXBsU2DMRSF0S9XHoIFIipmIEW2sPQ6pmGEdJa8BYXXsOgYxKF9afzrr+45l++39uSEUGenrcoZwkyYCbPCgVAna6uyE+pkbVV2hJkwE2Yl1MnaqmT364Ps5/eLnfv1QRZzkIU6mTATZsKscCDm4IXYijk4Q5gJM2FWONDeb7yYbLX3G1nMwY4wE2bCrHAg5iALdbYmpwgzYSbMLh+ff0+MhJkwE2Yl5iALdXbaquyEOjttVTJhJsyE2T84uix63kKmNgAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0xAF3d4989652a6ED5554b6191c555525977424Cc9',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsW3DMBCG0c8/tEMmUClkBDVaQAWHIKAZWHAGAxyChZDejbOCkcrDOO3ZxQlGENx7p4/t64Gj58JfpFbxiGAimAg2cOB6uWHNy4TnernxDhFMBBPBBl70XHg2YaVW8fRcsOalYKVWsUQwEUwEGziQWsXqueBJrWL1XPCIYCKYCHb6/vl8YKRW+U89FywRTAQTwQZebOOK53zf8Wzjim/CEsFEMBFs4MD5vmP1XPCktmNt44pHBBPBRLAhtYrVc+HZipXajmcbV6x5mbBSq1gimAgmgv0CTksv6eJNDqkAAAAASUVORK5CYII='
		},
		{
			wallet: 'eip155:0x2ccBeEf6e30dF46D0A7Ee79Bc66FBF3beA7EeA5A',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA00lEQVR4AcXBIW6AMBiG4XdfmnAYboLlCE3NFBLX4JB40hMsWM4x08OgNvsXUbMs//N8fH59/2DksfCfthqxhDPhTDgLvGw1Yq3nhLWnm571nLD2dNMjnAlnwlnIY8HaasQajplGpWs4ZhqVRh4LlnAmnAln4VkuGinSs54TXcdMz7NcWMKZcCachT3dWHksWM9yYQ3HTM+zXFj5oLGlG0s4E86Es8DLViONFLEyhZ493TQqXcKZcCacCWfCmXAmnAVe8lj4izwWerYasYQz4Uw4+wXktDHpzVVJlwAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0x65585D8D2475194A26C0B187e6bED494E5D68d5F',
			publicKey: null,
			isSpeaker: true,
			image: null
		},
		{
			wallet: 'eip155:0xE99F29C1b2A658a478E7766D5A2bB28322326C45',
			publicKey: null,
			isSpeaker: true,
			image: null
		},
		{
			wallet: 'eip155:0xa145b34443e28C8f718Cd0691Dc41A81E0d0A857',
			publicKey: null,
			isSpeaker: false,
			image: null
		}
	],
	contractAddressERC20: null,
	numberOfERC20: 0,
	contractAddressNFT: null,
	numberOfNFTTokens: 0,
	verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
		'\n' +
		'wsBzBAEBCAAnBYJkrOdUCZDTsTetOyJa2hYhBHGBWhlF6JChmgQO7tOxN607\n' +
		'IlraAAAqUQf9FvAtNouG7+2YSyyx7eiHRJZroDPFohH/F2xyc+oJkgh40p2y\n' +
		'hyKw+DSp0FA+IiT95/y8RbGDUrNFz+/kdMfZWCEYFim3Cy+c5k1/YNc8qxx6\n' +
		'VLwef+2YZepC1pSS9K0zbu04uVPWrNmDa5lHXqzTx/mOxWlxLD0NfpI60csE\n' +
		'iQx57duy2gMeW9MwOKSFjOSnWHKy7AySm/vBwZ9Rj4gnOhsvwbAfLprQQf4G\n' +
		'cUaxG/HOb0c/8Ugews0Z1uDJFmGKjT5R5CR63vPo5qDGQwWkm+LYpshCIV+K\n' +
		'ofLepDqQRuEFa7VyUlDOvMcF15LtlvAhwhkIVHvTGjXZC91e8/IUsQ==\n' +
		'=UpR2\n' +
		'-----END PGP SIGNATURE-----\n' +
		':null',
	spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
	spaceName: 'weird_moccasin_alligator',
	isPublic: true,
	spaceDescription: 'equivalent_blue_armadillo',
	spaceCreator: 'eip155:0x4Be8cFD08B330853A530DEBB72a2DAf4d4F3D2Ba',
	spaceId: 'spaces:d37c4e303a2ff194e546d3af94353ec829324a578ebffbeadebd1ba91ab88548',
	scheduleAt: '2023-07-15T14:48:00.000Z',
	scheduleEnd: '2023-07-15T15:48:00.000Z',
	status: 'PENDING'
}
```

</details>

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

<details>
  <summary><b>Expected response (remove Speakers to space)</b></summary>

```typescript
// PushAPI_space_remove_speakers | Response - 200 OK
{
	members: [{
		wallet: 'eip155:0x5908D89B1390ec5833001b86302B868A808D506D',
		publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
			'\n' +
			'xsBNBGSs6YABCADC4ldJKGpZ0Z+JJwA1t/1JWp5+dnR98nr7RHPX8eEGxIhL\n' +
			'gtx5TZmek2BcGzNcg66+GEyC4np9USaCZ4/YC9ZMLw8BQKzhOcd3ZILyGtGV\n' +
			'BijBNwjPIbQcy5/cXVtfKCvf303BDYddPYuJ1xFAh7kpvhcR4a72CSpeyEjM\n' +
			'UndteAVTIxqwdpnXIdqpwu6HrSJ089GpHV+XeaDo4Uhg+iHJsCRJy2VJ5m61\n' +
			'CwGx55f3ror6rAXQd+hEx+keLxYINNJLLvfvE9IGsIbKRFZx+emjXQZusbJp\n' +
			'zXYhJnEeHPLVDjWhzo8Q3/4gvOz8m6a+A9sl49sqodLdxVlXQ7d4CuylABEB\n' +
			'AAHNAMLAigQQAQgAPgWCZKzpgAQLCQcICZCaDezdj8j4SwMVCAoEFgACAQIZ\n' +
			'AQKbAwIeARYhBGZpOFBNtTj1Oqt695oN7N2PyPhLAACCLgf/dB412nDRcOxR\n' +
			'dNSj2AYknJ+NKeX38KuksyR6wypnaJWpapmIeZCfFjeoBjuBCPd6unvN/IlZ\n' +
			'zPwl66lO5GKJxDaDd1/infxM/dbtFQSESLXlweRLQ/v1+plsntrBUyvbY4uH\n' +
			'Mh9PImYsLY+zo8P5mpBV5AGAMA6R9qmu3axH/MnKVdB0Ky6C/jP+7lPs/QVT\n' +
			'qsISyyI1E9E6Oivzxmao1axfXLdEvICHb6uD0R4p5SUVqHJX41OwM8BFevhK\n' +
			'07Hi+c7NhUWp0sxXEOs6dneJZwerCD3EahutpP1Oyt5T8MZitysn2yJ+s5ks\n' +
			'SZza+x8OmCMcMZfZnIsJNnIUvPboP87ATQRkrOmAAQgAteDgsJJ0ftPD+P15\n' +
			'rKgkLuSCD2iwQgm2k8/ZDaXJBsdm4sJYTt2y0ckx7MRpXgLuIyidOGctqVL6\n' +
			'/Rl2Hfl30JQPok5cYmYLENVuFz94MEvgDOo8jacyfPdLGPMWZMLRojyM/Yvs\n' +
			'nhDZ8if3zEstP4h3HcpdT+PWSmsJWjrq57la4vKbfILtKfTBaf8sibm5UuZA\n' +
			'5Y/SIPxfVC+ybCPAjo4tpDYP901V+wxXDJ8BlZ4AaVvk20MYMzuAjBna+iwD\n' +
			'f0j4CccEabd2EVtAQQcMCg2yTjOT22Dt0jfpDuohDNaXDhX2ZQlJIdlSLCEI\n' +
			'a3c7g+uU9bnNqt7LHPgMzLYKnwARAQABwsB2BBgBCAAqBYJkrOmACZCaDezd\n' +
			'j8j4SwKbDBYhBGZpOFBNtTj1Oqt695oN7N2PyPhLAAD2vQgAu9+sd4AT5b6c\n' +
			'mWOaQBXz2XVfJXYQFNlBdOF23reycF9r7vDAKSRpeyMSyOfRAi0qdLynQ1dN\n' +
			'MXV/gfO0G9dzFu513P/Y1sZxQi0uLRKL9hMcgEQ8FLo8/PGfVcoLfQASryGj\n' +
			'Z8ybCFqiXocGpt2VkkK4wwgv+ZwZ8M1ubz0Boby6A1/kTYs/6ll+QekpB4ao\n' +
			'kJKw3DWvVNR/xODFfMQcClvzAtqwfxhTZXBMbZ4vAG5m1ExGmA15cGXrAfwV\n' +
			'nR2vOhPYDeZGbBKktM3xfDts75N2NF/TBpvazV2DTKpkLqvVitFHWvSMMpVd\n' +
			'dwk9tEOmBlj2AoYATvQ9kKHRTD27Wg==\n' +
			'=IXzf\n' +
			'-----END PGP PUBLIC KEY BLOCK-----\n',
		isSpeaker: true,
		image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR4AcXBoXHEMBRF0Zs3oqpHNYgJecZdGKYMd5GZRWaCwaohZbiAhP5d8HeC3jkfnz/fvwSTRua+DjJ1nGQ6i0iYCTNhVnjRWUSTRlTHyX90FhlhJsyEWeHFpJG5r4NMHSfRpBF1FpEwE2bCrPDGfR1E29jJPK6DqI6TjDATZsKsTBqZOk6iSa6ORmbSiISZMBNmpbOIHtcXUR0nUWeRmTSi+zqItrETCTNhJswKL7ax82wRTRqZzuLJ2MkIM2EmzApvTBpRZ5GZNKLOIiPMhJkw+wPV2i2sD43hKwAAAABJRU5ErkJggg=='
	}],
	pendingMembers: [{
			wallet: 'eip155:0xC1469cB7b59d16dC887D4C11faB3E3C0abBeA12C',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA30lEQVR4AcXBsWnFMBSG0e9dBAGDPUs6LeAFNIEb1x5GtRtDei3gBQzZIFtYYEj10t73CkFw8Z/z+Pj+euJs14iXlsodJfd4U7fjGWKGmCEWzjnilUzTsB60nHOk5ZwjniFmiBligTdTt+MlIt52jbRVvKnb8RIRzxAzxAyxx+/nzxMhQ8wQM8RCyT0taancUXJPiyFmiBligTdTt+NNKy/OOdIyrAct2zXiGWKGmCEW0lJ5kUe8tFT+45wjXsk9XloqniFmiBliYVgPvHOOeCX33JGWijesB54hZogZYn8uFTTKoy9pgwAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0xccF7a3131E0E73F83Bc457C27494411a57f23248',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA9ElEQVR4AcXBIWoEMRSA4X8fw6qayBW9zULVEBFygLqcqMwdhlBCbKjqXSLjY7b2UZEVpbzvu3x8vT5QShhoqUa0Yz9ZSTWiHfuJ5rNDE4wJxgRjl8/v9wdKn43/dLve0QRjgjHB2NZnQ7td72h9NrQSBis+O7Tb9Y7WZ0MTjAnGBGMbv/TZ0EoYaD47VkoYaD43VgRjgjHB2MYTqUa0Yz9ZSTWi9dlYEYwJxgRjlzf38kDx2aGVMNBSjawc+4nms0MrYaAJxgRjgrGNJ1KNaH02VlKNaH02VgRjgjHB2OazQythoKXKn5Qw0Hx2aIIxwZhg7Ae2cUcV4Bl8pAAAAABJRU5ErkJggg=='
		},
		{
			wallet: 'eip155:0x052aD82D3a7b4DAb5b9BcFED771D28703a6faadf',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAy0lEQVR4AcXBoXFDQQxF0RtlkZsQNjHICKYYV7DFCAW6II2BycfbhklCNR/sTNA75+Pn+/MXIUPMEDPEBifhSVdr0oUnO7UmXXjS1Zp0hpghZogZYoaYIWaIDU5qTbrwpHtfnuyEJ12tyY4hZogZYiM86WpNdl7Hg53wL3bCk84QM8QMscFJeNLVmnS3652dOiZdeLJjiBlihtioNenCky486eqY7IQnO7UmnSFmiBliIzzpak262/XOf7wvT7rX8aALTzpDzBAzxP4AMOQyARcWaToAAAAASUVORK5CYII='
		},
		{
			wallet: 'eip155:0x956f73E5a3BF0D19299BF74bD6dc819D7f775eC7',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA20lEQVR4AcXBsYnDMBiG4dc/nsHgHeJWS1x7G6QzqNQUKlUHLn12ONdqNYTBS/ja/xqBCeF7nmFbbydODoVPSjXiGWKGmCE2Pu8vvPT45pOe9xeeIWaIGWLj0Xa8HAo9qUZ6cih0tR3PEDPEDLFhW28nTg4FL9XIO3IoeKlGPEPMEDPEhq+f3xNnWmZ6jrbTMy0zPUfb8QwxQ8wQG6dlxjvajpdq5JLKPzkUvGmZ8QwxQ8wQG4+246Ua8XIovCPViJcpeIaYIWaIDdt6O7kgh0JPqpErDDFDzBD7AzabOPmHFg/aAAAAAElFTkSuQmCC'
		},
		{
			wallet: 'eip155:0x19da526eD1a57E07D48aa25aDa6cbA7E41FF3129',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyUlEQVR4AcXBsY1CQQxF0cvTFEHuNn4jxB6JJggpw5Mh/UZogmByumBTi2DQahf5nMN2vr1IjvtG1ufgL8Kc7Hm6k4liopgo1i7XB1nsG990uT7IRDFRTBRrfBDmZH0OVsKc3xDFRDFRrPFBn4MszFnpc5CFOSuimCgmih228+1Fctw3vul5upOJYqKYKNaO+0bW5yALc7I+BythTtbnIAtzMlFMFBPFGm/CnP8U5qyIYqKYKNZ40+dgJcxZ6XOwEuZkopgoJor9AIckL2mEiBQrAAAAAElFTkSuQmCC'
		},
		{
			wallet: 'eip155:0x77059B40Ec974883b98a23eef519b4076D1Cf9F1',
			publicKey: '',
			isSpeaker: false,
			image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsY0CMRRF0cuTQ6rYaQFiAvdBYMkFkFEAwWYTryxZ2kIcEE8N1MKmH4JJRuw7Z/d7uD0JRu1EuRW2GLUT5VaIhJkwE2a788/XEyNhJsyEWcqtEI3a+aTcCpEwE2bCLI3aia77E9EyT2xxvDyIvmsnEmbCTJgl3izzRDRqJ8qtsGbUzou58KLeiYSZMBNmKbfCf8qtEAkzYSbM0qidTxq1s0aYCTNhlq77E9EyT2yRW2HN8fIgEmbCTJj9AUPBKWCCQlIAAAAAAElFTkSuQmCC'
		}
	],
	contractAddressERC20: null,
	numberOfERC20: 0,
	contractAddressNFT: null,
	numberOfNFTTokens: 0,
	verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
		'\n' +
		'wsBzBAEBCAAnBYJkrOmCCZCaDezdj8j4SxYhBGZpOFBNtTj1Oqt695oN7N2P\n' +
		'yPhLAAD+iwf/dvaRCTwXKGH6iUe49NpyTHMaD6ZwaLerk+K4Ojehbdoo0mDf\n' +
		'aOu/MR8wfqk49h2436rcMmyeM5avcMgmtGUmIdy/6hCZ6zxR/3E5t/vq5UfO\n' +
		'3YFO1VLghR5cTYqR9bMLFkvvCB4P29rnaok2QVKTBZLfyAM4wu1h2DDBESoz\n' +
		'SS+ZtQLPz6/y7gOQobO0zbwBPmy8MpVVu1wxht+sneOMvZX+5al679nQbwNL\n' +
		'oCcU3UKrlqMhuFgMTCKx99VLcc4JbhBf2M+IHf78NtQ9mcQC/X+gxRfp6f+p\n' +
		'2RePQzkmUH5vqXjzcUsNBWJPOyjl09/IZWWwaeiUjsPazjxqDtYNHg==\n' +
		'=H4X4\n' +
		'-----END PGP SIGNATURE-----\n' +
		':null',
	spaceImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
	spaceName: 'sheer_ivory_ox',
	isPublic: true,
	spaceDescription: 'specific_green_alpaca',
	spaceCreator: 'eip155:0x5908D89B1390ec5833001b86302B868A808D506D',
	spaceId: 'spaces:bc96011f182e2c86ad68aaf4c95c4a916c808088370cb0ba294f9168e2ff6328',
	scheduleAt: '2023-07-15T14:48:00.000Z',
	scheduleEnd: '2023-07-15T15:48:00.000Z',
	status: 'PENDING'
}
```

</details>

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

<details>
  <summary><b>Expected response (Get spaces of a specific user)</b></summary>

```typescript
// PushAPI_space_spaces | Response - 200 OK
// Array of spaces
[
  {
    spaceId:
      'spaces:3aa43087b8c55ed9c534dd1d0a086a3340b0d829cda0a13592651cb59f284838',
    about: null,
    did: null,
    intent:
      'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A+eip155:0xF8aBe92d1d0706bF60509F8E9A64Ed6b8520E868',
    intentSentBy: 'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
    intentTimestamp: '2023-07-12T01:11:32.000Z',
    publicKey: null,
    profilePicture: null,
    threadhash: null,
    wallets: null,
    combinedDID:
      'eip155:0x12E429E3672a02E385F9f5F75E932cC1D566EEea_eip155:0x49D407CC9D0e966CD9B22BA40685083B49bd2315_eip155:0xF8aBe92d1d0706bF60509F8E9A64Ed6b8520E868_eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
    name: null,
    spaceInformation: {
      members: [Array],
      pendingMembers: [Array],
      contractAddressERC20: null,
      numberOfERC20: 0,
      contractAddressNFT: null,
      numberOfNFTTokens: 0,
      verificationProof:
        'pgp:-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJkrksbCZA3GHnYNke0AhYhBNp+D95LDfs4yU03LzcYedg2\n' +
        'R7QCAACRdAf9ELAnCLXfBiAVdbgwj81xr+w9Yzw2wXLLrPLfYY7EXfyChLzQ\n' +
        'rr9XBDdWMgtzEU1diSPMbLDh1METR7n71EjG0AoeX5A2pkHI7R1vIxXUJR3G\n' +
        'fzHENsfGaKLnhrL1wLjBQACzEsIqPrHl9RItdtKEs9izLmc+wV0GFJ5OjbAs\n' +
        'ty/1Q36nnMB7sQ7Ytb9Op+q0TtZPZ7jF9CjX8KGav3P1xDQex9nfsXiDHlLK\n' +
        'MqDePaaMO6RJUWAP2xTo2k1DDJQ2dpUhs9XyjMlvFhVbIcT1/lVRCPC8V3C8\n' +
        'fUKhUejvOjNFxf0QuR+E4xs+Q3zvR1+fXdJBxbH2Fp3kOTN1N9/LEw==\n' +
        '=sLLC\n' +
        '-----END PGP SIGNATURE-----\n',
      spaceImage:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
      spaceName: 'statutory_amber_roadrunner',
      isPublic: true,
      spaceDescription: 'continued_bronze_pigeon',
      spaceCreator: 'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
      spaceId:
        'spaces:3aa43087b8c55ed9c534dd1d0a086a3340b0d829cda0a13592651cb59f284838',
      scheduleAt: '2023-07-12T06:51:32.000Z',
      scheduleEnd: '2023-07-12T07:41:32.000Z',
      status: 'PENDING',
    },
    msg: {
      fromCAIP10: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toCAIP10: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      fromDID: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toDID: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJkWKQWCZB7dzg7q3axjBYhBJFuYslzDGbuE+3FMnt3ODur\n' +
        'drGMAAAjtAf/TXjtm2qb6aSikFPKYXm0Ekws+65fisJGf7T48MYkkfcD4t2e\n' +
        'HXd9LtohzGhcztbOQfAND3yME1GWuMBIksq9rlyEA0ezwsGzCJVhBnkAHBe3\n' +
        '+1v4/mNSMmInU8y6sOiLiOcW7ameJvZvDdPDJ0YHhc9dKDCIh1UAZEPAgx+z\n' +
        'Wc0DM6pW8bT70dfgnuW2LlLGF5Z23Z1vbHmeszt78+xYY3ez/hoMHXUIE25z\n' +
        'Wrnt75nasBBahtJ0mwH10ATnsQNE9hTi6XPGYxRSNDM9nyRxTQUpjhNmGS/+\n' +
        '7oFyq8xTcRSaL7d3h8URp9hgFWher5ZZDyMV0jvk+HPguUX54g6Kgw==\n' +
        '=dcRD\n' +
        '-----END PGP SIGNATURE-----\n',
      timestamp: 1683530775648,
      sigType: 'pgp',
      encType: 'pgp',
      encryptedSecret:
        '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMA9aU+JGZVRn/AQgA1pIJHyeJinU21r6At5S5ZaWeN0OEKVB2TjpqZ0IW\n' +
        'lHLKQrQ8k3M16bN+Vf0P+DzDVOL84QRkBD56qSNVHOOCox5wcQeR01CczenV\n' +
        'LUVvVjBzR2hj7Sdw+Q+M//rgeZPPUDbNyiVmGijelhwDqWd7IOoZY26AGXlm\n' +
        '7YQiElvHN2HcYXaTlLAOy36BcccwHu3Tn06F77ZXaf8FnGMWOUy7wh1/jugg\n' +
        'D17jUZGLYbmw+u5l9BOfljbw2pb4vtjWht0I1b4GYlKb+bYg/NY0UNsq7mSh\n' +
        'dGAmOhy5tC2NMjLRRLfD2qasxHoHN50onlB6HcYLl0RCf31ebOgO6rMhUnxt\n' +
        '9cHATAMLWLG2xubrYAEH/2tVeq2j7nJALGSFxjJPboOY57aiFrhXNQ/e/oXH\n' +
        '//TNJgGWx4Ta++OuF2Oexbh9DIZhl6DWld9adXDDtBS/fEyjNsYqwoYlNEJN\n' +
        'kLvSmokNNrE4MKC1A0GkhSh2MGQDNk42GSgz1tep8XSVc98MHqfNXCHVb5Oa\n' +
        'OBeWKLFyElT3+KuZxSkCsnoO5YjuCGbXPyG06tXMHXMTncpj1ri+vpjUSnhD\n' +
        'wn3o0zpNWu0GaWXIgTqj2ZouVwV2S1+wAJQjE8uI1JvBiMhA+X63/GCcApBu\n' +
        'C7rN0Cs5NGXCn9VWp8i1SCp2NuZ38POABwsXUUkjpF24txyUDX8dbXlkzpao\n' +
        'g93SQAElYYmyKbGp1TKhAZl2u40mgf2yCYDv2DLRfAKMJDLvmjXoUGEg2UYO\n' +
        '11w6LD0pIykdKJmFtRls/uMnlcoBgDA=\n' +
        '=kzUH\n' +
        '-----END PGP MESSAGE-----\n',
      link: 'bafyreib34jgnpp573rwquejcq5avxvydis7fbykat6dd5z7uazobucoumm',
    },
  },
];
```

| Parameter        | Type           | Description                                                        |
| ---------------- | -------------- | ------------------------------------------------------------------ |
| msg              | `IMessageIPFS` | message object                                                     |
| did              | `string`       | user DID                                                           |
| wallets          | `string`       | user wallets                                                       |
| profilePicture   | `string`       | user profile picture                                               |
| publicKey        | `string`       | user public key                                                    |
| about            | `string`       | user description                                                   |
| threadhash       | `string`       | cid from the latest message sent on this conversation              |
| intent           | `string`       | addresses concatenated from the users who have approved the intent |
| intentSentBy     | `string`       | address of the user who sent the intent                            |
| intentTimestamp  | `number`       | timestamp of the intent                                            |
| combinedDID      | `string`       | concatenated addresses of the members of this space                |
| cid              | `string`       | content identifier on IPFS                                         |
| spaceId          | `string`       | space identifier                                                   |
| spaceInformation | `SpaceDTO`     | all space information                                              |

</details>

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

<details>
  <summary><b>Expected response (Get spaces requests of a specific user)</b></summary>

```typescript
// PushAPI_space_requests | Response - 200 OK
// Array of spaces
[
  {
    spaceId:
      'spaces:3aa43087b8c55ed9c534dd1d0a086a3340b0d829cda0a13592651cb59f284838',
    about: null,
    did: null,
    intent:
      'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A+eip155:0xF8aBe92d1d0706bF60509F8E9A64Ed6b8520E868',
    intentSentBy: 'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
    intentTimestamp: '2023-07-12T01:11:32.000Z',
    publicKey: null,
    profilePicture: null,
    threadhash: null,
    wallets: null,
    combinedDID:
      'eip155:0x12E429E3672a02E385F9f5F75E932cC1D566EEea_eip155:0x49D407CC9D0e966CD9B22BA40685083B49bd2315_eip155:0xF8aBe92d1d0706bF60509F8E9A64Ed6b8520E868_eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
    name: null,
    spaceInformation: {
      members: [Array],
      pendingMembers: [Array],
      contractAddressERC20: null,
      numberOfERC20: 0,
      contractAddressNFT: null,
      numberOfNFTTokens: 0,
      verificationProof:
        'pgp:-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJkrksbCZA3GHnYNke0AhYhBNp+D95LDfs4yU03LzcYedg2\n' +
        'R7QCAACRdAf9ELAnCLXfBiAVdbgwj81xr+w9Yzw2wXLLrPLfYY7EXfyChLzQ\n' +
        'rr9XBDdWMgtzEU1diSPMbLDh1METR7n71EjG0AoeX5A2pkHI7R1vIxXUJR3G\n' +
        'fzHENsfGaKLnhrL1wLjBQACzEsIqPrHl9RItdtKEs9izLmc+wV0GFJ5OjbAs\n' +
        'ty/1Q36nnMB7sQ7Ytb9Op+q0TtZPZ7jF9CjX8KGav3P1xDQex9nfsXiDHlLK\n' +
        'MqDePaaMO6RJUWAP2xTo2k1DDJQ2dpUhs9XyjMlvFhVbIcT1/lVRCPC8V3C8\n' +
        'fUKhUejvOjNFxf0QuR+E4xs+Q3zvR1+fXdJBxbH2Fp3kOTN1N9/LEw==\n' +
        '=sLLC\n' +
        '-----END PGP SIGNATURE-----\n',
      spaceImage:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
      spaceName: 'statutory_amber_roadrunner',
      isPublic: true,
      spaceDescription: 'continued_bronze_pigeon',
      spaceCreator: 'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
      spaceId:
        'spaces:3aa43087b8c55ed9c534dd1d0a086a3340b0d829cda0a13592651cb59f284838',
      scheduleAt: '2023-07-12T06:51:32.000Z',
      scheduleEnd: '2023-07-12T07:41:32.000Z',
      status: 'PENDING',
    },
    msg: {
      fromCAIP10: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toCAIP10: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      fromDID: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toDID: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJkWKQWCZB7dzg7q3axjBYhBJFuYslzDGbuE+3FMnt3ODur\n' +
        'drGMAAAjtAf/TXjtm2qb6aSikFPKYXm0Ekws+65fisJGf7T48MYkkfcD4t2e\n' +
        'HXd9LtohzGhcztbOQfAND3yME1GWuMBIksq9rlyEA0ezwsGzCJVhBnkAHBe3\n' +
        '+1v4/mNSMmInU8y6sOiLiOcW7ameJvZvDdPDJ0YHhc9dKDCIh1UAZEPAgx+z\n' +
        'Wc0DM6pW8bT70dfgnuW2LlLGF5Z23Z1vbHmeszt78+xYY3ez/hoMHXUIE25z\n' +
        'Wrnt75nasBBahtJ0mwH10ATnsQNE9hTi6XPGYxRSNDM9nyRxTQUpjhNmGS/+\n' +
        '7oFyq8xTcRSaL7d3h8URp9hgFWher5ZZDyMV0jvk+HPguUX54g6Kgw==\n' +
        '=dcRD\n' +
        '-----END PGP SIGNATURE-----\n',
      timestamp: 1683530775648,
      sigType: 'pgp',
      encType: 'pgp',
      encryptedSecret:
        '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMA9aU+JGZVRn/AQgA1pIJHyeJinU21r6At5S5ZaWeN0OEKVB2TjpqZ0IW\n' +
        'lHLKQrQ8k3M16bN+Vf0P+DzDVOL84QRkBD56qSNVHOOCox5wcQeR01CczenV\n' +
        'LUVvVjBzR2hj7Sdw+Q+M//rgeZPPUDbNyiVmGijelhwDqWd7IOoZY26AGXlm\n' +
        '7YQiElvHN2HcYXaTlLAOy36BcccwHu3Tn06F77ZXaf8FnGMWOUy7wh1/jugg\n' +
        'D17jUZGLYbmw+u5l9BOfljbw2pb4vtjWht0I1b4GYlKb+bYg/NY0UNsq7mSh\n' +
        'dGAmOhy5tC2NMjLRRLfD2qasxHoHN50onlB6HcYLl0RCf31ebOgO6rMhUnxt\n' +
        '9cHATAMLWLG2xubrYAEH/2tVeq2j7nJALGSFxjJPboOY57aiFrhXNQ/e/oXH\n' +
        '//TNJgGWx4Ta++OuF2Oexbh9DIZhl6DWld9adXDDtBS/fEyjNsYqwoYlNEJN\n' +
        'kLvSmokNNrE4MKC1A0GkhSh2MGQDNk42GSgz1tep8XSVc98MHqfNXCHVb5Oa\n' +
        'OBeWKLFyElT3+KuZxSkCsnoO5YjuCGbXPyG06tXMHXMTncpj1ri+vpjUSnhD\n' +
        'wn3o0zpNWu0GaWXIgTqj2ZouVwV2S1+wAJQjE8uI1JvBiMhA+X63/GCcApBu\n' +
        'C7rN0Cs5NGXCn9VWp8i1SCp2NuZ38POABwsXUUkjpF24txyUDX8dbXlkzpao\n' +
        'g93SQAElYYmyKbGp1TKhAZl2u40mgf2yCYDv2DLRfAKMJDLvmjXoUGEg2UYO\n' +
        '11w6LD0pIykdKJmFtRls/uMnlcoBgDA=\n' +
        '=kzUH\n' +
        '-----END PGP MESSAGE-----\n',
      link: 'bafyreib34jgnpp573rwquejcq5avxvydis7fbykat6dd5z7uazobucoumm',
    },
  },
];
```

| Parameter        | Type           | Description                                                        |
| ---------------- | -------------- | ------------------------------------------------------------------ |
| msg              | `IMessageIPFS` | message object                                                     |
| did              | `string`       | user DID                                                           |
| wallets          | `string`       | user wallets                                                       |
| profilePicture   | `string`       | user profile picture                                               |
| publicKey        | `string`       | user public key                                                    |
| about            | `string`       | user description                                                   |
| threadhash       | `string`       | cid from the latest message sent on this conversation              |
| intent           | `string`       | addresses concatenated from the users who have approved the intent |
| intentSentBy     | `string`       | address of the user who sent the intent                            |
| intentTimestamp  | `number`       | timestamp of the intent                                            |
| combinedDID      | `string`       | concatenated addresses of the members of this space                |
| cid              | `string`       | content identifier on IPFS                                         |
| spaceId          | `string`       | space identifier                                                   |
| spaceInformation | `SpaceDTO`     | all space information                                              |

</details>

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

<details>

  <summary><b>Expected response (Get trending spaces)</b></summary>

```typescript
// PushAPI_space_trending | Response - 200 OK
// Array of spaces
[
  {
    spaceId:
      'spaces:3aa43087b8c55ed9c534dd1d0a086a3340b0d829cda0a13592651cb59f284838',
    about: null,
    did: null,
    intent:
      'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A+eip155:0xF8aBe92d1d0706bF60509F8E9A64Ed6b8520E868',
    intentSentBy: 'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
    intentTimestamp: '2023-07-12T01:11:32.000Z',
    publicKey: null,
    profilePicture: null,
    threadhash: null,
    wallets: null,
    combinedDID:
      'eip155:0x12E429E3672a02E385F9f5F75E932cC1D566EEea_eip155:0x49D407CC9D0e966CD9B22BA40685083B49bd2315_eip155:0xF8aBe92d1d0706bF60509F8E9A64Ed6b8520E868_eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
    name: null,
    spaceInformation: {
      members: [Array],
      pendingMembers: [Array],
      contractAddressERC20: null,
      numberOfERC20: 0,
      contractAddressNFT: null,
      numberOfNFTTokens: 0,
      verificationProof:
        'pgp:-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJkrksbCZA3GHnYNke0AhYhBNp+D95LDfs4yU03LzcYedg2\n' +
        'R7QCAACRdAf9ELAnCLXfBiAVdbgwj81xr+w9Yzw2wXLLrPLfYY7EXfyChLzQ\n' +
        'rr9XBDdWMgtzEU1diSPMbLDh1METR7n71EjG0AoeX5A2pkHI7R1vIxXUJR3G\n' +
        'fzHENsfGaKLnhrL1wLjBQACzEsIqPrHl9RItdtKEs9izLmc+wV0GFJ5OjbAs\n' +
        'ty/1Q36nnMB7sQ7Ytb9Op+q0TtZPZ7jF9CjX8KGav3P1xDQex9nfsXiDHlLK\n' +
        'MqDePaaMO6RJUWAP2xTo2k1DDJQ2dpUhs9XyjMlvFhVbIcT1/lVRCPC8V3C8\n' +
        'fUKhUejvOjNFxf0QuR+E4xs+Q3zvR1+fXdJBxbH2Fp3kOTN1N9/LEw==\n' +
        '=sLLC\n' +
        '-----END PGP SIGNATURE-----\n',
      spaceImage:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
      spaceName: 'statutory_amber_roadrunner',
      isPublic: true,
      spaceDescription: 'continued_bronze_pigeon',
      spaceCreator: 'eip155:0xf4c946D6bd5cF09713D27364bbEd42712Bdffa8A',
      spaceId:
        'spaces:3aa43087b8c55ed9c534dd1d0a086a3340b0d829cda0a13592651cb59f284838',
      scheduleAt: '2023-07-12T06:51:32.000Z',
      scheduleEnd: '2023-07-12T07:41:32.000Z',
      status: 'PENDING',
    },
    msg: {
      fromCAIP10: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toCAIP10: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      fromDID: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toDID: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJkWKQWCZB7dzg7q3axjBYhBJFuYslzDGbuE+3FMnt3ODur\n' +
        'drGMAAAjtAf/TXjtm2qb6aSikFPKYXm0Ekws+65fisJGf7T48MYkkfcD4t2e\n' +
        'HXd9LtohzGhcztbOQfAND3yME1GWuMBIksq9rlyEA0ezwsGzCJVhBnkAHBe3\n' +
        '+1v4/mNSMmInU8y6sOiLiOcW7ameJvZvDdPDJ0YHhc9dKDCIh1UAZEPAgx+z\n' +
        'Wc0DM6pW8bT70dfgnuW2LlLGF5Z23Z1vbHmeszt78+xYY3ez/hoMHXUIE25z\n' +
        'Wrnt75nasBBahtJ0mwH10ATnsQNE9hTi6XPGYxRSNDM9nyRxTQUpjhNmGS/+\n' +
        '7oFyq8xTcRSaL7d3h8URp9hgFWher5ZZDyMV0jvk+HPguUX54g6Kgw==\n' +
        '=dcRD\n' +
        '-----END PGP SIGNATURE-----\n',
      timestamp: 1683530775648,
      sigType: 'pgp',
      encType: 'pgp',
      encryptedSecret:
        '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMA9aU+JGZVRn/AQgA1pIJHyeJinU21r6At5S5ZaWeN0OEKVB2TjpqZ0IW\n' +
        'lHLKQrQ8k3M16bN+Vf0P+DzDVOL84QRkBD56qSNVHOOCox5wcQeR01CczenV\n' +
        'LUVvVjBzR2hj7Sdw+Q+M//rgeZPPUDbNyiVmGijelhwDqWd7IOoZY26AGXlm\n' +
        '7YQiElvHN2HcYXaTlLAOy36BcccwHu3Tn06F77ZXaf8FnGMWOUy7wh1/jugg\n' +
        'D17jUZGLYbmw+u5l9BOfljbw2pb4vtjWht0I1b4GYlKb+bYg/NY0UNsq7mSh\n' +
        'dGAmOhy5tC2NMjLRRLfD2qasxHoHN50onlB6HcYLl0RCf31ebOgO6rMhUnxt\n' +
        '9cHATAMLWLG2xubrYAEH/2tVeq2j7nJALGSFxjJPboOY57aiFrhXNQ/e/oXH\n' +
        '//TNJgGWx4Ta++OuF2Oexbh9DIZhl6DWld9adXDDtBS/fEyjNsYqwoYlNEJN\n' +
        'kLvSmokNNrE4MKC1A0GkhSh2MGQDNk42GSgz1tep8XSVc98MHqfNXCHVb5Oa\n' +
        'OBeWKLFyElT3+KuZxSkCsnoO5YjuCGbXPyG06tXMHXMTncpj1ri+vpjUSnhD\n' +
        'wn3o0zpNWu0GaWXIgTqj2ZouVwV2S1+wAJQjE8uI1JvBiMhA+X63/GCcApBu\n' +
        'C7rN0Cs5NGXCn9VWp8i1SCp2NuZ38POABwsXUUkjpF24txyUDX8dbXlkzpao\n' +
        'g93SQAElYYmyKbGp1TKhAZl2u40mgf2yCYDv2DLRfAKMJDLvmjXoUGEg2UYO\n' +
        '11w6LD0pIykdKJmFtRls/uMnlcoBgDA=\n' +
        '=kzUH\n' +
        '-----END PGP MESSAGE-----\n',
      link: 'bafyreib34jgnpp573rwquejcq5avxvydis7fbykat6dd5z7uazobucoumm',
    },
  },
];
```

| Parameter        | Type           | Description                                                        |
| ---------------- | -------------- | ------------------------------------------------------------------ |
| msg              | `IMessageIPFS` | message object                                                     |
| did              | `string`       | user DID                                                           |
| wallets          | `string`       | user wallets                                                       |
| profilePicture   | `string`       | user profile picture                                               |
| publicKey        | `string`       | user public key                                                    |
| about            | `string`       | user description                                                   |
| threadhash       | `string`       | cid from the latest message sent on this conversation              |
| intent           | `string`       | addresses concatenated from the users who have approved the intent |
| intentSentBy     | `string`       | address of the user who sent the intent                            |
| intentTimestamp  | `number`       | timestamp of the intent                                            |
| combinedDID      | `string`       | concatenated addresses of the members of this space                |
| cid              | `string`       | content identifier on IPFS                                         |
| spaceId          | `string`       | space identifier                                                   |
| spaceInformation | `SpaceDTO`     | all space information                                              |

</details>

---

## PushAPI Class

### **Initialize**

```typescript
// Initialize PushAPI class instance
const userAlice = await PushAPI.initialize(signer);
```

| Param                    | Type                                   | Default       | Remarks                                                                                |
| ------------------------ | -------------------------------------- | ------------- | -------------------------------------------------------------------------------------- |
| `signer`                 | `SignerType`                           | -             | EthersV5 or Viem Signer                                                                |
| `options` \*             | `PushAPIInitializeProps`               | -             | Optional configuration properties for initializing the PushAPI.                        |
| `options.env` \*         | `ENV`                                  | `staging`     | API env - 'prod', 'staging', 'dev'                                                     |
| `options.progressHook`\* | `(progress: ProgressHookType) => void` | -             | A callback function to receive progress updates during initialization.                 |
| `options.account` \*     | `string`                               | -             | The account to associate with the PushAPI. If not provided, it is derived from signer. |
| `options.version` \*     | `string`                               | `ENC_TYPE_V3` | The encryption version to use for the PushAPI                                          |
| `options.versionMeta` \* | `{ NFTPGP_V1 ?: password: string }`    | -             | Metadata related to the encryption version, including a password if needed.            |
| `options.autoUpgrade` \* | `boolean`                              | `true`        | If `true`, upgrades encryption keys to latest encryption version                       |
| `options.origin` \*      | `string`                               | -             | Specify origin or source while creating a Push Profile                                 |

\* - Optional

---

### **Fetch Info**

```typescript
// Fetch Info
const aliceInfo = await userAlice.info();
```

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  did: 'eip155:0xEaC9c666570782E262f1E2a0b1d3BE4B95aFA7cd',
  wallets: 'eip155:0xEaC9c666570782E262f1E2a0b1d3BE4B95aFA7cd',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGTu6YUBCACa7JaMqfhAnD/9ynE5Rhi8KNQ1tfdQe0ay/9jXX2naZIA+\n' +
    '6WCi1uNcB2TTLfMuzsEl4u/26LTgtkr51snRt2QKgEqi5dXqbRD76wiRLd4h\n' +
    'ktBb4WB28o+BWOHYYJQq8he+zu3mQWjKLb1e9DyS0cTzwPwWVKce9IsG3NOi\n' +
    'eM7O5Kg5cU3qHXR+frF25peCBrzNXH+xuuTJPsX85h9dSz/u6dWXhk2LsX3s\n' +
    'cmX5mFcFErnGvUBddDGZc11q+WzZAtENPCxQrNjpkMtzCj9UMwgsJdzBghZZ\n' +
    'ZouGTG2uhfmIj3/KHOdwx/KGpTgC1iMVOb78kw9LmaxL6fGy4x9uvvI3ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZO7phQQLCQcICZABDloJB8hpcgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBMga3B8GDU79nd/0mAEOWgkHyGlyAAAbHAf/bJMPIyvNZNjO\n' +
    'JK2xA1hYpzIGdbi3jMego6GXrmet3qY50zMKDccB2Ot399y/nmWMVEyfKYaP\n' +
    '7N+mJbeAqIZ8TAHtpw++k/h8/hXoxb9iPsQyWYossuG499XyHnk+KEd4g0Wf\n' +
    'mqPk/XJB3xLLgW820jOsRRbWLyYKJEdh1Q+GIM+D6oIJ9ZmyRPv25u6yCF2P\n' +
    '2IQZErWeYD/LxqMDw+uHdRZJRiyFy/Y7A43clejN+p3my8oktXh2N4+tEl7i\n' +
    'Hwxc5z9AOffuEyUerm0Rjwdn8rG8po7AfuXwmTiW1Sdc9TdJtAK/n6e9EFHV\n' +
    'gHzArwyaydHHy80Wqa+UF591NkPi387ATQRk7umFAQgAs0ao+EFoKJirGHfI\n' +
    '69vZg+eAAUUKG657BzNzTAF2r5Y+a61jdcCAL+DXBcfks+H0dqG36zjOZTCJ\n' +
    'NirABp5RRPFty2VvUtOyezuKX/MBVg3st3t/yE3SncVaWMblAv3iegviNNpH\n' +
    'cFKqpHoVBWDNdhFHNsKTjpJcq3BVohy2Dxh8Di8N/1+gEPxADvIuH9MQ8MJk\n' +
    '6lB9XYXBmmqtlQ3sB916mvusUIl8Zxw1C76yY0PAXz055zJMiL1vwo5gKDiV\n' +
    'iKyzry3wq7upPGJyeTKu7uUMifTPhJtyYvon2TIik5DIgHpqKziirCrolA+s\n' +
    '7LhnFbawqDKleEdyCcL5mFCzXQARAQABwsB2BBgBCAAqBYJk7umFCZABDloJ\n' +
    'B8hpcgKbDBYhBMga3B8GDU79nd/0mAEOWgkHyGlyAABIqQgAmK9ijEEvtWTm\n' +
    '7/mhkuDEtfPfcMexfkaCcGL4SdZqVz/h+eIL8+4EbI9uq+YTzcjtX8FAEQta\n' +
    'KWFACNEOPmSy6Sb9bDoNZUVpDaZzNNtqIK9Brt4zjJLEsDfmkuW3S/SgIYBQ\n' +
    'yTkuNmmAf8dr7L4fG0JlxPyGaL1/w9UDAr7xdU7WcHuyPc0edDGeE7NwaGWp\n' +
    'uBipXFw8AkikV3fCTDuOi3uhkIzZ5zlGCshD7m0aDSABwr4hbFzLFBDSrsiW\n' +
    'GKhWGYgf5Vx8qzlwXYYnoW/rn3UXWpeTXjq46ZNaxjHJ4VxGMyn/tHZOEjDE\n' +
    'vHapLIAgGyw2b+s+zZSqsXaMkH8WOw==\n' +
    '=gPzx\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  encryptedPrivateKey: '{"ciphertext":"4f1243e1ffa76180f46ade2eb093867750c6bf72e8d6c71c7c0edca176c2f9fb32c603bb5e52d933730e0350292431b6e5287b8201f60ce9151b6a141bde98cdc3d9e5df8f84e00e5e4173bdf28b66e9590db10195fbd41ed241a65ab84fb5da251f613376bf78efe1af64613dd54fb05dced7cf8de0907d61489712ad42f06b5c775d97d15dee09b1c58cd79f596674e403353bc7e03297aa0d3fdaecac573c962409622ff8b1335b6fbb661bd2d5f5a076d9079f857849ba917662b40151041eca71385844160fc603c4d1beefbf71b26ac8968de52d6bb534ef6d6e2ea987170059d7d881dc684d28b5b2817804fba3b659e3ec0e802583e581b9f75d2f7e69e428cba91e62719e9ca6697588389db89b982370d23952120c0f972ab4b3a0da888d52b5055c60785d276152e43929df532bc7d5d68c6bc3cfdd1ca780df346113999a19d8e4a96c02f149d1ee4cde802277081ef339153872c00c9e9ddfe3ba8da8c68c0565752fea32258087e66aab37397a27b0228b5ed1aeb09a93b80778fd7f949409106c4cd82ff550aafb9d7bdce8727a76882f59ef2c54a137e51f04b6c27a0b1b92cd781dafb489a5e8203232669f5416454cc9cfe8c5b0fd8abc19d9ef16285a8da0aca2ed747adef7b49b8215790266d9c4791c250b0580e89c6429d10a1bcd45cf016a7ae30e1db948147d992722a7191e31852e6fd3c3679d868f34ebbe65f255be4b90dd64ceb52eaeee7d3356683b7fd511729493c887289ddb0f00c65ca2a95114f0e37d3b73d06333e2787c5fa6dd6f6c9e8334ff153dd63e30c81247efd497cf2c038843d8653edf23822eae07dd19d0be26a921673185bcf016533fdb59150ff46096419e6a6aeb1bd4293fc8146848d715d43afd04aa40f2b5ae9d058671677aad2413952a20b5214e18bbf3b4b033d936d673a0302967de3f74b05b74bc6c89f30ddeaab1bf6c567fcee355797b6cba17c3fcc8955bdf096e2dda2577b3374089d8c9d287552e5658c91e812bd0b8b63482c8de98fde216dd557eb34bafca2f8e73dc4582fa36332e8869f2717519921605915d8e1c75a37295e198ec0af75926d89a6832456304474a10c567334998226d9b6f709ebc216fb067d958e78a622040c91f46af202273d0b40307fb34cba5a6a57fbb196ac6e88c16d527b9bdb04b12fa7ed0bc771692712ccd146c41890b5caddbbb13b8ba77e632b2d7597256fb576ce87d2aff35a0e953b8227a5dcbf30f7d189ca7f77f6f8b2c4eb2752199a7a485ab52a6b65b6edd6cf65caaeb6f65544cc74c2fb3431fa484fb69adbda08d2402da953f20425832b6a2d712d56a5cc34095f25fb9524a478a71d387b7dea45b4bd41e79c61dceca332898dfeecf83999ed4fad892e2ede714b93f3969ad140f38bfa95d321ae5ef089cf0ce435d59f8b6611c0fd014c67ed38646f0771f1a74c1f950ee0900d883aca3ec4efbb2f7737e717007ae757d874573d4d70c9d7e38f8ff30a29b983036e684c4eaf35a7c03ed32a8e3fc62f0863c56830127a5f3c0e905a93e7466a4f43f0793cb6752b9be8d03d7be26170f694ecbb200f611bbf1dac4b6ec085deb8c3d8ee188d8c9c8c17ca720c0f0dee4d00e5866b5443b6af6e69ca64b8eb5a8f5fa1e1d27bfacbf1b0ae11241215358f5045b0d1a73d1b15dbd904709340c1e2b42a4ef78f76b8f901d6337849cff1052f06a8919255b596fb36d2fdf789fdf611813d20729c26d517dde6f11a3f6045ec5158652e128cf7c483a0fb8ab772cb5cdb56e42e6bf8c863f173307c3e053168e54e9e65bcacbb144413ff76d08a94929e6cdde2c5944246a4b344f3ca0ada3b403429750bdce76f04668b05ed79e9119f00901e7f7b4f1eea8a1b5b0186e3ed41277040a257601b0f3917db595f3f1808d92071a4e9521a251e9c5a66f2c8a57511f61b9fd88df77330aeb4bc15c043814b33610d60f6d0a13fd7977efaa1843913f6d3a79bc88020406c9979163684efe7b7ade9613221d06b52cd96abd31b77a707748d52e6e16c8c90821f29359b35307c10dafce5f35c0ff9802c23aef19f0a95b49a317cd6207002a5a9b822b4c056c4cbf9b27045dda8325d93060f358bb837f00954a6e281d1bdd1817a7cce8ed4a801f9164d32c52739c1ac650109868664be1fabab47c675222dc9ff9d75f9fb49531c832264aa5b55998675975f59e34829ce90b00092bd77e46328a6459d5c967d905b8e976611b839925ad742500231fa86cb5f7e6f39cb1e2e36b81c55269ea0f5fdcba5c8c0e38a899540d52be49c83efae5243998b926f029dc2980d4fdb1c125db409d015e0b36bc02272da1c688ee1f61d23cbde585064ab1e2164d0ca529774ec7797407ba5d988c58853e74a124a64dc24d0289b6a599354faf64790177c3032f5d660d7b76dfbf1c03388a7c75b2309c509c6a92144e124c8bd188274bc844e8f0aa7b5a06e79ad5776b5a62003b89aef194dcc03cd3c1b1f3ea541805cfc4e18aa159f9b5395185b573538c9bab16876dff91f365d16dcc56b339b01b86882ef8e52c51edd9c5b2f8a35713ed6eb43036e09f64f6e59ab417958faff974b6705400b341439fef4cba371c601927da7e0a8f23e1c6d3e070a19c2216da85f159d60303ab1321e479f4c371372845cef03daa7d2776c18face6cfa2ff9eed26f9f0a353a0f1c9a99b2556dccc1212fcb5c2078a3b0e58a7f3f7b3f346d624435ef94c95d40dc726d2e7400ae405e89473a934e7646124e34473dfe17f7f9cf481aa059ef422508ffe67f9b9276084973db0683269a046c1a0aafa7ab075b28008cbfb862b7e30c8b2afa1c2923d914b3d2469266e8e0182274a3d8d89642723820e61aa2d97a9370789ec4e89ebee05b6c0bef10778caf2a34c2d7622dde5fa64b012bea6205127c3c845229ef553f013b73823dc6631078fc628532e3e518bdc790ab8460078dedf0c5cb00492136813e2b91679bba82f3cf95169751933bee4358f84154014dbcc1de1a30613218039ebb2444429380fd283d3b60bd5d5b470e861f6ecc751c22aa467168512a0ef45755e6b59a7be591bd3b08fde874b166ccfbbedba10a0956d2d18cbda515341c2112d6094a746e9f562db6543e5bde2c4d4f7c06b7550400d66f7242a14f34cd8a7374372f0eea49a49b72909fc11ff81ea54a1e2c07225cdee856383a657b0f13c14b00ae3b7b2a32a22beaab8cfd18641dbfa82619fdcdddd3339e9423e71c487305e8aa932b694e94c37c7e418e4014c8bb264f47e8283e216eeeabf0fbdd2f5eb8d0ea979738d4f18b7bf72d7711f5d22653f217c7305314ec2c47a0ecbf1dc8f9bc1379ae38e2a04e736a1171b947609bb66f8d352ce57230d709f196953471c5504c7f9f40ed2f64bf3bd04bd57521a364ea03b5f0603cceec7851738d97c3fd73c16547d4d143b009a79832a1ed244937dce09edf2d5e32ae52ab0331c449325dce9e5e8ed1563c967a5f92031f4275e3179274ef3e0752ac01caf8a20aabb23d584d4d6607833f95cfc92832d936c37bb8b37222aa842f48944d06b37434c8dce5f19b450a7d1bd568672ef2c8eaa2afb7cff404b33377a61061f56b01849feb918521a7d63cfbe12466aedc7159c577f213f2c157586b8719164cd7108edfa9211287b43aadbad997bc62f8169eec4a6e02aeb535f670878e6af538b5281da04470d318f893102613977390a434e0557302a68ce42e532d350446d4d813b84c07b42bf22fbe4889096ec6303574c95040d8dcfed1b9bd26782c5033d7d1a491fece156cbc19a705204ed38a547e00a09b73bc7a702ef9c2e659171d1daab63958268148aba59766bc7a4ffb68c1ae047d1f0c5fb45fbacd07079f72af301c6aa00eebc0662c6792fc707d388b339d4f45afbf576bacf8730ec3e0f1e9dc0f9a6d58fd146b2293aed8d110da24336f9a4c01ae12c03ce214c6502f5fbc5224dd8b8b2e4edf2af16b811e5c8595fa76cafe34ba66199caaed48b5dfd5ae74a3e6b6d51a09c70afc30ebc0f40d51a15f1a8c2c41ec482eddf14bed3fd11a9e2aa4446268af25b49e429e2528d5df57797f6f3cd431eb5ded8f830c85cecde8012c31500ce9363903739a6759704fa87bfef984ed0285c8c0a5bf2f0985b1b511eb4145e4b27e2df6aa7b5c7a913b76b1ca869151b75c0717389b3d186f4e4637a5ceba3cef64809c3a06551a6a46be31af61c0ef78afb057f6cc625647dc04dcd74eb97f7aee0f5640e24b7662c799013efb83c80ec2851acda7c6328de789ae99ce296494225bd169e49c9a12dc7e281778f7fe275e72571cd5a3608733998d2f6b96c1d26c25223153fc5afc2f6e3d72f57fbcb2d087d718d3b6703b286f1e340c23cd3bc715797edf3ce6d5169bcf783ac9686233cc0358725143008b25bfbd329e1c30654e4b4c9461239d41ae77f706e64e5e60ce6de83becfd056f2678f17474ab9f4976b2d7d5d014d78f716d7d4edbf6ce4ed44ed677274d6b9b6e4bf4946dfd1ed8b821c81957b4bf5cd534ed6ca84dadd9d6380513dc6406b32dcd5c1bfa468a79e88a56656e71aed0c6675540e1617a31e1c122295427590e83b63e8da58a6c5c21a15703994bdc2b90d399b62679a4269224257f3ead5a2dd0980e6f5a45c5a9392929cc4743e106c7335136c9f8a3a29190462eef908eab02cda97dbcb71dff26b0ef4dae51de293b4cff0ebf37fce1391247c5ccf77dfb64974c4a1e6beeaf82041bb0d653e2e9b612f3442bba8480b86fd7b35514fc056d7429d5fb36199d4a6f632ea615d9acc961082d9d91aca416b57582bcd2f182f5f5be02b3f597c680b2e6b37ee4d133e51d077491cb536d6261808c42684d0912fd7bcc97dacdf32394e7b","salt":"da23dc7dbf23136dabc337a0caa170c0db7e4efec5f5c8a648dff9b7cd7df49f","nonce":"fe0e4ec3d40fb7de21a354bf","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"b43efae4c92a35d9c0b5f6178cb8b8a6642c77d0a9281f61beb9f6e8f7b006a5"}',
  verificationProof: 'eip191v2:0x97ca70a87ec658e0e488e8b9f71644ee23840d809803fcf5bdcd174c9f39cdeb27f6e3a8885fec5bede5f264b3996bc3fa019b0d52745a5573a972b7e79e321c1c',
  msgSent: 0,
  maxMsgPersisted: 1000,
  profile: {
    name: null,
    desc: null,
    picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4AcXBsQ3CUBBEwcfKCfIPnbgxF+ACKIYct+cGDpEdpCeCS0Damcu2PN40gqQaiE6QVAPREWbCTJgJM2EmzITZxJcg+acgqQaiEmbCTJhNQVINRCdIOgPRCZJKmAkzYTYNRLWfT6pjnalu54vOsc5U+/mkOtaZSpgJM2E2BUknSKr7eqWXdIKkEmbCTJhdtuXxphEkvxiIjjATZsJMmAkzYSbMPjaMJNvaf06gAAAAAElFTkSuQmCC',
    profileVerificationProof: null
  },
  origin: null,
  name: null,
  about: null,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4AcXBsQ3CUBBEwcfKCfIPnbgxF+ACKIYct+cGDpEdpCeCS0Damcu2PN40gqQaiE6QVAPREWbCTJgJM2EmzITZxJcg+acgqQaiEmbCTJhNQVINRCdIOgPRCZJKmAkzYTYNRLWfT6pjnalu54vOsc5U+/mkOtaZSpgJM2E2BUknSKr7eqWXdIKkEmbCTJhdtuXxphEkvxiIjjATZsJMmAkzYSbMPjaMJNvaf06gAAAAAElFTkSuQmCC',
  numMsg: 0,
  allowedNumMsg: 1000,
  encryptionType: 'eip191-aes256-gcm-hkdf-sha256',
  signature: '0x97ca70a87ec658e0e488e8b9f71644ee23840d809803fcf5bdcd174c9f39cdeb27f6e3a8885fec5bede5f264b3996bc3fa019b0d52745a5573a972b7e79e321c1c',
  sigType: 'eip191v2',
  encryptedPassword: null,
  nftOwner: null,
  linkedListHash: null,
  nfts: null
}
```

| Parameter           | Type     | Remarks                                                         |
| ------------------- | -------- | --------------------------------------------------------------- |
| did                 | `string` | user decentralized identity                                     |
| wallets             | `string` | all wallets associated to the did                               |
| publicKey           | `string` | Public PGP key                                                  |
| encryptedPrivateKey | `string` | Encrypted PGP Private Key                                       |
| verificationProof   | `string` | Verification proof                                              |
| msgSent             | `number` | Number of messages sent                                         |
| maxMsgPersisted     | `number` | Maximum number of messages that can be persisted                |
| profile             | `object` | User profile information                                        |
| origin              | `string` | Origin information (source of the data)                         |
| name                | `string` | Profile Name ( Deprecated )                                     |
| about               | `string` | Profile Description ( Deprecated )                              |
| profilePicture      | `string` | Profile Picture ( Deprecated )                                  |
| numMsg              | `number` | Number of messages sent ( Deprecated )                          |
| allowedNumMsg       | `number` | Maximum number of messages that can be persisted ( Deprecated ) |
| encryptionType      | `string` | Type of encryption used                                         |
| signature           | `string` | Account signature ( Deprecated )                                |
| sigType             | `string` | Type of signature ( Dprecated )                                 |
| encryptedPassword   | `null`   | Encrypted user password ( Deprecated )                          |
| nftOwner            | `null`   | Owner of NFT ( Deprecated )                                     |
| linkedListHash      | `null`   | Deprecated                                                      |
| nfts                | `null`   | Information about owned NFTs( Dprecated )                       |

</details>

---

### **Fetch Profile Info**

```typescript
// Fetch Push Profile
const aliceProfileInfo = await userAlice.profile.info();
```

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  name: null,
  desc: null,
  picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4AcXBsQ3CUBBEwcfKCfIPnbgxF+ACKIYct+cGDpEdpCeCS0Damcu2PN40gqQaiE6QVAPREWbCTJgJM2EmzITZxJcg+acgqQaiEmbCTJhNQVINRCdIOgPRCZJKmAkzYTYNRLWfT6pjnalu54vOsc5U+/mkOtaZSpgJM2E2BUknSKr7eqWXdIKkEmbCTJhdtuXxphEkvxiIjjATZsJMmAkzYSbMPjaMJNvaf06gAAAAAElFTkSuQmCC',
  profileVerificationProof: null
}
```

| Param                    | Type               | Remarks                   |
| ------------------------ | ------------------ | ------------------------- |
| name                     | `string` or `null` | Profile Name              |
| desc                     | `string` or `null` | Profile Description       |
| picture                  | `string` or `null` | Profile Picture           |
| profileVerificationProof | `string` or `null` | Profile VerificationProof |

</details>

---

### **Update Profile Info**

```typescript
// Update Push Profile
const updatedProfile = await userAlice.profile.update({ name: updatedName });
```

| Param                | Type     | Default | Remarks                                    |
| -------------------- | -------- | ------- | ------------------------------------------ |
| `options`            | `object` | -       | Configuration options for updating profile |
| `options.name` \*    | `string` | -       | Profile Name                               |
| `options.desc` \*    | `string` | -       | Profile Description                        |
| `options.picture` \* | `string` | -       | Profile Picture                            |

\* - Optional

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  name: 'Bob The Builder',
  desc: null,
  picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA0klEQVR4AcXBsW0EIRRF0esv0k2mGhogp4FJ3AC1UMM2QE66AQ24DZIpwE75E2CtbOmd8/H1+vxmcZ2ZVao4vbCVKk4vOI9nY2WIGWKGWOAmVbZS5S2p4gw8Q8wQM8QCv+gFJ1W2esFJlS1DzBAzxEKcmVUv/KtecGLNrAwxQ8wQC+NoOE/2Zmbn8WzsDDxDzBAzxEKcmZ1xNP4izsyOIWaIGWKBm3E0VnFmVuNo7MSZWY2jsYozszLEDDFDLHBznRmn4sSZecd1ZpyKY4gZYobYD0RQL1bKLk86AAAAAElFTkSuQmCC',
  blockedUsersList: [],
  verificationProof: 'pgpv2:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7dERCZAIZdJAfLB6iRYhBK0xCN+/G/tf7pts7whl0kB8\n' +
    'sHqJAADd9Af/Z4DcYGZyQmVmIXM3CSDf2RaJOsEchm3hN93ErvTwGrKiviKW\n' +
    '3/k6HWON3COHqmL5D1wlgZERTqaw3Xft1JC/82P108/IgDHiid4Wo4ojONn+\n' +
    'ZZV6KUfH1i0+wxXNsSvS1XtVYVnq/pQbXi8fzayCYM9jwdiFzBosQTLmXIbY\n' +
    'mUl1OezZ35kPQuZWjtZ2jyATQit6QL0uvQBiGAIevj1LRiB8uQsi0+Xr7R6I\n' +
    'D7WQ0Iwr85OIENGyv1KgrH/1Q944SjamWWI31gUhedH5a+THVLNDJGg3CAfq\n' +
    'FoOb2DNDviovMQxZwUOyCRCxVE6Ohw5Hwkw1YQOvzSwJRzz70l8A8w==\n' +
    '=k8OV\n' +
    '-----END PGP SIGNATURE-----\n'
}
```

| Param                    | Type               | Remarks                    |
| ------------------------ | ------------------ | -------------------------- |
| name                     | `string` or `null` | Profile Name               |
| desc                     | `string` or `null` | Profile Description        |
| picture                  | `string` or `null` | Profile Picture            |
| profileVerificationProof | `string`           | Profile Verification Proof |

</details>

---

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

<details>

  <summary><b>Expected response</b></summary>

```typescript
[
  {
    chatId: '6168440929ced5109c50534d40bb98a5e109ebf1d33df966ae898f002fac8973',
    about: null,
    did: 'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562',
    intent: 'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562',
    intentSentBy: 'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562',
    intentTimestamp: '2023-08-29T08:05:03.000Z',
    publicKey:
      '{"key":"-----BEGIN PGP PUBLIC KEY BLOCK-----\\n\\nxsBNBGTt9AcBCADXjt9OEXDQyE7w2veaHqTUN9fALt7c+cubz2nhWfmD07M1\\n5Spm3ScT/4HdlPpUBYnGUKlCT09g663RvvmDzp8442vZhfYeKbetrcNFxfnp\\n+ePQGiLDY0h2FmjQGkmZGP43ZLyhNT4eCIGPcPSpzaWAKw4wgE/tW2hli5m/\\n7e8HFno+bHp2ycNoPJpdqhY77CJL9zPqFdctCPxI5r1/+xkVLcf+NZ+vD7mz\\nq8xVpu3Tij5Jb5ShDPQ3qqPsqdCcB/fpnEtAOT/Ryuf5Qqic/bDrzImfaIO9\\nYmdnuc6uQBR1s8WbLHmOsQvJhe2D8MtggV5HwHbkPqxXBmpGIJnMeLHZABEB\\nAAHNAMLAigQQAQgAPgWCZO30BwQLCQcICZBvKHl019glPAMVCAoEFgACAQIZ\\nAQKbAwIeARYhBEyKE1gcoT4IIxerrG8oeXTX2CU8AADltgf/dREUaHmfMnwa\\nWwcoGxfya7xeSeqGLWoWsCDg55lq0rf59IFKw59AKL+4kKQrmVDW0x6oo844\\nxBv3NBq7OssNbRr4XYIXJN4oP8g0SdOYinTTcnHFjJcRHfTIa+lmlf7fwc7d\\n2DRW3Kyu66OGq9sLzcgI3Q4Fg3VOQGRDdVGF4zJGjPEpnHsJuGCVnbn5L94p\\nMZHEMIahYrYg2asglSByNUZIH+r0Y8rCzKp8rs37X/Q8RBrmW/oTnE/bb+xo\\n1jHgRR3MUs2Ea0oAqv/TwqpBRzMIWQ8tGKfEaJ22p02FJaE5q9KMbLp0mMIe\\nd33xGwOezLKoK5L9cHKg7wmz4sWvUs7ATQRk7fQHAQgApXcZbj43S5sr7v8d\\nq9JwcXkSdpRuzGw5zyauxUUElq2RLKPvsP8En+OJQceKWQcpvz16xLjnSoZI\\nfgIl1wXUaEb2T45rUrWmnoO+Csy2h6FePNmlHOerY2/C0GHQX3XP/B0t41By\\nG/o4losESsBaHEYugHIg5kXhgsGnlgoC3Bu4zHFmIvLlZXjCWYUG2JnhNHlG\\nrD67/Xuox1FO+Hh/rR7sSsWIH6S+SFgG/P4bwiW0JAYQP6bC4tbXfzvKJk2R\\ndeySnppEAwdn/3lCU5QscYIIUXSaPoV3Q6hg+wRigBk2ixkqdOTJmJROTOo3\\nUdnaeGSwP23USJIUncZWgcIokwARAQABwsB2BBgBCAAqBYJk7fQHCZBvKHl0\\n19glPAKbDBYhBEyKE1gcoT4IIxerrG8oeXTX2CU8AABx6Af/XRamjQ4T79rf\\nhNArQt3VuHvpIUP860MCg0aW5rMtZ8q4+TwOyjiEgOUIFx215Yprb3R3NTKV\\nQWJr8n++ZGDmQ8iro8nrRMRELmoEJzyWp3yr0dyr2lx01//bud+vVw+ARPLt\\nVUnX8eguLKRrltQmIRwCqX01PCTiN2RDB2Akd+zlBGRiHoavW9dDdGGBY9wW\\nA2Pyw73BeMzVA3akiGzLsdRIshO0DBALaX0G5ytqyIf3QjXOqO6C7gp9XW7R\\njXhRhzvR9NjZPmSXEeYqYw2CUPxzaLsKoSP4dbXE7Hl+sYJptzke7LE1StzH\\nG64gRgEYMCKvRZaPXYnPJXAZwDhijw==\\n=8aQd\\n-----END PGP PUBLIC KEY BLOCK-----\\n","signature":"DEPRECATED"}',
    profilePicture:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAsklEQVR4AcXBQY0DMRBE0Z+SCRhCsBhGAJiAYQwBgzGmZuDk2pPDSKPsqt57zNfzTVKPxX+K0ciEmTATZqXuSRajkdVjkcVoXKnHIovRyOqeZMJMmAmzEurcUffkF6FOJsyEmTAr3BTqXKks7hBmwkyYFb7UPflLdU+yUCcTZsJMmBW+hDong5O6J1diNE7EJWEmzIRZqccii9G4Eur8oh6LTJgJM2H2mK/nGyNhJsyE2QfJZChdHLm7QQAAAABJRU5ErkJggg==',
    threadhash: 'bafyreiewla5iyd7rnvjw2c5w6dbab4zkyf2desbowzouijoea2jzakxz6i',
    wallets: 'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562',
    combinedDID:
      'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562_eip155:0x84a9385e9b97df87b80c2e689997133703853874',
    name: null,
    groupInformation: null,
    msg: {
      fromDID: 'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562',
      toDID: 'eip155:0x84a9385e9b97df87b80c2e689997133703853874',
      messageObj: [Object],
      messageContent: 'Hello Alice!',
      messageType: 'Text',
      timestamp: 1693316103747,
      fromCAIP10: 'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562',
      toCAIP10: 'eip155:0x84a9385e9b97df87b80c2e689997133703853874',
      encryptedSecret:
        '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMA3d9z8TNUuddAQf/U2hMcybh5mUt9FFen5tfZ52PaB0vc2G+wYYIsBfu\n' +
        'zg58rgLy8uGMxvzhtCWhpIE91G62d8M4OmaDa+PLjs8SqyRoyih/9pt8P4cw\n' +
        'UJVHHDcJNC9r6/AV4aZySdz5u5utE7o3iB1FU0Sr9HEQsImmOM7J6LZJ3xWJ\n' +
        'V+o4ToLbqUFYKg2uY1kUXpyX+D6JRinagnAosh4zCICLUqrEkKNqbyV2mr+5\n' +
        'FK+fClWBGCwpf38L220FqHYPQ4bQXks0N07yW4OVjVpCTZVuNttr7PIEqcyZ\n' +
        'qIovbQbkltiDpsb/yYysEHTwBtvugna7xMW7SRY34x3iWm/HBNJmfBG7LnjI\n' +
        '6cHATAMrTKobmmcFTAEH/20nW6aNzfj1vn/5GIWjZ5Z4Rw6G3Syt+0NxPUix\n' +
        'dpKIFOR0/BEJkafGMdlk/vRElsyluKbzykBlIQ0hHGRpGMNEW8s8GrJeiXvV\n' +
        'JSNZ24u5DDk8DIBaJWJnyWM7XzgcmOmn9rvVbvc9qgNNgtDeMIZwUpiDipnA\n' +
        '++7n72h0JSs8dWFQ62FSf5ACHC0UVbPiL3TRrRBEo7vQp4JsJyXp70CUclqU\n' +
        '3ANLvNhINV6GGtpXEKnsBVkkg35HR92nIzk+8HL86SsRUYfXkufzXdkPpmRn\n' +
        'SG7MoDecNf/bwoqP8/l2X2h3R1c+WTQFb6Z+eK/NsJ/AnSErFZh3yEHAi1Rz\n' +
        'yIXSQAEA2KupLnBVC9fqZqhUySvOW/Hs/hD6iEEGIl+U/RC9AwdG2jpg4sVi\n' +
        'f9PhBJ5Tanynb3aHngRKtIzjP5m223A=\n' +
        '=5w+B\n' +
        '-----END PGP MESSAGE-----\n',
      encType: 'pgp',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJk7fQHCZBvKHl019glPBYhBEyKE1gcoT4IIxerrG8oeXTX\n' +
        '2CU8AACRLQf/bbeJoUNwRkJYz100R3ULO27HGjKnFeOaMZWRNF8JqWzNmCBL\n' +
        'Cj3aIBkDuCUj7avBsanScbSa7tD8Mc8PZgpSkd22nNH5iHiDJqlPtySJ2KoZ\n' +
        '3ekVXfOgfLlHtN78ghTxABewYQRuB6kwtv3XQW8X9sCL2jEF4NIIl5eXZvIT\n' +
        'nhbHhhOR47k2E0hiHjPv2t3ggrwkrw6ISDgV8qYcrnf7vEFeGHpeSc25QLJH\n' +
        'pXCeeHhH7h4C9L3PEdMt8T+Ne36cfNiwTGdOavin/yfNES6k0kqZxP44hn1M\n' +
        'ZBk4jfyaDUh70mv4FtxdPcdb1TGQsPC1YYAIh/059EBqkdJFhVF4+A==\n' +
        '=DBch\n' +
        '-----END PGP SIGNATURE-----\n',
      sigType: 'pgpv2',
      verificationProof:
        'pgpv2:-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJk7fQHCZBvKHl019glPBYhBEyKE1gcoT4IIxerrG8oeXTX\n' +
        '2CU8AADsmwf/UpJCmnqztJLt1Ltg0OD7xoDvumitRwkfhnXzUdBWxM3i7vj4\n' +
        'cfjtcpQI2R5W0TXj9e2fymimIc98kjUqpDiUIaVAuD0OnEbJdIluGLBTJeks\n' +
        'YTRikqkgjFJT9Y6/2VRQj59IR0rgC0sec8mSKPlxuhixkdSS7Wec0+84cGmX\n' +
        'aieskReKeitKacYkU4Uf82Klc7Ft8+duBsaMGR3TS22PzHfYIHmy+8Z3b1SK\n' +
        'pMyJ8NBXCG2F+05WdoUsXBR+lO74RjSDWnWZlgRngWjjvSXQuZ/QznIyBVmQ\n' +
        'oOxJM5LSCCwH6ch5J/HmXudJG+3wsCINchvSQx0LntZUoeSp8cezvg==\n' +
        '=KUqZ\n' +
        '-----END PGP SIGNATURE-----\n',
      link: null,
    },
  },
];
```

| Param            | Type           | Remarks                                                                                                                         |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| msg              | `IMessageIPFS` | message object                                                                                                                  |
| did              | `string`       | user DID                                                                                                                        |
| wallets          | `string`       | user wallets                                                                                                                    |
| profilePicture   | `string`       | user profile picture                                                                                                            |
| publicKey        | `string`       | user public key                                                                                                                 |
| about            | `string`       | user description                                                                                                                |
| threadhash       | `string`       | cid from the latest message sent on this conversation                                                                           |
| intent           | `string`       | addresses concatenated from the users who have approved the intent                                                              |
| intentSentBy     | `string`       | address of the user who sent the intent                                                                                         |
| intentTimestamp  | `number`       | timestamp of the intent                                                                                                         |
| combinedDID      | `string`       | concatenated addresses of the members of this chat (for DM the 2 addresses and from Group the addresses from all group members) |
| cid              | `string`       | content identifier on IPFS                                                                                                      |
| chatId           | `string`       | chat identifier                                                                                                                 |
| groupInformation | `GroupDTO`     | if group chat, all group information                                                                                            |

</details>

---

### **Fetch Latest Chat**

```typescript
// Latest Chat message with the target user
const aliceChats = await userAlice.chat.latest(bobAddress);
```

| Param    | Type     | Default | Remarks                                                                             |
| -------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `target` | `string` | -       | Target DID ( For Group Chats target is chatId, for 1 To 1 chat target is Push DID ) |

<details>

  <summary><b>Expected response</b></summary>

```typescript
[
  {
    link: 'bafyreibfikschwlfi275hr7lrfqgj73mf6absailazh4sm5fwihspy2ky4',
    toDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    encType: 'pgp',
    fromDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    sigType: 'pgp',
    toCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    signature:
      '-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBQJjh5tjCRBaJmgmByp5FRYhBJC23yBJT2d/pTAID1omaCYH\n' +
      'KnkVAAAZmwf/buPLw6caSZmYnw6D3/p6HF1kWlkGUOTP4RasaU/6dkeDaZs9\n' +
      'SJlz2wC8oOpBGWHMJ/5n3ZWmU71E6U7IKIY793MyIv5t32vTNkwsRHUX7IIn\n' +
      'QFF+FzTIEtHHVTRlnkqNR2YUk1kqcpZCZWHfahi5W2d/WkXlFNdvyyFH4W8L\n' +
      'd03FGhOyXbWwU3xicBz5mSBpIFaaSCXl1SdgJDPXLSk3b65EEOjCOaiz85xC\n' +
      'G+6SW4RUzCGSDcOd9F2EXvvY5H9LgQNi1jjlZn6JrPTPJTJ+wXZXzcZmtOXG\n' +
      'EKcwvPbbPY9wd+gavRSOgYLYn5xoZQW/o3hW7AQlbC5Kj6js48Z0HQ==\n' +
      '=qLiJ\n' +
      '-----END PGP SIGNATURE-----\n',
    timestamp: 1669831523684,
    fromCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    messageType: 'Text',
    messageContent: 'Hi',
    encryptedSecret:
      '-----BEGIN PGP MESSAGE-----\n' +
      '\n' +
      'wcBMA1fn1CNqxQ7nAQgArlo75qe54WerfRKFv1+F9j4NRMvSTgUztvIe51eg\n' +
      'd5MVuj6RYxKERr2bTuBt5cMDJMlNuTnBBkPe4L8+SlsI46L9wmXV9xLoZq1a\n' +
      '94JdxD98RGMF99Jde/3hC/X6GS1yVqPpKPKdWx/tkOPeyqeO/wFF7kqShgIi\n' +
      'Wgq6hGz1fzD3GZhKGY0VSLuC3s0aUy/qw5En1Xd0uX0jdXBl07IIj8p1G2zx\n' +
      '9BuVlksSK34yvIc0RQfCeRadMHkxbA0Hyj31Wrr+Y310YLTppL0s5bQR9APL\n' +
      'WHsIztJ1fHTnXsPhnA7YG0SQpHTyJhuX3rgBjxGrvbZBArmZ+R/Pq9IkOkJe\n' +
      'z8HATAMOsbaZjGN5JwEH/jYjLN6AFRWeaB5CSBSAF+CvHsUgadGmxTdSHBM6\n' +
      'LM9rfGg/MCnpRBuHckA0NNZh+wepq6TDA54ZopsdP14gHj4MKCdfqZr86Jft\n' +
      'ldtjeSgPTFEEJxPMJ4/Z3UeFU9rvOgfxX6l0eHWS0MYwJ3sVYvSyqqHir1K5\n' +
      'TRdEIgtQ3NvLTKkX4bKTSU+SInrvDA+wsc2BcBsbgNhRiGb+XYrbqXBshL1a\n' +
      'lIdpnomkAQgOZMO2n347uURYoruH3OtFeNABJ9D/nEU+LdhDOPGZPefvPBc5\n' +
      'BxK4ExKZ2Wo/TZw8lgC53uqOljsGV63Hp71LkyesKWu5/+vdVrYx/vU63shh\n' +
      'x/TSQAEiaFYEfkWSOthtH0nrJHhkY7FWgjp/1bj/J4J9HCQrVtt2WlQfhowZ\n' +
      'ILxhKk/vep0sJviM3SfJ4hPtoYpZESc=\n' +
      '=43Ta\n' +
      '-----END PGP MESSAGE-----\n',
  },
];
```

| Param             | Type     | Remarks                                     |
| ----------------- | -------- | ------------------------------------------- |
| `fromCAIP10`      | `string` | sender address                              |
| `toCAIP10`        | `string` | receiver address                            |
| `fromDID`         | `string` | sender did                                  |
| `toDID`           | `string` | receiver did                                |
| `messageType`     | `string` | message type                                |
| `messageContent`  | `string` | message content                             |
| `signature`       | `string` | signature of the message                    |
| `sigType`         | `string` | signature type                              |
| `link`            | `string` | content identifier of the previous messages |
| `timestamp`       | `number` | timestamp of the message                    |
| `encType`         | `string` | encryption type                             |
| `encryptedSecret` | `string` | encrypted secret                            |

</details>

---

### **Fetch Chat History**

```typescript
// Chat History with the target user
const aliceChatHistoryWithBob = await userAlice.chat.history(bobAddress);
```

| Param                  | Type               | Default | Remarks                                                                                                                         |
| ---------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `target`               | `string`           | -       | Target DID ( For Group Chats target is chatId, for 1 To 1 chat target is Push DID )                                             |
| `options` \*           | `object`           | -       | Optional Configuration for fetching chat history                                                                                |
| `options.reference` \* | `string` or `null` | -       | Refers to message refernce hash from where the previous messages are fetched. If null, messages are fetched from latest message |
| `options.limit` \*     | `number`           | 10      | No. of messages to be loaded                                                                                                    |

\* - Optional

<details>

  <summary><b>Expected response</b></summary>

```typescript
[
  {
    link: 'bafyreibfikschwlfi275hr7lrfqgj73mf6absailazh4sm5fwihspy2ky4',
    toDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    encType: 'pgp',
    fromDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    sigType: 'pgp',
    toCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    signature:
      '-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBQJjh5tjCRBaJmgmByp5FRYhBJC23yBJT2d/pTAID1omaCYH\n' +
      'KnkVAAAZmwf/buPLw6caSZmYnw6D3/p6HF1kWlkGUOTP4RasaU/6dkeDaZs9\n' +
      'SJlz2wC8oOpBGWHMJ/5n3ZWmU71E6U7IKIY793MyIv5t32vTNkwsRHUX7IIn\n' +
      'QFF+FzTIEtHHVTRlnkqNR2YUk1kqcpZCZWHfahi5W2d/WkXlFNdvyyFH4W8L\n' +
      'd03FGhOyXbWwU3xicBz5mSBpIFaaSCXl1SdgJDPXLSk3b65EEOjCOaiz85xC\n' +
      'G+6SW4RUzCGSDcOd9F2EXvvY5H9LgQNi1jjlZn6JrPTPJTJ+wXZXzcZmtOXG\n' +
      'EKcwvPbbPY9wd+gavRSOgYLYn5xoZQW/o3hW7AQlbC5Kj6js48Z0HQ==\n' +
      '=qLiJ\n' +
      '-----END PGP SIGNATURE-----\n',
    timestamp: 1669831523684,
    fromCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    messageType: 'Text',
    messageContent: 'Hi',
    encryptedSecret:
      '-----BEGIN PGP MESSAGE-----\n' +
      '\n' +
      'wcBMA1fn1CNqxQ7nAQgArlo75qe54WerfRKFv1+F9j4NRMvSTgUztvIe51eg\n' +
      'd5MVuj6RYxKERr2bTuBt5cMDJMlNuTnBBkPe4L8+SlsI46L9wmXV9xLoZq1a\n' +
      '94JdxD98RGMF99Jde/3hC/X6GS1yVqPpKPKdWx/tkOPeyqeO/wFF7kqShgIi\n' +
      'Wgq6hGz1fzD3GZhKGY0VSLuC3s0aUy/qw5En1Xd0uX0jdXBl07IIj8p1G2zx\n' +
      '9BuVlksSK34yvIc0RQfCeRadMHkxbA0Hyj31Wrr+Y310YLTppL0s5bQR9APL\n' +
      'WHsIztJ1fHTnXsPhnA7YG0SQpHTyJhuX3rgBjxGrvbZBArmZ+R/Pq9IkOkJe\n' +
      'z8HATAMOsbaZjGN5JwEH/jYjLN6AFRWeaB5CSBSAF+CvHsUgadGmxTdSHBM6\n' +
      'LM9rfGg/MCnpRBuHckA0NNZh+wepq6TDA54ZopsdP14gHj4MKCdfqZr86Jft\n' +
      'ldtjeSgPTFEEJxPMJ4/Z3UeFU9rvOgfxX6l0eHWS0MYwJ3sVYvSyqqHir1K5\n' +
      'TRdEIgtQ3NvLTKkX4bKTSU+SInrvDA+wsc2BcBsbgNhRiGb+XYrbqXBshL1a\n' +
      'lIdpnomkAQgOZMO2n347uURYoruH3OtFeNABJ9D/nEU+LdhDOPGZPefvPBc5\n' +
      'BxK4ExKZ2Wo/TZw8lgC53uqOljsGV63Hp71LkyesKWu5/+vdVrYx/vU63shh\n' +
      'x/TSQAEiaFYEfkWSOthtH0nrJHhkY7FWgjp/1bj/J4J9HCQrVtt2WlQfhowZ\n' +
      'ILxhKk/vep0sJviM3SfJ4hPtoYpZESc=\n' +
      '=43Ta\n' +
      '-----END PGP MESSAGE-----\n',
  },
  {
    link: null,
    toDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    encType: 'PlainText',
    fromDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    sigType: '',
    toCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    signature: '',
    timestamp: 1669831499724,
    fromCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    messageType: 'Text',
    messageContent: 'Hey Fabio!',
    encryptedSecret: '',
  },
];
```

| Param             | Type     | Remarks                                     |
| ----------------- | -------- | ------------------------------------------- |
| `fromCAIP10`      | `string` | sender address                              |
| `toCAIP10`        | `string` | receiver address                            |
| `fromDID`         | `string` | sender did                                  |
| `toDID`           | `string` | receiver did                                |
| `messageType`     | `string` | message type                                |
| `messageContent`  | `string` | message content                             |
| `signature`       | `string` | signature of the message                    |
| `sigType`         | `string` | signature type                              |
| `link`            | `string` | content identifier of the previous messages |
| `timestamp`       | `number` | timestamp of the message                    |
| `encType`         | `string` | encryption type                             |
| `encryptedSecret` | `string` | encrypted secret                            |

</details>

---

### **Send Message**

```typescript
// Alice sends message to bob
const aliceMessagesBob = await userAlice.chat.send(bobAddress, {
  content: 'Hello Bob!',
  type: 'Text',
});
```

| Param                  | Type                                                                         | Default | Remarks                                                                             |
| ---------------------- | ---------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------- |
| `target`               | `string`                                                                     | -       | Target DID ( For Group Chats target is chatId, for 1 To 1 chat target is Push DID ) |
| `options`              | `object`                                                                     | -       | Configuration for message to be sent                                                |
| `options.type` \*      | `Text` or `Image` or `File` or `MediaEmbed` or `GIF` or `Meta` or `Reaction` | -       | Type of message Content                                                             |
| `options.content`      | `string`                                                                     | -       | Message Content                                                                     |
| `options.action` \*    | `string`                                                                     | -       | Message action ( Only available for Meta & Reaction Messages )                      |
| `options.reference` \* | `string` or `null`                                                           | -       | Message reference hash ( Only available for Reaction Messages )                     |
| `options.info` \*      | `{ affected : string[]: arbitrary?: { [key: string]: any } }`                | -       | Message reference hash ( Only available for Meta Messages )                         |

\* - Optional

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
fromCAIP10: 'eip155:0x84a9385e9b97df87b80c2e689997133703853874',
toCAIP10: 'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562',
fromDID: 'eip155:0x84a9385e9b97df87b80c2e689997133703853874',
toDID: 'eip155:0x14727F96dF61105661E78275D1A03C4F8aeff562',
messageObj: 'U2FsdGVkX1/S1wljx7jN0NXJzSNoJCkg/6cw7gHwVibLsqyhpe/XgzJi7OUrXwUh',
messageContent: 'U2FsdGVkX19oSSMVZpQdw+jZRExfd1GvJkIwgWAGe5g=',
messageType: 'Text',
timestamp: 1693316104031,
encType: 'pgp',
encryptedSecret: '-----BEGIN PGP MESSAGE-----\n' +
  '\n' +
  'wcBMAytMqhuaZwVMAQf+KkUcX1rmNnorm0bCeGPknnjMBFn2wQ4nIAbQV5cW\n' +
  'W7bCHneK0V0+kpronJwuPb8e8GUZiJEmJGdTJYf3XMVP8sJkVVVQEbvYvAJL\n' +
  'tUEsdqgqRuqGB+u4k5shtlHN1ViTjjc1N97C0eQUqTCVFKa1Ul9eZirhDqiI\n' +
  'C/rj8uxESy+NH7o/nnbGTlwQonOOLLHfGH2zCpl/F59CO2CcLnuecfDT0WxJ\n' +
  'xi2hM/ovKgbsKVI8WOOde0sIV3MQEvxAFuPJ8gINpoDA28Ty+lf7x1bN9ONN\n' +
  'RZl4yjLpA7KUojWyfjp1/UW635NY11aZYEXIygDppCCvf6AE7je+1FDaVR/B\n' +
  'I8HATAN3fc/EzVLnXQEH/1H4r6FubywzPzRlDJzPgxyNpNGPZbexrWRQT5U4\n' +
  'eHmh7EsOfEattUCHb8zChL8crnX0CCw9MiN/ryfs9PXXK2qP3lFU59GUHd9q\n' +
  'Mz3RQwF76M9C8zbsoUymIPXUypBBma/qsF8MK54qYoVPody6T3u7bEfW6E8r\n' +
  'nDtlz62+G6wk4sNE7iJsk6KhGmb1t9v/j1qgmJwuE7zGP0QjSuquJsfkzUot\n' +
  '1eU85XnUTGdoYBR2u5F2TsjIHn1ex2R0sZYfdc9eRNSSvDHrce9m7R5p7Y5F\n' +
  'sSs96Skx7wLuepGt/vY2cH9Mq3AEGaXREV2NSr453+gHeTupp3aIiQ2CDpFB\n' +
  '/MzSQAHCPW1DUf8r1cFE1Y1RXU15gNBeFju/ZBnpDlTbj3xXi0shafcl59pe\n' +
  '0LTGhdDSYPX0Rs6zqJgex20XBnfgPD0=\n' +
  '=ycNl\n' +
  '-----END PGP MESSAGE-----\n',
signature: '-----BEGIN PGP SIGNATURE-----\n' +
  '\n' +
  'wsBzBAEBCAAnBYJk7fQICZASd4ccCgkrMhYhBGLo0VO3qtKBG9Y0eBJ3hxwK\n' +
  'CSsyAACktggAr3mI2uwn4m4sI7m8A8wIRgjs6h8V7d2feLsdqV7QL6aUzYld\n' +
  'bewZYKQjSXdnklRtnlCIG1jmqFOCycv++3O5jcWY+du8lR912Gkjn0PDN/wW\n' +
  'jSBDTkH0IKmIrYqIDnfbxYoUfUxAWXzm8N0LgVnA+qgs1CYzcS8S38zAONvH\n' +
  'GBl8ZXNTgY5HYN3Pk74wms5jhBF1J7mtfMCNN8k7VHFaoC6YVF1REhwrSlxx\n' +
  'l4bajYkJJMWfKdiQWQ31kSHChzKXBhu2rIWJ6A7ijyoc7Ff0s4xgwm/3cLQc\n' +
  'hrlBpkMKI2xCDnP10Sr1sgmG7ropd+tCOFwsoEWqFqt+kJ592+g1mw==\n' +
  '=TVDb\n' +
  '-----END PGP SIGNATURE-----\n',
sigType: 'pgpv2',
verificationProof: 'pgpv2:-----BEGIN PGP SIGNATURE-----\n' +
  '\n' +
  'wsBzBAEBCAAnBYJk7fQICZASd4ccCgkrMhYhBGLo0VO3qtKBG9Y0eBJ3hxwK\n' +
  'CSsyAAA8/Qf/Qvcom0DtPUQAOWkM+FCeBttjkCiM/ekZa1Gxioyy7jT0Baoi\n' +
  'oUi8y4BpmjKjCvUGCDovcvvnjeLW8gpqunN/LOx1c4mPsgFTU0IQFqZmTtZK\n' +
  'KMa+p/uiTXNnwx9635FV8WLOWQoyJP+u76rTu8n2YU1+5+N7xan9Wl+yuu4d\n' +
  '/WkFwAq/WQjW4cgIZ08OWfNGaOh6kt3ceCvR25XVbb8gdMPOj262d7RuWVqs\n' +
  'L31XJ8U/EkKZN5AxIB7AP6HKhZhlV6qbgizVFskWefT4E3Qq+9WLn4ApHf2R\n' +
  'OksjHVbukZNbXrWeMjbZE9RlswPCXM68WsxWe1zItjXs63w1mwoQZg==\n' +
  '=e9QO\n' +
  '-----END PGP SIGNATURE-----\n',
link: 'bafyreiewla5iyd7rnvjw2c5w6dbab4zkyf2desbowzouijoea2jzakxz6i',
cid: 'bafyreibhnilz634i55hdkrkp3j4vt76dnyegvmrezdiuykeizq7unvx7cy',
messageCategory: 'Chat',
messageOrigin: 'other'
}
```

| Param               | Type     | Remarks                                     |
| ------------------- | -------- | ------------------------------------------- |
| `fromCAIP10`        | `string` | sender address                              |
| `toCAIP10`          | `string` | receiver address                            |
| `fromDID`           | `string` | sender did                                  |
| `toDID`             | `string` | receiver did                                |
| `messageObject`     | `string` | message obejct                              |
| `messageContent`    | `string` | message content ( deprecated )              |
| `messageType`       | `string` | message type ( deprecated )                 |
| `timestamp`         | `number` | timestamp of the message                    |
| `encType`           | `string` | encryption type                             |
| `encryptedSecret`   | `string` | encrypted secret                            |
| `signature`         | `string` | signature of the message ( deprecated )     |
| `sigType`           | `string` | signature type ( deprecated )               |
| `verificationProof` | `string` | message verificationProof                   |
| `link`              | `string` | identifier of the previous messages         |
| `cid`               | `string` | identifier of the message                   |
| `messageCategory`   | `string` | Category of message ( `Chat` or `Request` ) |
| `messageOrigin`     | `string` | `Self` or `Other` depending on the receiver |

 </details>

---

### **Accept Chat Request**

```typescript
// Accept Chat Request
const bobAcceptAliceRequest = await userBob.chat.accept(aliceAddress);
```

| Param    | Type     | Default | Remarks                                                                             |
| -------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `target` | `string` | -       | Target ( For Group Chats target is chatId, for 1 To 1 chat target is Push Account ) |

<details>

  <summary><b>Expected response</b></summary>

```typescript
// Combined DID for Chat
eip155:0x7a38D295786d1480BAab4a63b8d85B5a47bA4b78+eip155:0xcCC0Cc5081A135E4269E82907d2dAD6728ea4159
```

| Param         | Type     | Remarks            |
| ------------- | -------- | ------------------ |
| `combinedDID` | `string` | Combined Chat DIDs |

</details>

---

### **Reject Chat Request**

```typescript
// Accept Chat Request
const bobRejectAliceRequest = await userBob.chat.reject(aliceAddress);
```

| Param    | Type     | Default | Remarks                                                                             |
| -------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `target` | `string` | -       | Target ( For Group Chats target is chatId, for 1 To 1 chat target is Push Account ) |

<!-- TODO : Confirm Response -->
<!-- <details>

  <summary><b>Expected response</b></summary>

```typescript
// Combined DID for Chat
eip155:0x7a38D295786d1480BAab4a63b8d85B5a47bA4b78+eip155:0xcCC0Cc5081A135E4269E82907d2dAD6728ea4159
```

| Param         | Type     | Remarks            |
| ------------- | -------- | ------------------ |
| `combinedDID` | `string` | Combined Chat DIDs |

</details> -->

---

### **Block Chat User**

```typescript
// Block chat user
const AliceBlocksBob = await userAlice.chat.block([bobAddress]);
```

| Param   | Type       | Default | Remarks              |
| ------- | ---------- | ------- | -------------------- |
| `users` | `string[]` | -       | Users to be blocked. |

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  did: 'eip155:0xdE3CA2cC2c91Cb9B3aDB80ac497662Dd9E57BFaA',
  wallets: 'eip155:0xdE3CA2cC2c91Cb9B3aDB80ac497662Dd9E57BFaA',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGT29asBCADVtp8rHsmtqgUSHxutStJ8AO78jWFFerHJQQ7M/QRZ/1mg\n' +
    'uDTt4QTsmhNPlyzQ/OztVDOddn3qqZg4/gLUpJclMmR3UmxmTGrv9PaL9IOv\n' +
    'otdKrLlYKeXUHbaBWVgXHv6F7hrCx1Faiq4I5Ca8tdxhKyQc9WAA4f7TTxhg\n' +
    'htDY3VfRnp1LFlXyx8GyqCBGpmQx3tSK0w6SoC0FdCq/DpaXD6ofIKH8kcjJ\n' +
    'vpBXw6MLwymZrfzbUtYWykOZ7QWgDWF6Y0xjDjZvlajGeY7NfciQR+2ylb1r\n' +
    'eOn1yGN0Fvw6+7gGZy85XaDoCnyDAws0Nn+2G9BqTKVH0UwweWKcqOtbABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZPb1qwQLCQcICZDxpr16PpcWmAMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBDqZlQ8vQkW6qMko3/GmvXo+lxaYAAC9AwgAy6nLLykcdRlW\n' +
    'dPXUN/wTqowopbuRo5bMhz6+Q53Hf6qkjfknaswoBtE2bq/J54N0BN70Lv+j\n' +
    '5klfjZWJF2stgMEyQfPbXp1yXQi9Rlmvg4qZvZRww5UNm6CuqxU/stXQK/Je\n' +
    'N9eIqd+fTB1EMKwbFrFHfOSKWK7OGnb6fi6JqofJcGvA0Oj1Wkf3i6UohsZL\n' +
    'XE8L1Ku2IXc4oUZH5UZD6vRYkQg6/EGq+WrHUXX2nifdK5b5tGZcfGe6Tudm\n' +
    'KeYFGTGfgbA8ag67nD4Esr296Mjjm06TTvqdo2r28/zn5KcRPWtHNpPU+t2u\n' +
    'kwq7UBvoroACgr3yZkdAFLt9E5NRTs7ATQRk9vWrAQgApfSeqUx3ob+kinzU\n' +
    'opKC8L9qV6jqkYu80coITufcc4TUEYlNEZwSaMRA+vOk+bwWbc+zJG7zW8aq\n' +
    'Tx0LyZqABgRsWOsNblepCzyejLmAwxl8kBEAMQvJ4Hjo55MGEjfsIFSqeEGt\n' +
    'PkPZBpxYN0/sB+yYZDt+59L0GGLC0vrxvj9aLw1xRaTNCNLkawTa8vTCwSTY\n' +
    '/833aJy6kevAXzj7V8hOGnY5JU6dx5Wbsi1HmzuhtW/lG2n0JtYokfpESnQ7\n' +
    'La8I9PqpJC87iFEdt7MST2x687sf0vJI/QMRQ2kZF6Pi8LRYuMmrYTF2BIaH\n' +
    'kmPafAoy8BYNfetl67EArGHckQARAQABwsB2BBgBCAAqBYJk9vWrCZDxpr16\n' +
    'PpcWmAKbDBYhBDqZlQ8vQkW6qMko3/GmvXo+lxaYAABjFwf/epZQQVs6w3Fj\n' +
    'JV2OhS5PYsNr7hWAgAVTgqBLOuPkWG+yfwmayqyQKJmr3a/e+1wKC+Mrz1D7\n' +
    'cRpyiwyiCp01has6qMAledjGweg5wTz4axMSQn/KsLc7dsLOtccV05RkRPMZ\n' +
    'vRDDJkfIVYILBikTcg5WEIulGuy7enQO+Mo239WrUxi2QjAkEMt2pxjp4qNM\n' +
    '9vMEPo8uUiEj/+Tsq15kbE5NGpL+n69R1/PYpHp6R7acimsZlXqyhUVaTD67\n' +
    'QDFLdR8nVToU2ACOvmJicTVHCiDbRfeUgMaaTu45degUEE7rbh+dNiJrkyFh\n' +
    'GCHIKjRcKEpModMxiZSJBINcWI2hlA==\n' +
    '=ktHx\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  encryptedPrivateKey: '{"ciphertext":"5d3b651b63db81767bd7b9387a085c0134a30d2c77545b4db528c15c429286620edf527b069d4f90fb7e7e769c6a0fff19f52676972765881cbb601e78f386cc492b6ff7a4739996148904dc09f4f95ebbd53ee4e0f17d17dac66aa5b11e09daecf307b120f5d1157465ef15114b0b20642d7b64d45a218307764bf48c819e05247db0d782745d458e5ca574f92e0479188d5ba557201d58d85753f2619fd1648a80f8153e4847b7fa455e50379b096b4e430fb49b3084441a08f715f3b99c722e5a6b730ca8c2160075594caf3fccc26bc9289c116751e4e8306cf33b96a60bbbe46bf4363dd3b25529ced93c67ec60a153331fb340d2344851ace937dc161dd9aeef20dc71a6afd7cf308d8f4c05e9c779bf5d684fbc4620b955b0aaa80f89287c197f2f4b00b5450b55770ca1d44c8a78583762c3740dc88fe122afbec422e64842ae9719d21334d0289718468d11a3cd12373583488da7631f924c9f1566c6eaabcfc9f146fa50e49986300f7e7a3d36d0056c381f6decb38b10ca291a747deb0d896168fee9279b5bbd0ffb7aa419843d1f69da632552aa885ad694fe8ab50fe0bbc79ca4980e522d4b001215bd267752340f02270d05a5ad8673ef998199b1b0e6930cc53c97a14245ea5355e10a438513a94bdcab49b4aa605277ad11ba0603ac59d6f2e1068791a61b4531d55c55837bf43299524e5c4ff454631eddcdab0f036b70985e49f155bed3bbbc36f9e69b6c411077051c2f3083354160146336f7d023b51b8091b32cec3b0d8e5dd67f3796e00472d1b305ad3f861b6ea863deeabad29bac8dad1ded1a59fdd965ff5903c7dfa1ad956a4264e2227ffe9bd9e15ce7eb48c0a6494c07a95865770adacc94703c19f4c1aba9bf885d6311490a285d42a6e8899de07709e176a30dff3e8988de3f22188d0adf03bb633607ffd4daa503b7121a5e5c3946bf3a48d62d511cf5518ad94b43839827af07faf9037bc959a7ef621df75ad965045dba6c89ae255d200ebcfaa0a2f652ffe630df57685eb471c4b089ec6e7d4c841f1e2e25bfc3b852cf79c4fdf66327a18302fdc10c6f044e42387bb89c45644643546e93324b8ef4d7ddb6016457f5098da369915ac6e1d2ef45fc9155cf13d165d7822bc6e463932cc69ac7b372a0e3b18c45b45bd275b38af4b29d665856dfbd6e6c6ecd9b6d02f4e61308273d76ba0baa0eaa03ad831adb428ec70a1dd29b3b2c4941adfddaa76ac99c47bf6eef92a361ab890c3e9bc714263a4f93289cad7344882886aa101685586a54e5da7d370449b91400e48c6a1ae8f6e2bcc06fe186d981399c28143a3faf1cf2c06342b82382c01096ff8542ef55c24175d052f199fe39a4ebf39c56bd30a8251c19745d1b9d0a1a96d81e6cff3c060d00d85d627a9344e1ae98cb42c1f05cd2dd9ae3d83b7974a7bf96980c33fcd76f96ec6c2ea11a2348026333424307f1568e5aa575c31f819260d52ad968e9a17cc46723ba1e129614d2a47ece4dde0e0cf4bce2be7ab25441255997d8bc659a194665090baf6e071dd4775b2e2f7974d26e0cd040df9890ab58c77732d6e33a8ce909e965c2f04a7f65ab5331c044cbbbe39184721310235a772b30a30071a8058b9941f42d85c2e63bbfece7d6116a507bf1612194ed17f430274e4053d2b8de761cd6c316f08c401c66f1650d0e83fcd0d69dc92763f8202748d8e40bacae6cfa264d8ab19ff86e1753d3a33c3ee9b4b9fa6ef64765e9d2b2ba52b28e61743aca96471e6c35143ac8238275b504e7d0ccf0c9cec095d02259849b5f382fd7eb0b7fa3ddc0c5dd91cc2be7829948852dc740d9227f17b2f960141f4807678a2dca6ee24a858a6f20874b1b8e35305106c77c38dbbe52d3e533a845dc8a0912c7d95218c6b820384de5c2693447529522df552383e35d126122801008aca30065c8f93c8556ceb09f5512e64dd481d5ae823675c201124759a80477b1be6ff4756e94e814b279f4de19b79a72acc52d0e1d1e9119abbcbaa1ef0c6dd50894db4ee5f4c005658416fa840f19e36b65c591e73ac8ae4d9e49ac13dfc40d754cc4f9eefd327876a94e5a72f6ebcc8bb4645f6da8a7505d64190ef400829be6455737fb60d595ab13cc9d8634514675803693402570ff869858943c4cfaf914402153a41bcbf417be30c8220ff994d48d85a2893991a5241d407e6acf8341d11bc72de3967720238b218052580d121c6d2d01e788d6cfb2bac26ae205e0e72198c40418bb6e3f25f0e14f03d237bde9efdccdcdb2659a40276ac760a4eeb0770bdff49513b88e51a649bccd82da5c82e6c50a91cf9145091f08bacf7aee46e80bdaeb320af371d6e6b6bc29fab41df2c4f09953c0efa3b92f0745c9480536680d60fa0badaaed85b8836b5e5e54c5aebfc99e2a3b32ad3a5c882829b55e9d80a33468b05e8196c408a9de4a13af00df4c9b632eb4d04372c99c8020fad56383cd4937088d2fb4e7a0c4edc15e3bd79214337e02fc72cfa703e12bebc396068da9eb6ef142a55f6eefd8d11a501c4c6610c808a75923e2b279a2809ca34c2da49731ce85756a7039b667cafcb081693375f4cf8e1b39aa5f29560d7ca003775ad5affc621c359198a4dfe484edb11853586c1c664459c996457454803fee7350786410b8b9d81bc0e31f4426760ef812ebb49b1a63612c3c3249a0dfea9b50b620a818654bc18bb3f411024ef9ef7fa21a494f359473bcb30c70070b78ea9106d5441dd89322ee2a31c945b884ee9008841ca8dc776aaa6c46526e6a21ead1831b20697b75905a13dd947ee53e6a105f0bccb3184f679b05c475f5294d96a16fc50dd9430967a1c7013c054f3fb0fe07c586c5835b048238fd1effb7bcb6ae6da40883f387dcf684ac20709c59a312507d125fbb65208a985f0a6f5e2e442330ce39c0503d27cd32d61541f99e1d20b2314e830f3d03918be89152a0547a45ba0a419ef6beccb83b444c8081fd12c79f8d88ace21c9057265b351a7ed8588560a9f549149b1e2fcacf99fa6cd045462122a4f60d969fdc7d780465349fa359c95a5b58a9e2b751e45301696407a1ddd17c32dc7bd5acc3ce09ff5ad20b9d91a9ac8eb3d142bb6907f19b789cbbe15a2a34469e90a652e5504228f12411a4ef54abc1c1d9a132ab85e42f1dbe2c14eab46532f22fbad0e912911f44510c10569a99a0a99f774070178776a970d83bdf50257cb6ba08ba6561b16535b1e05c16a06bf0e3b29b082f66b8336e676cb4c6e9bf98362b631173f683d251c4866e49860fb83f4053087f44c033198397ffb69b7053746ba150e16399c2f064967334f893125de76539730211f8c6edff3108db2c7e8641fc50ccb9946596b59fa425265ec86db50414218b494b5166399209a1d664d2157da0161d9786396dcf2d91f9433d39219d35f6974c96e4f1bf5f5e0a17db196e97dfff13e58131ffcbe3a8a647cb6a17754657b93e9b9cb458b9bd1d8cbbde72cdbccef7073ab2c290e237423b8053a5cbf358a88d1101e1f648c392c80704c7dc9d0509e186a11a9d90e9106bb1fee1883af0daeed804702b9e2384ab0c519129ae330914ade6c5080f6a2d17b716f71d81c352c07c2cca0c210e0d951b0fefecbb00ff0c3693fe262cf9125094b46329eed041d3801025ebb67722659b98d3e5da83ba5343a058540e868742ac36c852f26b3310bd33af4884d3e51e046c0ee17b714ce1f29df6442468791a469eb1e387cf9d366d24b00aec6a089a88c96a82a1ff71b1947a24015b1cc13be259be5bb75731a18ca58aa46609e2a2ee9fe0583588f0c453a2b99166831669547428941bda9a65ab82462de8add40f16976a13e36a0018886d27b4cba663369d13fb056a874f6d5e0e9ee6567ce7428d9e179790b44649a05aa8523fbda4b9db72873e9aba33892bc0677339332d5da9b3b4754e2b387597d8405de304d8b65ba6bba9b0558457431820582df5ae3577efba787ea3b4eea2515cfba590c7821d2d47ada99c612ed4e3b9d3ff9ced63e76379789da562f45f851bd10e8e6d2ef633984ef4bc6bfdb4c833175448c3c6f1f7735587b6e325866a21b8d02cda06e9520d18350e38b428b3949635dad18cccd4d840d9e4c872b32c527d2f521de3822565b7af6f5d8e254bc142029faa91effaaea2ce70de748eae946a2521d3b5952d5874e5bd6c4322a35660b51ff114d5cf6c5b5fbaacf834eb1eb68087ec06668dbe804d349b1d5bd3396099f3062982fdb9a6afe542c8529752c728501ddbed65a210a28f351f3f44ad40d3a6ce4995f2e6da7495dfa40a4838fd2d808b2e298a863a7475c2134a713cfe8a47fb5bd479891c2747f0db0005ee4a894b6e8b66cb5e1af8d938fb1f5f53c24aeacbcf25b57b83c5abc3a1adbf7853e0a6ed5904e19d5d824b1500296550589c4a3186359b72a1d482b02dfdc1874e64c78a9df7097696457832d6aa572102000c06af444c8ab83e6204ea920a2a847cb163efd9a4701148b4009b2f8053bd7d6408045f627df3f45b002d249a20dd829cc8ba18d9c468d816d451b7f3792e31f360c5932656aa7bfae55b75ae0c40af53ad33005d065d047926543d68e9548c51c3d5405a164b902825fa5ba8c8be5dbfe8632a94df6ae322425be86df9234140bbeeb707d45dfb4b64a09925499ddd2192ad1174776f006f3e91627768f60be59756b7a9b51e4e4e02c01a7fb8b06e63dc3e71951e0b426652b1796bf546da832ae70b055a4700b3d6e266f4af898f0f517277db75aac827d6c30f75c6a6fc9fe6ef67e6f3fbf9c21f731f1f5d89feeb1a76c7ac9923320eb56c517f937a32f3629a8fb4f134a499562f837515596508cf6b2ff3de5c536dedf2946b85505c5843d09bed34","salt":"7b0c5813b930a5ab6713f1572441734633ec845aaebf526f1daafbf89ef268c4","nonce":"bf2c1e6312caa6a32e95eee5","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"fe71bd49335560367aee6772233e69316de48378df6ed104647068e8525d2c4e"}',
  verificationProof: 'eip191v2:0xe58171978843f55fda11f3989ef8a2310a3366585cf3ba6c71dc260e362bea1b2b2667e287959f6f79628a03073d5757011b7161a2782c32290f924486f87e0a1b',
  msgSent: 1,
  maxMsgPersisted: 1000,
  profile: {
    name: 'Bob The Builder',
    desc: null,
    picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA40lEQVR4AcXBsU1DUQxA0RvrK3JJReE50jADEpTZwRUbsEIq75AS5sgcnsFKE1orxUMRSD5n9/n8cqMxV7qMojNXVjKKzlzpMopOGCYME4Zt3Mko/lNGsSIME4YJwzZ+Ya48wlzpMooVYZgwTBi2ccdcWckoVsyVzlzpMopOGCYME4Zt5spKRtGZKysZRWeudOZKJwwThgnDtoyiM1c6c+UR5spKRtEJw4RhwrDNXOkyiu5yPdK9fXyx8n16pzvsz3TmSicME4YJw3avT6cbzWF/pjNX/iKj6C7XI50wTBgmDPsBSK85Mi5fmXwAAAAASUVORK5CYII=',
    blockedUsersList: [ 'eip155:0x30d45C4aAfDB894Dc529aE15e7A55fCf49184eCf' ],
    verificationProof: 'pgpv2:-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBYJk9vWtCZDxpr16PpcWmBYhBDqZlQ8vQkW6qMko3/GmvXo+\n' +
      'lxaYAAADJggAoSO2WXXxPtkFBMcM2Bqc9pzBFkklicmWj3Fjl+6FB3sDXt3V\n' +
      'YGNDqSruqpqoiCpMATy9QC48zO9Bj/gbIzuIbLRvNs9M3D5e0si4/OHKIbSX\n' +
      '3dBiaqaLdki7tUvtPioQ4Q1ZkdOATr3Wr/PyrHc0V00fE64qb0MlN4ouvYYf\n' +
      'yG4WK/0x0iH/RPRyG60fkrsmZa/PPpRBzReZXwrsVbBoOCBSe6f9s3EYTfim\n' +
      '4ThX4zrbwKXx7Wgv1lXw386jvlaqUze9A14DAq6OjwqAZEVmLZaq6r/OHmqM\n' +
      'Jy4fZI2auG9uYDorCxP7n6RjOSEOCLG8k+WRDFn6LSPJpdrYoYi6MA==\n' +
      '=d+/X\n' +
      '-----END PGP SIGNATURE-----\n'
  },
  origin: null,
  name: 'Bob The Builder',
  about: null,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA40lEQVR4AcXBsU1DUQxA0RvrK3JJReE50jADEpTZwRUbsEIq75AS5sgcnsFKE1orxUMRSD5n9/n8cqMxV7qMojNXVjKKzlzpMopOGCYME4Zt3Mko/lNGsSIME4YJwzZ+Ya48wlzpMooVYZgwTBi2ccdcWckoVsyVzlzpMopOGCYME4Zt5spKRtGZKysZRWeudOZKJwwThgnDtoyiM1c6c+UR5spKRtEJw4RhwrDNXOkyiu5yPdK9fXyx8n16pzvsz3TmSicME4YJw3avT6cbzWF/pjNX/iKj6C7XI50wTBgmDPsBSK85Mi5fmXwAAAAASUVORK5CYII=',
  numMsg: 1,
  allowedNumMsg: 1000,
  encryptionType: 'eip191-aes256-gcm-hkdf-sha256',
  signature: '0xe58171978843f55fda11f3989ef8a2310a3366585cf3ba6c71dc260e362bea1b2b2667e287959f6f79628a03073d5757011b7161a2782c32290f924486f87e0a1b',
  sigType: 'eip191v2',
  encryptedPassword: null,
  nftOwner: null,
  linkedListHash: null,
  nfts: null
}
```

| Parameter           | Type     | Remarks                                                         |
| ------------------- | -------- | --------------------------------------------------------------- |
| did                 | `string` | user decentralized identity                                     |
| wallets             | `string` | all wallets associated to the did                               |
| publicKey           | `string` | Public PGP key                                                  |
| encryptedPrivateKey | `string` | Encrypted PGP Private Key                                       |
| verificationProof   | `string` | Verification proof                                              |
| msgSent             | `number` | Number of messages sent                                         |
| maxMsgPersisted     | `number` | Maximum number of messages that can be persisted                |
| profile             | `object` | User profile information                                        |
| origin              | `string` | Origin information (source of the data)                         |
| name                | `string` | Profile Name ( Deprecated )                                     |
| about               | `string` | Profile Description ( Deprecated )                              |
| profilePicture      | `string` | Profile Picture ( Deprecated )                                  |
| numMsg              | `number` | Number of messages sent ( Deprecated )                          |
| allowedNumMsg       | `number` | Maximum number of messages that can be persisted ( Deprecated ) |
| encryptionType      | `string` | Type of encryption used                                         |
| signature           | `string` | Account signature ( Deprecated )                                |
| sigType             | `string` | Type of signature ( Dprecated )                                 |
| encryptedPassword   | `null`   | Encrypted user password ( Deprecated )                          |
| nftOwner            | `null`   | Owner of NFT ( Deprecated )                                     |
| linkedListHash      | `null`   | Deprecated                                                      |
| nfts                | `null`   | Information about owned NFTs( Dprecated )                       |

</details>

---

### **Unblock Chat User**

```typescript
// Block chat user
const AliceUnblocksBob = await userAlice.chat.unblock([bobAddress]);
```

| Param   | Type       | Default | Remarks                |
| ------- | ---------- | ------- | ---------------------- |
| `users` | `string[]` | -       | Users to be unblocked. |

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  did: 'eip155:0xd1790E37fe3459e3F48eEEe41a7708a3eC2148f7',
  wallets: 'eip155:0xd1790E37fe3459e3F48eEEe41a7708a3eC2148f7',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGT291gBCADFq+sw1v0dNAqkG7bMUZy0tzo3E6iPZQ5UwlOvtzaen2md\n' +
    'OHOTnvaCFRjRQZjrvlmbWwBELOTsHbmluA41MeayoJ7aA+o6+aflaa6PCUG5\n' +
    'ugAfXjuQxPn+gK0hFdn6IYxvBQHdh+Hu0Obi4peol1GobzraVZt/fRrXdttA\n' +
    'tLM7EmvX/l5440xO8+kZ9/uhMx5MR6fdD32AWPpGDy6tJin4awSdTN4eIwI4\n' +
    'ueKUZ0+B4wWAiEkRwIRWY4vbCCfMeF+qNMGBaz69I+YS/2FvyqAXTkyKytt4\n' +
    'U9efp+ObJsNGk8OA2JWZE+X/16eO8xvQSHhcoH5L2ahGTmG8+xr8bFoRABEB\n' +
    'AAHNAMLAiQQQAQgAPgWCZPb3WAQLCQcICZDzsIc63rzcLQMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBLvWJU1IWhvs+frC7POwhzrevNwtAAD9Awf2KFgMZaNyYeMO\n' +
    'DNojkd6YpwtXGp4zxxL4JrZwDBginbcba4oUyTAqIcJWe3BAGPXX4hi3AYjE\n' +
    'BIERstIeb/YkcTyRgyZKDj7tDNPF0itxfiUXAETN7Z+ySkLWx+5rQ8B9VQv5\n' +
    '0PLDDwBfwju2pp1/j8XTx/81PSjVKpFQoEsEPOj+WloOdonzx+SGcr5mjjYj\n' +
    'rR9NpHVUxi3Xx40zJVVqWFbTdnqd1Wm5SGkrRWLJAe1hzHhYxtpEDGqPfxYo\n' +
    'bBMe7bphBkh4DYWuemj/2PiZaS8NC1ed32YOwOSWJV+9wmUvIvq3Q08AE2yF\n' +
    'tfeNnX6Gb6fDgvPa3Y1Qg/0S3wYvzsBNBGT291gBCACqFMmyuJkBkNwwpNE1\n' +
    'L1bJLulRqEm/tCZ2HY58G9NGYgo6u9Ii8H+ia42bf9Ezq4fLBDzYH0T6Pe9Z\n' +
    'zAQHudpId8SNfT15QdqYvHjovxk7jqucF/+W7+DilPXZn6eomrOKePCNP8Cg\n' +
    'JXSoShkVaWkbkr2UkHGpcU7YIvooAtsxXMWWr1Z3hbk7tCf1uwXV4NlAGIXx\n' +
    '7FSvWuQ5ow21GqM/6HyeOzbJRis0DNV5NHY6uUoFNUNzPPBBYx8DRDzjmmde\n' +
    'KpjialSW5QK7g8KlWaSGnHFCd6eS7pHZURl1l299ONNJ5m/B9yibBKwHCQ3r\n' +
    'V/8ByDlxzjU3wbgdZ7+LfjitABEBAAHCwHYEGAEIACoFgmT291gJkPOwhzre\n' +
    'vNwtApsMFiEEu9YlTUhaG+z5+sLs87CHOt683C0AAGnNCACtFS+hJSnqZDmf\n' +
    'XGSIw3FLkD7OsaOd/75BZ+cqXnfE4is4JlN7IceOHb/9+UlghAOfpjJYfn3Z\n' +
    'HobaRnUZTm8unx0uVQZ4PEZgPGuIKjnwmU75xZVpYegXTE55faiDoQZp0Kir\n' +
    'zyScqaIuxHGkuW5Ii4hcLXKBK5qKv8cydeOgZU4NJ7jb8DMQhWulx4PHOaMk\n' +
    'JR/sRVuzkxfZQ6LPtnWoTmJLr4wJ4WD/nM77W7XmO8ZGoe2hE5V/OZJC+0uQ\n' +
    'OPK4S3YmXcBZoz8L6/gdUQz6kaLtRzsP7vZfyn4jWhlbfad1R7KM1srRT+OT\n' +
    'HDPpdh1b+4npYo8iTcJTnANQ5oAm\n' +
    '=rs9R\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  encryptedPrivateKey: '{"ciphertext":"4bb789bbdaa33f355800c4b8d14e75f310050a0269961b1f4b64c820756ce3595ac737fba749f0b268c418b19cb32f5ccd476bddec8d252ea4cd8e7cf15423a03cc00e9a2064e4134aba89524fe2018fb5ef6b27024a4dbe519883e6f41b462608c33914e129fd651e88d0f14973b3305f8e9d1e3d95670263b1b36921a1b5052f43282768a7210c7b66d5f5886359526cb56f48c61fd3cb165ba15b36f47611d1af8c2aa6d34eec0966d1aaa5522bc2291a5a962585218b4cca7a8d4081aed274ca8ceef95596583683b212549f0568a78b9116a4847d94d32488a0c4ecb9a9b5045afcebc9bcf9d3406fbb4d7eba89f21efce27e3ac174941768008f9d67842efb65e1f3f658a9b366c5c164b5cde2c2db442421c39d46e6017be35bb5b73b06a1569b35e8c4814e0edc1f1be46a964b5a4d9a8245694e530c43e9dbfb9176c41731b315f53b46138c270b6faaec8562abfdf7b595284de89d75bfb87e977330e943788ff914636a2cb81da54dcbaaaa39bd06929020dddcd3b628c44a91a3985f527a9b4592bda19aee4da3e3ee6bc73f98d6de843315476b1f67f8b8174db7b985b94c88c0686b4fd42b45ba398a46638b8d0cde5caa22f45fa51c749377baf35358ee2c1c057dd85b550194f4436af0a43c7c5f36bd7620f28a5ccfa28f16732a4992ff9345a863f1a8f48e5312ef5927b2af2890fee50ad219b43a88781e4b007572e4b7abf5fc5b41e3b944bb164f6c9a397495c46da239b0d40aad8d5bd17a5d02a032212f6495c2f4b8287a0e2d4b7a7d4a56114becb7a26e87233ec3201c558e6f42bc74414b34ec39ada6ab64f7ba9c47e0ddbbe5a622045b236b4a137adbeeeea3559b7b8873d727f7707f75a60a3310a54080eb00e59d6fce88ffd079ac9bf3c85f4fcdb56355bdb8b0b844f42526f4b624591a1729d5b7bed31c1affb0a95266e1092afd45f5c2466a2a7234f8481b8526180ae854e6b9b5e2a2835aef5dfba36ede0c01a56eda4aea27dc415f3ef1440ed0b8f8ae805544d3f4e24d0c9ee8b4ed6def38c7a545cfdc32b3efcf3ad321fab80a15b19c5710198f97826321b69c7677bcf5cae6218279f4bf9192b4ea77e510b7409b31e7b50c4b2dee85857ecf42f3b12365ac73c41d7bbe0564c8d741128c0723619a48ac29760c1a9eff36c179b50e6be26b4e10432cf6b8f987838450189a9474e20bc10adfcaacd1199c026cecb9d8b905bf9a2216345ef532e7cf3b94bc6962b4ac1cf52ed86547aaac352d2ce3a294ccd7299221722cd2852b7c5120dad85e041b09709b49e29e2fa17e6e94c0a77c0508ae805f4ecd0fc70b3ff78cd38ada6d8ddb9b150677589ab5b77968bafdf9f8cbfb0c7ec85d35c004b7d74dab2b3c235069276422878d6c0967ed051b03f05ae70ee8f054eb25054ece32f548c48671aa2b0206f61261f3ce8f44e2754f505ea29d879a1842531e7f2c37333be6c34178c4ccde01fa79f344809e0bddf8aa07e4614e4ed31b4d2fb4dff0b97cb33305afaff864ded85b13a69de4b421f331471595df86e6a8a6bf0c64bd00a7b8521614d00e0120895ce81355285fbbdfde434df2846fb062d5e309fe58df0ebc568378ccee69d6f86aeaed2a65e3ff477812692316535f52b927da1ae3a3cd49ed49fc19988e2759f7252510af3d6f3b4b444d838c24df9627b3cbaef01707de84182c1440c736d5432da40a9ba9d493917c82f3b6475a2d2b82e77dc72111ed454b7cd6fe0d0b0f68512fe9538898060043dc9ed2995a1f8df00ac7b58fd8f9d169225c66b527b5447cf597a2c785b8777aeb2054e2c95106f701d1645bdbee9a1c48649e51dd7ceeb611a99cbd85f8e9f8fae2bdce1a46023eff7bf6748434117624a9002eaf2d1feee0b5d4519706a7fd04b7fa497a0f5e152d5387b010fce47b7df330c12b9091848976cc1aef5b50f93bc2332e320bc46d01c891fedce914141805e74c3f912dbf2991aa927eddec4ec2a80cd3acdb5946764ae5da7759f142420567cf51172b37a50d827e4f463c51a9fd6dd47139c8acba1dbd6036dd4ce6af0e5e37ddc6b2c37dfe3d1482d0f695268e842e980cdb2d6d3541856f7780b216012ac67363cdf9907626ac81fd498cd133150c95aa5832ad4119fbdab0bc8ac0012c7217558e52de5e9a0dc779cb7c013cb7a277849cb9e040d5b32d9c454317b59c8962a645540fa0d7ee59ce4468b697ffdd29c93d4db10bde567c9d2105553116860829e728e9510a4cf986a9857de09846fe78095a48787985ba2b95d2094798d9fa209b893e1874615b313b099550ad17f7050112ca81a8a3ef6c83f4c44a90b2ebe44c60d658f15ef773304ac2d715e7c061675c3abe58386a7a2803856009e5e8c495c7d3c97091ba82893899fd12fb127db0deb06aa5717c63a1f949b35be830c2a3f7731d3f41423aca7a3951c4b4ebc5e3d874c36b518276cb0c07c27952571691d4fc16655be7450b55b3587f0ce79695661d325bb6f736e20338556efc1191eab56f5a2479be34a4c7c8d58b1028def385eb0e60aed6b7e9dac35863aba918641eecb7d12cc55b858bfcaed15e330d6fc47c42e76a13e6671758d8f665aaea876191f51f335b48d1fca47dc3dbaf7a357eb3f1946d8b3073b925ba58b7886a68118d3fc5eea83c1650cb5842668f82eb3350efa6ae6f5002bef3c11c3e7f368489c5a93dec16b93817778941626f6ae7a14c6ce4e5512664b23845e0df4bb76aceb20931765106fdaefb0f749a5fee20cfe467b87dccc73dc66b652cf63ce97e8470b195ed7aec14a7c154f2a3563b8f5b3db7992499dc9795217be05148a21468b204cd025ead1cc1e4144728c9e910140d1d04225df4632fa71604bec728117791d4742c1e1006a0604601942f5852de872fef382378676f59fe6d704d1bd07b7ad0c797b6da17bd39d8b66f90d95d913d46686c3ce881c9136efe0445b1e87c2eb8cb2283532e617cf6a0c5f40fdff1fc25b8372c9d46295934a48ecb5d8a6bd5388b76a984d20a1934823501cc85b0b453bc8aa5a6f19502ca788f4ae5219e6470fd9cfc75a244cf2923cd05e1d9da40f21bdf3bbdeb4647cc82f5988d365dc2b4ae331db8e504cca746092c63f1e305b027e707c38e13c66f5d90553717f9f41cc2624d0c2cfbf814a2355d1e9dfeb06cee67b132425b4d0ec68bdc0fb058ce6c444fdd284995349379a2a17739f0859b7ce24e9b681aac2a78b5b65790aa0dc83aacc6607b15acbafcf7bf943cd3826ea64c765c6943fdbb11853abad1aa92aca6f34c0dd2002fac9f4293dc9cd776d882ccb6e1bc02eb1294e99a0cfadf3923fd9798927aa9754e0cc573ee57a20df72b08fd571ee093fac1cb074b9cc90d10ee909031fe0f3c0cd85f31871b7527d653f143cd71c2084c8a9d8354d98ca9e138eb9e813bb90bd71e58880f5b03da49218e77afc3a8802ae80770490233478c9ff149d1eda00df6af91a57f022e158d23f29c058c9183ee39c6dd86fdbdccc81851ad136fc2813c639e8b367dee11d7eb3efe8f57852f2629cdaa1586fd47150c8ecca8d1ac9cfbef23d2489a0cc515154a09b35717d029a5e7ff14d3969692281c71ebc1f8e21b6f77d724bfa60d75d3a77a54ff3043edf1339bc53fa4c2279c3068a47f8d57dea5481c6c1a3aea9938972dc00bf8b637dab25e7b01cffccce70ff15896e38bb160266370e58c61518b4de88ffa121d6f0c0c757c2585f89f456756176fcd2c18852b43231f9f3c439a338ba8052d1a498d92b9f329610f4a636abc3bec7e895b6244c2c013a1cb9c2661ea1679f2fcb931ab9ffc7d04674144a2012ecda09272d6bb83fe039cd472cd059d734137cc2cf017b1177a63b1c2db74c4b5a6ae9f65524b090c6857bfa9f05960b8dcbc6d4d340064ea6079cba74961dcb6a0f00b0de01863574158bc424cd3dcf14f43b067b3584aef99d5c4cd7831ed3e8608f3f31045c4c37d6b408f32d4590fef6435036164632698c880d22577bb1c521e01e96a57c5780665d97eb8c1b472f3a00c04362ce6f72bd9250958ed6970d411c38d616d90cdda53ab2a5621ad318cb5e23f923426c15c8dcf55d7f54a516fb0bf61fbca1e73ceb9d13742a200fa92bc06fdf8027f7fda8549cbc3f837cbf53f249225e2b7d11bb45f79ac946f9e236da16e080338bc0ec5cee88691dd9e5ea54c6079c325801e0ccc980443b652d8971bca1fd253f078da4390eef90d975460a1300a92936a2097b3529e3316efcc11b398ca5ca7128431f438b4756ca3f690844a4ebbc133f8ebcf030ad7839daebd8e9a10724754fb5d4ae289a9637932ae3dafc5b8d6017648305b1eb4d43b16e58eae02fb9501a56ba23f0c27bc9a800120b018cc69f1a070da2936a5af9cd25ba1aa64eae66b218c8964f2b38c371c8a25c04a353d228fc59f08602fbf74a98e61ba3d2a34a844bc829d5f1ee1eaf1bb1cacca386496e22eaf171f1145695f759062f9fa254c5d8c103ff26f1cd73b1c7fd0ced091c917cb63d2fc98ff2e1437b802fd60d6d72b146b695dc93d646913bb9ffc763d604ec61fa733aefd5f14c465cb1ac85a6a1bbc34fc2204876b76c631725690155eaa5d8f07648f22fe954b3b121c56046c24e99e3ab5b2bf10dbd85505d8f55a1cf985ecdf4a42b6d031ea322ac969f86acc6d3a8ba3f5361b6e05b86374bd43d707293c27993a5ac7595a0d5348332dc13c6b651b4a859702844cbded3c6bd35aa67c8fdfc4e913a8b8615ce28129aecf3217ecc4c2bfc48607b650c47bec3365e1af941b9046958b7c8b64bf45028760984336b6c27bc044a7ea69385805d089434190f0044d856ad2fbad4965846f59491e37f0256548d82145f571e18090b0fa91","salt":"d2deba0a43769862a0fbd80dd6fc867599706ca644920fe1bc05585f922b518e","nonce":"74e9fa0359646cdfbe86a7ad","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"358718727d4b43422a7719176c09b66f633e52a47ee3879d1e19b85cc362938d"}',
  verificationProof: 'eip191v2:0xd7f0bc7c3960f84280c1433e27c0110dea4b4af1a8c10f7531b8194625cada9456cb67117154f20e97a3d8764b8e3e276d0e6da44f36c4a89a06da9a76d3821a1c',
  msgSent: 1,
  maxMsgPersisted: 1000,
  profile: {
    name: 'Bob The Builder',
    desc: null,
    picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVR4AcXBQQ0CMBBE0c+kSXVUBWdMoGRl1AsSkLIWuO4Jrj2VNCTMe5fr9fFmI7L4xRydHWEmzIRZ49AcnZ3I4oQwE2bCrEUWJyKLE5HFjjATZsKszdFZRRarOTq/iCxWc3RWwkyYCbPGF5HFao7OTmRxQpgJM2HWIot/iixWwkyYCbM2R+fE/fVkZ44bJ4SZMBNmwkyYCTNh9gEzZiOL39d+3QAAAABJRU5ErkJggg==',
    blockedUsersList: [],
    verificationProof: 'pgpv2:-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBYJk9vdaCZDzsIc63rzcLRYhBLvWJU1IWhvs+frC7POwhzre\n' +
      'vNwtAAB5dAf/cDGsyD3YabE6iTIhNPDn+hvbHuZUjpNPnnSb+mjrvD/XBNYV\n' +
      'ITTHhp3Xy4Kuk19BkgmPO3O5TZHVUXK7IwYJd7uutNJJyLEWZYI9ttfeJ9cY\n' +
      'HQM3GjApAHycDkBAn5ZRDtmruyWipeE1II3omDUgChQOnQFoK/jWohoIOUvO\n' +
      'zi+0V02z7uIGwgTjBLgOYehD8NloGxTjwaZHMqEN7xbr1mZqy82Aew1Bw+EY\n' +
      '+JPMyiKTF6HXHYrJZL1yaNw/T7ukCI8ecGoql04xlOHU+SKUTz+8Kcg4tZQR\n' +
      '0pp6Fz9Fy9ROUI8ieu5LytJwQq4c9VkH/SPUvkoODloXc0MbrY59tA==\n' +
      '=A3pG\n' +
      '-----END PGP SIGNATURE-----\n'
  },
  origin: null,
  name: 'Bob The Builder',
  about: null,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnUlEQVR4AcXBQQ0CMBBE0c+kSXVUBWdMoGRl1AsSkLIWuO4Jrj2VNCTMe5fr9fFmI7L4xRydHWEmzIRZ49AcnZ3I4oQwE2bCrEUWJyKLE5HFjjATZsKszdFZRRarOTq/iCxWc3RWwkyYCbPGF5HFao7OTmRxQpgJM2HWIot/iixWwkyYCbM2R+fE/fVkZ44bJ4SZMBNmwkyYCTNh9gEzZiOL39d+3QAAAABJRU5ErkJggg==',
  numMsg: 1,
  allowedNumMsg: 1000,
  encryptionType: 'eip191-aes256-gcm-hkdf-sha256',
  signature: '0xd7f0bc7c3960f84280c1433e27c0110dea4b4af1a8c10f7531b8194625cada9456cb67117154f20e97a3d8764b8e3e276d0e6da44f36c4a89a06da9a76d3821a1c',
  sigType: 'eip191v2',
  encryptedPassword: null,
  nftOwner: null,
  linkedListHash: null,
  nfts: null
}
```

| Parameter           | Type     | Remarks                                                         |
| ------------------- | -------- | --------------------------------------------------------------- |
| did                 | `string` | user decentralized identity                                     |
| wallets             | `string` | all wallets associated to the did                               |
| publicKey           | `string` | Public PGP key                                                  |
| encryptedPrivateKey | `string` | Encrypted PGP Private Key                                       |
| verificationProof   | `string` | Verification proof                                              |
| msgSent             | `number` | Number of messages sent                                         |
| maxMsgPersisted     | `number` | Maximum number of messages that can be persisted                |
| profile             | `object` | User profile information                                        |
| origin              | `string` | Origin information (source of the data)                         |
| name                | `string` | Profile Name ( Deprecated )                                     |
| about               | `string` | Profile Description ( Deprecated )                              |
| profilePicture      | `string` | Profile Picture ( Deprecated )                                  |
| numMsg              | `number` | Number of messages sent ( Deprecated )                          |
| allowedNumMsg       | `number` | Maximum number of messages that can be persisted ( Deprecated ) |
| encryptionType      | `string` | Type of encryption used                                         |
| signature           | `string` | Account signature ( Deprecated )                                |
| sigType             | `string` | Type of signature ( Dprecated )                                 |
| encryptedPassword   | `null`   | Encrypted user password ( Deprecated )                          |
| nftOwner            | `null`   | Owner of NFT ( Deprecated )                                     |
| linkedListHash      | `null`   | Deprecated                                                      |
| nfts                | `null`   | Information about owned NFTs( Dprecated )                       |

</details>

---

### **Create Group**

```typescript
// Create a Group
const createdGroup = await userAlice.chat.group.create(groupName, {
  description: groupDescription,
  image: groupImage,
  members: [walletAddress1, walletAddress2, walletAddress3],
  admins: [],
  private: false,
});
```

| Param                               | Type       | Default | Remarks                                    |
| ----------------------------------- | ---------- | ------- | ------------------------------------------ |
| `name`                              | `string`   | -       | The name of the group to be created.       |
| `options` \*                        | `object`   | -       | Optional Configuration for creating group. |
| `options.description` \*            | `string`   | -       | A description of the group.                |
| `options.image` \*                  | `string`   | -       | Image for the group.                       |
| `options.members` \*                | `string[]` | `[]`    | An array of member DID.                    |
| `options.admins` \*                 | `string[]` | -       | An array of admin DID.                     |
| `options.private` \*                | `boolean`  | `false` | Indicates if the group is private.         |
| `options.rules.entry.conditions` \* | `any[]`    | -       | Conditions for entry to the group.         |
| `options.rules.chat.conditions` \*  | `any[]`    | -       | Conditions for chat within the group.      |

\* - Optional

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  members: [
    {
      wallet: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADeYpZfxgn1HoMUuWM42v8ZWfLPwglQYmzz5rY3PdPPoRFU\n' +
        'v0AyPjYKpmLh2ZNfXjPaS9GuMdpXaomYSEwsV02hXZOQelo9cLop0Fc2i+l7\n' +
        '70rYhePuOuQ+XD/xYzhngAgNJ9rX96YnSodldb8uJfxYmgoF0E9Z2o2fgZGj\n' +
        'll2CPnOaLXZaBQlPS3x/461TmZ1n2ZePS/fwiC7taLz3PtyGtKaC0vo4isvI\n' +
        'yf04fkjudG0XIns5CWjdR2HeDC8BzSl8OVj8AQAc5uVU8Abk+ejWVr4zfoox\n' +
        'eaziDPgGdkckFiQ6Tdsg0tPwwOpSrCCtJocTmc/fWaBb0YlnyAAL88fJABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZBMYqhmfI2WQQMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAACxNQf/UrM/whR7vCs+\n' +
        'ez8Y8Hz4WqIuXtfMh4l2nKVv5UUuAfQkBxEY5j6Ga2+JgKU3neQ34x/v6fm9\n' +
        'CLcY38Tc4AWyEx8KC78J+xOs7RMfyNBeiaf8KdaFfQrP0nMmufE6TxkfV1Y5\n' +
        'LJZZ8350rZVtYJppWtlH+gbyUmMObyWDWbL3aWtqa3xjv0kLsf7TnugiFwzB\n' +
        'gHHtk8tlDSOxRt0VdNNd19+/zrBYNl07Ig24WD2ETaJiaqa651z24/6/MkGT\n' +
        'MBoQh+679tuWWcTrNi4jIA8jhSQ5BOgbAapl3qXk0m9/Aexpe2s6ISLXe8YJ\n' +
        'j4cObDLv/ZKKeLZYTq9lVCydLAQUbs7ATQRk7zWYAQgAmx36uefgUF4cCSYH\n' +
        'WMWAOTyc8Awo+hxn6FktOLU1+9hfGrX2jwGLOoOwjNgbYJbiSvRglAX2b57/\n' +
        'qkkltAg1ZYCLSUzfBUbbWYlJNBwpv7+52zHaLUZ3gmI5aE48ad+uzaadgpVT\n' +
        'VqLbhdgkN6jkemPTlfMehyS49AAbmqeKfo2U72tm9ZqT2cPVCASMjN/Ux2qG\n' +
        '3W8HTo0KIVFSbkTthl1zAlwAFksp0q437+pxbdJIecJ9mO6N4OQMnv+hVBDc\n' +
        'WrPqBDJ0nas4JNgLxmLv0pheGg/TEfwS/p6xGRW5m08bj2l0cgqmEaM27jbi\n' +
        'DEpOykRWsDMhheEfI2zV/Qam8QARAQABwsB2BBgBCAAqBYJk7zWYCZBMYqhm\n' +
        'fI2WQQKbDBYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAAAnBggA1gkIopr9HJFP\n' +
        'fO5SebcbowH4AG9M0qBqF4h1JIKbqvOnxLSsC5QmmzFcjS9ihyHBvzbRVGkC\n' +
        'zEHYpLRedQ2AmQQfsf/VOoZJEOlb7tTk4+SpYtsGte5X/yLT5Bkls7Rp8ubK\n' +
        '/V99muj1nA/OkasllXQUSGEweVz6ejzJ0oMm3Vewmw8PelsdAnfS7Ud1MnXQ\n' +
        'h+O8TCR56F5gAMWxZmxFpZMZyUFOH6KM+vL7HJUBztUS2g0ELsHKy9ep2yhv\n' +
        'iABIwx/gEuPr0NDAH9x9XFKg5m3rO64KTY4BRWBISwmQ25dM1s1bwDPLi5XI\n' +
        '6Daw1glFxpPRrxgQGlVLzJOu5b8swQ==\n' +
        '=9hCc\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4AcXBsWlDMRiF0c8XTeAJPIAgoFbgQew1PIbXyKsyhUGtCqM6ZAJX6Z32fykM4hnuObv71++TYJRKlHtji1EqUe6NSJgJM2G2W74/nkzIvfHKKJUZwkyYCbOUe+Odcm/MEGbCTJil2/VMdLx8Eo1S2SL3RnS7nomEmTATZmm//BANKlHujS1GqUT7hRVhJsyEWWLSKJVXcm/MEGbCTJgl/sm9EY1SmTFKJcq9EY1SiYSZMBNm6XE6sHJhJffGOz1OByJhJsyE2R/3lDA4e9QQhAAAAABJRU5ErkJggg=='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x119bb8ad40B1f94e2b30ae5f59eeaEB67cD0Bd6C',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0x6e0C509d14EbF26A529bf6DC5CC9bee7F5b8DBa4',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0xE3FDD0527a9F8418f9a7D9e970452827FbE202FF',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADouo4S2kPqA//+I7nDAk15/LcJ2TGvDhOYuPNUNMiNGOb4\n' +
        'txusuKz6HOaG+K9hiUBpHjKrYEmCT2FEXxt8bfS3SpWb74RHSkWUNUkxk25y\n' +
        'gE5gaCKyAdcnOUyVLmobVFFYtH6naK9bULaUtkVik1P0iuEevWHxtTpsjbyH\n' +
        'bZtNpVTdprdLib4Wx6bb7VogsvjlvNJcVJ4sfPE0XgsQgAGIev7yJyU0DGzt\n' +
        '/EbvFX4sv51Kb1dX9ctBcvzVbs9+qT6LTivsrQp+TNHUN4zEeMhnWFFP5K1d\n' +
        'H445S6FWk53XvBudcOkFPtltU1MPCS6hmhevArBfYzy5eSlaKA/fH+kFABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZCrD2gy8Zu4awMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBKru9/u8wPcTeHibkasPaDLxm7hrAADa/Af+PbamVg/Ig2S2\n' +
        'HgIy4w5x7ulSk1/49+AmuiUMiVUwJSVBhROsyDbLET56w4+1TIMYZFJaczW3\n' +
        '8tCvAOUSauzc52I3zwGmaCupBJokIWp7ncPh0B8TFYrgThgXV7sLf3xy4roy\n' +
        'y8oFz1Zla88krwtPe4Az7TF+WNdXoDsLNJ3GXRmNqs1GITmDqAXFWncl12NM\n' +
        'ajUKWIKc/Gi1oKfz22mabJTtWBimDpA12LaGK3GjEK5CiWXT3Tzlqn6R14EZ\n' +
        '6ohpKZldSJiMPL0Bu9iT52iHOsw1wTZNC1L5lKhOCi3c+/fLRcJZt3hdCjqy\n' +
        'd/FSCa8/Ny/GrHBWoL49rSF4pDEA+s7ATQRk7zWYAQgAtNOoHCL7BCnjwp8O\n' +
        'htTxEI5r7Q/1zKKHiz6QKjjrGBYyR6gcmPM3JNEcvzY4OsCFnKBv2suOgrqH\n' +
        '8kXJzfpIQ7u7uJs+O3p/cn86RMANiEnO8NbB/0scpfZ7Vg3eOfoiWYE4I/1o\n' +
        'FVDCyZ1YVqtbcmuW6D8i1djjeoUmkUDZyPo7Qs6hUsJeYA/Rfl8mH5sjy2cN\n' +
        'WXf8cEtOUqJtwERXt5aRB/nBZiC0bsP6hf0HtAoNA8/96TkqrcQpODW/RckD\n' +
        'fo4wkpEONHRH+LGX7GV0pwymHu42TUnULmED6BrMgMYG2sKpxMThxtAxRaiP\n' +
        'nZ3DKXr8GCjTYnbEZpoi2zKCOQARAQABwsB2BBgBCAAqBYJk7zWYCZCrD2gy\n' +
        '8Zu4awKbDBYhBKru9/u8wPcTeHibkasPaDLxm7hrAADGyQgA5NMUkoyDTPZa\n' +
        'Znj1dB+17xBXCZ/u7pPQc1DukBefVke7/qYIicdnnEGIX3Zd7TckFRsDljR/\n' +
        '3418Bne4WyL57fAF/GgYsegpJ9n1KT7oPxWzibIaYdj7R6bkDt5r61EDWC3N\n' +
        'VBbnZu9cO15TYkObJIiyNvwbQyd6Dm313b39GnEE8sM709TWsI6Es6rRZAfC\n' +
        '+sI8ezYxqVUbP7sW3jJZYzdPOhZPHvFd5iJ2EfygEOuk5tb7AimfNwF/CNcB\n' +
        'weQGEU7feOSB9lXXA+Ag1duLM4B9bLbbHEQIPhKlBF1ED64e/W/5HNfoAkS4\n' +
        'qhzOD5XWs6xs45nnYqUbBFLG9Xk+Jg==\n' +
        '=qtAv\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsXECMRRF0csbdbAZBagHKlJMSOL90IUq2h5UABktLE6/HcizY4/fOafrcntzQB/BTKvBEcJMmAmz0keQtRpk67bzRQ1m1m0nu19E1keQCTNhJsxO1+X2JukjmHm+Ppg5Lw9mWg0yYSbMhFnhoPPy4C8JM2EmzArftBr8J2EmzIRZ6SPIWg2yPoKs1WCmjyBrNcj6CDJhJsyEWWk1OKKP4DdaDTJhJsyEWeEHrQbZuu3M3C/iCGEmzITZJ/s7LOkKUABjAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7zWZCZBMYqhmfI2WQRYhBC9DyzhpX3ACb/yTq0xiqGZ8\n' +
    'jZZBAADwAwgAq/6WjtwRt1aPTLWwtSx80Ng/Wxf97dkpebMXSj9T7f5ia1rM\n' +
    '8wqsuNUDMEMPB9LM34f6Q5pD994oeN2YT7z34u20mskiNphZdx/DNvu8w9UZ\n' +
    'rI3tyjfZULhARNVM34sSABnHtExbl4ZArhNDsT86ku0sZNjr9frn2mtgmlKN\n' +
    'nQdGcLJSxbci0hFg3nE5mYNpwZNs2S/2uk11WHKxzMhII6AdePE77BKPqedu\n' +
    'PiXDODO2dIvV8glLQoJPRPgc2ap+/xYIBUFljqHGPU/62VSLlHxBJv72p5s/\n' +
    'kOxiqD42TmpaaMtfudqgsZsGoYpZDHcMKYGNZs+9qVRHPRD+s0QhEA==\n' +
    '=c6IF\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'influential_maroon_gamefowl',
  groupDescription: 'urgent_brown_butterfly',
  isPublic: false,
  groupCreator: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
  chatId: '5f769c881ffe328117dea3d3acd0b97ce7f4c163e440f75a96be3e33f7d2a000',
  meta: null,
  scheduleAt: null,
  scheduleEnd: null,
  groupType: 'default',
  status: null,
  rules: {},
  eventType: 'create'
}
```

| Parameter                  | Type                  | Remarks                                                        |
| -------------------------- | --------------------- | -------------------------------------------------------------- |
| `members`                  | `Array<Object>`       | An array containing member objects.                            |
| `members.wallet`           | `string`              | The wallet address of the member.                              |
| `members.publicKey`        | `string`              | The member's public PGP key (if available).                    |
| `members.isAdmin`          | `boolean`             | Indicates whether the member is an admin.                      |
| `members.image`            | `string`              | Image associated with the member.                              |
| `pendingMembers`           | `Array<Object>`       | An array containing pending member objects.                    |
| `pendingMembers.wallet`    | `string`              | The wallet address of the pending member.                      |
| `pendingMembers.publicKey` | `string`              | The pending member's public PGP key (if available).            |
| `pendingMembers.isAdmin`   | `boolean`             | Indicates whether the pending member is an admin.              |
| `pendingMembers.image`     | `string`              | Image associated with the pending member.                      |
| `contractAddressERC20`     | `string` or `null`    | Contract address for ERC20 tokens (Used for tokenGating).      |
| `numberOfERC20`            | `number`              | The number of ERC20 tokens associated. (Used for tokenGating). |
| `contractAddressNFT`       | `string` or `null`    | Contract address for NFT tokens (Used for tokenGating)         |
| `numberOfNFTTokens`        | `number`              | The number of NFT tokens associated. (Used for tokenGating)    |
| `verificationProof`        | `string`              | Verification proof associated with group data.                 |
| `groupImage`               | `string`              | Group's image.                                                 |
| `groupName`                | `string`              | The name of the group.                                         |
| `groupDescription`         | `string`              | Description of the group.                                      |
| `isPublic`                 | `boolean`             | Indicates whether the group is public or private.              |
| `groupCreator`             | `string`              | Push Profile DID of the group creator.                         |
| `chatId`                   | `string`              | Unique chat ID associated with the group.                      |
| `meta`                     | `object` or `null`    | Additional metadata (if available).                            |
| `scheduleAt`               | `timestamp` or `null` | Scheduled start time (if available).                           |
| `scheduleEnd`              | `timestamp` or `null` | Scheduled end time (if available).                             |
| `groupType`                | `string`              | Type of the group (default, spaces, live etc).                 |
| `status`                   | `string` or `null`    | Status information ( active, expired etc)                      |
| `rules`                    | `Object`              | Group-specific moderation rules                                |
| `eventType`                | `string`              | The type of event (create, update etc)                         |

</details>

---

### **Fetch Group Info**

```typescript
// Fetch Group Info
const fetchGroupInfo = await userAlice.chat.group.info(groupChatId);
```

| Param    | Type     | Default | Remarks      |
| -------- | -------- | ------- | ------------ |
| `chatId` | `string` | -       | Group ChatId |

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  members: [
    {
      wallet: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADeYpZfxgn1HoMUuWM42v8ZWfLPwglQYmzz5rY3PdPPoRFU\n' +
        'v0AyPjYKpmLh2ZNfXjPaS9GuMdpXaomYSEwsV02hXZOQelo9cLop0Fc2i+l7\n' +
        '70rYhePuOuQ+XD/xYzhngAgNJ9rX96YnSodldb8uJfxYmgoF0E9Z2o2fgZGj\n' +
        'll2CPnOaLXZaBQlPS3x/461TmZ1n2ZePS/fwiC7taLz3PtyGtKaC0vo4isvI\n' +
        'yf04fkjudG0XIns5CWjdR2HeDC8BzSl8OVj8AQAc5uVU8Abk+ejWVr4zfoox\n' +
        'eaziDPgGdkckFiQ6Tdsg0tPwwOpSrCCtJocTmc/fWaBb0YlnyAAL88fJABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZBMYqhmfI2WQQMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAACxNQf/UrM/whR7vCs+\n' +
        'ez8Y8Hz4WqIuXtfMh4l2nKVv5UUuAfQkBxEY5j6Ga2+JgKU3neQ34x/v6fm9\n' +
        'CLcY38Tc4AWyEx8KC78J+xOs7RMfyNBeiaf8KdaFfQrP0nMmufE6TxkfV1Y5\n' +
        'LJZZ8350rZVtYJppWtlH+gbyUmMObyWDWbL3aWtqa3xjv0kLsf7TnugiFwzB\n' +
        'gHHtk8tlDSOxRt0VdNNd19+/zrBYNl07Ig24WD2ETaJiaqa651z24/6/MkGT\n' +
        'MBoQh+679tuWWcTrNi4jIA8jhSQ5BOgbAapl3qXk0m9/Aexpe2s6ISLXe8YJ\n' +
        'j4cObDLv/ZKKeLZYTq9lVCydLAQUbs7ATQRk7zWYAQgAmx36uefgUF4cCSYH\n' +
        'WMWAOTyc8Awo+hxn6FktOLU1+9hfGrX2jwGLOoOwjNgbYJbiSvRglAX2b57/\n' +
        'qkkltAg1ZYCLSUzfBUbbWYlJNBwpv7+52zHaLUZ3gmI5aE48ad+uzaadgpVT\n' +
        'VqLbhdgkN6jkemPTlfMehyS49AAbmqeKfo2U72tm9ZqT2cPVCASMjN/Ux2qG\n' +
        '3W8HTo0KIVFSbkTthl1zAlwAFksp0q437+pxbdJIecJ9mO6N4OQMnv+hVBDc\n' +
        'WrPqBDJ0nas4JNgLxmLv0pheGg/TEfwS/p6xGRW5m08bj2l0cgqmEaM27jbi\n' +
        'DEpOykRWsDMhheEfI2zV/Qam8QARAQABwsB2BBgBCAAqBYJk7zWYCZBMYqhm\n' +
        'fI2WQQKbDBYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAAAnBggA1gkIopr9HJFP\n' +
        'fO5SebcbowH4AG9M0qBqF4h1JIKbqvOnxLSsC5QmmzFcjS9ihyHBvzbRVGkC\n' +
        'zEHYpLRedQ2AmQQfsf/VOoZJEOlb7tTk4+SpYtsGte5X/yLT5Bkls7Rp8ubK\n' +
        '/V99muj1nA/OkasllXQUSGEweVz6ejzJ0oMm3Vewmw8PelsdAnfS7Ud1MnXQ\n' +
        'h+O8TCR56F5gAMWxZmxFpZMZyUFOH6KM+vL7HJUBztUS2g0ELsHKy9ep2yhv\n' +
        'iABIwx/gEuPr0NDAH9x9XFKg5m3rO64KTY4BRWBISwmQ25dM1s1bwDPLi5XI\n' +
        '6Daw1glFxpPRrxgQGlVLzJOu5b8swQ==\n' +
        '=9hCc\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4AcXBsWlDMRiF0c8XTeAJPIAgoFbgQew1PIbXyKsyhUGtCqM6ZAJX6Z32fykM4hnuObv71++TYJRKlHtji1EqUe6NSJgJM2G2W74/nkzIvfHKKJUZwkyYCbOUe+Odcm/MEGbCTJil2/VMdLx8Eo1S2SL3RnS7nomEmTATZmm//BANKlHujS1GqUT7hRVhJsyEWWLSKJVXcm/MEGbCTJgl/sm9EY1SmTFKJcq9EY1SiYSZMBNm6XE6sHJhJffGOz1OByJhJsyE2R/3lDA4e9QQhAAAAABJRU5ErkJggg=='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x119bb8ad40B1f94e2b30ae5f59eeaEB67cD0Bd6C',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0x6e0C509d14EbF26A529bf6DC5CC9bee7F5b8DBa4',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0xE3FDD0527a9F8418f9a7D9e970452827FbE202FF',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADouo4S2kPqA//+I7nDAk15/LcJ2TGvDhOYuPNUNMiNGOb4\n' +
        'txusuKz6HOaG+K9hiUBpHjKrYEmCT2FEXxt8bfS3SpWb74RHSkWUNUkxk25y\n' +
        'gE5gaCKyAdcnOUyVLmobVFFYtH6naK9bULaUtkVik1P0iuEevWHxtTpsjbyH\n' +
        'bZtNpVTdprdLib4Wx6bb7VogsvjlvNJcVJ4sfPE0XgsQgAGIev7yJyU0DGzt\n' +
        '/EbvFX4sv51Kb1dX9ctBcvzVbs9+qT6LTivsrQp+TNHUN4zEeMhnWFFP5K1d\n' +
        'H445S6FWk53XvBudcOkFPtltU1MPCS6hmhevArBfYzy5eSlaKA/fH+kFABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZCrD2gy8Zu4awMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBKru9/u8wPcTeHibkasPaDLxm7hrAADa/Af+PbamVg/Ig2S2\n' +
        'HgIy4w5x7ulSk1/49+AmuiUMiVUwJSVBhROsyDbLET56w4+1TIMYZFJaczW3\n' +
        '8tCvAOUSauzc52I3zwGmaCupBJokIWp7ncPh0B8TFYrgThgXV7sLf3xy4roy\n' +
        'y8oFz1Zla88krwtPe4Az7TF+WNdXoDsLNJ3GXRmNqs1GITmDqAXFWncl12NM\n' +
        'ajUKWIKc/Gi1oKfz22mabJTtWBimDpA12LaGK3GjEK5CiWXT3Tzlqn6R14EZ\n' +
        '6ohpKZldSJiMPL0Bu9iT52iHOsw1wTZNC1L5lKhOCi3c+/fLRcJZt3hdCjqy\n' +
        'd/FSCa8/Ny/GrHBWoL49rSF4pDEA+s7ATQRk7zWYAQgAtNOoHCL7BCnjwp8O\n' +
        'htTxEI5r7Q/1zKKHiz6QKjjrGBYyR6gcmPM3JNEcvzY4OsCFnKBv2suOgrqH\n' +
        '8kXJzfpIQ7u7uJs+O3p/cn86RMANiEnO8NbB/0scpfZ7Vg3eOfoiWYE4I/1o\n' +
        'FVDCyZ1YVqtbcmuW6D8i1djjeoUmkUDZyPo7Qs6hUsJeYA/Rfl8mH5sjy2cN\n' +
        'WXf8cEtOUqJtwERXt5aRB/nBZiC0bsP6hf0HtAoNA8/96TkqrcQpODW/RckD\n' +
        'fo4wkpEONHRH+LGX7GV0pwymHu42TUnULmED6BrMgMYG2sKpxMThxtAxRaiP\n' +
        'nZ3DKXr8GCjTYnbEZpoi2zKCOQARAQABwsB2BBgBCAAqBYJk7zWYCZCrD2gy\n' +
        '8Zu4awKbDBYhBKru9/u8wPcTeHibkasPaDLxm7hrAADGyQgA5NMUkoyDTPZa\n' +
        'Znj1dB+17xBXCZ/u7pPQc1DukBefVke7/qYIicdnnEGIX3Zd7TckFRsDljR/\n' +
        '3418Bne4WyL57fAF/GgYsegpJ9n1KT7oPxWzibIaYdj7R6bkDt5r61EDWC3N\n' +
        'VBbnZu9cO15TYkObJIiyNvwbQyd6Dm313b39GnEE8sM709TWsI6Es6rRZAfC\n' +
        '+sI8ezYxqVUbP7sW3jJZYzdPOhZPHvFd5iJ2EfygEOuk5tb7AimfNwF/CNcB\n' +
        'weQGEU7feOSB9lXXA+Ag1duLM4B9bLbbHEQIPhKlBF1ED64e/W/5HNfoAkS4\n' +
        'qhzOD5XWs6xs45nnYqUbBFLG9Xk+Jg==\n' +
        '=qtAv\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsXECMRRF0csbdbAZBagHKlJMSOL90IUq2h5UABktLE6/HcizY4/fOafrcntzQB/BTKvBEcJMmAmz0keQtRpk67bzRQ1m1m0nu19E1keQCTNhJsxO1+X2JukjmHm+Ppg5Lw9mWg0yYSbMhFnhoPPy4C8JM2EmzArftBr8J2EmzIRZ6SPIWg2yPoKs1WCmjyBrNcj6CDJhJsyEWWk1OKKP4DdaDTJhJsyEWeEHrQbZuu3M3C/iCGEmzITZJ/s7LOkKUABjAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7zWZCZBMYqhmfI2WQRYhBC9DyzhpX3ACb/yTq0xiqGZ8\n' +
    'jZZBAADwAwgAq/6WjtwRt1aPTLWwtSx80Ng/Wxf97dkpebMXSj9T7f5ia1rM\n' +
    '8wqsuNUDMEMPB9LM34f6Q5pD994oeN2YT7z34u20mskiNphZdx/DNvu8w9UZ\n' +
    'rI3tyjfZULhARNVM34sSABnHtExbl4ZArhNDsT86ku0sZNjr9frn2mtgmlKN\n' +
    'nQdGcLJSxbci0hFg3nE5mYNpwZNs2S/2uk11WHKxzMhII6AdePE77BKPqedu\n' +
    'PiXDODO2dIvV8glLQoJPRPgc2ap+/xYIBUFljqHGPU/62VSLlHxBJv72p5s/\n' +
    'kOxiqD42TmpaaMtfudqgsZsGoYpZDHcMKYGNZs+9qVRHPRD+s0QhEA==\n' +
    '=c6IF\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'influential_maroon_gamefowl',
  groupDescription: 'urgent_brown_butterfly',
  isPublic: false,
  groupCreator: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
  chatId: '5f769c881ffe328117dea3d3acd0b97ce7f4c163e440f75a96be3e33f7d2a000',
  meta: null,
  scheduleAt: null,
  scheduleEnd: null,
  groupType: 'default',
  status: null,
  rules: {},
  eventType: 'create'
}
```

| Parameter                  | Type                  | Remarks                                                        |
| -------------------------- | --------------------- | -------------------------------------------------------------- |
| `members`                  | `Array<Object>`       | An array containing member objects.                            |
| `members.wallet`           | `string`              | The wallet address of the member.                              |
| `members.publicKey`        | `string`              | The member's public PGP key (if available).                    |
| `members.isAdmin`          | `boolean`             | Indicates whether the member is an admin.                      |
| `members.image`            | `string`              | Image associated with the member.                              |
| `pendingMembers`           | `Array<Object>`       | An array containing pending member objects.                    |
| `pendingMembers.wallet`    | `string`              | The wallet address of the pending member.                      |
| `pendingMembers.publicKey` | `string`              | The pending member's public PGP key (if available).            |
| `pendingMembers.isAdmin`   | `boolean`             | Indicates whether the pending member is an admin.              |
| `pendingMembers.image`     | `string`              | Image associated with the pending member.                      |
| `contractAddressERC20`     | `string` or `null`    | Contract address for ERC20 tokens (Used for tokenGating).      |
| `numberOfERC20`            | `number`              | The number of ERC20 tokens associated. (Used for tokenGating). |
| `contractAddressNFT`       | `string` or `null`    | Contract address for NFT tokens (Used for tokenGating)         |
| `numberOfNFTTokens`        | `number`              | The number of NFT tokens associated. (Used for tokenGating)    |
| `verificationProof`        | `string`              | Verification proof associated with group data.                 |
| `groupImage`               | `string`              | Group's image.                                                 |
| `groupName`                | `string`              | The name of the group.                                         |
| `groupDescription`         | `string`              | Description of the group.                                      |
| `isPublic`                 | `boolean`             | Indicates whether the group is public or private.              |
| `groupCreator`             | `string`              | Push Profile DID of the group creator.                         |
| `chatId`                   | `string`              | Unique chat ID associated with the group.                      |
| `meta`                     | `object` or `null`    | Additional metadata (if available).                            |
| `scheduleAt`               | `timestamp` or `null` | Scheduled start time (if available).                           |
| `scheduleEnd`              | `timestamp` or `null` | Scheduled end time (if available).                             |
| `groupType`                | `string`              | Type of the group (default, spaces, live etc).                 |
| `status`                   | `string` or `null`    | Status information ( active, expired etc)                      |
| `rules`                    | `Object`              | Group-specific moderation rules                                |
| `eventType`                | `string`              | The type of event (create, update etc)                         |

</details>

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

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  entry: true,
  chat: true,
  rules: { entry: { conditions: [] }, chat: { conditions: [] } }
}
```

| Param   | Type      | Remarks                                               |
| ------- | --------- | ----------------------------------------------------- |
| `entry` | `boolean` | Refers if the Profile has access to enter the group   |
| `chat`  | `boolean` | Refers if the Profile has access to chat in the group |
| `rules` | `object`  | Moderation rules of the group                         |

</details>

---

### **Update Group**

```typescript
// Update Group Info
const createdGroup = await userAlice.chat.group.create(groupChatId, {
  description: newGroupDescription,
  image: newGroupImage,
});
```

| Param                    | Type               | Default | Remarks                                    |
| ------------------------ | ------------------ | ------- | ------------------------------------------ |
| `chatId`                 | `string`           | -       | Unique identifier of the group.            |
| `options` \*             | `object`           | -       | Optional Configuration for updating group. |
| `options.name` \*        | `string`           | -       | Updated Group Name                         |
| `options.description` \* | `string`           | -       | Updated Description                        |
| `options.image` \*       | `string`           | -       | Updated Image                              |
| `options.scheduleAt` \*  | `date` or `null`   | -       | Updated Start Schedule                     |
| `options.scheduleEnd` \* | `date` or `null`   | -       | Updated End Schedule                       |
| `options.status` \*      | `string` or `null` | -       | Updated group Status                       |
| `options.meta` \*        | `object` or `null` | -       | Updated Group Meta                         |
| `options.rules` \*       | `object`           | -       | Updated Group Moderation Rules             |

\* - Optional

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  members: [
    {
      wallet: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADeYpZfxgn1HoMUuWM42v8ZWfLPwglQYmzz5rY3PdPPoRFU\n' +
        'v0AyPjYKpmLh2ZNfXjPaS9GuMdpXaomYSEwsV02hXZOQelo9cLop0Fc2i+l7\n' +
        '70rYhePuOuQ+XD/xYzhngAgNJ9rX96YnSodldb8uJfxYmgoF0E9Z2o2fgZGj\n' +
        'll2CPnOaLXZaBQlPS3x/461TmZ1n2ZePS/fwiC7taLz3PtyGtKaC0vo4isvI\n' +
        'yf04fkjudG0XIns5CWjdR2HeDC8BzSl8OVj8AQAc5uVU8Abk+ejWVr4zfoox\n' +
        'eaziDPgGdkckFiQ6Tdsg0tPwwOpSrCCtJocTmc/fWaBb0YlnyAAL88fJABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZBMYqhmfI2WQQMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAACxNQf/UrM/whR7vCs+\n' +
        'ez8Y8Hz4WqIuXtfMh4l2nKVv5UUuAfQkBxEY5j6Ga2+JgKU3neQ34x/v6fm9\n' +
        'CLcY38Tc4AWyEx8KC78J+xOs7RMfyNBeiaf8KdaFfQrP0nMmufE6TxkfV1Y5\n' +
        'LJZZ8350rZVtYJppWtlH+gbyUmMObyWDWbL3aWtqa3xjv0kLsf7TnugiFwzB\n' +
        'gHHtk8tlDSOxRt0VdNNd19+/zrBYNl07Ig24WD2ETaJiaqa651z24/6/MkGT\n' +
        'MBoQh+679tuWWcTrNi4jIA8jhSQ5BOgbAapl3qXk0m9/Aexpe2s6ISLXe8YJ\n' +
        'j4cObDLv/ZKKeLZYTq9lVCydLAQUbs7ATQRk7zWYAQgAmx36uefgUF4cCSYH\n' +
        'WMWAOTyc8Awo+hxn6FktOLU1+9hfGrX2jwGLOoOwjNgbYJbiSvRglAX2b57/\n' +
        'qkkltAg1ZYCLSUzfBUbbWYlJNBwpv7+52zHaLUZ3gmI5aE48ad+uzaadgpVT\n' +
        'VqLbhdgkN6jkemPTlfMehyS49AAbmqeKfo2U72tm9ZqT2cPVCASMjN/Ux2qG\n' +
        '3W8HTo0KIVFSbkTthl1zAlwAFksp0q437+pxbdJIecJ9mO6N4OQMnv+hVBDc\n' +
        'WrPqBDJ0nas4JNgLxmLv0pheGg/TEfwS/p6xGRW5m08bj2l0cgqmEaM27jbi\n' +
        'DEpOykRWsDMhheEfI2zV/Qam8QARAQABwsB2BBgBCAAqBYJk7zWYCZBMYqhm\n' +
        'fI2WQQKbDBYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAAAnBggA1gkIopr9HJFP\n' +
        'fO5SebcbowH4AG9M0qBqF4h1JIKbqvOnxLSsC5QmmzFcjS9ihyHBvzbRVGkC\n' +
        'zEHYpLRedQ2AmQQfsf/VOoZJEOlb7tTk4+SpYtsGte5X/yLT5Bkls7Rp8ubK\n' +
        '/V99muj1nA/OkasllXQUSGEweVz6ejzJ0oMm3Vewmw8PelsdAnfS7Ud1MnXQ\n' +
        'h+O8TCR56F5gAMWxZmxFpZMZyUFOH6KM+vL7HJUBztUS2g0ELsHKy9ep2yhv\n' +
        'iABIwx/gEuPr0NDAH9x9XFKg5m3rO64KTY4BRWBISwmQ25dM1s1bwDPLi5XI\n' +
        '6Daw1glFxpPRrxgQGlVLzJOu5b8swQ==\n' +
        '=9hCc\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4AcXBsWlDMRiF0c8XTeAJPIAgoFbgQew1PIbXyKsyhUGtCqM6ZAJX6Z32fykM4hnuObv71++TYJRKlHtji1EqUe6NSJgJM2G2W74/nkzIvfHKKJUZwkyYCbOUe+Odcm/MEGbCTJil2/VMdLx8Eo1S2SL3RnS7nomEmTATZmm//BANKlHujS1GqUT7hRVhJsyEWWLSKJVXcm/MEGbCTJgl/sm9EY1SmTFKJcq9EY1SiYSZMBNm6XE6sHJhJffGOz1OByJhJsyE2R/3lDA4e9QQhAAAAABJRU5ErkJggg=='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x119bb8ad40B1f94e2b30ae5f59eeaEB67cD0Bd6C',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0x6e0C509d14EbF26A529bf6DC5CC9bee7F5b8DBa4',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0xE3FDD0527a9F8418f9a7D9e970452827FbE202FF',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADouo4S2kPqA//+I7nDAk15/LcJ2TGvDhOYuPNUNMiNGOb4\n' +
        'txusuKz6HOaG+K9hiUBpHjKrYEmCT2FEXxt8bfS3SpWb74RHSkWUNUkxk25y\n' +
        'gE5gaCKyAdcnOUyVLmobVFFYtH6naK9bULaUtkVik1P0iuEevWHxtTpsjbyH\n' +
        'bZtNpVTdprdLib4Wx6bb7VogsvjlvNJcVJ4sfPE0XgsQgAGIev7yJyU0DGzt\n' +
        '/EbvFX4sv51Kb1dX9ctBcvzVbs9+qT6LTivsrQp+TNHUN4zEeMhnWFFP5K1d\n' +
        'H445S6FWk53XvBudcOkFPtltU1MPCS6hmhevArBfYzy5eSlaKA/fH+kFABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZCrD2gy8Zu4awMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBKru9/u8wPcTeHibkasPaDLxm7hrAADa/Af+PbamVg/Ig2S2\n' +
        'HgIy4w5x7ulSk1/49+AmuiUMiVUwJSVBhROsyDbLET56w4+1TIMYZFJaczW3\n' +
        '8tCvAOUSauzc52I3zwGmaCupBJokIWp7ncPh0B8TFYrgThgXV7sLf3xy4roy\n' +
        'y8oFz1Zla88krwtPe4Az7TF+WNdXoDsLNJ3GXRmNqs1GITmDqAXFWncl12NM\n' +
        'ajUKWIKc/Gi1oKfz22mabJTtWBimDpA12LaGK3GjEK5CiWXT3Tzlqn6R14EZ\n' +
        '6ohpKZldSJiMPL0Bu9iT52iHOsw1wTZNC1L5lKhOCi3c+/fLRcJZt3hdCjqy\n' +
        'd/FSCa8/Ny/GrHBWoL49rSF4pDEA+s7ATQRk7zWYAQgAtNOoHCL7BCnjwp8O\n' +
        'htTxEI5r7Q/1zKKHiz6QKjjrGBYyR6gcmPM3JNEcvzY4OsCFnKBv2suOgrqH\n' +
        '8kXJzfpIQ7u7uJs+O3p/cn86RMANiEnO8NbB/0scpfZ7Vg3eOfoiWYE4I/1o\n' +
        'FVDCyZ1YVqtbcmuW6D8i1djjeoUmkUDZyPo7Qs6hUsJeYA/Rfl8mH5sjy2cN\n' +
        'WXf8cEtOUqJtwERXt5aRB/nBZiC0bsP6hf0HtAoNA8/96TkqrcQpODW/RckD\n' +
        'fo4wkpEONHRH+LGX7GV0pwymHu42TUnULmED6BrMgMYG2sKpxMThxtAxRaiP\n' +
        'nZ3DKXr8GCjTYnbEZpoi2zKCOQARAQABwsB2BBgBCAAqBYJk7zWYCZCrD2gy\n' +
        '8Zu4awKbDBYhBKru9/u8wPcTeHibkasPaDLxm7hrAADGyQgA5NMUkoyDTPZa\n' +
        'Znj1dB+17xBXCZ/u7pPQc1DukBefVke7/qYIicdnnEGIX3Zd7TckFRsDljR/\n' +
        '3418Bne4WyL57fAF/GgYsegpJ9n1KT7oPxWzibIaYdj7R6bkDt5r61EDWC3N\n' +
        'VBbnZu9cO15TYkObJIiyNvwbQyd6Dm313b39GnEE8sM709TWsI6Es6rRZAfC\n' +
        '+sI8ezYxqVUbP7sW3jJZYzdPOhZPHvFd5iJ2EfygEOuk5tb7AimfNwF/CNcB\n' +
        'weQGEU7feOSB9lXXA+Ag1duLM4B9bLbbHEQIPhKlBF1ED64e/W/5HNfoAkS4\n' +
        'qhzOD5XWs6xs45nnYqUbBFLG9Xk+Jg==\n' +
        '=qtAv\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsXECMRRF0csbdbAZBagHKlJMSOL90IUq2h5UABktLE6/HcizY4/fOafrcntzQB/BTKvBEcJMmAmz0keQtRpk67bzRQ1m1m0nu19E1keQCTNhJsxO1+X2JukjmHm+Ppg5Lw9mWg0yYSbMhFnhoPPy4C8JM2EmzArftBr8J2EmzIRZ6SPIWg2yPoKs1WCmjyBrNcj6CDJhJsyEWWk1OKKP4DdaDTJhJsyEWeEHrQbZuu3M3C/iCGEmzITZJ/s7LOkKUABjAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7zWZCZBMYqhmfI2WQRYhBC9DyzhpX3ACb/yTq0xiqGZ8\n' +
    'jZZBAADwAwgAq/6WjtwRt1aPTLWwtSx80Ng/Wxf97dkpebMXSj9T7f5ia1rM\n' +
    '8wqsuNUDMEMPB9LM34f6Q5pD994oeN2YT7z34u20mskiNphZdx/DNvu8w9UZ\n' +
    'rI3tyjfZULhARNVM34sSABnHtExbl4ZArhNDsT86ku0sZNjr9frn2mtgmlKN\n' +
    'nQdGcLJSxbci0hFg3nE5mYNpwZNs2S/2uk11WHKxzMhII6AdePE77BKPqedu\n' +
    'PiXDODO2dIvV8glLQoJPRPgc2ap+/xYIBUFljqHGPU/62VSLlHxBJv72p5s/\n' +
    'kOxiqD42TmpaaMtfudqgsZsGoYpZDHcMKYGNZs+9qVRHPRD+s0QhEA==\n' +
    '=c6IF\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'influential_maroon_gamefowl',
  groupDescription: 'urgent_brown_butterfly',
  isPublic: false,
  groupCreator: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
  chatId: '5f769c881ffe328117dea3d3acd0b97ce7f4c163e440f75a96be3e33f7d2a000',
  meta: null,
  scheduleAt: null,
  scheduleEnd: null,
  groupType: 'default',
  status: null,
  rules: {},
  eventType: 'update'
}
```

| Parameter                  | Type                  | Remarks                                                        |
| -------------------------- | --------------------- | -------------------------------------------------------------- |
| `members`                  | `Array<Object>`       | An array containing member objects.                            |
| `members.wallet`           | `string`              | The wallet address of the member.                              |
| `members.publicKey`        | `string`              | The member's public PGP key (if available).                    |
| `members.isAdmin`          | `boolean`             | Indicates whether the member is an admin.                      |
| `members.image`            | `string`              | Image associated with the member.                              |
| `pendingMembers`           | `Array<Object>`       | An array containing pending member objects.                    |
| `pendingMembers.wallet`    | `string`              | The wallet address of the pending member.                      |
| `pendingMembers.publicKey` | `string`              | The pending member's public PGP key (if available).            |
| `pendingMembers.isAdmin`   | `boolean`             | Indicates whether the pending member is an admin.              |
| `pendingMembers.image`     | `string`              | Image associated with the pending member.                      |
| `contractAddressERC20`     | `string` or `null`    | Contract address for ERC20 tokens (Used for tokenGating).      |
| `numberOfERC20`            | `number`              | The number of ERC20 tokens associated. (Used for tokenGating). |
| `contractAddressNFT`       | `string` or `null`    | Contract address for NFT tokens (Used for tokenGating)         |
| `numberOfNFTTokens`        | `number`              | The number of NFT tokens associated. (Used for tokenGating)    |
| `verificationProof`        | `string`              | Verification proof associated with group data.                 |
| `groupImage`               | `string`              | Group's image.                                                 |
| `groupName`                | `string`              | The name of the group.                                         |
| `groupDescription`         | `string`              | Description of the group.                                      |
| `isPublic`                 | `boolean`             | Indicates whether the group is public or private.              |
| `groupCreator`             | `string`              | Push Profile DID of the group creator.                         |
| `chatId`                   | `string`              | Unique chat ID associated with the group.                      |
| `meta`                     | `object` or `null`    | Additional metadata (if available).                            |
| `scheduleAt`               | `timestamp` or `null` | Scheduled start time (if available).                           |
| `scheduleEnd`              | `timestamp` or `null` | Scheduled end time (if available).                             |
| `groupType`                | `string`              | Type of the group (default, spaces, live etc).                 |
| `status`                   | `string` or `null`    | Status information ( active, expired etc)                      |
| `rules`                    | `Object`              | Group-specific moderation rules                                |
| `eventType`                | `string`              | The type of event (create, update etc)                         |

</details>

---

### **Add To Group**

```typescript
// Add Member To Group
const addMemberToGroup = await userAlice.chat.group.add(groupChatId, {
  role : 'MEMBER'
  accounts: [account1, account2]
});

// Add Admin To Group
const addAdminToGroup = await userAlice.chat.group.add(groupChatId, {
  role : 'ADMIN'
  accounts: [account1, account2]
});
```

| Param              | Type                | Default | Remarks                                         |
| ------------------ | ------------------- | ------- | ----------------------------------------------- |
| `chatId`           | `string`            | -       | Unique identifier of the group.                 |
| `options`          | `object`            | -       | Configuration for adding participants to group. |
| `options.role`     | `ADMIN` or `MEMBER` | -       | Role of added participant                       |
| `options.accounts` | `string[]`          | -       | Added participant addresses                     |

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  members: [
    {
      wallet: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADeYpZfxgn1HoMUuWM42v8ZWfLPwglQYmzz5rY3PdPPoRFU\n' +
        'v0AyPjYKpmLh2ZNfXjPaS9GuMdpXaomYSEwsV02hXZOQelo9cLop0Fc2i+l7\n' +
        '70rYhePuOuQ+XD/xYzhngAgNJ9rX96YnSodldb8uJfxYmgoF0E9Z2o2fgZGj\n' +
        'll2CPnOaLXZaBQlPS3x/461TmZ1n2ZePS/fwiC7taLz3PtyGtKaC0vo4isvI\n' +
        'yf04fkjudG0XIns5CWjdR2HeDC8BzSl8OVj8AQAc5uVU8Abk+ejWVr4zfoox\n' +
        'eaziDPgGdkckFiQ6Tdsg0tPwwOpSrCCtJocTmc/fWaBb0YlnyAAL88fJABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZBMYqhmfI2WQQMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAACxNQf/UrM/whR7vCs+\n' +
        'ez8Y8Hz4WqIuXtfMh4l2nKVv5UUuAfQkBxEY5j6Ga2+JgKU3neQ34x/v6fm9\n' +
        'CLcY38Tc4AWyEx8KC78J+xOs7RMfyNBeiaf8KdaFfQrP0nMmufE6TxkfV1Y5\n' +
        'LJZZ8350rZVtYJppWtlH+gbyUmMObyWDWbL3aWtqa3xjv0kLsf7TnugiFwzB\n' +
        'gHHtk8tlDSOxRt0VdNNd19+/zrBYNl07Ig24WD2ETaJiaqa651z24/6/MkGT\n' +
        'MBoQh+679tuWWcTrNi4jIA8jhSQ5BOgbAapl3qXk0m9/Aexpe2s6ISLXe8YJ\n' +
        'j4cObDLv/ZKKeLZYTq9lVCydLAQUbs7ATQRk7zWYAQgAmx36uefgUF4cCSYH\n' +
        'WMWAOTyc8Awo+hxn6FktOLU1+9hfGrX2jwGLOoOwjNgbYJbiSvRglAX2b57/\n' +
        'qkkltAg1ZYCLSUzfBUbbWYlJNBwpv7+52zHaLUZ3gmI5aE48ad+uzaadgpVT\n' +
        'VqLbhdgkN6jkemPTlfMehyS49AAbmqeKfo2U72tm9ZqT2cPVCASMjN/Ux2qG\n' +
        '3W8HTo0KIVFSbkTthl1zAlwAFksp0q437+pxbdJIecJ9mO6N4OQMnv+hVBDc\n' +
        'WrPqBDJ0nas4JNgLxmLv0pheGg/TEfwS/p6xGRW5m08bj2l0cgqmEaM27jbi\n' +
        'DEpOykRWsDMhheEfI2zV/Qam8QARAQABwsB2BBgBCAAqBYJk7zWYCZBMYqhm\n' +
        'fI2WQQKbDBYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAAAnBggA1gkIopr9HJFP\n' +
        'fO5SebcbowH4AG9M0qBqF4h1JIKbqvOnxLSsC5QmmzFcjS9ihyHBvzbRVGkC\n' +
        'zEHYpLRedQ2AmQQfsf/VOoZJEOlb7tTk4+SpYtsGte5X/yLT5Bkls7Rp8ubK\n' +
        '/V99muj1nA/OkasllXQUSGEweVz6ejzJ0oMm3Vewmw8PelsdAnfS7Ud1MnXQ\n' +
        'h+O8TCR56F5gAMWxZmxFpZMZyUFOH6KM+vL7HJUBztUS2g0ELsHKy9ep2yhv\n' +
        'iABIwx/gEuPr0NDAH9x9XFKg5m3rO64KTY4BRWBISwmQ25dM1s1bwDPLi5XI\n' +
        '6Daw1glFxpPRrxgQGlVLzJOu5b8swQ==\n' +
        '=9hCc\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4AcXBsWlDMRiF0c8XTeAJPIAgoFbgQew1PIbXyKsyhUGtCqM6ZAJX6Z32fykM4hnuObv71++TYJRKlHtji1EqUe6NSJgJM2G2W74/nkzIvfHKKJUZwkyYCbOUe+Odcm/MEGbCTJil2/VMdLx8Eo1S2SL3RnS7nomEmTATZmm//BANKlHujS1GqUT7hRVhJsyEWWLSKJVXcm/MEGbCTJgl/sm9EY1SmTFKJcq9EY1SiYSZMBNm6XE6sHJhJffGOz1OByJhJsyE2R/3lDA4e9QQhAAAAABJRU5ErkJggg=='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x119bb8ad40B1f94e2b30ae5f59eeaEB67cD0Bd6C',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0x6e0C509d14EbF26A529bf6DC5CC9bee7F5b8DBa4',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0xE3FDD0527a9F8418f9a7D9e970452827FbE202FF',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADouo4S2kPqA//+I7nDAk15/LcJ2TGvDhOYuPNUNMiNGOb4\n' +
        'txusuKz6HOaG+K9hiUBpHjKrYEmCT2FEXxt8bfS3SpWb74RHSkWUNUkxk25y\n' +
        'gE5gaCKyAdcnOUyVLmobVFFYtH6naK9bULaUtkVik1P0iuEevWHxtTpsjbyH\n' +
        'bZtNpVTdprdLib4Wx6bb7VogsvjlvNJcVJ4sfPE0XgsQgAGIev7yJyU0DGzt\n' +
        '/EbvFX4sv51Kb1dX9ctBcvzVbs9+qT6LTivsrQp+TNHUN4zEeMhnWFFP5K1d\n' +
        'H445S6FWk53XvBudcOkFPtltU1MPCS6hmhevArBfYzy5eSlaKA/fH+kFABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZCrD2gy8Zu4awMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBKru9/u8wPcTeHibkasPaDLxm7hrAADa/Af+PbamVg/Ig2S2\n' +
        'HgIy4w5x7ulSk1/49+AmuiUMiVUwJSVBhROsyDbLET56w4+1TIMYZFJaczW3\n' +
        '8tCvAOUSauzc52I3zwGmaCupBJokIWp7ncPh0B8TFYrgThgXV7sLf3xy4roy\n' +
        'y8oFz1Zla88krwtPe4Az7TF+WNdXoDsLNJ3GXRmNqs1GITmDqAXFWncl12NM\n' +
        'ajUKWIKc/Gi1oKfz22mabJTtWBimDpA12LaGK3GjEK5CiWXT3Tzlqn6R14EZ\n' +
        '6ohpKZldSJiMPL0Bu9iT52iHOsw1wTZNC1L5lKhOCi3c+/fLRcJZt3hdCjqy\n' +
        'd/FSCa8/Ny/GrHBWoL49rSF4pDEA+s7ATQRk7zWYAQgAtNOoHCL7BCnjwp8O\n' +
        'htTxEI5r7Q/1zKKHiz6QKjjrGBYyR6gcmPM3JNEcvzY4OsCFnKBv2suOgrqH\n' +
        '8kXJzfpIQ7u7uJs+O3p/cn86RMANiEnO8NbB/0scpfZ7Vg3eOfoiWYE4I/1o\n' +
        'FVDCyZ1YVqtbcmuW6D8i1djjeoUmkUDZyPo7Qs6hUsJeYA/Rfl8mH5sjy2cN\n' +
        'WXf8cEtOUqJtwERXt5aRB/nBZiC0bsP6hf0HtAoNA8/96TkqrcQpODW/RckD\n' +
        'fo4wkpEONHRH+LGX7GV0pwymHu42TUnULmED6BrMgMYG2sKpxMThxtAxRaiP\n' +
        'nZ3DKXr8GCjTYnbEZpoi2zKCOQARAQABwsB2BBgBCAAqBYJk7zWYCZCrD2gy\n' +
        '8Zu4awKbDBYhBKru9/u8wPcTeHibkasPaDLxm7hrAADGyQgA5NMUkoyDTPZa\n' +
        'Znj1dB+17xBXCZ/u7pPQc1DukBefVke7/qYIicdnnEGIX3Zd7TckFRsDljR/\n' +
        '3418Bne4WyL57fAF/GgYsegpJ9n1KT7oPxWzibIaYdj7R6bkDt5r61EDWC3N\n' +
        'VBbnZu9cO15TYkObJIiyNvwbQyd6Dm313b39GnEE8sM709TWsI6Es6rRZAfC\n' +
        '+sI8ezYxqVUbP7sW3jJZYzdPOhZPHvFd5iJ2EfygEOuk5tb7AimfNwF/CNcB\n' +
        'weQGEU7feOSB9lXXA+Ag1duLM4B9bLbbHEQIPhKlBF1ED64e/W/5HNfoAkS4\n' +
        'qhzOD5XWs6xs45nnYqUbBFLG9Xk+Jg==\n' +
        '=qtAv\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsXECMRRF0csbdbAZBagHKlJMSOL90IUq2h5UABktLE6/HcizY4/fOafrcntzQB/BTKvBEcJMmAmz0keQtRpk67bzRQ1m1m0nu19E1keQCTNhJsxO1+X2JukjmHm+Ppg5Lw9mWg0yYSbMhFnhoPPy4C8JM2EmzArftBr8J2EmzIRZ6SPIWg2yPoKs1WCmjyBrNcj6CDJhJsyEWWk1OKKP4DdaDTJhJsyEWeEHrQbZuu3M3C/iCGEmzITZJ/s7LOkKUABjAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7zWZCZBMYqhmfI2WQRYhBC9DyzhpX3ACb/yTq0xiqGZ8\n' +
    'jZZBAADwAwgAq/6WjtwRt1aPTLWwtSx80Ng/Wxf97dkpebMXSj9T7f5ia1rM\n' +
    '8wqsuNUDMEMPB9LM34f6Q5pD994oeN2YT7z34u20mskiNphZdx/DNvu8w9UZ\n' +
    'rI3tyjfZULhARNVM34sSABnHtExbl4ZArhNDsT86ku0sZNjr9frn2mtgmlKN\n' +
    'nQdGcLJSxbci0hFg3nE5mYNpwZNs2S/2uk11WHKxzMhII6AdePE77BKPqedu\n' +
    'PiXDODO2dIvV8glLQoJPRPgc2ap+/xYIBUFljqHGPU/62VSLlHxBJv72p5s/\n' +
    'kOxiqD42TmpaaMtfudqgsZsGoYpZDHcMKYGNZs+9qVRHPRD+s0QhEA==\n' +
    '=c6IF\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'influential_maroon_gamefowl',
  groupDescription: 'urgent_brown_butterfly',
  isPublic: false,
  groupCreator: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
  chatId: '5f769c881ffe328117dea3d3acd0b97ce7f4c163e440f75a96be3e33f7d2a000',
  meta: null,
  scheduleAt: null,
  scheduleEnd: null,
  groupType: 'default',
  status: null,
  rules: {},
  eventType: 'update'
}
```

| Parameter                  | Type                  | Remarks                                                        |
| -------------------------- | --------------------- | -------------------------------------------------------------- |
| `members`                  | `Array<Object>`       | An array containing member objects.                            |
| `members.wallet`           | `string`              | The wallet address of the member.                              |
| `members.publicKey`        | `string`              | The member's public PGP key (if available).                    |
| `members.isAdmin`          | `boolean`             | Indicates whether the member is an admin.                      |
| `members.image`            | `string`              | Image associated with the member.                              |
| `pendingMembers`           | `Array<Object>`       | An array containing pending member objects.                    |
| `pendingMembers.wallet`    | `string`              | The wallet address of the pending member.                      |
| `pendingMembers.publicKey` | `string`              | The pending member's public PGP key (if available).            |
| `pendingMembers.isAdmin`   | `boolean`             | Indicates whether the pending member is an admin.              |
| `pendingMembers.image`     | `string`              | Image associated with the pending member.                      |
| `contractAddressERC20`     | `string` or `null`    | Contract address for ERC20 tokens (Used for tokenGating).      |
| `numberOfERC20`            | `number`              | The number of ERC20 tokens associated. (Used for tokenGating). |
| `contractAddressNFT`       | `string` or `null`    | Contract address for NFT tokens (Used for tokenGating)         |
| `numberOfNFTTokens`        | `number`              | The number of NFT tokens associated. (Used for tokenGating)    |
| `verificationProof`        | `string`              | Verification proof associated with group data.                 |
| `groupImage`               | `string`              | Group's image.                                                 |
| `groupName`                | `string`              | The name of the group.                                         |
| `groupDescription`         | `string`              | Description of the group.                                      |
| `isPublic`                 | `boolean`             | Indicates whether the group is public or private.              |
| `groupCreator`             | `string`              | Push Profile DID of the group creator.                         |
| `chatId`                   | `string`              | Unique chat ID associated with the group.                      |
| `meta`                     | `object` or `null`    | Additional metadata (if available).                            |
| `scheduleAt`               | `timestamp` or `null` | Scheduled start time (if available).                           |
| `scheduleEnd`              | `timestamp` or `null` | Scheduled end time (if available).                             |
| `groupType`                | `string`              | Type of the group (default, spaces, live etc).                 |
| `status`                   | `string` or `null`    | Status information ( active, expired etc)                      |
| `rules`                    | `Object`              | Group-specific moderation rules                                |
| `eventType`                | `string`              | The type of event (create, update etc)                         |

</details>

---

### **Remove From Group**

```typescript
// Remove Members To Group
const addMemberToGroup = await userAlice.chat.group.remove(groupChatId, {
  role : 'MEMBER'
  accounts: [account1, account2] // these accounts should be a part of group
});

// Remove Admin To Group
const addAdminToGroup = await userAlice.chat.group.remove(groupChatId, {
  role : 'ADMIN'
  accounts: [account1, account2] // // these accounts should be a part of group
});
```

| Param              | Type                | Default | Remarks                                         |
| ------------------ | ------------------- | ------- | ----------------------------------------------- |
| `chatId`           | `string`            | -       | Unique identifier of the group.                 |
| `options`          | `object`            | -       | Configuration for adding participants to group. |
| `options.role`     | `ADMIN` or `MEMBER` | -       | Role of added participant                       |
| `options.accounts` | `string[]`          | -       | Added participant addresses                     |

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  members: [
    {
      wallet: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADeYpZfxgn1HoMUuWM42v8ZWfLPwglQYmzz5rY3PdPPoRFU\n' +
        'v0AyPjYKpmLh2ZNfXjPaS9GuMdpXaomYSEwsV02hXZOQelo9cLop0Fc2i+l7\n' +
        '70rYhePuOuQ+XD/xYzhngAgNJ9rX96YnSodldb8uJfxYmgoF0E9Z2o2fgZGj\n' +
        'll2CPnOaLXZaBQlPS3x/461TmZ1n2ZePS/fwiC7taLz3PtyGtKaC0vo4isvI\n' +
        'yf04fkjudG0XIns5CWjdR2HeDC8BzSl8OVj8AQAc5uVU8Abk+ejWVr4zfoox\n' +
        'eaziDPgGdkckFiQ6Tdsg0tPwwOpSrCCtJocTmc/fWaBb0YlnyAAL88fJABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZBMYqhmfI2WQQMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAACxNQf/UrM/whR7vCs+\n' +
        'ez8Y8Hz4WqIuXtfMh4l2nKVv5UUuAfQkBxEY5j6Ga2+JgKU3neQ34x/v6fm9\n' +
        'CLcY38Tc4AWyEx8KC78J+xOs7RMfyNBeiaf8KdaFfQrP0nMmufE6TxkfV1Y5\n' +
        'LJZZ8350rZVtYJppWtlH+gbyUmMObyWDWbL3aWtqa3xjv0kLsf7TnugiFwzB\n' +
        'gHHtk8tlDSOxRt0VdNNd19+/zrBYNl07Ig24WD2ETaJiaqa651z24/6/MkGT\n' +
        'MBoQh+679tuWWcTrNi4jIA8jhSQ5BOgbAapl3qXk0m9/Aexpe2s6ISLXe8YJ\n' +
        'j4cObDLv/ZKKeLZYTq9lVCydLAQUbs7ATQRk7zWYAQgAmx36uefgUF4cCSYH\n' +
        'WMWAOTyc8Awo+hxn6FktOLU1+9hfGrX2jwGLOoOwjNgbYJbiSvRglAX2b57/\n' +
        'qkkltAg1ZYCLSUzfBUbbWYlJNBwpv7+52zHaLUZ3gmI5aE48ad+uzaadgpVT\n' +
        'VqLbhdgkN6jkemPTlfMehyS49AAbmqeKfo2U72tm9ZqT2cPVCASMjN/Ux2qG\n' +
        '3W8HTo0KIVFSbkTthl1zAlwAFksp0q437+pxbdJIecJ9mO6N4OQMnv+hVBDc\n' +
        'WrPqBDJ0nas4JNgLxmLv0pheGg/TEfwS/p6xGRW5m08bj2l0cgqmEaM27jbi\n' +
        'DEpOykRWsDMhheEfI2zV/Qam8QARAQABwsB2BBgBCAAqBYJk7zWYCZBMYqhm\n' +
        'fI2WQQKbDBYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAAAnBggA1gkIopr9HJFP\n' +
        'fO5SebcbowH4AG9M0qBqF4h1JIKbqvOnxLSsC5QmmzFcjS9ihyHBvzbRVGkC\n' +
        'zEHYpLRedQ2AmQQfsf/VOoZJEOlb7tTk4+SpYtsGte5X/yLT5Bkls7Rp8ubK\n' +
        '/V99muj1nA/OkasllXQUSGEweVz6ejzJ0oMm3Vewmw8PelsdAnfS7Ud1MnXQ\n' +
        'h+O8TCR56F5gAMWxZmxFpZMZyUFOH6KM+vL7HJUBztUS2g0ELsHKy9ep2yhv\n' +
        'iABIwx/gEuPr0NDAH9x9XFKg5m3rO64KTY4BRWBISwmQ25dM1s1bwDPLi5XI\n' +
        '6Daw1glFxpPRrxgQGlVLzJOu5b8swQ==\n' +
        '=9hCc\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4AcXBsWlDMRiF0c8XTeAJPIAgoFbgQew1PIbXyKsyhUGtCqM6ZAJX6Z32fykM4hnuObv71++TYJRKlHtji1EqUe6NSJgJM2G2W74/nkzIvfHKKJUZwkyYCbOUe+Odcm/MEGbCTJil2/VMdLx8Eo1S2SL3RnS7nomEmTATZmm//BANKlHujS1GqUT7hRVhJsyEWWLSKJVXcm/MEGbCTJgl/sm9EY1SmTFKJcq9EY1SiYSZMBNm6XE6sHJhJffGOz1OByJhJsyE2R/3lDA4e9QQhAAAAABJRU5ErkJggg=='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x119bb8ad40B1f94e2b30ae5f59eeaEB67cD0Bd6C',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0x6e0C509d14EbF26A529bf6DC5CC9bee7F5b8DBa4',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0xE3FDD0527a9F8418f9a7D9e970452827FbE202FF',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADouo4S2kPqA//+I7nDAk15/LcJ2TGvDhOYuPNUNMiNGOb4\n' +
        'txusuKz6HOaG+K9hiUBpHjKrYEmCT2FEXxt8bfS3SpWb74RHSkWUNUkxk25y\n' +
        'gE5gaCKyAdcnOUyVLmobVFFYtH6naK9bULaUtkVik1P0iuEevWHxtTpsjbyH\n' +
        'bZtNpVTdprdLib4Wx6bb7VogsvjlvNJcVJ4sfPE0XgsQgAGIev7yJyU0DGzt\n' +
        '/EbvFX4sv51Kb1dX9ctBcvzVbs9+qT6LTivsrQp+TNHUN4zEeMhnWFFP5K1d\n' +
        'H445S6FWk53XvBudcOkFPtltU1MPCS6hmhevArBfYzy5eSlaKA/fH+kFABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZCrD2gy8Zu4awMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBKru9/u8wPcTeHibkasPaDLxm7hrAADa/Af+PbamVg/Ig2S2\n' +
        'HgIy4w5x7ulSk1/49+AmuiUMiVUwJSVBhROsyDbLET56w4+1TIMYZFJaczW3\n' +
        '8tCvAOUSauzc52I3zwGmaCupBJokIWp7ncPh0B8TFYrgThgXV7sLf3xy4roy\n' +
        'y8oFz1Zla88krwtPe4Az7TF+WNdXoDsLNJ3GXRmNqs1GITmDqAXFWncl12NM\n' +
        'ajUKWIKc/Gi1oKfz22mabJTtWBimDpA12LaGK3GjEK5CiWXT3Tzlqn6R14EZ\n' +
        '6ohpKZldSJiMPL0Bu9iT52iHOsw1wTZNC1L5lKhOCi3c+/fLRcJZt3hdCjqy\n' +
        'd/FSCa8/Ny/GrHBWoL49rSF4pDEA+s7ATQRk7zWYAQgAtNOoHCL7BCnjwp8O\n' +
        'htTxEI5r7Q/1zKKHiz6QKjjrGBYyR6gcmPM3JNEcvzY4OsCFnKBv2suOgrqH\n' +
        '8kXJzfpIQ7u7uJs+O3p/cn86RMANiEnO8NbB/0scpfZ7Vg3eOfoiWYE4I/1o\n' +
        'FVDCyZ1YVqtbcmuW6D8i1djjeoUmkUDZyPo7Qs6hUsJeYA/Rfl8mH5sjy2cN\n' +
        'WXf8cEtOUqJtwERXt5aRB/nBZiC0bsP6hf0HtAoNA8/96TkqrcQpODW/RckD\n' +
        'fo4wkpEONHRH+LGX7GV0pwymHu42TUnULmED6BrMgMYG2sKpxMThxtAxRaiP\n' +
        'nZ3DKXr8GCjTYnbEZpoi2zKCOQARAQABwsB2BBgBCAAqBYJk7zWYCZCrD2gy\n' +
        '8Zu4awKbDBYhBKru9/u8wPcTeHibkasPaDLxm7hrAADGyQgA5NMUkoyDTPZa\n' +
        'Znj1dB+17xBXCZ/u7pPQc1DukBefVke7/qYIicdnnEGIX3Zd7TckFRsDljR/\n' +
        '3418Bne4WyL57fAF/GgYsegpJ9n1KT7oPxWzibIaYdj7R6bkDt5r61EDWC3N\n' +
        'VBbnZu9cO15TYkObJIiyNvwbQyd6Dm313b39GnEE8sM709TWsI6Es6rRZAfC\n' +
        '+sI8ezYxqVUbP7sW3jJZYzdPOhZPHvFd5iJ2EfygEOuk5tb7AimfNwF/CNcB\n' +
        'weQGEU7feOSB9lXXA+Ag1duLM4B9bLbbHEQIPhKlBF1ED64e/W/5HNfoAkS4\n' +
        'qhzOD5XWs6xs45nnYqUbBFLG9Xk+Jg==\n' +
        '=qtAv\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsXECMRRF0csbdbAZBagHKlJMSOL90IUq2h5UABktLE6/HcizY4/fOafrcntzQB/BTKvBEcJMmAmz0keQtRpk67bzRQ1m1m0nu19E1keQCTNhJsxO1+X2JukjmHm+Ppg5Lw9mWg0yYSbMhFnhoPPy4C8JM2EmzArftBr8J2EmzIRZ6SPIWg2yPoKs1WCmjyBrNcj6CDJhJsyEWWk1OKKP4DdaDTJhJsyEWeEHrQbZuu3M3C/iCGEmzITZJ/s7LOkKUABjAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7zWZCZBMYqhmfI2WQRYhBC9DyzhpX3ACb/yTq0xiqGZ8\n' +
    'jZZBAADwAwgAq/6WjtwRt1aPTLWwtSx80Ng/Wxf97dkpebMXSj9T7f5ia1rM\n' +
    '8wqsuNUDMEMPB9LM34f6Q5pD994oeN2YT7z34u20mskiNphZdx/DNvu8w9UZ\n' +
    'rI3tyjfZULhARNVM34sSABnHtExbl4ZArhNDsT86ku0sZNjr9frn2mtgmlKN\n' +
    'nQdGcLJSxbci0hFg3nE5mYNpwZNs2S/2uk11WHKxzMhII6AdePE77BKPqedu\n' +
    'PiXDODO2dIvV8glLQoJPRPgc2ap+/xYIBUFljqHGPU/62VSLlHxBJv72p5s/\n' +
    'kOxiqD42TmpaaMtfudqgsZsGoYpZDHcMKYGNZs+9qVRHPRD+s0QhEA==\n' +
    '=c6IF\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'influential_maroon_gamefowl',
  groupDescription: 'urgent_brown_butterfly',
  isPublic: false,
  groupCreator: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
  chatId: '5f769c881ffe328117dea3d3acd0b97ce7f4c163e440f75a96be3e33f7d2a000',
  meta: null,
  scheduleAt: null,
  scheduleEnd: null,
  groupType: 'default',
  status: null,
  rules: {},
  eventType: 'update'
}
```

| Parameter                  | Type                  | Remarks                                                        |
| -------------------------- | --------------------- | -------------------------------------------------------------- |
| `members`                  | `Array<Object>`       | An array containing member objects.                            |
| `members.wallet`           | `string`              | The wallet address of the member.                              |
| `members.publicKey`        | `string`              | The member's public PGP key (if available).                    |
| `members.isAdmin`          | `boolean`             | Indicates whether the member is an admin.                      |
| `members.image`            | `string`              | Image associated with the member.                              |
| `pendingMembers`           | `Array<Object>`       | An array containing pending member objects.                    |
| `pendingMembers.wallet`    | `string`              | The wallet address of the pending member.                      |
| `pendingMembers.publicKey` | `string`              | The pending member's public PGP key (if available).            |
| `pendingMembers.isAdmin`   | `boolean`             | Indicates whether the pending member is an admin.              |
| `pendingMembers.image`     | `string`              | Image associated with the pending member.                      |
| `contractAddressERC20`     | `string` or `null`    | Contract address for ERC20 tokens (Used for tokenGating).      |
| `numberOfERC20`            | `number`              | The number of ERC20 tokens associated. (Used for tokenGating). |
| `contractAddressNFT`       | `string` or `null`    | Contract address for NFT tokens (Used for tokenGating)         |
| `numberOfNFTTokens`        | `number`              | The number of NFT tokens associated. (Used for tokenGating)    |
| `verificationProof`        | `string`              | Verification proof associated with group data.                 |
| `groupImage`               | `string`              | Group's image.                                                 |
| `groupName`                | `string`              | The name of the group.                                         |
| `groupDescription`         | `string`              | Description of the group.                                      |
| `isPublic`                 | `boolean`             | Indicates whether the group is public or private.              |
| `groupCreator`             | `string`              | Push Profile DID of the group creator.                         |
| `chatId`                   | `string`              | Unique chat ID associated with the group.                      |
| `meta`                     | `object` or `null`    | Additional metadata (if available).                            |
| `scheduleAt`               | `timestamp` or `null` | Scheduled start time (if available).                           |
| `scheduleEnd`              | `timestamp` or `null` | Scheduled end time (if available).                             |
| `groupType`                | `string`              | Type of the group (default, spaces, live etc).                 |
| `status`                   | `string` or `null`    | Status information ( active, expired etc)                      |
| `rules`                    | `Object`              | Group-specific moderation rules                                |
| `eventType`                | `string`              | The type of event (create, update etc)                         |

</details>

---

### **Join Group**

```typescript
const joinGroup = await userAlice.chat.group.join(groupChatId);
```

| Param    | Type     | Default | Remarks                         |
| -------- | -------- | ------- | ------------------------------- |
| `chatId` | `string` | -       | Unique identifier of the group. |

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  members: [
    {
      wallet: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADeYpZfxgn1HoMUuWM42v8ZWfLPwglQYmzz5rY3PdPPoRFU\n' +
        'v0AyPjYKpmLh2ZNfXjPaS9GuMdpXaomYSEwsV02hXZOQelo9cLop0Fc2i+l7\n' +
        '70rYhePuOuQ+XD/xYzhngAgNJ9rX96YnSodldb8uJfxYmgoF0E9Z2o2fgZGj\n' +
        'll2CPnOaLXZaBQlPS3x/461TmZ1n2ZePS/fwiC7taLz3PtyGtKaC0vo4isvI\n' +
        'yf04fkjudG0XIns5CWjdR2HeDC8BzSl8OVj8AQAc5uVU8Abk+ejWVr4zfoox\n' +
        'eaziDPgGdkckFiQ6Tdsg0tPwwOpSrCCtJocTmc/fWaBb0YlnyAAL88fJABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZBMYqhmfI2WQQMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAACxNQf/UrM/whR7vCs+\n' +
        'ez8Y8Hz4WqIuXtfMh4l2nKVv5UUuAfQkBxEY5j6Ga2+JgKU3neQ34x/v6fm9\n' +
        'CLcY38Tc4AWyEx8KC78J+xOs7RMfyNBeiaf8KdaFfQrP0nMmufE6TxkfV1Y5\n' +
        'LJZZ8350rZVtYJppWtlH+gbyUmMObyWDWbL3aWtqa3xjv0kLsf7TnugiFwzB\n' +
        'gHHtk8tlDSOxRt0VdNNd19+/zrBYNl07Ig24WD2ETaJiaqa651z24/6/MkGT\n' +
        'MBoQh+679tuWWcTrNi4jIA8jhSQ5BOgbAapl3qXk0m9/Aexpe2s6ISLXe8YJ\n' +
        'j4cObDLv/ZKKeLZYTq9lVCydLAQUbs7ATQRk7zWYAQgAmx36uefgUF4cCSYH\n' +
        'WMWAOTyc8Awo+hxn6FktOLU1+9hfGrX2jwGLOoOwjNgbYJbiSvRglAX2b57/\n' +
        'qkkltAg1ZYCLSUzfBUbbWYlJNBwpv7+52zHaLUZ3gmI5aE48ad+uzaadgpVT\n' +
        'VqLbhdgkN6jkemPTlfMehyS49AAbmqeKfo2U72tm9ZqT2cPVCASMjN/Ux2qG\n' +
        '3W8HTo0KIVFSbkTthl1zAlwAFksp0q437+pxbdJIecJ9mO6N4OQMnv+hVBDc\n' +
        'WrPqBDJ0nas4JNgLxmLv0pheGg/TEfwS/p6xGRW5m08bj2l0cgqmEaM27jbi\n' +
        'DEpOykRWsDMhheEfI2zV/Qam8QARAQABwsB2BBgBCAAqBYJk7zWYCZBMYqhm\n' +
        'fI2WQQKbDBYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAAAnBggA1gkIopr9HJFP\n' +
        'fO5SebcbowH4AG9M0qBqF4h1JIKbqvOnxLSsC5QmmzFcjS9ihyHBvzbRVGkC\n' +
        'zEHYpLRedQ2AmQQfsf/VOoZJEOlb7tTk4+SpYtsGte5X/yLT5Bkls7Rp8ubK\n' +
        '/V99muj1nA/OkasllXQUSGEweVz6ejzJ0oMm3Vewmw8PelsdAnfS7Ud1MnXQ\n' +
        'h+O8TCR56F5gAMWxZmxFpZMZyUFOH6KM+vL7HJUBztUS2g0ELsHKy9ep2yhv\n' +
        'iABIwx/gEuPr0NDAH9x9XFKg5m3rO64KTY4BRWBISwmQ25dM1s1bwDPLi5XI\n' +
        '6Daw1glFxpPRrxgQGlVLzJOu5b8swQ==\n' +
        '=9hCc\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4AcXBsWlDMRiF0c8XTeAJPIAgoFbgQew1PIbXyKsyhUGtCqM6ZAJX6Z32fykM4hnuObv71++TYJRKlHtji1EqUe6NSJgJM2G2W74/nkzIvfHKKJUZwkyYCbOUe+Odcm/MEGbCTJil2/VMdLx8Eo1S2SL3RnS7nomEmTATZmm//BANKlHujS1GqUT7hRVhJsyEWWLSKJVXcm/MEGbCTJgl/sm9EY1SmTFKJcq9EY1SiYSZMBNm6XE6sHJhJffGOz1OByJhJsyE2R/3lDA4e9QQhAAAAABJRU5ErkJggg=='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x119bb8ad40B1f94e2b30ae5f59eeaEB67cD0Bd6C',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0x6e0C509d14EbF26A529bf6DC5CC9bee7F5b8DBa4',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0xE3FDD0527a9F8418f9a7D9e970452827FbE202FF',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADouo4S2kPqA//+I7nDAk15/LcJ2TGvDhOYuPNUNMiNGOb4\n' +
        'txusuKz6HOaG+K9hiUBpHjKrYEmCT2FEXxt8bfS3SpWb74RHSkWUNUkxk25y\n' +
        'gE5gaCKyAdcnOUyVLmobVFFYtH6naK9bULaUtkVik1P0iuEevWHxtTpsjbyH\n' +
        'bZtNpVTdprdLib4Wx6bb7VogsvjlvNJcVJ4sfPE0XgsQgAGIev7yJyU0DGzt\n' +
        '/EbvFX4sv51Kb1dX9ctBcvzVbs9+qT6LTivsrQp+TNHUN4zEeMhnWFFP5K1d\n' +
        'H445S6FWk53XvBudcOkFPtltU1MPCS6hmhevArBfYzy5eSlaKA/fH+kFABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZCrD2gy8Zu4awMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBKru9/u8wPcTeHibkasPaDLxm7hrAADa/Af+PbamVg/Ig2S2\n' +
        'HgIy4w5x7ulSk1/49+AmuiUMiVUwJSVBhROsyDbLET56w4+1TIMYZFJaczW3\n' +
        '8tCvAOUSauzc52I3zwGmaCupBJokIWp7ncPh0B8TFYrgThgXV7sLf3xy4roy\n' +
        'y8oFz1Zla88krwtPe4Az7TF+WNdXoDsLNJ3GXRmNqs1GITmDqAXFWncl12NM\n' +
        'ajUKWIKc/Gi1oKfz22mabJTtWBimDpA12LaGK3GjEK5CiWXT3Tzlqn6R14EZ\n' +
        '6ohpKZldSJiMPL0Bu9iT52iHOsw1wTZNC1L5lKhOCi3c+/fLRcJZt3hdCjqy\n' +
        'd/FSCa8/Ny/GrHBWoL49rSF4pDEA+s7ATQRk7zWYAQgAtNOoHCL7BCnjwp8O\n' +
        'htTxEI5r7Q/1zKKHiz6QKjjrGBYyR6gcmPM3JNEcvzY4OsCFnKBv2suOgrqH\n' +
        '8kXJzfpIQ7u7uJs+O3p/cn86RMANiEnO8NbB/0scpfZ7Vg3eOfoiWYE4I/1o\n' +
        'FVDCyZ1YVqtbcmuW6D8i1djjeoUmkUDZyPo7Qs6hUsJeYA/Rfl8mH5sjy2cN\n' +
        'WXf8cEtOUqJtwERXt5aRB/nBZiC0bsP6hf0HtAoNA8/96TkqrcQpODW/RckD\n' +
        'fo4wkpEONHRH+LGX7GV0pwymHu42TUnULmED6BrMgMYG2sKpxMThxtAxRaiP\n' +
        'nZ3DKXr8GCjTYnbEZpoi2zKCOQARAQABwsB2BBgBCAAqBYJk7zWYCZCrD2gy\n' +
        '8Zu4awKbDBYhBKru9/u8wPcTeHibkasPaDLxm7hrAADGyQgA5NMUkoyDTPZa\n' +
        'Znj1dB+17xBXCZ/u7pPQc1DukBefVke7/qYIicdnnEGIX3Zd7TckFRsDljR/\n' +
        '3418Bne4WyL57fAF/GgYsegpJ9n1KT7oPxWzibIaYdj7R6bkDt5r61EDWC3N\n' +
        'VBbnZu9cO15TYkObJIiyNvwbQyd6Dm313b39GnEE8sM709TWsI6Es6rRZAfC\n' +
        '+sI8ezYxqVUbP7sW3jJZYzdPOhZPHvFd5iJ2EfygEOuk5tb7AimfNwF/CNcB\n' +
        'weQGEU7feOSB9lXXA+Ag1duLM4B9bLbbHEQIPhKlBF1ED64e/W/5HNfoAkS4\n' +
        'qhzOD5XWs6xs45nnYqUbBFLG9Xk+Jg==\n' +
        '=qtAv\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsXECMRRF0csbdbAZBagHKlJMSOL90IUq2h5UABktLE6/HcizY4/fOafrcntzQB/BTKvBEcJMmAmz0keQtRpk67bzRQ1m1m0nu19E1keQCTNhJsxO1+X2JukjmHm+Ppg5Lw9mWg0yYSbMhFnhoPPy4C8JM2EmzArftBr8J2EmzIRZ6SPIWg2yPoKs1WCmjyBrNcj6CDJhJsyEWWk1OKKP4DdaDTJhJsyEWeEHrQbZuu3M3C/iCGEmzITZJ/s7LOkKUABjAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7zWZCZBMYqhmfI2WQRYhBC9DyzhpX3ACb/yTq0xiqGZ8\n' +
    'jZZBAADwAwgAq/6WjtwRt1aPTLWwtSx80Ng/Wxf97dkpebMXSj9T7f5ia1rM\n' +
    '8wqsuNUDMEMPB9LM34f6Q5pD994oeN2YT7z34u20mskiNphZdx/DNvu8w9UZ\n' +
    'rI3tyjfZULhARNVM34sSABnHtExbl4ZArhNDsT86ku0sZNjr9frn2mtgmlKN\n' +
    'nQdGcLJSxbci0hFg3nE5mYNpwZNs2S/2uk11WHKxzMhII6AdePE77BKPqedu\n' +
    'PiXDODO2dIvV8glLQoJPRPgc2ap+/xYIBUFljqHGPU/62VSLlHxBJv72p5s/\n' +
    'kOxiqD42TmpaaMtfudqgsZsGoYpZDHcMKYGNZs+9qVRHPRD+s0QhEA==\n' +
    '=c6IF\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'influential_maroon_gamefowl',
  groupDescription: 'urgent_brown_butterfly',
  isPublic: false,
  groupCreator: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
  chatId: '5f769c881ffe328117dea3d3acd0b97ce7f4c163e440f75a96be3e33f7d2a000',
  meta: null,
  scheduleAt: null,
  scheduleEnd: null,
  groupType: 'default',
  status: null,
  rules: {},
  eventType: 'update'
}
```

| Parameter                  | Type                  | Remarks                                                        |
| -------------------------- | --------------------- | -------------------------------------------------------------- |
| `members`                  | `Array<Object>`       | An array containing member objects.                            |
| `members.wallet`           | `string`              | The wallet address of the member.                              |
| `members.publicKey`        | `string`              | The member's public PGP key (if available).                    |
| `members.isAdmin`          | `boolean`             | Indicates whether the member is an admin.                      |
| `members.image`            | `string`              | Image associated with the member.                              |
| `pendingMembers`           | `Array<Object>`       | An array containing pending member objects.                    |
| `pendingMembers.wallet`    | `string`              | The wallet address of the pending member.                      |
| `pendingMembers.publicKey` | `string`              | The pending member's public PGP key (if available).            |
| `pendingMembers.isAdmin`   | `boolean`             | Indicates whether the pending member is an admin.              |
| `pendingMembers.image`     | `string`              | Image associated with the pending member.                      |
| `contractAddressERC20`     | `string` or `null`    | Contract address for ERC20 tokens (Used for tokenGating).      |
| `numberOfERC20`            | `number`              | The number of ERC20 tokens associated. (Used for tokenGating). |
| `contractAddressNFT`       | `string` or `null`    | Contract address for NFT tokens (Used for tokenGating)         |
| `numberOfNFTTokens`        | `number`              | The number of NFT tokens associated. (Used for tokenGating)    |
| `verificationProof`        | `string`              | Verification proof associated with group data.                 |
| `groupImage`               | `string`              | Group's image.                                                 |
| `groupName`                | `string`              | The name of the group.                                         |
| `groupDescription`         | `string`              | Description of the group.                                      |
| `isPublic`                 | `boolean`             | Indicates whether the group is public or private.              |
| `groupCreator`             | `string`              | Push Profile DID of the group creator.                         |
| `chatId`                   | `string`              | Unique chat ID associated with the group.                      |
| `meta`                     | `object` or `null`    | Additional metadata (if available).                            |
| `scheduleAt`               | `timestamp` or `null` | Scheduled start time (if available).                           |
| `scheduleEnd`              | `timestamp` or `null` | Scheduled end time (if available).                             |
| `groupType`                | `string`              | Type of the group (default, spaces, live etc).                 |
| `status`                   | `string` or `null`    | Status information ( active, expired etc)                      |
| `rules`                    | `Object`              | Group-specific moderation rules                                |
| `eventType`                | `string`              | The type of event (create, update etc)                         |

</details>

---

### **Leave Group**

```typescript
// Leave Group
const leaveGrp = await userAlice.chat.group.leave(groupChatId);
```

| Param    | Type     | Default | Remarks                         |
| -------- | -------- | ------- | ------------------------------- |
| `chatId` | `string` | -       | Unique identifier of the group. |

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  members: [
    {
      wallet: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADeYpZfxgn1HoMUuWM42v8ZWfLPwglQYmzz5rY3PdPPoRFU\n' +
        'v0AyPjYKpmLh2ZNfXjPaS9GuMdpXaomYSEwsV02hXZOQelo9cLop0Fc2i+l7\n' +
        '70rYhePuOuQ+XD/xYzhngAgNJ9rX96YnSodldb8uJfxYmgoF0E9Z2o2fgZGj\n' +
        'll2CPnOaLXZaBQlPS3x/461TmZ1n2ZePS/fwiC7taLz3PtyGtKaC0vo4isvI\n' +
        'yf04fkjudG0XIns5CWjdR2HeDC8BzSl8OVj8AQAc5uVU8Abk+ejWVr4zfoox\n' +
        'eaziDPgGdkckFiQ6Tdsg0tPwwOpSrCCtJocTmc/fWaBb0YlnyAAL88fJABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZBMYqhmfI2WQQMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAACxNQf/UrM/whR7vCs+\n' +
        'ez8Y8Hz4WqIuXtfMh4l2nKVv5UUuAfQkBxEY5j6Ga2+JgKU3neQ34x/v6fm9\n' +
        'CLcY38Tc4AWyEx8KC78J+xOs7RMfyNBeiaf8KdaFfQrP0nMmufE6TxkfV1Y5\n' +
        'LJZZ8350rZVtYJppWtlH+gbyUmMObyWDWbL3aWtqa3xjv0kLsf7TnugiFwzB\n' +
        'gHHtk8tlDSOxRt0VdNNd19+/zrBYNl07Ig24WD2ETaJiaqa651z24/6/MkGT\n' +
        'MBoQh+679tuWWcTrNi4jIA8jhSQ5BOgbAapl3qXk0m9/Aexpe2s6ISLXe8YJ\n' +
        'j4cObDLv/ZKKeLZYTq9lVCydLAQUbs7ATQRk7zWYAQgAmx36uefgUF4cCSYH\n' +
        'WMWAOTyc8Awo+hxn6FktOLU1+9hfGrX2jwGLOoOwjNgbYJbiSvRglAX2b57/\n' +
        'qkkltAg1ZYCLSUzfBUbbWYlJNBwpv7+52zHaLUZ3gmI5aE48ad+uzaadgpVT\n' +
        'VqLbhdgkN6jkemPTlfMehyS49AAbmqeKfo2U72tm9ZqT2cPVCASMjN/Ux2qG\n' +
        '3W8HTo0KIVFSbkTthl1zAlwAFksp0q437+pxbdJIecJ9mO6N4OQMnv+hVBDc\n' +
        'WrPqBDJ0nas4JNgLxmLv0pheGg/TEfwS/p6xGRW5m08bj2l0cgqmEaM27jbi\n' +
        'DEpOykRWsDMhheEfI2zV/Qam8QARAQABwsB2BBgBCAAqBYJk7zWYCZBMYqhm\n' +
        'fI2WQQKbDBYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAAAnBggA1gkIopr9HJFP\n' +
        'fO5SebcbowH4AG9M0qBqF4h1JIKbqvOnxLSsC5QmmzFcjS9ihyHBvzbRVGkC\n' +
        'zEHYpLRedQ2AmQQfsf/VOoZJEOlb7tTk4+SpYtsGte5X/yLT5Bkls7Rp8ubK\n' +
        '/V99muj1nA/OkasllXQUSGEweVz6ejzJ0oMm3Vewmw8PelsdAnfS7Ud1MnXQ\n' +
        'h+O8TCR56F5gAMWxZmxFpZMZyUFOH6KM+vL7HJUBztUS2g0ELsHKy9ep2yhv\n' +
        'iABIwx/gEuPr0NDAH9x9XFKg5m3rO64KTY4BRWBISwmQ25dM1s1bwDPLi5XI\n' +
        '6Daw1glFxpPRrxgQGlVLzJOu5b8swQ==\n' +
        '=9hCc\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4AcXBsWlDMRiF0c8XTeAJPIAgoFbgQew1PIbXyKsyhUGtCqM6ZAJX6Z32fykM4hnuObv71++TYJRKlHtji1EqUe6NSJgJM2G2W74/nkzIvfHKKJUZwkyYCbOUe+Odcm/MEGbCTJil2/VMdLx8Eo1S2SL3RnS7nomEmTATZmm//BANKlHujS1GqUT7hRVhJsyEWWLSKJVXcm/MEGbCTJgl/sm9EY1SmTFKJcq9EY1SiYSZMBNm6XE6sHJhJffGOz1OByJhJsyE2R/3lDA4e9QQhAAAAABJRU5ErkJggg=='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x119bb8ad40B1f94e2b30ae5f59eeaEB67cD0Bd6C',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0x6e0C509d14EbF26A529bf6DC5CC9bee7F5b8DBa4',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0xE3FDD0527a9F8418f9a7D9e970452827FbE202FF',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADouo4S2kPqA//+I7nDAk15/LcJ2TGvDhOYuPNUNMiNGOb4\n' +
        'txusuKz6HOaG+K9hiUBpHjKrYEmCT2FEXxt8bfS3SpWb74RHSkWUNUkxk25y\n' +
        'gE5gaCKyAdcnOUyVLmobVFFYtH6naK9bULaUtkVik1P0iuEevWHxtTpsjbyH\n' +
        'bZtNpVTdprdLib4Wx6bb7VogsvjlvNJcVJ4sfPE0XgsQgAGIev7yJyU0DGzt\n' +
        '/EbvFX4sv51Kb1dX9ctBcvzVbs9+qT6LTivsrQp+TNHUN4zEeMhnWFFP5K1d\n' +
        'H445S6FWk53XvBudcOkFPtltU1MPCS6hmhevArBfYzy5eSlaKA/fH+kFABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZCrD2gy8Zu4awMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBKru9/u8wPcTeHibkasPaDLxm7hrAADa/Af+PbamVg/Ig2S2\n' +
        'HgIy4w5x7ulSk1/49+AmuiUMiVUwJSVBhROsyDbLET56w4+1TIMYZFJaczW3\n' +
        '8tCvAOUSauzc52I3zwGmaCupBJokIWp7ncPh0B8TFYrgThgXV7sLf3xy4roy\n' +
        'y8oFz1Zla88krwtPe4Az7TF+WNdXoDsLNJ3GXRmNqs1GITmDqAXFWncl12NM\n' +
        'ajUKWIKc/Gi1oKfz22mabJTtWBimDpA12LaGK3GjEK5CiWXT3Tzlqn6R14EZ\n' +
        '6ohpKZldSJiMPL0Bu9iT52iHOsw1wTZNC1L5lKhOCi3c+/fLRcJZt3hdCjqy\n' +
        'd/FSCa8/Ny/GrHBWoL49rSF4pDEA+s7ATQRk7zWYAQgAtNOoHCL7BCnjwp8O\n' +
        'htTxEI5r7Q/1zKKHiz6QKjjrGBYyR6gcmPM3JNEcvzY4OsCFnKBv2suOgrqH\n' +
        '8kXJzfpIQ7u7uJs+O3p/cn86RMANiEnO8NbB/0scpfZ7Vg3eOfoiWYE4I/1o\n' +
        'FVDCyZ1YVqtbcmuW6D8i1djjeoUmkUDZyPo7Qs6hUsJeYA/Rfl8mH5sjy2cN\n' +
        'WXf8cEtOUqJtwERXt5aRB/nBZiC0bsP6hf0HtAoNA8/96TkqrcQpODW/RckD\n' +
        'fo4wkpEONHRH+LGX7GV0pwymHu42TUnULmED6BrMgMYG2sKpxMThxtAxRaiP\n' +
        'nZ3DKXr8GCjTYnbEZpoi2zKCOQARAQABwsB2BBgBCAAqBYJk7zWYCZCrD2gy\n' +
        '8Zu4awKbDBYhBKru9/u8wPcTeHibkasPaDLxm7hrAADGyQgA5NMUkoyDTPZa\n' +
        'Znj1dB+17xBXCZ/u7pPQc1DukBefVke7/qYIicdnnEGIX3Zd7TckFRsDljR/\n' +
        '3418Bne4WyL57fAF/GgYsegpJ9n1KT7oPxWzibIaYdj7R6bkDt5r61EDWC3N\n' +
        'VBbnZu9cO15TYkObJIiyNvwbQyd6Dm313b39GnEE8sM709TWsI6Es6rRZAfC\n' +
        '+sI8ezYxqVUbP7sW3jJZYzdPOhZPHvFd5iJ2EfygEOuk5tb7AimfNwF/CNcB\n' +
        'weQGEU7feOSB9lXXA+Ag1duLM4B9bLbbHEQIPhKlBF1ED64e/W/5HNfoAkS4\n' +
        'qhzOD5XWs6xs45nnYqUbBFLG9Xk+Jg==\n' +
        '=qtAv\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsXECMRRF0csbdbAZBagHKlJMSOL90IUq2h5UABktLE6/HcizY4/fOafrcntzQB/BTKvBEcJMmAmz0keQtRpk67bzRQ1m1m0nu19E1keQCTNhJsxO1+X2JukjmHm+Ppg5Lw9mWg0yYSbMhFnhoPPy4C8JM2EmzArftBr8J2EmzIRZ6SPIWg2yPoKs1WCmjyBrNcj6CDJhJsyEWWk1OKKP4DdaDTJhJsyEWeEHrQbZuu3M3C/iCGEmzITZJ/s7LOkKUABjAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7zWZCZBMYqhmfI2WQRYhBC9DyzhpX3ACb/yTq0xiqGZ8\n' +
    'jZZBAADwAwgAq/6WjtwRt1aPTLWwtSx80Ng/Wxf97dkpebMXSj9T7f5ia1rM\n' +
    '8wqsuNUDMEMPB9LM34f6Q5pD994oeN2YT7z34u20mskiNphZdx/DNvu8w9UZ\n' +
    'rI3tyjfZULhARNVM34sSABnHtExbl4ZArhNDsT86ku0sZNjr9frn2mtgmlKN\n' +
    'nQdGcLJSxbci0hFg3nE5mYNpwZNs2S/2uk11WHKxzMhII6AdePE77BKPqedu\n' +
    'PiXDODO2dIvV8glLQoJPRPgc2ap+/xYIBUFljqHGPU/62VSLlHxBJv72p5s/\n' +
    'kOxiqD42TmpaaMtfudqgsZsGoYpZDHcMKYGNZs+9qVRHPRD+s0QhEA==\n' +
    '=c6IF\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'influential_maroon_gamefowl',
  groupDescription: 'urgent_brown_butterfly',
  isPublic: false,
  groupCreator: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
  chatId: '5f769c881ffe328117dea3d3acd0b97ce7f4c163e440f75a96be3e33f7d2a000',
  meta: null,
  scheduleAt: null,
  scheduleEnd: null,
  groupType: 'default',
  status: null,
  rules: {},
  eventType: 'update'
}
```

| Parameter                  | Type                  | Remarks                                                        |
| -------------------------- | --------------------- | -------------------------------------------------------------- |
| `members`                  | `Array<Object>`       | An array containing member objects.                            |
| `members.wallet`           | `string`              | The wallet address of the member.                              |
| `members.publicKey`        | `string`              | The member's public PGP key (if available).                    |
| `members.isAdmin`          | `boolean`             | Indicates whether the member is an admin.                      |
| `members.image`            | `string`              | Image associated with the member.                              |
| `pendingMembers`           | `Array<Object>`       | An array containing pending member objects.                    |
| `pendingMembers.wallet`    | `string`              | The wallet address of the pending member.                      |
| `pendingMembers.publicKey` | `string`              | The pending member's public PGP key (if available).            |
| `pendingMembers.isAdmin`   | `boolean`             | Indicates whether the pending member is an admin.              |
| `pendingMembers.image`     | `string`              | Image associated with the pending member.                      |
| `contractAddressERC20`     | `string` or `null`    | Contract address for ERC20 tokens (Used for tokenGating).      |
| `numberOfERC20`            | `number`              | The number of ERC20 tokens associated. (Used for tokenGating). |
| `contractAddressNFT`       | `string` or `null`    | Contract address for NFT tokens (Used for tokenGating)         |
| `numberOfNFTTokens`        | `number`              | The number of NFT tokens associated. (Used for tokenGating)    |
| `verificationProof`        | `string`              | Verification proof associated with group data.                 |
| `groupImage`               | `string`              | Group's image.                                                 |
| `groupName`                | `string`              | The name of the group.                                         |
| `groupDescription`         | `string`              | Description of the group.                                      |
| `isPublic`                 | `boolean`             | Indicates whether the group is public or private.              |
| `groupCreator`             | `string`              | Push Profile DID of the group creator.                         |
| `chatId`                   | `string`              | Unique chat ID associated with the group.                      |
| `meta`                     | `object` or `null`    | Additional metadata (if available).                            |
| `scheduleAt`               | `timestamp` or `null` | Scheduled start time (if available).                           |
| `scheduleEnd`              | `timestamp` or `null` | Scheduled end time (if available).                             |
| `groupType`                | `string`              | Type of the group (default, spaces, live etc).                 |
| `status`                   | `string` or `null`    | Status information ( active, expired etc)                      |
| `rules`                    | `Object`              | Group-specific moderation rules                                |
| `eventType`                | `string`              | The type of event (create, update etc)                         |

</details>

---

### **Reject Group Joining Request**

```typescript
// Reject Group Request
const rejectReq = await userAlice.chat.group.reject(groupChatId);
```

| Param    | Type     | Default | Remarks                         |
| -------- | -------- | ------- | ------------------------------- |
| `chatId` | `string` | -       | Unique identifier of the group. |

<!-- TODO : FIX RESPONSE -->
<!-- <details>

  <summary><b>Expected response</b></summary>

```typescript
{
  members: [
    {
      wallet: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADeYpZfxgn1HoMUuWM42v8ZWfLPwglQYmzz5rY3PdPPoRFU\n' +
        'v0AyPjYKpmLh2ZNfXjPaS9GuMdpXaomYSEwsV02hXZOQelo9cLop0Fc2i+l7\n' +
        '70rYhePuOuQ+XD/xYzhngAgNJ9rX96YnSodldb8uJfxYmgoF0E9Z2o2fgZGj\n' +
        'll2CPnOaLXZaBQlPS3x/461TmZ1n2ZePS/fwiC7taLz3PtyGtKaC0vo4isvI\n' +
        'yf04fkjudG0XIns5CWjdR2HeDC8BzSl8OVj8AQAc5uVU8Abk+ejWVr4zfoox\n' +
        'eaziDPgGdkckFiQ6Tdsg0tPwwOpSrCCtJocTmc/fWaBb0YlnyAAL88fJABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZBMYqhmfI2WQQMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAACxNQf/UrM/whR7vCs+\n' +
        'ez8Y8Hz4WqIuXtfMh4l2nKVv5UUuAfQkBxEY5j6Ga2+JgKU3neQ34x/v6fm9\n' +
        'CLcY38Tc4AWyEx8KC78J+xOs7RMfyNBeiaf8KdaFfQrP0nMmufE6TxkfV1Y5\n' +
        'LJZZ8350rZVtYJppWtlH+gbyUmMObyWDWbL3aWtqa3xjv0kLsf7TnugiFwzB\n' +
        'gHHtk8tlDSOxRt0VdNNd19+/zrBYNl07Ig24WD2ETaJiaqa651z24/6/MkGT\n' +
        'MBoQh+679tuWWcTrNi4jIA8jhSQ5BOgbAapl3qXk0m9/Aexpe2s6ISLXe8YJ\n' +
        'j4cObDLv/ZKKeLZYTq9lVCydLAQUbs7ATQRk7zWYAQgAmx36uefgUF4cCSYH\n' +
        'WMWAOTyc8Awo+hxn6FktOLU1+9hfGrX2jwGLOoOwjNgbYJbiSvRglAX2b57/\n' +
        'qkkltAg1ZYCLSUzfBUbbWYlJNBwpv7+52zHaLUZ3gmI5aE48ad+uzaadgpVT\n' +
        'VqLbhdgkN6jkemPTlfMehyS49AAbmqeKfo2U72tm9ZqT2cPVCASMjN/Ux2qG\n' +
        '3W8HTo0KIVFSbkTthl1zAlwAFksp0q437+pxbdJIecJ9mO6N4OQMnv+hVBDc\n' +
        'WrPqBDJ0nas4JNgLxmLv0pheGg/TEfwS/p6xGRW5m08bj2l0cgqmEaM27jbi\n' +
        'DEpOykRWsDMhheEfI2zV/Qam8QARAQABwsB2BBgBCAAqBYJk7zWYCZBMYqhm\n' +
        'fI2WQQKbDBYhBC9DyzhpX3ACb/yTq0xiqGZ8jZZBAAAnBggA1gkIopr9HJFP\n' +
        'fO5SebcbowH4AG9M0qBqF4h1JIKbqvOnxLSsC5QmmzFcjS9ihyHBvzbRVGkC\n' +
        'zEHYpLRedQ2AmQQfsf/VOoZJEOlb7tTk4+SpYtsGte5X/yLT5Bkls7Rp8ubK\n' +
        '/V99muj1nA/OkasllXQUSGEweVz6ejzJ0oMm3Vewmw8PelsdAnfS7Ud1MnXQ\n' +
        'h+O8TCR56F5gAMWxZmxFpZMZyUFOH6KM+vL7HJUBztUS2g0ELsHKy9ep2yhv\n' +
        'iABIwx/gEuPr0NDAH9x9XFKg5m3rO64KTY4BRWBISwmQ25dM1s1bwDPLi5XI\n' +
        '6Daw1glFxpPRrxgQGlVLzJOu5b8swQ==\n' +
        '=9hCc\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4AcXBsWlDMRiF0c8XTeAJPIAgoFbgQew1PIbXyKsyhUGtCqM6ZAJX6Z32fykM4hnuObv71++TYJRKlHtji1EqUe6NSJgJM2G2W74/nkzIvfHKKJUZwkyYCbOUe+Odcm/MEGbCTJil2/VMdLx8Eo1S2SL3RnS7nomEmTATZmm//BANKlHujS1GqUT7hRVhJsyEWWLSKJVXcm/MEGbCTJgl/sm9EY1SmTFKJcq9EY1SiYSZMBNm6XE6sHJhJffGOz1OByJhJsyE2R/3lDA4e9QQhAAAAABJRU5ErkJggg=='
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x119bb8ad40B1f94e2b30ae5f59eeaEB67cD0Bd6C',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0x6e0C509d14EbF26A529bf6DC5CC9bee7F5b8DBa4',
      publicKey: null,
      isAdmin: false,
      image: null
    },
    {
      wallet: 'eip155:0xE3FDD0527a9F8418f9a7D9e970452827FbE202FF',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGTvNZgBCADouo4S2kPqA//+I7nDAk15/LcJ2TGvDhOYuPNUNMiNGOb4\n' +
        'txusuKz6HOaG+K9hiUBpHjKrYEmCT2FEXxt8bfS3SpWb74RHSkWUNUkxk25y\n' +
        'gE5gaCKyAdcnOUyVLmobVFFYtH6naK9bULaUtkVik1P0iuEevWHxtTpsjbyH\n' +
        'bZtNpVTdprdLib4Wx6bb7VogsvjlvNJcVJ4sfPE0XgsQgAGIev7yJyU0DGzt\n' +
        '/EbvFX4sv51Kb1dX9ctBcvzVbs9+qT6LTivsrQp+TNHUN4zEeMhnWFFP5K1d\n' +
        'H445S6FWk53XvBudcOkFPtltU1MPCS6hmhevArBfYzy5eSlaKA/fH+kFABEB\n' +
        'AAHNAMLAigQQAQgAPgWCZO81mAQLCQcICZCrD2gy8Zu4awMVCAoEFgACAQIZ\n' +
        'AQKbAwIeARYhBKru9/u8wPcTeHibkasPaDLxm7hrAADa/Af+PbamVg/Ig2S2\n' +
        'HgIy4w5x7ulSk1/49+AmuiUMiVUwJSVBhROsyDbLET56w4+1TIMYZFJaczW3\n' +
        '8tCvAOUSauzc52I3zwGmaCupBJokIWp7ncPh0B8TFYrgThgXV7sLf3xy4roy\n' +
        'y8oFz1Zla88krwtPe4Az7TF+WNdXoDsLNJ3GXRmNqs1GITmDqAXFWncl12NM\n' +
        'ajUKWIKc/Gi1oKfz22mabJTtWBimDpA12LaGK3GjEK5CiWXT3Tzlqn6R14EZ\n' +
        '6ohpKZldSJiMPL0Bu9iT52iHOsw1wTZNC1L5lKhOCi3c+/fLRcJZt3hdCjqy\n' +
        'd/FSCa8/Ny/GrHBWoL49rSF4pDEA+s7ATQRk7zWYAQgAtNOoHCL7BCnjwp8O\n' +
        'htTxEI5r7Q/1zKKHiz6QKjjrGBYyR6gcmPM3JNEcvzY4OsCFnKBv2suOgrqH\n' +
        '8kXJzfpIQ7u7uJs+O3p/cn86RMANiEnO8NbB/0scpfZ7Vg3eOfoiWYE4I/1o\n' +
        'FVDCyZ1YVqtbcmuW6D8i1djjeoUmkUDZyPo7Qs6hUsJeYA/Rfl8mH5sjy2cN\n' +
        'WXf8cEtOUqJtwERXt5aRB/nBZiC0bsP6hf0HtAoNA8/96TkqrcQpODW/RckD\n' +
        'fo4wkpEONHRH+LGX7GV0pwymHu42TUnULmED6BrMgMYG2sKpxMThxtAxRaiP\n' +
        'nZ3DKXr8GCjTYnbEZpoi2zKCOQARAQABwsB2BBgBCAAqBYJk7zWYCZCrD2gy\n' +
        '8Zu4awKbDBYhBKru9/u8wPcTeHibkasPaDLxm7hrAADGyQgA5NMUkoyDTPZa\n' +
        'Znj1dB+17xBXCZ/u7pPQc1DukBefVke7/qYIicdnnEGIX3Zd7TckFRsDljR/\n' +
        '3418Bne4WyL57fAF/GgYsegpJ9n1KT7oPxWzibIaYdj7R6bkDt5r61EDWC3N\n' +
        'VBbnZu9cO15TYkObJIiyNvwbQyd6Dm313b39GnEE8sM709TWsI6Es6rRZAfC\n' +
        '+sI8ezYxqVUbP7sW3jJZYzdPOhZPHvFd5iJ2EfygEOuk5tb7AimfNwF/CNcB\n' +
        'weQGEU7feOSB9lXXA+Ag1duLM4B9bLbbHEQIPhKlBF1ED64e/W/5HNfoAkS4\n' +
        'qhzOD5XWs6xs45nnYqUbBFLG9Xk+Jg==\n' +
        '=qtAv\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAw0lEQVR4AcXBsXECMRRF0csbdbAZBagHKlJMSOL90IUq2h5UABktLE6/HcizY4/fOafrcntzQB/BTKvBEcJMmAmz0keQtRpk67bzRQ1m1m0nu19E1keQCTNhJsxO1+X2JukjmHm+Ppg5Lw9mWg0yYSbMhFnhoPPy4C8JM2EmzArftBr8J2EmzIRZ6SPIWg2yPoKs1WCmjyBrNcj6CDJhJsyEWWk1OKKP4DdaDTJhJsyEWeEHrQbZuu3M3C/iCGEmzITZJ/s7LOkKUABjAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJk7zWZCZBMYqhmfI2WQRYhBC9DyzhpX3ACb/yTq0xiqGZ8\n' +
    'jZZBAADwAwgAq/6WjtwRt1aPTLWwtSx80Ng/Wxf97dkpebMXSj9T7f5ia1rM\n' +
    '8wqsuNUDMEMPB9LM34f6Q5pD994oeN2YT7z34u20mskiNphZdx/DNvu8w9UZ\n' +
    'rI3tyjfZULhARNVM34sSABnHtExbl4ZArhNDsT86ku0sZNjr9frn2mtgmlKN\n' +
    'nQdGcLJSxbci0hFg3nE5mYNpwZNs2S/2uk11WHKxzMhII6AdePE77BKPqedu\n' +
    'PiXDODO2dIvV8glLQoJPRPgc2ap+/xYIBUFljqHGPU/62VSLlHxBJv72p5s/\n' +
    'kOxiqD42TmpaaMtfudqgsZsGoYpZDHcMKYGNZs+9qVRHPRD+s0QhEA==\n' +
    '=c6IF\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'influential_maroon_gamefowl',
  groupDescription: 'urgent_brown_butterfly',
  isPublic: false,
  groupCreator: 'eip155:0x140BE62b2177A975Bbef398DF8934b883E7d13f9',
  chatId: '5f769c881ffe328117dea3d3acd0b97ce7f4c163e440f75a96be3e33f7d2a000',
  meta: null,
  scheduleAt: null,
  scheduleEnd: null,
  groupType: 'default',
  status: null,
  rules: {},
  eventType: 'update'
}
```

| Parameter                  | Type                  | Remarks                                                        |
| -------------------------- | --------------------- | -------------------------------------------------------------- |
| `members`                  | `Array<Object>`       | An array containing member objects.                            |
| `members.wallet`           | `string`              | The wallet address of the member.                              |
| `members.publicKey`        | `string`              | The member's public PGP key (if available).                    |
| `members.isAdmin`          | `boolean`             | Indicates whether the member is an admin.                      |
| `members.image`            | `string`              | Image associated with the member.                              |
| `pendingMembers`           | `Array<Object>`       | An array containing pending member objects.                    |
| `pendingMembers.wallet`    | `string`              | The wallet address of the pending member.                      |
| `pendingMembers.publicKey` | `string`              | The pending member's public PGP key (if available).            |
| `pendingMembers.isAdmin`   | `boolean`             | Indicates whether the pending member is an admin.              |
| `pendingMembers.image`     | `string`              | Image associated with the pending member.                      |
| `contractAddressERC20`     | `string` or `null`    | Contract address for ERC20 tokens (Used for tokenGating).      |
| `numberOfERC20`            | `number`              | The number of ERC20 tokens associated. (Used for tokenGating). |
| `contractAddressNFT`       | `string` or `null`    | Contract address for NFT tokens (Used for tokenGating)         |
| `numberOfNFTTokens`        | `number`              | The number of NFT tokens associated. (Used for tokenGating)    |
| `verificationProof`        | `string`              | Verification proof associated with group data.                 |
| `groupImage`               | `string`              | Group's image.                                                 |
| `groupName`                | `string`              | The name of the group.                                         |
| `groupDescription`         | `string`              | Description of the group.                                      |
| `isPublic`                 | `boolean`             | Indicates whether the group is public or private.              |
| `groupCreator`             | `string`              | Push Profile DID of the group creator.                         |
| `chatId`                   | `string`              | Unique chat ID associated with the group.                      |
| `meta`                     | `object` or `null`    | Additional metadata (if available).                            |
| `scheduleAt`               | `timestamp` or `null` | Scheduled start time (if available).                           |
| `scheduleEnd`              | `timestamp` or `null` | Scheduled end time (if available).                             |
| `groupType`                | `string`              | Type of the group (default, spaces, live etc).                 |
| `status`                   | `string` or `null`    | Status information ( active, expired etc)                      |
| `rules`                    | `Object`              | Group-specific moderation rules                                |
| `eventType`                | `string`              | The type of event (create, update etc)                         |

</details> -->

---

### **Fetch Encryption Info**

```typescript
// Fetch Encryption Info
const aliceEncryptionInfo = await userAlice.encryption.info();
```

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  decryptedPgpPrivateKey: '-----BEGIN PGP PRIVATE KEY BLOCK-----\n' +
    '\n' +
    'xcLYBGTvQKUBCACgsuLM540Bq39fAbLRGoaRZR5/lETkpQSArzP4+B+wxcQe\n' +
    'IItuLF9z1+OHilx/uAJ6yWH2En8QdlSBRMDCSwhLOXYnrB5dTvEM2nm+v59H\n' +
    'sIRkRUogXSIgTrcVG7Tt0JsrjBV2avOki1L4vzPvHEDUtlKcxdJ5914W2lSu\n' +
    '05xPG+ALRsYFki1ga6bt6kT1+v7GV+862hOHY/FugohLKdIZOo6CeI0ddnHF\n' +
    '9jL3pu4aTRn11VIphju3KQ2oCxF/6843OrA4X/GtVtsoRq00RBLuv61ZmRpr\n' +
    'qsOgEz009cDEWdUWs8wvf75TG/MfYM4g+9nSWflJGMSD3PfVHKTzOsYlABEB\n' +
    'AAEAB/0d/GNPwuFP73VsAAAi/qUfmlPPkJYuaBBoBslW6s3XCYAn8wCxhTwm\n' +
    'fKFrWEkcV/S2fr910Eu/gaURHggt+RxKFSXUD0z3MlTOhjHzgwQwt2Js53UG\n' +
    'hvpoNuf421uuiJ97x771gs2F5a2M1vjU5FvAlWji8hLtSVhYQVNN8BSZuhkK\n' +
    'Adq+/MsHmOvD6YkBW2xuAGo1ZVF4D8JUJDUWcjRJCMr0gJJv34c8f74EYW8b\n' +
    'LhrLGZgPRBkJemmN08sVwW5NLlPwjHTrvZOcb9RQ/N3liBwamk13dIEMNil1\n' +
    'GjGI6txtd04SXN0nTq2e+v+n8jk3HgwM3ypTAbaO+XQSBWyhBAC/mIv9OK7t\n' +
    'RoNA42+nJU+SYLEFFDew6x0b6Yg8k44gSiWiYadRWpDRP/essz641W1Ksn0a\n' +
    '02kx+m55tT6uQFFwly24FOaFexhfvhbKtmA+sfJtvQVNebgH/2EJn9QSti/y\n' +
    'rGBStwDs48Psb2ZtcNNwhYajTACLioEF/vgx7FhKbQQA1reKmY5TefRFEK0b\n' +
    'lBqkDyYZoLKxEAoXQ6IwrVbIdO2kvPVDjfAy1CqpCnDhzXdXYmHA3HHOPJgr\n' +
    'PkLc8r0MeZR7ZI67JSSFoP2ixlxJjI06vXjQVvzrCigSJfL24LaBXBjQtd8t\n' +
    'X+g4KpM+a5iGrE1dQ/dgCt/G97Ra2v7Ql5kD/01W5Q+NqXxb++YrTJOXaNhp\n' +
    'yfSWYqtf62/xMoRBY8n/jtmyVD88i61aoqRsTDy+6Ugoi9QkrzhL7PSgn6Gl\n' +
    'yy5whksUFHFIcXDGF0HtPLIuEUJ7V3tC9yZ8Q630o3Dirf1+tP6+aLoMLwb2\n' +
    '5O+SZFQk4cAVvW4aKbyGPdhlDvYxPkPNAMLAigQQAQgAPgWCZO9ApQQLCQcI\n' +
    'CZD+BWKBkBMI0AMVCAoEFgACAQIZAQKbAwIeARYhBEXCtUQEMuKbuZLzrv4F\n' +
    'YoGQEwjQAAC0VAf/VNnQ5xfPHhm6JfZ+cH2lUfy65pZ+5GqXHanB9RcxZPHe\n' +
    '9hzr0l1IJk4o48HUrIcwJhpBfXUsd9oLC81Un1io0uX37hE3in+ND4j11ZiR\n' +
    'e8kQakH67/R7XKUaD3JTfXTshVpWhVTa1mjBZZcxOzr8ZxhnuaSQ7888t5cF\n' +
    '0zBuOo6YPmqiNVudlXlhXuiAVqp+xK5yamqxW9drz767aXUAvE9GChE4+P0i\n' +
    'a1wwvvA2wkZTE2+rJKvAWA8iit4TeOTTDJoja0zc2yKxytdeOy6PWr6lGjjb\n' +
    'zJEq9uqs1tx8znRosDkb+Gw26CHdUo2uVUDGkcesqxNUv+C/4R9eubBVYMfC\n' +
    '2ARk70ClAQgA38Hi0a1rqZAPdBaUnlqY4x4pIi2KyFPQ7TmW3Y/V1NgEm9Y8\n' +
    'w3bx3TF8O8uDETn6U5ASUa2DG4gppcZrDqFsChnxhHOdJhEgh3X8LeyzuCHn\n' +
    'qWQPbo2iCt3ve0fRsK/f0ZPABgCqlgTGkeVi7KppUqB1FtkRMfh0Eqr3fLC9\n' +
    'pNRLtlnQT793rfavvXavK+0eeukZVPYbALuJq2tX0IBwr9+/6YEzSi7yo/1P\n' +
    'pRZSRSM9KQwk/R2ohS2FAytUpTRp/4OFIJqv93PxS7MlHVfe/lhc9fXeTvH2\n' +
    'sMQCfMsp16wP7Em+AjT5elJgXv3VrQ4whrr5yGfTvO9uQVoV7LKoWQARAQAB\n' +
    'AAf7BXspAJiiTGQnYsE6WQIwYFDg8lHCBmv6MFNysQD43JbBjyUxdhrL7C6O\n' +
    'A+N1dZaxXXpoHnjU/zfHyGQqw3AcFsfBqSxRV0lAXh0bZS8ZDGvFMlqtf5hn\n' +
    '1aMP3pnY5r56Kba4M5Vw2E2r5Q9Ey/YVMCVW1O1SjOIwirQGLbdhH+BZMvcf\n' +
    'iAJ2fbQ919cX3CuATJnMs1/4Q+7dzPcksE1SON6eGeixrzXAr1y/Ls04wx9/\n' +
    'DXsXyPunzNDVdZPttEbpNcWv3gZ9MHpYIYbC3kbuopC7ICvW4pkSGkl+uiV8\n' +
    'iqoi+AxjgCvXSq+eVI11sZJ+Rjqi7M9yW5qjxzw2Wy25sQQA6Jm1+nXwo0UX\n' +
    'NagosTXSf++9CDraFdbbpz2HUX8B6Ls8HwTMQ7q/EZRqmjKqeT/BxVQVp+O6\n' +
    'WNMtpnGMUQrbDI6Tcu6C3kVhZg/R9dWpRigsOHnsySrI74nYh9DBISAkabCf\n' +
    'cqir7V7treB5vcIaS80ys1vFHgtuLtTgFisCfpEEAPZEb0rbQ5PR5yTBvE80\n' +
    '0MW3OnNDqZ8905GHJ6IGJVOuQuDQfMoZ+06757IwrWrQ6mZk5WIyiHD31+tr\n' +
    'd58MP351/0wv1/WUkPEcwuxWuTIK1kKtwQkcl75wZbnqvAGOigAFlvOTNPnD\n' +
    'qZVODWmod1Yg0dLIB3HF/xV29nx5ngFJA/9ifa68aMeoZqd3CePMS3zUwyLy\n' +
    '6ZZ2cnUuBLjf87Fl9Rl+OLPMryEwA24I6ybcaa01ZsUgG2SZIwkKAovEhgmJ\n' +
    'll5mXY9GNpULHj9fr2KyLkweFnvyTwIpv0VlT7WzEthebIM0hC0eSJyNmu2C\n' +
    '/SQTKvYUIcwP3v1RMFsCNPV1dTy+wsB2BBgBCAAqBYJk70ClCZD+BWKBkBMI\n' +
    '0AKbDBYhBEXCtUQEMuKbuZLzrv4FYoGQEwjQAABMkAf/UKvQHe+oYH/hU0/p\n' +
    '7OXUMCKIzSHD9c7lrb2nnP4CGyxF+FoZbQ9qnMVuT6FX6zPyZgDtOjp8Grvc\n' +
    'ACBibxwujfnNdKBdA1r0XQGf2ht3BWYpgn9jGYw58bf3yaxr6/Dg1D7FzgbN\n' +
    'FkaarU8C4fEAhiAHY4SpMUzqej/QfrwvasjyqPnbD+vCqyTivNmpTb6LYzXP\n' +
    'BtXQW0A1B6EhmFwftGyNxIG1wEO+tWE4v4XLCyscAz8ZBMBPdfaRe26lnr6C\n' +
    'UnTUwL+VecX2uIVRE9w9FhXuKeaPoDzPWnu0SZ6WCUV3DxQwMoUB/3vJ8sRK\n' +
    'l2L+h0L32V6yjL0asut2G+qfvw==\n' +
    '=o527\n' +
    '-----END PGP PRIVATE KEY BLOCK-----\n',
  pgpPublicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGTvQKUBCACgsuLM540Bq39fAbLRGoaRZR5/lETkpQSArzP4+B+wxcQe\n' +
    'IItuLF9z1+OHilx/uAJ6yWH2En8QdlSBRMDCSwhLOXYnrB5dTvEM2nm+v59H\n' +
    'sIRkRUogXSIgTrcVG7Tt0JsrjBV2avOki1L4vzPvHEDUtlKcxdJ5914W2lSu\n' +
    '05xPG+ALRsYFki1ga6bt6kT1+v7GV+862hOHY/FugohLKdIZOo6CeI0ddnHF\n' +
    '9jL3pu4aTRn11VIphju3KQ2oCxF/6843OrA4X/GtVtsoRq00RBLuv61ZmRpr\n' +
    'qsOgEz009cDEWdUWs8wvf75TG/MfYM4g+9nSWflJGMSD3PfVHKTzOsYlABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZO9ApQQLCQcICZD+BWKBkBMI0AMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBEXCtUQEMuKbuZLzrv4FYoGQEwjQAAC0VAf/VNnQ5xfPHhm6\n' +
    'JfZ+cH2lUfy65pZ+5GqXHanB9RcxZPHe9hzr0l1IJk4o48HUrIcwJhpBfXUs\n' +
    'd9oLC81Un1io0uX37hE3in+ND4j11ZiRe8kQakH67/R7XKUaD3JTfXTshVpW\n' +
    'hVTa1mjBZZcxOzr8ZxhnuaSQ7888t5cF0zBuOo6YPmqiNVudlXlhXuiAVqp+\n' +
    'xK5yamqxW9drz767aXUAvE9GChE4+P0ia1wwvvA2wkZTE2+rJKvAWA8iit4T\n' +
    'eOTTDJoja0zc2yKxytdeOy6PWr6lGjjbzJEq9uqs1tx8znRosDkb+Gw26CHd\n' +
    'Uo2uVUDGkcesqxNUv+C/4R9eubBVYM7ATQRk70ClAQgA38Hi0a1rqZAPdBaU\n' +
    'nlqY4x4pIi2KyFPQ7TmW3Y/V1NgEm9Y8w3bx3TF8O8uDETn6U5ASUa2DG4gp\n' +
    'pcZrDqFsChnxhHOdJhEgh3X8LeyzuCHnqWQPbo2iCt3ve0fRsK/f0ZPABgCq\n' +
    'lgTGkeVi7KppUqB1FtkRMfh0Eqr3fLC9pNRLtlnQT793rfavvXavK+0eeukZ\n' +
    'VPYbALuJq2tX0IBwr9+/6YEzSi7yo/1PpRZSRSM9KQwk/R2ohS2FAytUpTRp\n' +
    '/4OFIJqv93PxS7MlHVfe/lhc9fXeTvH2sMQCfMsp16wP7Em+AjT5elJgXv3V\n' +
    'rQ4whrr5yGfTvO9uQVoV7LKoWQARAQABwsB2BBgBCAAqBYJk70ClCZD+BWKB\n' +
    'kBMI0AKbDBYhBEXCtUQEMuKbuZLzrv4FYoGQEwjQAABMkAf/UKvQHe+oYH/h\n' +
    'U0/p7OXUMCKIzSHD9c7lrb2nnP4CGyxF+FoZbQ9qnMVuT6FX6zPyZgDtOjp8\n' +
    'GrvcACBibxwujfnNdKBdA1r0XQGf2ht3BWYpgn9jGYw58bf3yaxr6/Dg1D7F\n' +
    'zgbNFkaarU8C4fEAhiAHY4SpMUzqej/QfrwvasjyqPnbD+vCqyTivNmpTb6L\n' +
    'YzXPBtXQW0A1B6EhmFwftGyNxIG1wEO+tWE4v4XLCyscAz8ZBMBPdfaRe26l\n' +
    'nr6CUnTUwL+VecX2uIVRE9w9FhXuKeaPoDzPWnu0SZ6WCUV3DxQwMoUB/3vJ\n' +
    '8sRKl2L+h0L32V6yjL0asut2G+qfvw==\n' +
    '=4XKH\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n'
}
```

| Param                    | Type                    | Remarks                        |
| ------------------------ | ----------------------- | ------------------------------ |
| `decryptedPgpPrivateKey` | `string`                | Push Profile's PGP Private key |
| `pgpPublicKey`           | `string`                | Push Profile's PGP Public key  |
| `decryptedPassword`      | `string` or `undefined` | Push Profile's Password        |

</details>

---

### **Update Encryption**

```typescript
// Update keys encryption
const aliceUpdateEncryption = await userAlice.encryption.update(
  ENCRYPTION_VERSION.PGP_V3
);
```

| Param                    | Type                                    | Default | Remarks                                               |
| ------------------------ | --------------------------------------- | ------- | ----------------------------------------------------- |
| `updatedEncryptionType`  | `ENCRYPTION_TYPE`                       | -       | New Encryption Scheme to which keys are to be updated |
| `options` \*             | `object`                                | -       | Optional Configuration for updating encryption        |
| `options.versionMeta` \* | `{ NFTPGP_V1 ?: { password : string} }` | -       | New Password ( In case of NFT Profile )               |

\* - Optional

<details>

  <summary><b>Expected response</b></summary>

```typescript
{
  did: 'eip155:0xEaC9c666570782E262f1E2a0b1d3BE4B95aFA7cd',
  wallets: 'eip155:0xEaC9c666570782E262f1E2a0b1d3BE4B95aFA7cd',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGTu6YUBCACa7JaMqfhAnD/9ynE5Rhi8KNQ1tfdQe0ay/9jXX2naZIA+\n' +
    '6WCi1uNcB2TTLfMuzsEl4u/26LTgtkr51snRt2QKgEqi5dXqbRD76wiRLd4h\n' +
    'ktBb4WB28o+BWOHYYJQq8he+zu3mQWjKLb1e9DyS0cTzwPwWVKce9IsG3NOi\n' +
    'eM7O5Kg5cU3qHXR+frF25peCBrzNXH+xuuTJPsX85h9dSz/u6dWXhk2LsX3s\n' +
    'cmX5mFcFErnGvUBddDGZc11q+WzZAtENPCxQrNjpkMtzCj9UMwgsJdzBghZZ\n' +
    'ZouGTG2uhfmIj3/KHOdwx/KGpTgC1iMVOb78kw9LmaxL6fGy4x9uvvI3ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZO7phQQLCQcICZABDloJB8hpcgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBMga3B8GDU79nd/0mAEOWgkHyGlyAAAbHAf/bJMPIyvNZNjO\n' +
    'JK2xA1hYpzIGdbi3jMego6GXrmet3qY50zMKDccB2Ot399y/nmWMVEyfKYaP\n' +
    '7N+mJbeAqIZ8TAHtpw++k/h8/hXoxb9iPsQyWYossuG499XyHnk+KEd4g0Wf\n' +
    'mqPk/XJB3xLLgW820jOsRRbWLyYKJEdh1Q+GIM+D6oIJ9ZmyRPv25u6yCF2P\n' +
    '2IQZErWeYD/LxqMDw+uHdRZJRiyFy/Y7A43clejN+p3my8oktXh2N4+tEl7i\n' +
    'Hwxc5z9AOffuEyUerm0Rjwdn8rG8po7AfuXwmTiW1Sdc9TdJtAK/n6e9EFHV\n' +
    'gHzArwyaydHHy80Wqa+UF591NkPi387ATQRk7umFAQgAs0ao+EFoKJirGHfI\n' +
    '69vZg+eAAUUKG657BzNzTAF2r5Y+a61jdcCAL+DXBcfks+H0dqG36zjOZTCJ\n' +
    'NirABp5RRPFty2VvUtOyezuKX/MBVg3st3t/yE3SncVaWMblAv3iegviNNpH\n' +
    'cFKqpHoVBWDNdhFHNsKTjpJcq3BVohy2Dxh8Di8N/1+gEPxADvIuH9MQ8MJk\n' +
    '6lB9XYXBmmqtlQ3sB916mvusUIl8Zxw1C76yY0PAXz055zJMiL1vwo5gKDiV\n' +
    'iKyzry3wq7upPGJyeTKu7uUMifTPhJtyYvon2TIik5DIgHpqKziirCrolA+s\n' +
    '7LhnFbawqDKleEdyCcL5mFCzXQARAQABwsB2BBgBCAAqBYJk7umFCZABDloJ\n' +
    'B8hpcgKbDBYhBMga3B8GDU79nd/0mAEOWgkHyGlyAABIqQgAmK9ijEEvtWTm\n' +
    '7/mhkuDEtfPfcMexfkaCcGL4SdZqVz/h+eIL8+4EbI9uq+YTzcjtX8FAEQta\n' +
    'KWFACNEOPmSy6Sb9bDoNZUVpDaZzNNtqIK9Brt4zjJLEsDfmkuW3S/SgIYBQ\n' +
    'yTkuNmmAf8dr7L4fG0JlxPyGaL1/w9UDAr7xdU7WcHuyPc0edDGeE7NwaGWp\n' +
    'uBipXFw8AkikV3fCTDuOi3uhkIzZ5zlGCshD7m0aDSABwr4hbFzLFBDSrsiW\n' +
    'GKhWGYgf5Vx8qzlwXYYnoW/rn3UXWpeTXjq46ZNaxjHJ4VxGMyn/tHZOEjDE\n' +
    'vHapLIAgGyw2b+s+zZSqsXaMkH8WOw==\n' +
    '=gPzx\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  encryptedPrivateKey: '{"ciphertext":"4f1243e1ffa76180f46ade2eb093867750c6bf72e8d6c71c7c0edca176c2f9fb32c603bb5e52d933730e0350292431b6e5287b8201f60ce9151b6a141bde98cdc3d9e5df8f84e00e5e4173bdf28b66e9590db10195fbd41ed241a65ab84fb5da251f613376bf78efe1af64613dd54fb05dced7cf8de0907d61489712ad42f06b5c775d97d15dee09b1c58cd79f596674e403353bc7e03297aa0d3fdaecac573c962409622ff8b1335b6fbb661bd2d5f5a076d9079f857849ba917662b40151041eca71385844160fc603c4d1beefbf71b26ac8968de52d6bb534ef6d6e2ea987170059d7d881dc684d28b5b2817804fba3b659e3ec0e802583e581b9f75d2f7e69e428cba91e62719e9ca6697588389db89b982370d23952120c0f972ab4b3a0da888d52b5055c60785d276152e43929df532bc7d5d68c6bc3cfdd1ca780df346113999a19d8e4a96c02f149d1ee4cde802277081ef339153872c00c9e9ddfe3ba8da8c68c0565752fea32258087e66aab37397a27b0228b5ed1aeb09a93b80778fd7f949409106c4cd82ff550aafb9d7bdce8727a76882f59ef2c54a137e51f04b6c27a0b1b92cd781dafb489a5e8203232669f5416454cc9cfe8c5b0fd8abc19d9ef16285a8da0aca2ed747adef7b49b8215790266d9c4791c250b0580e89c6429d10a1bcd45cf016a7ae30e1db948147d992722a7191e31852e6fd3c3679d868f34ebbe65f255be4b90dd64ceb52eaeee7d3356683b7fd511729493c887289ddb0f00c65ca2a95114f0e37d3b73d06333e2787c5fa6dd6f6c9e8334ff153dd63e30c81247efd497cf2c038843d8653edf23822eae07dd19d0be26a921673185bcf016533fdb59150ff46096419e6a6aeb1bd4293fc8146848d715d43afd04aa40f2b5ae9d058671677aad2413952a20b5214e18bbf3b4b033d936d673a0302967de3f74b05b74bc6c89f30ddeaab1bf6c567fcee355797b6cba17c3fcc8955bdf096e2dda2577b3374089d8c9d287552e5658c91e812bd0b8b63482c8de98fde216dd557eb34bafca2f8e73dc4582fa36332e8869f2717519921605915d8e1c75a37295e198ec0af75926d89a6832456304474a10c567334998226d9b6f709ebc216fb067d958e78a622040c91f46af202273d0b40307fb34cba5a6a57fbb196ac6e88c16d527b9bdb04b12fa7ed0bc771692712ccd146c41890b5caddbbb13b8ba77e632b2d7597256fb576ce87d2aff35a0e953b8227a5dcbf30f7d189ca7f77f6f8b2c4eb2752199a7a485ab52a6b65b6edd6cf65caaeb6f65544cc74c2fb3431fa484fb69adbda08d2402da953f20425832b6a2d712d56a5cc34095f25fb9524a478a71d387b7dea45b4bd41e79c61dceca332898dfeecf83999ed4fad892e2ede714b93f3969ad140f38bfa95d321ae5ef089cf0ce435d59f8b6611c0fd014c67ed38646f0771f1a74c1f950ee0900d883aca3ec4efbb2f7737e717007ae757d874573d4d70c9d7e38f8ff30a29b983036e684c4eaf35a7c03ed32a8e3fc62f0863c56830127a5f3c0e905a93e7466a4f43f0793cb6752b9be8d03d7be26170f694ecbb200f611bbf1dac4b6ec085deb8c3d8ee188d8c9c8c17ca720c0f0dee4d00e5866b5443b6af6e69ca64b8eb5a8f5fa1e1d27bfacbf1b0ae11241215358f5045b0d1a73d1b15dbd904709340c1e2b42a4ef78f76b8f901d6337849cff1052f06a8919255b596fb36d2fdf789fdf611813d20729c26d517dde6f11a3f6045ec5158652e128cf7c483a0fb8ab772cb5cdb56e42e6bf8c863f173307c3e053168e54e9e65bcacbb144413ff76d08a94929e6cdde2c5944246a4b344f3ca0ada3b403429750bdce76f04668b05ed79e9119f00901e7f7b4f1eea8a1b5b0186e3ed41277040a257601b0f3917db595f3f1808d92071a4e9521a251e9c5a66f2c8a57511f61b9fd88df77330aeb4bc15c043814b33610d60f6d0a13fd7977efaa1843913f6d3a79bc88020406c9979163684efe7b7ade9613221d06b52cd96abd31b77a707748d52e6e16c8c90821f29359b35307c10dafce5f35c0ff9802c23aef19f0a95b49a317cd6207002a5a9b822b4c056c4cbf9b27045dda8325d93060f358bb837f00954a6e281d1bdd1817a7cce8ed4a801f9164d32c52739c1ac650109868664be1fabab47c675222dc9ff9d75f9fb49531c832264aa5b55998675975f59e34829ce90b00092bd77e46328a6459d5c967d905b8e976611b839925ad742500231fa86cb5f7e6f39cb1e2e36b81c55269ea0f5fdcba5c8c0e38a899540d52be49c83efae5243998b926f029dc2980d4fdb1c125db409d015e0b36bc02272da1c688ee1f61d23cbde585064ab1e2164d0ca529774ec7797407ba5d988c58853e74a124a64dc24d0289b6a599354faf64790177c3032f5d660d7b76dfbf1c03388a7c75b2309c509c6a92144e124c8bd188274bc844e8f0aa7b5a06e79ad5776b5a62003b89aef194dcc03cd3c1b1f3ea541805cfc4e18aa159f9b5395185b573538c9bab16876dff91f365d16dcc56b339b01b86882ef8e52c51edd9c5b2f8a35713ed6eb43036e09f64f6e59ab417958faff974b6705400b341439fef4cba371c601927da7e0a8f23e1c6d3e070a19c2216da85f159d60303ab1321e479f4c371372845cef03daa7d2776c18face6cfa2ff9eed26f9f0a353a0f1c9a99b2556dccc1212fcb5c2078a3b0e58a7f3f7b3f346d624435ef94c95d40dc726d2e7400ae405e89473a934e7646124e34473dfe17f7f9cf481aa059ef422508ffe67f9b9276084973db0683269a046c1a0aafa7ab075b28008cbfb862b7e30c8b2afa1c2923d914b3d2469266e8e0182274a3d8d89642723820e61aa2d97a9370789ec4e89ebee05b6c0bef10778caf2a34c2d7622dde5fa64b012bea6205127c3c845229ef553f013b73823dc6631078fc628532e3e518bdc790ab8460078dedf0c5cb00492136813e2b91679bba82f3cf95169751933bee4358f84154014dbcc1de1a30613218039ebb2444429380fd283d3b60bd5d5b470e861f6ecc751c22aa467168512a0ef45755e6b59a7be591bd3b08fde874b166ccfbbedba10a0956d2d18cbda515341c2112d6094a746e9f562db6543e5bde2c4d4f7c06b7550400d66f7242a14f34cd8a7374372f0eea49a49b72909fc11ff81ea54a1e2c07225cdee856383a657b0f13c14b00ae3b7b2a32a22beaab8cfd18641dbfa82619fdcdddd3339e9423e71c487305e8aa932b694e94c37c7e418e4014c8bb264f47e8283e216eeeabf0fbdd2f5eb8d0ea979738d4f18b7bf72d7711f5d22653f217c7305314ec2c47a0ecbf1dc8f9bc1379ae38e2a04e736a1171b947609bb66f8d352ce57230d709f196953471c5504c7f9f40ed2f64bf3bd04bd57521a364ea03b5f0603cceec7851738d97c3fd73c16547d4d143b009a79832a1ed244937dce09edf2d5e32ae52ab0331c449325dce9e5e8ed1563c967a5f92031f4275e3179274ef3e0752ac01caf8a20aabb23d584d4d6607833f95cfc92832d936c37bb8b37222aa842f48944d06b37434c8dce5f19b450a7d1bd568672ef2c8eaa2afb7cff404b33377a61061f56b01849feb918521a7d63cfbe12466aedc7159c577f213f2c157586b8719164cd7108edfa9211287b43aadbad997bc62f8169eec4a6e02aeb535f670878e6af538b5281da04470d318f893102613977390a434e0557302a68ce42e532d350446d4d813b84c07b42bf22fbe4889096ec6303574c95040d8dcfed1b9bd26782c5033d7d1a491fece156cbc19a705204ed38a547e00a09b73bc7a702ef9c2e659171d1daab63958268148aba59766bc7a4ffb68c1ae047d1f0c5fb45fbacd07079f72af301c6aa00eebc0662c6792fc707d388b339d4f45afbf576bacf8730ec3e0f1e9dc0f9a6d58fd146b2293aed8d110da24336f9a4c01ae12c03ce214c6502f5fbc5224dd8b8b2e4edf2af16b811e5c8595fa76cafe34ba66199caaed48b5dfd5ae74a3e6b6d51a09c70afc30ebc0f40d51a15f1a8c2c41ec482eddf14bed3fd11a9e2aa4446268af25b49e429e2528d5df57797f6f3cd431eb5ded8f830c85cecde8012c31500ce9363903739a6759704fa87bfef984ed0285c8c0a5bf2f0985b1b511eb4145e4b27e2df6aa7b5c7a913b76b1ca869151b75c0717389b3d186f4e4637a5ceba3cef64809c3a06551a6a46be31af61c0ef78afb057f6cc625647dc04dcd74eb97f7aee0f5640e24b7662c799013efb83c80ec2851acda7c6328de789ae99ce296494225bd169e49c9a12dc7e281778f7fe275e72571cd5a3608733998d2f6b96c1d26c25223153fc5afc2f6e3d72f57fbcb2d087d718d3b6703b286f1e340c23cd3bc715797edf3ce6d5169bcf783ac9686233cc0358725143008b25bfbd329e1c30654e4b4c9461239d41ae77f706e64e5e60ce6de83becfd056f2678f17474ab9f4976b2d7d5d014d78f716d7d4edbf6ce4ed44ed677274d6b9b6e4bf4946dfd1ed8b821c81957b4bf5cd534ed6ca84dadd9d6380513dc6406b32dcd5c1bfa468a79e88a56656e71aed0c6675540e1617a31e1c122295427590e83b63e8da58a6c5c21a15703994bdc2b90d399b62679a4269224257f3ead5a2dd0980e6f5a45c5a9392929cc4743e106c7335136c9f8a3a29190462eef908eab02cda97dbcb71dff26b0ef4dae51de293b4cff0ebf37fce1391247c5ccf77dfb64974c4a1e6beeaf82041bb0d653e2e9b612f3442bba8480b86fd7b35514fc056d7429d5fb36199d4a6f632ea615d9acc961082d9d91aca416b57582bcd2f182f5f5be02b3f597c680b2e6b37ee4d133e51d077491cb536d6261808c42684d0912fd7bcc97dacdf32394e7b","salt":"da23dc7dbf23136dabc337a0caa170c0db7e4efec5f5c8a648dff9b7cd7df49f","nonce":"fe0e4ec3d40fb7de21a354bf","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"b43efae4c92a35d9c0b5f6178cb8b8a6642c77d0a9281f61beb9f6e8f7b006a5"}',
  verificationProof: 'eip191v2:0x97ca70a87ec658e0e488e8b9f71644ee23840d809803fcf5bdcd174c9f39cdeb27f6e3a8885fec5bede5f264b3996bc3fa019b0d52745a5573a972b7e79e321c1c',
  msgSent: 0,
  maxMsgPersisted: 1000,
  profile: {
    name: null,
    desc: null,
    picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4AcXBsQ3CUBBEwcfKCfIPnbgxF+ACKIYct+cGDpEdpCeCS0Damcu2PN40gqQaiE6QVAPREWbCTJgJM2EmzITZxJcg+acgqQaiEmbCTJhNQVINRCdIOgPRCZJKmAkzYTYNRLWfT6pjnalu54vOsc5U+/mkOtaZSpgJM2E2BUknSKr7eqWXdIKkEmbCTJhdtuXxphEkvxiIjjATZsJMmAkzYSbMPjaMJNvaf06gAAAAAElFTkSuQmCC',
    profileVerificationProof: null
  },
  origin: null,
  name: null,
  about: null,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4AcXBsQ3CUBBEwcfKCfIPnbgxF+ACKIYct+cGDpEdpCeCS0Damcu2PN40gqQaiE6QVAPREWbCTJgJM2EmzITZxJcg+acgqQaiEmbCTJhNQVINRCdIOgPRCZJKmAkzYTYNRLWfT6pjnalu54vOsc5U+/mkOtaZSpgJM2E2BUknSKr7eqWXdIKkEmbCTJhdtuXxphEkvxiIjjATZsJMmAkzYSbMPjaMJNvaf06gAAAAAElFTkSuQmCC',
  numMsg: 0,
  allowedNumMsg: 1000,
  encryptionType: 'eip191-aes256-gcm-hkdf-sha256',
  signature: '0x97ca70a87ec658e0e488e8b9f71644ee23840d809803fcf5bdcd174c9f39cdeb27f6e3a8885fec5bede5f264b3996bc3fa019b0d52745a5573a972b7e79e321c1c',
  sigType: 'eip191v2',
  encryptedPassword: null,
  nftOwner: null,
  linkedListHash: null,
  nfts: null
}
```

| Parameter           | Type     | Remarks                                                         |
| ------------------- | -------- | --------------------------------------------------------------- |
| did                 | `string` | user decentralized identity                                     |
| wallets             | `string` | all wallets associated to the did                               |
| publicKey           | `string` | Public PGP key                                                  |
| encryptedPrivateKey | `string` | Encrypted PGP Private Key                                       |
| verificationProof   | `string` | Verification proof                                              |
| msgSent             | `number` | Number of messages sent                                         |
| maxMsgPersisted     | `number` | Maximum number of messages that can be persisted                |
| profile             | `object` | User profile information                                        |
| origin              | `string` | Origin information (source of the data)                         |
| name                | `string` | Profile Name ( Deprecated )                                     |
| about               | `string` | Profile Description ( Deprecated )                              |
| profilePicture      | `string` | Profile Picture ( Deprecated )                                  |
| numMsg              | `number` | Number of messages sent ( Deprecated )                          |
| allowedNumMsg       | `number` | Maximum number of messages that can be persisted ( Deprecated ) |
| encryptionType      | `string` | Type of encryption used                                         |
| signature           | `string` | Account signature ( Deprecated )                                |
| sigType             | `string` | Type of signature ( Dprecated )                                 |
| encryptedPassword   | `null`   | Encrypted user password ( Deprecated )                          |
| nftOwner            | `null`   | Owner of NFT ( Deprecated )                                     |
| linkedListHash      | `null`   | Deprecated                                                      |
| nfts                | `null`   | Information about owned NFTs( Dprecated )                       |

</details>

---
