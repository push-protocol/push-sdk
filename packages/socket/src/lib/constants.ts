export enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev',
  /**
   * **This is for local development only**
   */
  LOCAL = 'local',
}

export enum DEFAULT_CHAINS {
  PROD = 1, //ETH Mainnet
  STAGING = 11155111, //Sepolia Testnet
  DEV = 11155111,
  /**
   * **This is for local development only**
   */
  LOCAL = 11155111,
}

export const EVENTS = {
  // Websocket
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  // Notification
  USER_FEEDS: 'userFeeds',
  USER_SPAM_FEEDS: 'userSpamFeeds',

  // Chat
  CHAT_RECEIVED_MESSAGE: 'CHATS',
  CHAT_GROUPS: 'CHAT_GROUPS'
  
};