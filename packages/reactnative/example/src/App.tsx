import React from 'react';
import { ethers } from 'ethers';

import WebViewCrypto from 'react-native-webview-crypto';
import { StyleSheet, Text, View } from 'react-native';
import {
  PGPHelper,
  genRandomAddress,
  CreateUserProps,
  createUser,
  ENV,
  conversationHash,
  latest,
  createGroup,
  updateGroup,
  chats,
  PushApi,
} from '@push/react-native-sdk';

function generatePrivateKey() {
  // Define the set of characters for private key generation
  var characters = '0123456789abcdef';

  // Set the length of the private key (64 characters for 256 bits)
  var keyLength = 64;

  // Generate the private key
  var privateKey = '';
  for (var i = 0; i < keyLength; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    privateKey += characters.charAt(randomIndex);
  }

  // Return the private key
  return privateKey;
}

export default function App() {
  const handlePgp = async () => {
    let res = await PGPHelper.generateKeyPair();
    console.log(res);
  };

  const handleEthers = async () => {
    let res = await genRandomAddress();
    console.log(res);
  };

  const handleUserCreate = async () => {
    const pk = generatePrivateKey();

    const signer = new ethers.Wallet(pk);
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;

    const options: CreateUserProps = {
      account: account,
      signer: signer,
      env: ENV.STAGING,
    };

    console.log('create user', account);

    const res = await createUser(options);
    console.log('success', res.did);
  };

  const handleUserMsgs = async() => {
    const signer = new ethers.Wallet('07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0');
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;
    console.log(signer);

    const res = await conversationHash({
      account: account,
      conversationId: 'b353220b812bdb707bd93529aac6fac893438e5db791d7c9e6aab6773aaff90b',
      env: ENV.STAGING
    })

    const res2 = await latest({
      threadhash: res.threadHash,
      toDecrypt: true,
      account: account,
      env: ENV.STAGING
    })
    
    const user = await PushApi.user.get({
      account: account,
      env: ENV.STAGING
    })

    const pgpDecryptedPvtKey = await PushApi.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
    })

    const chatList = await chats({
      account: account,
      pgpPrivateKey: pgpDecryptedPvtKey,
      toDecrypt: true,
      env: ENV.STAGING
    })
    console.log(user, "user");
    console.log(pgpDecryptedPvtKey, "key");
    console.log(chatList, "Chatlist")
    
  }
  
  const handleCreateGroup = async() => {
    // const pk = generatePrivateKey();
    const signer = new ethers.Wallet('07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0');
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;
    console.log(signer);
    
    const res = await createGroup({
      groupName: "finaltestingnativesdk",
      groupDescription: "satyamstesing",
      groupImage: "https://github.com",
      account: account,
      signer: signer,
      members: ['0x83d4c16b15F7BBA501Ca1057364a1F502d1c34D5', '0x6Ff7DF70cAACAd6B35d2d30eca6bbb4E86fEE62f'],
      admins: [],
      isPublic: true,
      env: ENV.STAGING
    })
    console.log(res, "res")
  }

  const handleUpdateGroup = async() => {
    // const pk = generatePrivateKey();
    const signer = new ethers.Wallet('07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0');
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;
    console.log(signer);
    
    const res = await updateGroup({
      groupName: "finaltestingnativesdkkkk",
      groupDescription: "satyamstesing",
      groupImage: "https://github.com",
      chatId: "f21e7d4678630fad41b1882eb9a6b0374181c23e9adf3209ff918257eec34bff",
      account: account,
      signer: signer,
      admins: ['0x83d4c16b15F7BBA501Ca1057364a1F502d1c34D5'],
      members: ['0x6Ff7DF70cAACAd6B35d2d30eca6bbb4E86fEE62f', '0x6d118b28ebd82635A30b142D11B9eEEa2c0bea26', '0x83d4c16b15F7BBA501Ca1057364a1F502d1c34D5'],
      env: ENV.STAGING
    })
    console.log(res, "ress");
  }

  return (
    <View style={styles.container}>
      <WebViewCrypto />
      <Text
        style={{ padding: 20, fontSize: 32, margin: 20 }}
        onPress={handleUserCreate}
      >
        New User
      </Text>
      <Text
        style={{ padding: 20, fontSize: 32, margin: 20 }}
        onPress={handlePgp}
      >
        Click Here
      </Text>
      <Text
        style={{ padding: 20, fontSize: 32, margin: 20 }}
        onPress={handleEthers}
      >
        Log Address
      </Text>
      <Text
        style={{ padding: 20, fontSize: 32, margin: 20 }}
        onPress={handleCreateGroup}
      >
        Create Group
      </Text>
      <Text
        style={{ padding: 20, fontSize: 32, margin: 20 }}
        onPress={handleUpdateGroup}
      >
        update group
      </Text>
      <Text
        style={{ padding: 20, fontSize: 32, margin: 20 }}
        onPress={handleUserMsgs}
      >
        ConversationHash
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
