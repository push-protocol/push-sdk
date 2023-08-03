import React, { useContext, useEffect, useState } from 'react';
import { ChatAndNotificationWidget, IMessageIPFS, PUSH_TABS } from '@pushprotocol/uiweb';
import { EnvContext, Web3Context } from './context';
import * as PushAPI from '@pushprotocol/restapi';
import { IUser } from '@pushprotocol/restapi';
import { MessageBubble } from '@pushprotocol/uiweb';

export const ChatWidgetTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const librarySigner = library.getSigner();
  const [pvtKey, setPvtKey] = useState<string>('');
  const { env } = useContext<any>(EnvContext);

  useEffect(() => {
    (async () => {
      const user = await PushAPI.user.get({ account: account, env });
      const pvtkey = null;
      if (user?.encryptedPrivateKey) {
        const response = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: (user as IUser).encryptedPrivateKey,
          account: account,
          signer: librarySigner,
          env,
          toUpgrade: true,
        });
        setPvtKey(response);
      }
    })();
  }, [account, env]);
  const onClose = () => {
    console.log('in here widget');
  };

  const ImsgObject: IMessageIPFS = {
    "fromCAIP10": "eip155:0x45F5EDf14EF0C42FC99164c236afc571a6dcB81C",
    "toCAIP10": "eip155:0x83d4c16b15F7BBA501Ca1057364a1F502d1c34D5",
    "fromDID": "eip155:0x45F5EDf14EF0C42FC99164c236afc571a6dcB81C",
    "toDID": "eip155:0x83d4c16b15F7BBA501Ca1057364a1F502d1c34D5",
    // "messageObj": "U2FsdGVkX1/JsBNKCHHStEj2Z2EsUD8ApyQipFcWsqDnaivZg0gEepbc2Bvf6eXT",
    "messageContent": "Yooo Boi",
    "messageType": "Text",
    "timestamp": 1690871453962,
    "encType": "pgp",
    "encryptedSecret": "-----BEGIN PGP MESSAGE-----\n\nwcBMA6Um75H3iYJmAQgAsUtS5Fisa9zxw0zZRKGrMplktDjmbai7NSqn/S4c\nqHHkfVmfhkhskyG8SF1aaRSObBEr1H5WnnJyhhrKCAO6TKLiyXnpF/V3xmVT\n0XyR4wFffldFVC2KD5mpQR3XkDWA1a49VP/B4wIal5IZGKlpU/OswNF67cEl\nLwffkY18PfhIfUETwt+jU9gOFRYc9mWAClJA60R699q5bx6huDSfRe2YRNgI\n/cCNzJ3QZpup43P9Y8SlV17NIH/rzntiqKQRHQ8HbHL5FHe5QJw6/AhcBwcl\np+tQTIwL8hW8dEkFb2+eP3ceTXv79eL33LZkPxjQojGOVO7uZpD67cnrso7A\nK8HATAMj6lYp8T/mrAEH/1mF+egNBDhA5tZRGmMvFeX+Tj/uKT1+7OZbsn+H\nup44q228P4hLXawcH2F42CxJcdyJVmJe4wp2QrwB1mnR4zAGd64PKbLPKhep\nMZZ9xI6Fs2jKi5jslt6zCr9BzOjc4mnkP539HQCfOdMmwPBecVS71LHtwtVC\nGeAzf5srltY8RDubbD3Zb3CdryyE4U6BJX2GqYuZ4rBwkQa4avR1LSVg5Mv1\nQaH3Eo04XHRf59gFZsWlB7G2F+tNPchysOtbkTPmqKuuAivd4MCSuvSeILm6\nAqcEp8EqiBWqjw9Pvm+zQBU7eY9gjlqqv+zL2vGNRgSzDOshfCC2QKazfVaM\nJdLSQAH2/4IEf/7XChh9OCjAhXezjEGmFYngIiPA/DWlJ3CQO7BTul9Sj9wc\nxICHBhS32jnUwBeDspqnh71GqvVd6lo=\n=WPiI\n-----END PGP MESSAGE-----\n",
    "signature": "-----BEGIN PGP SIGNATURE-----\n\nwsBzBAEBCAAnBYJkyKadCZD5DxzgQvFbyxYhBEEVOIDXLai5btMJhPkPHOBC\n8VvLAADZFgf/ekgyH2801dig0ksmHk8CDaF8Q4zXlRe1+nOpHLulzAH5TNox\n6bHE59oBkLgLjOs60CTV4cxr4NYcpBDXdLzK66NyYx/GfrKu5YEOYipNEztx\nwGUgpPkilyeXIFosbkaawfslILmHlMnxv776M09DVQuoxTPMvo5irMl9kLWR\nKZHmLu1EPoVZ92NWj0XRkgGZLsZckMdEyk0sSrpCLq20K8ohgsMAk3sFNsAY\nPz4iwitW3GEWGm01NDMzldCit3c09FqippW7q6E+KniYcDcEJKHfBLYHHzIJ\n/nBXcXSKzecBy1YUhBG32Uwyi/sErhE7z/ITGyN7UB3mIb/w5gWX2Q==\n=O88Q\n-----END PGP SIGNATURE-----\n",
    "sigType": "pgpv2",
    // "verificationProof": "pgpv2:-----BEGIN PGP SIGNATURE-----\n\nwsBzBAEBCAAnBYJkyKaeCZD5DxzgQvFbyxYhBEEVOIDXLai5btMJhPkPHOBC\n8VvLAABKHQf+JZan3VndkpYz2ED4GRVdxQYa5IonQjKsm9n0jirsqFaD1i/j\nLF+RGNKGbkejnqTRofL48UZcvBvhaqPERAdF6tCEHkxMp64C5NeUvkHAeWCN\n8O/aOj17BvhknisXiJ+lX9vL1GdZkQeec/FcKAccBG9EvUSzgw7IrGnBnxq3\n9End64mxqjRZAUzYPIB5jyfFT91loHfhmpYh/HKEfoisW5/4OnXb22GqHgjj\nKWK74Q37a/yf+dRjjXNUzCOqVP504K3lQNVkkb4DaAdwyNpUoc+3THImsJG4\ncrc6MUrUPMuiFrpTwCfMmnpY95FInSA2eYoT8Cl5Q9K0gsJ55Yp6Cw==\n=dL8p\n-----END PGP SIGNATURE-----\n",
    "link": "bafyreigdupvljqldbpbfqs32qz446wa3vynea74zr7dvigpcg4x4ylac5u",
    // "cid": "bafyreiakghfmhcymarfmvwvnsxaqtc5scyl64cwyydhnbcew4to7zzuaj4"
  }

  return (
    <>
      <MessageBubble account={account} chat={ImsgObject} />
      <ChatAndNotificationWidget
        account={account}
        env={env}
        decryptedPgpPvtKey={pvtKey}
        signer={librarySigner}
        // activeTab={PUSH_TABS.APP_NOTIFICATIONS}
        activeChat="0x3Cf13f6d91F50dca6eAD7356b78482c54CDd95ff"
      />
    </>
  );
};
