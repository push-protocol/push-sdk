
# SDK Frontend Video Example

This is an example project demonstrating how to implement Push Protocol on the frontend, specifically focusing on video notifications.
This example is a valuable resource for any developer looking to integrate Push into their frontend services. By exploring the code, you can gain a deeper understanding of how to implement various features of the Push Protocol in a frontend application.

## Overview

The `sdk-frontend/video` project provides a practical demonstration of how to set up and configure the EPNS in a frontend application, including how to handle video notifications and communicate with the blockchain.

## Testing the app

This is a step-by-step guide that will walk you through the process of setting up and testing a video call using the Push Video SDK.

Here are the steps you'll need to follow:

## - Initialization of the Push Video Class

Start by initializing the Push Video class and storing the video object in the `ref`.

```javascript
const videoObjectRef = useRef<PushAPI.video.Video>()
```

## - Creation of React State 

Create a React state to store all of the video call data onto it.

```javascript
const [data,setData] = useState<PushAPI.VideoCallData>{
  PushAPI.video.initVideoCallData;
}
```

## - Initialize Video Call Object

Now you'll want to initialize the video call object.

```javascript
const videoObject = new PushAPI.video.Video({
  signer: SignerType;
  chainId: number;
  pgpPrivateKey: string;
  env?: ENV;
  setData: (fn: (data: VideoCallData) => VideoCallData) => void;
});
```

## - Fire Video Call Request 

Fire a video call request and trigger the set video call function (`setRequestVideoCall`).

## - Checking Local Stream and Setting Push Sockets

Check if a local stream is present, then set up Push Sockets for receiving the video call request by using the `usePushSocket` hook.

## - Receiving Video Call Notification

To receive a video call notification, check whether the `additionalMeta` type is `push video call` or not.



## - Video Explanation 

For a more in-depth explanation and walkthrough, you can refer to the [video tutorial](INSERT_VIDEO_LINK_HERE) that covers the whole repository in detail.

For further reference and a more in-depth tutorial, refer to our [official documentation](https://docs.push.org/developers/developer-tooling/push-sdk/sdk-packages-details/epnsproject-sdk-restapi/for-video).



## Getting Started

First, install the dependencies:
```bash
yarn
```

Then run the development server:

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](https://github.com/rainbow-me/rainbowkit/tree/main/packages/create-rainbowkit).

