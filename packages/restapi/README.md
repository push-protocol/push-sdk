# restapi
This package gives access to Push Protocol (Push Nodes) APIs. Visit [Developer Docs](https://docs.push.org/developers) or [Push.org](https://push.org) to learn more.

# Index
- [How to use in your app?](#how-to-use-in-your-app)
  - [Installation](#installation)
  - [Import SDK](#import-sdk)
  - [About generating the signer object for different platforms](#about-generating-the-signer-object-for-different-platforms)
  - [About blockchain agnostic address format](#about-blockchain-agnostic-address-format)
  - [About Push contract addresses](#about-push-contract-addresses)
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
    -  [Decrypting encrypted pgp private key](#decrypting-encrypted-pgp-private-key-from-user-data)
    -  [Fetching list of user chats](#fetching-list-of-user-chats)
    -  [Fetching list of user chat requests](#fetching-list-of-user-chat-requests)
    -  [Fetching conversation hash between two users](#fetching-conversation-hash-between-two-users)
    -  [Fetching latest chat between two users](#fetching-latest-chat-between-two-users)
    -  [Fetching chat history between two users](#fetching-chat-history-between-two-users)
    -  [To send a message](#to-send-a-message)
    -  [To approve a chat request](#to-approve-a-chat-request)
    -  [To create a group](#to-create-a-group)
    -  [To update group details](#to-update-group-details)
    -  [To get group details by group name](#to-get-group-details-by-group-name)
    -  [To get group details by chat id](#to-get-group-details-by-chatid)
    -  [Chat helper utils](#chat-helper-utils)
        -  [Decrypting messages](#decrypting-messages)

# How to use in your app?
## Installation
```
  yarn add @pushprotocol/restapi@latest ethers@^5.6
```
  or
```
  npm install @pushprotocol/restapi@latest ethers@^5.6
```
## Import SDK
```typescript
import * as PushAPI from "@pushprotocol/restapi";
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
- [CAIP format](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md#test-cases): for any on chain addresses ***We strongly recommend using this address format***. [Learn more about the format and examples](https://docs.push.org/developers/concepts/web3-notifications).
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
  env: 'staging'
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
    message: '[d:Proposer] : 0xe8eA8bAE250028a8709A3841E0Ae1a44820d677b\n' +
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
      title: 'Idle Finance - New Proposal'
    },
    secret: ''
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
    secret: ''
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
    secret: ''
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
    secret: ''
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
    secret: ''
  },
  {
    cta: 'https://idle.finance/#/governance/proposals',
    title: 'New Proposal',
    message: '[d:Proposer] : 0xe8eA8bAE250028a8709A3841E0Ae1a44820d677b\n' +
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
      title: 'Idle Finance - New Proposal'
    },
    secret: ''
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
    secret: ''
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
    secret: ''
  },
  {
    cta: 'https://idle.finance/#/governance/proposals',
    title: 'New Proposal',
    message: '[d:Proposer] : 0xe8eA8bAE250028a8709A3841E0Ae1a44820d677b\n' +
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
      title: 'Idle Finance - New Proposal'
    },
    secret: ''
  },
  {
    cta: 'https://idle.finance/#/governance/proposals',
    title: 'New Proposal',
    message: '[d:Proposer] : 0xe8eA8bAE250028a8709A3841E0Ae1a44820d677b\n' +
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
      title: 'Idle Finance - New Proposal'
    },
    secret: ''
  }
]
```
</details>

-----

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

-----

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
  { channel: '0x94c3016ef3e503774630fC71F59B8Da9f7D470B7' }
]
```
</details>

-----

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

-----

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
    subscriber_count: 756
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
    subscriber_count: 57
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
    subscriber_count: 9
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
    subscriber_count: 9
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
    subscriber_count: 5
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
    alias_verification_event: '{"aliasAddress": "0x453552953C4e2732A38B93F7fB834e5AeF6F60f8", "aliasBlockchainId": "80001"}',
    is_alias_verified: 1,
    alias_blockchain_id: '80001',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 5
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
    subscriber_count: 4
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
    subscriber_count: 4
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
    subscriber_count: 4
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
    subscriber_count: 4
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
    subscriber_count: 4
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
    subscriber_count: 4
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
    subscriber_count: 3
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
    subscriber_count: 3
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
    subscriber_count: 3
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
    alias_verification_event: '{"aliasAddress": "0x76AF8b0ED41EEBda6Eb2aA7991e0564cCFD1eC1F", "aliasBlockchainId": "80001"}',
    is_alias_verified: 1,
    alias_blockchain_id: '80001',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3
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
    alias_verification_event: '{"aliasAddress": "0x0fEdC054075d14CF941A5cC62d22EBE9ad5de742", "aliasBlockchainId": "80001"}',
    is_alias_verified: 1,
    alias_blockchain_id: '80001',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3
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
    subscriber_count: 3
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
    subscriber_count: 3
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
    alias_verification_event: '{"aliasAddress": "0x11EaB508c309595F14E363e6a8d434BEab91eEBC", "aliasBlockchainId": "80001"}',
    is_alias_verified: 1,
    alias_blockchain_id: '80001',
    activation_status: 1,
    verified_status: 0,
    timestamp: '2023-01-03T16:38:31.000Z',
    blocked: 0,
    counter: null,
    subgraph_details: null,
    subscriber_count: 3
  }
]
```
</details>

-----


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

<details>
  <summary><b>Expected response (Opt in to channel)</b></summary>

```typescript
// PushAPI.channels.subscribe | Response - 200 OK
{ status: 'success', message: 'successfully opted into channel' }

```
</details>

-----

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

<details>
  <summary><b>Expected response (Opt out of a channel)</b></summary>

```typescript
// PushAPI.channels.unsubscribe | Response - 200 OK
{ status: 'success', message: 'successfully opted out channel' }
```
</details>

-----

### **Sending notification**


#### **Direct payload for single recipient(target)**
```typescript
// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.TARGETTED, // target
  identityType: PushAPI.payloads.IDENTITY_TYPE.DIRECT_PAYLOAD, // direct payload
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
  signer: _signer,
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.BROADCAST, // broadcast
  identityType: PushAPI.payloads.IDENTITY_TYPE.DIRECT_PAYLOAD, // direct payload
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.TARGETTED, // target
  identityType: PushAPI.payloads.IDENTITY_TYPE.IPFS, // ipfs payload
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.SUBSET, // subset
  identityType: PushAPI.payloads.IDENTITY_TYPE.IPFS, // ipfs payload
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.BROADCAST, // broadcast
  identityType: PushAPI.payloads.IDENTITY_TYPE.DIRECT_PAYLOAD, // direct payload
  ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // IPFS hash of the payload
  channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
  env: 'staging'
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.SUBSET, // subset
  identityType: PushAPI.payloads.IDENTITY_TYPE.MINIMAL, // Minimal payload
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.BROADCAST, // broadcast
  identityType: PushAPI.payloads.IDENTITY_TYPE.MINIMAL, // Minimal payload
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.TARGETTED, // target
  identityType: PushAPI.payloads.IDENTITY_TYPE.SUBGRAPH, // Subgraph payload
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.SUBSET, // subset
  identityType: PushAPI.payloads.IDENTITY_TYPE.SUBGRAPH, // graph payload
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
  signer: _signer,
  type: PushAPI.payloads.NOTIFICATION_TYPE.BROADCAST, // broadcast
  identityType: PushAPI.payloads.IDENTITY_TYPE.SUBGRAPH, // graph payload
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


<details>
  <summary><b>Expected response (Send Notification)</b></summary>

```typescript
// PushAPI.payloads.sendNotification | Response - 204 OK
```
</details>

-----


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

-----

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

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| channel*    | string  | -       | channel address    (CAIP)                 |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>DEPRECATED - Expected response (Get channel's subscribers list)</b></summary>

```typescript
// PushAPI.channels._getSubscribers | Response - 200 OK
[
  '0x004f0c30bdad515cb9c554e698b52d71f1227134',
  '0x00bce6275dfe75758a4e266e8b7381831676bb0a',
  '0x00de74918982b1350b5f1784be594b8b30a5400f',
  '0x01080667d6f0a9dd7d5f303c0a57044e93e0c2de',
  '0x012eaa22f2286e615e582963c4b8f3f1a5646882',
  '0x01382270dc0ec27cca8e84a5c6c9370022b0d9ac',
  '0x016ea99b87d0feccdf1097ba932c5d673bededbb',
  '0x02045677924949cef7450e0ad427896e8a36a581',
  '0x02057aa3359a05da74ba015c661c06877f4b1ec9',
  '0x025846389950a13292e63e4794c7d148ff57f995',
  '0x0277b0ad0ba9b830797b671f77a1fcd1ba008003',
  '0x02b24ac2239b344fbc4577801f7000901e7a3944',
  '0x0302cd04ee871672fa3f770dc63ddc764849191d',
  '0x03b22d7742fa2a8a8f01b64f40f0f2185e965cb8',
  '0x03fad591aeb926bfd95fe1e38d51811167a5ad5c',
  '0x04041ee456080b1bc83dc265f133d607124937ea',
  '0x04288caaefa55f1e8107a3b1682fdfc58d927f1b',
  '0x044b595c9b94a17adc489bd29696af40ccb3e4d2',
  '0x044c982efe7ee8443bba5fcc9feef6dc84a61421',
  '0x0478c8faa8f9863bfb69b389866d5e2fdad62032',
  '0x056397760b973bfb921bc10be9da5034b1e921d7',
  '0x05934628535b3e96f30f05258f0ed2a433288744',
  '0x05dac6b7daae1b251e8dcc1bc7fcdb2f4c36bcc6',
  '0x06a81b13358188de4c6fced42c4f58f81fca3c5c',
  '0x072e7399de2fa1711d3d7b8d99ba36e25c21d87d',
  '0x073b49dacc79d597aa69be01a6adf1ec3a7b7f93',
  '0x07add6f4fc06ac00a9b0a0d2fd3540fa011591b6',
  '0x07da8ee7714e5bc9447e5d39eacd3159d90992b1',
  '0x08249e6733d85239d91daf62b1862e2cf09ff77c',
  '0x0827206a690235b774c3147075c36d897f1c7e80',
  '0x087f5052fbcd7c02dd45fb9907c57f1eccc2be25',
  '0x08e4d14eb2ca6b67f17c569b01d8bc74084f8b33',
  '0x093512f0f6b123ed38fd687f11a9e2ece0c4c5f5',
  '0x0984100b68e6e2b3b004934ab0881ac431863283',
  '0x09a545f696881b42b118b52a04cc2ee0df365518',
  '0x0a4349a6b51c8454fcff20af639da1fbef8a2501',
  '0x0a651cf7a9b60082fecdb5f30db7914fd7d2cf93',
  '0x0a79058fcd8d50511be32e8620d88c824e730014',
  '0x0abc2c830a6757ce28377c05de38edbd4e049ddb',
  '0x0bbb52b4fd34b99d0711e07dc072086e98951e6a',
  '0x0bffd1d41787ef50f3945aae0100e6c5288a96be',
  '0x0c41b769bdc9078ba2da2dac1b7afd2017ed3de9',
  '0x0c573fc3729a7b754ea1ed7c25db55e83d860335',
  '0x0cccd55a5ac261ea29136831eeaa93bfe07f5db6',
  '0x0d94c4dbe58f6fe1566a7302b4e4c3cd03744626',
  '0x0da6c279b3f548d189a612f73956d9d2b40909db',
  '0x0e1f0a26c4de4d8bbdf220f13eb04836edd07a52',
  '0x0e2cbb9d72247f0c8a04dfbaade690dfeb93740d',
  '0x0f43eb2e71833319896b01e2412e07a0bb5e5a9d',
  '0x0f85d268402ab52cdd72d9a28f95eabb5a653545',
  '0x0fc26ce09e56594aa364d0890ae43bdc14152e25',
  '0x101598974b6dba36068657986c53b5e178d757d3',
  '0x102a2adf909b0ef85ce6d1b5dc61e72907cbb93a',
  '0x103aaa8b06d4222b89b2be71d66c9ddf621e232d',
  '0x103d189a6bab84f2ec9ab6950e66d31bec4a098e',
  '0x10f26d2b7ab670b4f3e7d8ed24cd60152a1caf87',
  '0x111771d37525db8c0bb19124f1547b4fbec16b54',
  '0x1145b29b49f9b61d6178050b4b5e520255c2e565',
  '0x124f7f89889648437c9cda73565862f398930e62',
  '0x12519784a33e899718eddecfe0045b19ee6b68d8',
  '0x1251a5e5cfba7a6dfd6509d65f6eef3e66ebf320',
  '0x127a95027b5c7e1d807433837c9cdd7e6f336803',
  '0x12c52f225608774e8e0e05d04e9b4341fd11174b',
  '0x140aa50e72b394217ec331396f9b569218820364',
  '0x1434a7882cdd877b398df5b83c883e9571c65813',
  '0x14c0157f9eea7aee61ba2606e75716e210b4697a',
  '0x14ef3ef528aea2887e40f3ea286ab2859a795463',
  '0x15287a2893c4c22098f6bf0e97e2e5b933c897ef',
  '0x15405d4d57491430fbf00dc032bd5b1fbf72e6e7',
  '0x155ddcf7d0871da12c32f1ca3a0b3df7a15aadbe',
  '0x15900c698ee356e6976e5645394f027f0704c8eb',
  '0x1590a25b46cc85f85dfcc1a3746c766a13af0cb5',
  '0x15bc81b35a8498cee37e2c7b857538b006cecaa5',
  '0x15faf8d03d669021e341122ab4bb27559e838538',
  '0x161f99e11a0d76e4aba84330738dd9c38a4d1daa',
  '0x16860bd82bc5a595b47d40a553cf13fae4bc916b',
  '0x16c67634b61eb144f8630ccd1ffff9a0d32f4657',
  '0x16eb4622f00bed1d27dccb4c0684c0e16512a36f',
  '0x18241781b17b878cfc16b109035904c8e5073e73',
  '0x186800b7e090271c922450c47ad30c2702c7bfe9',
  '0x18770728fe5d4a8a0e3f31eacbf022f7b82a6740',
  '0x190e7f3424b23ed9b54ed8ce8688cbca672ad022',
  '0x1971b593c77617092b342d63a7f9111b31a0faba',
  '0x19b3161b77b1c36d92a1ccad1cd1a301d1576d31',
  '0x1a41820f84d090e4afc3066f6d8214d2a6e32870',
  '0x1a668e5cdd5ae00d02fadf6c00bf9c9dd98aeb1a',
  '0x1aa3127b831a33830ac0fe3ee4b0741d1a4a4e04',
  '0x1bbc42f65f49a2efd83eea49c3698bd35ae3e0ec',
  '0x1bc5c90cc9bfb632ca432d46176c52b3578f64e2',
  '0x1c6f97c400a9804a1bb1d7026c77cd7494e78ca5',
  '0x1cb28bbe58891442064a3a1d5813c92c217d2424',
  '0x1d0911cfa2bd2a85d610c73a7bb04818fc4c93bd',
  '0x1da02db5b4ec5c151a8bd64f1320b5683fba3ff1',
  '0x1db67d560813ea7aba48bd8a9429cbecbeb2118e',
  '0x1e26b7da859358598bad185c83932aad741e6c10',
  '0x1ec0d39981d2dcf253b2b18b945d3310bc254560',
  '0x1ef7a2a03d5369ed0b9807adb2b16e87f1f30baf',
  '0x1ef7f4c06cb7630fdcb5dd324f22c0a8ec85f93f',
  '0x1f771818c74a052226c01ebad909640a3fd97b43',
  '0x1f85fd5b55fa2e6f544b84b9852f89ed035fdacd',
  ... 656 more items
]
```
</details>

-----
  
## For Chat
### **Create user for chat**
```typescript
const user = await PushAPI.user.create({
   signer: _signer,
   env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| signer*  | -       | -       | Signer object                              |
| env      | string  | 'prod'  | API env - 'prod', 'staging', 'dev'         |

<details>
  <summary><b>Expected response (Create Chat User)</b></summary>

```typescript
// PushAPI.user.create | Response - 200 OK
// PushAPI.user.create | Response - 400 IF USER ALREADY CREATED
```
</details>

-----

### **Get user data for chat**
```typescript
const user = await PushAPI.user.get({
   account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
   env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address (Partial CAIP)             |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

  <details>
  <summary><b>Expected response (Get Push Chat User)</b></summary>

```typescript
// PushAPI_user_get | Response - 200 OK
{
  about: null,
  name: 'turquoise-ethnic-chicken',
  did: 'eip155:0xd8634c39bbfd4033c0d3289c4515275102423681',
  encryptedPrivateKey: '{"version":"x25519-xsalsa20-poly1305","nonce":"q4o/j5qFNSIcgKhoCPZ0ujGz4/BW+IDs","ephemPublicKey":"/X3GJ8LCuv2/PRyvE2iCaM9FjRlAt52qj/pt2cVTnVc=","ciphertext":"4GNNYmarW5Vmo3pmWtq9hN9lPgodfaaj5bAvDTU87NbJsLeqLeZsvRW6MGqJQSsPsoS+FXsXFZbRIGvO73hvCl7ikGb9O/4jRyUNWhXuj3GS794UGNWGxVK8tS/kLu1OTaRG0tDhPJiIpjy4g6ejlswzG3nq0nw6f7EWSuhMKuBD6kDvC00NqvAmpvJqRMqjpZIVdx0nnA1J30RdCrBS2lG7Lkv2FYZEvJkt1ueW2eE5F9KEg63lNHd/bWY6rINdReDsPpgOdcPvEP/27c8pG/FNi0pPeYxZ4h+QqVYE791k3rJDPX6tx9vjQ1qQ9JySblrWee3Cv6UGq2DK6crteFrOaWpAVFisSzWe0ylAyp8ly1m41XnMca/TUjbltFqs5SmrjXnCqFRJp5pEYSYXFatb2/P/fFgVgJfGcz4t6FOf4aBPHBMiPkVu5scxkioSCLtMdlrNdUkFOQqLonKcNM29roADBPVEM5eHhqpDVrB7W1JqPzAxtipGBwrKQSMNBJuTH4d5EUfHLmZb6vsjuY2qZlI0ti27FsdiVm1gMUGe6txkxR8OuwV3YBGPpOfGde23r//RjBgbjQBudjksW8np2qtHmNejuqbA/2Pyb/3Pyohfil4Uly1ywbN90VH1Iz7C1XImNk54ty+wtuYZ4+gyj8L/miWUQpHpeZdoaffGII4ef3olqiP/7PkghAbkmTPV/thQDorOa6o5vX4U2A0bjqPN60U8ORrGRgz14rtJYfqMP4IIesIHuXz366bZ6yDRSZjqB4B7idNa7fyNSYTC83dpgzLMDo5VSrjRjSjx6+nolWNwkytqCj7NQw0N6p8QM2l3a8VeE7d2Qh+ycNJ6tnU5oXXwok/yVRaisDTyGhSes0M16FuY9m9sJPK2Gwhb24lrRpALZXasphp8t/8YOIY1Y6+yIeFT3/Qj+ec990Ituyx5y7F8JShMKninZPauunH2cEYT1dlbSOk2TKk7uNivTVbrW8M7n8h+i5AUpeq8LDe5QXKXfNruZO1Y/PCT3uoyFGUY69wLqi+PhBXO3DmWdWsevqjbf5FqaKVDLPzwVBaT7DWr7Pg58cR1jKYnn8zwEzGh8sS35WLdNhEgFTY1c6JTVeQS3AG/5dFSurcFK/agSPQ2eMvi4ZHH1xRYuYCO0j5Bb9PM+VhaLAkUA1xury8pV1Qvd4CDbPGnLZRzf3QCV/7hfkRoXY9UfU298oS0aDO25fiQJzfyC/r1U7ye6f1+IH/cIhSoTkUAOsE7a62kdRyngNggzvtykxgauWuWhfYtyhTEvUBvIhe7IhJNmnoCqX3jXevlqAc8vUwxi5GVq0izvOC8A6zsrbceToqXlEIFw2THdF+k7kvZ8YfeMeuejc0eC9i5WCRKk9Zvo4i7ZPOMLC6cZpGGmnEzmIPbQVtcZrkVgWMZkamc3zBnb++UBnEQhFIuXseC4sD4F9cDwjheQAXbkiHUafnTHJNLT+Hu0GA8d8GNW0ne45SmGfCTkGv1usa2TbbVJkPvvjFXviHB11CxSDjHauCzUQ1cbNvf3lddUhkmxmUOZEJDLeulEdwc4nmwBSNNVQfs4glfsoopEdfBS/az/vbC5aCUT0xUA4BPGtjeDJpt5zA+90rC9DOs2uXrkYDL5IIi6mgtWaF7PZYCNC9voKLtGTwyXpG+ZGTPoazOD3/joK7gR0hhmBS5h40v2N4a+qRjEAy4sNC4ulURSCnKOT4Y3HY3F/gOekhZXPgxJnTGSFb2YBPHl9zqKJl3QY+poei5FxS8LG1WK7QwgmmxZAV9jgEZC7w5pxc+rDMTEV1035QDpqQl38mNXhEJ2r9ZGcb1K73I1On5ogUmH6i3tM05rLNoGznd3yeOAhwoorD8NuCX9B83tWWPPxQh7nLHQBsmc1aYahqUrkiOhvJcU8NHIJZFkyC0iPmtIfdvgC4yEfd9Kh/z3SqYwx+Y9A+CoMLddLENTH3JB+Z1l9lAfJv40muBbf+oqtgAbI4aWTwx/udGhQ1uUNT74OqO/Zc1YL/FGtcBF/+xxbwjysWoGR3NvvLxC1XeXh3lVE7w1x761eB3xR/7lU0I+3MBhzZ0OGwOG3FFW+w28go4ZfQlMlcpZl9NhN9veYVb3iseI8Tg1yXijGEA4ji23mAdUJGnhwWeHlV9NSPPoiWYPHw91RVd1Ak86LhaRmMcU+0WEftMMinfOboEhr+7xx/txsluE1V2jcYsJKcdDA6MUThLxhg32dr3x/NVj8rFSRU8sl7FhMOb8I+FAoQrzi4kyFpKVWf1elp/gq9pSlWfDIi08NNXZrPSB6xh0grM9fp85UzPjUggwpVKNxCdlEVTn5iazGq+zuQekUomJ5+HOHqWWOf6t57Pv491+whFMp/kyWQIC9TSKzV68KH3XMvGpk0IhbBoRAzwU2A9fZLDD8cqxxfM/3JKVC3Glz2I1w0WNeIdwT9+SvcHV3Wsix9W86tePMziWQ7QLUU7Ox0mFf796zVQNtlEa4pHwag6EJp5zDrsv+KvYh2gatedmEypRewaeNfN+QdfBzF40elNTuCjUZ1fmKjleNwaTft38/jpxaqTKqwBhn0PoHeAh66Cs3G1TgKJSsxARICutjMEmcxoO1eAeWz2XJc0bOYFaEJliwoQu7sVhGHrsEx2Iw/k85IEKt3gc5R2lmnMY94dqnZiorRSIgRkGp59/cQ4raPgk+aYMM/mefAhYHKwVE4k/14iln1FKuJzKT5BwWRP50A73jIimRx/HxLypLIS9X2xOOVO61EAIGIRpDomLKh69F+PDQdrmslnqePI97C5Gd/JQCsFTN5jwOIyRIaah+6HGiQjNXUC8mewB7bVCOG9Wi0AKDdfHLkWejiGVQT4Vrw3nULViYk6rQ+e/divNGrwMEYFYDmLQ8p+8Emuz7UKExBiOWqI+sZTSFVZdSOqtbU7+1FEiiwHVChNNDVl6shx9KP3S6lOo21oZflQcO9J56ErOrZItyrs6DtmCTM8nbzt/XoWsJ/2HQuthnr+lOwfOfZPrJha75CZuEhJVNR73eG0QJ2YOLqXkWwp4juagvIlrQpknzudbcZno98z+xyvNXNLFQwuN7znjNZNPjHo/du4/pVc6tFiMuWOp3AIv5Q3zTG47WFoEph5awgKZBN84rGQMWO0eO/l2iPlHXq6Sng5snhvIVChQnocuC2piihs/4QpdOIM86MGKa4p4mqHVJhagRPU4U6gsNxtsruUY11R3j1dRX/RK3v1gE4+5/TcDlwi7KW41GFx4m7oDJOPiXYfDwh7C0EiKL8diJw7pHa4ldoc2iC1lnPFilEqzXxrgfhqd70+crFf8JT8UuTOalU681NZcFGDsi3ENXFlWAICkKobGe7qjJIYpSetBaWoIOqUku1T3Y6rhCrqOdu3i+8flhKavxHJFRvL/6dWwKRjYSHVOQeDNJCQuTzks7hdEizqPO7DRcdqcl5odsMt1AlM9l9TAHT3KUjPhNMz6xdpjLJzmZrDJ9EWeCYka7NfyErXZbE9/OVI2hAmkfDm47gsVsC745OkqQmXmPHV9F6la2rjfhg5AoOsJnyS5hkM3DyEGUfY+tL1OeW/uukJbJLjuZhn6LO0CgfDACMbDQb5LUziZWK3tv8Rluk6npjc6OHnaMn4mRATk/kBfNB8SsIb2j18gcZm3/bE2eTKn0737iw0JDIaBMbghkTpK0FJOxwU8xsBh4rK+ui8Mu4F1eKKwRzLOc6ROlYCcvltgeWvnmHzAn4q76SuZQkrFsHHHidUjP36mZYIAHnFGBe0pC83PMMkDepta9apfrMqmw9U5tBuSF6e939sbXMHsHAdN6uFLIPQg27LIPgyJQTklc/BfnbdTTq89mDELB4LROKjBK2KfAIInJPmwZKTMxiEh50OZUAnwdWO3yJtNehqsdhmyqnHt2CpboiV3yu8PZrz+quHzGpn+LYT5BPhzKde5Qx4LRw0s6VWTpumWe7N04X8ZYSlLrxpCgXGp60KSt0oy7wTzFuMFRZj/aQGiT43g5nNcxlgXApX2RbWOSaSe0Vios48Ntu6MH5aH28XKvYVvPwMbFzu6+JFfD2Rvv/rWmVMqxI/SD7OtgTqWXwTzbfd9EMoeOnBCk83i83O7uERQOgs6jOdqaqGFXmdVWllIYxq2UrAPA3X1pbQkfvorw9oMfFegfbWFZ1BBe4q8Jqic/YHMfK0mjW7TT31dTPtuBcVrBrQLBYMmxN4IqDj9/YcnpDmHA8N1R1vT5dLP9tm1iIBTT/xcFozNIFgqHJwFZpwV8UAFixAofr5ucdXK2PZ6u/XALE8dHTAGYNNusEoCr7RonZ58Rrb7FrZz5kXDbOYSdf8oPMLM+am2QOf4wxXZDzdPYhlIv9r4KHxXK593DGDtWfNTDgfhwyCbHe8sybZz8KTNlmSdOJ353GB9PIeuKSQuHjoowB6OMPI6hapPUrCc14NtBODHrntx1g/UukLzMLbzcXpAMWa44N8tFrWjbKYuB+dfiZesffD++I60o84MP66eiTgUA8yvy7wRGb8tVAJ0vr3N3fIPJS2nA9L4WgGfodeagGxP5KCp1xjEG6trNmWZxo5OD/Csf5Rxm+opv0q/DKB3pQja6R6iYzX/sEkB2cr1g=="}',
  encryptionType: 'x25519-xsalsa20-poly1305',
  encryptedPassword: null,
  nftOwner: null,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3klEQVR4AcXBsa2DMBSG0S+/kDxFmuxBTeneI1jKAJFwBTMwAj0ltUdhCqq89uYVjqJIuedcHvfbEyOngrWsE9/IqWAt64QlnAlnwlnHGzkVrOEYadmvM58QzoQz4azjn+EYsWINWJFAy8KEtfUnViRgCWfCmXDW5VR4sU5YW39i7deZluEYsWINWDkVLOFMOBPOumWd+KVlnbCEM+FMOOt4I9bAi0RTrIFPCGfCmXDW5VRoGY4RK9O29SfWfp1pEc6EM+Hs8rjfnhhbf2LFGvjG1p9YsQYs4Uw4E87+ANR9MUzaGGBjAAAAAElFTkSuQmCC',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGNk+F4BCADfksMMpNxl47GAOKdW841OE6NaDEBIrsfiyq0DHAEApJwl\n' +
    '3Rk3/7xoRoEEHsYLKccNLtuKBX/oEvkJNM9/XU0gFms0cGlOJxsLM/j81Ol7\n' +
    'IqoXJWGbWfxaGSB1jacddZMdXJfDy3FN7VU885zPH66t5kA/K6Ra8vzXKvKy\n' +
    'J4vTgWaYa/7OLF8oyTzEMSz1Mj/aB9z/mNdveKcnosC3jG6yDrVjrdkBJB98\n' +
    '4VBPUHlWydzCnhpsZ1iT9jazSKwedhvkic21FdC94DpFdRg9Q39GkF7kOyhj\n' +
    '91EJZJ2yhbZQSk0kSvsYW54ejFV26ccUTlHSoMOVPeYbLgha9u2Anz77ABEB\n' +
    'AAHNAMLAigQQAQgAPgUCY2T4XgQLCQcICRCszcBmB607SgMVCAoEFgACAQIZ\n' +
    'AQIbAwIeARYhBEWdLV876c+znjS0l6zNwGYHrTtKAAAKbgf/eCRgjXTWzkh9\n' +
    'Wer//RpMxrMMyi75aqUCJ9VmciLkuCnw+OMGvPCDAOa7b+dH4tE4mhwNKord\n' +
    'VkLbgaZLpcuiyRBZ4mU7gay3WivwDkl52B/VhFkzx2pd2dmPKVggDAZG8WQ1\n' +
    'ETrDEObV+t+BofLEFxAgtw/v0MDEYju+TIkwcE6gUF0xAz035SL6eS1qlV6U\n' +
    'EZ0qNheBtKw7MnBq1MWs3X/KeoRQiSPqlyTVfNI+emVTZ96EWOOB1Dbm88xa\n' +
    'JNdxPWt4ud3cYG+prcqkBYfNNhIsKMnFH2uOoIMRzmMCn5bhkNtD2hyDTb5O\n' +
    'p6qBF4HptRMRWA6z9EVx7V2sgedRw87ATQRjZPheAQgA8OqLN8MmwYkuuhAA\n' +
    'Cmwu5xPBG1vH/OubI50IbWdoEGg9XkqlA1f0izqN61x6nA6taDJo9Txz3L7h\n' +
    'Ez+/B8dy6swnAs63UZP4FFYKhnEb15gdPR1pxbfzbMbZCJ38aRMUcy99bTnC\n' +
    'u41df+L2N5Z55Tk+LPEg5furmCvz7yTSphZe/OcU4y/KMBSDNqQhIN2GyevV\n' +
    'ZqVwzEuCevAGPy0owXoF2EaDfS1Wz/yr6VI7Y6tK+SiGz2D9MQJRnFhAXDPO\n' +
    'FH4oJD/bdPDJ4mJI2pCZJoxwu8m/Zr8txuXsgS1j4Ga8aXfriGVxws9vnypU\n' +
    'RVakmkYm9+MsOMhBtFWwNw0ssQARAQABwsB2BBgBCAAqBQJjZPheCRCszcBm\n' +
    'B607SgIbDBYhBEWdLV876c+znjS0l6zNwGYHrTtKAABcIgf+Jn1WYdm1/89y\n' +
    '6wSKjH8H3etZc9zpSoXX49KH35t0QAKb+B9pa4mjTbmbHnAZYFvYzrc9VZNr\n' +
    '0HrAypEgwEflOcfH8ocGSy7AuVFctT3gQ1pD898UUT9/QbHupLXla1u0Qnp+\n' +
    'qMOfJG6MxQUdnZJbosZyaIoMv4QihHj4+KVLdQXCucXe/Zb4rshxlI0EZIZJ\n' +
    'iJhB2pnBenB5CVuDryGzjl8JsANLtAQ2AlYH+0u3REXpTjIBnQksIUgwH25S\n' +
    'XFpqUgmDPq/LfRw8Q8V5WQiKRwljhIw6wY05IwK24dPKRz1rjeWrb69CJAWb\n' +
    'vvravSrzpzeXnWqVouv8WutINfAqdA==\n' +
    '=2es+\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  wallets: 'eip155:0xd8634c39bbfd4033c0d3289c4515275102423681',
  nfts: []
}
```
</details>

-----
  
### **Decrypting encrypted pgp private key from user data**
```typescript
// pre-requisite API calls that should be made before
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');
  
// actual api
const decryptedPvtKey = await PushAPI.chat.decryptPGPKey(
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: _signer,
    env: 'staging'
);
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

-----

### **Fetching list of user chats**
```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');
  
// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);
  
// actual api
const chats = await PushAPI.chat.chats({
    account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
    toDecrypt: true,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address (Partial CAIP)             |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (Get chats of a specific user)</b></summary>

```typescript
// PushAPI_chat_chats | Response - 200 OK
// Array of chats
[
  {
    about: null,
    did: 'eip155:0xfFA1aF9E558B68bBC09ad74058331c100C135280',
    intent: 'eip155:0xd8634c39bbfd4033c0d3289c4515275102423681',
    intentSentBy: 'eip155:0xd8634c39bbfd4033c0d3289c4515275102423681',
    intentTimestamp: '2023-02-19T22:31:34.000Z',
    publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
      '\n' +
      'xsBNBGN/K/kBCADEv8v4k/rWXEhF47geWz1UBySLtgsCZxZK7RPhLWecku6N\n' +
      'XTAPScS9YjXLDqy0tZ6nDvXh/vPbNNkd9phBGh5Mo6O3vNjI9pwd06KyT4sT\n' +
      'ChjenRXU+aLHQzjTXOMO1xHkN3yiuLqC8mZ/OBPBkjHhC00taqhuWWudfcEv\n' +
      '5DqZPqtHBwOipvtEqR9BDnVO4srL0xZPksJVPBmcekll61obQylKGx1K8vTg\n' +
      '292Ivo+tPpDSkXdxWTx4EmcOPw/7E4IRoUudkAZUJzgZL48UPR7oDox8JIgH\n' +
      'yF4PMTvKZR0Fps+8W/USMO9Mc5AUwNqkmvQyywo8wdTIWW8ki9OPhWvjABEB\n' +
      'AAHNAMLAigQQAQgAPgUCY38r+QQLCQcICRA7/jxKMDdVgwMVCAoEFgACAQIZ\n' +
      'AQIbAwIeARYhBJco5U6B/S5LNkspyzv+PEowN1WDAAB4bQf9FIzCf5fmwKuw\n' +
      'g2B2IV9LIo5zZHU0Wkm52n0kesEJGfYJu/ub/GhPBtoAr8Pf+5CkGN75kxWg\n' +
      'EhKDy8Sm/L+50I1QhIk1x73LMUz2cIxJeJdHdI13t+lZrp5Ni01KiPJzB7LJ\n' +
      '2Nj5d5Kf53sM6A/Q7fwwUprbwTh1aQzngf8KSups6AjqLQe2Qyu6LzVTKcXe\n' +
      'vQyIoYHxBdcy+2hH0ZIkkKvcWHHqIuym4NJXLqxxhqpK20KpIfl+YufqJiSW\n' +
      '+f+imCrQSslXLL2E3fS+bPORTU/aL/uPkW1645BPoFuWKr7S+bVrEnp0sCS9\n' +
      'xH/COFWmxhoeHHcu5tqKGJdsUZ9iiM7ATQRjfyv5AQgAm5KRDtuUtvLLLOrm\n' +
      'cQ0IcFEa00guCEKbZfYmX/OFHBooBy185SWTKDRKilLTxGosnNFQbDovrbDA\n' +
      'pP+DLDIHMBRJHnQCuCkXRqGV5vcI8VD3zOalUJpz6f+QKWnkhv2lt05OTeOc\n' +
      'hhC7NCC3joe0rUtUgYpvv4i18BrrrADaY0Qkmy7RBor7CCXAttbeOhsxJc1E\n' +
      '1b7bhJW1Ja8yezDCN7801S/GPjohpzEYkKkw+ziBDJnvXJC8T+hRINo0RtX9\n' +
      '9xn2beUJSquDTw9Y2tvQ6RMMiYcjiSVQ6n9XqgRp6GDlY2JhGigmmd8+4cpZ\n' +
      '2EH9kGrwGIGUH/D91owQejNiAwARAQABwsB2BBgBCAAqBQJjfyv5CRA7/jxK\n' +
      'MDdVgwIbDBYhBJco5U6B/S5LNkspyzv+PEowN1WDAADewgf9EuYPp6eSjbK3\n' +
      'tpDoUV6xTmGHi6R0+8szSF+1yJ3oGzxd60K9pz9eeSsjjUL9sasKWmVMaG2U\n' +
      '99Pc0ZV1czl+nthzigsJIq1ZbTFWA2xcNLOWa5Qw7bnb8QcH7t+l6gW95whT\n' +
      'lA9SL8mAzYHzKLyVlTfJD7bUZSWtk7DhNr8QCq9U5W6GoSM619zC5Ndcg0Av\n' +
      'hwmPmsFjGxI6E/69f+ZpKmQ3xbMTLhzQZYT5wRyNDHh7KFYM6yfc8sg1+VSm\n' +
      'FWgChvHKD9X+z4KyVTuxHwZVda17tYoHmUM+dF3JuzZJteTiAii9tu3oDRKW\n' +
      '4QpEgIbbKge5JRntvBdRr714aPjztA==\n' +
      '=aP07\n' +
      '-----END PGP PUBLIC KEY BLOCK-----\n',
    profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA6ElEQVR4AcXBoXEDMRRF0btvtglhMdcQ5jHfLhwiqiJ2wkRShhowSREiHoWqBqMN/TYQ8WT+Ocv9cTkwRolYIXWsUSIzIXWsUSJWSB1LOBPOhLPl++P3wDhtOzMhdWZGicy0mrGEM+FMOFt50WrGOm0772g1MyOcCWfC2XJ/XA4mRom8I6TOjHAmnAlnKy9GiVitZqzTtjPTaubZjhVSxxLOhDPhbPn5+jwwQurMjBKZCakzM0rEEs6EM+FsbTXzbMcKqWO1mpkJ6Yo1SsRqNWMJZ8KZcLaeb1esUSL/6Xy7Yglnwplw9gcz1UAzKe4AEAAAAABJRU5ErkJggg==',
    threadhash: 'bafyreia2bi62fh5ab5ozvi46y4onm2vf5ql4kcxtmta5uarznhazp53264',
    wallets: 'eip155:0xfFA1aF9E558B68bBC09ad74058331c100C135280',
    combinedDID: 'eip155:0xd8634c39bbfd4033c0d3289c4515275102423681_eip155:0xfFA1aF9E558B68bBC09ad74058331c100C135280',
    name: 'salmon-xenial-cuckoo',
    msg: {
      link: null,
      toDID: 'eip155:0xfFA1aF9E558B68bBC09ad74058331c100C135280',
      encType: 'pgp',
      fromDID: 'eip155:0xd8634c39bbfd4033c0d3289c4515275102423681',
      sigType: '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBQJj8lXtCRCszcBmB607ShYhBEWdLV876c+znjS0l6zNwGYH\n' +
        'rTtKAAB9ZAgA2RsziFlghtZ9dTX964TV4vH7BG1KGqzjfJQ8BcBvtQdkj4Wt\n' +
        'WIisiu0JQ1BoX4YSQBDwZipTDZrey86bgms3bCwj7NgicE2ukUsYifAWhN61\n' +
        '7KtVLKLf+i/NBtGE0L5dVNI97JhwWMVyChY/9LfOJsKq+3Qgk7W/8Z93Fuhu\n' +
        'ZnZ3KlJEczJHANYnmS4Fp5d+pTPIADsBzuo4vffQeAiNmmtYPREOgUmc8B84\n' +
        'Y0MAeXo6VqpQeqWuWZurXoa4VY30piMofoUmL4NgaYwAhBJZxF49aZidZmFo\n' +
        '6Brw2idv8GK0TiTWpketO5hGBljAdv5aqg41jwb+kgx0HxU1hPm1DQ==\n' +
        '=Wr1+\n' +
        '-----END PGP SIGNATURE-----\n',
      toCAIP10: 'eip155:0xfFA1aF9E558B68bBC09ad74058331c100C135280',
      signature: '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBQJj8lXtCRCszcBmB607ShYhBEWdLV876c+znjS0l6zNwGYH\n' +
        'rTtKAAB9ZAgA2RsziFlghtZ9dTX964TV4vH7BG1KGqzjfJQ8BcBvtQdkj4Wt\n' +
        'WIisiu0JQ1BoX4YSQBDwZipTDZrey86bgms3bCwj7NgicE2ukUsYifAWhN61\n' +
        '7KtVLKLf+i/NBtGE0L5dVNI97JhwWMVyChY/9LfOJsKq+3Qgk7W/8Z93Fuhu\n' +
        'ZnZ3KlJEczJHANYnmS4Fp5d+pTPIADsBzuo4vffQeAiNmmtYPREOgUmc8B84\n' +
        'Y0MAeXo6VqpQeqWuWZurXoa4VY30piMofoUmL4NgaYwAhBJZxF49aZidZmFo\n' +
        '6Brw2idv8GK0TiTWpketO5hGBljAdv5aqg41jwb+kgx0HxU1hPm1DQ==\n' +
        '=Wr1+\n' +
        '-----END PGP SIGNATURE-----\n',
      timestamp: 1676826094072,
      fromCAIP10: 'eip155:0xd8634c39bbfd4033c0d3289c4515275102423681',
      messageType: 'Text',
      messageContent: 'hey',
      encryptedSecret: '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMA5Ga6Pu44C+oAQf/Y2brN3CdpIDp98VCUH65vwTkDbUPWKtEMj6zwr57\n' +
        'QTTRhBnkr6T5TZ1Tdp71g0Vo1n++RacCg94k5TpUqSYoIwUAh3TUsZTjOtLK\n' +
        'EU/Ud25zh5umSYWFxZgVPxU6bixdjtpGJkxzuRWaTLg45UQ1wsz/LMSXiVKW\n' +
        'PkmP6eIXIi7PmduuCTajLdXlATMYVroBQ6QtChGi1S3loRAJpmuAFIKhzvdQ\n' +
        'xvf/sHXh7tyNGIBbqFPwBoVQCN7nHf3q8ufo/n4NXFTWFqtrYkLe/l4WSGZ+\n' +
        'WOSkkJkyoGBGBlq/ZU3/IhY2BFw22ZMah3CqUmhvGe8XIMtX+Gz++Wm7SrmL\n' +
        '08HATAN7roGwZ8OLswEH/1sSD0DMoAgUuTYmID/xg/mPJCEtcjSmu3bU/tK6\n' +
        'RxlDv3+6ZcHBBD20E9y8dtKj7JKuZx/im3H7a0giLpxBB4DEJQkmMbxFws0b\n' +
        'exwdhqa7QLRorBuIt3D5M5QmWhkf2lH8BK9dSN4370S0xPBTzjlyWEphC2uZ\n' +
        'dkF93p9qBMWfkWSif+qBceXzyMoFimeJ33FcTViRdTqo/BYER1zBzzY2Gjtq\n' +
        'UIfGTYaIc1U1IUx8OOmKcYXYRBYACbSx0A7pCOu/KnCPwE/SSgZdYgSwBm8U\n' +
        'fuG2v0VnfkGHkIDqMfmzwYQWSZHp36I8uYzs5xapvREnwXIkBpPiWkdG5G2Q\n' +
        'Co7SQAFcwGdXcc23bny1kvBsHX3b6tVxSDt3KXsWNiKzClaFRsjEHxO7gZe9\n' +
        'nlIBRSDGCy5iKJymIyef/D7kTG6NctE=\n' +
        '=C8hO\n' +
        '-----END PGP MESSAGE-----\n'
    },
    groupInformation: undefined
  }
]
```
</details>

-----
  
### **Fetching list of user chat requests**
```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');
  
// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);
  
// actual api
const chats = await PushAPI.chat.requests({
    account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
    toDecrypt: true,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address (Partial CAIP)             |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

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
    publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
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
    profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBobGEMBSG0W//idlKiKARaohMAzEIzFoEhgaQ1EAV6xCkmn32PpMZZue9e87j9Xx/uKGkSMu6X9whnAlnwlkoKdKy7hdWnTJN+4hVUqRFOBPOhLPH6/n+YAznwl86+hFLOBPOhLNQUsRa+5GW4VxoOfqRlpIilnAmnAlnYd0v/tO6X1jCmXAmnIWSIladMtbRj3xjOBesbt6whDPhTDgLdcrc0c0bLQcXLXXKWMKZcCachW7esOqUsUqKWHXKtBQ2rMpv3bxhCWfCmXD2A590MfREqrg1AAAAAElFTkSuQmCC',
    threadhash: 'bafyreigs26i7k3g5u4xmqg44tecmkfvelclp5lletnikfbsrj7dhg5oi4y',
    wallets: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    combinedDID: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029_eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
    name: 'copper-screeching-herring',
    msg: {
      link: 'bafyreibuez6o5hqqf6j45ekqxz7ixdtbxs6mhu3m6iv63etja6p2g43qom',
      toDID: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
      encType: 'pgp',
      fromDID: 'eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
      sigType: '-----BEGIN PGP SIGNATURE-----\n' +
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
      signature: '-----BEGIN PGP SIGNATURE-----\n' +
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
      encryptedSecret: '-----BEGIN PGP MESSAGE-----\n' +
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
        '-----END PGP MESSAGE-----\n'
    },
    groupInformation: undefined
  }
]
```
</details>

-----

### **Fetching conversation hash between two users**
```typescript
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: 'staging'
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address (partial CAIP)             |
| conversationId*    | string  | -       | receiver's address (partial CAIP) or chatId of a group|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


<details>
  <summary><b>Expected response (Get conversation hash between two users)</b></summary>

```typescript
// PushAPI_chat_conversationHash | Response - 200 OK
{
  threadHash: 'bafyreign2egu7so7lf3gdicehyqjvghzmwn5gokh4fmp4oy3vjwrjk2rjy'
}
```
</details>

-----

### **Fetching latest chat between two users**
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

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address (Partial CAIP)                 |
| threadhash*    | string  | -       | conversation hash between two users |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

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
    signature: '-----BEGIN PGP SIGNATURE-----\n' +
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
    encryptedSecret: '-----BEGIN PGP MESSAGE-----\n' +
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
      '-----END PGP MESSAGE-----\n'
  }
]

```
</details>

-----
  
### **Fetching chat history between two users**
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

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| threadhash*    | string  | -       | conversation hash between two users |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| limit    | number  | 10       | number of messages between two users |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

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
    signature: '-----BEGIN PGP SIGNATURE-----\n' +
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
    encryptedSecret: '-----BEGIN PGP MESSAGE-----\n' +
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
      '-----END PGP MESSAGE-----\n'
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
    encryptedSecret: ''
  }
]

```
</details>

-----

### **To send a message**
```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');
  
// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.send({
  messageContent: "Gm gm! It's me... Mario",
  messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF" 
  receiverAddress: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
  signer: _signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| messageContent    | string  | ''       | message to be sent |
| messageType    | 'Text' &#124;  'Image' &#124;  'File' &#124; 'GIF' | 'Text'| type of messageContent |
| receiverAddress*    | string  | -       | user address or group chat id (Partial CAIP)             |
| signer*    | -  | -       | signer object |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (send chat message or chat request to a wallet)</b></summary>

```typescript
// PushAPI_chat_send | Response - 200 OK
{
  fromCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  toCAIP10: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  fromDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  toDID: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
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

-----
  
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
| status    | 'Approved' | 'Approved'  | flag for approving and rejecting chat request, supports only approving for now|
| senderAddress*    | string  | -       | chat request sender's address or chatId of a group |
| signer*    | -  | -       | signer object |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (approve chat request for a wallet / group chat id)</b></summary>

```typescript
// PushAPI_chat_approve | Response - 204 OK
```
</details>

-----
  
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

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account*    | string  | -       | user address                  |
| groupName*    | string  | -       | group name |
| groupDescription*    | string  | -       | group description |
| groupImage*    | string  | -       | group image link |
| members*    | Array<string>  | -  | wallet addresses of all members except admins and groupCreator |
| admins*    | Array<string>  | -  | wallet addresses of all admins except members and groupCreator |
| isPublic*    | boolean  | -       | true for public group, false for private group |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|


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
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
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
  chatId: '0364908cbaef95a5a3124c394ada868177c158a4d677cedd6fd1e42db1852386'
}


```
</details>

-----

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

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| chatId*   | string | - | chatId of the group |
| account*    | string  | -       | user address                  |
| groupName*    | string  | -       | group name |
| groupDescription*    | string  | -       | group description |
| groupImage*    | string  | -       | group image link |
| members*    | Array<string>  | -  | wallet addresses of all members except admins and groupCreator |
| admins*    | Array<string>  | -  | wallet addresses of all admins except members and groupCreator |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

  
### **To get group details by group name**

```typescript
const response = await PushAPI.chat.getGroupByName({
  groupName: "Push Group Chat 3",
  env: 'staging',
});
```

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| groupName*    | string  | -       | name of the group                 |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
  
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

-----

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

-----
  
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

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| messages*    | string  | -       | array of message object fetched from chat.history method |
| connectedUser*    | IUser  | false | user meta data object|
| pgpPrivateKey    | string  | null  | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
  
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
    signature: '-----BEGIN PGP SIGNATURE-----\n' +
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
    encryptedSecret: '-----BEGIN PGP MESSAGE-----\n' +
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
      '-----END PGP MESSAGE-----\n'
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
    encryptedSecret: ''
  }
]
```
</details>

-----
