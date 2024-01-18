import {
  PGPHelper,
  genRandomAddress,
  createUser,
  ENV,
  latest,
  createGroup,
  updateGroup,
  chats,
  PushApi,
  get,
  profileUpdate,
  decryptPGPKey,
  profileUpgrade,
  Constants,
  requests,
  send,
  approve,
} from '@pushprotocol/react-native-sdk/src';
import {ethers} from 'ethers';
import OpenPGP from 'react-native-fast-openpgp';

export const generatePrivateKey = () => {
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
};

export const generateRandomString = () => {
  var characters = '0123456789abcdef';
  var keyLength = 40;
  var randomString = '';
  for (var i = 0; i < keyLength; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};

export const handlePgp = async () => {
  let res = await PGPHelper.generateKeyPair();
  console.log(res);
};

export const handleEthers = async () => {
  let res = await genRandomAddress();
  console.log(res);
};

export const handleUserCreate = async () => {
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

export const handleLatestMsg = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;
  console.log(signer);

  const res = await PushApi.chat.conversationHash({
    account: account,
    conversationId:
      'b353220b812bdb707bd93529aac6fac893438e5db791d7c9e6aab6773aaff90b',
    env: ENV.DEV,
  });

  const user = await PushApi.user.get({
    account,
    env: ENV.DEV,
  });

  const pgpDecryptedPvtKey = await PushApi.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
    env: ENV.DEV,
  });

  const msg = await latest({
    threadhash: res.threadHash,
    toDecrypt: true,
    account: account,
    env: ENV.DEV,
    pgpPrivateKey: pgpDecryptedPvtKey,
  });

  console.log('Latest message: ', msg);
};

export const handleCreateGroup = async () => {
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

export const handleUpdateGroup = async () => {
  const {signer, chatId, groupName} = await handleCreateGroup();
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

export const handleGetUser = async () => {
  const options: PushApi.AccountEnvOptionsType = {
    account: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
    env: Constants.ENV.DEV,
  };

  const res = await get(options);
  console.log('successfully got user', res);
};

export const handleProfileUpdate = async () => {
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

export const handleProfileUpgrade = async () => {
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

export const handleInbox = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;

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

  const requestList = await requests({
    account: account,
    pgpPrivateKey: pgpDecryptedPvtKey,
    toDecrypt: true,
    env: ENV.DEV,
  });

  console.log('CHATS: ', chatList);
  console.log('-'.repeat(30));
  console.log('REQUESTS: ', requestList);
};

export const handleSend = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const account = `eip155:${signer.address}`;

  const user = await PushApi.user.get({
    account,
    env: ENV.DEV,
  });

  const pgpDecryptedPvtKey = await PushApi.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
    env: ENV.DEV,
  });

  const MESSAGE_TYPE = PushApi.CONSTANTS.CHAT.MESSAGE_TYPE.MEDIA_EMBED;
  const MESSAGE =
    'ttps://media1.giphy.com/media/FtlUfrq3pVZXVNjoxf/giphy360p.mp4?cid=ecf05e47jk317254v9hbdjrknemduocie4pf54wtsir98xsx&ep=v1_videos_search&rid=giphy360p.mp4&ct=v';

  const messageSent = await send({
    account,
    env: ENV.DEV,
    messageContent: MESSAGE,
    messageType: MESSAGE_TYPE,
    to: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
    pgpPrivateKey: pgpDecryptedPvtKey,
  });

  console.log('message sent: ', messageSent);
};

export const handleApproveRequest = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;

  const user = await PushApi.user.get({
    account,
    env: ENV.DEV,
  });

  const pgpDecryptedPvtKey = await PushApi.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
    env: ENV.DEV,
  });

  const senderAddress = '0xACEe0D180d0118FD4F3027Ab801cc862520570d1';

  const res = await approve({
    senderAddress,
    account: account,
    env: ENV.DEV,
    pgpPrivateKey: pgpDecryptedPvtKey,
    status: 'Approved',
  });

  console.log('request approved: ', res);
};

export const handleConversationHash = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const account = `eip155:${signer.address}`;

  const hash = await PushApi.chat.conversationHash({
    account,
    conversationId:
      'b353220b812bdb707bd93529aac6fac893438e5db791d7c9e6aab6773aaff90b',
    env: ENV.DEV,
  });
  console.log('conversation hash: ', hash);
};
