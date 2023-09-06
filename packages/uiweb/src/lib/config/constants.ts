import { PushSubTabs } from "../types";

export enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev',
  /**
   * **This is for local development only**
   */
  LOCAL = 'local',
}
export const Constants = {
  ENV,
  DEFAULT_TITLE: 'Chat with us!',
  DEFAULT_GREETING_MSG: 'Hi there!',
  DEFAULT_PROFILE_PICTURE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  
};

export const ALCHEMY_API_KEY = 'rtkd-a4JWpnViQBZdNCiFBGTJdp5e0R2';
export const RAINBOW_PROJECT_ID = 'e22146926e005c4e513b24024521ef51';
export const RAINBOW_APP_NAME = 'Push-sdk';
export const NETWORK_DETAILS = {
  5: {
    network: "goerli",
  }, 
  80001: {
    network: "polygon-mumbai",
  },
  1: {
    network: "mainnet",
  }, 
  137: {
    network: "polygon-mainnet",
  },
  97: {
  },
  420: {
  }
}

export const CoreContractChainId = {
  'prod' : 1,
  'dev' : 5,
  'staging' :  5,
  'local' :5
}

export const allowedNetworks = {
  'prod': [
    1, //for ethereum mainnet
    137, //for polygon mainnet
    56, // for bnb mainnet
    // 10 // for optimism mainnet
  ],
  'dev' : [
    5, // for eth goerli
    80001, //for mumbai polygon
    97, // bnb testnet
    420 // optimism goerli testnet
  ],
  'staging' :  [
    // 42, //for kovan
    5, // for goerli
    80001, //for mumbai polygon
    97 // bnb testnet
  ],
  'local' :[
    5, // for eth goerli
    80001, //for mumbai polygon
    97, // bnb testnet
    420 // optimism goerli testnet
  ]
}

export const blockNativeApikey = 'f55f3a76-8510-4af8-9833-b7f85255de83'

export const InfuraAPIKey = '150f25623ae64d08ab7ec7dd0c6b6ee9';

export const PUBLIC_GOOGLE_TOKEN = 'AIzaSyBhUBnCia6zpxY7KcqjghRS1IphinAvKXs';

export const ProfilePicture = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==`;


export const PushSubTabTitle = {
  REQUESTS: {
    title: 'Chat request',
  },
  SPAM: {
    title: 'Spam',
  }
};

export const chatLimit = 10;
export const requestLimit = 10;
export const notificationLimit = 5;

export const FILE_ICON = (extension: string) =>
  `https://cdn.jsdelivr.net/gh/napthedev/file-icons/file/${extension}.svg`;