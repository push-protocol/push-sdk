import React from 'react';
import { ethers } from 'ethers';

import WebViewCrypto from 'react-native-webview-crypto';
import { ScrollView, StyleSheet, Text } from 'react-native';
import OpenPGP from 'react-native-fast-openpgp';
import {
  NFT_CHAIN_ID_1,
  NFT_CHAIN_ID_2,
  NFT_CONTRACT_ADDRESS_1,
  NFT_CONTRACT_ADDRESS_2,
  NFT_HOLDER_WALLET_PRIVATE_KEY_1,
  NFT_HOLDER_WALLET_PRIVATE_KEY_2,
  NFT_TOKEN_ID_1,
  NFT_TOKEN_ID_2,
} from '@env';
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

    const res = await conversationHash({
      account: account,
      conversationId:
        'b353220b812bdb707bd93529aac6fac893438e5db791d7c9e6aab6773aaff90b',
      env: ENV.DEV,
    });

    const res2 = await latest({
      threadhash: res.threadHash,
      toDecrypt: true,
      account: account,
      env: ENV.DEV,
    });

    const user = await PushApi.user.get({
      account: account,
      env: ENV.DEV,
    });

    const pgpDecryptedPvtKey = await PushApi.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
    });

    const chatList = await chats({
      account: account,
      pgpPrivateKey: pgpDecryptedPvtKey,
      toDecrypt: true,
      env: ENV.DEV,
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
    console.log(signer);

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

  const handleSend = async () => {
    const _nftSigner1 = new ethers.Wallet(
      `0x${NFT_HOLDER_WALLET_PRIVATE_KEY_1}`
    );
    const _nftWalletAddress1 = _nftSigner1.address;
    console.log('sending...');
    console.log({
      NFT_CHAIN_ID: NFT_CHAIN_ID_1,
      NFT_CONTRACT_ADDRESS: NFT_CONTRACT_ADDRESS_1,
      NFT_TOKEN_ID: NFT_TOKEN_ID_1,
    });
    const _nftAccount1 = `nft:eip155:${NFT_CHAIN_ID_1}:${NFT_CONTRACT_ADDRESS_1}:${NFT_TOKEN_ID_1}`;
    const _nftSigner2 = new ethers.Wallet(
      `0x${NFT_HOLDER_WALLET_PRIVATE_KEY_2}`
    );
    const _nftWalletAddress2 = _nftSigner2.address;
    const _nftAccount2 = `nft:eip155:${NFT_CHAIN_ID_2}:${NFT_CONTRACT_ADDRESS_2}:${NFT_TOKEN_ID_2}`;

    const pk1 = generatePrivateKey();
    const WALLET1 = new ethers.Wallet(pk1);
    const _signer1 = new ethers.Wallet(WALLET1.privateKey);
    const walletAddress1 = _signer1.address;
    const account1 = `eip155:${walletAddress1}`;

    const pk2 = generatePrivateKey();
    const WALLET2 = new ethers.Wallet(pk2);
    const _signer2 = new ethers.Wallet(WALLET2.privateKey);
    const walletAddress2 = _signer2.address;
    const account2 = `eip155:${walletAddress2}`;

    const MESSAGE = 'Hey There!!!';
    const MESSAGE2 = 'Hey There Upgraded User!!!';
    const MESSAGE3 = 'Hey There from Upgraded User!!!';

    const _env = Constants.ENV.DEV;

    await send({
      messageContent: MESSAGE,
      receiverAddress: _nftAccount1,
      account: account1,
      signer: _signer1,
      env: _env,
    });

    await send({
      messageContent: MESSAGE,
      receiverAddress: account1,
      account: _nftAccount1,
      signer: _nftSigner1,
      env: _env,
    });

    await send({
      messageContent: MESSAGE,
      receiverAddress: _nftAccount2,
      account: _nftAccount1,
      signer: _nftSigner1,
      env: _env,
    });
    console.log('sent message!');
  };
  return (
    <ScrollView style={styles.container} overScrollMode="never">
      <WebViewCrypto />
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
