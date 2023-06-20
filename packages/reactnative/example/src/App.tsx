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
