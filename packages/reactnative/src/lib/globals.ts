export default {
    LINKS: {
      APPBOT_NAME: 'App Bot',
      APP_WEBSITE: 'https://epns.io',
      DEV_EPNS_SERVER: 'https://backend-kovan.epns.io/apis',
      PROD_EPNS_SERVER: 'https://backend-kovan.epns.io/apis',
      METAMASK_LINK_STAGING: 'https://metamask.app.link/dapp/staging-app.epns.io',
      METAMASK_LINK_PROD: 'https://metamask.app.link/dapp/staging-app.epns.io',
      DEEPLINK_URL: 'https://metamask.app.link/dapp/staging-app.epns.io',
      CNS_ENDPOINT:
        'https://unstoppabledomains.com/api/v1/resellers/udtesting/domains',
  
      ENDPOINT_AUTHTOKEN: '/pushtokens/authtoken',
      ENDPOINT_REGISTER_NO_AUTH: '/pushtokens/register_no_auth',
      ENDPOINT_REGISTER: '/pushtokens/register',
      ENDPOINT_GET_FEEDS: '/feeds/get_feeds',
      ENDPOINT_GET_SPAM_FEEDS: '/feeds/get_spam_feeds',
      ENDPOINT_FETCH_CHANNELS: '/channels/fetch_channels',
      ENDPOINT_FETCH_SUBSCRIPTION: '/channels/is_user_subscribed',
      ENDPOINT_SUBSCRIBE_OFFCHAIN: '/channels/subscribe_offchain',
      ENDPOINT_UNSUBSCRIBE_OFFCHAIN: '/channels/unsubscribe_offchain',
    },
  
    // For Async Storage --> Represents Key and some Constants
    STORAGE: {
      IS_SIGNED_IN: 'IsUserSignedIn',
      SIGNED_IN_TYPE: 'SignedInType',
      FIRST_SIGN_IN: 'FirstSignInByUser',
      USER_LOCKED: 'UserLocked',
      PASSCODE_ATTEMPTS: 'MaxPasscodeAttempts',
  
      STORED_WALLET_OBJ: 'StoredWalletObject',
      ENCRYPTED_PKEY: 'EncryptedPrivateKey',
  
      HASHED_PASSCODE: 'HashedPasscode',
  
      PUSH_TOKEN: 'PushToken',
      PUSH_TOKEN_TO_REMOVE: 'PushTokenToRemove',
      PUSH_TOKEN_SERVER_SYNCED: 'PushTokenServerSynced',
      PUSH_BADGE_COUNT: 'PushBadgeCount',
      PUSH_BADGE_COUNT_PREVIOUS: 'PreviousPushBadgeCount',
    },
  
    CONSTANTS: {
      CRED_TYPE_WALLET: 'TypeWallet',
      CRED_TYPE_PRIVATE_KEY: 'TypePrivateKey',
  
      NULL_EXCEPTION: 'NULL',
  
      MAX_PASSCODE_ATTEMPTS: 5,
  
      PUSH_TYPE_NORMAL_MSG: 1,
      PUSH_TYPE_ENCRYPTED_MSG: 2,
  
      FEED_ITEMS_TO_PULL: 20,
  
      STATUS_BAR_HEIGHT: 60,
    },
  
    ADJUSTMENTS: {
      SCREEN_GAP_HORIZONTAL: 10,
      SCREEN_GAP_VERTICAL: 10,
  
      DEFAULT_BIG_RADIUS: 10,
      DEFAULT_MID_RADIUS: 8,
      FEED_ITEM_RADIUS: 8,
    },
  
    COLORS: {
      PRIMARY: 'rgba(27.0, 150.0, 227.0, 1.0)',
  
      LINKS: 'rgba(20.0, 126.0, 251.0, 1.0)',
  
      GRADIENT_PRIMARY: 'rgba(226.0, 8.0, 128.0, 1.0)',
      GRADIENT_SECONDARY: 'rgba(53.0, 197.0, 243.0, 1.0)',
      GRADIENT_THIRD: 'rgba(103.0, 76.0, 159.0, 1.0)',
  
      TRANSPARENT: 'transparent',
  
      WHITE: 'rgba(255.0, 255.0, 255.0, 1.0)',
      DARK_WHITE: 'rgba(255.0, 255.0, 255.0, 0.75)',
      MID_WHITE: 'rgba(255.0, 255.0, 255.0, 0.5)',
      LIGHT_WHITE: 'rgba(255.0, 255.0, 255.0, 0.25)',
  
      SLIGHTER_GRAY: 'rgba(250.0, 250.0, 250.0, 1)',
      SLIGHT_GRAY: 'rgba(231.0, 231.0, 231.0, 1)',
      LIGHT_GRAY: 'rgba(225.0, 225.0, 225.0, 1)',
      MID_GRAY: 'rgba(200.0, 200.0, 200.0, 1)',
      DARK_GRAY: 'rgba(160.0, 160.0, 160.0, 1)',
      DARKER_GRAY: 'rgba(100.0, 100.0, 100.0, 1)',
  
      LIGHT_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.1)',
      SEMI_MID_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.25)',
      MID_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.5)',
      DARK_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.75)',
      BLACK: 'rgba(0.0, 0.0, 0.0, 1.0)',
  
      CONFIRM_GREEN: 'rgba(50.0, 205.0, 50.0, 1.0)',
  
      CONFIRM: 'rgba(34.0, 139.0, 34.0, 1.0)',
      WARNING: 'rgba(255.0, 153.0, 0.0, 1.0)',
  
      SUBLIME_RED: 'rgba(237.0, 59.0, 72.0, 1.0)',
      BADGE_RED: 'rgba(208.0, 44.0, 30.0, 1.0)',
      LIGHT_MAROON: 'rgba(159.0, 0.0, 0.0, 1.0)',
      LIGHTER_MAROON: 'rgba(129.0, 0.0, 0.0, 1.0)',
    },
    SCREENS: {
      WELCOME: 'Welcome',
      SIGNIN: 'SignIn',
      SIGNINADVANCE: 'SignInAdvance',
      BIOMETRIC: 'Biometric',
      PUSHNOTIFY: 'PushNotify',
      SETUPCOMPLETE: 'SetupComplete',
      TABS: 'Tabs',
      SETTINGS: 'Settings',
      SPLASH: 'Splash',
      FEED: 'Feed',
      CHANNELS: 'Channels',
      SPAM: 'Spam',
      SAMPLEFEED: 'SampleFeed',
      NEWWALLETSIGNIN: 'NewWalletSignIn',
    },
    APP_AUTH_STATES: {
      INITIALIZING: 1,
      ONBOARDING: 2,
      ONBOARDED: 3,
      AUTHENTICATED: 4,
    },
    AUTH_STATE: {
      INITIALIZING: 'INITIALIZING',
      ONBOARDING: 'ONBOARDING',
      ONBOARDED: 'ONBOARDED',
      AUTHENTICATED: 'AUTHENTICATED',
    },
  };
  