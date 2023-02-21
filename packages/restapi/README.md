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
    -  [Fetching list of user chats](#fetching-list-of-user-chats)
    -  [Fetching list of user chat requests](#fetching-list-of-user-chat-requests)
    -  [Fetching conversation hash between two users](#fetching-conversation-hash-between-two-users)
    -  [Fetching history between two users](#fetching-history-between-two-users)
    -  [Fetching latest chat between two users](#fetching-latest-chat-between-two-users)
    -  [To approve a chat request](#to-approve-a-chat-request)
    -  [To send a message](#to-send-a-message)
    -  [To get group details by chat id](#to-get-group-details-by-chatid)
    -  [To create a group](#to-create-a-group)
    -  [To update group details](#to-update-group-details)
    -  [Chat helper utils](#chat-helper-utils)
        -  [Decrypting encrypted pgp private key](#decrypting-encrypted-pgp-private-key)
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

## **About blockchain agnostic address format**

In any of the below methods (unless explicitly stated otherwise) we accept either - 
- [CAIP format](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md#test-cases): for any on chain addresses ***We strongly recommend using this address format***. [Learn more about the format and examples](https://docs.push.org/developers/concepts/web3-notifications).
(Example : `eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)
 
 **Note** - For chat related restapis, the address is in the format: eip155:&lt;address&gt; instead of eip155:&lt;chainId&gt;:&lt;address&gt;

- ETH address format: only for backwards compatibility. 
(Example: `0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)

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

```
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

```
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

```
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

```
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

```
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

```
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

```
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
| messageType    | 'Text' &#124;  'Image' &#124;  'File' &#124; 'GIF' | 'Text'| type of messageContent |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|
| apiKey    | string  | ''       | apiKey for using chat|


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


### **To create a group**
```typescript
const response = await PushAPI.chat.createGroup({
        groupName:'Push Protocol group',
        groupDescription:'This is the oficial group for Push Protocol,
        members: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
        groupImage: &lt;group image link&gt; ,
        admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
        isPublic: true,
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
| isPublic*    | boolean  | -       | true for public group, false for private group |
| pgpPrivateKey    | string  | null       | mandatory for users having pgp keys|


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
