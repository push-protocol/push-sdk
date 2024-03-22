import * as PushAPI from '@pushprotocol/react-native-sdk';
import {ethers} from 'ethers';

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

export const generateRandomString = (keyLen = 40) => {
  var characters = '0123456789abcdef';
  var keyLength = keyLen;
  var randomString = '';
  for (var i = 0; i < keyLength; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};

export const handleUserCreate = async () => {
  const pk = generatePrivateKey();

  const signer = new ethers.Wallet(pk);
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;

  const options: PushAPI.user.CreateUserProps = {
    account: account,
    signer: signer,
    env: PushAPI.CONSTANTS.ENV.DEV,
  };

  console.log('creating user with account: ', account, '...');

  const res = await PushAPI.user.create(options);
  console.log('✅ successfully created user: ', res.did);
};

export const handleLatestMsg = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;
  console.log(signer);

  const res = await PushAPI.chat.conversationHash({
    account: account,
    conversationId:
      'b353220b812bdb707bd93529aac6fac893438e5db791d7c9e6aab6773aaff90b',
    env: PushAPI.CONSTANTS.ENV.STAGING,
  });

  const user = await PushAPI.user.get({
    account,
    env: PushAPI.CONSTANTS.ENV.STAGING,
  });

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
    env: PushAPI.CONSTANTS.ENV.STAGING,
  });

  const msg = await PushAPI.chat.latest({
    threadhash: res.threadHash,
    toDecrypt: true,
    account: account,
    env: PushAPI.CONSTANTS.ENV.STAGING,
    pgpPrivateKey: pgpDecryptedPvtKey,
  });

  console.log('✅ Got Latest message: ', msg);
};

export const handleCreateGroup = async () => {
  const pk = generatePrivateKey();
  const signer = new ethers.Wallet(pk);
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;
  console.log(signer);

  const groupName = generateRandomString();

  const res = await PushAPI.chat.createGroup({
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
    env: PushAPI.CONSTANTS.ENV.DEV,
  });
  console.log('✅ successfully created group: ', res);

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

  const res = await PushAPI.chat.updateGroup({
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
    env: PushAPI.CONSTANTS.ENV.DEV,
  });
  console.log('✅ successfully updated group: ', res);
};

export const handleGetUser = async () => {
  const options: PushAPI.AccountEnvOptionsType = {
    account: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
    env: PushAPI.CONSTANTS.ENV.DEV,
  };

  const res = await PushAPI.user.get(options);
  console.log('✅ successfully got user', res);
};

export const handleProfileUpdate = async () => {
  console.log('updating profile...');
  const pk = generatePrivateKey();

  const signer = new ethers.Wallet(pk);
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;

  console.log('creating user...');
  const user = await PushAPI.user.create({
    account: account,
    signer: signer,
    env: PushAPI.CONSTANTS.ENV.DEV,
  });

  console.log('decrypting pgp key...');
  const pgpPK = await PushAPI.chat.decryptPGPKey({
    account: user.did,
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    env: PushAPI.CONSTANTS.ENV.DEV,
    signer: signer,
  });

  console.log('updating profile...');
  await PushAPI.user.profile.update({
    account: account,
    env: PushAPI.CONSTANTS.ENV.DEV,
    pgpPrivateKey: pgpPK,
    profile: {
      name: 'Updated Name',
      desc: 'Updated Desc',
    },
  });
  console.log('✅ successfully updated profile');
};

export const handleProfileUpgrade = async () => {
  console.log('upgrading profile...');
  const pk = generatePrivateKey();
  const signer = new ethers.Wallet(pk);
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;

  await PushAPI.user.create({
    account,
    env: PushAPI.CONSTANTS.ENV.DEV,
    signer,
  });

  const upgradedProfile = await PushAPI.user.upgrade({
    signer: signer,
    account: account,
    env: PushAPI.CONSTANTS.ENV.DEV,
    additionalMeta: {
      NFTPGP_V1: {
        password: '0x@1jdw89Amcedk', //new nft profile password
      },
    },
  });

  console.log('✅ successfully upgraded profile', upgradedProfile);
  return upgradedProfile;
};

export const handleInbox = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;

  const user = await PushAPI.user.get({
    account: account,
    env: PushAPI.CONSTANTS.ENV.DEV,
  });

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
  });

  const chatList = await PushAPI.chat.chats({
    account: account,
    pgpPrivateKey: pgpDecryptedPvtKey,
    toDecrypt: true,
    env: PushAPI.CONSTANTS.ENV.DEV,
  });

  const requestList = await PushAPI.chat.requests({
    account: account,
    pgpPrivateKey: pgpDecryptedPvtKey,
    toDecrypt: true,
    env: PushAPI.CONSTANTS.ENV.DEV,
  });

  console.log('✅ Got chats: ', chatList);
  console.log('-'.repeat(30));
  console.log('✅ Got requests: ', requestList);
};

export const handleSend = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const account = `eip155:${signer.address}`;

  const user = await PushAPI.user.get({
    account,
    env: PushAPI.CONSTANTS.ENV.DEV,
  });

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
    env: PushAPI.CONSTANTS.ENV.DEV,
  });

  const MESSAGE_TYPE = PushAPI.CONSTANTS.CHAT.MESSAGE_TYPE.MEDIA_EMBED;
  const MESSAGE =
    'ttps://media1.giphy.com/media/FtlUfrq3pVZXVNjoxf/giphy360p.mp4?cid=ecf05e47jk317254v9hbdjrknemduocie4pf54wtsir98xsx&ep=v1_videos_search&rid=giphy360p.mp4&ct=v';

  const messageSent = await PushAPI.chat.send({
    account,
    env: PushAPI.CONSTANTS.ENV.DEV,
    messageContent: MESSAGE,
    messageType: MESSAGE_TYPE,
    to: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
    pgpPrivateKey: pgpDecryptedPvtKey,
  });

  console.log('✅ successfully sent message: ', messageSent);
};

export const handleApproveRequest = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const walletAddress = signer.address;
  const account = `eip155:${walletAddress}`;

  const user = await PushAPI.user.get({
    account,
    env: PushAPI.CONSTANTS.ENV.DEV,
  });

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
    env: PushAPI.CONSTANTS.ENV.DEV,
  });

  const senderAddress = '0xACEe0D180d0118FD4F3027Ab801cc862520570d1';

  const res = await PushAPI.chat.approve({
    senderAddress,
    account: account,
    env: PushAPI.CONSTANTS.ENV.DEV,
    pgpPrivateKey: pgpDecryptedPvtKey,
    status: 'Approved',
  });

  console.log('✅ successfully approved request: ', res);
};

export const handleConversationHash = async () => {
  const signer = new ethers.Wallet(
    '07da77f7471e5cf046ea3793421cbce90fd42a4cfcf520046a490ca1a9b636e0',
  );
  const account = `eip155:${signer.address}`;

  const hash = await PushAPI.chat.conversationHash({
    account,
    conversationId:
      'b353220b812bdb707bd93529aac6fac893438e5db791d7c9e6aab6773aaff90b',
    env: PushAPI.CONSTANTS.ENV.STAGING,
  });
  console.log('✅ successfully got conversation hash: ', hash);
};
