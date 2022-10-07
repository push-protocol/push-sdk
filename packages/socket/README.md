# socket

This package helps to connect to Push backend using Websockets built on top of [Socket.IO](https://socket.io/docs/v4/client-api/)

## How to use in your app?


### Installation
```
  yarn add @pushprotocol/socket ethers
```
  or
```
  npm install @pushprotocol/socket ethers 
```
Import in your file
```typescript
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';
```

#### **first create a socket connection object**
```typescript
const pushSDKSocket = createSocketConnection({
  user: 'eip155:5:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb', // CAIP, see below
  env: 'staging',
  socketOptions: { autoConnect: false }
});
```
IMPORTANT: create the connection object in your app only when you have the `user` address available since its mandatory.

**`autoConnect`**: Generally if we don't pass `autoConnect: false` then the socket connection is automatic once the object is created. Now since we may or may not have the account address handy and wish to start the connection during instantiation so this option makes it easier for us to choose when we want to `connect` or not!

Allowed Options (params with * are mandatory)
| Param    | Type    | Default | Remarks                                    |
|----------|---------|---------|--------------------------------------------|
| user*    | string  | -       | user account address (CAIP)                |
| env  | string  | 'prod'      | API env - 'prod', 'staging', 'dev'|
| socketOptions      | object  | -      | supports the same as [SocketIO Options](https://socket.io/docs/v4/client-options/) |

#### **connect the socket connection object**
```typescript
pushSDKSocket.connect();
```


#### **disconnect the socket connection object**
```typescript
pushSDKSocket.disconnect();
```

#### **subscribing to Socket Events**
```typescript
pushSDKSocket.on(EVENTS.CONNECT, () => {

});

pushSDKSocket.on(EVENTS.DISCONNECT, () => {

});

pushSDKSocket.on(EVENTS.USER_FEEDS, (feedItem) => {
  // feedItem is the notification data when that notification was received
});
```

Supported EVENTS
| EVENT name | When is it triggered?                      |
|------------|--------------------------------------------|
| EVENTS.CONNECT    | whenever the socket is connected     | 
| EVENTS.DISCONNECT | whenever the socket is disconneted   | 
| EVENTS.USER_FEEDS | whenever a new notification is received by the user after the last socket connection   | 
| EVENTS.USER_SPAM_FEEDS | whenever a new spam notification is received by the user after the last socket connection   | 


### **NOTE on Addresses:**

In any of the below methods (unless explicitly stated otherwise) we accept either - 
- [CAIP format](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md#test-cases): for any on chain addresses ***We strongly recommend using this address format***. 
(Example : ETH MAINNET address will be like `eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)

- ETH address format: only for backwards compatibility. 
(Example: `0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`)


### A very basic example of using SDK sockets in a React App

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