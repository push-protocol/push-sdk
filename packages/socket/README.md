# socket

This package gives access to Push Protocol (Push Nodes) using Websockets built on top of [Socket.IO](https://socket.io/docs/v4/client-api/). Visit [Developer Docs](https://docs.push.org/developers) or [Push.org](https://push.org) to learn more.

# Index
- [How to use in your app?](#how-to-use-in-your-app)
  - [Installation](#installation)
  - [Import SDK](#import-sdk)
  - [About blockchain agnostic address format](#about-blockchain-agnostic-address-format)
- [Socket SDK Features](#socket-sdk-features)
  - [Creating a socket connection object](#creating-a-socket-connection-object)
    - [For notification](#for-notification)
    - [For chat](#for-chat)
  - [Connect the socket connection object](#connect-the-socket-connection-object)
  - [Disconnect the socket connection object](#disconnect-the-socket-connection-object)
  - [Subscribing to Socket Events](#subscribing-to-socket-events)
  - [Examples](#examples)
    - [Basic example of using SDK sockets in a React App](#basic-example-of-using-sdk-sockets-in-a-react-app)

# How to use in your app?

## Installation
```
  yarn add @pushprotocol/socket@latest ethers@^5.6
```
  or
```
  npm install @pushprotocol/socket@latest ethers@^5.6
```
## Import SDK
```typescript
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';
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

# Socket SDK Features
## **Creating a socket connection object**
### **For notification**
```typescript
const pushSDKSocket = createSocketConnection({
  user: 'eip155:5:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb', // CAIP, see below
  env: 'staging',
  socketOptions: { autoConnect: false }
});
```
### **For chat**
```typescript
const pushSDKSocket = createSocketConnection({
    user: 'eip155:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
    env: 'staging',
    socketType: 'chat',
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 }
});
```
IMPORTANT: create the connection object in your app only when you have the `user` address available since its mandatory.

**`autoConnect`**: Generally if we don't pass `autoConnect: false` then the socket connection is automatic once the object is created. Now since we may or may not have the account address handy and wish to start the connection during instantiation so this option makes it easier for us to choose when we want to `connect` or not!

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| user*    | string  | -       | user account address (CAIP)                |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| socketType  | 'notification' &#124;  'chat'  |  'notification'      | socket type  |
| socketOptions      | object  | -      | supports the same as [SocketIO Options](https://socket.io/docs/v4/client-options/) |

## **Connect the socket connection object**
```typescript
pushSDKSocket.connect();
```


## **Disconnect the socket connection object**
```typescript
pushSDKSocket.disconnect();
```

## **Subscribing to Socket Events**
```typescript
pushSDKSocket.on(EVENTS.CONNECT, () => {

});

pushSDKSocket.on(EVENTS.DISCONNECT, () => {

});

pushSDKSocket.on(EVENTS.USER_FEEDS, (feedItem) => {
  // feedItem is the notification data when that notification was received
});

pushSDKSocket.on(EVENT.CHAT_RECEIVED_MESSAGE, (message) => {
  // message is the message object data whenever a new message is received
});

pushSDKSocket.on(EVENT.CHAT_GROUPS, (message) => {
  // message is the message object data whenever a group is created or updated
});
```

Supported EVENTS
| EVENT name | When is it triggered?                      |
|------------|--------------------------------------------|
| EVENTS.CONNECT    | whenever the socket is connected     | 
| EVENTS.DISCONNECT | whenever the socket is disconneted   | 
| EVENTS.USER_FEEDS | whenever a new notification is received by the user after the last socket connection   | 
| EVENTS.USER_SPAM_FEEDS | whenever a new spam notification is received by the user after the last socket connection   | 
| EVENT.CHAT_RECEIVED_MESSAGE | whenever a new message is received |
| EVENT.CHAT_GROUPS | whenever a group is created or updated |

# Examples
## Basic example of using SDK sockets in a React App

```
import { useState, useEffect } from "react";
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';

const user = '0xD8634C39BBFd4033c0d3289C4515275102423681';
const chainId = 5;

const userCAIP = `eip155:${chainId}:${user}`;

function App() {
  const [sdkSocket, setSDKSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(sdkSocket?.connected);

  const addSocketEvents = () => {
    sdkSocket?.on(EVENTS.CONNECT, () => {
      setIsConnected(true);
    })

    sdkSocket?.on(EVENTS.DISCONNECT, () => {
      setIsConnected(false);
    })

    sdkSocket?.on(EVENTS.USER_FEEDS, (feedItem) => {
      /**
       * "feedItem" is the latest notification received
       */
      console.log(feedItem);
    })
  };

  const removeSocketEvents = () => {
    sdkSocket?.off(EVENTS.CONNECT);
    sdkSocket?.off(EVENTS.DISCONNECT);
  };

  const toggleConnection = () => {
    if (sdkSocket?.connected) {
      sdkSocket.disconnect();
    } else {
      sdkSocket.connect();
    }
  };


  useEffect(() => {
    if (sdkSocket) {
      addSocketEvents();
    }
    return () => {
      removeSocketEvents();
    };
  }, [sdkSocket]);

  useEffect(() => {
    const connectionObject = createSocketConnection({
      user: userCAIP,
      env: 'dev',
      socketOptions: { autoConnect: false }
    });


    setSDKSocket(connectionObject);

    return () => {
      if (sdkSocket) {
        sdkSocket.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h1>Socket Hello World</h1>

      <div>
        <p>Connection Status : {JSON.stringify(isConnected)}</p>

        <button onClick={toggleConnection}>{isConnected ? 'disconnect' : 'connect'}</button>
      </div>
    </div>
  );
}

export default App;
```

Please note connecting with sockets and maintaining the state of the connection object in your DAPP might have a different setup like first getting the `user` account and `chainId` and then connecting with socket. You can use [React Context](https://reactjs.org/docs/context.html) for state management.
