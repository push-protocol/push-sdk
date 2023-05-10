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

```bash
yarn add @pushprotocol/restapi@latest ethers@^5.6
```

or

```bash
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
	env?: ENV;
  account?: string;
  signer?: SignerType;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  additionalMeta?: { password?: string };
  progressHook?: (progress: ProgressHookType) => void;
})
```

| Param          | Remarks                                                       |
|----------------|---------------------------------------------------------------|
| env            | API env - 'prod', 'staging', 'dev'                            |
| account        | Account address                                               |
| signer         | ethers.js signer                                              |
| version        | 'x25519-xsalsa20-poly1305' or 'eip191-aes256-gcm-hkdf-sha256' |
| additionalMeta | Additional meta data for user                                 |
| progressHook   | Progress hook                                                 |

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

| Parameter | Description |
| --- | --- |
| `did` | user decentralized identity |
| `wallets` | all wallets associated to the did |
| `profilePicture` | user chat profile picture. As of now i cannot be changed |
| `publicKey` | PGP public key |
| `encryptedPrivateKey` | encrypted private PGP key |
| `encryptionType` | encryption type used to encrypt the private key |
| `signature` | user payload signature used when creating a user |
| `sigType` | signature type used when creating a user |
| `about` | short user description |
| `name` | user name |
| `encryptedPassword` | encrypted password used to encrypt the private key for NFT chat |
| `nftOwner` | NFT owner address |
| `numMsg` | number of messages sent by the user |
| `allowedNumMsg` | number of messages allowed to be sent by the user |
| `linkedListHash` | cid from all messages this user has sent |
| `nfts` | array of NFTs owned by the user |

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

**Version 1.3.x**

```typescript
export interface IUser {
	msgSent: number;
	maxMsgPersisted : number;
	
  did: string;
  wallets: string;

	profile: {
	  name: string | null;
	  desc: string | null;
	  profilePicture: string | null;
	}

  encryptedPrivateKey: string;
  publicKey: string;
  nftOwner: string;

  verificationProof: string;
}
```

| Parameter | Description |
| --- | --- |
| `msgSent` | number of messages sent by the user |
| `maxMsgPersisted` | number of messages allowed to be sent by the user |
| `did` | user decentralized identity |
| `wallets` | all wallets associated to the did |
| `name` | user name |
| `desc` | short user description |
| `profilePicture` | user chat profile picture. As of now i cannot be changed |
| `encryptedPrivateKey` | encrypted private PGP key |
| `publicKey` | PGP public key |
| `nftOwner` | NFT owner address |
| `verificationProof` | verification proof |

</details>

-----

### **Get user data for chat**
```typescript
const user = await PushAPI.user.get({
  env?: ENV;
  account?: string;
});
```

| Param    | Remarks |
|----------|---------|
| account    | Account address             |
| env  | API env - 'prod', 'staging', 'dev'|

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

| Parameter | Description |
| --- | --- |
| `did` | user decentralized identity |
| `wallets` | all wallets associated to the did |
| `profilePicture` | user chat profile picture. As of now i cannot be changed |
| `publicKey` | PGP public key |
| `encryptedPrivateKey` | encrypted private PGP key |
| `encryptionType` | encryption type used to encrypt the private key |
| `signature` | user payload signature used when creating a user |
| `sigType` | signature type used when creating a user |
| `about` | short user description |
| `name` | user name |
| `encryptedPassword` | encrypted password used to encrypt the private key for NFT chat |
| `nftOwner` | NFT owner address |
| `numMsg` | number of messages sent by the user |
| `allowedNumMsg` | number of messages allowed to be sent by the user |
| `linkedListHash` | cid from all messages this user has sent |
| `nfts` | array of NFTs owned by the user |

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

**Version 1.3.x**

