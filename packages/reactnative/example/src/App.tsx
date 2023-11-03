import React from 'react';
import { ethers } from 'ethers';

import WebViewCrypto from 'react-native-webview-crypto';
import { ScrollView, StyleSheet, Text } from 'react-native';
import OpenPGP from 'react-native-fast-openpgp';

import {
  PGPHelper,
  genRandomAddress,
  createUser,
  ENV,
  conversationHash,
  latest,
  createGroup,
  updateGroup,
  chats,
  PushApi,
  get,
  profileUpdate,
  decryptPGPKey,
  profileUpgrade,
  send,
  Constants,
  approve,
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

function generateRandomString() {
  var characters = '0123456789abcdef';
  var keyLength = 40;
  var randomString = '';
  for (var i = 0; i < keyLength; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
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

    const options: PushApi.user.CreateUserProps = {
      account: account,
      signer: signer,
      env: Constants.ENV.DEV,
    };

    console.log('create user', account);

    const res = await createUser(options);
    console.log('success', res.did);
  };

  const handleUserMsgs = async () => {
    const signer = new ethers.Wallet(
      '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0'
    );
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;
    console.log(signer);

    const res = await PushApi.chat.conversationHash({
      account: account,
      conversationId:
        'b353220b812bdb707bd93529aac6fac893438e5db791d7c9e6aab6773aaff90b',
      env: ENV.STAGING,
    });

    const res2 = await latest({
      threadhash: res.threadHash,
      toDecrypt: true,
      account: account,
      env: ENV.STAGING,
    });

    const user = await PushApi.user.get({
      account: account,
      env: ENV.STAGING,
    });

    const pgpDecryptedPvtKey = await PushApi.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
    });

    const chatList = await chats({
      account: account,
      pgpPrivateKey: pgpDecryptedPvtKey,
      toDecrypt: true,
      env: ENV.STAGING,
    });
    console.log(user, 'user');
    console.log(pgpDecryptedPvtKey, 'key');
    console.log(chatList, 'Chatlist');
  };

  const handleCreateGroup = async () => {
    const pk = generatePrivateKey();
    const signer = new ethers.Wallet(pk);
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;
    console.log(signer);

    const groupName = generateRandomString();

    const res = await createGroup({
      groupName: groupName,
      groupDescription: 'satyamstesing',
      groupImage: 'https://github.com',
      account: account,
      signer: signer,
      members: [
        '0x83d4c16b15F7BBA501Ca1057364a1F502d1c34D5',
        '0x6Ff7DF70cAACAd6B35d2d30eca6bbb4E86fEE62f',
      ],
      admins: [],
      isPublic: true,
      env: ENV.DEV,
    });
    console.log(res, 'res');

    return {
      chatId: res.chatId,
      groupName,
      signer,
    };
  };

  const handleUpdateGroup = async () => {
    const { signer, chatId, groupName } = await handleCreateGroup();
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;

    const res = await updateGroup({
      groupName,
      groupDescription: 'satyamstesing',
      groupImage: 'https://github.com',
      chatId,
      account: account,
      signer: signer,
      admins: ['0x83d4c16b15F7BBA501Ca1057364a1F502d1c34D5'],
      members: [
        '0x6Ff7DF70cAACAd6B35d2d30eca6bbb4E86fEE62f',
        '0x6d118b28ebd82635A30b142D11B9eEEa2c0bea26',
        '0x83d4c16b15F7BBA501Ca1057364a1F502d1c34D5',
      ],
      env: ENV.DEV,
    });
    console.log(res, 'ress');
  };

  const handleGetUser = async () => {
    const options: PushApi.AccountEnvOptionsType = {
      account: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
      env: Constants.ENV.DEV,
    };

    const res = await get(options);
    console.log('successfully got user', res);
  };

  const handleProfileUpdate = async () => {
    console.log('updating profile...');
    const pk = generatePrivateKey();

    const signer = new ethers.Wallet(pk);
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;

    console.log('creating user...');
    const user = await createUser({
      account: account,
      signer: signer,
      env: Constants.ENV.DEV,
    });

    console.log('decrypting pgp key...');
    const pgpPK = await decryptPGPKey({
      account: user.did,
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      env: Constants.ENV.DEV,
      signer: signer,
    });

    console.log('updating profile...');
    await profileUpdate({
      account: account,
      env: Constants.ENV.DEV,
      pgpPrivateKey: pgpPK,
      profile: {
        name: 'Updated Name',
        desc: 'Updated Desc',
      },
    });
    console.log('successfully updated profile');
  };

  const handleProfileUpgrade = async () => {
    console.log('upgrading profile...');
    const pk = generatePrivateKey();
    const signer = new ethers.Wallet(pk);
    const walletAddress = signer.address;
    const account = `eip155:${walletAddress}`;

    const user = await createUser({
      account: account,
      signer: signer,
      env: Constants.ENV.DEV,
    });

    const pgpPK = await decryptPGPKey({
      account: user.did,
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      env: Constants.ENV.DEV,
      signer: signer,
    });

    const pgpPubKey = await OpenPGP.convertPrivateKeyToPublicKey(pgpPK);

    const upgradedProfile = await profileUpgrade({
      signer: signer,
      pgpPrivateKey: pgpPK,
      pgpPublicKey: pgpPubKey,
      pgpEncryptionVersion: Constants.ENCRYPTION_TYPE.NFTPGP_V1,
      account: account,
      env: Constants.ENV.DEV,
      additionalMeta: {
        NFTPGP_V1: {
          password: '0x@1jdw89Amcedk', //new nft profile password
        },
      },
    });

    console.log('successfully upgraded profile');
    return upgradedProfile;
  };

  const handleInbox = async () => {
    //
  };

  const handleSend = async () => {
    console.log('sent message!');
  };

  const handleApproveRequest = async () => {
    console.log('successfully approved request!');
  };

  return (
    <ScrollView style={styles.container} overScrollMode="never">
      <WebViewCrypto />
      <Text style={styles.button} onPress={handleInbox}>
        Inbox
      </Text>
      <Text style={styles.button} onPress={handleUserCreate}>
        New User
      </Text>
      <Text style={styles.button} onPress={handlePgp}>
        Generate PGP Pair
      </Text>
      <Text style={styles.button} onPress={handleEthers}>
        Log Address
      </Text>
      <Text style={styles.button} onPress={handleCreateGroup}>
        Create Group
      </Text>
      <Text style={styles.button} onPress={handleUpdateGroup}>
        update group
      </Text>
      <Text style={styles.button} onPress={handleUserMsgs}>
        ConversationHash
      </Text>
      <Text style={styles.button} onPress={handleGetUser}>
        Get user
      </Text>
      <Text style={styles.button} onPress={handleProfileUpdate}>
        Update Profile
      </Text>
      <Text style={styles.button} onPress={handleProfileUpgrade}>
        Upgrade Profile
      </Text>
      <Text style={styles.button} onPress={handleSend}>
        Send Message
      </Text>
      <Text style={styles.button} onPress={handleApproveRequest}>
        Approve Request
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  button: {
    padding: 10,
    fontSize: 32,
    margin: 10,
  },
});
