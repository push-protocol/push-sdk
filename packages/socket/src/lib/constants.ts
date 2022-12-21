export const ENV = {
  PROD: 'prod',
  STAGING: 'staging',
  DEV: 'dev'
};

export const EVENTS = {
  // Websocket
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  // Notification
  USER_FEEDS: 'userFeeds',
  USER_SPAM_FEEDS: 'userSpamFeeds',

  // Chat
  CHAT_SEND_MESSAGE: 'CHAT_SEND',
  CHAT_CREATE_INTENT: 'CREATE_INTENT',
  CHAT_UPDATE_INTENT: 'UPDATE_INTENT',
  CHAT_SEND_MESSAGE_ERROR: 'CHAT_ERROR',
  CHAT_RECEIVED_MESSAGE: 'CHATS'
};