```typescript
export interface IUser {
	msgSent: number;
	maxMsgPersisted : number;
	
  did: string;
  wallets: string;

	profile: {
	  name: string | null;
	  desc: string | null;
	  profilePicture: string | null;
	}

  encryptedPrivateKey: string;
  publicKey: string;
  nftOwner: string;

  verificationProof: string;
}
```

| Parameter | Description |
| --- | --- |
| `msgSent` | number of messages sent by the user |
| `maxMsgPersisted` | number of messages allowed to be sent by the user |
| `did` | user decentralized identity |
| `wallets` | all wallets associated to the did |
| `name` | user name |
| `desc` | short user description |
| `profilePicture` | user chat profile picture. As of now i cannot be changed |
| `encryptedPrivateKey` | encrypted private PGP key |
| `publicKey` | PGP public key |
| `nftOwner` | NFT owner address |
| `verificationProof` | verification proof |

</details>

-----
  
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

| Parameter | Type | Description |
| --- | --- | --- |
| `encryptedPGPPrivateKey` | `string` | encrypted pgp private key |
| `account` | `string` | user account |
| `signer` | `SignerType` | ethers.js signer |
| `additionalMeta` | `{ password?: string }` | additional meta data |
| `env` | `ENV` | environment |
| `toUpgrade` | `boolean` | if true, the user will be upgraded to the latest version |
| `progressHook` | `(progress: ProgressHookType) => void` | progress hook |

**Example:**

