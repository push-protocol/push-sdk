import { ISendNotificationInputOptions } from '@pushprotocol/restapi';
import { NOTIFICATION_TYPE } from '../../../src/lib/payloads';

export const TEST_PAYLOAD = {
  data: {
    acta: 'https://polygonscan.com/tx/0xb7a5b72c7476e3911d4d3688e160a977d89be5109cea8bb76a6402bdb9158e24',
    aimg: '',
    amsg: 'New [s: Trade Confirmation] on Quickswap. 80.77 [d: USDC] has been swapped for 100.00 [t: WMATIC] at a price of 1 [t: WMATIC] = 0.81 [d: USDC][timestamp: 1705579349]',
    asub: 'New Swap on Quickswap',
    type: '3'
  },
  recipients: '0x94051eE59A831E247590cE779DF065dd77EF5d0a',
  notification: {
    body: 'A New Swap has been made on Quickswap.',
    title: 'New Swap on Quickswap'
  }
};

export const TEST_NOCE = 'abcdEFG';

export const TARGETED_RECIPIENT = '0xD8634C39BBFd4033c0d3289C4515275102423681';
export const CHANNEL =
  'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681';

export const SUBSET_RECIPIENT = [
  '0xD8634C39BBFd4033c0d3289C4515275102423681',
  '0x69e666767Ba3a661369e1e2F572EdE7ADC926029'
];

export const TEST_ENC_RAW_PAYLOAD: ISendNotificationInputOptions = {
  senderType: 0,
  signer: '',
  type: NOTIFICATION_TYPE.TARGETTED,
  notification: {
    title: 'hey',
    body: 'hey'
  },
  payload: {
    sectype: 'PGPV1',
    title: 'hey',
    body: 'hey',
    cta: 'https://google.com',
    img: 'test-image.png',
    hidden: false,
    etime: 10000
  },
  channel: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
  identityType: 2
};

export const TEST_ENC_SUBSET_RAW_PAYLOAD: ISendNotificationInputOptions = {
  senderType: 0,
  signer: '',
  type: NOTIFICATION_TYPE.SUBSET,
  notification: {
    title: 'hey',
    body: 'hey'
  },
  payload: {
    sectype: 'PGPV1',
    title: 'hey',
    body: 'hey',
    cta: 'https://google.com',
    img: 'test-image.png',
    hidden: false,
    etime: 10000
  },
  channel: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
  identityType: 2
};


export const TEST_ENC_BROADCAST_RAW_PAYLOAD: ISendNotificationInputOptions = {
  senderType: 0,
  signer: '',
  type: NOTIFICATION_TYPE.BROADCAST,
  notification: {
    title: 'hey',
    body: 'hey'
  },
  payload: {
    sectype: 'PGPV1',
    title: 'hey',
    body: 'hey',
    cta: 'https://google.com',
    img: 'test-image.png',
    hidden: false,
    etime: 10000
  },
  channel: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
  identityType: 2
};

export const TEST_RAW_PAYLOAD: ISendNotificationInputOptions = {
  senderType: 0,
  signer: '',
  type: NOTIFICATION_TYPE.TARGETTED,
  notification: {
    title: 'hey',
    body: 'hey'
  },
  payload: {
    sectype: '',
    title: 'hey',
    body: 'hey',
    cta: 'https://google.com',
    img: 'test-image.png',
    hidden: false,
    etime: 10000
  },
  channel: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
  identityType: 2
};

export const TEST_PGP_ENCRYPTED_FEED = {
  cta: 'U2FsdGVkX19I6FQ5rIyjO9ZLakhkmIe1bJLRkB38apuOQaH54a2015aO7/0le8wO',
  title: 'U2FsdGVkX1/8+7EyDo2GlRhGUY6M4Y/D/ZzEKDOC/jQ=',
  message: 'U2FsdGVkX1+PXdFJia54450Hvt5ERyypXaje33jvh0U=',
  icon: 'https://gateway.ipfs.io/ipfs/bafybeib76bmkscu6efwawi2tkltdgthwrpny2ok7lur7nltffgydiq7ruy/QmVaY4HQaorrMhKo1sHk7FM1B8Xi1JnT3DvJbG9Xv7VeLZ',
  url: 'https://google.com',
  sid: '21',
  app: 'Updated Name',
  image: 'U2FsdGVkX186wYlg3QbHuDP0twQnH/x31SO0wiPzsm8=',
  blockchain: 'ETH_TEST_SEPOLIA',
  notification: {
    body: 'U2FsdGVkX1/o822n472meDdT+BB/P+ao6HjSGrfMwlA=',
    title: 'Updated Name has sent you a secret message!'
  },
  secret: 'PGPV1:-----BEGIN PGP MESSAGE-----\n' +
    '\n' +
    'wcBMAzEMrI2kRcMnAQf/dKg7wgescOy7nIu3ymNxf0FpNnHsUc90jwVGaOjW\n' +
    'mZTGS/c4gFQ8hJKA6GMViDVsclld4Dph8BZQVXjzNb0JGq1dnTC6VWSVkhcm\n' +
    'o9qsrpblcJkCTEHfttHAI1/soLMl7A64OQKqM/CnipQL2QYm2M2MYy8+U0Tk\n' +
    'Yo81FIBINlJMsMBw8p713XvCR2t6rx/hoYHIZyWRcsoIUj9fr1ac2q2QUHqs\n' +
    'gppHxZIblVAB2VYmYiArG91Hms2lIjwADhYo3E1WNhTG7RBJkJDAJRSEEYCB\n' +
    'Z6Hc2oEm3p5xfmEN8KEbK/qNQo08KWUL4uh2V/nlDg+kkPydEG09L0ZjE4Hn\n' +
    'UtI7ATClmJN7Vt6V81CmcH58zToKidguomExfkzjEHzsF5qh6VSTXGCwosZu\n' +
    'Ht1wuJtDiZY6LArVKC1sEdQ=\n' +
    '=GmBl\n' +
    '-----END PGP MESSAGE-----\n'
}

export const TEST_PUBLIC_KEY = '0x042a31efbcf9fe374fb1b1afdbadb6b266ddec97418c69dd81500f352f178f4b7e934ae2750026eef206d3a5d43d866b9a46e68b1f6b4f32167c992955fc890748'
export const TEST_PRIVATE_KEY = '0x11c3093f770006c88df88f44f39d99bc89697ad72c3796556ca8a1c0675416a0'
export const TEST_PK_ENC_RECIPIENT = '0x5913760160d245d0C9A05a8a956012694281bEE3'