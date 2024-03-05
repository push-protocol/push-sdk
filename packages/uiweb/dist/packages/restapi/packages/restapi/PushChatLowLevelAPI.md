# PushChatLowLevelAPI

This file documents the usage of Low Level Push Chat Functions. Visit [Developer Docs](https://docs.push.org/developers) or [Push.org](https://push.org) to learn more.

# Index

- [PushChatLowLevelAPI](#pushchatlowlevelapi)
- [Index](#index)
  - [For Chat](#for-chat)
    - [Create user for chat](#create-user-for-chat)
    - [Get user data for chat](#get-user-data-for-chat)
    - [Decrypting encrypted pgp private key from user data](#decrypting-encrypted-pgp-private-key-from-user-data)
    - [Updating User Profile](#updating-user-profile)
    - [Fetching list of user chats](#fetching-list-of-user-chats)
    - [Fetching list of user chat requests](#fetching-list-of-user-chat-requests)
    - [Fetching conversation hash between two users](#fetching-conversation-hash-between-two-users)
    - [Fetching latest chat between two users](#fetching-latest-chat-between-two-users)
    - [Fetching chat history between two users](#fetching-chat-history-between-two-users)
    - [To send a message](#to-send-a-message)
    - [To approve a chat request](#to-approve-a-chat-request)
    - [To create a group](#to-create-a-group)
    - [To create a token gated group](#to-create-a-token-gated-group)
    - [To check user access of a token gated group](#to-check-user-access-of-a-token-gated-group)
    - [To update group details](#to-update-group-details)
    - [To update token gated group details](#to-update-token-gated-group-details)
    - [To get group details by group name](#to-get-group-details-by-group-name)
    - [To get group details by chatId](#to-get-group-details-by-chatid)
    - [Chat Helper Utils](#chat-helper-utils)
      - [Decrypting messages](#decrypting-messages)

## For Chat

### **Create user for chat**

```typescript
const user = await PushAPI.user.create({
  env?: ENV;
  account?: string;
  signer?: SignerType;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  additionalMeta?: {
    NFTPGP_V1?: {
      password: string;
    };
  };
  progressHook?: (progress: ProgressHookType) => void;
  origin? : string | null;
})
```

| Param          | Remarks                                                       |
| -------------- | ------------------------------------------------------------- |
| env            | API env - 'prod', 'staging', 'dev'                            |
| account        | Account address                                               |
| signer         | ethers.js signer                                              |
| version        | 'x25519-xsalsa20-poly1305' or 'eip191-aes256-gcm-hkdf-sha256' |
| additionalMeta | Additional meta data for user                                 |
| progressHook   | Progress hook                                                 |
| origin         | Origin through which user is created                          |

Example creating normal user for chat:

```typescript
const user = await PushAPI.user.create({
  signer: signer, // ethers.js signer
  env: env as ENV,
});
```

Example creating NFT user for chat:

```typescript
const user = await PushAPI.user.create({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  signer: nftSigner, // ethers.js signer
  env: env as ENV,
  additionalMeta: { NFTPGP_V1: { password: '@Test0i1223de' } },
});
```

<details>
  <summary><b>Expected response (Create Chat User)</b></summary>

**Version 1.2.x**

```typescript
export interface IUser {
  did: string;
  wallets: string;
  profilePicture: string | null;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptionType: string;
  signature: string;
  sigType: string;
  about: string | null;
  name: string | null;
  encryptedPassword: string | null;
  nftOwner: string | null;
  numMsg: number;
  allowedNumMsg: number;
  linkedListHash?: string | null;
  nfts?: [] | null;
}
```

| Parameter             | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `did`                 | user decentralized identity                                     |
| `wallets`             | all wallets associated to the did                               |
| `profilePicture`      | user chat profile picture. As of now i cannot be changed        |
| `publicKey`           | PGP public key                                                  |
| `encryptedPrivateKey` | encrypted private PGP key                                       |
| `encryptionType`      | encryption type used to encrypt the private key                 |
| `signature`           | user payload signature used when creating a user                |
| `sigType`             | signature type used when creating a user                        |
| `about`               | short user description                                          |
| `name`                | user name                                                       |
| `encryptedPassword`   | encrypted password used to encrypt the private key for NFT chat |
| `nftOwner`            | NFT owner address                                               |
| `numMsg`              | number of messages sent by the user                             |
| `allowedNumMsg`       | number of messages allowed to be sent by the user               |
| `linkedListHash`      | cid from all messages this user has sent                        |
| `nfts`                | array of NFTs owned by the user                                 |

Example response normal user:

```typescript
// PushAPI_user_get | Response - 200 OK
{
  did: 'eip155:0x85e6350861136e65BE141d8DB1eEa25cA346743f',
  wallets: 'eip155:0x85e6350861136e65BE141d8DB1eEa25cA346743f',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRUAu8BCACV4muD50mKJeGPU33ZkTXi7x6eMpjXlmMQbVERQ7MVKvOc\n' +
    'cN+9iz2A18bi73vPYq9FwF/Ibok+A/SuwTbiEe/5E0FXJSnC87DWVF6Aq6At\n' +
    'lzCT4WHYlkHU2h5+JNaD8CXOxe6bsGfzbZ9dSZ9zfs5IoCh6Qf035cjV7wH6\n' +
    'lcGykxvZUIfKiJuwXotkglGzk0317oo37ZXl6f2hCJBg7NdewXGxVKFYu1JS\n' +
    'n5ztzAkoRyiHUnuFDje+HmkU4PjhtrHiFrEeooRyvR/6YCvyIue7f2lIXKV9\n' +
    'rOCyczJyDWTf3wwpklDZVEB0Guv4PHcWsTuN1pqyxgz2bT+umctEvla3ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZFQC7wQLCQcICZAzo8jUDaqidgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBNgrG501gFGxwttFzDOjyNQNqqJ2AACgaQf/Rt33rLH7Ayxb\n' +
    'UED4L7a5f6aw//jk9Y+yqpB3QbwJTSoD02yUqUJ5J9sW46m8k3eQc6ds4OkP\n' +
    'ylaQtoUkumELSuS5hON3Y2IQ78fMvv+My8pQoxD4HzzLj7uVOHaHaElygfoC\n' +
    'pfWSDU2UrJB5TK6noOTspcdB5QlCKh5fU0fDtRQ9OKVTM4NTAmYxsDa3OZO6\n' +
    'DvqfMAK75tlHJr+Xro7GUbKebaJft/guA2ZHpGTHhs2Q+grjQcvljx6BoN3o\n' +
    'NydGwkCorcVZZO7XKr73hPE0VH/LlRqZJ2lcBn/kUJzG1Z1LFYcny+FCrM3U\n' +
    'cCg5eI+Is436jSWBl3bhtdYptNwdNM7ATQRkVALvAQgAt7ghdqho1nII81Vk\n' +
    'BAs2LN3Vb56GyUCTgZjBP+nbIVat6Kjd2H9dmXVhYEbZMFZyjqAdUwFzoJ8p\n' +
    '3Y6qAJxmCktSZ77mzBeojZXi3VesOVfrCzi6MDU+SnN4mguL72YWr6gEbQK5\n' +
    'Ypto4uuEh836Dcf7WCj20fTSRvRSKakmBGwnzP/0Gj7fo8S8OQLwFMMEo7bf\n' +
    '5ExVuB5Is2SEUxWdeXligBMSiajLJo6thlzs0rTsY/ugbz/czulAMDh1MnST\n' +
    'Yol6nHEQUgZFgWx56ARwOn+Y8hJPQqnpWmQie+BakUEabHQjY9sEJ5UDozZ5\n' +
    'GwGVrfgETiNblc0crVnUI7CQKQARAQABwsB2BBgBCAAqBYJkVALvCZAzo8jU\n' +
    'DaqidgKbDBYhBNgrG501gFGxwttFzDOjyNQNqqJ2AACmjwf/eZuqTjk9MIgq\n' +
    'fdlWMM6kLD7W6hScgHIvms9V21Zwy7WQtMrxmQRhCqCHai/eXe/hFABmWxUK\n' +
    'nHbosXKL3DQUapvn2cm40BWseW8Il93oRbSQb7xvFQ3g+mNEiSgn0oWBCTSf\n' +
    'W9HM/3Kowfc34ilvqfquan+ilCID8OzXHHZXx/nxHeVbpARZiHe2ebk1lr6r\n' +
    'KJzq/2S0C65xgn8ShTU1Aewio3+5kr3oHzlTlSnF8Ov5c9VzfEKb+UP7tBMO\n' +
    'b8quBez/BgDetebCxaqy881+/LY535i9xVUNDkMK50jY+JvqW10HeuVXOVxZ\n' +
    'NrSotIw2xObkCFV2WN46DVNt2S541Q==\n' +
    '=Zf86\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  encryptedPrivateKey: '{"ciphertext":"7496a39864b0882212956f02270d8b34ad8fbdcbbcf97d359eb8c95eeba70d8daf810d9874ff8cfff5e7840bef8ee12b82a2c7783c28685035ad81dee5233d37570bc4e57cc2d56ac252a14db2cec9777a73094f3efaead3843f59f0a64efcd4f9ded45edb54c3e933811790eee9c5bc9877f9faadf50fe6436510111cf62f1b3419816bdd80f292326b5f58dd8fb595bafe56970479530de30cfd4b3a9c6ca82554016ce902e0bee2db1f636f8e0bd7b2c6f98157220885b07bc9c213a67de847c97c21fabd40440fdaa911219118b9a0efe2ff34fe78fbe2365963f8e2f0d6e22c12d067614d921eb021cea67d8fc36866efe82401ef124de229f27686b93183cfffa75332821939bfd9b5c2ebddb8b388fcee489d06f9bebbc407b68d2a57dd247b3edf51d14010da4cb8325e392475c68383a4dec063e8d8f84e6d553da2c4f84fe9143b2e212e5a17a436d14431e421a7eac40c9e460f37819831f692e9d14617969ecb2cebe4a934f0d36fb85e9694857cb87ebc7186c420362a2582d641bb1112c1bb32822e161ac1c130841ed69d9cdd7c5683352c51315d87abad1c844c1b46017346642482ede19e6be01f8bed93f29fd1d899bc02e99a4463d37b30f3e682877d1cf266c5a30862f27aa9a044ab90cd4e9d069512d0b22f57240480d71671b7d8d9bf3261eab7cb6c0279f159bd53bec28dd48a9f6433f225cc45c5dbaa7d58f0dc6b0e0e52ae0f197d6e9ba458e47ed8dac43351bf1099ce8e367bb67cd706c1a25f5388af9f6370781ecf2296b148eae9e9f554fc3a9dcaffd53cb9650937f1f5d50a566b314542cf5e0994c99fce26053a794f1b38c480ca6a6f344ba023092ca039f37c74b6fee0d0dde4d5553b192cbcdfa50d733d874483a269069e260394a6cb515e2a7a5e6daf6221fe9f7540845457514d38119d858abdcee09595b9266ae06110726391b652881f07f41988abc9080a6dc1fce8929bac13761ca12c66178a487e1d42b07a128e42c6582999fa0e8d2f47ae079ee46c3b13ac058f58e3f27dcfb22e4a2620785ae317258397bc42d64ce0e02c769c426fcfb5b6d9c7862872f19bf1bfae517e60bf853ecbe269143f67c6b2245cba29335a264b3d94a2f5444223aff7f1dab63ee4846cdda557a9b8041a3edc8d5b1ba23f6e4080129e3c25b3336a3ebaf23de2140f1020d332a472795c6f7ab1a767997c6c9a679a1bbdc34415ca83ea46d818af26ae92a0c05c7e8de2a0d960a92975a2709d25c33d2f980a7e5e5b279c6b8c733241b1447448a4b673f28e45d72409a3929b51d86ff3f2fa1aa07e0b355993d2d14035283a366c4d55fb2172bacebd7a7c3745f4e9aebb6096a2a7bb094e29be60aa206c26cdf5aeda9ba7cd40ea291ab7980020fd3b8a69bd1889cf8a347f327b79b21ce370cb2ca75920fd258704da8d23c8df55ecefa528a37adcc06f37113fccffaa958d13b3435fe81823107bf01274c0ab6912cb1960c0d4c7a4f40e3b23b3c50a65785b12ff8663a31fb1718cc6a4dd2a57c3456ad1743c81743c4366d31d987d016f800502c189a12c55e562cb3fb1c198837aa9a9735d3b7d18ea4ce2936df1e579330d773f3da0f7b733a527d11b68accd1fad3166e61b30594b76d8a1594e4ebd692ed4e54d955778d752a707513a5278502dd0ef64c6474c46df0cbba3c763e6366d005a0580f91f9f3674e06421d6ac3828fa2f79cea6d81686926df8092389e04d3e290ce3fc8d9b885b0df75beb5b6307e4fa6f2c4efe7005ac4f3779a48e290d8afdb98ec82046b2621d9ed09cc59f11cedccdeca85962e6b50f4ec9e512da6f547537e75f254aaefb76cb6981f3ccabb7e3230610aa3a50adfe23e04feb1e0b0dc67e1e9e1570808ae3f029583c25fa5f10f983c285d7b2fe0cd13cdd2a91294adcceb3b57bd6687d2b880d963872ba56b5696d63b8110ce4ef7e3af8c7c091fd65b2ceee3bf206d0c54c1127b051d74779545b344389f843eabe5c9459e421176f912ddb2a31f75dd12c964f01ec0f53d164b92c95f175a900e8a707401d2898141ec52d9c3ea619b71e46fc492b6ae9e524c6da32373d19dfbfe9ee3e2a3898fac7f57cff2b1eabd72ab3f48d6021b996a3fd1015ace78742b969a4754ae5a47d510e98f7c02b6833de4c89e1be31d5448a433e3032eaa0e5ecd8b3a40a89f493415dd8c0ca7d467b3ea2e01e902579206354d7dd7936b1593cbd481eca61dd19c62eaf25737c2a70db08f6cddb7776fc849b5cc1ada596d6b07b24f0cae171a281a70f2c8eeed67c74d4b79fc74facbf40d6f89f4f0a91510463454117f1d99d08aef055605452761daea5f8dd47d7f5b7015bc51ccabce1f64c6cbf564eda011fc3bdb3cf809594fa620b98202fd86c0ca5b083f9e77457cace4cc854c37541c1cd2e2faf41bf003eda90165d7b5646ba1884bd9e75c4941ddca0dc1dbeace314021362237795e9993cb438ab45749516b5d7a91ef2b1aa645cf3a054e04893c5bb9fbb1dc4006b4ee7cb4705521d05500a565598097469d0ac7401cb75a08e185dc316901c666f1ecda5e426f45c87a9692045974c1762b25440bdde119d82ec76d33508d26c7c3058a73995182fe82d56e725643cfb722db7bc7a1b7fe36ac1c2dcea391cb7db048e7bb127950f44347e7aa3010e2b72977774ad5b568acc2fd3381e9a7631d196b4a64fd9a1a65b5831b0bb66d78af49a711b7a1e212fd1869847c71a1db467b24858f16b794ff769452bc8be1f3aff7ad38d317de0c235a51b0d28de7b8d0525e7a2278aeed8e6c7cc0419f5967c86919fff31d02b205226d0c1cc05fe81e9bc3c8196aa813deef424ae01d8d140af04b9295658d1c4f8f4958b321dbe38564476d1c43096eeaea7c2d92c81a8a774a277092db570b1ecfb3f36a63006fef8692029ed409d265718ef988ab86bf5f3bd8cdd9de1ecd25c4ba27d5538416a6b86af4d3a2bd6aa3b43dbcbb8862ec2892a3bb7b173daae9ec9d72666f6a9150dda0ebe5edb6f64cc6cda224506e0712975c30c021e1cf83cfc62ed2801252a1d8d5f82f02772d9bc166cf10757c03384f3842d339b27d270f79079e79404e6d933b17530cc9ff004bce21e2cd271e7d9353aef118f99a93ba226d2e78f07e16b40212b2f48d19c2567d5873af7e49bdfe12a9da702409d1c4d7ced214d1e55259442222d827b590484b8b9706b805c25c7162c0c6c9c5d58efa91a9cb9dc6e87349bc95afa5a04c41d1ce41ad594adcfd93fb7357c32b46f1351291ecee68696843fa849da57ed1e50cec9d46d6b99d0a30e70dae05935960e6254e94dba3c6134fd7eac1ff3bf60567fa2a046772a866104823f2904351c6046fe11df8156791057171f0127ceb23cadd2440b0df7d87e5e3eab477b868e69f3da9e78e1fc02626310be982dc2b78367916932b4e16cf9ab4e8eab25480de37714f6f91141e7858a0c5486b274c017310bea58bc4b9af6552a10e255c50130691430d5dc732196b320475c0ebfd35814e1e18c6d0007cd0d1de40565f539a46a7a0bcc40ca8f633a922f278ee4f23677182d001a24676592d375dea7b7187659099b3955465264d97000445dee10669b286b5651e3d4c908ecfaa98a87362ed4674636fc6c6c61de8dd55c024658170751033f6294361c1add6f759317a3390ffdb0da4343a02f5ae3b63d7b7be60b0a949be10e887aa67cf1def7c408db6b89f3258780b998c8a70ad19e2fff3316933a7658191dbb78e25f73a22d1c9a1010421fb4abf243b7170bc8bd83550902af9388d671d402bd74e10f4b0fa82011f9bf34c4d9ca8728b6e7af7b6a1f7dcb2b28c34d6ac8dd6a23baddf7f22851b65ca2fb7e8f69b5cdc4a13bb36ce197f5ca1adc6c1404472afa8fe0f92cbf139a9745cdff3b325cc0b58f1d4410366ec1d3614e8c93f7dbdde78122d7371b81c66b34a4884058f0c0101bbf9e5081392d6a84b7f01e4636d8998f78df9d3a8519906d3aea09e3d67c919351c431ea3a882efe19c35853f15d1689235d6bc453311d8f8f2be841083b048478e5e04e57adfc0e20d0454e25636b995107e4b4ff587584413a5b75f4b500a4244d2b65fcb4a36aced81773339edb8317d4a6c9c3c71a02312b4d41e19f45f4749d91127a5aa993e98ba3fa99e749419455521dccc90e15603e45640383bd455e90d5724073eef83e6093fa9521bc77f5eb563bf398099433dfd7161c1b3a22a8696263c1ebb1cf1b0bbcbc4272c2632e12607164e3688f1ea88bc63622f57d5531a369921c71ada66f62a2ac7a0d7c7d65d9e052ae1484c7112c6426c2f346c002d05df90af2d40137c2ebc2a5b391e7077b8cba458b3a67d4080b10ad1bf7b73b889815e9f94149b44ed0234fddc9c74ceebb1dec82afc6a197257bc84924d2a831c2affbac3262c77da4a9bf1752ea9c3ca041ec6c49f603c052ec568332fb0fbd3ad7374c9cdb0b5b71889eced082feb6f1dabe91bb9819e663a5625dc24671ec0fb00c3c001bc7dee9a886e08be7f52fad9a13bbd2ef913a02a4f144785991ccfa33bb9bb00d42b5660886416ffd756b8c7d027b7ad8a45b0966770bdefcde889d2b155de4ec2721a1b11e7f582426ea12538f1bab2bfba3e0586f2f2302e38d7c398bf8d0b39c36f1e35dfa5e877d29c7e8bd66bb23d09aa6d5cc3091da7988a4acc5b5feacb2d2adc247668b9d7d9f45e51cb3f315d00ec3e5cf7a6ee68001e054f59933c0befcb22c807c7c5c2ab1f679bd2a9401ba10ef6aeb4dd240ecbb23910b07f3edd7dc45830cf29a36ba0325359c2b4871628b3f6163d132023223981bdf2acc5418f3b25db22b0c2575d5865d877386eea6e2d5b80c759057608ace72fc0c803ac46e7eb2678471458f","salt":"7920d0b688208bd58eab85208237ab1ea06e6ca05a692d291581d7c1aea9aa60","nonce":"c2b1e7da7fd7b1659e52e692","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"3ab0388b3b6772457a82cfb7cc125a2d36cd1e568594d0bbfdaee29d3e07c8ef"}',
  encryptionType: 'eip191-aes256-gcm-hkdf-sha256',
  encryptedPassword: null,
  nftOwner: null,
  signature: '0xaa451b258c31cdff4e4aaffff5df6b48d8de9ddcb7fa31183c745c0295905705637af5ab3bee1484f11a150bb35db4bbb49243f6439d9e357dc0830685fdd72b1b',
  sigType: 'eip191',
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
  about: null,
  name: null,
  numMsg: 0,
  allowedNumMsg: 1000,
  linkedListHash: ''
}
```

Example response NFT user:

```typescript
{
  about: null,
  name: null,
  allowedNumMsg: 1000,
  did: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  encryptedPrivateKey: '{"ciphertext":"833ddc6dfe07e8af7f78991f679ecb5b64d60b1cffc2fed4ecb6287dd04fb27e712c1fd8988b1f15c7b6f30914941f52b316a67b4cc1a8172c7918f00ee333b8a8610cca0320b9593145087a27d4dbd0582043d47538735d087455afacfa3b48b5aa40d82040778f5de3b8bed2c281fa9a381024dc233a92132afd745853a1abb2f305a4eafe7072dc3df405af93ceec52f1b8ce9bb796b5567993ef29e735c7ddcfd8b5b5e7ac6c261b67a76e0c392505777591a98e85f7829796d35efaed030b348b14349539bcd6bd34d4599c7af95db1fb605672d3318737184f92c0d54580abf4be00138f047d8ad69952f368192ab62906dd7f9ef66d1573f9ffdb129bf40c11816057541aefaf8fbee93e80d27e6b09854aef29b8d853bd8b9d994c955400b90e8d4e2b40dd1885ebad81f6c6bf2c41e16039e6a94b8213a501d100ae0b5351198ababe328a8f17480daa70cc0cb65c0f4791903ddb8508f1d304daf64b91f43bbcb489163fb01a6c43815d18e6befbeb78c30be4699366b64b5687335a1f910eb7bb542df5b3fee6f01807656e7b498a55914453dc08c17d89aed5b68d65959959e1a6381944491c7f709cbdec6192f2431f8f47bf94939c866539e5869b1b2ada24159b217fb30f117064120c8eab40eea54b7cf5b2ecb862bb9cdbe45c2d6f5a83476ae3c04019a7920120fc98ae704017f0b93a7ea84ef2a0b503ddbceef31fb31b5e57e6b3e782a4622dfd3fc9df59e4d8100fbf9901ec5a18768c2368182a4a6db10d2bbdaf5972ba8c7a57d4d45d6bbfaecdc529522e4dbe852b6cedcb82d7e105e8f8c169537e15bbb87c64270856328af88262b89ac2abe038d9d185d0cf8e03b760a4f08ce02c06ea205bce7c837259f06bce42795e5bfd8aa769175cba15fd29bbced2f39748e5ed992760aa6da6379560b2247976fec08614226d5090ece1daff0013fec33dd9bee160d9eee9d357c9efc859af81944996d7f4f12c56910b96dfc4b1ae7530c259027229a0e6cd8da0f352bc296611d7ae3d83aee6007aa72ff0a6de0e49a4f73eaea9b688162845f28875da97b0968caa39cdb9d64c4440799fde517b63e2836840173054952ecb7a70dcb139cf78261056cc9120bc78adb815380038b1c4c1c7502ab0ec065349a3f44ebc838663f1618c9ba1c22920baee2f8ab97fd4526c7a6ba7f6d69a8a2bd5b0142e63e2fd29c7618c2c902d50de3b0c16cc849acc003c6865460ce81280ab4fc1eeb93aaa21ec2093e3337e05b3755bc2bff3157ab5c292dcdac3b514560b14ac60e08b770f008e4e77217a84a153f2fa246f728317f06470ca31abcc060f00b6eee751a99e38f56b3759e395c2ec58a77e7cca5312077a0f23d3e456ae329f8e1ec54e9f59d21537756b1b1f07b776edd8ea5dea34c84ada1331cb0d6f2b84df6785a36615786985082f7f8a6b8ef52f1111245f5cdda223d6e5e3794e5fd7afdafaa104280337e0bb2db832c004e9ea74f10b95c272ea4361d4bc6f5ed79ee361fbafedc629da0ecfb91f14da9b687b0c569982fe8682b383476a445c67d3929b4b80fa2478ea3b49d9fc73aa58c3567f2271679978ccfc0c511bf596bd5e4bd1ff79fc939bcb9f4f21781098411043a20aa0b48b91bcf55bcf0bea1af34acef1c27c2d3e1b6afef2dc0265e40ac812872faed5ef0f948181fceb303eb8a43ba5f25523f06031bc6ad151dddabd7df2296f91d1f6a9840b3d3651c02c93a467249d01b364302b7a2def68ba64114861ec61eebf353823d043ad72ec40068e2b60b19a1582a817e1048f02578a2933f4cdbfd87029b5329b1c05babf3650d1f7895333100a695fcba41ceb092fc0c539c62960b232ddd83fbefe8b757b1f69f853657493ea5ed23009ace2faa47a6bd0f253c8990f934e7c26a4924bd5628b59a969e56ffea4fdb3fba9aeb0213149cbb4f9cb33ee62bde1ab4330f3a7674264e89d97d131ceade5e11c9de12305602c6c148d7e19fa77457396ca9bd0d7d5816dd46a9e14690f4d3c40843d17489b70b89a655566fd01d3fd3d2dfb559599e2f450b137ef5fad512b98bff6f783ee6b348edcd4163b7ff554e3bd093c5c7bf1a4823a82bb2ae641f24963ad54409f65db3ab094d0605397ca2774204af5bcac834ce0c987c1b5d2afb43f07c461dd64a523030f9329cbc48f6cfbe6a28a41bc8c6ead39fab275f6d6c6e07be9313702f314dd12c1fb3f1d6666d5d05623d9633ae892b9545b96a77f48de349ed3105b714c7cafa8990e1a7e7a135624374dd1b9338fbe2dabc583f8faa4f5e3978b10c2b6ff0218c51fe604267e93757fa3a65d2ce9698e6ac50d1bf3bb7721b54a8395084d20d9a85d774389f867e91650e4699cfb0f2850e0512d2b53efbf5df6ef3a816fdb1829ab32ce3ae96b564d36f415a55721d0b9f5b6277d23f47c1a58669083d77a11c9d543332ca73e261f8046639b07f35bf727ce2ccbf86a15f853350b58cde58992bba4ba79b6d52654bb956093c6d876b1cc18566677da4d281273305e20eeab54dfbc8f9d00f7a36d3addb9f622986936f80a2c74798a9dadd3fc0fa489f9211e32bc7e3b33752249a1911b44d873128b22ecbe95451c8b693ad40f7898f7e5b76e5f09b51a1dd9dd9ca838e4f8c19eeca153f99b57387ae8d7fc71939d7f48ae75296cfc4db6ddab08b4d2cb15b7d69acdf13e2a0e9a6839db390ba9744b421c029a9811c9fea18948eaebaeeb75b9476e3be90fdd162419152cdd6b7f4a099c1a807f55882415f936add29210dbd8f6462be8c7f1949011f62529f98dcfb9766c60d40292f01c6fcab1f5a899bfe4ebe8b60515f6afbe4803ee99e37b976a92891251d28a43d56fca6ce736f1eb6ef94d20b84c53c822edc94a3ccc55de033a852f3da27508b1c81de1cca9f19b46a5909b0ba8bf7c38ddef2179d119ea205a00573c435befe16cbfdc0c315922a24cdcfc789c965297c64017ac0a0ab23e8ed5b47f76f42ab3552e470a4080564fc7b77149b997761f1a4b3b9f15ba22fa1a6da3f7366a7f90df62124ae637573b92a50b3c29870edd96250d310e8e8413e958880d73619840ecc1b8a8c5f6ce7133dae4740d2deba69ad89d4a7b637db48df5f36491793042ecd88605863024db842768acb43d12cd61aedcf8ab7a34957918d4688f2728b02431dee06a28ed6d6b149f714b7f89986ad684991f291459bbd97bbeb1ab73da5475dc75b48b6417a25a9c2836cb4f3d30e433382b6cb78d5b8642c37b8e9a8c02bbc0fac47e84f80cbf555f8e886a1f4e4ed9064884d7ffa8833933d30d13a31f1deb875f86f4a25b7456a96eeaceb44f4dc39620ac3fe1f8a4830a6bc30c584adadada3dd4a612c8941f6b97417411cc1ed2aa41c6bc442b8971bf5efb1998d5110861fb650004d0a33a5ca4522bb6ac7cd904909f206ae15f66314be98d7772ee4bf7185455c867719c3b61bbc753ca3e6b5b4052fb2a71c80dce5ee31fff0380ce786c934f94896c2c344561f8da151eefec62c84784dd38b2c19d32e3d27571ddb4c30b673e6aac7ea59e56455c7bd1084fbe0eaacd23e3c72a4d16e7cf3296bdde8037ba085a5d8e5e12e506be8696b97f0a4cdbdc3ba63ab5a3567f558d287e67ed897d084a66fc9e74ea5f8c3f4c66b5b132d123d81a6bd313fa735a3472776f917ae6c9b2e1ede2dea152277338d60c4c27446f1dd55f338cdd22dc30002c2a4c9bf7d8c82a0dca395062a3cbe6d3d1e67aed0bfd877334f134228221b530aee740a9fd96cdbf2dab8ac178d53a690edb592e5264f05faacc83721d35bb878724a90369b6b339884f53d51583ae7110caaf5790964c7adcc50d6310226b1fee785616ed47ae54b9e89233be47b7c53c7c51d7cf99bf2785d742b1927ae1b46b389c00c9be90def2475d5ef01fb30477b864389172686bf27af83c68ee0811fa03c12d3356b44cb8aed2cbc0e562ac0d7b2da58293b568bda2d73a2cc716f6796583b6f1213654153997e4f9e0fd68b47df65d933d14be7876d66d7a80b45ef1e53a172473b6b70e9d5eee0e4e77fa15c63c8dc21d452dcf9346973d6b539eebf88d1163314aeb180b44fc19e37a155537075e905155001935b2a09d041c4afbf9ebb688e70c0d90867af9f18b005ff0f6765b5e1483e5b9af9faefd12208ed285ab46a19f4f147e0a30aa66b683a84db4942953ca4b65cef720819d1c6b67983c16d78da3b6e649b55a26b69fa307a339139fc51c56fc8eccf3297fddd1fbfcdda60d3906225160091380725673dfa0e508e7407b1a1d6668ab63c6e2f171dbf647abe0e9c0edc231b99c0ccf7ef64206a51aa566e00e6c549104a5139e844d1876b85123aa6f4bb42a643279da16190c272ddd11ab854a6f8420ceff18108646bb2a7fc914cfcb93dc496ced49c72afc97dea4d285ecd09f55797178e7d366931117ce55532a1ded360635f64d3ea1553ee7dbad5945391810927f22c378970c0d26fd0d9662e381bed5d066cf99b4e52660a10c86ca116fdd2fa763c2d4be36871c24b577a12b6e405a49776f691b5e72567c38d0ea5b302fe5c190eb3e3e97f7145dc67bfbed9bc4371747e7d015b528b21c7fcdfd189d0801849950aeb23dd9d727ce524138ce382c02f17f4b5b62923150abfdabd254e96a62ae3acbfd136febed24b693c124ae8b38e18e69bf1dc0835dcaa38891a6b78bef84317d817964d92b97e48ed4dc4a79b1939bc020bde8b58eed6bd72c380fb1872101d08e340f593daa5ad1aed1dfb13734aa0e8f6c6fe6aae8b3c7cbbb17b2a152424c29e3b7c47a7803c4b1ab0536c3f74e3b1b9c103d64c8f1895b48f71fe881bf1d82e9e6c0f9a7da703a7b774dfd72f0293ca25f338cd7a63354bf912b1668","salt":"cfdf1532770a3b27e0329a8fb1053f9d8a226e836192be779e17d41433bf460d","nonce":"f5d61962ead20df2cd138c89","version":"pgpv1:nft","preKey":"","encryptedPassword":{"ciphertext":"7cae72fd38d784c7e200a7e503042876cd9fae923c0614a1d1f66a3008","salt":"7af2cf5b44bbeb31f19559fccbab9890fae5ecc67e0e3a1e0654cb2caadb51e3","nonce":"194fca4778be7d05348d9c04","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"78217c6716dc1f346f7335d5bc7e3c39cd71cfc866fec1ac0daae98af0787909"}}',
  encryptionType: 'pgpv1:nft',
  encryptedPassword: null,
  nftOwner: 'eip155:0x736cd8461132a1b52d95d535230ca4cd4c8bd7e5',
  numMsg: 0,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsYnEMBRF0bsfgWKVNLCgzAqmBRegUlSAWnBgZ45cw1aiWNFu+tjAMMzAP+fr+2f7RYzZuJNi5c6YjTspVpThzHBmOAtjNtR67qieC+9Yzx3Vc0EZzgxnhrOwnjuq54JKsfKKFCuq54Jazx1lODOcGc7CtlyoREWN2XhHihW1LRfKcGY4M5wF/hmz8UljNlSKFWU4M5wZzsKYjVekWLkzZuPOmA1lODOcGc5CihX1PB6ongvvWM8dtS0XynBmODOchefxQPVc+KSeC2o9dpThzHBmOPsD9rc47ZwLW74AAAAASUVORK5CYII=',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRklv0BCACT75kx7wWnXEqbCi9wqV0wVTcw+qMmEcL0gVoov9xu1ZqO\n' +
    '5v/MP4i9O4HyvqiPprI3tZP+7tdGs6l49oOhZfNDJ+fzgwVNbB2h3B7bMv0D\n' +
    'VDEwaqU1vwLZD7REFoCFyG3XQZ1sm+kzeWBU32i1B3gfwDb/k851bZtIl2Xg\n' +
    'E31SmAehMq8ndoxNz4T6emRf3l6f76Cd3tFHzaScYXxEkebATxmfNkt/PAEa\n' +
    'K8ArbkYGwzzIbR6QfIP2DIzeIkL1Cv+dkTNFoU3mmbllL+73VezXy60GhtjJ\n' +
    'dsNONtTxZ80gIYznRsyfXLMAGhmIU6+jU9jC5dI0TUjMSCFEetBeIGi/ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZGSW/QQLCQcICZAPoYjqh/J4mgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBFA32mzi6MqpsczcbA+hiOqH8niaAAD22QgAgpRqs1lCIedY\n' +
    'trMpey7xBbBbMbV3c+XOX0PK720Z2DY3B+rf8WDbOnZwiKhYFO0SEYL8Tjd3\n' +
    '/VmkwgOXeY9fwgAdb1yUAUv95P9C9SOqC6SnMEwumQhbwuf5QpQL2YKV9uCE\n' +
    '/nzVhqZtofoOVZg/d0+oGzh41VIPzg4XRHYVl1m+5WblgT+r80iV3KxPEJ5o\n' +
    '0zTZVDH6O8E4JUxJogzacCg/d8iswOhrph/GwhI5W/vwfoZpVGPxoH5tWSrV\n' +
    'VbHlXC4UczUPbuUdmSUclgxW1slKPm/ZvoG7g1dkiTKT1pePefp/OeyUqOOi\n' +
    'dGaJvwptzSUh5HipNhZJSJLNal5b8s7ATQRkZJb9AQgAv9+bMh0+JFWEg2CB\n' +
    'z7WV6AV37m9Thx5zKmwKrnrJvJ1ksEPkSu+a2TZzulWXIHFQ0R7ZA/I1P/TF\n' +
    'aZU3LeRbo8XE8sUxiDN+QKeUUIVQed69jVEiw6A0qlZ6CCLprYnrMTEcBj1z\n' +
    'n9ORrQEankOSnrBNnvV0FoWapPMpYB05vrzQHzFwSDRnunC8lW3ctnxsOqLV\n' +
    'kX38L4yg7RSFgpvLh9wIEu3jZEbq1NCAa6WWuJ6SiyX8YC5xq/TQUdSG5k2d\n' +
    'mbvhKiKIoqL5RlkRxRNro4zTzC0S7dxDngTnXu2US208k97B9rq+jYZeEajG\n' +
    'DN0OxjjUECwU3w3m1Zd06dLmIQARAQABwsB2BBgBCAAqBYJkZJb9CZAPoYjq\n' +
    'h/J4mgKbDBYhBFA32mzi6MqpsczcbA+hiOqH8niaAADfGgf/SL6CCFj9b6sO\n' +
    'bw08wCT3gddIG174HIMGJ1VUuajaTU4ex5ibuhpumJmRQdx5fykM1k23C676\n' +
    'mXKbXqnmT6Gk2Lu54gl44m+phBbwjyedb9nqTeeuS+2r/cubm+BLH9MQphbF\n' +
    'N8uMxsCJ2tPO9pTsBNFoOSkqVHYcwxtQp5/wkczSqWFvgf9Z8966QOpd/j/i\n' +
    'aopY/oO/fca36wDn1Gh50YZJ0IFLiHtyqNtY+3nfukycmwc9+LXXB33cagmk\n' +
    'ciku7y7o1+i8eLOi4Nu+trK23hx7/W2l3EHPrW4pyrywr1zhTNehLaacb7AB\n' +
    '/3vvjFt8AVCXLJRB5vcwnf4O+CnfLA==\n' +
    '=Ji6t\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  sigType: '0x2422c8b422b5437cd3718823b4bd952c418108f77e0f5d67994d268445ff076d0ca9b73555e642d4ae656af1bff1a7ac87b856181067175541168b7ae492b0c61c',
  signature: 'eip191v2',
  wallets: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  linkedListHash: null,
  nfts: []
}
```

**Version 1.3.x**

```typescript
export interface IUser {
  msgSent: number;
  maxMsgPersisted: number;
  did: string;
  wallets: string;
  profile: {
    name: string | null;
    desc: string | null;
    picture: string | null;
    profileVerificationProof: string | null;
  };
  encryptedPrivateKey: string;
  publicKey: string;
  verificationProof: string;

  /**
   * @deprecated Use `profile.name` instead.
   */
  name: string | null;
  /**
   * @deprecated Use `profile.desc` instead.
   */
  about: string | null;
  /**
   * @deprecated Use `profile.picture` instead.
   */
  profilePicture: string | null;
  /**
   * @deprecated Use `msgSent` instead.
   */
  numMsg: number;
  /**
   * @deprecated Use `maxMsgPersisted` instead.
   */
  allowedNumMsg: number;
  /**
   * @deprecated Use `encryptedPrivateKey.version` instead.
   */
  encryptionType: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  signature: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  sigType: string;
  /**
   * @deprecated Use `encryptedPrivateKey.encryptedPassword` instead.
   */
  encryptedPassword: string | null;
  /**
   * @deprecated
   */
  nftOwner: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  linkedListHash?: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  nfts?: [] | null;
}
```

| Parameter             | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `msgSent`             | number of messages sent by the user                      |
| `maxMsgPersisted`     | number of messages allowed to be sent by the user        |
| `did`                 | user decentralized identity                              |
| `wallets`             | all wallets associated to the did                        |
| `name`                | user name                                                |
| `desc`                | short user description                                   |
| `profilePicture`      | user chat profile picture. As of now i cannot be changed |
| `encryptedPrivateKey` | encrypted private PGP key                                |
| `publicKey`           | PGP public key                                           |
| `verificationProof`   | verification proof                                       |

</details>

---

### **Get user data for chat**

```typescript
const user = await PushAPI.user.get({
  env?: ENV;
  account?: string;
});
```

| Param   | Remarks                            |
| ------- | ---------------------------------- |
| account | Account address                    |
| env     | API env - 'prod', 'staging', 'dev' |

Example request get normal user data:

```typescript
const user = await PushAPI.user.get({
  account: `eip155:${signer.address}`,
  env: ENV.STAGING,
});
```

Example request get NFT user data:

```typescript
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: ENV.STAGING,
});
```

<details>
<summary><b>Expected response (Get Push Chat User)</b></summary>

**Version 1.2.x**

```typescript
export interface IUser {
  did: string;
  wallets: string;
  profilePicture: string | null;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptionType: string;
  signature: string;
  sigType: string;
  about: string | null;
  name: string | null;
  encryptedPassword: string | null;
  nftOwner: string | null;
  numMsg: number;
  allowedNumMsg: number;
  linkedListHash?: string | null;
  nfts?: [] | null;
}
```

| Parameter             | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `did`                 | user decentralized identity                                     |
| `wallets`             | all wallets associated to the did                               |
| `profilePicture`      | user chat profile picture. As of now i cannot be changed        |
| `publicKey`           | PGP public key                                                  |
| `encryptedPrivateKey` | encrypted private PGP key                                       |
| `encryptionType`      | encryption type used to encrypt the private key                 |
| `signature`           | user payload signature used when creating a user                |
| `sigType`             | signature type used when creating a user                        |
| `about`               | short user description                                          |
| `name`                | user name                                                       |
| `encryptedPassword`   | encrypted password used to encrypt the private key for NFT chat |
| `nftOwner`            | NFT owner address                                               |
| `numMsg`              | number of messages sent by the user                             |
| `allowedNumMsg`       | number of messages allowed to be sent by the user               |
| `linkedListHash`      | cid from all messages this user has sent                        |
| `nfts`                | array of NFTs owned by the user                                 |

Example response normal user:

**Version 1.2.x**

```typescript
export interface IUser {
  did: string;
  wallets: string;
  profilePicture: string | null;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptionType: string;
  signature: string;
  sigType: string;
  about: string | null;
  name: string | null;
  encryptedPassword: string | null;
  nftOwner: string | null;
  numMsg: number;
  allowedNumMsg: number;
  linkedListHash?: string | null;
  nfts?: [] | null;
}
```

| Parameter             | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `did`                 | user decentralized identity                                     |
| `wallets`             | all wallets associated to the did                               |
| `profilePicture`      | user chat profile picture. As of now i cannot be changed        |
| `publicKey`           | PGP public key                                                  |
| `encryptedPrivateKey` | encrypted private PGP key                                       |
| `encryptionType`      | encryption type used to encrypt the private key                 |
| `signature`           | user payload signature used when creating a user                |
| `sigType`             | signature type used when creating a user                        |
| `about`               | short user description                                          |
| `name`                | user name                                                       |
| `encryptedPassword`   | encrypted password used to encrypt the private key for NFT chat |
| `nftOwner`            | NFT owner address                                               |
| `numMsg`              | number of messages sent by the user                             |
| `allowedNumMsg`       | number of messages allowed to be sent by the user               |
| `linkedListHash`      | cid from all messages this user has sent                        |
| `nfts`                | array of NFTs owned by the user                                 |

Example response:

```typescript
// PushAPI_user_get | Response - 200 OK
{
  did: 'eip155:0x85e6350861136e65BE141d8DB1eEa25cA346743f',
  wallets: 'eip155:0x85e6350861136e65BE141d8DB1eEa25cA346743f',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRUAu8BCACV4muD50mKJeGPU33ZkTXi7x6eMpjXlmMQbVERQ7MVKvOc\n' +
    'cN+9iz2A18bi73vPYq9FwF/Ibok+A/SuwTbiEe/5E0FXJSnC87DWVF6Aq6At\n' +
    'lzCT4WHYlkHU2h5+JNaD8CXOxe6bsGfzbZ9dSZ9zfs5IoCh6Qf035cjV7wH6\n' +
    'lcGykxvZUIfKiJuwXotkglGzk0317oo37ZXl6f2hCJBg7NdewXGxVKFYu1JS\n' +
    'n5ztzAkoRyiHUnuFDje+HmkU4PjhtrHiFrEeooRyvR/6YCvyIue7f2lIXKV9\n' +
    'rOCyczJyDWTf3wwpklDZVEB0Guv4PHcWsTuN1pqyxgz2bT+umctEvla3ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZFQC7wQLCQcICZAzo8jUDaqidgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBNgrG501gFGxwttFzDOjyNQNqqJ2AACgaQf/Rt33rLH7Ayxb\n' +
    'UED4L7a5f6aw//jk9Y+yqpB3QbwJTSoD02yUqUJ5J9sW46m8k3eQc6ds4OkP\n' +
    'ylaQtoUkumELSuS5hON3Y2IQ78fMvv+My8pQoxD4HzzLj7uVOHaHaElygfoC\n' +
    'pfWSDU2UrJB5TK6noOTspcdB5QlCKh5fU0fDtRQ9OKVTM4NTAmYxsDa3OZO6\n' +
    'DvqfMAK75tlHJr+Xro7GUbKebaJft/guA2ZHpGTHhs2Q+grjQcvljx6BoN3o\n' +
    'NydGwkCorcVZZO7XKr73hPE0VH/LlRqZJ2lcBn/kUJzG1Z1LFYcny+FCrM3U\n' +
    'cCg5eI+Is436jSWBl3bhtdYptNwdNM7ATQRkVALvAQgAt7ghdqho1nII81Vk\n' +
    'BAs2LN3Vb56GyUCTgZjBP+nbIVat6Kjd2H9dmXVhYEbZMFZyjqAdUwFzoJ8p\n' +
    '3Y6qAJxmCktSZ77mzBeojZXi3VesOVfrCzi6MDU+SnN4mguL72YWr6gEbQK5\n' +
    'Ypto4uuEh836Dcf7WCj20fTSRvRSKakmBGwnzP/0Gj7fo8S8OQLwFMMEo7bf\n' +
    '5ExVuB5Is2SEUxWdeXligBMSiajLJo6thlzs0rTsY/ugbz/czulAMDh1MnST\n' +
    'Yol6nHEQUgZFgWx56ARwOn+Y8hJPQqnpWmQie+BakUEabHQjY9sEJ5UDozZ5\n' +
    'GwGVrfgETiNblc0crVnUI7CQKQARAQABwsB2BBgBCAAqBYJkVALvCZAzo8jU\n' +
    'DaqidgKbDBYhBNgrG501gFGxwttFzDOjyNQNqqJ2AACmjwf/eZuqTjk9MIgq\n' +
    'fdlWMM6kLD7W6hScgHIvms9V21Zwy7WQtMrxmQRhCqCHai/eXe/hFABmWxUK\n' +
    'nHbosXKL3DQUapvn2cm40BWseW8Il93oRbSQb7xvFQ3g+mNEiSgn0oWBCTSf\n' +
    'W9HM/3Kowfc34ilvqfquan+ilCID8OzXHHZXx/nxHeVbpARZiHe2ebk1lr6r\n' +
    'KJzq/2S0C65xgn8ShTU1Aewio3+5kr3oHzlTlSnF8Ov5c9VzfEKb+UP7tBMO\n' +
    'b8quBez/BgDetebCxaqy881+/LY535i9xVUNDkMK50jY+JvqW10HeuVXOVxZ\n' +
    'NrSotIw2xObkCFV2WN46DVNt2S541Q==\n' +
    '=Zf86\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  encryptedPrivateKey: '{"ciphertext":"7496a39864b0882212956f02270d8b34ad8fbdcbbcf97d359eb8c95eeba70d8daf810d9874ff8cfff5e7840bef8ee12b82a2c7783c28685035ad81dee5233d37570bc4e57cc2d56ac252a14db2cec9777a73094f3efaead3843f59f0a64efcd4f9ded45edb54c3e933811790eee9c5bc9877f9faadf50fe6436510111cf62f1b3419816bdd80f292326b5f58dd8fb595bafe56970479530de30cfd4b3a9c6ca82554016ce902e0bee2db1f636f8e0bd7b2c6f98157220885b07bc9c213a67de847c97c21fabd40440fdaa911219118b9a0efe2ff34fe78fbe2365963f8e2f0d6e22c12d067614d921eb021cea67d8fc36866efe82401ef124de229f27686b93183cfffa75332821939bfd9b5c2ebddb8b388fcee489d06f9bebbc407b68d2a57dd247b3edf51d14010da4cb8325e392475c68383a4dec063e8d8f84e6d553da2c4f84fe9143b2e212e5a17a436d14431e421a7eac40c9e460f37819831f692e9d14617969ecb2cebe4a934f0d36fb85e9694857cb87ebc7186c420362a2582d641bb1112c1bb32822e161ac1c130841ed69d9cdd7c5683352c51315d87abad1c844c1b46017346642482ede19e6be01f8bed93f29fd1d899bc02e99a4463d37b30f3e682877d1cf266c5a30862f27aa9a044ab90cd4e9d069512d0b22f57240480d71671b7d8d9bf3261eab7cb6c0279f159bd53bec28dd48a9f6433f225cc45c5dbaa7d58f0dc6b0e0e52ae0f197d6e9ba458e47ed8dac43351bf1099ce8e367bb67cd706c1a25f5388af9f6370781ecf2296b148eae9e9f554fc3a9dcaffd53cb9650937f1f5d50a566b314542cf5e0994c99fce26053a794f1b38c480ca6a6f344ba023092ca039f37c74b6fee0d0dde4d5553b192cbcdfa50d733d874483a269069e260394a6cb515e2a7a5e6daf6221fe9f7540845457514d38119d858abdcee09595b9266ae06110726391b652881f07f41988abc9080a6dc1fce8929bac13761ca12c66178a487e1d42b07a128e42c6582999fa0e8d2f47ae079ee46c3b13ac058f58e3f27dcfb22e4a2620785ae317258397bc42d64ce0e02c769c426fcfb5b6d9c7862872f19bf1bfae517e60bf853ecbe269143f67c6b2245cba29335a264b3d94a2f5444223aff7f1dab63ee4846cdda557a9b8041a3edc8d5b1ba23f6e4080129e3c25b3336a3ebaf23de2140f1020d332a472795c6f7ab1a767997c6c9a679a1bbdc34415ca83ea46d818af26ae92a0c05c7e8de2a0d960a92975a2709d25c33d2f980a7e5e5b279c6b8c733241b1447448a4b673f28e45d72409a3929b51d86ff3f2fa1aa07e0b355993d2d14035283a366c4d55fb2172bacebd7a7c3745f4e9aebb6096a2a7bb094e29be60aa206c26cdf5aeda9ba7cd40ea291ab7980020fd3b8a69bd1889cf8a347f327b79b21ce370cb2ca75920fd258704da8d23c8df55ecefa528a37adcc06f37113fccffaa958d13b3435fe81823107bf01274c0ab6912cb1960c0d4c7a4f40e3b23b3c50a65785b12ff8663a31fb1718cc6a4dd2a57c3456ad1743c81743c4366d31d987d016f800502c189a12c55e562cb3fb1c198837aa9a9735d3b7d18ea4ce2936df1e579330d773f3da0f7b733a527d11b68accd1fad3166e61b30594b76d8a1594e4ebd692ed4e54d955778d752a707513a5278502dd0ef64c6474c46df0cbba3c763e6366d005a0580f91f9f3674e06421d6ac3828fa2f79cea6d81686926df8092389e04d3e290ce3fc8d9b885b0df75beb5b6307e4fa6f2c4efe7005ac4f3779a48e290d8afdb98ec82046b2621d9ed09cc59f11cedccdeca85962e6b50f4ec9e512da6f547537e75f254aaefb76cb6981f3ccabb7e3230610aa3a50adfe23e04feb1e0b0dc67e1e9e1570808ae3f029583c25fa5f10f983c285d7b2fe0cd13cdd2a91294adcceb3b57bd6687d2b880d963872ba56b5696d63b8110ce4ef7e3af8c7c091fd65b2ceee3bf206d0c54c1127b051d74779545b344389f843eabe5c9459e421176f912ddb2a31f75dd12c964f01ec0f53d164b92c95f175a900e8a707401d2898141ec52d9c3ea619b71e46fc492b6ae9e524c6da32373d19dfbfe9ee3e2a3898fac7f57cff2b1eabd72ab3f48d6021b996a3fd1015ace78742b969a4754ae5a47d510e98f7c02b6833de4c89e1be31d5448a433e3032eaa0e5ecd8b3a40a89f493415dd8c0ca7d467b3ea2e01e902579206354d7dd7936b1593cbd481eca61dd19c62eaf25737c2a70db08f6cddb7776fc849b5cc1ada596d6b07b24f0cae171a281a70f2c8eeed67c74d4b79fc74facbf40d6f89f4f0a91510463454117f1d99d08aef055605452761daea5f8dd47d7f5b7015bc51ccabce1f64c6cbf564eda011fc3bdb3cf809594fa620b98202fd86c0ca5b083f9e77457cace4cc854c37541c1cd2e2faf41bf003eda90165d7b5646ba1884bd9e75c4941ddca0dc1dbeace314021362237795e9993cb438ab45749516b5d7a91ef2b1aa645cf3a054e04893c5bb9fbb1dc4006b4ee7cb4705521d05500a565598097469d0ac7401cb75a08e185dc316901c666f1ecda5e426f45c87a9692045974c1762b25440bdde119d82ec76d33508d26c7c3058a73995182fe82d56e725643cfb722db7bc7a1b7fe36ac1c2dcea391cb7db048e7bb127950f44347e7aa3010e2b72977774ad5b568acc2fd3381e9a7631d196b4a64fd9a1a65b5831b0bb66d78af49a711b7a1e212fd1869847c71a1db467b24858f16b794ff769452bc8be1f3aff7ad38d317de0c235a51b0d28de7b8d0525e7a2278aeed8e6c7cc0419f5967c86919fff31d02b205226d0c1cc05fe81e9bc3c8196aa813deef424ae01d8d140af04b9295658d1c4f8f4958b321dbe38564476d1c43096eeaea7c2d92c81a8a774a277092db570b1ecfb3f36a63006fef8692029ed409d265718ef988ab86bf5f3bd8cdd9de1ecd25c4ba27d5538416a6b86af4d3a2bd6aa3b43dbcbb8862ec2892a3bb7b173daae9ec9d72666f6a9150dda0ebe5edb6f64cc6cda224506e0712975c30c021e1cf83cfc62ed2801252a1d8d5f82f02772d9bc166cf10757c03384f3842d339b27d270f79079e79404e6d933b17530cc9ff004bce21e2cd271e7d9353aef118f99a93ba226d2e78f07e16b40212b2f48d19c2567d5873af7e49bdfe12a9da702409d1c4d7ced214d1e55259442222d827b590484b8b9706b805c25c7162c0c6c9c5d58efa91a9cb9dc6e87349bc95afa5a04c41d1ce41ad594adcfd93fb7357c32b46f1351291ecee68696843fa849da57ed1e50cec9d46d6b99d0a30e70dae05935960e6254e94dba3c6134fd7eac1ff3bf60567fa2a046772a866104823f2904351c6046fe11df8156791057171f0127ceb23cadd2440b0df7d87e5e3eab477b868e69f3da9e78e1fc02626310be982dc2b78367916932b4e16cf9ab4e8eab25480de37714f6f91141e7858a0c5486b274c017310bea58bc4b9af6552a10e255c50130691430d5dc732196b320475c0ebfd35814e1e18c6d0007cd0d1de40565f539a46a7a0bcc40ca8f633a922f278ee4f23677182d001a24676592d375dea7b7187659099b3955465264d97000445dee10669b286b5651e3d4c908ecfaa98a87362ed4674636fc6c6c61de8dd55c024658170751033f6294361c1add6f759317a3390ffdb0da4343a02f5ae3b63d7b7be60b0a949be10e887aa67cf1def7c408db6b89f3258780b998c8a70ad19e2fff3316933a7658191dbb78e25f73a22d1c9a1010421fb4abf243b7170bc8bd83550902af9388d671d402bd74e10f4b0fa82011f9bf34c4d9ca8728b6e7af7b6a1f7dcb2b28c34d6ac8dd6a23baddf7f22851b65ca2fb7e8f69b5cdc4a13bb36ce197f5ca1adc6c1404472afa8fe0f92cbf139a9745cdff3b325cc0b58f1d4410366ec1d3614e8c93f7dbdde78122d7371b81c66b34a4884058f0c0101bbf9e5081392d6a84b7f01e4636d8998f78df9d3a8519906d3aea09e3d67c919351c431ea3a882efe19c35853f15d1689235d6bc453311d8f8f2be841083b048478e5e04e57adfc0e20d0454e25636b995107e4b4ff587584413a5b75f4b500a4244d2b65fcb4a36aced81773339edb8317d4a6c9c3c71a02312b4d41e19f45f4749d91127a5aa993e98ba3fa99e749419455521dccc90e15603e45640383bd455e90d5724073eef83e6093fa9521bc77f5eb563bf398099433dfd7161c1b3a22a8696263c1ebb1cf1b0bbcbc4272c2632e12607164e3688f1ea88bc63622f57d5531a369921c71ada66f62a2ac7a0d7c7d65d9e052ae1484c7112c6426c2f346c002d05df90af2d40137c2ebc2a5b391e7077b8cba458b3a67d4080b10ad1bf7b73b889815e9f94149b44ed0234fddc9c74ceebb1dec82afc6a197257bc84924d2a831c2affbac3262c77da4a9bf1752ea9c3ca041ec6c49f603c052ec568332fb0fbd3ad7374c9cdb0b5b71889eced082feb6f1dabe91bb9819e663a5625dc24671ec0fb00c3c001bc7dee9a886e08be7f52fad9a13bbd2ef913a02a4f144785991ccfa33bb9bb00d42b5660886416ffd756b8c7d027b7ad8a45b0966770bdefcde889d2b155de4ec2721a1b11e7f582426ea12538f1bab2bfba3e0586f2f2302e38d7c398bf8d0b39c36f1e35dfa5e877d29c7e8bd66bb23d09aa6d5cc3091da7988a4acc5b5feacb2d2adc247668b9d7d9f45e51cb3f315d00ec3e5cf7a6ee68001e054f59933c0befcb22c807c7c5c2ab1f679bd2a9401ba10ef6aeb4dd240ecbb23910b07f3edd7dc45830cf29a36ba0325359c2b4871628b3f6163d132023223981bdf2acc5418f3b25db22b0c2575d5865d877386eea6e2d5b80c759057608ace72fc0c803ac46e7eb2678471458f","salt":"7920d0b688208bd58eab85208237ab1ea06e6ca05a692d291581d7c1aea9aa60","nonce":"c2b1e7da7fd7b1659e52e692","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"3ab0388b3b6772457a82cfb7cc125a2d36cd1e568594d0bbfdaee29d3e07c8ef"}',
  encryptionType: 'eip191-aes256-gcm-hkdf-sha256',
  encryptedPassword: null,
  nftOwner: null,
  signature: '0xaa451b258c31cdff4e4aaffff5df6b48d8de9ddcb7fa31183c745c0295905705637af5ab3bee1484f11a150bb35db4bbb49243f6439d9e357dc0830685fdd72b1b',
  sigType: 'eip191',
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
  about: null,
  name: null,
  numMsg: 0,
  allowedNumMsg: 1000,
  linkedListHash: ''
}
```

Example response NFT user:

```typescript
{
  about: null,
  name: null,
  allowedNumMsg: 1000,
  did: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  encryptedPrivateKey: '{"ciphertext":"833ddc6dfe07e8af7f78991f679ecb5b64d60b1cffc2fed4ecb6287dd04fb27e712c1fd8988b1f15c7b6f30914941f52b316a67b4cc1a8172c7918f00ee333b8a8610cca0320b9593145087a27d4dbd0582043d47538735d087455afacfa3b48b5aa40d82040778f5de3b8bed2c281fa9a381024dc233a92132afd745853a1abb2f305a4eafe7072dc3df405af93ceec52f1b8ce9bb796b5567993ef29e735c7ddcfd8b5b5e7ac6c261b67a76e0c392505777591a98e85f7829796d35efaed030b348b14349539bcd6bd34d4599c7af95db1fb605672d3318737184f92c0d54580abf4be00138f047d8ad69952f368192ab62906dd7f9ef66d1573f9ffdb129bf40c11816057541aefaf8fbee93e80d27e6b09854aef29b8d853bd8b9d994c955400b90e8d4e2b40dd1885ebad81f6c6bf2c41e16039e6a94b8213a501d100ae0b5351198ababe328a8f17480daa70cc0cb65c0f4791903ddb8508f1d304daf64b91f43bbcb489163fb01a6c43815d18e6befbeb78c30be4699366b64b5687335a1f910eb7bb542df5b3fee6f01807656e7b498a55914453dc08c17d89aed5b68d65959959e1a6381944491c7f709cbdec6192f2431f8f47bf94939c866539e5869b1b2ada24159b217fb30f117064120c8eab40eea54b7cf5b2ecb862bb9cdbe45c2d6f5a83476ae3c04019a7920120fc98ae704017f0b93a7ea84ef2a0b503ddbceef31fb31b5e57e6b3e782a4622dfd3fc9df59e4d8100fbf9901ec5a18768c2368182a4a6db10d2bbdaf5972ba8c7a57d4d45d6bbfaecdc529522e4dbe852b6cedcb82d7e105e8f8c169537e15bbb87c64270856328af88262b89ac2abe038d9d185d0cf8e03b760a4f08ce02c06ea205bce7c837259f06bce42795e5bfd8aa769175cba15fd29bbced2f39748e5ed992760aa6da6379560b2247976fec08614226d5090ece1daff0013fec33dd9bee160d9eee9d357c9efc859af81944996d7f4f12c56910b96dfc4b1ae7530c259027229a0e6cd8da0f352bc296611d7ae3d83aee6007aa72ff0a6de0e49a4f73eaea9b688162845f28875da97b0968caa39cdb9d64c4440799fde517b63e2836840173054952ecb7a70dcb139cf78261056cc9120bc78adb815380038b1c4c1c7502ab0ec065349a3f44ebc838663f1618c9ba1c22920baee2f8ab97fd4526c7a6ba7f6d69a8a2bd5b0142e63e2fd29c7618c2c902d50de3b0c16cc849acc003c6865460ce81280ab4fc1eeb93aaa21ec2093e3337e05b3755bc2bff3157ab5c292dcdac3b514560b14ac60e08b770f008e4e77217a84a153f2fa246f728317f06470ca31abcc060f00b6eee751a99e38f56b3759e395c2ec58a77e7cca5312077a0f23d3e456ae329f8e1ec54e9f59d21537756b1b1f07b776edd8ea5dea34c84ada1331cb0d6f2b84df6785a36615786985082f7f8a6b8ef52f1111245f5cdda223d6e5e3794e5fd7afdafaa104280337e0bb2db832c004e9ea74f10b95c272ea4361d4bc6f5ed79ee361fbafedc629da0ecfb91f14da9b687b0c569982fe8682b383476a445c67d3929b4b80fa2478ea3b49d9fc73aa58c3567f2271679978ccfc0c511bf596bd5e4bd1ff79fc939bcb9f4f21781098411043a20aa0b48b91bcf55bcf0bea1af34acef1c27c2d3e1b6afef2dc0265e40ac812872faed5ef0f948181fceb303eb8a43ba5f25523f06031bc6ad151dddabd7df2296f91d1f6a9840b3d3651c02c93a467249d01b364302b7a2def68ba64114861ec61eebf353823d043ad72ec40068e2b60b19a1582a817e1048f02578a2933f4cdbfd87029b5329b1c05babf3650d1f7895333100a695fcba41ceb092fc0c539c62960b232ddd83fbefe8b757b1f69f853657493ea5ed23009ace2faa47a6bd0f253c8990f934e7c26a4924bd5628b59a969e56ffea4fdb3fba9aeb0213149cbb4f9cb33ee62bde1ab4330f3a7674264e89d97d131ceade5e11c9de12305602c6c148d7e19fa77457396ca9bd0d7d5816dd46a9e14690f4d3c40843d17489b70b89a655566fd01d3fd3d2dfb559599e2f450b137ef5fad512b98bff6f783ee6b348edcd4163b7ff554e3bd093c5c7bf1a4823a82bb2ae641f24963ad54409f65db3ab094d0605397ca2774204af5bcac834ce0c987c1b5d2afb43f07c461dd64a523030f9329cbc48f6cfbe6a28a41bc8c6ead39fab275f6d6c6e07be9313702f314dd12c1fb3f1d6666d5d05623d9633ae892b9545b96a77f48de349ed3105b714c7cafa8990e1a7e7a135624374dd1b9338fbe2dabc583f8faa4f5e3978b10c2b6ff0218c51fe604267e93757fa3a65d2ce9698e6ac50d1bf3bb7721b54a8395084d20d9a85d774389f867e91650e4699cfb0f2850e0512d2b53efbf5df6ef3a816fdb1829ab32ce3ae96b564d36f415a55721d0b9f5b6277d23f47c1a58669083d77a11c9d543332ca73e261f8046639b07f35bf727ce2ccbf86a15f853350b58cde58992bba4ba79b6d52654bb956093c6d876b1cc18566677da4d281273305e20eeab54dfbc8f9d00f7a36d3addb9f622986936f80a2c74798a9dadd3fc0fa489f9211e32bc7e3b33752249a1911b44d873128b22ecbe95451c8b693ad40f7898f7e5b76e5f09b51a1dd9dd9ca838e4f8c19eeca153f99b57387ae8d7fc71939d7f48ae75296cfc4db6ddab08b4d2cb15b7d69acdf13e2a0e9a6839db390ba9744b421c029a9811c9fea18948eaebaeeb75b9476e3be90fdd162419152cdd6b7f4a099c1a807f55882415f936add29210dbd8f6462be8c7f1949011f62529f98dcfb9766c60d40292f01c6fcab1f5a899bfe4ebe8b60515f6afbe4803ee99e37b976a92891251d28a43d56fca6ce736f1eb6ef94d20b84c53c822edc94a3ccc55de033a852f3da27508b1c81de1cca9f19b46a5909b0ba8bf7c38ddef2179d119ea205a00573c435befe16cbfdc0c315922a24cdcfc789c965297c64017ac0a0ab23e8ed5b47f76f42ab3552e470a4080564fc7b77149b997761f1a4b3b9f15ba22fa1a6da3f7366a7f90df62124ae637573b92a50b3c29870edd96250d310e8e8413e958880d73619840ecc1b8a8c5f6ce7133dae4740d2deba69ad89d4a7b637db48df5f36491793042ecd88605863024db842768acb43d12cd61aedcf8ab7a34957918d4688f2728b02431dee06a28ed6d6b149f714b7f89986ad684991f291459bbd97bbeb1ab73da5475dc75b48b6417a25a9c2836cb4f3d30e433382b6cb78d5b8642c37b8e9a8c02bbc0fac47e84f80cbf555f8e886a1f4e4ed9064884d7ffa8833933d30d13a31f1deb875f86f4a25b7456a96eeaceb44f4dc39620ac3fe1f8a4830a6bc30c584adadada3dd4a612c8941f6b97417411cc1ed2aa41c6bc442b8971bf5efb1998d5110861fb650004d0a33a5ca4522bb6ac7cd904909f206ae15f66314be98d7772ee4bf7185455c867719c3b61bbc753ca3e6b5b4052fb2a71c80dce5ee31fff0380ce786c934f94896c2c344561f8da151eefec62c84784dd38b2c19d32e3d27571ddb4c30b673e6aac7ea59e56455c7bd1084fbe0eaacd23e3c72a4d16e7cf3296bdde8037ba085a5d8e5e12e506be8696b97f0a4cdbdc3ba63ab5a3567f558d287e67ed897d084a66fc9e74ea5f8c3f4c66b5b132d123d81a6bd313fa735a3472776f917ae6c9b2e1ede2dea152277338d60c4c27446f1dd55f338cdd22dc30002c2a4c9bf7d8c82a0dca395062a3cbe6d3d1e67aed0bfd877334f134228221b530aee740a9fd96cdbf2dab8ac178d53a690edb592e5264f05faacc83721d35bb878724a90369b6b339884f53d51583ae7110caaf5790964c7adcc50d6310226b1fee785616ed47ae54b9e89233be47b7c53c7c51d7cf99bf2785d742b1927ae1b46b389c00c9be90def2475d5ef01fb30477b864389172686bf27af83c68ee0811fa03c12d3356b44cb8aed2cbc0e562ac0d7b2da58293b568bda2d73a2cc716f6796583b6f1213654153997e4f9e0fd68b47df65d933d14be7876d66d7a80b45ef1e53a172473b6b70e9d5eee0e4e77fa15c63c8dc21d452dcf9346973d6b539eebf88d1163314aeb180b44fc19e37a155537075e905155001935b2a09d041c4afbf9ebb688e70c0d90867af9f18b005ff0f6765b5e1483e5b9af9faefd12208ed285ab46a19f4f147e0a30aa66b683a84db4942953ca4b65cef720819d1c6b67983c16d78da3b6e649b55a26b69fa307a339139fc51c56fc8eccf3297fddd1fbfcdda60d3906225160091380725673dfa0e508e7407b1a1d6668ab63c6e2f171dbf647abe0e9c0edc231b99c0ccf7ef64206a51aa566e00e6c549104a5139e844d1876b85123aa6f4bb42a643279da16190c272ddd11ab854a6f8420ceff18108646bb2a7fc914cfcb93dc496ced49c72afc97dea4d285ecd09f55797178e7d366931117ce55532a1ded360635f64d3ea1553ee7dbad5945391810927f22c378970c0d26fd0d9662e381bed5d066cf99b4e52660a10c86ca116fdd2fa763c2d4be36871c24b577a12b6e405a49776f691b5e72567c38d0ea5b302fe5c190eb3e3e97f7145dc67bfbed9bc4371747e7d015b528b21c7fcdfd189d0801849950aeb23dd9d727ce524138ce382c02f17f4b5b62923150abfdabd254e96a62ae3acbfd136febed24b693c124ae8b38e18e69bf1dc0835dcaa38891a6b78bef84317d817964d92b97e48ed4dc4a79b1939bc020bde8b58eed6bd72c380fb1872101d08e340f593daa5ad1aed1dfb13734aa0e8f6c6fe6aae8b3c7cbbb17b2a152424c29e3b7c47a7803c4b1ab0536c3f74e3b1b9c103d64c8f1895b48f71fe881bf1d82e9e6c0f9a7da703a7b774dfd72f0293ca25f338cd7a63354bf912b1668","salt":"cfdf1532770a3b27e0329a8fb1053f9d8a226e836192be779e17d41433bf460d","nonce":"f5d61962ead20df2cd138c89","version":"pgpv1:nft","preKey":"","encryptedPassword":{"ciphertext":"7cae72fd38d784c7e200a7e503042876cd9fae923c0614a1d1f66a3008","salt":"7af2cf5b44bbeb31f19559fccbab9890fae5ecc67e0e3a1e0654cb2caadb51e3","nonce":"194fca4778be7d05348d9c04","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"78217c6716dc1f346f7335d5bc7e3c39cd71cfc866fec1ac0daae98af0787909"}}',
  encryptionType: 'pgpv1:nft',
  encryptedPassword: null,
  nftOwner: 'eip155:0x736cd8461132a1b52d95d535230ca4cd4c8bd7e5',
  numMsg: 0,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsYnEMBRF0bsfgWKVNLCgzAqmBRegUlSAWnBgZ45cw1aiWNFu+tjAMMzAP+fr+2f7RYzZuJNi5c6YjTspVpThzHBmOAtjNtR67qieC+9Yzx3Vc0EZzgxnhrOwnjuq54JKsfKKFCuq54Jazx1lODOcGc7CtlyoREWN2XhHihW1LRfKcGY4M5wF/hmz8UljNlSKFWU4M5wZzsKYjVekWLkzZuPOmA1lODOcGc5CihX1PB6ongvvWM8dtS0XynBmODOchefxQPVc+KSeC2o9dpThzHBmOPsD9rc47ZwLW74AAAAASUVORK5CYII=',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRklv0BCACT75kx7wWnXEqbCi9wqV0wVTcw+qMmEcL0gVoov9xu1ZqO\n' +
    '5v/MP4i9O4HyvqiPprI3tZP+7tdGs6l49oOhZfNDJ+fzgwVNbB2h3B7bMv0D\n' +
    'VDEwaqU1vwLZD7REFoCFyG3XQZ1sm+kzeWBU32i1B3gfwDb/k851bZtIl2Xg\n' +
    'E31SmAehMq8ndoxNz4T6emRf3l6f76Cd3tFHzaScYXxEkebATxmfNkt/PAEa\n' +
    'K8ArbkYGwzzIbR6QfIP2DIzeIkL1Cv+dkTNFoU3mmbllL+73VezXy60GhtjJ\n' +
    'dsNONtTxZ80gIYznRsyfXLMAGhmIU6+jU9jC5dI0TUjMSCFEetBeIGi/ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZGSW/QQLCQcICZAPoYjqh/J4mgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBFA32mzi6MqpsczcbA+hiOqH8niaAAD22QgAgpRqs1lCIedY\n' +
    'trMpey7xBbBbMbV3c+XOX0PK720Z2DY3B+rf8WDbOnZwiKhYFO0SEYL8Tjd3\n' +
    '/VmkwgOXeY9fwgAdb1yUAUv95P9C9SOqC6SnMEwumQhbwuf5QpQL2YKV9uCE\n' +
    '/nzVhqZtofoOVZg/d0+oGzh41VIPzg4XRHYVl1m+5WblgT+r80iV3KxPEJ5o\n' +
    '0zTZVDH6O8E4JUxJogzacCg/d8iswOhrph/GwhI5W/vwfoZpVGPxoH5tWSrV\n' +
    'VbHlXC4UczUPbuUdmSUclgxW1slKPm/ZvoG7g1dkiTKT1pePefp/OeyUqOOi\n' +
    'dGaJvwptzSUh5HipNhZJSJLNal5b8s7ATQRkZJb9AQgAv9+bMh0+JFWEg2CB\n' +
    'z7WV6AV37m9Thx5zKmwKrnrJvJ1ksEPkSu+a2TZzulWXIHFQ0R7ZA/I1P/TF\n' +
    'aZU3LeRbo8XE8sUxiDN+QKeUUIVQed69jVEiw6A0qlZ6CCLprYnrMTEcBj1z\n' +
    'n9ORrQEankOSnrBNnvV0FoWapPMpYB05vrzQHzFwSDRnunC8lW3ctnxsOqLV\n' +
    'kX38L4yg7RSFgpvLh9wIEu3jZEbq1NCAa6WWuJ6SiyX8YC5xq/TQUdSG5k2d\n' +
    'mbvhKiKIoqL5RlkRxRNro4zTzC0S7dxDngTnXu2US208k97B9rq+jYZeEajG\n' +
    'DN0OxjjUECwU3w3m1Zd06dLmIQARAQABwsB2BBgBCAAqBYJkZJb9CZAPoYjq\n' +
    'h/J4mgKbDBYhBFA32mzi6MqpsczcbA+hiOqH8niaAADfGgf/SL6CCFj9b6sO\n' +
    'bw08wCT3gddIG174HIMGJ1VUuajaTU4ex5ibuhpumJmRQdx5fykM1k23C676\n' +
    'mXKbXqnmT6Gk2Lu54gl44m+phBbwjyedb9nqTeeuS+2r/cubm+BLH9MQphbF\n' +
    'N8uMxsCJ2tPO9pTsBNFoOSkqVHYcwxtQp5/wkczSqWFvgf9Z8966QOpd/j/i\n' +
    'aopY/oO/fca36wDn1Gh50YZJ0IFLiHtyqNtY+3nfukycmwc9+LXXB33cagmk\n' +
    'ciku7y7o1+i8eLOi4Nu+trK23hx7/W2l3EHPrW4pyrywr1zhTNehLaacb7AB\n' +
    '/3vvjFt8AVCXLJRB5vcwnf4O+CnfLA==\n' +
    '=Ji6t\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  sigType: '0x2422c8b422b5437cd3718823b4bd952c418108f77e0f5d67994d268445ff076d0ca9b73555e642d4ae656af1bff1a7ac87b856181067175541168b7ae492b0c61c',
  signature: 'eip191v2',
  wallets: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  linkedListHash: null,
  nfts: []
}
```

**Version 1.3.x**

```typescript
export interface IUser {
  msgSent: number;
  maxMsgPersisted: number;
  did: string;
  wallets: string;
  profile: {
    name: string | null;
    desc: string | null;
    picture: string | null;
    profileVerificationProof: string | null;
  };
  encryptedPrivateKey: string;
  publicKey: string;
  verificationProof: string;

  /**
   * @deprecated Use `profile.name` instead.
   */
  name: string | null;
  /**
   * @deprecated Use `profile.desc` instead.
   */
  about: string | null;
  /**
   * @deprecated Use `profile.picture` instead.
   */
  profilePicture: string | null;
  /**
   * @deprecated Use `msgSent` instead.
   */
  numMsg: number;
  /**
   * @deprecated Use `maxMsgPersisted` instead.
   */
  allowedNumMsg: number;
  /**
   * @deprecated Use `encryptedPrivateKey.version` instead.
   */
  encryptionType: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  signature: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  sigType: string;
  /**
   * @deprecated Use `encryptedPrivateKey.encryptedPassword` instead.
   */
  encryptedPassword: string | null;
  /**
   * @deprecated
   */
  nftOwner: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  linkedListHash?: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  nfts?: [] | null;
}
```

| Parameter             | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `msgSent`             | number of messages sent by the user                      |
| `maxMsgPersisted`     | number of messages allowed to be sent by the user        |
| `did`                 | user decentralized identity                              |
| `wallets`             | all wallets associated to the did                        |
| `name`                | user name                                                |
| `desc`                | short user description                                   |
| `picture`             | user chat profile picture. As of now i cannot be changed |
| `encryptedPrivateKey` | encrypted private PGP key                                |
| `publicKey`           | PGP public key                                           |
| `verificationProof`   | verification proof                                       |

</details>

---

### **Decrypting encrypted pgp private key from user data**

```typescript
const response = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: string;
  account?: string;
  signer?: SignerType;
  additionalMeta?: { password?: string };
  env?: ENV;
  toUpgrade?: boolean;
  progressHook?: (progress: ProgressHookType) => void;
})
```

| Parameter                | Type                                   | Description                                              |
| ------------------------ | -------------------------------------- | -------------------------------------------------------- |
| `encryptedPGPPrivateKey` | `string`                               | encrypted pgp private key                                |
| `account`                | `string`                               | user account                                             |
| `signer`                 | `SignerType`                           | ethers.js signer                                         |
| `additionalMeta`         | `{ password?: string }`                | additional meta data                                     |
| `env`                    | `ENV`                                  | environment                                              |
| `toUpgrade`              | `boolean`                              | if true, the user will be upgraded to the latest version |
| `progressHook`           | `(progress: ProgressHookType) => void` | progress hook                                            |

**Example request for normal user:**

```typescript
const user = await PushAPI.user.get({
  account: `eip155:${signer.address}`,
  env: ENV.STAGING,
});

// decrypt the PGP Key
const pgpKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  signer: signer,
});
```

**Example request for NFT user:**

```typescript
// get user and derive encrypted PGP key
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: env as ENV,
});

// decrypt the PGP Key
const pgpKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  signer: nftSigner,
});
```

<details>
  <summary><b>Expected response (Decrypt PGP key of a specific user)</b></summary>

```typescript
// PushAPI_chat_decryptPGPKey | Response - 200 OK
// Dummy PGP Key response below
-----BEGIN PGP PRIVATE KEY BLOCK-----

xcASBGP5FCITBSuBBAAiAwMEjbf6BZTz5QEzR6eiZzTKnh4I0k96UTKlqYuoUIHn
tseu+wX3Iir+3Qx8RUMroIfzW4vPfvRT9Asyiy6lgX7INRva5NmcGF5K/Ajb1FbU
etXLQpI2t7jgCBnwZuPYIuyb/gkDCAc1hVXWhLZqYDdwksEN87qo2VmkTc8anibt
Vr3LzZ9HIE0UzVFw5TJ8edc1PUhuNSvECi6bNC5ikq2U36J9laZIui/w8Ep8Qiap
ThdHWn6irZSct2jM2PTxzXi1/3pyzQ1hc2QgPGFzZGFAYXM+wpwEExMKACQFAmP5
FCICGy8DCwkHAxUKCAIeAQIXgAMWAgECGQEFCQHhM4AACgkQE3CXg+QOmOvYFwF/
SFGt6+1HDB5wgJK0I7U+4KBqrbskKosFIiCu28z/+kH4XNsbfAokUeEHGlR7dbTJ
AX9He9aDN/+HVXDluqbFjtiuOPt0o+rh2q+VqlWoZNSd5KYZf5eooLZ5QCeXTwGv
QqXHpQRj+RQiEwgqhkjOPQMBBwIDBK3/1kmZzkyeFy5uGLnLlHrliqg8S0opzQdL
JO7KJ0i4w7sj8ixIk8MCfTlhdOCn9/GJWpj4zbLmh4LRIi1tBpb+CQMIa3eosFni
UqxguopAXYFt/NoA5UWsyBpt4+FyItaSXuuU1h8iFTRC4yuJ0NIlreuudAlwb36R
cLm19yXJh9npgzxQqKKIAHZZpBRdp0alG8LAJwQYEwoADwUCY/kUIgUJAeEzgAIb
LgBqCRATcJeD5A6Y618gBBkTCgAGBQJj+RQiAAoJEO0UKAv9yVcJ8uUBAOm/XYO2
BaQbFNzhZdJBCm/aaLArNKT/+ub+SkI/Fx3+AP0c0oNutj/+5W8b/Ce+UI8at1L4
CymTBlUIl3R2rnBDTQIgAX40L8DDXoEQyXYAzGjB8HcZe7WX2fjxpGm7aj6H8iMo
kYHdfC/mwoUNY1eV8zfsEnIBfR/yFmf3/QT72X+SBaR4D9dw/D0xjSoAyPhYr93H
F00iYdiGdhT/cniA8ZFpFgkfwMelBGP5FCITCCqGSM49AwEHAgME6yddDDmq0ejZ
jbv/mJ395lGDdQVbkJE2Tv5oT0p3rj/9pEh5KJnh9wgmsSf2+22aY9Z19Rv8Wl/l
m4a9PsaZ0P4JAwjRmhmCO7pFAmC1uwxXLWMyU2+eAHdxO1Ss2qaz/5652ExsUuPI
88ZMOX+xo7utXHRNmNWipLdPaJqNbcWhLzYengHrM7On0y5feOO46AGswsAnBBgT
CgAPBQJj+RQiBQkB4TOAAhsuAGoJEBNwl4PkDpjrXyAEGRMKAAYFAmP5FCIACgkQ
ZbEnxLqhlXrZwwEA494obuihsfgTJGjeWansPkhjCvqPGLLfDwVpyM//fYIA/1oU
yVJsET+iG0vMiNigPywJQR6UiGERCQ+Q3XdrczqSEPsBgPswjBYJtRiFi6adx8Yb
LL+rV4kpBdz22i8fEeHkVQ0VpVFcyCjIso+PnyIDFt52QwGA1Zu1NfUps4ooHhfs
n4FxJNoL/lmuCqhQm4Zgduj3GdYUunMDID3k54J1FPGN+iCj
=OX08
-----END PGP PRIVATE KEY BLOCK-----
```

</details>

---

### **Updating User Profile**

```typescript
const response = await PushAPI.user.profile.update({
  pgpPrivateKey: string;
  account: string;
   profile: {
    name?: string;
    desc?: string;
    picture?: string;
  };
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
})
```

| Parameter       | Type                                                | Description               |
| --------------- | --------------------------------------------------- | ------------------------- |
| `pgpPrivateKey` | `string`                                            | decrypted pgp private key |
| `account`       | `string`                                            | user account              |
| `profile`       | `{name?: string; desc?: string; picture?: string;}` | new profile data          |
| `env`           | `ENV`                                               | environment               |
| `progressHook`  | `(progress: ProgressHookType) => void`              | progress hook             |

**Example request for normal user:**

```typescript
const user = await PushAPI.user.get({
  account: `eip155:${signer.address}`,
  env: ENV.STAGING,
});

// decrypt the PGP Key
const pgpKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  signer: signer,
});

// update user profile
const updateUser = await PushAPI.user.profile.update({
  pgpPrivateKey: pgpKey,
  account: `eip155:${signer.address}`,
  profile: {
    name: 'New Name',
  },
  env: ENV.STAGING,
});
```

**Example request for NFT user:**

```typescript
// get user and derive encrypted PGP key
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: env as ENV,
});

// decrypt the PGP Key
const pgpKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  signer: nftSigner,
});
// update user profile
const updateUser = await PushAPI.user.profile.update({
  pgpPrivateKey: pgpKey,
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  profile: {
    name: 'New Name',
  },
  env: ENV.STAGING,
});
```

<details>
  <summary><b>Expected response (Updating User Profile for a specific user)</b></summary>

```typescript
// PushAPI_user_profile_update | Response - 201 OK
{
  verificationProof: 'eip191:0x9d9b38cdd483e401f1fac315bc2c9c2f9e291be0ec3bff6ce4c3b33ca39ae8430768ae58bfa7bbde8576e26e79e68db852129cb222ebd56c79c50b7965b164d21b',
  msgSent: 35,
  maxMsgPersisted: 100,
  profile : {
    name : 'New Name',
    desc: null,
    picture : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsYnEMBRF0bsfgWKVNLCgzAqmBRegUlSAWnBgZ45cw1aiWNFu+tjAMMzAP+fr+2f7RYzZuJNi5c6YjTspVpThzHBmOAtjNtR67qieC+9Yzx3Vc0EZzgxnhrOwnjuq54JKsfKKFCuq54Jazx1lODOcGc7CtlyoREWN2XhHihW1LRfKcGY4M5wF/hmz8UljNlSKFWU4M5wZzsKYjVekWLkzZuPOmA1lODOcGc5CihX1PB6ongvvWM8dtS0XynBmODOchefxQPVc+KSeC2o9dpThzHBmOPsD9rc47ZwLW74AAAAASUVORK5CYII='
    verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n\nwsBzBAEBCAAnBQJkdvaTCRB4Ndl+kqYWaxYhBLCZHoCE/gPBMl4lJHg12X6S\nphZrAAA6AQf/XuQVgCSl8V0WSSPCUbRjlw/c65nVBZ6ETr32FRaYxWSqo8h0\nTfsUA6G1V2j2G5JylkeH3W+3LBcaurefw7aZtutbS3TO9CuYBiW3UbXdXO+W\nbqV2iNfB/ppQzqlkTmET/baMouRNxkxlKBCuYQkSGvKTi7LQ14RP+ZkuG+Fd\n4DhvCFuhHWpOoWM+17/cCpUJ4nl0nOVO6e1Sp5TVvHvaISWmMRbZ5pTeWfgm\nv0dheNXTFunREXymR7Xrv1gElU8y6k9ChtDAyxo4uVMAEJHqghtqiylRcm36\n/zi3GMG3G3WtSaJkDgJH3Eue+n+4wAp9IcZmVMMC1tNBruGXNWhBBg==\n=SBvb\n-----END PGP SIGNATURE-----\n'
  }
  about: null,
  name: 'New Name',
  allowedNumMsg: 1000,
  did: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  encryptedPrivateKey: '{"ciphertext":"833ddc6dfe07e8af7f78991f679ecb5b64d60b1cffc2fed4ecb6287dd04fb27e712c1fd8988b1f15c7b6f30914941f52b316a67b4cc1a8172c7918f00ee333b8a8610cca0320b9593145087a27d4dbd0582043d47538735d087455afacfa3b48b5aa40d82040778f5de3b8bed2c281fa9a381024dc233a92132afd745853a1abb2f305a4eafe7072dc3df405af93ceec52f1b8ce9bb796b5567993ef29e735c7ddcfd8b5b5e7ac6c261b67a76e0c392505777591a98e85f7829796d35efaed030b348b14349539bcd6bd34d4599c7af95db1fb605672d3318737184f92c0d54580abf4be00138f047d8ad69952f368192ab62906dd7f9ef66d1573f9ffdb129bf40c11816057541aefaf8fbee93e80d27e6b09854aef29b8d853bd8b9d994c955400b90e8d4e2b40dd1885ebad81f6c6bf2c41e16039e6a94b8213a501d100ae0b5351198ababe328a8f17480daa70cc0cb65c0f4791903ddb8508f1d304daf64b91f43bbcb489163fb01a6c43815d18e6befbeb78c30be4699366b64b5687335a1f910eb7bb542df5b3fee6f01807656e7b498a55914453dc08c17d89aed5b68d65959959e1a6381944491c7f709cbdec6192f2431f8f47bf94939c866539e5869b1b2ada24159b217fb30f117064120c8eab40eea54b7cf5b2ecb862bb9cdbe45c2d6f5a83476ae3c04019a7920120fc98ae704017f0b93a7ea84ef2a0b503ddbceef31fb31b5e57e6b3e782a4622dfd3fc9df59e4d8100fbf9901ec5a18768c2368182a4a6db10d2bbdaf5972ba8c7a57d4d45d6bbfaecdc529522e4dbe852b6cedcb82d7e105e8f8c169537e15bbb87c64270856328af88262b89ac2abe038d9d185d0cf8e03b760a4f08ce02c06ea205bce7c837259f06bce42795e5bfd8aa769175cba15fd29bbced2f39748e5ed992760aa6da6379560b2247976fec08614226d5090ece1daff0013fec33dd9bee160d9eee9d357c9efc859af81944996d7f4f12c56910b96dfc4b1ae7530c259027229a0e6cd8da0f352bc296611d7ae3d83aee6007aa72ff0a6de0e49a4f73eaea9b688162845f28875da97b0968caa39cdb9d64c4440799fde517b63e2836840173054952ecb7a70dcb139cf78261056cc9120bc78adb815380038b1c4c1c7502ab0ec065349a3f44ebc838663f1618c9ba1c22920baee2f8ab97fd4526c7a6ba7f6d69a8a2bd5b0142e63e2fd29c7618c2c902d50de3b0c16cc849acc003c6865460ce81280ab4fc1eeb93aaa21ec2093e3337e05b3755bc2bff3157ab5c292dcdac3b514560b14ac60e08b770f008e4e77217a84a153f2fa246f728317f06470ca31abcc060f00b6eee751a99e38f56b3759e395c2ec58a77e7cca5312077a0f23d3e456ae329f8e1ec54e9f59d21537756b1b1f07b776edd8ea5dea34c84ada1331cb0d6f2b84df6785a36615786985082f7f8a6b8ef52f1111245f5cdda223d6e5e3794e5fd7afdafaa104280337e0bb2db832c004e9ea74f10b95c272ea4361d4bc6f5ed79ee361fbafedc629da0ecfb91f14da9b687b0c569982fe8682b383476a445c67d3929b4b80fa2478ea3b49d9fc73aa58c3567f2271679978ccfc0c511bf596bd5e4bd1ff79fc939bcb9f4f21781098411043a20aa0b48b91bcf55bcf0bea1af34acef1c27c2d3e1b6afef2dc0265e40ac812872faed5ef0f948181fceb303eb8a43ba5f25523f06031bc6ad151dddabd7df2296f91d1f6a9840b3d3651c02c93a467249d01b364302b7a2def68ba64114861ec61eebf353823d043ad72ec40068e2b60b19a1582a817e1048f02578a2933f4cdbfd87029b5329b1c05babf3650d1f7895333100a695fcba41ceb092fc0c539c62960b232ddd83fbefe8b757b1f69f853657493ea5ed23009ace2faa47a6bd0f253c8990f934e7c26a4924bd5628b59a969e56ffea4fdb3fba9aeb0213149cbb4f9cb33ee62bde1ab4330f3a7674264e89d97d131ceade5e11c9de12305602c6c148d7e19fa77457396ca9bd0d7d5816dd46a9e14690f4d3c40843d17489b70b89a655566fd01d3fd3d2dfb559599e2f450b137ef5fad512b98bff6f783ee6b348edcd4163b7ff554e3bd093c5c7bf1a4823a82bb2ae641f24963ad54409f65db3ab094d0605397ca2774204af5bcac834ce0c987c1b5d2afb43f07c461dd64a523030f9329cbc48f6cfbe6a28a41bc8c6ead39fab275f6d6c6e07be9313702f314dd12c1fb3f1d6666d5d05623d9633ae892b9545b96a77f48de349ed3105b714c7cafa8990e1a7e7a135624374dd1b9338fbe2dabc583f8faa4f5e3978b10c2b6ff0218c51fe604267e93757fa3a65d2ce9698e6ac50d1bf3bb7721b54a8395084d20d9a85d774389f867e91650e4699cfb0f2850e0512d2b53efbf5df6ef3a816fdb1829ab32ce3ae96b564d36f415a55721d0b9f5b6277d23f47c1a58669083d77a11c9d543332ca73e261f8046639b07f35bf727ce2ccbf86a15f853350b58cde58992bba4ba79b6d52654bb956093c6d876b1cc18566677da4d281273305e20eeab54dfbc8f9d00f7a36d3addb9f622986936f80a2c74798a9dadd3fc0fa489f9211e32bc7e3b33752249a1911b44d873128b22ecbe95451c8b693ad40f7898f7e5b76e5f09b51a1dd9dd9ca838e4f8c19eeca153f99b57387ae8d7fc71939d7f48ae75296cfc4db6ddab08b4d2cb15b7d69acdf13e2a0e9a6839db390ba9744b421c029a9811c9fea18948eaebaeeb75b9476e3be90fdd162419152cdd6b7f4a099c1a807f55882415f936add29210dbd8f6462be8c7f1949011f62529f98dcfb9766c60d40292f01c6fcab1f5a899bfe4ebe8b60515f6afbe4803ee99e37b976a92891251d28a43d56fca6ce736f1eb6ef94d20b84c53c822edc94a3ccc55de033a852f3da27508b1c81de1cca9f19b46a5909b0ba8bf7c38ddef2179d119ea205a00573c435befe16cbfdc0c315922a24cdcfc789c965297c64017ac0a0ab23e8ed5b47f76f42ab3552e470a4080564fc7b77149b997761f1a4b3b9f15ba22fa1a6da3f7366a7f90df62124ae637573b92a50b3c29870edd96250d310e8e8413e958880d73619840ecc1b8a8c5f6ce7133dae4740d2deba69ad89d4a7b637db48df5f36491793042ecd88605863024db842768acb43d12cd61aedcf8ab7a34957918d4688f2728b02431dee06a28ed6d6b149f714b7f89986ad684991f291459bbd97bbeb1ab73da5475dc75b48b6417a25a9c2836cb4f3d30e433382b6cb78d5b8642c37b8e9a8c02bbc0fac47e84f80cbf555f8e886a1f4e4ed9064884d7ffa8833933d30d13a31f1deb875f86f4a25b7456a96eeaceb44f4dc39620ac3fe1f8a4830a6bc30c584adadada3dd4a612c8941f6b97417411cc1ed2aa41c6bc442b8971bf5efb1998d5110861fb650004d0a33a5ca4522bb6ac7cd904909f206ae15f66314be98d7772ee4bf7185455c867719c3b61bbc753ca3e6b5b4052fb2a71c80dce5ee31fff0380ce786c934f94896c2c344561f8da151eefec62c84784dd38b2c19d32e3d27571ddb4c30b673e6aac7ea59e56455c7bd1084fbe0eaacd23e3c72a4d16e7cf3296bdde8037ba085a5d8e5e12e506be8696b97f0a4cdbdc3ba63ab5a3567f558d287e67ed897d084a66fc9e74ea5f8c3f4c66b5b132d123d81a6bd313fa735a3472776f917ae6c9b2e1ede2dea152277338d60c4c27446f1dd55f338cdd22dc30002c2a4c9bf7d8c82a0dca395062a3cbe6d3d1e67aed0bfd877334f134228221b530aee740a9fd96cdbf2dab8ac178d53a690edb592e5264f05faacc83721d35bb878724a90369b6b339884f53d51583ae7110caaf5790964c7adcc50d6310226b1fee785616ed47ae54b9e89233be47b7c53c7c51d7cf99bf2785d742b1927ae1b46b389c00c9be90def2475d5ef01fb30477b864389172686bf27af83c68ee0811fa03c12d3356b44cb8aed2cbc0e562ac0d7b2da58293b568bda2d73a2cc716f6796583b6f1213654153997e4f9e0fd68b47df65d933d14be7876d66d7a80b45ef1e53a172473b6b70e9d5eee0e4e77fa15c63c8dc21d452dcf9346973d6b539eebf88d1163314aeb180b44fc19e37a155537075e905155001935b2a09d041c4afbf9ebb688e70c0d90867af9f18b005ff0f6765b5e1483e5b9af9faefd12208ed285ab46a19f4f147e0a30aa66b683a84db4942953ca4b65cef720819d1c6b67983c16d78da3b6e649b55a26b69fa307a339139fc51c56fc8eccf3297fddd1fbfcdda60d3906225160091380725673dfa0e508e7407b1a1d6668ab63c6e2f171dbf647abe0e9c0edc231b99c0ccf7ef64206a51aa566e00e6c549104a5139e844d1876b85123aa6f4bb42a643279da16190c272ddd11ab854a6f8420ceff18108646bb2a7fc914cfcb93dc496ced49c72afc97dea4d285ecd09f55797178e7d366931117ce55532a1ded360635f64d3ea1553ee7dbad5945391810927f22c378970c0d26fd0d9662e381bed5d066cf99b4e52660a10c86ca116fdd2fa763c2d4be36871c24b577a12b6e405a49776f691b5e72567c38d0ea5b302fe5c190eb3e3e97f7145dc67bfbed9bc4371747e7d015b528b21c7fcdfd189d0801849950aeb23dd9d727ce524138ce382c02f17f4b5b62923150abfdabd254e96a62ae3acbfd136febed24b693c124ae8b38e18e69bf1dc0835dcaa38891a6b78bef84317d817964d92b97e48ed4dc4a79b1939bc020bde8b58eed6bd72c380fb1872101d08e340f593daa5ad1aed1dfb13734aa0e8f6c6fe6aae8b3c7cbbb17b2a152424c29e3b7c47a7803c4b1ab0536c3f74e3b1b9c103d64c8f1895b48f71fe881bf1d82e9e6c0f9a7da703a7b774dfd72f0293ca25f338cd7a63354bf912b1668","salt":"cfdf1532770a3b27e0329a8fb1053f9d8a226e836192be779e17d41433bf460d","nonce":"f5d61962ead20df2cd138c89","version":"pgpv1:nft","preKey":"","encryptedPassword":{"ciphertext":"7cae72fd38d784c7e200a7e503042876cd9fae923c0614a1d1f66a3008","salt":"7af2cf5b44bbeb31f19559fccbab9890fae5ecc67e0e3a1e0654cb2caadb51e3","nonce":"194fca4778be7d05348d9c04","version":"eip191-aes256-gcm-hkdf-sha256","preKey":"78217c6716dc1f346f7335d5bc7e3c39cd71cfc866fec1ac0daae98af0787909"}}',
  encryptionType: 'pgpv1:nft',
  encryptedPassword: null,
  nftOwner: 'eip155:0x736cd8461132a1b52d95d535230ca4cd4c8bd7e5',
  numMsg: 0,
  profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4AcXBsYnEMBRF0bsfgWKVNLCgzAqmBRegUlSAWnBgZ45cw1aiWNFu+tjAMMzAP+fr+2f7RYzZuJNi5c6YjTspVpThzHBmOAtjNtR67qieC+9Yzx3Vc0EZzgxnhrOwnjuq54JKsfKKFCuq54Jazx1lODOcGc7CtlyoREWN2XhHihW1LRfKcGY4M5wF/hmz8UljNlSKFWU4M5wZzsKYjVekWLkzZuPOmA1lODOcGc5CihX1PB6ongvvWM8dtS0XynBmODOchefxQPVc+KSeC2o9dpThzHBmOPsD9rc47ZwLW74AAAAASUVORK5CYII=',
  publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
    '\n' +
    'xsBNBGRklv0BCACT75kx7wWnXEqbCi9wqV0wVTcw+qMmEcL0gVoov9xu1ZqO\n' +
    '5v/MP4i9O4HyvqiPprI3tZP+7tdGs6l49oOhZfNDJ+fzgwVNbB2h3B7bMv0D\n' +
    'VDEwaqU1vwLZD7REFoCFyG3XQZ1sm+kzeWBU32i1B3gfwDb/k851bZtIl2Xg\n' +
    'E31SmAehMq8ndoxNz4T6emRf3l6f76Cd3tFHzaScYXxEkebATxmfNkt/PAEa\n' +
    'K8ArbkYGwzzIbR6QfIP2DIzeIkL1Cv+dkTNFoU3mmbllL+73VezXy60GhtjJ\n' +
    'dsNONtTxZ80gIYznRsyfXLMAGhmIU6+jU9jC5dI0TUjMSCFEetBeIGi/ABEB\n' +
    'AAHNAMLAigQQAQgAPgWCZGSW/QQLCQcICZAPoYjqh/J4mgMVCAoEFgACAQIZ\n' +
    'AQKbAwIeARYhBFA32mzi6MqpsczcbA+hiOqH8niaAAD22QgAgpRqs1lCIedY\n' +
    'trMpey7xBbBbMbV3c+XOX0PK720Z2DY3B+rf8WDbOnZwiKhYFO0SEYL8Tjd3\n' +
    '/VmkwgOXeY9fwgAdb1yUAUv95P9C9SOqC6SnMEwumQhbwuf5QpQL2YKV9uCE\n' +
    '/nzVhqZtofoOVZg/d0+oGzh41VIPzg4XRHYVl1m+5WblgT+r80iV3KxPEJ5o\n' +
    '0zTZVDH6O8E4JUxJogzacCg/d8iswOhrph/GwhI5W/vwfoZpVGPxoH5tWSrV\n' +
    'VbHlXC4UczUPbuUdmSUclgxW1slKPm/ZvoG7g1dkiTKT1pePefp/OeyUqOOi\n' +
    'dGaJvwptzSUh5HipNhZJSJLNal5b8s7ATQRkZJb9AQgAv9+bMh0+JFWEg2CB\n' +
    'z7WV6AV37m9Thx5zKmwKrnrJvJ1ksEPkSu+a2TZzulWXIHFQ0R7ZA/I1P/TF\n' +
    'aZU3LeRbo8XE8sUxiDN+QKeUUIVQed69jVEiw6A0qlZ6CCLprYnrMTEcBj1z\n' +
    'n9ORrQEankOSnrBNnvV0FoWapPMpYB05vrzQHzFwSDRnunC8lW3ctnxsOqLV\n' +
    'kX38L4yg7RSFgpvLh9wIEu3jZEbq1NCAa6WWuJ6SiyX8YC5xq/TQUdSG5k2d\n' +
    'mbvhKiKIoqL5RlkRxRNro4zTzC0S7dxDngTnXu2US208k97B9rq+jYZeEajG\n' +
    'DN0OxjjUECwU3w3m1Zd06dLmIQARAQABwsB2BBgBCAAqBYJkZJb9CZAPoYjq\n' +
    'h/J4mgKbDBYhBFA32mzi6MqpsczcbA+hiOqH8niaAADfGgf/SL6CCFj9b6sO\n' +
    'bw08wCT3gddIG174HIMGJ1VUuajaTU4ex5ibuhpumJmRQdx5fykM1k23C676\n' +
    'mXKbXqnmT6Gk2Lu54gl44m+phBbwjyedb9nqTeeuS+2r/cubm+BLH9MQphbF\n' +
    'N8uMxsCJ2tPO9pTsBNFoOSkqVHYcwxtQp5/wkczSqWFvgf9Z8966QOpd/j/i\n' +
    'aopY/oO/fca36wDn1Gh50YZJ0IFLiHtyqNtY+3nfukycmwc9+LXXB33cagmk\n' +
    'ciku7y7o1+i8eLOi4Nu+trK23hx7/W2l3EHPrW4pyrywr1zhTNehLaacb7AB\n' +
    '/3vvjFt8AVCXLJRB5vcwnf4O+CnfLA==\n' +
    '=Ji6t\n' +
    '-----END PGP PUBLIC KEY BLOCK-----\n',
  sigType: '0x2422c8b422b5437cd3718823b4bd952c418108f77e0f5d67994d268445ff076d0ca9b73555e642d4ae656af1bff1a7ac87b856181067175541168b7ae492b0c61c',
  signature: 'eip191v2',
  wallets: 'nft:eip155:5:0x42af3147f17239341477113484752D5D3dda997B:2:1684313853',
  linkedListHash: null,
  nfts: []
}
```

</details>

---

### **Fetching list of user chats**

```typescript
const chats = await PushAPI.chat.chats({
  account: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  /**
   * Environment variable
   */
  env?: ENV;
});
```

| Param         | Type    | Default | Remarks                                                                |
| ------------- | ------- | ------- | ---------------------------------------------------------------------- |
| account       | string  | -       | user address (Partial CAIP)                                            |
| toDecrypt     | boolean | false   | if "true" the method will return decrypted message content in response |
| pgpPrivateKey | string  | null    | mandatory for users having pgp keys                                    |
| env           | string  | 'prod'  | API env - 'prod', 'staging', 'dev'                                     |

**Example normal user:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  env: ENV.STAGING,
})

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: signer);

// actual api
const chats = await PushAPI.chat.chats({
    account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
    toDecrypt: true,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: ENV.STAGING,
});
```

**Example NFT user:**

```typescript
// Fetch user
const user = await PushAPI.user.get({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  env: env as ENV,
});

// Decrypt PGP Key
const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  signer: nftSigner,
});

// Actual api
const response = await PushAPI.chat.chats({
  account: `nft:eip155:${nftChainId}:${nftContractAddress}:${nftTokenId}`,
  toDecrypt: true,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: env as ENV,
});
```

<details>
  <summary><b>Expected response (Get chats of a specific user)</b></summary>

```typescript
// PushAPI_chat_chats | Response - 200 OK
// Array of chats
[
  {
    chatId: 'dafdc288ccd416c22caa8adfc2c62ee23e83b2e351f60df91531e82fa7ca243e',
    about: null,
    did: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    intent:
      'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7+eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    intentSentBy: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
    intentTimestamp: '2023-05-08T12:56:16.000Z',
    publicKey:
      '{"key":"-----BEGIN PGP PUBLIC KEY BLOCK-----\\n\\nxsBNBGRYo/8BCADhbpiwQf8PEXdi1V2BKfoHs8Vo7dM0FvukAlTGlk/778kV\\neriOXsBmFT3PciLWXRbh5CqsxXmshY030Ugb6h9x2FcgglzsLhJxc8cbCbpk\\nlK3wkZSAJbPX42rX6y2yvLZffdziAddliJFnE0gfV5WD/rxugYP/FIHyGt9y\\njKXuDwNAihp5qQeXaPs+vEqaVhExGUlwWhbBj/EepD8LMc4+inZMTBNxN213\\nnZTSWudaV6mnnrKNjkHTtK3tT6TTHAb5f5Xoz+zTNbMQecktRtF4r27ctRgQ\\nBUEnFkREdQR9vAmJuMmDeh0SKFAE44bNm8moSTHtwSyyjfoL2y7rLmkLABEB\\nAAHNAMLAigQQAQgAPgWCZFij/wQLCQcICZC/GLX8yhr5DwMVCAoEFgACAQIZ\\nAQKbAwIeARYhBIXvLPhJE+agImuJ578YtfzKGvkPAAA8eggAx6GWFsiVU0Jd\\nj3FxkYPwitvF2PdkzPKKLczhj82zNAt4njioYijjpItjw8Wq0cyWtTKfwb0v\\nZ5ty1X0MsOZATsF46PBz0nsBp7BxDutFjgKHQxGwlss+WD6yYqujPUdzmhMO\\n5KYh/McDrGhP939UZhSRhvAH78Id+2EG8Q74KHgAhfcrJvpHf/aBrF1+Gn07\\nSGuZ4GpzqVO7NaQlme1BAAFSZI+EZeCoCODZXJ6gdh1HC1/splLYtcT+FL0/\\nj0VQxVoaVpD5B5AgIQJp1QeFOIcLcFecRLY+RiXkfNJHHbkcCBXGTHuPY5CT\\noIohJfb45Y8wSjcZ3Ec+YOf+00UmP87ATQRkWKP/AQgA2MUK+aUDZE3PFaXG\\n/0H02iqUzu18FmSnPW0TmisHezdzI/LcZwqKapJawxHLsPiGK42xWa2ZBwgh\\n8xyMhspY9jv9u3uDaR/vR6y83+KaUlsSyvpUu0HAapWVIlE79p1/lLld5+Ui\\ny4Ap8VPMSd7sU0TZXGw/s8sBol1Lv1O1wJj0gc17IB1dahMppxnZlnoCtqBA\\nNeFZ8Ssx7+ZAhfvglCqvBo154+4UphqZLoGmGCZWIY3B3NU1EGRjQNnVNaSC\\nuRet3Qi85ni++52k6wR3tJLDqOxFKnYrv93nPENABSuYS8Uc04VvE0hfbjNF\\n6qeo5gah5O68F/xtI6MATZRIAQARAQABwsB2BBgBCAAqBYJkWKP/CZC/GLX8\\nyhr5DwKbDBYhBIXvLPhJE+agImuJ578YtfzKGvkPAAC3zgf+LZ2aNe1nY3au\\n9T57MqhfTMYIEWn/PJ0LAJFg3jgPTmzL4K+ZLSTdWEV7p8aMKrTloYSWENW+\\nuuj+MhMnOC1EonhmqYGHrsFTPdZR902a/mNPnxl8A8r7ixq1OAgq81qYVsQ1\\nQaC8uuJaqCxLediM5lVP95xz1qdKgNhKtG7cPlX8ljAL4KE3U2/Jjj/KiqED\\n0XaMqrt1y2qjjNF+ct+NbmqmwRaOKq8mWpFlPygA9dq6Sp1nCcwvYmxBQrbg\\nmTDldPF6tg7SqF83DN7DnUQt1cNQEUUv8SUiGnS/Dd01nhManNBLNtNpgCCf\\n4etbnA/WK08gsOhSeM3bBOSOjavwmA==\\n=qZBP\\n-----END PGP PUBLIC KEY BLOCK-----\\n","signature":"eip191:0xc56d79a25a832134b0438981f534c1c811bb8d1d1ea6f19b639e4dbc1fb64a4c65be377120dc4402d29b371dc378f00289640b037f6ad9e475fab5781ce067b81c"}',
    profilePicture:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyklEQVR4AcXBoa3DMABF0ZunTFBSVNQBAr1IFdA1AoMNvYiVRQy9QSUPklKX+Cv64J0zfdrz5IKwBEZKLVwhzISZMJv5Q4uJX5mRFhO9x74xIsyEmTCbW0z0HvvGyLGu/EeLiZ4wE2bCbLrf3idGwkyYCbO51EIvLIGRUgsjYQmMlFroCTNhJszmFhO/Mr1SC1eUWuiFJdBrMdETZsJMmE332/ukc6wrI6+cGTnWlZFXzvSEmTATZtOnPU8uaDEx8tg3rhBmwkyYfQE/njNZjYo1IgAAAABJRU5ErkJggg==',
    threadhash: 'bafyreidfnsaz7pz3hsedtlgzj7beqnwj44h3bunpaouwmk4r4i5y5psyti',
    wallets: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    combinedDID:
      'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7_eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
    name: null,
    msg: {
      fromCAIP10: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toCAIP10: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      fromDID: 'eip155:0x1615d2D9ae82D5F0eE79298899962b237386feB7',
      toDID: 'eip155:0x1C48fE875590f8e366447758b13982a3Ca7d9dBE',
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBYJkWKQWCZB7dzg7q3axjBYhBJFuYslzDGbuE+3FMnt3ODur\n' +
        'drGMAAAjtAf/TXjtm2qb6aSikFPKYXm0Ekws+65fisJGf7T48MYkkfcD4t2e\n' +
        'HXd9LtohzGhcztbOQfAND3yME1GWuMBIksq9rlyEA0ezwsGzCJVhBnkAHBe3\n' +
        '+1v4/mNSMmInU8y6sOiLiOcW7ameJvZvDdPDJ0YHhc9dKDCIh1UAZEPAgx+z\n' +
        'Wc0DM6pW8bT70dfgnuW2LlLGF5Z23Z1vbHmeszt78+xYY3ez/hoMHXUIE25z\n' +
        'Wrnt75nasBBahtJ0mwH10ATnsQNE9hTi6XPGYxRSNDM9nyRxTQUpjhNmGS/+\n' +
        '7oFyq8xTcRSaL7d3h8URp9hgFWher5ZZDyMV0jvk+HPguUX54g6Kgw==\n' +
        '=dcRD\n' +
        '-----END PGP SIGNATURE-----\n',
      timestamp: 1683530775648,
      sigType: 'pgp',
      encType: 'pgp',
      encryptedSecret:
        '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMA9aU+JGZVRn/AQgA1pIJHyeJinU21r6At5S5ZaWeN0OEKVB2TjpqZ0IW\n' +
        'lHLKQrQ8k3M16bN+Vf0P+DzDVOL84QRkBD56qSNVHOOCox5wcQeR01CczenV\n' +
        'LUVvVjBzR2hj7Sdw+Q+M//rgeZPPUDbNyiVmGijelhwDqWd7IOoZY26AGXlm\n' +
        '7YQiElvHN2HcYXaTlLAOy36BcccwHu3Tn06F77ZXaf8FnGMWOUy7wh1/jugg\n' +
        'D17jUZGLYbmw+u5l9BOfljbw2pb4vtjWht0I1b4GYlKb+bYg/NY0UNsq7mSh\n' +
        'dGAmOhy5tC2NMjLRRLfD2qasxHoHN50onlB6HcYLl0RCf31ebOgO6rMhUnxt\n' +
        '9cHATAMLWLG2xubrYAEH/2tVeq2j7nJALGSFxjJPboOY57aiFrhXNQ/e/oXH\n' +
        '//TNJgGWx4Ta++OuF2Oexbh9DIZhl6DWld9adXDDtBS/fEyjNsYqwoYlNEJN\n' +
        'kLvSmokNNrE4MKC1A0GkhSh2MGQDNk42GSgz1tep8XSVc98MHqfNXCHVb5Oa\n' +
        'OBeWKLFyElT3+KuZxSkCsnoO5YjuCGbXPyG06tXMHXMTncpj1ri+vpjUSnhD\n' +
        'wn3o0zpNWu0GaWXIgTqj2ZouVwV2S1+wAJQjE8uI1JvBiMhA+X63/GCcApBu\n' +
        'C7rN0Cs5NGXCn9VWp8i1SCp2NuZ38POABwsXUUkjpF24txyUDX8dbXlkzpao\n' +
        'g93SQAElYYmyKbGp1TKhAZl2u40mgf2yCYDv2DLRfAKMJDLvmjXoUGEg2UYO\n' +
        '11w6LD0pIykdKJmFtRls/uMnlcoBgDA=\n' +
        '=kzUH\n' +
        '-----END PGP MESSAGE-----\n',
      link: 'bafyreib34jgnpp573rwquejcq5avxvydis7fbykat6dd5z7uazobucoumm',
    },
    groupInformation: undefined,
  },
];
```

| Parameter        | Type           | Description                                                                                                                     |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| msg              | `IMessageIPFS` | message object                                                                                                                  |
| did              | `string`       | user DID                                                                                                                        |
| wallets          | `string`       | user wallets                                                                                                                    |
| profilePicture   | `string`       | user profile picture                                                                                                            |
| publicKey        | `string`       | user public key                                                                                                                 |
| about            | `string`       | user description                                                                                                                |
| threadhash       | `string`       | cid from the latest message sent on this conversation                                                                           |
| intent           | `string`       | addresses concatenated from the users who have approved the intent                                                              |
| intentSentBy     | `string`       | address of the user who sent the intent                                                                                         |
| intentTimestamp  | `number`       | timestamp of the intent                                                                                                         |
| combinedDID      | `string`       | concatenated addresses of the members of this chat (for DM the 2 addresses and from Group the addresses from all group members) |
| cid              | `string`       | content identifier on IPFS                                                                                                      |
| chatId           | `string`       | chat identifier                                                                                                                 |
| groupInformation | `GroupDTO`     | if group chat, all group information                                                                                            |

</details>

---

### **Fetching list of user chat requests**

```typescript
const chats = await PushAPI.chat.requests({
  account: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  /**
   * Environment variable
   */
  env?: ENV;
});
```

| Param         | Type    | Default | Remarks                                                                |
| ------------- | ------- | ------- | ---------------------------------------------------------------------- |
| account       | string  | -       | user address (Partial CAIP)                                            |
| toDecrypt     | boolean | false   | if "true" the method will return decrypted message content in response |
| pgpPrivateKey | string  | null    | mandatory for users having pgp keys                                    |
| env           | string  | 'prod'  | API env - 'prod', 'staging', 'dev'                                     |

**Example:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: ENV.STAGING);

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const chats = await PushAPI.chat.requests({
    account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
    toDecrypt: true,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: ENV.STAGING,
});
```

<details>
  <summary><b>Expected response (Get chat requests of a specific user)</b></summary>

```typescript
// PushAPI_chat_requests | Response - 200 OK
// Array of chat requests
[
  {
    about: null,
    did: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    intent: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    intentSentBy: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    intentTimestamp: '2023-01-07T03:51:11.000Z',
    publicKey:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
      '\n' +
      'xsBNBGOhhq8BCADP5Nzw0jOXhKO86ndGkY/JlD8AadVXmsLA+Yvoc22LrNTU\n' +
      'QrfcDWaMAzpmtMWJlNEHSTieUPEgODm/qj422+rdskSedum3gq1HWn2bmqEI\n' +
      'LrFc+zR3B70Pe7saEEmC/hXG53/8m7V0HsOuvkEjBa3pW3KElZIhimVvcgYR\n' +
      '9AnLjUYKR/lci1eXXsAz+J+RjgPlFfiIE0/3KYXwkjt9meSJDPCIcEIZ1tqw\n' +
      'IkGRINM5XINMvC+FxPNQ+jIHF9WIzmUg4YfYZQbMo96j4LAV0kYvAB0qI2Y8\n' +
      'DHAjHXYQ+fafRGOJwePASjDHUjcB9QEr1EPIMG3i4iFaBV2ZmePjzE7XABEB\n' +
      'AAHNAMLAigQQAQgAPgUCY6GGrwQLCQcICRCUVlBnqYwnwgMVCAoEFgACAQIZ\n' +
      'AQIbAwIeARYhBPYJKSdUrZzVgB9jy5RWUGepjCfCAABLZAgAtVdxz75k3qFY\n' +
      'qtwMdsrIPX4A7rpT/zCd2Yjl2asFdlkyAusfNdFEiff1dHz5+qBM88z/Zh+O\n' +
      '1FNDKS/WKL9qmZ+AceyidCjnRVTUeH6Mi/ZD/YZInJyLozCksb0Gciswl6Rp\n' +
      'RHb6nXt0PebUFXTsOVxSeodaEGBgltd/V1bDHpfx8Wu03z3h/Jq2tI4s28XA\n' +
      'S2lSZpG8+nC1zLOmpbYx8mdOe00ONBdnMvxAqckd437ns7Tu8sKW4SsRzjg1\n' +
      'YHTmApRjai1L6bHn0P5Utz0BcynzrUn+bZ0cC+5Rq3kZvrjnaJOIutY+ALDF\n' +
      '4yWoVIz8KzzAUx1caVyVvwdFtjVTS87ATQRjoYavAQgA3nCB6WLASwBwp5r/\n' +
      'WU8SiUzf/2srENNObpjxavmv2FVKcKfO0ehSi6ti22KSKnUgm5prlOMWsVl/\n' +
      'wEClvpGw0Btdar4OQI7XdwkY8XUVB5Jff7cNpi4qE+4lIYqCTQief9H5GLC/\n' +
      'QvpE53yZWGFK581OSaeomtibN5xAaUyEE8qITnYyjqA+SgffRFVN5/WOnnBK\n' +
      'zbIHrXl2lXOFkegXaOk+Qxxikw9cSpHNV5YHVoDStRCJZKVU8JhKa7pYKkmC\n' +
      'pSIiXT3IdSAqDiglDRxwX4KlFFhGZ1OGbBmPefN3pZ7/xvaM28TqSDNB7f89\n' +
      '/lc5UKLz5Em2aroEclT0YpKYGQARAQABwsB2BBgBCAAqBQJjoYavCRCUVlBn\n' +
      'qYwnwgIbDBYhBPYJKSdUrZzVgB9jy5RWUGepjCfCAAC6rwgAji6/qPQn/BN/\n' +
      'BbwGBN+A8tWRuQLwrgOilg8oHWkyCIUK7DeBp+gpkSghjsnaEAqc94xaGD3U\n' +
      'AfgcPGmC/Jx92W+bX8P40Iq8OvPgLgvG1u5Rf1a1SNYAuypQemuHYu3HOvUU\n' +
      'vP+0omoiTWyNZVqsZA0FGIYQk9uRg8KGsLvXwzPPLqC5Yo3fyfQUmytBZfEf\n' +
      'OwYwuvzx1RBHtvyZ32sfq//q4t2fXY0d49rg6l475zo3JsZsYtqZJCf9h6uK\n' +
      'MrSFgvn8mJFlpwI1+g7X46VB+t8D1Ac35r9Bn9UIWieIyS2Aux2UwBsY2iET\n' +
      'CdgkH8gWFBU7bdKsFh7BQX2ZhrxHXQ==\n' +
      '=Lr7Q\n' +
      '-----END PGP PUBLIC KEY BLOCK-----\n',
    profilePicture:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBobGEMBSG0W//idlKiKARaohMAzEIzFoEhgaQ1EAV6xCkmn32PpMZZue9e87j9Xx/uKGkSMu6X9whnAlnwlkoKdKy7hdWnTJN+4hVUqRFOBPOhLPH6/n+YAznwl86+hFLOBPOhLNQUsRa+5GW4VxoOfqRlpIilnAmnAlnYd0v/tO6X1jCmXAmnIWSIladMtbRj3xjOBesbt6whDPhTDgLdcrc0c0bLQcXLXXKWMKZcCachW7esOqUsUqKWHXKtBQ2rMpv3bxhCWfCmXD2A590MfREqrg1AAAAAElFTkSuQmCC',
    threadhash: 'bafyreigs26i7k3g5u4xmqg44tecmkfvelclp5lletnikfbsrj7dhg5oi4y',
    wallets: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
    combinedDID:
      'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029_eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
    name: 'copper-screeching-herring',
    msg: {
      link: 'bafyreibuez6o5hqqf6j45ekqxz7ixdtbxs6mhu3m6iv63etja6p2g43qom',
      toDID: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
      encType: 'pgp',
      fromDID: 'eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
      sigType:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBQJjuJ7WCRCszcBmB607ShYhBEWdLV876c+znjS0l6zNwGYH\n' +
        'rTtKAAAEUQgAiSLgvLRf4UM/VIOImO4I/CHt5vBCqvOjq8068K5Bb2ciRn0o\n' +
        '8IqLV2eYKe8c0LK8Gf/CzZn7S13eux4FUlXcX7TlU9BpgHAVQIP4gDe7Q1XN\n' +
        '1+rXFH+QW4P/Zv0knObHAby/7wYfD1ZfBrLbo5SpZEBDYQNYZ5t29y7aVD5e\n' +
        'QMOoSvj5+y6SLDLJalb5daeSfaZtpNBsTZvUBLndNomT///gzrXRutkgW4T4\n' +
        'bDipFPUvLMNvWM1qXJjDyYbyQnr8J8aq3FKoGs4Qs5Z2wcwx9RF54Izh81vd\n' +
        'Y5jkZdpULqxjB4BH2mFGyB9Cp2e5cIpKriY597JCAc6Y6WfhgbIZoA==\n' +
        '=n2B5\n' +
        '-----END PGP SIGNATURE-----\n',
      toCAIP10: 'eip155:0x69e666767Ba3a661369e1e2F572EdE7ADC926029',
      signature:
        '-----BEGIN PGP SIGNATURE-----\n' +
        '\n' +
        'wsBzBAEBCAAnBQJjuJ7WCRCszcBmB607ShYhBEWdLV876c+znjS0l6zNwGYH\n' +
        'rTtKAAAEUQgAiSLgvLRf4UM/VIOImO4I/CHt5vBCqvOjq8068K5Bb2ciRn0o\n' +
        '8IqLV2eYKe8c0LK8Gf/CzZn7S13eux4FUlXcX7TlU9BpgHAVQIP4gDe7Q1XN\n' +
        '1+rXFH+QW4P/Zv0knObHAby/7wYfD1ZfBrLbo5SpZEBDYQNYZ5t29y7aVD5e\n' +
        'QMOoSvj5+y6SLDLJalb5daeSfaZtpNBsTZvUBLndNomT///gzrXRutkgW4T4\n' +
        'bDipFPUvLMNvWM1qXJjDyYbyQnr8J8aq3FKoGs4Qs5Z2wcwx9RF54Izh81vd\n' +
        'Y5jkZdpULqxjB4BH2mFGyB9Cp2e5cIpKriY597JCAc6Y6WfhgbIZoA==\n' +
        '=n2B5\n' +
        '-----END PGP SIGNATURE-----\n',
      timestamp: 1673043671357,
      fromCAIP10: 'eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
      messageType: 'Text',
      messageContent: 'hey',
      encryptedSecret:
        '-----BEGIN PGP MESSAGE-----\n' +
        '\n' +
        'wcBMAzJsNgcerTKoAQgAvzX9pBj4j7ytnwU7DwMsCMl6PUDx6qAQybQxrlby\n' +
        '+xkP1Cf1tOkLj1HP/oFHg3cX5HioM600jAaIYhCr8ib+M3ydvhKnti0mcpbn\n' +
        'VnbWilrzyFUBE7T3eZY54JeFxIQ9mtjl/TmGryXpWD9FHjnSp22NRnbZIcZZ\n' +
        'SHpatgDZYzRhHf9zqusBH2QUDKX1Ty7dIq9JD2AeS55l40IHNMPcP2btxfY1\n' +
        'T7od8WvFYhlWQGtkbm8k42fwdK1mIJ3H/rOSeM8sTliYAECe+IhmpIevg4II\n' +
        'Eel7eG81HjGciWt3Vs3FXkhuEUbQnMRAKfhaqalJNDriaWwzUMMt5a/rWdS1\n' +
        'gMHATAN7roGwZ8OLswEH/2RmDHNAaDi11UT3uLAuQxNzlLeqxFaTPecSFaEW\n' +
        'IFdJ+3ujcy3FHoyndK0S+ucFhP2V0hJRMHyyMiKNKSuUp6Q03NZ7Uqavqku3\n' +
        'kVfAJ3tH6jlUWNetvV8t95OmYInqhC4MNk0nIhdI10bl89KmNRqsfQqKu5Hn\n' +
        '5b9Jy7B+XgjKNdj7iWx0FuFabVIQ3NIDnVBDLy8/mDTeB1HuAv/7KljBr0fC\n' +
        'TtzSZij1Pu5+aIPWaGG2hJvxga9g5Zqfvdm79Wn3gfoOCz3FdXcp/n3732rY\n' +
        '+mrIE0DVUlWa0YbVotcSCzLlUpXlFts85Ok8W/N8ERtBMbbd2+e2tBKAP8Hs\n' +
        'iYHSQAHz9V5LwQaFvujErtV5KZfD5DnB8RlUVJU4JKLDgYiXaP18O0fpsZyO\n' +
        '4fym770psCEPU4sc+flSJ0SxBa8m+yM=\n' +
        '=Cp3M\n' +
        '-----END PGP MESSAGE-----\n',
    },
    groupInformation: undefined,
  },
];
```

| Parameter        | Type           | Description                                                                                                                     |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| msg              | `IMessageIPFS` | message object                                                                                                                  |
| did              | `string`       | user DID                                                                                                                        |
| wallets          | `string`       | user wallets                                                                                                                    |
| profilePicture   | `string`       | user profile picture                                                                                                            |
| publicKey        | `string`       | user public key                                                                                                                 |
| about            | `string`       | user description                                                                                                                |
| threadhash       | `string`       | cid from the latest message sent on this conversation                                                                           |
| intent           | `string`       | addresses concatenated from the users who have approved the intent                                                              |
| intentSentBy     | `string`       | address of the user who sent the intent                                                                                         |
| intentTimestamp  | `number`       | timestamp of the intent                                                                                                         |
| combinedDID      | `string`       | concatenated addresses of the members of this chat (for DM the 2 addresses and from Group the addresses from all group members) |
| cid              | `string`       | content identifier on IPFS                                                                                                      |
| chatId           | `string`       | chat identifier                                                                                                                 |
| groupInformation | `GroupDTO`     | if group chat, all group information                                                                                            |

</details>

---

### **Fetching conversation hash between two users**

```typescript
const conversationHash = await PushAPI.chat.conversationHash({
  conversationId: string;
  /**
   * Environment variable
  */
  account: string;
  env?: ENV;
});
```

| Param          | Type   | Default | Remarks                                                |
| -------------- | ------ | ------- | ------------------------------------------------------ |
| account        | string | -       | user address                                           |
| conversationId | string | -       | receiver's address (partial CAIP) or chatId of a group |
| env            | string | 'prod'  | API env - 'prod', 'staging', 'dev'                     |

**Example:**

```typescript
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: ENV.STAGING,
});
```

<details>
  <summary><b>Expected response (Get conversation hash between two users)</b></summary>

```typescript
// PushAPI_chat_conversationHash | Response - 200 OK
{
  threadHash: 'bafyreign2egu7so7lf3gdicehyqjvghzmwn5gokh4fmp4oy3vjwrjk2rjy';
}
```

| Param      | Type   | Default | Remarks                    |
| ---------- | ------ | ------- | -------------------------- |
| threadHash | string | -       | message content identifier |

</details>

---

### **Fetching latest chat between two users**

```typescript
const chatHistory = await PushAPI.chat.latest({
  threadhash: string;
  toDecrypt?: boolean;
  pgpPrivateKey?: string;
  account: string;
  env?: ENV;
});
```

| Param         | Type    | Remarks                                   |
| ------------- | ------- | ----------------------------------------- |
| threadHash    | string  | message content identifier                |
| toDecrypt     | boolean | true if you want messages to be decrypted |
| pgpPrivateKey | string  | PGP Private Key                           |
| account       | string  | user account                              |
| env           | ENV     | environment variable                      |

**Example:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: 'staging'
});

// actual api
const chatHistory = await PushAPI.chat.latest({
  threadhash: conversationHash.threadHash,
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  toDecrypt: true,
  pgpPrivateKey: decryptedPvtKey,
  env: 'staging',
});
```

<details>
  <summary><b>Expected response (Get latest chat between two users)</b></summary>

```typescript
// PushAPI_chat_latest | Response - 200 OK
[
  {
    link: 'bafyreibfikschwlfi275hr7lrfqgj73mf6absailazh4sm5fwihspy2ky4',
    toDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    encType: 'pgp',
    fromDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    sigType: 'pgp',
    toCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    signature:
      '-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBQJjh5tjCRBaJmgmByp5FRYhBJC23yBJT2d/pTAID1omaCYH\n' +
      'KnkVAAAZmwf/buPLw6caSZmYnw6D3/p6HF1kWlkGUOTP4RasaU/6dkeDaZs9\n' +
      'SJlz2wC8oOpBGWHMJ/5n3ZWmU71E6U7IKIY793MyIv5t32vTNkwsRHUX7IIn\n' +
      'QFF+FzTIEtHHVTRlnkqNR2YUk1kqcpZCZWHfahi5W2d/WkXlFNdvyyFH4W8L\n' +
      'd03FGhOyXbWwU3xicBz5mSBpIFaaSCXl1SdgJDPXLSk3b65EEOjCOaiz85xC\n' +
      'G+6SW4RUzCGSDcOd9F2EXvvY5H9LgQNi1jjlZn6JrPTPJTJ+wXZXzcZmtOXG\n' +
      'EKcwvPbbPY9wd+gavRSOgYLYn5xoZQW/o3hW7AQlbC5Kj6js48Z0HQ==\n' +
      '=qLiJ\n' +
      '-----END PGP SIGNATURE-----\n',
    timestamp: 1669831523684,
    fromCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    messageType: 'Text',
    messageContent: 'Hi',
    encryptedSecret:
      '-----BEGIN PGP MESSAGE-----\n' +
      '\n' +
      'wcBMA1fn1CNqxQ7nAQgArlo75qe54WerfRKFv1+F9j4NRMvSTgUztvIe51eg\n' +
      'd5MVuj6RYxKERr2bTuBt5cMDJMlNuTnBBkPe4L8+SlsI46L9wmXV9xLoZq1a\n' +
      '94JdxD98RGMF99Jde/3hC/X6GS1yVqPpKPKdWx/tkOPeyqeO/wFF7kqShgIi\n' +
      'Wgq6hGz1fzD3GZhKGY0VSLuC3s0aUy/qw5En1Xd0uX0jdXBl07IIj8p1G2zx\n' +
      '9BuVlksSK34yvIc0RQfCeRadMHkxbA0Hyj31Wrr+Y310YLTppL0s5bQR9APL\n' +
      'WHsIztJ1fHTnXsPhnA7YG0SQpHTyJhuX3rgBjxGrvbZBArmZ+R/Pq9IkOkJe\n' +
      'z8HATAMOsbaZjGN5JwEH/jYjLN6AFRWeaB5CSBSAF+CvHsUgadGmxTdSHBM6\n' +
      'LM9rfGg/MCnpRBuHckA0NNZh+wepq6TDA54ZopsdP14gHj4MKCdfqZr86Jft\n' +
      'ldtjeSgPTFEEJxPMJ4/Z3UeFU9rvOgfxX6l0eHWS0MYwJ3sVYvSyqqHir1K5\n' +
      'TRdEIgtQ3NvLTKkX4bKTSU+SInrvDA+wsc2BcBsbgNhRiGb+XYrbqXBshL1a\n' +
      'lIdpnomkAQgOZMO2n347uURYoruH3OtFeNABJ9D/nEU+LdhDOPGZPefvPBc5\n' +
      'BxK4ExKZ2Wo/TZw8lgC53uqOljsGV63Hp71LkyesKWu5/+vdVrYx/vU63shh\n' +
      'x/TSQAEiaFYEfkWSOthtH0nrJHhkY7FWgjp/1bj/J4J9HCQrVtt2WlQfhowZ\n' +
      'ILxhKk/vep0sJviM3SfJ4hPtoYpZESc=\n' +
      '=43Ta\n' +
      '-----END PGP MESSAGE-----\n',
  },
];
```

| Param             | Type   | Remarks                                     |
| ----------------- | ------ | ------------------------------------------- |
| `fromCAIP10`      | string | sender address                              |
| `toCAIP10`        | string | receiver address                            |
| `fromDID`         | string | sender did                                  |
| `toDID`           | string | receiver did                                |
| `messageType`     | string | message type                                |
| `messageContent`  | string | message content                             |
| `signature`       | string | signature of the message                    |
| `sigType`         | string | signature type                              |
| `link`            | string | content identifier of the previous messages |
| `timestamp`       | number | timestamp of the message                    |
| `encType`         | string | encryption type                             |
| `encryptedSecret` | string | encrypted secret                            |

</details>

---

### **Fetching chat history between two users**

```typescript
const chatHistory = await PushAPI.chat.history({
  account: string;
  env: ENV;
  threadhash: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  limit?: number;
});
```

| Param         | Type    | Default | Remarks                                                                |
| ------------- | ------- | ------- | ---------------------------------------------------------------------- |
| account       | string  | -       | user address                                                           |
| threadhash    | string  | -       | conversation hash between two users                                    |
| toDecrypt     | boolean | false   | if "true" the method will return decrypted message content in response |
| limit         | number  | 10      | number of messages between two users                                   |
| pgpPrivateKey | string  | null    | mandatory for users having pgp keys                                    |
| env           | ENV     | 'prod'  | API env - 'prod', 'staging', 'dev'                                     |

**Example:**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// get threadhash, this will fetch the latest conversation hash
// you can also use older conversation hash (called link) by iterating over to fetch more historical messages
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: 'staging'
});

// actual api
const chatHistory = await PushAPI.chat.history({
  threadhash: conversationHash.threadHash,
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  limit: 2,
  toDecrypt: true,
  pgpPrivateKey: pgpDecryptedPvtKey,
  env: 'staging',
});
```

<details>
  <summary><b>Expected response (Get chat history between two users)</b></summary>

```typescript
// PushAPI_chat_history | Response - 200 OK
[
  {
    link: 'bafyreibfikschwlfi275hr7lrfqgj73mf6absailazh4sm5fwihspy2ky4',
    toDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    encType: 'pgp',
    fromDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    sigType: 'pgp',
    toCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    signature:
      '-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBQJjh5tjCRBaJmgmByp5FRYhBJC23yBJT2d/pTAID1omaCYH\n' +
      'KnkVAAAZmwf/buPLw6caSZmYnw6D3/p6HF1kWlkGUOTP4RasaU/6dkeDaZs9\n' +
      'SJlz2wC8oOpBGWHMJ/5n3ZWmU71E6U7IKIY793MyIv5t32vTNkwsRHUX7IIn\n' +
      'QFF+FzTIEtHHVTRlnkqNR2YUk1kqcpZCZWHfahi5W2d/WkXlFNdvyyFH4W8L\n' +
      'd03FGhOyXbWwU3xicBz5mSBpIFaaSCXl1SdgJDPXLSk3b65EEOjCOaiz85xC\n' +
      'G+6SW4RUzCGSDcOd9F2EXvvY5H9LgQNi1jjlZn6JrPTPJTJ+wXZXzcZmtOXG\n' +
      'EKcwvPbbPY9wd+gavRSOgYLYn5xoZQW/o3hW7AQlbC5Kj6js48Z0HQ==\n' +
      '=qLiJ\n' +
      '-----END PGP SIGNATURE-----\n',
    timestamp: 1669831523684,
    fromCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    messageType: 'Text',
    messageContent: 'Hi',
    encryptedSecret:
      '-----BEGIN PGP MESSAGE-----\n' +
      '\n' +
      'wcBMA1fn1CNqxQ7nAQgArlo75qe54WerfRKFv1+F9j4NRMvSTgUztvIe51eg\n' +
      'd5MVuj6RYxKERr2bTuBt5cMDJMlNuTnBBkPe4L8+SlsI46L9wmXV9xLoZq1a\n' +
      '94JdxD98RGMF99Jde/3hC/X6GS1yVqPpKPKdWx/tkOPeyqeO/wFF7kqShgIi\n' +
      'Wgq6hGz1fzD3GZhKGY0VSLuC3s0aUy/qw5En1Xd0uX0jdXBl07IIj8p1G2zx\n' +
      '9BuVlksSK34yvIc0RQfCeRadMHkxbA0Hyj31Wrr+Y310YLTppL0s5bQR9APL\n' +
      'WHsIztJ1fHTnXsPhnA7YG0SQpHTyJhuX3rgBjxGrvbZBArmZ+R/Pq9IkOkJe\n' +
      'z8HATAMOsbaZjGN5JwEH/jYjLN6AFRWeaB5CSBSAF+CvHsUgadGmxTdSHBM6\n' +
      'LM9rfGg/MCnpRBuHckA0NNZh+wepq6TDA54ZopsdP14gHj4MKCdfqZr86Jft\n' +
      'ldtjeSgPTFEEJxPMJ4/Z3UeFU9rvOgfxX6l0eHWS0MYwJ3sVYvSyqqHir1K5\n' +
      'TRdEIgtQ3NvLTKkX4bKTSU+SInrvDA+wsc2BcBsbgNhRiGb+XYrbqXBshL1a\n' +
      'lIdpnomkAQgOZMO2n347uURYoruH3OtFeNABJ9D/nEU+LdhDOPGZPefvPBc5\n' +
      'BxK4ExKZ2Wo/TZw8lgC53uqOljsGV63Hp71LkyesKWu5/+vdVrYx/vU63shh\n' +
      'x/TSQAEiaFYEfkWSOthtH0nrJHhkY7FWgjp/1bj/J4J9HCQrVtt2WlQfhowZ\n' +
      'ILxhKk/vep0sJviM3SfJ4hPtoYpZESc=\n' +
      '=43Ta\n' +
      '-----END PGP MESSAGE-----\n',
  },
  {
    link: null,
    toDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    encType: 'PlainText',
    fromDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    sigType: '',
    toCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    signature: '',
    timestamp: 1669831499724,
    fromCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    messageType: 'Text',
    messageContent: 'Hey Fabio!',
    encryptedSecret: '',
  },
];
```

| Param             | Type   | Remarks                                     |
| ----------------- | ------ | ------------------------------------------- |
| `fromCAIP10`      | string | sender address                              |
| `toCAIP10`        | string | receiver address                            |
| `fromDID`         | string | sender did                                  |
| `toDID`           | string | receiver did                                |
| `messageType`     | string | message type                                |
| `messageContent`  | string | message content                             |
| `signature`       | string | signature of the message                    |
| `sigType`         | string | signature type                              |
| `link`            | string | content identifier of the previous messages |
| `timestamp`       | number | timestamp of the message                    |
| `encType`         | string | encryption type                             |
| `encryptedSecret` | string | encrypted secret                            |

</details>

---

### **To send a message**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
// sending Text message
const response = await PushAPI.chat.send({
  messageObj: {
    content: "Gm gm! It's me... Mario"
  },
  messageType: 'Text', // can be "Text" | "Image" | "File" | "MediaEmbed" | "Meta"
  receiverAddress: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
  signer: _signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: 'staging',
});

// sending File message
const response = await PushAPI.chat.send({
  messageObj: {
    content: "{\"content\":\"data:application/pdf;base64,JVBERi0xLjQKJ}"
  },
  messageType: 'File', // can be "Text" | "Image" | "File" | "MediaEmbed" | "Meta"
  receiverAddress: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
  signer: _signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: 'staging',
});

// sending Meta Message
// Note - Meta messages are only allowed in Groups and only from admins
const response = await PushAPI.chat.send({
  messageObj: {
    content: "Alice.eth create the grp 'xyz'",
    meta: {
      action: META_ACTION.CREATE_GROUP
      info: { // any added info that is not visible but can be programmatically understoodaffected: [] // address[] that are affected by meta action
			}
    }
  }
  messageType: 'Meta', // can be "Text" | "Image" | "File" | "MediaEmbed" | "Meta"
  receiverAddress: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
  signer: _signer,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: 'staging',
});

```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| messageObj | `{ content : string; meta?: META_MESSAGE_META; }` | - | message to be sent |
| messageContent | string | '' | ( DEPRECATED ) message to be sent |
| messageType | 'Text' &#124; 'Image' &#124; 'File' &#124; 'MediaEmbed' &#124; 'Meta' | 'Text'| type of messageContent |
| receiverAddress_ | string | - | user address or group chat id (Partial CAIP) |
| signer\* | - | - | signer object |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (send chat message or chat request to a wallet)</b></summary>

```typescript
// PushAPI_chat_send | Response - 200 OK
{
  fromCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  toCAIP10: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  fromDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  toDID: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  messageObj: {
    content: "Gm gm! It's me... Mario",
  },
  messageContent: "Gm gm! It's me... Mario",
  messageType: 'Text',
  signature: '',
  timestamp: 1677290956187,
  sigType: 'pgp',
  encType: 'PlainText',
  encryptedSecret: '',
  link: 'bafyreigcgszt6nvrkh2qitl3ppstlnl5jf246gj6udhiomkhjnfijsmb7m',
  cid: 'bafyreih6ji4iwntsv6d6bqxggkdzubtvmhcy5hz2f6hda2ac2yf35hh63q'
}

```

</details>

---

### **To approve a chat request**

```typescript
const response = await PushAPI.chat.approve({
  status: 'Approved',
  account: '0x18C0Ab0809589c423Ac9eb42897258757b6b3d3d',
  senderAddress: '0x873a538254f8162377296326BB3eDDbA7d00F8E9', // receiver's address or chatId of a group
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| status | 'Approved' | 'Approved' | flag for approving and rejecting chat request, supports only approving for now|
| senderAddress_ | string | - | chat request sender's address or chatId of a group |
| signer\* | - | - | signer object |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (approve chat request for a wallet / group chat id)</b></summary>

```typescript
// PushAPI_chat_approve | Response - 204 OK
```

</details>

---

### **To create a group**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.createGroup({
  groupName:'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  members: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  groupImage: &lt;group image link&gt; ,
  admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  isPublic: true,
  account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
  env: 'staging',
  pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

### **To create a token gated group**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.createGroup({
  groupName:'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  members: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  groupImage: &lt;group image link&gt; ,
  admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
  rules: {
    'entry': {
      'conditions': [
        {
          'any': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'token_holder',
              'data': {
                'address': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'PUSH',
              'category': 'ERC721',
              'subcategory': 'nft_owner',
              'data': {
                'address': 'eip155:5:0x42af3147f17239341477113484752D5D3dda997B',
                'amount': 1
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            }
          ]
        }
      ]
    },
    'chat': {
      'conditions': [
        {
          'all': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'token_holder',
              'data': {
                'address': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            }
          ]
        }
      ]
    }
  },
  isPublic: true,
  account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
  env: 'staging',
  pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| account_ | string | - | user address |
| groupName* | string | - | group name |
| groupDescription* | string | - | group description |
| groupImage* | string | - | group image link |
| members* | Array<string> | - | wallet addresses of all members except admins and groupCreator |
| admins* | Array<string> | - | wallet addresses of all admins except members and groupCreator |
| isPublic* | boolean | - | true for public group, false for private group |
| contractAddressERC20 (deprecated) | string | null | ERC20 Contract Address |
| numberOfERC20 (deprecated) | int | 0 | Minimum number of tokens required to join the group |
| contractAddressNFT (deprecated) | string | null | NFT Contract Address |
| numberOfNFTTokens (deprecated) | int | 0 | Minimum number of nfts required to join the group |
| rules | Rules | - | conditions for group and chat access (see format below) |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

#### **Rules format**

```typescript
export enum ConditionType {
  PUSH = 'PUSH',
  GUILD = 'GUILD',
}

export type Data = {
  contract?: string;
  amount?: number;
  decimals?: number;
  guildId?: string;
  guildRoleId?: string;
  guildRoleAction?: 'all' | 'any';
  url?: string;
  comparison?: '>' | '<' | '>=' | '<=' | '==' | '!=';
};

export type ConditionBase = {
  type?: ConditionType;
  category?: string;
  subcategory?: string;
  data?: Data;
  access?: Boolean;
};

export type Condition = ConditionBase & {
  any?: ConditionBase[];
  all?: ConditionBase[];
};

export interface Rules {
  entry?: {
    conditions: Array<Condition | ConditionBase>;
  };
  chat?: {
    conditions: Array<Condition | ConditionBase>;
  };
}
```

#### Rules Object Description

The rules object consists of two main sections: `entry` and `chat`, both of which contain conditions to manage access and permissions within a chat application. These conditions may involve different criteria related to token holdings or guild membership.

#### Conditions

Conditions can be either an "any" or "all" logic structure. If a condition has an "any" property, it means that only one of the nested conditions needs to be met. If a condition has an "all" property, it means that all the nested conditions must be satisfied.

#### Types

There are two main types of conditions: `PUSH` and `GUILD`.

#### PUSH Conditions

PUSH conditions may relate to:

- **ERC721**: Needs an address and an amount, and can only have the `owner` subcategory.
- **ERC20**: Needs an address, an amount, and a decimals value. It can only have the `holder` subcategory.
- **CustomEndpoint**: The `CustomEndpoint` provides a flexible way to validate a condition based on the response from a custom API endpoint. This is particularly useful when you want to incorporate data or validation logic that is external to your main application. As of now the Get API is supported and should return the 200 OK if the user is allowed to access.
  <pre>
    {
      "type": "PUSH",
      "category": "CustomEndpoint",
      "subcategory": "GET",
      "data": {
        "url": "https://api.example.com/user/{{user_address}}/validate"
      }
    }
  </pre>

  Explanation:

- **_type_**: Represents the type of the condition, in this case "PUSH".
- **_category_**: Specifies that this is a condition based on a custom endpoint.
- **_subcategory_**: Represents the HTTP method for the request, in this case, a "GET" request.
- **_data_**: Contains the properties for the condition.
- **_url_**: The endpoint URL with a placeholder ({{user_address}}) which will be replaced with the actual user address when the condition is being evaluated.

#### GUILD Conditions

Sample GUILD condition schema

<pre>
{
	"type": "GUILD",
	"category": "guildRoles",
	"subcategory": <Role Type>,
	"data": {
		"guildId": <Guild ID>,
		"guildRoleId": <Specific Role ID>
	}
}
</pre>

- **Working**:

Fields:
type:
Always set to: "GUILD"
category:
Always set to: "guildRoles"
subcategory:
Role type classification.
Values:
specificRole: For a singular role.
allRoles: Pertaining to all roles in the guild.
anyRole: Referring to any role within the guild.
data:
guildId: Unique identifier of a guild.
guildRoleId: Role ID within the guild. (Required only for the specificRole subcategory.)
Usage:
This structure governs user permissions within a guild. The subcategory dictates the manner of role-based operations, from checking permissions of a single role (specificRole) to broad checks across any or all roles (anyRole, allRoles).

<details>
  <summary><b>Expected response (create group)</b></summary>

```typescript
// PushAPI_chat_createGroup | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHmnwBCACaJgURQRJ4uP9St06i8nw9betHTTCvSvvWTkqJQvsnT1oh\n' +
        'm1fV+wv5q7i3uQQqJV1Ip8hSC5YOANnjQM+5CxXi5g8k3se5joMawDCkC/MP\n' +
        'fwidmsVPEZwKmLPf4ZDMJqmzAscfyLgHVnT7sG23LQD8pTVQkgsWRReA8cTJ\n' +
        'pof6YgGF9YxQGvgTyBZGA9ocswXUdtgm5qHhaQL0+FxnniZCN7HIMJ5XKMBQ\n' +
        'GlMik23wL4MqgLZXjn2D/lgDvYglJeDTI0EvnIuoPZTUruKW8xrmqvHojG/5\n' +
        'Oi2XnorseUDUxytICqZRac0Pqh+b7GMTg8ttG8gowA4AyUOMG6KNliGhABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4eafAQLCQcICRCGEDC4tnEnkAMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAB/Vwf/fBz0RTjYzWwA\n' +
        'J/yU9IhUqVJlc9/mP4fKPNgT9UTmlpquu7MWc3VqNCJmXAmeVjw5mlqf7Aic\n' +
        'JTQ/cHKu2LQ4ZTRY+Mvq2DEzuPmqfyhYt8w6F3VY3Vz4w4yKv2sSliHr7PVD\n' +
        'b0OAz9WiavJYIKigwPKA3wRITCLAeda7WGXyYxFPfZ7xt5Tv9t3bl8SCsZB5\n' +
        'V4CwwmPryOJHtffhxApoFs8cCGxY/9B5tX481q1QAyBJ1fp3HAwW8V8iNs7A\n' +
        'AgkHRVyanhLRGQ/pQJd6yvXAfSFkRNjO1be22xZIIzQ3VGjlCUABUVjHm8Xn\n' +
        'CjvPD7t4IwWWV1GIrHhp9dZSqVwIks7ATQRjh5p8AQgAuGT25MVW+nkvXRaS\n' +
        'rCiKPhCYoJEb8NUCoCP+Lmp/LPNn1NJ+6jtOepQ+ipesmGrbtNSCA6/9vFwo\n' +
        't7MRK2yPXrwTAevcvnDxDSAdkkjvbjhEmA0NALLv6NtUbxQOkdfdItcVDOG5\n' +
        'D0VgpkdeF1V5YbMJSzopQCFKxIiJ4nmY+/jyOQedqaHvLwKN7QfXrPpn2sr2\n' +
        's/mKjWwHNuHyKTYlVkA4LsIzvPb5ApDXau93DdmENumD3FcjF4zUFnZjz0ci\n' +
        'ZnQGp+ncnnX05m02qyDaUiEHXLYpMZdaFMQ+6pkSUoDGIS9o46Nlzh75w9c+\n' +
        'Kpz5TGkLrWbmJgey0Z5gV9sl5QARAQABwsB2BBgBCAAqBQJjh5p8CRCGEDC4\n' +
        'tnEnkAIbDBYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAClzAf/ZEuta8nVlB9n\n' +
        'eWLw7uKFU0jbxZBZ+hfF67j5RIwrZHAQDFu3WFrzhDr+wgOWQTt8c7L1C4iv\n' +
        '5GWBpoTLHUCdfEnQyfUWkKTWFwXqMpst5AmR4oSrRWYMUNH5Pw1u5xTOseyS\n' +
        'fpJGEW09bJ+bSots8NOgSjon8q00i90H77pwMYa6xEct4Rf6MleabFWpYymG\n' +
        'XjzHW7ImoybP6DJQ2ciD7O6EBjfrUmGRm76D6rvu6zqypaZLasYlwcFwvGfb\n' +
        'Pkr3HA7hSvRCAZ96gkCXKSmnSq394aZswEgG9ztdkZAGbdbsgA3SSiSqizTA\n' +
        'auQEzIjcvPdpGZaYmkp4Vm6H42ZKaA==\n' +
        '=cVEH\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBIXICMRiG4Xe/WRNRA8eoqOMCHATTSGxsfSwymL1DT7FuBWeJpPanIjMM037PM719f90JDqcLUSuJV+TaidblTCTMhJkwm7fblSjzKNdO1EpiJNfOyHa7EgkzYSbMZn5pJRHl2oly7TyjlcSIMBNmwmzOtRO1kvhLuXYiYSbMhNncSuI/tZKIhJkwE2bTcb+784RWEiO5dp4hzISZMJvX5Ux0OF2IWklEH++fjGzlSpRrJ1qXM5EwE2bCbDrud3cGWkm8ItfOiDATZsLsB4vIMrfRE1WNAAAAAElFTkSuQmCC'
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHm1MBCAC4lZZapY6Xy3uK6HbnfDhPZOPAKr9nWhU0klj/ySH4+2Xb\n' +
        'Ieqni5KH9+ez/5YVNmwAFX4CExbekZSpSd8EkgLX9gl2/R+y3u2sam88Msgv\n' +
        'ODxfROCvIhkAxViyoCMq4Tm71QVzfgvnLOaglGKMxCoJguMBnwNxHo3iG7V5\n' +
        'TeXB6iUorT4qp1kgrwhMNNY+n5ZYMgSvP7g8rNA3KTHYdUGPXQWzb3d/G3cv\n' +
        'L5hErgXbXQpoutkgBapHOIKkEDYn3iB9ORwvOb8phIXG6ISkxTmS+2em9CNB\n' +
        '/ackJJiBfqrLiPfBELyiV+QJARdpi75cOiGhtsNh8DnQ3bjw7YNzcIBJABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4ebUwQLCQcICRBaJmgmByp5FQMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBJC23yBJT2d/pTAID1omaCYHKnkVAACDpAf/XZk5LXsxtAqr\n' +
        '18CSlzLQlAB970oydJuzQ4DGSD+dSMoZsSOlFxZvA06tbXcjM3hfkuFaKzdb\n' +
        'Ida4YOIvnw1cJ8bTLYmxEtiLtIjfTjCGri3yZ5tiPGaEo4/IaUvs1VbeN8VQ\n' +
        '4d2hCUoXLzQPavMllVqM1fJkLlCE3FHJvSRTIMwm5Y8Ok4RY9b84oesQeOkU\n' +
        'P2BneUhE0/iIllKtqMnykEOm46LK0ITzlvSWAFC2cQ74uG0M27LN3kan+tSm\n' +
        'bEsCYLskHQZwzriv8l/JETJP+ZoMJRmp8SFbRVn8tkVCuA8wI73n3X7DbAu0\n' +
        'hfrYZknhotvoai0W61oq81Afatu/A87ATQRjh5tTAQgAk2Q+HkNdLZ0UDWCm\n' +
        'DxrXV7iB7HBybf0i7oaB2aQnhkBqqIlC9jlwll7Y982hsWbdiNJR2jH2hWwo\n' +
        'DPBV8IAlAT2FCb0E1LW0ts9lr5+SLulx/S7UGNpGzNOsvTT8R/CmlfiqJozC\n' +
        'ySHDU6FrLz+s2MTdW0yHt6XDnL8DN3CIUfHOUSjuMNnq34ZsD4Yf6sLmuYN7\n' +
        'UfJpg0j7+24c7+WmWHrO+SSlKc+8rTZT3s1vV+B/vTv0H+1StU001YlxeTnb\n' +
        'sbkbdXii22dNxmvvwLhZ67Zu4Vg1RMyhLi4SajIJPUR/oKeXfcb3WLpkrJNg\n' +
        'iirZ+RirDOHdSM0ak65l6IRNAwARAQABwsB2BBgBCAAqBQJjh5tTCRBaJmgm\n' +
        'Byp5FQIbDBYhBJC23yBJT2d/pTAID1omaCYHKnkVAAB5VQgAt5JaM/LCNRY4\n' +
        'ix8BMS2X/HgW0I2tJDQbvitbbVBRVAjh6wBqUVGC40JoI1bKz49JWiMqrg6u\n' +
        'L6rDD6Ou2UchvqPtczAS+oWBQSRPwh/dOZJ15EFgu0m2ofNKp+i19Ik5X+QV\n' +
        'tbk7hX9+HOIkK8lk1syJl7+G02egK5EVr6oMKWrMuCbkqNMphIQY0airPNi9\n' +
        'keLYrbp7Pt4SlLxLzIP6jejQX9lJj+nA9nHxTfBRMLxq3sUgCsVr3AzkN5VB\n' +
        '5gEeYBAdGVF0pl7DASVXLSrGAm7Q508OyJa1F2VFZT9ZIvEo2ES7YVZx2tkE\n' +
        '0t5jFnfbm8KdXhWBwO1xZc7ctRadGg==\n' +
        '=CgF7\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR4AcXBsWkDQRCG0W9/FEygIsxFakThgbcMs/UsLmOdKVAjCl3GRFqng4OFQ6B5r2z7fRJ0r0TNBtHzUVjRZRJ1r0TNBpFIJpKJZGXb75MDuldWmg2OEMlEMpHsxD/dK1GzQdRscET3StRsEIlkIplIdupeeafulUgkE8lEslOzwUr3yiuaDVZEMpFMJCu363kSNBusdK+sNBusdK9EIplIJpKVbb9PFrpXXtFssCKSiWQiWbldz5Pg6/eHSJdJ1L2y0mwQPR+F6Pvjk0gkE8lEsj8InjfLsCXbSAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      publicKey: '',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2ElEQVR4AcXBsYnEMBRF0TsPJSpgsklVg2sxOLKbUAlqQhMMAtfiGlSCC3A4m342EBiW/ec80uvzxdhbxVqnE+t9PBlZpxPrfTyx5mXDEs6EM+Es7K3yn/ZWsYQz4Uw4C/OyYe2tYl0pY83c1CrWvGxYwplwJpyF2AvWyljshZErZax1OrFiL1jCmXAmnAVuulLmLwlnwplwFvjlShlrbxVrXjZG9lax5pSxYi9YwplwJpwFboq9MHQ8uUM4E86Es0d6fb4YsRdGrpQZib0wcqWMJZwJZ8LZDzUmMp+amfSXAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: "0x8Afa8FDf9fB545C8412499E8532C958086608b30",
  numberOfERC20: 20,
  contractAddressNFT: "0x42af3147f17239341477113484752D5D3dda997B",
  numberOfNFTTokens: 2,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJj+WS9CZCGEDC4tnEnkBYhBOsVjR1d6YVXhTJwoYYQMLi2\n' +
    'cSeQAAAlAwf9EWPoXHOaq6r+nURbhjGfIhr6QszaQDGS5p+hGHOrwqNT569J\n' +
    'tHf7g0GZ2XEmQ7iH8DzCE29urrAh3LrtcUvKtk/mRSUBZ8OBm9EfYLyS6OIV\n' +
    'tuq7pZiX961K7Z4UtnQ1RG/ksypWmfHGf3Ut5tZoWcmZ9KazIeepUKzy3InF\n' +
    'hAi7vZzwUgLHe6UKViflR+umyAsvfgx6zYDvWoAUvKwLZYx4GJnYUjLETTuP\n' +
    'kCmf7wNwAsyANk29IDiFxMvxRXnF9axuRGPfpAfxS2Hz8aDuh6P2IFmU1Ekb\n' +
    'ZjXBpZN8LnidDCW3BtddDPUmE9+PlGLyy/VHm+J5isA1rwuSOuzC1A==\n' +
    '=MFXs\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  groupName: 'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  isPublic: true,
  groupCreator: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  chatId: '0364908cbaef95a5a3124c394ada868177c158a4d677cedd6fd1e42db1852386',
  rules: {
    'entry': {
      'conditions': [
        {
          'any': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'holder',
              'data': {
                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            },
            {
              "type": "PUSH",
              "category": 'CustomEndpoint',
              "subcategory": "GET"
              "data": {
                "url": "https://api.example.com/users/{{user_address}}/checkAccess",
              }
	          }
          ]
        }
      ]
    },
    'chat': {
      'conditions': [
        {
          'all': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'holder',
              'data': {
                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'anyRole',
              'data': {
                'guildId': '13468'
              }
            }
          ]
        }
      ]
    }
  }
}


```

</details>

---

### **To check user access of a token gated group**

```typescript

// actual api
const response = await PushAPI.chat.getGroupAccess({
  chatId:'8f7be0068a677df166c2e5b8a9030fe8a4341807150339e588853c0049df3106',
  did: '0x9e60c47edF21fa5e5Af33347680B3971F2FfD464'
  env: 'staging',
});
```

Allowed Options (params with \_ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| chatId | string | - | group address |
| did | string | - | user address |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (group access)</b></summary>

```typescript
// PushAPI_chat_getGroupAccess | Response - 200 OK
{
    'entry': true,
    'chat': false,
    'rules': {
        'entry': {
            'conditions': [
                {
                    'any': [
                        {
                            'type': 'PUSH',
                            'category': 'ERC20',
                            'subcategory': 'holder',
                            'data': {
                                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                                'amount': 1000,
                                'decimals': 18
                            },
                            'access': false
                        },
                        {
                            'type': 'GUILD',
                            'category': 'guildRoles',
                            'subcategory': 'specificRole',
                            'data': {
                                'guildId': '13468',
                                'guildRoleId': '19924'
                            },
                            'access': true
                        },
                        {
                            'type': 'PUSH',
                            'category': 'ERC721',
                            'subcategory': 'owner',
                            'data': {
                                'contract': 'eip155:5:0x42af3147f17239341477113484752D5D3dda997B',
                                'amount': 1
                            },
                            'access': true
                        }
                    ]
                }
            ]
        },
        'chat': {
            'conditions': [
                {
                    'all': [
                        {
                            'type': 'PUSH',
                            'category': 'ERC20',
                            'subcategory': 'holder',
                            'data': {
                                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                                'amount': 1000,
                                'decimals': 18
                            },
                            'access': false
                        },
                        {
                            'type': 'GUILD',
                            'category': 'guildRoles',
                            'subcategory': 'specificRole',
                            'data': {
                                'guildId': '13468',
                                'guildRoleId': '19924'
                            },
                            'access': true
                        }
                    ]
                }
            ]
        }
    }
}

```

</details>

---

### **To update group details**

Note - updateGroup is an idompotent call

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.updateGroup({
    chatId: '870cbb20f0b116d5e461a154dc723dc1485976e97f61a673259698aa7f48371c',
    groupName: 'Push Group Chat 3',
    groupDescription: 'This is the oficial group for Push Protocol',
    members: ['0x2e60c47edF21fa5e5A333347680B3971F1FfD456','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    groupImage: &lt;group image link&gt; ,
    admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
    env: 'staging',
    pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

### **To update token gated group details**

Note - updateGroup is an idompotent call

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// actual api
const response = await PushAPI.chat.updateGroup({
    chatId: '870cbb20f0b116d5e461a154dc723dc1485976e97f61a673259698aa7f48371c',
    groupName: 'Push Group Chat 3',
    groupDescription: 'This is the oficial group for Push Protocol',
    members: ['0x2e60c47edF21fa5e5A333347680B3971F1FfD456','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    groupImage: &lt;group image link&gt; ,
    admins: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
    rules: {
    'entry': {
      'conditions': [
        {
          'any': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'holder',
              'data': {
                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guidlRoleId': '19924'
              }
            }
          ]
        }
      ]
    },
    'chat': {
      'conditions': [
        {
          'all': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'holder',
              'data': {
                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            }
          ]
        }
      ]
    }
   },
    account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
    env: 'staging',
    pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| chatId_ | string | - | chatId of the group |
| account* | string | - | user address |
| groupName* | string | - | group name |
| groupDescription* | string | - | group description |
| groupImage* | string | - | group image link |
| members* | Array<string> | - | wallet addresses of all members except admins and groupCreator |
| admins* | Array<string> | - | wallet addresses of all admins except members and groupCreator |
| contractAddressERC20 (deprecated) | string | null | ERC20 Contract Address |
| numberOfERC20 (deprecated) | int | 0 | Minimum number of tokens required to join the group |
| contractAddressNFT (deprecated) | string | null | NFT Contract Address |
| numberOfNFTTokens (deprecated) | int | 0 | Minimum number of nfts required to join the group |
| rules | Rules | - | conditions for group and chat access (see format below) |
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

### **To get group details by group name**

```typescript
const response = await PushAPI.chat.getGroupByName({
  groupName: 'Push Group Chat 3',
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| groupName_ | string | - | name of the group |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (get group by name)</b></summary>

```typescript
// PushAPI_chat_getGroupByName | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHmnwBCACaJgURQRJ4uP9St06i8nw9betHTTCvSvvWTkqJQvsnT1oh\n' +
        'm1fV+wv5q7i3uQQqJV1Ip8hSC5YOANnjQM+5CxXi5g8k3se5joMawDCkC/MP\n' +
        'fwidmsVPEZwKmLPf4ZDMJqmzAscfyLgHVnT7sG23LQD8pTVQkgsWRReA8cTJ\n' +
        'pof6YgGF9YxQGvgTyBZGA9ocswXUdtgm5qHhaQL0+FxnniZCN7HIMJ5XKMBQ\n' +
        'GlMik23wL4MqgLZXjn2D/lgDvYglJeDTI0EvnIuoPZTUruKW8xrmqvHojG/5\n' +
        'Oi2XnorseUDUxytICqZRac0Pqh+b7GMTg8ttG8gowA4AyUOMG6KNliGhABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4eafAQLCQcICRCGEDC4tnEnkAMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAB/Vwf/fBz0RTjYzWwA\n' +
        'J/yU9IhUqVJlc9/mP4fKPNgT9UTmlpquu7MWc3VqNCJmXAmeVjw5mlqf7Aic\n' +
        'JTQ/cHKu2LQ4ZTRY+Mvq2DEzuPmqfyhYt8w6F3VY3Vz4w4yKv2sSliHr7PVD\n' +
        'b0OAz9WiavJYIKigwPKA3wRITCLAeda7WGXyYxFPfZ7xt5Tv9t3bl8SCsZB5\n' +
        'V4CwwmPryOJHtffhxApoFs8cCGxY/9B5tX481q1QAyBJ1fp3HAwW8V8iNs7A\n' +
        'AgkHRVyanhLRGQ/pQJd6yvXAfSFkRNjO1be22xZIIzQ3VGjlCUABUVjHm8Xn\n' +
        'CjvPD7t4IwWWV1GIrHhp9dZSqVwIks7ATQRjh5p8AQgAuGT25MVW+nkvXRaS\n' +
        'rCiKPhCYoJEb8NUCoCP+Lmp/LPNn1NJ+6jtOepQ+ipesmGrbtNSCA6/9vFwo\n' +
        't7MRK2yPXrwTAevcvnDxDSAdkkjvbjhEmA0NALLv6NtUbxQOkdfdItcVDOG5\n' +
        'D0VgpkdeF1V5YbMJSzopQCFKxIiJ4nmY+/jyOQedqaHvLwKN7QfXrPpn2sr2\n' +
        's/mKjWwHNuHyKTYlVkA4LsIzvPb5ApDXau93DdmENumD3FcjF4zUFnZjz0ci\n' +
        'ZnQGp+ncnnX05m02qyDaUiEHXLYpMZdaFMQ+6pkSUoDGIS9o46Nlzh75w9c+\n' +
        'Kpz5TGkLrWbmJgey0Z5gV9sl5QARAQABwsB2BBgBCAAqBQJjh5p8CRCGEDC4\n' +
        'tnEnkAIbDBYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAClzAf/ZEuta8nVlB9n\n' +
        'eWLw7uKFU0jbxZBZ+hfF67j5RIwrZHAQDFu3WFrzhDr+wgOWQTt8c7L1C4iv\n' +
        '5GWBpoTLHUCdfEnQyfUWkKTWFwXqMpst5AmR4oSrRWYMUNH5Pw1u5xTOseyS\n' +
        'fpJGEW09bJ+bSots8NOgSjon8q00i90H77pwMYa6xEct4Rf6MleabFWpYymG\n' +
        'XjzHW7ImoybP6DJQ2ciD7O6EBjfrUmGRm76D6rvu6zqypaZLasYlwcFwvGfb\n' +
        'Pkr3HA7hSvRCAZ96gkCXKSmnSq394aZswEgG9ztdkZAGbdbsgA3SSiSqizTA\n' +
        'auQEzIjcvPdpGZaYmkp4Vm6H42ZKaA==\n' +
        '=cVEH\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBIXICMRiG4Xe/WRNRA8eoqOMCHATTSGxsfSwymL1DT7FuBWeJpPanIjMM037PM719f90JDqcLUSuJV+TaidblTCTMhJkwm7fblSjzKNdO1EpiJNfOyHa7EgkzYSbMZn5pJRHl2oly7TyjlcSIMBNmwmzOtRO1kvhLuXYiYSbMhNncSuI/tZKIhJkwE2bTcb+784RWEiO5dp4hzISZMJvX5Ux0OF2IWklEH++fjGzlSpRrJ1qXM5EwE2bCbDrud3cGWkm8ItfOiDATZsLsB4vIMrfRE1WNAAAAAElFTkSuQmCC'
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHm1MBCAC4lZZapY6Xy3uK6HbnfDhPZOPAKr9nWhU0klj/ySH4+2Xb\n' +
        'Ieqni5KH9+ez/5YVNmwAFX4CExbekZSpSd8EkgLX9gl2/R+y3u2sam88Msgv\n' +
        'ODxfROCvIhkAxViyoCMq4Tm71QVzfgvnLOaglGKMxCoJguMBnwNxHo3iG7V5\n' +
        'TeXB6iUorT4qp1kgrwhMNNY+n5ZYMgSvP7g8rNA3KTHYdUGPXQWzb3d/G3cv\n' +
        'L5hErgXbXQpoutkgBapHOIKkEDYn3iB9ORwvOb8phIXG6ISkxTmS+2em9CNB\n' +
        '/ackJJiBfqrLiPfBELyiV+QJARdpi75cOiGhtsNh8DnQ3bjw7YNzcIBJABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4ebUwQLCQcICRBaJmgmByp5FQMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBJC23yBJT2d/pTAID1omaCYHKnkVAACDpAf/XZk5LXsxtAqr\n' +
        '18CSlzLQlAB970oydJuzQ4DGSD+dSMoZsSOlFxZvA06tbXcjM3hfkuFaKzdb\n' +
        'Ida4YOIvnw1cJ8bTLYmxEtiLtIjfTjCGri3yZ5tiPGaEo4/IaUvs1VbeN8VQ\n' +
        '4d2hCUoXLzQPavMllVqM1fJkLlCE3FHJvSRTIMwm5Y8Ok4RY9b84oesQeOkU\n' +
        'P2BneUhE0/iIllKtqMnykEOm46LK0ITzlvSWAFC2cQ74uG0M27LN3kan+tSm\n' +
        'bEsCYLskHQZwzriv8l/JETJP+ZoMJRmp8SFbRVn8tkVCuA8wI73n3X7DbAu0\n' +
        'hfrYZknhotvoai0W61oq81Afatu/A87ATQRjh5tTAQgAk2Q+HkNdLZ0UDWCm\n' +
        'DxrXV7iB7HBybf0i7oaB2aQnhkBqqIlC9jlwll7Y982hsWbdiNJR2jH2hWwo\n' +
        'DPBV8IAlAT2FCb0E1LW0ts9lr5+SLulx/S7UGNpGzNOsvTT8R/CmlfiqJozC\n' +
        'ySHDU6FrLz+s2MTdW0yHt6XDnL8DN3CIUfHOUSjuMNnq34ZsD4Yf6sLmuYN7\n' +
        'UfJpg0j7+24c7+WmWHrO+SSlKc+8rTZT3s1vV+B/vTv0H+1StU001YlxeTnb\n' +
        'sbkbdXii22dNxmvvwLhZ67Zu4Vg1RMyhLi4SajIJPUR/oKeXfcb3WLpkrJNg\n' +
        'iirZ+RirDOHdSM0ak65l6IRNAwARAQABwsB2BBgBCAAqBQJjh5tTCRBaJmgm\n' +
        'Byp5FQIbDBYhBJC23yBJT2d/pTAID1omaCYHKnkVAAB5VQgAt5JaM/LCNRY4\n' +
        'ix8BMS2X/HgW0I2tJDQbvitbbVBRVAjh6wBqUVGC40JoI1bKz49JWiMqrg6u\n' +
        'L6rDD6Ou2UchvqPtczAS+oWBQSRPwh/dOZJ15EFgu0m2ofNKp+i19Ik5X+QV\n' +
        'tbk7hX9+HOIkK8lk1syJl7+G02egK5EVr6oMKWrMuCbkqNMphIQY0airPNi9\n' +
        'keLYrbp7Pt4SlLxLzIP6jejQX9lJj+nA9nHxTfBRMLxq3sUgCsVr3AzkN5VB\n' +
        '5gEeYBAdGVF0pl7DASVXLSrGAm7Q508OyJa1F2VFZT9ZIvEo2ES7YVZx2tkE\n' +
        '0t5jFnfbm8KdXhWBwO1xZc7ctRadGg==\n' +
        '=CgF7\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR4AcXBsWkDQRCG0W9/FEygIsxFakThgbcMs/UsLmOdKVAjCl3GRFqng4OFQ6B5r2z7fRJ0r0TNBtHzUVjRZRJ1r0TNBpFIJpKJZGXb75MDuldWmg2OEMlEMpHsxD/dK1GzQdRscET3StRsEIlkIplIdupeeafulUgkE8lEslOzwUr3yiuaDVZEMpFMJCu363kSNBusdK+sNBusdK9EIplIJpKVbb9PFrpXXtFssCKSiWQiWbldz5Pg6/eHSJdJ1L2y0mwQPR+F6Pvjk0gkE8lEsj8InjfLsCXbSAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      publicKey: '',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2ElEQVR4AcXBsYnEMBRF0TsPJSpgsklVg2sxOLKbUAlqQhMMAtfiGlSCC3A4m342EBiW/ec80uvzxdhbxVqnE+t9PBlZpxPrfTyx5mXDEs6EM+Es7K3yn/ZWsYQz4Uw4C/OyYe2tYl0pY83c1CrWvGxYwplwJpyF2AvWyljshZErZax1OrFiL1jCmXAmnAVuulLmLwlnwplwFvjlShlrbxVrXjZG9lax5pSxYi9YwplwJpwFboq9MHQ8uUM4E86Es0d6fb4YsRdGrpQZib0wcqWMJZwJZ8LZDzUmMp+amfSXAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: "0x8Afa8FDf9fB545C8412499E8532C958086608b30",
  numberOfERC20: 20,
  contractAddressNFT: "0x42af3147f17239341477113484752D5D3dda997B",
  numberOfNFTTokens: 2,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJj+WlwCZCGEDC4tnEnkBYhBOsVjR1d6YVXhTJwoYYQMLi2\n' +
    'cSeQAABUjgf+LdMzlxCCZcmXSNuW2XRQtaefXwCaRzWcD2U20AGlECMCMIkx\n' +
    '3gvytlkqaLnApAQuUZoPubCV/N1tZyAPk6oY61xIBEeYfIm6sEec2it054Pp\n' +
    'eue3KxOZNn0TB8Ww0MoGhvKFyZ0FRPuQCDFk7BLPilx/C2vl2i4nrlVVCD+1\n' +
    'gA9/bNabvD9DqHkzaEL1W7OdYB98QmeSrjM2ewkRQv3W7FwNqlP6LhbR6hHV\n' +
    'oT7/jTkRiTQ+4CwNTnhmFS70aOuCaKSmo28K3TVRdxqjX/TInA0hwuABiSFn\n' +
    'IT3GrK/thmGpF9+Cyy4lhyJQS5XxaFyIIvpVndJd2xRydYcjCYgaoQ==\n' +
    '=/7cW\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'https://uploads-ssl.webflow.com/61bf814c420d049df2225c5a/634fd263f7785f51dcb79f9d_b22fe859ab3d28c370d97c4ab3d4464b1a634c8b.png',
  groupName: 'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  isPublic: true,
  groupCreator: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  chatId: '870cbb20f0b116d5e461a154dc723dc1485976e97f61a673259698aa7f48371c',
  rules: {
    'entry': {
      'conditions': [
        {
          'any': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'holder',
              'data': {
                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            }
          ]
        }
      ]
    },
    'chat': {
      'conditions': [
        {
          'all': [
            {
              'type': 'PUSH',
              'category': 'ERC20',
              'subcategory': 'holder',
              'data': {
                'contract': 'eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
                'amount': 1000,
                'decimals': 18
              }
            },
            {
              'type': 'GUILD',
              'category': 'guildRoles',
              'subcategory': 'specificRole',
              'data': {
                'guildId': '13468',
                'guildRoleId': '19924'
              }
            }
          ]
        }
      ]
    }
  }
}

```

</details>

---

### **To get group details by chatId**

```typescript
const response = await PushAPI.chat.getGroup({
  chatId: '190591e84108cdf12e62eecabf02ddb123ea92f1c06fb98ee9b5cf3871f46fa9',
  env: 'staging',
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| chatId_ | string | - | group chat id |
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (get group by chat id)</b></summary>

```typescript
// PushAPI_chat_getGroup | Response - 200 OK
{
  members: [
    {
      wallet: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHmnwBCACaJgURQRJ4uP9St06i8nw9betHTTCvSvvWTkqJQvsnT1oh\n' +
        'm1fV+wv5q7i3uQQqJV1Ip8hSC5YOANnjQM+5CxXi5g8k3se5joMawDCkC/MP\n' +
        'fwidmsVPEZwKmLPf4ZDMJqmzAscfyLgHVnT7sG23LQD8pTVQkgsWRReA8cTJ\n' +
        'pof6YgGF9YxQGvgTyBZGA9ocswXUdtgm5qHhaQL0+FxnniZCN7HIMJ5XKMBQ\n' +
        'GlMik23wL4MqgLZXjn2D/lgDvYglJeDTI0EvnIuoPZTUruKW8xrmqvHojG/5\n' +
        'Oi2XnorseUDUxytICqZRac0Pqh+b7GMTg8ttG8gowA4AyUOMG6KNliGhABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4eafAQLCQcICRCGEDC4tnEnkAMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAB/Vwf/fBz0RTjYzWwA\n' +
        'J/yU9IhUqVJlc9/mP4fKPNgT9UTmlpquu7MWc3VqNCJmXAmeVjw5mlqf7Aic\n' +
        'JTQ/cHKu2LQ4ZTRY+Mvq2DEzuPmqfyhYt8w6F3VY3Vz4w4yKv2sSliHr7PVD\n' +
        'b0OAz9WiavJYIKigwPKA3wRITCLAeda7WGXyYxFPfZ7xt5Tv9t3bl8SCsZB5\n' +
        'V4CwwmPryOJHtffhxApoFs8cCGxY/9B5tX481q1QAyBJ1fp3HAwW8V8iNs7A\n' +
        'AgkHRVyanhLRGQ/pQJd6yvXAfSFkRNjO1be22xZIIzQ3VGjlCUABUVjHm8Xn\n' +
        'CjvPD7t4IwWWV1GIrHhp9dZSqVwIks7ATQRjh5p8AQgAuGT25MVW+nkvXRaS\n' +
        'rCiKPhCYoJEb8NUCoCP+Lmp/LPNn1NJ+6jtOepQ+ipesmGrbtNSCA6/9vFwo\n' +
        't7MRK2yPXrwTAevcvnDxDSAdkkjvbjhEmA0NALLv6NtUbxQOkdfdItcVDOG5\n' +
        'D0VgpkdeF1V5YbMJSzopQCFKxIiJ4nmY+/jyOQedqaHvLwKN7QfXrPpn2sr2\n' +
        's/mKjWwHNuHyKTYlVkA4LsIzvPb5ApDXau93DdmENumD3FcjF4zUFnZjz0ci\n' +
        'ZnQGp+ncnnX05m02qyDaUiEHXLYpMZdaFMQ+6pkSUoDGIS9o46Nlzh75w9c+\n' +
        'Kpz5TGkLrWbmJgey0Z5gV9sl5QARAQABwsB2BBgBCAAqBQJjh5p8CRCGEDC4\n' +
        'tnEnkAIbDBYhBOsVjR1d6YVXhTJwoYYQMLi2cSeQAAClzAf/ZEuta8nVlB9n\n' +
        'eWLw7uKFU0jbxZBZ+hfF67j5RIwrZHAQDFu3WFrzhDr+wgOWQTt8c7L1C4iv\n' +
        '5GWBpoTLHUCdfEnQyfUWkKTWFwXqMpst5AmR4oSrRWYMUNH5Pw1u5xTOseyS\n' +
        'fpJGEW09bJ+bSots8NOgSjon8q00i90H77pwMYa6xEct4Rf6MleabFWpYymG\n' +
        'XjzHW7ImoybP6DJQ2ciD7O6EBjfrUmGRm76D6rvu6zqypaZLasYlwcFwvGfb\n' +
        'Pkr3HA7hSvRCAZ96gkCXKSmnSq394aZswEgG9ztdkZAGbdbsgA3SSiSqizTA\n' +
        'auQEzIjcvPdpGZaYmkp4Vm6H42ZKaA==\n' +
        '=cVEH\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: true,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1UlEQVR4AcXBIXICMRiG4Xe/WRNRA8eoqOMCHATTSGxsfSwymL1DT7FuBWeJpPanIjMM037PM719f90JDqcLUSuJV+TaidblTCTMhJkwm7fblSjzKNdO1EpiJNfOyHa7EgkzYSbMZn5pJRHl2oly7TyjlcSIMBNmwmzOtRO1kvhLuXYiYSbMhNncSuI/tZKIhJkwE2bTcb+784RWEiO5dp4hzISZMJvX5Ux0OF2IWklEH++fjGzlSpRrJ1qXM5EwE2bCbDrud3cGWkm8ItfOiDATZsLsB4vIMrfRE1WNAAAAAElFTkSuQmCC'
    }
  ],
  pendingMembers: [
    {
      wallet: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
      publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        '\n' +
        'xsBNBGOHm1MBCAC4lZZapY6Xy3uK6HbnfDhPZOPAKr9nWhU0klj/ySH4+2Xb\n' +
        'Ieqni5KH9+ez/5YVNmwAFX4CExbekZSpSd8EkgLX9gl2/R+y3u2sam88Msgv\n' +
        'ODxfROCvIhkAxViyoCMq4Tm71QVzfgvnLOaglGKMxCoJguMBnwNxHo3iG7V5\n' +
        'TeXB6iUorT4qp1kgrwhMNNY+n5ZYMgSvP7g8rNA3KTHYdUGPXQWzb3d/G3cv\n' +
        'L5hErgXbXQpoutkgBapHOIKkEDYn3iB9ORwvOb8phIXG6ISkxTmS+2em9CNB\n' +
        '/ackJJiBfqrLiPfBELyiV+QJARdpi75cOiGhtsNh8DnQ3bjw7YNzcIBJABEB\n' +
        'AAHNAMLAigQQAQgAPgUCY4ebUwQLCQcICRBaJmgmByp5FQMVCAoEFgACAQIZ\n' +
        'AQIbAwIeARYhBJC23yBJT2d/pTAID1omaCYHKnkVAACDpAf/XZk5LXsxtAqr\n' +
        '18CSlzLQlAB970oydJuzQ4DGSD+dSMoZsSOlFxZvA06tbXcjM3hfkuFaKzdb\n' +
        'Ida4YOIvnw1cJ8bTLYmxEtiLtIjfTjCGri3yZ5tiPGaEo4/IaUvs1VbeN8VQ\n' +
        '4d2hCUoXLzQPavMllVqM1fJkLlCE3FHJvSRTIMwm5Y8Ok4RY9b84oesQeOkU\n' +
        'P2BneUhE0/iIllKtqMnykEOm46LK0ITzlvSWAFC2cQ74uG0M27LN3kan+tSm\n' +
        'bEsCYLskHQZwzriv8l/JETJP+ZoMJRmp8SFbRVn8tkVCuA8wI73n3X7DbAu0\n' +
        'hfrYZknhotvoai0W61oq81Afatu/A87ATQRjh5tTAQgAk2Q+HkNdLZ0UDWCm\n' +
        'DxrXV7iB7HBybf0i7oaB2aQnhkBqqIlC9jlwll7Y982hsWbdiNJR2jH2hWwo\n' +
        'DPBV8IAlAT2FCb0E1LW0ts9lr5+SLulx/S7UGNpGzNOsvTT8R/CmlfiqJozC\n' +
        'ySHDU6FrLz+s2MTdW0yHt6XDnL8DN3CIUfHOUSjuMNnq34ZsD4Yf6sLmuYN7\n' +
        'UfJpg0j7+24c7+WmWHrO+SSlKc+8rTZT3s1vV+B/vTv0H+1StU001YlxeTnb\n' +
        'sbkbdXii22dNxmvvwLhZ67Zu4Vg1RMyhLi4SajIJPUR/oKeXfcb3WLpkrJNg\n' +
        'iirZ+RirDOHdSM0ak65l6IRNAwARAQABwsB2BBgBCAAqBQJjh5tTCRBaJmgm\n' +
        'Byp5FQIbDBYhBJC23yBJT2d/pTAID1omaCYHKnkVAAB5VQgAt5JaM/LCNRY4\n' +
        'ix8BMS2X/HgW0I2tJDQbvitbbVBRVAjh6wBqUVGC40JoI1bKz49JWiMqrg6u\n' +
        'L6rDD6Ou2UchvqPtczAS+oWBQSRPwh/dOZJ15EFgu0m2ofNKp+i19Ik5X+QV\n' +
        'tbk7hX9+HOIkK8lk1syJl7+G02egK5EVr6oMKWrMuCbkqNMphIQY0airPNi9\n' +
        'keLYrbp7Pt4SlLxLzIP6jejQX9lJj+nA9nHxTfBRMLxq3sUgCsVr3AzkN5VB\n' +
        '5gEeYBAdGVF0pl7DASVXLSrGAm7Q508OyJa1F2VFZT9ZIvEo2ES7YVZx2tkE\n' +
        '0t5jFnfbm8KdXhWBwO1xZc7ctRadGg==\n' +
        '=CgF7\n' +
        '-----END PGP PUBLIC KEY BLOCK-----\n',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR4AcXBsWkDQRCG0W9/FEygIsxFakThgbcMs/UsLmOdKVAjCl3GRFqng4OFQ6B5r2z7fRJ0r0TNBtHzUVjRZRJ1r0TNBpFIJpKJZGXb75MDuldWmg2OEMlEMpHsxD/dK1GzQdRscET3StRsEIlkIplIdupeeafulUgkE8lEslOzwUr3yiuaDVZEMpFMJCu363kSNBusdK+sNBusdK9EIplIJpKVbb9PFrpXXtFssCKSiWQiWbldz5Pg6/eHSJdJ1L2y0mwQPR+F6Pvjk0gkE8lEsj8InjfLsCXbSAAAAABJRU5ErkJggg=='
    },
    {
      wallet: 'eip155:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      publicKey: '',
      isAdmin: false,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2ElEQVR4AcXBsYnEMBRF0TsPJSpgsklVg2sxOLKbUAlqQhMMAtfiGlSCC3A4m342EBiW/ec80uvzxdhbxVqnE+t9PBlZpxPrfTyx5mXDEs6EM+Es7K3yn/ZWsYQz4Uw4C/OyYe2tYl0pY83c1CrWvGxYwplwJpyF2AvWyljshZErZax1OrFiL1jCmXAmnAVuulLmLwlnwplwFvjlShlrbxVrXjZG9lax5pSxYi9YwplwJpwFboq9MHQ8uUM4E86Es0d6fb4YsRdGrpQZib0wcqWMJZwJZ8LZDzUmMp+amfSXAAAAAElFTkSuQmCC'
    }
  ],
  contractAddressERC20: null,
  numberOfERC20: 0,
  contractAddressNFT: null,
  numberOfNFTTokens: 0,
  verificationProof: 'pgp:-----BEGIN PGP SIGNATURE-----\n' +
    '\n' +
    'wsBzBAEBCAAnBYJj+WlwCZCGEDC4tnEnkBYhBOsVjR1d6YVXhTJwoYYQMLi2\n' +
    'cSeQAABUjgf+LdMzlxCCZcmXSNuW2XRQtaefXwCaRzWcD2U20AGlECMCMIkx\n' +
    '3gvytlkqaLnApAQuUZoPubCV/N1tZyAPk6oY61xIBEeYfIm6sEec2it054Pp\n' +
    'eue3KxOZNn0TB8Ww0MoGhvKFyZ0FRPuQCDFk7BLPilx/C2vl2i4nrlVVCD+1\n' +
    'gA9/bNabvD9DqHkzaEL1W7OdYB98QmeSrjM2ewkRQv3W7FwNqlP6LhbR6hHV\n' +
    'oT7/jTkRiTQ+4CwNTnhmFS70aOuCaKSmo28K3TVRdxqjX/TInA0hwuABiSFn\n' +
    'IT3GrK/thmGpF9+Cyy4lhyJQS5XxaFyIIvpVndJd2xRydYcjCYgaoQ==\n' +
    '=/7cW\n' +
    '-----END PGP SIGNATURE-----\n',
  groupImage: 'https://uploads-ssl.webflow.com/61bf814c420d049df2225c5a/634fd263f7785f51dcb79f9d_b22fe859ab3d28c370d97c4ab3d4464b1a634c8b.png',
  groupName: 'Push Group Chat 3',
  groupDescription: 'This is the oficial group for Push Protocol',
  isPublic: true,
  groupCreator: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
  chatId: '870cbb20f0b116d5e461a154dc723dc1485976e97f61a673259698aa7f48371c'
}
```

</details>

---

### **Chat Helper Utils**

#### **Decrypting messages**

```typescript
// pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user
const user = await PushAPI.user.get(account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7', env: 'staging');

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey(encryptedPGPPrivateKey: user.encryptedPrivateKey, signer: _signer);

// get threadhash, this will fetch the latest conversation hash
// you can also use older conversation hash (called link) by iterating over to fetch more historical messages
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  conversationId: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d', // receiver's address or chatId of a group
  env: 'staging'
});

// chat history but with decrypt helper so everything is encrypted
const encryptedChats = await PushAPI.chat.history({
  threadhash: conversationHash.threadHash,
  account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
  limit: 2,
  toDecrypt: false,
  pgpPrivateKey: pgpDecryptedPvtKey,
  env: 'staging',
});

// actual api
const decryptedChat = await PushAPI.chat.decryptConversation({
  messages: encryptedChats, // array of message object fetched from chat.history method
  connectedUser: user, // user meta data object fetched from chat.get method
  pgpPrivateKey: pgpDecrpyptedPvtKey, //decrypted private key
  env: _env,
});
```

Allowed Options (params with _ are mandatory)
| Param | Type | Default | Remarks |
|----------|---------|---------|--------------------------------------------|
| messages_ | string | - | array of message object fetched from chat.history method |
| connectedUser\* | IUser | false | user meta data object|
| pgpPrivateKey | string | null | mandatory for users having pgp keys|
| env | string | 'prod' | API env - 'prod', 'staging', 'dev'|

<details>
  <summary><b>Expected response (decrypt conversation)</b></summary>

```typescript
// PushAPI_chat_decryptConversation | Response - 200 OK
// Helper method, incase you don't want to decrypt from api itself
[
  {
    link: 'bafyreibfikschwlfi275hr7lrfqgj73mf6absailazh4sm5fwihspy2ky4',
    toDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    encType: 'pgp',
    fromDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    sigType: 'pgp',
    toCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    signature:
      '-----BEGIN PGP SIGNATURE-----\n' +
      '\n' +
      'wsBzBAEBCAAnBQJjh5tjCRBaJmgmByp5FRYhBJC23yBJT2d/pTAID1omaCYH\n' +
      'KnkVAAAZmwf/buPLw6caSZmYnw6D3/p6HF1kWlkGUOTP4RasaU/6dkeDaZs9\n' +
      'SJlz2wC8oOpBGWHMJ/5n3ZWmU71E6U7IKIY793MyIv5t32vTNkwsRHUX7IIn\n' +
      'QFF+FzTIEtHHVTRlnkqNR2YUk1kqcpZCZWHfahi5W2d/WkXlFNdvyyFH4W8L\n' +
      'd03FGhOyXbWwU3xicBz5mSBpIFaaSCXl1SdgJDPXLSk3b65EEOjCOaiz85xC\n' +
      'G+6SW4RUzCGSDcOd9F2EXvvY5H9LgQNi1jjlZn6JrPTPJTJ+wXZXzcZmtOXG\n' +
      'EKcwvPbbPY9wd+gavRSOgYLYn5xoZQW/o3hW7AQlbC5Kj6js48Z0HQ==\n' +
      '=qLiJ\n' +
      '-----END PGP SIGNATURE-----\n',
    timestamp: 1669831523684,
    fromCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    messageType: 'Text',
    messageContent: 'Hi',
    encryptedSecret:
      '-----BEGIN PGP MESSAGE-----\n' +
      '\n' +
      'wcBMA1fn1CNqxQ7nAQgArlo75qe54WerfRKFv1+F9j4NRMvSTgUztvIe51eg\n' +
      'd5MVuj6RYxKERr2bTuBt5cMDJMlNuTnBBkPe4L8+SlsI46L9wmXV9xLoZq1a\n' +
      '94JdxD98RGMF99Jde/3hC/X6GS1yVqPpKPKdWx/tkOPeyqeO/wFF7kqShgIi\n' +
      'Wgq6hGz1fzD3GZhKGY0VSLuC3s0aUy/qw5En1Xd0uX0jdXBl07IIj8p1G2zx\n' +
      '9BuVlksSK34yvIc0RQfCeRadMHkxbA0Hyj31Wrr+Y310YLTppL0s5bQR9APL\n' +
      'WHsIztJ1fHTnXsPhnA7YG0SQpHTyJhuX3rgBjxGrvbZBArmZ+R/Pq9IkOkJe\n' +
      'z8HATAMOsbaZjGN5JwEH/jYjLN6AFRWeaB5CSBSAF+CvHsUgadGmxTdSHBM6\n' +
      'LM9rfGg/MCnpRBuHckA0NNZh+wepq6TDA54ZopsdP14gHj4MKCdfqZr86Jft\n' +
      'ldtjeSgPTFEEJxPMJ4/Z3UeFU9rvOgfxX6l0eHWS0MYwJ3sVYvSyqqHir1K5\n' +
      'TRdEIgtQ3NvLTKkX4bKTSU+SInrvDA+wsc2BcBsbgNhRiGb+XYrbqXBshL1a\n' +
      'lIdpnomkAQgOZMO2n347uURYoruH3OtFeNABJ9D/nEU+LdhDOPGZPefvPBc5\n' +
      'BxK4ExKZ2Wo/TZw8lgC53uqOljsGV63Hp71LkyesKWu5/+vdVrYx/vU63shh\n' +
      'x/TSQAEiaFYEfkWSOthtH0nrJHhkY7FWgjp/1bj/J4J9HCQrVtt2WlQfhowZ\n' +
      'ILxhKk/vep0sJviM3SfJ4hPtoYpZESc=\n' +
      '=43Ta\n' +
      '-----END PGP MESSAGE-----\n',
  },
  {
    link: null,
    toDID: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    encType: 'PlainText',
    fromDID: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    sigType: '',
    toCAIP10: 'eip155:0x0F1AAC847B5720DDf01BFa07B7a8Ee641690816d',
    signature: '',
    timestamp: 1669831499724,
    fromCAIP10: 'eip155:0xb340E384FC4549591bc7994b0f90074753dEC72a',
    messageType: 'Text',
    messageContent: 'Hey Fabio!',
    encryptedSecret: '',
  },
];
```

</details>

---