```typescript
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: ENV.STAGING,
  })

  // decrypt the PGP Key
  const pgpKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
  })
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

| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account    | string  | -       | user address (Partial CAIP)             |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

**Example:**

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
    intent: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7+eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    intentSentBy: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
    intentTimestamp: '2023-05-08T12:56:16.000Z',
    publicKey: '{"key":"-----BEGIN PGP PUBLIC KEY BLOCK-----\\n\\nxsBNBGRYo/8BCADhbpiwQf8PEXdi1V2BKfoHs8Vo7dM0FvukAlTGlk/778kV\\neriOXsBmFT3PciLWXRbh5CqsxXmshY030Ugb6h9x2FcgglzsLhJxc8cbCbpk\\nlK3wkZSAJbPX42rX6y2yvLZffdziAddliJFnE0gfV5WD/rxugYP/FIHyGt9y\\njKXuDwNAihp5qQeXaPs+vEqaVhExGUlwWhbBj/EepD8LMc4+inZMTBNxN213\\nnZTSWudaV6mnnrKNjkHTtK3tT6TTHAb5f5Xoz+zTNbMQecktRtF4r27ctRgQ\\nBUEnFkREdQR9vAmJuMmDeh0SKFAE44bNm8moSTHtwSyyjfoL2y7rLmkLABEB\\nAAHNAMLAigQQAQgAPgWCZFij/wQLCQcICZC/GLX8yhr5DwMVCAoEFgACAQIZ\\nAQKbAwIeARYhBIXvLPhJE+agImuJ578YtfzKGvkPAAA8eggAx6GWFsiVU0Jd\\nj3FxkYPwitvF2PdkzPKKLczhj82zNAt4njioYijjpItjw8Wq0cyWtTKfwb0v\\nZ5ty1X0MsOZATsF46PBz0nsBp7BxDutFjgKHQxGwlss+WD6yYqujPUdzmhMO\\n5KYh/McDrGhP939UZhSRhvAH78Id+2EG8Q74KHgAhfcrJvpHf/aBrF1+Gn07\\nSGuZ4GpzqVO7NaQlme1BAAFSZI+EZeCoCODZXJ6gdh1HC1/splLYtcT+FL0/\\nj0VQxVoaVpD5B5AgIQJp1QeFOIcLcFecRLY+RiXkfNJHHbkcCBXGTHuPY5CT\\noIohJfb45Y8wSjcZ3Ec+YOf+00UmP87ATQRkWKP/AQgA2MUK+aUDZE3PFaXG\\n/0H02iqUzu18FmSnPW0TmisHezdzI/LcZwqKapJawxHLsPiGK42xWa2ZBwgh\\n8xyMhspY9jv9u3uDaR/vR6y83+KaUlsSyvpUu0HAapWVIlE79p1/lLld5+Ui\\ny4Ap8VPMSd7sU0TZXGw/s8sBol1Lv1O1wJj0gc17IB1dahMppxnZlnoCtqBA\\nNeFZ8Ssx7+ZAhfvglCqvBo154+4UphqZLoGmGCZWIY3B3NU1EGRjQNnVNaSC\\nuRet3Qi85ni++52k6wR3tJLDqOxFKnYrv93nPENABSuYS8Uc04VvE0hfbjNF\\n6qeo5gah5O68F/xtI6MATZRIAQARAQABwsB2BBgBCAAqBYJkWKP/CZC/GLX8\\nyhr5DwKbDBYhBIXvLPhJE+agImuJ578YtfzKGvkPAAC3zgf+LZ2aNe1nY3au\\n9T57MqhfTMYIEWn/PJ0LAJFg3jgPTmzL4K+ZLSTdWEV7p8aMKrTloYSWENW+\\nuuj+MhMnOC1EonhmqYGHrsFTPdZR902a/mNPnxl8A8r7ixq1OAgq81qYVsQ1\\nQaC8uuJaqCxLediM5lVP95xz1qdKgNhKtG7cPlX8ljAL4KE3U2/Jjj/KiqED\\n0XaMqrt1y2qjjNF+ct+NbmqmwRaOKq8mWpFlPygA9dq6Sp1nCcwvYmxBQrbg\\nmTDldPF6tg7SqF83DN7DnUQt1cNQEUUv8SUiGnS/Dd01nhManNBLNtNpgCCf\\n4etbnA/WK08gsOhSeM3bBOSOjavwmA==\\n=qZBP\\n-----END PGP PUBLIC KEY BLOCK-----\\n","signature":"eip191:0xc56d79a25a832134b0438981f534c1c811bb8d1d1ea6f19b639e4dbc1fb64a4c65be377120dc4402d29b371dc378f00289640b037f6ad9e475fab5781ce067b81c"}',
    profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyklEQVR4AcXBoa3DMABF0ZunTFBSVNQBAr1IFdA1AoMNvYiVRQy9QSUPklKX+Cv64J0zfdrz5IKwBEZKLVwhzISZMJv5Q4uJX5mRFhO9x74xIsyEmTCbW0z0HvvGyLGu/EeLiZ4wE2bCbLrf3idGwkyYCbO51EIvLIGRUgsjYQmMlFroCTNhJszmFhO/Mr1SC1eUWuiFJdBrMdETZsJMmE332/ukc6wrI6+cGTnWlZFXzvSEmTATZtOnPU8uaDEx8tg3rhBmwkyYfQE/njNZjYo1IgAAAABJRU5ErkJggg==',
    threadhash: 'bafyreidfnsaz7pz3hsedtlgzj7beqnwj44h3bunpaouwmk4r4i5y5psyti',
    wallets: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    combinedDID: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7_eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    name: null,
    msg: {
      fromCAIP10: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toCAIP10: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      fromDID: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toDID: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      signature: '-----BEGIN PGP SIGNATURE-----\n' +
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
      encryptedSecret: '-----BEGIN PGP MESSAGE-----\n' +
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
      link: 'bafyreib34jgnpp573rwquejcq5avxvydis7fbykat6dd5z7uazobucoumm'
    },
    groupInformation: undefined
  }
]
```

| Parameter | Type | Description |
| --- | --- | --- |
| msg | `IMessageIPFS` | message object |
| did | `string` | user DID |
| wallets | `string` | user wallets |
| profilePicture | `string` | user profile picture |
| publicKey | `string` | user public key |
| about | `string` | user description |
| threadhash | `string` | cid from the latest message sent on this conversation |
| intent | `string` | addresses concatenated from the users who have approved the intent |
| intentSentBy | `string` | address of the user who sent the intent |
| intentTimestamp | `number` | timestamp of the intent |
| combinedDID | `string` | concatenated addresses of the members of this chat (for DM the 2 addresses and from Group the addresses from all group members) |
| cid | `string` | content identifier on IPFS |
| chatId | `string` | chat identifier |
| groupInformation | `GroupDTO` | if group chat, all group information |

