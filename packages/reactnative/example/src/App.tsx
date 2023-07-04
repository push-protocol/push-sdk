import React from 'react';
import { ethers } from 'ethers';

import WebViewCrypto from 'react-native-webview-crypto';
import { StyleSheet, Text, View } from 'react-native';
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
  get,
  PushApi,
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
      env: Constants.ENV.STAGING,
    };

    console.log('create user', account);

    const res = await createUser(options);
    console.log('success', res.did);
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
    <View style={styles.container}>
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
  button: {
    padding: 10,
    fontSize: 32,
    margin: 10,
  },
});