</details>

-----
  
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

| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account    | string  | -       | user address (Partial CAIP)             |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

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

| Parameter | Type | Description |
| --- | --- | --- |
| msg | `IMessageIPFS` | message object |
| did | `string` | user DID |
| wallets | `string` | user wallets |
| profilePicture | `string` | user profile picture |
| publicKey | `string` | user public key |
| about | `string` | user description |
| threadhash | `string` | cid from the latest message sent on this conversation |
| intent | `string` | addresses concatenated from the users who have approved the intent |
| intentSentBy | `string` | address of the user who sent the intent |
| intentTimestamp | `number` | timestamp of the intent |
| combinedDID | `string` | concatenated addresses of the members of this chat (for DM the 2 addresses and from Group the addresses from all group members) |
| cid | `string` | content identifier on IPFS |
| chatId | `string` | chat identifier |
| groupInformation | `GroupDTO` | if group chat, all group information |

</details>

-----

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

| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account    | string  | -       | user address           |
| conversationId    | string  | -       | receiver's address (partial CAIP) or chatId of a group|
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|

**Example:**

```typescript
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: ENV.STAGING
});
```

<details>
  <summary><b>Expected response (Get conversation hash between two users)</b></summary>

```typescript
// PushAPI_chat_conversationHash | Response - 200 OK
{
  threadHash: 'bafyreign2egu7so7lf3gdicehyqjvghzmwn5gokh4fmp4oy3vjwrjk2rjy'
}
```

| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| threadHash    | string  | -       | message content identifier |
</details>

-----

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

| Param    | Type    | Remarks                                    |
|----------|---------|--------------------------------------------|
| threadHash    | string  | message content identifier |
| toDecrypt    | boolean  | true if you want messages to be decrypted |
| pgpPrivateKey    | string  | PGP Private Key |
| account   | string  | user account |
| env   | ENV  | environment variable |

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

| Param    | Type    | Remarks                                    |
|----------|---------|--------------------------------------------|
| `fromCAIP10`    | string  | sender address |
| `toCAIP10`    | string  | receiver address |
| `fromDID`   | string  | sender did |
| `toDID`   | string  | receiver did |
| `messageType`   | string  | message type |
| `messageContent`   | string  | message content |
| `signature` | string  | signature of the message |
| `sigType` | string  | signature type |
| `link` | string  | content identifier of the previous messages |
| `timestamp` | number  | timestamp of the message |
| `encType` | string  | encryption type |
| `encryptedSecret` | string  | encrypted secret |

</details>

-----
 
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

| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| account    | string  | -       | user address                  |
| threadhash    | string  | -       | conversation hash between two users |
| toDecrypt    | boolean  | false       | if "true" the method will return decrypted message content in response|
| limit    | number  | 10       | number of messages between two users |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| env  | ENV  | 'prod'      | API env - 'prod', 'staging', 'dev'|

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

| Param    | Type    | Remarks                                    |
|----------|---------|--------------------------------------------|
| `fromCAIP10`    | string  | sender address |
| `toCAIP10`    | string  | receiver address |
| `fromDID`   | string  | sender did |
| `toDID`   | string  | receiver did |
| `messageType`   | string  | message type |
| `messageContent`   | string  | message content |
| `signature` | string  | signature of the message |
| `sigType` | string  | signature type |
| `link` | string  | content identifier of the previous messages |
| `timestamp` | number  | timestamp of the message |
| `encType` | string  | encryption type |
| `encryptedSecret` | string  | encrypted secret |

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
